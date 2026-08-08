// Link metadata extraction: given a URL, return enough to render a rich card
// with zero required input from the creator (attention, not content).

export interface LinkMeta {
  url: string;
  title: string;
  description: string;
  image_url: string;
  site_name: string;
  domain: string;
  kind: string; // video | article | post | music | code | link
  category: string;
}

const DOMAIN_RULES: Array<{ match: RegExp; kind: string; category: string }> = [
  { match: /(^|\.)youtube\.com$|(^|\.)youtu\.be$/, kind: "video", category: "Video" },
  { match: /(^|\.)twitch\.tv$/, kind: "video", category: "Video" },
  { match: /(^|\.)tiktok\.com$/, kind: "video", category: "Video" },
  { match: /(^|\.)x\.com$|(^|\.)twitter\.com$/, kind: "post", category: "Posts" },
  { match: /(^|\.)instagram\.com$|(^|\.)threads\.net$/, kind: "post", category: "Posts" },
  { match: /(^|\.)reddit\.com$/, kind: "post", category: "Posts" },
  { match: /(^|\.)github\.com$|(^|\.)gitlab\.com$/, kind: "code", category: "Code" },
  { match: /(^|\.)arxiv\.org$|(^|\.)biorxiv\.org$|(^|\.)nature\.com$/, kind: "article", category: "Research" },
  { match: /(^|\.)spotify\.com$|(^|\.)soundcloud\.com$|(^|\.)music\.apple\.com$/, kind: "music", category: "Music" },
  { match: /(^|\.)substack\.com$|(^|\.)medium\.com$/, kind: "article", category: "Reading" },
];

export function classify(domain: string): { kind: string; category: string } {
  for (const r of DOMAIN_RULES) if (r.match.test(domain)) return { kind: r.kind, category: r.category };
  return { kind: "article", category: "Reading" };
}

function bareDomain(url: URL): string {
  return url.hostname.replace(/^www\./, "");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
}

/** Read at most `cap` bytes through an HTMLRewriter so meta handlers fire, then cancel. */
async function drainCapped(res: Response, cap: number): Promise<void> {
  const body = res.body;
  if (!body) return;
  const reader = body.getReader();
  let read = 0;
  try {
    while (read < cap) {
      const { done, value } = await reader.read();
      if (done) break;
      read += value.byteLength;
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
}

/** Absolute http(s) form of an image URL, or "" if there isn't one.
 *
 * `og:image` is routinely relative — arXiv, for one, publishes
 * `/static/browse/0.3.4/images/arxiv-logo-fb.png`. Stored verbatim, that path is later rendered on
 * our own origin, where it resolves to justtuned.com and 404s. EXP-003's browser run against
 * production found exactly that, on a live landing-page card.
 *
 * Anything that is not http(s) after resolution is dropped rather than passed through: `data:` and
 * `javascript:` values arrive from pages we do not control and end up in an `src` attribute. */
export function resolveImageUrl(raw: string, base: string | URL): string {
  if (!raw) return "";
  try {
    const u = new URL(raw, base);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

async function fetchOg(target: URL): Promise<Partial<LinkMeta>> {
  const res = await fetch(target.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AttentionFeedBot/0.1; link preview)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(8000),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`upstream ${res.status}`);

  const meta: Record<string, string> = {};
  let titleText = "";
  const rewriter = new HTMLRewriter()
    .on("meta", {
      element(el) {
        const key = el.getAttribute("property") ?? el.getAttribute("name") ?? "";
        const content = el.getAttribute("content") ?? "";
        if (key && content && !(key in meta)) meta[key] = content;
      },
    })
    .on("title", {
      text(t) {
        if (titleText.length < 300) titleText += t.text;
      },
    });

  await drainCapped(rewriter.transform(res), 384 * 1024);

  return {
    title: decodeEntities(meta["og:title"] ?? meta["twitter:title"] ?? titleText.trim()),
    description: decodeEntities(meta["og:description"] ?? meta["twitter:description"] ?? meta["description"] ?? ""),
    // Resolved against the URL we actually fetched, which after `redirect: "follow"` is not
    // necessarily the one we asked for.
    image_url: resolveImageUrl(meta["og:image"] ?? meta["twitter:image"] ?? "", res.url || target),
    site_name: decodeEntities(meta["og:site_name"] ?? ""),
  };
}

async function fetchYouTube(target: URL): Promise<Partial<LinkMeta>> {
  const oembed = new URL("https://www.youtube.com/oembed");
  oembed.searchParams.set("url", target.toString());
  oembed.searchParams.set("format", "json");
  const res = await fetch(oembed.toString(), { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`oembed ${res.status}`);
  const data = (await res.json()) as { title?: string; author_name?: string; thumbnail_url?: string };
  return {
    title: data.title ?? "",
    description: data.author_name ? `by ${data.author_name}` : "",
    image_url: data.thumbnail_url ?? "",
    site_name: "YouTube",
  };
}

async function fetchTweet(target: URL): Promise<Partial<LinkMeta>> {
  const oembed = new URL("https://publish.twitter.com/oembed");
  oembed.searchParams.set("url", target.toString());
  oembed.searchParams.set("omit_script", "1");
  const res = await fetch(oembed.toString(), { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`oembed ${res.status}`);
  const data = (await res.json()) as { author_name?: string; html?: string };
  const text = decodeEntities((data.html ?? "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  return {
    title: data.author_name ? `Post by ${data.author_name}` : "Post",
    description: text.slice(0, 280),
    image_url: "",
    site_name: "X",
  };
}

export async function resolveLink(rawUrl: string): Promise<LinkMeta> {
  const target = new URL(rawUrl); // throws on invalid — caller handles
  if (target.protocol !== "http:" && target.protocol !== "https:") throw new Error("only http(s) links");
  const domain = bareDomain(target);
  const { kind, category } = classify(domain);

  let partial: Partial<LinkMeta> = {};
  try {
    if (/(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(domain)) partial = await fetchYouTube(target);
    else if (/(^|\.)x\.com$|(^|\.)twitter\.com$/.test(domain)) partial = await fetchTweet(target);
    else partial = await fetchOg(target);
  } catch {
    // metadata is best-effort; the card degrades to domain + path
  }

  const fallbackTitle = decodeURIComponent(target.pathname.replace(/\/$/, "").split("/").pop() ?? "").replace(/[-_]/g, " ") || domain;
  return {
    url: target.toString(),
    title: (partial.title || fallbackTitle).slice(0, 300),
    description: (partial.description ?? "").slice(0, 500),
    image_url: partial.image_url ?? "",
    site_name: partial.site_name ?? "",
    domain,
    kind,
    category,
  };
}
