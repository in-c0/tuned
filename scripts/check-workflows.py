#!/usr/bin/env python3
"""Parse every workflow file and fail if one is not valid YAML.

A workflow GitHub cannot parse does not fail loudly — it produces no runs at all,
and `workflow_dispatch` on it answers 422 "does not have workflow_dispatch trigger"
even when the trigger is right there in the file. On 2026-08-07 that took
post-deploy verification off master for a merge, and nothing in the build gate
noticed, because the gate only ever ran the application's own checks.

Kept as a file rather than an inline `run:` script on purpose: an embedded
multi-line program is exactly what broke, since any line flush-left inside a
`run: |` block ends the block scalar and invalidates the workflow.
"""

import pathlib
import sys

import yaml

WORKFLOWS = pathlib.Path(__file__).resolve().parent.parent / ".github" / "workflows"


def main() -> int:
    files = sorted(p for p in WORKFLOWS.glob("*.y*ml"))
    if not files:
        print(f"::error::no workflow files found under {WORKFLOWS}")
        return 1

    failures = 0
    for path in files:
        rel = path.relative_to(WORKFLOWS.parent.parent)
        try:
            parsed = yaml.safe_load(path.read_text())
        except yaml.YAMLError as err:
            detail = " ".join(str(err).split())
            print(f"::error file={rel}::invalid YAML — {detail}")
            failures += 1
            continue
        if not isinstance(parsed, dict) or "jobs" not in parsed:
            print(f"::error file={rel}::parses, but has no top-level 'jobs' mapping")
            failures += 1
            continue
        print(f"{rel}: ok")

    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
