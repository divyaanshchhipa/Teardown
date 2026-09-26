"""Every gate, both builds, both themes. The one command to trust.

Run:  python tools/run_all.py            # everything
      python tools/run_all.py fast       # skip the slow visual gates
      python tools/run_all.py quick      # one datacheck per build, not all 15

Exit code is non-zero if any gate fails, so it can front a commit hook.

---------------------------------------------------------------------------
datacheck runs once PER DEVICE, and that is the point of this file.

It used to run once, hardcoded to the laptop:

    GATES.append(("datacheck.py", [src, "laptop"], ...))

That single word is why ten of twelve devices sat failing their own accounting
gate for months without anyone noticing -- the AI server rack summed its bill
of materials to 109%, the EV to 94%, the tractor cited eight publishers that
did not exist in the registry. Every one of those would have been caught on
the day it was introduced. The suite was green the entire time because it was
only ever asked about one device.

The cost is runtime: fifteen devices instead of one, roughly ten minutes on a
suite already north of twenty. That is the correct trade. `quick` exists for
the impatient case and should not be what CI runs.
---------------------------------------------------------------------------
"""
import subprocess
import sys
import time

from _common import ROOT, SOURCES, browser, open_src, device_ids

PY = sys.executable
T = ROOT / "tools"

FAST = "fast" in sys.argv[1:]
QUICK = "quick" in sys.argv[1:]


def all_device_ids():
    """Ask the site what devices exist. Never hardcode this list -- a device
    added to index.html must be gated automatically or the gap reopens."""
    with browser() as b:
        ctx, page = open_src(b, SOURCES[0])
        ids = device_ids(page)
        ctx.close()
    return ids


DEVICES = ["laptop"] if QUICK else all_device_ids()
print("gating %d device%s: %s\n" % (len(DEVICES), "" if len(DEVICES) == 1 else "s",
                                    ", ".join(DEVICES)), flush=True)

# (script, args, label)
GATES = []
for src in SOURCES:
    GATES.append(("interact.py", [src], "interact %s" % src))
    GATES.append(("interact.py", [src, "light"], "interact %s light" % src))
    GATES.append(("interact.py", [src, "dark"], "interact %s dark" % src))
    GATES.append(("storycheck.py", [src], "storycheck %s" % src))
    # The guided tour anchors to live selectors in app.js. A rename there turns
    # a step into a silent no-op, which is exactly the class of rot the rest of
    # this file exists to catch.
    GATES.append(("tourcheck.py", [src], "tourcheck %s" % src))
    # Guards the other gates: fails if any of them names a device, route or
    # fixture property that no longer exists. Cheap, and the only thing that
    # catches an assertion going vacuous.
    GATES.append(("fixturecheck.py", [src], "fixturecheck %s" % src))
    for dev in DEVICES:
        GATES.append(("datacheck.py", [src, dev], "datacheck %s %s" % (dev, src)))
    GATES.append(("schematic.py", [src, "light"], "schematic %s light" % src))
    GATES.append(("schematic.py", [src, "dark"], "schematic %s dark" % src))
    if not FAST:
        GATES.append(("contrast.py", [src], "contrast %s" % src))
        GATES.append(("visible.py", [src], "visible %s" % src))


def main():
    fails, t0 = [], time.time()
    for script, args, label in GATES:
        p = subprocess.run([PY, str(T / script)] + args, cwd=str(ROOT),
                           capture_output=True, text=True, encoding="utf-8",
                           errors="replace")
        head = (p.stdout or "").strip().split("\n")
        summary = next((l for l in head if "passed" in l), head[-1] if head else "?")
        status = "ok  " if p.returncode == 0 else "FAIL"
        # flush: the full run takes twenty minutes and stdout is usually a
        # pipe, so without this it prints nothing at all until the very end
        print("%s %-34s %s" % (status, label, summary.strip()), flush=True)
        if p.returncode != 0:
            fails.append((label, p.stdout, p.stderr))

    print("\n%d/%d gates passed in %ds" % (len(GATES) - len(fails), len(GATES),
                                           int(time.time() - t0)))
    for label, out, err in fails:
        print("\n--- %s ---" % label)
        for line in (out or "").split("\n"):
            if "FAIL" in line:
                print(line)
        if err.strip():
            print(err.strip()[:600])
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
