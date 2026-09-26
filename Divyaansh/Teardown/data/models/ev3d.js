/* Teardown : 3D models, electric vehicle
 *
 * Boxes in millimetres. x = right, y = back, z = up.
 * Every `node` must match a node id in data/devices/ev.js.
 *
 * Deliberately the same size and shape as data/models/car3d.js: 4,600 long,
 * 1,820 wide, 2,700 wheelbase, because the two devices are meant to be read
 * against each other. The body, glass, interior and chassis are near-identical
 * by design. What differs is everything under the floor.
 *
 * The whole point of the model is the skateboard: a single flat slab of
 * battery filling the entire wheelbase, with two small motor units at the
 * axles and nothing in between. Set it beside the combustion car: engine,
 * gearbox, propshaft, exhaust running the length of the underside, and the
 * architectural difference is the argument. That is why the pack is modelled
 * as one continuous mass rather than as modules: its size *is* the finding.
 *
 * Body geometry lessons inherited from car3d.js and not to be relitigated:
 * three height zones, cabin narrower in plan than the body, wheel arches as
 * eyebrows above the tyre rather than covers over it, and a low camera.
 */

TD.model('ev', {
  spread: 620,
  view: {
    /* Same low three-quarter as the combustion car, so the two models can be
       compared without the camera doing any of the work. */
    camera: [0.66, 0.17, 0.73],
    distance: 0.94,
    background: 'studio',
    shadow: 0.20,
    edges: 0.30,
    exposure: 1.04
  },
  parts: [

    /* ---------- body ----------
       A different colour from the combustion car on purpose, so the two are
       distinguishable at a glance in the browse menu. Same geometry rules. */
    { node: 'chassis-ev', color: '#2f5d6e', dir: [0, -0.2, 1], spread: 1.35,
      rough: 0.16, metal: 0.5, shell: true,
      boxes: [
        // centre section, sills and doors
        { shape: 'round', r: 110, bevel: 34, x: [-820, 820], y: [-1010, 1010], z: [250, 880] },
        // front section: shorter and blunter than a combustion nose, because
        // there is no engine to package
        { shape: 'wedge', axis: 'y', at: 'min', taper: [0.9, 0.9],
          x: [-812, 812], y: [-2280, -990], z: [250, 800] },
        // rear section
        { shape: 'round', r: 70, bevel: 20, x: [-812, 812], y: [990, 2280], z: [250, 820] },
        // cabin, tapered to the roof
        { shape: 'wedge', axis: 'z', at: 'max', taper: [0.80, 0.74],
          x: [-725, 725], y: [-950, 300], z: [880, 1360] },
        { shape: 'wedge', axis: 'y', at: 'max', taper: [0.76, 0.50], sweep: [0, -150],
          x: [-725, 725], y: [300, 1420], z: [880, 1360] },
        // bonnet and boot panels
        { shape: 'wedge', axis: 'y', at: 'min', taper: [0.9, 0.9],
          x: [-790, 790], y: [-2255, -1000], z: [800, 845] },
        { x: [-790, 790], y: [1000, 2255], z: [820, 865] },
        // haunches
        { shape: 'round', r: 60, bevel: 20, x: [-938, -800], y: [-1880, -990], z: [690, 900] },
        { shape: 'round', r: 60, bevel: 20, x: [800, 938], y: [-1880, -990], z: [690, 900] },
        { shape: 'round', r: 60, bevel: 20, x: [-938, -800], y: [990, 1880], z: [690, 920] },
        { shape: 'round', r: 60, bevel: 20, x: [800, 938], y: [990, 1880], z: [690, 920] },
        // bumpers: closed front, because there is no radiator to feed
        { shape: 'round', r: 80, bevel: 24, x: [-800, 800], y: [-2340, -2210], z: [270, 700] },
        { shape: 'round', r: 80, bevel: 24, x: [-800, 800], y: [2210, 2340], z: [270, 720] }
      ] },

    /* ---------- battery pack ----------
       The skateboard. One slab, the full width between the sills and the full
       length between the axles, and about a third of the cost of the car.
       Drops straight down so that the comparison with the combustion car's
       engine-and-driveline is immediate. */
    { node: 'pack-ev', color: '#2f6d59', dir: [0, 0, -1], spread: 1.45,
      rough: 0.4, metal: 0.3,
      boxes: [
        { shape: 'round', r: 40, bevel: 14, x: [-790, 790], y: [-1400, 1400], z: [180, 330] },
        // module divisions, so it reads as cells rather than a solid block
        { x: [-780, 780], y: [-1000, -960], z: [330, 348] },
        { x: [-780, 780], y: [-400, -360], z: [330, 348] },
        { x: [-780, 780], y: [200, 240], z: [330, 348] },
        { x: [-780, 780], y: [800, 840], z: [330, 348] },
        // crash rails down both sides of the pack
        { x: [-830, -790], y: [-1400, 1400], z: [190, 320] },
        { x: [790, 830], y: [-1400, 1400], z: [190, 320] }
      ] },

    /* ---------- wheels ----------
       Same geometry as the combustion car. Kept on `chassis-ev` in that model;
       here they are their own visual mass so the skateboard reads clearly
       between them. */
    { node: 'castings-ev', color: '#1d2126', dir: [0, 0, -1], spread: 1.1,
      rough: 0.78,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 36, x: [-925, -680], y: [-1790, -1090], z: [0, 700] },
        { shape: 'cyl', axis: 'x', seg: 36, x: [680, 925], y: [-1790, -1090], z: [0, 700] },
        { shape: 'cyl', axis: 'x', seg: 36, x: [-925, -680], y: [1090, 1790], z: [0, 700] },
        { shape: 'cyl', axis: 'x', seg: 36, x: [680, 925], y: [1090, 1790], z: [0, 700] },
        { shape: 'cyl', axis: 'x', seg: 28, x: [-918, -892], y: [-1700, -1180], z: [90, 610] },
        { shape: 'cyl', axis: 'x', seg: 28, x: [892, 918], y: [-1700, -1180], z: [90, 610] },
        { shape: 'cyl', axis: 'x', seg: 28, x: [-918, -892], y: [1180, 1700], z: [90, 610] },
        { shape: 'cyl', axis: 'x', seg: 28, x: [892, 918], y: [1180, 1700], z: [90, 610] }
      ] },

    /* ---------- traction motors ----------
       Two compact drive units on the axle lines. Set this against the
       combustion car's engine bay: the entire propulsion system is these two
       cylinders and the slab above. */
    { node: 'emotor', color: '#8e959c', dir: [0, -0.6, 0.7], spread: 1.6,
      rough: 0.35, metal: 0.6,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 24, x: [-330, 330], y: [-1560, -1300], z: [330, 590] },
        { shape: 'cyl', axis: 'x', seg: 24, x: [-330, 330], y: [1300, 1560], z: [330, 590] },
        // reduction gear housings
        { shape: 'round', r: 20, bevel: 8, x: [330, 560], y: [-1520, -1340], z: [350, 570] },
        { shape: 'round', r: 20, bevel: 8, x: [-560, -330], y: [1340, 1520], z: [350, 570] }
      ] },

    /* ---------- power electronics ----------
       Inverter over each motor, plus the on-board charger. Small, expensive,
       and the layer where the silicon carbide bet went wrong. */
    { node: 'power-ev', color: '#c2a15a', dir: [0.9, -0.4, 0.5], spread: 1.8,
      rough: 0.35, metal: 0.4,
      boxes: [
        { shape: 'round', r: 14, bevel: 5, x: [-300, 300], y: [-1300, -1080], z: [560, 700] },
        { shape: 'round', r: 14, bevel: 5, x: [-300, 300], y: [1080, 1300], z: [560, 700] },
        { shape: 'round', r: 12, bevel: 4, x: [340, 620], y: [1180, 1420], z: [560, 680] }
      ] },

    /* ---------- thermal ----------
       Heat pump at the front and the cooling plate under the pack. Twice the
       content of a combustion car, and one of the few categories that gains
       from the transition. */
    { node: 'thermal-ev', color: '#3a8fd0', dir: [0, -1, 0.35], spread: 1.95,
      rough: 0.4,
      boxes: [
        { shape: 'round', r: 16, bevel: 6, x: [-520, 520], y: [-2140, -1860], z: [400, 720] },
        { shape: 'cyl', axis: 'y', seg: 14, x: [-140, 140], y: [-1860, -1500], z: [480, 640] },
        // cooling plate, sandwiched under the pack
        { x: [-780, 780], y: [-1380, 1380], z: [150, 180] }
      ] },

    /* ---------- ADAS ----------
       Sensors at the corners and behind the screen. Physically trivial, and
       the most heavily traded segment in automotive M&A. */
    { node: 'adas', color: '#7a5cc7', dir: [-0.5, -0.9, 0.6], spread: 2.15,
      rough: 0.3,
      boxes: [
        { shape: 'round', r: 8, bevel: 3, x: [-180, 180], y: [-960, -900], z: [1180, 1280] },  // windscreen camera
        { x: [-760, -600], y: [-2300, -2240], z: [420, 520] },                                  // corner radar
        { x: [600, 760], y: [-2300, -2240], z: [420, 520] },
        { x: [-760, -600], y: [2240, 2300], z: [440, 540] },
        { x: [600, 760], y: [2240, 2300], z: [440, 540] },
        { shape: 'cyl', axis: 'z', seg: 14, x: [-90, 90], y: [-820, -640], z: [1360, 1420] }   // roof lidar
      ] },

    /* ---------- cockpit ----------
       Screens and the processor behind them. The layer a consumer
       semiconductor company invaded and took. */
    { node: 'cockpit', color: '#232f3d', dir: [0, -0.4, 1], spread: 1.9,
      rough: 0.12,
      boxes: [
        { shape: 'round', r: 10, bevel: 4, x: [-380, 380], y: [-880, -840], z: [880, 1180] },
        { x: [-700, -420], y: [-900, -860], z: [940, 1120] }
      ] },

    /* ---------- interior ---------- */
    { node: 'interior-ev', color: '#6a5f57', dir: [0, 0.15, 1], spread: 1.75,
      rough: 0.72,
      boxes: [
        { shape: 'round', r: 24, bevel: 10, x: [-620, -190], y: [-540, 180], z: [640, 1250] },
        { shape: 'round', r: 24, bevel: 10, x: [190, 620], y: [-540, 180], z: [640, 1250] },
        { shape: 'round', r: 24, bevel: 10, x: [-650, 650], y: [380, 830], z: [640, 1190] }
      ] },

    /* ---------- glazing ---------- */
    { node: 'glass-ev', color: '#33455a', dir: [0, -0.15, 1], spread: 2.0,
      rough: 0.05, metal: 0.2,
      boxes: [
        { x: [-640, 640], y: [-940, -898], z: [905, 1335] },
        { x: [-600, 600], y: [858, 900], z: [905, 1310] },
        { x: [-744, -718], y: [-910, 290], z: [905, 1335] },
        { x: [718, 744], y: [-910, 290], z: [905, 1335] },
        // panoramic roof: an EV styling signature, and heavier than it looks
        { x: [-700, 700], y: [-880, 900], z: [1340, 1370] },
        { shape: 'round', r: 26, bevel: 9, x: [-790, -410], y: [-2320, -2200], z: [500, 680] },
        { shape: 'round', r: 26, bevel: 9, x: [410, 790], y: [-2320, -2200], z: [500, 680] },
        { shape: 'round', r: 26, bevel: 9, x: [-795, -420], y: [2200, 2320], z: [530, 710] },
        { shape: 'round', r: 26, bevel: 9, x: [420, 795], y: [2200, 2320], z: [530, 710] }
      ] },

    /* ---------- charging ----------
       The port, and the only part of this machine that does not fit inside it. */
    { node: 'charging-ev', color: '#c24a2b', dir: [-1, -0.3, 0.4], spread: 2.2,
      rough: 0.4, metal: 0.3,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 16, x: [-860, -790], y: [-1980, -1830], z: [640, 790] }
      ] }
  ]
});

/* ===================== EV / BATTERY PACK =====================
 * The pack opened up: enclosure tray, cooling plate, cell modules, and the
 * management electronics. Scaled up from the ~1.6 x 2.8 m the real thing is.
 *
 * The modules are drawn as prismatic cells in rows because that is what most
 * of the world now builds (LFP prismatic, not cylindrical) and the cell
 * format is itself one of the decisions this teardown argues about.
 */
TD.model('ev/pack-ev', {
  spread: 340,
  view: {
    camera: [0.50, 0.44, 0.75],
    distance: 1.0,
    background: 'studio',
    shadow: 0.16,
    edges: 0.40
  },
  parts: [
    /* Enclosure tray: aluminium, structural, and part of the car's crash
       protection rather than just a box. */
    { node: 'pack-enclosure', color: '#8b939d', dir: [0, 0, -1], spread: 1.25,
      rough: 0.4, metal: 0.55, shell: true,
      boxes: [
        { shape: 'round', r: 30, bevel: 10, x: [-800, 800], y: [-1400, 1400], z: [-90, -30] },
        { x: [-800, -740], y: [-1400, 1400], z: [-30, 150] },
        { x: [740, 800], y: [-1400, 1400], z: [-30, 150] },
        { x: [-800, 800], y: [-1400, -1340], z: [-30, 150] },
        { x: [-800, 800], y: [1340, 1400], z: [-30, 150] }
      ] },

    /* Cell modules: five rows of prismatic cells. */
    { node: 'cells-ev', color: '#2f6d59', dir: [0, 0, 1], spread: 1.5,
      rough: 0.42, metal: 0.25,
      boxes: [
        { x: [-720, 720], y: [-1300, -1020], z: [-10, 130] },
        { x: [-720, 720], y: [-960, -680], z: [-10, 130] },
        { x: [-720, 720], y: [-620, -340], z: [-10, 130] },
        { x: [-720, 720], y: [-280, 0], z: [-10, 130] },
        { x: [-720, 720], y: [40, 320], z: [-10, 130] },
        { x: [-720, 720], y: [360, 640], z: [-10, 130] },
        { x: [-720, 720], y: [680, 960], z: [-10, 130] },
        { x: [-720, 720], y: [1000, 1280], z: [-10, 130] }
      ] },

    /* Busbars linking the modules: the series connection that turns 3.2 volt
       cells into an 800 volt pack. */
    { node: 'bms', color: '#c2a15a', dir: [0.85, 0, 0.6], spread: 1.85,
      rough: 0.3, metal: 0.7,
      boxes: [
        { x: [-40, 40], y: [-1300, 1280], z: [130, 170] },
        { shape: 'round', r: 10, bevel: 4, x: [420, 720], y: [-1300, -1020], z: [130, 220] }
      ] }
  ]
});

/* ===================== EV / TRACTION MOTOR =====================
 * The drive unit opened: stator with its hairpin windings, rotor carrying the
 * magnets, and the reduction gear. Roughly three times real size.
 *
 * The magnets are the visible statement of the node's argument: a few
 * kilograms of material, ninety percent of it from one country, and no ready
 * substitute for the motor topology almost everyone uses.
 */
TD.model('ev/emotor', {
  spread: 260,
  view: {
    camera: [0.55, 0.40, 0.73],
    distance: 1.02,
    background: 'studio',
    shadow: 0.16,
    edges: 0.42
  },
  parts: [
    /* Stator: laminated electrical steel, the layer that has constrained motor
       output twice since 2021. */
    { node: 'motor-steel', color: '#7d858e', dir: [0, 0, -1], spread: 1.2,
      rough: 0.42, metal: 0.6,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 32, x: [-260, 260], y: [-420, 420], z: [-420, 420] },
        { shape: 'cyl', axis: 'x', seg: 32, x: [-250, 250], y: [-300, 300], z: [-300, 300] }
      ] },

    /* Hairpin windings: rectangular copper, formed and welded rather than
       wound. About 40 kg of copper in a car. */
    { node: 'motor-windings', color: '#b8722e', dir: [-1, 0, 0.3], spread: 1.6,
      rough: 0.28, metal: 0.85,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 28, x: [-330, -250], y: [-330, 330], z: [-330, 330] },
        { shape: 'cyl', axis: 'x', seg: 28, x: [250, 330], y: [-330, 330], z: [-330, 330] }
      ] },

    /* Rotor and magnets: the chokepoint, made visible. */
    { node: 'magnets', color: '#2f3439', dir: [1, 0, 0.4], spread: 1.9,
      rough: 0.5,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 28, x: [-240, 240], y: [-280, 280], z: [-280, 280] },
        // magnet segments set into the rotor
        { x: [-230, 230], y: [-250, -180], z: [-40, 40] },
        { x: [-230, 230], y: [180, 250], z: [-40, 40] },
        { x: [-230, 230], y: [-40, 40], z: [-250, -180] },
        { x: [-230, 230], y: [-40, 40], z: [180, 250] }
      ] },

    /* Reduction gear: one fixed ratio, where an automatic gearbox used to be. */
    { node: 'gearbox-ev', color: '#565e68', dir: [0.4, 0.9, 0.35], spread: 2.0,
      rough: 0.4, metal: 0.5,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 24, x: [300, 460], y: [-260, 260], z: [-260, 260] },
        { shape: 'cyl', axis: 'x', seg: 20, x: [300, 460], y: [180, 480], z: [-150, 150] },
        { shape: 'cyl', axis: 'x', seg: 12, x: [460, 620], y: [-60, 60], z: [-60, 60] }
      ] }
  ]
});
