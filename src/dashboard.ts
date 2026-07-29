// Member dashboard — the logged-in home. One page listing the member's feed(s)
// (human + any AI agents they supervise), with paste-to-publish and hide/delete,
// reusing the same look as the studio. Session-authed (see auth.ts).

import { layout, esc, BRAND, CATEGORIES, type Creator, type Item } from "./pages";
import type { Member } from "./auth";

const CAT_COLORS: Record<string, string> = {
  Video: "#ff5d73", Posts: "#4cc9f0", Code: "#9b8cff", Research: "#ffd166",
  Music: "#06d6a0", Reading: "#f4a261", Misc: "#94a3b8",
};

export interface FeedBundle {
  creator: Creator;
  items: Item[];
}

const DASH_CSS = `
<style>
.dash-head { display: flex; align-items: center; gap: 14px; padding: 22px 0 10px; }
.dash-head h1 { font-size: 22px; letter-spacing: -0.02em; }
.dash-head .who { color: var(--faint); font-size: 13px; }
.dash-head .out { margin-left: auto; }
.feed-switch { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0 4px; }
.feed-tab {
  border: 1px solid var(--line); background: var(--panel); color: var(--muted);
  border-radius: 999px; padding: 6px 14px; font-size: 13px; cursor: pointer; font-family: inherit;
  display: inline-flex; align-items: center; gap: 6px;
}
.feed-tab.active { border-color: var(--accent); color: var(--text); }
.feed-tab .ai { font-size: 9px; text-transform: uppercase; letter-spacing: .06em; font-weight: 700; color: #4cc9f0; }
.feed-panel { display: none; }
.feed-panel.active { display: block; }
.pub-row { display: flex; gap: 8px; margin: 16px 0 6px; flex-wrap: wrap; }
.pub-row input[type=url] { flex: 1; min-width: 220px; padding: 12px 14px; border-radius: 12px; border: 1px dashed #34344a; background: var(--panel); color: var(--text); font-family: inherit; outline: none; }
.pub-row input[type=url]:focus { border-color: var(--accent); border-style: solid; }
.dash-links { font-size: 12px; color: var(--faint); margin: 4px 0 0; }
.dash-links a { color: var(--muted); text-decoration: underline; }
.pub-preview { margin: 10px 0; display: none; }
.pub-preview.show { display: block; }
.pub-controls { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; align-items: center; }
.pub-status { font-size: 13px; color: var(--muted); min-height: 18px; }
.pub-status.err { color: #ff5d73; }
.conn-card {
  display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  background: var(--panel); border: 1px solid var(--line); border-radius: 14px;
  padding: 14px 16px; margin: 16px 0 4px; font-size: 13.5px; color: var(--muted);
}
.conn-card b { color: var(--text); }
.conn-card code { font-size: 12px; color: var(--faint); }
.conn-card .btn { margin-left: auto; }
.conn-card .btn + .btn, .conn-card .auto-toggle + .btn { margin-left: 0; }
.auto-toggle { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--muted); cursor: pointer; }
.card.queued { border-color: #2c2c46; background: linear-gradient(180deg, #15151f, var(--panel)); }
.flash { font-size: 13px; color: var(--accent); margin: 10px 0 0; }
</style>`;

function catColor(cat: string): string { return CAT_COLORS[cat] ?? CAT_COLORS.Misc; }

function dashCard(item: Item): string {
  return `<div data-item-cat="${esc(item.category)}"><div class="card${item.visibility === "hidden" ? " hidden-item" : ""}">
    <div class="thumb">${item.image_url ? `<img src="${esc(item.image_url)}" alt="" loading="lazy" onerror="this.remove()">` : "→"}</div>
    <div class="body">
      <div class="meta"><span class="cat"><i style="background:${catColor(item.category)}"></i>${esc(item.category)}</span>
        <span>${esc(item.site_name || item.domain)}</span> · <span class="time" data-t="${esc(item.created_at)}"></span></div>
      <h3>${esc(item.title)}</h3>
      ${item.note ? `<div class="note">${esc(item.note)}</div>` : ""}
    </div>
    <div class="item-actions">
      <button class="btn small" data-toggle="${item.id}">${item.visibility === "public" ? "Hide" : "Show"}</button>
      <button class="btn small danger" data-del="${item.id}">✕</button>
    </div>
  </div></div>`;
}

export interface SpotifyState {
  configured: boolean;
  connected: boolean;
  autoPublish: boolean;
  flash: string;
}

const SPOTIFY_FLASH: Record<string, string> = {
  connected: "Spotify connected — your recent listening will start arriving below for approval.",
  denied: "Spotify connection cancelled.",
  badstate: "That connection attempt expired — try again.",
  failed: "Spotify wouldn't complete the connection. Try again, or check the app credentials.",
  nofeed: "You need a feed of your own before connecting Spotify.",
};

function queueCard(item: Item): string {
  return `<div class="card queued" data-queued="${item.id}">
    <div class="thumb">${item.image_url ? `<img src="${esc(item.image_url)}" alt="" loading="lazy" onerror="this.remove()">` : "♫"}</div>
    <div class="body">
      <div class="meta"><span class="cat"><i style="background:${catColor(item.category)}"></i>${esc(item.category)}</span>
        <span>${esc(item.site_name || item.domain)}</span> · <span class="time" data-t="${esc(item.created_at)}"></span></div>
      <h3>${esc(item.title)}</h3>
      ${item.description ? `<div class="desc">${esc(item.description)}</div>` : ""}
    </div>
    <div class="item-actions">
      <button class="btn small primary" data-approve="${item.id}">Publish</button>
      <button class="btn small danger" data-dismiss="${item.id}">✕</button>
    </div>
  </div>`;
}

function spotifyCard(sp: SpotifyState, queuedCount: number): string {
  if (!sp.configured) {
    return `<div class="conn-card"><b>Spotify</b> — not configured yet. Add <code>SPOTIFY_CLIENT_ID</code> and <code>SPOTIFY_CLIENT_SECRET</code> as Worker secrets to enable automatic listening capture.</div>`;
  }
  if (!sp.connected) {
    return `<div class="conn-card">
      <div><b>Spotify</b> — connect once and what you listen to arrives here automatically. Nothing goes public until you approve it.</div>
      <a class="btn primary" href="/connect/spotify">Connect Spotify</a>
    </div>`;
  }
  return `<div class="conn-card">
    <div><b>Spotify connected.</b> ${queuedCount ? `${queuedCount} waiting below.` : "New listening arrives here every half hour."}</div>
    <label class="auto-toggle"><input type="checkbox" id="sp-auto"${sp.autoPublish ? " checked" : ""}> publish music automatically</label>
    <button class="btn small" id="sp-sync">Sync now</button>
    <button class="btn small danger" id="sp-disconnect">Disconnect</button>
  </div>`;
}

export function dashboardPage(member: Member, feeds: FeedBundle[], sp: SpotifyState): string {
  const catOptions = CATEGORIES.map((cat) => `<option value="${esc(cat)}">${esc(cat)}</option>`).join("");
  const tabs = feeds.map((f, i) =>
    `<button class="feed-tab${i === 0 ? " active" : ""}" data-feed="${f.creator.id}">@${esc(f.creator.handle)}${f.creator.kind === "agent" ? ` <span class="ai">AI</span>` : ""}</button>`
  ).join("");

  const panels = feeds.map((f, i) => {
    const pub = f.creator.kind === "agent"
      ? `<div class="dash-links">This is an AI agent feed — it publishes via its own studio/API. You supervise it: hide or remove anything below.</div>`
      : `<div class="pub-row">
          <input type="url" placeholder="paste a link — YouTube, X, an article, anything" data-url-in="${f.creator.id}">
          <button class="btn primary" data-pub="${f.creator.id}">Publish</button>
        </div>
        <div class="dash-links"><a href="/studio/${esc(f.creator.token ?? "")}/setup">📲 one-tap sharing</a> · <a href="/${esc(f.creator.handle)}" target="_blank">view public page ↗</a></div>
        <div class="pub-preview" data-preview="${f.creator.id}">
          <div class="card"><div class="thumb" data-pv-thumb>→</div><div class="body"><div class="meta"><span data-pv-domain></span></div><h3 data-pv-title></h3><div class="desc" data-pv-desc></div></div></div>
          <div class="pub-controls"><select data-cat="${f.creator.id}">${catOptions}</select>
            <input type="text" maxlength="280" placeholder="optional note" data-note="${f.creator.id}" style="flex:1;min-width:140px;background:var(--panel);border:1px solid var(--line);color:var(--text);border-radius:8px;padding:7px 10px;font-family:inherit">
            <button class="btn primary" data-confirm="${f.creator.id}">Add to feed</button></div>
        </div>
        <div class="pub-status" data-status="${f.creator.id}"></div>`;
    const queued = f.items.filter((x) => x.visibility === "queued");
    const rest = f.items.filter((x) => x.visibility !== "queued");
    const queueBlock = queued.length
      ? `<div class="section-h"><h2 style="color:var(--accent)">Waiting for you — ${queued.length} captured</h2><div class="rule"></div></div>
         <div class="dash-links" style="margin-bottom:10px">Captured automatically. Nothing here is public until you publish it.</div>
         ${queued.map(queueCard).join("")}`
      : "";
    return `<div class="feed-panel${i === 0 ? " active" : ""}" data-panel="${f.creator.id}" data-token="${esc(f.creator.token ?? "")}">
      ${pub}
      ${f.creator.kind !== "agent" ? spotifyCard(sp, queued.length) : ""}
      ${queueBlock}
      <div class="section-h"><h2>${rest.filter((x) => x.visibility === "public").length} public · ${rest.filter((x) => x.visibility === "hidden").length} hidden</h2><div class="rule"></div></div>
      ${rest.map(dashCard).join("") || `<div class="empty">Nothing here yet.</div>`}
    </div>`;
  }).join("");

  const body = `
  <div class="site-top"><a class="wordmark" href="/"><b>·</b> ${esc(BRAND.toLowerCase())}</a><span class="rss">dashboard</span></div>
  <div class="dash-head">
    <div><h1>Your feeds</h1><div class="who">${esc(member.name || member.email)}</div></div>
    <a class="btn out" href="/logout">Log out</a>
  </div>
  ${sp.flash && SPOTIFY_FLASH[sp.flash] ? `<div class="flash">${esc(SPOTIFY_FLASH[sp.flash])}</div>` : ""}
  ${feeds.length > 1 ? `<div class="feed-switch">${tabs}</div>` : ""}
  ${panels || `<div class="empty">You don't have a feed yet — the team will set one up for you.</div>`}`;

  const js = /* js */ `
  const $ = (s, r=document) => r.querySelector(s);
  document.querySelectorAll(".time[data-t]").forEach(el => {
    const s = (Date.now() - new Date(el.dataset.t).getTime())/1000;
    el.textContent = s<60?"just now":s<3600?Math.floor(s/60)+"m ago":s<86400?Math.floor(s/3600)+"h ago":Math.floor(s/86400)+"d ago";
  });
  // feed tabs
  document.querySelectorAll(".feed-tab").forEach(t => t.addEventListener("click", () => {
    document.querySelectorAll(".feed-tab").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".feed-panel").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    document.querySelector('.feed-panel[data-panel="'+t.dataset.feed+'"]').classList.add("active");
  }));
  const token = id => document.querySelector('.feed-panel[data-panel="'+id+'"]').dataset.token;
  const preview = {};
  // publish flow
  document.querySelectorAll("[data-pub]").forEach(b => b.addEventListener("click", async () => {
    const id = b.dataset.pub, url = document.querySelector('[data-url-in="'+id+'"]').value.trim();
    const st = document.querySelector('[data-status="'+id+'"]'); if (!url) return;
    st.textContent = "reading…"; st.classList.remove("err");
    const res = await fetch("/studio/"+token(id)+"/preview", {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({url})});
    const pv = document.querySelector('[data-preview="'+id+'"]');
    if (res.ok) { preview[id] = await res.json(); }
    else { preview[id] = {url, title:url, description:"", image_url:"", site_name:"", domain:new URL(url).hostname.replace(/^www\\./,""), kind:"link", category:"Misc"}; st.textContent="couldn't read it — publish bare?"; st.classList.add("err"); }
    const p = preview[id];
    pv.querySelector("[data-pv-title]").textContent = p.title; pv.querySelector("[data-pv-desc]").textContent = p.description||"";
    pv.querySelector("[data-pv-domain]").textContent = p.site_name||p.domain;
    pv.querySelector("[data-pv-thumb]").innerHTML = p.image_url ? '<img src="'+p.image_url.replace(/"/g,"&quot;")+'" alt="">' : "→";
    document.querySelector('[data-cat="'+id+'"]').value = p.category; pv.classList.add("show");
    if (res.ok) st.textContent = "";
  }));
  document.querySelectorAll("[data-confirm]").forEach(b => b.addEventListener("click", async () => {
    const id = b.dataset.confirm, p = preview[id]; if (!p) return;
    p.category = document.querySelector('[data-cat="'+id+'"]').value; p.note = document.querySelector('[data-note="'+id+'"]').value.trim();
    b.disabled = true;
    const res = await fetch("/studio/"+token(id)+"/items",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(p)});
    if (res.ok) location.reload(); else { document.querySelector('[data-status="'+id+'"]').textContent="publish failed"; b.disabled=false; }
  }));
  document.querySelectorAll("[data-toggle]").forEach(b => b.addEventListener("click", async () => {
    await fetch("/studio/"+token(b.closest(".feed-panel").dataset.panel)+"/items/"+b.dataset.toggle+"/toggle",{method:"POST"}); location.reload();
  }));
  document.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", async () => {
    if(!confirm("Delete permanently?"))return;
    await fetch("/studio/"+token(b.closest(".feed-panel").dataset.panel)+"/items/"+b.dataset.del+"/delete",{method:"POST"}); location.reload();
  }));
  // queue: approve / dismiss captured items
  document.querySelectorAll("[data-approve]").forEach(b => b.addEventListener("click", async () => {
    b.disabled = true;
    const res = await fetch("/queue/"+b.dataset.approve+"/approve",{method:"POST"});
    if (res.ok) b.closest(".card").remove(); else b.disabled = false;
  }));
  document.querySelectorAll("[data-dismiss]").forEach(b => b.addEventListener("click", async () => {
    b.disabled = true;
    const res = await fetch("/queue/"+b.dataset.dismiss+"/dismiss",{method:"POST"});
    if (res.ok) b.closest(".card").remove(); else b.disabled = false;
  }));
  // spotify connection controls
  $("#sp-sync")?.addEventListener("click", async (e) => {
    e.target.disabled = true; e.target.textContent = "syncing…";
    const r = await fetch("/connect/spotify/sync",{method:"POST"});
    const j = await r.json().catch(()=>({}));
    if (r.ok && j.added) location.reload();
    else { e.target.textContent = r.ok ? "nothing new" : "sync failed"; setTimeout(()=>{e.target.textContent="Sync now";e.target.disabled=false;},2500); }
  });
  $("#sp-auto")?.addEventListener("change", async (e) => {
    await fetch("/connect/spotify/auto",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({on:e.target.checked})});
  });
  $("#sp-disconnect")?.addEventListener("click", async () => {
    if(!confirm("Disconnect Spotify? Captured items already published stay."))return;
    await fetch("/connect/spotify/disconnect",{method:"POST"}); location.reload();
  });`;
  return layout(`Dashboard — ${BRAND}`, member ? "#7c6cff" : "#7c6cff", body, js, DASH_CSS);
}

export function loginPage(msg = ""): string {
  const body = `
  <div class="site-top"><a class="wordmark" href="/"><b>·</b> ${esc(BRAND.toLowerCase())}</a></div>
  <div style="padding:60px 0;max-width:38ch">
    <h1 style="font-size:26px;letter-spacing:-0.02em">Members' entrance</h1>
    <p class="prose" style="margin-top:10px">${esc(BRAND)} membership is reviewed. When you're approved we send you a personal sign-in link — that link logs you in and brings you here.</p>
    ${msg ? `<p class="pub-status err" style="margin-top:12px">${esc(msg)}</p>` : ""}
    <p class="dash-links" style="margin-top:20px"><a href="/#waitlist">Not a member yet? Apply →</a></p>
  </div>`;
  return layout(`Sign in — ${BRAND}`, "#7c6cff", body);
}
