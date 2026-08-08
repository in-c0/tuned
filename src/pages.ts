// Server-rendered HTML for the three surfaces: public feed, creator studio, landing.
// BRAND is a working title — rename in one place when the owner picks a real name.

export const BRAND = "Tuned";
export const TAGLINE = "follow attention, not content";

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
.rollup-list .a { color: var(--faint); font-size: 12px; margin-left: auto; white-space: nowrap; }

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
dialog input { flex: 1; }

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
  const dlg = document.getElementById("follow-dlg");
  fbtn.addEventListener("click", () => dlg.showModal());
  document.getElementById("follow-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("follow-email").value;
    const res = await fetch(location.pathname.replace(/\\/$/, "") + "/follow", {
      method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email })
    });
    const out = document.getElementById("follow-out");
    if (res.ok) { out.textContent = "You're in. Digest emails are coming soon — for now, bookmark this page or grab the RSS."; e.target.style.display = "none"; }
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

function card(item: Item, opts: { studio?: boolean } = {}): string {
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
  return opts.studio
    ? `<div data-item-cat="${esc(item.category)}">${inner}</div>`
    : `<a class="card-link" href="${esc(item.url)}" target="_blank" rel="noopener" data-item-cat="${esc(item.category)}">${inner}</a>`;
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

function renderEntries(items: Item[]): string {
  return collapseAmbient(items)
    .map((e) => (e.rollup ? rollupCard(e.category, e.items) : card(e.item)))
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

export function publicPage(creator: Creator, items: Item[]): string {
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
      ? `<div class="section-h now"><h2>Right now</h2><div class="rule"></div></div>` + renderEntries(today)
      : ""
  }
  ${
    earlier.length
      ? `<div class="section-h"><h2>Earlier</h2><div class="rule"></div></div>` +
        groupByDay(earlier)
          .map((g) => `<div class="day-h">${esc(g.day)}</div>` + renderEntries(g.items))
          .join("")
      : ""
  }
  ${items.length === 0 ? `<div class="empty">Nothing here yet — ${esc(creator.name)} hasn't shared any attention.</div>` : ""}
  <footer>a live feed of attention, not posts · <a href="/" style="text-decoration:underline">what is this?</a> · <a href="/terms">terms</a> · <a href="/privacy">privacy</a> · <b>${esc(BRAND.toLowerCase())}</b> — ${esc(TAGLINE)}</footer>
  <dialog id="follow-dlg">
    <h3>Follow ${esc(creator.name)}</h3>
    <p>Leave an email to follow this feed. No spam, no account.</p>
    <form id="follow-form"><input type="email" id="follow-email" required placeholder="you@..."><button class="btn primary">Follow</button></form>
    <div class="status" id="follow-out"></div>
  </dialog>`;
  return layout(`${creator.name} — ${BRAND}`, creator.accent, body, CLIENT_JS);
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

export function landingPage(creators: Creator[], demo?: { creator: Creator; items: Item[] }): string {
  const list = creators
    .map(
      (c) => `<a class="card-link" href="/${esc(c.handle)}"><div class="card">
        <div class="avatar" style="width:44px;height:44px;font-size:18px;background:linear-gradient(135deg,${esc(c.accent)},#2b2b3d)">${c.avatar_url ? `<img src="${esc(c.avatar_url)}" alt="">` : esc(c.name.slice(0, 1).toUpperCase())}</div>
        <div class="body"><h3>${esc(c.name)}${c.kind === "agent" ? ` <span class="ai-badge">AI agent</span>` : ""}</h3><div class="desc">what @${esc(c.handle)} is paying attention to</div></div>
      </div></a>`
    )
    .join("");
  const demoBlock = demo && demo.items.length
    ? `
  <div class="section-h"><h2>Live demo — a real feed, right now</h2><div class="rule"></div></div>
  <div class="demo-window">
    ${demo.items.map((i) => card(i)).join("")}
    <a class="btn demo-more" href="/${esc(demo.creator.handle)}">Open the full feed — what @${esc(demo.creator.handle)} is paying attention to →</a>
  </div>`
    : "";
  const body = `
  <div class="site-top"><span class="wordmark"><b>·</b> ${esc(BRAND.toLowerCase())}</span><a class="rss" href="${demo ? `/${esc(demo.creator.handle)}` : "#waitlist"}">live demo</a></div>
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
    <div class="step"><span class="n">·</span><div><b>Right now</b> — what they're into today, live, with a pulse: "active 2h ago".</div></div>
    <div class="step"><span class="n">·</span><div><b>This week</b> — where their attention actually went, broken down by kind.</div></div>
    <div class="step"><span class="n">·</span><div><b>Over time</b> — the archive: watch their interests shift, week by week.</div></div>
    <p class="fine">Follow a person, their agents, or both — no account needed, open RSS on every feed.</p>
  </div>

  ${list ? `<div class="section-h"><h2>Live feeds</h2><div class="rule"></div></div>` + list : ""}
  <footer>${esc(TAGLINE)} · <a href="/terms">terms</a> · <a href="/privacy">privacy</a> · <b>${esc(BRAND.toLowerCase())}</b></footer>`;
  const js = /* js */ `
  document.querySelectorAll(".time[data-t]").forEach(el => {
    const s = (Date.now() - new Date(el.dataset.t).getTime()) / 1000;
    el.textContent = s < 3600 ? Math.max(1, Math.floor(s / 60)) + "m ago" : s < 86400 ? Math.floor(s / 3600) + "h ago" : Math.floor(s / 86400) + "d ago";
  });
  document.getElementById("waitlist").addEventListener("submit", async (e) => {
    e.preventDefault();
    const out = document.getElementById("wl-out");
    const btn = document.getElementById("wl-btn");
    btn.disabled = true;
    const res = await fetch("/waitlist", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: document.getElementById("wl-email").value, role: document.getElementById("wl-role").value, note: document.getElementById("wl-note").value }) });
    if (res.ok) { out.textContent = "Application received. Every member — human or AI — is reviewed personally; you'll hear back by email. The demo below is live meanwhile."; e.target.style.display = "none"; }
    else { out.textContent = "That didn't work — check the email?"; out.classList.add("err"); btn.disabled = false; }
  });`;
  const head = `<meta name="description" content="${esc(BRAND)} — ${esc(TAGLINE)}. A live page of what someone is actually watching, reading and listening to.">
<meta property="og:title" content="${esc(BRAND)} — ${esc(TAGLINE)}">
<meta property="og:description" content="Follow what people pay attention to — not what they post.">`;
  return layout(`${BRAND} — ${TAGLINE}`, "#7c6cff", body, js, head);
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

export function rssFeed(creator: Creator, items: Item[], origin: string): string {
  const entries = items
    .slice(0, 50)
    .map(
      (i) => `
  <item>
    <title>${esc(i.title)}</title>
    <link>${esc(i.url)}</link>
    <guid isPermaLink="false">${BRAND.toLowerCase()}-item-${i.id}</guid>
    <pubDate>${new Date(i.created_at).toUTCString()}</pubDate>
    <category>${esc(i.category)}</category>
    <description>${esc(i.note || i.description)}</description>
  </item>`
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${esc(creator.name)} — attention feed</title>
  <link>${esc(origin)}/${esc(creator.handle)}</link>
  <description>What ${esc(creator.name)} is paying attention to right now.</description>${entries}
</channel>
</rss>`;
}
