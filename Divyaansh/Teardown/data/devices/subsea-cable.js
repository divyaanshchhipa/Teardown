/* Teardown :: Submarine cable system
 *
 * Fourth flagship. Shares are indicative unit, revenue or capacity shares for
 * the stated year and basis; confidence is stated per node; every `sources`
 * entry keys into data/sources.js.
 *
 * ---- why this device is shaped differently from the others ----
 *
 * A laptop, a phone and a tractor are products: you buy one, it has a bill of
 * materials, and a brand puts its badge on it. A submarine cable is a
 * *project*. Nobody sells one off a shelf. A consortium or a single company
 * commissions a system, a turnkey supplier builds and lays it, and the thing
 * that is delivered is a route with a capacity on it.
 *
 * So `bomPct` here is the share of total project cost, not of a parts list,
 * and roughly a third of it buys no hardware at all: it buys ship time. That
 * is not a distortion of the site's model; it is the finding. The single
 * largest line item in the world's most critical infrastructure is the cost
 * of hiring one of about sixty vessels.
 *
 * The deep chain is also not a fab and not a mine. It runs down through the
 * amplifier to a rare earth, and the binding constraint sits sideways from it
 * entirely, in a fleet.
 */
TD.device({
  id: 'subsea-cable',
  name: 'Submarine cable',
  icon: 'cable',
  category: 'Data centre and AI',
  tagline: 'Ninety-nine percent of intercontinental traffic, carried by four builders and laid from about sixty ships.',
  unit: { volume: '~600 systems in service, ~1.6m km of cable', price: 'USD ~250m for a 7,000 km transatlantic system' },
  intro: 'Almost everything you do online crosses an ocean on a cable about as thick as a garden hose. ' +
         'Four companies build essentially all of them, one fleet of ageing ships lays and repairs them, ' +
         'and in the space of ten years the customers (Google, Meta, Amazon and Microsoft) stopped ' +
         'renting capacity and started owning the cables outright.',
  view: { w: 1000, h: 640 },
  frames: [{ label: 'Wet plant', x: 130, y: 60, w: 740, h: 190 },
           { label: 'Marine works', x: 130, y: 262, w: 740, h: 178 },
           { label: 'Dry plant and shore', x: 130, y: 452, w: 740, h: 176 }],

  /* ============================ STORY ============================
   * `stages` must account for all 48 nodes exactly once, tools/storycheck.py
   * asserts it and fails on a miss, a duplicate or an unknown id.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'The internet has a fleet, and the fleet is the bottleneck.',
    lede: 'Forty-eight mapped layers, five tiers deep. Every previous teardown on this site bottoms out ' +
          'in something you can point at in a factory or dig out of the ground. This one bottoms out in ' +
          'a rare earth, and then runs into a constraint that is not a supplier at all, but a fleet of ' +
          'fewer than sixty mostly second-hand ships that nobody is replacing.',

    tierNote: 'Every layer of a cable is a competitive market. Getting it onto the seabed is not.',
    geoLede: 'Two readings, and they disagree. By supplier the chain is American, French, Japanese and ' +
             'Chinese in roughly equal measure. By ownership it has become overwhelmingly American, ' +
             'because four US companies now own most of the capacity crossing the Atlantic.',

    findings: [
      { title: 'About sixty ships hold up the internet',
        body: 'There are fewer than sixty cable-laying and repair vessels in the world, and the number ' +
              'has barely moved while route mileage grew by half. Most are conversions from other ' +
              'industries. Around two thirds of the maintenance fleet reaches the end of its service ' +
              'life within fifteen years, a replacement hull costs USD 140m to 150m and takes twenty-six ' +
              'months to build, and almost nobody is ordering. Ship time is already the single largest ' +
              'line in a cable budget. It is the clearest infrastructure bottleneck on this site and it ' +
              'is not a factory.',
        nodes: ['cable-ships', 'shipbuilding', 'marine-install'] },
      { title: 'The customers bought the network',
        body: 'In 2014 the big content companies used about a tenth of international capacity and rented ' +
              'all of it. By 2025 hyperscalers and AI platforms accounted for around three quarters of it ' +
              'and increasingly own the cable outright: on the transatlantic route, close to ninety ' +
              'percent. The telecom carriers that built the world\'s spine have been displaced as owners ' +
              'by the four firms that were their largest customers. Nothing else on this site shows ' +
              'backward integration on that scale, that fast.',
        nodes: ['owners-sc', 'capacity-sc'] },
      { title: 'It is almost never sabotage. It is fishing boats.',
        body: 'Roughly two hundred cable faults happen every year and that number has been flat for a ' +
              'decade. Fishing gear and ship anchors cause about eighty-six percent of them. The ICPC, ' +
              'which is the industry body that would know, says there have been no verified incidents of ' +
              'state-sponsored sabotage since the Second World War. The real fragility is duller and ' +
              'worse: a repair needs a ship, a permit and a weather window, and the longest repair on ' +
              'record ran to 947 days.',
        nodes: ['maintenance', 'routes-sc', 'cable-ships'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 48. */
    stages: [
      { id: 'materials', name: 'Mined and refined inputs',
        note: 'A cable is glass, copper, steel and about a teaspoon of rare earth. The teaspoon is the ' +
              'part with a supply problem.',
        nodes: ['re-separation', 'erbium-oxide', 'germanium', 'silica', 'copper', 'beryllium-copper'] },
      { id: 'fibre', name: 'Fibre and preform',
        note: 'A glass rod is drawn into a hair-thin strand that can carry light for eighty kilometres ' +
              'before it needs help. Submarine-grade fibre is a narrow subset of an already narrow trade.',
        nodes: ['preform', 'coating', 'fibre'] },
      { id: 'wetplant', name: 'The cable itself',
        note: 'Concentric layers around the fibre: steel, copper, polyethylene. In deep water it is as ' +
              'thin as a marker pen; in the shallows it is armoured until it is thicker than your wrist.',
        nodes: ['cable-armour', 'conductor', 'cable-insulation', 'branching-units', 'wet-plant'] },
      { id: 'amplification', name: 'Amplification',
        note: 'Light fades. Every 60 to 80 kilometres a repeater lifts it again, using a fibre doped with ' +
              'erbium and a pump laser. This is the tier that makes an ocean crossing possible at all.',
        nodes: ['er-fibre', 'laser-diode-fab', 'pump-lasers', 'edfa', 'repeater-housing',
                'supervisory', 'repeaters'] },
      { id: 'terminal', name: 'Terminal equipment',
        note: 'The dry plant at each end, which decides how much traffic the same glass can actually ' +
              'carry, and is upgraded several times over a cable\'s twenty-five year life.',
        nodes: ['coherent-dsp', 'transponders', 'optical-terminal', 'slte'] },
      { id: 'marine', name: 'Marine installation',
        note: 'The largest single line in the budget, and the one that buys no hardware. Ships, ploughs, ' +
              'and people splicing glass at sea.',
        nodes: ['shipbuilding', 'cable-ships', 'ship-operators', 'burial-plough', 'jointing',
                'marine-install'] },
      { id: 'survey', name: 'Survey and consents',
        note: 'Before a metre is laid, someone maps the seabed and someone else spends two years getting ' +
              'permission to touch it in a dozen jurisdictions.',
        nodes: ['route-survey', 'marine-survey', 'permitting', 'project-mgmt', 'survey-permits'] },
      { id: 'shore', name: 'Landing and backhaul',
        note: 'Where the cable comes ashore, gets its power, and joins a terrestrial network. Often the ' +
              'most politically sensitive hundred metres of the whole route.',
        nodes: ['landing-station', 'power-feed', 'backhaul', 'landing'] },
      { id: 'operate', name: 'Keeping it alive',
        note: 'A cable is bought once and repaired for twenty-five years. The maintenance agreement is ' +
              'pre-funded at construction and is the least discussed line in the model.',
        nodes: ['maintenance-zones', 'depot-spares', 'maintenance', 'unpriced-sc'] },
      { id: 'market', name: 'Who builds, owns and uses it',
        note: 'Four builders, a changed ownership base, and a set of geographic chokepoints where ' +
              'dozens of systems share one corridor.',
        nodes: ['suppliers-sc', 'owners-sc', 'capacity-sc', 'routes-sc'] }
    ],

    flow: {
      lanes: [
        { label: 'Wet plant', steps: ['silica', 'preform', 'fibre', 'wet-plant'],
          feed: { label: 'Amplification',
                  steps: ['re-separation', 'erbium-oxide', 'er-fibre', 'edfa', 'repeaters'] } },
        { label: 'Marine', steps: ['shipbuilding', 'cable-ships', 'burial-plough', 'marine-install'] },
        { label: 'Terminal', steps: ['coherent-dsp', 'transponders', 'slte'] },
        { label: 'Shore', steps: ['landing-station', 'backhaul', 'landing'] }
      ],
      converge: ['suppliers-sc', 'owners-sc']
    }
  },

  nodes: [

    /* ==================== ROW 1 :: WET PLANT ==================== */
    {
      id: 'wet-plant', name: 'Cable', short: 'Cable',
      shape: { x: 150, y: 80, w: 220, h: 150 },
      blurb: 'Fibre in a steel tube, wrapped in copper, insulation and, near shore, a lot of armour wire.',
      bomPct: 30, layout: 'board',
      market: { size: 'USD ~2.6bn', year: 2025, basis: 'submarine telecom cable manufacture, annual contract value' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ASN', p: 26 }, { c: 'SubCom', p: 24 }, { c: 'NEC', p: 17 },
        { c: 'HMN Tech', p: 15 }, { c: 'Prysmian', p: 6 }
      ],
      note: 'The cable is the part everyone pictures and it is under a third of the cost. In deep water ' +
            'it is about 17mm across, thinner than a garden hose, because at 4,000 metres nothing is ' +
            'going to hit it. In the shallows, where trawlers and anchors are, the same cable is armoured ' +
            'until it is thicker than a wrist. Almost all of it is made by the same firms that lay it: ' +
            'this industry is vertically integrated in a way almost nothing else on this site is.',
      sources: ['TeleGeography', 'SubmarineNetworks.com']
    },
    {
      id: 'repeaters', name: 'Repeaters and amplifiers', short: 'Repeaters',
      shape: { x: 390, y: 80, w: 220, h: 150 },
      blurb: 'A pressure housing every 60 to 80 km containing the optical amplifiers that keep the light alive.',
      bomPct: 9, layout: 'chain',
      market: { size: 'USD ~0.9bn', year: 2025, basis: 'submarine repeater and amplifier supply, annual contract value' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'ASN', p: 28 }, { c: 'SubCom', p: 26 }, { c: 'NEC', p: 19 },
        { c: 'HMN Tech', p: 14 }, { c: 'Xtera', p: 5 }
      ],
      note: 'A transatlantic system carries around a hundred of these, at roughly USD 200,000 each, and ' +
            'every one of them has to work untouched on the seabed for twenty-five years under 400 ' +
            'atmospheres of pressure. There is no maintenance access in any meaningful sense: if a ' +
            'repeater fails you send a ship, cut the cable, and pull three kilometres of it to the ' +
            'surface. That reliability requirement, not the optics, is why only four firms build them.',
      sources: ['TeleGeography', 'SubmarineNetworks.com']
    },
    {
      id: 'slte', name: 'Terminal equipment', short: 'SLTE',
      shape: { x: 630, y: 80, w: 220, h: 150 },
      blurb: 'Submarine line terminal equipment: the coherent transponders at each end that fill the glass.',
      bomPct: 8, layout: 'board',
      market: { size: 'USD ~1.4bn', year: 2025, basis: 'submarine line terminal equipment revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Ciena', p: 31 }, { c: 'Nokia', p: 22 }, { c: 'NEC', p: 14 },
        { c: 'Huawei', p: 9 }, { c: 'ZTE', p: 5 }
      ],
      note: 'The one part of the system that gets replaced. A cable is laid once and lives twenty-five ' +
            'years; the terminal equipment at each end is swapped every few years, and each generation ' +
            'pulls more capacity out of exactly the same glass. Cables laid in the 2000s carry many times ' +
            'the traffic today that they were designed for, purely because of upgrades at the beach. ' +
            'Nokia\'s position here grew by buying Infinera, one door down from the ASN business it sold.',
      sources: ['Lightwave', 'TeleGeography']
    },

    /* ==================== ROW 2 :: MARINE WORKS ==================== */
    {
      id: 'marine-install', name: 'Marine installation', short: 'Installation',
      shape: { x: 150, y: 282, w: 220, h: 138 },
      blurb: 'Ship time: loading, laying, ploughing the cable into the seabed, and splicing it at sea.',
      bomPct: 30, layout: 'board',
      market: { size: 'USD ~2.4bn', year: 2025, basis: 'cable installation and marine works, annual contract value' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'SubCom', p: 27 }, { c: 'ASN', p: 24 }, { c: 'NEC', p: 13 },
        { c: 'HMN Tech', p: 12 }, { c: 'Global Marine', p: 8 }
      ],
      note: 'Roughly a third of the project cost, and it buys no hardware whatsoever. This is the line ' +
            'that makes a submarine cable unlike every other device on this site: you are not buying a ' +
            'thing, you are buying several months of a scarce vessel\'s time, plus the weather risk that ' +
            'comes with it. A laying campaign runs at something like 100 to 200 km a day in good ' +
            'conditions and stops entirely in bad ones.',
      sources: ['TeleGeography', 'Capacity Media']
    },
    {
      id: 'survey-permits', name: 'Survey, permits and management', short: 'Survey and consents',
      shape: { x: 390, y: 282, w: 220, h: 138 },
      blurb: 'Mapping the seabed, and getting permission to cross a dozen jurisdictions to reach it.',
      bomPct: 9, layout: 'board',
      market: { size: 'USD ~0.7bn', year: 2025, basis: 'marine route survey, permitting and project management fees' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Fugro', p: 21 }, { c: 'EGS Survey', p: 9 }, { c: 'Ocean Specialists', p: 6 }
      ],
      note: 'The least visible and most schedule-critical part of a project. Permitting a cable that ' +
            'crosses several exclusive economic zones routinely takes longer than manufacturing and ' +
            'laying it, and a single refused consent can force a reroute of hundreds of kilometres. ' +
            'Only three names are measured here against a fragmented consultancy market, so read the ' +
            'coverage before treating the fragmentation as a finding.',
      sources: ['SubmarineNetworks.com', 'Company filings']
    },
    {
      id: 'maintenance', name: 'Maintenance and repair', short: 'Maintenance',
      shape: { x: 630, y: 282, w: 220, h: 138 },
      blurb: 'A pre-funded share of a standing repair fleet, bought at construction and drawn on for decades.',
      bomPct: 4, layout: 'board',
      market: { size: 'USD ~0.5bn', year: 2025, basis: 'submarine cable maintenance agreement revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Global Marine', p: 19 }, { c: 'Orange Marine', p: 15 },
        { c: 'E-Marine', p: 12 }, { c: 'KDDI Cable Ship', p: 11 },
        { c: 'S.B. Submarine Systems', p: 9 }, { c: 'IT International Telecom', p: 6 }
      ],
      note: 'Around 200 faults happen worldwide every year, a number that has been essentially flat since ' +
            '2013 even though route mileage grew by half, cables are getting more reliable per kilometre. ' +
            'Fishing gear and anchors cause about 86% of them. Owners buy into regional maintenance zones ' +
            'that keep a ship on standby; a repair costs on the order of USD 1m and needs a vessel, a ' +
            'permit and a weather window, in that order of difficulty. The ICPC recorded 206 repairs in ' +
            '2023 across 136 jurisdictions, and the longest single repair took 947 days.',
      sources: ['ICPC', 'TeleGeography']
    },

    /* ================ ROW 3 :: DRY PLANT AND SHORE ================ */
    {
      id: 'landing', name: 'Landing stations', short: 'Landing',
      shape: { x: 150, y: 472, w: 220, h: 138 },
      blurb: 'The beach manhole, the building behind it, and the power feed that runs the repeaters.',
      bomPct: 6, layout: 'board',
      market: { size: 'USD ~0.5bn', year: 2025, basis: 'cable landing station construction and fit-out' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Named but not measured. Landing stations are built by regional civil contractors to each ' +
            'operator\'s design, and no published source tracks the market, but the layer matters far ' +
            'beyond its six percent, because a landing station is the physical and legal point where a ' +
            'cable becomes subject to a country. It is where lawful intercept happens, where landing ' +
            'party licences bite, and where a government that dislikes a cable can simply refuse it. ' +
            'The most consequential hundred metres of a 7,000 km system.',
      sources: ['TeleGeography', 'SubmarineNetworks.com']
    },
    {
      id: 'unpriced-sc', name: 'Not separately priced', short: 'Unpriced',
      blurb: 'Insurance, financing costs, spares provisioning, contingency and the margin on the turnkey contract.',
      bomPct: 4,
      market: { size: null, year: 2025, basis: 'residual share of project cost, not a market' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Marine construction contingency is real money and no supplier is attached to it. A turnkey ' +
            'contract prices weather risk, seabed surprises, and the possibility that a permit arrives ' +
            'eighteen months late, and the supplier carries that risk, which is a large part of why ' +
            'only four firms are willing to sign one. Read this line as the cost of uncertainty rather ' +
            'than as a category.',
      sources: ['TeleGeography', 'Company filings']
    },

    /* ============================ META ============================ */
    {
      id: 'suppliers-sc', name: 'Turnkey system supply', short: 'Builders', kind: 'meta',
      blurb: 'Who will actually sign a contract to build and lay an intercontinental cable.',
      market: { size: 'USD ~5bn', year: 2025, basis: 'turnkey submarine cable system contract awards, by deployed length' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'SubCom', p: 38 }, { c: 'ASN', p: 25 }, { c: 'NEC', p: 18 }, { c: 'HMN Tech', p: 14 }
      ],
      note: 'Four firms, and effectively no fifth. SubCom has led on deployed cable length, at roughly ' +
            'forty percent, and the three Western suppliers have taken close to ninety percent of new ' +
            'construction since 2016. Their ownership is the interesting part: SubCom is held by ' +
            'Cerberus, ASN was bought outright by the French State at the end of 2024, NEC is Japanese, ' +
            'and HMN Tech is Chinese and excluded from most Western-financed systems. Two governments ' +
            'and a private equity firm now sit behind the world\'s cable supply, which is a remarkable ' +
            'sentence to have to write about a commercial market.',
      sources: ['TeleGeography', 'SubmarineNetworks.com'],
      deals: [
        { y: 2024, a: 'French State', t: 'Alcatel Submarine Networks', v: 'EUR 350m', n: 'Nokia sold ASN outright to the French government, completed 31 December 2024, retaining 20% pending exit. A cable manufacturer nationalised on strategic grounds.' },
        { y: 2025, a: 'Cerberus Capital Management', t: 'SubCom (continuation vehicle)', v: 'USD 2.3bn', n: 'A single-asset continuation vehicle rather than a sale: the sponsor chose to hold the largest cable builder rather than exit it.' },
        { y: 2025, a: 'Prysmian', t: 'Xtera', v: 'undisclosed', n: 'Cable maker buying repeater and system capability, the first credible attempt at a fifth turnkey supplier in years.' },
        { y: 2020, a: 'Hengtong', t: 'Huawei Marine', v: 'undisclosed', n: 'Created HMN Tech. The rebrand did not change how Western governments treat it.' }
      ]
    },
    {
      id: 'owners-sc', name: 'System ownership', short: 'Owners', kind: 'meta',
      blurb: 'Who pays for the cable and holds title to the fibre pairs in it.',
      market: { size: 'USD ~10bn', year: 2025, basis: 'announced submarine cable investment, by owner type' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Google', p: 22 }, { c: 'Meta', p: 17 }, { c: 'Amazon', p: 8 }, { c: 'Microsoft', p: 6 }
      ],
      others: 47,
      note: 'The structural story of this industry. Cables used to be built by consortia of telecom ' +
            'carriers splitting the cost twenty ways. Since about 2016 the content companies have been ' +
            'building their own, and on the transatlantic route US hyperscalers now hold close to ninety ' +
            'percent of capacity. Google alone has an interest in dozens of systems and has built several ' +
            'entirely on its own account. The remaining "others" is still the largest single block, but it ' +
            'is carriers and consortia in slow retreat rather than a competitive field.',
      sources: ['TeleGeography', 'SubmarineNetworks.com']
    },
    {
      id: 'capacity-sc', name: 'Capacity consumption', short: 'Capacity', kind: 'meta',
      blurb: 'Who actually uses the bandwidth once it is lit.',
      market: { size: null, year: 2025, basis: 'share of used international bandwidth, by user category' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Google', p: 24 }, { c: 'Meta', p: 21 }, { c: 'Amazon', p: 16 }, { c: 'Microsoft', p: 14 }
      ],
      others: 25,
      note: 'The four largest content companies used about a tenth of international capacity in 2014. By ' +
            '2024 they were at 71%, and in 2025 hyperscalers and AI platforms together accounted for ' +
            'roughly three quarters of all used capacity. That is the fastest change in customer ' +
            'concentration anywhere on this site, and it explains the ownership shift above it entirely: ' +
            'once you are most of the traffic, renting from a consortium stops making sense.',
      sources: ['TeleGeography']
    },
    {
      id: 'routes-sc', name: 'Route concentration', short: 'Routes', kind: 'meta',
      blurb: 'Where dozens of independent systems are forced through the same few kilometres of water.',
      market: { size: null, year: 2025, basis: 'geographic concentration of systems by corridor: a count, not a market' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [],
      note: 'Named but not measured, because there is no market here to divide: this is geography acting ' +
            'as a chokepoint. A cable can be routed around a supplier but not around a continent. The Red ' +
            'Sea and the Strait of Malacca funnel most Europe-to-Asia traffic through corridors a few ' +
            'kilometres wide; the Luzon Strait carries much of intra-Asian capacity through a stretch of ' +
            'seabed that is also seismically active; and the Egyptian land crossing between the Red Sea ' +
            'and the Mediterranean is a single jurisdiction that a very large share of Europe-Asia traffic ' +
            'has to transit. Diversity of systems does not buy diversity of route, and most resilience ' +
            'planning quietly confuses the two.',
      sources: ['TeleGeography', 'ICPC']
    },

    /* ==================== WET PLANT CHILDREN ==================== */
    {
      id: 'fibre', parent: 'wet-plant', name: 'Optical fibre', short: 'Fibre',
      blurb: 'Hair-thin glass carrying light for 80 km between amplifiers, with loss measured in fractions of a decibel.',
      layout: 'chain',
      market: { size: 'USD ~9bn', year: 2025, basis: 'optical fibre revenue, all applications' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Corning', p: 21 }, { c: 'YOFC', p: 14 }, { c: 'Prysmian', p: 10 },
        { c: 'Sumitomo Electric', p: 8 }, { c: 'Furukawa Electric', p: 7 }, { c: 'Fujikura', p: 6 }
      ],
      note: 'The basis matters: this is all optical fibre, most of which goes into terrestrial and access ' +
            'networks. Submarine-grade fibre is a far narrower trade: ultra-low-loss, large effective ' +
            'area glass that only a handful of plants can make to specification, and the cable makers ' +
            'either buy from Corning, OFS and Sumitomo or draw their own. No published source splits ' +
            'submarine fibre out, so this table describes the industry the submarine buyers purchase ' +
            'from rather than the submarine market itself.',
      sources: ['Lightwave', 'Company filings']
    },
    {
      id: 'cable-armour', parent: 'wet-plant', name: 'Armour and steel wire', short: 'Armour',
      blurb: 'Galvanised steel wires laid helically around the cable wherever a trawler or an anchor might reach it.',
      market: { size: 'USD ~0.4bn', year: 2025, basis: 'submarine cable armour wire supply' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Armour is drawn steel wire bought to specification from general wire ' +
            'producers, and no source tracks who supplies it to cable makers. The engineering point is ' +
            'more interesting than the market: armour is what makes shallow-water cable heavy, expensive ' +
            'and slow to lay, and about 86% of all faults happen in exactly the shallow water where the ' +
            'armour is. It works, and it is still not enough, which is why burial depth matters more ' +
            'than steel.',
      sources: ['ICPC', 'Company statements']
    },
    {
      id: 'conductor', parent: 'wet-plant', name: 'Copper conductor', short: 'Conductor',
      blurb: 'A copper tube carrying a constant DC current the whole length of the cable to power every repeater.',
      layout: 'chain',
      market: { size: 'USD ~0.3bn', year: 2025, basis: 'copper conductor content of submarine telecom cable' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. The interesting thing here is not the supplier but the fact that the ' +
            'conductor exists at all: a transoceanic cable is powered from both ends at up to 15,000 ' +
            'volts, feeding a hundred repeaters in series along a single copper path. Lose the power feed ' +
            'and the whole system goes dark even though every fibre is intact. It is the one genuinely ' +
            'serial failure mode in an otherwise redundant design.',
      sources: ['TeleGeography', 'Company statements']
    },
    {
      id: 'cable-insulation', parent: 'wet-plant', name: 'Insulation and sheathing', short: 'Insulation',
      blurb: 'High-purity polyethylene extruded over the conductor, and the outer sheath over everything.',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'insulation and sheathing compound for submarine telecom cable' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Submarine insulation compound has to be free of the contaminants ' +
            'that would let water tree through it under pressure for twenty-five years, which is a ' +
            'materially harder specification than terrestrial cable and made by very few plants. Nobody ' +
            'publishes a split, and the cable makers treat their compound sourcing as proprietary.',
      sources: ['Company statements', 'Lightwave']
    },
    {
      id: 'branching-units', parent: 'wet-plant', name: 'Branching units', short: 'Branching',
      blurb: 'Subsea junctions that split fibre pairs off a trunk toward an additional country.',
      market: { size: 'USD ~0.3bn', year: 2025, basis: 'submarine branching unit supply' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ASN', p: 30 }, { c: 'SubCom', p: 28 }, { c: 'NEC', p: 20 }, { c: 'HMN Tech', p: 14 }
      ],
      note: 'The component that turns a point-to-point cable into a network. A branching unit sits on the ' +
            'seabed and can be reconfigured from shore, which is how a single trunk system serves eight ' +
            'landing countries. It is also a single point of failure for every branch behind it, and it ' +
            'is supplied by exactly the same four firms as everything else wet.',
      sources: ['SubmarineNetworks.com', 'TeleGeography']
    },

    /* ---- fibre chain ---- */
    {
      id: 'preform', parent: 'fibre', name: 'Fibre preform', short: 'Preform',
      blurb: 'A metre-long glass rod of exactly the right refractive profile, drawn down into hundreds of kilometres of fibre.',
      layout: 'chain',
      market: { size: 'USD ~3.4bn', year: 2025, basis: 'optical fibre preform revenue, all applications' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Corning', p: 24 }, { c: 'Shin-Etsu', p: 15 }, { c: 'Sumitomo Electric', p: 12 },
        { c: 'YOFC', p: 12 }, { c: 'Furukawa Electric', p: 9 }
      ],
      note: 'The real barrier to entry in fibre. Anyone can pull a fibre from a preform; making a preform ' +
            'with the right index profile and low enough water content is chemistry that took decades to ' +
            'learn, and preform capacity, not draw capacity, is what constrains the industry. This is ' +
            'the layer that separates the firms who make fibre from the firms who merely sell it.',
      sources: ['Lightwave', 'Company filings']
    },
    {
      id: 'silica', parent: 'preform', name: 'Synthetic high-purity silica', short: 'Silica',
      blurb: 'Glass made from silicon tetrachloride rather than sand, because sand is nowhere near pure enough.',
      market: { size: 'USD ~1.6bn', year: 2025, basis: 'synthetic fused silica revenue, all applications' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Shin-Etsu', p: 22 }, { c: 'Corning', p: 18 }, { c: 'Heraeus', p: 15 },
        { c: 'Tosoh', p: 8 }
      ],
      note: 'Communications fibre is not made from quartz sand: it is grown from vapour, because the ' +
            'impurity budget is measured in parts per billion and a single transition metal atom absorbs ' +
            'light. The same handful of Japanese and German firms supply the semiconductor industry with ' +
            'the same material, which is why fibre and chips compete for capacity more often than either ' +
            'industry admits.',
      sources: ['Lightwave', 'Company filings']
    },
    {
      id: 'germanium', parent: 'preform', name: 'Germanium dopant', short: 'Germanium',
      blurb: 'Germanium tetrachloride raises the refractive index of the fibre core. There is no easy substitute.',
      market: { size: 'USD ~0.4bn', year: 2025, basis: 'germanium production value, all applications' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Yunnan Germanium', p: 24 }, { c: 'China (all firms combined)', p: 36 },
        { c: 'Teck Resources', p: 12 }, { c: 'Umicore', p: 9 }
      ],
      note: 'Germanium is a byproduct of zinc and coal processing, produced in small quantities and ' +
            'dominated by China, which placed it under export licensing in 2023 and tightened the regime ' +
            'since. It is the quiet strategic material in this teardown: doping the fibre core is what ' +
            'makes a waveguide a waveguide, the quantities are tiny, and a licence regime on tiny ' +
            'quantities of an irreplaceable input is a far more efficient lever than a tariff on ' +
            'something large.',
      sources: ['USGS Mineral Commodity Summaries', 'Company filings']
    },
    {
      id: 'coating', parent: 'fibre', name: 'Fibre coating', short: 'Coating',
      blurb: 'Two UV-cured acrylate layers applied within milliseconds of the fibre being drawn.',
      market: { size: 'USD ~0.3bn', year: 2025, basis: 'optical fibre coating material revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Covestro', p: 34 }, { c: 'DSM-Firmenich', p: 22 }, { c: 'Momentive', p: 9 }
      ],
      note: 'A near-invisible layer with an unusually concentrated supply base: fibre coating chemistry ' +
            'is qualified into a draw tower and effectively never changed, so incumbency here is close to ' +
            'absolute. Bare glass fibre is strong in tension and destroyed by a scratch, so the coating ' +
            'applied in the first milliseconds after drawing is what decides whether the fibre survives ' +
            'being made at all.',
      sources: ['Lightwave', 'Company filings']
    },

    /* ==================== REPEATER CHILDREN ==================== */
    {
      id: 'edfa', parent: 'repeaters', name: 'Optical amplifier', short: 'EDFA',
      blurb: 'An erbium-doped fibre amplifier: a short length of doped glass that amplifies light directly, without converting it to electricity.',
      layout: 'chain',
      market: { size: 'USD ~0.5bn', year: 2025, basis: 'submarine optical amplifier supply' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'ASN', p: 29 }, { c: 'SubCom', p: 26 }, { c: 'NEC', p: 18 }, { c: 'Xtera', p: 8 }
      ],
      note: 'The single invention that made intercontinental fibre possible. Before the erbium-doped ' +
            'amplifier, crossing an ocean meant converting light back to electricity and out again every ' +
            'few tens of kilometres: expensive, slow and unrepairable at depth. The EDFA amplifies the ' +
            'light itself, passively, with nothing to fail but a pump laser. Every cable on the ' +
            'TeleGeography map exists because of a physical property of one rare earth element.',
      sources: ['TeleGeography', 'Lightwave']
    },
    {
      id: 'pump-lasers', parent: 'repeaters', name: 'Pump lasers', short: 'Pump lasers',
      blurb: '980nm laser diodes that energise the erbium. Redundant, because they are the only active part down there.',
      layout: 'chain',
      market: { size: 'USD ~0.3bn', year: 2025, basis: 'high-reliability pump laser diode supply, submarine grade' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Furukawa Electric', p: 31 }, { c: 'Lumentum', p: 22 }, { c: 'Coherent', p: 14 }
      ],
      note: 'Submarine-qualified pump lasers are a genuinely tiny and genuinely critical market. The ' +
            'reliability requirement is brutal, twenty-five years of continuous operation with no ' +
            'access, so qualification takes years and the supplier list is correspondingly short. ' +
            'Repeaters carry redundant pumps precisely because this is the one component that wears out.',
      sources: ['Lightwave', 'Company filings']
    },
    {
      id: 'repeater-housing', parent: 'repeaters', name: 'Pressure housing', short: 'Housing',
      blurb: 'A beryllium copper cylinder rated for 8,000 metres, holding the optics dry for a quarter of a century.',
      layout: 'chain',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'submarine repeater housing supply' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. The housings are built in-house by the four system suppliers and ' +
            'nobody publishes a market. The specification is what deserves attention: a pressure vessel ' +
            'that must not leak a single molecule of seawater for twenty-five years at 800 atmospheres, ' +
            'built from an alloy chosen because it is non-magnetic, corrosion resistant and strong ' +
            'enough, which is beryllium copper, and which is why the material sits one layer down.',
      sources: ['Company statements', 'TeleGeography']
    },
    {
      id: 'supervisory', parent: 'repeaters', name: 'Line monitoring', short: 'Monitoring',
      blurb: 'The supervisory system that pings each repeater from shore and locates a fault to within a kilometre.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'submarine line monitoring and supervisory equipment' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured, and disproportionately important. When a cable breaks, the first ' +
            'question is where, and the answer comes from the supervisory system measuring the ' +
            'round-trip to each repeater. Get it wrong and a ship steams to the wrong stretch of ocean, ' +
            'which at USD 60,000 or more a day is an expensive mistake. Increasingly the same fibre is ' +
            'also being used as a distributed sensor, which is how operators have begun detecting ' +
            'vessels dragging anchors across a cable in near real time.',
      sources: ['ICPC', 'Lightwave']
    },
    {
      id: 'er-fibre', parent: 'edfa', name: 'Erbium-doped fibre', short: 'Er fibre',
      blurb: 'A few metres of glass doped with erbium ions, which amplify light at exactly the wavelength glass is most transparent.',
      layout: 'chain',
      market: { size: 'USD ~0.15bn', year: 2025, basis: 'specialty erbium-doped fibre revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'OFS', p: 28 }, { c: 'Fibercore', p: 19 }, { c: 'Coherent', p: 12 }
      ],
      note: 'A coincidence of physics carries the world economy: erbium happens to amplify at 1550 ' +
            'nanometres, which happens to be the wavelength where silica glass is most transparent. If ' +
            'those two numbers had not lined up, intercontinental fibre would have been a much harder ' +
            'and much later problem. Only a few specialty fibre houses make it, in very small volumes.',
      sources: ['Lightwave', 'Company filings']
    },
    {
      id: 'erbium-oxide', parent: 'er-fibre', name: 'Erbium oxide', short: 'Erbium',
      blurb: 'A heavy rare earth, refined to optical purity, used in quantities measured in kilograms a year.',
      layout: 'chain',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'erbium oxide production value, all applications' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 62 }, { c: 'Shenghe Resources', p: 9 },
        { c: 'Lynas', p: 7 }
      ],
      note: 'Erbium is one of the heavy rare earths, and heavy separation is more concentrated in China ' +
            'than light rare earth separation is. The saving grace of this layer is volume: the world ' +
            'needs an extraordinarily small quantity of erbium to keep the internet lit, so a supply ' +
            'restriction here would be a price event rather than an outage. It is nonetheless remarkable ' +
            'that the amplification of every intercontinental data link depends on a material with this ' +
            'geography.',
      sources: ['USGS Mineral Commodity Summaries', 'Company filings']
    },
    {
      id: 're-separation', parent: 'erbium-oxide', name: 'Rare earth separation', short: 'RE separation',
      blurb: 'The solvent extraction cascade that pulls one lanthanide away from the fourteen chemically identical ones beside it.',
      market: { size: 'USD ~6bn', year: 2025, basis: 'rare earth separation and refining capacity value, all elements' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 87 }, { c: 'Lynas', p: 6 }, { c: 'MP Materials', p: 3 }
      ],
      note: 'The bottom of this teardown. Rare earths are not geologically rare; separating them is the ' +
            'hard part, because chemically they are nearly indistinguishable and it takes hundreds of ' +
            'solvent extraction stages to pull them apart. China holds an overwhelming share of that ' +
            'separation capacity: the mining is far more distributed than the refining, and the refining ' +
            'is what matters. Western projects have been announced for fifteen years and remain a rounding ' +
            'error. Note the contrast with the tractor: that machine bottoms out in a mine, this one ' +
            'bottoms out in a chemical process, and the process is the harder thing to replicate.',
      sources: ['USGS Mineral Commodity Summaries', 'Company filings']
    },
    {
      id: 'laser-diode-fab', parent: 'pump-lasers', name: 'Laser diode fabrication', short: 'Diode fab',
      blurb: 'Indium phosphide and gallium arsenide epitaxy, in fabs measured in hundreds of wafers rather than millions.',
      market: { size: 'USD ~2.2bn', year: 2025, basis: 'compound semiconductor laser diode revenue, communications' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Lumentum', p: 19 }, { c: 'Coherent', p: 17 }, { c: 'Broadcom', p: 11 },
        { c: 'Furukawa Electric', p: 9 }, { c: 'Sumitomo Electric', p: 7 }
      ],
      note: 'The contrast with the phone and laptop teardowns is the point. This is compound ' +
            'semiconductor manufacturing (indium phosphide, not silicon) on mature processes at tiny ' +
            'volumes, and the constraint is epitaxial yield and reliability qualification rather than ' +
            'lithography. None of the leading-edge foundry story that dominates the consumer teardowns ' +
            'applies here at all.',
      sources: ['Lightwave', 'Company filings']
    },
    {
      id: 'beryllium-copper', parent: 'repeater-housing', name: 'Beryllium copper', short: 'BeCu',
      blurb: 'A copper alloy that is strong, non-magnetic and corrosion resistant, and whose supply is unusually narrow.',
      market: { size: 'USD ~0.5bn', year: 2025, basis: 'beryllium and beryllium alloy production value, all applications' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Materion', p: 62 }, { c: 'China (all firms combined)', p: 18 }
      ],
      others: 20,
      note: 'One US company mines, refines and alloys most of the world\'s beryllium, from a single ' +
            'deposit in Utah. It is a genuine near-monopoly hiding in a component nobody thinks about, ' +
            'and unlike most of this teardown, the concentration is American rather than Chinese. ' +
            'Beryllium is also toxic to process, which is a substantial part of why nobody else has ' +
            'entered.',
      sources: ['USGS Mineral Commodity Summaries', 'Company filings']
    },
    {
      id: 'copper', parent: 'conductor', name: 'Copper', short: 'Copper',
      blurb: 'The power conductor. A trivial share of world copper demand, and completely irreplaceable in this application.',
      market: { size: 'USD ~230bn', year: 2025, basis: 'refined copper production value, all applications' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Codelco', p: 8 }, { c: 'BHP', p: 7 }, { c: 'Freeport-McMoRan', p: 7 },
        { c: 'Glencore', p: 5 }, { c: 'Southern Copper', p: 4 }
      ],
      note: 'Included for completeness and as a deliberate counterexample: this is the one deep input in ' +
            'the teardown with a genuinely competitive, liquid, globally traded market. A cable maker ' +
            'buying copper has price risk and no supply risk. Compare it with the erbium four nodes ' +
            'across, where the volumes are trivially small and the supply risk is the whole story, ' +
            'the size of a market tells you nothing about its fragility.',
      sources: ['USGS Mineral Commodity Summaries', 'Company filings']
    },

    /* ==================== SLTE CHILDREN ==================== */
    {
      id: 'transponders', parent: 'slte', name: 'Coherent transponders', short: 'Transponders',
      blurb: 'The line cards that modulate light into hundreds of gigabits per wavelength and undo the ocean at the far end.',
      layout: 'chain',
      market: { size: 'USD ~5.5bn', year: 2025, basis: 'coherent optical transport equipment revenue, all applications' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Ciena', p: 28 }, { c: 'Nokia', p: 18 }, { c: 'Huawei', p: 15 },
        { c: 'Cisco', p: 11 }, { c: 'Infinera', p: 8 }
      ],
      note: 'Coherent transmission is what has kept submarine cables from obsolescence. A cable laid in ' +
            '2010 carries several times its original design capacity today because the equipment at each ' +
            'end got better while the glass did nothing. Nokia bought Infinera and now appears twice in ' +
            'this table, which will consolidate in the next revision.',
      sources: ['Lightwave', 'TeleGeography']
    },
    {
      id: 'optical-terminal', parent: 'slte', name: 'Line terminal and power feed', short: 'Terminal',
      blurb: 'The wet-plant interface: multiplexing, and the high-voltage supply that powers a hundred repeaters.',
      market: { size: 'USD ~0.6bn', year: 2025, basis: 'submarine line terminal and power feed equipment' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ASN', p: 27 }, { c: 'SubCom', p: 24 }, { c: 'NEC', p: 17 }, { c: 'HMN Tech', p: 12 }
      ],
      note: 'The power feed equipment is the least glamorous item in the station and the one that can ' +
            'take the whole system down. It drives up to 15,000 volts down a copper path thousands of ' +
            'kilometres long, from both ends simultaneously, and has to hand over cleanly if one end ' +
            'fails. Supplied by the wet-plant vendors because it has to be matched to their repeaters.',
      sources: ['SubmarineNetworks.com', 'Lightwave']
    },
    {
      id: 'coherent-dsp', parent: 'transponders', name: 'Coherent DSP silicon', short: 'DSP',
      blurb: 'The digital signal processor that reverses thousands of kilometres of dispersion and nonlinearity in real time.',
      market: { size: 'USD ~2.8bn', year: 2025, basis: 'coherent DSP and optical module silicon revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Marvell', p: 29 }, { c: 'Broadcom', p: 21 }, { c: 'Ciena', p: 16 },
        { c: 'Acacia', p: 11 }, { c: 'Nokia', p: 9 }
      ],
      note: 'The one place this teardown touches leading-edge silicon, and it does so from an unusual ' +
            'angle: the DSP is the hardest chip in the system, and the ability to design it is what ' +
            'separates a systems vendor from a box assembler. Ciena and Nokia build their own to defend ' +
            'their transport franchises; everyone else buys from Marvell or Broadcom. Cisco bought Acacia ' +
            'in 2021 for exactly this capability.',
      sources: ['Lightwave', 'Company filings'],
      deals: [
        { y: 2021, a: 'Cisco', t: 'Acacia Communications', v: 'USD 4.5bn', n: 'Bought coherent DSP and module capability outright after trying to buy the output instead.' }
      ]
    },

    /* ==================== MARINE CHILDREN ==================== */
    {
      id: 'cable-ships', parent: 'marine-install', name: 'Cable ships', short: 'Ships',
      blurb: 'Fewer than sixty vessels in the world can lay or repair a submarine cable. Most were built for something else.',
      layout: 'chain',
      market: { size: '~60 vessels', year: 2025, basis: 'global cable-laying and repair fleet, by operator' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'SubCom', p: 15 }, { c: 'ASN', p: 13 }, { c: 'Global Marine', p: 12 },
        { c: 'Orange Marine', p: 10 }, { c: 'S.B. Submarine Systems', p: 9 },
        { c: 'KDDI Cable Ship', p: 7 }, { c: 'E-Marine', p: 7 }
      ],
      note: 'The hardest constraint on this site, and it is not a factory. Fewer than sixty cable vessels ' +
            'exist worldwide and the count has barely moved while route mileage grew about fifty percent. ' +
            'Most are converted from other trades. Roughly two thirds of the maintenance fleet reaches ' +
            'end of life within fifteen years; replacing and modestly expanding it would cost on the ' +
            'order of USD 3bn for about twenty hulls, at USD 140m to 150m and twenty-six months each, ' +
            'and essentially nobody is ordering, because a cable ship earns money only when something ' +
            'breaks or someone builds. Every hyperscaler cable announcement, every AI datacentre buildout ' +
            'that needs transoceanic capacity, queues for the same handful of hulls.',
      sources: ['ICPC', 'Capacity Media', 'TeleGeography']
    },
    {
      id: 'burial-plough', parent: 'marine-install', name: 'Ploughs and ROVs', short: 'Ploughs',
      blurb: 'Towed seabed ploughs that bury cable up to three metres down, and remotely operated vehicles that do it where a plough cannot.',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'submarine cable burial equipment supply' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'SubCom', p: 22 }, { c: 'Global Marine', p: 16 }, { c: 'ASN', p: 14 },
        { c: 'Osbit', p: 7 }
      ],
      note: 'Burial is the only defence that actually works. Armour resists a glancing blow; burial ' +
            'prevents contact. Since fishing gear and anchors cause about 86% of faults, the depth a ' +
            'plough achieves in the first few hundred kilometres of continental shelf does more for a ' +
            'system\'s lifetime availability than any amount of steel around the cable.',
      sources: ['ICPC', 'SubmarineNetworks.com']
    },
    {
      id: 'jointing', parent: 'marine-install', name: 'Jointing and splicing', short: 'Jointing',
      blurb: 'Fusing two cable ends into a housing that will hold pressure for decades, on a moving deck.',
      market: { size: 'USD ~0.1bn', year: 2025, basis: 'submarine cable jointing consumables and certification' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. There is no real market here, jointing is a certified skill held by ' +
            'a few hundred people worldwide, and the qualification is system-specific. A universal joint ' +
            'kit takes a trained jointer many hours in a clean environment on a ship that is rolling. ' +
            'It is the least automatable step in the whole chain and, like the ships, it is quietly ' +
            'ageing: the workforce is small, specialised and not obviously being replaced.',
      sources: ['ICPC', 'Company statements']
    },
    {
      id: 'route-survey', parent: 'marine-install', name: 'Pre-lay survey and clearance', short: 'Pre-lay',
      blurb: 'Sweeping the route for wrecks, munitions and abandoned cable before a ship commits to it.',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'pre-lay grapnel run and route clearance services' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. The seabed on any well-travelled route is littered with a century of ' +
            'abandoned telegraph and coaxial cable, wrecks, and in the North Sea and Baltic a great deal ' +
            'of unexploded ordnance. Clearing a corridor is unglamorous, slow, and the thing that stops a ' +
            'USD 250m project being derailed on day one.',
      sources: ['ICPC', 'SubmarineNetworks.com']
    },
    {
      id: 'shipbuilding', parent: 'cable-ships', name: 'Cable ship construction', short: 'Shipbuilding',
      blurb: 'A purpose-built cable ship costs USD 140m to 150m and takes twenty-six months to deliver.',
      market: { size: 'USD ~0.4bn', year: 2025, basis: 'cable ship newbuild and conversion contract value' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Named but not measured, because there is barely a market to measure, newbuild cable ship ' +
            'orders are counted in ones. That is the finding. A vessel takes over two years to deliver ' +
            'and lasts decades, so the fleet available in 2035 is being decided now by the near-absence ' +
            'of orders, and no single owner has the incentive to fix a shortage everyone shares. It is a ' +
            'textbook collective action problem sitting underneath the world\'s most critical ' +
            'infrastructure.',
      sources: ['Capacity Media', 'ICPC']
    },
    {
      id: 'ship-operators', parent: 'cable-ships', name: 'Marine crew and operations', short: 'Crew',
      blurb: 'Officers and cable engineers qualified to work cable at sea, and the day rate they command.',
      market: { size: 'USD ~0.6bn', year: 2025, basis: 'cable ship operating and crewing cost' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. A cable ship day rate runs to tens of thousands of dollars and the ' +
            'crew skills are specific enough that a vessel cannot simply be brought back from lay-up. ' +
            'The ageing-fleet problem is therefore also an ageing-workforce problem, and it is the half ' +
            'of the constraint that USD 3bn of shipbuilding would not solve.',
      sources: ['Capacity Media', 'ICPC']
    },

    /* ============ SURVEY, LANDING, MAINTENANCE CHILDREN ============ */
    {
      id: 'marine-survey', parent: 'survey-permits', name: 'Marine route survey', short: 'Survey',
      blurb: 'Multibeam bathymetry and sub-bottom profiling along a corridor thousands of kilometres long.',
      market: { size: 'USD ~0.4bn', year: 2025, basis: 'submarine cable route survey services revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Fugro', p: 26 }, { c: 'EGS Survey', p: 12 }, { c: 'Ocean Infinity', p: 8 }
      ],
      note: 'Surveying is where a route is really decided: slope stability, sediment type, existing ' +
            'infrastructure and fishing intensity all move the line on the chart, and every deviation ' +
            'costs cable. Fugro is the clear leader in a market that overlaps heavily with offshore wind ' +
            'and oil and gas, which means cable survey capacity competes with the energy transition for ' +
            'the same vessels.',
      sources: ['SubmarineNetworks.com', 'Company filings']
    },
    {
      id: 'permitting', parent: 'survey-permits', name: 'Permits and consents', short: 'Permits',
      blurb: 'Landing party licences, environmental consents and seabed rights, in every jurisdiction the route touches.',
      market: { size: null, year: 2025, basis: 'legal and consenting workstream: a cost, not a market' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Not a market and frequently the critical path. A cable crossing eight exclusive economic ' +
            'zones needs permission from each, and any one of them can refuse. Consenting has become the ' +
            'main instrument of cable geopolitics: systems are now routed to avoid particular waters ' +
            'entirely, and several announced projects have been re-planned around a jurisdiction rather ' +
            'than negotiate with it. The engineering is largely solved; the paperwork is not.',
      sources: ['TeleGeography', 'ICPC']
    },
    {
      id: 'project-mgmt', parent: 'survey-permits', name: 'Project management', short: 'PM',
      blurb: 'Holding a three-year, multi-jurisdiction marine construction programme to schedule.',
      market: { size: null, year: 2025, basis: 'owner-side project management and engineering fees' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Not a measurable market: a small consultancy trade plus owner staff. Worth naming because ' +
            'it is where consortium projects go wrong: aligning eight owners with different regulators, ' +
            'currencies and board approval cycles is genuinely harder than laying the cable, and it is a ' +
            'large part of why single-owner hyperscaler cables now get built faster than consortium ones.',
      sources: ['SubmarineNetworks.com', 'Company statements']
    },
    {
      id: 'landing-station', parent: 'landing', name: 'Cable landing station', short: 'Station',
      blurb: 'A hardened building a few hundred metres from the beach, where the wet plant becomes a network.',
      market: { size: 'USD ~0.3bn', year: 2025, basis: 'cable landing station construction and fit-out' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Named but not measured. Landing stations are increasingly the point of contention in cable ' +
            'geopolitics, because they are where a cable becomes physically and legally accessible. ' +
            'Several countries now require domestic ownership or operation of the station regardless of ' +
            'who owns the cable, which is a quiet but effective way of taking a position on ' +
            'infrastructure you did not pay for.',
      sources: ['TeleGeography', 'SubmarineNetworks.com']
    },
    {
      id: 'power-feed', parent: 'landing', name: 'Power feed equipment', short: 'Power',
      blurb: 'The high-voltage supply that pushes constant current the whole length of the cable.',
      market: { size: 'USD ~0.15bn', year: 2025, basis: 'submarine power feed equipment supply' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured; supplied by the wet-plant vendors. Its importance is out of all ' +
            'proportion to its cost: a station losing its power feed takes down every repeater on its ' +
            'half of the cable, which is why landing stations carry generator and battery backup sized ' +
            'for days rather than hours.',
      sources: ['SubmarineNetworks.com', 'Company statements']
    },
    {
      id: 'backhaul', parent: 'landing', name: 'Terrestrial backhaul', short: 'Backhaul',
      blurb: 'The fibre from a remote beach to the data centre where the traffic is actually wanted.',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'backhaul build attributable to new cable landings' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Cables land where the geography allows, which is rarely where the ' +
            'demand is: Marseille, Fortaleza, Mombasa and the Cornish coast are cable landfalls for ' +
            'reasons of seabed rather than population. The backhaul from the beach to the nearest major ' +
            'interconnection point is a real cost and, in some markets, a monopoly held by the incumbent ' +
            'carrier who got there first.',
      sources: ['TeleGeography', 'Company statements']
    },
    {
      id: 'maintenance-zones', parent: 'maintenance', name: 'Maintenance zone agreements', short: 'Zones',
      blurb: 'Shared standby contracts that keep a repair ship within reach of a region, funded by every owner in it.',
      market: { size: 'USD ~0.4bn', year: 2025, basis: 'regional maintenance agreement subscription revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Named but not measured. The zone model is a genuinely elegant piece of collective ' +
            'infrastructure, owners pool payments to keep a vessel on standby that none of them could ' +
            'justify alone, and it is under strain, because standby economics have not kept pace with ' +
            'the number of cables needing cover. The agreements are also the mechanism through which the ' +
            'ageing fleet problem will actually be felt: not as a headline, but as a repair that takes ' +
            'six weeks instead of two.',
      sources: ['ICPC', 'Capacity Media']
    },
    {
      id: 'depot-spares', parent: 'maintenance', name: 'Depot and spares', short: 'Spares',
      blurb: 'Kilometres of spare cable and matched repeaters, stored in coastal depots for twenty-five years.',
      market: { size: 'USD ~0.2bn', year: 2025, basis: 'spares provisioning and depot storage' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Named but not measured. Every system has to buy and warehouse spare cable and repeaters ' +
            'matched to its own design at construction, because a repeater built for one system will not ' +
            'work in another and the manufacturing line will be long gone. It is a quiet obsolescence ' +
            'risk: a twenty-five year old system depends on spares made a quarter of a century earlier by ' +
            'a company that may no longer exist in the same form.',
      sources: ['ICPC', 'TeleGeography']
    }
  ]
});
