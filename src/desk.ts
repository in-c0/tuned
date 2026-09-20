// The Morning Desk (/today) — the daily-return surface. Merges everything new from the
// feeds a member follows (their agents, and later other members), deduped, since last
// visit. Two-tap triage: star = republish to your own feed with "via @agent" provenance
// (the agent foraged, you read and ratified — the attention is honestly yours);
// skip = seen, don't show again. Signals accumulate into per-agent hit-rates and
// charters, which agents fetch before their next run. Reading IS steering.

import { layout, esc, lastPublished, lastPublishedClause, BRAND, type Creator, type Item } from "./pages";
import type { Member } from "./auth";

export interface DeskItem extends Item {
  handle: string;
  agent_name: string;
  agent_kind: string;
  read_action: string | null; // star | skip | null
  also: string[];             // other agents that found the same URL
}

export interface AgentStats {
  creator: Creator;
  found7d: number;
  /** The feed's newest public item, or null if it has never published. Not a statistic about the
   *  member — the age every other offer surface on this site already reports (L-18, run 172). */
  lastItemAt: string | null;
  starred7d: number;
  skipped7d: number;
}

/** **No rule in this block changed, and the first attempt at this run's change changed two.**
 *
 *  The feed age below started out appended to `.agent-h .hit`, the stat span in the feed header.
 *  Browser QA at 390px is the only reason it is not there: `.agent-h` is a flex line ending in
 *  `.rule { flex: 1 }`, so the stat is the one item with slack, and four extra words squeezed it
 *  into a ~90px column that broke into three lines — "0 this week · last" / "published 52" /
 *  "days ago · unrated" — with the avatar, the handle and the steer/remove controls stranded
 *  around it. **Nothing overflowed**, so the document-overflow check read clean straight through
 *  it; that is precisely how run 172's orphaned full stop shipped.
 *
 *  `flex-wrap: wrap` plus `flex: none` fixed the squeeze and orphaned *"remove"* onto a third
 *  line instead. The right answer was not a third CSS rule on a page with two dated blocks
 *  already waiting to be folded in: it was that **the age belongs on the sentence that reports
 *  nothing**, which is a full-width block with no flex row to break, and which is the one place a
 *  reader is actually asking the question. Two rules reverted, zero added. */
const DESK_CSS = `
<style>
.desk-head { padding: 26px 0 6px; }
.desk-head h1 { font-size: 24px; letter-spacing: -0.02em; }
.desk-head .sub { color: var(--faint); font-size: 13px; margin-top: 4px; }
.streak {
  display: inline-flex; gap: 5px; align-items: center; margin-top: 12px;
  font-size: 12px; color: var(--muted);
}
.streak .cell { width: 16px; height: 16px; border-radius: 4px; background: var(--panel); border: 1px solid var(--line); }
.streak .cell.hit { background: var(--accent); border-color: var(--accent); }
.streak .cell.today-pending { border-color: var(--accent); border-style: dashed; }
.agent-h { display: flex; align-items: center; gap: 10px; margin: 26px 0 10px; }
.agent-h .avatar { width: 30px; height: 30px; font-size: 13px; border-radius: 50%; }
.agent-h h2 { font-size: 14px; }
.agent-h .hit { font-size: 11.5px; color: var(--faint); }
.agent-h .rule { flex: 1; height: 1px; background: var(--line); }
.agent-h a { font-size: 12px; color: var(--faint); }
.desk-follow { display: inline; margin: 0; }
.desk-follow .linkish {
  background: none; border: 0; padding: 0; cursor: pointer;
  font: inherit; font-size: 12px; color: var(--faint);
}
.desk-follow .linkish:hover { color: var(--text); text-decoration: underline; }
.suggest { margin: 34px 0 10px; }
.suggest h2 { font-size: 13px; color: var(--muted); font-weight: 500; margin-bottom: 10px; }
.suggest-row {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px; margin-bottom: 8px;
  border: 1px solid var(--line); border-radius: 12px; background: var(--panel);
}
.suggest-row .avatar { width: 30px; height: 30px; font-size: 13px; border-radius: 50%; flex: none; }
.suggest-who { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.suggest-who a { font-size: 14px; color: var(--text); }
.suggest-who .hit { font-size: 11.5px; color: var(--faint); }
.desk-card { position: relative; }
.desk-card .body { padding-right: 4px; }
.triage { display: flex; flex-direction: column; gap: 6px; flex: none; justify-content: center; }
.tri-btn {
  width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--line);
  background: var(--panel2); color: var(--muted); font-size: 17px; cursor: pointer;
  display: grid; place-items: center; transition: all .12s;
}
.tri-btn:hover { border-color: var(--accent); color: var(--text); }
.tri-btn.starred { background: var(--accent); border-color: var(--accent); color: #fff; }
.tri-btn.skipped { opacity: .5; }
.desk-card.done { opacity: .38; }
.desk-card.done .thumb, .desk-card.done h3 { filter: saturate(.5); }
.also { font-size: 11.5px; color: var(--faint); }
.all-done {
  text-align: center; padding: 44px 0; color: var(--muted); font-size: 14px;
}
.all-done b { color: var(--text); }
.charter-box { margin-top: 8px; display: none; }
.charter-box.show { display: block; }
.charter-box textarea {
  width: 100%; min-height: 64px; background: var(--panel); border: 1px solid var(--line);
  color: var(--text); border-radius: 10px; padding: 10px 12px; font-family: inherit; font-size: 13px;
}
.new-badge { font-size: 10px; font-weight: 700; letter-spacing: .08em; color: var(--accent); }
</style>`;

function deskCard(it: DeskItem): string {
  const done = it.read_action !== null;
  return `<div class="card desk-card${done ? " done" : ""}" data-desk-item="${it.id}">
    <div class="thumb">${it.image_url ? `<img src="${esc(it.image_url)}" alt="" loading="lazy" onerror="this.remove()">` : "→"}</div>
    <div class="body">
      <div class="meta">
        <span>${esc(it.site_name || it.domain)}</span><span>·</span><span class="time" data-t="${esc(it.created_at)}"></span>
        ${it.also.length ? `<span class="also">also found by ${it.also.map((a) => "@" + esc(a)).join(", ")}</span>` : ""}
      </div>
      <h3><a href="${esc(it.url)}" target="_blank" rel="noopener">${esc(it.title)}</a></h3>
      ${it.note ? `<div class="note">${esc(it.note)}</div>` : it.description ? `<div class="desc">${esc(it.description)}</div>` : ""}
    </div>
    <div class="triage">
      <button class="tri-btn${it.read_action === "star" ? " starred" : ""}" data-star="${it.id}" title="Star — read it, keep it, republish to your feed">★</button>
      <button class="tri-btn${it.read_action === "skip" ? " skipped" : ""}" data-skip="${it.id}" title="Skip — seen, not for me">✕</button>
    </div>
  </div>`;
}

/** A public feed the member does not follow yet, with the count that makes it worth offering and
 *  the date that says what the count is worth. */
export interface DeskSuggestion extends Creator {
  public_items: number;
  last_item_at: string | null;
}

/** How old a feed's newest public item is, for the suggestion row.
 *
 *  The same reading `lastPublishedClause()` gives the follow block and both follow dialogs, in the
 *  shape this span can carry: the row is a `·`-separated list and not prose, so it takes the list
 *  form rather than the sentence one. Bare text in an element that already exists, so it adds no
 *  rule to `DESK_CSS`.
 *
 *  It is here because the suggestion row was built one run after run 172 put that disclosure on
 *  every other surface that offers a feed — L-93's shape exactly, a correction finished at the
 *  surfaces that existed when it was made. It is the offer with the loudest number and, until
 *  now, the least context: `19 finds`, with no hint that the newest of them is from July.
 *
 *  Unconditional, with no threshold and no change of tone above one — a cut point chosen here
 *  would be a number fitted to the five feeds this executor can see (EXP-013 Fork B). Empty for a
 *  feed that has never published: the row's own `0 finds` already says that, and "last published
 *  never" is the age of nothing. */
function staleClause(lastItemAt: string | null | undefined): string {
  const words = lastPublished(lastItemAt);
  return words ? ` · last published ${esc(words)}` : "";
}

/** The control that puts a feed on this desk, or takes it off again.
 *
 *  A real form with a real action, and not a fetch behind a click handler. Three reasons, in the
 *  order they matter: it works with JavaScript off, it is exactly what the browser submits so
 *  there is no second code path to keep honest, and the endpoint is legible in the delivered HTML
 *  — which is what lets a test read the offer the member is shown instead of asserting against a
 *  path it made up. The desk's offer being unreadable is how "follow more feeds" sat here for
 *  weeks as an instruction with nothing behind it. */
function deskForm(handle: string, remove: boolean, label: string, cls: string): string {
  return `<form method="post" action="/${esc(handle)}/desk" class="desk-follow">${
    remove ? `<input type="hidden" name="remove" value="1">` : ""
  }<button class="${cls}" type="submit">${esc(label)}</button></form>`;
}

export function deskPage(
  member: Member,
  groups: Array<{ stats: AgentStats; items: DeskItem[] }>,
  streak: boolean[], // last 7 days, oldest first; today = last element
  newCount: number,
  ownHandle: string | null,
  suggestions: DeskSuggestion[] = []
): string {
  const dateStr = new Date().toUTCString().slice(0, 16);
  const triagedToday = streak[streak.length - 1];
  const streakDays = streak.filter(Boolean).length;

  const groupHtml = groups
    .map(({ stats, items }) => {
      const rate = stats.starred7d + stats.skipped7d > 0
        ? Math.round((stats.starred7d / (stats.starred7d + stats.skipped7d)) * 100) + "% starred"
        : "unrated";
      return `
      <div class="agent-h">
        <div class="avatar" style="background:linear-gradient(135deg,${esc(stats.creator.accent)},#2b2b3d)">${esc(stats.creator.name.slice(0, 1))}</div>
        <h2>@${esc(stats.creator.handle)}</h2>
        <span class="hit">${stats.found7d} this week · ${rate}</span>
        <div class="rule"></div>
        <a href="#" data-charter-toggle="${stats.creator.id}">steer</a>
        ${deskForm(stats.creator.handle, true, "remove", "linkish")}
      </div>
      <div class="charter-box" data-charter-box="${stats.creator.id}">
        <textarea data-charter-text="${stats.creator.id}" placeholder="Charter notes for @${esc(stats.creator.handle)} — what to hunt more of, less of. The agent reads this before every run.">${esc(stats.creator.charter ?? "")}</textarea>
        <div style="display:flex;gap:8px;margin-top:6px"><button class="btn small primary" data-charter-save="${stats.creator.id}">Save charter</button><span class="pub-status" data-charter-status="${stats.creator.id}"></span></div>
      </div>
      ${items.map(deskCard).join("") || `<div class="empty" style="padding:12px 0">Nothing new from @${esc(stats.creator.handle)}${lastPublishedClause(stats.creator.handle, stats.lastItemAt)}</div>`}`;
    })
    .join("");

  // Offered whether or not the desk is empty, because "which attention am I following" is the
  // steering decision this product is about, not a one-time onboarding step. The heading is the
  // only part that changes: on an empty desk this is the way out of it, and on a full one it is
  // the way to widen it.
  const suggestionHtml = suggestions.length
    ? `
  <div class="suggest">
    <h2>${groups.length ? "More attention to follow" : "Feeds you can add"}</h2>
    ${suggestions
      .map(
        (s) => `
      <div class="suggest-row">
        <div class="avatar" style="background:linear-gradient(135deg,${esc(s.accent)},#2b2b3d)">${esc(s.name.slice(0, 1))}</div>
        <div class="suggest-who">
          <a href="/${esc(s.handle)}">@${esc(s.handle)}</a>
          <span class="hit">${s.kind === "agent" ? "agent" : "human"} · ${s.public_items} find${s.public_items === 1 ? "" : "s"}${staleClause(s.last_item_at)}</span>
        </div>
        ${deskForm(s.handle, false, "Add to desk", "btn small primary")}
      </div>`
      )
      .join("")}
  </div>`
    : "";

  // "N finds waiting", not "N new since your last visit".
  //
  // `newCount` has never been a reading taken since the last visit. It is, and always was, the
  // number of rendered items this member has not triaged — `members.last_desk_at` is written on
  // every arrival at `/today` and read by nothing. The old label was wrong before the window
  // changed and would have been wronger after it, since the set it counts now includes finds
  // older than a week. The one rule this project does not bend is that a number on a page says
  // what it is: no forecast presented as a reading, and no reading presented as a different one.
  const body = `
  <div class="site-top">
    <a class="wordmark" href="/"><b>·</b> ${esc(BRAND.toLowerCase())}</a>
    <span class="rss"><a href="/home">manage feeds</a> · <a href="/logout">log out</a></span>
  </div>
  <div class="desk-head">
    <h1>Today</h1>
    <div class="sub">${esc(dateStr)} · ${newCount} find${newCount === 1 ? "" : "s"} waiting · star it to make it yours, skip what isn't</div>
    <div class="streak" title="Days with at least one triage in the last 7">
      ${streak.map((hit, i) => `<span class="cell${hit ? " hit" : i === streak.length - 1 ? " today-pending" : ""}"></span>`).join("")}
      <span>${streakDays}/7 day${streakDays === 1 ? "" : "s"}${triagedToday ? "" : " — today's open"}</span>
    </div>
  </div>
  ${groupHtml || `<div class="all-done"><b>Your desk is empty.</b> ${
    suggestions.length
      ? "You aren't following anything yet — add a feed and everything it finds lands here."
      : "You aren't following anything yet, and there is no public feed to add right now."
  }</div>`}
  ${suggestionHtml}
  <div class="all-done" id="clear-msg" style="display:none"><b>Desk clear.</b> Everything triaged${ownHandle ? ` — starred items are live on <a href="/${esc(ownHandle)}" target="_blank" style="text-decoration:underline">your feed</a>` : ""}.</div>`;

  const js = /* js */ `
  document.querySelectorAll(".time[data-t]").forEach(el => {
    const s = (Date.now() - new Date(el.dataset.t).getTime())/1000;
    el.textContent = s<3600?Math.max(1,Math.floor(s/60))+"m ago":s<86400?Math.floor(s/3600)+"h ago":Math.floor(s/86400)+"d ago";
  });
  async function triage(id, action, btn) {
    const card = btn.closest(".desk-card");
    const res = await fetch("/read/"+id, {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action})});
    if (!res.ok) return;
    card.classList.add("done");
    card.querySelectorAll(".tri-btn").forEach(b=>b.classList.remove("starred","skipped"));
    btn.classList.add(action==="star"?"starred":"skipped");
    if (![...document.querySelectorAll(".desk-card")].some(c=>!c.classList.contains("done")))
      document.getElementById("clear-msg").style.display="block";
  }
  document.querySelectorAll("[data-star]").forEach(b=>b.addEventListener("click",()=>triage(b.dataset.star,"star",b)));
  document.querySelectorAll("[data-skip]").forEach(b=>b.addEventListener("click",()=>triage(b.dataset.skip,"skip",b)));
  document.querySelectorAll("[data-charter-toggle]").forEach(a=>a.addEventListener("click",(e)=>{
    e.preventDefault();
    document.querySelector('[data-charter-box="'+a.dataset.charterToggle+'"]').classList.toggle("show");
  }));
  document.querySelectorAll("[data-charter-save]").forEach(b=>b.addEventListener("click",async()=>{
    const id=b.dataset.charterSave, st=document.querySelector('[data-charter-status="'+id+'"]');
    const res=await fetch("/api/agents/"+id+"/charter",{method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({charter:document.querySelector('[data-charter-text="'+id+'"]').value})});
    st.textContent = res.ok ? "saved — the agent reads this before its next run" : "save failed";
  }));`;
  return layout(`Today — ${BRAND}`, "#7c6cff", body, js, DESK_CSS);
}
