// "Why it matters" — the one piece of text on a find page that Tuned itself generates.
//
// THE EXCEPTION THIS IS, AND WHO MADE IT. The doctrine is that humans contribute attention, not
// content, and that Tuned is never a summariser (ops/NORTH_STAR.md). On 2026-11-09 the owner (Ji)
// decided that a find page may carry a 2–3 sentence "why it matters" written by an AI model, on
// three conditions this file and `itemPage` enforce together:
//
//   1. **Labelled as AI-written, visibly, every time.** The label is rendered by the page, not
//      stored inside the text, so no storage path can lose it (pages.ts `aiContextBlock`).
//   2. **The source link stays prominent.** The block sits under the "Open at <domain>" button,
//      never above it, and repeats the source link in its own footer.
//   3. **Nothing rather than filler.** If the model is unavailable, the input is too thin to say
//      anything specific, or the output fails any check below, NOTHING is stored and the page
//      renders no block at all. There is no fallback sentence, ever.
//
// GENERATED ONCE, AT PUBLISH TIME. The operator plane's publish route calls `generateItemContext`
// after the item row exists, inside `waitUntil` so the publisher's response is never held on a
// model. `INSERT OR IGNORE` on the item id makes it once-per-item: a replayed publish, or a later
// caller, cannot regenerate or overwrite a line a reader may already have seen.
//
// GROUNDED IN WHAT THE PUBLISHER READ. The model sees the title, the source's domain, and the text
// the publishing agent read (for @sportstech, the paper's abstract). That text is passed in the
// request and never stored or shown — the only thing kept is the generated note. A number in the
// output that does not appear in that input is treated as invented and the whole note is refused.

/** Workers AI, narrowed to the one call this file makes so tests can supply a fake. */
export interface AiRunner {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

/** The model the note is generated with. Stored alongside each note, so a later model change
 *  never re-labels an old note as the new model's work. */
export const CONTEXT_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

/** Below this much source text there is nothing specific to say, and anything the model wrote
 *  would be a paraphrase of the title — the filler condition 3 rules out. */
export const CONTEXT_MIN_SOURCE_CHARS = 200;
/** What the model is shown at most. An abstract fits; a full paper does not need to. */
export const CONTEXT_MAX_SOURCE_CHARS = 4000;
const NOTE_MIN_CHARS = 100;
const NOTE_MAX_CHARS = 600;
const MODEL_TIMEOUT_MS = 25_000;

let schemaReady: Promise<void> | null = null;

/** Additive and self-applying, the same pattern src/metrics.ts and src/operator.ts use, because no
 *  session holds D1 migration credentials. One row per item, ever. */
export function ensureContextTable(db: D1Database): Promise<void> {
  if (!schemaReady) {
    schemaReady = db
      .prepare(
        `CREATE TABLE IF NOT EXISTS item_ai_context (
           item_id INTEGER PRIMARY KEY,
           creator_id INTEGER NOT NULL,
           text TEXT NOT NULL,
           model TEXT NOT NULL,
           source_chars INTEGER NOT NULL DEFAULT 0,
           created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
         )`
      )
      .run()
      .then(() => undefined)
      .catch((err) => {
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

export interface ItemContext {
  text: string;
  model: string;
  created_at: string;
}

/** The stored note for one item, or null. Never throws: a missing table, a failed read or an
 *  absent row all render as no block, which is condition 3 applied to the read path. */
export async function itemContext(db: D1Database, itemId: number): Promise<ItemContext | null> {
  try {
    return await db
      .prepare("SELECT text, model, created_at FROM item_ai_context WHERE item_id = ?")
      .bind(itemId)
      .first<ItemContext>();
  } catch {
    return null;
  }
}

export interface ContextInput {
  title: string;
  domain: string;
  /** What the publishing agent read. Not stored, not shown. */
  sourceText: string;
}

const SYSTEM_PROMPT = [
  "You write a short 'why it matters' note that sits under a link on a public page.",
  "Readers are working teams: coaches, sports scientists, clubs and research labs.",
  "Write exactly 2 or 3 plain sentences saying why this source matters to such a team.",
  "Use ONLY facts stated in the provided text. Do not add numbers, names, findings or claims that are not in it.",
  "No preamble, no headings, no markdown, no links, no hype words, no first person.",
  "If the text does not support a specific, useful note, reply with exactly: NONE",
].join(" ");

/** Every number-like token, normalised so "1,200" and "1200" compare equal. */
function numbers(text: string): string[] {
  return (text.match(/\d+(?:[.,]\d+)*/g) ?? []).map((n) => n.replace(/,/g, ""));
}

function sentenceCount(text: string): number {
  return text.split(/(?<=[.!?])\s+(?=["'(A-Z0-9])/).filter((s) => s.trim() !== "").length;
}

/** The checks a model's reply must pass to be stored. Returns the cleaned note, or "" with the
 *  reason, so a refusal is always a reason and never an absence. Exported for tests. */
export function acceptNote(raw: unknown, input: ContextInput): { note: string; refused: string } {
  if (typeof raw !== "string") return { note: "", refused: "no text in model reply" };
  const note = raw
    .trim()
    .replace(/^["'“”]+|["'“”]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (note === "" || /^none\.?$/i.test(note)) return { note: "", refused: "model declined" };
  if (note.length < NOTE_MIN_CHARS) return { note: "", refused: "too short" };
  if (note.length > NOTE_MAX_CHARS) return { note: "", refused: "too long" };
  if (/https?:\/\/|www\./i.test(note)) return { note: "", refused: "contains a link" };
  if (/[*#`_]|^\s*[-•]/.test(note)) return { note: "", refused: "contains markup" };
  if (/\b(as an ai|i think|i believe|in summary|this summary)\b/i.test(note)) {
    return { note: "", refused: "preamble or first person" };
  }
  const n = sentenceCount(note);
  if (n < 2 || n > 3) return { note: "", refused: `${n} sentences` };
  // The grounding check. Cheap and blunt on purpose: a model that states a figure the source does
  // not contain has invented it, and an invented figure under a research link is the worst thing
  // this block could publish.
  const known = new Set(numbers(`${input.title} ${input.sourceText}`));
  const invented = numbers(note).filter((x) => !known.has(x));
  if (invented.length > 0) return { note: "", refused: `number not in source: ${invented[0]}` };
  return { note, refused: "" };
}

function replyText(out: unknown): unknown {
  if (out && typeof out === "object" && "response" in out) return (out as { response: unknown }).response;
  return out;
}

/** Generate and store the note for one item. Resolves to what happened, never throws. */
export async function generateItemContext(
  db: D1Database,
  ai: AiRunner | undefined,
  item: { id: number; creator_id: number },
  input: ContextInput
): Promise<{ stored: boolean; refused: string }> {
  try {
    if (!ai || typeof ai.run !== "function") return { stored: false, refused: "no model binding" };
    const sourceText = input.sourceText.trim().slice(0, CONTEXT_MAX_SOURCE_CHARS);
    if (sourceText.length < CONTEXT_MIN_SOURCE_CHARS) return { stored: false, refused: "source text too thin" };
    const grounded = { ...input, sourceText };
    let timer: ReturnType<typeof setTimeout> | null = null;
    const out = await Promise.race([
      ai.run(CONTEXT_MODEL, {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Title: ${input.title}\nSource: ${input.domain}\nText:\n${sourceText}`,
          },
        ],
        max_tokens: 220,
        temperature: 0.2,
      }),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("model timeout")), MODEL_TIMEOUT_MS);
      }),
    ]).finally(() => {
      if (timer !== null) clearTimeout(timer);
    });
    const { note, refused } = acceptNote(replyText(out), grounded);
    if (!note) return { stored: false, refused };
    await ensureContextTable(db);
    const res = await db
      .prepare(
        "INSERT OR IGNORE INTO item_ai_context (item_id, creator_id, text, model, source_chars) VALUES (?, ?, ?, ?, ?)"
      )
      .bind(item.id, item.creator_id, note, CONTEXT_MODEL, sourceText.length)
      .run();
    return { stored: (res.meta?.changes ?? 1) !== 0, refused: "" };
  } catch (err) {
    console.log(JSON.stringify({ level: "warn", message: "item context not generated", item_id: item.id, detail: String(err) }));
    return { stored: false, refused: "model error" };
  }
}
