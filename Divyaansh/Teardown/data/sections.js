/* Teardown :: catalogue sections
 *
 * Sections drive the browse menu and the overview page. Devices join a section
 * by id. `planned` entries render as greyed placeholders, so the shape of the
 * catalogue is visible before the teardowns behind it exist.
 *
 * Adding a section here is all it takes. Nothing else is wired by hand.
 */
TD.section([
  {
    id: 'consumer',
    name: 'Consumer computing',
    blurb: 'The devices people actually hold. Highest volumes on the site, and the ' +
           'supply chains where concentration is easiest to see.',
    devices: ['laptop', 'smartphone', 'console', 'smart-tv', 'tablet'],
    planned: ['Smartwatch', 'Wireless earbuds', 'Desktop PC']
  },
  {
    id: 'datacentre',
    name: 'Data centre and AI',
    blurb: 'Where nearly all current large cap technology M&A is being aimed. ' +
           'Fewer buyers than suppliers, which is unusual and matters.',
    devices: ['ai-server', 'subsea-cable'],
    planned: ['Network switch', 'Storage array', 'Data centre power', 'Cooling plant']
  },
  {
    id: 'mobility',
    name: 'Mobility',
    blurb: 'Vehicles and the componentry underneath them. The clearest example on ' +
           'the site of a profit pool physically relocating between countries.',
    devices: ['car', 'ev'],
    planned: ['Commercial truck', 'E-bike', 'Charging network', 'Rail rolling stock']
  },
  {
    id: 'agtech',
    name: 'Agriculture technology',
    blurb: 'Machinery where the value has migrated from iron to guidance software, ' +
           'and the deal record shows exactly when each player worked that out.',
    devices: ['tractor'],
    planned: ['Combine harvester', 'Irrigation system', 'Dairy robot', 'Controlled environment farm']
  },
  {
    id: 'software',
    name: 'Software and services',
    blurb: 'Software has a supply chain too. It just comes apart in layers instead ' +
           'of screws, and the concentration per layer ranges from monopoly to chaos.',
    devices: ['martech'],
    planned: ['Fintech stack', 'Healthtech stack', 'Developer tooling', 'Security stack', 'ERP stack']
  },
  {
    id: 'industrial',
    name: 'Industrial and energy',
    blurb: 'Heavy equipment and the energy transition hardware behind it.',
    devices: ['wind-turbine'],
    planned: ['Solar module', 'Grid transformer', 'Heat pump', 'Industrial robot', 'Excavator']
  },
  {
    id: 'medtech',
    name: 'Medical technology',
    blurb: 'Capital equipment with long qualification cycles, high switching costs ' +
           'and a consolidated supplier base.',
    devices: [],
    planned: ['MRI scanner', 'Patient monitor', 'Surgical robot', 'Insulin pump', 'Lab analyser']
  },
  {
    id: 'home',
    name: 'Home and appliances',
    blurb: 'The white goods and connected hardware nobody thinks of as tech, ' +
           'with supply chains that look a lot like the ones that are.',
    devices: ['microwave', 'washing-machine'],
    planned: ['Refrigerator', 'Robot vacuum', 'Air conditioner', 'Smart speaker']
  },
  {
    id: 'aerospace',
    name: 'Aerospace and defence',
    blurb: 'The most concentrated end markets of all, and the ones where the ' +
           'supplier list is partly a matter of public policy.',
    devices: ['aircraft'],
    planned: ['Satellite', 'Drone', 'Jet engine']
  }
]);
