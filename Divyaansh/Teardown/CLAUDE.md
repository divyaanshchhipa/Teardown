# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Teardown is an interactive map of technology supply chains: pick a device, dismantle it, and every
component opens into the companies that supply it, their market shares, how concentrated that layer
is, and the deals that produced the structure. Built for tech M&A origination: the concentration and
fragmentation tables are the point, not decoration.

Plain HTML/CSS/classic JS. No build step, no bundler, no package manager, no framework, no tests.
Data loads as `<script>` tags (not `fetch`) specifically so `file://` works with zero server.

## Running it

Open `index.html` directly in a browser. That's the entire dev loop: edit a file, reload.

To produce a single self-contained file (inlines every stylesheet and script, ~2.1 MB):

```bash
python build.py
```

This writes `dist/teardown.html` (full document) and `dist/teardown-embed.html` (styles + body only,
no `<html>/<head>/<body>`, for hosts that supply their own document shell). The multi-file source tree
is what you edit: `dist/` is generated output, never hand-edit it. Run `build.py` after any change
that should be reflected in the shipped single-file artifact.

There is no lint step. There *is* a verification harness in `tools/`, headless Chromium driving the
real site over `file://`, which is the only safety net this repo has:

```bash
python tools/run_all.py         # every gate, both builds, both themes (~23 min)
python tools/run_all.py fast    # skips the two slow visual gates
```

Run it after any change to rendering, theming or device data, and after any change to the
topbar or the device-view scaffold, because `tourcheck.py` walks the guided tour through every
one of its anchors. `tools/README.md` documents each gate
and, more importantly, the traps already paid for, `readPixels` on a WebGL canvas returns the clear
colour from Playwright, element screenshots of a canvas come back blank, and sampling the board
background from a corner measures the gradient rather than the part. Don't rediscover those.

## Architecture

### Data model (`js/core.js`)

`TD` (attached to `window`) is the global registry. Two registration calls populate it:

- `TD.section(list)`, catalogue sections shown in the browse menu (`data/sections.js`).
- `TD.device(def)`: one teardown (`data/devices/*.js`). Registering a device builds the
  parent/child node tree from a flat `nodes` array (via `node.parent` ids), indexes every node as
  `deviceId/nodeId` in `TD.nodeIndex`, and indexes every named company across all devices in
  `TD.companyIndex`.

Everything downstream (navigation, search, the company index, the findings tables) derives from
these two calls: adding a device or section is data-only, nothing else needs wiring by hand (see
README "Adding a teardown" / "Adding it to the catalogue" for the exact schema).

`core.js` also owns the analytics that make the site's argument:

- **`TD.rankShares(node)`**: the house naming rule, applied everywhere shares are shown: name
  anyone ≥10%, always name the top 5 regardless of size, keep naming in descending order until
  cumulative coverage hits 85% (capped at 15 names), collapse the rest into "Others". A flat 10%
  cutoff alone prints one name for a near-monopoly layer and nothing for a fragmented one; the other
  two rules fix both ends. Don't reimplement share-list truncation elsewhere, call this.
  `node.others` can override the computed residual explicitly.
  Constants: `TD.COVERAGE_TARGET` (85), `TD.HARD_FLOOR` (10), `TD.MIN_NAMED` (5), `TD.MAX_NAMED` (15).
  See README "The house rules" for the rationale.
- **`TD.hhi(node)` / `TD.concentration(hhi, coverage)`**: Herfindahl-Hirschman Index over the
  *named* shares only (residual "Others" is treated as many small firms, which understates
  concentration: the conservative direction), then bucketed into monopoly / highly concentrated /
  moderate / competitive / fragmented bands.
- **`TD.coverage(node)` / `TD.isProvisional(node)` / `TD.MIN_COVERAGE`**: how much of the market
  the named players actually account for. Treating "Others" as many small firms is conservative
  for concentration and *anti*-conservative for fragmentation: a layer with three named suppliers
  covering 12% scores HHI 50 and tops any "most fragmented" ranking because it is unresearched,
  not because it is fragmented. Anything that ranks *by low HHI* must filter on
  `TD.isProvisional`: the Findings fragmentation table does, and says how many layers it held
  back. Pass `coverage` to `TD.concentration` and a thin band comes back flagged `provisional`
  with a hint that says so.
- **`TD.geoMix(node)` / `TD.colorOf(company)`**: supply-chain geography, driven by each company's
  `hq` field in `data/companies.js` (`TD.GEO` table of region → label/color).

### Rendering (`js/iso.js`, `js/schematic.js`, `js/panel.js`, `js/app.js`)

- `js/app.js`: routing (hash-based, `#/deviceId/nodeId`), the browse menu, search wiring, the
  device view, and the site-wide findings tables. This is the entry point loaded last.
- `js/schematic.js`: the flat SVG board/chain renderer. Universal fallback: every device works
  here even with no 3D model.
- `js/iso.js` (~400 lines, no dependencies): the axonometric 3D renderer used when a device has a
  matching `data/models/*.js` entry. Three non-obvious things if you touch it:
  - **Projection**: screen y is negated on both terms, since SVG y grows downward and both
    "further back" and "higher up" need to move up the page.
  - **Depth sorting**: sorting by centroid distance is wrong (a near battery can visually paint over
    a small part above it). Solids are axis-aligned boxes, so it uses the separating axis test,
    resolved into a draw order via topological sort.
  - **Cycles**: painter's algorithm can hit unsatisfiable ordering loops. Two guards keep it at zero
    cycles: only screen-overlapping pairs get an ordering constraint at all, and the separating axis
    is picked by cross-section overlap so diagonal neighbours touching only at an edge impose
    nothing. `TD._dbg` after a render reports node/edge counts and any cycles still broken.
- `js/panel.js`: the inspector panel (component detail) and company-centric views.
- `js/overview.js`: the per-device charts shown above the fold (concentration, cost stack,
  supply geography, metric tiles). Derives everything from the device's own nodes; where a device
  hasn't been researched to a given depth the chart says so and draws a hatched bar rather than
  filling in.
- `js/tour.js`: the opt-in guided walkthrough of the laptop, launched from the `Run tour` button
  in the topbar. It drives the **real** UI (clicks the real Dismantle button, sets the real
  sliders, navigates real routes) rather than describing it, so it cannot drift out of date,
  a step whose anchor selector no longer resolves is skipped at runtime and failed by
  `tools/tourcheck.py`. Two rules if you touch it: **it must never auto-start** (`interact.py`
  drives the same page with 221 assertions and an uninvited overlay breaks all of them), and
  exiting must restore the laptop to its top level. Anchor a step at the smallest element that
  makes the point: a target taller than the viewport leaves the caption nowhere to sit that
  isn't on top of it.
- `js/story.js`: the long-form flagship analysis rendered below the teardown, for any device
  whose data file carries a `story` block (ten of the fifteen devices). A device without one
  never reaches this code and renders exactly as before, which is what keeps the flagship
  treatment scoped. `story.stages` must partition the node list exactly,
  `tools/storycheck.py` gates every device with a story block and fails on a missed, duplicated
  or unknown id. Editorial lines the renderer can't derive (`tierNote`, `geoLede`) come from the
  story block, not from hardcoded device names.
  Several sections and cards have **minimum-data gates** and return `''` rather than drawing on
  thin data: the deal timeline needs ≥4 deals device-wide, the cost-against-concentration scatter
  needs ≥4 *root* nodes carrying both `bomPct` and a share table, the cost-weighted geography
  strip needs ≥2. A device can pass every gate in `tools/` and still render a thin story, so
  after adding a story block check what actually rendered; see HANDOVER §8.

Devices without a `data/models/*.js` entry silently fall back to the schematic renderer: this is
intentional, so 3D can be rolled out device by device. A model keyed `deviceId/nodeId` gives a
component its own exploded view on double-click (the laptop mainboard and display assembly, the
smartphone logic board and camera).

### Data files

- `data/sections.js`, catalogue sections (drives the browse menu / overview page).
- `data/companies.js`: company registry: home country (`hq`, keyed into `TD.GEO`), listed/private,
  ticker. Any company referenced in a device's `shares` must exist here or the console warns on load.
- `data/sources.js`: publisher registry: `publisher → {url, type, note}`. A device's `sources`
  array stays a list of short strings; `TD.sourceMeta()` resolves each against this table, so a
  citation added anywhere inherits a URL, a document type and a statement of what is really being
  cited. Add a publisher here before citing it, or it renders without provenance.
- `data/devices/*.js`: one file per teardown, registered via `TD.device(...)`.
- `data/models/*.js`, optional 3D geometry for a device (or `deviceId/nodeId` for a component's own
  exploded view), registered via `TD.model(...)`.

Adding a device: create `data/devices/yourthing.js`, add a `<script>` tag in `index.html` above
`js/app.js`, and list its id in the relevant section's `devices` array in `data/sections.js`. See the
README for the full node schema (`shape`, `layout: 'board'|'chain'`, `kind: 'meta'`, `upstream`,
`chokepoint`, `confidence`, etc.), it's documented there in more depth than is worth duplicating here.

### Provenance rendering

Every citation on the site renders through **`TD.sourceLink()`** in `core.js`.
There are five places that show one (inspector drawer, chart footers, the story
method section, the `#/sources` page, the Method page) and they had already
drifted once, so do not hand-roll a sixth. A publisher with no URL renders
marked and explained on hover, never as plain text and never as a dead link.

`#/sources` counts itself from the live data. It is not a maintained list, so
adding a publisher to `data/sources.js` and citing it is all that is needed.

When checking links: **403 and 405 mean bot-blocked, not broken.** About
fifteen publishers refuse scripted requests and load fine in a browser. Only
400, 404 and 410 are real failures.

### The tour has two states, and both are real

`js/tour.js` renders its card expanded and collapsed (the Explore bar). A
control positioned for one can land on top of a control in the other: the
close icon is absolutely positioned in the corner of the expanded card, and in
the collapsed bar that corner is where the Next button lives. It shipped
overlapping.

`tourcheck.py` now asserts **no two controls overlap in either state**, and
the assertion was verified by reintroducing the bug and watching it fail. If
you add or move anything in the tour card, check both states, or trust the
gate to check them for you.

### Writing rules

**No em dashes. Anywhere, ever.** Not in device prose, not in UI strings, not
in code comments, not in these docs. The project was purged of all 1,038 of them
and the count must stay at zero. Use the punctuation the dash was standing in for:
a comma for an aside, brackets when the aside already contains commas, a colon
when what follows restates or explains what precedes, a semicolon when it is a
separate instruction. Verify with:

The check writes the character as an escape rather than a literal, so that the
rule's own documentation does not violate it:

```bash
python -c "import glob,io; \
print(sum(io.open(f,encoding='utf-8').read().count(chr(8212)) \
for f in glob.glob('**/*.*',recursive=True) \
if f.split('.')[-1] in ('js','html','css','py','md') and 'dist' not in f))"
```

It must print `0`.

### House rules for data content (not just code)

These apply when editing or adding market-share data, not just when touching the renderer:

- **Basis before number.** Every market figure states what it measures (units vs. revenue), which
  year, and which market definition: a share without its basis is how people mislead themselves.
- **Confidence is mandatory per component.** `high` (well covered by trackers/filings), `medium`
  (contested market definition or disagreeing sources), `low` (reasoned estimate, treat as order of
  magnitude only).
- **Say which grade of source it is.** `primary` (the company or a regulator speaking directly),
  `third-party` (a tracker or trade body compiling it), `derived` (nobody published this share, it
  is reconciled from disclosures that were never meant to add up to a market). A layer resting only
  on `derived` sources cannot be graded above `low` confidence, and `tools/datacheck.py` enforces it.
- **A gap is a finding, not a hole to fill.** Where no source supports a number, say so in the data
  rather than estimating: omit the field, leave `shares` empty with a note naming the suppliers, or
  carry the remainder as one explicit node. The laptop's `unpriced` root is the worked example, 16%
  of the bill of materials that nobody publishes a split for, stated as one honest line instead of
  five invented ones.
