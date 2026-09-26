# HANDOVER: Teardown

**This document is the source of truth for the project's direction and state.**
It is written for a fresh Claude Code window with no prior context. Read it first.

**Rule: this file must be updated at the end of every working session**, before
replying to the user. If you changed code, data, or direction, it goes here.

Last updated: 2026-08-30 (second session)

---

## 1. The vision

Teardown is an interactive map of technology supply chains. You pick a device,
take it apart, and every component opens into the companies that actually supply
it: market shares, how concentrated that layer is, and the deals that produced
the structure.

**The long-term goal: get every kind of technology onto this site.**

Not all at once. One device after another, each done properly before starting
the next. Breadth is the destination; depth per device is the method. A device
that is added badly is worse than a device that is not added at all, because the
entire credibility of the site rests on the data being honest about its own
limits.

The catalogue is deliberately structured to show that ambition: `data/sections.js`
already lists nine sections with `planned` placeholders for devices that do not
exist yet, so the shape of the eventual site is visible before it is built.

### What the site is actually arguing

Four claims, and the code is built to support them:

1. **Power increases with depth.** The surface of any device looks competitive.
   Go three or four layers down and you find a handful of firms, then sometimes
   one.
2. **The visible brand is not where the value is.** The badge captures the
   customer and little of the margin.
3. **Structure is geopolitical.** Every share bar is coloured by the supplier's
   home country, so the geography reads without anyone asserting it.
4. **Most published share data is quoted without the basis needed to check it.**
   The site's rules about basis, confidence and source grade are as much the
   point as the numbers.

### What it is NOT

It is **not** a deal-origination tool, despite the README having said so for a
long time. There is no revenue, ownership, sponsor, headcount or contact data
anywhere, so you cannot build a target list from it. It is a **market map and an
argument**. If asked to describe it, describe it that way. (Audited 2026-08-22,
see §6.)

---

## 2. How the thing is built

Plain HTML/CSS/classic JS. **No build step, no bundler, no package manager, no
framework.** Data loads as `<script>` tags rather than `fetch` specifically so
that opening `index.html` from the filesystem works with zero server.

One real dependency: **three.js r147**, vendored into `js/vendor/`. It is
deliberately the last release with a non-module `<script src>` build, because ES
modules would reintroduce the `file://` restriction the whole design avoids. Do
not upgrade it past r147 or run it through a bundler. See `js/vendor/NOTICE.md`.

```
python build.py     -> dist/teardown.html (single self-contained file, ~1.5 MB)
```

### Core model

`TD` (on `window`) is the global registry, defined in `js/core.js`. Two calls
populate everything:

- `TD.section(list)`, catalogue sections (`data/sections.js`)
- `TD.device(def)`: one teardown (`data/devices/*.js`)

Registering a device builds the parent/child tree from a flat `nodes` array,
indexes every node as `deviceId/nodeId`, and indexes every company. Navigation,
search, company pages and the site-wide Findings tables all derive from those
two calls. **Adding a device is data-only** plus one `<script>` tag in
`index.html` and an id in `data/sections.js`.

### Rendering, three tiers, degrading cleanly

1. `js/three-view.js`: three.js scene when WebGL is available (orbit, zoom,
   isolate, X-ray, presets)
2. `js/iso.js`: dependency-free axonometric SVG renderer, the permanent fallback
3. `js/schematic.js`: flat SVG board/chain, works for every device even with no
   3D model at all

A model keyed `deviceId/nodeId` gives a component its own exploded view on
double-click.

### The other JS

- `js/app.js`: routing (hash-based), browse menu, device view, Findings, Method
- `js/panel.js`, inspector and company views
- `js/overview.js`, per-device charts above the fold
- `js/story.js`: the long-form "flagship" analysis, for any device carrying a
  `story` block

### Data files

- `data/sections.js`, catalogue sections and the planned roadmap
- `data/companies.js`: company registry: `hq` (drives bar colour), listed/private, ticker
- `data/sources.js`: **publisher registry**: URL, document type, what is really
  being cited. A source string in a device file is a *key* into this table.
  **Register a publisher here before citing it**, or it renders with no provenance
  and fails `tools/datacheck.py`.
- `data/devices/*.js`: one file per teardown
- `data/models/*.js`, optional 3D geometry

---

## 3. The house rules (these are load-bearing, not decoration)

- **Basis before number.** Every figure states what it measures (units vs
  revenue), which year, which market definition.
- **Confidence per component**: `high` / `medium` / `low`.
- **Source grade**: `primary` (company or regulator directly), `third-party`
  (a tracker compiling it), `derived` (nobody published this; it is reconciled
  from disclosures never meant to add up to a market). **A layer resting only on
  `derived` sources cannot be graded above `low`**, `datacheck.py` enforces it.
- **A gap is a finding, not a hole to fill.** Where no source supports a number,
  say so: omit the field, leave `shares` empty with a note naming the suppliers,
  or carry the remainder as one explicit node. Worked examples: the laptop's
  `unpriced` and the smartphone's `unmapped-m`.
- **Naming rule** (`TD.rankShares`): name anyone ≥10%, always name the top 5,
  keep naming until cumulative coverage hits 85%, cap at 15, collapse the rest
  into "Others". Never reimplement share truncation elsewhere, call this.
- **Coverage guard** (`TD.coverage` / `TD.isProvisional` / `TD.MIN_COVERAGE`=60).
  HHI is computed over named shares only, which is conservative when asking how
  *concentrated* a layer is and anti-conservative when asking how *fragmented*
  it is. A layer with three suppliers covering 12% scores HHI 50 and would top
  any "most fragmented" list because it is unresearched. **Anything ranking by
  low HHI must filter on `TD.isProvisional`.**

---

## 4. The verification harness (`tools/`)

There is no lint and no unit test. These Playwright scripts driving headless
Chromium over `file://` are the only safety net.

```bash
python tools/run_all.py            # everything, EVERY device (~35 min)
python tools/run_all.py fast       # skips contrast + visible
python tools/run_all.py quick      # one datacheck not 15 -- never for CI
python tools/datacheck.py index.html <device>    # per device
python tools/storycheck.py index.html            # every device with a story block
python tools/shots.py index.html shots <device>  # screenshots, one device
```

| Script | Asserts |
|---|---|
| `interact.py` | The site works when clicked: every device, 3D controls, inspector, search, theme |
| `schematic.py` | No schematic label overruns, collides, or is painted over |
| `storycheck.py` | Story stages partition the node list exactly; flow ids resolve; cards carry source footers |
| `datacheck.py` | Provenance, BOM accounting, confidence-vs-source-grade, hygiene |
| `contrast.py` | WCAG AA over every visible text/background pair, both themes |
| `visible.py` | No 3D part disappears into the ground, either theme |
| `fixturecheck.py` | **Guards the other gates**: fails if any names a device, route or fixture property that no longer exists |
| `shots.py` | Not a gate: screenshots for eyeballing; view list generated, not hand-written |

**Traps already paid for** (documented in `tools/README.md`, do not rediscover):
`readPixels` on a WebGL canvas returns the clear colour; element screenshots of
a canvas come back blank; never sample the board background from a corner;
`page.click()` lands under the sticky topbar (use `tap()`); repeated `page.goto`
exhausts WebGL contexts (navigate by hash).

---

## 5. Current state of the catalogue


| Device | Section | View | Depth | `datacheck` |
|---|---|---|---|---|
| **Martech stack** | Software and services | schematic (by design) | flagship, 53 layers, 5 tiers | 439/439 ✅ |
| **Tractor** | Agriculture technology | 3D + 1 sub-model | flagship, 51 layers, 5 tiers | 427/427 ✅ |
| **Combustion car** | Mobility | 3D + 2 sub-models | flagship, 51 layers, 5 tiers | 415/415 ✅ |
| **Laptop** | Consumer computing | 3D + 2 sub-models | flagship, 48 layers, 5 tiers | 371/371 ✅ |
| **Smartphone** | Consumer computing | 3D + 2 sub-models | flagship, 48 layers, 5 tiers | 431/431 ✅ |
| **Submarine cable** | Data centre and AI | 3D + 2 sub-models | flagship, 48 layers, 5 tiers | 391/391 ✅ |
| **Wind turbine** | Industrial and energy | 3D + 2 sub-models | flagship, 47 layers, 5 tiers | 391/391 ✅ |
| **Electric vehicle** | Mobility | 3D + 2 sub-models | flagship, 46 layers, 5 tiers | 431/431 ✅ |
| **AI server rack** | Data centre and AI | 3D + 2 sub-models | flagship, 45 layers, 5 tiers | 447/447 ✅ |
| **Microwave oven** | Home and appliances | 3D + 2 sub-models | flagship, 41 layers, 5 tiers | 335/335 ✅ |
| Tablet | Consumer computing | 3D | 16 nodes | 43/47 ❌ |
| Games console | Consumer computing | 3D | 13 nodes | 38/42 ❌ |
| Smart TV | Consumer computing | 3D | 12 nodes | 32/37 ❌ |
| Washing machine | Home and appliances | 3D | 12 nodes | 20/22 ❌ |
| Aircraft | Aerospace and defence | 3D | 11 nodes | 27/32 ❌ |

15 devices, 542 components, 772 companies, 99 registered publishers, 9 sections,
31 registered 3D models.

**Ten devices carry the "flagship" treatment**: a `story` block in the data
file, which switches on the long-form analysis below the teardown (build stages,
cost stack, concentration by tier, chokepoints, geography, deals, provenance).
Adding a `story` block to any device turns it on and `storycheck.py` starts
gating it automatically.

**The martech stack has no 3D model and should not get one.** Software has no
physical form; the schematic board is the correct renderer for it, not a
degraded fallback. It is the only flagship in that position and the only one
where all eight story sections render without any 3D at all, which is a
useful proof that the flagship treatment does not depend on the 3D pipeline.

**Their deep chains deliberately do not overlap. Keep it that way**: this is
the single most important editorial rule on the site. A fourth flagship that
re-walks silicon would add nothing.

- Laptop → Mainboard → Processor → Foundry → Lithography → EUV optics → **Zeiss, 100%**
  *(one company)*
- Smartphone → Display → OLED panel → Deposition equipment → Fine metal mask →
  **Invar foil** *(two firms)*
- Tractor → Engine → Aftertreatment → Catalyst → PGM refining → **PGM mining**
  *(one orebody: ~70% of world platinum from the Bushveld Complex)*, and
  separately Guidance → GNSS → Correction network → **Satellite constellation**
  *(four governments, no supplier, no price)*
- Submarine cable → Repeaters → EDFA → Erbium-doped fibre → Erbium oxide →
  **Rare earth separation** *(China ~87%: a chemical process, not a mine)*,
  with the binding constraint sitting sideways in **cable ships**
  *(fewer than 60 vessels worldwide)*
- Combustion car → Body → Castings → Aluminium → Magnesium →
  **Magnesium smelting** *(China ~87–90%: an alloying additive that is in no
  bill of materials)*, with the operational constraint sideways again in
  **wiring harness labour**

- Microwave oven → Magnetron → Cathode → Tungsten wire → APT →
  **Tungsten mining** *(China ~83%, and China at literally every tier above it
  too)*

- AI server rack → Rack power → Facility power → Grid connection → Generation →
  **Gas turbines** *(three firms, order books past 2030, and the layer above
  it, the interconnection queue, has no supplier at all)*

- Electric vehicle → Battery → Cathode → Cobalt refining → **Cobalt mining**
  *(DRC ~75% of world supply, no domestic refining capacity at all)*

Eight terminuses, eight different kinds of thing: a company, a material, an
orebody plus a government, a chemical process plus a fleet, an alloying
additive plus a labour geography, a critical mineral under live export control,
**a queue**, and an extraction geography with a labour-rights problem at the
bottom of it.

- **Wind turbine** → Blade → Shell → Sandwich core → Balsa → **Ecuadorian
  plantations** *(~95% of world commercial balsa from one country, with a
  four-to-six year biological lead time)*, and uniquely, **a terminus that
  got solved**: PET foam displaced balsa across most of the shell after the
  2019–21 shortage, so the dependency is materially smaller than it was.
  Nothing else in this catalogue can show a chokepoint being dismantled.

- **Martech stack** → Programmatic → Identity → The browser → **Rendering
  engines** *(three left; Blink ~79% is Google's, WebKit is Apple's, and
  Gecko's owner takes ~75% of its revenue from Google search royalties)*,
  the only chain here that descends into the **counterparty** rather than
  into a supplier.

Ten terminuses, ten different kinds of thing. That spread is the point; see
§8 before starting an eleventh.

**Two deliberate non-overlaps, both load-bearing.** The wind turbine's magnet
chain stops at sintered NdFeB manufacturing and cross-references the submarine
cable rather than re-walking rare earth separation; and it does not model grid
connection at all, because the interconnection queue belongs to the AI server
rack. Both restraints are stated in the wind turbine's file header. If a future
device needs rare earths or grid, read those first.

### The five remaining failing devices

Discovered 2026-08-23, and reduced from ten to five since: the martech stack
and the wind turbine were both raised to flagship on 2026-09-04 and now pass.
**This is pre-existing, not new breakage**: the harness defaults to the
laptop, so nobody had ever run it against the rest. Failures cluster into three
kinds:

1. **Unregistered sources**: cited but absent from `data/sources.js`, so they
   render with no provenance. Most of the original list is now registered (99
   publishers). What remains is scattered across the five thin devices.
2. **BOM percentages that do not sum to 100**: washing machine 19, aircraft 27,
   console 49, tablet 63, smart TV 68. None of the five carries an `unpriced`
   node to hold the remainder, which is the fix the flagships all use.
3. **Confidence graded above what the sources support**: `console-foundry`,
   `tv-brand`, `tablet-brand` and `fuselage` are marked `medium`/`high` while
   resting only on `derived` sources.

Plus ~33 components citing no source at all.

**Open decision for the user:** either bring these five up to standard, or relax
the BOM gate for devices that never claimed to be fully costed. The site now
breaks its own published rules on five of fifteen teardowns rather than ten of
twelve, and the fix pattern is proven twice over; see the 2026-09-04 entry.

---

## 6. Audit findings (2026-08-23)

Ranked. Items marked ✅ are fixed; the rest are open.

1. ✅ **Memory leak**, every navigation leaked a `window` resize listener and an
   IntersectionObserver (measured: 12 live after 6 cycles, unbounded).
   `TD.disposeStory` ran on a freshly-created element and had therefore never
   disposed anything. Fixed 2026-08-23; see §7.
2. ✅ **The registry validated nothing.** `TD.device()` silently accepted a
   typo'd `parent` (node promoted to root), duplicate node ids, and shares
   summing to 130%. Fixed 2026-08-23 by adding `TD.validate()`; see §7.
3. 🟡 **"Root part" defined nine times.** *Half fixed 2026-08-23:* the wrong
   ninth definition (`def.roots`, which omitted the meta exclusion and was read
   by nothing) is deleted, and `TD.rootParts(dev)` now exists in `core.js` as
   the single definition. **Still open:** the seven inline copies have not been
   pointed at it yet: `app.js:500`, `overview.js:20`, `schematic.js:168`,
   `story.js` ×4, nor has `datacheck.py:52`. Low risk, do it when next in
   those files.
4. ⬜ **Duplicated implementations.** `costChart` in `overview.js:182` and
   `story.js:289` are near-identical. `el()` is duplicated in `iso.js:20` and
   `schematic.js:28`. `measured()` exists in both with *different signatures*.
5. ⬜ **The three renderers do not share a contract.** `renderThree`/`renderIso`
   take a model key string; `renderBoard` takes a node object. three/iso
   callbacks take ids, schematic takes node objects. The caller must manually
   rescue `.orbithint` around `renderIso`. `app.js:929` reaches into the
   renderer's private `board.__td3`.
6. ⬜ **Layering inversion.** `TD.models` / `TD.model()` / `TD.hasModel()` are
   defined in `js/iso.js` (the *fallback*) but consumed by `three-view.js`,
   `app.js` and `overview.js`. They belong in `core.js`. (Registration order is
   *not* fragile, `TD.model()` is a plain dict assignment.)
7. ⬜ **Dead code.** `TD.descendants`, `TD.hasStory`, `TD.sourceWarnings`,
   `def.roots`: all defined or assigned, never read. `TD` carries 66 members
   mixing public API with internals (`_dbg`, `_webglOK`, `storyAudit`).

### Explicitly NOT problems, do not "fix" these

- **Recomputation.** The Findings page calls `rankShares` 4,106 times for 179
  share-bearing nodes (23× recompute). A full 240-node HHI sweep costs
  **0.39 ms**. Memoising this is over-engineering. Leave it.
- **`innerHTML` + rebind.** Old listeners die with the replaced nodes. Fine.
- **Escaping.** Disciplined; `schematic.js` uses `createElementNS`/`textContent`.
- **CSS.** 85 design tokens, 69 sectioned blocks, 449 selectors, 2 `!important`.
- **Theme system.** One `data-theme` attribute as source of truth plus a
  subscription for things that bake colour at draw time. Well designed.

---

## 7. Session log

### 2026-08-22: Smartphone raised to flagship
- Rebuilt `data/devices/smartphone.js`: 27 → 48 nodes, 3 → 5 tiers, with a
  `story` block (11 stages, 3 findings, flow diagram).
- Web-researched with real citations; added 8 publishers to `data/sources.js`
  and ~30 companies to `data/companies.js`.
- Corrections the research forced: **Apple led FY2025, not Samsung**; Sony is
  **>60%** of image sensor revenue (was 45%); **Qualcomm** leads RF front-end
  (was Broadcom); the **Skyworks/Qorvo $22bn merger** actually happened (file
  described it as speculation); the memory price shock (DRAM +45–50% QoQ in
  4Q25) is now the device's central supply story; China passed Korea in OLED
  panel shipments in 2025.
- Root `bomPct` had summed to **103** (silently failing a gate nobody ran). Now
  exactly 100, with an explicit `unmapped-m` residual node.
- New `data/models/smartphone3d.js`: rebuilt phone (shell rails, camera bump
  through the back, dark glass front, lateral fan-out on explode) plus two
  sub-models, `smartphone/board-m` and `smartphone/camera-m`. Moved out of
  `laptop3d.js`, where it had been hiding.
- Engine: added `TD.coverage`/`TD.isProvisional`/`TD.MIN_COVERAGE`; Findings
  fragmentation table now gated and reports how many layers it held back
  (currently **29**). Made `js/story.js` device-generic (`tierNote`, `geoLede`
  now come from the data). Parameterised `tools/storycheck.py` to gate every
  story device, and fixed a latent bug there, it read `l.nodes` while the data
  uses `l.steps`, so the flow assertion had been checking nothing.

### 2026-08-23: Audit, leak fix, load-time validation, tractor
- Full architecture audit (§6), with measurements rather than assertions.
- Ran `datacheck.py` across all 12 devices for the first time: **only 2 passed**
  (§5). Pre-existing; the harness had always defaulted to the laptop.
- Created this handover document.

**Memory leak fixed.** `render()` in `js/app.js` now disposes the *outgoing*
story before `parseRoute()` and before any view writes to `$app.innerHTML`. The
old call site sat inside `viewDevice()` *after* the DOM had already been
replaced, so it was always disposing a freshly created element and had never
released anything. Verified with the same instrumented measurement that found
it: was 2/4/6/8/10/12 live listeners over six navigation cycles, now **flat 0**.

**Load-time validation added.** `TD.validate([dev])` in `js/core.js` returns
structural defects; `TD.reportValidation()` groups them by device and warns
once at boot. It replaces the two ad-hoc loops that used to sit in `app.js`'s
DOMContentLoaded handler. Catches: duplicate node ids, `parent` ids that do not
resolve, shares summing over 100.5%, negative or non-numeric shares, share
entries naming no company, companies missing from the registry, negative
`others`, and models referencing nodes or devices that do not exist. Verified
against a probe device with 6 broken nodes + 1 bad model reference, **7/7
caught**, and the **real corpus reports 0**.

Scope is deliberately structural only. Whether confidence is justified by
sources, or whether `bomPct` sums to 100, stays in `datacheck.py`: putting
editorial policy here would print a wall of warnings on every page load for the
ten unfinished devices, and a warning everyone scrolls past is worse than none.

**`TD.rootParts(dev)` added** and the incorrect `def.roots` deleted (see §6.3).

**Tractor, first device raised since the smartphone.**
- `data/models/tractor3d.js` is new: the site's first *vehicle* model. It is
  also the first model to use two primitives `three-view.js` has always
  supported but nothing had exercised, `shape:'cyl'` with `axis:'x'` for real
  wheels, and `shape:'wedge'` for the tapering hood and the raked cab. Modelled
  as boxes it read as a filing cabinet on blocks; those two shapes are what
  make it a machine. `js/iso.js` degrades both to bounding boxes, which is fine.
- Deliberate modelling choices worth keeping: the **hood belongs to
  `chassis-t`, not `engine`**, so pulling the chassis apart lifts the hood and
  exposes the engine: the thing a person actually wants to happen. The
  **implement is modelled in a different colour and thrown clear** on explode,
  because it is a separate machine bought separately, which is also why it
  carries no `bomPct`.
- Also added `TD.model('tractor/precision')`: a sub-model for the guidance
  stack. Thin at two children today; it exists because guidance is the layer
  this teardown argues is the most valuable part of the machine, and dropping
  to a two-rectangle schematic undercut that.
- **Data fixes: tractor went 83/104 → 112/112.** Registered 8 previously
  unregistered publishers in `data/sources.js` (Power Systems Research,
  Off-Highway Research, Verdant Partners, AgFunder, Tire Business, Farm
  Equipment, Farm Equipment Dealer rankings, Tractor and Mechanization
  Association). Removed `bomPct: 0` from `implements`, a stated zero reads as
  "this part is free" rather than "this is not part of the tractor". Added an
  `unpriced-t` residual node carrying the missing 9% so the cost stack sums to
  100 honestly. Downgraded `gnss` from `medium` to `low`: every name in that
  table reports positioning inside a wider segment and none discloses a share,
  which is derived-only, and the house rule caps that at low.

**Gates after this session**, all green:
`datacheck` tractor 112/112, laptop 371/371, smartphone 431/431 ·
`storycheck` 45/45 · `interact` 203/203 on both `index.html` and `dist/` ·
`schematic` 6955/6955 · `visible` 196/196 both themes (up from 178, the
tractor added 18 part/theme combinations) · `contrast` 1018/1018 both themes ·
`build.py` rebuilt (1540 KB).

---

### 2026-08-23 (continued): Tractor raised to third flagship

Same session, after the leak/validation work above.

- **`data/devices/tractor.js` rebuilt: 15 → 51 nodes, 3 → 5 tiers**, with a
  full `story` block (11 stages, 3 findings, 4-lane flow diagram, `tierNote`
  and `geoLede`). `datacheck` 112/112 → **427/427**; `storycheck` **23/23** for
  the tractor alone, 67/67 across all three flagships.
- **The two chains that make it a flagship**, both researched from primary and
  trade sources this session:
  - *Emissions*: aftertreatment → catalyst → PGM refining → PGM mining. USGS
    and Johnson Matthey put ~70% of world platinum and most rhodium in the
    South African Bushveld Complex, with Nornickel in Russia the main
    palladium source. Tier 5, and the reason emissions regulation quietly
    wired every diesel machine on earth to one orebody.
  - *Positioning*: precision → GNSS → RTK correction network → satellite
    constellation. The terminus has no supplier, no price and no contract,
    "share" can only mean satellites in service (BeiDou 34%, GPS 24%,
    Galileo 22%, GLONASS 18%). The most defensible position in the machine
    rests on infrastructure none of the industry owns.
- **New layers added**: `electrical-t` (7% of BOM, split out of the unpriced
  residual), `finance-t` (captive equipment finance: Deere Financial et al.,
  a meta layer), plus children across engine, transmission, hydraulics,
  precision, electrical, tyres, cab, chassis and implements.
- **`TD.GEO` gained `ZA` (South Africa)** in `js/core.js`. Folding it into
  "rest of world" hid the most concentrated geography in the mechanical half of
  the catalogue, and PGMs recur in the EV and aircraft chains. Contrast gates
  pass in both themes with the new colour.
- **~45 companies and 14 publishers registered.** New source entries: USGS
  Mineral Commodity Summaries, Johnson Matthey PGM Market Report, ANRPC,
  GPS World, EUSPA GNSS Market Report, Constellation operator disclosures, plus
  the eight agriculture publishers registered earlier in the session.
- **Country aggregates** added for natural rubber (Thailand 36%, Indonesia,
  Côte d'Ivoire, Vietnam, India) and for the four constellation operators.
  Natural rubber is produced by millions of smallholdings: there is no company
  to name, so the honest unit is the country.
- `data/models/tractor3d.js` gained an `electrical-t` part (controller stack,
  battery box, harness runs along both frame rails).

**Known analytical tension, left deliberately visible:** PGM mining scores
HHI 1,411 and bands as *"Competitive"*, because five companies split it, while
the *geographic* concentration is extreme. Company-HHI and country
concentration genuinely disagree here. The node's own note says so, and the
`chokepoint` flag is hand-set for exactly this reason (the Method page already
states chokepoints are flagged by hand, not by formula). **Do not "fix" this by
fudging the shares.** If anything, the site eventually wants a country-level
concentration measure alongside HHI.

**Gates after this session**, all green:
`datacheck` tractor 427/427, laptop 371/371, smartphone 431/431 ·
`storycheck` 67/67 · `interact` 203/203 on both builds · `schematic` 9042/9042 ·
`visible` 198/198 both themes · `contrast` 1016/1016 both themes ·
`dist/teardown.html` rebuilt (1599 KB) and verified.

---

### 2026-08-26: Submarine cable added as fourth flagship

New device, built from scratch to flagship depth in one session.

- **`data/devices/subsea-cable.js`**: 48 nodes, 5 tiers, full `story` block
  (10 stages, 3 findings, 4-lane flow). `datacheck` **391/391**, `storycheck`
  **23/23** for the device, 89/89 across all four flagships. Both passed first
  run. Added to the Data centre and AI section; removed from that section's
  `planned` list.
- **How this device breaks the site's model, deliberately.** A cable is a
  *project*, not a product: nobody sells one off a shelf. So `bomPct` is share
  of project cost, and **roughly a third of it buys no hardware at all**: it
  buys ship time. That is not a distortion of the model, it is the finding, and
  it is stated in the device file's header comment. If a future device is also
  a project rather than a product (a data centre, a grid interconnector), this
  is the precedent.
- **The two chains:**
  - *Amplification*: repeaters → EDFA → erbium-doped fibre → erbium oxide →
    rare earth separation (China ~87%). Note the contrast with the tractor,
    which bottoms out in a **mine**; this bottoms out in a **chemical
    process**, and the process is the harder thing to replicate.
  - *Installation*: the real constraint, and it is not a supplier at all.
    Fewer than 60 cable vessels exist worldwide, most converted from other
    trades, ~65% of the maintenance fleet reaching end of life within 15 years,
    ~USD 3bn to replace, USD 140–150m and 26 months per hull, and almost
    nobody ordering.
- **Research highlights** (TeleGeography, ICPC, SubmarineNetworks.com):
  hyperscalers went from ~10% of used international capacity in 2014 to ~75% in
  2025 and now own ~90% of transatlantic capacity; ~200 faults a year, flat for
  a decade, **86% from fishing gear and anchors**; ICPC states there have been
  no verified state-sponsored sabotage incidents since WWII, which contradicts
  most press coverage and is stated plainly in the `maintenance` node; 206
  repairs in 2023 across 136 jurisdictions, longest 947 days.
- **Ownership is the geopolitics**: SubCom is Cerberus-held (USD 2.3bn
  single-asset continuation vehicle, 2025), **ASN was bought outright by the
  French State** (EUR 350m, completed 31 Dec 2024), NEC is Japanese, HMN Tech is
  Chinese and excluded from most Western systems. Two governments and a private
  equity firm sit behind world cable supply.
- **`data/models/subseacable3d.js`**: a *scene* rather than a machine, ship,
  cable, inline repeater, shore station, plus two sub-models. The cable
  cross-section uses a **stepped concentric cutaway** (each inner layer starts
  further toward the camera) so all six materials read without exploding
  anything. First pass stepped them *away* from the default camera and rendered
  as a flat black disc; the fix is noted in the file. Relative scale is
  deliberately wrong (a real cable is 17 mm against a 140 m ship) and that is
  documented in the header.
- **Engine fix**: found and removed the last laptop-specific strings in
  `js/story.js`: the market-size chart said "not notebook-only" on every
  device. Now derives from `dev.name`. Comments updated too.

**Gates after this session**, all green:
`datacheck` subsea-cable 391/391, tractor 427/427, laptop 371/371,
smartphone 431/431 · `storycheck` 89/89 · `interact` 209/209 both builds ·
`schematic` 10788/10788 · `visible` 212/212 both themes · `contrast` 1018/1018
both themes · `dist/teardown.html` rebuilt (1679 KB) and verified.

---

### 2026-08-27: Combustion car added as fifth flagship

New device. **Note the deliberate pairing:** the site already had an Electric
vehicle teardown, and this is the machine it is replacing. Read together they
are the clearest before-and-after on the site: the car names the ~2,000 moving
parts an electric drivetrain deletes, and several nodes say explicitly what
happens to that supplier when it goes. **The EV is the agreed next job** and
should be raised to flagship so the comparison is between two equals.

- **`data/devices/car.js`**: 51 nodes, 5 tiers, full `story` block (10 stages,
  3 findings, 4-lane flow). `datacheck` **415/415**, `storycheck` **23/23** for
  the device. Both passed first run. Added to the Mobility section ahead of the
  EV; removed "Combustion vehicle" from that section's `planned` list.
- **Terminus: magnesium.** Body → castings → aluminium → magnesium →
  smelting. Magnesium is an *alloying element* at roughly 5% of automotive
  aluminium: it is not a part, appears in no bill of materials, and China
  produces ~87–90% of it with Europe sourcing ~97% from there. Most of it comes
  from the Pidgeon process concentrated in Shaanxi, so supply moves with
  Chinese electricity policy rather than car demand, which is why the 2021
  shortage arrived with no warning from any automotive indicator. Sourced to
  USGS and European Aluminium.
- **Second finding: the wiring harness.** Seventeen plants in western Ukraine;
  their 2022 shutdown put 10–15% of European output at risk (~700,000 vehicles
  in H1) and idled VW, BMW, Mercedes and Porsche. A hand-taped bundle of wire
  worth tens of dollars, unautomatable and vehicle-specific. It is the site's
  cleanest statement that unit cost tells you nothing about fragility.
- **The PGM branch is deliberately shallow.** `pgm-c` gives the catalyst chain
  one node and cross-links to the tractor rather than re-deriving refining and
  mining, which the tractor already maps across three further tiers. **Do not
  deepen it**: two flagships sharing a terminus is the failure mode §8 exists
  to prevent. What the car adds from its side is scale: autocatalyst is the
  largest single use of PGMs on earth, so this is the demand that sets the
  price the tractor pays.
- **`data/models/car3d.js`**: a near-true-scale C-segment hatchback plus
  `car/engine-c` (block, pistons, fuel rail, turbo) and `car/electrical-c` (the
  harness laid out flat with everything it connects hanging off it, drawn that
  way because a harness is normally invisible and seeing it as one continuous
  branching object *is* the argument).
- **Modelling lessons, written into the file header**, because this model took
  nine passes, more than any other on the site: (1) a single full-length body
  box gives a flat deck and reads as a pickup: a car needs three height zones,
  low nose, raised waist, low tail; (2) the cabin must be markedly narrower in
  plan than the body below it or the two merge into one slab; (3) everything in
  the engine bay must finish below the bonnet line, which caught this twice;
  (4) a wheel arch is an *opening*, so the haunch must sit above the tyre,
  an early version ran the haunch outboard of the wheel and hid it completely;
  (5) the default camera elevation matters more than any geometry change, and
  a low camera is the cheapest single improvement available.

  **Known limit, do not sink more time into this without changing the
  renderer.** The primitive set (box, cylinder, rounded extrusion,
  linear-taper wedge) cannot produce continuous curvature along a length, and
  a car's entire visual appeal is continuous curvature. The model now reads as
  a stylised car: glossy paint, wheels in arches, stepped silhouette,
  fastback tail, and that is approximately the ceiling. Getting materially
  further needs a new primitive in `js/three-view.js`: a lofted profile swept
  along an axis with per-station widths. That would benefit the aircraft and
  the cable ship too, so it is worth doing *once* rather than fighting the
  car again.
- ~90 companies and 3 publishers registered (Automotive News Top Suppliers,
  S&P Global Mobility, European Aluminium).

**Gates after this session**, all green:
`datacheck` car 415/415, subsea-cable 391/391, tractor 427/427, laptop 371/371,
smartphone 431/431 · `storycheck` 111/111 · `interact` 215/215 both builds ·
`schematic` 13467/13467 · `visible` 230/230 both themes · `contrast` 1020/1020
both themes · `dist/teardown.html` rebuilt (1767 KB) and verified.

---

### 2026-08-27 (second session): Microwave oven added as sixth flagship

- **`data/devices/microwave.js`**: 41 nodes, 5 tiers, full `story` block
  (9 stages, 3 findings, 4-lane flow). `datacheck` **335/335**, `storycheck`
  **23/23**. Both passed first run. Added to Home and appliances ahead of the
  washing machine.
- **Why a $45 device earns flagship treatment.** It makes an argument none of
  the others do. Every previous teardown shows a chain of specialists getting
  narrower with depth. This one shows a chain that *collapsed*: the price fell
  by an order of magnitude, and the firms that survived did so by absorbing
  every tier of their own supply chain, so **Galanz and Midea appear at the
  brand layer, the assembly layer and the component layer simultaneously**, and
  then sell the magnetron to the competitors whose badges are on the front.
  Commoditisation was the consolidating force, not a fragmenting one.
- **The brand/builder pair is the device's centrepiece**, and works the same
  way the tractor's units-vs-revenue pair does. Galanz's *badge* share is about
  a fifth; its *manufacturing* share has been reported at roughly half. Midea
  builds for GE, Whirlpool, Toshiba, Sharp and Insignia, and owns Toshiba's
  appliance business. Both are headquartered in Shunde, Guangdong: the same
  city. Nobody publishes those two tables side by side, which is exactly why
  the category is misunderstood.
- **Terminus: tungsten.** Magnetron → cathode → tungsten wire → APT →
  tungsten mining. China ~83% of mine production, ~half of known reserves, and
  it placed selected tungsten items under export licensing in February 2025,
  APT roughly doubled across the year on the Rotterdam assessment. NATO listed
  tungsten as one of twelve defence-critical raw materials in December 2024.
  The APT node exists deliberately: ore is not what trades, the intermediate
  is, and that is where the control actually bites.
- **Two deliberate counterexamples in the data.** `cavity-steel` (flat steel,
  a vast liquid market: price risk, no supply risk) and `mag-magnets`
  (ferrite, *not* rare earth, because a magnetron has room for a big cheap
  magnet). Both exist to make the point that a magnet is not automatically a
  chokepoint and a large market is not automatically a safe one.
- **`mcu-fab` is deliberately shallow and cross-linked**, same treatment as the
  car's `pgm-c`: the tractor and car both map mature-node semiconductors
  properly and a third pass would repeat them.
- **Source honesty.** Appliance market data is the weakest source class on the
  site, published market sizes differ by ~25% between publishers for the same
  year. A new `Appliance trade press` registry entry says so explicitly, and
  every layer resting on it is graded low. The `brand-mw` note states the
  spread rather than picking a number.
- **`data/models/microwave3d.js`**: the model took *two* passes rather than the
  car's nine, because a microwave genuinely is a box with a door and a cylinder
  in it: the primitive set fits the subject instead of fighting it. Plus
  `microwave/magnetron` (copper anode with its resonant vanes, cathode on the
  axis, ferrite rings, ceramic seal) and `microwave/hv-supply`.
- **New technique worth reusing:** a top-level model may reference *any* node
  of the device, not only a root one. The door window (`door-screen`) and the
  display (`control-display`) are child nodes lifted into the main model so
  they get their own colour and are separately clickable. Without that the
  door was a featureless black slab.

**`TD.validate()` earned its place this session.** It caught three unregistered
companies (`Highly`, `JFE`, `Russia (all producers)`) that `datacheck.py` does
not look for: the Python gates check sources, accounting and confidence, but
company-registry integrity is a load-time check only. Corpus back to 0.

**Gates after this session**, all green:
`datacheck` microwave 335/335, car 415/415, subsea-cable 391/391,
tractor 427/427, laptop 371/371, smartphone 431/431 · `storycheck` 133/133 ·
`interact` 221/221 both builds · `schematic` 15791/15791 · `visible` 252/252
both themes · `contrast` 1020/1020 both themes · `dist/teardown.html` rebuilt
(1834 KB) and verified.

---

### 2026-08-28, AI server rack rebuilt as seventh flagship

Picked as the first of three "small easy" cleanup jobs and turned into a full
rebuild, because the data was worse than the score suggested.

- **`datacheck` 144/163 → 447/447.** 18 nodes → **45**, 3 tiers → **5**, with a
  full `story` block (11 stages, 3 findings, 4-lane flow). Root `bomPct` summed
  to **109** and had been silently failing the accounting gate; now exactly 100.
- **The terminus is deliberately not silicon.** The obvious deep chain here is
  accelerator → foundry → lithography, which ends in the same Veldhoven
  building as the laptop. That branch is kept to one node (`accel-litho`) and
  cross-linked. The chain this device *owns* runs outward instead: rack power →
  facility power → **grid connection** → generation → **gas turbines**. No
  other teardown on the site ends in a queue.
- **Research findings that changed the data materially:**
  - HBM: SK hynix ~63% of 2025 revenue, sliding to ~58% by Q1 2026 as Samsung
    qualified HBM4 and SK hynix's own HBM4 hit interface problems. File said
    53/28/19.
  - CoWoS: TSMC at 120–140k wafers/month in 2026, supply-demand gap narrowing
    from ~20% to ~10%, and TSMC has begun **outsourcing chip-on-wafer to
    OSATs** with ASE more than tripling. The two-year packaging bottleneck is
    genuinely easing: worth stating, because most chokepoints on this site are
    not being engineered away.
  - Custom ASICs: CSP in-house silicon forecast to grow ~45% in 2026 against
    ~16% for GPUs. Omdia has the market at ~$286bn with growth peaking.
  - Power: US data centre capacity ~62 GW (early 2026) → ~152 GW by 2030;
    transformer and cable wait times roughly **doubled in three years**; gas
    turbine orders up ~70% in 2025 with slots past 2030; build mismatch of 2–3
    years for a data centre against 4–8 for its grid connection.
  - Hyperscaler capex: top four approaching **$600bn** in 2026, ~$1tn globally,
    after ~57% growth in 2025.
- **New nodes worth knowing about**: `accel-substrate` (ABF, the constraint
  *before* CoWoS was, and nobody outside the industry has heard of it),
  `hbm-tsv` (the die bonders (ASMPT, Hanmi, BESI) a genuinely narrow
  equipment layer), `scale-up` (NVLink and the copper backplane, the most
  defensible thing Nvidia owns after CUDA), and `financing-srv` (named but not
  measured: depreciation schedules for the same silicon range from three to six
  years across the industry, which is a very wide spread for an assumption that
  determines whether the returns exist).
- **7 publishers registered**: Dell'Oro Group, 650 Group, LightCounting,
  Synergy Research, IEA Energy and AI, S&P Global Market Intelligence, Wood
  Mackenzie. 16 companies added, mostly electrical and generation.
- **`data/models/aiserver3d.js` rebuilt** from 38 lines with no camera to a
  full rack plus two sub-models. Switch trays are in the *middle* of the rack
  deliberately: scale-up is copper, loss is a function of length, so the
  physical layout is a consequence of the electrical constraint. Power and
  cooling occupy about a fifth of the height, which is the visual form of the
  device's argument. `ai-server/accelerator` is the CoWoS package (substrate,
  interposer, two logic dies, eight HBM stacks); `ai-server/rack-power` runs
  from power shelf out to facility switchgear.

**Note for the EV job:** `Schneider Electric`, `Eaton`, `ABB`, `Hitachi Energy`,
`GE Vernova` and `Siemens Energy` are now registered, which covers a chunk of
the charging-infrastructure layer.

---

### 2026-08-30: Electric vehicle rebuilt as eighth flagship

The device the combustion car was built to be read against. Both are now
flagship depth, which was the point of doing the car first.

- **`datacheck` 161/189 → 431/431.** 22 nodes → **46**, 3 tiers → **5**, full
  `story` block (10 stages, 3 findings, 4-lane flow). Root `bomPct` was 94;
  now exactly 100. It had **no 3D model at all**; it now has three.
- **Terminus: cobalt, deliberately not rare earths.** The obvious EV deep
  chain is motor → magnet → rare earth separation, and the submarine cable
  teardown already owns that. The `magnets` node is therefore present,
  cross-linked and explicitly kept shallow. The chain this device owns runs
  through the battery to **cobalt mining**, DRC ~75% of world supply with
  *no active refining capacity of its own*, plus a 2025 export ban and quota
  regime intended to force domestic processing to be built.
- **The central argument, and it is a correction to the common one:** the
  chokepoint is the refinery, not the mine. Lithium mining is diversified and
  repeatedly in oversupply, prices collapsed through 2024–25. China refines
  ~70% of lithium chemicals, >80% of lithium hydroxide, ~93% of battery-grade
  graphite. `li-mining` exists specifically as the counterexample to
  `li-refining` sitting directly above it.
- **Third finding: LFP won, and that call was made a decade early.** It is now
  the majority of global volume, uses no cobalt or nickel, and is quietly
  dissolving the cobalt chokepoint four layers below it.
- **Deliberate cross-references to other teardowns** (worth preserving, they
  are what make the catalogue cohere): electrical steel is shared with the
  microwave's transformer core *and* every grid transformer in the AI server
  teardown; charging-network build-out hits the same interconnection queue the
  AI rack ends in; giga castings inherit the combustion car's magnesium
  dependency; automotive image sensors invert the smartphone's leader board.
- **Honest note on artisanal mining.** The `cobalt-mining` node states plainly
  that ASM fell to ~2% of DRC output by 2024 and rises when prices rise, and
  that the 2025 export ban pushed prices up. That feedback loop is stated
  rather than implied; it is the only terminus on the site with a human-rights
  question rather than a strategic one.
- **10 publishers registered** (IEA Global EV Outlook, SNE Research, Benchmark
  Mineral Intelligence, Cobalt Institute, Adamas Intelligence, IDTechEx,
  BloombergNEF, Rho Motion, World Steel Association, TSR) and ~29 companies
  including ten country aggregates for the mining layers.
- **`data/models/ev3d.js`** is deliberately the same dimensions as
  `car3d.js` so the two can be compared with the camera doing none of the
  work. The whole point is the skateboard: one continuous battery slab filling
  the wheelbase, two small motor units, nothing in between, set against the
  combustion car's engine, gearbox, propshaft and exhaust. Plus `ev/pack-ev`
  and `ev/emotor` sub-models.

**Harness fix worth knowing about.** `interact.py` hardcoded `#/ev` as its
"model-less device falls back to SVG" fixture. Giving the EV a model would have
turned that into a **silent false pass**: the assertion still running, against
a device that no longer had the property being tested. It now asks the page
which devices actually lack a model and picks one at runtime, and prints a note
if every device has one. Worth checking other gates for the same pattern.

**Gates after this session**, all green:
`datacheck` ev 431/431, ai-server 447/447, car 415/415, microwave 335/335,
subsea-cable 391/391, tractor 427/427, laptop 371/371, smartphone 431/431 ·
`storycheck` 177/177 · `interact` 221/221 both builds · `schematic`
18716/18716 · `visible` 274/274 both themes · `contrast` 1022/1022 both themes ·
`dist/teardown.html` rebuilt (1949 KB) and verified.

---

### 2026-08-30 (second session): Harness widened, and a gate that guards the gates

Small change, disproportionate effect. The harness was testing one device and
reporting green.

- **`run_all.py` swept datacheck over one hardcoded device.** Line 26 read
  `["datacheck.py", [src, "laptop"]]`. That single word is why ten of twelve
  devices sat failing their own accounting gate for months, AI server at 109%
  BOM, EV at 94%, tractor citing eight unregistered publishers. It now asks the
  page which devices exist and sweeps all of them. `quick` exists for impatience
  and must never be what CI runs.
- **`contrast.py` only walked laptop and smartphone.** Six later flagships had
  *never* had their story sections contrast-checked. Pages are now derived from
  `story_device_ids()` plus one non-flagship for the plain device layout.
  **1,022 → 3,654 pairs measured, all passing.**
- **`shots.py` was a hand-maintained list** covering two devices, with one entry
  (`ev-schematic`) already wrong. Now generated: 18 → **96 views**, including
  sub-models and story sections per flagship, discovered rather than listed.
  Takes an optional device argument for iterating on one model.
- **New `tools/fixturecheck.py`: the gate that guards the other gates.** It
  fails if any harness script names a device, route or node that no longer
  exists, or if any fixture *property* has stopped being satisfiable. Verified
  by injecting a stale route and watching it fail, then restoring.
- **New in `_common.py`**: `device_ids`, `story_device_ids`, `devices_with`,
  `pick_device` and a `DEVICE_PROPS` table. **Select fixtures by property, never
  by id.**

**Why this mattered more than it looks.** Two gates in this harness have kept
passing while checking nothing: `storycheck.py` iterated `lane.nodes` when the
data uses `lane.steps`, so the loop body never ran; `interact.py` used the EV as
its "no 3D model" fixture and kept asserting after the EV got one. Neither was
visible from a pass count: a green suite that has stopped checking is worse
than a red one. `fixturecheck.py` exists specifically for that class.

**Runtime cost:** the full `run_all` goes from ~23 to ~35 minutes. Correct
trade. It also now *fails*, loudly, on the seven unfinished devices, which is
the honest state of the catalogue and should stay visible until they are fixed.

### 2026-09-04: Martech and wind turbine raised to flagship

Two devices promoted in one session, chosen deliberately as the two *existing*
teardowns with the most headroom rather than as new builds. Direction from the
user was explicit: fix the existing catalogue before adding to it.

**Martech stack: ninth flagship. 14 nodes → 53, 6 sub-tier → 38.**
`datacheck` 90/123 ❌ → 439/439 ✅.

- It is now the deepest teardown on the site by sub-tier node count (38 below
  the top level, against 37 for the car) and by editorial volume (~34.5k
  characters of node notes).
- **Terminus: browser rendering engines.** Structurally new for this catalogue
, every hardware chain descends into suppliers who do not compete with the
  brand above them. This one descends into the counterparty: Google owns Blink,
  Apple owns WebKit, and Mozilla's audited accounts put ~75% of its revenue in
  search royalties paid overwhelmingly by Google.
- Sideways constraints, all genuinely distinct: **email deliverability** (two
  inbox operators, no contract, no price, no SLA), the **.com registry** (one
  operator, a government contract, a capped wholesale price), **Let's Encrypt**
  (~68% of web certificates from a non-profit), and the **maintainer layer**
  (~60% unpaid, per Tidelift).
- **It deliberately has no 3D model.** See §5.
- The strongest sourcing on the site, for an unusual reason: W3Techs publishes
  a daily open census of the top 10m sites. Every layer citing it states
  whether it means *share of websites* or *share of revenue*, because those are
  wildly different numbers and conflating them is the standard error in this
  industry. Google Tag Manager at 99.6% of its market is now the single most
  concentrated layer anywhere in the catalogue.

**Wind turbine: tenth flagship. 12 nodes → 47, 2 sub-tier → 34.**
`datacheck` 44/52 ❌ → 391/391 ✅. 3D model rebuilt from 1.4 KB to three views.

- **Terminus: Ecuadorian balsa**, and it is the only terminus here that *got
  solved*. Worth protecting as a finding, every other chain on this site
  ends somewhere still immovable.
- Corrected two errors in the old file: it claimed 191GW installed in 2025
  (actual GWEC figure is 178GW mechanically installed, 165GW grid-connected),
  and it described the October 2025 Chinese export controls as live when they
  were suspended for a year in November 2025: the April 2025 licensing
  regime is what remains in force.
- Also corrected the old blade share table (LM 30 / TPI 25), which described
  the *merchant* blade market and read as though it described the whole one.
  The real finding is that Chinese suppliers went from ~30% of world blade
  output in 2017 to ~70% in 2025.
- Restructured the bill of materials to match the published WindEurope /
  NREL breakdown rather than my own grouping: `drivetrain` and
  `power-electronics` were dissolved and their real cost lines, converter
  5%, transformer 4%, main bearing 3%, main shaft 3%, promoted to roots.
  That was done for accuracy, and had a useful side effect: four roots now
  carry share tables, so the cost-against-concentration scatter draws. Both
  devices now render **all eight story sections and all ten chart cards**,
  the same as the laptop.
- `CS Wind` was registered with `hq: 'ROW'` and is South Korean. Fixed.

**Registry work:** +23 publishers (99 total), +85 companies (772 total).

**Verification at end of session**: `python tools/run_all.py fast`, both
builds, both themes: **34/44 gates passed in 2,393s**. All ten failures are the
five thin devices × two builds, all pre-existing. Everything else green:
`interact` 221/221 ×3 themes ×2 builds, `storycheck` 221/221 ×2 builds,
`schematic` 23,660/23,660 ×2 themes, `fixturecheck` 12/12, `TD.validate()` 0
errors, and `datacheck` clean on all ten flagships in both builds. `dist/`
rebuilt afterwards (2,117 KB) and re-verified.

**The lesson worth keeping:** the sequence in §8 held for both, but the
promotion was much cheaper than a new build: the schema, the gates and the
renderers all already worked. The expensive part was research, and the
expensive part of *that* was resisting aggregator "market share" tables built
from technology-detection counts. Wind converter market sizes for 2025 differ
by nearly **six times** between publishers for the same nominal category;
SSP "share" tables measure adoption, not money. Both are stated as findings in
the data rather than quietly averaged.

### 2026-09-04 (second session): Guided tour of the laptop

New: `js/tour.js`, `tools/tourcheck.py`, a `Run tour` button in the topbar, and
a `.tour*` block at the end of `assets/app.css`. Eighteen steps, four chapters.

**A full backup was taken before any of this landed**, at the user's
instruction, and verified byte-identical by md5 across every source file:
`../Teardown-BACKUP-pre-tour-2026-09-04_165931` (70 files, 6.4 MB, includes
`dist/`). If the tour is not wanted, that folder is the clean restore point.

The design decision that matters: **the tour drives the real UI.** It clicks
the real `#btn-explode`, dispatches real `input` events at `#ex` and `#lidr`,
and routes to real hashes: including `#/laptop/euv-optics`, five levels
down, which is the payoff. It is deliberately not a slideshow, because a
slideshow of screenshots is exactly the thing that goes stale without anyone
noticing. A step whose anchor no longer resolves is skipped at runtime and
failed by the gate.

Three constraints discovered while building it, all now written into the code:

1. **It must never auto-start.** `interact.py` drives this same page with 221
   assertions; an uninvited overlay breaks every one. Hence opt-in only, no
   first-visit autoplay, no localStorage nag. If you ever want a first-visit
   prompt, `interact.py` has to learn to suppress it first.
2. **Anchor the smallest element that makes the point.** The first draft
   pointed at `#inspector`, `#st-power` and `#st-breaks`, all taller than
   the viewport, which leaves the caption nowhere to sit that is not on top of
   the thing it is explaining. Now it points at `#inspector .srcdrawer`,
   `#st-power .st-card` and `#st-breaks .st-choke`. Card placement tries
   below, above, right, left, then the emptiest corner.
3. **Do not transition the spotlight's position.** The four scrim panels have
   to tile exactly every frame; animating their edges opens seams, and a ring
   that glided while the mask cut instantly just advertised the mismatch.
   Both move together now, with a 0.42s arrival pulse doing the work the
   glide used to.

One regression caught and fixed: the topbar button pushed the 390px mobile
layout into horizontal overflow (`interact.py` 220/221). The trigger is now
withdrawn below 900px, which is also the honest call, since the tour
spotlights a side inspector and a wide 3D board and neither exists at phone
width.

**Verification:** `tourcheck` 127/127 on both builds and both themes;
`interact` back to 221/221 in both themes; `fixturecheck` 12/12; `schematic`
23,660/23,660; `contrast` 4,610/4,610. `tourcheck.py` is registered in
`run_all.py`, so it runs per build from now on.

**One gap, stated rather than hidden:** `contrast.py` walks *visible* text, and
the tour overlay is hidden until launched, so its own caption text has never
been contrast-audited. It is safe by construction, every pair it uses
(`--ink` and `--ink-3` on `--paper`, `--on-brand` on `--brand`, `--muted` on
`--paper`) is already measured elsewhere on the site, but that is an
argument, not a measurement. If the tour's palette is ever customised away
from those tokens, teach `contrast.py` to open the tour first.

### 2026-09-04 (third session): tour revised on user feedback, and every em dash removed

**The em dash rule. This is now a standing house rule: there are zero em dashes
anywhere in this project, and none may be reintroduced.** 1,038 were removed
(827 in shipped source, 211 in the docs) and `find . -name "*.js" -o -name
"*.md" ... | xargs grep -c` now returns 0.

They were not swapped for a single character. A blanket replace produces comma
splices and loses the emphasis the dash was carrying, so each occurrence was
classified and given the punctuation it was actually doing: an aside became
commas (or brackets, where the aside carried its own commas), a subject plus
finite verb on the right became a colon, `which`/`and`/`but` became a comma,
a capitalised new subject became a colon, and `see X` became a semicolon. Two
bugs found while writing that transform and worth remembering if it is ever run
again: an over-eager "add a space after a comma" tidy split every thousands
separator (`2,500` became `2, 500`), and reading 90 characters of context to
check for an existing colon picked up JS keys like `note:` and `basis:` rather
than prose, which suppressed every colon in the sentence after them.

**Tour changes, all from user testing:**

1. **The overlay was eating every click.** `.tour` spans the viewport to host
   its fixed children, so it intercepted pointer events across the whole page:
   the spotlight looked like a hole and behaved like glass, which made the
   tour's own "try it now, the tour will wait" a lie. The root is now
   `pointer-events: none` and the scrim panels are purely visual, so the entire
   page stays live throughout. Only the caption card takes input.
2. **New Explore button.** Collapses the tour to a bar at the bottom, drops the
   scrim and ring, keeps your place, and restores on a second click.
3. **Step changes were three events, now one.** The caption text used to change
   instantly, then the page navigated, then the card slid to its new anchor.
   Now the card and ring fade out first, the page moves while they are
   invisible, and both return already positioned with the new text.
4. **Step 7 described something that was not on screen.** It talked about
   colour meaning country while the 3D legend only reads "Click a solid to
   highlight it": the geography key exists solely in schematic mode. It now
   switches to the schematic first, so the key is actually visible, which also
   demonstrates the view toggle.
5. **The analysis chapter was one step and is now twelve**, one per
   visualisation: findings boxes, build stages, the value-chain flow, the
   stage-geography strip, cost by subsystem, market size by layer, the
   cost-against-concentration scatter, concentration by tier, the tightest
   layers, chokepoints, both geography charts, the deal timeline and the
   provenance section.
6. **Removed the build-strip step.** `#journey` renders empty and hidden on any
   device carrying a `story` block, because the story's own stage strip
   replaces it. The step was pointing at nothing.

18 steps became 31, in five chapters. `tourcheck` is now 206 assertions.

**The one real bug the final suite caught, and its correct fix.** `tourcheck`
passed 206/206 on the source tree and failed on `dist/teardown.html`: the same
tour, two different answers. The gate had been waiting a flat 1600ms per step,
which was enough while the multi-file source parsed quickly and not enough for
the 2.1MB single-file build, so the spotlight was being measured mid-transition
while the ring was still on the previous anchor.

Two wrong fixes were tried before the right one, and both are worth recording
because they look reasonable. Replacing the tour's fixed scroll delay with
"wait until scrolling stops" made it worse (204/206 on *both* builds): the
fixed delay had been quietly doing a second job, giving the device view time to
re-render, and several steps re-render before they scroll, so the scroll
settles instantly while the new layout is still being built. Adding a minimum
dwell on top of that helped but did not close it either.

The actual fix was to stop guessing in the gate. `js/tour.js` marks itself busy
with a `swapping` class for exactly as long as a step is in flight, so
`tourcheck.py` now polls that and measures only once it clears. **Never put a
fixed delay back into that gate.** Both builds now report 206/206.

**A trap for whoever edits the tour next:** several story sections are taller
and wider than the viewport, so anchoring a step to `#st-power`, `#st-breaks`,
`#st-geography`, `#st-history` or `#st-method` leaves the caption nowhere to
sit that is not on top of the thing it is describing. Anchor to a child
(`.st-card`, `.st-choke`, `.st-deal`, `.st-lane`, `.st-stage`) instead.
`tourcheck.py` fails on this, which is how all five were caught.

---

### 2026-09-05: linked provenance, a sources page, and tour revisions

**The big one: every citation on the site is now a working link.** Only one of
the four places that render a citation used to link anything, so the same
publisher was clickable in the inspector and inert under every chart.

- New `TD.sourceLink()` in `core.js` is the single definition, used by
  `panel.js`, `overview.js` (chart footers), `story.js` (method section) and
  the new sources page. Do not hand-roll a fifth.
- **New page at `#/sources`**, linked from the Method page and from the "and N
  more" on every chart footer. It counts itself from live data: 98 publishers
  cited, 1,029 citations, 94 with a working link, grouped by evidence grade
  with each publisher's note and which devices cite it. Previously provenance
  was only ever visible per component or per device, so the first question a
  sceptic asks (what does this site rest on?) had no answer anywhere.
- **Four publishers deliberately carry no link** (`Company filings`,
  `Company statements`, `Appliance trade press`, `Security research
  disclosures`). They are catch-alls naming no retrievable document, and
  between them they are 40% of all citations. They render with a dotted
  underline and their reason on hover rather than as a dead link.
- **Six URLs were genuinely dead and are fixed**: two IDC deep links, EUSPA,
  gps.gov, the GroupM page (it became WPP Media on its own domain), and the
  Mozilla financial statements PDF, which was a URL I typed wrong in an
  earlier session. All checked over HTTP.

A caution for whoever re-runs a link check: roughly fifteen publishers return
**403 to a script and load fine in a browser** (Omdia, SEMI, Gartner, S&P,
Automotive News, Sony, Corning and others). Treat 403/405 as unverifiable, not
broken. Only 400/404/410 are real. `interact.py` gained 20 assertions covering
link rendering (absolute href, `target=_blank`, `rel=noopener`, unlinkable
sources carrying a title) and now runs 241.

**A pre-existing bug found while fixing the story nav, worth knowing about
because it affected the whole site:** `html, body { height: 100% }` pinned the
body box to exactly one viewport, and a sticky child can only stay stuck while
its containing block is on screen. So **the topbar silently detached and
scrolled away** past 950px on every page. The story nav, pinned at `top: 58px`
to sit under that bar, was then floating against nothing with a 58px hole
above it, which is what the user was seeing. One property (`min-height`) fixed
both. The nav is now square, opaque and flush to the column edges rather than
a rounded translucent pill, because a floating rounded box with content
sliding under it reads as debris rather than chrome.

**Tour changes:**

- **Run tour now asks how long you have.** Quick tour (6 steps) or full (31).
  The short tour is a **filter** over the one script (`short: true` on six
  steps), never a second list, so a step fixed for one is fixed for both.
- **Autoplay has a countdown bar**, riding over the step-progress bar on the
  same strip in the accent colour, so one strip answers both "how far in am I"
  and "how long until this moves".
- **End tour is now a close icon** on the card corner.

`tourcheck` covers all of it and runs **598 assertions**, walking both lengths
forwards and backwards.

**A visual bug that shipped, and the guard added because of it.** The close
icon is absolutely positioned in the corner of the expanded card. In the
Explore bar that same corner is where the Next button sits, so the two
overlapped. It looked right in the state it was designed for and was broken in
the other, which is precisely the failure mode a screenshot review does not
catch, because you screenshot the state you were working on.

`tourcheck.py` now asserts that **no two clickable controls overlap, in both
the expanded and collapsed states**, plus that the collapsed bar stays fully on
screen. The assertion was proved non-vacuous by reintroducing the bug and
confirming it failed with the exact pair named
(`tour-x over tour-btn primary tour-next`), then passing again once restored.
Anything added to the tour card from now on gets checked in both states.

---

## 8. Next up

Agreed direction: **one device at a time, properly.** Not a sweep of the
failing ones.

Ten flagships done (laptop, smartphone, tractor, submarine cable, combustion
car, microwave, AI server rack, electric vehicle, martech stack, wind turbine).

### Agreed next: finish the remediation before adding anything

**This is the standing direction as of 2026-09-04.** Two of the seven weak
devices were promoted that day; five remain, and the site still breaks its own
published rules on all five. A new flagship makes that ratio worse, not better.
The rules are the product.

The five, cheapest first, ordered by how much usable data already exists:

1. **Tablet** (16 nodes, BOM 63, 8 unsourced). Cheapest to fix and the hardest
   to justify as a flagship: its chain re-walks silicon and displays already
   owned by the laptop and smartphone. **Recommendation: fix the gates, keep it
   short deliberately, and say in the data why it stays short.** Not every
   device needs to be a flagship, and the catalogue is better for having a
   stated example of one that is not.
2. **Wind turbine's neighbour: smart TV** (12 nodes, BOM 68, 6 unsourced).
   Panel data is genuinely well tracked (Omdia is already registered). A
   plausible flagship if a distinct terminus can be found; the obvious one,
   panel glass and deposition equipment, is smartphone territory. Check before
   committing.
3. **Games console** (13 nodes, BOM 49, 6 unsourced). Same silicon overlap
   problem as the tablet.
4. **Washing machine** (12 nodes, BOM 19, 9 unsourced, and **one** node with a
   share table out of twelve). The weakest teardown on the site. Its natural
   pair is the microwave, which is already a flagship, so the comparison work
   is done and the terminus would need to avoid it.
5. **Aircraft** (11 nodes, BOM 27, 6 unsourced). The only device in Aerospace
   and defence, so the section is effectively empty. Highest editorial upside
   and the most expensive research.

### Only after that

1. **Solar module**: strongest on data availability, which is the real
   constraint here. PV is unusually openly tracked (IEA-PVPS, BNEF, InfoLink
   publish stage-by-stage shares), so most layers could be graded medium or
   high rather than low. China holds ~80% of modules, ~85% of cells and ~97% of
   wafers: one country at *every* stage, which nothing else on the site shows.
   Terminus: module → cell → wafer → polysilicon → metallurgical silicon →
   **high-purity quartz**, mostly from one district in North Carolina. Fits
   Industrial and energy, which now has a flagship wind turbine to sit beside.
   *Not yet research-verified, do a data-availability pass first.*
2. **Industrial robot**: IFR publishes credible open statistics, and the depth
   argument lands hard: robot → servo drive → **precision reducer**, where two
   Japanese firms (Nabtesco, Harmonic Drive Systems) gate global robotics.
3. **Medical technology is an empty section**: 5 planned devices, none built.
   Worth one eventually purely for catalogue shape.

1. **Solar module**: strongest on data availability, which is the real
   constraint here. PV is unusually openly tracked (IEA-PVPS, BNEF, InfoLink
   publish stage-by-stage shares), so most layers could be graded medium or
   high rather than low. China holds ~80% of modules, ~85% of cells and ~97% of
   wafers: one country at *every* stage, which nothing else on the site shows.
   Terminus: module → cell → wafer → polysilicon → metallurgical silicon →
   **high-purity quartz**, mostly from one district in North Carolina. Fits
   Industrial and energy, which has only the wind turbine. *Not yet
   research-verified, do a data-availability pass first.*
2. **Industrial robot**: IFR publishes credible open statistics, and the depth
   argument lands hard: robot → servo drive → **precision reducer**, where two
   Japanese firms (Nabtesco, Harmonic Drive Systems) gate global robotics.

**Rule: each flagship must terminate somewhere structurally different.** Ten
already do; see the list in §5. Do not build one that ends in a fab: five
devices already touch silicon and a sixth adds nothing. Do not build one that
ends in rare earth separation (submarine cable), an interconnection queue
(AI server rack), or a browser (martech). Solar's quartz and the robot's
reducer duopoly both pass; a "desktop PC" or "network switch" would not.

The sequence that has now worked five times: register the sources first → fix
the accounting → correct confidence grades → expand the node tree and research
it → write the `story` block → build or improve the visualisation → run the
gates → update this file.

**One addition to that sequence, learned on 2026-09-04.** After the story block
lands, check which story sections and cards actually *render*, several
have minimum-data gates and silently return nothing. The quickest check:

```js
Array.from(document.querySelectorAll('#story .st-sec')).map(s => s.id)
```

A complete flagship shows all eight sections. `st-history` needs ≥4 deals
across the device; the cost-against-concentration scatter needs ≥4 **root**
nodes carrying both `bomPct` and a share table; the cost-weighted geography
strip needs ≥2. A device can pass every gate in `tools/` and still render a
thin story, because the gates check data integrity and these check data
sufficiency.

---

## 9. Working agreements

- **Update this file at the end of every session.** Direction, decisions, what
  changed, what broke, what is still open.
- Run the relevant gate after any change to rendering, theming or device data.
  `datacheck.py` takes a device argument and **defaults to laptop**, always
  name the device you touched.
- Run `python build.py` after any change that should reach `dist/`.
- Do not invent market figures. If a number cannot be sourced, say so in the
  data: that is a finding, not a hole.
- Prefer correcting the record over defending an earlier claim. Two claims in
  this project have already had to be walked back after checking (the
  "origination tool" framing, and "Apple led for the first time").
