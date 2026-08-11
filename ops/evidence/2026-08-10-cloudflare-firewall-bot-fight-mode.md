# Evidence — Cloudflare firewall events, 2026-08-10/11: the rule is Bot Fight Mode

**Source:** two Cloudflare firewall-event exports supplied by the owner in-session on
2026-08-11 ~04:40 UTC (14:40 Sydney):

1. bulk export, zone `justtuned.com`, window `2026-08-10T04:39:52Z` → `2026-08-11T04:39:52Z`, **408 events**
2. single-event export for Ray `a2925e55ea742973` — the exact ray recorded by run 26's failed
   `verify production`

This file is a **derived summary**, not the raw export. The raw files contain third-party client IPs
and are not committed. Every figure below is a count over those 408 events; nothing here is inferred.

## 1. The rule, named

The single-event export, verbatim except formatting:

```
rayName    a2925e55ea742973        datetime  2026-08-10T22:17:03Z
ruleId     bot_fight_mode          source    botFight
rulesetId  ""                      action    managed_challenge
path       /api/version            method    GET      protocol  HTTP/2
host       justtuned.com           ua        tuned-ops-verifier/1.0
clientAsn  8075 (Microsoft Corporation)      country   US
```

`ruleId: bot_fight_mode` with an **empty `rulesetId`** identifies this as **Bot Fight Mode**, the
zone-level toggle under Security → Bots. It is not a WAF custom rule, not a managed ruleset, and not
Under Attack mode — the three other candidates STATUS.md had been carrying since run 25.

All seven Ray IDs the loop recorded across three colos appear in the bulk export, all with
`source: botFight`:

| Ray | Recorded as | Actual, per the export |
| --- | --- | --- |
| `a29223cf1b49492d` | run 25, IAD, `GET /` | `/` · `curl/8.5.0` ✔ |
| `a29223cfee915b41` | run 25, `/api/version` | `/api/version` · `curl/8.5.0` ✔ |
| `a29223d17905ab5c` | run 25, `/api/metrics` | `/api/metrics` · `curl/8.5.0` ✔ |
| `a29223d238415df7` | run 25, `/ava/rss.xml` | `/ava/rss.xml` · `curl/8.5.0` ✔ |
| `a2924f531a38e16d` | run 26, SJC | `/` · `curl/8.5.0` ✔ |
| `a2925e55ea742973` | run 26, LAX | `/api/version` · `tuned-ops-verifier/1.0` ✔ |
| `a2921e88dcf2c67f` | run 25, **"browser hit, `GET /`"** | **`/api/version` · `curl/8.5.0` — our label was wrong** |

The real browser rays are `a2921e953bfc77a8`, `a2921e952bd177a8`, `a2921e9cdb6b78ff`,
`a2921ea13f718acf`, `a2921ea12f3e8acf` — five `GET /` from HeadlessChrome/140 at
2026-08-10T21:33:32–34Z, client `172.184.213.248`, ASN 8075. Corrected in STATUS.md, run 28.

## 2. What was challenged — and what was not

323 of the 408 events are `managed_challenge` / `botFight`. Their origin:

| Client ASN | Challenged events |
| --- | --- |
| Microsoft Corporation (AS8075 — Azure, i.e. GitHub Actions runners) | **322**, across 13 IPs |
| Alibaba (US) Technology | 1 |

| User agent | Challenged | What it is |
| --- | --- | --- |
| *(blank)* | 187 | PHP/WordPress scanner probes — `/php.php`, `/wp.php`, `/bengi.php`, … |
| `tuned-ops-verifier/1.0` | 78 | **ours** — `verify-production.yml`, `metrics-snapshot.yml` |
| `curl/8.5.0` | 52 | **ours** — `scripts/prod-http.sh` |
| `HeadlessChrome/140.0.0.0` | 5 | **ours** — run 25's browser probe |
| `Mozilla/5.0 (Windows NT 10.0; Win64; x64)` (truncated) | 1 | the single Alibaba request, path `/curl/8b2967…` |

**No request from a residential or consumer ISP was challenged in the entire 24-hour window.**
Every challenge went to a datacenter client, and the large majority of the non-scanner ones were
Tuned's own instruments challenging themselves.

### The limit on that claim, stated rather than smoothed over

Firewall events log only requests that **matched** a rule. Traffic that passed cleanly does not appear
in this export, so a pass rate cannot be computed from it and the absence of human traffic here is
**not** proof that humans were unaffected. What it does establish is directional and sufficient for
the severity correction: of everything Bot Fight Mode stopped, none of it looks like a person.

## 3. Onset and current state

- First `managed_challenge` in the window: **2026-08-10T06:53:02Z**. The export begins at 05:13:18Z
  and contains only custom-rule blocks before that point. This narrows run 25's onset window
  (2026-08-09 21:05Z → 2026-08-10 20:48Z) to approximately 06:53Z on 08-10 — **suggestive, not
  proven**, since no Bot-Fight-eligible traffic is recorded in the preceding 100 minutes.
- Last `managed_challenge`: 2026-08-10T23:55:04Z. The export continues to 2026-08-11T02:26:04Z.
  **That gap is not evidence the toggle was turned off.** Every event after 23:55Z is a scanner probe
  caught by the custom PHP rule, and custom firewall rules evaluate *before* Bot Fight Mode, so those
  requests never reached it. No GitHub Actions traffic ran in that window either — the last
  `verify production` was 22:25Z. The zone's current state is undetermined by this data.

## 4. The custom rule is not implicated

82 events are `block` / `firewallCustom`, description *"Block PHP/WordPress/.env scanner probes — no
PHP served on this zone"* (`ruleId 6033395d8dc441b3bf57ffdd3f19d366`), plus 3 `firewallManaged`
blocks for `React - RCE - CVE-2025-55182`. These caught `//xmlrpc.php`, `/.env`, `/.git/config`,
`/wp-json/…` from DigitalOcean, Contabo, Google and Cloudflare-fronted clients. That rule is doing
real work against real probing and should stay on. It is unrelated to the outage.
