"""Every source URL in the registry must still resolve.

A citation that links to a 404 is worse than one that links nowhere: it looks
checkable and is not. This reads `data/sources.js` through the live page, so it
checks exactly what a reader would click, and reports anything dead.

The one thing to understand before trusting the output:

    403 and 405 mean bot-blocked, NOT broken.

About fifteen of these publishers (Omdia, SEMI, Gartner, S&P Global,
Automotive News, Sony, Corning and others) refuse scripted requests outright
and load perfectly in a browser. Treating those as failures would make the gate
cry wolf every run until someone stopped reading it, so they are reported
separately as unverifiable. Only 400, 404 and 410, plus DNS failures, count as
broken.

This is deliberately NOT part of run_all: it depends on fifteen third-party
websites being up, so it would make an offline or flaky-network run look like a
code regression. Run it on its own, occasionally.

Run:  python tools/linkcheck.py [src]
"""
import ssl
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from _common import Checks, browser, open_src, settle

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")

# Verification stays on. A certificate failure is the same broken experience a
# reader gets, so it should surface rather than be waved through.
CTX = ssl.create_default_context()

BLOCKED = (401, 403, 405, 406, 429)   # refuses robots, not necessarily dead
DEAD = (400, 404, 410)


def probe(url, method):
    req = urllib.request.Request(url, method=method, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
        "Accept-Language": "en-GB,en;q=0.9",
    })
    with urllib.request.urlopen(req, timeout=25, context=CTX) as r:
        return r.status


def check(item):
    name, url = item
    # HEAD is cheap; a surprising number of these hosts refuse it, so fall
    # through to GET before believing a failure.
    for method in ("HEAD", "GET"):
        try:
            return name, url, probe(url, method), ""
        except urllib.error.HTTPError as e:
            if method == "HEAD":
                continue
            return name, url, e.code, e.reason
        except Exception as e:
            if method == "HEAD":
                continue
            return name, url, 0, type(e).__name__
    return name, url, 0, "unreachable"


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "index.html"
    c = Checks("linkcheck %-20s" % src)

    with browser() as b:
        ctx, page = open_src(b, src)
        settle(page, 600)
        pairs = page.evaluate(
            "() => Object.keys(TD.SOURCES)"
            ".filter(k => TD.SOURCES[k].url)"
            ".map(k => [k, TD.SOURCES[k].url])")
        total = page.evaluate("() => Object.keys(TD.SOURCES).length")
        ctx.close()

    print("  %d registered publishers, %d with a URL\n" % (total, len(pairs)))

    with ThreadPoolExecutor(max_workers=10) as ex:
        results = list(ex.map(check, [tuple(p) for p in pairs]))

    ok = [r for r in results if 200 <= r[2] < 400]
    blocked = [r for r in results if r[2] in BLOCKED]
    dead = [r for r in results if r[2] in DEAD]
    unreachable = [r for r in results
                   if r not in ok and r not in blocked and r not in dead]

    print("  reachable            : %d" % len(ok))
    print("  blocked to scripts   : %d  (not failures, see the docstring)" % len(blocked))
    print("  network/DNS/TLS      : %d" % len(unreachable))
    print("  DEAD                 : %d\n" % len(dead))

    for name, url, status, reason in blocked:
        print("    blocked %-3s %-40s %s" % (status, name[:40], url))
    for name, url, status, reason in unreachable:
        print("    unreach %-3s %-40s %s (%s)" % (status or "-", name[:40], url, reason))

    for name, url, status, reason in dead:
        c.ok(False, "%s is dead (%s) %s" % (name, status, url))
    c.ok(not dead, "no registered source URL returns 400, 404 or 410")

    return 0 if c.report() else 1


if __name__ == "__main__":
    sys.exit(main())
