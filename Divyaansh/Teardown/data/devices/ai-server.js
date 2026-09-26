/* Teardown :: AI server rack
 *
 * Seventh flagship, and the fastest-moving device on the site, several of
 * these layers changed materially between 2025 and 2026, so `asOf` carries
 * more weight here than anywhere else. Where a figure has a known 2026
 * reading that differs from the 2025 one, the note says both.
 *
 * ---- the terminus is deliberately not silicon ----
 *
 * The obvious deep chain for an AI rack is accelerator -> foundry ->
 * lithography, and it ends in the same building in Veldhoven as the laptop
 * teardown. That chain is real and it is mapped in depth on the laptop, so it
 * is kept short here and cross-linked rather than re-derived.
 *
 * The chain this device actually owns runs the other way, outward from the
 * rack into the building and then into the grid. An AI rack draws 130 kW
 * where a conventional one drew 10, and the binding constraint on the entire
 * AI build-out is no longer chips: it is interconnection queues, transformer
 * lead times and gas turbine order books. A data centre takes two to three
 * years to build and the grid connection it needs takes four to eight. That
 * mismatch is the finding, and no other teardown here ends in a queue.
 */
TD.device({
  id: 'ai-server',
  name: 'AI server rack',
  icon: 'rack',
  category: 'Data centre and AI',
  tagline: 'Three million dollars a rack, and the thing it is waiting for is a grid connection.',
  unit: { volume: '~USD 600bn of hyperscaler capex (2026)', price: 'USD ~3.5m per NVL72-class rack, ~130kW' },
  intro: 'A single rack holds more semiconductor value than a thousand laptops and the supplier list is ' +
         'shorter. But the interesting change is at the other end: the compute is buildable and the ' +
         'electricity increasingly is not. Follow this machine outward rather than downward and it ends ' +
         'in a transformer order book and an interconnection queue.',
  view: { w: 1000, h: 640 },
  frames: [{ label: 'Compute tray', x: 130, y: 62, w: 740, h: 176 },
           { label: 'Fabric, storage and platform', x: 130, y: 250, w: 740, h: 176 },
           { label: 'Power and cooling', x: 130, y: 438, w: 740, h: 188 }],

  /* ============================ STORY ============================
   * `stages` must account for all 45 nodes exactly once.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'The chips are the easy part now.',
    lede: 'Forty-five mapped layers, five tiers deep. For two years the constraint on AI was advanced ' +
          'packaging capacity at one company. That gap is closing. What replaced it is not a ' +
          'semiconductor problem at all: a rack that draws 130 kilowatts, a data centre that takes ' +
          'three years to build, and a grid connection that takes eight.',

    tierNote: 'Every layer inside the rack is concentrated. The layer outside it is not concentrated: it is simply full.',
    geoLede: 'By component this is a Taiwanese and Korean machine wearing American badges: the silicon ' +
             'is designed in California, fabricated and packaged in Taiwan, remembered in Korea and ' +
             'assembled by Taiwanese ODMs. By constraint it is American and European, because that is ' +
             'where the grid queues and the turbine order books are.',

    findings: [
      { title: 'The buyers are designing their way out',
        body: 'Nvidia still holds the overwhelming majority of merchant AI silicon, and that is not the ' +
              'trend. Custom accelerators built by the hyperscalers themselves: Google\'s TPU, ' +
              'Amazon\'s Trainium, Meta\'s and OpenAI\'s programmes with Broadcom, are growing far ' +
              'faster than merchant GPUs, with in-house silicon forecast to grow around 45% in 2026 ' +
              'against roughly 16% for GPUs. Six customers fund essentially this entire industry, and ' +
              'all six are now also suppliers to themselves.',
        nodes: ['accelerator', 'buyers'] },
      { title: 'The bottleneck moved from packaging to power',
        body: 'Through 2024 and 2025 the hard limit was CoWoS: a back-end packaging step almost nobody ' +
              'outside the industry could name, gating a trillion dollars of market value. TSMC roughly ' +
              'doubled that capacity twice and began outsourcing the front half of it to OSATs, and the ' +
              'supply gap is closing. The constraint that replaced it cannot be fixed by capital ' +
              'expenditure on the same timescale: grid connection queues, transformer lead times that ' +
              'have doubled in three years, and gas turbine order books running past 2030.',
        nodes: ['cowos', 'grid-connect', 'turbines'] },
      { title: 'Demand is more concentrated than supply',
        body: 'This is the unusual structural fact about the AI trade and it is rarely priced. In most ' +
              'markets a concentrated supplier faces fragmented customers. Here roughly six buyers ' +
              'underwrite the whole complex, with the top four alone approaching six hundred billion ' +
              'dollars of capital expenditure in 2026. Every supplier in this teardown has customer ' +
              'concentration that would fail an ordinary diligence screen, and much of the newer ' +
              'capacity is financed with debt secured on hardware that depreciates fast.',
        nodes: ['buyers', 'financing-srv', 'cloud'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 45. */
    stages: [
      { id: 'design', name: 'Design tools and lithography',
        note: 'Before any of it exists: three EDA vendors, and one lithography supplier shared with ' +
              'every other advanced chip on this site.',
        nodes: ['accel-eda', 'accel-litho'] },
      { id: 'fab', name: 'Fabrication and packaging',
        note: 'Where the die is made and then bonded to its memory. For two years this tier, not the ' +
              'wafer, was the binding constraint on the entire industry.',
        nodes: ['accel-foundry', 'accel-substrate', 'interposer', 'cowos-osat', 'cowos'] },
      { id: 'memory', name: 'High bandwidth memory',
        note: 'Stacked DRAM bonded beside the logic die. The actual limit on how fast a model trains, ' +
              'and the layer that rewrote the memory cycle.',
        nodes: ['hbm-dram', 'hbm-tsv', 'hbm'] },
      { id: 'compute', name: 'Compute silicon',
        note: 'The accelerator and the host processor that feeds it. Roughly two thirds of the cost of ' +
              'the rack sits in this stage.',
        nodes: ['accelerator', 'host-cpu'] },
      { id: 'fabric', name: 'Interconnect',
        note: 'What turns seventy-two accelerators into one machine, and thousands of them into one ' +
              'cluster. Copper inside the rack, optics between them.',
        nodes: ['switch-silicon', 'nic', 'scale-up', 'fabric',
                'optics-laser', 'optics-dsp', 'transceiver', 'optics'] },
      { id: 'storage', name: 'Storage',
        note: 'Flash for the hot tier and an enormous amount of spinning disk underneath it: a ' +
              'technology written off for fifteen years and now sold out.',
        nodes: ['ssd-srv', 'hdd-srv', 'storage-srv'] },
      { id: 'thermal', name: 'Cooling',
        note: 'Air stopped working above about 40 kW a rack. Everything here existed as a niche five ' +
              'years ago and is now mandatory.',
        nodes: ['cold-plate', 'cdu', 'rear-door', 'cooling-srv'] },
      { id: 'power', name: 'Power, rack to building',
        note: 'Converting, distributing and backing up 130 kilowatts per rack, and then the building ' +
              'infrastructure that has to deliver it.',
        nodes: ['psu', 'busbar', 'bbu', 'rack-power',
                'ups-switchgear', 'onsite-gen', 'facility-power'] },
      { id: 'grid', name: 'The grid',
        note: 'Read this stage as the end of the teardown. It is the only tier here that money cannot ' +
              'shorten, and it is now the one that decides how fast AI can actually be deployed.',
        nodes: ['grid-connect', 'generation', 'turbines'] },
      { id: 'assembly', name: 'Rack and integration',
        note: 'Sheet metal, blind-mate connectors and the integration labour that makes a three million ' +
              'dollar machine fit together. Low technology, and the point of physical control.',
        nodes: ['sheet-metal-srv', 'cable-harness-srv', 'chassis-srv', 'unpriced-srv'] },
      { id: 'market', name: 'Who builds, buys and rents it',
        note: 'The assembler whose logo is never on the box, the six customers who fund the industry, ' +
              'the clouds that rent it out, and the debt behind the newest capacity.',
        nodes: ['odm-srv', 'buyers', 'cloud', 'financing-srv'] }
    ],

    flow: {
      lanes: [
        { label: 'Silicon', steps: ['accel-eda', 'accel-foundry', 'cowos', 'accelerator', 'chassis-srv'],
          feed: { label: 'Memory', steps: ['hbm-dram', 'hbm-tsv', 'hbm'] } },
        { label: 'Interconnect', steps: ['switch-silicon', 'optics-laser', 'transceiver', 'fabric'] },
        { label: 'Cooling', steps: ['cold-plate', 'cdu', 'cooling-srv'] },
        { label: 'Power', steps: ['turbines', 'generation', 'grid-connect', 'facility-power', 'rack-power'] }
      ],
      converge: ['odm-srv', 'buyers']
    }
  },

  nodes: [

    /* ==================== ROW 1 :: COMPUTE TRAY ==================== */
    {
      id: 'accelerator', name: 'AI accelerator', short: 'GPU',
      shape: { x: 150, y: 82, w: 300, h: 146 },
      blurb: 'The GPU or custom ASIC that does the training and inference. Over half the cost of the rack.',
      bomPct: 52, layout: 'chain',
      market: { size: 'USD ~286bn', year: 2026, basis: 'AI data centre chip revenue including captive silicon' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Nvidia', p: 71 }, { c: 'Google', p: 10 }, { c: 'AMD', p: 6 },
        { c: 'Amazon', p: 5 }, { c: 'Huawei', p: 3 }, { c: 'Intel', p: 1 }
      ],
      note: 'On merchant silicon that anyone can buy, Nvidia is closer to ninety percent. Google and ' +
            'Amazon appear here only because they design accelerators for their own use and cannot ' +
            'sell them to you. The moat is CUDA rather than the transistor, fifteen years of software ' +
            'every framework assumes. But read the trend, not the level: cloud providers\' in-house ' +
            'ASICs are forecast to grow around 45% in 2026 against roughly 16% for GPUs, and Omdia now ' +
            'expects the growth rate of this market to peak as that shift runs. The buyers are ' +
            'designing their way out.',
      sources: ['Omdia', 'TrendForce', 'TechInsights', 'Company filings'],
      deals: [
        { y: 2025, a: 'AMD', t: 'ZT Systems', v: 'USD 4.9bn', n: 'Bought rack-scale system design to compete with Nvidia at the rack rather than the chip. Manufacturing arm sold on to Sanmina.' },
        { y: 2025, a: 'Nvidia', t: 'Intel', v: 'USD 5bn stake', n: 'Investment plus a co-development agreement on x86 and RTX products.' },
        { y: 2025, a: 'Broadcom', t: 'OpenAI custom accelerator programme', v: '10GW commitment', n: 'The clearest sign that the largest buyers intend to design their way out of Nvidia pricing.' }
      ]
    },
    {
      id: 'hbm', name: 'High bandwidth memory', short: 'HBM',
      shape: { x: 470, y: 82, w: 220, h: 146 },
      blurb: 'DRAM dies stacked twelve or sixteen high and bonded beside the accelerator. The real limit on AI performance.',
      bomPct: 16, layout: 'chain',
      market: { size: 'USD ~62bn', year: 2026, basis: 'HBM revenue' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [ { c: 'SK hynix', p: 58 }, { c: 'Samsung', p: 26 }, { c: 'Micron', p: 16 } ],
      note: 'Three suppliers, and for two years effectively one, because SK hynix was the only vendor ' +
            'qualified on Nvidia\'s top parts, it held around 63% of HBM revenue in 2025. The 2026 ' +
            'reading is different and moving: SK hynix slipped to roughly 58% in the first quarter as ' +
            'Samsung qualified HBM4 and its own HBM4 ran into interface problems that pushed volume ' +
            'production later in the year. HBM consumes roughly three times the wafer area per bit of ' +
            'standard DRAM, which is why conventional memory went short and stayed short, and why ' +
            'suppliers are expected to keep pricing power into 2027.',
      sources: ['TrendForce', 'Counterpoint', 'Company filings']
    },
    {
      id: 'host-cpu', name: 'Host CPU', short: 'CPU',
      shape: { x: 710, y: 82, w: 140, h: 146 },
      blurb: 'The general purpose processor feeding the accelerators. Increasingly an afterthought, and increasingly Arm.',
      bomPct: 4,
      market: { size: 'USD ~38bn', year: 2026, basis: 'server CPU shipments, unit share' },
      asOf: '2026', confidence: 'medium',
      shares: [
        { c: 'Intel', p: 54 }, { c: 'AMD', p: 35 }, { c: 'Ampere', p: 5 }, { c: 'Amazon', p: 4 }
      ],
      note: 'AMD has passed half of server CPU *revenue* at points despite lower unit share, because it ' +
            'wins the high core-count parts: the basis matters and the two readings diverge sharply. ' +
            'Arm-based server silicon is now a real third force, mostly through Amazon Graviton, which ' +
            'is captive and therefore invisible in merchant tables. Nvidia began selling its Vera CPU ' +
            'standalone in 2026, which is the first time the accelerator vendor has competed here ' +
            'directly.',
      sources: ['Mercury Research', 'TrendForce', 'Company filings'],
      deals: [
        { y: 2025, a: 'SoftBank', t: 'Ampere Computing', v: 'USD 6.5bn', n: 'Pairs an Arm server CPU designer with SoftBank\'s Arm stake and its data centre ambitions.' }
      ]
    },

    /* ============ ROW 2 :: FABRIC, STORAGE AND PLATFORM ============ */
    {
      id: 'fabric', name: 'Networking and fabric', short: 'Networking',
      shape: { x: 150, y: 270, w: 220, h: 146 },
      blurb: 'The switches and NICs that let thousands of accelerators behave as one machine.',
      bomPct: 8, layout: 'board',
      market: { size: 'USD ~62bn', year: 2026, basis: 'data centre networking silicon and systems revenue' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Broadcom', p: 46 }, { c: 'Nvidia', p: 23 }, { c: 'Cisco', p: 8 },
        { c: 'Marvell', p: 7 }, { c: 'Arista', p: 6 }
      ],
      note: 'Nvidia bought Mellanox for USD 6.9bn in 2020, which at the time looked expensive and in ' +
            'hindsight bought the company the ability to sell a rack rather than a chip. It is probably ' +
            'the single best-returning deal of the decade. The live contest is scale-up versus ' +
            'scale-out: proprietary NVLink inside the rack against the industry\'s attempt to ' +
            'standardise on Ethernet and UALink between them.',
      sources: ['Dell\'Oro Group', '650 Group', 'Company filings'],
      deals: [
        { y: 2020, a: 'Nvidia', t: 'Mellanox', v: 'USD 6.9bn', n: 'InfiniBand plus Ethernet. Turned Nvidia from a component vendor into a systems vendor.' },
        { y: 2025, a: 'HPE', t: 'Juniper Networks', v: 'USD 14bn', n: 'Closed July 2025 after a US antitrust suit was settled with divestiture conditions.' }
      ]
    },
    {
      id: 'optics', name: 'Optical interconnect', short: 'Optics',
      shape: { x: 390, y: 270, w: 220, h: 146 },
      blurb: '800G and 1.6T pluggable transceivers, and the beginning of co-packaged optics on the switch itself.',
      bomPct: 5, layout: 'board',
      market: { size: 'USD ~26bn', year: 2026, basis: 'data centre optical transceiver revenue' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Innolight', p: 25 }, { c: 'Coherent', p: 14 }, { c: 'Eoptolink', p: 14 },
        { c: 'Accelink', p: 8 }, { c: 'Lumentum', p: 8 }, { c: 'HG Genuine', p: 6 }
      ],
      note: 'Chinese firms took the module assembly; American and Japanese firms kept the lasers and ' +
            'the indium phosphide inside them. When a supply chain splits like that the profit is ' +
            'almost always upstream, and this one is a clean worked example: the module makers ship ' +
            'the volume and the laser makers hold the margin.',
      sources: ['LightCounting', 'Company filings'],
      deals: [
        { y: 2022, a: 'II-VI', t: 'Coherent', v: 'USD 7bn', n: 'Merged and took the Coherent name. Consolidated the western laser and photonics base.' }
      ]
    },
    {
      id: 'storage-srv', name: 'Storage', short: 'Storage',
      shape: { x: 630, y: 270, w: 220, h: 146 },
      blurb: 'Enterprise NVMe flash for the hot tier, and an enormous amount of hard disk underneath it.',
      bomPct: 3, layout: 'board',
      market: { size: 'USD ~52bn', year: 2026, basis: 'enterprise SSD and nearline HDD revenue' },
      asOf: '2026', confidence: 'medium',
      shares: [
        { c: 'Samsung', p: 25 }, { c: 'SK hynix', p: 21 }, { c: 'Micron', p: 14 },
        { c: 'Seagate', p: 14 }, { c: 'Western Digital', p: 12 }, { c: 'Kioxia', p: 8 }
      ],
      note: 'Nearline hard disk is a two-firm market and, after fifteen years of being written off, is ' +
            'sold out years ahead. Not every legacy technology dies: training corpora are enormous, ' +
            'read infrequently and cost-sensitive, which is exactly what spinning disk is still best ' +
            'at. The flash side meanwhile competes with HBM for the same fab capacity.',
      sources: ['TrendForce', 'Company filings']
    },

    /* ================ ROW 3 :: POWER AND COOLING ================ */
    {
      id: 'rack-power', name: 'Rack power', short: 'Power',
      shape: { x: 150, y: 458, w: 220, h: 152 },
      blurb: 'Power shelves, busbar and battery backup converting facility supply to 48V or 800V DC.',
      bomPct: 4, layout: 'board',
      market: { size: 'USD ~22bn', year: 2026, basis: 'server power supply and rack power distribution revenue' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Delta Electronics', p: 33 }, { c: 'Lite-On', p: 14 }, { c: 'Chicony', p: 10 },
        { c: 'Vertiv', p: 9 }, { c: 'Murata', p: 5 }
      ],
      note: 'Delta was a commodity notebook adapter maker for twenty years. AI racks turned power ' +
            'conversion into a technology sale with real margin, and Delta is the single biggest ' +
            'beneficiary in the Taiwanese supply chain. The move from 48V to 800V DC distribution now ' +
            'underway is the largest change in rack power architecture in two decades, and it exists ' +
            'because copper losses at 130 kilowatts stopped being tolerable.',
      sources: ['Dell\'Oro Group', 'TrendForce', 'Company filings']
    },
    {
      id: 'cooling-srv', name: 'Liquid cooling', short: 'Cooling',
      shape: { x: 390, y: 458, w: 220, h: 152 },
      blurb: 'Cold plates, manifolds, coolant distribution units and rear-door heat exchangers.',
      bomPct: 4, layout: 'board',
      market: { size: 'USD ~16bn', year: 2026, basis: 'data centre liquid cooling revenue' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Vertiv', p: 20 }, { c: 'Boyd', p: 13 }, { c: 'CoolIT', p: 11 },
        { c: 'Delta Electronics', p: 9 }, { c: 'AVC', p: 8 }, { c: 'nVent', p: 7 }
      ],
      note: 'Air stopped being enough above roughly 40 kilowatts a rack, and an NVL72 draws three times ' +
            'that. This is the most active mid-market M&A theatre in the whole build-out: growth well ' +
            'above forty percent a year, leaders that are sub-scale, and both strategics and sponsors ' +
            'paying up. If you want actionable deal flow rather than headlines, this row is where it is.',
      sources: ['Dell\'Oro Group', 'Company filings'],
      deals: [
        { y: 2025, a: 'Schneider Electric', t: 'Motivair', v: 'USD ~850m for 75%', n: 'Bought direct-to-chip liquid cooling capability outright rather than build it.' },
        { y: 2023, a: 'KKR', t: 'CoolIT Systems', v: 'USD ~270m', n: 'Sponsor entry into cold plate manufacturing, well ahead of the demand curve.' },
        { y: 2024, a: 'Vertiv', t: 'CoolTera', v: 'undisclosed', n: 'Added coolant distribution infrastructure to a facility-level portfolio.' }
      ]
    },
    {
      id: 'chassis-srv', name: 'Rack and integration', short: 'Rack',
      shape: { x: 630, y: 458, w: 220, h: 152 },
      blurb: 'Sheet metal, rails, blind-mate midplanes, cable harnesses and the labour to make it all fit.',
      bomPct: 2, layout: 'board',
      market: { size: 'USD ~16bn', year: 2026, basis: 'server chassis and rack integration revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Foxconn', p: 34 }, { c: 'Quanta', p: 18 }, { c: 'Wistron', p: 12 }, { c: 'Supermicro', p: 8 }
      ],
      note: 'Low technology, high revenue, and increasingly the point of physical control. Whoever ' +
            'integrates the rack sees the whole bill of materials and can move up into it, which is ' +
            'exactly what AMD bought when it paid USD 4.9bn for ZT Systems and immediately sold the ' +
            'factories on.',
      sources: ['TrendForce', 'Company filings']
    },
    {
      id: 'unpriced-srv', name: 'Not separately priced', short: 'Unpriced',
      blurb: 'Firmware and software enablement, burn-in and test, freight, installation and commissioning.',
      bomPct: 2,
      market: { size: null, year: 2026, basis: 'residual share of delivered rack cost, not a market' },
      asOf: '2026', confidence: 'low',
      shares: [],
      note: 'Smaller as a share than on any other teardown here, because the silicon dominates so ' +
            'completely, but larger in absolute terms than the entire bill of materials of most ' +
            'devices on this site. Commissioning an AI cluster is a months-long exercise in finding ' +
            'the handful of links and modules that do not quite work, and it is almost never counted ' +
            'as part of the hardware cost.',
      sources: ['Company statements', 'Dell\'Oro Group']
    },

    /* ============================ META ============================ */
    {
      id: 'buyers', name: 'Who is buying', short: 'Buyers', kind: 'meta',
      blurb: 'Demand is more concentrated than supply, which is unusual and matters for anyone underwriting this cycle.',
      market: { size: 'USD ~1tn', year: 2026, basis: 'global data centre capital expenditure' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Amazon', p: 20 }, { c: 'Microsoft', p: 19 }, { c: 'Google', p: 16 },
        { c: 'Meta', p: 13 }, { c: 'Oracle', p: 7 }, { c: 'ByteDance', p: 5 }
      ],
      note: 'The top four US hyperscalers alone entered 2026 with combined data centre capital ' +
            'expenditure approaching six hundred billion dollars, against roughly a trillion globally, ' +
            'after the market grew about 57% in 2025. Roughly six buyers underwrite the entire AI ' +
            'hardware complex. Every supplier in this teardown has customer concentration that would ' +
            'fail a normal diligence screen, and that is the central risk in the trade, rarely priced ' +
            'as one, because while the capex is rising nobody has to think about it.',
      sources: ['Dell\'Oro Group', 'S&P Global Market Intelligence', 'Company filings']
    },
    {
      id: 'odm-srv', name: 'Server ODM', short: 'ODM', kind: 'meta',
      blurb: 'Who physically builds AI servers, mostly for customers whose logo never appears on the box.',
      market: { size: 'USD ~260bn', year: 2026, basis: 'AI server ODM and OEM revenue' },
      asOf: '2026', confidence: 'medium',
      shares: [
        { c: 'Foxconn', p: 37 }, { c: 'Quanta', p: 19 }, { c: 'Wiwynn', p: 13 },
        { c: 'Inventec', p: 9 }, { c: 'Supermicro', p: 7 }, { c: 'Dell', p: 6 }
      ],
      note: 'The same Taiwanese cohort that builds notebooks, and in several cases the same buildings. ' +
            'The difference is content value: one AI rack carries more revenue than several thousand ' +
            'laptops, which is why their margins and their multiples both re-rated. It is the clearest ' +
            'illustration on this site of an ODM position being worth completely different amounts ' +
            'depending on what passes through it.',
      sources: ['TrendForce', 'Company filings']
    },
    {
      id: 'cloud', name: 'Cloud infrastructure', short: 'Cloud', kind: 'meta',
      blurb: 'The layer that rents all of this out by the hour.',
      market: { size: 'USD ~460bn', year: 2026, basis: 'cloud infrastructure services revenue' },
      asOf: '2026', confidence: 'high',
      shares: [
        { c: 'Amazon', p: 29 }, { c: 'Microsoft', p: 23 }, { c: 'Google', p: 14 },
        { c: 'Alibaba', p: 4 }, { c: 'Oracle', p: 3 }, { c: 'Tencent', p: 2 }
      ],
      note: 'Three firms hold about two thirds of global cloud, and the shape has been stable for ' +
            'years. Note the basis: this measures spend on cloud *services*, which is a different ' +
            'question from who owns the hardware: the neocloud operators renting GPUs by the hour ' +
            'barely register here while consuming a meaningful share of the accelerators above.',
      sources: ['Synergy Research', 'Canalys', 'Company filings']
    },
    {
      id: 'financing-srv', name: 'How it is financed', short: 'Financing', kind: 'meta',
      blurb: 'Increasingly not from cash flow. The newest capacity is debt secured on depreciating hardware.',
      market: { size: null, year: 2026, basis: 'financing structure, not a market with shares' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [],
      note: 'Named but not measured, and the layer most likely to matter in hindsight. Hyperscaler ' +
            'capex was historically funded from operating cash flow; the marginal dollar increasingly ' +
            'is not, and the neocloud cohort renting GPUs is financed largely with debt secured on ' +
            'hardware whose useful life is contested, depreciation schedules across this industry ' +
            'range from three to six years for the same silicon. That is a wide spread for an ' +
            'assumption that determines whether the returns exist. No published source splits this ' +
            'properly, which is itself worth noting on a page about who owns what.',
      sources: ['S&P Global Market Intelligence', 'Company filings']
    },

    /* ==================== ACCELERATOR UPSTREAM ==================== */
    {
      id: 'accel-foundry', parent: 'accelerator', name: 'Leading edge foundry', short: 'Foundry',
      blurb: 'Every serious AI accelerator on the planet is manufactured by the same company.',
      layout: 'chain',
      market: { size: 'USD ~190bn', year: 2026, basis: 'pure-play foundry revenue, all nodes' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'TSMC', p: 71 }, { c: 'Samsung Foundry', p: 7 }, { c: 'SMIC', p: 5 },
        { c: 'UMC', p: 4 }, { c: 'GlobalFoundries', p: 4 }
      ],
      note: 'Nvidia, AMD, Google, Amazon, Broadcom and Marvell all queue at the same door. TSMC is the ' +
            'true clearing house of the AI trade and prices accordingly, with 2026 capital expenditure ' +
            'reported near USD 50bn. At 3nm and below its share is close to ninety percent, and both ' +
            '3nm and 2nm capacity are now tight alongside packaging.',
      sources: ['TrendForce', 'Counterpoint', 'Company filings']
    },
    {
      id: 'cowos', parent: 'accelerator', name: 'Advanced packaging', short: 'CoWoS',
      blurb: 'Chip on wafer on substrate: bonding the logic die and the HBM stacks onto one interposer.',
      layout: 'chain',
      market: { size: 'USD ~24bn', year: 2026, basis: '2.5D advanced packaging revenue' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'TSMC', p: 68 }, { c: 'ASE', p: 11 }, { c: 'Amkor', p: 8 }, { c: 'Samsung', p: 5 }
      ],
      note: 'For two years CoWoS capacity, not wafer capacity, was the hard limit on how many ' +
            'accelerators the world could build: a back-end process step almost nobody had heard of ' +
            'gating a trillion dollars of market value. That is now easing: TSMC has roughly doubled ' +
            'capacity twice, is running at something like 120,000 to 140,000 wafers a month in 2026, ' +
            'and has begun outsourcing the chip-on-wafer step to OSATs. The reported supply-demand gap ' +
            'is narrowing from about twenty percent to about ten by the end of 2026. This is the ' +
            'clearest case on the site of a genuine chokepoint being engineered away, which is worth ' +
            'noting, because most of them are not.',
      sources: ['TrendForce', 'Yole Group', 'Company filings']
    },
    {
      id: 'accel-eda', parent: 'accelerator', name: 'Design tools and IP', short: 'EDA',
      blurb: 'The toolchain and the interface IP blocks that every custom silicon programme is assembled from.',
      market: { size: 'USD ~20bn', year: 2026, basis: 'EDA and semiconductor IP revenue' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Synopsys', p: 32 }, { c: 'Cadence', p: 30 }, { c: 'Siemens EDA', p: 13 }, { c: 'Keysight', p: 4 }
      ],
      note: 'Every hyperscaler custom chip programme runs through Broadcom or Marvell as the design ' +
            'partner, and both of them run through Synopsys and Cadence. The dependency chain is four ' +
            'companies deep and then stops. It is also the layer export controls reach first, because ' +
            'a software licence can be revoked centrally in a way that shipped equipment cannot.',
      sources: ['ESD Alliance', 'Company filings'],
      deals: [
        { y: 2025, a: 'Synopsys', t: 'Ansys', v: 'USD 35bn', n: 'Closed July 2025. Simulation folded into the design toolchain.' }
      ]
    },
    {
      id: 'accel-substrate', parent: 'accelerator', name: 'ABF substrate', short: 'Substrate',
      blurb: 'The build-up film package the die sits on. Very large, very thin, and made by very few firms.',
      market: { size: 'USD ~14bn', year: 2026, basis: 'flip-chip and ABF package substrate revenue' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Ibiden', p: 21 }, { c: 'Shinko', p: 16 }, { c: 'Unimicron', p: 14 },
        { c: 'AT&S', p: 9 }, { c: 'Nan Ya PCB', p: 7 }
      ],
      note: 'A quiet Japanese and Taiwanese oligopoly that was the binding constraint on high-end ' +
            'silicon before CoWoS was, and which nobody outside the industry has ever heard of. AI ' +
            'packages are physically enormous by substrate standards, and yield falls sharply with ' +
            'area, so a bigger accelerator does not simply consume more substrate, it consumes ' +
            'disproportionately more.',
      sources: ['Prismark', 'Yole Group', 'Company filings']
    },
    {
      id: 'accel-litho', parent: 'accelerator', name: 'Lithography', short: 'Lithography',
      /* Deliberately shallow and cross-linked: the laptop teardown maps this
         chain through EUV optics to a single supplier. Repeating it would
         make two flagships tell the same story. */
      upstream: ['accel-foundry'],
      blurb: 'And at the bottom of every silicon chain, the same single supplier.',
      market: { size: 'USD ~38bn', year: 2026, basis: 'lithography equipment revenue' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [ { c: 'ASML', p: 91 }, { c: 'Canon', p: 5 }, { c: 'Nikon', p: 4 } ],
      note: 'One hundred percent of extreme ultraviolet. Kept deliberately shallow here: the notebook ' +
            'teardown follows this chain down through EUV optics to a single German supplier at one ' +
            'hundred percent, and duplicating it would tell the same story twice. What matters from ' +
            'the AI side is simply that this is *not* the current constraint, for the first time in ' +
            'years, the binding limit on deployment sits outside the semiconductor industry entirely.',
      sources: ['ASML disclosures', 'SEMI']
    },
    {
      id: 'interposer', parent: 'cowos', name: 'Silicon interposer', short: 'Interposer',
      blurb: 'A large piece of silicon whose only job is to carry wiring between the logic die and the memory.',
      market: { size: 'USD ~5bn', year: 2026, basis: 'silicon interposer and RDL supply for 2.5D packaging' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [ { c: 'TSMC', p: 72 }, { c: 'ASE', p: 10 }, { c: 'Samsung', p: 6 } ],
      note: 'The interposer is why advanced packaging consumes wafer capacity as well as packaging ' +
            'capacity: it is silicon, made on a wafer line, and a big one. Reticle-size limits on how ' +
            'large an interposer can be are one of the real physical constraints on accelerator ' +
            'design, and the industry\'s answer (stitching, panel-level packaging) is what the ' +
            'next generation of this layer is about.',
      sources: ['Yole Group', 'TrendForce']
    },
    {
      id: 'cowos-osat', parent: 'cowos', name: 'Outsourced assembly', short: 'OSAT',
      blurb: 'The subcontractors TSMC has started handing the front half of CoWoS to.',
      market: { size: 'USD ~58bn', year: 2026, basis: 'outsourced semiconductor assembly and test revenue' },
      asOf: '2026', confidence: 'medium',
      shares: [
        { c: 'ASE', p: 29 }, { c: 'Amkor', p: 14 }, { c: 'JCET', p: 11 }, { c: 'Powertech', p: 6 }
      ],
      note: 'The interesting development of 2026: rather than build all of it itself, TSMC has expanded ' +
            'outsourcing of the chip-on-wafer step to ASE, SPIL and Amkor, with ASE\'s own capacity ' +
            'reported to be more than tripling. A monopolist choosing to share a bottleneck is ' +
            'unusual, and it says the demand is large enough that capturing all of it was worth less ' +
            'than serving it.',
      sources: ['TrendForce', 'Yole Group', 'Company filings']
    },
    {
      id: 'hbm-dram', parent: 'hbm', name: 'DRAM die', short: 'DRAM',
      blurb: 'The memory itself, on leading-edge DRAM processes, before it is stacked.',
      market: { size: 'USD ~180bn', year: 2026, basis: 'DRAM revenue, all applications' },
      asOf: '2026', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Samsung', p: 38 }, { c: 'SK hynix', p: 28 }, { c: 'Micron', p: 21 }, { c: 'CXMT', p: 7 }
      ],
      note: 'The layer where AI reached into every other device on this site. HBM consumes roughly ' +
            'three times the wafer area per bit, so every gigabyte of it displaces about three ' +
            'gigabytes of conventional DRAM, which is why phone and PC memory prices rose sharply ' +
            'through 2025 and 2026. The smartphone teardown feels this directly.',
      sources: ['TrendForce', 'Counterpoint', 'Company filings']
    },
    {
      id: 'hbm-tsv', parent: 'hbm', name: 'Stacking and bonding', short: 'Bonding',
      blurb: 'Through-silicon vias and the bonders that stack twelve or sixteen thinned dies without breaking them.',
      market: { size: 'USD ~4bn', year: 2026, basis: 'die bonder and TSV equipment revenue for memory stacking' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'ASMPT', p: 34 }, { c: 'Hanmi Semiconductor', p: 23 }, { c: 'BESI', p: 14 },
        { c: 'Shinkawa', p: 8 }
      ],
      note: 'A genuinely narrow equipment layer almost nobody tracks. Stacking sixteen dies thinned to ' +
            'tens of microns, with tens of thousands of vertical connections, at yields that make the ' +
            'stack economic, is the actual difficulty in HBM, and the move to hybrid bonding for ' +
            'HBM4 and beyond shifts the required tool set again. A handful of Korean, Dutch and ' +
            'Singaporean firms gate it.',
      sources: ['Yole Group', 'TrendForce', 'Company filings']
    },

    /* ==================== FABRIC AND OPTICS ==================== */
    {
      id: 'switch-silicon', parent: 'fabric', name: 'Switch silicon', short: 'Switch ASIC',
      blurb: 'The 51.2 and now 102.4 terabit ASICs at the heart of every top-of-rack and spine switch.',
      market: { size: 'USD ~16bn', year: 2026, basis: 'merchant data centre switch silicon revenue' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [ { c: 'Broadcom', p: 73 }, { c: 'Nvidia', p: 12 }, { c: 'Marvell', p: 7 }, { c: 'Cisco', p: 5 } ],
      note: 'Broadcom\'s Tomahawk and Jericho families are the reason merchant silicon beat proprietary ' +
            'switching. It is one of the most profitable franchises in semiconductors and almost ' +
            'nobody outside the industry can name it. It is also the layer through which the industry ' +
            'is trying to break Nvidia\'s scale-up lock, which makes Broadcom simultaneously Nvidia\'s ' +
            'largest rival and the main beneficiary of everyone else\'s attempt to escape it.',
      sources: ['650 Group', 'Dell\'Oro Group']
    },
    {
      id: 'nic', parent: 'fabric', name: 'NICs and DPUs', short: 'NIC',
      blurb: 'The network card, now often a full processor offloading storage, security and virtualisation.',
      market: { size: 'USD ~12bn', year: 2026, basis: 'data centre NIC and DPU revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Nvidia', p: 49 }, { c: 'Broadcom', p: 20 }, { c: 'Intel', p: 11 },
        { c: 'Marvell', p: 8 }, { c: 'AMD', p: 6 }
      ],
      note: 'Nvidia\'s position here is entirely the Mellanox acquisition. AMD bought Pensando for ' +
            'USD 1.9bn in 2022 to answer it and has not closed the gap. The DPU is quietly strategic: ' +
            'it is the part of the server the cloud operator controls and the tenant does not, which ' +
            'is why every hyperscaler has wanted its own.',
      sources: ['Dell\'Oro Group', 'Company filings'],
      deals: [ { y: 2022, a: 'AMD', t: 'Pensando', v: 'USD 1.9bn', n: 'DPU capability bought to counter Nvidia BlueField.' } ]
    },
    {
      id: 'scale-up', parent: 'fabric', name: 'Scale-up interconnect', short: 'Scale-up',
      blurb: 'The copper backplane inside the rack: NVLink, and the industry\'s attempts to standardise it away.',
      market: { size: 'USD ~9bn', year: 2026, basis: 'in-rack scale-up interconnect and copper cabling revenue' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Nvidia', p: 62 }, { c: 'Broadcom', p: 13 }, { c: 'Amphenol', p: 8 },
        { c: 'TE Connectivity', p: 6 }
      ],
      note: 'The most defensible thing Nvidia owns after CUDA. NVLink is what makes seventy-two ' +
            'accelerators behave as one, and it is proprietary, so the rack, not the chip, is the ' +
            'real product. UALink and Ultra Ethernet exist specifically to break that, backed by ' +
            'essentially everyone else. Note also what it is physically: at these speeds and ' +
            'distances the answer is still copper, which is why an AI rack contains kilometres of ' +
            'cable and why the connector firms unexpectedly became AI suppliers.',
      sources: ['Dell\'Oro Group', '650 Group', 'Company filings']
    },
    {
      id: 'transceiver', parent: 'optics', name: 'Transceiver modules', short: 'Modules',
      blurb: 'The pluggable 800G and 1.6T optics, assembled overwhelmingly in China.',
      market: { size: 'USD ~26bn', year: 2026, basis: 'optical transceiver module revenue' },
      asOf: '2026', confidence: 'medium',
      shares: [
        { c: 'Innolight', p: 25 }, { c: 'Eoptolink', p: 14 }, { c: 'Coherent', p: 13 },
        { c: 'Accelink', p: 8 }, { c: 'HG Genuine', p: 6 }
      ],
      note: 'Module assembly is a scale and yield business and it moved to China comprehensively. The ' +
            'interesting question is what happens to it: co-packaged optics moves the light onto the ' +
            'switch package itself and would delete the pluggable module as a product category. Every ' +
            'firm in this table is aware of that and none of them controls it.',
      sources: ['LightCounting', 'Company filings']
    },
    {
      id: 'optics-laser', parent: 'optics', name: 'Lasers and photonics', short: 'Lasers',
      blurb: 'Indium phosphide EML and DFB lasers: the part of a transceiver that is genuinely hard.',
      market: { size: 'USD ~7bn', year: 2026, basis: 'datacom laser and photonic component revenue' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Coherent', p: 22 }, { c: 'Lumentum', p: 18 }, { c: 'Broadcom', p: 12 },
        { c: 'Sumitomo Electric', p: 9 }, { c: 'Mitsubishi Electric', p: 7 }
      ],
      note: 'The upstream half of the split described above, and where the margin sits. These are ' +
            'compound semiconductors (indium phosphide, not silicon) made on small wafers in low ' +
            'volumes, where the constraint is epitaxial yield and reliability qualification rather ' +
            'than lithography. None of the leading-edge foundry story that dominates the rest of this ' +
            'teardown applies here at all.',
      sources: ['LightCounting', 'Yole Group', 'Company filings']
    },
    {
      id: 'optics-dsp', parent: 'optics', name: 'Optical DSP', short: 'DSP',
      blurb: 'The digital signal processor inside the module that makes 200 gigabits per lane survive a fibre.',
      market: { size: 'USD ~5bn', year: 2026, basis: 'optical module DSP and driver silicon revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Marvell', p: 38 }, { c: 'Broadcom', p: 27 }, { c: 'Cisco', p: 9 }
      ],
      note: 'A two-firm market inside a component most people think of as a piece of glass. It is also ' +
            'the piece that disappears if co-packaged optics wins, since the function moves into the ' +
            'switch ASIC, which is why Broadcom is comfortable in both worlds and Marvell is more ' +
            'exposed than its share here suggests.',
      sources: ['LightCounting', 'Company filings']
    },

    /* ==================== STORAGE, COOLING, CHASSIS ==================== */
    {
      id: 'ssd-srv', parent: 'storage-srv', name: 'Enterprise SSD', short: 'SSD',
      blurb: 'High-capacity NVMe flash for checkpointing and the hot tier of training data.',
      market: { size: 'USD ~34bn', year: 2026, basis: 'enterprise SSD revenue' },
      asOf: '2026', confidence: 'medium',
      shares: [
        { c: 'Samsung', p: 30 }, { c: 'SK hynix', p: 24 }, { c: 'Micron', p: 15 },
        { c: 'Kioxia', p: 12 }, { c: 'SanDisk', p: 8 }
      ],
      note: 'Enterprise flash competes for exactly the same fab capacity as everything else in memory, ' +
            'so it inherited the HBM squeeze without being HBM. Checkpointing a large training run ' +
            'writes enormous amounts very fast and is one of the few genuinely new workload shapes ' +
            'this industry has produced.',
      sources: ['TrendForce', 'Forward Insights']
    },
    {
      id: 'hdd-srv', parent: 'storage-srv', name: 'Nearline hard disk', short: 'HDD',
      blurb: 'Spinning disk for training corpora. Written off for fifteen years, and sold out.',
      market: { size: 'USD ~18bn', year: 2026, basis: 'nearline hard disk drive revenue' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Seagate', p: 45 }, { c: 'Western Digital', p: 39 }, { c: 'Toshiba', p: 16 }
      ],
      note: 'A genuine three-firm market, effectively two, and one of the most concentrated layers on ' +
            'the site, with a cost per terabyte flash still cannot approach for cold data. Fifteen ' +
            'years of predicted obsolescence produced almost no new entrants, which is precisely why ' +
            'the incumbents can now allocate rather than sell. Not every legacy technology dies; some ' +
            'of them just stop being contested.',
      sources: ['TrendForce', 'Company filings']
    },
    {
      id: 'cold-plate', parent: 'cooling-srv', name: 'Cold plates', short: 'Cold plates',
      blurb: 'Machined copper blocks with microchannels, clamped directly onto the accelerator die package.',
      market: { size: 'USD ~5bn', year: 2026, basis: 'direct-to-chip cold plate revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Boyd', p: 19 }, { c: 'CoolIT', p: 16 }, { c: 'AVC', p: 12 },
        { c: 'Delta Electronics', p: 9 }, { c: 'Auras', p: 7 }
      ],
      note: 'A precision machining and sealing business that suddenly found itself strategic. The hard ' +
            'part is not thermal performance but never leaking, for years, a few millimetres above ' +
            'silicon worth tens of thousands of dollars, which is why qualification takes so long and ' +
            'why the incumbents have held on better than a low-technology category would suggest.',
      sources: ['Dell\'Oro Group', 'Company filings']
    },
    {
      id: 'cdu', parent: 'cooling-srv', name: 'Coolant distribution', short: 'CDU',
      blurb: 'The unit that isolates the facility water loop from the technology loop and pumps it.',
      market: { size: 'USD ~4bn', year: 2026, basis: 'coolant distribution unit revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Vertiv', p: 24 }, { c: 'Motivair', p: 14 }, { c: 'CoolIT', p: 12 },
        { c: 'Delta Electronics', p: 8 }
      ],
      note: 'The piece that makes liquid cooling deployable in a building that was not designed for ' +
            'it, which is most buildings. It is also where the M&A has been: Schneider bought ' +
            'Motivair, Vertiv bought CoolTera, and KKR was into CoolIT well ahead of the demand curve.',
      sources: ['Dell\'Oro Group', 'Company filings']
    },
    {
      id: 'rear-door', parent: 'cooling-srv', name: 'Rear-door and facility cooling', short: 'Facility cooling',
      blurb: 'Heat exchangers on the back of the rack, and the chillers and dry coolers behind them.',
      market: { size: 'USD ~7bn', year: 2026, basis: 'data centre thermal management, facility side' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Vertiv', p: 18 }, { c: 'Schneider Electric', p: 12 }, { c: 'nVent', p: 9 },
        { c: 'Munters', p: 6 }
      ],
      note: 'The heat has to go somewhere, and at gigawatt scale where it goes becomes a siting ' +
            'question rather than an engineering one, water availability now determines data centre ' +
            'location in several regions as firmly as power does. This is the layer where the machine ' +
            'stops being a product and starts being infrastructure.',
      sources: ['Dell\'Oro Group', 'IEA Energy and AI']
    },
    {
      id: 'sheet-metal-srv', parent: 'chassis-srv', name: 'Sheet metal and rails', short: 'Sheet metal',
      blurb: 'The frame, trays and rails. A tonne and a half of steel per rack.',
      market: { size: 'USD ~6bn', year: 2026, basis: 'server chassis and rack mechanical fabrication' },
      asOf: '2026', confidence: 'low',
      shares: [],
      note: 'Named but not measured, fabrication is done in-house by the ODMs or by regional shops to ' +
            'their print, and nobody tracks it. Worth naming because a populated NVL72 weighs around ' +
            'a tonne and a half, which turns out to matter: floor loading, lifting equipment and ' +
            'goods-lift capacity are real constraints on retrofitting AI into existing buildings.',
      sources: ['Company statements', 'TrendForce']
    },
    {
      id: 'cable-harness-srv', parent: 'chassis-srv', name: 'Cabling and connectors', short: 'Cabling',
      blurb: 'Kilometres of copper inside one rack, plus the blind-mate connectors that make it serviceable.',
      market: { size: 'USD ~8bn', year: 2026, basis: 'data centre interconnect cable and connector revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Amphenol', p: 26 }, { c: 'TE Connectivity', p: 15 }, { c: 'Molex', p: 11 },
        { c: 'Luxshare', p: 9 }
      ],
      note: 'One of the least expected beneficiaries of AI. At 224 gigabits per lane over short ' +
            'distances copper still beats optics on power and cost, so an NVL72 contains something ' +
            'like three kilometres of cable, and the connector companies, which are about as ' +
            'unglamorous as manufacturing gets, re-rated on it.',
      sources: ['Dell\'Oro Group', 'Company filings']
    },

    /* ==================== POWER, RACK TO GRID ==================== */
    {
      id: 'psu', parent: 'rack-power', name: 'Power shelves', short: 'PSU',
      blurb: 'Rectifiers converting facility AC into the DC bus the whole rack runs on.',
      market: { size: 'USD ~12bn', year: 2026, basis: 'server power supply revenue' },
      asOf: '2026', confidence: 'medium',
      shares: [
        { c: 'Delta Electronics', p: 36 }, { c: 'Lite-On', p: 15 }, { c: 'Chicony', p: 11 },
        { c: 'Murata', p: 6 }
      ],
      note: 'Efficiency here is worth more than it looks: a percentage point across a gigawatt campus ' +
            'is ten megawatts, which at current interconnection queues is capacity that cannot be ' +
            'bought at any price. That is why titanium-grade conversion stopped being a specification ' +
            'checkbox and became a procurement priority.',
      sources: ['Dell\'Oro Group', 'TrendForce', 'Company filings']
    },
    {
      id: 'busbar', parent: 'rack-power', name: 'Busbar and distribution', short: 'Busbar',
      blurb: 'Solid copper bar carrying the whole rack current vertically, replacing bundles of cable.',
      market: { size: 'USD ~5bn', year: 2026, basis: 'rack busbar and power distribution unit revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Vertiv', p: 17 }, { c: 'Schneider Electric', p: 14 }, { c: 'Eaton', p: 11 },
        { c: 'Legrand', p: 8 }
      ],
      note: 'At 130 kilowatts a rack, cable becomes impractical and busbar becomes mandatory. The shift ' +
            'now beginning to 800 volt DC distribution is the largest change in this architecture in ' +
            'twenty years, and it is being driven by a simple fact: at these currents, copper losses ' +
            'and copper cost both stop being rounding errors.',
      sources: ['Dell\'Oro Group', 'Company filings']
    },
    {
      id: 'bbu', parent: 'rack-power', name: 'Battery backup', short: 'BBU',
      blurb: 'Lithium cells in the rack, holding the load for the seconds before generators pick up.',
      market: { size: 'USD ~4bn', year: 2026, basis: 'rack-level battery backup unit revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Delta Electronics', p: 15 }, { c: 'Vertiv', p: 12 }, { c: 'LG Energy Solution', p: 9 },
        { c: 'Samsung SDI', p: 7 }
      ],
      note: 'A newer idea than it sounds: putting the ride-through energy in the rack rather than in a ' +
            'central UPS removes a large conversion stage and a large room. It also means an AI hall ' +
            'now contains a meaningful quantity of lithium, with the fire engineering consequences ' +
            'that implies, which is quietly one of the more contested topics in data centre design.',
      sources: ['Dell\'Oro Group', 'Company filings']
    },
    {
      id: 'facility-power', parent: 'rack-power', name: 'Facility power', short: 'Facility',
      blurb: 'Switchgear, transformers, UPS and generators between the grid connection and the row.',
      layout: 'chain',
      market: { size: 'USD ~48bn', year: 2026, basis: 'data centre electrical infrastructure revenue' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Schneider Electric', p: 22 }, { c: 'Vertiv', p: 16 }, { c: 'ABB', p: 11 },
        { c: 'Eaton', p: 11 }, { c: 'Hitachi Energy', p: 8 }, { c: 'Siemens', p: 7 }
      ],
      note: 'The point where this teardown stops being about a machine. These are long-lead electrical ' +
            'goods, medium voltage switchgear and transformers, whose wait times have roughly ' +
            'doubled in three years, and which are being bought simultaneously by data centres, the ' +
            'energy transition and grid operators replacing ageing plant. Everyone is queuing at the ' +
            'same suppliers on the same timeline.',
      sources: ['Dell\'Oro Group', 'S&P Global Market Intelligence', 'Company filings']
    },
    {
      id: 'ups-switchgear', parent: 'facility-power', name: 'UPS and switchgear', short: 'UPS',
      blurb: 'Uninterruptible supply and medium-voltage distribution inside the building.',
      market: { size: 'USD ~22bn', year: 2026, basis: 'data centre UPS and switchgear revenue' },
      asOf: '2026', confidence: 'low',
      shares: [
        { c: 'Schneider Electric', p: 24 }, { c: 'Vertiv', p: 21 }, { c: 'ABB', p: 12 },
        { c: 'Eaton', p: 10 }
      ],
      note: 'A concentrated European and American oligopoly with genuine pricing power for the first ' +
            'time in decades, because the order books are full and the alternative to waiting is not ' +
            'building. Lead times, not price, are the negotiation.',
      sources: ['Dell\'Oro Group', 'Company filings']
    },
    {
      id: 'onsite-gen', parent: 'facility-power', name: 'On-site generation', short: 'On-site',
      blurb: 'Gas, fuel cells and increasingly nuclear commitments, bought to avoid waiting for the grid.',
      market: { size: 'USD ~14bn', year: 2026, basis: 'behind-the-meter generation procured for data centres' },
      asOf: '2026', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'GE Vernova', p: 21 }, { c: 'Siemens Energy', p: 16 },
        { c: 'Mitsubishi Power', p: 12 }, { c: 'Bloom Energy', p: 7 }
      ],
      note: 'The workaround, and the reason this layer exists at all. Rather than wait years for an ' +
            'interconnection, operators are building their own generation behind the meter, which is ' +
            'why hyperscalers have signed nuclear power agreements and gas turbine order books have ' +
            'filled. It solves one queue by joining another.',
      sources: ['Wood Mackenzie', 'S&P Global Market Intelligence', 'Company filings']
    },
    {
      id: 'grid-connect', parent: 'facility-power', name: 'Grid connection', short: 'Grid',
      blurb: 'The interconnection agreement, the substation and the queue. Not a product, and not for sale.',
      layout: 'chain',
      market: { size: null, year: 2026, basis: 'interconnection capacity: a queue, not a market' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [],
      note: 'The end of the teardown, and the only layer here that money cannot shorten. US data centre ' +
            'capacity is forecast to rise from roughly 62 gigawatts in early 2026 to about 152 by ' +
            '2030, and the constraint is not generation but connection: transformer and cable wait ' +
            'times have roughly doubled in three years, and a data centre takes two to three years to ' +
            'build while the grid infrastructure it needs takes four to eight. That mismatch is the ' +
            'single most important fact about AI infrastructure in 2026, and there is no supplier to ' +
            'negotiate with, which is why it is named here with no share table rather than dressed ' +
            'up as a market.',
      sources: ['IEA Energy and AI', 'S&P Global Market Intelligence']
    },
    {
      id: 'generation', parent: 'grid-connect', name: 'Generation capacity', short: 'Generation',
      blurb: 'The power itself: gas, nuclear, wind and solar contracted years before the racks arrive.',
      layout: 'chain',
      market: { size: null, year: 2026, basis: 'contracted generation for data centre load: capacity, not a supplier market' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [],
      note: 'Named but not measured, because generation is contracted through power purchase agreements ' +
            'rather than bought from a supplier with a market share. What matters is the arithmetic: ' +
            'AI-driven data centre power demand in the United States is projected to more than double ' +
            'between 2026 and 2030, and building the plant to serve it takes longer than building the ' +
            'data centres that need it. The wind turbine teardown on this site is one of the answers ' +
            'to this node, which is an unusual thing for two devices in a catalogue to have in common.',
      sources: ['IEA Energy and AI', 'Wood Mackenzie']
    },
    {
      id: 'turbines', parent: 'generation', name: 'Gas turbines', short: 'Turbines',
      blurb: 'The equipment most new dispatchable generation actually needs, and its order book runs past 2030.',
      market: { size: 'USD ~42bn', year: 2026, basis: 'heavy-duty gas turbine order and equipment value' },
      asOf: '2026', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'GE Vernova', p: 34 }, { c: 'Siemens Energy', p: 26 },
        { c: 'Mitsubishi Power', p: 24 }, { c: 'Ansaldo Energia', p: 5 }
      ],
      note: 'The bottom of this teardown, and it is a factory in Greenville, one in Berlin and one in ' +
            'Takasago. Three firms build essentially all of the world\'s heavy-duty gas turbines; ' +
            'orders surged around seventy percent in 2025, and lead times for new units now run ' +
            'several years with delivery slots stretching past 2030. There is no way to buy your way ' +
            'to the front: the constraint is forging, casting and test capacity that took decades to ' +
            'build down and cannot be built back quickly. An industry that measures product cycles in ' +
            'months has discovered one that measures them in decades.',
      sources: ['Wood Mackenzie', 'S&P Global Market Intelligence', 'Company filings']
    }
  ]
});
