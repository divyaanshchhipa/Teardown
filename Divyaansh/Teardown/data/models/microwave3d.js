/* Teardown : 3D models, microwave oven
 *
 * Boxes in millimetres. x = right, y = back, z = up.
 * Every `node` must match a node id in data/devices/microwave.js.
 *
 * A countertop oven: 490 x 380 x 280. After the car, this is a relief, a
 * microwave is genuinely a box with a door and a cylinder in it, so the
 * primitive set fits the subject exactly rather than fighting it. The whole
 * model is close to true scale with no cheating.
 *
 * The internal arrangement is the real one and is worth preserving if this is
 * ever edited: the cooking cavity occupies the left two thirds, and everything
 * else (magnetron, transformer, capacitor, fan) is crammed into a bay down
 * the right-hand side behind the control panel. That asymmetry is why a
 * microwave is always much wider than its usable interior, which is the single
 * most common complaint about the category and is a direct consequence of
 * where the magnetron has to sit.
 */

TD.model('microwave', {
  spread: 150,
  view: {
    /* Squarer to the front than the other models: a microwave is a facade,
       and the door, window and control panel are the whole of it. */
    camera: [0.44, 0.26, 0.86],
    distance: 1.0,
    background: 'studio',
    shadow: 0.17,
    edges: 0.36,
    exposure: 1.02
  },
  parts: [

    /* ---------- outer case ----------
       Top, sides, back and base. The front is left open for the door and the
       control fascia, so the machine reads as an appliance rather than a
       sealed block. */
    { node: 'enclosure-mw', color: '#9aa1a8', dir: [0, 0, 1], spread: 1.4,
      rough: 0.30, metal: 0.55, shell: true,
      boxes: [
        { shape: 'round', r: 12, bevel: 5, x: [-245, 245], y: [-190, 190], z: [262, 280] },  // top
        { x: [-245, -228], y: [-190, 190], z: [0, 262] },                                     // left side
        { x: [228, 245], y: [-190, 190], z: [0, 262] },                                       // right side
        { x: [-245, 245], y: [172, 190], z: [0, 262] },                                       // back
        { x: [-245, 245], y: [-190, 190], z: [0, 16] },                                       // base
        { x: [-245, 245], y: [-190, -176], z: [262, 280] }                                    // front lip
      ] },

    /* ---------- cavity ----------
       The cooking box itself, offset left to leave the equipment bay. */
    { node: 'cavity', color: '#ccd1d6', dir: [-0.3, 0, 1], spread: 1.25,
      rough: 0.34, metal: 0.4,
      boxes: [
        { x: [-232, 112], y: [-158, 172], z: [26, 30] },     // floor
        { x: [-232, 112], y: [-158, 172], z: [252, 256] },   // roof
        { x: [-232, -224], y: [-158, 172], z: [26, 256] },   // left wall
        { x: [104, 112], y: [-158, 172], z: [26, 256] },     // right wall
        { x: [-232, 112], y: [164, 172], z: [26, 256] },     // back wall
        // waveguide, running along the cavity roof from the equipment bay
        { x: [40, 104], y: [10, 96], z: [232, 252] }
      ] },

    /* ---------- door ----------
       Panel, window aperture and handle. The perforated screen is modelled as
       a thin plate inside the window, which is what you are actually looking
       through in a real machine. */
    { node: 'door-c', color: '#2f3238', dir: [0, -1, 0], spread: 1.9,
      rough: 0.28, metal: 0.3,
      boxes: [
        // frame only: the window is its own part below, so that the thing
        // you actually look through is a separate colour and separately
        // selectable. A model may reference any node of the device, not just
        // a root one, and the door screen is the component worth clicking.
        { shape: 'round', r: 10, bevel: 4, x: [-250, 120], y: [-206, -178], z: [12, 46] },
        { shape: 'round', r: 10, bevel: 4, x: [-250, 120], y: [-206, -178], z: [240, 274] },
        { shape: 'round', r: 10, bevel: 4, x: [-250, -214], y: [-206, -178], z: [12, 274] },
        { shape: 'round', r: 10, bevel: 4, x: [84, 120], y: [-206, -178], z: [12, 274] },
        { shape: 'cyl', axis: 'z', seg: 14, x: [86, 116], y: [-224, -194], z: [40, 250] }
      ] },

    /* The window: glass outside, perforated screen behind it. The holes are
       far smaller than the 122 mm wavelength and far larger than visible
       light, which is the whole trick and the reason you can watch. */
    { node: 'door-screen', color: '#7f96a8', dir: [0, -1, 0.35], spread: 2.15,
      rough: 0.06, metal: 0.15,
      boxes: [
        { x: [-214, 84], y: [-206, -200], z: [46, 240] },
        { x: [-210, 80], y: [-184, -178], z: [50, 236] }
      ] },

    /* ---------- magnetron ----------
       Finned cylinder on the cavity's right wall, antenna pointing into the
       waveguide above it. This is the single component the whole device
       exists to house. */
    { node: 'magnetron', color: '#8e959c', dir: [0.85, 0, 0.5], spread: 1.6,
      rough: 0.32, metal: 0.68,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 24, x: [126, 206], y: [16, 96], z: [128, 214] },
        // cooling fins
        { x: [120, 212], y: [12, 100], z: [214, 220] },
        { x: [120, 212], y: [12, 100], z: [226, 232] },
        { x: [120, 212], y: [12, 100], z: [116, 122] },
        // antenna into the waveguide
        { shape: 'cyl', axis: 'z', seg: 12, x: [156, 176], y: [46, 66], z: [214, 244] }
      ] },

    /* ---------- high voltage supply ---------- */
    { node: 'hv-supply', color: '#3d444d', dir: [0.5, 0.85, 0.3], spread: 1.75,
      rough: 0.45, metal: 0.35,
      boxes: [
        { shape: 'round', r: 8, bevel: 3, x: [130, 218], y: [104, 168], z: [22, 104] },   // transformer
        { shape: 'cyl', axis: 'y', seg: 18, x: [140, 196], y: [-10, 74], z: [40, 96] },   // capacitor
        { x: [200, 218], y: [10, 44], z: [46, 74] }                                        // diode
      ] },

    /* ---------- control ---------- */
    { node: 'control', color: '#232a31', dir: [0.9, -0.5, 0.4], spread: 1.85,
      rough: 0.4,
      boxes: [
        { shape: 'round', r: 8, bevel: 3, x: [124, 248], y: [-206, -180], z: [12, 274] },  // fascia
        { x: [132, 226], y: [-176, -150], z: [110, 250] }                                   // board
      ] },

    /* The display, split out for the same reason as the window: it is the one
       lit thing on the machine and it should read as such. */
    { node: 'control-display', color: '#c24a2b', dir: [0.7, -0.9, 0.4], spread: 2.2,
      rough: 0.2,
      boxes: [
        { x: [146, 226], y: [-210, -206], z: [200, 244] }
      ] },

    /* ---------- turntable ---------- */
    { node: 'turntable', color: '#a9c3d4', dir: [0, 0, -1], spread: 1.5,
      rough: 0.08,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 32, x: [-200, 80], y: [-133, 147], z: [32, 44] },  // glass tray
        { shape: 'cyl', axis: 'z', seg: 12, x: [-76, -44], y: [-9, 23], z: [8, 30] }        // motor
      ] },

    /* ---------- cooling ---------- */
    { node: 'fan-cool', color: '#5a6472', dir: [0.6, 0.9, 0.35], spread: 1.95,
      rough: 0.5,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 20, x: [140, 226], y: [108, 152], z: [150, 236] },
        { x: [126, 232], y: [152, 168], z: [160, 226] }
      ] },

    /* ---------- wiring and interlocks ----------
       Three switches on the door frame and the harness that ties the machine
       together. Trivial in cost, and the reason the appliance is legal. */
    { node: 'wiring-mw', color: '#b08a4a', dir: [-0.85, -0.4, 0.5], spread: 2.05,
      rough: 0.5,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 8, x: [112, 124], y: [-150, 150], z: [60, 72] },
        { x: [114, 134], y: [-172, -152], z: [200, 226] },   // interlock 1
        { x: [114, 134], y: [-172, -152], z: [160, 186] },   // interlock 2
        { x: [114, 134], y: [-172, -152], z: [120, 146] }    // monitor switch
      ] }
  ]
});

/* ======================= MICROWAVE / MAGNETRON =======================
 * The reason the appliance exists, taken apart: copper anode block with its
 * resonant cavities, the cathode on the axis, two ferrite ring magnets above
 * and below, and the ceramic seal carrying the antenna out.
 *
 * Scaled up roughly four times from the ~80 mm the real thing is.
 */
TD.model('microwave/magnetron', {
  spread: 210,
  view: {
    camera: [0.52, 0.40, 0.75],
    distance: 1.02,
    background: 'studio',
    shadow: 0.16,
    edges: 0.44
  },
  parts: [
    /* Anode: a copper block with the resonant cavities cut into it. Their
       dimensions set 2.45 GHz, which is why every domestic microwave in the
       world runs at the same frequency. */
    { node: 'anode-mw', color: '#b8722e', dir: [0, 0, -1], spread: 1.2,
      rough: 0.28, metal: 0.82,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 32, x: [-190, 190], y: [-190, 190], z: [-90, 90] },
        // the vanes, radiating inward: eight of the ten in a typical block
        { x: [-24, 24], y: [80, 176], z: [-84, 84] },
        { x: [-24, 24], y: [-176, -80], z: [-84, 84] },
        { x: [80, 176], y: [-24, 24], z: [-84, 84] },
        { x: [-176, -80], y: [-24, 24], z: [-84, 84] },
        { x: [66, 140], y: [66, 140], z: [-84, 84] },
        { x: [-140, -66], y: [66, 140], z: [-84, 84] },
        { x: [66, 140], y: [-140, -66], z: [-84, 84] },
        { x: [-140, -66], y: [-140, -66], z: [-84, 84] }
      ] },

    /* Cathode: the thoriated tungsten filament on the axis, with its end
       hats. Everything else in the tube is arranged around this wire. */
    { node: 'cathode-mw', color: '#e8e2d6', dir: [0, 0, 1], spread: 1.45,
      rough: 0.3, metal: 0.5,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 18, x: [-30, 30], y: [-30, 30], z: [-96, 96] },
        { shape: 'cyl', axis: 'z', seg: 18, x: [-56, 56], y: [-56, 56], z: [76, 96] },
        { shape: 'cyl', axis: 'z', seg: 18, x: [-56, 56], y: [-56, 56], z: [-96, -76] }
      ] },

    /* Two ferrite ring magnets, above and below the anode. Deliberately not
       rare earth; see the node text. */
    { node: 'mag-magnets', color: '#2f3439', dir: [0, 0.9, 0.5], spread: 1.7,
      rough: 0.62,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 28, x: [-210, 210], y: [-210, 210], z: [104, 178] },
        { shape: 'cyl', axis: 'z', seg: 28, x: [-210, 210], y: [-210, 210], z: [-178, -104] }
      ] },

    /* Ceramic seal and the antenna passing out of the vacuum into the
       waveguide: the hardest manufacturing step in the tube. */
    { node: 'mag-ceramic', color: '#d9d2c4', dir: [0.6, -0.6, 0.9], spread: 1.9,
      rough: 0.35,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 24, r2: 0.6, at: 'max',
          x: [-104, 104], y: [-104, 104], z: [190, 300] },
        { shape: 'cyl', axis: 'z', seg: 14, x: [-26, 26], y: [-26, 26], z: [96, 240] }
      ] }
  ]
});

/* ===================== MICROWAVE / HIGH VOLTAGE =====================
 * Transformer, capacitor and diode: the voltage doubler that turns mains
 * into about four kilovolts, and comfortably the most dangerous eight dollars
 * of parts in a kitchen.
 */
TD.model('microwave/hv-supply', {
  spread: 170,
  view: {
    camera: [0.48, 0.44, 0.76],
    distance: 1.0,
    background: 'studio',
    shadow: 0.15,
    edges: 0.42
  },
  parts: [
    { node: 'hv-transformer', color: '#3d444d', dir: [0, 0, -1], spread: 1.2,
      rough: 0.5, metal: 0.35,
      boxes: [
        // laminated core, drawn as a stack so it reads as laminations
        { x: [-160, 160], y: [-120, 120], z: [0, 22] },
        { x: [-160, 160], y: [-120, 120], z: [26, 48] },
        { x: [-160, 160], y: [-120, 120], z: [52, 74] },
        { x: [-160, 160], y: [-120, 120], z: [78, 100] },
        // windings
        { shape: 'round', r: 14, bevel: 5, x: [-96, -30], y: [-140, 140], z: [-16, 116] },
        { shape: 'round', r: 14, bevel: 5, x: [34, 100], y: [-140, 140], z: [-16, 116] }
      ] },

    { node: 'transformer-steel', color: '#7d858e', dir: [-0.9, 0, 0.5], spread: 1.6,
      rough: 0.4, metal: 0.7,
      boxes: [
        // a few loose laminations, pulled clear of the stack
        { x: [-190, 190], y: [-130, 130], z: [128, 134] },
        { x: [-190, 190], y: [-130, 130], z: [140, 146] },
        { x: [-190, 190], y: [-130, 130], z: [152, 158] }
      ] },

    { node: 'hv-capacitor', color: '#8e959c', dir: [0.9, 0.3, 0.5], spread: 1.75,
      rough: 0.3, metal: 0.6,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 24, x: [200, 320], y: [-60, 60], z: [-10, 150] },
        { shape: 'cyl', axis: 'z', seg: 10, x: [232, 252], y: [-16, 4], z: [150, 176] },
        { shape: 'cyl', axis: 'z', seg: 10, x: [268, 288], y: [-16, 4], z: [150, 176] }
      ] },

    { node: 'hv-diode', color: '#232a31', dir: [0.5, -0.9, 0.4], spread: 1.9,
      rough: 0.45,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 14, x: [196, 244], y: [-190, -100], z: [30, 78] }
      ] }
  ]
});
