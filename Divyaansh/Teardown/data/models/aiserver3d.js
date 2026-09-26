/* Teardown : 3D models, AI server rack
 *
 * Boxes in millimetres. x = right, y = back, z = up.
 * Every `node` must match a node id in data/devices/ai-server.js.
 *
 * A 600 x 1200 x 2100 rack in the shape of an NVL72-class machine: compute
 * trays filling most of the height, switch trays in the middle where they
 * actually sit, power shelves and a coolant distribution unit at the bottom,
 * a busbar up the back and liquid manifolds down both sides.
 *
 * Two things worth preserving if this is edited.
 *
 * The switch trays are in the *middle* of the rack, not the top. That is not
 * decoration: a scale-up fabric is copper, copper loss is a function of
 * length, and putting the switches equidistant from every compute tray is
 * what keeps the cable runs short enough to work at 224 gigabits a lane. The
 * physical layout is a consequence of the electrical constraint.
 *
 * The cooling and power hardware is modelled at real proportion, which is
 * more of the rack than people expect, roughly a fifth of the height carries
 * no compute at all. That is the visual form of the device's argument: this
 * is an electrical and thermal machine that happens to contain silicon.
 */

TD.model('ai-server', {
  spread: 420,
  view: {
    camera: [0.56, 0.30, 0.77],
    distance: 1.05,
    background: 'studio',
    shadow: 0.18,
    edges: 0.34,
    exposure: 1.02
  },
  parts: [

    /* ---------- rack frame ----------
       Posts, base, top and rear panel. Explodes upward and outward so the
       trays inside stay readable. */
    { node: 'chassis-srv', color: '#3a4048', dir: [0, 0.3, 1], spread: 1.3,
      rough: 0.42, metal: 0.5, shell: true,
      boxes: [
        { x: [-300, -272], y: [-600, 600], z: [0, 2100] },      // left post wall
        { x: [272, 300], y: [-600, 600], z: [0, 2100] },        // right post wall
        { x: [-300, 300], y: [572, 600], z: [0, 2100] },        // rear panel
        { shape: 'round', r: 14, bevel: 5, x: [-300, 300], y: [-600, 600], z: [2100, 2145] },
        { x: [-300, 300], y: [-600, 600], z: [0, 60] },         // plinth
        { x: [-300, 300], y: [-600, -572], z: [2040, 2100] }    // front header
      ] },

    /* ---------- compute trays ----------
       Ten trays, five below the switch shelf and five above. Each carries the
       accelerator packages that are over half the cost of the machine. */
    { node: 'accelerator', color: '#1f6f57', dir: [0, -1, 0.15], spread: 1.5,
      rough: 0.5,
      boxes: [
        { x: [-266, 266], y: [-566, 520], z: [560, 668] },
        { x: [-266, 266], y: [-566, 520], z: [682, 790] },
        { x: [-266, 266], y: [-566, 520], z: [804, 912] },
        { x: [-266, 266], y: [-566, 520], z: [926, 1034] },
        { x: [-266, 266], y: [-566, 520], z: [1048, 1156] },
        { x: [-266, 266], y: [-566, 520], z: [1420, 1528] },
        { x: [-266, 266], y: [-566, 520], z: [1542, 1650] },
        { x: [-266, 266], y: [-566, 520], z: [1664, 1772] },
        { x: [-266, 266], y: [-566, 520], z: [1786, 1894] },
        { x: [-266, 266], y: [-566, 520], z: [1908, 2016] }
      ] },

    /* ---------- HBM ----------
       Modelled as the stacks flanking each package. Physically tiny; sixteen
       percent of the cost of the rack. */
    { node: 'hbm', color: '#c2a15a', dir: [0.85, -0.5, 0.4], spread: 1.9,
      rough: 0.35, metal: 0.4,
      boxes: [
        { x: [-210, -120], y: [-300, -120], z: [668, 700] },
        { x: [120, 210], y: [-300, -120], z: [668, 700] },
        { x: [-210, -120], y: [-300, -120], z: [1034, 1066] },
        { x: [120, 210], y: [-300, -120], z: [1034, 1066] },
        { x: [-210, -120], y: [-300, -120], z: [1772, 1804] },
        { x: [120, 210], y: [-300, -120], z: [1772, 1804] }
      ] },

    /* ---------- host CPUs ---------- */
    { node: 'host-cpu', color: '#6b7683', dir: [-0.85, -0.5, 0.4], spread: 1.85,
      rough: 0.4,
      boxes: [
        { x: [-90, 90], y: [200, 380], z: [668, 698] },
        { x: [-90, 90], y: [200, 380], z: [1034, 1064] },
        { x: [-90, 90], y: [200, 380], z: [1772, 1802] }
      ] },

    /* ---------- switch trays ----------
       In the middle of the rack, for the reason given in the header. */
    { node: 'fabric', color: '#7a5cc7', dir: [0, -1, 0.35], spread: 1.7,
      rough: 0.45,
      boxes: [
        { x: [-266, 266], y: [-566, 520], z: [1180, 1268] },
        { x: [-266, 266], y: [-566, 520], z: [1282, 1370] }
      ] },

    /* ---------- optics ----------
       Transceiver cages across the front face of both switch trays. Thirty-two
       ports a side, and each module costs more than a laptop. */
    { node: 'optics', color: '#2f9ad0', dir: [0, -1, 0.6], spread: 2.1,
      rough: 0.25, metal: 0.3,
      boxes: [
        { x: [-250, -10], y: [-590, -560], z: [1196, 1252] },
        { x: [10, 250], y: [-590, -560], z: [1196, 1252] },
        { x: [-250, -10], y: [-590, -560], z: [1298, 1354] },
        { x: [10, 250], y: [-590, -560], z: [1298, 1354] }
      ] },

    /* ---------- storage ---------- */
    { node: 'storage-srv', color: '#5a6472', dir: [0, -1, -0.2], spread: 1.6,
      rough: 0.5,
      boxes: [
        { x: [-266, 266], y: [-566, 400], z: [420, 512] }
      ] },

    /* ---------- rack power ----------
       Power shelves at the bottom and the busbar carrying the whole rack
       current up the back of the frame. */
    { node: 'rack-power', color: '#c24a2b', dir: [0, 0.9, -0.4], spread: 1.75,
      rough: 0.4, metal: 0.35,
      boxes: [
        { x: [-266, 266], y: [-566, 420], z: [212, 300] },      // power shelf
        { x: [-266, 266], y: [-566, 420], z: [312, 400] },      // power shelf
        { x: [-70, 70], y: [488, 548], z: [200, 2040] },        // busbar
        { x: [-160, 160], y: [440, 500], z: [120, 200] }        // feed
      ] },

    /* ---------- cooling ----------
       CDU in the plinth, manifolds up both sides, rear-door heat exchanger.
       At 130 kilowatts this is not an accessory. */
    { node: 'cooling-srv', color: '#3a8fd0', dir: [-0.9, 0.4, -0.35], spread: 1.95,
      rough: 0.3, metal: 0.3,
      boxes: [
        { x: [-266, 266], y: [-566, 460], z: [66, 200] },                                  // CDU
        { shape: 'cyl', axis: 'z', seg: 16, x: [-262, -206], y: [380, 436], z: [200, 2040] }, // supply manifold
        { shape: 'cyl', axis: 'z', seg: 16, x: [206, 262], y: [380, 436], z: [200, 2040] },   // return manifold
        { x: [-296, 296], y: [600, 648], z: [200, 2060] }                                   // rear door exchanger
      ] }
  ]
});

/* ===================== AI SERVER / ACCELERATOR =====================
 * The package itself, which is the single most photographed object in the
 * industry and almost never drawn accurately: a large organic substrate, a
 * silicon interposer on top of it, the logic die in the middle, and the HBM
 * stacks standing alongside, all under one lid.
 *
 * This is what CoWoS means, and why a back-end packaging step became the
 * binding constraint on a trillion dollars of market value.
 */
TD.model('ai-server/accelerator', {
  spread: 190,
  view: {
    camera: [0.50, 0.42, 0.76],
    distance: 1.0,
    background: 'studio',
    shadow: 0.16,
    edges: 0.44
  },
  parts: [
    /* ABF substrate: the big green board everything sits on, and its own
       quiet oligopoly one layer down. */
    { node: 'accel-substrate', color: '#1f6f57', dir: [0, 0, -1], spread: 1.25,
      rough: 0.55,
      boxes: [
        { shape: 'round', r: 20, bevel: 7, x: [-560, 560], y: [-460, 460], z: [-90, -30] }
      ] },

    /* Silicon interposer: a large piece of silicon whose only job is wiring. */
    { node: 'interposer', color: '#8e959c', dir: [0, 0, -1], spread: 1.6,
      rough: 0.3, metal: 0.45,
      boxes: [
        { x: [-470, 470], y: [-370, 370], z: [-30, 4] }
      ] },

    /* Two logic dies, which is what a modern top-end part actually is. */
    { node: 'accelerator', color: '#2b3138', dir: [0, 0, 1], spread: 1.45,
      rough: 0.22, metal: 0.3,
      boxes: [
        { x: [-250, -14], y: [-240, 240], z: [4, 58] },
        { x: [14, 250], y: [-240, 240], z: [4, 58] }
      ] },

    /* Eight HBM stacks, four a side. Each is a dozen or more thinned dies
       bonded together, and they are taller than the logic die. */
    { node: 'hbm', color: '#c2a15a', dir: [0.9, 0, 0.5], spread: 1.8,
      rough: 0.32, metal: 0.35,
      boxes: [
        { x: [-440, -300], y: [-350, -190], z: [4, 76] },
        { x: [-440, -300], y: [-80, 80], z: [4, 76] },
        { x: [-440, -300], y: [190, 350], z: [4, 76] },
        { x: [-440, -300], y: [-620, -460], z: [4, 76] },
        { x: [300, 440], y: [-350, -190], z: [4, 76] },
        { x: [300, 440], y: [-80, 80], z: [4, 76] },
        { x: [300, 440], y: [190, 350], z: [4, 76] },
        { x: [300, 440], y: [-620, -460], z: [4, 76] }
      ] },

    /* The stacking equipment layer, drawn as the bonded die stack itself,
       a dozen thinned wafers with tens of thousands of vertical connections
       between them, which is the actual difficulty in HBM. */
    { node: 'hbm-tsv', color: '#a9b0b8', dir: [0, -0.9, 0.7], spread: 2.15,
      rough: 0.28, metal: 0.5,
      boxes: [
        { x: [-100, 100], y: [-820, -660], z: [0, 12] },
        { x: [-100, 100], y: [-820, -660], z: [16, 28] },
        { x: [-100, 100], y: [-820, -660], z: [32, 44] },
        { x: [-100, 100], y: [-820, -660], z: [48, 60] },
        { x: [-100, 100], y: [-820, -660], z: [64, 76] }
      ] }
  ]
});

/* ===================== AI SERVER / RACK POWER =====================
 * The layer this teardown argues is the real story: power shelves, busbar,
 * battery backup, and the facility gear behind them. Laid out as a chain from
 * the rack outward rather than as a stack, because that is the direction the
 * constraint runs.
 */
TD.model('ai-server/rack-power', {
  spread: 240,
  view: {
    camera: [0.46, 0.34, 0.80],
    distance: 1.02,
    background: 'studio',
    shadow: 0.15,
    edges: 0.40
  },
  parts: [
    { node: 'psu', color: '#c24a2b', dir: [0, -1, 0.3], spread: 1.4,
      rough: 0.4, metal: 0.35,
      boxes: [
        { shape: 'round', r: 10, bevel: 4, x: [-420, -150], y: [-260, 200], z: [0, 130] },
        { shape: 'round', r: 10, bevel: 4, x: [-130, 140], y: [-260, 200], z: [0, 130] },
        { shape: 'round', r: 10, bevel: 4, x: [160, 430], y: [-260, 200], z: [0, 130] }
      ] },

    { node: 'busbar', color: '#b8722e', dir: [0, 0, 1], spread: 1.65,
      rough: 0.25, metal: 0.85,
      boxes: [
        { x: [-460, 460], y: [250, 330], z: [30, 100] },
        { x: [-460, 460], y: [250, 330], z: [130, 200] }
      ] },

    { node: 'bbu', color: '#2f6d59', dir: [-0.9, 0.3, 0.5], spread: 1.85,
      rough: 0.45,
      boxes: [
        { shape: 'round', r: 8, bevel: 3, x: [-420, -150], y: [-260, 200], z: [150, 260] },
        { shape: 'round', r: 8, bevel: 3, x: [-130, 140], y: [-260, 200], z: [150, 260] }
      ] },

    /* Facility side: switchgear cabinet and a transformer, drawn at a size
       that makes the point: the electrical plant behind one rack is larger
       than the rack. */
    { node: 'facility-power', color: '#6b7683', dir: [0, 1, 0.25], spread: 2.1,
      rough: 0.5, metal: 0.3,
      boxes: [
        { shape: 'round', r: 14, bevel: 6, x: [-520, -140], y: [520, 900], z: [0, 520] },
        { shape: 'round', r: 14, bevel: 6, x: [140, 520], y: [520, 900], z: [0, 460] },
        { shape: 'cyl', axis: 'z', seg: 16, x: [-60, 60], y: [640, 760], z: [460, 620] }
      ] }
  ]
});
