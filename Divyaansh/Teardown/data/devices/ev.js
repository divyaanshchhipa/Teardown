/* Teardown :: Electric vehicle
 *
 * Eighth flagship, and the deliberate counterpart to the combustion car. Read
 * together they are the clearest before-and-after on the site: the same
 * chassis, interior, glass and electronics, with the powertrain replaced and
 * about two thousand moving parts deleted. Several nodes here name what
 * happens to the supplier on the other side of that swap.
 *
 * ---- the terminus is deliberately cobalt, not rare earths ----
 *
 * The obvious deep chain for an EV is motor -> magnet -> rare earth
 * separation, and it is real: China holds around 90% of magnet making. But
 * the submarine cable teardown already bottoms out in rare earth separation,
 * and two flagships sharing a terminus would tell one story twice. The magnet
 * layer is therefore kept present and cross-linked rather than followed down.
 *
 * The chain this device owns runs through the battery instead, and ends
 * somewhere no other teardown here goes: an extraction geography with a
 * labour-rights dimension. The DRC produces roughly three quarters of the
 * world's mined cobalt and has no refining capacity of its own, so the ore
 * leaves the country to be refined almost entirely in China. That is a
 * different shape of dependency from a fab, a mine-plus-government or a
 * chemical process: the constraint is a country's geology, and the moral
 * problem sits at the bottom of it rather than the strategic one.
 */
TD.device({
  id: 'ev',
  name: 'Electric vehicle',
  icon: 'car',
  category: 'Mobility',
  tagline: 'A battery with seats, and every branch of it ends in a Chinese refinery.',
  unit: { volume: '~20m plug-in vehicles sold (2025)', price: 'USD ~42,000 average transaction' },
  intro: 'An electric car deletes about two thousand moving parts and replaces them with a battery, ' +
         'a handful of power semiconductors and a lot of software. That swap moved the profit pool from ' +
         'Germany and Japan to China and Korea inside a decade. Follow the battery down and the pattern ' +
         'is the same at every level: the mine is somewhere else, and the refinery is in China.',
  view: { w: 1000, h: 640 },
  frames: [{ label: 'Powertrain', x: 130, y: 62, w: 740, h: 176 },
           { label: 'Electronics and autonomy', x: 130, y: 250, w: 740, h: 176 },
           { label: 'Vehicle and channel', x: 130, y: 438, w: 740, h: 188 }],

  /* ============================ STORY ============================
   * `stages` must account for all 50 nodes exactly once.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'Nobody is short of lithium. They are short of refineries.',
    lede: 'Fifty mapped layers, five tiers deep. The instinct about critical minerals is that the ' +
          'constraint is the ground, that somebody owns the deposits and everyone else is stuck. It ' +
          'is almost exactly wrong. Mining is spread across a dozen countries. Refining is not, and a ' +
          'refinery takes four years to build.',

    tierNote: 'The car is a competitive market. Four layers down it is one country, at every branch, without exception.',
    geoLede: 'One reading dominates and it is not the obvious one. By assembly this is increasingly a ' +
             'Chinese vehicle. But the deeper you go the more Chinese it becomes, not because China ' +
             'holds the deposits, which it largely does not, but because it holds the processing that ' +
             'turns them into something a battery can use.',

    findings: [
      { title: 'The chokepoint is the refinery, not the mine',
        body: 'Lithium is mined in Australia, Chile and Argentina. Cobalt comes overwhelmingly from the ' +
              'Democratic Republic of the Congo. Graphite is geologically common. None of that is the ' +
              'constraint. China refines something like seventy percent of the world\'s lithium ' +
              'chemicals, over eighty percent of its lithium hydroxide, and the overwhelming majority ' +
              'of battery-grade graphite, and when Beijing put export controls on graphite in late ' +
              '2023 it demonstrated exactly where the leverage sits. A mine takes years to permit; a ' +
              'refinery takes about four to build, and almost nobody outside China has been building ' +
              'them.',
        nodes: ['li-refining', 'graphite-anode', 'cathode-ev'] },
      { title: 'Three quarters of the cobalt comes from one country that cannot refine any of it',
        body: 'The DRC produces roughly three quarters of the world\'s mined cobalt and has no active ' +
              'refining capacity at all, so the ore leaves to be processed elsewhere, mostly China, ' +
              'much of it by Chinese-owned mines. In 2025 the government imposed an export ban and ' +
              'then a quota regime specifically to force domestic processing. Artisanal mining, the ' +
              'part of this chain with a genuine human-rights problem attached, fell to around two ' +
              'percent of DRC supply by 2024 and rises again whenever the price does. No other ' +
              'teardown on this site ends somewhere with that shape.',
        nodes: ['cobalt-mining', 'co-refining'] },
      { title: 'LFP won, and that decision was made a decade early',
        body: 'Lithium iron phosphate was dismissed in the West as a cheap, low-energy chemistry. It is ' +
              'now the majority of global volume, because it is cheaper, safer, longer-lived and uses ' +
              'no cobalt or nickel at all. The Chinese producers committed to it years before anyone ' +
              'else and built the entire cathode supply chain around it. That single chemistry call is ' +
              'the origin of the cost advantage that everything else in this teardown follows from, ' +
              'and it is why the cobalt chokepoint below is loosening while the refining one is not.',
        nodes: ['cells-ev', 'cathode-ev', 'pack-ev'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 50. */
    stages: [
      { id: 'mining', name: 'Mining',
        note: 'Where the material actually comes out of the ground, and it is more spread out than ' +
              'almost anyone expects.',
        nodes: ['li-mining', 'cobalt-mining', 'nickel-mining', 'graphite-mining'] },
      { id: 'refining', name: 'Refining and chemicals',
        note: 'The real chokepoint. Every branch of this stage converges on the same country, and this ' +
              'is the tier the whole teardown exists to point at.',
        nodes: ['li-refining', 'co-refining', 'ni-refining', 'graphite-anode'] },
      { id: 'materials', name: 'Cell materials',
        note: 'Refined chemicals become the four active materials a cell is built from: cathode, ' +
              'anode, separator and electrolyte.',
        nodes: ['cathode-ev', 'separator-ev', 'electrolyte-ev', 'foils-ev'] },
      { id: 'cells', name: 'Cells and pack',
        note: 'Roughly a third of the vehicle. Two Chinese firms hold more than half of it between them.',
        nodes: ['cells-ev', 'bms', 'pack-enclosure', 'pack-ev'] },
      { id: 'motor', name: 'Motor and magnets',
        note: 'The part an electric car adds where the engine was. It is where the rare earth chain ' +
              'touches this device: deliberately shallow, because the subsea cable teardown owns it.',
        nodes: ['magnets', 'motor-steel', 'motor-windings', 'gearbox-ev', 'emotor'] },
      { id: 'power', name: 'Power electronics',
        note: 'Inverter, charger and converter. The layer where a wide-bandgap technology bet went ' +
              'badly wrong for almost everyone who made it.',
        nodes: ['sic-substrate', 'sic', 'igbt', 'obc-ev', 'power-ev'] },
      { id: 'electronics', name: 'Electronics and autonomy',
        note: 'Sensing, compute and the cockpit: the half of the car that has been invaded by ' +
              'consumer semiconductor firms.',
        nodes: ['adas-soc', 'lidar', 'radar', 'cam-adas', 'adas',
                'cockpit-soc', 'cockpit-display', 'cockpit'] },
      { id: 'vehicle', name: 'Vehicle',
        note: 'Everything shared with the combustion car (body, interior, thermal) plus what changes ' +
              'when the engine is gone.',
        nodes: ['castings-ev', 'chassis-ev', 'interior-ev', 'heatpump-ev', 'thermal-ev', 'glass-ev'] },
      { id: 'charge', name: 'Charging',
        note: 'The one part of this machine that does not fit inside it, and the reason adoption is a ' +
              'grid question as much as a car question.',
        nodes: ['charge-hw', 'charge-network', 'charging-ev'] },
      { id: 'channel', name: 'Who sells it',
        note: 'Six of the top eight are Chinese, and the leader is vertically integrated from the ' +
              'refinery to the showroom.',
        nodes: ['unpriced-ev', 'oem-ev', 'battery-makers'] }
    ],

    flow: {
      lanes: [
        { label: 'Battery', steps: ['li-mining', 'li-refining', 'cathode-ev', 'cells-ev', 'pack-ev'],
          feed: { label: 'Cobalt and graphite',
                  steps: ['cobalt-mining', 'co-refining', 'graphite-anode'] } },
        { label: 'Motor', steps: ['magnets', 'motor-steel', 'emotor'] },
        { label: 'Power', steps: ['sic-substrate', 'sic', 'power-ev'] },
        { label: 'Electronics', steps: ['adas-soc', 'adas', 'cockpit'] }
      ],
      converge: ['oem-ev', 'charging-ev']
    }
  },

  nodes: [

    /* ==================== ROW 1 :: POWERTRAIN ==================== */
    {
      id: 'pack-ev', name: 'Battery pack', short: 'Battery',
      shape: { x: 150, y: 82, w: 300, h: 146 },
      blurb: 'Cells, modules, a cooling plate, a battery management system and a structural enclosure.',
      bomPct: 30, layout: 'board',
      market: { size: 'USD ~150bn', year: 2025, basis: 'EV battery installations, share of GWh deployed' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'CATL', p: 37 }, { c: 'BYD', p: 17 }, { c: 'LG Energy Solution', p: 9 },
        { c: 'CALB', p: 4.5 }, { c: 'SK On', p: 4 }, { c: 'Panasonic', p: 3.5 },
        { c: 'Gotion', p: 3 }, { c: 'EVE Energy', p: 2.5 }, { c: 'Samsung SDI', p: 2.5 }
      ],
      note: 'Two Chinese firms hold over half the world\'s EV battery supply, and CATL alone is larger ' +
            'than every non-Chinese producer combined. Western capacity plans have been repeatedly ' +
            'delayed or cancelled, and the licensing route: where CATL supplies technology rather ' +
            'than cells, is now how Ford and Tesla have chosen to close the gap. Note the basis: this ' +
            'is GWh deployed, not cells shipped or revenue, and the three readings differ.',
      sources: ['SNE Research', 'Benchmark Mineral Intelligence', 'Company filings'],
      deals: [
        { y: 2025, a: 'CATL', t: 'Hong Kong listing', v: 'USD ~5.3bn raised', n: 'The largest listing of the year, funding capacity outside mainland China.' }
      ]
    },
    {
      id: 'emotor', name: 'Traction motor', short: 'Motor',
      shape: { x: 470, y: 82, w: 220, h: 146 },
      blurb: 'A permanent magnet synchronous motor, reduction gearbox and inverter, increasingly one sealed unit.',
      bomPct: 9, layout: 'board',
      market: { size: 'USD ~52bn', year: 2025, basis: 'EV traction motor and e-axle revenue, merchant and captive' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'BYD', p: 16 }, { c: 'Tesla', p: 11 }, { c: 'Inovance', p: 8 },
        { c: 'Nidec', p: 7 }, { c: 'ZF', p: 6 }, { c: 'Bosch', p: 5 }, { c: 'Hyundai Mobis', p: 5 }
      ],
      note: 'Most volume is captive, which is why the leaders here are carmakers rather than ' +
            'suppliers. The merchant e-axle market that Nidec and ZF bet heavily on turned out far ' +
            'smaller and far more price-competitive than anyone underwrote, and Nidec has taken large ' +
            'impairments as a result. It is the mirror image of the combustion car, where the ' +
            'transmission is genuinely bought in from Aisin and ZF.',
      sources: ['IDTechEx', 'Company filings']
    },
    {
      id: 'power-ev', name: 'Power electronics', short: 'Power',
      shape: { x: 710, y: 82, w: 140, h: 146 },
      blurb: 'The inverter, on-board charger and DC-DC converter. Silicon carbide here buys real range.',
      bomPct: 6, layout: 'board',
      market: { size: 'USD ~26bn', year: 2025, basis: 'automotive power semiconductor revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Infineon', p: 26 }, { c: 'STMicroelectronics', p: 17 }, { c: 'onsemi', p: 13 },
        { c: 'Mitsubishi Electric', p: 8 }, { c: 'Fuji Electric', p: 7 }, { c: 'BYD Semiconductor', p: 6 }
      ],
      note: 'Infineon has led automotive power for two decades and defended it through every ' +
            'technology transition. The open question is whether Chinese IGBT and silicon carbide ' +
            'suppliers, currently protected by a home market that buys more than half the world\'s ' +
            'EVs, can export that position.',
      sources: ['Omdia', 'Yole Group', 'Company filings']
    },

    /* ============ ROW 2 :: ELECTRONICS AND AUTONOMY ============ */
    {
      id: 'adas', name: 'ADAS and autonomy', short: 'ADAS',
      shape: { x: 150, y: 270, w: 220, h: 146 },
      blurb: 'Cameras, radar, sometimes lidar, and the compute that turns it into steering and braking.',
      bomPct: 7, layout: 'board',
      market: { size: 'USD ~46bn', year: 2025, basis: 'ADAS sensing and compute hardware revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Bosch', p: 15 }, { c: 'Mobileye', p: 11 }, { c: 'Denso', p: 10 },
        { c: 'Continental', p: 9 }, { c: 'Nvidia', p: 7 }, { c: 'ZF', p: 7 }, { c: 'Aptiv', p: 6 }
      ],
      note: 'The most heavily traded segment in automotive M&A of the last five years, and one where ' +
            'nearly every buyer has written something down. Qualcomm paid USD 4.5bn for Arriver, Magna ' +
            'bought Veoneer\'s active safety arm, and Intel took Mobileye public rather than keep ' +
            'funding it.',
      sources: ['Yole Group', 'Company filings'],
      deals: [
        { y: 2022, a: 'Qualcomm', t: 'Arriver (from Veoneer)', v: 'USD 4.5bn deal, Arriver carved out', n: 'Bought perception software to complete the Snapdragon Ride stack. SSW Partners took the rest.' },
        { y: 2023, a: 'Magna', t: 'Veoneer Active Safety', v: 'USD 1.53bn', n: 'The other half of the same carve-up.' }
      ]
    },
    {
      id: 'cockpit', name: 'Cockpit and infotainment', short: 'Cockpit',
      shape: { x: 390, y: 270, w: 220, h: 146 },
      blurb: 'Displays, the digital cockpit processor, the operating system and the connectivity module.',
      bomPct: 6, layout: 'board',
      market: { size: 'USD ~34bn', year: 2025, basis: 'digital cockpit hardware and software revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Qualcomm', p: 34 }, { c: 'NXP', p: 11 }, { c: 'Renesas', p: 10 },
        { c: 'Texas Instruments', p: 8 }, { c: 'Samsung LSI', p: 6 }, { c: 'Intel', p: 5 }
      ],
      note: 'Qualcomm took the digital cockpit almost completely, by porting a smartphone platform into ' +
            'a car and winning on software maturity rather than automotive credentials. It is the ' +
            'clearest case on the site of a consumer semiconductor company invading automotive and ' +
            'succeeding, and the combustion car teardown shows the other half of that story, where ' +
            'phone projection took the interface the carmakers wanted to own.',
      sources: ['Counterpoint', 'Company filings']
    },
    {
      id: 'thermal-ev', name: 'Thermal management', short: 'Thermal',
      shape: { x: 630, y: 270, w: 220, h: 146 },
      blurb: 'Heat pump, chiller, coolant loops and the plumbing that keeps a battery in its narrow happy range.',
      bomPct: 4, layout: 'board',
      market: { size: 'USD ~31bn', year: 2025, basis: 'automotive thermal management system revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Denso', p: 22 }, { c: 'Valeo', p: 15 }, { c: 'Hanon Systems', p: 13 },
        { c: 'MAHLE', p: 9 }, { c: 'Sanhua', p: 8 }
      ],
      note: 'Content per vehicle roughly doubles going from combustion to electric, because a battery ' +
            'needs both cooling and heating and there is no waste engine heat to borrow. One of the ' +
            'very few legacy automotive categories where electrification is unambiguously good news, ' +
            'compare the exhaust suppliers on the combustion car teardown, who are managing a ' +
            'declining asset.',
      sources: ['S&P Global Mobility', 'Company filings'],
      deals: [
        { y: 2025, a: 'Hankook Tire', t: 'Hanon Systems', v: 'control acquired', n: 'A tyre maker taking control of a thermal systems supplier, completing a long-running Hahn & Co exit.' }
      ]
    },

    /* ============ ROW 3 :: VEHICLE AND CHANNEL ============ */
    {
      id: 'chassis-ev', name: 'Body and chassis', short: 'Body',
      shape: { x: 150, y: 458, w: 220, h: 152 },
      blurb: 'Stampings, castings, suspension and the structure the battery now forms part of.',
      bomPct: 15, layout: 'board',
      market: { size: 'USD ~230bn', year: 2025, basis: 'body, chassis and structural system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Magna', p: 9 }, { c: 'Aisin', p: 6 }, { c: 'Benteler', p: 4 },
        { c: 'ZF', p: 4 }, { c: 'thyssenkrupp', p: 3 }
      ],
      note: 'Genuinely fragmented and structurally low margin, and largely identical to the combustion ' +
            'car. What is different is giga casting, replacing dozens of stampings with one aluminium ' +
            'part, which is a real threat to the tier-one stamping base and a real opportunity for ' +
            'the two or three firms that own very large casting machines.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'interior-ev', name: 'Interior', short: 'Interior',
      shape: { x: 390, y: 458, w: 220, h: 152 },
      blurb: 'Seats, trim, instrument panel and the acoustic package a silent powertrain suddenly made audible.',
      bomPct: 12, layout: 'board',
      market: { size: 'USD ~150bn', year: 2025, basis: 'automotive interior system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Adient', p: 12 }, { c: 'Lear', p: 11 }, { c: 'Forvia', p: 9 },
        { c: 'Magna', p: 7 }, { c: 'Toyota Boshoku', p: 6 }
      ],
      note: 'High revenue, single-digit margin, heavily exposed to labour cost and volume, and ' +
            'unchanged by electrification except in one respect. With no engine noise to mask it, road ' +
            'and wind noise become audible, so the acoustic package got harder rather than easier. ' +
            'Seating has been a serial disappointment for public market investors for twenty years and ' +
            'the transition has not altered that.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'charging-ev', name: 'Charging', short: 'Charging',
      shape: { x: 630, y: 458, w: 220, h: 152 },
      blurb: 'The on-board charger, the connector standard, and the public network the car plugs into.',
      bomPct: 2, layout: 'board',
      market: { size: 'USD ~42bn', year: 2025, basis: 'EV charging hardware and network revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'TELD', p: 13 }, { c: 'Star Charge', p: 11 }, { c: 'Tesla', p: 9 },
        { c: 'ABB', p: 7 }, { c: 'Alpitronic', p: 5 }, { c: 'Kempower', p: 3 }
      ],
      note: 'North America consolidating onto Tesla\'s connector after every major carmaker adopted it ' +
            'in 2023 is the rare case of a standards war ending decisively and quickly. It also ' +
            'stranded a great deal of venture capital that had funded the alternative. The deeper ' +
            'constraint is the same one the AI server teardown ends in: fast charging at scale is a ' +
            'grid connection problem, and the queue does not care what the connector looks like.',
      sources: ['BloombergNEF', 'Company filings']
    },
    {
      id: 'unpriced-ev', name: 'Not separately priced', short: 'Unpriced',
      blurb: 'Fasteners, adhesives, fluids, wiring, sound deadening, logistics and assembly labour.',
      bomPct: 9,
      market: { size: null, year: 2025, basis: 'residual share of vehicle build cost, not a market' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'Broadly the same residual as the combustion car, with one addition worth naming: an EV ' +
            'carries substantially more high-voltage wiring and shielding, and the harness is heavier ' +
            'and more expensive than in a petrol car. The combustion teardown makes the case for why ' +
            'that matters: a hand-assembled bundle of wire is the part most able to stop a factory.',
      sources: ['S&P Global Mobility', 'Company filings']
    },

    /* ============================ META ============================ */
    {
      id: 'oem-ev', name: 'Who sells the car', short: 'Brand', kind: 'meta',
      blurb: 'Global battery electric and plug-in hybrid sales, by group.',
      market: { size: 'USD ~850bn', year: 2025, basis: 'global plug-in vehicle sales, unit share' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'BYD', p: 21 }, { c: 'Tesla', p: 9 }, { c: 'Geely', p: 8 },
        { c: 'Volkswagen Group', p: 6 }, { c: 'SAIC', p: 5 }, { c: 'Changan', p: 4 },
        { c: 'Hyundai-Kia', p: 3.5 }, { c: 'Li Auto', p: 3 }
      ],
      note: 'Global electric car sales passed twenty million in 2025, about a quarter of all new cars ' +
            'sold, and nearly fifty-five percent of the Chinese market on its own. Six of the top ' +
            'eight groups here are Chinese. BYD passed Tesla on battery electric volume in 2025 and is ' +
            'vertically integrated down to its own cells and its own power semiconductors, which is ' +
            'why it can price the way it does. Note the basis: this counts plug-in hybrids as well as ' +
            'battery electric, and the ranking changes if you exclude them.',
      sources: ['IEA Global EV Outlook', 'Rho Motion', 'Counterpoint', 'Company filings']
    },
    {
      id: 'battery-makers', name: 'Cell manufacturers', short: 'Cell makers', kind: 'meta',
      blurb: 'The layer that decides what an electric car costs, and where almost all of it now sits.',
      market: { size: '~1,400 GWh', year: 2025, basis: 'EV battery installations, GWh deployed by producer' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'CATL', p: 37 }, { c: 'BYD', p: 17 }, { c: 'LG Energy Solution', p: 9 },
        { c: 'CALB', p: 4.5 }, { c: 'SK On', p: 4 }, { c: 'Panasonic', p: 3.5 },
        { c: 'Gotion', p: 3 }, { c: 'EVE Energy', p: 2.5 }
      ],
      note: 'Shown as a meta layer as well as a component because it is the structural fact of the ' +
            'industry, not just a line in a bill of materials. Battery pack prices have fallen by ' +
            'roughly ninety percent since 2010 on the BloombergNEF series, and essentially all of that ' +
            'learning curve was climbed by firms that are now Chinese or Korean. A carmaker without a ' +
            'cell position is a customer of its most important competitor.',
      sources: ['SNE Research', 'BloombergNEF', 'Benchmark Mineral Intelligence']
    },

    /* ==================== BATTERY CHILDREN ==================== */
    {
      id: 'cells-ev', parent: 'pack-ev', name: 'Cells', short: 'Cells',
      blurb: 'Prismatic, pouch or cylindrical. The chemistry choice cascades through the entire vehicle.',
      layout: 'chain',
      market: { size: 'USD ~120bn', year: 2025, basis: 'EV cell production value, GWh share' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'CATL', p: 37 }, { c: 'BYD', p: 17 }, { c: 'LG Energy Solution', p: 9 },
        { c: 'CALB', p: 4.5 }, { c: 'SK On', p: 4 }, { c: 'Panasonic', p: 3.5 }, { c: 'Gotion', p: 3 }
      ],
      note: 'Lithium iron phosphate, once dismissed in the West as a low-end chemistry, is now the ' +
            'majority of global volume because it is cheaper, safer, longer-lived and free of cobalt ' +
            'and nickel entirely. The Chinese producers committed to it a decade before anyone else ' +
            'and built the cathode chain around it. That single call is the origin of their cost ' +
            'advantage, and it is quietly dissolving the cobalt chokepoint four layers below.',
      sources: ['SNE Research', 'Benchmark Mineral Intelligence']
    },
    {
      id: 'bms', parent: 'pack-ev', name: 'Battery management', short: 'BMS',
      blurb: 'The electronics that measure every cell, balance them, and stop the pack destroying itself.',
      market: { size: 'USD ~9bn', year: 2025, basis: 'battery management system and monitoring silicon revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Analog Devices', p: 19 }, { c: 'Texas Instruments', p: 14 }, { c: 'NXP', p: 11 },
        { c: 'Infineon', p: 9 }, { c: 'Renesas', p: 7 }
      ],
      note: 'Analog Devices got here by buying Linear Technology for USD 14.8bn in 2017, which brought ' +
            'the battery monitoring franchise with it. A good reminder that in analog semiconductors ' +
            'the position is usually acquired rather than built: the design wins are decade-long and ' +
            'you cannot compete your way into them quickly.',
      sources: ['Yole Group', 'Company filings'],
      deals: [
        { y: 2017, a: 'Analog Devices', t: 'Linear Technology', v: 'USD 14.8bn', n: 'Brought high-precision battery monitoring and a decade of design wins.' }
      ]
    },
    {
      id: 'pack-enclosure', parent: 'pack-ev', name: 'Enclosure and cooling plate', short: 'Enclosure',
      blurb: 'The aluminium tray, the cooling plate under the cells, and the crash structure around them.',
      market: { size: 'USD ~14bn', year: 2025, basis: 'EV battery enclosure and thermal plate revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Magna', p: 9 }, { c: 'Constellium', p: 6 }, { c: 'Norsk Hydro', p: 5 },
        { c: 'Gestamp', p: 4 }
      ],
      note: 'A large, heavy aluminium structure that is also part of the car\'s crash protection, which ' +
            'is why it sits with the body suppliers rather than the battery ones. Cell-to-pack and ' +
            'cell-to-chassis designs are steadily deleting this layer by making the pack itself ' +
            'structural: one of the few places where the EV is genuinely simpler rather than ' +
            'differently complex.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'cathode-ev', parent: 'cells-ev', name: 'Cathode materials', short: 'Cathode',
      blurb: 'The active powder that determines energy density, cost and how long the pack lasts.',
      layout: 'chain',
      market: { size: 'USD ~42bn', year: 2025, basis: 'cathode active material revenue, all battery applications' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 82 }, { c: 'South Korea (all firms)', p: 8 },
        { c: 'Japan (all firms)', p: 7 }
      ],
      note: 'Shown by country because that is the actual finding: the individual firms are numerous ' +
            'and the concentration is geographic rather than corporate. Cathode is where the chemistry ' +
            'decision becomes a supply chain: an LFP cathode needs lithium, iron and phosphate, and a ' +
            'nickel-rich one needs cobalt and nickel, so the choice made at the cell layer determines ' +
            'which of the mining chains below actually matters.',
      sources: ['Benchmark Mineral Intelligence', 'IEA Global EV Outlook']
    },
    {
      id: 'graphite-anode', parent: 'cells-ev', name: 'Anode and graphite', short: 'Anode',
      blurb: 'Natural or synthetic graphite, spheroidised and coated. The least glamorous chokepoint in the car.',
      layout: 'chain',
      market: { size: 'USD ~11bn', year: 2025, basis: 'anode active material revenue, all battery applications' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 93 }, { c: 'Japan (all firms)', p: 4 }
      ],
      others: 3,
      note: 'China processes over ninety percent of the world\'s battery-grade graphite, and when ' +
            'Beijing put export controls on it in late 2023 the point was made cleanly: the ' +
            'chokepoint is not the mine. Graphite is geologically common and mined in several ' +
            'countries. Turning it into a spheroidised, coated anode powder is the hard part, and ' +
            'almost nobody outside China does it at scale.',
      sources: ['Benchmark Mineral Intelligence', 'IEA Global EV Outlook', 'USGS Mineral Commodity Summaries']
    },
    {
      id: 'separator-ev', parent: 'cells-ev', name: 'Separator', short: 'Separator',
      blurb: 'A microporous polymer film a few microns thick, keeping the electrodes apart without blocking ions.',
      market: { size: 'USD ~7bn', year: 2025, basis: 'lithium battery separator revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Semcorp', p: 26 }, { c: 'Sinoma', p: 13 }, { c: 'Asahi Kasei', p: 11 },
        { c: 'Toray', p: 9 }, { c: 'SKIET', p: 7 }
      ],
      note: 'A precision film business masquerading as a commodity: the separator is what stands ' +
            'between a working cell and a thermal runaway, and the coating and porosity control are ' +
            'genuinely difficult. Japanese firms invented the category and Chinese producers took the ' +
            'volume, which is the pattern of this entire teardown in one line.',
      sources: ['Benchmark Mineral Intelligence', 'Company filings']
    },
    {
      id: 'electrolyte-ev', parent: 'cells-ev', name: 'Electrolyte and salt', short: 'Electrolyte',
      blurb: 'Solvent, additives and lithium hexafluorophosphate: the salt that makes the whole thing conduct.',
      market: { size: 'USD ~9bn', year: 2025, basis: 'battery electrolyte and lithium salt revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Tinci Materials', p: 24 }, { c: 'Capchem', p: 14 }, { c: 'Do-Fluoride', p: 8 },
        { c: 'Mitsubishi Chemical', p: 5 }
      ],
      note: 'LiPF6, the standard lithium salt, is made by very few plants and is unpleasant chemistry, ' +
            'it hydrolyses into hydrogen fluoride on contact with moisture, which is both a ' +
            'manufacturing problem and the reason a damaged battery is dangerous in the specific way ' +
            'it is. Almost all of that capacity is Chinese.',
      sources: ['Benchmark Mineral Intelligence', 'Company filings']
    },
    {
      id: 'foils-ev', parent: 'cells-ev', name: 'Current collector foils', short: 'Foils',
      blurb: 'Copper foil for the anode and aluminium for the cathode, rolled to a few microns.',
      market: { size: 'USD ~12bn', year: 2025, basis: 'battery-grade copper and aluminium foil revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Wason Copper', p: 12 }, { c: 'Nuode', p: 10 }, { c: 'SK Nexilis', p: 8 },
        { c: 'Lotte Energy Materials', p: 6 }
      ],
      note: 'Battery-grade copper foil is rolled to around six microns, thin enough that handling it ' +
            'without tearing is the whole business, and every micron removed is weight saved and ' +
            'energy density gained. A genuinely capital-intensive commodity where the Korean and ' +
            'Chinese producers have been fighting a price war that has made almost nobody money.',
      sources: ['Benchmark Mineral Intelligence', 'Company filings']
    },

    /* ---- the mining and refining chain, four and five tiers down ---- */
    {
      id: 'li-refining', parent: 'cathode-ev', name: 'Lithium refining', short: 'Li refining',
      blurb: 'Turning concentrate or brine into battery-grade carbonate and hydroxide. Where the leverage actually is.',
      layout: 'chain',
      market: { size: 'USD ~24bn', year: 2025, basis: 'lithium chemical conversion capacity and output value' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 70 }, { c: 'Chile (all producers)', p: 12 },
        { c: 'South Korea (all firms)', p: 6 }, { c: 'Japan (all firms)', p: 4 }
      ],
      note: 'The single most misunderstood layer in the electric vehicle story. China refines something ' +
            'like seventy percent of the world\'s lithium chemicals and over eighty percent of its ' +
            'lithium hydroxide specifically, while mining relatively little of the raw material. ' +
            'Australia digs the rock and ships it to China to be turned into something a battery can ' +
            'use. A refinery takes about four years to build and only a handful of firms can hit ' +
            'battery-grade purity consistently, which is why capacity announcements outside China ' +
            'keep slipping.',
      sources: ['Benchmark Mineral Intelligence', 'IEA Global EV Outlook', 'Fastmarkets']
    },
    {
      id: 'co-refining', parent: 'cathode-ev', name: 'Cobalt refining', short: 'Co refining',
      blurb: 'Converting cobalt hydroxide into sulphate. The DRC mines it; almost nowhere else refines it.',
      layout: 'chain',
      market: { size: 'USD ~9bn', year: 2025, basis: 'refined cobalt production value' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 76 }, { c: 'Finland (all producers)', p: 6 },
        { c: 'Japan (all firms)', p: 5 }
      ],
      note: 'The DRC produces roughly three quarters of the world\'s mined cobalt and has no active ' +
            'refining capacity whatsoever, so essentially all of it is shipped out to be processed, ' +
            'overwhelmingly in China, much of it by Chinese-owned mines feeding Chinese-owned ' +
            'refineries. In 2025 the DRC government imposed an export ban and then a quota regime ' +
            'explicitly to force domestic processing to be built. Whether that works is one of the ' +
            'more consequential open questions in this entire teardown.',
      sources: ['Cobalt Institute', 'Fastmarkets', 'Benchmark Mineral Intelligence']
    },
    {
      id: 'ni-refining', parent: 'cathode-ev', name: 'Nickel refining', short: 'Ni refining',
      blurb: 'Class 1 nickel and nickel sulphate. Indonesia rewrote this market in about five years.',
      market: { size: 'USD ~18bn', year: 2025, basis: 'battery-grade nickel refining and sulphate production value' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Indonesia (all producers)', p: 42 }, { c: 'China (all firms combined)', p: 28 },
        { c: 'Japan (all firms)', p: 6 }
      ],
      note: 'The one branch of this chain where the answer is not primarily China, though most of the ' +
            'Indonesian capacity was built with Chinese capital and technology, so the distinction is ' +
            'thinner than the table suggests. Indonesia banned raw ore exports in 2020 to force ' +
            'processing onshore and it worked spectacularly, which is precisely the playbook the DRC ' +
            'is now attempting with cobalt.',
      sources: ['Benchmark Mineral Intelligence', 'USGS Mineral Commodity Summaries', 'IEA Global EV Outlook']
    },
    {
      id: 'li-mining', parent: 'li-refining', name: 'Lithium mining', short: 'Lithium',
      blurb: 'Hard rock spodumene and brine. Genuinely spread across several countries, which is the point.',
      market: { size: 'USD ~14bn', year: 2025, basis: 'lithium mine production value' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Australia (all producers)', p: 38 }, { c: 'Chile (all producers)', p: 24 },
        { c: 'China (all firms combined)', p: 18 }, { c: 'Argentina (all producers)', p: 10 }
      ],
      note: 'Included deliberately as the counterexample to the layer above it. Lithium mining is ' +
            'diversified, expandable and has repeatedly gone into oversupply, prices collapsed ' +
            'through 2024 and 2025. Nobody is short of lithium. The scarcity is entirely in the ' +
            'refining step, and conflating the two is the most common error made about this industry.',
      sources: ['USGS Mineral Commodity Summaries', 'Benchmark Mineral Intelligence']
    },
    {
      id: 'cobalt-mining', parent: 'co-refining', name: 'Cobalt mining', short: 'Cobalt',
      blurb: 'Three quarters of it from one country, mostly as a by-product of copper.',
      market: { size: 'USD ~8bn', year: 2025, basis: 'cobalt mine production value' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Congo (all producers)', p: 75 }, { c: 'Indonesia (all producers)', p: 11 },
        { c: 'Russia (all producers)', p: 3 }
      ],
      note: 'The bottom of this teardown, and the only terminus on the site with a human-rights ' +
            'question at it rather than a strategic one. The DRC supplies roughly three quarters of ' +
            'world mined cobalt, largely as a by-product of copper, so its supply responds to the ' +
            'copper price rather than to battery demand. Artisanal and small-scale mining, the part ' +
            'with the genuine labour problem attached, fell to around two percent of DRC output by ' +
            '2024, and rises whenever the cobalt price does. The 2025 export ban and quota regime ' +
            'pushed prices up sharply, which is exactly the condition under which artisanal digging ' +
            'increases. That is an uncomfortable feedback loop and it is worth stating plainly rather ' +
            'than leaving implied.',
      sources: ['Cobalt Institute', 'USGS Mineral Commodity Summaries', 'Fastmarkets']
    },
    {
      id: 'nickel-mining', parent: 'ni-refining', name: 'Nickel mining', short: 'Nickel',
      blurb: 'Indonesian laterite, which went from a minor source to over half of world supply in a decade.',
      market: { size: 'USD ~22bn', year: 2025, basis: 'nickel mine production value' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Indonesia (all producers)', p: 56 }, { c: 'Philippines (all producers)', p: 10 },
        { c: 'Russia (all producers)', p: 5 }, { c: 'Canada (all producers)', p: 4 }
      ],
      note: 'One of the fastest changes in any commodity market on this site. Indonesia went from a ' +
            'modest producer to more than half of world nickel supply by banning raw ore exports and ' +
            'letting Chinese investment build the smelters onshore. It crushed the price, made ' +
            'high-cost mines elsewhere uneconomic, and is the reason nickel-rich chemistries got ' +
            'cheaper at exactly the moment LFP was making them less necessary.',
      sources: ['USGS Mineral Commodity Summaries', 'Benchmark Mineral Intelligence']
    },
    {
      id: 'graphite-mining', parent: 'graphite-anode', name: 'Graphite mining', short: 'Graphite',
      blurb: 'Flake graphite, plus synthetic graphite made from petroleum needle coke.',
      market: { size: 'USD ~4bn', year: 2025, basis: 'natural graphite mine production value' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'China (all firms combined)', p: 77 }, { c: 'Mozambique (all producers)', p: 8 },
        { c: 'Madagascar (all producers)', p: 5 }
      ],
      note: 'Unusually, China leads the mining here as well as the processing, but the mining share is ' +
            'the less important number. Graphite deposits exist in many countries and new ones are ' +
            'straightforward to open; what is not straightforward is the spheroidisation and coating ' +
            'above. Note also that roughly half of anode material is now synthetic graphite made from ' +
            'petroleum coke, which sidesteps mining entirely and concentrates the chain further into ' +
            'industrial processing.',
      sources: ['USGS Mineral Commodity Summaries', 'Benchmark Mineral Intelligence']
    },

    /* ==================== MOTOR CHILDREN ==================== */
    {
      id: 'magnets', parent: 'emotor', name: 'Rare earth magnets', short: 'Magnets',
      /* Deliberately shallow and cross-linked: the submarine cable teardown
         follows rare earth separation down in depth. Two flagships sharing a
         terminus would tell one story twice. */
      upstream: ['power-ev'],
      blurb: 'Sintered neodymium iron boron. Every permanent magnet motor needs it and there is no ready substitute.',
      market: { size: 'USD ~21bn', year: 2025, basis: 'sintered NdFeB magnet production value, by country' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 91 }, { c: 'Japan (all firms)', p: 6 },
        { c: 'Europe and US (all firms)', p: 3 }
      ],
      note: 'The hardest non-semiconductor chokepoint on this site. China controls the mining, most of ' +
            'the separation chemistry and almost all of the magnet making, and the 2025 export ' +
            'licensing regime halted production lines at several Western carmakers within weeks, ' +
            'about as direct a demonstration of leverage as exists. This layer is deliberately ' +
            'shallow: the submarine cable teardown follows rare earth separation down properly, and ' +
            'repeating it here would tell the same story twice. What the EV adds is scale, since ' +
            'traction motors are now the largest single use of these magnets. Induction and ' +
            'externally excited motors avoid them entirely, which is exactly why BMW and Renault use ' +
            'them, and they pay for it in efficiency.',
      sources: ['Adamas Intelligence', 'USGS Mineral Commodity Summaries', 'IEA Global EV Outlook']
    },
    {
      id: 'motor-steel', parent: 'emotor', name: 'Electrical steel', short: 'Steel',
      blurb: 'Thin non-grain-oriented laminations. Boring, capacity constrained, and quietly a bottleneck.',
      market: { size: 'USD ~36bn', year: 2025, basis: 'electrical steel production value, all applications' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Baowu', p: 18 }, { c: 'Nippon Steel', p: 11 }, { c: 'POSCO', p: 9 },
        { c: 'JFE', p: 7 }, { c: 'ArcelorMittal', p: 6 }, { c: 'Cleveland-Cliffs', p: 4 }
      ],
      note: 'High-grade thin-gauge non-grain-oriented steel for traction motors needs specific rolling ' +
            'mills and there are not many. It has constrained motor output twice since 2021 and almost ' +
            'nobody outside the industry noticed. The microwave teardown reaches the same material ' +
            'from the opposite end: a transformer core in a sixty-dollar appliance and an EV traction ' +
            'motor are competing for capacity from the same short list of mills, alongside every grid ' +
            'transformer being built for the AI data centre boom.',
      sources: ['World Steel Association', 'Company filings']
    },
    {
      id: 'motor-windings', parent: 'emotor', name: 'Windings and copper', short: 'Windings',
      blurb: 'Rectangular hairpin copper, formed and welded rather than wound. Around 40 kg per car.',
      market: { size: 'USD ~8bn', year: 2025, basis: 'automotive magnet wire and winding revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Superior Essex', p: 12 }, { c: 'Sumitomo Electric', p: 10 },
        { c: 'Furukawa Electric', p: 8 }, { c: 'Elektrisola', p: 5 }
      ],
      note: 'Hairpin winding: stamping rectangular copper bars, bending them and laser-welding the ' +
            'ends, replaced round wire because it packs more copper into the same slot and is far ' +
            'more automatable. It is one of the genuine manufacturing innovations of the transition ' +
            'and it went almost entirely unremarked outside the industry. An electric car carries ' +
            'roughly three to four times the copper of a combustion one.',
      sources: ['IDTechEx', 'Company filings']
    },
    {
      id: 'gearbox-ev', parent: 'emotor', name: 'Reduction gearbox', short: 'Gearbox',
      blurb: 'A single fixed ratio, usually around 9:1. The part that replaced the eight-speed automatic.',
      market: { size: 'USD ~9bn', year: 2025, basis: 'EV reduction gear and e-axle transmission revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ZF', p: 12 }, { c: 'Aisin', p: 9 }, { c: 'BorgWarner', p: 7 },
        { c: 'Magna', p: 6 }, { c: 'GKN Automotive', p: 5 }
      ],
      note: 'The clearest single illustration of what electrification does to a supplier. A ' +
            'multi-speed automatic is one of the hardest things in a car to engineer and commands ' +
            'price accordingly; a single-speed reduction gear is a well-understood pair of gears. The ' +
            'same firms supply both, at a fraction of the content value: the combustion car teardown ' +
            'shows what they are losing.',
      sources: ['IDTechEx', 'Automotive News Top Suppliers']
    },

    /* ==================== POWER ELECTRONICS CHILDREN ==================== */
    {
      id: 'sic', parent: 'power-ev', name: 'Silicon carbide devices', short: 'SiC',
      blurb: 'Wide-bandgap transistors that cut inverter losses. Worth five to ten percent more range.',
      layout: 'chain',
      market: { size: 'USD ~7bn', year: 2025, basis: 'automotive silicon carbide device revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'STMicroelectronics', p: 27 }, { c: 'Infineon', p: 24 }, { c: 'onsemi', p: 17 },
        { c: 'Rohm', p: 8 }, { c: 'Wolfspeed', p: 7 }, { c: 'Mitsubishi Electric', p: 5 }
      ],
      note: 'A cautionary tale, and the most useful one on this teardown. Everyone built silicon ' +
            'carbide capacity for a demand curve that flattened when EV growth slowed and Chinese ' +
            'substrate suppliers crashed pricing. Wolfspeed, the pure play that spent billions on ' +
            'capacity, filed a prepackaged Chapter 11 in 2025. Capacity bets underwritten on a single ' +
            'end market rarely end well, and this one had every ingredient: a real technology ' +
            'advantage, a credible demand forecast, and no margin for the forecast being early.',
      sources: ['Yole Group', 'TrendForce', 'Company filings'],
      deals: [
        { y: 2025, a: 'Wolfspeed', t: 'prepackaged Chapter 11', v: 'USD ~4.6bn debt reduced', n: 'The purest silicon carbide bet in the industry restructured after demand fell short of capacity.' },
        { y: 2021, a: 'onsemi', t: 'GT Advanced Technologies', v: 'USD 415m', n: 'Secured captive SiC substrate supply ahead of the shortage.' }
      ]
    },
    {
      id: 'igbt', parent: 'power-ev', name: 'IGBT modules', short: 'IGBT',
      blurb: 'The incumbent silicon switch. Cheaper than silicon carbide and still the majority of vehicles.',
      market: { size: 'USD ~12bn', year: 2025, basis: 'automotive IGBT and module revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Infineon', p: 29 }, { c: 'Fuji Electric', p: 12 }, { c: 'Mitsubishi Electric', p: 11 },
        { c: 'BYD Semiconductor', p: 8 }, { c: 'onsemi', p: 7 }, { c: 'StarPower', p: 6 }
      ],
      note: 'BYD appears because it designs and fabricates its own power modules, which almost no other ' +
            'carmaker does. Vertical integration from the refinery to the retail showroom is the actual ' +
            'BYD strategy, and this row is the least visible part of it.',
      sources: ['Omdia', 'Yole Group']
    },
    {
      id: 'obc-ev', parent: 'power-ev', name: 'On-board charger', short: 'OBC',
      blurb: 'The AC-to-DC converter that lets the car charge from a wall rather than a fast charger.',
      market: { size: 'USD ~7bn', year: 2025, basis: 'EV on-board charger and DC-DC converter revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'BYD', p: 14 }, { c: 'Delta Electronics', p: 11 }, { c: 'LG Electronics', p: 8 },
        { c: 'Valeo', p: 7 }, { c: 'Vitesco', p: 6 }
      ],
      note: 'Delta Electronics appears here and in the AI server teardown for the same reason: it is a ' +
            'power conversion company, and power conversion turned out to be a growth industry twice ' +
            'over. Bidirectional charging, letting the car power a house or the grid, is the ' +
            'interesting development, and it makes this component considerably more valuable than it ' +
            'has been.',
      sources: ['IDTechEx', 'Company filings']
    },
    {
      id: 'sic-substrate', parent: 'sic', name: 'SiC substrate', short: 'Substrate',
      blurb: 'The silicon carbide boule and wafer, grown over days at 2,000°C. The hard part, and the price war.',
      market: { size: 'USD ~2.4bn', year: 2025, basis: 'silicon carbide substrate revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'Wolfspeed', p: 22 }, { c: 'SICC', p: 17 }, { c: 'TankeBlue', p: 14 },
        { c: 'Coherent', p: 11 }, { c: 'SK siltron', p: 7 }
      ],
      note: 'Where the silicon carbide story actually went wrong. Growing SiC crystal is slow, ' +
            'difficult and was for years the binding constraint, so everyone invested in it. Then ' +
            'Chinese producers scaled 8-inch substrate faster than expected and prices fell by ' +
            'something like seventy percent in two years, which destroyed the economics of exactly the ' +
            'capacity that had been built to fix the shortage. The constraint became the glut.',
      sources: ['Yole Group', 'TrendForce', 'Company filings']
    },

    /* ==================== ADAS AND COCKPIT CHILDREN ==================== */
    {
      id: 'adas-soc', parent: 'adas', name: 'Autonomy compute', short: 'Compute',
      blurb: 'The processor running perception and planning, from a modest assist chip to hundreds of teraops.',
      market: { size: 'USD ~16bn', year: 2025, basis: 'ADAS and autonomous driving SoC shipments' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Mobileye', p: 31 }, { c: 'Horizon Robotics', p: 20 }, { c: 'Nvidia', p: 13 },
        { c: 'Texas Instruments', p: 9 }, { c: 'Qualcomm', p: 8 }, { c: 'Renesas', p: 6 }
      ],
      note: 'Mobileye still leads on units through low-cost driver assist. Horizon Robotics went from ' +
            'nothing to second place in about four years on the back of Chinese carmakers wanting a ' +
            'domestic alternative, which is the pattern to watch across every automotive ' +
            'semiconductor category on this page.',
      sources: ['Counterpoint', 'Yole Group', 'Company filings']
    },
    {
      id: 'lidar', parent: 'adas', name: 'Lidar', short: 'Lidar',
      blurb: 'Laser ranging. Cost fell from tens of thousands of dollars to a few hundred in under a decade.',
      market: { size: 'USD ~1.4bn', year: 2025, basis: 'automotive lidar revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Hesai', p: 30 }, { c: 'RoboSense', p: 25 }, { c: 'Huawei', p: 14 },
        { c: 'Seyond', p: 8 }, { c: 'Valeo', p: 5 }
      ],
      note: 'Almost the entire Western lidar cohort that listed via SPAC in 2020 and 2021 has since ' +
            'failed, merged or restructured, while Chinese suppliers took the volume by pricing at a ' +
            'fraction. A near-perfect case study in confusing a technology thesis with a business, ' +
            'the technology worked exactly as promised and the companies still did not survive it.',
      sources: ['Yole Group', 'Company filings']
    },
    {
      id: 'radar', parent: 'adas', name: 'Radar', short: 'Radar',
      blurb: 'Millimetre-wave sensing that works in fog, rain and darkness. The unglamorous sensor everything relies on.',
      market: { size: 'USD ~10bn', year: 2025, basis: 'automotive radar module revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Bosch', p: 20 }, { c: 'Continental', p: 18 }, { c: 'ZF', p: 13 },
        { c: 'Aptiv', p: 10 }, { c: 'Denso', p: 9 }, { c: 'Forvia', p: 7 }
      ],
      note: 'A stable German and Japanese oligopoly at the module level, sitting on top of a radar ' +
            'silicon layer that NXP, Infineon and Texas Instruments split between them. Two very ' +
            'different competitive structures stacked on each other, and the silicon layer is the one ' +
            'with the pricing power.',
      sources: ['Yole Group', 'Company filings']
    },
    {
      id: 'cam-adas', parent: 'adas', name: 'Cameras', short: 'Cameras',
      blurb: 'Eight to fourteen per vehicle, and the only sensor Tesla has been willing to build a strategy on.',
      market: { size: 'USD ~13bn', year: 2025, basis: 'automotive camera module revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Sunny Optical', p: 14 }, { c: 'LG Innotek', p: 12 }, { c: 'Magna', p: 10 },
        { c: 'Bosch', p: 9 }, { c: 'Valeo', p: 8 }, { c: 'Continental', p: 7 }
      ],
      note: 'The image sensors inside are a different market again, and there OmniVision and onsemi ' +
            'lead automotive rather than Sony: the reverse of the smartphone teardown, because ' +
            'automotive sensors are optimised for dynamic range and LED flicker rejection rather than ' +
            'megapixels. Same suppliers, different winners, because the specification is different.',
      sources: ['Yole Group', 'TSR']
    },
    {
      id: 'cockpit-soc', parent: 'cockpit', name: 'Cockpit processor', short: 'Cockpit SoC',
      blurb: 'The application processor running the screens, the maps and the voice assistant.',
      market: { size: 'USD ~11bn', year: 2025, basis: 'digital cockpit SoC revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Qualcomm', p: 42 }, { c: 'Samsung LSI', p: 12 }, { c: 'Intel', p: 9 },
        { c: 'Renesas', p: 8 }, { c: 'MediaTek', p: 6 }
      ],
      note: 'Qualcomm\'s share here is higher than in the cockpit category above it, because the ' +
            'processor is the part it actually won. It got there by treating a car like a phone, ' +
            'shipping a mature Android-adjacent software stack when the incumbents were still ' +
            'shipping bespoke firmware, and the incumbents have not recovered the position.',
      sources: ['Counterpoint', 'Company filings']
    },
    {
      id: 'cockpit-display', parent: 'cockpit', name: 'Displays', short: 'Displays',
      blurb: 'Increasingly large, increasingly numerous, and increasingly the thing a car is judged on.',
      market: { size: 'USD ~14bn', year: 2025, basis: 'automotive display panel and module revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'BOE', p: 17 }, { c: 'LG Display', p: 14 }, { c: 'Tianma', p: 11 },
        { c: 'AU Optronics', p: 9 }, { c: 'Innolux', p: 8 }
      ],
      note: 'The same panel makers as the smartphone and smart TV teardowns, selling into a market with ' +
            'far lower volumes but much longer product life and far harsher qualification: a car ' +
            'display has to work at minus forty and survive a decade of direct sun. Automotive is ' +
            'where panel makers go for margin when consumer pricing collapses.',
      sources: ['Omdia', 'Counterpoint']
    },

    /* ==================== VEHICLE CHILDREN ==================== */
    {
      id: 'castings-ev', parent: 'chassis-ev', name: 'Structural castings', short: 'Castings',
      blurb: 'Giga castings replacing dozens of stamped parts with one aluminium piece.',
      market: { size: 'USD ~32bn', year: 2025, basis: 'automotive aluminium structural casting revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Nemak', p: 11 }, { c: 'Georg Fischer', p: 8 }, { c: 'Ryobi', p: 6 },
        { c: 'Magna', p: 5 }
      ],
      note: 'The technique the combustion car teardown describes as the fastest-moving part of body ' +
            'engineering, and it arrived here first because EV makers were building new lines anyway. ' +
            'It also inherits the same deep dependency: automotive aluminium alloy is a few percent ' +
            'magnesium, and China produces around ninety percent of the world\'s magnesium.',
      sources: ['Automotive News Top Suppliers', 'Company filings']
    },
    {
      id: 'heatpump-ev', parent: 'thermal-ev', name: 'Heat pump', short: 'Heat pump',
      blurb: 'A reversible refrigeration loop that heats the cabin without burning range.',
      market: { size: 'USD ~9bn', year: 2025, basis: 'EV heat pump system revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Denso', p: 21 }, { c: 'Hanon Systems', p: 16 }, { c: 'Valeo', p: 13 },
        { c: 'Sanhua', p: 11 }, { c: 'MAHLE', p: 8 }
      ],
      note: 'A combustion engine throws away roughly two thirds of its fuel energy as heat, so cabin ' +
            'heating is free. An EV has no such waste, and resistive heating can cost a third of ' +
            'winter range, so the heat pump went from an option to near-standard in about five years. ' +
            'It is the single clearest example of electrification creating a component category ' +
            'rather than deleting one.',
      sources: ['IDTechEx', 'Company filings']
    },
    {
      id: 'glass-ev', parent: 'chassis-ev', name: 'Glazing', short: 'Glass',
      blurb: 'Laminated glass, increasingly a full panoramic roof, and increasingly heavy.',
      market: { size: 'USD ~26bn', year: 2025, basis: 'automotive glazing revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Fuyao', p: 26 }, { c: 'Saint-Gobain', p: 20 }, { c: 'AGC', p: 17 },
        { c: 'NSG', p: 12 }, { c: 'Xinyi Glass', p: 8 }
      ],
      note: 'Identical to the combustion car, with one twist: panoramic glass roofs became an EV ' +
            'styling signature and they are heavy and thermally difficult, which pushes back on both ' +
            'range and the heat pump above. A design decision made for showroom appeal that quietly ' +
            'costs engineering everywhere else.',
      sources: ['Company filings', 'Automotive News Top Suppliers']
    },

    /* ==================== CHARGING CHILDREN ==================== */
    {
      id: 'charge-hw', parent: 'charging-ev', name: 'Charger hardware', short: 'Chargers',
      blurb: 'The power electronics in the post: rectifiers, cooling, and a cable heavy enough to need it.',
      market: { size: 'USD ~19bn', year: 2025, basis: 'EV charging hardware revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'ABB', p: 12 }, { c: 'Alpitronic', p: 10 }, { c: 'Star Charge', p: 9 },
        { c: 'Tesla', p: 8 }, { c: 'Kempower', p: 5 }, { c: 'Delta Electronics', p: 5 }
      ],
      note: 'A 350 kW charger is a serious piece of power electronics, comparable to an AI server rack ' +
            'in draw, and the cable has to be liquid-cooled to stay liftable. Alpitronic came from ' +
            'nowhere to lead European fast charging on engineering rather than scale, which is rare in ' +
            'a category this capital-intensive.',
      sources: ['BloombergNEF', 'Company filings']
    },
    {
      id: 'charge-network', parent: 'charging-ev', name: 'Charging networks', short: 'Networks',
      blurb: 'Who owns the sites, and the grid connection underneath each one.',
      market: { size: 'USD ~23bn', year: 2025, basis: 'public charging network service revenue' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'TELD', p: 17 }, { c: 'Star Charge', p: 14 }, { c: 'Tesla', p: 9 },
        { c: 'YKC', p: 6 }, { c: 'Ionity', p: 3 }
      ],
      note: 'China has more public charging points than the rest of the world combined, which is the ' +
            'less-remarked half of why its EV adoption ran ahead of everyone else\'s. The binding ' +
            'constraint on a charging site is not the hardware but the grid connection: the same ' +
            'queue the AI server rack teardown ends in, and increasingly the same substations.',
      sources: ['BloombergNEF', 'IEA Global EV Outlook']
    }
  ]
});
