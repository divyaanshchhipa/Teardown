/* Teardown :: games console */
TD.device({
  id: 'console',
  name: 'Games console',
  icon: 'console',
  category: 'Consumer computing',
  tagline: 'Two chip suppliers, three platforms, and a component that is not sold on the open market.',
  unit: { volume: '~30m current-gen units shipped (2025 est.)', price: 'USD ~500 average' },
  intro: 'Thinner data than the other consumer devices on this site, and that is itself the finding. The ' +
         'console chip is semi-custom, designed for exactly one buyer and never resold, so most of the usual ' +
         'trackers that cover phones and laptops do not bother covering it. Every physical part of the machine ' +
         'is still shown here, named and placed, even where no analyst house publishes a share table for it, ' +
         'a part that cannot be measured is still a part.',
  view: { w: 1000, h: 820 },
  nodes: [
    {
      id: 'apu', name: 'Custom SoC / APU', short: 'APU',
      shape: { x: 140, y: 90, w: 220, h: 160 },
      blurb: 'The CPU and GPU fused onto one die, designed to order for a single console maker and sold to nobody else.',
      bomPct: 24, layout: 'chain',
      market: { size: 'USD >3.2bn', year: 2024, basis: 'AMD console semi-custom segment revenue only, company disclosed: excludes Nvidia’s Switch business, no independent whole-market figure found' },
      asOf: '2025', confidence: 'medium', chokepoint: true,
      shares: [ { c: 'AMD', p: 40 }, { c: 'Nvidia', p: 60 } ],
      note: 'Every current PlayStation and Xbox runs an AMD semi-custom APU; every Switch runs an Nvidia Tegra. ' +
            'That is a duopoly by construction, not by market contest: there is no merchant chip a third ' +
            'console maker could simply buy. The split above is lifetime unit share between the two chip camps, ' +
            'which skews toward Nintendo because the original Switch has been selling for eight years against ' +
            'three for the current PlayStation and Xbox generation; a same-generation shipment count would read ' +
            'differently. Treat the number as roughly indicative, not precise.',
      sources: ['Company filings'],
      deals: []
    },
    {
      id: 'console-foundry', parent: 'apu', name: 'Foundry', short: 'Foundry',
      blurb: 'The fab that actually manufactures both console camps’ chips.',
      market: { size: 'USD ~165bn', year: 2025, basis: 'pure play foundry revenue, whole market not console specific' },
      asOf: '2025', confidence: 'high', chokepoint: true,
      shares: [ { c: 'TSMC', p: 97 } ],
      note: 'AMD’s console APUs and Nvidia’s Tegra are both built at TSMC. Two competing chip designers, ' +
            'the same single manufacturer underneath both of them.',
      sources: ['Company filings']
    },
    {
      id: 'console-memory', name: 'Memory (GDDR)', short: 'Memory',
      shape: { x: 380, y: 90, w: 220, h: 160 },
      blurb: 'High bandwidth GDDR6 shared between CPU and GPU cores on the same die.',
      bomPct: 10,
      market: { size: 'not found, console-specific', year: 2025, basis: 'general DRAM revenue shown as a proxy, not a GDDR specific breakdown' },
      asOf: '2025', confidence: 'low',
      shares: [ { c: 'Samsung', p: 39 }, { c: 'SK hynix', p: 29 }, { c: 'Micron', p: 22 } ],
      note: 'No tracker publishes a GDDR6-specific supplier breakdown. These are general DRAM revenue shares, ' +
            'shown as the closest available proxy: the same three firms make GDDR variants, but their relative ' +
            'share of that specific product line could differ from their overall DRAM position.',
      sources: ['Company filings']
    },
    {
      id: 'console-storage', name: 'Storage (SSD)', short: 'Storage',
      shape: { x: 620, y: 90, w: 220, h: 160 },
      blurb: 'The custom NVMe SSD and its controller, fast enough to stream game assets straight into memory.',
      bomPct: 6,
      market: { size: 'not sized separately', year: 2025, basis: 'no console-specific market tracker found' },
      asOf: '2025', confidence: 'low',
      note: 'No market share table exists for this layer. What is publicly known is the design wins: PlayStation ' +
            'uses a Marvell controller paired with Kioxia flash, Xbox uses a Phison controller paired with SK ' +
            'hynix flash. Two named supply chains, not a measured market.',
      sources: ['Company filings']
    },
    {
      id: 'console-enclosure', name: 'Enclosure and chassis', short: 'Enclosure',
      shape: { x: 140, y: 270, w: 220, h: 160 },
      blurb: 'The outer shell and internal frame everything else mounts to.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'Named for completeness, not measured. No supplier share data exists for console enclosures as a ' +
            'distinct market; see contract assembly below for who actually builds it.'
    },
    {
      id: 'console-cooling', name: 'Cooling', short: 'Cooling',
      shape: { x: 380, y: 270, w: 220, h: 160 },
      blurb: 'The heatsink, vapour chamber and fan that keep a several hundred watt chip from throttling in a closed box.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No console-specific supplier share data found. Cooling design is a genuine differentiator between ' +
            'platforms, the PS5\'s distinctive shape exists mainly to house its cooling solution, but no ' +
            'tracker publishes a component-supplier breakdown for it.'
    },
    {
      id: 'console-psu', name: 'Power supply', short: 'PSU',
      shape: { x: 620, y: 270, w: 220, h: 160 },
      blurb: 'Converts wall AC to the DC rails the board needs: internal on PlayStation and Xbox Series X, external brick on the Series S.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No console-specific supplier share data found.'
    },
    {
      id: 'console-hdmi', name: 'Video output', short: 'HDMI',
      shape: { x: 140, y: 450, w: 210, h: 150 },
      blurb: 'The HDMI 2.1 transmitter that drives the display, including the bandwidth 4K120 and VRR need.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No console-specific supplier share data found for this chip.'
    },
    {
      id: 'console-wifi', name: 'Wireless connectivity', short: 'WiFi / BT',
      shape: { x: 370, y: 450, w: 210, h: 150 },
      blurb: 'The combo chip handling WiFi and Bluetooth, the latter mainly for pairing controllers.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'No console-specific supplier share data found.'
    },
    {
      id: 'console-optical', name: 'Optical disc drive', short: 'Disc drive',
      shape: { x: 600, y: 450, w: 240, h: 150 },
      blurb: 'The Blu-ray class drive fitted to disc editions of PlayStation and Xbox: omitted entirely on digital-only models.',
      market: { size: 'not tracked', year: 2025, basis: 'not applicable' },
      asOf: '2025', confidence: 'low',
      note: 'Increasingly optional rather than standard: both platforms now sell digital-only editions with no ' +
            'drive at all. No supplier share data found for the drive mechanism itself.'
    },
    {
      id: 'console-controllers', name: 'Controllers', short: 'Controllers',
      shape: { x: 140, y: 630, w: 340, h: 160 },
      blurb: 'The gamepad. Bundled first party units dominate; a separate third party market sells into PC and esports.',
      bomPct: 4,
      market: { size: 'USD ~15bn', year: 2025, basis: 'gamepad and controller market, all platforms' },
      asOf: '2025', confidence: 'low',
      note: 'First party controllers bundled by Sony, Microsoft and Nintendo cover an estimated majority of this ' +
            'market by volume. Logitech, Razer and SteelSeries are the named third party alternatives, mostly ' +
            'selling into PC and esports rather than competing directly for the console bundle. No source found ' +
            'gives a clean per-company split.',
      sources: ['Company filings']
    },
    {
      id: 'console-assembly', name: 'Contract assembly', short: 'Assembly',
      shape: { x: 510, y: 630, w: 330, h: 160 },
      blurb: 'Who physically builds the console for the brand whose logo is on the box.',
      bomPct: 5,
      market: { size: 'not sized separately', year: 2025, basis: 'no console-specific market tracker found' },
      asOf: '2025', confidence: 'low',
      note: 'Foxconn, Pegatron and Goertek are the named assemblers for PlayStation, Xbox and Switch hardware, ' +
            'with production actively shifting from China to Vietnam since 2024 amid tariff changes: Foxconn’s ' +
            'Vietnam subsidiary alone is reported to be scaling toward roughly 4.8m Xbox units a year. No source ' +
            'gives a clean share split between the three.',
      sources: ['Company filings']
    },

    /* meta */
    {
      id: 'console-platform', name: 'Platform', short: 'Platform', kind: 'meta',
      blurb: 'Which console you actually bought.',
      market: { size: 'not independently verified', year: 2025, basis: 'unit shipment share, low tier aggregator source' },
      asOf: '2025', confidence: 'low',
      shares: [ { c: 'Sony', p: 45 }, { c: 'Microsoft', p: 27 }, { c: 'Nintendo', p: 24 } ],
      note: 'Flagged low confidence deliberately: this split comes from a market aggregator, not a named tracker ' +
            'like NPD or Circana, and could not be independently verified in the time available. What is solid: ' +
            'lifetime units. PlayStation 5 had shipped 84.2m by September 2025, Xbox Series X/S about 34m ' +
            'combined, and Nintendo Switch 2 had reached 19.9m by March 2026 on top of the original Switch’s ' +
            '155.9m lifetime total: the best selling console of the three by a wide margin, on a much longer sales run.',
      sources: ['Company filings']
    }
  ]
});
