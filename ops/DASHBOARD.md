# Tuned — OWNER DASHBOARD

**Public repository, no Tuned route.** This file lives in `in-c0/tuned`, which the owner **made public
on 2026-08-09**, and is served on no Tuned route. It said "Private" until run 26; that was written when
the repository was private and was simply never revisited. Write nothing here you would not publish.

**This is a mirror, not a source of truth.** Every number here is copied from a canonical file and
linked back to it. If this file and a canonical file disagree, **the canonical file is right and this
one is stale** — see [Freshness](#8-last-materially-updated-and-freshness).

| Question | Answered in | Canonical source |
| --- | --- | --- |
| What must I do? | [§1](#1-owner-action-required) | [STATUS.md](STATUS.md) |
| Where are we? | [§2](#2-current-phase-and-single-objective) | [STATUS.md](STATUS.md) |
| Nearest milestone? | [§3](#3-milestone-horizons) | [MILESTONES.md](MILESTONES.md) |
| What are the numbers? | [§4](#4-funnel-revenue-and-spend) | [METRICS.md](METRICS.md) · [`metrics/latest.json`](metrics/latest.json) |
| What is blocked? | [§5](#5-blockers-ordered-by-leverage) | [STATUS.md](STATUS.md) |
| What is being tested? | [§6](#6-current-experiment) | [EXPERIMENTS.md](EXPERIMENTS.md) |
| What did we learn? | [§7](#7-latest-three-lessons) | [LESSONS.md](LESSONS.md) |

> # **Google's one-line summary of Tuned called it "a live page". Four of our five feeds hadn't published in eight weeks — and a test we wrote was requiring that sentence to stay.**
>
> **What this is about.** The single sentence a search engine shows underneath `justtuned.com` in a
> result. Every site supplies that sentence itself, in a hidden line; ours said *"Tuned — follow
> attention, not content. **A live page** of what someone is actually watching, reading and listening
> to."*
>
> **Why that one word is a problem and not a flourish.** It is the only sentence in this whole system
> that gets **copied away from the page**. A search result and a link preview reproduce it on their
> own, with none of our page around it. Everywhere else on the site we state how old each feed is, and
> we derive it from the data so it can never be wrong — but none of that travels with the copied
> sentence. So a stranger met the word *live* alone, about feeds that had been silent for eight weeks.
>
> **We had already decided this, twice, and it did not reach here.** Six weeks ago I removed the same
> word from the same hidden line on the **feed** pages, for exactly this reason. Two days ago the
> heading over the feed list stopped saying "Live feeds". The homepage's version survived both.
>
> **The part worth your attention is why it survived.** When I removed it the first time I also wrote
> a guard meant to stop it coming back — but I built that guard out of the exact phrases I had just
> deleted, including *"a live feed of"*. The homepage says *"a live **page** of"*. **One noun
> different, and it walked straight through.** A guard built from the sentences you just fixed only
> ever catches those sentences, and the next person writing copy is not copying the sentence you
> deleted.
>
> **And a test was actively holding the bad sentence in place.** A check written back in August said
> "keep the reviewed homepage copy exactly as it is" — sensible then, because that change was about
> something else and had no business editing copy. But after the copy was ruled wrong elsewhere, that
> check had quietly turned into *a requirement that the mistake stay*. So this wasn't a thing we
> missed; it was a thing we were defending.
>
> **Fixed and deployed.** The sentence now says what the page **is** and claims nothing about how
> current it is. I did **not** replace it with a date: that sentence gets copied, and a copied "last
> published 52 days ago" freezes at whatever it said the day it was copied, which is the same mistake
> one step along.
>
> **What did *not* change, deliberately.** Four other places on the site use the word "live" — the
> footer, the demo heading, the studio, and "your RSS link works right now". All of them sit on the
> page itself, beside the real dates, and they describe **what kind of thing this is** rather than how
> fresh it is. Those are fine and I left them alone. The test is *where the sentence ends up*, not
> which words it contains.
>
> **How it's checked now.** Not by banning phrases. The check reads our sitemap — our own list of
> every page we ask Google to index — fetches each one, and refuses any freshness claim in the
> copied sentence. Nothing is typed into the check, so a page type added next month is covered the
> day it exists. I proved it by breaking it five ways, including planting the claim on a *find* page,
> which nothing had ever checked: it caught that and named the URL.
>
> **No commercial number moves** — `applications` 0 · `members` 1 (you) · `followers` 0 · cash
> **AUD $0**. What today buys is that the first sentence a stranger reads about Tuned is one we can
> keep true.
>
> **Also today:** @sportstech published its daily find (item 287) — the scheduled screen read 34
> papers, selected 8, and the top one went out with a quote from the paper's own results.
>
> **Nothing here needs you.** [§1](#1-owner-action-required) is unchanged: ONE, undeadlined, not
> re-argued.

---

> # **Paste `justtuned.com` into any feed reader and it told you this site has no feed. All five of them were live.**
>
> **What this is about.** The homepage — `justtuned.com` itself. Not a feed this time, but the one
> address everything else points at: it is what our own pages declare as the real address, what the
> sitemap says, what the repository README links to, and what anybody would type or paste after
> hearing the name.
>
> **The setup.** There is a standard, invisible line every website with a feed puts in its page so
> that software can find it. It is how "paste a website address into a feed reader and it offers you
> the feed" works at all — for *every* reader, every aggregator, every feed directory. Seven weeks
> ago I added that line to our feed pages, and later to every individual find page. **I never added
> it to the homepage.**
>
> **So the homepage said two completely different things depending on who asked.** A person opening
> it saw five feeds listed, each with a "last active" line, each clickable — everything working. A
> feed reader handed the same address read the page and was told, correctly as far as it could tell,
> **that this site has no feed at all.** Nobody could catch this by looking, because looking is what
> the page does well.
>
> **Why it matters commercially rather than cosmetically.** Two of the three ways anyone would ever
> subscribe start here: somebody hears about Tuned and types the domain into their reader, or a feed
> directory is given the domain and resolves it. Both got *no feed found*. The third way — pasting a
> feed URL directly — is the one your pending paste uses, and it worked.
>
> **The pattern underneath it, which is why I think it was worth a cycle.** My earlier fix was scoped
> to "the pages that **have** a feed", and the homepage is not one of them — it is the page that
> **leads to** them. That scope was never wrong, it just quietly excluded the entry point, which is
> exactly where it costs the most. Our own find pages had already been following the broader rule for
> a week and nothing noticed the contradiction.
>
> **Fixed, deployed, and checked the way it should be.** The homepage now advertises **every** feed
> it lists, in the same order, each under its own name so a reader's picker can tell them apart. The
> check does not ask "is the line there" — one line would satisfy that while hiding four feeds. It
> plays the whole reader: read the page, collect every feed offered, **fetch each one**, and require a
> real, *different*, working feed back for each. Neither the page's list nor the expected list is
> written into the check; both are read off the live page, so a sixth feed is checked the day it
> exists.
>
> **Three times this run I caught a comment claiming more than its code did** — including twice in
> checks I wrote today, found only by deliberately breaking each one to see whether it went red.
> That is the durable lesson, and it is filed as [L-109](LESSONS.md#l-109).
>
> **No commercial number moves** — `applications` 0 · `members` 1 (you) · `followers` 0 · cash
> **AUD $0**. Nobody failed to subscribe yesterday, because almost nobody is trying. What today
> bought is that the front door works for software before anyone is sent to it.
>
> **Nothing here needs you.** [§1](#1-owner-action-required) is unchanged: ONE, undeadlined, not
> re-argued.

---

> # **Our feed told whoever asked for it that Tuned lives at whatever address they used — including the throwaway `workers.dev` one. A directory listing us would have published that address.**
>
> **What this is about.** The same file as yesterday: `justtuned.com/sportstech/rss.xml` and its four
> siblings — still the **only subscription this site can currently complete**, and still the exact URL
> the one thing I keep asking you to paste would point at.
>
> **The setup.** Tuned answers on three addresses: `justtuned.com`, `www.justtuned.com`, and an ugly
> auto-generated `attention-feed.in-c0.workers.dev`. All three serve the identical site. Every normal
> web page here already declares which one is the real one, so search engines don't treat us as three
> different sites.
>
> **The defect.** An RSS feed carries one field whose job is to say *"and here is the website this feed
> belongs to."* That field was being filled in with **whichever address the reader happened to ask
> from**. Ask via `workers.dev`, and the feed you got back said Tuned lives at `workers.dev`.
>
> **Why that matters commercially rather than cosmetically.** A feed directory — the kind your pending
> paste would list us in — fetches the feed once and **copies that field into its listing as our
> address**. So the address we'd be advertised under was decided by whichever of our three hosts their
> crawler happened to reach first. It could permanently have been the throwaway one.
>
> **The bit I want to flag, because it is a pattern and not an accident.** A note in our own code, from
> seven weeks ago, said this field was *fine* to fill in from the request. That note was written when
> nothing in the feed was fixed yet — it was describing work not yet done. Two weeks ago I fixed half
> of it and **left the note standing over the other half**. Then a test copied the note's wording in as
> a rule. So an "I haven't got to this yet" quietly became a "this is how it should be", guarded by a
> test, and every time I re-read that file it looked deliberate. I have corrected both sentences rather
> than deleting them, so the next pass can't re-derive the same excuse.
>
> **Fixed and deployed today**, and checked the way yesterday's lesson says to: the test now asks for
> the same feed as all three hosts and demands the **bytes come back identical** — then checks they
> agree on the *right* address, because three hosts agreeing on `workers.dev` would pass a
> naive comparison and still be the bug.
>
> **Also today: the agent published.** A scheduled screen read 34 new papers, rejected 17, selected 7,
> and read 12 full texts; I checked its record and released the top one — find **286**, on basketball
> sprint mechanics, with a 146-character quotation lifted verbatim from the paper's own results. That
> is `items_public` 91 → 92.
>
> **Being straight about the size of this: no commercial number moves.** `applications` 0 · `members` 1
> (you) · `followers` 0 · cash **AUD $0**. Nobody was reading the feed from the wrong host, because
> almost nobody is reading the feed. What today bought is that the address a directory would publish us
> under is now ours, before the listing exists rather than after.
>
> **Nothing here needs you.** [§1](#1-owner-action-required) is unchanged: ONE, undeadlined, not
> re-argued.

---

> # **One invisible character in one find would have silently killed your entire RSS feed for everyone subscribed to it. Nothing we had ever written would have noticed.**
>
> **What this is about.** `justtuned.com/sportstech/rss.xml` and its four siblings. That address is
> the **only subscription this site can currently complete** — the email "Follow" button writes a row
> nothing reads — and it is the exact URL the one thing I keep asking you to paste would point at.
>
> **The defect, in plain terms.** XML — the format an RSS feed is written in — flatly forbids a
> handful of invisible "control" characters. There is no way to write them safely: the usual trick of
> escaping a character doesn't work, because the format bans them **however you spell them**. And an
> XML reader has no way to recover. It hits one, and it **stops**.
>
> So: one stray invisible character, in **one** find's title or link or note, and every reader
> subscribed to that feed loses **the entire feed** — including finds published weeks earlier.
> Meanwhile the ordinary web page at `/sportstech` keeps rendering perfectly, so the site looks
> completely healthy. I measured it rather than argued it: on a test feed of four finds with one
> character planted in it, a real reader recovered **zero of the four**.
>
> **Where those characters come from is not exotic.** Five different paths write finds into Tuned and
> **not one of them checked**. The agent's own "why this" line is a sentence quoted verbatim out of a
> research paper's full text — which is exactly the kind of text that carries invisible typesetting
> residue.
>
> **The part I think is actually worth your attention.** That feed was *well* covered: dozens of
> automated tests, two production checks, three browser checks. **Every single one of them asked what
> the feed CONTAINS** — does this word appear, does that tag appear. **Not one of them ever tried to
> read it as a document.** So the one thing a subscriber actually depends on — that it can be read at
> all — was the one thing nothing checked. It is the same mistake as last week's search finding: we
> kept grading the ingredients and never tasted the dish.
>
> **Fixed and deployed today**, and now checked the right way: on every single deploy, a real XML
> parser fetches every live feed and refuses the deploy if any of them fails to parse.
>
> **Being straight about the size of this: no number moves.** Nothing was broken in production today —
> this is a trap that had not yet been sprung, on a feed almost nobody is subscribed to. `applications`
> 0 · `members` 1 (you) · `followers` 0 · cash **AUD $0**. What today bought is that the one channel
> your pending paste points at cannot quietly die the first time a paper has a bad character in it.
>
> **Nothing here needs you.** [§1](#1-owner-action-required) is unchanged: ONE, undeadlined, not
> re-argued.

---

> # **I found a number in our own files that says the feed went eight and a half days without publishing — against a bar of three. It had been sitting there, readable, the whole time.**
>
> **What happened, in one sentence.** The experiment I have been running on your one working agent
> has a rule — *"the newest find must never be more than 72 hours old"* — and the instrument I built
> for it said that rule could only be checked against the live site, which this session is blocked
> from reaching. **So it went unchecked.** Today I noticed that was only half true.
>
> **The half that was wrong.** To prove the feed *stayed* fresh, yes, you need the live site. But to
> prove it *went stale*, you need nothing but the publication dates already saved in our own
> repository. Between find 281 and find 282 there are **203.8 hours** — eight and a half days —
> against a 72-hour bar. **2.8 times over.** No live site required; it is subtraction.
>
> **The lesson, which is the part worth your time.** *"I cannot reach the thing that checks this"* is
> not the same as *"this cannot be checked."* A rule can often be **broken** using cheap evidence and
> only **confirmed** using expensive evidence. I deferred the whole question to the evidence I lacked
> and threw away the half I had.
>
> **Now the uncomfortable part, and it is about my own experiment rather than your agent.** That
> 72-hour rule also says the finds must publish *without a person pressing anything*. But on the very
> first day of this experiment, a different rule failed and my own pre-written response was to **turn
> the automatic publisher off**. Every find since has needed me to press the button.
>
> **So the rule was unpassable from day one — by my own hand.** Once the publisher is off, "publishes
> without a person" can only fail, and it fails whether your agent is good or bad. **It measures my
> experiment's design, not your agent.** Had I read it the obvious way on Friday I would have told you
> "the agent still needs a person", which is true and would have been **evidence for nothing**. I have
> written that into the record so Friday's reading cannot quietly claim it.
>
> **Nothing published, nothing changed on the site.** No visitor sees a different byte today — this
> touched only the measuring tools. Find 285 from yesterday is still the newest.
>
> **Being straight about the size of this: no number moves.** There is still one member and it is
> you. `applications` 0 · `followers` 0 · cash AUD $0. What today bought is that **Friday's reading —
> the last experiment this loop will grade — will not report a tautology as a finding.**
>
> **Nothing here needs you.** [§1](#1-owner-action-required) is unchanged: ONE, undeadlined, not
> re-argued.
---

> # **The desk could be filled, and everything you could fill it with was invisible to it. Fixed today.**
>
> **What was broken.** The Morning Desk only shows finds from the **last seven days**. That is the
> right rule for a page you read every morning — and right now **not one find on this whole site is
> less than seven days old.** There are 87 published finds across five feeds: three of them last
> published on **30 July**, `ava` on **4 August**, and `sportstech` — the freshest — **eight days
> ago**.
>
> **So the desk was empty no matter what anyone did.** Yesterday's two runs made it possible to add a
> feed to your desk, and put that button on all 87 find pages. Someone who pressed it was sent
> straight to a desk showing *"Nothing new from @wearables"* — **immediately after clicking a row that
> said "19 finds."** No feed, no person and no amount of following could have produced anything else.
>
> **The offer counted one thing and the desk counted another.** The button counted a feed's finds
> all-time; the desk counted the last week. Neither was lying on its own.
>
> **What shipped.** A find you have **never triaged** is no longer hidden by the seven-day window. The
> moment you star or skip it, it goes back under that window and does not come back tomorrow — so the
> desk stays a daily page and does not turn into an archive. That second half is the part I tested
> hardest, because getting it wrong is the obvious way this change goes bad.
>
> **Two sentences on the page were also saying less than they knew.** The desk said *"N new since your
> last visit"* for a number that has never been measured from your last visit — it is simply how many
> finds you have not triaged, so it now says *"N finds waiting."* And *"Nothing new from @handle"* was
> the same four words for a feed that published yesterday and one silent since July; it now says which.
>
> **How this got past two runs of checks.** The end-to-end test written two days ago is a good test —
> it walks one person from the signup form to starring a find. But it creates its one piece of test
> data **dated today**, and there is no such find on this site. A test that makes its own world fresh
> cannot see a rule about age. I already knew from a run two days earlier that four of five feeds
> stopped publishing in July, and wrote the fixture new anyway.
>
> **I also looked at this page in a browser, which nothing here has ever done.** The visual checks run
> against the live site, and the live site cannot log in — so no check in this repository has ever
> seen the Morning Desk. My first attempt at the staleness wording broke the layout on a phone
> without overflowing anything, so the automated check would have passed it. I reverted it and put the
> words somewhere that cannot break.
>
> **Being straight about the size of this: nobody has hit it.** Nobody has applied, so no number moves
> today.
>
> **Nothing here needs you.** [§1](#1-owner-action-required) is unchanged: ONE, undeadlined, not
> re-argued.
---

> # **Two pages on the site promised people an email, and Tuned has no way to send email. Fixed today.**
>
> **What it said.** When someone applied, the page told them *"you'll hear back by email."* When an
> approved member went to sign in, that page told them *"we send you a personal sign-in link."*
>
> **What is actually true.** Tuned has no mail setup at all — no email service connected, no account
> with one, no code anywhere that sends a message. A sign-in link is produced by an admin call and
> comes back in the response, for you to pass to the person yourself. Both sentences went live on
> 2026-08-06 and stood for 44 days.
>
> **Why I treated this as the run's job rather than a typo to tidy up.** We had already decided this
> and already fixed it — *once*. The Follow box on a feed page says plainly "Nothing sends until
> digests start", and last run's README says the email Follow does not send. So the loop knew, wrote
> the honest version, and put it on **one of the three places** that make the promise. The test suite
> even describes the sign-in page correctly, as an interstitial that asks you for a link — while the
> page itself told visitors the opposite. Nothing compared the two.
>
> **Being straight about the size of this: almost certainly nobody read either sentence.** Four
> rendering browsers in eleven days, and we're not in the search index. **No number moves because of
> this.** What changes is that the front door is no longer carrying a promise we can't keep — which
> matters the moment [§1](#1-owner-action-required) opens the door, not before.
>
> **The part worth your attention.** A check now reads *every* page a stranger can reach — worked out
> from the routes themselves, not from a list I wrote — and it fails in both directions: no page may
> promise email, and any page asking for an email address must say on that same page that nothing is
> sent to it. Deleting the honest sentence is as loud a failure as adding a dishonest one. It also
> runs against the live site after every deploy, not only in tests.
>
> **One thing only you can do, and I am deliberately not making it a third card.** Making those
> sentences *true* — actually emailing people — needs a mail provider account, which means a login and
> probably a small spend. Until that exists, approving a member is a manual job: read the applications
> endpoint, create the member, and send them the link yourself. Nobody has applied yet, so nothing is
> waiting on you today.
>
> **[§1](#1-owner-action-required) is unchanged: TWO, undeadlined, not re-argued here.**
---

> # **Eighty-seven pages on this site can be found by search or shared in a message. Not one of them had a way to follow anything.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What this is about.** Three days ago every find Tuned has published got its own web address —
> eighty-seven of them, against five feed pages and one front page. Those are the pages Google can
> index and the pages you'd paste into a message. They are, by a wide margin, the most likely first
> page a stranger ever sees of Tuned.
>
> **What was missing.** If someone landed on one, liked it, and wanted more of that person's
> attention — there was nothing to click. The only way to subscribe was a tiny "RSS" link in the top
> corner, which opens a page of raw code. You had to notice the @name was a link, click it, land on
> the feed, and find the button over there. Almost nobody does that.
>
> **What I changed.** Every one of those pages now has a "Follow" block: subscribe by RSS, which works
> today, or leave an email, which is clearly labelled as **not sending anything yet**. Same wording as
> the feed page, same honesty about which one actually does something.
>
> **What I deliberately did not do.** The big button on the page is still **"Open at
> runnersworld.com"** — the link to the thing the person actually paid attention to. The follow ask
> sits below it, and there is now a test that fails if anyone ever moves it above. Tuned's job is to
> send you to the source, not to keep you here; the day that flips, it's a different product.
>
> **Why now.** This is the step after arriving, and it's the only one that needs nothing from you —
> no application, no approval, no spend. Anyone can follow a public feed today.
>
> **A mistake of my own, on the record.** The test I wrote to guarantee the source link stays on top
> was **fake**. It searched the page's text for "open-cta", and that phrase also appears in the
> stylesheet at the very top of every page — so it was always going to pass, whatever order the page
> was in. I only found it because I deliberately broke the page to see if the test would notice. It
> didn't. It does now.
>
> **Still nothing sold, nobody signed up, 17 days left.** I can't tell you this brings anyone here —
> it doesn't create traffic and I'm not going to pretend otherwise. What it does is stop the most
> visited kind of page on the site from being a dead end.
>
> ---
>
> # **I went looking for yesterday's broken file on the front page. It isn't broken — and the checks that should have caught it if it were could not have.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What I said yesterday.** My check on the front page reported that something it asks for was
> failing to load — a 404 — and I had to tell you I could not say *what*, because my own check wrote
> down the complaint and not the filename. I put it first on the list. This is that.
>
> **What I found instead, which is bigger than the missing filename.** I went to find the test that
> should have caught a broken file and there wasn't one. Every browser check I have asks the browser
> *"did any request fail?"* — and **a 404 doesn't count as a failed request.** The server answered;
> it just answered "not found". So a missing file on our own site could have been broken on every
> single page, on every visit, and every check would have gone green and told you everything was
> fine. That is worse than a gap, because a green light you can't trust is the thing the checks exist
> to prevent.
>
> **And the news is good.** With the check fixed, I pointed it at the live site. **Nothing is
> broken.** The front page, the demo feed, both at desktop and phone size: no failing files at all.
> The two image files I suspected both load correctly. Yesterday's 404 does not happen any more —
> and I have to be straight with you, **it can never be identified now**, because the record that saw
> it didn't keep the name. That is the whole cost of yesterday's gap, and it's why I fixed it today.
>
> **One thing nobody could have caught, and it matters for sharing.** When you paste a Tuned link
> into Slack or iMessage, those apps fetch a preview image. **Your own browser never asks for that
> image** — so no browser check I could ever write would notice if it were missing, and every page
> without its own picture uses one shared file for it. I now fetch it deliberately and check it is
> really an image. It is: it loads fine, 80KB, correct type. Worth knowing, given that sharing is one
> of only two ways anyone can currently find Tuned.
>
> **A wrong turn I want on the record.** I was fairly sure I had found the culprit — the page asks
> for an icon file that, reading the code, nothing appears to serve. I nearly shipped the fix. The
> live site says it serves fine. The thing that made me confident was a date, and **the date was an
> artifact of how this copy of the code was downloaded**, not real history. I checked before changing
> anything, which is the only reason this isn't a "fix" for a problem that didn't exist.
>
> **Still nothing sold, nobody signed up, 17 days left.** This is plumbing, and it's the second time
> in three days I have spent a cycle on plumbing. **I've written down that the next one goes to
> getting people here, and I'd rather you hold me to that.**
>
> ---
>
> # **Anyone who subscribes to a Tuned feed has been getting the article — and no hint that a person or an agent chose it.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What I found.** Tuned publishes each feed as an RSS feed — the thing a reader app subscribes to,
> and the thing **both of the submissions waiting on you actually point at**. Opened in a reader, every
> item showed the article's headline, the article's link and the article's own summary. That is all.
> Nothing said *who noticed this*, nothing said *who chose it*, and there was no way to get to the page
> on Tuned that explains either. The whole point of Tuned — that a person or an agent paid attention to
> this, and you can see the chain — **was missing from the one surface people subscribe to.**
>
> **Why it mattered today rather than next week.** Two days ago I gave every find its own web address.
> The feed was written before that and had never been updated, so those addresses existed and the feed
> did not know about them. And the submission packet sitting in your queue submits exactly this feed —
> so what a directory's readers would have received is the version with nothing of Tuned in it.
>
> **What I changed.** Each item now carries one extra line — *"Observed by @wearables, read and chosen
> by @ava."* — and a link to that find's own page on Tuned, where the full chain is set out.
>
> **Three things I deliberately left alone**, because each is easy to break later without noticing:
> the item's main link still goes to **the original article**, not to us — sending every click to Tuned
> instead of to the thing the person actually paid attention to would be the product backwards. The
> hidden id each item carries is untouched, because changing those makes every reader re-deliver every
> item in every feed as if it were new. And the new link is **tested by actually fetching it**, since a
> perfectly-formed link to a missing page passes every test that only reads the text.
>
> **What I cannot tell you, stated up front.** If someone does follow that link from their reader, it
> arrives looking the same as any other visit from outside. Telling them apart needs a tracking tag on
> the link, and that sits inside a rule this loop set for itself after an earlier tag leaked and
> polluted a measurement. So I have shipped a change I can't grade, and I'd rather say that than
> imply otherwise.
>
> **The Wednesday measurement is on track.** The final check on the instrument behind it ran today and
> is clean, which was the last thing standing between it and Wednesday's reading. **I did not look at
> the number** — reading early is choosing the day. One small thing did change since the last check:
> something on the front page is now failing to load, a 404 on some file the page asks for. It can't
> affect Wednesday's number, and the page and form work fine — but my own check records *that* it
> happened without recording *what*, which is embarrassingly the exact lesson I wrote down yesterday.
> Next on the list.
>
> **Still nothing sold, nobody signed up, 18 days left.** This puts Tuned's actual subject on the
> surface people subscribe to, and on the surface both of your pending submissions point at. **It does
> not bring anyone here, and I am not claiming it will.**
>
> ---
>
> # **Yesterday's check found a fault, printed it in its own report, and still said everything was fine.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What happened yesterday.** I built a check that measures whether every public page fits a phone,
> ran it on the live site, and it reported **"0 pages broken"**. In the very same report, on the same
> page, it listed an artist's name on `/ava` — *"Jeff Goldblum & The Mildred Snitzer Orchestra, Ariana
> Grande"* — sticking **28 pixels past the edge of a 390-pixel phone screen**. Both of those were
> correct. The page really did fit; the name was being **cut off mid-word** instead of pushing the
> page wider, because the box it sits in is set to hide anything that overflows. I wrote the second
> number down as "next on the list" and shipped the deploy as verified.
>
> **The part I got wrong, and it is the lesson.** A check that looks at a lot and only *grades* a
> little is worse than one that looks at a little, because you trust its green light in proportion to
> how much you saw it examine. It had the evidence and was asking a narrower question of it. So the
> check now fails on anything reaching past the screen edge, not just on a page that is the wrong
> width — and the file says why, so nobody undoes it.
>
> **And it was worse than the live reading said.** When I rebuilt it locally to look properly, the
> same name measured identically — and I could see something the original report is simply incapable
> of showing: **the song title next to it had been squashed to nothing at all.** Not shortened —
> zero pixels wide, gone. The name was set never to break, so the title beside it was the only thing
> that could give way, and it gave way completely. Anyone on a phone saw a music row with **no song
> title** and an artist cut off after "Ariana".
>
> **What I fixed.** One styling rule. The artist's name can now break across lines instead of being
> one unbreakable block. I did not make it get cut off with a "…" — same reasoning as yesterday: on a
> product about who paid attention to what, shortening the name of the *artist* is the wrong trade.
> The title is back, and the full name is there over two lines.
>
>
> **Checked on the real site afterwards.** I measured all 16 public pages on a phone-sized browser
> after deploying — the front page, all five feeds, terms, privacy, and 8 find pages out of the 87 in
> the sitemap. **Nothing reaches past the screen edge on any of them**, `/ava` included. The same
> check was failing on the live site six minutes earlier, naming that exact artist's name, so this is
> a before-and-after and not a claim. The job's own log confirms the new build is the one serving.
>
> **What I did not touch.** The front page is **byte-for-byte identical**, so the measurement running
> until 19 September is completely unaffected by this — I have still not looked at its result. On a
> normal computer screen nothing moved at all: I measured every element on both pages before and
> after, and not one shifted. RSS untouched for the fifth run. No new counters — this is a fix, and
> there is nothing new to count.
>
> **Something I found while shipping it, written down rather than fixed.** The repository's automatic
> test suite **cannot pass on a pull request** — one test asks "is the code being served on the main
> branch?", which is never true on a side branch, so it fails by design there. It is green on the main
> branch, which is where it actually gates the deploy, and I proved that three separate ways before
> shipping. But a gate that cannot pass on the thing it is supposed to gate is a real problem, and
> quietly bundling that repair into a change I had just verified is precisely the habit this run
> exists to break. Next on the list, with the measurement taken.
>
> **The number that has not moved in forty-four days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **18 days left.** The two items in §1 are still the only
> things on this list that could produce a customer. This makes one card on your demo feed readable
> on a phone; **it does not bring anyone here, and I am not claiming it will.**
>
> ---
>
> # **Tuned's front page did not fit a phone screen, and the automatic check for exactly that problem said it was fine the whole time.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What was wrong.** I opened justtuned.com in a real phone-sized browser and measured it. The page
> needed 405 pixels of width on a 390-pixel phone; your `/ava` feed needed 436. When that happens,
> a phone browser does not let you scroll sideways — it **shrinks the entire page** to make it fit.
> So every visitor arriving on a phone was reading Tuned at about 90% size, with all the text
> correspondingly smaller. On the front page. The only page anyone can apply from.
>
> **Why nothing caught it, which is the bit worth understanding.** I already had two automated checks
> for "does the page overflow sideways", running at exactly this phone size. Both worked by comparing
> the page's width against the window's width. The problem is that when the browser shrinks the page
> to fit, it counts the *window* as being wider too — so both numbers grow together and stay equal,
> and the check reports everything is fine. It was not a missing check. It was a check asking a
> question that this particular fault makes unanswerable, and it looked healthiest at the worst
> moment. The new check compares the page against the size I actually asked for, which the page
> cannot influence.
>
> **What I fixed.** Four styling rules. A card's little grey line of labels ("Research · The Sydney
> Morning Herald · 1h ago · via @scout") can now wrap onto a second line instead of forcing the page
> wider, and a very long source name can break across lines instead of being one unbreakable block.
> I first made long names get cut off with a "…" and then looked at it: "The Sydney Morning Herald"
> became "The Sydney Morn…". For a product whose entire subject is *who paid attention to what*,
> shortening the source's name to make a row fit is the wrong trade, so it wraps instead and you
> still get the whole name.
>
> **The cost, and it is a real one.** To fix the front page I had to change the front page, which was
> frozen for a measurement running until 18 September. That measurement had a rule written into it in
> advance, before anyone knew what would come up: *if a fault forces a change, make the change and
> grade the measurement on the complete days up to that point.* So it now covers 11 days instead of
> 14. It is **not cancelled**, and I have deliberately not looked at its result — that reading is
> still due on 19 September, exactly as planned. I judged three more days of a shrunken front page to
> be worse than three fewer days of data *about* that front page.
>
> **It was not finished when it looked finished.** After fixing the cards, the new check found one
> more page still too wide: the "Open at ..." button on a find page contains the website's address,
> and a long address is one unbreakable lump 378 pixels wide on a 350-pixel page. I only found it
> because the new check walks every public page rather than the one I suspected.
>
> **What I did not touch.** On a normal computer screen, nothing moved at all — I measured every
> element on three pages before and after and not one of them shifted. RSS is untouched for the
> fourth run. I added no new counters; there is nothing new here to count.
>
> **Checked on the real site afterwards.** I measured 16 public pages on a phone-sized browser after
> deploying — the front page, all five feeds, terms, privacy, and 8 find pages. **Every one now fits
> exactly.** The front page went from needing 405 pixels to needing 390; `/ava` went from 436 to 390.
> The same check was failing on the live site fifteen minutes earlier, so this is a before-and-after
> and not a claim.
>
> **One more thing that check found, which I have written down rather than fixed.** In the daily music
> summary on `/ava`, a long artist name — "Jeff Goldblum & The Mildred Snitzer Orchestra, Ariana
> Grande" — gets **cut off mid-word** with no "…" to show it. It does not break the page (the box it
> sits in hides the overflow), so it is cosmetic, and it is a different fault from the one I just
> fixed. It turned up *after* this change was already deployed and verified, and quietly extending a
> verified change is how verification stops meaning anything. It is next on the list, with the
> measurement already taken.
>
> **The number that has not moved in forty-three days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **19 days left.** The two items in §1 are still the only
> things on this list that could produce a customer. This fixes something that was quietly making
> every phone visit worse; **it does not bring anyone here by itself, and I am not claiming it will.**
>
> ---
>
> # **Yesterday I gave every find its own web address. Today I found that nothing on the site pointed at a single one of them.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What was wrong.** Yesterday's work was real: 87 finds, 87 new addresses, and the list Tuned hands
> search engines went from 8 pages to 95. But a feed page's cards all link **outward**, to the
> original article — which is right, and which meant that no page on Tuned linked to any of the new
> find pages. Google could only learn they existed from the list; it could never walk to one by
> following links, the way it learns that a page matters. And a person reading a feed still had no
> way to get the link to a single find. The addresses existed and nothing led to them.
>
> **What I built.** A small "permalink" link on every card on a feed page, pointing at that find's own
> page. That is all it needed. It is the smallest thing that turns 87 addresses into 87 addresses
> somebody can actually reach.
>
> **What I deliberately did not touch — again.** I did not change what the card itself does when you
> click it. It still opens the original article, and there is now an automatic check that fails the
> deploy if that ever changes. Sending Tuned's only clicks to Tuned instead of to the source would be
> worse than having no permalink at all. I did not touch RSS, and I did not touch the landing page,
> which is mid-experiment until 18 September.
>
> **One number I added, and why it is not more dashboard-building.** Yesterday I wrote down that "if
> the find-page view counter moves, that is somebody sharing a link." Adding a link *inside* Tuned
> breaks that, because now the counter also moves when you click around your own site. So I split it:
> visits that came from Tuned are counted separately, and the interesting number is still readable.
> Without that, the first genuinely interesting reading this surface could produce would have been
> indistinguishable from you browsing.
>
> **The mistake I caught, and what caught it.** I first put the permalink in the card's top-right
> corner. Every automated test passed. Opening the page in a real browser showed it sitting **on top
> of** the "via @scout" label on wide screens and on top of the source's name on a phone. That is the
> second run in a row where the only thing that caught a real defect was looking at the page. I moved
> it to the bottom-right, where the space is reserved properly.
>
> **Something I found and chose not to fix.** On a narrow phone, a card with a very long source name
> pushes about 29 pixels off the side of the screen. I checked it against the old version: it was
> already doing that, so it is not from this change. It is small and it is next on the list.
>
> **The number that has not moved in forty-three days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **19 days left.** The two items in §1 are still the only
> things on this list that could produce a customer. This change, like yesterday's, does not bring
> anyone by itself — it finishes making it possible to be found, which took two runs rather than one.
>
> ---
>
> # **Tuned has published 87 finds. Until today not one of them had a web address you could send anyone, and the list Tuned hands search engines had eight pages on it.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What was wrong.** A find — a thing an agent noticed and somebody chose — only ever existed
> *inside* a feed page, and that page changes every time something new is published. So there was no
> link for a single find. If you wanted to send a friend the one interesting paper `@sportstech`
> picked up on Tuesday, the only thing you could send was the feed, and by the time they opened it
> the paper had moved down or off. The same gap meant Google had almost nothing to index: the file
> Tuned gives search engines listed **eight** pages — the front page, five feeds, terms and privacy —
> for a service whose entire output is 87 published finds.
>
> **Why this is the thing I worked on.** My own earlier experiment already concluded that the problem
> is not persuading visitors — it is that **nobody arrives**. The two ways of fixing that which I
> have prepared are both sitting with you (§1). Being found in search, and being passed from one
> person to another, are the only two ways of being arrived at that need nobody's permission, no
> spending and nothing from you. Both were impossible, because the thing Tuned makes had no address.
>
> **What I built.** Every published find now has its own page. The page is about **the attention**,
> not the article: who noticed it, who read it and chose it, and when it was published — with the
> source's headline only so you know which thing it is, and a prominent link out to the original. It
> says on the page, in plain words, *"Tuned does not host this and did not write it."* That sentence
> is now checked automatically on every deploy, because it is the line between Tuned and a content
> site that reposts other people's work, and a line nobody checks is not a line.
>
> **What I deliberately did not touch.** I did not re-point the feed pages' links at these new pages —
> that would send every click that currently goes to the source to Tuned instead, and I have no
> evidence that is better. I did not touch the RSS feeds, because changing them would re-notify every
> subscriber about articles they have already seen. And I did not touch the landing page, which is
> mid-experiment until 18 September.
>
> **Two mistakes I caught in my own work, both worth telling you about.** The "more finds like this"
> block at the bottom of each page was linking out to other websites rather than to Tuned's own find
> pages — which would have quietly defeated the entire point of building them. And a stray character
> in a comment broke the page's stylesheet *without breaking a single automated test*, because the
> tests check the page's structure and treat the styling as text. That one was only caught by opening
> the page in a real browser and looking at it.
>
> **One question from last time is now answered.** I asked whether the admin key was set up in
> production, which decided whether the "see who applied" screen I built yesterday actually works.
> **It is set, and the screen works today.** Nothing needed from you.
>
> **The number that has not moved in forty-two days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **20 days left.** The two items in §1 are still the only
> things on this list that could produce a customer — and this change is the first arrival work that
> does not depend on them. It does not by itself bring anyone; it makes being found possible, which
> it was not.
>
> ---
>
> # **If a stranger had applied to Tuned any time in the last forty days, I could have told you that somebody applied — and never who. The application form writes to a table nothing could read back.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here. **There is one new question at the bottom of this block.**
>
> **What was wrong.** The "apply" form on the landing page saves the person's email, what they want to
> use Tuned for, and their note. Exactly one thing has ever read that table: a **count**. No screen, no
> export, no email — nothing anywhere hands back a row. Meanwhile the step that *admits* somebody needs
> their **email address** to work. So the second step of the funnel was writing to a place the third
> step could not read, and letting someone in would have meant you opening the Cloudflare dashboard and
> querying the database by hand.
>
> **Why nobody noticed for forty days.** Nobody has applied. **An empty table and an unreadable one look
> exactly the same from the outside** — both report zero — so there was never anything to feel. Nothing
> was lost and no number I have published was wrong. What did not exist was any way to *check*, and the
> first moment it would have mattered is the first stranger, which is the moment I would least want to
> be discovering it.
>
> **Why my own audits missed it.** I have swept every counter, and I have a test that lists every route
> and what it records. Both ask *what does this write?* **Neither asks what reads it.** The form is
> correctly listed as writing its counters — the row it saves alongside them is not a counter, so it was
> in neither list.
>
> **What I shipped.** A private, key-protected way to read the applications: who applied, what they
> said, when, and whether they have already been let in. It uses the admin key that already exists, so
> there is nothing for you to set up, and it refuses to answer at all until that key is configured.
>
> **The half I did not fix, and you should know it.** There is **no email sending anywhere in Tuned**.
> Admitting someone produces a sign-in link that nothing can deliver — somebody has to carry it by hand.
> Same as the "follow by email" box, which collects addresses no digest can ever reach. I can now *see*
> an application; I still cannot *answer* one.
>
> **The new question, asked once and not repeated.** Tuned has **no payment provider, and I have never
> once asked you for one** — 163 runs, against a cash target. I deliberately did not build a pricing
> page: there is nothing a stranger could buy today, because creating a feed is admin-only, and a
> "would you pay?" button is not evidence of anything. **With 20 days left, is opening a payment path
> worth it at all?** That is your call and the reviewer's, not mine. Answer on issue #1, or ignore it.
>
> **The number that has not moved in forty-two days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **20 days left.** The two items in §1 are still the only things
> on this list that could produce a customer.
>
> ---
>
> # **The previous run did its work, pushed it, and then vanished without filing its report. The two alarms I have for "has the loop stopped?" both said everything was fine — and on this failure they say it more confidently, not less.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What happened.** Every run of this loop must post a report to issue #1 — it is the only place you
> or the reviewer can see what a cycle did. Last night's run signed in at 08:03 Sydney, pushed its
> change, watched the build go green at 08:18 — **and then stopped without filing anything.** Its
> code is safely in the repository. Its account of itself does not exist and cannot be recovered,
> because only that session knew what it had decided and why.
>
> **Why nothing caught it.** I have a watchdog that asks *"is the loop still firing?"* It works by
> checking that runs **sign in**. Last night's run did sign in, and it did commit — and a commit is
> treated as proof the loop is alive. **So a run that starts, works, and abandons its last steps
> looks healthier to the watchdog than a quiet one.** Both of its signals pointed the reassuring way
> on the one run that dropped the ball.
>
> **The fix, and it needed no new machinery.** Signing out is the *last* thing a run does, right after
> filing its report — the two runs before this one signed out **three seconds** after posting. So a
> run that signed in, ran out its time, and never signed out is a run that did not finish, and its
> report is in doubt. That fact was already sitting in the file the watchdog reads. **35 of the 37
> sign-ins on record signed out cleanly** — the only exceptions are last night's run and whichever
> run is currently working — so this is a clean signal, not a noisy one.
>
> **I got the priority wrong first and caught it against the real data.** I filed the new alarm as the
> least urgent of three. But a *different*, older alarm is already lit, and a louder alarm hides a
> quieter one for two days — which is exactly the window last night's failure falls in. **The check I
> wrote to catch this would have missed this.** Reordered: *the loop is down* still comes first, then
> *a run left the record broken*, then *an outage that already ended and is already reported*.
>
> **What this does not do.** It does not read issue #1, so "the report is missing" is an inference
> from the ordering, not something it saw. It cannot make a half-finished run finish. And it is
> deliberately **silent about last night's run** — you are reading about that here, and an alarm that
> pages you about something already in front of you is how alarms get ignored.
>
> **The number that has not moved in forty-one days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **20 days left.** A loop that notices its own missing
> paperwork is not a customer. The two items in §1 are still the only things on this list that could
> produce one.
>
> ---
>
> # **The fix I wrote down yesterday for my own reading tool would have been fooled by exactly the page it was written to keep out. I caught it before shipping it.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What the tool does.** This loop cannot open web pages directly, so it drives a real browser on
> GitHub's machines to read anyone else's page — a venue's rules, or the check that asks *"has
> someone already submitted Tuned here?"* It has to tell a real page apart from the "are you a
> robot?" screen some sites serve instead, or it will happily report a robot screen as an answer.
>
> **The flaw found yesterday.** It decided that by length: under 1,000 characters, call it a robot
> screen. But *"nothing found"* **is** a short page. So the duplicate check fails exactly when its
> answer is clean — which it did, twice.
>
> **Yesterday's proposed fix, and why it was wrong.** *"If the page contains links matching what we
> searched for, it's a real page."* A robot screen carries one link: **retry**, pointing back at the
> address you asked for — and that address contains the word we searched for. **The rule would have
> waved the robot screen straight through.** I found it by asking one question I should have asked
> yesterday: *name the page this is meant to keep out, and walk it through the new rule.*
>
> **What shipped instead.** A real page carries the site's own navigation — twenty or more distinct
> links elsewhere on the same site. A robot screen carries none, because it isn't the site's page.
> GitHub's "nothing found" page has 103. The length rule is **unchanged**, a named robot screen is
> still rejected however many links it has, and eight tests hold each of those in place.
>
> **The number that has not moved in forty days.** Nobody has applied, nobody follows `@sportstech`,
> and there is no money. **20 days left.** A more honest reading tool is not a customer. The two
> items in §1 are still the only things on this list that could produce one — and I checked the whole
> channel register again this run rather than assume it: **every other route needs an account I do
> not have.**
>
> ---
>
> # **I had written down in detail what to do when an experiment tells me something, and left blank what to do when it tells me nothing. Nothing is what keeps happening.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What this is about.** Before running any experiment, this loop writes down the possible outcomes
> in advance and what each would mean — so it cannot move the goalposts once it sees the result.
> There are thirty-two such written-down outcomes. **Eleven of them said what the result would mean
> and never said what to do next.** And they were not a random eleven: **every one was a "this told us
> nothing" outcome** — the submission never happened, the listing never appeared, the data was
> contaminated, the source refused to answer.
>
> **Which are precisely the outcomes Tuned keeps getting.** The `awesome-rss-feeds` branch marked
> *"never submitted"* is the literal state of the world today, 25 days on, and had no next step
> written. The `ooh.directory` branch marked *"never listed"* **describes itself as the expected
> outcome** in its own text — and had no next step either. So the branch this loop actually walks
> down is the one with no directions on it, and whoever arrives there improvises at the exact moment
> the evidence is weakest.
>
> **Why it happened, which I think is the interesting part.** Writing these down is an act of
> imagining the experiment *working*. The informative branches get instructions because you are
> picturing what you will do with the answer. The empty branches get a careful *"this is not evidence
> of demand in either direction"* — the honest, disciplined sentence — and that **feels** like
> finishing the job. It is not an instruction.
>
> **What shipped.** The eight missing next steps, all on experiments still open, all written without
> knowing how they will turn out; the rule itself at the top of the experiments file, where a run
> writing one is already looking; and a test that fails if any future branch is left without one. **No
> new counter, no new dashboard, no new scheduled job, and `src/` was not touched — the site is
> byte-for-byte what it was.**
>
> **One thing I set out to do and could not, which you should know about.** Yesterday's run asked me
> to decide in advance what each outcome of the landing-page experiment (reading 18 September) would
> commit the remaining days to. While checking the metrics — a normal part of every run — **I
> computed a partial nine-day figure for that experiment first.** Nine days of fourteen is enough to
> see where it is heading, and a commitment written knowing the answer quietly gives the likely
> outcome the easy job. **So I declined to write them rather than write them with a disclaimer**, put
> the partial figure on the record in full so it cannot become a number-shaped secret, and left the
> 18 September reading to run on the text written blind on 4 September. The lesson is filed: a window
> for deciding-in-advance is used up by the first run that looks, and looking is part of the job.
>
> **And the number that has not moved in thirty-nine days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **21 days left.** Knowing what to do with a null is not a
> customer. The two items in §1 are still the only things on this list that could produce one.
>
> ---
>
> # **Yesterday I told you I did not know why two runs had skipped the loop's own safety step. The answer is that nobody had ever written the step down anywhere a run was obliged to look.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **What the safety step is.** Before this loop changes anything, it signs a register — a lock that
> stops two copies of itself running at once and doing the same job twice. That has really happened
> before, and it produced two competing pull requests for one instruction. Friday evening and
> Saturday morning, the loop shipped eight commits without signing. Yesterday's run caught that,
> rebuilt the alarm so it can no longer confuse *"the loop died"* with *"the loop skipped a step"*,
> and finished by saying plainly that it did not know the cause.
>
> **The cause turns out to be mundane and complete.** The instruction to sign existed in exactly one
> place in this repository: **line 2493 of a 3,093-line file** — and the contract that tells a run
> which files to read describes that file as *"one screen"*. The routine prompt that starts each run
> does not mention the lock at all. The code implementing the lock even states in its own comments
> that the discipline *"lives in ops/STATUS.md"*. It did. Nobody was ever going to read that far.
>
> **And it did not end up there by drift — it was buried the day it was written.** The lock, its
> tests, its CI step and that one line of prose all arrived in a single commit on 31 August, and the
> line went in at **1511 of 2,063**: already three-quarters of the way down, on day one. Thirty-three
> later runs prepending sections above it moved it to 2493. They are not why it was missed.
>
> **What shipped.** A `CLAUDE.md` at the top of the repository — **the one file a session here opens
> without being told to, and this repository has never had one in its life.** The signing command is
> in its first screen. The rest is a single page: what Tuned is, which files to read, which checks to
> run before shipping, the report format, and the standing rules. Everything else stays a link. A
> test guards the three properties whose absence buried the instruction — it must exist, the command
> must be in the first 40 lines, the file must stay under 200 — and a fourth against the new risk a
> file like this creates: something read automatically is read with authority, so every link and
> command inside it has to resolve. Six ways of breaking it were tried; each turns the right test red.
>
> **Why this rather than something that makes money.** This is the third run in a row spent on the
> machinery rather than the product, and it is only defensible because it **takes a failure away**
> rather than adding another instrument. Yesterday added an alarm that reports this mistake after it
> happens; today the instruction reaches the run that would make it. No new scheduled job, no new
> dashboard, nothing added to the product — and **`src/` was not touched, so the site is byte-for-byte
> what it was.**
>
> **And the number that has not moved in thirty-nine days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **21 days left.** A loop that follows its own protocol is not
> a customer. The two items in §1 are still the only things on this list that could produce one.
>
> ---
>
> # **The feed a directory would list could not say which of three addresses it was — and the alarm that watches this loop was 25 minutes from telling you it had stopped, while it was running.**
>
> **[§1](#1-owner-action-required) is TWO, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, and the one-word answer on `ooh.directory`. Both are yours and
> neither is re-argued here.
>
> **The first thing, in plain terms.** `justtuned.com`, `www.justtuned.com` and a `workers.dev`
> address all serve the identical feed file, and **nothing inside that file said which of them it
> actually is.** The website's pages were given that line back in run 86 — *"this is the real address
> of this page"* — and the note explaining why even says the feed has the same problem. **The feed was
> left out of the fix, and the feed is the thing an RSS directory lists.** It is what validators check
> and what aggregators use to tell two copies of a feed apart. It is there now, along with a
> machine-readable *last updated* date: the field a reader's app shows in its list, which is how
> somebody months from now can see whether `@sportstech` is still alive.
>
> **The second thing, and it is the one I would want to know.** Running the checks turned up that
> **Friday evening's run and this morning's run never signed the run register.** They ran, shipped and
> reported normally — but the register they sign at the start sat blank for 24 hours, and **the
> watchdog that reads it has only ever had one word for silence: "the loop is not firing".** At 20:35
> tonight it would have sent you *"24.02h with no run at all"* and *"check that the routine is enabled
> and firing"*. The routine was enabled and fired on time, every time.
>
> **That was stopped before it reached you**, with the true account posted in its place, and the
> watchdog can now tell the two situations apart — because they need opposite things from you. *No
> run happened* means restart it. *A run happened and skipped the signature* means leave it alone;
> it is mine to fix. It still alarms on both: the change renames an alarm and can never silence one.
>
> **And the fix nearly shipped broken in the one way only the real thing would show.** The new check
> asks the repository's history whether any run committed during the silence. GitHub's default
> checkout fetches a single commit of history — so in production it would have answered *"nothing
> did"* every single time, silently restoring the exact false alarm it was written to remove, while
> passing every test on my machine. **The build caught it on the commit that added it.** It now
> fetches full history, and a history too short to answer says *"cannot answer"* instead of *"nothing
> happened"*.
>
> **What did not happen.** No landing page, no pricing, no positioning — that window is untouched and
> closes Friday 18th. Nothing that decides what `@sportstech` selects. The daily publishing schedule
> is **still switched off** and the replacement threshold is still waiting on review; this run neither
> armed nor enacted it. No find published, corrected, hidden or restored. Nothing was spent.
>
> **One thing I could not do, and stopped rather than work around.** I re-tested whether this session
> could make the `awesome-rss-feeds` submission itself. The answer is now **settled rather than
> pending**: the refusal is structural, not a glitch that might lapse. There *is* a way — starting a
> session scoped to that repository — and **I did not take it.** Your `A` authorises the submission,
> not this executor widening its own access to other people's repositories in order to make it. That
> stays your two minutes.
>
> **And the number that has not moved in thirty-eight days.** Nobody has applied, nobody follows
> `@sportstech`, and there is no money. **22 days left.** A feed that can name itself is not a
> subscriber. The two items in §1 are still the only things on this list that could produce one.
>
> ---
>
> **Previously (run 156).** The agent had one word — "length" — for three different reasons to
> stay quiet, and on Friday that word made this page tell you something untrue: a sentence reported
> as *too long to quote* was in fact **too short**, under eighty characters, and nothing in that
> paper was ever too long. The decision was right both times and no reader saw anything wrong, but
> the write-up was confidently wrong about a fact it had every means to get right. The one word is
> now three, a length refusal states the miss and the budget it missed (*"missed by 24 against
> 252"*), and each wrong line was corrected where it stands rather than quietly edited out.
>
> ---
>
> **Previously (run 155).** The agent got the ability to correct its own public line — the old text
> kept forever, a visible `(corrected …)` mark the server adds so it cannot be left off, and no way
> to change which paper a find points at. Pointed at Friday's item it read the abstract, looked at
> the three sentences in the results section and **refused all three**, so the weak line stayed. *(Two
> report nothing a reader could check; the third is too short to quote — Friday's report said "too
> long", which is the error this run found.)* Its first attempt had produced a description of the
> experiment with the word "Methods" glued to the front; two rules existed to stop that and both
> missed, and it was caught on a dry run before anything reached the site.
>
> ---
>
> **Previously (run 145).** `/sportstech` has a **Follow** button. Someone who likes what an agent is
> pointing at presses it, leaves an email, and that is the whole conversion this site currently
> offers a stranger. It has never been counted. The only record was one running total of followers,
> reading **0** — and a total that does not move cannot tell you *nobody tried* from *someone tried
> and the form rejected them* from *someone tried who was already on the list*.
>
> **Why it matters this week and not in general.** Both items in §1 point at that page. If either
> lands and people arrive, arrivals are counted — run 143 saw to that — and what they **did** would
> not have been. These counters start at zero on the day they ship and nothing fills in the past, so
> the only time to build them is before a listing lands.
>
> **What was actually shipped:** seven counter names covering the follow button being opened, a follow
> being accepted, a follow being rejected by the email check, and a follow from someone already on the
> list. That last one is the one that makes the follower total mean something.
>
> **The uncomfortable half, in plain terms.** Three previous runs swept the site for counters that
> could not say who wrote them, and the last one reported the sweep finished. It was — over the set of
> *counters*. This route had none, so it was never in the set being checked. The sweep was honest and
> the sentence describing it was too small a claim to notice that.
>
> **The background.** When you let someone into Tuned, they get an email with a sign-in link. Clicking
> it signs them in and drops them on their desk. Two counts follow from that: *someone signed in*, and
> *someone opened their desk*. The second one feeds the single number we have been calling **activation**
> — has anybody actually started using this — and it has read **0** every day of this bet.
>
> **What we found.** Neither of those two counts recorded anything about who caused it. They were the
> last two on the site like that; everything else already says whether it came from a person's browser
> or from a machine.
>
> **Why that is worse than it sounds, and it is not a paperwork problem.** Email links are fetched
> automatically before anyone reads the message — by spam filters, corporate security scanners, and by
> Slack or WhatsApp when the link gets pasted somewhere. That is ordinary infrastructure, not an
> attack. But our sign-in link works on being fetched: whatever opens it gets signed in and lands on
> the desk. **So a security scanner opening the welcome email could have flipped our activation number
> from 0 to 1, and it would have looked exactly like our first real user.** It would have happened on
> the very first person we admitted — the one moment nobody would think to question it.
>
> **What we did.** Both counts now record two things. The weaker one is whether the fetcher declared
> itself a machine — easily faked, there for consistency. The stronger one is whether a person actually
> *clicked* something: browsers say so explicitly, and nothing automated does. That second marker is
> what catches the realistic case, because a scanner pretending to be Chrome defeats the first one.
>
> **What we deliberately did not do: add a "click here to continue" step.** That is the standard fix
> for this problem, and it would work. We turned it down. Activation is at zero, so one person who
> gives up at an extra click — or gets wrongly turned away — costs more than every mislabelled sign-in
> combined. **The site now labels sign-ins; it never blocks them.** A test will fail if any future
> change makes it block one.
>
> **Something that went wrong in our own checking, reported because it went wrong.** We test these
> fixes by deliberately breaking them to confirm the tests notice. Five attempts, four caught — and
> the fifth was not. One of the new markers could be deleted entirely with every test still passing,
> because all of them happened to use a normal browser. That is the *same* mistake this run was written
> to point out, made inside the run pointing it out. It was found before anything shipped, and fixed.
>
> **Nothing about Wednesday's measurement moved.** Not one line of the landing page changed, so the
> reading due **18 September** is unaffected.
>
> **Previously (run 141, 2026-09-06 08:35 Sydney).** The application form was the only counter on the
> site that recorded nothing about where an application came from — so a script could have written an
> entry that arrived looking exactly like a real person. It survived 140 runs because it had only ever
> counted zero, and a counter that has only ever said zero looks exactly like a correct one.
> Applications now carry the same two markers, and here too the site labels and never refuses.
>
> **Previously (run 140, 2026-09-05 20:25 Sydney).**
>
> # **The one test that could tell us our new measurement is working had been broken by that same measurement, since the day it shipped. Nothing failed, because nothing ran it.**
>
> **[§1](#1-owner-action-required) is ONE, unchanged and undeadlined** — the two-minute paste to
> `plenaryapp/awesome-rss-feeds`, which only you can make. **That section had wrongly read NONE for
> three runs; it is corrected below and named rather than quietly fixed.** This run changed no product
> behaviour, published nothing, submitted nothing and spent nothing.
>
> **The background.** For nineteen days, everything this loop did rested on one claim: *the landing
> page isn't the problem, getting anyone to it is.* Yesterday we found that claim was resting on a
> counter that couldn't actually test it, and shipped a new one — `landing_render`, which fires when a
> real browser runs the page, as opposed to something merely downloading it. The reading it feeds is
> due **18 September** and it decides where the last weeks go.
>
> **What we found today.** Adding that counter broke the only check in the repository that could
> confirm it works — a browser test that asserted *nothing fires on page load*, which the new counter
> does by design. That test is run by hand, not automatically, so nobody ran it and nothing went red.
> Every routine gate stayed green the whole time, because they only check that the *instruction* is in
> the page, which is equally true of a page that crashes before reaching it.
>
> **Why that mattered more than it sounds.** The experiment already anticipates *"the counter never
> worked"* as a possible outcome — but as written, we'd only have discovered it **on 18 September**,
> and these counters cannot be backfilled. A silent failure would have cost the whole fortnight, with
> 30 days left on the clock.
>
> **What we did.** Fixed the browser test, then ran it against the live site: a real browser loaded
> justtuned.com, the counter fired once, and the server accepted it — with no errors on the page. **So
> that failure is ruled out on day 1 of 14 rather than day 14.** We also added two small automatic
> checks that will fail the build the next time this test drifts out of date, so it can't go stale in
> silence again. The test browser identifies itself as automated, so nothing it did counts toward the
> real reading.
>
> **Said against our own interest.** The new counter is *supposed* to run before anything else on the
> page, and it doesn't quite — about fifteen lines run first, and if any of them ever fail, the counter
> stays silent while the visit still counts. That would push the result **toward the answer we already
> believe**. The fix is two lines and **we deliberately didn't make it**: changing the page mid-measurement
> would split the fortnight into two halves that can't be compared. Today's run confirms it isn't
> happening, we'll re-check twice more, and we've written down in advance exactly what would make us
> change it anyway.
>
> **Previously (run 84, 2026-08-24 20:30 Sydney).**

> # **Still nothing for you to do. We found a measurement due Wednesday that was resting on something that does not exist, and caught it before the number landed.**
>
> **[§1](#1-owner-action-required) is NONE** and stays NONE. This run changed no product behaviour,
> published nothing, submitted nothing and spent nothing.
>
> **What happened.** Wednesday's scheduled measurement asks a simple question: *does the counter on
> `@sportstech`'s RSS feed actually work?* Its rule said that if the counter reads zero for seven days
> straight, the counter must be broken — **because our own automated checks fetch that feed on a
> timer, so it can never legitimately be zero.**
>
> **We do not have that timer.** The checks that fetch every feed only run when someone presses the
> button, deliberately so — it is written into the workflow, with the reason. The two things that
> genuinely run on a schedule each fetch exactly **one** feed, and it is `@ava`'s, not `@sportstech`'s.
>
> **Said plainly, and against our own interest: this costs us nothing on Wednesday.** The counter has
> already written on three days inside the window, so the measurement lands on *"the counter works"*
> whatever else happens, and the find does not change its answer. What it prevents is the other branch:
> a quiet week would have had us declare a perfectly healthy counter broken, and shut down a
> distribution route on the strength of it. That was not far off: of the five days with data, **two
> would have read zero if one button-press had not happened, and one already read zero**.
>
> **What we did about it.** Corrected the wrong description everywhere it is actually published,
> including on the live site. Wrote down, *before Wednesday's number exists*, that the "seven days of
> silence" branch may not be used. **We deliberately did not add the missing timer** — switching it on
> now would make Wednesday's number true by construction, which is the same as not measuring at all.
> It goes in after the reading, not before.
>
> **Previously (run 83, 2026-08-24 19:45 Sydney).**

> # **The window closed at 19:35 tonight. There is nothing for you to do, and nothing broke.**
>
> **[§1](#1-owner-action-required) is NONE.** The submission the last four days' card asked for needed
> `@sportstech` to have published something in the previous 72 hours. That ran out **2026-08-24 19:35
> Sydney (09:35:56 UTC)**, so the ask is retired rather than repeated — asking you to do a thing that
> is no longer admissible would be worse than saying it lapsed.
>
> **Your "A" is preserved. It was not withdrawn and it will not be re-asked.** You settled whether the
> executor may put a factual entry about your feed in front of a directory in your name; that answer
> stands and carries forward. What expired is a precondition, not your permission.
>
> **The candidate is paused, not dropped.** `plenaryapp/awesome-rss-feeds` stays in the register with
> every condition it can hold still held. It resumes the first time `@sportstech` publishes a find
> that is worth publishing on its own merits — which is not scheduled and may be days.
>
> **Nothing was published to keep the window open, and that was deliberate.** Publishing something in
> order to make a number look right is disqualified by this loop's own rules, and this is the **second**
> window it has let lapse rather than break them (the first was Friday afternoon).
>
> **What must not be read into this:** nothing about whether anyone wants Tuned. No submission was ever
> made, so no directory, maintainer or stranger has told us anything. The measurement that *is* due
> needs nobody's permission — [EXP-009](EXPERIMENTS.md) Reading 1 on **2026-08-26**, asking only whether
> the RSS counter writes in production at all.
>
> **If you would still like to open the issue** — you may, any time, and the full instructions are kept
> intact in [§1](#1-owner-action-required). Just tell the loop, so freshness can be re-read from
> production first; **it does not hold right now**.
>
> **This headline said *"There is nothing for you to do"* while [STATUS.md](STATUS.md) and the rest of
> this file said a decision was outstanding.** Written at run 49 on 2026-08-17, false from **2026-08-19
> 04:30 UTC** — the moment the decision was first asked — so **~29 hours wrong**, on top of §1's card
> below reading `NONE` since run 42 on 2026-08-15. That was a real defect in the mirror, not a wording
> choice, and it is the whole substance of run 59 — recorded here rather than quietly overwritten.
>
> **Previously here (run 49, 2026-08-17 14:40 Sydney).** **Tomorrow morning's number
> arrives, and this afternoon we caught a rule that would have thrown it away.**
>
> Since Saturday the loop has been waiting on one measurement: of the ~44 apparent visitors a day to
> the landing page, is *anybody* actually a person? A counter went in that fires the moment a real
> hand touches the page. It reads for the first time tonight at **06:40 Sydney tomorrow**.
>
> The rule guarding it said: *if that counter reads zero, the counter is broken — go fix it.* That is
> right half the time. A zero has **two** meanings, and they are opposites: *the counter is broken*,
> or **the counter works fine and not one visitor was a person all day**. The second one is the
> answer we have been waiting a week for — and the rule as written would have sent us off to repair a
> working counter and bin the result.
>
> **It is fixed, and the timing is the whole point.** The honest window to fix it was after the day
> being measured ended (10:00 Sydney this morning) and before the number lands (06:40 tomorrow) —
> about twenty hours, once. The fix is written down *before* the number exists, along with the
> evidence that tells the two meanings apart: the counter's code has not changed a byte all week, and
> the same live browser test that passed before the measured day was run again after it. Both sides
> check out.
>
> **Said plainly, against our own interest:** we can already see most of yesterday — the counter read
> zero for about 86% of the day — so this was not written completely blind, and it is recorded that
> way rather than dressed up. It also makes "nobody real is arriving" a conclusion we are now allowed
> to reach. That is not a conclusion yet. It is a number due tomorrow morning.
>
> **Previously (run 46, 2026-08-16 08:30 Sydney).** **We have been working on the
> wrong obstacle.** The reason nobody can be pointed at Tuned was assumed to be that a stranger has to
> apply before they can see anything. That stopped being true a week ago — `justtuned.com/ava` and
> `justtuned.com/sportstech` work for anyone, no account needed. **The real reason is that there is
> nothing recent on them.** Your feed's newest item is from **2 August** (14 days ago); `@sportstech`'s
> is from **30 July** (17 days). Sending strangers to a feed that has not moved in two weeks does not
> test whether people want Tuned — it tests whether they will recommend something that looks
> abandoned.
>
> **What this changes:** the single publication that was already queued up behind Sunday's numbers is
> now the thing that unblocks *everything else*, not a nice-to-have. It was going to prove the agent
> machinery works. It turns out to also be the only thing that makes Tuned worth showing anyone.
>
> **One more thing found today, worth knowing before it costs us:** if we did point people at Tuned
> tomorrow, **we would not be able to tell whether it worked.** The only visitor counter is site-wide,
> and its ordinary day-to-day swing (2 to 22 people) is bigger than the number of visitors a first
> attempt would realistically bring. That gets fixed before any post goes out, not after — it is
> written down as a requirement now so it cannot be forgotten in the excitement of having somewhere to
> post.
>
> **Nothing changed on the site today**, deliberately: Sunday's landing-page measurement needed an
> undisturbed day and got one. Applications still **0**, cash still **AUD $0** because no billing
> exists, spend still **AUD $0.00 of $500**.
>
> ---
>
> **Update (run 48, 2026-08-16 20:20 Sydney).** **That counting problem is fixed, and it had to be
> fixed today rather than later.** Tuned can now tell *which* feed a visitor arrived at, and whether
> they came from a link we posted somewhere — neither of which it could do this morning. Live and
> checked on the real site.
>
> **Why not wait until we actually have somewhere to post?** Because these counters only start
> counting from the moment they exist, and there is no way to fill in the past. If we had posted first
> and counted second, the first attempt would have produced no usable answer — and something like a
> Show HN can only be spent once. Two earlier runs put this off waiting for a channel to be picked;
> that was the wrong call, and it is written up so it does not recur.
>
> **What has *not* changed: we still have nowhere to point anyone.** The feeds are still stale — that
> is unchanged and it is still the thing that matters. Knowing how to count visitors does not give us
> a reason for them to come. **Nothing was posted anywhere, and no channel is any closer to being
> authorized.**
>
> **Nothing you need to do, and nothing on the landing page moved** — Sunday's measurement is still
> running undisturbed and reads tomorrow. Applications still **0**, cash still **AUD $0** because no
> billing exists, spend still **AUD $0.00 of $500**.
>
> ---
>
> **Previously (run 44, 2026-08-15 19:40 Sydney).** **Tuned's agent control plane
> just did something to production for the first time: it adopted your `@sportstech` feed. Nothing was
> published, and nothing on the feed changed.** Adoption means one thing only — the operator is now
> allowed to act on that feed, and it is the *first* of your feeds it has ever been allowed to act on.
> Production confirmed it back: **`owner: @ava · active 1/12`**, `@sportstech [active] source=adopted
> operator_publications=0`.
>
> **Your other three feeds were not touched** — `@graphics`, `@wearables` and `@wellbeing` are exactly
> where they were. **Nothing in your private queue was opened, read, approved or published**, and the
> site-wide public-item count is still **79**.
>
> **The next step is a single publication, and it is deliberately on hold until Sunday's numbers.**
> Run 43's landing-page counters need one complete, undisturbed day (UTC 08-16) before anyone reads
> them; publishing before that would change what a visitor sees mid-measurement. What a first
> publication must prove — one item, one source link, the AI label visible on both the web page and
> the RSS feed, nothing published twice, and a find genuinely encountered rather than written — was
> written down **before** the adoption, so it cannot be adjusted to fit whatever happens.
>
> **The honest part.** `@sportstech`'s newest public item is still from **2026-07-30** — 16 days ago —
> and today did not change that, because adoption publishes nothing. A control plane that works is a
> **capability**, not traction. Applications still **0**, cash still **AUD $0** because no billing
> exists, spend still **AUD $0.00 of $500**.
>
> **Previously (run 43, 2026-08-15 14:35 Sydney).** **For nine days the landing page
> has shown ~60–110 human-shaped visits a day and produced zero applications, and nobody — including
> this loop — could say why.** Three completely different problems produce that exact same pair of
> numbers: *nobody real is arriving*, *real people arrive and the pitch doesn't land*, or *people try
> to join and the form loses them*. We already proved the form itself works in a real browser
> ([EXP-003](EXPERIMENTS.md)), so it is one of those three — and until today Tuned recorded nothing
> between "someone loaded the page" and "someone successfully applied".
>
> **Now it records three things:** whether anything on the page gets touched at all (`landing_engage`),
> whether that reaches the application form (`application_start`), and whether anyone submitted and was
> **rejected** by the email check (`application_invalid`) — which until today left no trace whatsoever.
>
> **Nothing about your privacy commitments changed.** No cookie, no visitor tracking, no identifier of
> any kind, no new category of data — daily counts only. The privacy policy already describes this and
> was deliberately **not** amended.
>
> **There is no result yet, and there cannot be one until a full day has passed.** The first honest
> reading comes from the scheduled snapshot covering UTC day 08-16. What each possible answer means,
> and what happens next in each case, was written down **before** the counters existed
> ([EXP-007](EXPERIMENTS.md)) so the answer cannot be rationalised after the fact.
>
> **What this is not.** An instrument is not traction. Public items are still **79**, newest still
> **2026-08-02**, applications still **0**, cash still **AUD $0** because no billing exists, spend still
> **AUD $0.00 of $500**. **No agent was adopted, created, published or disabled**, and **nothing in your
> private queue was opened, read, approved or published.**
>
> **Previously (run 42, 2026-08-15 13:50 Sydney).** **The Cloudflare secret you
> installed is live, and the agent control plane answered for the first time:**
> **`owner: @ava · active 0/12`** ([run 31862547681](https://github.com/in-c0/tuned/actions/runs/31862547681),
> 03:43:10 UTC). Your 22:24 attempt last night hit `503` because the Worker had no value bound; by
> 03:42 the same route answered `401` — *key set, closed to anonymous callers* — and the read-only
> preflight then came back green. **[§1](#1-owner-action-required) is now NONE**, for the first time
> since 2026-08-14.
>
> **Nothing was done with it.** The preflight lists; it does not act. **No agent was adopted, created,
> published or disabled**, `active` is **0/12**, and the four feeds it named as adoptable
> (`@graphics`, `@sportstech`, `@wearables`, `@wellbeing`) are simply feeds you already own — nothing
> happened to them. The next step is a reviewer authorization plus a public remit, not another
> credential from you.
>
> **What this is not.** A working control plane is a **capability**, not traction. Public items are
> still **79**, the newest is still **2026-08-02**, applications are still **0**, cash is still
> **AUD $0** because no billing exists, and spend is still **AUD $0.00 of $500**. **Nothing in your
> private queue was opened, read, approved or published.**
>
> **Previously (run 41, 2026-08-15 07:45 Sydney).** **Your Spotify connection came
> back to life, and it is now the clearest picture of what Tuned is missing.** On 2026-08-14 the cron
> ran **30 times, succeeded 30 times, errored 0 times and captured 104 plays**. Your private queue went
> **42 → 146**. **Public items stayed at 79**, and the newest public item is still 2026-08-02.
> **0 of those 104 were published** — because publishing needs a person to approve from the queue, and
> nobody has. The machine half of Tuned works; the human half is not happening. That is not a bug to
> fix, it is the product doctrine showing up in the numbers. **Nothing in your queue was opened,
> read, approved or published by the executor** — it is your data and your attention, and 104 captures
> is one person listening to music for a day, not demand. [§1](#1-owner-action-required) is unchanged
> and still the only thing asked of you.
>
> **Previously (run 38, 2026-08-14 10:45 Sydney).** **The per-agent token plan was
> withdrawn before it was used, and the agent lifecycle is now automated.** Handing over one studio
> token per feed would have billed you an authentication step for every agent, forever, and copied a
> "publish anything to this feed" capability into a second system each time. Instead: **one stable,
> revocable, owner-scoped `AGENT_OPERATOR_KEY`** driving a narrow control plane — list, adopt, create,
> publish, disable — over agent feeds owned by `@ava` only. **Per-agent studio tokens never enter
> GitHub**; they stay in D1 and no endpoint returns one. Shipped **fail-closed**: with the secret
> absent every operator route answers 503 and the site is unchanged. 79 tests passing (28 new), and
> the whole path was proved locally through the real workflow script. **Nothing was created, adopted
> or published in production.** [§1](#1-owner-action-required) is the one thing left.
>
> **Previously (run 36, 2026-08-14 07:50 Sydney).** **The agent-activation question
> is answered: the contract works, and one secret is all that is missing.** Run 36 traced it end to end
> in workerd against a real D1 — brief → publish → public feed → RSS → landing demo, 8 assertions
> passing. Of the reviewer's four prerequisites, **identity exists** (4 agent feeds) and **credentials
> and permission are missing — both are yours**, which is [§1](#1-owner-action-required). The trace
> also found a real defect and fixed it: `/:handle/rss.xml` never selected `kind`, so **every agent
> feed syndicated with no AI label**, on the one surface that leaves the site ([L-19](LESSONS.md)).
> **Nothing was published, no agent identity was invented, and the 42 private queued items were not
> touched.**
>
> **Previously (run 35, 2026-08-13 20:15 Sydney).** **Nothing has been published on
> Tuned since 2026-08-02 — eleven days — and the landing page was heading that stale block *"Live demo
> — a real feed, right now"*.** [EXP-005](EXPERIMENTS.md) measured it: the demo's newest item was
> **270.6 hours** old, the other four feeds **13.5 days**. All five feeds serve and render; what they
> contain is old. **431 UA-flagged human-shaped landing views arrived while that heading was false.**
> Fixed by deriving the claim from data instead of asserting it — the heading now says only what the
> block is, and a pulse beneath it reads the real timestamp and degrades into *"last active 11d ago"*.
> **The executor did not manufacture items to make the demo look alive.** No conversion inference in
> either direction. See [L-18](LESSONS.md) and [STATUS.md](STATUS.md).

---

## 1. OWNER ACTION REQUIRED

**Mirror of [STATUS.md § OWNER ACTION REQUIRED](STATUS.md#owner-action-required). If the two
disagree, STATUS is right.**

### **TWO now, and the new one is a question rather than a chore.** — raised 2026-09-06 20:20 Sydney (run 143)

**Card 2 of 2 — new. May Tuned be suggested to `ooh.directory` at all?** This is **not** a repeat of
the card below and it needs no account, no paste and no two minutes — **one word on
[issue #1](https://github.com/in-c0/tuned/issues/1) settles it.** Full packet:
**[SUBMISSION-ooh-directory.md](SUBMISSION-ooh-directory.md)**.

| | |
| --- | --- |
| **The question** | ooh.directory is a **human-curated blog directory**. Its FAQ admits link blogs *"only if they include original commentary about each link"* — `/sportstech` meets that on its face, because every item carries a `why` line. **But that commentary is written by an agent.** The page says so with an `AI AGENT` badge, so nothing is concealed from a curator reading it, and the FAQ has no clause about machine-written text either way. **Silence is not permission**, and suggesting an agent-written blog in your name is your call, not mine. |
| **What I need** | **`A`** — proceed, and the packet becomes a paste like the card below. **`N`** — retire it, and the file is deleted permanently. Either answer is a good outcome; the card standing open is the only bad one. |
| **What I already did, so the answer is all that is missing** | A5 is **closed**: `arrival:ooh-directory` now writes on the exact URL this venue takes, with five tests, and [EXP-012](EXPERIMENTS.md) registers the threshold, the window, six outcomes and **two** controls — all **before the counter had ever been written**, because counters do not backfill and a suggestion is spent once. |
| **What I did not do** | **Nothing was submitted and no venue was contacted.** Registering the tag authorizes no submission, and the commit says so. |
| **The honest expectation** | The venue tells you in advance that most suggestions are never reviewed: *"Suggesting a blog does not guarantee it will appear on the site."* EXP-012 registers **never-listed** as the *expected* outcome, in which case **nothing is graded** and no conclusion about demand is drawn in either direction. |

**And the thing worth saying plainly alongside both cards.** After this run there is **no distribution
work left that I can perform**. Every remaining step at every candidate is A0 (an account I do not
hold) or A2 (an authorship decision that is yours). **29 days remain; `applications` 0, active members
0, followers 0, AUD $0.** Improving the product further cannot change any of those, because nobody has
been shown it.

---

### **ONE, and it has no deadline.** — raised 2026-09-04 20:35 Sydney (run 137) · **preconditions re-verified 2026-09-14 (run 160)**

**Submit `/sportstech` to `plenaryapp/awesome-rss-feeds`, whenever you next have two minutes.** Field
values and both paths: **[SUBMISSION-awesome-rss-feeds.md](SUBMISSION-awesome-rss-feeds.md)**. It is a
paste, not a research task.

| | |
| --- | --- |
| **Verified today, not ten days ago** | Run 160 re-read both cheap preconditions from source, which the packet had been asking for since 2026-09-04 and which no run had done. **A4 has doubled** — **8** publications in the trailing 30 days against a bar of one, where the packet was written on four ([34831621225](https://github.com/in-c0/tuned/actions/runs/34831621225)). **No duplicate** at the venue, open or closed ([34831864620](https://github.com/in-c0/tuned/actions/runs/34831864620)). Both held; nobody knew that until today. [L-78](LESSONS.md#l-78). |
| **Is this new?** | **No.** Your `A` of 2026-08-20 15:04 UTC already authorizes it. Nothing here needs a reply — only the act, or one comment retiring the card permanently. |
| **Why it is live again after four dead windows** | The condition that closed all four was **this loop's own threshold**, not the venue. A4 tested *"newest item ≤ 72h at the moment of posting"* — right for a burst venue, wrong for a directory entry that is read for months. Run 137 split it by venue shape; `/sportstech` passes the durable-listing test on four publications in the trailing 30 days. **There is no expiry instant any more, so there is no window to miss.** |
| **The remaining blocker, and it is not yours** | This executor can perform no write at any third party — re-tested four times, byte-identical refusal. The submission is **correct and unmakeable by the loop.** |
| **If you would rather not** | One comment on [issue #1](https://github.com/in-c0/tuned/issues/1) retires the card and the packet permanently. A decision either way beats the card standing open. |

**Corrected at run 140:** this section still read **NONE** for three runs after run 137 re-opened the
card. [STATUS.md](STATUS.md) was right throughout and this mirror was stale — exactly the failure the
header warns about, so it is named here rather than quietly overwritten.

---

**Kept below and no longer live — the retirement notice from run 123.**

### **NONE.** *(superseded by the card above)*

**Retired 2026-08-31 04:14:13 UTC = 14:14:13 Sydney (run 123), on the card's own clock, unanswered.**
The submission needed **A4** — `/sportstech`'s newest public item ≤ 72h — and that window closed at
exactly that instant (item **248**, `2026-08-28T04:14:13.569Z`). **Nothing for you to do.**

| | |
| --- | --- |
| **What is preserved** | **Your `A` (2026-08-20 15:04 UTC) stands**, and so does your [03:36 UTC clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737). What expired is a **precondition**, not the authority. Nothing is being re-asked. |
| **What is paused** | The `plenaryapp/awesome-rss-feeds` submission — **paused, not dropped.** You never said **C**, and an unanswered card is not a decision. It resumes when a find worth publishing on its own merits restores A4; that is not scheduled. |
| **What was not done** | **Nothing was published to hold the window open.** [EXP-008](EXPERIMENTS.md)'s binding clauses forbid publishing to move a number. **No second notification was sent** — run 121's was the only one. **Fourth window to lapse unused** (21 Aug, 24 Aug, 27 Aug, 31 Aug). |
| **How this was checked** | I waited out the window rather than retiring the card early: this cycle fired at `04:04:53Z`, **9 minutes inside** it, and held. Re-read at `04:16:00Z` — issue #1 unchanged at **230 comments**, no venue URL from you or anyone. |
| **What may not be concluded** | **Nothing about demand.** [EXP-009](EXPERIMENTS.md) Reading 2 has no `t0` and stays **Fork D / PENDING — inadmissible, not a null.** Four lapsed windows are a fact about my access and schedule, not about whether anyone wants Tuned. Commercial readings **zero**; spend **AUD $0.00 of $500**. |
| **If you still want it** | Open the issue any time — the card below is kept intact — but **A4 must be re-read from production first** and does not currently hold. No clock, no penalty, no ask. |

---

**Kept below, and no longer live — the card as written at run 107. Its A4 row and its clock are expired.**

### **ACTION REQUIRED · HIGH — one issue at a public GitHub repo, about two minutes. It's the only thing left between Tuned and its first real audience.** *(RETIRED 2026-08-31 04:14:13 UTC — A4 lapsed unused)*

**Opened 2026-08-28 19:35 Sydney (09:35 UTC).** You already said yes to this on **20 August**. I have
never been able to do it, and I still can't — **not because anything is wrong with the submission, but
because my GitHub access is scoped to `in-c0/tuned` and the venue is someone else's repository.** I
re-tested that this morning and got the same refusal as eight days ago.

**Everything else is checked and green, this morning, from production:**

| | |
| --- | --- |
| **What to do** | Open **one** issue at [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds) using its *add new feeds* template. Three fields: **Category `Sports`**; **Feed URL** = the route **`/sportstech/rss.xml`** on **`justtuned.com`** with the `?src=` tag **`awesome-rss-feeds`** — please join those two yourself when you paste, since anything that fetches the joined link moves the very counter I'm going to measure; **Podcast: `No`**. Then paste the issue URL on [issue #1](https://github.com/in-c0/tuned/issues/1). That's all — no body text to write, nothing to follow up. |
| **Why it's worth two minutes** | It is **the first time Tuned's feed would be put in front of strangers.** 22 days, 107 runs, **0 applications, 0 active members, 0 followers, $0**. I can keep improving the product indefinitely and none of those numbers can move, because nobody has ever been shown it. |
| **Checked before asking** | **Freshness ✅ 5.3 hours old** — the feed published a new find this morning, so it isn't a dead link ([evidence](https://github.com/in-c0/tuned/actions/runs/33159736495)). **No duplicate ✅** — I searched the venue's open *and* closed issues at 09:32 UTC; **zero results** for `justtuned` ([evidence](https://github.com/in-c0/tuned/actions/runs/33159738434)). Their rules permit this submission. |
| **The clock** | **Closes Monday 2026-08-31, 14:14 Sydney.** After that the feed counts as stale for directory purposes and it's inadmissible again until some future find happens to restore it. **Three earlier windows already lapsed** — on 21 Aug, 24 Aug and 27 Aug — largely because this card kept quietly retiring itself before you saw it. That's my defect, and it's written up. |
| **If you'd rather not** | Say so on issue #1 and I'll close it out honestly as *inadmissible, never tested* rather than let it lapse silently a fourth time. **A fourth lapse is an acceptable outcome** — I will not publish anything just to hold the window open. |
| **Second remedy, if you prefer** | Start a Claude session with **`plenaryapp/awesome-rss-feeds` as an initial source** and I'll submit from it. The refusal message names this route. **I did not do this myself on purpose** — spinning up a second session to get around my own access scope is exactly the kind of shortcut I shouldn't take. |
| **What this does not mean** | **Nothing about demand, either way.** Three lapsed windows say something about my access, not about whether anyone wants Tuned. Commercial readings **zero**; spend **AUD $0.00 of $500**. |

---

**Superseded — the run-105 card, kept as history.**

### **NONE — please ignore the alert you may have just received. Deploys are working again and there is nothing for you to do.**

**Cleared 2026-08-28 13:55 Sydney (03:55 UTC).** I raised a HIGH card and alerted you at 13:47 Sydney
about deploys being stuck for ~6 hours. **Minutes later it fixed itself**, and I sent a stand-down at
13:55. **The Cloudflare dashboard check I asked for is no longer needed.**

| | |
| --- | --- |
| **What happened** | The commit carrying that card ([`b5e58f6`](https://github.com/in-c0/tuned/commit/b5e58f6), pushed 03:41:44Z) **deployed normally — green in 54 seconds.** The check is a strict one: it waits until `/api/version` reports **that exact commit** is the one serving, so this is a real deploy, not a guess from timing. |
| **Where that leaves things** | **Everything is live.** The whole ~6-hour backlog shipped with it. Nothing is blocked, nothing was lost, and **you took no action** — no setting was changed by anyone. |
| **The honest caveat** | **I don't know why it stalled, or why it cleared.** A fault that fixes itself without explanation **can come back**, and it will look the same from my side: checks green, site healthy, build silently stale. If you ever want the answer, the Builds page would still have it — **but that's curiosity now, not a task.** |
| **Two alerts, one subject** | You got an alert and then a retraction ~8 minutes apart. That's on me: the watcher I set up to catch this exact outcome was broken and stayed silent, so I escalated on the assumption the push had failed too. Fixed in the record; the sequencing rule is written down. |
| **Unchanged** | Commercial readings **zero**. Spend **AUD $0.00 of $500**. |

---

**Kept below, and no longer live — the card exactly as written at 13:36 Sydney, before it cleared.**

### **ACTION REQUIRED · HIGH — read one Cloudflare page and paste what it says. ~2 minutes. No spend, nothing to install, nothing to change.** *(CLEARED 2026-08-28 03:55 UTC — no action needed)*

**Opened run 105, 2026-08-28 13:36 Sydney (03:36 UTC).** **Your site is fine — this is not an outage.**
`justtuned.com` returns HTTP 200 on every probe. What is stuck is the **build**: production has been
serving the same commit (`7983146`) for **23h52m**, and **nothing we ship can reach users until this
clears.**

| | |
| --- | --- |
| **What is blocked** | **Every deployment.** Seven consecutive commits pushed to `master` passed all repository checks and **none became live** — eight straight `verify production` failures between `2026-08-27T21:44:36Z` and `22:31:40Z`. Last successful deploy: `2026-08-27T03:43:41Z`. |
| **Why only you can do it** | The answer is on the **Cloudflare dashboard**, and this executor holds **no Cloudflare credential — by design** (the Git pipeline exists so it never does). Its only other route, direct egress to `justtuned.com`, is blocked at the proxy (403, re-tested this run). Repository-side checks are **green on all seven commits**, so the build command is not the fault and there is nothing further to test from here. |
| **Exactly what to do (~2 min)** | **Cloudflare Dashboard → Workers & Pages → `attention-feed` → Settings → Builds.** Then post on [issue #1](https://github.com/in-c0/tuned/issues/1): **(a)** is the Git connection still connected, and to which repo/branch; **(b)** the latest build's **time and status** (queued / building / failed / none); **(c)** its **error or a log link or screenshot**. **Read and paste only — please don't reconnect, re-authorize or retry a build first**; changing state before it is read destroys the evidence that identifies the cause. |
| **How we'll know it's fixed** | A normal push to `master` **deploys that exact commit** and `verify production` goes green. Nothing else counts — no empty commit or re-run will be used to manufacture it. |
| **Age** | **5h51m** at opening. Build staleness: **23h52m**. |
| **Where this was already raised** | Escalated **once** out of band at **2026-08-27 22:20 UTC**, and deliberately **not repeated**. On issue #1 it appears in the run 103 report, the run 104 addendum, and the 2026-08-28 03:34 UTC reviewer directive that ordered this card. **This is the first time it has had a card of its own** — until now it lived in report prose, which is why this section still said NONE. |
| **What we are not doing** | **No rollback** (the live build *is* the rollback target, and every undeployed change is Markdown the site does not serve), no empty kick commit, no further workflow dispatches, no distribution work, no second alert, and **no changes to your Cloudflare settings**. |
| **What this does not mean** | **Nothing about demand, and nothing about the site being down.** Commercial readings are unchanged and remain **zero**. Spend: **AUD $0.00 of $500**. |

**One honest limit:** production was **last read at `2026-08-27T22:31:40Z`**. No fresh probe was taken
this run — the directive that ordered this card also stopped further dispatches, and direct egress is
blocked — so *"still serving `7983146`"* is a 5-hour-old reading carried forward, not a fresh
observation.

---

**Kept below, and no longer live — the retirement notice from run 103/104. It remains correct about
the submission it retired.**

### **NONE.** *(superseded 2026-08-28 03:36 UTC by the card above)*

**Retired 2026-08-27 21:43:45 UTC = 2026-08-28 07:43:45 Sydney (run 103), on the card's own clock,
unanswered.** The submission needed **A4** — `/sportstech`'s newest public item ≤ 72h — and that window
closed at exactly that instant (item **247**, `2026-08-24T21:43:45.078Z`). **Nothing for you to do.**

| | |
| --- | --- |
| **What is preserved** | **Your `A` (2026-08-20 15:04 UTC) stands**, and so does your [03:36 UTC clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737). What expired is a **precondition**, not the authority. Nothing is being re-asked. |
| **What is paused** | The `plenaryapp/awesome-rss-feeds` submission — **paused, not dropped.** You never said **C**, and an unanswered card is not a decision. It resumes when a find worth publishing on its own merits restores A4; that is not scheduled. |
| **What was not done** | **Nothing was published to hold the window open.** [EXP-008](EXPERIMENTS.md)'s binding clauses forbid publishing to move a number. **No second notification was sent** — run 100's was the only one. Third window to lapse unused (2026-08-21, 2026-08-24, 2026-08-27). |
| **What may not be concluded** | **Nothing about demand.** [EXP-009](EXPERIMENTS.md) Reading 2 has no `t0` and stays **Fork D / PENDING — inadmissible, not a null.** A lapsed window is a fact about this loop's schedule, not about strangers. |
| **If you still want it** | Open the issue any time — the card below is kept intact. ~~**A4 must be re-read from production first** and does not currently hold.~~ **Updated 2026-08-28 14:14 Sydney (run 106): A4 holds again until 2026-08-31 14:14 Sydney**, restored by **item 248** — a peer-reviewed hammer-throw IMU study that cleared the remit on its own, with the case against it committed 50 seconds before it went out. It was read from production, not carried forward. Still **no clock, no penalty, no ask** — the fourth window may lapse unused like the first three, and that is fine. |

---

**Kept below, and no longer live — the card as written at run 87. Its A4 row is expired.**

### **ACTION REQUIRED · MEDIUM — one directory submission. ~2 minutes. Expires 2026-08-28 07:43 Sydney.** *(RETIRED 2026-08-27 21:43:45 UTC — A4 lapsed unused)*

**Was live as of 2026-08-25 (run 87), on a freshness reading taken from production that run** —
[agent operator 32805757838](https://github.com/in-c0/tuned/actions/runs/32805757838) at
`2026-08-25T03:35:42Z`: item **247**, `last_public_item_at=2026-08-24T21:43:45.078Z`, **5.9h old**,
**~66h of window left**.

| | |
| --- | --- |
| **What you do** | Open **one** issue at [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds/issues/new) from its *add a feed* template: **Category `Sports`** · **Feed = the route `/sportstech/rss.xml` on `justtuned.com` carrying the `?src=` tag `awesome-rss-feeds`** · **Podcast `No`**. Paste the resulting issue URL on [issue #1](https://github.com/in-c0/tuned/issues/1). Per [L-36](LESSONS.md) the joined string is not printed here — join the route and the tag yourself. |
| **What it unblocks** | **The first measurable external distribution test in Tuned's history.** Every arrival number so far is unattributed; this is the first act that puts a known origin on the other end of a fetch. |
| **Why it needs you** | **Session scope — not authority, and not a missing account. Corrected at run 88.** Your **A** (2026-08-20 15:04 UTC) stands, and your [03:36 UTC clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737) settled authority a second time; neither is the blocker. The executor is authenticated as **`in-c0` — your own GitHub account** (`get_me`, run 88), which *can* open an issue at any public repo. **This Claude session's repository allowlist** filters every call to `in-c0/tuned` first, and cannot be widened from inside. Owner-controlled configuration, not an unfixable fact — see [L-48](LESSONS.md) and the two remedies in [STATUS](STATUS.md#owner-action-required). |
| **Clock** | **A4 expires `2026-08-27T21:43:45Z` = 2026-08-28 07:43 Sydney, Friday.** No penalty for missing it; the candidate just pauses again until a find worth publishing on its own merits restores freshness, which is not scheduled. |
| **Blocker age** | From **`2026-08-24T21:43:45.078Z`**, the instant item 247 made the act admissible again. Last surfaced in the [2026-08-25 03:36:14 UTC owner clarification](https://github.com/in-c0/tuned/issues/1#issuecomment-5404749737), which told the executor to submit directly — **run 88 tried and could not**, so this card is the answer to it. |
| **Second remedy, if you prefer** | Start a Claude session with **`plenaryapp/awesome-rss-feeds` as an initial source** and the executor submits from it. The `add_repo` refusal names this route. Costs a session start rather than two minutes of form-filling — only worth it if you want the executor to hold this class of action generally. **A child session was *not* spawned from here: that is boundary-shopping.** |
| **If you would rather not** | **B** or **C** on issue #1 — both still free. **C** closes [EXP-009](EXPERIMENTS.md) at **Fork D: inadmissible, not null.** An unanswered card is not a decision and will lapse again. |
| **What may not be concluded** | Anything about demand. Nothing has been submitted, so [EXP-009](EXPERIMENTS.md) Reading 2 still has no `t0` and is **not graded**. |

**One caveat you may as well know about.** The reviewer directive that re-opened this card printed the
**joined tagged feed URL publicly** on issue #1 at `2026-08-25T03:33:11Z` — the thing
[L-36](LESSONS.md) exists to stop. So `arrival_fetch:awesome-rss-feeds` can now be written by readers
of that issue before any submission exists. It has never read non-zero, so the baseline is clean up to
that instant, and the split is registered in [METRICS.md](METRICS.md) before the number exists.
**It does not block the submission and is not a reason to wait.**

---

**Kept below — the original card as written at run 61 and narrowed at run 62.** Its **A-1 / B / C**
options are the live choices; **its A4 row is stale**, read the freshness reading above instead.

### **ONE SUBMISSION. No credential to install, no spend. ~2 minutes.** *(SUPERSEDED 2026-08-25 — see the live card above)*

> **You answered A at 2026-08-20 15:04 UTC. It is granted and stands.** What changed is that the
> executor found it cannot carry A out: **its GitHub access is scoped to `in-c0/tuned` and it holds no
> identity at [`plenaryapp/awesome-rss-feeds`](https://github.com/plenaryapp/awesome-rss-feeds)**, so it
> cannot open an issue there. Checked three ways this run — the repository read returned *"Access
> denied … Allowed repositories: `in-c0/tuned`"*, the session's repo-attach refused *"cross-tier adds
> are not supported"*, and no cross-repository token exists among the configured secrets. **That is a
> credential boundary, which is a mandatory stop and is never routed around.**

**The preflight is complete and current — this is the part with the clock on it:**

| Precondition | Reading | Source |
| --- | --- | --- |
| Feed is fresh (≤72h) | **0.0h ✅**, newest item `2026-08-21T09:35:56Z` — **item 246, published this run.** **Lapses 19:35 Sydney, Monday 2026-08-24.** | [32468714667](https://github.com/in-c0/tuned/actions/runs/32468714667) |
| Not a duplicate | **Clear ✅ as of 2026-08-20 21:38 UTC** — no issue at the venue mentioned `justtuned`, and neither did its README. **Not re-read today.** | [32420411861](https://github.com/in-c0/tuned/actions/runs/32420411861) · [32420571372](https://github.com/in-c0/tuned/actions/runs/32420571372) |
| Everything else | A1 partial · A2 ✅ (**your A**) · A3 ✅ · A5 ✅ | [DISTRIBUTION.md](DISTRIBUTION.md) |

| | Response | What happens next |
| --- | --- | --- |
| **A-1** | **"I'll open the issue."** *(recommended)* | You open one issue from the venue's template: category **`Sports`**, feed = route **`/sportstech/rss.xml`** on `justtuned.com` with **`?src=` tag `awesome-rss-feeds`** (joined when you paste, per [L-36](LESSONS.md)), not a podcast. Paste the resulting URL on [issue #1](https://github.com/in-c0/tuned/issues/1) and the executor records t0 and grades [EXP-009](EXPERIMENTS.md) from there. **This is the only option that produces a link anyone can check later.** |
| **A-2** | ~~**"Use the Google form instead."**~~ **WITHDRAWN run 62.** | It claimed *"the executor can submit it unaided the moment you say so."* **That was false.** The form is open to an anonymous *human*; this executor has **no instrument that can submit a form to anyone** — egress **403 to every host including `docs.google.com`**, and one GET-only external reader with no form-filling or POST in it. **Nothing is lost:** A-2 was already the weaker option, since a form leaves no receipt and no link. |
| **B** | **"Build the thing that can submit."** *(new, not recommended)* | Reviving A-2 needs a **new instrument that writes to other people's websites** — a capability, not a permission, and one this loop has never had. Listed only so the withdrawal is not read as the door closing. The executor is **not** asking for it. |
| **C** | **"Drop the candidate."** | Still costs nothing at any hour. The venue leaves the register and EXP-009 closes at **Fork D — inadmissible, not null**. |

| | |
| --- | --- |
| **Severity** | **Blocking the loop's single objective, and on a clock.** Nothing is at risk and nothing breaks, but the freshness condition lapses **2026-08-24 09:35:56 UTC, 19:35 Sydney Monday** (the earlier window lapsed unused at 2026-08-21 04:15:49 UTC and run 65's item 246 reopened it); after that the submission waits on the next find genuinely worth publishing, which is not scheduled. **No penalty for missing it**, and the executor will publish nothing to hold it open. |
| **Blocked outcome** | The first channel of **known-human traffic** in Tuned's history. Blocker #1 — *no arrival is known to be human* ([§5](#5-blockers-ordered-by-leverage)) — now has **every admissibility condition satisfied**. What is left is not a condition; it is an account the executor does not have. |
| **Why it needs you** | Not authorship — you settled that. **Access, and now capability.** Posting at a third party's repository needs an identity there, and the executor has one only at `in-c0/tuned`. **Run 62 adds the wider fact:** it holds no instrument that can write to *any* third party, so no venue and no form changes this. |
| **Exact minimum action** | **A-1:** open the issue, paste its URL on issue #1. **B or C:** one comment saying so. No credential to install, no spend. |
| **Observable success check** | A `plenaryapp/awesome-rss-feeds` issue URL posted on issue #1, or a comment naming **B** or **C**. **This card is removed the run after one of those exists.** |
| **Blocker age** | **Opened run 61 (2026-08-20 21:55 UTC).** The authorship question that preceded it is **closed** — asked 2026-08-19 04:30 UTC, answered 2026-08-20 15:04 UTC, age ~35 hours. **Run 62 narrowed the card** by withdrawing one unperformable option rather than restating it. |
| **Where surfaced** | This card, [STATUS.md's canonical card](STATUS.md#owner-action-required), blocker #1, STATUS's Next action, [DISTRIBUTION.md](DISTRIBUTION.md), and run 61's report on [issue #1](https://github.com/in-c0/tuned/issues/1). |

**One thing that changed about the decision, worth a sentence before you answer.** Run 58 registered
EXP-010: a tagged link cannot on its own tell a directory's readers from anyone who assembled the URL
from this loop's public source, because nothing this loop holds is private. EXP-010 measures how big
that problem is by **2026-09-04**. **That is not a reason to wait** — whether the submission is
allowed at all does not depend on it — but a submission made before then gets read against a
comparison that does not exist yet.

**`ooh.directory` is unaffected and still not ready.** The second directory wants the feed's **web
page** rather than its RSS file, and its arrival counter is not wired up, so it would not be submitted
today under any answer. **Only `awesome-rss-feeds` is ready.**

**Why the executor did not just use the form, since your A allowed it.** Two reasons from this loop's
own rules rather than from caution. The standing reviewer directive says that when a precondition
fails — naming *"authentication fails"* explicitly — the executor makes no submission and records the
exact failure instead of finding another way. And a form leaves **no artifact anyone can point at**,
which would make a silent result unfalsifiable: *"the maintainer declined"* and *"the form never
arrived"* would look identical forever. A channel worth testing is worth testing in a way that can come
back negative and be believed. **If you would rather have the attempt than the receipt, say A-2 and it
goes out.**

**Nothing was sent to your phone or inbox this run**, and none is claimed — that channel is not
authorized, and this card plus [issue #1](https://github.com/in-c0/tuned/issues/1) are the whole ask.

---

**Previously here, and closed — the `AGENT_OPERATOR_KEY` card.**

**You installed it, and it works.** Closed **2026-08-15 03:43:10 UTC** on its own stated success
check, not on anyone's opinion: `action=list` returned `HTTP 200` with **`owner: @ava · active 0/12`**
([run 31862547681](https://github.com/in-c0/tuned/actions/runs/31862547681)).

| | |
| --- | --- |
| **Opened** | 2026-08-14 (run 38) |
| **Closed** | 2026-08-15 03:43 UTC — age **~29 hours** |
| **How it was confirmed** | The unauthenticated route went **503 → 401** on a routine push check at 03:42:09, then one read-only `list` returned **200**. |
| **What it cost** | AUD $0. The executor never saw the value and cannot read it back. |

**Nothing was done with the new capability.** `active` is **0/12** and `operator_agents` is empty. The
run named four feeds as *adoptable* — `@graphics`, `@sportstech`, `@wearables`, `@wellbeing` — which
only means "you already own these and they are not yet managed". **None was adopted, created, published
or disabled.** No secret, charter, token or member data appeared in the log; the workflow prints named
fields only.

**Nothing on this plane is yours to decide — and two sentences here were stale, corrected rather than
deleted.** This said the first agent still needed authorizing and that none of the four owned feeds had
been touched. Both were written at run 42: run 44 adopted **`@sportstech`** under the reviewer's public
remit and run 52 published its first source-linked find, so adoptable today is **`@graphics`,
`@wearables`, `@wellbeing`** — three, not four. A *further* agent needs a reviewer authorization plus a
public remit committed to [`ops/agents/`](agents/), and a pre-registration of what a working agent feed
must show before any number is read off it. If you ever want it switched off, `disable` is one dispatch and
destroys nothing — it revokes the operator's authority and leaves the feed, its items and your own
studio URL untouched.

**One limit worth carrying into that decision:** the executor's proxy blocks direct page fetches, so its
agent encounters material at result level, not page level. Real, but shallow — a reason to keep the
first remit narrow.

---

**Previously here, and still true — there is no Hacker News action.** The *email Hacker News
moderation about the dead item* card is withdrawn, and it
was never performed. Do not send it, and do not repost.

**Why.** The packet it was trying to recover cannot be posted to Hacker News at all, whatever
moderation would have said. Two defects, either one disqualifying, both in the executor's own work:

| | |
| --- | --- |
| **§3 was written by an AI** | ...and the packet instructed *you* to post it as your own first comment. HN asks people not to post generated or AI-edited text in comments. |
| **§2 was a landing page** | `https://justtuned.com/?src=shn-2026-08` is application-gated. Show HN asks for something a reader can try directly and treats landing/sign-up pages as off-topic. |

Restoring the item would have restored an **invalid test** — and an invalid test produces exactly the
flat counters a genuine rejection produces, which is how a defect in the executor's copy would have
entered the record as a finding about Tuned. It didn't. Recorded as [L-17](LESSONS.md).

**Nothing here is evidence about demand**, in either direction. EXP-002 is `INVALIDATED / NOT STARTED`
with no t0, no window and no grade; the zero baseline is intact and unspent.

**A future Hacker News attempt needs all three of these first** — standing constraint, not an action:
a **directly usable destination** that needs no application; **your own genuinely human-written words**
for the title and any comment, which the executor will not draft or edit; and **explicit moderator
permission** to submit again. None is urgent, and none is queued.

**Underneath, the real blocker is unchanged — and since run 55 it *is* yours:** 0 applications against
431 UA-flagged human-shaped landing views, so no arrival is known to be human. The Hacker News channel
meant to fix that was withdrawn as inadmissible; a different candidate was found, its rules read, and
its counter built and verified in production. **The one condition left on it is the A/B/C decision at
the top of this section.** This paragraph said *"not yours right now"* for five runs after that stopped
being true.

**Bot Fight Mode: closed 2026-08-11, and now retired from this card** as promised — the full record,
including the two colo readings that settled it and the standing recommendation to use path exemptions
if bot protection ever returns, lives in [STATUS.md](STATUS.md). Production has stayed green through
the public zone since, most recently [run 31640663090](https://github.com/in-c0/tuned/actions/runs/31640663090)
on 2026-08-12 at 21:03 UTC.

**Still deliberately *not* listed:** payment-provider account creation. It becomes the blocking step
when there is paid demand to collect. There is none — see [§4](#4-funnel-revenue-and-spend). One
action at a time.

**How this section behaves:** either `NONE`, or exactly one canonical action carrying severity, the
blocked outcome, why owner authority is required, the exact minimum action, an observable success
check, blocker age, and where it was last surfaced. It is removed the moment its success check passes,
not when the executor notices. New or materially changed actions are surfaced by the scheduled reviewer
directly in ChatGPT; unchanged ones are not repeated. Private channels (phone, email, SMS) are used
only with explicit owner authorization.

## 2. Current phase and single objective

**Phase:** incident **closed** 2026-08-11 (~22 hours, 2026-08-10 06:53 → 2026-08-11 ~05:00 UTC). The
funnel is readable again through the public zone, and as of run 18 the **apply path is proven to work
in production**. The constraint is not inside the product.

**Single active objective: obtain controlled, known-human traffic.** EXP-003 killed the mechanism
explanation for 0/115 — a real browser applied successfully at both mobile and desktop widths. What
remains is that **no arrival is known to be human**, and with an unknown denominator no conversion
figure is gradeable. **The one channel it had is gone.** It was authorized 2026-08-08, submitted
2026-08-13, killed at submission — and then **withdrawn on review** as inadmissible on Hacker News' own
rules. The objective is unchanged and so is the blocker; what changed is that there is now **no
prepared channel and no owner step in front of it** — see [§1](#1-owner-action-required).

**Explicitly not doing** (full list in [STATUS.md](STATUS.md)): no pricing/positioning/copy work
while the denominator is unknown; no CTA-reach counter yet — right instrument, wrong traffic; no
Hacker News activity at all — EXP-002 is withdrawn, and **no repost, no second account, no reworded
resubmission, no alternate link and no contact with moderation**, the last of which was itself
withdrawn this run; **no drafting of public copy for the owner to publish in their own name**, which
was the defect in EXP-002 rather than an incidental detail of it; no replacement channel invented and
executed this cycle, and no thread seeding; no secret read, hash, rotation or exposure, ever; no
spend; no generic summarizer, content generator or enterprise observability dashboard; no invented
baseline, forecast or traction claim.

## 3. Milestone horizons

All sixteen, from [MILESTONES.md](MILESTONES.md) — that file carries the full evidence conditions; this
is the index.

**Sub-day ladder anchor:** run 18, **2026-08-08 09:30 UTC / 19:30 Sydney**. It is rolling — re-anchored
at the start of each run. Run 17's rungs are graded below **by this run**, not by the one that set them. These six horizons did not exist before the owner requested them at
[07:04 UTC today](https://github.com/in-c0/tuned/issues/1#issuecomment-5225045057), so **no grade is
assigned to any sub-day window that closed before that**; inventing retrospective achievements is the
one thing this ladder must not do.

| Horizon | Target | Outcome in one line | Status | Blocker | Next action |
| --- | --- | --- | --- | --- | --- |
| 15 min | 09:45 UTC | EXP-003 pre-registered **and committed** before any production reading | **achieved** 09:38 UTC | cleared | — ([`b62bf08`](https://github.com/in-c0/tuned/commit/b62bf083cbdeeb74ab6e81b134a5473d2cd7fc3b)) |
| 30 min | 10:00 UTC | A real browser has answered *can a visitor apply?* against live production, at both widths | **achieved** 09:47 UTC | cleared | — ([run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499)) |
| 1 hour | 10:30 UTC | Any defect the mechanism test exposes is fixed and verified live, or recorded as deliberately unfixed | **achieved** 09:47 UTC | cleared | — ([`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba)) |
| 3 hours | 12:30 UTC | The next run does **not** spend its cycle on a copy rewrite or another instrument — falsified if the next claim picks either without a directive requiring it | active | needs a next run to grade | hold the line in the run-19 claim |
| 6 hours | 15:30 UTC | Owner has an explicit, single decision in front of them: authorize a first channel, or say what to do instead | active | owner is asleep — 19:30 Sydney | surfaced in the run-18 report; do not re-ask |
| 12 hours | 21:30 UTC | ≥1 arrival is **known** to be human, or a recorded reason none can be | not started | owner authorization for a first channel | nothing executor-side unblocks this |
| 1 day | 2026-08-09 | The funnel is readable — one authenticated snapshot | **achieved** 2026-08-08 | cleared | — |
| 1 week | 2026-08-15 | ≥3 consecutive daily snapshots; constraint identified as conversion or distribution; EXP-002 graded if it ran | **condition 1 MET** (5 snapshots) · **condition 2 MISSED**, graded 2026-08-13 Sydney per the 2026-08-11 precommitment. Run 34's withdrawal does not disturb the grade — it reinforces it: *"if it ran"* was never satisfied, and the experiment is now `INVALIDATED / NOT STARTED` and never will be | — | **No owner action.** The grade is recorded, not renegotiated; an inadmissible packet does not excuse a publication that never happened |
| 2 weeks | 2026-08-22 | A real payment path exists; first genuine willingness-to-pay evidence — or the wedge is falsified | not started | payment-provider account is an owner boundary | request the account once demand exists |
| 1 month | 2026-09-08 | First gross cash; activation measured, not assumed | not started | all of the above, in order | decided by the baseline |
| 3 months | 2026-11-08 | A small **retained paying cohort** | not started — *past the 2026-10-05 operating date; owner's to carry* | everything above | hand over an honest cohort table at closeout |
| 6 months | 2027-02-08 | Multiplayer earns its place: followed attention retains better than the solo desk | not started (directional) | wedge unproven | — |
| 1 year | 2027-08-08 | Provenance is the reason people stay; agent creators have identity and distribution | not started (directional) | — | — |
| 3 years | 2029-08 | Following an agent's attention is as ordinary as following a person's | not started (directional) | — | — |
| 5 years | 2031-08 | Attention provenance is infrastructure, verifiable rather than claimed | not started (directional) | — | — |
| Indefinite | — | Humans contribute **attention, not content**; provenance never blurred, never fabricated | standing doctrine | — | — |

**Nearest falsifiable milestone that is not this run's own paperwork: the 3-hour one** — establish
whether the apply path works at all.

## 4. Funnel, revenue and spend

**Two sources, deliberately not merged.** The **stage table below is still the 08-12 reading** —
[`567dad0`](https://github.com/in-c0/tuned/commit/567dad0), `generated_at` 2026-08-12T21:24:27Z,
covering 7 UTC days (2026-08-06 → 08-12, last partial). The **content totals and ingestion figures in
the bullets are the 08-14 reading** —
[`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3),
`generated_at` 2026-08-14T20:58:56Z. Both read through the public zone by the scheduled job. The
stage table was not re-derived this run because the directive was a bounded supply-side
reconciliation; it is **stale by two days and labelled so** rather than silently refreshed in part.
Full reading and caveats in [METRICS.md](METRICS.md).

| Stage | Observed | Note |
| --- | --- | --- |
| Landing views, human-flagged | **431** (29 / 69 / 56 / 56 / 84 / 71 / 66) | UA heuristic — **not** verified human traffic |
| Landing views, bot-flagged | **140** (15 / 23 / 43 / 7 / 18 / 26 / 8) | never merged with the above |
| Feed views | **62** human-flagged, **58** bot-flagged | 08-11's 32 bot-flagged feed views are the largest single day of either kind |
| **Applications submitted** | **0** | `application_submit` has never fired |
| Member logins · desk views | **0** · **0** | counters have never fired |
| Attention actions since instrumentation | **0** | `attention_star` / `attention_skip` never fired |
| Members ever active | **0 of 1** | `member_days` is empty |
| Return use (D1+, 2+ active days) | **0** | nothing to return from |

- **Landing → application: 0 / 431 = 0.0%.** 95% one-sided upper bound ~0.7% (was ~0.9% at n=333).
  The bound tightens; the estimate does not move. Do not treat "0%" as a measured constant.
- **08-11 revised upward as the day finished: 39 → 71 human-flagged, 11 → 26 bot-flagged, and feed
  views 0 → 15 human-flagged.** The previous reading was taken at 09:33 UTC, a third of the way into
  the day. Not new traffic, not a trend — the same day, finished. 08-12 (66) is partial for the same
  reason and will move too.
- **The 08-10 and 08-11 arrival counts remain censored, not merely noisy.** A challenged request never
  reached the Worker and was never counted, so the incident window is missing an unknown number of
  machine arrivals. This is stated, not estimated.
- **Gross cash collected: AUD $0.** Source: *no billing exists*. Not an estimate, not a forecast.
- **Autonomous spend: AUD $0.00 of the AUD $500 cap.** Running total in [DECISIONS.md](DECISIONS.md).
- **No traction is claimed.** 431 UA-flagged views on a product with no distribution proves **the
  counters work**, not that demand exists.
- **Content totals moved for the first time since instrumentation, on the queued side only** (08-14
  snapshot [`7a73982`](https://github.com/in-c0/tuned/commit/7a739827c21f9716765670f20f05fadeb1899ad3),
  `generated_at` 2026-08-14T20:58:56Z): **79 public items (unchanged), 146 queued (was 42, +104)**,
  5 feeds (1 human / 4 agent), 8 stars, 33 skips, 1 member, 0 followers, 1 connection. The +104 is
  Spotify ingestion — `spotify_items_captured = 104` on 08-14 across 30 successful polls with zero
  errors — and it matches the queue delta exactly. **Public items have been 79 on every snapshot ever
  committed.** Supply is not the constraint; publication is, and publication is a human act nobody has
  performed. **This is supply from one member's listening, not demand** — no conversion inference
  either way.
- **On the AUD $1,000,000 / 60-day stretch target:** it is optimization pressure and direction. No
  number on this dashboard forecasts it and none should be read as predicting it.

## 5. Blockers ordered by leverage

| # | Blocker | Owner | Cost | State |
| --- | --- | --- | --- | --- |
| 1 | **[Run 83, 2026-08-24 09:35:56 UTC: A4 lapsed and the candidate is PAUSED, not dropped.** The submission below reached every admissibility condition and was never made — the executor holds no account at the venue and the owner did not open the issue inside the window. **`A` is preserved**, §1 is **NONE**, and it resumes when a find worth publishing on its own merits restores freshness. **No demand inference; [EXP-009](EXPERIMENTS.md) Reading 2 is not graded.]** **No arrival is known to be human.** EXP-003 proved the apply path works in production, so the zero is not explainable by a broken form — the denominator is the problem. **431** UA-flagged views on a product never posted anywhere is most likely crawler traffic. **The Hacker News channel meant to fix this was withdrawn as inadmissible on 2026-08-13** (see #3). **Runs 55–56 replaced it and closed every condition the executor controls:** `plenaryapp/awesome-rss-feeds` permits the post on its published rules, and the arrival counter for the exact URL was built and verified against the deployed build. **The single remaining condition is the owner's A/B/C answer — see [§1](#1-owner-action-required).** This row said *"no owner step"* for five runs after that stopped being true; corrected run 59. | **Owner decides — A/B/C on [issue #1](https://github.com/in-c0/tuned/issues/1)** | AUD $0 | **Open. Top blocker, and one word from testable.** Opened 2026-08-19 04:30 UTC, unanswered across runs 55–58. See §1. |
| 2 | **No payment path.** No provider account exists, so gross cash is structurally $0 regardless of demand. | Owner — account creation | unknown | Not started; **not yet blocking** — no demand to collect. |
| 3 | **EXP-002 authored, authorized, submitted, killed — and then withdrawn as inadmissible.** Run 34 found it unpublishable on HN's own rules whatever moderation said: AI-written body to be posted as the owner's own comment, application-gated landing page as the URL. Eleven runs verified its *claims* and none asked whether the venue permits that form by that author. | Closed — no owner action | AUD $0 | **Closed unperformed.** Packet fenced WITHDRAWN; EXP-002 `INVALIDATED / NOT STARTED`; checker retired. [L-17](LESSONS.md). |
| 5 | ~~**The operator plane cannot retract a publication.**~~ **Opened run 52 and closed run 53, same day (2026-08-18).** `retract`/`restore` ship in [`91f84d6`](https://github.com/in-c0/tuned/commit/91f84d6) and were exercised on item 242 in production and reversed exactly. Neither deletes; `restore` refuses to reverse a hide the **owner** made. [L-32](LESSONS.md). | — | AUD $0 | **Closed.** Full evidence in [STATUS.md](STATUS.md) and [DECISIONS.md](DECISIONS.md). |
| 4 | **Executor has no direct egress** — 403 CONNECT at the proxy, **36** consecutive runs, re-tested 2026-08-16 (run 47) against `justtuned.com` and `example.com`, and confirmed for `WebFetch` as well as `curl`. Every production and third-party reading in this loop comes from GitHub Actions. | Environment | — | Mitigated, not fixed, and **less limiting than this row implied for three runs**. Run 47: search works from the executor and page fetches do not, but the *loop* can now open a page too — [`source-read.yml`](../.github/workflows/source-read.yml) reads one third-party page in a real browser from Actions. What is still true is only that **the executor process** cannot fetch directly. [L-25](LESSONS.md). |

## 6. Current experiment

**Two are open.**

- **EXP-013 — can an agent feed publish on a cadence with no person selecting? OPEN. Reading due on
  the complete 14 days 2026-09-12 … 2026-09-25** (run 153, pre-registered **in the same commit as the
  bar, before it had screened a candidate**). Canonical: [EXPERIMENTS.md](EXPERIMENTS.md).
  `@sportstech`'s publisher was a scheduled executor run doing a cycle whenever it chose to — six
  publications in 24 days. It now has a selector: a remit translated into an explicit public bar,
  applied to the **open-access full text the agent fetches for itself**, publishing at most **one**
  find per run through the operator plane. **Interim, and not a graded reading:** threshold 1
  satisfied, threshold 3 satisfied (item **280** carries its provenance on feed page and RSS, 15
  assertions green), **threshold 2 FAILED at 25.7% against a 25% bar** so Fork B was taken and
  scheduled runs now publish nothing, threshold 5 is the one that caught the defect — four clinical
  rehabilitation papers in the first screen's ten selections — and **threshold 4 cannot be met while
  the schedule is disarmed.** What is demonstrated is the capability, not yet the cadence. **None of
  it is demand:** `followers` is **0**, so no subscriber noticed.

  **Window reading added 2026-09-23 (run 186), still interim — three screens have not fired and the
  reading is still due 2026-09-26.** Computed rather than read off by eye, by
  [`scripts/exp013-window.mjs`](../scripts/exp013-window.mjs) inside Actions, because the screening
  records cannot be fetched from the executor session and expire at 90 days. Source:
  [`exp013 window` run 35818516766](https://github.com/in-c0/tuned/actions/runs/35818516766).
  **9 of 10 scheduled screens reached a verdict**, every rejection naming exactly one clause;
  **threshold 2 fails on 2 of the 9** at 25.7%, with the other seven at **22.9%–25.0%** — the two
  failures clear the bar by **one candidate**, so the bar separates almost nothing. On the **decided**
  set every screen runs **36.4%–45.0%**, which is the numbers behind run 153's recorded objection that
  the denominator is mis-specified; **the threshold was not re-specified and the schedule was not
  armed.** The 2026-09-22 screen is the one run 184 caught and **contributes no observation** rather
  than counting as a quiet day. And the nine screens carry **two** distinct top selections, not nine —
  they are **not nine independent observations of the bar**.

- **EXP-011 — is `landing_view` a browser at all? CLOSED, GRADED 2026-09-19 (run 173): R = 0.58%,
  Fork R-A — *mostly not a browser*.** Over the eleven complete UTC days **2026-09-05 … 2026-09-15**
  (window shortened by run 166 under its own regression clause), **Σ `landing_render` 4 ÷ Σ
  `landing_view` 686 = 0.58%**, against a cut point of **10%** registered on 2026-09-04 before the
  counter existed. **Nine of the eleven days produced no rendering browser at all.** `landing_engage`
  read **1**; `application_start` **0**. Source [`metrics/latest.json`](metrics/latest.json)
  `generated_at` 2026-09-18T04:44:34Z, admissibility checked mechanically
  (`node scripts/metrics-window.mjs admits 2026-09-05 2026-09-15` → ADMISSIBLE). All three instrument
  brackets green, so **R-D is excluded across the span**; **R-E did not fire** — both first-party
  clients declare themselves. **What it settles:** the standing claim *"the landing page is not the
  bottleneck, distribution is"* is **upheld and upgraded from an inference to a measurement**.
  **What now binds:** `landing_view` is **retired as an audience number**, `landing_render` is **the
  denominator of every landing-page reading**, and **the remaining days go to obtaining real arrivals
  rather than to the page**. **What it is NOT:** R is not a count of people — **4 is an upper bound on
  rendering browsers and may be zero humans** — it is not demand, not traction, and it does not
  certify the page, which was never measured against an audience that did not arrive. No rate is
  formed on this window: `landing_engage ÷ landing_render` is 1 ÷ 4 and that quotient is Fork R-C's
  next action, not R-A's. **One reading, one date, no extension, no recomputation.**

  *Original registration, retained:* (run 138, pre-registered 2026-09-04 22:20 UTC, **before the
  counter existed**).
  Canonical: [EXPERIMENTS.md](EXPERIMENTS.md). **The claim that has steered nineteen days of work
  rests on a counter that cannot test it.** `landing_engage` needs the visitor to scroll, click or
  type, so *"nobody real is arriving"* and *"real people arrive and leave"* read the same near-zero —
  7 engages against 1131 landing views over 2026-08-16 … 2026-09-03, unsuffixed `application_start`
  never written once. `landing_render` fires at script execution and asks nothing of the visitor, so
  **R = render ÷ view** over 2026-09-05 … 2026-09-18 either upholds *"distribution is the
  bottleneck"* on measurement (**R-A, < 10%**) or contradicts it (**R-B, ≥ 40%: the page is the
  bottleneck**), with **R-C** mixed, **R-D** the beacon never landing, **R-E** contamination by our
  own QA. **R is a ratio of client populations, never a count of people, and a high R is not
  demand.** Binding on this loop until 2026-09-18: the landing page's copy, layout, offer and form
  must not change, and `landing_render` must not fire from any other page. **Run 140 — R-D is ruled
  out at the emitter on day 1 of 14.** A real Chromium against live justtuned.com
  ([33959936807](https://github.com/in-c0/tuned/actions/runs/33959936807)) emitted `landing_render`
  on a bare page load, production answered **204**, it fired exactly **once**, and the page threw
  **no errors**. The check that produced this had itself been broken since the counter shipped and is
  now guarded by two CI-visible invariants ([L-56](LESSONS.md)); **two more brackets are registered,
  one inside the window and one on 2026-09-19 before the reading.** Our QA browser declares itself
  automated, so its increments land in the `_bot` names and **never in the numbers R is computed
  from** — overriding that identification on any spec fires **R-E**. Carried as a known, measured,
  deliberately unfixed hazard: the beacon is top-level but not first, so a throw in the ~15 preceding
  lines would suppress it and bias **R toward R-A, the answer we already hold**; hoisting it is
  declined inside the window, and the registered trigger to do it anyway is any page error preceding
  the render pulse in any bracket.
- **EXP-008 — can the operator control plane publish one real agent find? NOT STARTED / GATED**
  (run 44, pre-registered 2026-08-15 at adoption, **before any operator publication existed**).
  Baseline read back from production at adoption: `@sportstech` `source=adopted`, `public_items=11`,
  `operator_publications=0`, newest public item **2026-07-30**; site-wide `items_public` **79**. A
  first publication must show all six: 201 with an item id, **exactly one** new item,
  `operator_publications` 0 → 1, a replay that publishes **nothing**, the AI/agent label present on
  both the feed page and `/sportstech/rss.xml` (verified in a real browser and a real fetch — this is
  run 40's regression run forwards), and a find that was **genuinely encountered**. **Gated:** no
  publication until EXP-007's first complete-day reading is committed and graded. "Publish nothing" is
  pre-registered as an acceptable outcome. Capability evidence, explicitly **not** demand — and
  explicitly not a licence to publish because a feed looks stale.

- **EXP-007 — is there a human on the other side of the landing page? PENDING** (run 43,
  pre-registered 2026-08-15 04:20 UTC, **before the counters it reads existed**). Five mutually
  exclusive forks, each with its own next action: *the denominator is not human* → stop optimising the
  page, the constraint is distribution; *the offer does not land* → the proposition becomes testable
  for the first time; *intent exists and is being lost* → cut the form to email-only; *validation is
  eating applications* → a defect, fixed immediately; *under-powered* → grade nothing and wait. An
  **instrument validity gate** sits ahead of all five: zero engagement against non-zero views means the
  instrument is broken, not that nobody came. **Read from the snapshot covering the complete UTC day
  08-16 — not before, and not from a dispatched snapshot.** Nothing is graded against the 605
  historical views; the counters start at zero on their own deploy.

- **EXP-006 — is the flat queue a quiet member or a broken sync? GRADED: QUIET, NOT BROKEN / CLOSED**
  (run 37, 2026-08-13 22:32:24 UTC). Six mutually exclusive forks pre-registered before any counter
  existed, each with its own next action; fork 1 fired on n = 1 poll. **Not re-graded since, and it
  will not be** — but the same standing counters read very differently on **2026-08-14: 30 runs, 30
  successes, 104 plays captured, queue 42 → 146**. That later observation is filed beside the grade in
  [EXPERIMENTS.md](EXPERIMENTS.md), not merged into it. Its own pre-registered rule still binds: a high
  capture count is **one member listening to music — supply, not traction.**

- **EXP-005 — is the attention Tuned publishes actually recent? HYPOTHESIS SUPPORTED / CLOSED**
  (run 35). Pre-registered before any production read, threshold fixed first: the landing demo's
  newest item must be **< 48 h** old for the word *"now"* above it to be defensible. Measured
  **270.6 h** ([run 31689710757](https://github.com/in-c0/tuned/actions/runs/31689710757)) — 5.6× over,
  and **the red run is the finding**. Also caught a latent defect that was passing by luck: the demo
  was selected by creator registration date, not by content recency. GETs only; nothing written.
  Instrument kept — `qa/freshness.spec.mjs` is re-runnable and fails again the moment the page
  outruns its data.

- **EXP-001 — funnel telemetry baseline: PASSED / CLOSED** (run 16). Threshold was a non-zero
  `landing_view` or `landing_view_bot` on ≥1 day; observed non-zero on **all three**. Its pre-registered
  fork (*zero views → distribution problem*) **did not fire** — the constraint sits one stage further
  down than the experiment was built to see.
- **EXP-003 — application mechanism test: PASSED / CLOSED** (run 18). Pre-registered before any
  reading; all six criteria hold on live production at 390×844 and 1440×900
  ([run 31251303499](https://github.com/in-c0/tuned/actions/runs/31251303499), screenshots attached
  as artifacts). No application created, no counter incremented. One unrelated first-party 404 found
  on the first run and fixed in [`5ef6970`](https://github.com/in-c0/tuned/commit/5ef6970b50487cace86fb4fbdbac8d7a33e2afba).
  **Its finding in one line: a visitor who arrives can apply — nobody has.**
- **EXP-004 — public no-account surfaces: PASSED / CLOSED** (run 19). Pre-registered before any
  reading. All five criteria hold on live production at both widths
  ([run 31252271974](https://github.com/in-c0/tuned/actions/runs/31252271974)): demo link → `/ava`,
  feed 200 with **24 items** and no empty state, `/ava/rss.xml` 200 `application/rss+xml` with **38**,
  no first-party errors, no horizontal overflow. GETs only; nothing written.
- **EXP-002 — Show HN distribution smoke test: `INVALIDATED / NOT STARTED`, withdrawn 2026-08-13.**
  Authorized [13:56 UTC](https://github.com/in-c0/tuned/issues/1#issuecomment-5226414917), submitted
  **2026-08-13 00:13:23 UTC**, item `49280269` **`dead: true`**
  ([run 31654090210](https://github.com/in-c0/tuned/actions/runs/31654090210)) — and then found
  unpublishable on HN's own rules regardless (AI-written body posted as the owner's comment;
  application-gated landing page as the URL). **No t0, no window, no snapshot, no inference, no
  grade — and none will be created if the item is ever restored.** All bands unspent; the packet is
  fenced **WITHDRAWN** at [EXP-002-PACKET.md](EXP-002-PACKET.md).
- **No experiment is currently running.** EXP-011 closed on 2026-09-19 with Fork R-A. **EXP-012** (ooh.directory arrivals) and **EXP-013** both remain registered with readings still ahead, and both are defined over complete UTC days — which is what `scripts/metrics-window.mjs` now guards. That is the honest state of §6.

Details and grading rules: [EXPERIMENTS.md](EXPERIMENTS.md).

## 7. Latest three lessons

From [LESSONS.md](LESSONS.md), newest first. Each entry there carries the full problem → attempt →
mistake → why → evidence → lesson → next attempt → prevention check.

| # | Lesson | More elegant next attempt |
| --- | --- | --- |
| **L-111** | **The ban list was a transcription of the defects that had been fixed, so it graded those and nothing else.** `/`'s `<meta name="description">` — the search snippet for the one address every canonical, the sitemap and the README name as this site — read *"…A **live** page of what someone is actually watching…"* over feeds four of five of which had published nothing for eight weeks. [`socialHead`](../src/pages.ts)'s own docstring forbids exactly that (*"no adjective the page cannot support"*); two of its three callers obeyed and the front door did not. Run 182 had ruled on this element one page class over and written a guard — banning `"right now"`, `"a live feed of"`, `"live feed of what"`, `"is live"`, **every one a fragment of the two strings it had just fixed.** This page says *"a live **page** of"*: one noun away from a filter written to catch exactly it. And [`test/sharing.test.ts`](../test/sharing.test.ts) **required** the sentence verbatim — a run-108 guard against silent copy edits that, once the copy was ruled wrong elsewhere, had become a requirement that the defect stay ([L-108](LESSONS.md#l-108) again). | **A guard written from the strings you just fixed grades those strings, and the next author is not copying the sentence you deleted — so write it from the CLASS and then run it against a rewording.** The cheap check is mechanical: restate the claim in different words and confirm the guard still fires (mutation 4, *"a real-time page of"*, passes all four old literals). **Why the surface decides and not the spelling:** four other *live* strings on this site are sanctioned and untouched, because they sit in `<body>` where the derived ages travel with them and three are contrastive; `<meta name="description">` is the one that is **copied**, reaching a stranger with no disclosure able to follow it — [L-110](LESSONS.md#l-110)'s test, which must be able to clear strings as well as condemn them. **Removal must not become assertion:** no derived age goes in a copied string, because the copy freezes. **And both the rule and the set must be graded:** mutation 2 spliced a derived age in and reddened **only** the invariance companion, while mutation 5 planted the claim on a **find page** — a class no currency test names — and only the check reading its paths off `/sitemap.xml` caught it. |
| **L-110** | **The fix was made safe by a sentence on a surface the fix's own consumer does not read.** Run 191 advertised all five feeds to software and justified including the four quiet ones with *"its card already states its age"* — but a feed reader parses `<head>` and shows a list of titles, and the card is in `<body>`. The mitigation was cited from a surface the consumer never sees. **This is [L-109](LESSONS.md#l-109) a second time, inside the commit that wrote L-109:** a claim satisfied where a human reads and absent where the machine reads. Naming a pattern does not immunise the commit that names it, and the first place to look for it is the diff that closes it. **The check is mechanical — delete the rest of the document and ask whether the safety argument survives.** Corollary from the mutation pass: grading *agreement between two surfaces* is satisfiable by two constants, so it needs a companion requiring the value to vary with the row, and a conditional fix needs its empty case graded separately. |
| **L-109** | **The fix was scoped to the pages that HAVE a feed, and the page that leads to them was not one of them.** `justtuned.com` — the address every canonical, the sitemap and the README name as this site, and therefore what a person pastes into a reader and what a directory resolves — carried no feed-discovery link at all, while displaying five live feeds to a human. Run 86 shipped that link after finding it absent everywhere and `discovery.test.ts` still opens by saying so; run 164's find pages inherited it. The rule came out as *a page that is a feed advertises itself*, under which the homepage is **correctly** excluded — a reader's rule is *a page advertises the feeds it leads to*, and the two differ on exactly one page: the one that lists them. | **When a fix is scoped to "the pages that have X", ask separately what the consumer of X does, and which page it starts from.** A rule phrased over the things that *carry* a property always excludes the thing that *points at* them, and the pointer is usually the entry point — so the exclusion lands where it costs most. **The tell is a completeness claim in prose sitting above a test that grades one instance:** the sentence names the population, the test names a member, and nothing reconciles them. Our own find pages already followed the broader rule, so the codebase contradicted the narrow one and nothing made that legible. **Second half, from the mutation pass:** five distinctly-titled links all pointing at **one** feed passed the outcome test, because it compared each fetched feed to *the href that reached it* — true by construction. **Checking each link against itself is not checking the mapping; only the set is.** The same shape appeared a third time in the production check written the same hour. **Prevention: when a comment states a property, break the code so that property fails and confirm the check goes red — if it stays green, the comment is the specification and the code is not meeting it.** |




Older lessons, including L-08's control-plane warning and L-10's contamination rule, remain in
[LESSONS.md](LESSONS.md). L-08's forward test — *does the next run spend its cycle on demand evidence
rather than more control plane?* — is the one run 138 had to answer, and the answer is not automatic:
`landing_render` is an instrument, and this loop has built many. What separated it is that it was the **only** measurement available here that could change what the remaining runs do without anyone's permission. **On 2026-09-19 it did.** Fork R-A graded at R = 0.58% and its registered next action sends the remaining days to obtaining real arrivals rather than to the landing page, so L-08's forward test — *does the next run spend its cycle on demand rather than more control plane?* — is answered by the reading itself rather than deferred again.

## 8. Last materially updated and freshness

| | |
| --- | --- |
| **Last materially updated** | 2026-09-25 14:35 Sydney (2026-09-25 04:35 UTC), run 192. |
| **Run** | 192 — **yesterday's fix was made safe by a sentence written where the thing it reassures cannot read it.** Yesterday I made the homepage announce all five feeds to software, and I decided on purpose to include the four that have gone quiet, reasoning that *each feed's card on the page already says how old it is, so nobody is misled.* That reasoning was wrong in a specific way. When a reader is handed a website address it reads the page's **invisible header** and shows you a short menu of feed **names** — it never shows the page itself. So the cards, the dates, the whole visible page are not in that menu. What a person actually saw was five near-identical rows — *@sportstech*, *@wearables*, *@wellbeing* and so on — with **nothing to choose between them**, and four of the five lead to feeds that have published nothing in eight weeks. **Commercially this is the one thing a stranger can complete here** without applying, waiting or hearing from you: subscribing. That menu is where they choose, and it was the one place the age was missing. Fixed and deployed: each row now reads *@sportstech — Tuned · last published today* or *· last published 57 days ago* or *· nothing published yet*, from the same single function that writes the card, so the two can never disagree again. **Still all five feeds, still in the same order — nothing is hidden and nothing is ranked**; the visitor decides, now with the fact in front of them. **The pattern is the part worth your attention, and it is uncomfortable:** this is the *same* mistake as yesterday's — something true where a human looks, missing where software looks — and I made it **inside the very commit where I wrote that lesson down**. Writing a lesson does not protect the change that writes it. The check I now apply is mechanical: delete everything except what the software reads, and see whether my own safety argument survives. **No commercial number moves** — `applications` 0 · `members` 1 (you) · `followers` 0 · cash **AUD $0**. [L-110](LESSONS.md#l-110). |
| **Run** | 191 — **paste `justtuned.com` into any feed reader and it told you this site has no feed, while all five were live.** There is a standard invisible line every site with a feed puts in its page so software can find it; it is how *"paste a website address into a reader and it offers you the feed"* works, for every reader, aggregator and feed directory. I added that line to our feed pages seven weeks ago and to every find page later, and **never to the homepage** — the one address our own pages, the sitemap and the repository README all declare as the real one. So the homepage said two different things depending on who asked: a person saw five feeds, each dated and clickable; a feed reader handed the same address was told there is **no feed here at all.** Nobody could catch it by looking, because looking is the thing that page does well. **Commercially:** two of the three ways anyone subscribes start at the domain — typing it into a reader, or a directory resolving it — and both got nothing; the third, pasting a feed URL directly, is what your pending paste uses and it worked. **The pattern is the part worth your attention:** my earlier fix was scoped to *the pages that have a feed*, and the homepage is not one — it is the page that **leads to** them. Never wrong, just quietly excluding the entry point, which is where it costs most. Fixed and deployed: the homepage now advertises **every** feed it lists, in the same order, each named so a reader's picker can tell them apart — and the check plays the whole reader rather than asking whether a line exists, fetching each advertised feed and requiring a real, *different*, working one back. **Three times this run I caught a comment claiming more than its code did**, twice in checks I wrote today, found only by deliberately breaking each to see if it went red. **No commercial number moves** — `applications` 0 · `members` 1 (you) · `followers` 0 · cash **AUD $0**. [L-109](LESSONS.md#l-109). |
| **Run** | 190 — **our feed told whoever asked for it that Tuned lives at whatever address they used, including the throwaway `workers.dev` one.** Tuned answers on three addresses and all three serve the identical site; every ordinary web page here already declares which is the real one. An RSS feed carries one field whose job is to say *"here is the website this feed belongs to"* — and it was being filled in with **whichever address the reader asked from.** That matters commercially rather than cosmetically: a feed directory, **the kind your pending paste would list us in**, fetches the feed once and copies that field into its listing as our address, so the address we would be advertised under was decided by whichever host their crawler happened to reach first. **The pattern underneath it is the part worth your attention.** A note in our own code from seven weeks ago said this field was *fine* to fill in from the request — written when nothing in the feed was fixed yet, describing work not yet done. Two weeks ago I fixed half of it and **left the note standing over the other half**; then a test copied the note's wording in as a rule. An *"I haven't got to this yet"* quietly became a *"this is how it should be"*, guarded by a test, so every re-read of that file confirmed it. I corrected both sentences rather than deleting them, so the next pass cannot re-derive the excuse. **Checked the way yesterday's lesson says to:** the test asks for the same feed as all three hosts and demands the bytes come back **identical**, then checks they agree on the *right* address — three hosts agreeing on `workers.dev` would pass a naive comparison and still be the bug. **Also today: the agent published.** A scheduled screen read 34 papers, rejected 17, selected 7, read 12 full texts; I checked its record and released the top one — **find 286**, basketball sprint mechanics, its reason line a 146-character quotation lifted verbatim from the paper's own results. `items_public` 91 → 92. **No commercial number moves** — `applications` 0 · `members` 1 (you) · `followers` 0 · cash **AUD $0**. Nobody was reading the feed from the wrong host because almost nobody is reading the feed; what today bought is that the address a directory would publish us under is ours **before** the listing exists rather than after. [L-108](LESSONS.md#l-108). |
| **Run** | 189 — **one invisible character in one find would have silently killed the entire RSS feed for everyone subscribed to it, and nothing we had ever written would have noticed.** XML flatly forbids a handful of invisible "control" characters and there is no way to write them safely — escaping does not help, because the format bans them **however you spell them** — and an XML reader has no way to recover: it hits one and **stops**. So one stray character in **one** find's title or link or note loses a subscriber **the entire feed**, including finds published weeks earlier, while the ordinary page at `/sportstech` keeps rendering perfectly. Measured rather than argued: on a four-find test feed with one character planted, a real reader recovered **zero of four**. Five different paths write finds into Tuned and **not one checked** — and the agent's own reason line is quoted verbatim out of a research paper's full text, exactly the kind of text that carries invisible typesetting residue. **The part worth your attention:** that feed was *well* covered — dozens of tests, two production checks, three browser checks — and **every one asked what the feed CONTAINS**, never whether it could be **read as a document**. Same mistake as the search finding: grading the ingredients, never tasting the dish. Fixed and deployed, and now checked the right way — on every deploy a real XML parser fetches every live feed and refuses the deploy if any fails to parse. **Nothing was broken in production**; this was a trap not yet sprung. [L-107](LESSONS.md#l-107). |
| **Run** | 188 — **a rule I was enforcing said the feed must never go more than 72 hours without publishing, and our own files show it went 203.8 hours — but I had filed that rule as "can't be checked from here".** The instrument I built on Friday for the one experiment still running said this particular rule could only be graded against the live site, which this session is blocked from reaching. **That was half right.** To prove the feed *stayed* fresh you do need the live site. To prove it *went stale* you need nothing but the publication dates already saved in our repository: between find 281 and find 282 there are **eight and a half days**, against a three-day bar — **2.8 times over**, by subtraction. *"I cannot reach the thing that checks this"* is not the same claim as *"this cannot be checked"*, and a rule can often be **broken** with cheap evidence and only **confirmed** with expensive evidence. I had deferred the whole question to the evidence I lacked and thrown away the half I had. **The larger half is about my own experiment, not your agent.** That same rule also requires the finds to publish *without a person pressing anything* — but on the experiment's **first day** a different rule failed and my own pre-written response was to **switch the automatic publisher off**. Every find since has needed me to press the button. **So the rule was unpassable from day one, by my own hand:** once the publisher is off it can only fail, and it fails whether your agent is good or bad. Read the obvious way it says *"the agent still needs a person"* — true, and **evidence for nothing**. That is now written into the record so Friday's reading, the last one this loop will grade, cannot quietly report it as a finding. **I graded nothing early and changed no rule** — the bar, the schedule and the agent are untouched, and the schedule is **still not armed**. **No `src/` change, so no visitor sees a different byte**, and find 285 is still the newest. **No user and no dollar, the sixteenth run running.** [L-106](LESSONS.md#l-106). |
| **Run** | 187 — **your one working agent published find 285 today, and it had already failed to publish twice this week — killed by the very check I added on Monday to stop it lying to you.** On Monday the agent reported a quiet week when the research archive it searches had in fact answered with gibberish; I made it refuse that reply so it could never say so again. **This morning it hit the same gibberish and the fix ended the whole run instead** — no publication, and not even a note that it had tried. Monday's problem was *dishonesty*, and that stays fixed. What I never separately decided is what the agent should do **next** once it knows the answer is junk: it gave up, because giving up is what the code happened to do there. **The archive's hiccup clears in seconds** — I asked the identical question twenty minutes later and got **35 papers**, of which the agent judged **7** worth reading in full. So it now simply **asks again**, up to three times, five seconds apart, before losing the day. **If the archive actually declines the request, it still asks exactly once and accepts that** — retrying a service that said no is rude and I will not build it; the retry is only for a reply that is not an answer at all. Published **find 285**, a study checking whether a wireless muscle-activity sensor agrees with the lab equipment it replaces, its reason line lifted word for word from the paper's own results after reading all 45,000 characters of the full text. Hideable at any time, deleted never. **Nobody is paying and nobody has applied**; what moved is that the agent now works on the days the archive stutters. [L-105](LESSONS.md#l-105). |
| **Run** | 186 — **the one experiment still running is graded in three days, and nothing could read the evidence.** `@sportstech` screens the sports-science literature every morning and writes down what it saw and why it refused each paper. That daily record is the **only** evidence for the two questions the experiment is graded on, and it lives in a file that (a) nothing in the project reads, (b) **my own session cannot download** — the network blocks the storage host — and (c) **is deleted after 90 days**, which is after I stop. So the grading was going to be me opening fourteen files by hand on the 26th, and last week proved exactly how that fails: one of those files was **wrong**, and the only reason anyone noticed is that a run happened to look. **I built the reading instead, and ran it.** Nine of the ten mornings so far produced a proper verdict, each refusal naming exactly one reason. The quality bar is missed on **two** of the nine, by **one paper** each — the other seven sit just under it. That changes nothing about how the agent behaves (it was already graded as missing the bar on 12 September, and already stopped from publishing on its own that same day), but it does say the bar is drawn so close to normal behaviour that it is barely separating anything. **The tenth morning is the broken one from last week**, and it contributes nothing rather than counting as a quiet day. **The nine mornings are also not nine independent results** — the agent picked the same paper on six of them and another on three, because nothing gets published so the same candidate keeps winning. **My own first version of this reading got that last point wrong and I am telling you rather than quietly fixing it:** it printed *"every screen chose the same paper"* while simultaneously reporting it had found **zero** paper names — a confident sentence about evidence it did not have, because it was looking up the wrong field name. Corrected in a second change four minutes later, before any of it was written down as fact. A claim about my own records is the one kind nothing outside me checks. **Nothing published, nothing changed for any visitor, no user and no dollar, fifteen runs running.** [L-104](LESSONS.md#l-104). |
| **Run** | 185 — **one of my own measurements has been reporting a negative number of readers since the day I built it.** Tuned counts how many people reach a published find from **outside** the site. The sum is *"everyone who arrived, minus the ones who came from elsewhere on Tuned"* — and the first half deliberately excludes robots while the second half did **not**. So every search-engine crawler that followed a link from one Tuned page to another was subtracted from a total it was never part of. On the 19th: **nobody** human arrived, **121** robots did, and the sum came out at **-47**. Five of the seven days it has existed were negative. **Three more measurements had the identical flaw and had simply not been used yet** — including the one meant to tell us **the first time a stranger stars something**, the single event this project is waiting for: had you starred from an unusual client on a day a real visitor also starred, it would have reported **no stranger at all**. **Why it survived six runs:** the number was on the screen the whole time — my own notes quote one half as **19** in a paragraph reporting the other half as **7**, adjacent sentences, and nobody ever did `7 - 19`. **A rule written in prose is never run, so it is never caught being false.** My tests had the same blind spot, and one was *asserting* the broken arithmetic. Fixed all four, and wrote something that **performs the subtraction daily and fails loudly below zero** — switch it back on over the old data and it prints all five bad days by name. **I did not invent replacement numbers** for the seven broken days; the record states the range the true answer lies in and stops. **This is the only measurement that would tell us whether a stranger is reading what the agent publishes**, and those find pages are exactly where a directory listing would send one. **No user and no dollar, fourteen runs running.** [L-103](LESSONS.md#l-103). |
| **Run** | 184 — **your one working agent published find 284 this morning, and the reason it nearly did not is that it reported a broken search in the words it uses for a quiet week.** At 02:40 `@sportstech` screened the literature, found nothing, and wrote *"no candidate passed the bar this cycle. Publishing nothing is the expected outcome."* The **identical search** two hours later returned **35 papers** and judged **8** worth publishing. The morning search had not come back empty — **it had not worked**, and the agent could not tell the difference: the service answered *"OK"* and handed over a reply that was not a set of results, and *"OK"* is a statement about the request, never about the answer. **This mattered more than a normal bug because that report is the file I am required to read before deciding anything** — it is the safeguard against last week's failure, and a report that cannot tell *"nothing qualified"* from *"nothing was asked"* sends me away satisfied. Published **item 284**, a study checking a portable force plate against a laboratory one, in the researchers' own words; then made the agent **go red** on a reply that breaks the service's contract. **A genuinely empty day is still allowed to be empty** — this agent is meant to publish nothing most days, so the check never fires on an honest zero, and a test exists whose only job is to fail if I blur that line. **Your 25-day-old open question about unattended publishing got evidence today, in the cautious direction:** an unattended schedule would have swallowed this silently. **No user and no dollar, thirteen runs running.** [L-102](LESSONS.md#l-102). |
| **Run** | 183 — **four of your five feeds have been quiet for about seven weeks, and the feed itself was still telling subscribers it was current.** Subscribe to a Tuned feed in a reader, or list it in a feed directory, and the description shown was *"What @wearables is paying attention to **right now**."* `@wearables` last published **30 July**; so did `@wellbeing` and `@graphics`, and `@ava` on 2 August. Only `@sportstech` publishes. The same claim was in the description Google and every link preview show. **That RSS document is the one I keep asking you to submit to a directory, and the only subscription anyone can complete here without an account** — so the one page a stranger could act on was making a claim the product could not keep. *"Right now"* is gone from the feed description, *"live"* from the page description, and the same phrase from `robots.txt`. **Nothing replaces them:** the feed already carries its real last-published date in a field every reader shows, and the page already spells the age out in words. **The near-miss is the interesting part** — writing *"last published 52 days ago"* into the description is right for a reader, which re-fetches it, and wrong for a directory, which **copies** it once, where a countdown freezes and slowly becomes a lie nobody here can correct. A date cannot rot. **No user and no dollar, twelve runs running.** [L-101](LESSONS.md#l-101). |
| **Run** | 182 — **the page that picks a feed for you never said how old any of them are, and called all five of them live.** `GET /` listed feeds ordered by **registration date**, reading no item at all, under the heading *"Live feeds"* — while four of the five had published nothing for 50-53 days and the **stalest came first**. Each card now states its own age, the list is ordered freshest first, and the heading says *"All feeds"* — what the block is, with no claim about activity. [L-100](LESSONS.md#l-100). |
| **Run** | 181 — **the gate that decides whether to publish is fed by a file nobody was obliged to write.** Item **283** published (`items_public` 88 → 89, second consecutive day). The publisher now writes its own registry entry at the moment of publication instead of a run retyping it afterwards — because a *missing* entry does not cost one wasted look, it buys a second publication and then a third. [L-99](LESSONS.md#l-99). |
| **Run** | 180 — **nothing published today, and the reason is the thing that shipped.** Yesterday I pressed go by hand on a publisher that had been discarding good papers for eight days. That fixed one day; the next run would have had to stumble on it again, because the list of what is waiting lives in a file only the build system holds. **Now one command, named in the one file every run of this loop is guaranteed to read first, answers the only question that matters: has a screening run come and gone since this feed last published?** If it has, the run is told to open the results, read them, and press go if they warrant it. Eight lines, no network, no password. **The first thing it did was tell me not to act** — yesterday's find is six hours old and today's screening run is still inside the window where it may not have happened, so the gate owes nothing and publishing a second find six hours after the first is what the one-a-day rule exists to stop. **I did not turn the daily schedule back on**; that is still one word in one file and still not mine to change, and the question it waits on is now **21 days unanswered**. What I did take back is that yesterday's run had also put off building this command until that same question was answered — waiting on an answer that is not coming is the same stoppage one level up. **No user and no dollar, the ninth run running.** [L-98](LESSONS.md#l-98). |
| **Run** | 179 — **your one working agent found something worth publishing on eight days running and published none of it.** `@sportstech` screens about thirty-seven sports-science papers every morning and picks out about nine worth publishing. Since **13 September it has done that eight times and thrown all of them away**, because a run on 12 September moved publishing behind a manual press-go step and **nobody ever pressed go** — nothing told anyone there was a backlog, since the results are written to a file only the build system holds. The feed went **nine days** silent. *A queue nobody is watching looks exactly like an empty one*, which is why the last three runs each found something genuinely broken in the plumbing and none of us asked whether anything was coming down the pipe. I read the day's results, as that step requires, and pressed go: **item 282**, an IMU study of rowing, published with the paper's own sentence as its public line. `@sportstech` is the **freshest feed on the site for the first time since 12 September** and the site is at **88 finds, not 87**. **I did not turn the daily schedule back on** — that is one word in one file, the run that switched it off wrote down that no later run should switch it back on by its own reading of a quality bar it proposed itself, and that question has been unanswered for 20 days. **Nobody was denied anything and no number moves today.** [L-97](LESSONS.md#l-97). |
| **Run** | 178 — **the desk could be filled, and everything you could fill it with was invisible to it.** The Morning Desk shows finds from the **last seven days**, and **no find on this site is less than seven days old** — 87 published finds across five feeds, three of them last published on 30 July, the freshest eight days ago. So the desk yesterday's two runs made fillable, and put a button for on all 87 find pages, was **empty no matter what anyone did**: press *Add to my desk* on a row saying "19 finds" and you land on *"Nothing new from @wearables"*. A find you have **never triaged** is no longer hidden by that window; the moment you star or skip it, it goes back under the window and does not return tomorrow, so the desk stays a daily page. Two sentences also now say what they know: *"N finds waiting"* replaces a count that was never measured from your last visit, and *"Nothing new from @handle"* now says how long the feed has been silent. **Nobody has hit this, so no number moves today.** [L-96](LESSONS.md#l-96). |
| **Run** | 177 — **the page where you decide to follow a feed offered the one button that does nothing.** Yesterday's run built the thing that actually works: a member can put a feed on their desk, and it then shows up in their morning reading. But that was offered on **one screen only** — the desk itself. Everywhere a person would actually decide to follow someone — the feed page, and all **eighty-seven** of the individual find pages, which are by far the most likely first page a stranger sees — the **Follow** button still only offered to put an email address on a list that **nothing sends to**. To reach the working version you had to leave the page you were reading, go to your desk, and already know it was there. Both dialogs now offer *"Add to my desk"* to anyone signed in, and *"Take it off my desk"* if it is already there. **The page a stranger sees does not change by a single byte** — that is the constraint this was built around, because those pages are what search engines and link previews read, and one of your running measurements is counted on them. RSS and the email option are untouched and still say plainly that nothing sends yet. **Nobody has seen either dialog as a member, so no number moves today.** [L-95](LESSONS.md#l-95). |
| **Run** | 176 — **anyone you admit landed on an empty desk they could not fill.** The morning desk renders from one table, and the only thing in the entire product that ever wrote to it was a rule that follows *the agents you already own*. You own agents; a person you admit owns nothing. So their desk was empty, and **no button, form or link anywhere on the site could put anything on it** — while the empty screen told them to *"follow more feeds"*, which was a sentence with nothing behind it. Live for 45 days. Now there is a real *Add to desk* action, and the desk offers the feeds it can be filled with. **Nobody ever hit this**, because nobody has applied — the cost was seven weeks spent opening distribution to a room with no door. [L-94](LESSONS.md#l-94). |
| **Run** | 175 — **two public pages promised email from a service that cannot send any.** The front page told every applicant *"you'll hear back by email"* and the sign-in page said *"we send you a personal sign-in link."* **This service has no mail sender at all** — a sign-in link is returned to you in an API response and handed over by hand. Both sentences had been live since 2026-08-06. Both now say what is true, and a new check sweeps **every page a stranger can reach** for the same class of promise in both directions. It found a third surface reading had missed: the page shown when a sign-in link fails. [L-93](LESSONS.md#l-93). |
| **Run** | 173 — **EXP-011 is graded: over eleven complete UTC days, 686 human-flagged landing views produced 4 rendering browsers. R = 0.58%, Fork R-A. The claim that distribution is the bottleneck is now measured rather than inferred, `landing_view` is retired as an audience number, and the remaining sixteen days go to obtaining real arrivals rather than to the page.** No `src/` change — the deployed Worker is byte-identical, so nothing deployed and nothing could regress. |
| **Run** | 172 — **ninety-two pages on this site invited a stranger to subscribe to feeds that have published nothing since July.** I read every public feed off the live site this run: `@ava` last published **47 days ago**, `@sportstech` **6 days ago**, and `@wearables`, `@wellbeing` and `@graphics` **49 days ago each**. Four of the five are dormant, and **sixty-eight of the eighty-seven find pages belong to one of them.** Every one of those pages said *"every find like this one, as it is published"* — technically true, and silent about the thing you would actually want to know. Subscribing by RSS is **the only thing a stranger can do here without an account, an application or a decision from you**, and on most pages it was pointing at a feed with nothing coming. Every Follow ask now says how long ago that feed last published — *"the last was 49 days ago"* — on the button block and in the dialog, on every feed page and every find page. **It says it whether the news is good or bad**, because a disclosure that only appears when things look bad is a judgement call I would be making on your behalf. **Nothing was published to make a feed look alive**, and it will probably mean fewer follows, which is the honest direction. [L-90](LESSONS.md#l-90). |
| **Run** | 171 — **eighty-seven pages on this site can be found by search or shared in a message, and not one of them had a way to follow anything.** Three days ago every published find got its own web address; those are the pages a search engine can index and the pages you would paste into a message, and by a wide margin the most likely first page a stranger sees. If someone landed on one and wanted more of that person's attention there was **nothing to click** — only a tiny "RSS" link in the corner that opens raw code. Every one of those pages now has a Follow block: RSS, which works today, or an email, clearly labelled as **not sending anything yet**. The big button is still **"Open at \<the source\>"** and there is now a test that fails if anyone moves the follow ask above it — Tuned's job is to send you to the source. **A mistake of my own on the record:** the test guaranteeing that order was **fake** — it searched the page text for `open-cta`, which also appears in the stylesheet at the top of every page, so it would have passed whatever the order was. I only found it by deliberately breaking the page to see whether the test noticed. It didn't. It does now. [L-89](LESSONS.md#l-89). |
| **Run** | 170 — **I went looking for yesterday's broken file on the front page; it isn't broken, and the checks that should have caught it if it were could not have.** Every browser check asks the browser *"did any request fail?"* — and **a 404 does not count as a failed request**, because the server answered. So a missing file on our own site could have been broken on every page, on every visit, with every check green. Fixed, then pointed at the live site: **nothing is broken** — no failing files on the front page or the demo feed at either size, and both suspected images load correctly. Yesterday's 404 does not recur and **can never now be identified**, because the record that saw it did not keep the name. Also now checked deliberately: the preview image Slack and iMessage fetch when you paste a Tuned link, which **no browser check could ever see**, because your own browser never asks for it. [L-88](LESSONS.md#l-88). |
| **Run 169** | **anyone who subscribes to a Tuned feed was getting the article and no hint that a person or an agent chose it.** Opened in a reader, every item showed the headline, the link and the source's own summary — nothing about who noticed it, who chose it, or where the chain is set out, on the one surface people subscribe to and the one both pending submissions point at. Each item now carries *"Observed by @wearables, read and chosen by @ava."* and a link to that find's page. The main link still goes to the original article, the hidden ids are untouched so no reader re-delivers every item, and the new link is tested by **actually fetching it**. [L-87](LESSONS.md#l-87). |
| **Run** | 168 — **the repository's own merge gate could not pass on a pull request, and the change that broke it was merged without passing through it.** `check` guards every pull request and, since 2026-09-12, went red on all of them: a test asked whether production serving the branch's own commit was up to date with `master`, which it never is on a branch. It landed by a direct push to `master` at a time when no pull request was open, so nothing ran it on a branch until yesterday — and yesterday's red was read correctly and merged past anyway. The test now asks about `master`'s tip, and a second test builds the branch case from scratch so the question is asked on `master` too. Proof is this run's own pull request passing. [L-86](LESSONS.md#l-86). |
| **Run 167** | **yesterday's check found a fault, printed it in its own report, and still said everything was fine.** The phone-fit spec returned `brokenCount: 0` for production while listing, in the same JSON, an artist's name on `/ava` reaching 28px past the edge of a 390px screen — cut off mid-word, because the box it sits in hides overflow. Rebuilt locally it was worse: **the song title beside it had been squashed to zero width and was not visible at all.** One CSS rule lets the name wrap instead of being one unbreakable block, and the check now fails on anything past the screen edge rather than only on a mis-sized page. Verified on production at `b16441e9`: 16 pages, nothing past the edge on any of them. [L-85](LESSONS.md#l-85). |
| **Run 166** | **the landing page did not fit a phone, and the check written to catch that read green throughout.** `/` laid out at 405px and `/ava` at 436px on a 390px device, so Chrome zoomed the whole document out and every word was rendered smaller than designed. The two existing overflow checks compared two numbers the failure moves together. Four CSS rules and a new spec that compares the layout viewport against the width the project asked for. [L-84](LESSONS.md#l-84). |
| **Run 165** |  **the addresses shipped yesterday, and nothing on the site pointed at them.** Run 164 gave all 87 published finds a URL and grew `sitemap.xml` from 8 entries to 95; for one day the only route in was that sitemap, because a feed card is an anchor to the **source**. A crawler following links from `/` reached no find page and a visitor could not obtain one's URL. A `permalink` chip on every feed-page card closes it; the card's own click still opens the source, asserted by a test and by the production check. `item_view_onsite` splits the on-site arrivals this creates from the off-site ones run 164's reading depends on. [L-83](LESSONS.md#l-83). |
| **Run 164** | **Tuned had published 87 finds and given an address to none of them.** `GET /:handle/:id` plus one sitemap entry per published find; the page's subject is the provenance chain and it states *"Tuned does not host this and did not write it"* in its own words. [L-82](LESSONS.md#l-82). |
| **Run 163** | **the funnel's second stage wrote to a table its third stage could not read.** `POST /waitlist` has saved every application since 2026-08-06 into a table read by exactly one thing, `SELECT COUNT(*)` in `src/metrics.ts`; no surface returned a row, while `POST /api/members` — the act that admits somebody — takes an **email**. An unreadable table and an empty one serialise identically, which is why forty days passed without it being felt. `GET /api/applications` closes the read half. [L-81](LESSONS.md#l-81). |
| **Repository commit at time of writing** | run 183 — `src/pages.ts` (two claim removals, no new element and no CSS declaration), `src/crawl.ts` (one robots header line), `test/freshness-claims.test.ts` (new, 7 tests, 52-day-stale fixture), `qa/freshness.spec.mjs` (`RETIRED_CLAIMS` widened to every document the spec already fetches) and one `verify-production.yml` step grading both surfaces on the deployed artifact. **478 vitest** (471 → 478) · **ops suite 276/276** · `validate-workflows.py` ok, 13 workflows · `validate-nominations.mjs` 10 valid · `npm audit --omit=dev` 0 vulnerabilities. **Six mutations, named tests red on each**, including the positive control; both sources restored byte-identical under `sha256sum -c`. *Previously, run 180 — `scripts/scout-gate.mjs` (new), `scripts/scout-gate.test.mjs` (new), `scripts/operating-card.test.mjs` (one assertion: the card must name the reading, in its read order), `CLAUDE.md` (one step), and the ops record. **No worker source touched at all** — no route, no query, no CSS rule, no counter added, renamed, split or retired, so `464 vitest` is unchanged and the deployed Worker changes only by its build commit. **ops suite 265/265** (248 → 265, seventeen new) · `validate-nominations.mjs` **9 valid** · `npm audit --omit=dev` 0 vulnerabilities. **Twelve mutations, named tests red on each**, including a positive control — inferring the screen count from the publication's age in whole days is plausible, well-formed and wrong. Card and script restored byte-identical under `sha256sum -c`.* |
| **Data commit** | [`cde43f4`](https://github.com/in-c0/tuned/commit/cde43f4) — [`metrics/latest.json`](metrics/latest.json), snapshot generated `2026-09-21T23:32:13.798Z`, complete through 2026-09-20. **No commercial metric moved this run and none is claimed:** `applications` 0, `members` 1, `members_ever_active` 0, `followers` 0, gross cash AUD $0 from *no billing exists*. `items_public` is **89** after run 181's item 283 and did not move this run. **No counter was added this run**, and nothing was published, amended, retracted or restored. |
| **Freshness state** | **CURRENT for the header, §7 and §8; §1-§6 unchanged and not re-argued.** §1 is **ONE** and unchanged since run 137, per [L-07](LESSONS.md); this run adds none and **nothing in it needs the owner**. §4's funnel figures are unchanged: `applications` 0, `members` 1, `members_ever_active` 0, `followers` 0, gross cash AUD $0 — **no commercial metric moved this run and none is claimed.** `items_public` is **92** and did not move: the publisher's gate read **CURRENT**, so nothing was published, amended, retracted or restored. §6 still reads EXP-011 **CLOSED and graded**; **EXP-013 is byte-untouched — its window is open until the end of 2026-09-25 for a reading due 2026-09-26, no threshold was graded early, and the daily schedule is still NOT armed.** Its reading instrument was dispatched read-only on day 14 and completed green ([36093945337](https://github.com/in-c0/tuned/actions/runs/36093945337)), which grades nothing and marks its own output INTERIM. **No counter was added, renamed, split or retired.** |
