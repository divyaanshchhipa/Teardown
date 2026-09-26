/* Teardown :: washing machine */
TD.device({
  id: 'washing-machine',
  name: 'Washing machine',
  icon: 'washer',
  category: 'Home and appliances',
  tagline: 'The most vertically integrated device on this site, and the least measured.',
  unit: { volume: '~100m units shipped (2025 est.)', price: 'USD ~600 average, front load' },
  intro: 'Every other device here comes apart into a chain of specialist merchant suppliers, each one tracked ' +
         'by an industry analyst house because there is money in tracking it. A washing machine mostly does ' +
         'not: the appliance makers design and build their own motors and control electronics in house, no ' +
         'analyst covers a drum or a suspension spring the way TrendForce covers a DRAM die, and the result is ' +
         'a device this site can describe honestly but not measure as precisely as a laptop or a phone. Where ' +
         'that is true, it is stated plainly rather than papered over with an invented number.',
  view: { w: 1000, h: 800 },
  nodes: [
    {
      id: 'motor', name: 'Drive motor', short: 'Motor',
      shape: { x: 150, y: 90, w: 220, h: 160 },
      blurb: 'The direct drive brushless motor that spins the drum, coupled straight to it with no belt.',
      bomPct: 14,
      market: { size: 'not sized separately', year: 2025, basis: 'no dedicated tracker found for this component' },
      asOf: '2025', confidence: 'low',
      note: 'Mostly a captive component, not a merchant market. LG has built its own Direct Drive brushless ' +
            'motor in house since 1998 and has sold over 90 million of them: a genuine, durable engineering ' +
            'moat rather than a supplied part. Samsung and the other major brands are very likely similarly ' +
            'captive for their own premium models, though that could not be independently confirmed here. The ' +
            'named independent motor suppliers serving the rest of the market are Nidec and Welling, with no ' +
            'share figure found between them or against captive production.',
      sources: ['Company filings']
    },
    {
      id: 'control-board', name: 'Control board', short: 'Control board',
      shape: { x: 390, y: 90, w: 220, h: 160 },
      blurb: 'The electronics that run the wash cycle, sensors and display.',
      bomPct: 5,
      market: { size: 'USD ~1.5bn', year: 2025, basis: 'rough estimate, no strong primary source, growing an estimated 5 to 7% a year' },
      asOf: '2025', confidence: 'low',
      note: 'No named supplier or share data found for this layer specifically. It is most likely dominated by ' +
            'the appliance makers\' own captive electronics divisions, plus general purpose contract electronics ' +
            'manufacturers, rather than a distinct tracked "washing machine PCB" merchant market of its own.',
      sources: ['Company filings']
    },
    {
      id: 'display-ui', name: 'Display and controls', short: 'Display',
      shape: { x: 630, y: 90, w: 220, h: 160 },
      blurb: 'The dial, buttons and, increasingly, small LCD screen on the front panel.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found for this layer as a distinct market.'
    },
    {
      id: 'drum-tub', name: 'Drum and tub', short: 'Drum',
      shape: { x: 150, y: 270, w: 220, h: 160 },
      blurb: 'The perforated inner drum that holds the wash, inside an outer tub that contains the water.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'Stainless steel for the inner drum on most mainstream and all premium machines, with plastic tubs ' +
            'common on budget models. This is a well established construction fact rather than a measured ' +
            'market: no supplier share data exists for this layer, so none is shown.'
    },
    {
      id: 'door', name: 'Door and glass', short: 'Door',
      shape: { x: 390, y: 270, w: 220, h: 160 },
      blurb: 'The tempered glass porthole and its hinge and latch assembly, on a front loader.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data exists for this layer either. Included for completeness of the physical ' +
            'model, not because a market has been measured.'
    },
    {
      id: 'casing', name: 'Cabinet and chassis', short: 'Cabinet',
      shape: { x: 630, y: 270, w: 220, h: 160 },
      blurb: 'The sheet metal enclosure, suspension mounts and levelling feet.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'Structural only. No supplier share data exists for this layer.'
    },
    {
      id: 'suspension', name: 'Suspension', short: 'Suspension',
      shape: { x: 150, y: 450, w: 220, h: 150 },
      blurb: 'Springs and dampers that keep the drum from shaking the whole machine apart during spin.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found for this layer as a distinct market.'
    },
    {
      id: 'water-valve-pump', name: 'Water valve and pump', short: 'Valve / pump',
      shape: { x: 390, y: 450, w: 220, h: 150 },
      blurb: 'The solenoid valve controlling fill, and the pump that drains the tub between cycles.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found for this layer as a distinct market.'
    },
    {
      id: 'dispenser', name: 'Detergent dispenser', short: 'Dispenser',
      shape: { x: 630, y: 450, w: 220, h: 150 },
      blurb: 'The drawer and its internal valving that release detergent and softener at the right point in the cycle.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found for this layer as a distinct market.'
    },
    {
      id: 'bearings-seals', name: 'Bearings and seals', short: 'Bearings',
      shape: { x: 150, y: 620, w: 220, h: 150 },
      blurb: 'What the drum actually spins on, and what keeps the water inside the tub rather than in the bearing.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No supplier share data found. Bearing and seal failure is one of the most common reasons a washing ' +
            'machine is scrapped rather than repaired, despite being a small line item.'
    },
    {
      id: 'heating-element', name: 'Heating element', short: 'Heater',
      shape: { x: 390, y: 620, w: 220, h: 150 },
      blurb: 'Heats the wash water internally: standard in Europe, largely absent from machines built for the US, which rely on the home\'s own hot water supply instead.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'This regional split is commonly stated in the appliance trade press but was not independently ' +
            'verified for this device, so treat it as a reasonable characterisation rather than a checked fact. ' +
            'No supplier share data found either way.'
    },

    /* meta */
    {
      id: 'washer-brand', name: 'Brand', short: 'Brand', kind: 'meta',
      blurb: 'Whose name is on the front panel.',
      market: { size: 'USD ~60bn', year: 2025, basis: 'global major appliance revenue, figures vary by 15% or so across sources, itself a sign of weak measurement in this category' },
      asOf: '2025', confidence: 'low',
      shares: [ { c: 'Whirlpool', p: 18 }, { c: 'Samsung', p: 18 }, { c: 'LG', p: 16 }, { c: 'Haier', p: 14 }, { c: 'Electrolux', p: 8 } ],
      note: 'Sourced from market research aggregators, not a named primary tracker like GfK or Circana: a ' +
            'lower tier of source than this site otherwise uses, flagged accordingly. Haier\'s figure includes ' +
            'GE Appliances, Fisher & Paykel and Candy, all acquired rather than organic. One source gave a ' +
            'conflicting 38% combined top five figure on what looks like a different methodology and was ' +
            'discarded rather than blended in.',
      sources: ['Company filings'],
      deals: [
        { y: 2016, a: 'Haier', t: 'GE Appliances', v: 'USD ~5.4bn', n: 'Made Haier the largest appliance maker in the world by volume.' },
        { y: 2024, a: 'Arcelik', t: 'Whirlpool Europe (Beko Europe JV)', v: 'USD ~5.5bn combined revenue', n: 'Whirlpool contributed its European business (Whirlpool, Indesit, Hotpoint brands) into a joint venture with Arcelik\'s Beko, then sold its remaining 25% stake to Arcelik months later for about EUR 111m, exiting Europe entirely.' }
      ]
    }
  ]
});
