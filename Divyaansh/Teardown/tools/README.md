# tools/: the verification harness

The repo has no test command and no build step to hang one off. These scripts
are the safety net: they open the real site over `file://` in headless
Chromium and assert against what is actually rendered.

Nothing here ships. `build.py` only inlines files referenced by `index.html`,
so this folder has no effect on `dist/teardown.html`.

## Running

```bash
python tools/run_all.py          # every gate, every device, both builds
python tools/run_all.py fast     # skips contrast + visible (the slow ones)
python tools/run_all.py quick    # one datacheck instead of 15 -- NOT for CI

python tools/interact.py         # one gate at a time
python tools/interact.py dist/teardown.html dark
python tools/datacheck.py index.html ev        # per device
python tools/shots.py index.html shots ev      # screenshots for one device
```

**`run_all` sweeps datacheck over every device.** It used to run once against
the laptop, which is why ten of twelve devices sat failing their own accounting
gate unnoticed -- the AI server summed its bill of materials to 109%, the EV to
94%. The suite was green the whole time because it was only ever asked about
one device. Do not reintroduce a single hardcoded device here.

Requires `playwright` and `pillow`. Chromium is launched with SwiftShader so
WebGL works headless.

## The gates

| Script | Asserts |
|---|---|
| `interact.py` | The site works when clicked: every device renders, 3D controls, part index, inspector, source drawer, renderer toggle, search, browse, theme. Three viewports. |
| `schematic.py` | No schematic label overruns its tile, collides with another label, sits under the share bar, or is painted over. Every device and sub-board, exploded and not. |
| `storycheck.py` | The laptop's build stages account for every node exactly once, flow ids resolve, chart cards carry source footers. |
| `datacheck.py` | Provenance: every source entry is locatable. Accounting: root `bomPct` sums to 100. Hygiene: no duplicate share tables, no missing basis/year/confidence. |
| `contrast.py` | WCAG AA over every visible text/background pair, composited through translucent ancestors, both themes. |
| `visible.py` | No 3D part disappears into the ground, in either theme. Baseline-frame diffing, bulk and silhouette. |
| `tourcheck.py` | The guided tour, walked **forwards and backwards**, one press at a time. Each step's anchor must resolve and have a visible box, the spotlight must land on it, the caption must not cover it, and the state the step declares it needs (route, view) must actually hold when it is painted. Also checks that three fast Next presses advance exactly three steps. |
| `fixturecheck.py` | **Guards the other gates.** Fails if any script names a device, route or fixture property that no longer exists. |
| `shots.py` | Not a gate, screenshots for actually looking at it. View list is generated, not hand-written. |

## Traps already paid for

Each of these cost real debugging time once. `_common.py` and the comments in
each script encode the fix; don't undo them.

- **`readPixels` on a WebGL canvas returns the clear colour** from Playwright,
  because without `preserveDrawingBuffer` the buffer is gone once the frame is
  composited. `interact.py` asks `renderer.info` what it rasterised instead.
- **Element screenshots of a WebGL canvas come back blank.** Capture the
  viewport and clip.
- **Never sample the board background from a corner**: it is a gradient, so
  the gradient itself reads as "part" and every score collapses to the same
  meaningless number. Diff against a baseline frame with all parts hidden.
- **`page.click()` lands under the sticky topbar** or the mobile bottom sheet.
  Use `tap()`, which scrolls into the clear band and verifies with
  `elementFromPoint`.
- **Forcing a theme breaks the "persists across reload" assertion**, because
  the init script rewrites storage on the very reload being tested. That one
  assertion is skipped when a theme is forced.
- **Repeated `page.goto` in one tab exhausts WebGL contexts** and prints
  alarming warnings that mean nothing. Navigate by hash instead.
- **A tour step must never inherit page state from its neighbour.** Steps
  declare `need` (route, view, slider values, drawer) and it is re-applied
  idempotently on arrival. The reported symptom was a caption describing the
  country colour key while the ring sat on the 3D hint, reachable only by
  pressing Back. `tourcheck.py` now walks the tour in both directions for
  exactly this reason: a forward-only walk cannot see it.
- **Successive lines of a wrapped tile title overlap by design.** The
  schematic gate excludes `.pname`/`.pname` pairs; everything else is real.
- **PowerShell has no heredocs and no `&&`.** Write Python to a file and run it.
- **A hardcoded fixture becomes a silent false pass.** This has happened twice:
  `storycheck.py` iterated `lane.nodes` when the data uses `lane.steps`, so the
  loop body never ran; `interact.py` used the EV as its "device with no 3D
  model" case and kept asserting after the EV got one. Neither was visible from
  a pass count. Select fixtures by *property* via `pick_device()` in
  `_common.py`, never by id, and let `fixturecheck.py` catch the rest.
