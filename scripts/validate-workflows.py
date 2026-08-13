#!/usr/bin/env python3
"""Parse every workflow file and assert it still declares the triggers it needs.

Written after shipping a verify-production.yml whose embedded multi-line script
terminated the YAML block scalar. GitHub's response to an unparseable workflow is
silence: no run on push, no annotation anywhere the executor was looking, and a 422
"workflow does not have 'workflow_dispatch' trigger" on dispatch. Production was left
with no post-deploy verification at all, and the only signal was an absence.

Nothing else in the gate reads these files — `tsc` and `vitest` never open them — so a
syntax error in the file that verifies production could only be caught here.
"""

import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover - the runner image ships PyYAML
    print("PyYAML is not installed; cannot validate workflows", file=sys.stderr)
    sys.exit(1)

# A workflow losing one of these is the failure this script exists to catch: it stays
# valid YAML, it just stops being reachable the way the operating loop depends on.
REQUIRED_TRIGGERS = {
    "verify-production.yml": {"push", "workflow_dispatch", "schedule"},
    "check.yml": {"push", "pull_request", "workflow_dispatch"},
    "metrics-snapshot.yml": {"schedule", "workflow_dispatch"},
    # A success check nobody can dispatch is an attestation again (L-16).
    "agent-preflight.yml": {"workflow_dispatch"},
}

workflows = sorted(Path(".github/workflows").glob("*.yml"))
if not workflows:
    print("no workflow files found — expected at least one", file=sys.stderr)
    sys.exit(1)

failed = False
for path in workflows:
    try:
        doc = yaml.safe_load(path.read_text())
    except yaml.YAMLError as exc:
        print(f"FAIL {path}: unparseable — {exc}", file=sys.stderr)
        failed = True
        continue

    if not isinstance(doc, dict):
        print(f"FAIL {path}: does not parse to a mapping", file=sys.stderr)
        failed = True
        continue

    # PyYAML resolves the bare key `on` to the boolean True (YAML 1.1), so the trigger
    # block arrives under True, not "on". Both are checked so this keeps working if the
    # file ever quotes the key.
    triggers = doc.get("on", doc.get(True))
    names = set(triggers) if isinstance(triggers, dict) else {triggers} if isinstance(triggers, str) else set(triggers or [])

    missing = REQUIRED_TRIGGERS.get(path.name, set()) - names
    if missing:
        print(f"FAIL {path}: missing required trigger(s): {', '.join(sorted(missing))}", file=sys.stderr)
        failed = True
        continue

    print(f"ok   {path} ({', '.join(sorted(names))})")

sys.exit(1 if failed else 0)
