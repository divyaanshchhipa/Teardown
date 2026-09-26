/* Teardown :: Laptop
 * Shares are indicative unit or revenue shares for the stated year and basis.
 * Confidence is stated per node. See README for the sourcing policy.
 */
TD.device({
  id: 'laptop',
  name: 'Laptop',
  icon: 'laptop',
  category: 'Consumer computing',
  tagline: 'Six hundred parts, about a dozen companies that actually matter.',
  unit: { volume: '~262m units shipped (2025)', price: 'USD ~760 average selling price' },
  intro: 'A notebook is the cleanest demonstration of how tech supply chains really work. ' +
         'The brand on the lid captures the customer relationship and very little of the margin. ' +
         'Walk two or three layers down and you reach a handful of firms with structural pricing power, ' +
         'and then one Dutch company with no competitor at all.',
  view: { w: 1000, h: 640 },
  frames: [
    { label: 'Display assembly', x: 130, y: 14, w: 740, h: 296 },
    { label: 'Base assembly', x: 130, y: 326, w: 740, h: 300 }
  ],
  /* ============================ STORY ============================
   * The long-form analysis rendered below the teardown, by js/story.js.
   * This block is editorial copy and grouping only: every id it names is a
   * node defined further down this file, and every figure shown alongside
   * it is read from that node at render time rather than written here, so
   * the prose cannot drift away from the data.
   *
   * `stages` is ordered upstream to downstream and must account for all 48
   * nodes exactly once, js/story.js asserts that on load and warns loudly
   * if a node is missed, duplicated or unknown. That is what stops the
   * "how it is built" strip quietly telling an incomplete story.
   */
  story: {
    kicker: 'Flagship teardown',
    headline: 'A laptop is assembled by one company, and controlled by another.',
    lede: 'Six hundred parts, forty-eight mapped layers, five tiers deep. The company on the lid ' +
          'sets the price and captures the customer. It manufactures none of the machine, and the ' +
          'further down the chain you go, the fewer firms there are to choose from.',

    /* Editorial lines js/story.js cannot derive: which country reading
       contradicts the cost reading, and the closing line on the tier chart.
       Both were hardcoded in story.js until the smartphone needed its own. */
    tierNote: 'Nothing about a laptop is concentrated until you stop looking at the laptop.',
    geoLede: 'Two readings of the same question. By cost, a laptop is largely an East Asian product. ' +
             'By structural position, one European supplier matters more than any of them.',

    findings: [
      { title: 'The brand builds nothing',
        body: 'Lenovo, HP and Dell design the product, own the customer and take the margin. ' +
              'The physical machine is assembled by Taiwanese contract manufacturers whose names ' +
              'appear nowhere on it, and the ODM layer is more concentrated than the brand layer.',
        nodes: ['oem', 'odm'] },
      { title: 'Power increases with depth',
        body: 'At the surface this is a competitive industry: seven panel makers, six battery ' +
              'suppliers, a real fight for every socket. Four layers down it is one Dutch company, ' +
              'and below that two single-supplier layers with no alternative at all.',
        nodes: ['panel', 'litho', 'euv-optics'] },
      { title: 'Taiwan assembles it, the Netherlands gates it',
        body: 'Taiwan holds more supplier positions in this teardown than any other country. But ' +
              'the single most consequential position belongs to one firm in Veldhoven, without ' +
              'whose machines none of the silicon above can be made at current nodes.',
        nodes: ['odm', 'litho'] }
    ],

    /* upstream -> downstream. Node counts here must sum to 47. */
    stages: [
      { id: 'design', name: 'Design and IP',
        note: 'Nothing physical exists yet. A processor begins as an instruction set licensed ' +
              'from one company and a design drawn in software sold by two others.',
        nodes: ['cpu-ip', 'eda'] },
      { id: 'equipment', name: 'Fab equipment and materials',
        note: 'Before a wafer can be patterned, someone has to build the machine that patterns ' +
              'it. This is the narrowest tier in the entire teardown.',
        nodes: ['litho', 'semicap', 'wafer', 'photoresist', 'gases', 'euv-optics', 'euv-source'] },
      { id: 'fab', name: 'Wafer fabrication',
        note: 'Where the design becomes silicon. Leading-edge notebook processors are made in ' +
              'very few places.',
        nodes: ['foundry'] },
      { id: 'packaging', name: 'Packaging and test',
        note: 'Dies are cut, mounted, wired and tested. The least concentrated step in the ' +
              'silicon chain, and the only one with a real merchant market.',
        nodes: ['osat'] },
      { id: 'silicon', name: 'Silicon components',
        note: 'The finished chips: processor, graphics, memory, storage, radio, power and ' +
              'firmware. From here the chain stops being a line and fans out.',
        nodes: ['cpu', 'gpu', 'dram', 'nand', 'ssd', 'ssd-controller', 'wifi', 'pmic', 'firmware'] },
      { id: 'display', name: 'Display module',
        note: 'Panel, backlight, driver silicon and cover glass laminated into the lid. The ' +
              'single most expensive subsystem in the machine.',
        nodes: ['panel', 'backlight', 'driver-ic', 'cover-glass', 'display-assembly'] },
      { id: 'power', name: 'Power',
        note: 'Cathode and anode materials become cells, cells become a pack shaped to whatever ' +
              'space the chassis had left.',
        nodes: ['cell-mats', 'cell', 'battery'] },
      { id: 'enclosure', name: 'Cooling and enclosure',
        note: 'Fans, heat pipes, casings and hinges. Low margin, largely Taiwanese, and the part ' +
              'of the machine no analyst house covers properly.',
        nodes: ['fan', 'heatpipe', 'thermal', 'enclosure', 'hinge'] },
      { id: 'input', name: 'Input, audio and sensing',
        note: 'Everything the user actually touches or is seen by, plus the antennas. Cheap per ' +
              'unit, and almost entirely supplied out of Taiwan.',
        nodes: ['keyboard', 'touchpad', 'audio', 'wireless', 'webcam', 'image-sensor',
                'cam-lens', 'cam-module'] },
      { id: 'board', name: 'Board assembly',
        note: 'Chips are placed onto a multi-layer board with its connectors. More of the ' +
              'device\'s cost converges here than anywhere else.',
        nodes: ['pcb', 'ports', 'motherboard'] },
      { id: 'assembly', name: 'Final assembly and the box',
        note: 'A contract manufacturer puts the machine together, usually in Chongqing or ' +
              'increasingly in Vietnam and Mexico, and ships it under someone else\'s name, ' +
              'with a charger, cabling and packaging that nobody prices publicly.',
        nodes: ['odm', 'unpriced'] },
      { id: 'channel', name: 'Brand, OS and channel',
        note: 'The badge, the operating system and the route to the customer: the three layers ' +
              'that touch the buyer and build none of the hardware.',
        nodes: ['oem', 'os'] }
    ],

    /* The value chain as it actually runs: four parallel routes converging
       on final assembly. Every step is a node id defined below. */
    flow: {
      lanes: [
        { label: 'Silicon', steps: ['cpu-ip', 'eda', 'foundry', 'osat', 'motherboard'],
          feed: { label: 'Equipment and materials',
                  steps: ['litho', 'semicap', 'wafer', 'photoresist', 'gases'] } },
        { label: 'Display', steps: ['panel', 'backlight', 'driver-ic', 'display-assembly'] },
        { label: 'Power', steps: ['cell-mats', 'cell', 'battery'] },
        { label: 'Mechanical', steps: ['enclosure', 'hinge', 'thermal'] }
      ],
      converge: ['odm', 'oem']
    }
  },
  nodes: [

    /* ============ ROOT LEVEL ============ */
    {
      id: 'display-assembly', name: 'Display assembly', short: 'Display',
      shape: { x: 160, y: 66, w: 520, h: 200 },
      blurb: 'Panel, backlight, cover sheet, driver electronics and the lid that holds them. ' +
             'The single most expensive subsystem in most notebooks.',
      bomPct: 17, layout: 'board',
      market: { size: 'USD ~24bn', year: 2025, basis: 'notebook display panel shipments' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'BOE', p: 31 }, { c: 'Innolux', p: 16 }, { c: 'AU Optronics', p: 14 },
        { c: 'CSOT', p: 13 }, { c: 'LG Display', p: 11 }, { c: 'HKC', p: 7 }, { c: 'Tianma', p: 4 }
      ],
      note: 'Notebook panels are now a mainland China led industry. BOE and CSOT together ship close to half of all units, ' +
            'a position built through a decade of state backed capex that the Korean and Taiwanese incumbents chose not to match.',
      sources: ['Omdia panel shipment tracker', 'TrendForce'],
      deals: [
        { y: 2025, a: 'CSOT (TCL)', t: 'LG Display Guangzhou LCD fab', v: 'USD ~1.5bn', n: 'LG Display completed its exit from large LCD, handing the capacity to a Chinese rival.' }
      ]
    },
    {
      id: 'webcam', name: 'Camera module', short: 'Webcam',
      shape: { x: 420, y: 32, w: 160, h: 26 },
      blurb: 'Image sensor, lens stack and a module house that glues them together. Under two dollars of content in a mainstream machine.',
      bomPct: 1, layout: 'board',
      market: { size: 'USD ~1.4bn', year: 2025, basis: 'notebook camera modules' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Chicony', p: 26 }, { c: 'Lite-On', p: 18 }, { c: 'Sunny Optical', p: 14 },
        { c: 'Cowell', p: 8 }, { c: 'Luxshare', p: 6 }
      ],
      note: 'Module assembly is low margin and fragmented. The value concentrates one level up, in the image sensor.',
      sources: ['Company filings', 'TrendForce']
    },
    {
      /* This node and `wifi` inside the mainboard used to carry an identical
         Intel-led share table, which double-counted the same silicon in two
         places and printed the same market twice in the tightest-layers
         chart. They are different things and now say so: the combo chip is a
         mainboard layer, and this is the physical antenna assembly in the
         lid, where it has to sit because the metal in the base blocks it. */
      id: 'wireless', name: 'Antennas and RF cabling', short: 'Antennas',
      shape: { x: 696, y: 66, w: 144, h: 200 },
      blurb: 'The antenna elements printed or stamped into the lid, and the coaxial cabling that runs down the hinge to the radio.',
      /* No cost share stated. The 1.5% this node used to carry was for the
         combo silicon plus the antennas, and the silicon is already priced
         inside the mainboard as `wifi`, carrying it here too was the
         double-count. Nothing published prices the antennas alone, so they
         fall into `unpriced` with the rest of what this teardown cannot
         cost line by line. */
      market: { size: null, year: 2025, basis: 'notebook internal antenna and RF cable assemblies' },
      asOf: '2025', confidence: 'low',
      shares: [],
      /* Named but not measured. The suppliers are identifiable: this is a
         real business with real incumbents, but no published tracker covers
         notebook antennas, and the one share figure found for it could not be
         verified against a retrievable document. A single-entry share table
         would have scored as "competitive" on the strength of one number,
         which would be worse than admitting the gap. */
      note: 'Supplied by a small group of specialists: Wistron NeWeb, Auden and INPAQ in Taiwan, Sunway ' +
            'Communication and Luxshare in China, plus the interconnect majors. No published tracker ' +
            'covers notebook antennas, so this layer is named and placed rather than measured. It is one ' +
            'of the quietest roll-up opportunities in the machine for exactly that reason.',
      sources: ['Company statements', 'Taiwan listed company filings']
    },
    {
      id: 'hinge', name: 'Hinges and lid mechanics', short: 'Hinges',
      shape: { x: 300, y: 274, w: 400, h: 26 },
      blurb: 'Precision metal parts rated for tens of thousands of cycles. Unglamorous, and quietly a Taiwanese duopoly.',
      bomPct: 2,
      market: { size: 'USD ~1.1bn', year: 2025, basis: 'notebook hinge assemblies' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Jarllytec', p: 33 }, { c: 'Shin Zu Shing', p: 28 }, { c: 'Foxconn', p: 12 }
      ],
      note: 'A good example of the site thesis. Nobody thinks about hinges, and two firms in Taiwan hold roughly ' +
            'sixty percent of a billion dollar category with real switching costs, because a hinge is qualified per chassis design.',
      sources: ['Taiwan listed company filings']
    },
    {
      id: 'motherboard', name: 'Mainboard', short: 'Mainboard',
      shape: { x: 160, y: 322, w: 360, h: 130 },
      blurb: 'The board, and everything soldered to it. About forty percent of the bill of materials and nearly all of the interesting economics.',
      bomPct: 39, layout: 'board',
      market: { size: 'USD ~76bn', year: 2025, basis: 'notebook mainboard content, all silicon and PCB' },
      asOf: '2025', confidence: 'medium',
      shares: [],
      /* Deliberately no share table. A mainboard is an assembly, not a market:
         nobody sells "a notebook mainboard" as a merchant product, so there is
         no denominator to take a share of. The layers inside it each have one,
         and that is where the analysis belongs. The market size below is the
         summed content value, which is a real figure and a different claim
         from a share. */
      note: 'No single share table applies to a whole mainboard. Open it and price each layer separately.',
      sources: ['Prismark', 'TrendForce']
    },
    {
      id: 'thermal', name: 'Cooling', short: 'Cooling',
      shape: { x: 532, y: 322, w: 144, h: 130 },
      blurb: 'Fans, heat pipes or a vapour chamber, and the paste in between. The constraint on every thin notebook design.',
      bomPct: 3, layout: 'board',
      market: { size: 'USD ~3.9bn', year: 2025, basis: 'notebook thermal modules' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Auras', p: 24 }, { c: 'AVC', p: 22 }, { c: 'Sunon', p: 17 },
        { c: 'Delta Electronics', p: 14 }, { c: 'Foxconn', p: 8 }
      ],
      note: 'The same Taiwanese thermal names now sell into AI server liquid cooling at several times the content per unit. ' +
            'That is one of the cleaner re rating stories in the hardware supply chain.',
      sources: ['Taiwan listed company filings', 'TrendForce']
    },
    {
      id: 'audio', name: 'Audio', short: 'Audio',
      shape: { x: 688, y: 322, w: 152, h: 130 },
      blurb: 'Codec silicon, a smart amplifier, speaker drivers and microphones.',
      bomPct: 1.5, layout: 'board',
      market: { size: 'USD ~1.8bn', year: 2025, basis: 'notebook audio content' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Realtek', p: 47 }, { c: 'Cirrus Logic', p: 17 }, { c: 'Texas Instruments', p: 11 },
        { c: 'Goertek', p: 9 }
      ],
      note: 'Realtek owns the commodity codec socket almost by default. Premium machines move to Cirrus or TI smart amps.',
      sources: ['Company filings']
    },
    {
      id: 'battery', name: 'Battery pack', short: 'Battery',
      shape: { x: 160, y: 462, w: 246, h: 140 },
      blurb: 'Lithium polymer cells, a protection circuit and a fuel gauge, packed to fit whatever space the chassis left over.',
      bomPct: 6, layout: 'board',
      market: { size: 'USD ~4.2bn', year: 2025, basis: 'notebook battery cells and packs' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'ATL', p: 29 }, { c: 'LG Energy Solution', p: 18 }, { c: 'Samsung SDI', p: 14 },
        { c: 'Sunwoda', p: 12 }, { c: 'Desay', p: 9 }, { c: 'Panasonic', p: 6 }
      ],
      note: 'ATL is privately held, is the affiliate that CATL was spun out of, and is the largest maker of the small ' +
            'polymer cells inside consumer electronics. It is the most important battery company most people cannot buy shares in.',
      sources: ['TrendForce', 'Company filings']
    },
    {
      id: 'keyboard', name: 'Keyboard', short: 'Keyboard',
      shape: { x: 418, y: 462, w: 246, h: 140 },
      blurb: 'A membrane or scissor switch assembly, backlight film, and a controller. Sold as a finished module to the ODM.',
      bomPct: 4,
      market: { size: 'USD ~3.1bn', year: 2025, basis: 'notebook keyboard modules' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Chicony', p: 30 }, { c: 'Lite-On', p: 19 }, { c: 'Primax', p: 14 }, { c: 'Darfon', p: 11 }
      ],
      note: 'Regional labour cost drives this category more than technology. Production has been moving to Vietnam, Thailand and India since 2019.',
      sources: ['Taiwan listed company filings']
    },
    {
      id: 'touchpad', name: 'Touchpad', short: 'Touchpad',
      shape: { x: 676, y: 462, w: 164, h: 64 },
      blurb: 'A capacitive sensor grid and the controller that turns noise into gestures. The controller is the whole business.',
      bomPct: 1.5,
      market: { size: 'USD ~0.9bn', year: 2025, basis: 'notebook touch controller silicon' },
      /* Demoted from medium by the provenance audit. No tracker publishes
         this layer; the split is reconciled from Synaptics' and Elan's own
         segment reporting, which is a derived figure and cannot support a
         better grade than low. The duopoly is not in doubt: the split
         between the two is. */
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Synaptics', p: 34 }, { c: 'Elan Microelectronics', p: 31 }, { c: 'Alps Alpine', p: 10 }
      ],
      note: 'A near duopoly in controller silicon that has held for over a decade. Elan took share by pricing under Synaptics into Asian ODMs.',
      sources: ['Company filings']
    },
    {
      id: 'enclosure', name: 'Chassis and enclosure', short: 'Chassis',
      shape: { x: 676, y: 538, w: 164, h: 64 },
      blurb: 'Machined aluminium, magnesium alloy or moulded plastic. Heavy, capital intensive, and made almost entirely in one place.',
      bomPct: 9,
      market: { size: 'USD ~6.5bn', year: 2025, basis: 'notebook casing and structural parts' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Ju Teng', p: 27 }, { c: 'Catcher', p: 16 }, { c: 'Foxconn', p: 15 }, { c: 'Luxshare', p: 8 }
      ],
      note: 'CNC machining capacity is the moat. Catcher sold its iPhone casing plants to Lens Technology in 2020 and redeployed capital, ' +
            'which is a rare example of a supplier exiting a marquee customer on purpose.',
      sources: ['Company filings']
    },
    {
      /* The rest of the machine, stated as one line rather than guessed apart.
         The ten priced components above are the ones this teardown can cost
         against something. Together they account for 84% of what a notebook
         costs to build, and the remainder is real: a charger, the antennas,
         the cabling inside, the box it ships in and the labour to put it
         together all cost money.

         What is NOT done here is inventing a split. No published source gives
         a per-item cost breakdown for these at notebook level, so quoting
         "power adapter 3%, packaging 2%" would be five fabricated figures
         dressed as research. The 16% is arithmetic, 100 minus the sourced
         parts, and that is the only number in this node that is claimed.

         It has no `shape` on purpose: it is not a part you can point at on
         the board, so it does not draw there. It does appear in the cost
         analysis, where it belongs, and it is why the cost chart no longer
         needs a nameless grey remainder bar. */
      id: 'unpriced', name: 'Not separately priced', short: 'Unpriced',
      blurb: 'Everything the teardown has not costed line by line: the charger, the antennas, the cabling and flex circuits, thermal compound, fasteners and adhesives, the packaging, and the labour, test and logistics of assembly.',
      bomPct: 16,
      market: { size: null, year: 2025, basis: 'residual share of device build cost, not a market' },
      asOf: '2025', confidence: 'low',
      shares: [],
      note: 'The largest identifiable piece is the power adapter, a real market with real incumbents, ' +
            'Delta Electronics, Lite-On, Chicony Power, Salcomp and AcBel, almost all Taiwanese, and ' +
            'increasingly built on gallium nitride. It is not broken out because no published source ' +
            'gives its share of a notebook\'s build cost, and a number invented for the sake of a ' +
            'complete-looking chart would be worth less than this admission. Treat this line as the ' +
            'measure of how much of the machine remains unmapped.',
      sources: ['Company statements', 'TechInsights']
    },

    /* ============ META, the finished box ============ */
    {
      id: 'oem', name: 'Brand and channel', short: 'Brand', kind: 'meta',
      blurb: 'Who puts their name on the lid, owns the customer, and takes the warranty risk.',
      market: { size: 'USD ~199bn', year: 2025, basis: 'notebook PC shipments, unit share' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'Lenovo', p: 24.5 }, { c: 'HP', p: 20.5 }, { c: 'Dell', p: 14 },
        { c: 'Apple', p: 9 }, { c: 'Asus', p: 7.5 }, { c: 'Acer', p: 6.5 }
      ],
      note: 'The top three have been the top three since 2013. Operating margin in Windows PC hardware runs in the low to mid single digits, ' +
            'which is why every one of these firms is trying to sell you services instead.',
      sources: ['IDC Quarterly Personal Computing Device Tracker', 'Canalys'],
      deals: [
        { y: 2024, a: 'HP', t: 'Humane assets', v: 'USD 116m', n: 'A cheap acqui hire of an AI hardware failure.' },
        { y: 2025, a: 'Lenovo', t: 'Infinidat', v: 'undisclosed', n: 'Pushing further into enterprise storage and away from PC margin.' }
      ]
    },
    {
      id: 'odm', name: 'Contract manufacturing', short: 'ODM', kind: 'meta',
      blurb: 'The firms that actually design and build the machine. The brand often writes a specification and a cheque, and little else.',
      market: { size: 'USD ~120bn', year: 2025, basis: 'notebook ODM shipments, unit share' },
      asOf: '2025', confidence: 'high',
      chokepoint: true,
      shares: [
        { c: 'Quanta', p: 24 }, { c: 'Compal', p: 21 }, { c: 'Wistron', p: 13 },
        { c: 'Inventec', p: 12 }, { c: 'Pegatron', p: 8 }, { c: 'Foxconn', p: 7 }
      ],
      note: 'Six Taiwanese firms build roughly eighty five percent of the world supply of notebooks. This is the most ' +
            'under appreciated concentration in consumer hardware, and the reason a Taiwan disruption is a PC industry event, ' +
            'not just a semiconductor one.',
      sources: ['TrendForce', 'Digitimes Research'],
      deals: [
        { y: 2024, a: 'Quanta', t: 'capacity in Vietnam and Mexico', v: 'n/a', n: 'The whole cohort is duplicating capacity outside China to keep US customers.' }
      ]
    },
    {
      id: 'os', name: 'Operating system', short: 'OS', kind: 'meta',
      blurb: 'The layer that decides what the hardware is allowed to be.',
      market: { size: 'USD ~24bn', year: 2025, basis: 'PC operating system licence revenue, share by installed units' },
      asOf: '2025', confidence: 'high',
      chokepoint: true,
      shares: [
        { c: 'Microsoft', p: 71 }, { c: 'Apple', p: 16 }, { c: 'Google', p: 6 }, { c: 'Canonical', p: 2 }
      ],
      note: 'Windows is the reason the x86 duopoly survived. Every attempt to break the PC hardware stack has had to ' +
            'solve the application compatibility problem first, and none has.',
      sources: ['StatCounter', 'IDC'],
      deals: []
    },

    /* ============ DISPLAY ASSEMBLY CHILDREN ============ */
    {
      id: 'panel', parent: 'display-assembly', name: 'LCD or OLED panel', short: 'Panel',
      shape: { x: 150, y: 120, w: 340, h: 200 },
      blurb: 'The glass itself: thin film transistor array, liquid crystal or organic emitter, colour filter.',
      market: { size: 'USD ~24bn', year: 2025, basis: 'notebook panel shipments' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'BOE', p: 31 }, { c: 'Innolux', p: 16 }, { c: 'AU Optronics', p: 14 },
        { c: 'CSOT', p: 13 }, { c: 'LG Display', p: 11 }, { c: 'HKC', p: 7 }
      ],
      note: 'In notebook OLED specifically the picture inverts: Samsung Display holds well over half, because rigid OLED ' +
            'for laptops needs yield that only a handful of lines have.',
      sources: ['Omdia', 'TrendForce']
    },
    {
      id: 'cover-glass', parent: 'display-assembly', name: 'Cover glass and lamination', short: 'Cover glass',
      shape: { x: 510, y: 120, w: 340, h: 200 },
      blurb: 'Chemically strengthened glass on touch models, plus the optical adhesive that bonds the stack.',
      market: { size: 'USD ~2.2bn', year: 2025, basis: 'notebook cover glass and lamination' },
      asOf: '2025', confidence: 'medium',
      chokepoint: true,
      shares: [
        { c: 'Corning', p: 58 }, { c: 'AGC', p: 15 }, { c: 'Schott', p: 8 }, { c: 'Lens Technology', p: 8 }
      ],
      note: 'Corning has held the strengthened glass franchise for eighteen years across phones, laptops and cars. ' +
            'Apple has put over USD 500m into Corning to keep it that way.',
      sources: ['Company filings', 'Omdia']
    },
    {
      id: 'backlight', parent: 'display-assembly', name: 'Backlight unit', short: 'Backlight',
      shape: { x: 150, y: 350, w: 340, h: 180 },
      blurb: 'LED strips, light guide plate and diffuser films. Absent on OLED, which is part of why OLED panels are thinner.',
      market: { size: 'USD ~3.4bn', year: 2025, basis: 'notebook backlight units and optical film' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Radiant Opto', p: 22 }, { c: 'Coretronic', p: 18 }, { c: 'Forhouse', p: 9 }, { c: 'BOE', p: 8 }
      ],
      note: 'The optical film inside is a quieter oligopoly than the assembly. 3M held the brightness enhancement film ' +
            'patents for years and priced accordingly until they expired.',
      sources: ['TrendForce']
    },
    {
      id: 'driver-ic', parent: 'display-assembly', name: 'Display driver IC', short: 'Driver IC',
      shape: { x: 510, y: 350, w: 340, h: 180 },
      blurb: 'The chip that converts a video signal into per pixel voltages. Made on mature nodes, and therefore a bellwether for foundry pricing.',
      market: { size: 'USD ~9bn', year: 2025, basis: 'display driver IC revenue, all applications' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Novatek', p: 21 }, { c: 'Samsung LSI', p: 16 }, { c: 'LX Semicon', p: 11 },
        { c: 'Himax', p: 9 }, { c: 'FocalTech', p: 7 }, { c: 'Chipone', p: 7 }
      ],
      note: 'Driver ICs caused the 2021 shortage. They are cheap, they are made on 40nm to 90nm capacity nobody wanted to expand, ' +
            'and without one a two hundred dollar panel is scrap.',
      sources: ['TrendForce', 'Omdia']
    },

    /* ============ WEBCAM CHILDREN ============ */
    {
      id: 'image-sensor', parent: 'webcam', name: 'CMOS image sensor', short: 'Image sensor',
      shape: { x: 150, y: 180, w: 220, h: 200 },
      blurb: 'The silicon that turns photons into charge. The only part of a camera module with real technical moat.',
      market: { size: 'USD ~22bn', year: 2025, basis: 'CMOS image sensor revenue, all applications' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'Sony', p: 42 }, { c: 'Samsung', p: 19 }, { c: 'OmniVision', p: 11 },
        { c: 'SK hynix', p: 5 }, { c: 'GalaxyCore', p: 5 }, { c: 'STMicroelectronics', p: 4 }
      ],
      note: 'Sony wins because it invented stacked backside illumination and kept a process lead. Its image sensor unit ' +
            'is materially more profitable than the PlayStation business and gets a fraction of the attention.',
      sources: ['Yole Group', 'TechInsights', 'Company filings']
    },
    {
      id: 'cam-lens', parent: 'webcam', name: 'Lens assembly', short: 'Lens',
      shape: { x: 390, y: 180, w: 220, h: 200 },
      blurb: 'Stacked plastic aspheric elements, moulded to sub micron tolerance.',
      market: { size: 'USD ~5.4bn', year: 2025, basis: 'mobile and notebook lens sets' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Largan', p: 29 }, { c: 'Sunny Optical', p: 24 }, { c: 'Genius Electronic', p: 12 },
        { c: 'Cowell', p: 6 }
      ],
      note: 'Largan has run gross margins above fifty percent making plastic lenses, which tells you the moulding know how ' +
            'is far harder to copy than it looks.',
      sources: ['Company filings', 'TrendForce']
    },
    {
      id: 'cam-module', parent: 'webcam', name: 'Module assembly', short: 'Module',
      shape: { x: 630, y: 180, w: 220, h: 200 },
      blurb: 'Active alignment of lens to sensor, then package and test. Labour heavy, margin thin.',
      market: { size: 'USD ~1.4bn', year: 2025, basis: 'notebook camera module assembly' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Chicony', p: 26 }, { c: 'Lite-On', p: 18 }, { c: 'Sunny Optical', p: 14 }, { c: 'Cowell', p: 8 }
      ],
      note: 'Classic value trap in the supply chain. High revenue, no pricing power, and the customer can requalify a rival in a quarter.',
      sources: ['Company filings']
    },

    /* ============ MAINBOARD CHILDREN ============ */
    {
      id: 'cpu', parent: 'motherboard', name: 'Processor (CPU or SoC)', short: 'CPU',
      shape: { x: 150, y: 110, w: 220, h: 150 },
      blurb: 'The main compute die. Sets the platform, the chipset, often the Wi-Fi, and increasingly the whole thermal design.',
      bomPct: 17, layout: 'chain',
      market: { size: 'USD ~38bn', year: 2025, basis: 'notebook processor shipments, unit share incl. Apple and Arm' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Intel', p: 58 }, { c: 'AMD', p: 18 }, { c: 'Apple', p: 10 },
        { c: 'MediaTek', p: 7 }, { c: 'Qualcomm', p: 3 }
      ],
      note: 'On x86 only, the split is roughly Intel 76 to AMD 24. Adding Apple silicon and the Arm Chromebook base gives the view above. ' +
            'The real story of the last five years is that Intel lost the crown in manufacturing while keeping it in distribution.',
      sources: ['Mercury Research', 'IDC', 'Canalys'],
      deals: [
        { y: 2022, a: 'AMD', t: 'Xilinx', v: 'USD 49bn', n: 'The largest semiconductor deal to close at that point, and the template for platform consolidation.' },
        { y: 2025, a: 'Qualcomm', t: 'Alphawave Semi', v: 'USD 2.4bn', n: 'Buying high speed connectivity IP to attack data centre and PC silicon.' },
        { y: 2025, a: 'US government', t: 'Intel', v: 'USD ~8.9bn for ~10%', n: 'Washington converted CHIPS grants into an equity stake. Industrial policy became cap table policy.' }
      ]
    },
    {
      id: 'gpu', parent: 'motherboard', name: 'Discrete graphics', short: 'GPU',
      shape: { x: 390, y: 110, w: 220, h: 150 },
      blurb: 'Optional on mainstream machines, mandatory on gaming and workstation. When fitted, often the most expensive single part.',
      /* No cost share stated, deliberately. A discrete GPU is fitted to a
         minority of notebooks and is the most expensive part in the machines
         that have one, so a device-average figure would need an attach rate,
         and no published series gives one for notebooks specifically. A zero
         here previously read as "costs nothing", which is the opposite of
         true. Absent is the honest value. */
      upstream: ['foundry'],
      market: { size: 'USD ~11bn', year: 2025, basis: 'notebook discrete GPU shipments' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Nvidia', p: 83 }, { c: 'AMD', p: 12 }, { c: 'Intel', p: 5 }
      ],
      note: 'In desktop add in boards the position is even more extreme, around ninety percent. Nvidia converted a gaming ' +
            'monopoly into the CUDA software lock that now underwrites the AI trade.',
      sources: ['Jon Peddie Research', 'Mercury Research'],
      deals: [
        { y: 2022, a: 'Nvidia', t: 'Arm', v: 'USD 40bn, abandoned', n: 'Blocked by regulators on three continents. The most consequential deal that did not happen.' }
      ]
    },
    {
      id: 'dram', parent: 'motherboard', name: 'DRAM', short: 'DRAM',
      shape: { x: 630, y: 110, w: 220, h: 150 },
      blurb: 'Working memory, now usually soldered rather than socketed, which quietly killed the upgrade aftermarket.',
      bomPct: 6, upstream: ['foundry'],
      market: { size: 'USD ~104bn', year: 2025, basis: 'DRAM revenue, all applications' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'SK hynix', p: 36 }, { c: 'Samsung', p: 33 }, { c: 'Micron', p: 23 },
        { c: 'CXMT', p: 5 }, { c: 'Nanya', p: 2 }
      ],
      note: 'Three firms, ninety two percent, and a thirty year record of destroying capital in downturns. ' +
            'SK hynix took the revenue lead from Samsung in 2025 on the back of HBM for AI, the first change at the top in decades. ' +
            'CXMT is the variable that matters: state funded, price indifferent, and climbing.',
      sources: ['TrendForce', 'Counterpoint', 'Company filings'],
      deals: [
        { y: 2021, a: 'SK hynix', t: 'Intel NAND business', v: 'USD 9bn', n: 'Became Solidigm. Intel exited memory entirely to fund foundry.' }
      ]
    },
    {
      id: 'ssd', parent: 'motherboard', name: 'SSD', short: 'SSD',
      shape: { x: 150, y: 285, w: 220, h: 150 },
      blurb: 'NAND flash dies plus a controller and firmware. Two very different businesses in one M.2 stick.',
      bomPct: 5, layout: 'board',
      market: { size: 'USD ~28bn', year: 2025, basis: 'client SSD revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Samsung', p: 24 }, { c: 'SanDisk', p: 14 }, { c: 'Kioxia', p: 13 },
        { c: 'SK hynix', p: 13 }, { c: 'Micron', p: 12 }, { c: 'Kingston', p: 10 }, { c: 'YMTC', p: 6 }
      ],
      note: 'NAND has six credible suppliers against DRAM\'s three, and it shows in the margin profile. ' +
            'It has been the structurally worse business for twenty years.',
      sources: ['TrendForce', 'Forward Insights'],
      deals: [
        { y: 2025, a: 'Western Digital', t: 'SanDisk separation', v: 'spin off', n: 'Split HDD from NAND after years of activist pressure and a failed Kioxia merger.' },
        { y: 2024, a: 'Kioxia', t: 'Tokyo listing', v: 'IPO', n: 'Bain led consortium finally got liquidity, seven years after buying Toshiba Memory.' }
      ]
    },
    {
      id: 'wifi', parent: 'motherboard', name: 'Connectivity module', short: 'Wi-Fi',
      shape: { x: 390, y: 285, w: 220, h: 150 },
      blurb: 'Wi-Fi 6E or 7 plus Bluetooth on an M.2 card, or increasingly integrated into the SoC package.',
      bomPct: 1,
      market: { size: 'USD ~2.6bn', year: 2025, basis: 'notebook Wi-Fi and Bluetooth silicon' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Intel', p: 58 }, { c: 'Realtek', p: 15 }, { c: 'MediaTek', p: 11 },
        { c: 'Qualcomm', p: 8 }, { c: 'Broadcom', p: 6 }
      ],
      note: 'Intel does not win this on merit alone. It bundles Wi-Fi with the platform, which is exactly the kind of tie ' +
            'that makes the position durable and the category hard to attack. Watch integration too: every generation ' +
            'that folds connectivity into the main SoC deletes a supplier from this table.',
      sources: ['IDC', 'Company filings']
    },
    {
      id: 'pmic', parent: 'motherboard', name: 'Power management', short: 'Power',
      shape: { x: 630, y: 285, w: 220, h: 150 },
      blurb: 'Voltage regulators, chargers, fuel gauges and the USB-C power delivery controller. Dozens of small chips, high attach rate.',
      bomPct: 2,
      market: { size: 'USD ~5.5bn', year: 2025, basis: 'notebook power management silicon' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Texas Instruments', p: 22 }, { c: 'Monolithic Power', p: 17 }, { c: 'Infineon', p: 14 },
        { c: 'Renesas', p: 10 }, { c: 'onsemi', p: 7 }, { c: 'Analog Devices', p: 6 }
      ],
      note: 'Analog is the best structural business in semiconductors. Long product lives, no node race, and designs that ' +
            'stay in a socket for a decade. It is also why TI can run its own fabs profitably when nobody else can.',
      sources: ['Company filings', 'Omdia'],
      deals: [
        { y: 2021, a: 'Renesas', t: 'Dialog Semiconductor', v: 'USD 5.9bn', n: 'Bought the Apple power management relationship.' },
        { y: 2023, a: 'Renesas', t: 'Transphorm', v: 'USD 339m', n: 'Gallium nitride, the technology that shrank the charger in the box.' }
      ]
    },
    {
      id: 'firmware', parent: 'motherboard', name: 'Firmware and security', short: 'Firmware',
      shape: { x: 150, y: 460, w: 220, h: 150 },
      blurb: 'The UEFI BIOS, the embedded controller and the trusted platform module. A few dollars of content that can brick the machine.',
      bomPct: 0.5,
      market: { size: 'USD ~0.7bn', year: 2025, basis: 'PC BIOS and firmware licensing' },
      asOf: '2025', confidence: 'low', chokepoint: true,
      shares: [
        { c: 'AMI', p: 52 }, { c: 'Insyde', p: 30 }, { c: 'Phoenix Technologies', p: 12 }
      ],
      note: 'Three private or thinly traded firms write the firmware for essentially every x86 machine on earth. ' +
            'When a UEFI vulnerability lands, it lands on all of them at once. A remarkably invisible chokepoint.',
      sources: ['Security research disclosures', 'Company statements']
    },
    {
      id: 'ports', parent: 'motherboard', name: 'Ports and connectors', short: 'Ports',
      shape: { x: 390, y: 460, w: 220, h: 150 },
      blurb: 'USB-C receptacles, retimers and redrivers, plus the internal board to board connectors.',
      bomPct: 1.5,
      market: { size: 'USD ~2.9bn', year: 2025, basis: 'notebook connectors and interface silicon' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Foxconn', p: 19 }, { c: 'Luxshare', p: 16 }, { c: 'Amphenol', p: 14 },
        { c: 'TE Connectivity', p: 11 }, { c: 'JAE', p: 7 }, { c: 'Molex', p: 7 }
      ],
      note: 'Amphenol and TE are two of the great serial acquirers in industrials, with well over a hundred deals between them. ' +
            'If you want a case study in disciplined roll up execution, it is here rather than in software.',
      sources: ['Company filings'],
      deals: [
        { y: 2025, a: 'Amphenol', t: 'CommScope Connectivity and Cable Solutions', v: 'USD 10.5bn', n: 'The largest deal in Amphenol history.' }
      ]
    },
    {
      id: 'pcb', parent: 'motherboard', name: 'Printed circuit board', short: 'PCB',
      shape: { x: 630, y: 460, w: 220, h: 150 },
      blurb: 'A high density interconnect board, eight to twelve layers, laser drilled. Plus the substrate under each chip.',
      bomPct: 3,
      market: { size: 'USD ~19bn', year: 2025, basis: 'HDI PCB and IC substrate revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Zhen Ding', p: 13 }, { c: 'Unimicron', p: 12 }, { c: 'Ibiden', p: 9 },
        { c: 'Shinko', p: 7 }, { c: 'Nan Ya PCB', p: 6 }, { c: 'AT&S', p: 5 }
      ],
      note: 'Substrate, not the board, is the real bottleneck. ABF substrate shortages capped CPU and GPU output in 2021 and 2022, ' +
            'and the resin itself comes down to Ajinomoto, a Japanese food company.',
      sources: ['Prismark', 'Company filings']
    },

    /* ============ SSD CHILDREN ============ */
    {
      id: 'nand', parent: 'ssd', name: 'NAND flash', short: 'NAND',
      shape: { x: 150, y: 160, w: 340, h: 230 },
      blurb: 'The storage dies. Now stacked over two hundred layers deep, which is a manufacturing feat and a commodity at the same time.',
      market: { size: 'USD ~67bn', year: 2025, basis: 'NAND flash revenue' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'Samsung', p: 32 }, { c: 'SK hynix', p: 21 }, { c: 'Kioxia', p: 15 },
        { c: 'Micron', p: 12 }, { c: 'SanDisk', p: 11 }, { c: 'YMTC', p: 8 }
      ],
      note: 'SK hynix includes Solidigm, the old Intel NAND business. Six suppliers is two too many for the category to earn its cost of capital, ' +
            'which is why consolidation talk never fully goes away.',
      sources: ['TrendForce', 'Forward Insights']
    },
    {
      id: 'ssd-controller', parent: 'ssd', name: 'SSD controller', short: 'Controller',
      shape: { x: 510, y: 160, w: 340, h: 230 },
      blurb: 'The processor and firmware that handle wear levelling, error correction and the illusion that flash is reliable.',
      market: { size: 'USD ~4.1bn', year: 2025, basis: 'merchant SSD controller revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'Phison', p: 33 }, { c: 'Silicon Motion', p: 29 }, { c: 'Marvell', p: 12 },
        { c: 'Samsung', p: 10 }, { c: 'Realtek', p: 5 }
      ],
      note: 'Two Taiwanese firms supply most of the merchant market. MaxLinear walked away from acquiring Silicon Motion in 2023, ' +
            'triggering litigation that is still unresolved and a case study in reverse break fee drafting.',
      sources: ['TrendForce', 'Company filings'],
      deals: [
        { y: 2023, a: 'MaxLinear', t: 'Silicon Motion', v: 'USD 3.8bn, terminated', n: 'Buyer declared conditions unmet after China approval dragged. Arbitration followed.' }
      ]
    },

    /* ============ CPU UPSTREAM CHAIN ============ */
    {
      id: 'cpu-ip', parent: 'cpu', name: 'Instruction set and core IP', short: 'Core IP',
      blurb: 'The architecture licence. You cannot design a mainstream processor without one of three answers here.',
      market: { size: 'USD ~4.5bn', year: 2025, basis: 'processor IP licensing and royalty revenue' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'Arm', p: 46 }, { c: 'Intel', p: 22 }, { c: 'AMD', p: 12 }, { c: 'SiFive', p: 4 }, { c: 'Imagination', p: 3 }
      ],
      note: 'x86 is a two firm cross licence that no third party can enter. Arm is a licence anyone can buy but nobody can fork. ' +
            'RISC-V is the only genuinely open option and is why China is funding it hard.',
      sources: ['Company filings', 'IPnest'],
      deals: [
        { y: 2023, a: 'SoftBank', t: 'Arm IPO', v: 'USD 54.5bn valuation', n: 'Listed on Nasdaq after the Nvidia deal collapsed. SoftBank retained around ninety percent.' }
      ]
    },
    {
      id: 'eda', parent: 'cpu', name: 'Design software (EDA)', short: 'EDA',
      blurb: 'The toolchain that turns a specification into a mask set. No chip on earth is designed without it.',
      market: { size: 'USD ~18bn', year: 2025, basis: 'EDA and semiconductor IP revenue' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Synopsys', p: 32 }, { c: 'Cadence', p: 30 }, { c: 'Siemens EDA', p: 13 }, { c: 'Keysight', p: 4 }
      ],
      note: 'Three American or American controlled firms are the reason export controls actually bite. ' +
            'When Washington restricted EDA access to China in 2022 and again in 2025, it was enforcing a chokepoint of about ' +
            'seventy five percent share held by two companies.',
      sources: ['ESD Alliance', 'Company filings'],
      deals: [
        { y: 2025, a: 'Synopsys', t: 'Ansys', v: 'USD 35bn', n: 'Closed July 2025. Merged chip design with physical simulation and required divestitures on both sides.' },
        { y: 2024, a: 'Renesas', t: 'Altium', v: 'USD 5.9bn', n: 'A semiconductor firm buying the PCB design tool chain, moving up into the customer workflow.' }
      ]
    },
    {
      id: 'foundry', parent: 'cpu', name: 'Wafer foundry', short: 'Foundry',
      blurb: 'The company that actually turns the design into silicon. The single most concentrated layer in the modern economy.',
      market: { size: 'USD ~165bn', year: 2025, basis: 'pure play foundry revenue' },
      asOf: '2025', confidence: 'high', chokepoint: true, layout: 'chain',
      shares: [
        { c: 'TSMC', p: 70 }, { c: 'Samsung Foundry', p: 7 }, { c: 'SMIC', p: 6 },
        { c: 'UMC', p: 4 }, { c: 'GlobalFoundries', p: 4 }, { c: 'Hua Hong', p: 3 }
      ],
      note: 'At the leading edge the number is not seventy percent, it is closer to ninety. Every advanced Apple, Nvidia, AMD and ' +
            'Qualcomm part is made by one company, on one island, and increasingly in one science park. ' +
            'Intel Foundry and Rapidus are the only two credible attempts to change that, and both are years from volume.',
      sources: ['TrendForce', 'Counterpoint', 'Company filings'],
      deals: [
        { y: 2024, a: 'TSMC', t: 'Arizona, Kumamoto, Dresden fabs', v: 'USD 65bn+ committed', n: 'Geographic diversification bought with public subsidy in three jurisdictions.' },
        { y: 2025, a: 'SoftBank', t: 'Intel stake', v: 'USD 2bn', n: 'External capital into Intel Foundry as it tries to win outside customers.' }
      ]
    },
    {
      id: 'osat', parent: 'cpu', name: 'Packaging and test', short: 'Packaging',
      blurb: 'Dies get cut, stacked, wired and tested. Advanced packaging is where Moore\'s Law went when scaling got expensive.',
      market: { size: 'USD ~48bn', year: 2025, basis: 'outsourced assembly and test revenue' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'ASE', p: 29 }, { c: 'Amkor', p: 14 }, { c: 'JCET', p: 11 },
        { c: 'TongFu', p: 7 }, { c: 'Powertech', p: 6 }, { c: 'TFME', p: 5 }
      ],
      note: 'The merchant table understates TSMC, which keeps its CoWoS advanced packaging in house and has made it the ' +
            'real bottleneck on AI accelerator supply since 2023.',
      sources: ['TrendForce', 'Yole Group']
    },

    /* ============ FOUNDRY UPSTREAM CHAIN ============ */
    {
      id: 'litho', parent: 'foundry', name: 'Lithography systems', short: 'Lithography',
      blurb: 'The machines that print the circuit. One company makes the only tool capable of the leading edge.',
      market: { size: 'USD ~34bn', year: 2025, basis: 'lithography equipment revenue' },
      asOf: '2025', confidence: 'high', chokepoint: true, layout: 'chain',
      shares: [
        { c: 'ASML', p: 91 }, { c: 'Canon', p: 5 }, { c: 'Nikon', p: 4 }
      ],
      note: 'In extreme ultraviolet the share is one hundred percent. Not ninety, one hundred. ' +
            'Every 5nm and 3nm chip in the world was printed by a machine from Veldhoven, each costing roughly USD 200m to 380m, ' +
            'shipped at a rate of a few dozen a year. This is the hardest chokepoint in the global economy and the reason ' +
            'Dutch export policy is now a matter of American and Chinese national security.',
      sources: ['Company filings', 'SEMI'],
      deals: [
        { y: 2024, a: 'Netherlands government', t: 'ASML export licence regime', v: 'n/a', n: 'The Hague took licensing authority for DUV immersion tools, aligning with US controls.' },
        { y: 2025, a: 'ASML', t: 'Mistral AI stake', v: 'EUR 1.3bn', n: 'Became the largest shareholder in a European AI champion, an unusual move for an equipment maker.' }
      ]
    },
    {
      id: 'semicap', parent: 'foundry', name: 'Deposition, etch and metrology', short: 'Other equipment',
      blurb: 'Everything else in the fab: laying films down, cutting them away, and measuring whether it worked.',
      market: { size: 'USD ~89bn', year: 2025, basis: 'wafer fab equipment revenue excluding lithography' },
      asOf: '2025', confidence: 'high',
      shares: [
        { c: 'Applied Materials', p: 28 }, { c: 'Tokyo Electron', p: 21 },
        { c: 'Lam Research', p: 18 }, { c: 'KLA', p: 12 }
      ],
      note: 'Four firms, roughly eighty percent, split cleanly by process step rather than by direct competition. ' +
            'Applied tried to buy Kokusai Electric in 2019 and China\'s regulator ran out the clock. That deal\'s failure is why ' +
            'semicap M&A above a certain size is now considered structurally unapprovable.',
      sources: ['SEMI', 'Company filings'],
      deals: [
        { y: 2021, a: 'Applied Materials', t: 'Kokusai Electric', v: 'USD 3.5bn, abandoned', n: 'Lapsed without SAMR approval after eighteen months.' }
      ]
    },
    {
      id: 'wafer', parent: 'foundry', name: 'Silicon wafers', short: 'Wafers',
      blurb: 'Three hundred millimetre polished monocrystalline silicon. The blank canvas, and a five firm club.',
      market: { size: 'USD ~13bn', year: 2025, basis: 'silicon wafer revenue' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [
        { c: 'Shin-Etsu', p: 29 }, { c: 'SUMCO', p: 22 }, { c: 'GlobalWafers', p: 16 },
        { c: 'Siltronic', p: 12 }, { c: 'SK siltron', p: 11 }
      ],
      note: 'Ninety percent held by five firms, two of them Japanese. GlobalWafers tried to buy Siltronic and Berlin ' +
            'let the deadline pass in 2022 without clearing it. Consolidation here is now politically closed.',
      sources: ['SEMI', 'Company filings'],
      deals: [
        { y: 2022, a: 'GlobalWafers', t: 'Siltronic', v: 'EUR 4.35bn, lapsed', n: 'German ministry declined to clear in time. GlobalWafers redeployed the capital into a Texas fab.' }
      ]
    },
    {
      id: 'photoresist', parent: 'foundry', name: 'Photoresist and speciality chemicals', short: 'Chemicals',
      blurb: 'The light sensitive polymer that makes patterning possible, plus hundreds of ultra pure process chemicals.',
      market: { size: 'USD ~11bn', year: 2025, basis: 'semiconductor photoresist and ancillaries' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'JSR', p: 24 }, { c: 'Tokyo Ohka', p: 21 }, { c: 'Shin-Etsu', p: 17 },
        { c: 'Sumitomo Chemical', p: 12 }, { c: 'Fujifilm', p: 11 }
      ],
      note: 'Roughly ninety percent Japanese. When Tokyo restricted three chemical exports to South Korea in 2019 it took ' +
            'about a week to prove that a trade dispute over history could halt a semiconductor industry. ' +
            'Japan then took JSR private through a state backed fund in 2024, which tells you how strategic Tokyo considers this.',
      sources: ['Company filings', 'METI disclosures'],
      deals: [
        { y: 2024, a: 'Japan Investment Corporation', t: 'JSR', v: 'USD ~6.3bn', n: 'State fund take private of a photoresist leader, explicitly framed as industrial policy.' }
      ]
    },
    {
      id: 'gases', parent: 'foundry', name: 'Industrial and electronic gases', short: 'Gases',
      blurb: 'Nitrogen, argon, neon, tungsten hexafluoride. Delivered by pipeline into the fab, usually on twenty year contracts.',
      market: { size: 'USD ~9bn', year: 2025, basis: 'electronic gases revenue' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Linde', p: 27 }, { c: 'Air Liquide', p: 23 }, { c: 'Air Products', p: 17 },
        { c: 'Taiyo Nippon Sanso', p: 13 }
      ],
      note: 'Neon for excimer lasers was roughly half sourced from Ukraine before 2022. Prices went up more than tenfold ' +
            'and the industry rebuilt supply in about eighteen months, which is the fastest any of these chokepoints has ever been fixed.',
      sources: ['Company filings', 'SEMI']
    },

    /* ============ LITHOGRAPHY UPSTREAM ============ */
    {
      id: 'euv-optics', parent: 'litho', name: 'EUV optics', short: 'Optics',
      blurb: 'Mirrors polished so flat that scaled to the size of Germany the largest bump would be under a millimetre.',
      market: { size: 'USD ~3bn', year: 2025, basis: 'EUV optical systems, supplied to a single customer' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [ { c: 'Zeiss SMT', p: 100 } ],
      note: 'One supplier, one customer. ASML owns a minority stake in Zeiss SMT and has funded its capacity directly. ' +
            'A vertical relationship this exclusive would normally attract regulatory attention, and does not, because there is no alternative to protect.',
      sources: ['ASML and Zeiss disclosures']
    },
    {
      id: 'euv-source', parent: 'litho', name: 'EUV light source', short: 'Light source',
      blurb: 'Tin droplets hit fifty thousand times a second by a carbon dioxide laser to make plasma at 220,000 degrees.',
      market: { size: 'USD ~2bn', year: 2025, basis: 'EUV source systems' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [ { c: 'Cymer (ASML)', p: 100 } ],
      note: 'ASML bought Cymer in 2013 for USD 2.5bn precisely so that no one else could. The drive laser comes from Trumpf, ' +
            'privately held in Germany. Three European firms, one of them family owned, gate the entire leading edge.',
      sources: ['ASML disclosures'],
      deals: [
        { y: 2013, a: 'ASML', t: 'Cymer', v: 'USD 2.5bn', n: 'Vertical integration of the light source. Arguably the highest return deal in semiconductor history.' }
      ]
    },

    /* ============ BATTERY CHILDREN ============ */
    {
      id: 'cell', parent: 'battery', name: 'Lithium polymer cells', short: 'Cells',
      shape: { x: 150, y: 160, w: 340, h: 230 },
      blurb: 'Pouch format cells shaped to the chassis. Different chemistry and different suppliers from the EV world.',
      market: { size: 'USD ~3.1bn', year: 2025, basis: 'consumer polymer cell revenue, notebook share' },
      asOf: '2025', confidence: 'medium',
      shares: [
        { c: 'ATL', p: 29 }, { c: 'LG Energy Solution', p: 18 }, { c: 'Samsung SDI', p: 14 },
        { c: 'Sunwoda', p: 12 }, { c: 'Desay', p: 9 }
      ],
      note: 'Note who is missing. CATL, the largest battery company in the world, barely appears, because consumer polymer ' +
            'and EV prismatic are genuinely different businesses sharing a raw material.',
      sources: ['TrendForce', 'Company filings']
    },
    {
      id: 'cell-mats', parent: 'battery', name: 'Cathode, anode and separator', short: 'Cell materials',
      shape: { x: 510, y: 160, w: 340, h: 230 },
      blurb: 'The active materials. Where the cost sits and where China\'s position is most complete.',
      market: { size: 'USD ~62bn', year: 2025, basis: 'battery cathode, anode, separator and electrolyte, all applications' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [
        { c: 'China (all firms combined)', p: 82 }, { c: 'South Korea (all firms)', p: 8 },
        { c: 'Japan (all firms)', p: 7 }
      ],
      note: 'Shown by country because no single firm dominates and the country position is the actual finding. ' +
            'China refines roughly ninety percent of the world\'s battery grade graphite and around seventy percent of its lithium, ' +
            'irrespective of where the ore was mined.',
      sources: ['Benchmark Mineral Intelligence', 'IEA']
    },

    /* ============ THERMAL CHILDREN ============ */
    {
      id: 'fan', parent: 'thermal', name: 'Fans and blowers', short: 'Fans',
      shape: { x: 150, y: 170, w: 340, h: 220 },
      blurb: 'Miniature centrifugal blowers with fluid dynamic bearings, rated for tens of thousands of hours.',
      market: { size: 'USD ~1.9bn', year: 2025, basis: 'notebook cooling fans' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Sunon', p: 24 }, { c: 'AVC', p: 22 }, { c: 'Delta Electronics', p: 20 }, { c: 'Auras', p: 12 }
      ],
      note: 'Delta is the interesting one. It runs the same motor and power expertise into data centre power supplies, ' +
            'where content per unit is orders of magnitude higher.',
      sources: ['Company filings']
    },
    {
      id: 'heatpipe', parent: 'thermal', name: 'Heat pipes and vapour chambers', short: 'Heat pipes',
      shape: { x: 510, y: 170, w: 340, h: 220 },
      blurb: 'Sealed copper containing a wick and a working fluid. Passive, and by far the most cost effective way to move heat.',
      market: { size: 'USD ~2bn', year: 2025, basis: 'notebook heat pipe and vapour chamber' },
      asOf: '2025', confidence: 'low',
      shares: [
        { c: 'Auras', p: 27 }, { c: 'AVC', p: 24 }, { c: 'Foxconn', p: 11 }, { c: 'Boyd', p: 8 }
      ],
      note: 'The AI server build out has pulled this cohort into liquid cooling loops, cold plates and CDUs, ' +
            'where a single rack carries more thermal content than a thousand notebooks.',
      sources: ['TrendForce', 'Company filings']
    }
  ]
});
