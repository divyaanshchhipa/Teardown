/* Teardown : 3D models, smartphone
 *
 * Boxes in millimetres. x = right, y = back, z = up.
 * Every `node` must match a node id in data/devices/smartphone.js, which is
 * how clicking a solid selects the right component.
 *
 * "smartphone" is the top level view. "smartphone/board-m" and
 * "smartphone/camera-m" open when you double click those components, the way
 * the notebook's mainboard and display assembly do. Anything without a model
 * falls back to the flat schematic.
 *
 * ---- geometry notes, learned the hard way on the notebook ----
 *
 * Model the shell properly. A phone is mostly a sealed metal frame with glass
 * on both faces; without side walls you look straight through the thing and it
 * reads as a stack of tiles rather than a product. The walls here run the full
 * internal height and the cover glass sits *over* them, which is the actual
 * construction and also the only arrangement that silhouettes correctly.
 *
 * Leave clearance. Every internal part stops at or below z 6.6 against a
 * display starting at 6.8. A part coplanar with the layer above it shows a
 * sliver past that layer's edge from most angles.
 *
 * The camera bump is the one feature that makes a phone read as a phone
 * rather than a slab, so it protrudes properly through the back face into
 * negative z instead of being flush.
 */

/* ============================ SMARTPHONE ============================
 * 72 x 152 x 8.6 closed. Back glass at z 0, cover glass at z 8.6.
 */
TD.model('smartphone', {
  /* Wider than it looks like it should be. A phone is 8.6 mm thick and
     150 mm long, so a separation tuned to the thickness leaves every layer
     still visually inside the silhouette of the one above it from any
     three-quarter angle. The stack layers need to travel a distance set by
     the device's *length* before they read as separate objects. */
  spread: 30,
  view: {
    camera: [0.46, 0.62, 0.78],   // three-quarter, screen readable
    distance: 1.02,
    background: 'studio',
    shadow: 0.16,
    edges: 0.40,
    exposure: 1.03
  },
  parts: [
    /* Frame and back: rounded back panel, four side walls, and the raised
       rail around the camera bump. Machined aluminium or titanium, so it
       carries a real metal response rather than the flat grey a plain box
       gets. */
    { node: 'enclosure-m', color: '#8b939d', dir: [0, 0, -1], spread: 1.3, shell: true,
      rough: 0.38, metal: 0.62,
      boxes: [
        { shape: 'round', r: 11, bevel: 1.0, x: [-36, 36], y: [-76, 76], z: [0, 0.9] },  // back glass
        { x: [-36, -33.2], y: [-74, 74], z: [0.9, 8.2] },     // left rail
        { x: [33.2, 36], y: [-74, 74], z: [0.9, 8.2] },       // right rail
        { x: [-36, 36], y: [-76, -73.2], z: [0.9, 8.2] },     // bottom rail
        { x: [-36, 36], y: [73.2, 76], z: [0.9, 8.2] },       // top rail
        { shape: 'round', r: 6, bevel: 0.7, x: [1, 33], y: [37, 73], z: [-1.7, 0.9] }    // camera plateau
      ] },

    /* One pouch cell filling the lower two thirds, in a phone the battery
       really is the single largest volume, same as the notebook. */
    { node: 'battery-m', color: '#2f6d59', rough: 0.52,
      boxes: [{ shape: 'round', r: 2.5, bevel: 0.5, x: [-29.5, 29.5], y: [-58, 14], z: [1.0, 5.4] }] },

    /* Logic board across the top, above the battery. Double-sided and small:
       the whole point of the SiP layer is that it keeps shrinking so the cell
       below can grow into the space. */
    { node: 'board-m', color: '#15613c', rough: 0.6,
      boxes: [{ x: [-29.5, 29.5], y: [18, 64], z: [1.0, 4.2] }] },

    /* Camera stack, sitting in the plateau and protruding through the back.
       Everything from here down carries an explicit `dir`: these are the
       parts that are not part of the front-to-back stack, and letting them
       travel straight up with everything else just buries them under the
       display. Fanning them sideways is what makes the exploded view
       legible rather than merely tall. */
    { node: 'camera-m', color: '#0e1218', dir: [0.75, 0.55, 0.7], spread: 1.5, rough: 0.22,
      boxes: [
        { shape: 'round', r: 5, bevel: 0.6, x: [4, 30], y: [40, 70], z: [-1.2, 6.6] }
      ] },

    /* RF rails: the antenna and front-end run down both long edges, which is
       why the frame has plastic breaks in it. */
    { node: 'rf-m', color: '#b08a4a', dir: [0, -0.9, 0.5], spread: 1.15, rough: 0.45,
      boxes: [
        { x: [-32.8, -30.5], y: [-64, 64], z: [1.0, 4.0] },
        { x: [30.5, 32.8], y: [-64, 64], z: [1.0, 4.0] }
      ] },

    /* Bottom speaker box and the earpiece slot at the top. */
    { node: 'audio-m', color: '#5a6472', dir: [-0.95, -0.35, 0.55], spread: 1.25, rough: 0.55,
      boxes: [
        { x: [-20, 20], y: [-73, -66], z: [1.0, 4.6] },
        { x: [-14, 14], y: [64, 71], z: [4.4, 6.6] }
      ] },

    { node: 'sensors-m', color: '#6b7683', dir: [-0.85, 0.5, 0.7], spread: 1.35, rough: 0.5,
      boxes: [{ x: [-28, -8], y: [44, 62], z: [4.2, 6.4] }] },

    /* Wireless charging coil, a flat disc across the back of the battery. */
    { node: 'charger-m', color: '#c2a15a', dir: [0.9, -0.5, 0.4], spread: 1.2, rough: 0.4, metal: 0.35,
      boxes: [{ shape: 'round', r: 16, bevel: 0.4, x: [-18, 18], y: [-28, 8], z: [5.4, 6.3] }] },

    /* Board-to-board connectors in the middle, SIM tray in the bottom rail. */
    { node: 'mech-m', color: '#aeb5bc', dir: [1, -0.15, 0.6], spread: 1.45, rough: 0.35, metal: 0.5,
      boxes: [
        { x: [-8, 8], y: [14, 20], z: [4.2, 5.6] },
        { x: [-30, -14], y: [-76, -71], z: [1.6, 4.0] }
      ] },

    { node: 'display-m', color: '#232f3d', rough: 0.18,
      boxes: [{ shape: 'round', r: 9, bevel: 0.5, x: [-35, 35], y: [-75, 75], z: [6.8, 7.9] }] },

    /* Darker than the notebook's cover glass on purpose. A laptop is presented
       open, so its glass is read against a lit screen; a phone is presented
       closed and face up, and the first thing you see is the front. A switched
       off phone front is near-black glass, so a pale sheet here made the whole
       device read as a blank tile. Still distinctly bluer and lighter than the
       panel underneath, so the two separate cleanly when it comes apart. */
    { node: 'cover-glass-m', color: '#4f5f70', spread: 1.3, rough: 0.07,
      boxes: [{ shape: 'round', r: 11, bevel: 0.8, x: [-36, 36], y: [-76, 76], z: [7.9, 8.6] }] }
  ]
});

/* ===================== SMARTPHONE / LOGIC BOARD =====================
 * The board laid flat with its packages standing on it, scaled up from the
 * 62 x 46 mm it really is so the parts are separable.
 *
 * Memory sits directly on top of the processor rather than beside it,
 * because that is what package-on-package means and it is the single most
 * surprising thing about a phone board to anyone used to a PC motherboard.
 */
TD.model('smartphone/board-m', {
  spread: 14,
  view: {
    camera: [0.35, 0.52, 0.86],
    distance: 0.98,
    background: 'studio',
    shadow: 0.14,
    edges: 0.44
  },
  parts: [
    { node: 'pcb-m', color: '#15613c', dir: [0, 0, -1], spread: 1.35, rough: 0.62,
      boxes: [{ shape: 'round', r: 2, bevel: 0.3, x: [-31, 31], y: [-23, 23], z: [0, 1.2] }] },

    { node: 'soc-m', color: '#39404a', rough: 0.3,
      boxes: [{ x: [-14, 4], y: [0, 18], z: [1.2, 3.4] }] },

    /* stacked on the processor, not beside it */
    { node: 'mem-m', color: '#4d5864', spread: 1.5, rough: 0.34,
      boxes: [{ x: [-13, 3], y: [1, 17], z: [3.4, 4.8] }] },

    { node: 'modem-m', color: '#2f3a45', rough: 0.32,
      boxes: [{ x: [9, 23], y: [2, 16], z: [1.2, 2.9] }] },

    { node: 'sip-m', color: '#3f4a57', rough: 0.4,
      boxes: [{ x: [-25, -5], y: [-20, -7], z: [1.2, 3.1] }] },

    { node: 'wifi-m', color: '#59636e', rough: 0.36,
      boxes: [{ x: [7, 21], y: [-19, -7], z: [1.2, 2.7] }] },

    { node: 'pmic-m', color: '#6d5c40', rough: 0.42,
      boxes: [
        { x: [-29, -19], y: [-3, 9], z: [1.2, 2.5] },
        { x: [19, 29], y: [-4, 8], z: [1.2, 2.5] }
      ] },

    /* A thousand of these in a real phone. A scatter of small blocks reads as
       "many tiny components" in a way one representative box never does. */
    { node: 'passives-m', color: '#8a6a2e', rough: 0.5,
      boxes: [
        { x: [-29, -25], y: [14, 20], z: [1.2, 1.9] },
        { x: [-22, -18], y: [14, 20], z: [1.2, 1.9] },
        { x: [8, 12], y: [19, 22], z: [1.2, 1.9] },
        { x: [15, 19], y: [19, 22], z: [1.2, 1.9] },
        { x: [24, 29], y: [13, 18], z: [1.2, 1.9] },
        { x: [-3, 2], y: [-22, -18], z: [1.2, 1.9] },
        { x: [25, 30], y: [-20, -15], z: [1.2, 1.9] }
      ] }
  ]
});

/* ===================== SMARTPHONE / CAMERA =====================
 * One module, exploded along its optical axis: sensor at the bottom, the
 * actuator housing around the middle, and the lens elements stacked above.
 * Modelled round, because every part of it is.
 */
TD.model('smartphone/camera-m', {
  spread: 13,
  view: {
    camera: [0.42, 0.48, 0.77],
    distance: 1.06,
    background: 'studio',
    shadow: 0.15,
    edges: 0.38
  },
  parts: [
    { node: 'sensor-m', color: '#2b3440', dir: [0, 0, -1], spread: 1.25, rough: 0.3,
      boxes: [
        { x: [-11, 11], y: [-11, 11], z: [0, 1.1] },                                  // package
        { shape: 'round', r: 1.5, bevel: 0.2, x: [-7.5, 7.5], y: [-7.5, 7.5], z: [1.1, 1.8] }  // die
      ] },

    /* The actuator is a coil-and-magnet cage the lens barrel floats inside,
       so it reads as a housing with a hole rather than a solid block. */
    { node: 'vcm-m', color: '#8d949c', rough: 0.4, metal: 0.45,
      boxes: [
        { x: [-11, -8], y: [-11, 11], z: [1.8, 6.2] },
        { x: [8, 11], y: [-11, 11], z: [1.8, 6.2] },
        { x: [-8, 8], y: [-11, -8], z: [1.8, 6.2] },
        { x: [-8, 8], y: [8, 11], z: [1.8, 6.2] }
      ] },

    /* Six aspheric elements. Decreasing diameter up the stack is what an
       actual phone lens set looks like in cross section. */
    { node: 'lens-m', color: '#9fb6cc', spread: 1.45, rough: 0.06,
      boxes: [
        { shape: 'round', r: 7.4, bevel: 0.3, x: [-7.4, 7.4], y: [-7.4, 7.4], z: [2.2, 3.0] },
        { shape: 'round', r: 7.0, bevel: 0.3, x: [-7.0, 7.0], y: [-7.0, 7.0], z: [3.0, 3.8] },
        { shape: 'round', r: 6.6, bevel: 0.3, x: [-6.6, 6.6], y: [-6.6, 6.6], z: [3.8, 4.6] },
        { shape: 'round', r: 6.2, bevel: 0.3, x: [-6.2, 6.2], y: [-6.2, 6.2], z: [4.6, 5.4] },
        { shape: 'round', r: 5.8, bevel: 0.3, x: [-5.8, 5.8], y: [-5.8, 5.8], z: [5.4, 6.2] },
        { shape: 'round', r: 5.4, bevel: 0.3, x: [-5.4, 5.4], y: [-5.4, 5.4], z: [6.2, 7.0] }
      ] }
  ]
});
