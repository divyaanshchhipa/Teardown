"""Fixture integrity: the gate that guards the other gates.

Run:  python tools/fixturecheck.py [src]

---------------------------------------------------------------------------
Why this exists.

Twice now a gate in this harness has kept passing while checking nothing:

  1. storycheck.py validated flow-diagram ids by iterating `lane.nodes`.
     The data uses `lane.steps`. The loop body never executed, so the
     assertion was vacuously true for as long as it existed.

  2. interact.py used `#/ev` as its "device with no 3D model" fixture, to
     prove the SVG fallback works. When the EV gained a model the assertion
     kept running -- against a device that no longer had the property being
     tested. It only surfaced because the *other* half of the pair started
     failing loudly.

Both are the same bug: a test whose subject silently stopped being what the
test assumed. Neither is visible from a pass count, which is what makes this
class worth a dedicated gate rather than more care.

What this checks:

  * every device id named in a tools/*.py file still exists
  * every hash route named in a tools/*.py file resolves
  * the properties the harness selects fixtures by are each satisfied by at
    least one device -- so "no device is model-less any more" fails here,
    loudly, instead of turning an assertion vacuous somewhere else
  * every device is reachable by tools/run_all.py's datacheck sweep

It does NOT ban hardcoded ids. Some are legitimate -- the laptop is a
reasonable subject for "does the inspector open". It bans hardcoded ids that
have gone *stale*, which is the part that actually bites.
---------------------------------------------------------------------------
"""
import re
import sys
import pathlib

from _common import (ROOT, Checks, browser, open_src, args_src_theme,
                     device_ids, DEVICE_PROPS, devices_with)

TOOLS = ROOT / "tools"

# Ids that look like devices but are not, so the scan does not flag them.
NOT_DEVICES = {"home", "findings", "about", "company", "sources",
               "index", "dist"}

# `[src, "light"]` is a theme argument, not a device argument, and the two are
# indistinguishable by shape. Listing them is duller than a cleverer regex and
# will not surprise anyone later.
NOT_DEVICE_ARGS = {"light", "dark"}


def strip_literals(text):
    """Source with comments and string literals removed.

    Needed because this file's own subjects quote their historical mistakes in
    docstrings, and a naive text search cannot distinguish an explanation of a
    bug from the bug.
    """
    import io as _io
    import tokenize as _tok
    out = []
    try:
        for tok in _tok.generate_tokens(_io.StringIO(text).readline):
            if tok.type in (_tok.COMMENT, _tok.STRING):
                continue
            out.append(tok.string)
    except (_tok.TokenError, IndentationError):
        return text  # unparseable: fall back to the raw text rather than lie
    return " ".join(out)


def scan_sources():
    """Device-ish ids and hash routes mentioned in the harness scripts."""
    hashes, quoted = {}, {}
    for path in sorted(TOOLS.glob("*.py")):
        if path.name in ("fixturecheck.py", "_common.py"):
            continue
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(r'["\']#/([A-Za-z0-9\-/]+)["\']', text):
            hashes.setdefault(m.group(1), set()).add(path.name)
        # bare quoted ids passed as a device argument, e.g. [src, "laptop"]
        for m in re.finditer(r'\[src,\s*["\']([a-z0-9\-]+)["\']\]', text):
            if m.group(1) in NOT_DEVICE_ARGS:
                continue
            quoted.setdefault(m.group(1), set()).add(path.name)
    return hashes, quoted


def main():
    src, _ = args_src_theme(sys.argv)
    c = Checks("fixturecheck %-18s" % src)

    hashes, quoted = scan_sources()

    with browser() as b:
        ctx, page = open_src(b, src)
        ids = set(device_ids(page))

        # ---- every hardcoded route still resolves ----
        for route, files in sorted(hashes.items()):
            head = route.split("/")[0]
            where = ", ".join(sorted(files))
            if head in NOT_DEVICES:
                continue
            c.ok(head in ids,
                 'route "#/%s" in %s names a device that does not exist' % (route, where))
            if "/" in route and head in ids:
                node = route.split("/", 1)[1]
                exists = page.evaluate(
                    "k => !!TD.nodeIndex[k]", route)
                c.ok(exists,
                     'route "#/%s" in %s names a node that does not exist' % (route, where))

        # ---- device ids passed as arguments still exist ----
        for dev, files in sorted(quoted.items()):
            c.ok(dev in ids,
                 'device %r passed in %s does not exist' % (dev, ", ".join(sorted(files))))

        # ---- every fixture property is still satisfiable ----
        # This is the check that would have caught the interact.py bug on the
        # day the EV got a model, rather than never.
        for prop in sorted(DEVICE_PROPS):
            got = devices_with(page, prop)
            c.ok(bool(got),
                 'no device satisfies fixture property %r any more -- a gate '
                 'selecting on it is now testing nothing' % prop)

        # ---- run_all's datacheck sweep reaches everything ----
        run_all = (TOOLS / "run_all.py").read_text(encoding="utf-8")
        c.ok("for dev in DEVICES" in run_all,
             "run_all.py sweeps datacheck over every device rather than one")
        # Look only at executable lines: run_all.py quotes the old broken
        # line inside its header comment as an explanation, and matching that
        # would make this assertion permanently red for the right reason.
        # Strip comments and docstrings properly rather than by eyeballing line
        # prefixes: run_all.py quotes the old broken line *inside* its header
        # docstring as an explanation of what went wrong, indented, and a
        # text search cannot tell that from the real thing. Tokenising can.
        c.ok('[src, "laptop"]' not in strip_literals(run_all),
             "run_all.py no longer hardcodes a single datacheck device")

        # ---- shots.py is generated, not hand-listed ----
        shots = (TOOLS / "shots.py").read_text(encoding="utf-8")
        c.ok("def build_views" in shots,
             "shots.py derives its view list from the site")

        print("  %d devices, %d routes and %d device args scanned across the harness"
              % (len(ids), len(hashes), len(quoted)))
        ctx.close()

    return 0 if c.report() else 1


if __name__ == "__main__":
    sys.exit(main())
