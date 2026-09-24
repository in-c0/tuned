// Server-rendered HTML for the three surfaces: public feed, creator studio, landing.
// BRAND is a working title — rename in one place when the owner picks a real name.

export const BRAND = "Tuned";
export const TAGLINE = "follow attention, not content";

/** The one origin a crawler or an unfurler should name, out of the three that serve this Worker.
 *
 * `wrangler.jsonc` routes both `justtuned.com` and `www.justtuned.com` as custom domains and
 * leaves `workers_dev` on, so the identical document answers on three hosts. A canonical's whole
 * job is to say which of several equivalent URLs is the page, so it is fixed here rather than
 * derived from the request.
 *
 * This comment used to carve out an exception — *"`rssFeed` is passed the request origin, which is
 * right for a feed a client already holds the URL of"* — and that exception was the defect run 190
 * removed. It was true of the argument and false of the element it reached: `rssFeed` spent the
 * request origin on `<channel><link>`, which RSS 2.0 defines as *"the URL to the HTML website
 * corresponding to the channel"*. That is a canonical-class statement about where the site is, not
 * a URL the client already holds, and a directory copies it as the site's address. `rssFeed` no
 * longer takes an origin at all. */
export const SITE_ORIGIN = "https://justtuned.com";

export interface Creator {
  id: number;
  handle: string;
  name: string;
  bio: string;
  avatar_url: string;
  accent: string;
  token?: string;
  kind?: string; // human | agent
  charter?: string; // agent steering notes, editable from the Desk
  created_at: string;
}

export interface Item {
  id: number;
  creator_id: number;
  url: string;
  title: string;
  description: string;
  image_url: string;
  site_name: string;
  domain: string;
  kind: string;
  category: string;
  note: string;
  visibility: string;
  via_creator_id?: number | null; // provenance: starred from this agent's find
  via_handle?: string | null;     // joined for display ("via @scout")
  created_at: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Video: "#ff5d73",
  Posts: "#4cc9f0",
  Code: "#9b8cff",
  Research: "#ffd166",
  Music: "#06d6a0",
  Reading: "#f4a261",
  Misc: "#94a3b8",
};
export const CATEGORIES = Object.keys(CATEGORY_COLORS);

const KIND_ICON: Record<string, string> = {
  video: "▶",
  post: "◌",
  music: "♫",
  code: "{}",
  article: "¶",
  link: "→",
};

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Codepoints XML 1.0 forbids in a document, removed from the finished feed.
 *
 *  **`esc` cannot help here and no escape exists.** XML 1.0 §2.2 admits U+0009, U+000A, U+000D
 *  and U+0020 upward, and a forbidden codepoint is illegal *however it is written* — raw or as
 *  a numeric character reference. `&#11;` is exactly as fatal as a literal U+000B. Escaping is
 *  the wrong tool for this class and always was; removal is the only one.
 *
 *  **The blast radius is the document, not the item.** XML has no error recovery: a conforming
 *  parser that meets an illegal character stops, so one stray control character in one item's
 *  title, URL, category, note or description takes down **every item in that feed for every
 *  subscriber**. Confirmed against a real parser rather than argued from the spec — see
 *  `test/rss-wellformed.test.ts`, which grades the property here, and the `RSS is a parseable
 *  XML document` step in `verify-production.yml`, which grades the outcome on the live feed.
 *
 *  **Why the whole document, once, instead of per field.** Every field already runs through
 *  `esc`, so a per-field variant would have been the natural shape — and it would have been a
 *  list a run typed, silently incomplete the next time a field is added to `rssFeed`. This is
 *  the surface that is actually delivered, so it cannot be partially applied. L-100's shape.
 *
 *  **It is a no-op on every document this service has ever served.** These characters are
 *  non-printing; removing one changes no visible text and no rendered quotation, which is why
 *  removal is preferred to substitution — a replacement character would alter a line this feed
 *  publishes as verbatim.
 *
 *  **Where this can arrive from, none of it hypothetical.** Five routes write `items`, and not
 *  one sanitises: the operator plane that `agent scout` publishes through, the studio's two
 *  paste routes, `share-api`, and Spotify ingestion. The scout's own why-line is a verbatim
 *  quotation lifted from publisher-supplied full text, which is exactly the provenance this
 *  product is built on and exactly the kind of string that carries typesetting residue.
 *
 *  **Lone surrogates are deliberately not handled here**, and that is a measured decision, not
 *  an oversight: the Worker encodes the body with UTF-8, which substitutes U+FFFD for an
 *  unpaired surrogate before any byte reaches a reader, so the delivered document stays
 *  well-formed. `test/rss-wellformed.test.ts` pins that as an observation rather than a belief.
 *  U+FFFE and U+FFFF survive encoding and are forbidden, so those two are removed here. */
export function stripXmlForbidden(s: string): string {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "");
}

function catColor(category: string): string {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Misc;
}

const CSS = /* css */ `
:root {
  --bg: #0b0b10; --panel: #13131b; --panel2: #191925; --line: #23232f;
  --text: #eceaf4; --muted: #9a98ad; --faint: #6a6880;
  --accent: #7c6cff;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html { color-scheme: dark; }
body {
  background: var(--bg); color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5; -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
.wrap { max-width: 720px; margin: 0 auto; padding: 0 20px 96px; }

/* ---------- header ---------- */
.site-top { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; font-size: 13px; color: var(--faint); }
.site-top .wordmark { letter-spacing: 0.14em; text-transform: lowercase; font-weight: 600; }
.site-top .wordmark b { color: var(--accent); font-weight: 600; }

.creator-head { display: flex; gap: 18px; align-items: center; padding: 26px 0 8px; }
.avatar {
  width: 72px; height: 72px; border-radius: 50%; flex: none;
  background: linear-gradient(135deg, var(--accent), #2b2b3d);
  display: grid; place-items: center; font-size: 30px; font-weight: 700; color: #fff;
  overflow: hidden; border: 2px solid var(--line);
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.creator-head h1 { font-size: 26px; letter-spacing: -0.02em; }
.creator-head .handle { color: var(--faint); font-size: 14px; }
.creator-head .bio { color: var(--muted); font-size: 14px; margin-top: 4px; max-width: 46ch; }
.presence { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); margin-top: 6px; }
.presence .dot { width: 7px; height: 7px; border-radius: 50%; background: #3ddc84; box-shadow: 0 0 8px #3ddc84aa; }
.presence.idle .dot { background: var(--faint); box-shadow: none; }
.ai-badge {
  display: inline-block; vertical-align: middle; margin-left: 6px;
  font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700;
  color: #0b0b10; background: linear-gradient(90deg, #4cc9f0, #9b8cff);
  border-radius: 999px; padding: 3px 9px;
}

.head-actions { margin-left: auto; display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
.btn {
  border: 1px solid var(--line); background: var(--panel); color: var(--text);
  padding: 8px 16px; border-radius: 999px; font-size: 13px; cursor: pointer; font-weight: 600;
  transition: border-color .15s, background .15s;
}
.btn:hover { border-color: var(--accent); }
.btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.btn.small { padding: 4px 10px; font-size: 12px; font-weight: 500; }
.btn.danger:hover { border-color: #ff5d73; color: #ff5d73; }
.rss { font-size: 12px; color: var(--faint); }
.rss:hover { color: var(--muted); }

/* ---------- attention breakdown ---------- */
.week { margin: 26px 0 6px; }
.week .label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--faint); margin-bottom: 10px; }
.bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; background: var(--panel); }
.bar span { display: block; height: 100%; }
.legend { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.chip {
  display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted);
  border: 1px solid var(--line); border-radius: 999px; padding: 3px 10px; cursor: pointer; background: none;
  font-family: inherit;
}
.chip .swatch { width: 8px; height: 8px; border-radius: 2px; }
.chip.active { border-color: var(--accent); color: var(--text); background: var(--panel); }
.chip .n { color: var(--faint); }

/* ---------- feed ---------- */
.section-h { display: flex; align-items: baseline; gap: 10px; margin: 34px 0 14px; }
.section-h h2 { font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--faint); font-weight: 600; }
.section-h.now h2 { color: var(--accent); }
.section-h .rule { flex: 1; height: 1px; background: var(--line); }

.card {
  display: flex; gap: 14px; padding: 14px; margin-bottom: 10px;
  background: var(--panel); border: 1px solid var(--line); border-radius: 14px;
  transition: transform .12s ease, border-color .12s ease;
  position: relative;
}
a.card-link:hover .card { transform: translateY(-1px); border-color: #34344a; }
.thumb {
  width: 120px; height: 76px; flex: none; border-radius: 8px; overflow: hidden;
  background: var(--panel2); display: grid; place-items: center; color: var(--faint); font-size: 20px;
}
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.card .body { min-width: 0; flex: 1; }
.card .meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--faint); margin-bottom: 3px; }
.card .meta .cat { display: inline-flex; align-items: center; gap: 5px; }
.card .meta .cat i { width: 7px; height: 7px; border-radius: 2px; display: inline-block; }
.card .meta .via {
  font-size: 10.5px; color: #4cc9f0; border: 1px solid #24425a; border-radius: 999px;
  padding: 1px 7px; letter-spacing: .02em;
}
/* A meta row must never set the page's width, and until 2026-09-16 it could.
   It is a flex line, and a flex item does not shrink below its own min-content width unless it is
   told it may — so a row with one item too many, or one item too wide, pushes its line box past the
   card. The initial containing block grows to the widest line, and Chrome on a phone then zooms the
   WHOLE document out to fit. ".card .body"'s "min-width: 0" stops the body from doing this and
   cannot reach the spans inside it.
   Measured on production the day this was written, at 390px: "/" laid out at 405px and "/ava" at
   436px, with "via @wearables" past the right edge. qa/mobile-fit.spec.mjs explains why the two
   existing 390px overflow assertions read green throughout — the failure moves scrollWidth and
   innerWidth together, so comparing them to each other can never see it.
   Two rules, because there are two ways to be too wide and neither covers the other.
   WRAPPING handles a row with too many items, which is what production was actually doing: the
   chips that do not fit take a second line instead of pushing the row wider.
   A BREAK OPPORTUNITY handles one item that is itself wider than the card, which wrapping cannot
   help — a bare domain is a single unbreakable token, and the bare domain is what the source name
   falls back to when a page called itself nothing. "overflow-wrap: anywhere" rather than
   "text-overflow: ellipsis" on purpose: it lowers the span's min-content width, which is the
   property that lets a flex item shrink at all, and it does it by letting the name WRAP rather
   than by cutting characters off it. On a product whose subject is provenance, a source that
   reads "blog.engineering.longsub…" is a worse answer than one that takes two lines. The chips
   with fixed, short, meaningful contents keep their width and take a new line instead. */
.card .meta { flex-wrap: wrap; row-gap: 3px; }
.card .meta > span { min-width: 0; overflow-wrap: anywhere; }
.card .meta > .cat, .card .meta > .time, .card .meta > .via, .card .meta > img { flex: none; }
.card h3 { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.card .desc { font-size: 13px; color: var(--muted); margin-top: 3px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.card .note {
  margin-top: 8px; font-size: 13px; color: var(--text);
  border-left: 2px solid var(--accent); padding: 2px 0 2px 10px; font-style: italic;
}
.card.hidden-item { opacity: 0.45; }
.time { white-space: nowrap; }

/* ambient rollup (music etc.) */
.card.rollup { display: block; padding: 0; overflow: hidden; }
.card.rollup summary {
  display: flex; gap: 14px; align-items: center; padding: 14px; cursor: pointer; list-style: none;
}
.card.rollup summary::-webkit-details-marker { display: none; }
.card.rollup summary:hover { background: #16161f; }
.card.rollup .chev { color: var(--faint); font-size: 12px; transition: transform .15s; flex: none; }
.card.rollup[open] .chev { transform: rotate(180deg); }
.mosaic { width: 120px; height: 76px; flex: none; border-radius: 8px; overflow: hidden; background: var(--panel2); }
.mosaic img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mosaic.grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
.rollup-list { border-top: 1px solid var(--line); padding: 4px 0; }
.rollup-list a {
  display: flex; gap: 10px; align-items: baseline; padding: 7px 16px; font-size: 13px;
}
.rollup-list a:hover { background: #16161f; }
.rollup-list .t { color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* The artist is the person whose work was listened to, so it is never truncated: it is given a
 * break opportunity and wraps, on the same reasoning that kept a source's full name on a card.
 * white-space: nowrap made this span's min-content width its full text width, which is an
 * automatic minimum a flex item cannot shrink below — so a long name ran past the card, and
 * .card.rollup's own overflow: hidden cut it mid-word with no ellipsis to say so. Measured on
 * production 2026-09-16: 371.2px of name ending at 418.2px on a 390px phone, with the track
 * title beside it shrunk to 0px because it was the only item in the row that could give way. */
.rollup-list .a { color: var(--faint); font-size: 12px; margin-left: auto; min-width: 0; overflow-wrap: anywhere; text-align: right; }

.day-h { font-size: 12px; color: var(--faint); margin: 22px 0 10px; letter-spacing: 0.04em; }
.empty { color: var(--faint); font-size: 14px; padding: 30px 0; text-align: center; }

footer { margin-top: 60px; font-size: 12px; color: var(--faint); text-align: center; }
footer b { color: var(--muted); font-weight: 600; }

/* ---------- studio ---------- */
.paste-zone { margin: 24px 0; }
.paste-zone input[type=url] {
  width: 100%; padding: 16px 18px; font-size: 15px; border-radius: 14px;
  border: 1px dashed #34344a; background: var(--panel); color: var(--text); outline: none;
  font-family: inherit;
}
.paste-zone input[type=url]:focus { border-color: var(--accent); border-style: solid; }
.hint { font-size: 12px; color: var(--faint); margin-top: 8px; }
#preview { margin-top: 16px; display: none; }
#preview.show { display: block; }
.preview-controls { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; align-items: center; }
select, input[type=text], input[type=email] {
  background: var(--panel); border: 1px solid var(--line); color: var(--text);
  border-radius: 8px; padding: 7px 10px; font-size: 13px; font-family: inherit; outline: none;
}
input[type=text] { flex: 1; min-width: 160px; }
select:focus, input:focus { border-color: var(--accent); }
.item-actions { position: absolute; top: 10px; right: 10px; display: flex; gap: 6px; }
.status { font-size: 13px; color: var(--muted); min-height: 20px; margin-top: 8px; }
.status.err { color: #ff5d73; }

/* ---------- explainers ---------- */
.explain { display: flex; flex-direction: column; gap: 12px; }
.step { display: flex; gap: 12px; align-items: flex-start; font-size: 14px; color: var(--muted); }
.step b { color: var(--text); }
.step .n {
  flex: none; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center;
  background: var(--panel); border: 1px solid var(--line); color: var(--accent);
  font-size: 12px; font-weight: 700; margin-top: 1px;
}
.fine { font-size: 12.5px; color: var(--faint); margin-top: 4px; }
.prose { font-size: 14px; color: var(--muted); max-width: 56ch; }
.prose i { color: var(--text); font-style: italic; }

.intro-card {
  background: var(--panel); border: 1px solid var(--line); border-radius: 14px;
  padding: 16px 18px; margin: 18px 0 4px; font-size: 13.5px; color: var(--muted); position: relative;
}
.intro-card b { color: var(--text); }
.intro-card .dismiss { position: absolute; top: 10px; right: 12px; background: none; border: none; color: var(--faint); cursor: pointer; font-size: 14px; }
.intro-card ul { margin: 8px 0 0 18px; display: flex; flex-direction: column; gap: 5px; }

/* ---------- landing waitlist + demo ---------- */
.waitlist { display: flex; gap: 8px; margin-top: 22px; flex-wrap: wrap; }
.waitlist input[type=email] { flex: 1; min-width: 180px; padding: 10px 14px; }
.waitlist select { min-width: 170px; }
.demo-window {
  border: 1px solid var(--line); border-radius: 16px; padding: 14px 14px 10px;
  background: linear-gradient(180deg, #12121a, transparent);
}
.demo-window .card { margin-bottom: 8px; }
.demo-more { display: block; text-align: center; margin: 8px 0 4px; }

/* ---------- one find, permanently addressable ---------- */
.find-page { padding: 8px 0 0; }
.find-kicker { font-size: 13px; color: var(--muted); margin: 26px 0 10px; }
.find-kicker a { color: var(--text); text-decoration: underline; }
.find-page h1 { font-size: 26px; line-height: 1.25; letter-spacing: -0.02em; margin: 0 0 12px; }
.find-source { display: flex; align-items: center; gap: 7px; font-size: 13px; color: var(--muted); flex-wrap: wrap; }
/* The category swatch is scoped to ".card .meta" elsewhere; this row is neither, and without
   this rule the <i> collapses to nothing and the category reads as bare text.
   No backticks in here: CSS is a template literal, so one would open an interpolation. */
.find-source .cat { display: inline-flex; align-items: center; gap: 5px; }
.find-source .cat i { width: 7px; height: 7px; border-radius: 2px; display: inline-block; }
/* The same row one page over, carrying the same source name, with the same hazard. It already
   wraps, so it needs only the shrink floor: wrapping cannot rescue a single token wider than the
   page. No find page was over width on the day this shipped; this is the rule that keeps it that
   way when a source with a long bare domain is published. */
.find-source > span { min-width: 0; overflow-wrap: anywhere; }
.find-source > .cat, .find-source > img { flex: none; }
.find-desc { font-size: 14.5px; color: var(--muted); margin-top: 14px; max-width: 62ch; }
.find-note {
  border-left: 2px solid var(--accent); padding: 2px 0 2px 12px; margin-top: 16px;
  font-size: 14.5px; color: var(--text); max-width: 62ch;
}
.find-art { margin-top: 18px; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
.find-art img { display: block; width: 100%; height: auto; }
/* "Open at <domain> →" puts a bare domain inside a button, and a bare domain is one unbreakable
   token, so this box's min-content width is the domain's — 378px for the longest one measured,
   against 350px of page at 390px. Same hazard as the meta rows above, same remedy: give the token
   somewhere to break. Found by qa/mobile-fit.spec.mjs on a find page after the meta rows were
   already fixed, which is the argument for the check walking every surface rather than the one
   that was under suspicion. */
.open-cta { display: inline-block; margin-top: 20px; text-decoration: none; overflow-wrap: anywhere; }
.provenance {
  background: var(--panel); border: 1px solid var(--line); border-radius: 14px;
  padding: 14px 16px; margin: 26px 0 0; font-size: 13px; color: var(--muted);
}
.provenance h2 { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--faint); margin-bottom: 10px; }
.provenance ol { list-style: none; display: flex; flex-direction: column; gap: 7px; }
.provenance li { display: flex; gap: 9px; align-items: baseline; }
.provenance li i { color: var(--accent); font-style: normal; }
.provenance b { color: var(--text); }
.provenance .disclaim { margin-top: 11px; font-size: 12.5px; color: var(--faint); }
.more-finds { margin-top: 30px; }

/* ---------- share result / setup ---------- */
.share-result { padding: 40px 0; text-align: left; }
.share-result h1 { font-size: 24px; letter-spacing: -0.02em; margin: 10px 0 18px; }
.share-badge {
  width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center;
  background: var(--accent); color: #fff; font-size: 20px; font-weight: 700;
}
.share-badge.err { background: #ff5d73; }
.share-actions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
.endpoint {
  display: flex; gap: 10px; align-items: center; margin-top: 12px;
  background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px;
}
.endpoint code { font-size: 12px; color: var(--muted); overflow-wrap: anywhere; flex: 1; }

/* ---------- dialog ---------- */
dialog {
  background: var(--panel2); color: var(--text); border: 1px solid var(--line);
  border-radius: 16px; padding: 26px; max-width: 340px; width: 90%;
}
dialog::backdrop { background: #000a; backdrop-filter: blur(3px); }
dialog h3 { margin-bottom: 6px; }
dialog p { font-size: 13px; color: var(--muted); margin-bottom: 14px; }
dialog form { display: flex; gap: 8px; }
dialog input { flex: 1; min-width: 0; }
dialog .rss-cta { display: block; text-align: center; text-decoration: none; margin-bottom: 16px; }
dialog form button { white-space: nowrap; }
dialog .or { margin-bottom: 10px; }

@media (max-width: 540px) {
  .thumb { width: 84px; height: 60px; }
  .creator-head { flex-wrap: wrap; }
  .head-actions { margin-left: 0; flex-direction: row; }
}
`;

const CLIENT_JS = /* js */ `
// relative times
function rel(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  if (s < 86400 * 7) return Math.floor(s / 86400) + "d ago";
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
document.querySelectorAll(".time[data-t]").forEach(el => { el.textContent = rel(el.dataset.t); });

// presence
const p = document.querySelector(".presence[data-latest]");
if (p) {
  const h = (Date.now() - new Date(p.dataset.latest).getTime()) / 3600000;
  const t = p.querySelector(".ptext");
  if (h < 24) { t.textContent = "active " + rel(p.dataset.latest); }
  else { p.classList.add("idle"); t.textContent = "last active " + rel(p.dataset.latest); }
}

// category filter
document.querySelectorAll(".chip[data-cat]").forEach(chip => {
  chip.addEventListener("click", () => {
    const was = chip.classList.contains("active");
    document.querySelectorAll(".chip[data-cat]").forEach(c => c.classList.remove("active"));
    if (!was) chip.classList.add("active");
    const cat = was ? null : chip.dataset.cat;
    document.querySelectorAll("[data-item-cat]").forEach(el => {
      el.style.display = (!cat || el.dataset.itemCat === cat) ? "" : "none";
    });
  });
});

// follow dialog
const fbtn = document.getElementById("follow-btn");
if (fbtn) {
  // feed_render — the rung under everything below it, fired once on script execution and asking
  // nothing of the visitor. A feed view says a request arrived; this says a browser engine parsed
  // the document and ran it, which is what the scanners, uptime probes and preview fetchers that
  // make up an unknown share of feed_view do not do. Gated on the follow button rather than fired
  // unconditionally, because this script is also served to the studio page, which has no button
  // and is not a public surface; publicPage always renders one. That gate is deliberate twice
  // over: it makes feed_render the honest denominator for follow_open, which is gated on the same
  // element, so a page that stopped emitting one stops emitting both rather than skewing a ratio.
  fetch("/api/pulse/feed_render", { method: "POST", keepalive: true }).catch(() => {});
  const dlg = document.getElementById("follow-dlg");
  // The rung between "this feed was viewed" and "someone followed it". Same mechanism as the
  // landing page's pulses — one POST, no body, no cookie, no identifier, same-origin only,
  // at most once per page load. Opening the dialog is the deliberate act; a scanner does not
  // perform it and neither does a reader who looked and left, which is what makes a zero on
  // follow_submit readable. Guarded by the fbtn test above, so this block is inert on the
  // studio page, which shares this script and has no follow button.
  let opened = false;
  fbtn.addEventListener("click", () => {
    dlg.showModal();
    if (opened) return;
    opened = true;
    fetch("/api/pulse/follow_open", { method: "POST", keepalive: true }).catch(() => {});
  });
  // follow_rss — which of the two paths a visitor who wants this feed actually takes.
  //
  // They are not equivalent and the dialog no longer pretends they are. An email row goes into
  // "followers", which nothing on this platform reads and no code in src/ can deliver to: there
  // is no mail provider, no sender, no digest job, and standing one up is an owner/auth step.
  // The RSS URL is the only subscription on this page that does anything today, and until this
  // run it was a 12px link in the corner while the path that does nothing had the primary
  // button. Both distribution candidates in ops/DISTRIBUTION.md point at this page and one of
  // them is an RSS directory.
  //
  // Counted for A5's reason, the same one follow_open was built on: without it a visitor who
  // takes the working path is invisible here, and "feed_fetch" — which does move — cannot say
  // the dialog sent them. Same mechanism as every other pulse: one POST, no body, no cookie, no
  // identifier, same-origin only, at most once per page load.
  //
  // Read it as exactly one thing: the RSS option *inside the dialog* was clicked. The separate
  // RSS link in the page header is deliberately not wired to it — a visitor who takes that one
  // never expresses follow intent here and would blur the rung. It is a click, not a
  // subscription: nothing here observes whether a reader was ever added on the other side.
  const rssCta = document.getElementById("follow-rss");
  let rssTaken = false;
  if (rssCta) rssCta.addEventListener("click", () => {
    if (rssTaken) return;
    rssTaken = true;
    fetch("/api/pulse/follow_rss", { method: "POST", keepalive: true }).catch(() => {});
  });
  document.getElementById("follow-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("follow-email").value;
    const res = await fetch(location.pathname.replace(/\\/$/, "") + "/follow", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email })
    });
    const out = document.getElementById("follow-out");
    if (res.ok) { out.textContent = "You're on the list. Nothing sends until digests start — the RSS link above is live now."; e.target.style.display = "none"; }
    else { out.textContent = "That didn't work — check the email?"; }
  });
}
`;

const STUDIO_JS = /* js */ `
const $ = (id) => document.getElementById(id);
const base = location.pathname.replace(/\\/$/, "");
let current = null;

async function fetchPreview() {
  const url = $("url-in").value.trim();
  if (!url) return;
  $("status").textContent = "fetching…"; $("status").classList.remove("err");
  $("preview").classList.remove("show");
  try {
    const res = await fetch(base + "/preview", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url }) });
    if (!res.ok) throw new Error((await res.json()).error || res.status);
    current = await res.json();
    $("pv-title").textContent = current.title;
    $("pv-desc").textContent = current.description || "";
    $("pv-domain").textContent = current.site_name || current.domain;
    $("pv-cat-dot").style.background = document.querySelector('#cat-sel option[value="' + current.category + '"]')?.dataset.color || "#94a3b8";
    $("cat-sel").value = current.category;
    const th = $("pv-thumb");
    th.innerHTML = current.image_url ? '<img src="' + current.image_url.replace(/"/g, "&quot;") + '" alt="">' : "→";
    $("note-in").value = "";
    $("preview").classList.add("show");
    $("status").textContent = "";
  } catch (err) {
    $("status").textContent = "couldn't read that link (" + err.message + ") — you can still publish it bare";
    $("status").classList.add("err");
    current = { url, title: url, description: "", image_url: "", site_name: "", domain: new URL(url).hostname.replace(/^www\\./, ""), kind: "link", category: "Misc" };
    $("pv-title").textContent = url; $("pv-desc").textContent = ""; $("pv-domain").textContent = current.domain;
    $("pv-thumb").innerHTML = "→"; $("cat-sel").value = "Misc";
    $("preview").classList.add("show");
  }
}

$("url-in").addEventListener("paste", () => setTimeout(fetchPreview, 50));
$("url-in").addEventListener("keydown", (e) => { if (e.key === "Enter") fetchPreview(); });

$("publish-btn").addEventListener("click", async () => {
  if (!current) return;
  current.category = $("cat-sel").value;
  current.note = $("note-in").value.trim();
  $("publish-btn").disabled = true;
  const res = await fetch(base + "/items", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(current) });
  if (res.ok) location.reload();
  else { $("status").textContent = "publish failed"; $("status").classList.add("err"); $("publish-btn").disabled = false; }
});

document.querySelectorAll("[data-toggle]").forEach(b => b.addEventListener("click", async () => {
  await fetch(base + "/items/" + b.dataset.toggle + "/toggle", { method: "POST" });
  location.reload();
}));
document.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", async () => {
  if (!confirm("Delete this item permanently?")) return;
  await fetch(base + "/items/" + b.dataset.del + "/delete", { method: "POST" });
  location.reload();
}));

// first-visit intro (per-browser)
const intro = $("intro");
if (intro && !localStorage.getItem("introDismissed")) intro.hidden = false;
$("intro-x")?.addEventListener("click", () => { intro.hidden = true; localStorage.setItem("introDismissed", "1"); });

// copy public link
$("copy-public")?.addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  await navigator.clipboard.writeText(location.origin + btn.dataset.url);
  btn.textContent = "Copied ✓";
  setTimeout(() => { btn.textContent = "Copy fan link"; }, 1500);
});
`;

export function layout(title: string, accent: string, body: string, js = "", head = ""): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0b0b10">
<link rel="icon" href="/icon-192.png">
<title>${esc(title)}</title>
<style>${CSS}</style>
<style>:root { --accent: ${esc(accent)}; }</style>
${head}
</head>
<body>
<div class="wrap">${body}</div>
${js ? `<script>${js}</script>` : ""}
</body>
</html>`;
}

/** What a public page says about itself to everything that is not a browser.
 *
 * Run 86 gave these pages `<link rel="alternate">`, so a feed reader can now find the feed —
 * **"these pages" meant the pages that ARE a feed, and this function is also called by the landing
 * page, which is not one.** Read as a statement that autodiscovery was handled, that sentence was
 * false for `/` for a month: run 191 found the one URL this product asks the world to remember
 * advertising no feed at all. Corrected here rather than deleted, because the scope it was written
 * under is the whole reason the gap was invisible (L-108). It
 * did not give them anything else: until this, a public feed page's whole `<head>` was a title,
 * an icon and that link. Pasted into Slack, Discord, Mastodon, X, LinkedIn or iMessage — which
 * is what a distribution link *is* — the URL unfurled as bare text, because every one of those
 * clients reads Open Graph and there was none to read. In a search result the snippet was
 * whatever a crawler chose to scrape. And with three origins serving the identical document
 * (see SITE_ORIGIN), nothing said which URL is the page.
 *
 * Everything emitted here is derived from values already rendered on the page. No count, no
 * claim about usage, and no adjective the page cannot support — this is the surface most likely
 * to be quoted back, so it states what the feed *is* and nothing about how it is doing.
 *
 * `summary` rather than `summary_large_image`: the only image this service owns is a 512x512
 * icon, and the large card promises a banner it would have to stretch that icon to fill.
 */
function socialHead(o: {
  /** Path only, leading slash, no query — the canonical URL is built from SITE_ORIGIN. */
  path: string;
  title: string;
  description: string;
  /** Defaults to `description`. Split only where a page already had two reviewed strings. */
  ogDescription?: string;
  /** An absolute http(s) image for the card. Omitted anywhere the only image we own is the icon.
   *  Callers pass a value that has already been through `imageSrc`, which is what guarantees it
   *  is absolute — a relative og:image resolves against the *unfurler's* origin (see meta.ts). */
  image?: string;
}): string {
  const url = `${SITE_ORIGIN}${o.path}`;
  // `summary_large_image` only where a real image exists. Promising a banner and supplying the
  // 512x512 icon is how a large card renders as a stretched logo, which is worse than a small one.
  const image = o.image && /^https?:\/\//i.test(o.image) ? o.image : "";
  return `<link rel="canonical" href="${esc(url)}">
<meta name="description" content="${esc(o.description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(BRAND)}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.ogDescription ?? o.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image || `${SITE_ORIGIN}/icon-512.png`)}">
<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`;
}

/** Cut to a length a search result and a chat card will both show, on a word boundary. */
function clip(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 1)).trimEnd() + "…";
}

/** How long ago a feed last published, in the plainest words available.
 *
 *  Run 150 put a follow button on every public feed page and run 171 put one on all eighty-seven
 *  find pages, both carrying some version of *"every find like this one, as it is published"* and
 *  *"new finds reach your reader as @handle publishes them"*. Those sentences are conditional, so
 *  neither is false. What they omit is the only fact a stranger needs to decide: **a production
 *  read of every public feed on 2026-09-18T10:08:54Z found the newest item on `ava` 47.3 days old
 *  and on `wearables`, `wellbeing` and `graphics` 49.5 days old** (qa-browser 46, EXP005_SUMMARY).
 *  Sixty-eight of the eighty-seven find pages belong to a feed that has published nothing in seven
 *  weeks, and subscribing is the one conversion a visitor can complete with no account, no
 *  application and no owner act. Offering it without saying that spends the single conversion this
 *  funnel can achieve on a stream that will deliver nothing.
 *
 *  Staleness is a fact about the world and not a defect; a page that declines to mention it is the
 *  defect ([L-18](../ops/LESSONS.md)). So the page says it, and the saying is deliberately
 *  **unconditional — there is no threshold here and no change of tone above one.** A cut point
 *  picked by this executor would be a number fitted to the five feeds it can see, which is the
 *  shape EXP-013's Fork B exists to refuse. Days, never weeks or months, because days are what the
 *  row holds and they do not round in the flattering direction.
 *
 *  Returns "" for a feed with nothing in it, so the caller renders the no-items sentence rather
 *  than an age of nothing. */
export function lastPublished(latestIso: string | null | undefined, now = Date.now()): string {
  if (!latestIso) return "";
  const t = new Date(latestIso).getTime();
  if (!Number.isFinite(t)) return "";
  const days = Math.floor((now - t) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

/** The clause the follow block and both follow dialogs carry, after the sentence about publishing.
 *
 *  **Bare text, with no element of its own.** It goes into paragraphs and spans that already
 *  exist, so it adds nothing to `FEED_CSS`/`FIND_CSS` — the two dated page-scoped blocks waiting
 *  to be folded into `CSS` once EXP-011 is read — and cannot move any layout.
 *
 *  The obvious version wrapped the age in `<b>` for emphasis, and browser QA at 390px and 1100px
 *  caught what that does: `.find-follow .ff-copy b` is `display: block`, because it styles the
 *  *"Follow @handle"* heading directly above. The emphasis turned one sentence into three lines —
 *  "…the last was" / "49 days ago" / ". No account, nothing to apply for." — with the full stop
 *  orphaned onto its own row. Nothing overflowed, so the document-overflow check read clean
 *  through it. Emphasis is not worth a second styling rule on a surface that has two dated ones
 *  outstanding already, so there is none. */
export function lastPublishedClause(handle: string, latestIso: string | null | undefined, now = Date.now()): string {
  const words = lastPublished(latestIso, now);
  return words
    ? ` — the last was ${esc(words)}.`
    : ` — @${esc(handle)} has not published anything yet.`;
}

/** What the request knows about the person reading a public page, and nothing more.
 *
 *  `null` for everybody who is not signed in, which is the whole point: with no session cookie
 *  the Worker runs no extra query and both pages render the byte-identical document they always
 *  did. A crawler, a stranger and a preview fetcher see no member state, and there is no variant
 *  of these pages for a shared cache to get wrong. */
export interface FeedViewer {
  /** This feed is already on the member's desk — so the honest offer is removal, not another add. */
  following: boolean;
  /** This feed is the member's own. Following your own attention is not following anyone's, so
   *  the desk option is withheld and the dialog is exactly the one a stranger is shown. This is
   *  the same exclusion the desk's own suggestion list makes, one surface along. */
  own: boolean;
}

/** The desk subscription, offered inside the follow dialog to a member who can actually take it.
 *
 *  Run 176 gave `follows` its first real writer — `POST /:handle/desk` — and said in its own
 *  record that the public feed page's dialog was left byte-untouched: a signed-in member who
 *  clicked Follow there still got the email capture. That capture writes an address into
 *  `followers`, a table nothing on this platform reads and no code in `src/` can deliver to.
 *  So the one control on the page a member would press to follow a feed was the one that does
 *  nothing, while the control that works lived only on `/today` — reachable only by a member who
 *  had already worked out that the desk offers feeds, on the screen they would have left.
 *
 *  **Prepended, never a rewrite.** Everything below it in the dialog — the RSS paragraph, the
 *  email disclosure, the form — is byte-identical to what a stranger is served, because those
 *  sentences are graded by `promises.test.ts` and `follow-cadence.test.ts` and are not this
 *  change's business. RSS also still works for a member; it is simply no longer the only thing
 *  in the dialog that does.
 *
 *  **A real `<form method="post">`** for the three reasons run 176 gave: it works with JavaScript
 *  off, it is exactly what the browser submits so there is no second code path, and the endpoint
 *  is legible in the delivered HTML — which is what lets a test grade the offer the member is
 *  shown rather than a path the test hard-codes. The dialog itself needs script to open, so this
 *  is not a no-JS path end to end; the desk's own offer at `/today` remains that, and this one is
 *  still readable off the document either way.
 *
 *  **No CSS rule is added.** `FEED_CSS` and `FIND_CSS` are two dated page-scoped blocks waiting to
 *  be folded into `CSS`, and a third dated block for one button would be a third thing to unpick.
 *  The two inline styles do what `dialog form { display: flex }` needs and nothing else. */
function deskOption(handle: string, from: "feed" | "find", viewer: FeedViewer | null): string {
  if (!viewer || viewer.own) return "";
  const form = (label: string, cls: string, remove: boolean) =>
    `<form method="post" action="/${esc(handle)}/desk" style="margin-bottom:16px">` +
    `<input type="hidden" name="from" value="${from}">` +
    (remove ? `<input type="hidden" name="remove" value="1">` : "") +
    `<button class="btn ${cls}" style="flex:1">${label}</button></form>`;
  return viewer.following
    ? `<p><b>@${esc(handle)} is on your desk.</b> New finds land at <a href="/today">your morning desk</a>, to star or skip.</p>` +
        form("Take it off my desk", "", true)
    : `<p><b>You're signed in.</b> Put @${esc(handle)} on your desk and every new find lands at <a href="/today">your morning desk</a>, to star or skip.</p>` +
        form("Add to my desk", "primary", false);
}

function favicon(domain: string): string {
  return `https://icons.duckduckgo.com/ip3/${esc(domain)}.ico`;
}

/** An item's image, or "" when it isn't safe to render.
 *
 * Rows written before `resolveImageUrl` existed can still hold a *relative* og:image — arXiv's
 * `/static/browse/0.3.4/images/arxiv-logo-fb.png` is one that is live on the landing page right
 * now. In an `src` on our own origin that path 404s against justtuned.com. The extractor no longer
 * stores such values; this stops the ones already stored from being rendered, without rewriting
 * anyone's data. */
function imageSrc(raw: string): string {
  return /^https?:\/\//i.test(raw) ? raw : "";
}

/** A find, as a card.
 *
 *  `opts.permalink` is the handle whose feed page is rendering this card, and it is opt-in for a
 *  reason that is not style. Run 164 gave every published find an address at `/<handle>/<id>` and
 *  linked those pages to each other — but **nothing on this site linked into the set.** `card()`
 *  wraps the whole card in an anchor to `item.url`, which is right on a feed page and is why the
 *  only route into eighty-seven find pages was `sitemap.xml`. A page set reachable from a sitemap
 *  and from nothing a crawler can walk to is the orphan shape the `more` block was written to
 *  avoid, one level up — and a visitor who wanted to send someone *this* find still could not get
 *  its URL, because the page never showed one.
 *
 *  The permalink is a **second** affordance, never the first. The card's primary click still goes
 *  to the source: re-pointing it would send every click on the only conversion surface to Tuned
 *  instead of the thing the member was paying attention to, which is the change run 164 declined
 *  on no evidence and this run does not make either.
 *
 *  Why it is opt-in rather than always-on: `landingPage` renders its demo through this same
 *  function, and the landing page is **frozen byte-for-byte** until EXP-011's reading on
 *  2026-09-19. With `opts.permalink` absent this returns the byte-identical string it always did,
 *  which is asserted by a test rather than left to inspection.
 *
 *  Nesting is the constraint that shapes the markup. HTML forbids an anchor inside an anchor, and
 *  the browser silently un-nests one — so the permalink cannot go in the `.meta` row where it
 *  belongs visually. It is a sibling of `.card-link` inside a wrapper, positioned into the space
 *  the meta row reserves for it. `data-item-cat` moves to that wrapper so the category filter
 *  still hides the card and its permalink as one thing. */
function card(item: Item, opts: { studio?: boolean; permalink?: string } = {}): string {
  const inner = `
  <div class="card${item.visibility === "hidden" ? " hidden-item" : ""}">
    <div class="thumb">${imageSrc(item.image_url) ? `<img src="${esc(imageSrc(item.image_url))}" alt="" loading="lazy" onerror="this.remove()">` : esc(KIND_ICON[item.kind] ?? "→")}</div>
    <div class="body">
      <div class="meta">
        <span class="cat"><i style="background:${catColor(item.category)}"></i>${esc(item.category)}</span>
        <img src="${favicon(item.domain)}" width="12" height="12" alt="" onerror="this.remove()">
        <span>${esc(item.site_name || item.domain)}</span>
        <span>·</span>
        <span class="time" data-t="${esc(item.created_at)}"></span>
        ${item.via_handle ? `<span class="via" title="Found by @${esc(item.via_handle)}, read and chosen by this member">via @${esc(item.via_handle)}</span>` : ""}
      </div>
      <h3>${esc(item.title)}</h3>
      ${item.description ? `<div class="desc">${esc(item.description)}</div>` : ""}
      ${item.note ? `<div class="note">${esc(item.note)}</div>` : ""}
    </div>
    ${
      opts.studio
        ? `<div class="item-actions">
            <button class="btn small" data-toggle="${item.id}">${item.visibility === "public" ? "Hide" : "Show"}</button>
            <button class="btn small danger" data-del="${item.id}">✕</button>
          </div>`
        : ""
    }
  </div>`;
  if (opts.studio) return `<div data-item-cat="${esc(item.category)}">${inner}</div>`;
  if (!opts.permalink) {
    return `<a class="card-link" href="${esc(item.url)}" target="_blank" rel="noopener" data-item-cat="${esc(item.category)}">${inner}</a>`;
  }
  // `aria-label` because a feed page carries one of these per find and the visible word is the same
  // on every one of them. A screen reader's link list would otherwise read "permalink" forty times
  // with nothing to tell them apart, which is the one way this affordance could be worse than none.
  return `<div class="card-wrap" data-item-cat="${esc(item.category)}"><a class="card-link" href="${esc(item.url)}" target="_blank" rel="noopener">${inner}</a><a class="card-permalink" href="/${esc(opts.permalink)}/${item.id}" aria-label="Permalink: ${esc(item.title)}" title="A page of its own for this find — the link to send someone">permalink</a></div>`;
}

function breakdown(items: Item[]): string {
  const weekAgo = Date.now() - 7 * 86400_000;
  const recent = items.filter((i) => new Date(i.created_at).getTime() > weekAgo);
  if (recent.length === 0) return "";
  const counts = new Map<string, number>();
  for (const i of recent) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const total = recent.length;
  const bar = sorted
    .map(([cat, n]) => `<span style="width:${((n / total) * 100).toFixed(1)}%;background:${catColor(cat)}" title="${esc(cat)}: ${n}"></span>`)
    .join("");
  const chips = sorted
    .map(
      ([cat, n]) =>
        `<button class="chip" data-cat="${esc(cat)}"><span class="swatch" style="background:${catColor(cat)}"></span>${esc(cat)} <span class="n">${n}</span></button>`
    )
    .join("");
  return `
  <div class="week">
    <div class="label">attention this week · ${total} thing${total === 1 ? "" : "s"}</div>
    <div class="bar">${bar}</div>
    <div class="legend">${chips}</div>
  </div>`;
}

// ---------- ambient-attention rollup ----------
// Some attention is deliberate (a paper, a video you chose) and some is ambient (music while
// you work). Ambient sources emit 10-50x the events, so rendering them one-per-card drowns the
// feed. Ambient categories collapse into a single per-day card that expands on click.
const ROLLUP_CATEGORIES = new Set(["Music"]);
const ROLLUP_MIN = 3;

type Entry = { rollup: false; item: Item } | { rollup: true; category: string; items: Item[] };

function collapseAmbient(items: Item[]): Entry[] {
  const groups = new Map<string, Item[]>();
  for (const it of items) {
    if (!ROLLUP_CATEGORIES.has(it.category)) continue;
    const key = `${it.category}|${it.created_at.slice(0, 10)}`;
    const arr = groups.get(key);
    if (arr) arr.push(it);
    else groups.set(key, [it]);
  }
  const collapsed = new Set([...groups].filter(([, v]) => v.length >= ROLLUP_MIN).map(([k]) => k));
  const emitted = new Set<string>();
  const out: Entry[] = [];
  for (const it of items) {
    const key = `${it.category}|${it.created_at.slice(0, 10)}`;
    if (collapsed.has(key)) {
      if (!emitted.has(key)) {
        emitted.add(key);
        out.push({ rollup: true, category: it.category, items: groups.get(key)! });
      }
      continue;
    }
    out.push({ rollup: false, item: it });
  }
  return out;
}

/** Leading artist/author from a "Artist · Album" description. */
function leadName(item: Item): string {
  return (item.description || "").split(" · ")[0].trim();
}

function rollupCard(category: string, items: Item[]): string {
  const names = [...new Set(items.map(leadName).filter(Boolean))];
  const shown = names.slice(0, 3).join(" · ");
  const more = names.length > 3 ? ` +${names.length - 3} more` : "";
  const covers = items.filter((i) => imageSrc(i.image_url)).slice(0, 4);
  const mosaic = covers.length
    ? `<div class="mosaic${covers.length > 1 ? " grid" : ""}">${covers.map((c) => `<img src="${esc(imageSrc(c.image_url))}" alt="" loading="lazy" onerror="this.remove()">`).join("")}</div>`
    : `<div class="thumb">♫</div>`;
  const verb = category === "Music" ? "Listening" : category;
  return `<details class="card rollup" data-item-cat="${esc(category)}">
    <summary>
      ${mosaic}
      <div class="body">
        <div class="meta">
          <span class="cat"><i style="background:${catColor(category)}"></i>${esc(category)}</span>
          <span>·</span><span class="time" data-t="${esc(items[0].created_at)}"></span>
        </div>
        <h3>${esc(verb)} — ${items.length} track${items.length === 1 ? "" : "s"}</h3>
        ${shown ? `<div class="desc">${esc(shown)}${esc(more)}</div>` : ""}
      </div>
      <span class="chev">▾</span>
    </summary>
    <div class="rollup-list">
      ${items.map((i) => `<a href="${esc(i.url)}" target="_blank" rel="noopener"><span class="t">${esc(i.title)}</span><span class="a">${esc(leadName(i))}</span></a>`).join("")}
    </div>
  </details>`;
}

/** `handle` is threaded rather than inferred: both call sites are `publicPage`, so every card this
 *  renders belongs to that feed, which is exactly the pair `/:handle/:id` requires. An ambient
 *  rollup gets no permalink — it is a day's worth of Music collapsed into one `<details>`, not a
 *  find, and it has no single row to address. */
function renderEntries(items: Item[], handle: string): string {
  return collapseAmbient(items)
    .map((e) => (e.rollup ? rollupCard(e.category, e.items) : card(e.item, { permalink: handle })))
    .join("");
}

function groupByDay(items: Item[]): Array<{ day: string; items: Item[] }> {
  const groups: Array<{ day: string; items: Item[] }> = [];
  for (const item of items) {
    const day = new Date(item.created_at).toUTCString().slice(0, 11); // "Mon, 27 Jul"
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(item);
    else groups.push({ day, items: [item] });
  }
  return groups;
}

export function publicPage(creator: Creator, items: Item[], viewer: FeedViewer | null = null): string {
  const now = Date.now();
  const today = items.filter((i) => now - new Date(i.created_at).getTime() < 24 * 3600_000);
  const earlier = items.filter((i) => now - new Date(i.created_at).getTime() >= 24 * 3600_000);
  const latest = items[0]?.created_at;

  const body = `
  <div class="site-top">
    <a class="wordmark" href="/"><b>·</b> ${esc(BRAND.toLowerCase())}</a>
    <a class="rss" href="/${esc(creator.handle)}/rss.xml">RSS</a>
  </div>
  <div class="creator-head">
    <div class="avatar">${creator.avatar_url ? `<img src="${esc(creator.avatar_url)}" alt="">` : esc(creator.name.slice(0, 1).toUpperCase())}</div>
    <div>
      <h1>${esc(creator.name)}${creator.kind === "agent" ? ` <span class="ai-badge" title="This is an AI agent's attention feed, registered and supervised by a human member">AI agent</span>` : ""}</h1>
      <div class="handle">what @${esc(creator.handle)} is paying attention to</div>
      ${creator.bio ? `<div class="bio">${esc(creator.bio)}</div>` : ""}
      ${latest ? `<div class="presence" data-latest="${esc(latest)}"><span class="dot"></span><span class="ptext"></span></div>` : ""}
    </div>
    <div class="head-actions">
      <button class="btn primary" id="follow-btn">Follow</button>
    </div>
  </div>
  ${breakdown(items)}
  ${
    today.length
      ? `<div class="section-h now"><h2>Right now</h2><div class="rule"></div></div>` + renderEntries(today, creator.handle)
      : ""
  }
  ${
    earlier.length
      ? `<div class="section-h"><h2>Earlier</h2><div class="rule"></div></div>` +
        groupByDay(earlier)
          .map((g) => `<div class="day-h">${esc(g.day)}</div>` + renderEntries(g.items, creator.handle))
          .join("")
      : ""
  }
  ${items.length === 0 ? `<div class="empty">Nothing here yet — ${esc(creator.name)} hasn't shared any attention.</div>` : ""}
  <footer>a live feed of attention, not posts · <a href="/" style="text-decoration:underline">what is this?</a> · <a href="/terms">terms</a> · <a href="/privacy">privacy</a> · <b>${esc(BRAND.toLowerCase())}</b> — ${esc(TAGLINE)}</footer>
  <dialog id="follow-dlg">
    <h3>Follow ${esc(creator.name)}</h3>${deskOption(creator.handle, "feed", viewer)}
    <p><b>RSS works today.</b> New finds reach your reader as @${esc(creator.handle)} publishes them${lastPublishedClause(creator.handle, latest)}</p>
    <a class="btn primary rss-cta" id="follow-rss" href="/${esc(creator.handle)}/rss.xml" target="_blank" rel="noopener">Subscribe by RSS</a>
    <p class="or">Or leave an email. <b>Digests are not sending yet</b> — you go on the list and nothing arrives until they start. No spam, no account.</p>
    <form id="follow-form"><input type="email" id="follow-email" required placeholder="you@..."><button class="btn">Add me to the list</button></form>
    <div class="status" id="follow-out"></div>
  </dialog>`;
  // RSS autodiscovery. The page already carries a visible "RSS" link for a human who is
  // looking for one; this is the same URL in the one place a *machine* looks for it.
  //
  // Nothing announced these feeds to software. Every feed reader, aggregator and feed
  // search engine resolves a pasted page URL to a feed through exactly this element, and
  // one of the two distribution candidates whose published rules do not forbid the post —
  // ooh.directory — takes the front page and says "(not its feed)" in as many words. Given
  // /sportstech it would have found nothing to subscribe to, and neither would a person who
  // pasted the same URL into their reader. The counters agree that this is not theoretical:
  // across 2026-08-21..08-24 the landing page took 45-69 views a day while *unsuffixed*
  // feed_fetch — every RSS fetch not from a self-declaring crawler — read 0, 0, 0, 0.
  // The rest of what a machine reads. The description is assembled from what the page already
  // says out loud — the handle line is rendered verbatim above — plus the agent disclosure the
  // badge carries in its own title attribute, so an unfurled card cannot present an agent feed
  // as a person's. The bio comes last because it is the part most likely to be clipped.
  const agentNote =
    creator.kind === "agent"
      ? " An AI agent's attention feed, registered and supervised by a human member."
      : "";
  const bio = creator.bio?.trim() ? ` ${creator.bio.trim()}` : "";
  // The word removed from this sentence is "live", and it is the same defect as the one in
  // `rssFeed`'s `<description>` on the same feed. This string is `<meta name="description">` and
  // the Open Graph description — what a search result and every unfurled card show — so "a live
  // feed of…" was a freshness claim made to a stranger about a feed that, for four of the five
  // here, had published nothing for 50-53 days. What the block IS survives; what it asserted about
  // activity does not. The page states the age where it is derived from the row instead, in
  // `lastPublishedClause` on the RSS block below.
  //
  // No relative age goes in here either, for the reason `rssFeed` gives at length: a search engine
  // and an unfurl cache both copy this string, and a copied relative age is a hardcoded freshness
  // claim one step removed.
  const description = clip(
    `What @${creator.handle} is paying attention to — a feed of what ${creator.name} is watching, reading and listening to, newest first, with RSS.${agentNote}${bio}`,
    300
  );
  const head = `<link rel="alternate" type="application/rss+xml" title="${esc(creator.name)} — ${esc(BRAND)}" href="/${esc(creator.handle)}/rss.xml">
<style>${FEED_CSS}</style>
${socialHead({
    path: `/${creator.handle}`,
    title: `${creator.name} — ${BRAND}`,
    description,
  })}`;
  return layout(`${creator.name} — ${BRAND}`, creator.accent, body, CLIENT_JS, head);
}

/** The permalink chip's styling, served to the public feed page and to nothing else.
 *
 *  These four rules belong in `CSS` next to the other `.card` rules, and they are deliberately
 *  not there yet. `CSS` is served by `layout()` to **every** page including `/`, and EXP-011's
 *  stop conditions freeze the landing page for the whole window — its reading is due 2026-09-19.
 *  A rule matching no element on that page could not move `landing_render ÷ landing_view`, which
 *  is a property of traffic; but this loop has held the frozen page byte-identical rather than
 *  argue each edit harmless one at a time, and an experiment twenty days from its reading is not
 *  where that precedent gets relaxed. **After EXP-011 is read, fold this into `CSS` and delete
 *  the extra `<style>`** — it is a dated workaround, not a second stylesheet mechanism.
 *
 *  `padding-bottom` on the body is the load-bearing rule, not decoration — it reserves the strip the
 *  chip is positioned into, so the overlap is impossible rather than unlikely. It is on the *body*
 *  after browser QA rejected the obvious placement: the chip first sat in the card's top-right with
 *  `padding-right` reserving space on the `.meta` row, and Chromium showed it sitting on top of
 *  "via @scout" at 1100px and on a long source name at 390px. A flex line does not honour padding
 *  from items that cannot shrink below their min-content width, and `.meta` sets no `min-width: 0`
 *  on its spans. The body's other children are blocks, which respect padding unconditionally.
 *
 *  The margin moves from the card to the wrapper so the chip's offset does not silently depend on
 *  `.card`'s `margin-bottom`. Total vertical rhythm is unchanged. */
const FEED_CSS = /* css */ `
.card-wrap { position: relative; margin-bottom: 10px; }
.card-wrap .card { margin-bottom: 0; }
.card-wrap .card .body { padding-bottom: 26px; }
.card-permalink {
  position: absolute; right: 14px; bottom: 14px; z-index: 1;
  font-size: 11px; line-height: 1; letter-spacing: .02em; color: var(--faint);
  border: 1px solid var(--line); border-radius: 999px; padding: 5px 9px; background: var(--panel2);
}
.card-permalink:hover, .card-permalink:focus-visible { color: var(--text); border-color: #34344a; }
`;

/** A sibling find, linked to its own page rather than to its source.
 *
 *  This is the one place on the site where a card must NOT link out. `card()` wraps the whole
 *  thing in an anchor to `item.url`, which is right on a feed page — the visitor came for the
 *  finds and the source is the destination. Here the block's job is different: it is what turns
 *  a set of sitemap entries into a graph a crawler can walk, and links to other people's domains
 *  do none of that. Rendering it through `card()` looked correct and connected nothing, which is
 *  why there is a test asserting these hrefs are find pages. */
function siblingCard(handle: string, item: Item): string {
  return `<a class="card-link" href="/${esc(handle)}/${item.id}" data-item-cat="${esc(item.category)}">
    <div class="card">
      <div class="thumb">${imageSrc(item.image_url) ? `<img src="${esc(imageSrc(item.image_url))}" alt="" loading="lazy" onerror="this.remove()">` : esc(KIND_ICON[item.kind] ?? "→")}</div>
      <div class="body">
        <div class="meta">
          <span class="cat"><i style="background:${catColor(item.category)}"></i>${esc(item.category)}</span>
          <span>${esc(item.site_name || item.domain)}</span>
        </div>
        <h3>${esc(item.title)}</h3>
      </div>
    </div>
  </a>`;
}

/** The client script for a find page. Deliberately NOT `CLIENT_JS`.
 *
 *  This page now carries a follow button too, and the separation matters more because of it, not
 *  less. `CLIENT_JS` gates `feed_render` and `follow_open` on `#follow-btn` — the element this
 *  page has just gained — so serving it here would start feeding a find page's traffic into two
 *  counters whose published meaning is "a public **feed** page", one of which is the denominator
 *  EXP-011's sibling reading rests on. That is the L-87 shape: a change that looks like reuse and
 *  silently redefines a running number. So the dialog is wired here instead, against
 *  `find_follow_open` and `find_follow_rss`, and no name on the feed page moves.
 *
 *  `item_render` stays first and unconditional. It is the rung under everything below it and it
 *  must not become gated on the button, or a markup change would take out the denominator too.
 *  The date is rendered server-side for the same reason a crawler gets one. */
const FIND_JS = /* js */ `
fetch("/api/pulse/item_render", { method: "POST", keepalive: true }).catch(() => {});

const fbtn = document.getElementById("follow-btn");
if (fbtn) {
  const dlg = document.getElementById("follow-dlg");
  // The feed's own path, read from the button rather than from location.pathname. CLIENT_JS
  // derives the follow endpoint by appending "/follow" to the current path, which is right on
  // /<handle> and wrong here: this page is /<handle>/<id>, and that derivation would POST to
  // /<handle>/<id>/follow — a route that does not exist. Carrying it in a data attribute keeps
  // the handle escaped by the same esc() as the rest of the document.
  const feed = fbtn.dataset.feed;
  let opened = false;
  fbtn.addEventListener("click", () => {
    dlg.showModal();
    if (opened) return;
    opened = true;
    fetch("/api/pulse/find_follow_open", { method: "POST", keepalive: true }).catch(() => {});
  });
  const rssCta = document.getElementById("follow-rss");
  let rssTaken = false;
  if (rssCta) rssCta.addEventListener("click", () => {
    if (rssTaken) return;
    rssTaken = true;
    fetch("/api/pulse/find_follow_rss", { method: "POST", keepalive: true }).catch(() => {});
  });
  document.getElementById("follow-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("follow-email").value;
    const res = await fetch(feed + "/follow", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, from: "find" })
    });
    const out = document.getElementById("follow-out");
    if (res.ok) { out.textContent = "You're on the list. Nothing sends until digests start — the RSS link above is live now."; e.target.style.display = "none"; }
    else { out.textContent = "That didn't work — check the email?"; }
  });
}
`;

/** The follow block's styling, served to the find page and to nothing else.
 *
 *  Same dated workaround as `FEED_CSS` above and for the same reason: `CSS` is served by
 *  `layout()` to **every** page including `/`, EXP-011 freezes the landing page until its reading
 *  on 2026-09-19, and this loop has held that page byte-identical rather than argue each edit
 *  harmless one at a time. **After EXP-011 is read, fold this and `FEED_CSS` into `CSS` and delete
 *  both extra `<style>` blocks.** The dialog's own rules are already in `CSS` and are not
 *  duplicated here — only the block that opens it is new.
 *
 *  `min-width: 0` on the copy column is load-bearing, not tidiness: the row is a flex line and a
 *  long handle in the heading would otherwise refuse to shrink below its min-content width and
 *  push the button off a 390px viewport, which is the run-167 defect exactly. */
const FIND_CSS = /* css */ `
.find-follow {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  margin: 24px 0 4px; padding: 14px 16px;
  border: 1px solid var(--line); border-radius: 12px; background: var(--panel2);
}
.find-follow .ff-copy { flex: 1 1 200px; min-width: 0; }
.find-follow .ff-copy b { display: block; font-size: 14px; margin-bottom: 3px; }
.find-follow .ff-copy span { font-size: 12px; color: var(--muted); }
.find-follow .btn { white-space: nowrap; }
`;

/** One find, at an address of its own.
 *
 *  Eighty-seven public items existed and not one had a URL. A find was reachable only inside a
 *  feed page that changes under it, which meant three separate things were impossible at once:
 *  a search engine could index no attention this service has ever published, a visitor could not
 *  send anyone *this* find, and the loop had no surface to attribute an arrival to. The sitemap
 *  carried eight URLs against eighty-seven published finds.
 *
 *  What this page is, and the line it does not cross. It is a record of **attention**, not a copy
 *  of the thing attended to: the provenance chain is the subject, the source's own title and
 *  description are the minimum needed to say which thing, and the outbound link is the primary
 *  action on the page. It says in its own words that Tuned does not host this. That is the
 *  doctrine boundary — the page must never read as a destination that replaces the source, which
 *  is what a summarizer is ([NORTH_STAR](../ops/NORTH_STAR.md)).
 *
 *  `more` is other public finds from the same feed. It is not decoration: a sitemap-only page with
 *  no inbound link is an orphan, and eighty-seven orphans are a doorway pattern. These links make
 *  the set a connected graph a crawler can walk from any entry point.
 *
 *  **The follow block, and why it belongs here rather than only on the feed page.** These pages are
 *  the unit this site is indexed and shared as — eighty-seven of them against five feed pages — so
 *  a stranger's first Tuned page is far more likely to be one of these than the front door. Until
 *  now the only subscription affordance on it was the 12px "RSS" link in the corner, which resolves
 *  to an XML document; a visitor who wanted more of *this person's attention* had to work out that
 *  the handle in the kicker was a link, follow it, and find the button there. The block sits below
 *  the provenance list and above the siblings, which keeps `open-cta` the primary action: this page
 *  exists to send people to the source, and a follow ask that outranked the outbound link would be
 *  the destination-that-replaces-the-source shape the doctrine boundary above rules out. It is
 *  rendered unconditionally — `more` can be empty on a one-item feed, and an affordance that
 *  disappears on the smallest feeds is not one. */
export function itemPage(creator: Creator, item: Item, more: Item[], viewer: FeedViewer | null = null): string {
  const img = imageSrc(item.image_url);
  const source = item.site_name || item.domain;
  // Absolute and server-rendered. A relative time needs script; a crawler runs none, and the date
  // an item was selected is the one fact on this page that decays.
  const when = new Date(item.created_at).toUTCString().slice(0, 16);
  // The age the follow ask reports is the **feed's**, never this page's item. A find page is
  // reached from a search result or a pasted link, so the item in front of the reader is as
  // likely to be the oldest thing in the feed as the newest; answering "how old is this find?"
  // when the question is "will subscribing deliver anything?" would be a true number in the
  // wrong denominator. `more` is the same creator's other public items ordered `created_at DESC`
  // (src/index.ts, `GET /:handle/:id`), so the newest of `[item, ...more]` is exactly the feed's
  // newest public item — no extra query, and exact rather than an approximation of one.
  const feedLatest = [item, ...more].reduce((a, b) =>
    new Date(b.created_at).getTime() > new Date(a.created_at).getTime() ? b : a
  ).created_at;
  const body = `
  <div class="site-top">
    <a class="wordmark" href="/"><b>·</b> ${esc(BRAND.toLowerCase())}</a>
    <a class="rss" href="/${esc(creator.handle)}/rss.xml">RSS</a>
  </div>
  <div class="find-page">
    <div class="find-kicker">
      <a href="/${esc(creator.handle)}">@${esc(creator.handle)}</a> paid attention to this${creator.kind === "agent" ? ` <span class="ai-badge" title="This is an AI agent's attention feed, registered and supervised by a human member">AI agent</span>` : ""}
    </div>
    <h1>${esc(item.title)}</h1>
    <div class="find-source">
      <span class="cat"><i style="background:${catColor(item.category)}"></i>${esc(item.category)}</span>
      <img src="${favicon(item.domain)}" width="12" height="12" alt="" onerror="this.remove()">
      <span>${esc(source)}</span>
      <span>·</span>
      <span>${esc(when)}</span>
    </div>
    ${item.note ? `<div class="find-note">${esc(item.note)}</div>` : ""}
    ${item.description ? `<div class="find-desc">${esc(item.description)}</div>` : ""}
    ${img ? `<div class="find-art"><img src="${esc(img)}" alt="" loading="lazy" onerror="this.closest('.find-art').remove()"></div>` : ""}
    <a class="btn primary open-cta" href="${esc(item.url)}" target="_blank" rel="noopener">Open at ${esc(item.domain)} →</a>
    <div class="provenance">
      <h2>Provenance</h2>
      <ol>
        ${
          item.via_handle
            ? `<li><i>◦</i><span>Observed by <b>@${esc(item.via_handle)}</b>, an agent watching a beat</span></li>
        <li><i>◦</i><span>Read and chosen by <b>@${esc(creator.handle)}</b></span></li>`
            : `<li><i>◦</i><span>Selected by <b>@${esc(creator.handle)}</b></span></li>`
        }
        <li><i>◦</i><span>Published to this feed <b>${esc(when)}</b></span></li>
      </ol>
      <div class="disclaim">Tuned does not host this and did not write it. This page records that
      someone paid attention to it, and who — nothing more. The link above goes to the source.</div>
    </div>
    <div class="find-follow">
      <div class="ff-copy">
        <b>Follow @${esc(creator.handle)}</b>
        <span>Every find like this one, as it is published${lastPublishedClause(creator.handle, feedLatest)} No account, nothing to apply for.</span>
      </div>
      <button class="btn primary" id="follow-btn" data-feed="/${esc(creator.handle)}">Follow</button>
    </div>
    ${
      more.length
        ? `<div class="more-finds">
      <div class="section-h"><h2>More of what @${esc(creator.handle)} is paying attention to</h2><div class="rule"></div></div>
      ${more.map((m) => siblingCard(creator.handle, m)).join("")}
      <a class="demo-more" href="/${esc(creator.handle)}">See the whole feed →</a>
    </div>`
        : ""
    }
  </div>
  <footer>a live feed of attention, not posts · <a href="/" style="text-decoration:underline">what is this?</a> · <a href="/terms">terms</a> · <a href="/privacy">privacy</a> · <b>${esc(BRAND.toLowerCase())}</b> — ${esc(TAGLINE)}</footer>
  <dialog id="follow-dlg">
    <h3>Follow ${esc(creator.name)}</h3>${deskOption(creator.handle, "find", viewer)}
    <p><b>RSS works today.</b> New finds reach your reader as @${esc(creator.handle)} publishes them${lastPublishedClause(creator.handle, feedLatest)}</p>
    <a class="btn primary rss-cta" id="follow-rss" href="/${esc(creator.handle)}/rss.xml" target="_blank" rel="noopener">Subscribe by RSS</a>
    <p class="or">Or leave an email. <b>Digests are not sending yet</b> — you go on the list and nothing arrives until they start. No spam, no account.</p>
    <form id="follow-form"><input type="email" id="follow-email" required placeholder="you@..."><button class="btn">Add me to the list</button></form>
    <div class="status" id="follow-out"></div>
  </dialog>`;
  // Everything below is assembled from what the page already says out loud. The description leads
  // with the attention claim rather than the source's blurb, because that is what distinguishes
  // this result from the source's own — two pages carrying the same summary is the shape a search
  // engine reads as a scrape.
  const via = item.via_handle ? ` Found by @${item.via_handle}.` : "";
  const description = clip(
    `@${creator.handle} is paying attention to "${item.title}" from ${source}.${via} ${item.note || item.description || ""}`,
    300
  );
  const head = `<link rel="alternate" type="application/rss+xml" title="${esc(creator.name)} — ${esc(BRAND)}" href="/${esc(creator.handle)}/rss.xml">
<style>${FIND_CSS}</style>
${socialHead({
    path: `/${creator.handle}/${item.id}`,
    title: `${item.title} — @${creator.handle} on ${BRAND}`,
    description,
    image: img,
  })}`;
  return layout(`${item.title} — @${creator.handle} on ${BRAND}`, creator.accent, body, FIND_JS, head);
}

export function studioPage(creator: Creator, items: Item[]): string {
  const catOptions = CATEGORIES.map(
    (c) => `<option value="${esc(c)}" data-color="${catColor(c)}">${esc(c)}</option>`
  ).join("");
  const body = `
  <div class="site-top">
    <span class="wordmark"><b>·</b> ${esc(BRAND.toLowerCase())} studio</span>
    <a class="rss" href="/${esc(creator.handle)}" target="_blank">view public page ↗</a>
  </div>
  <div class="creator-head">
    <div class="avatar">${creator.avatar_url ? `<img src="${esc(creator.avatar_url)}" alt="">` : esc(creator.name.slice(0, 1).toUpperCase())}</div>
    <div>
      <h1>${esc(creator.name)}</h1>
      <div class="handle">your feed — paste a link, tap publish. That's the whole job.</div>
    </div>
    <div class="head-actions">
      <button class="btn" id="copy-public" data-url="/${esc(creator.handle)}">Copy fan link</button>
      <a class="btn" href="/studio/${esc(creator.token ?? "")}/setup">📲 One-tap sharing</a>
    </div>
  </div>
  <div class="intro-card" id="intro" hidden>
    <button class="dismiss" id="intro-x" title="dismiss">✕</button>
    <b>How this works</b> — your fans get a live page of what you're paying attention to. Not posts: attention.
    <ul>
      <li><b>When?</b> Whenever something's worth your attention — the morning skim, the 2am rabbit hole. Little and often beats big and rare.</li>
      <li><b>What do fans see?</b> Everything you publish, newest first, plus a weekly breakdown of where your attention went. Tap "view public page" to see exactly what they see.</li>
      <li><b>What's required of you?</b> Only the link. Notes are optional. Hide anything, any time — hidden items vanish from your public page instantly.</li>
      <li><b>Faster than paste:</b> <a href="/studio/${esc(creator.token ?? "")}/setup" style="text-decoration:underline">set up one-tap sharing</a> — ${esc(BRAND)} in your phone's share menu.</li>
      <li><b>Who can post here?</b> Anyone with this studio link — so don't share it. Share the fan link instead.</li>
    </ul>
  </div>
  <div class="paste-zone">
    <input type="url" id="url-in" placeholder="paste a link — YouTube, X, an article, anything" autofocus>
    <div class="hint">Nothing is required from you but the link. A note is optional, never expected. Hide anything, anytime.</div>
    <div class="status" id="status"></div>
    <div id="preview">
      <div class="card">
        <div class="thumb" id="pv-thumb">→</div>
        <div class="body">
          <div class="meta"><span class="cat"><i id="pv-cat-dot" style="background:#94a3b8"></i></span><span id="pv-domain"></span></div>
          <h3 id="pv-title"></h3>
          <div class="desc" id="pv-desc"></div>
        </div>
      </div>
      <div class="preview-controls">
        <select id="cat-sel">${catOptions}</select>
        <input type="text" id="note-in" maxlength="280" placeholder="optional note (you can skip this)">
        <button class="btn primary" id="publish-btn">Publish</button>
      </div>
    </div>
  </div>
  <div class="section-h"><h2>Published — ${items.filter((i) => i.visibility === "public").length} public, ${items.filter((i) => i.visibility === "hidden").length} hidden</h2><div class="rule"></div></div>
  ${items.map((i) => card(i, { studio: true })).join("") || `<div class="empty">Your feed is empty. Paste your first link above.</div>`}
  <footer>this studio link is secret — anyone with it can post as you. <b>Don't share it.</b></footer>`;
  const head = `<link rel="manifest" href="/studio/${esc(creator.token ?? "")}/manifest.webmanifest">
<link rel="apple-touch-icon" href="/icon-192.png">`;
  const swJs = /* js */ `
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/studio/${creator.token ?? ""}/sw.js", { scope: "/studio/" }).catch(() => {});
  }`;
  return layout(`Studio — ${creator.name}`, creator.accent, body, CLIENT_JS + STUDIO_JS + swJs, head);
}

/** A creator as the landing page's feed list needs it: the row, plus how current the feed is.
 *
 *  The age is a separate column rather than a field on `Creator`, for the reason `AgentStats`
 *  keeps `lastItemAt` beside its creator instead of inside it — it is a fact about the feed's
 *  items, and `Creator` is the row. Only this surface reads it. */
export interface LandingFeed extends Creator {
  /** The newest **public** item's timestamp, or `null` for a feed that has never published one.
   *  Queued and hidden items are excluded, on the same reasoning the demo block excludes them:
   *  private state must not date a public surface. */
  latest_item_at: string | null;
}

/** The age line on a feed card in the landing page's list.
 *
 *  `lastPublished()`'s reading in the shape a card can carry — a line of its own rather than the
 *  desk row's `·`-separated clause, because there is no list here to join. It uses `.fine`, a rule
 *  the shared CSS already serves, so this adds no declaration to `CSS` and no flex row that can
 *  squeeze (L-18, L-93: both of those regressions were a disclosure folded into a line that
 *  already had a job).
 *
 *  **It is deliberately NOT appended to `.desc`.** That element is `-webkit-line-clamp: 2`, and at
 *  390px the two sentences together land on exactly the second line — so a longer handle would
 *  clamp the age away silently, which is the one failure mode a disclosure must not have.
 *
 *  Unconditional, with no threshold and no change of tone above one, exactly as `lastPublished`
 *  and `staleClause` are: a cut point chosen here would be a number fitted to the five feeds this
 *  executor can see (EXP-013 Fork B). Unlike the desk row it does **not** fall silent on a feed
 *  that has never published, because this card carries no other number — no `0 finds` — so
 *  silence here would leave the emptiest case the only undisclosed one. */
function feedAgeLine(latestIso: string | null | undefined, now = Date.now()): string {
  const words = lastPublished(latestIso, now);
  return `<div class="fine">${words ? `last published ${esc(words)}` : "nothing published yet"}</div>`;
}

/** The heading over the feed list, and the reason it no longer says *"Live feeds"*.
 *
 *  That phrasing is the defect the demo block one section down was already fixed for, and that
 *  block's own comment states the rule it broke: *"A claim about freshness that is hardcoded is a
 *  claim nobody can keep true — so this one is derived."* **Live* is such a claim.* It was made
 *  over a list whose query read no item at all, and on EXP-005's per-feed reading (run 152) four
 *  of the five destinations under it had published nothing for six weeks.
 *
 *  So the heading states what the block IS — the complete list — and says nothing about activity.
 *  How current each feed is, each card now says for itself and derives from the row. */
const FEED_LIST_HEADING = "All feeds";

export function landingPage(creators: LandingFeed[], demo?: { creator: Creator; items: Item[] }): string {
  const list = creators
    .map(
      (c) => `<a class="card-link" href="/${esc(c.handle)}"><div class="card">
        <div class="avatar" style="width:44px;height:44px;font-size:18px;background:linear-gradient(135deg,${esc(c.accent)},#2b2b3d)">${c.avatar_url ? `<img src="${esc(c.avatar_url)}" alt="">` : esc(c.name.slice(0, 1).toUpperCase())}</div>
        <div class="body"><h3>${esc(c.name)}${c.kind === "agent" ? ` <span class="ai-badge">AI agent</span>` : ""}</h3><div class="desc">what @${esc(c.handle)} is paying attention to</div>${feedAgeLine(c.latest_item_at)}</div>
      </div></a>`
    )
    .join("");
  // The heading states what the block IS; the pulse under it states how current the block is,
  // read off the newest item rather than asserted in prose.
  //
  // It used to read "Live demo — a real feed, right now" unconditionally. EXP-005 measured what
  // that sentence was sitting on top of in production on 2026-08-13: cards stamped "11d ago",
  // under the word "now", on the page 431 UA-flagged human-shaped views had landed on. A claim
  // about freshness that is hardcoded is a claim nobody can keep true — so this one is derived,
  // and it degrades by itself into "last active 11d ago" exactly as the feed pages already do.
  const demoLatest = demo?.items[0]?.created_at;
  const demoBlock = demo && demo.items.length
    ? `
  <div class="section-h"><h2>Live demo — a real feed</h2><div class="rule"></div></div>
  ${demoLatest ? `<div class="presence" data-latest="${esc(demoLatest)}"><span class="dot"></span><span class="ptext"></span></div>` : ""}
  <div class="demo-window">
    ${demo.items.map((i) => card(i)).join("")}
    <a class="btn demo-more" href="/${esc(demo.creator.handle)}">Open the full feed — what @${esc(demo.creator.handle)} is paying attention to →</a>
  </div>`
    : "";
  const body = `
  <div class="site-top"><span class="wordmark"><b>·</b> ${esc(BRAND.toLowerCase())}</span><a class="rss" href="${demo ? `/${esc(demo.creator.handle)}` : "#waitlist"}">see a real feed</a></div>
  <div style="padding:56px 0 10px">
    <h1 style="font-size:34px;letter-spacing:-0.02em;max-width:16ch">Follow what people <span style="color:var(--accent)">pay attention to</span>.</h1>
    <form id="waitlist" class="waitlist" autocomplete="email" style="margin-top:26px">
      <input type="email" id="wl-email" required placeholder="you@...">
      <select id="wl-role">
        <option value="fan">I want to follow feeds</option>
        <option value="creator">I want a feed of my own</option>
        <option value="agent">I'm bringing an AI agent</option>
        <option value="both">Several of these</option>
      </select>
      <input type="text" id="wl-note" maxlength="280" placeholder="what would your feed be about? (a link to you or your agent helps)">
      <button class="btn primary" id="wl-btn">Apply to join</button>
    </form>
    <div class="status" id="wl-out"></div>
  </div>
  ${demoBlock}

  <div class="section-h"><h2>Your AI reads. You choose. Your feed stays alive.</h2><div class="rule"></div></div>
  <div class="explain">
    <div class="step"><span class="n">1</span><div><b>Your agents read overnight.</b> Each one is a member with its own public feed, labeled AI, hunting its beat — and you can share your own finds anytime with one tap.</div></div>
    <div class="step"><span class="n">2</span><div><b>You star the best at your morning desk.</b> Starred finds land on <i>your</i> feed, credited "via @agent" — the agent foraged, you read it and made it yours.</div></div>
    <div class="step"><span class="n">3</span><div><b>That's the whole job.</b> No captions, no content treadmill. Skip what's noise — your agents learn your taste from every star and skip.</div></div>
    <p class="fine">Total control stays with you: hide any item, any time; share only the slice of your attention you want followed.</p>
  </div>

  <div class="section-h"><h2>If you're following</h2><div class="rule"></div></div>
  <div class="explain">
    <div class="step"><span class="n">·</span><div><b>Right now</b> — anything from the last 24 hours, under a live pulse saying when they were last active.</div></div>
    <div class="step"><span class="n">·</span><div><b>This week</b> — where their attention actually went, broken down by kind.</div></div>
    <div class="step"><span class="n">·</span><div><b>Over time</b> — the archive: watch their interests shift, week by week.</div></div>
    <p class="fine">Follow a person, their agents, or both — no account needed, open RSS on every feed.</p>
  </div>

  ${list ? `<div class="section-h"><h2>${FEED_LIST_HEADING}</h2><div class="rule"></div></div>` + list : ""}
  <footer>${esc(TAGLINE)} · <a href="/terms">terms</a> · <a href="/privacy">privacy</a> · <b>${esc(BRAND.toLowerCase())}</b></footer>`;
  const js = /* js */ `
  const rel = (t) => {
    const s = (Date.now() - new Date(t).getTime()) / 1000;
    return s < 3600 ? Math.max(1, Math.floor(s / 60)) + "m ago" : s < 86400 ? Math.floor(s / 3600) + "h ago" : Math.floor(s / 86400) + "d ago";
  };
  document.querySelectorAll(".time[data-t]").forEach(el => { el.textContent = rel(el.dataset.t); });
  // Same pulse the feed pages render, and the same honesty: green only while the newest item
  // is under a day old, otherwise greyed and labelled "last active". The landing page must not
  // be able to look fresher than the feed it is showing.
  const p = document.querySelector(".presence[data-latest]");
  if (p) {
    const h = (Date.now() - new Date(p.dataset.latest).getTime()) / 3600000;
    const t = p.querySelector(".ptext");
    if (h < 24) { t.textContent = "active " + rel(p.dataset.latest); }
    else { p.classList.add("idle"); t.textContent = "last active " + rel(p.dataset.latest); }
  }
  // Funnel pulse — see the /api/pulse route in src/index.ts and EXP-007. Two one-shot
  // signals, fired at most once per page load: did anything on this page get touched by
  // something behaving like a person, and did that reach the application form. No cookie,
  // no identifier, nothing stored in the browser.
  const pulse = (n) => { fetch("/api/pulse/" + n, { method: "POST", keepalive: true }).catch(() => {}); };
  // Fired unconditionally, once per page load, at script execution — the one signal here that
  // asks nothing of the visitor. Its whole job is to be the denominator "landing_engage" never
  // had: something that requested this URL without running any of it is not counted, and a
  // browser that rendered the page is, whether or not anyone touched it. See EXP-011.
  pulse("landing_render");
  let engaged = false, started = false;
  const engage = () => {
    if (engaged) return;
    engaged = true;
    ["pointerdown", "keydown", "scroll"].forEach(ev => removeEventListener(ev, engage));
    pulse("landing_engage");
  };
  ["pointerdown", "keydown", "scroll"].forEach(ev => addEventListener(ev, engage, { passive: true }));
  document.getElementById("waitlist").addEventListener("input", () => {
    engage();
    if (started) return;
    started = true;
    pulse("application_start");
  });
  document.getElementById("waitlist").addEventListener("submit", async (e) => {
    e.preventDefault();
    const out = document.getElementById("wl-out");
    const btn = document.getElementById("wl-btn");
    btn.disabled = true;
    const res = await fetch("/waitlist", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: document.getElementById("wl-email").value, role: document.getElementById("wl-role").value, note: document.getElementById("wl-note").value }) });
    if (res.ok) { out.textContent = "Application received and recorded — every member, human or AI, is reviewed personally. ${BRAND} sends no automated email, so there is nothing scheduled to arrive in your inbox. The live feed below needs no account, and its RSS link works right now."; e.target.style.display = "none"; }
    else { out.textContent = "That didn't work — check the email?"; out.classList.add("err"); btn.disabled = false; }
  });`;
  // Both strings below are the reviewed copy this page already carried, unchanged. What it did
  // not carry is a canonical, an og:url or a card image — so it named none of the three origins
  // as the page, and unfurled without one.
  const head = socialHead({
    path: "/",
    title: `${BRAND} — ${TAGLINE}`,
    description: `${BRAND} — ${TAGLINE}. A live page of what someone is actually watching, reading and listening to.`,
    ogDescription: "Follow what people pay attention to — not what they post.",
  });
  /** What this page tells a feed reader, which until now was nothing at all.
   *
   *  Run 86 gave `<link rel="alternate">` to the pages that HAVE a feed, and run 164's find pages
   *  inherited it. Both were read as closing the gap — `test/discovery.test.ts` opens by saying the
   *  element "was absent from every page this service serves", in a file that then grades one feed
   *  page. **The page a reader is actually handed was never one of them.** `/` is the address every
   *  canonical, every `og:url`, the sitemap and the README all name as the site; a person who wants
   *  to follow this pastes *that* into their reader, and the reader parsed a document advertising
   *  no feed and reported that this site has none. Five feeds were live the whole time and the one
   *  page that lists all five was the only public page that named none of them to software.
   *
   *  The scope error is worth stating because it is not "a page was missed". Run 86's rule came out
   *  as *a page that is a feed advertises itself*, and under that rule this page is correctly
   *  excluded — it is not a feed. A reader's rule is *a page advertises the feeds it leads to*, and
   *  the find pages already obey it: `itemPage` is not a feed either and advertises the one it
   *  belongs to. So the element's own behaviour on this codebase already contradicted the narrower
   *  rule, and nothing noticed, because the page that would have shown it up is the page that
   *  renders a visible list of feeds a human reviewer can see and click (L-46 again — a human
   *  checking this page finds the feeds either way).
   *
   *  **Every feed the page offers, in the order it offers them.** Not the demo alone: a reader that
   *  discovers more than one shows a picker, and picking is the visitor's job. A stale feed is
   *  advertised too — its card already states its age, and refusing to name it here would be this
   *  function deciding for a subscriber what is worth following.
   *
   *  The title is keyed on the **handle**, not the name, and that is the one place this diverges
   *  from `publicPage`. On a feed page there is a single alternate and the name identifies it; here
   *  there are as many as there are feeds, side by side in one menu, and `name` is not unique in
   *  the schema — `handle` is. Distinctness has to hold by construction, because two identical rows
   *  in that menu is the failure this element exists to prevent. */
  const feedLinks = creators
    .map(
      (c) =>
        `\n<link rel="alternate" type="application/rss+xml" title="@${esc(c.handle)} — ${esc(BRAND)}" href="/${esc(c.handle)}/rss.xml">`
    )
    .join("");
  return layout(`${BRAND} — ${TAGLINE}`, "#7c6cff", body, js, head + feedLinks);
}

export type ShareState =
  | { status: "published"; item: Item }
  | { status: "duplicate"; item: Item }
  | { status: "nourl"; raw: string };

export function sharePage(creator: Creator, token: string, state: ShareState): string {
  const studio = `/studio/${esc(token)}`;
  let main: string;
  if (state.status === "nourl") {
    main = `
    <div class="share-result">
      <div class="share-badge err">✕</div>
      <h1>No link in that share</h1>
      <p class="prose">We couldn't find a URL in what was shared${state.raw ? ` (<i>${esc(state.raw.slice(0, 80))}</i>)` : ""}.
      Try sharing from the app's own share button, or paste the link in your studio.</p>
      <div class="share-actions"><a class="btn primary" href="${studio}">Open studio</a></div>
    </div>`;
  } else {
    const dup = state.status === "duplicate";
    main = `
    <div class="share-result">
      <div class="share-badge">${dup ? "=" : "✓"}</div>
      <h1>${dup ? "Already in your feed" : "Published"}</h1>
      ${card(state.item)}
      <div class="share-actions">
        <button class="btn" id="hide-btn" data-id="${state.item.id}">${state.item.visibility === "public" ? "Hide it" : "Hidden ✓"}</button>
        <a class="btn" href="${studio}">Studio</a>
        <a class="btn" href="/${esc(creator.handle)}" target="_blank">Public page</a>
      </div>
      <p class="fine">${dup ? "Shared in the last 24h — not added twice." : "Live on your public page now. Hide it any time."}</p>
    </div>`;
  }
  const js = /* js */ `
  document.querySelectorAll(".time[data-t]").forEach(el => {
    el.textContent = "just now";
  });
  const hb = document.getElementById("hide-btn");
  if (hb) hb.addEventListener("click", async () => {
    await fetch("${studio}/items/" + hb.dataset.id + "/toggle", { method: "POST" });
    hb.textContent = hb.textContent.includes("Hide") ? "Hidden ✓" : "Hide it";
  });`;
  return layout(`Shared — ${BRAND}`, creator.accent, `
  <div class="site-top"><span class="wordmark"><b>·</b> ${esc(BRAND.toLowerCase())}</span></div>
  ${main}`, js);
}

export function setupPage(creator: Creator, token: string, origin: string): string {
  const studio = `${origin}/studio/${esc(token)}`;
  const endpoint = `${studio}/share-api`;
  const bookmarklet = `javascript:void(window.open('${studio}/share?url='+encodeURIComponent(location.href),'_blank','noopener'))`;
  const body = `
  <div class="site-top">
    <span class="wordmark"><b>·</b> ${esc(BRAND.toLowerCase())} studio</span>
    <a class="rss" href="/studio/${esc(token)}">back to studio</a>
  </div>
  <div style="padding:30px 0 6px"><h1 style="font-size:26px;letter-spacing:-0.02em">One-tap sharing</h1>
  <p class="prose" style="margin-top:8px">Get ${esc(BRAND)} into the share menu of the apps where your attention already lives. Set up once, then publishing is: tap Share → ${esc(BRAND)}. Done.</p></div>

  <div class="section-h"><h2>Android · Chrome</h2><div class="rule"></div></div>
  <div class="explain">
    <div class="step"><span class="n">1</span><div>Open <a href="/studio/${esc(token)}" style="text-decoration:underline">your studio</a> in Chrome on your phone.</div></div>
    <div class="step"><span class="n">2</span><div>Menu (⋮) → <b>Add to Home screen</b> → <b>Install</b>.</div></div>
    <div class="step"><span class="n">3</span><div>That's it. In YouTube, X, anywhere: <b>Share → ${esc(BRAND)}</b>. It publishes instantly and shows an Undo.</div></div>
  </div>

  <div class="section-h"><h2>iPhone · Shortcuts</h2><div class="rule"></div></div>
  <div class="explain">
    <div class="step"><span class="n">1</span><div>Open the <b>Shortcuts</b> app → <b>+</b> to create a new shortcut. Name it <b>${esc(BRAND)}</b>.</div></div>
    <div class="step"><span class="n">2</span><div>Tap the <b>ⓘ</b> info panel → turn on <b>Show in Share Sheet</b>.</div></div>
    <div class="step"><span class="n">3</span><div>Add the action <b>Get Contents of URL</b>. Set URL to the endpoint below, Method to <b>POST</b>, Request Body <b>JSON</b>, with one field: <b>url</b> = <i>Shortcut Input</i>.</div></div>
    <div class="step"><span class="n">4</span><div>From any app: <b>Share → ${esc(BRAND)}</b>.</div></div>
  </div>
  <div class="endpoint"><code id="ep">${esc(endpoint)}</code><button class="btn small" id="copy-ep">Copy</button></div>

  <div class="section-h"><h2>Desktop · bookmarklet</h2><div class="rule"></div></div>
  <p class="prose">Drag this to your bookmarks bar. On any page worth your attention, click it — the page is published and a confirmation opens.</p>
  <p style="margin-top:10px"><a class="btn primary" href="${bookmarklet.replace(/"/g, "&quot;")}" onclick="return false" title="drag me to the bookmarks bar">＋ ${esc(BRAND)} this page</a></p>
  <p class="fine">Desktop Chrome/Edge can also install the studio as an app (icon in the address bar) and use the OS share menu.</p>

  <footer>this page contains your secret studio link — <b>don't share screenshots of it</b>.</footer>`;
  const js = /* js */ `
  document.getElementById("copy-ep").addEventListener("click", async () => {
    await navigator.clipboard.writeText(document.getElementById("ep").textContent);
    document.getElementById("copy-ep").textContent = "Copied ✓";
  });`;
  return layout(`Sharing setup — ${BRAND}`, creator.accent, body, js);
}

/** A timestamp as RFC 822, or the empty string when it is not a date.
 *
 * `new Date("").toUTCString()` is the literal string `Invalid Date`, and RSS dates were written
 * straight through it — so a row with an unparseable `created_at` published an element whose
 * content is not a date at all. Readers vary in what they do with that and none of them do
 * anything good. An absent `pubDate` is legal and means "unstated"; a present one that is not a
 * date is a false statement, and this loop's rule is that a field says nothing rather than
 * something wrong. */
function rfc822(iso: string): string {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? new Date(t).toUTCString() : "";
}

export function rssFeed(creator: Creator, items: Item[]): string {
  const published = items.slice(0, 50);
  const entries = published
    .map((i) => {
      const pub = rfc822(i.created_at);
      /** The chain, and the address that carries it, inside the item a subscriber actually reads.
       *
       *  Until now an item said the source's title, the source's URL and the source's blurb — so
       *  in a reader, the one surface anybody subscribes to, **Tuned's entire subject was absent.**
       *  Nothing named who observed the thing or who chose it, and nothing linked to the page that
       *  states it. The channel-level "(AI agent)" label was the only provenance in the document,
       *  and a reader shows that once in a sidebar, not on the item in front of you.
       *
       *  That gap is new rather than ancient: run 164 gave every published find an address at
       *  `/<handle>/<id>` on 2026-09-15 and this document has been byte-untouched since. It also
       *  points at the channel the two pending distribution submissions both name — what a
       *  directory's subscribers would receive is exactly this item, so the differentiator being
       *  missing from it is missing from the plan.
       *
       *  `<link>` still goes to the source, and that is the doctrine boundary rather than an
       *  oversight: the primary action is the thing attended to. The permalink is a **second**
       *  affordance, the same call `card()` makes on a feed page and for the same reason.
       *
       *  **`guid` is deliberately untouched.** A reader keys "have I shown this?" on that string;
       *  rewriting 50 of them to the new addresses would re-deliver every item in every feed as
       *  unread. Changing a description does not.
       *
       *  `esc` runs twice on purpose. The inner pass makes each value safe inside the HTML
       *  fragment; the outer pass puts that fragment inside an XML text node, which is how RSS
       *  carries markup and what every reader decodes. CDATA would do the same job and is one
       *  unescaped `]]>` away from breaking the whole document. */
      const blurb = i.note || i.description;
      const chain = i.via_handle
        ? `Observed by @${esc(i.via_handle)}, read and chosen by @${esc(creator.handle)}.`
        : `Selected by @${esc(creator.handle)}.`;
      const permalink = `${SITE_ORIGIN}/${esc(creator.handle)}/${i.id}`;
      const described = `${blurb ? `<p>${esc(blurb)}</p>` : ""}<p>${chain} <a href="${permalink}">Provenance on ${esc(BRAND)} →</a></p>`;
      return `
  <item>
    <title>${esc(i.title)}</title>
    <link>${esc(i.url)}</link>
    <guid isPermaLink="false">${BRAND.toLowerCase()}-item-${i.id}</guid>${pub ? `\n    <pubDate>${pub}</pubDate>` : ""}
    <category>${esc(i.category)}</category>
    <description>${esc(described)}</description>
  </item>`;
    })
    .join("");
  // An agent feed says so in RSS as well as on the page. A subscriber reads these items
  // inside their own reader, where the "AI agent" badge that rides on the HTML feed has
  // never been seen — so provenance that lives only in `publicPage` is provenance the
  // person actually following the feed never gets. The label goes in the channel title
  // because that is the string a reader shows in its sidebar next to every item.
  const isAgent = creator.kind === "agent";
  const title = `${esc(creator.name)}${isAgent ? " (AI agent)" : ""} — attention feed`;
  const provenance = isAgent
    ? ` Selected by an AI agent, registered and supervised by a human member.`
    : "";

  /** The feed document's own canonical address — the RSS half of the decision recorded at
   *  SITE_ORIGIN, which was made for HTML and then left undone here.
   *
   *  That comment already states the defect: *"`rssFeed` is passed the request origin, which is
   *  right for a feed a client already holds the URL of; it is wrong for a canonical."* Run 86
   *  gave the HTML pages `<link rel="canonical">` for exactly that reason. The feed never got the
   *  equivalent, and the feed is the artifact a directory listing points at. Three hosts serve
   *  this identical document (`justtuned.com`, `www.`, `*.workers.dev`), and until now nothing
   *  inside it said which of them is the feed. `<atom:link rel="self">` is how an RSS document
   *  says so; it is also the one thing the W3C Feed Validator reports missing on every feed that
   *  omits it.
   *
   *  IT IS BUILT ON SITE_ORIGIN AND CARRIES NO QUERY, AND BOTH HALVES ARE DELIBERATE. Echoing
   *  the request would make the canonical vary by the host that asked, which is the defect rather
   *  than the fix. Echoing an `?src=` campaign tag would be worse: the tag is a label on a link,
   *  not part of the feed's identity, and a document asserting a tagged URL as its own canonical
   *  would hand every copier a campaign label to spread. The cost of dropping it is registered in
   *  EXP-009 rather than hidden — a reader that re-pointed itself at this href would stop sending
   *  the tag, which is Fork E's case (ungradeable by the tag), never Fork C's (a null). */
  const self = `${SITE_ORIGIN}/${esc(creator.handle)}/rss.xml`;

  /** The channel's website, and why it stopped being the host that asked.
   *
   *  `<atom:link rel="self">` above fixed the feed's own address on SITE_ORIGIN and left this
   *  element deriving from the request, so the delivered document was byte-identical on all three
   *  hosts **except here** — and this is the one element in it that says where the site is. RSS
   *  2.0 defines `<channel><link>` as *"the URL to the HTML website corresponding to the
   *  channel"*; a reader renders it as the feed's "visit site" and a directory copies it into its
   *  own listing, which is exactly the surface the pending submission in ops/DISTRIBUTION.md
   *  points at. Whichever host a directory happened to fetch from became the address it published
   *  — including `*.workers.dev`, which every HTML page on this service already disowns by
   *  canonical.
   *
   *  The argument is now gone rather than ignored. An unused parameter is an invitation to derive
   *  this from the request again, and leaving one would have made host-invariance a property that
   *  holds by nobody's decision. `rssFeed` cannot see the request host, so the document cannot
   *  vary by it — the same reason run 189's strip wraps the finished document instead of listing
   *  the fields that need it. */
  const site = `${SITE_ORIGIN}/${esc(creator.handle)}`;

  /** The freshness promise, made machine-readable on the surface that is actually subscribed to.
   *
   *  A4 in ops/DISTRIBUTION.md turns on whether the destination is current when a stranger
   *  arrives, and a durable listing's readers arrive over months. A reader's "last updated"
   *  column is where that shows. Taken as the newest date among the items actually served rather
   *  than from `items[0]`, so an unsorted caller cannot make this element disagree with the
   *  document beneath it — and omitted entirely on an empty feed, because there is no build date
   *  to state and a fabricated "now" would claim freshness the feed does not have. */
  const newest = published
    .map((i) => Date.parse(i.created_at))
    .filter((t) => Number.isFinite(t))
    .reduce((a, b) => (b > a ? b : a), Number.NEGATIVE_INFINITY);
  const lastBuild = Number.isFinite(newest)
    ? `\n  <lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>`
    : "";

  /** The channel description, and the two words taken out of it.
   *
   *  It read *"What X is paying attention to **right now**."* on every feed, unconditionally. That
   *  is the hardcoded freshness claim the demo block was fixed for at run 139, and that block's
   *  comment states the rule this one broke: *"A claim about freshness that is hardcoded is a claim
   *  nobody can keep true — so this one is derived."* On the per-feed reading run 182 took off
   *  production, four of the five feeds serving this document had published nothing for **50–53
   *  days**, and every one of them said *right now* to every reader subscribed to it.
   *
   *  Of all the surfaces that claim had reached, this is the one it mattered most on. `<title>` and
   *  `<description>` are what a reader shows in its sidebar and what a directory listing reproduces,
   *  and the submissions in ops/DISTRIBUTION.md point a durable listing at exactly this document —
   *  so the false sentence sat on the only subscription this funnel can currently complete.
   *
   *  **The age is stated by `<lastBuildDate>` above and deliberately NOT restated here in words.**
   *  A relative age is the one thing this string must not carry. A reader re-fetches the document,
   *  so a relative age would be correct for a reader — but a directory *copies* the description
   *  into its own page, where "last published 52 days ago" freezes and becomes a hardcoded
   *  freshness claim one step removed. That is the defect being removed, not a fix for it.
   *  `lastBuildDate` is an absolute instant, so it stays true wherever it is copied to. */
  /** `stripXmlForbidden` wraps the finished document, and that position is the point of it —
   *  see its own note. Every field above is already `esc`aped; escaping is what makes a value
   *  safe, and it is precisely what cannot make a control character legal. */
  return stripXmlForbidden(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${title}</title>
  <link>${site}</link>
  <atom:link href="${self}" rel="self" type="application/rss+xml"/>
  <description>What ${esc(creator.name)} is paying attention to.${provenance}</description>${lastBuild}${entries}
</channel>
</rss>`);
}
