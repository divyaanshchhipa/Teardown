/* Teardown : 3D models, submarine cable system
 *
 * Boxes in millimetres. x = right, y = back, z = up.
 * Every `node` must match a node id in data/devices/subsea-cable.js.
 *
 * ---- what this model is, and why it is not to scale ----
 *
 * Every other model on the site is a product drawn at its real proportions.
 * That is impossible here: the cable is 17 mm across and 7,000 km long, and a
 * ship is 140 m. A faithful model would be one invisible hair.
 *
 * So this is a *scene* rather than a machine: the four physical stages of a
 * system laid out along one axis at readable size: the ship laying, the cable
 * on the seabed, a repeater inline, and the shore station where it lands. The
 * Method page already says geometry on this site is schematic rather than a
 * CAD import; this device leans on that harder than any other, and the
 * relative sizes here are deliberately wrong so that the relationships can be
 * right.
 *
 * The cable itself is modelled as a *stepped concentric cutaway*, each layer
 * ends slightly short of the one inside it, so all six are visible at once
 * without exploding anything. That is how cable cross-sections are drawn in
 * every textbook, and it works because `shape:'cyl'` fills the extents given,
 * so nesting radii is just nesting x/z ranges.
 */

/* ============================ SYSTEM SCENE ============================
 * Laid out along y: shore station at the back (+y), cable running forward
 * through a repeater, ship on the surface above.
 */
TD.model('subsea-cable', {
  spread: 620,
  view: {
    camera: [0.58, 0.40, 0.71],
    distance: 1.06,
    background: 'studio',
    shadow: 0.15,
    edges: 0.36,
    exposure: 1.02
  },
  parts: [

    /* The cable, running the length of the scene along y. Stepped layers:
       each one stops short of the next so the cutaway reads without any
       explode. Radii are exaggerated ~40x against length. */
    { node: 'wet-plant', color: '#2b3038', dir: [0, 0, -1], spread: 1.0,
      rough: 0.55, metal: 0.15,
      /* Stepped toward the *camera* (-y), not away from it. The first pass
         stepped the layers toward the shore and the default view looks at
         the near end, so all six finished flush and the cutaway read as a
         flat black disc. Each inner layer now protrudes further forward. */
      boxes: [
        // outer polyethylene sheath
        { shape: 'cyl', axis: 'y', seg: 28, x: [-120, 120], y: [-2300, 900], z: [-120, 120] },
        // armour wires
        { shape: 'cyl', axis: 'y', seg: 24, x: [-96, 96], y: [-2420, 1150], z: [-96, 96] },
        // insulation
        { shape: 'cyl', axis: 'y', seg: 22, x: [-72, 72], y: [-2530, 1360], z: [-72, 72] },
        // copper conductor
        { shape: 'cyl', axis: 'y', seg: 20, x: [-52, 52], y: [-2620, 1540], z: [-52, 52] },
        // steel tube
        { shape: 'cyl', axis: 'y', seg: 18, x: [-32, 32], y: [-2700, 1690], z: [-32, 32] },
        // the fibres themselves
        { shape: 'cyl', axis: 'y', seg: 12, x: [-14, 14], y: [-2780, 1820], z: [-14, 14] }
      ] },

    /* Repeater: a pressure housing spliced inline, with the tapered strain
       reliefs at each end that let cable bend away from a rigid body. */
    { node: 'repeaters', color: '#9aa3ad', dir: [0, 0, 1], spread: 1.35,
      rough: 0.3, metal: 0.65,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 28, x: [-190, 190], y: [-1350, -700], z: [-190, 190] },
        { shape: 'cyl', axis: 'y', seg: 20, r2: 0.32, at: 'min',
          x: [-190, 190], y: [-1620, -1350], z: [-190, 190] },
        { shape: 'cyl', axis: 'y', seg: 20, r2: 0.32, at: 'max',
          x: [-190, 190], y: [-700, -430], z: [-190, 190] }
      ] },

    /* Cable ship on the surface: hull, superstructure, and the big overboard
       sheave at the stern that the cable actually runs over. */
    { node: 'marine-install', color: '#c4661f', dir: [0, -0.35, 1], spread: 1.5,
      rough: 0.45, metal: 0.3,
      boxes: [
        { shape: 'wedge', axis: 'y', at: 'min', taper: [0.25, 0.7],
          x: [-420, 420], y: [-2500, 600], z: [1500, 1900] },              // hull
        { shape: 'round', r: 60, bevel: 20,
          x: [-330, 330], y: [-200, 560], z: [1900, 2320] },               // superstructure
        { x: [-120, 120], y: [560, 700], z: [1780, 2060] },                // stern sheave housing
        { shape: 'cyl', axis: 'x', seg: 20, x: [-150, 150], y: [600, 900], z: [1620, 1920] }, // sheave
        { shape: 'cyl', axis: 'z', seg: 12, x: [-40, 40], y: [140, 220], z: [2320, 2760] }    // mast
      ] },

    /* Landing station on shore: the building, the beach manhole in front of
       it, and the duct run between them. */
    { node: 'landing', color: '#6f7d8c', dir: [0, 0.9, 0.45], spread: 1.3,
      rough: 0.6,
      boxes: [
        { shape: 'round', r: 40, bevel: 14,
          x: [-560, 560], y: [2300, 3100], z: [0, 620] },                  // station building
        { x: [-160, 160], y: [1900, 2160], z: [-60, 120] },                // beach manhole
        { x: [-70, 70], y: [2160, 2300], z: [-40, 60] }                    // duct run
      ] },

    /* Terminal equipment: racks standing inside the station footprint. */
    { node: 'slte', color: '#2f6d59', dir: [0, 0.4, 1], spread: 1.7,
      rough: 0.4,
      boxes: [
        { x: [-380, -180], y: [2480, 2760], z: [620, 1180] },
        { x: [-80, 120], y: [2480, 2760], z: [620, 1180] },
        { x: [220, 420], y: [2480, 2760], z: [620, 1180] }
      ] },

    /* Survey and consents has no hardware, but the survey vessel is real,
       so it is modelled as a small boat ahead of the lay ship. Everything
       this node buys happens before the cable exists. */
    { node: 'survey-permits', color: '#b08a4a', dir: [-0.85, -0.5, 0.8], spread: 1.9,
      rough: 0.5,
      boxes: [
        { shape: 'wedge', axis: 'y', at: 'min', taper: [0.3, 0.75],
          x: [-170, 170], y: [-3400, -2750], z: [1560, 1800] },
        { x: [-110, 110], y: [-3080, -2830], z: [1800, 2010] }
      ] },

    /* The maintenance fleet: a second, smaller vessel standing by. It is
       four percent of the budget and the reason the system survives
       twenty-five years. */
    { node: 'maintenance', color: '#8c4a35', dir: [0.9, 0.3, 0.8], spread: 2.0,
      rough: 0.5,
      boxes: [
        { shape: 'wedge', axis: 'y', at: 'min', taper: [0.3, 0.75],
          x: [700, 1050], y: [-1400, -700], z: [1560, 1810] },
        { x: [760, 990], y: [-1090, -820], z: [1810, 2040] }
      ] }
  ]
});

/* ===================== SUBSEA CABLE / WET PLANT =====================
 * The cable cross-section on its own, scaled right up and stepped so every
 * layer is visible. This is the view the whole device is really about: six
 * concentric materials, four of which come from a different industry.
 */
TD.model('subsea-cable/wet-plant', {
  spread: 130,
  view: {
    camera: [0.62, 0.34, 0.70],
    distance: 1.0,
    background: 'studio',
    shadow: 0.16,
    edges: 0.44
  },
  parts: [
    /* Every layer ends at the same point behind (+y) and starts further
       forward (-y) the deeper it sits, so the whole stack reads as a cutaway
       from the default camera without touching the separation slider.
       Explode directions then fan them radially rather than along the axis,
       a concentric assembly separated along its own axis just looks like a
       longer cable. */
    { node: 'cable-insulation', color: '#1f242b', dir: [0, -0.15, -1], spread: 1.2, rough: 0.62,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 40, x: [-300, 300], y: [-560, 260], z: [-300, 300] }
      ] },

    { node: 'cable-armour', color: '#8f959c', dir: [1, 0, 0.35], spread: 1.25,
      rough: 0.35, metal: 0.75,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 34, x: [-238, 238], y: [-720, 260], z: [-238, 238] }
      ] },

    { node: 'conductor', color: '#b8722e', dir: [-1, 0, 0.35], spread: 1.3,
      rough: 0.28, metal: 0.85,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 30, x: [-176, 176], y: [-870, 260], z: [-176, 176] }
      ] },

    /* the steel pressure tube that keeps the fibres dry, plus a branching
       unit sitting off the trunk */
    { node: 'branching-units', color: '#6d7580', dir: [0.35, 0, -1], spread: 1.55,
      rough: 0.3, metal: 0.7,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 26, x: [-118, 118], y: [-1010, 260], z: [-118, 118] },
        { shape: 'round', r: 30, bevel: 10, x: [430, 910], y: [-120, 320], z: [-140, 160] }
      ] },

    { node: 'fibre', color: '#cfe0ee', dir: [0, 0, 1], spread: 1.8, rough: 0.08,
      boxes: [
        // a bundle of individual fibres rather than one rod, 8 of the 16 pairs
        { shape: 'cyl', axis: 'y', seg: 10, x: [-30, -6], y: [-1150, 260], z: [-30, -6] },
        { shape: 'cyl', axis: 'y', seg: 10, x: [6, 30], y: [-1150, 260], z: [-30, -6] },
        { shape: 'cyl', axis: 'y', seg: 10, x: [-30, -6], y: [-1150, 260], z: [6, 30] },
        { shape: 'cyl', axis: 'y', seg: 10, x: [6, 30], y: [-1150, 260], z: [6, 30] },
        { shape: 'cyl', axis: 'y', seg: 10, x: [-54, -30], y: [-1150, 260], z: [-12, 12] },
        { shape: 'cyl', axis: 'y', seg: 10, x: [30, 54], y: [-1150, 260], z: [-12, 12] },
        { shape: 'cyl', axis: 'y', seg: 10, x: [-12, 12], y: [-1150, 260], z: [-54, -30] },
        { shape: 'cyl', axis: 'y', seg: 10, x: [-12, 12], y: [-1150, 260], z: [30, 54] }
      ] }
  ]
});

/* ===================== SUBSEA CABLE / REPEATER =====================
 * Inside the pressure housing: the amplifier pair, the pump lasers that feed
 * them, the supervisory unit, and the beryllium copper cylinder holding
 * 800 atmospheres off all of it for twenty-five years.
 */
TD.model('subsea-cable/repeaters', {
  spread: 150,
  view: {
    camera: [0.55, 0.42, 0.72],
    distance: 1.04,
    background: 'studio',
    shadow: 0.15,
    edges: 0.42
  },
  parts: [
    { node: 'repeater-housing', color: '#a9b0b8', dir: [0, 0, -1], spread: 1.25,
      rough: 0.25, metal: 0.8, shell: true,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 36, x: [-260, 260], y: [-900, 900], z: [-260, 260] },
        { shape: 'cyl', axis: 'y', seg: 22, r2: 0.3, at: 'min',
          x: [-260, 260], y: [-1240, -900], z: [-260, 260] },
        { shape: 'cyl', axis: 'y', seg: 22, r2: 0.3, at: 'max',
          x: [-260, 260], y: [900, 1240], z: [-260, 260] }
      ] },

    /* two amplifier assemblies: one per direction of travel */
    { node: 'edfa', color: '#2f6d59', dir: [0, 0, 1], spread: 1.4, rough: 0.35,
      boxes: [
        { shape: 'round', r: 16, bevel: 6, x: [-190, -30], y: [-520, 420], z: [40, 190] },
        { shape: 'round', r: 16, bevel: 6, x: [30, 190], y: [-520, 420], z: [40, 190] }
      ] },

    { node: 'pump-lasers', color: '#c2a15a', dir: [-0.85, 0, 0.55], spread: 1.6,
      rough: 0.3, metal: 0.4,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 16, x: [-180, -80], y: [-700, -540], z: [-160, -60] },
        { shape: 'cyl', axis: 'y', seg: 16, x: [-180, -80], y: [440, 600], z: [-160, -60] },
        { shape: 'cyl', axis: 'y', seg: 16, x: [80, 180], y: [-700, -540], z: [-160, -60] },
        { shape: 'cyl', axis: 'y', seg: 16, x: [80, 180], y: [440, 600], z: [-160, -60] }
      ] },

    { node: 'supervisory', color: '#8d6a9c', dir: [0.85, 0, 0.5], spread: 1.75, rough: 0.4,
      boxes: [
        { shape: 'round', r: 12, bevel: 5, x: [-120, 120], y: [-160, 200], z: [-200, -100] }
      ] }
  ]
});
