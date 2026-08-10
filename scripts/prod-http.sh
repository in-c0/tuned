#!/usr/bin/env bash
#
# One request contract, shared by every first-party production read that runs from
# GitHub Actions.
#
# Why this file exists. On 2026-08-10 both production readers went red at once without a
# product commit between them: `verify production` watched /api/version for eight minutes
# and never saw a build stamp, and `metrics snapshot` got HTTP 403 from an authenticated
# /api/metrics. The 403 body was Cloudflare's "Just a moment..." interstitial, so neither
# request was reaching the Worker at all — they were being answered by bot management in
# front of it. Both callers were bare `curl`, which announces `curl/8.x` with `Accept: */*`
# and is scored exactly like an anonymous scraper.
#
# What this contract does about that: it identifies the caller honestly. A named
# first-party monitor, a link to the repository that runs it, and an Accept header stating
# what the caller actually wants.
#
# What it deliberately does NOT do: impersonate a browser. A borrowed Chrome user-agent
# would very likely move the bot score, and that is precisely why it is off the table —
# passing a challenge by disguise is evasion of a control the owner deliberately enabled,
# and it would leave the same request looking legitimate the next time something really is
# wrong. If Cloudflare declines an honestly-identified first-party client, the fix is an
# allow rule on the zone, which is owner authority, not a better costume.
#
# Nothing here ever prints a response body or a key. `get` writes the body to a file and
# emits only the status; `probe` reports status, content type, size and the Cloudflare Ray
# ID — which is the identifier the owner needs to find the matching Security Event.

set -euo pipefail

UA='tuned-ops-verifier/1.0 (+https://github.com/in-c0/tuned; first-party uptime and metrics check)'

# The two ways to reach the same Worker.
#
# PUBLIC_BASE is the zone, and it is what "the site is up" means — nothing below ever lets
# a healthy Worker be reported as a healthy site.
#
# ORIGIN_BASE is that same Worker on its workers.dev route, which sits outside the zone and
# therefore outside whatever is challenging it. This is not a costume and not a way past a
# control: it is our own origin, enabled by `workers_dev: true` in wrangler.jsonc, reached
# under the same honest user-agent. It is here because the 2026-08-10 challenge took away
# this loop's ability to verify its own deploys — `16d522b` shipped a change to the public
# legal pages and nothing could confirm it was live. Reading *identity and health* from the
# origin restores that. Reading *availability* from it would be a lie, so `vantage` reports
# the zone's state as a separate fact and the callers grade on it.
PUBLIC_BASE="${PUBLIC_BASE:-https://justtuned.com}"
ORIGIN_BASE="${ORIGIN_BASE:-https://attention-feed.wldud5192.workers.dev}"

# Build the shared header set. The metrics key is passed only when the caller explicitly
# asks for it, and is read from the environment rather than interpolated by a caller, so
# it never lands in a command line, a log line or an error message.
_headers() {
  local accept="$1" authed="$2"
  printf '%s\0' "-H" "user-agent: ${UA}"
  printf '%s\0' "-H" "accept: ${accept}"
  printf '%s\0' "-H" "cache-control: no-cache"
  if [ "$authed" = "1" ]; then
    printf '%s\0' "-H" "x-metrics-key: ${METRICS_KEY:-}"
  fi
}

# get <url> <outfile> [accept] [authed]
#
# Performs the real request under the contract. Prints the HTTP status and nothing else.
# On transport failure it prints 000, so a dead connection can never be mistaken for a
# successful status by a caller doing a string comparison.
cmd_get() {
  local url="$1" out="$2" accept="${3:-*/*}" authed="${4:-0}"
  local -a hdr=()
  while IFS= read -r -d '' arg; do hdr+=("$arg"); done < <(_headers "$accept" "$authed")
  # `-w` already prints 000 on a transport failure, so the old `|| echo 000` concatenated a
  # second one and callers saw `000000`. Harmless against `= "200"`, but it is a status line
  # that lies about its own shape, and `vantage` now reports it where someone will read it.
  local code
  code=$(curl -sS --max-time "${TIMEOUT:-30}" "${hdr[@]}" -o "$out" -w '%{http_code}' "$url") || code="000"
  printf '%s\n' "$code"
}

# probe <url> [label] [accept] [authed]
#
# Safe diagnostics. Requests the URL twice — once as a bare curl exactly like the callers
# that broke, once under the contract — so the two rows answer the question "does an
# explicit request contract change the outcome?" directly rather than by inference.
cmd_probe() {
  local url="$1" label="${2:-$url}" accept="${3:-*/*}" authed="${4:-0}"
  local variant
  for variant in bare contract; do
    local hdrs body code ctype ray mitigated size
    hdrs=$(mktemp); body=$(mktemp)
    local -a hdr=()
    if [ "$variant" = "contract" ]; then
      while IFS= read -r -d '' arg; do hdr+=("$arg"); done < <(_headers "$accept" "$authed")
    elif [ "$authed" = "1" ]; then
      # The bare variant reproduces the failing caller as it actually was: the key was
      # always sent, so omitting it here would compare two different questions at once.
      hdr=(-H "x-metrics-key: ${METRICS_KEY:-}")
    fi
    code=$(curl -sS --max-time "${TIMEOUT:-30}" "${hdr[@]}" -D "$hdrs" -o "$body" -w '%{http_code}' "$url" || echo 000)
    ctype=$(grep -i '^content-type:' "$hdrs" | head -1 | cut -d' ' -f2- | tr -d '\r' || true)
    ray=$(grep -i '^cf-ray:' "$hdrs" | head -1 | cut -d' ' -f2- | tr -d '\r' || true)
    # Cloudflare sets cf-mitigated when a managed challenge or block answered the request,
    # which distinguishes "the edge stopped this" from "the Worker returned this" without
    # anyone having to eyeball a body.
    mitigated=$(grep -i '^cf-mitigated:' "$hdrs" | head -1 | cut -d' ' -f2- | tr -d '\r' || true)
    size=$(wc -c < "$body" | tr -d ' ')
    printf '%-22s %-9s status=%-4s type=%-34s bytes=%-7s cf-ray=%-22s cf-mitigated=%s\n' \
      "$label" "$variant" "$code" "${ctype:--}" "$size" "${ray:--}" "${mitigated:--}"
    rm -f "$hdrs" "$body"
  done
}

# vantage
#
# Decides which host this run should read production from, and reports the zone's own state
# alongside it. Emits `key=value` lines, ready to append to $GITHUB_OUTPUT.
#
# The zone is always asked first and always wins when it answers, so in normal operation
# this changes nothing and no caller behaves differently. The origin is consulted only when
# the zone does not serve, and whenever it is used the caller is handed `zone_blocked=true`.
# What a caller does with that is its own decision: `verify production` treats it as a
# failure because public availability is the product, while `metrics snapshot` proceeds,
# because counters are internal state and reading them does not assert that anyone can
# visit the site.
#
# If neither answers, the base stays on the zone. A run that cannot see production at all
# should fail against the host that actually matters.
cmd_vantage() {
  local zone_code zone_ray origin_code hdrs body
  hdrs=$(mktemp); body=$(mktemp)
  local -a hdr=()
  while IFS= read -r -d '' arg; do hdr+=("$arg"); done < <(_headers 'application/json' 0)
  zone_code=$(curl -sS --max-time "${TIMEOUT:-30}" "${hdr[@]}" -D "$hdrs" -o "$body" -w '%{http_code}' "${PUBLIC_BASE}/api/version" || echo 000)
  zone_ray=$(grep -i '^cf-ray:' "$hdrs" | head -1 | cut -d' ' -f2- | tr -d '\r' || true)
  rm -f "$hdrs" "$body"

  if [ "$zone_code" = "200" ]; then
    printf 'base=%s\nvantage=public\nzone_blocked=false\nzone_status=%s\nzone_ray=%s\norigin_status=not-tried\n' \
      "$PUBLIC_BASE" "$zone_code" "${zone_ray:--}"
    return 0
  fi

  origin_code=$(cmd_get "${ORIGIN_BASE}/api/version" /dev/null 'application/json' 0)
  if [ "$origin_code" = "200" ]; then
    printf 'base=%s\nvantage=origin\nzone_blocked=true\nzone_status=%s\nzone_ray=%s\norigin_status=%s\n' \
      "$ORIGIN_BASE" "$zone_code" "${zone_ray:--}" "$origin_code"
    return 0
  fi

  printf 'base=%s\nvantage=none\nzone_blocked=true\nzone_status=%s\nzone_ray=%s\norigin_status=%s\n' \
    "$PUBLIC_BASE" "$zone_code" "${zone_ray:--}" "$origin_code"
}

case "${1:-}" in
  get)     shift; cmd_get "$@" ;;
  probe)   shift; cmd_probe "$@" ;;
  vantage) shift; cmd_vantage "$@" ;;
  origin)  printf '%s\n' "$ORIGIN_BASE" ;;
  *) echo "usage: prod-http.sh get <url> <outfile> [accept] [authed] | probe <url> [label] [accept] [authed] | vantage | origin" >&2; exit 2 ;;
esac
