# Teardown

*Who owns the inside of everything.*

An interactive map of technology supply chains. Pick a device, dismantle it, and every
component opens into the companies that actually supply it: market shares, how concentrated
that layer is, and the transactions that produced the structure.

A market map and an argument: power increases with depth, the visible brand is rarely where
the value is, and most published share data is quoted without the basis needed to check it.
The concentration tables and the provenance rules are equally the point.

It is deliberately *not* a deal-origination tool: there is no revenue, ownership or contact
data here, so you cannot build a target list from it. It tells you how a market is shaped and
how well that shape is actually evidenced.

---

## Running it

Just open `index.html` in a browser. There is no build step, no dependencies, no server
required. Everything is plain HTML, CSS and classic JavaScript, and the data loads as
script tags rather than `fetch`, specifically so that `file://` works.

To produce one self contained file you can email or drop on any static host:

```bash
python build.py
```

That writes `dist/teardown.html`, about 1.7 MB, with every stylesheet, script and font inlined
and zero external references.

To host it: any static host works. GitHub Pages, Netlify, Cloudflare Pages, S3. Upload the
folder as is, or upload the single file from `dist/`.

---

## What is in it

Fifteen teardowns live, 542 components, 772 companies, 99 registered publishers, and nine
catalogue sections with placeholders sketched in for the rest.

| Teardown | Section | View | Depth |
|---|---|---|---|
| **Martech stack** | Software and services | schematic | **flagship**: 53 layers, 5 tiers |
| **Tractor** | Agriculture technology | 3D + 1 sub-model | **flagship**: 51 layers, 5 tiers |
| **Combustion car** | Mobility | 3D + 2 sub-models | **flagship**: 51 layers, 5 tiers |
| **Laptop** | Consumer computing | 3D + 2 sub-models | **flagship**: 48 layers, 5 tiers |
| **Smartphone** | Consumer computing | 3D + 2 sub-models | **flagship**: 48 layers, 5 tiers |
| **Submarine cable** | Data centre and AI | 3D + 2 sub-models | **flagship**: 48 layers, 5 tiers |
| **Wind turbine** | Industrial and energy | 3D + 2 sub-models | **flagship**: 47 layers, 5 tiers |
| **Electric vehicle** | Mobility | 3D + 2 sub-models | **flagship**: 46 layers, 5 tiers |
| **AI server rack** | Data centre and AI | 3D + 2 sub-models | **flagship**: 45 layers, 5 tiers |
| **Microwave oven** | Home and appliances | 3D + 2 sub-models | **flagship**: 41 layers, 5 tiers |
| Tablet | Consumer computing | 3D | 2 layers |
| Games console | Consumer computing | 3D | 2 layers |
| Smart TV | Consumer computing | 3D | 2 layers |
| Washing machine | Home and appliances | 3D | 1 layer |
| Aircraft | Aerospace and defence | 3D | 1 layer |

The remaining five (tablet, console, smart TV, washing machine, aircraft) are still catalogue
entries rather than teardowns: they name a component and two or three suppliers and stop. They
also fail the project's own gates, their `bomPct` does not sum to 100 and several of their
components cite no source, which is tracked openly in `HANDOVER.md` rather than hidden.

The martech stack is the one flagship with no 3D model, and that is deliberate rather than
pending: software has no physical form, so the schematic board is the honest renderer for it.

**Ten devices carry the flagship treatment**: a `story` block in the data file, which turns
on the long-form analysis below the teardown (`js/story.js`): build stages, cost stack,
concentration by tier, chokepoint cards, supply geography, deal history and a provenance
summary. Adding a `story` block to any other device turns the same treatment on for it, and
`tools/storycheck.py` starts gating it automatically.

### The deep chains, and why none of them repeat

Each flagship is chosen so that it bottoms out in a *structurally different kind of thing*.
That constraint is the point: ten teardowns that all ended in a semiconductor fab would be
one teardown told ten times.

> **Laptop** → Mainboard → Processor → Foundry → Lithography → EUV optics → **Zeiss, 100%**

One company. The narrowest single-firm dependency on the site.

> **Smartphone** → Display → OLED panel → Deposition equipment → Fine metal mask → **Invar foil**

Canon Tokki and Sunic System build the evaporators, at a reported couple of Gen-8 units a year
between them; Dai Nippon Printing etches most of the world's masks; two firms roll the alloy
they are etched from. A material, not a machine.

> **Tractor** → Engine → Aftertreatment → Catalyst → PGM refining → **PGM mining**

Roughly 70% of world platinum comes from one orebody in South Africa. Separately, the machine's
guidance stack terminates in a **satellite constellation** operated by four governments, with no
supplier, no price and no contract. An orebody, and state infrastructure nobody invoices for.

> **Submarine cable** → Repeaters → Amplifier → Erbium-doped fibre → Erbium oxide → **Rare earth separation**

China holds around 87% of separation capacity, and unlike the tractor's mine, the hard part here
is a *chemical process*, which is why fifteen years of announced Western projects remain a rounding
error. The binding constraint sits sideways from the chain entirely: fewer than **60 cable ships**
exist worldwide, most converted from other trades, and ship time is already the largest single line
in a cable budget.

> **Combustion car** → Body → Castings → Aluminium → Magnesium → **Magnesium smelting**

An alloying element at roughly 5% of automotive aluminium, in nobody's bill of materials, ~87–90%
from China and ~97% of Europe's supply from there. Sideways again, and worse: the wiring harness.
Seventeen plants in western Ukraine shut in 2022 and put 10–15% of European car output at risk.
A hand-taped bundle of wire idled Volkswagen, BMW, Mercedes and Porsche: the cheapest part in the
teardown, and the one most able to stop a factory.

> **AI server rack** → Rack power → Facility power → Grid connection → Generation → **Gas turbines**

Three firms build essentially all of the world's heavy-duty gas turbines, orders surged ~70% in 2025
and delivery slots run past 2030. The layer above it has no supplier at all: a data centre takes two
to three years to build and its grid connection takes four to eight. The only teardown here that
ends in a queue.

> **Electric vehicle** → Battery → Cathode → Cobalt refining → **Cobalt mining**

The DRC produces roughly three quarters of the world's mined cobalt and has no active refining
capacity at all, so the ore leaves to be processed almost entirely in China. The wider point the
teardown makes: nobody is short of lithium, cobalt or graphite. They are short of refineries, and a
refinery takes four years to build. Read it beside the combustion car: same body, same interior,
different everything under the floor.

> **Microwave oven** → Magnetron → Cathode → Tungsten wire → APT → **Tungsten mining**

China produces ~83% of world tungsten, holds about half of known reserves, and put selected
tungsten items under export licensing in February 2025: the traded intermediate roughly doubled
in price across the year. It is also the only teardown here where *every* tier is Chinese: the
brand, the factory, the magnetron, the wire and the ore. The cheapest device on the site is the
most concentrated one.

> **Wind turbine** → Blade → Shell → Sandwich core → Balsa → **Ecuadorian plantations**

Ecuador supplies ~95% of the world's commercial balsa and China buys ~95% of what Ecuador exports.
A balsa tree takes four to six years to reach harvestable size, so when installations surged in
2019–20 the price roughly doubled, exports hit a record USD 570m with about three quarters going
into blades, and the shortfall was met by illegal logging in the Amazon. **The only terminus on
this site that got solved**: PET foam displaced balsa across most of the shell, and the dependency
is materially smaller now. A biological lead time, and an industry that engineered its way out of
one. The magnet chain deliberately stops at sintering and cross-references the submarine cable
rather than re-walking rare earth separation, that convergence is itself the finding.

> **Martech stack** → Programmatic → Identity → The browser → **Rendering engines**

Three engines remain. Blink is Google's at ~79% of sessions, WebKit is Apple's, and Gecko is
Mozilla's at ~3%: funded, per Mozilla's own audited accounts, roughly three quarters by search
royalties paid overwhelmingly by Google. So the two largest sellers of advertising own two of the
three engines and substantially fund the third. Every hardware teardown here descends into
*suppliers*; this one descends into **the counterparty**. Sideways constraints are stranger still:
two thirds of the encrypted web rests on a non-profit certificate authority, `.com` is a single
United States government contract with a capped price, and the dependency layer under all of it is
maintainers who are ~60% unpaid.

## The guided tour

`Run tour` in the topbar walks the laptop teardown in eighteen steps, across four chapters,
the machine, who supplies it, the argument, and the rest of the site. It is opt-in and never
starts on its own.

The thing worth knowing about it: **it drives the real interface rather than describing one.**
The tour clicks the actual Dismantle button, drags the actual separation and lid sliders, and
navigates to the actual routes, including the five-level descent from `#/laptop` to
`#/laptop/euv-optics`, which is where the site's whole argument lands. Nothing in it is a
screenshot or a mock-up, so it cannot show you a control that no longer exists: a step whose
anchor stops resolving is skipped at runtime, and `tools/tourcheck.py` fails the build.

Controls are Next / Back / Autoplay / End tour, plus arrow keys, space and Escape. Leaving by
any route puts the laptop back at its top level, scrolled to the top. It is hidden below 900px,
because it spotlights a side inspector and a wide 3D board and neither layout exists on a phone.

```bash
python tools/tourcheck.py            # 127 assertions: every anchor, spotlight and caption
```

## The 3D view

Devices with a model in `data/models/` get a real, freely orbiting three.js scene:
drag to rotate, scroll to zoom, right-drag to pan, jump to a preset view, dismantle
with the separation slider, open the lid where one exists, isolate a component or
X-ray the shell to see what's inside. Click a solid to select it, double click to
open it, which loads that component's own model if one exists: fifteen components do,
across the eight flagships, or falls back to the flat schematic.

Models are built from boxes, but not only boxes: `shape: 'cyl'` with an `axis` gives a
real cylinder (the tractor's wheels, the cable's concentric layers, the repeater housing),
`shape: 'wedge'` gives a tapered solid (a tractor hood, a ship's hull, a car's cabin), and `shape: 'round'`
gives a rounded extrusion. `js/iso.js` degrades all of them to their bounding box, which is
intentional and looks fine.

Three tiers, in order of preference: **three.js** when WebGL is available (`js/three-view.js`),
the older **axonometric SVG renderer** when it isn't (`js/iso.js`, unchanged, zero
dependencies, still the one true fallback), and the **flat schematic** for any device
with no `data/models/` entry at all, or when a device's own "Schematic view" toggle
is used deliberately. Nothing breaks moving down that list, so 3D can be added device
by device without the site depending on it.

three.js itself is vendored locally in `js/vendor/` (the last release with a plain,
non-module `<script src>` build, chosen specifically so `file://` keeps working,
see `js/vendor/NOTICE.md`), not loaded from a CDN. It is the one real dependency on
this site, and the trade-off is visible in `dist/teardown.html`'s size: what used to
be a 230KB single file that fit in an email is now over a megabyte with the font and
three.js both inlined. That trade was made deliberately in exchange for `file://`
still working with zero build step; see `js/three-view.js`'s file comment for the
coordinate-mapping math if you're touching the renderer itself.

`js/iso.js` is about 400 lines and still has no dependencies. Three things in it are
worth knowing if you touch it:

- **Projection.** Screen y is negated on both terms, because SVG y grows
  downward and both "further back" and "higher up" must move up the page.
- **Depth sorting.** Sorting faces by centroid distance is the obvious approach
  and it is wrong: a large battery whose centre is nearer the camera paints over
  the small palm rest directly above it. Solids are axis aligned boxes, so the
  correct test is the separating axis, resolved into a draw order by topological
  sort.
- **Cycles.** Painter's algorithm can hit unsatisfiable loops. Two guards keep
  it at zero cycles across every camera angle: only pairs that overlap on screen
  get a constraint at all, and the separating axis is chosen by how much the two
  boxes overlap in cross section, so diagonal neighbours that touch only at an
  edge impose nothing. `TD._dbg` after a render reports node count, edge count
  and any cycles that still had to be broken.

---

## The house rules

**Naming.** Any company at 10% or above is always named. The top 5 are always named however
small they are, so a near monopoly still shows the remaining alternatives. Beyond that,
players are named in descending order until the list covers 85% of the market, capped at 15.
The rest collapses into Others.

A pure 10% cutoff, which was the original spec, prints exactly one name for lithography and
nothing at all for fragmented layers like hinges or forging. The two extra rules fix both ends.

**Basis before number.** Every table states what it measures: units or revenue, which year,
which market definition. Notebook processors are a monopoly on x86 units and a competitive
market once Apple and Arm machines count. Tractors are Indian by volume and American by
revenue. Quoting a share without its basis is how people mislead themselves.

**Concentration.** HHI is the sum of squared shares of the named players. Residual Others is
treated as many small firms, which understates concentration slightly, which is the
conservative direction. Bands follow the usual competition authority convention.

**Coverage, and why the fragmentation table is gated.** Treating Others as many small firms
is conservative when you are asking how *concentrated* a layer is. It is the opposite of
conservative when you are asking how *fragmented* one is: name three suppliers covering 12%
of a market and the layer scores an HHI of 50 and sorts straight to the top of any "most
fragmented" list, not because it is fragmented, but because nobody has researched it.
`TD.coverage(node)` reports how much of the market the named players actually account for,
and the Findings page ranks only layers at or above `TD.MIN_COVERAGE` (60%), saying how many
it held back. Below that threshold a band reports a gap in the data, not a finding about the
market, and the site now says so instead of selling it as a roll-up thesis.

**Confidence.** Stated per component. `high` means well covered by published trackers and
company reporting. `medium` means the market definition is contested or sources disagree.
`low` means a reasoned estimate from filings and fragmentary coverage, treat as an order of
magnitude. Roughly a third of the site is marked low, mostly the mechanical and assembly
layers no analyst house covers properly because there is no money in covering them.

---

## Adding a teardown

Create `data/devices/yourthing.js`, then add one script tag to `index.html` above
`js/app.js`. Nothing else is wired by hand: navigation, search, the company index and the
findings tables all build themselves from the data.

```js
TD.device({
  id: 'drone',
  name: 'Drone',
  category: 'Aerospace',
  tagline: 'One line that earns the click.',
  unit: { volume: '~5m units (2025)', price: 'USD ~700 average' },
  intro: 'A paragraph shown under the diagram.',
  view: { w: 1000, h: 640 },
  frames: [{ label: 'Airframe', x: 130, y: 60, w: 740, h: 200 }],   // optional backdrops
  nodes: [
    {
      id: 'flight-controller',
      name: 'Flight controller',
      short: 'FC',                       // used on small tiles
      shape: { x: 150, y: 90, w: 250, h: 160 },   // omit to keep it off the diagram
      blurb: 'One sentence on what the part is.',
      bomPct: 12,                        // share of device cost
      layout: 'board',                   // 'board' or 'chain' for its children
      market: { size: 'USD ~2bn', year: 2025, basis: 'say exactly what you measured' },
      asOf: '2025',
      confidence: 'medium',              // high | medium | low
      chokepoint: true,                  // hand flagged, drives the amber dot
      shares: [ { c: 'DJI', p: 62 }, { c: 'Auterion', p: 8 } ],
      note: 'The analysis. This is the part people actually read.',
      sources: ['TrendForce'],           // keys into data/sources.js
      deals: [ { y: 2024, a: 'Acquirer', t: 'Target', v: 'USD 1bn', n: 'Why it mattered.' } ]
    }
  ]
});
```

Field notes:

- `parent: 'some-id'` nests a node. Children with `shape` render as their own board when
  you open the parent, which is the whole dismantling mechanic.
- `sources` entries are short strings that key into `data/sources.js`, where the URL, the document
  type (`primary` / `third-party` / `derived`) and a note on what is actually being cited live once
  per publisher. Register a publisher there before citing it. Prefer naming the tracker that really
  publishes the figure: `'Company filings'` resolves to the `derived` grade, because a company's
  filing states its own revenue and never its market share.
- `layout: 'chain'` lays children out left to right with arrows instead. Use it for upstream
  supply chains, as the laptop CPU and foundry nodes do.
- `kind: 'meta'` puts a node in the strip under the diagram rather than on it. Use it for
  things that decide the market but are not parts: brand share, contract manufacturing,
  operating system.
- `upstream: ['other-id']` cross links two nodes that share a supply chain.
- Any company named in `shares` should exist in `data/companies.js`, which sets its home
  country and therefore its bar colour. The console warns on load if one is missing.

Coordinates live in a 1000 by 640 space and scale to whatever width the browser gives them.

---

## Adding it to the catalogue

Sections drive the browse menu and the overview page. Edit `data/sections.js`:

```js
{
  id: 'aerospace',
  name: 'Aerospace and defence',
  blurb: 'One or two lines shown under the heading.',
  devices: ['drone'],                       // ids of live teardowns
  planned: ['Satellite', 'Jet engine']      // greyed placeholders
}
```

Nothing else needs touching. A device with no section still works, it just will
not appear in the browse menu, so remember to list it.

---

## Adding a 3D model

Optional. Create the model in `data/models/` and add a script tag after the
device file it belongs to. Keyed on the device id for the top level view, or
`deviceId/nodeId` for a component's own view.

```js
TD.model('drone', {
  spread: 30,                                  // how far parts fly apart
  lid: { axisY: 105, axisZ: 20.5 },            // optional hinge, omit if none
  parts: [
    {
      node: 'battery',                         // must match a node id
      color: '#2f6d59',
      dir: [0, 0, -1],                         // explode direction, optional
      spread: 1.2,                             // multiplier on the model spread
      hinged: true,                            // rides on the lid
      boxes: [ { x: [-33, 33], y: [-74, 16], z: [5, 9] } ]
    }
  ]
});
```

Boxes are in millimetres, `x` right, `y` back, `z` up. A part can have as many
boxes as it needs. Two things learned the hard way building the laptop:

- **Model the shell properly.** Without a deck and side walls you look straight
  into the internals and it never reads as a closed product.
- **Leave a fraction of clearance.** A part whose top is exactly coplanar with
  the shell above it shows a sliver past the shell's silhouette. The laptop
  internals stop at z 12.4 against a deck starting at 13.

The console warns on load if a model references a node id that does not exist.

---

## Files

```
index.html              shell and script order
assets/app.css          all styling
assets/fonts/           vendored Inter Var, self hosted so file:// keeps working
js/vendor/               three.js and OrbitControls, vendored; see NOTICE.md there
js/core.js              registry, sections, ranking rule, HHI, coverage, geography, search, sources
js/three-view.js        primary 3D renderer: three.js scene, orbit/zoom/pan, isolate, X-ray
js/iso.js               fallback axonometric SVG 3D renderer: projection, depth sort, orbit
js/schematic.js         flat SVG board and chain renderer, used when there's no 3D model
js/panel.js             inspector, source drawer, and company views
js/overview.js          per-device charts above the fold: concentration, cost stack, geography
js/story.js             the long-form flagship analysis, for any device with a `story` block
js/app.js               routing, browse menu, device view, floating inspector, findings tables
data/sections.js        catalogue sections and the planned roadmap
data/companies.js       company registry: home country, listed or private, ticker
data/sources.js         publisher registry: URL, document type, what is really being cited
data/devices/*.js       one file per teardown
data/models/*.js        optional 3D geometry, consumed by both js/three-view.js and js/iso.js
tools/                  the verification harness; see tools/README.md
build.py                single file bundler, inlines vendored JS, CSS and fonts alike
```

---

## Caveats

Figures are compiled and rounded from industry trackers, company filings and regulatory
disclosures, and are stated as indicative. No subscription dataset is reproduced. Nothing
here is investment advice, and nothing here should be relied on for a transaction without
independent verification. Share data ages: the memory and foundry tables in particular move
every quarter.
