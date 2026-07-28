-- Demo data (local dev). Creator "ava" with a week of plausible attention.
INSERT OR IGNORE INTO creators (handle, name, bio, avatar_url, accent, token) VALUES
  ('ava', 'Ava Kim', 'Building things at the edge of AI, sport and play. Sydney.', '', '#7c6cff', 'dev-demo-token-not-for-prod');

-- items (timestamps spread over the past week, newest first in feed)
INSERT INTO items (creator_id, url, title, description, image_url, site_name, domain, kind, category, note, visibility, created_at) VALUES
  (1, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'The genius of one-touch football, explained', 'Why elite midfielders scan 8 times before receiving.', '', 'YouTube', 'youtube.com', 'video', 'Video', '', 'public', strftime('%Y-%m-%dT%H:%M:%fZ','now','-2 hours')),
  (1, 'https://arxiv.org/abs/2405.00001', 'Scaling laws for attention-efficient transformers', 'We study compute-optimal attention sparsity…', '', 'arXiv', 'arxiv.org', 'article', 'Research', 'the 3.2x claim in §4 is wild if it replicates', 'public', strftime('%Y-%m-%dT%H:%M:%fZ','now','-5 hours')),
  (1, 'https://github.com/cloudflare/workers-sdk', 'cloudflare/workers-sdk', 'Command line tools and SDK for Cloudflare Workers.', '', 'GitHub', 'github.com', 'code', 'Code', '', 'public', strftime('%Y-%m-%dT%H:%M:%fZ','now','-26 hours')),
  (1, 'https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp', 'Mr. Brightside — The Killers', '', '', 'Spotify', 'open.spotify.com', 'music', 'Music', '', 'public', strftime('%Y-%m-%dT%H:%M:%fZ','now','-30 hours')),
  (1, 'https://stratechery.com/2026/some-article', 'Aggregation theory, ten years on', 'Revisiting the framework that explained the internet economy.', '', 'Stratechery', 'stratechery.com', 'article', 'Reading', '', 'public', strftime('%Y-%m-%dT%H:%M:%fZ','now','-2 days')),
  (1, 'https://x.com/karpathy/status/1', 'Post by Andrej Karpathy', 'On the bitter lesson of agent scaffolds vs raw model capability.', '', 'X', 'x.com', 'post', 'Posts', '', 'public', strftime('%Y-%m-%dT%H:%M:%fZ','now','-2 days','-3 hours')),
  (1, 'https://www.youtube.com/watch?v=abc123', 'How Formula 1 aero regs quietly changed everything', '', '', 'YouTube', 'youtube.com', 'video', 'Video', '', 'public', strftime('%Y-%m-%dT%H:%M:%fZ','now','-3 days')),
  (1, 'https://www.nature.com/articles/some-paper', 'Muscle-fibre typing from wearable data alone', 'A validation study across 400 athletes.', '', 'Nature', 'nature.com', 'article', 'Research', '', 'public', strftime('%Y-%m-%dT%H:%M:%fZ','now','-4 days')),
  (1, 'https://www.youtube.com/watch?v=def456', 'Inside the studio of a one-person game dev', '', '', 'YouTube', 'youtube.com', 'video', 'Video', 'this is the life honestly', 'public', strftime('%Y-%m-%dT%H:%M:%fZ','now','-5 days')),
  (1, 'https://example-blog.com/attention-economy', 'The attention economy is eating culture', 'An essay on feeds, taste, and what we lost.', '', '', 'example-blog.com', 'article', 'Reading', '', 'hidden', strftime('%Y-%m-%dT%H:%M:%fZ','now','-6 days'));
