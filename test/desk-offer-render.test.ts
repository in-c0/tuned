// The follow dialog's desk offer, rendered — and the production check that grades it, held to the
// same document.
//
// Two things are asserted here that the journey test in `test/activation.test.ts` deliberately
// does not. That file grades the *outcome*: it reads the offer off a served page, submits it and
// requires the desk to change, which is the only thing that settles whether a member can follow a
// feed from the page they are reading it on. This file grades the *rendering contract* the
// production check depends on — because `verify production` cannot sign in, so all it can do is
// grep the anonymous document, and a grep is only as good as the patterns in it.
//
// So the patterns are read out of `verify-production.yml` itself rather than copied here. Run 175
// shipped a production grep whose earlier draft passed vacuously against empty files; a pattern
// duplicated into a test is the same hazard one move along — the copy keeps passing after the
// workflow's has drifted, and the workflow is the one actually guarding production. Reading them
// from the file means a change to either side has to be made on purpose.
//
// The negative assertion is the load-bearing one. These two pages are the surfaces this site is
// indexed and shared as, and EXP-011's denominator is counted on them: a member-only control that
// ever renders anonymously hands member state to every crawler, unfurler and shared cache, and
// changes what the counters on those pages are counting.

import { describe, expect, it } from "vitest";
import workflow from "../.github/workflows/verify-production.yml?raw";
import { publicPage, itemPage, type Creator, type Item, type FeedViewer } from "../src/pages";

const creator: Creator = {
  id: 1,
  handle: "scout",
  name: "Scout",
  bio: "",
  avatar_url: "",
  accent: "",
  kind: "agent",
  created_at: new Date().toISOString(),
};

const item = {
  id: 7,
  creator_id: 1,
  url: "https://example.com/x",
  title: "A find",
  description: "",
  image_url: "",
  site_name: "",
  domain: "example.com",
  category: "Misc",
  note: "",
  visibility: "public",
  via_handle: null,
  created_at: new Date().toISOString(),
} as unknown as Item;

/** The `check_anonymous` shell function from `verify-production.yml`, and the greps inside it.
 *  Extracted rather than transcribed, so a pattern edited in one place cannot quietly stop being
 *  the pattern asserted in the other. */
function productionChecks(): { required: RegExp[]; forbidden: RegExp[] } {
  const fn = /check_anonymous\(\)\s*\{([\s\S]*?)\n\s{10}\}/.exec(workflow);
  expect(fn, "verify-production.yml no longer defines check_anonymous() — the production grader for this change is gone").toBeTruthy();
  const required: RegExp[] = [];
  const forbidden: RegExp[] = [];
  const greps = /grep -q(i?)(E?) '([^']+)' "\$file"/g;
  let m: RegExpExecArray | null;
  while ((m = greps.exec(fn![1]))) {
    const flags = m[1] ? "i" : "";
    const pattern = m[2] ? m[3] : m[3].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // A grep inside `if ... then <error>` is the forbidden kind; one used as a guard with `||` is
    // the required kind. The distinction is in the line that carries it.
    const line = fn![1].split("\n").find((l) => l.includes(m![0]))!;
    (line.trimStart().startsWith("if ") ? forbidden : required).push(new RegExp(pattern, flags));
  }
  expect(required.length, "the production check asserts nothing is present — it can pass on an empty body").toBeGreaterThan(0);
  expect(forbidden.length, "the production check forbids nothing — it grades no member control").toBeGreaterThan(0);
  return { required, forbidden };
}

const AS_MEMBER: FeedViewer = { following: false, own: false };
const AS_FOLLOWER: FeedViewer = { following: true, own: false };
const AS_OWNER: FeedViewer = { following: false, own: true };

const surfaces = {
  "feed page": (v: FeedViewer | null) => publicPage(creator, [item], v ?? undefined),
  "find page": (v: FeedViewer | null) => itemPage(creator, item, [], v ?? undefined),
} as const;

describe("the desk offer in the follow dialog", () => {
  for (const [name, render] of Object.entries(surfaces)) {
    it(`is absent from the ${name} served to anybody without a session`, () => {
      const anon = render(null);
      const { required, forbidden } = productionChecks();
      for (const re of required) {
        expect(re.test(anon), `the ${name} does not match ${re} — the production check would pass on nothing`).toBe(true);
      }
      for (const re of forbidden) {
        expect(re.test(anon), `the ${name} shows an anonymous visitor ${re}`).toBe(false);
      }
    });

    it(`is present on the ${name} for a signed-in member, so the production check is not inert`, () => {
      const { forbidden } = productionChecks();
      const member = render(AS_MEMBER);
      for (const re of forbidden) {
        expect(
          re.test(member),
          `nothing a signed-in member is shown on the ${name} matches ${re} — the production check forbids something this product never renders, so it can never fail`
        ).toBe(true);
      }
    });

    it(`offers a member who already follows the way off, not another way on, on the ${name}`, () => {
      const following = render(AS_FOLLOWER);
      expect(following).toMatch(/name="remove"\s+value="1"/);
      expect(following).not.toMatch(/Add to my desk/);
      expect(render(AS_MEMBER)).not.toMatch(/name="remove"/);
    });

    it(`withholds the offer on a member's own ${name}`, () => {
      expect(render(AS_OWNER), `a member is offered their own feed on the ${name}`).toBe(render(null));
    });

    it(`leaves the rest of the ${name}'s dialog byte-identical`, () => {
      // Everything the member sees is the anonymous document plus one block. The RSS paragraph,
      // the email disclosure and the follow form are graded by promises.test.ts and
      // follow-cadence.test.ts, and this change has no business editing them.
      const anon = render(null);
      const member = render(AS_MEMBER);
      const inserted = member.length - anon.length;
      expect(inserted, "the desk offer added nothing").toBeGreaterThan(0);
      // The dialog's own heading, not a card's — `card()` renders `<h3>` too.
      const at = member.indexOf("</h3>", member.indexOf('<dialog id="follow-dlg">')) + "</h3>".length;
      expect(
        member.slice(0, at) + member.slice(at + inserted),
        `the ${name} rewrote copy outside the block this change adds`
      ).toBe(anon);
    });
  }
});
