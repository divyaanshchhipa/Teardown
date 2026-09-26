/* Teardown :: commercial aircraft, 3D model
 *
 * Narrowbody proportions, roughly A320/737 class: ~37 m long, ~35 m span,
 * modelled in decimetres so the numbers stay legible (x = right, y = back,
 * z = up). Recognisable, not accurate: this is an analytical model whose
 * job is that each named layer can be found, clicked and pulled out.
 *
 * The fuselage is the shell (a real structural node, not the "airframer"
 * assembly-process node, which, like every other assembly/ODM node on this
 * site, isn't a physical volume and gets no box).
 *
 * One grouping decision worth stating: the empennage (fin, tailplane) is
 * built under the `wings` node. The device file has no separate tail node,
 * and `wings` is the flight-surface structure layer, inventing a component
 * to justify geometry would put a market layer on the site that no source
 * describes. Grouped here and noted, rather than fabricated.
 */
TD.model('aircraft', {
  spread: 90,
  view: {
    /* front three-quarter from slightly above: the one angle at which a
       swept wing, a fin and a nacelle are all simultaneously legible */
    camera: [0.62, 0.30, 0.72],
    distance: 0.9,
    background: 'sky',      // a pale airframe needs a ground to sit against
    shadow: 0.13,
    edges: 0.5,
    exposure: 0.98,
    contrast: 1.15,         // an all-white aircraft needs its panel lines
    presets: { plan: [0.0005, 1, 0.0005], nose: [0.12, 0.18, 1] }
  },
  parts: [
    /* Fuselage: a constant-section tube with a tapered nose and an upswept
       tail cone. Three pieces rather than one, because the taper at each end
       is most of what separates an aircraft from a length of pipe. */
    { node: 'fuselage', color: '#dde5ed', dir: [0, 0, -1], spread: 1.2, shell: true,
      rough: 0.42, metal: 0.18,
      boxes: [
        /* nose is a tapered cylinder, not a wedge: it has to join a round
           barrel, and a faceted trapezoid reads as a truck cab */
        { shape: 'cyl', axis: 'y', at: 'min', r2: 0.30, seg: 28,
          x: [-19, 19], y: [-188, -150], z: [-17, 17] },
        // flight deck / forward barrel
        { shape: 'cyl', axis: 'y', seg: 28, x: [-19, 19], y: [-150, 40], z: [-19, 19] },
        // aft barrel
        { shape: 'cyl', axis: 'y', seg: 28, x: [-19, 19], y: [40, 128], z: [-19, 19] },
        // tail cone, tapering aft and swept upward
        { shape: 'wedge', axis: 'y', taper: [0.22, 0.30], sweep: [0, 13],
          x: [-19, 19], y: [128, 196], z: [-19, 19] }
      ] },

    { node: 'interiors', color: '#93a7bd', rough: 0.85,
      boxes: [
        { x: [-16, 16], y: [-138, 120], z: [-9, 6] },          // cabin floor and seat rows
        { x: [-16, 16], y: [-146, -132], z: [-9, 10] }         // forward galley
      ] },

    { node: 'avionics', color: '#3a6ea8', spread: 1.15, rough: 0.6,
      boxes: [
        { x: [-14, 14], y: [-176, -150], z: [-14, 8] },        // nose equipment bay
        { x: [-16, 16], y: [-150, -140], z: [6, 17] }          // flight deck panel
      ] },

    { node: 'apu', color: '#c97a3a', spread: 1.15, rough: 0.4, metal: 0.5,
      boxes: [{ shape: 'cyl', axis: 'y', seg: 18, x: [-9, 9], y: [162, 190], z: [10, 26] }] },

    /* Wings plus empennage; see the file header for why the tail lives on
       this node. Wings are swept back and tapered outboard, which is the
       whole silhouette; a rectangular plank reads as a glider. */
    { node: 'wings', color: '#d3dce6', dir: [0, 0, 0.3], rough: 0.4, metal: 0.2,
      boxes: [
        // wings narrow and thin toward the tip, and sweep aft as they go
        { shape: 'wedge', axis: 'x', at: 'min', taper: [0.26, 0.42], sweep: [56, 2],
          x: [-172, -18], y: [-30, 62], z: [-9, 1] },          // port wing
        { shape: 'wedge', axis: 'x', taper: [0.26, 0.42], sweep: [56, 2],
          x: [18, 172], y: [-30, 62], z: [-9, 1] },            // starboard wing
        // fin narrows toward the top and rakes aft
        { shape: 'wedge', axis: 'z', taper: [1, 0.46], sweep: [0, 24],
          x: [-3, 3], y: [138, 190], z: [16, 64] },
        { shape: 'wedge', axis: 'x', at: 'min', taper: [0.36, 0.5], sweep: [18, 1],
          x: [-58, -7], y: [158, 190], z: [15, 20] },          // port tailplane
        { shape: 'wedge', axis: 'x', taper: [0.36, 0.5], sweep: [18, 1],
          x: [7, 58], y: [158, 190], z: [15, 20] },            // starboard tailplane
        /* winglets sit on the *swept* tip, which the wing's own sweep has
           carried back to roughly y 58–86, placed at the unswept chord
           they float in front of the wing with nothing under them */
        { shape: 'wedge', axis: 'z', taper: [0.45, 0.62], sweep: [-2, 6],
          x: [-173, -167], y: [58, 86], z: [-3, 24] },         // port winglet
        { shape: 'wedge', axis: 'z', taper: [0.45, 0.62], sweep: [2, 6],
          x: [167, 173], y: [58, 86], z: [-3, 24] }            // starboard winglet
      ] },

    /* Nacelle plus pylon, hung forward of and below the wing where a
       narrowbody engine actually sits. The intake is a separate open ring
       so the front of the engine reads as an inlet, not a plugged cylinder. */
    /* nacelle, inlet lip and pylon, hung forward of and below the wing where
       a narrowbody engine actually sits */
    { node: 'engines', color: '#7b8794', spread: 1.3, rough: 0.34, metal: 0.6,
      boxes: [
        { shape: 'cyl', axis: 'y', seg: 24, x: [-92, -58], y: [-46, 16], z: [-31, 3] },
        { shape: 'cyl', axis: 'y', seg: 24, x: [58, 92], y: [-46, 16], z: [-31, 3] },
        { shape: 'cyl', axis: 'y', seg: 24, at: 'min', r2: 0.94,
          x: [-93, -57], y: [-54, -46], z: [-32, 4] },         // port inlet lip
        { shape: 'cyl', axis: 'y', seg: 24, at: 'min', r2: 0.94,
          x: [57, 93], y: [-54, -46], z: [-32, 4] },           // starboard inlet lip
        { shape: 'cyl', axis: 'y', seg: 18, r2: 0.35,
          x: [-83, -67], y: [16, 34], z: [-25, -3] },          // port exhaust cone
        { shape: 'cyl', axis: 'y', seg: 18, r2: 0.35,
          x: [67, 83], y: [16, 34], z: [-25, -3] },            // starboard exhaust cone
        { shape: 'wedge', axis: 'y', taper: [0.5, 1], x: [-79, -71], y: [-24, 22], z: [-10, 2] },
        { shape: 'wedge', axis: 'y', taper: [0.5, 1], x: [71, 79], y: [-24, 22], z: [-10, 2] }
      ] },

    /* Nose gear plus two main gear, not one strut on the centreline. */
    { node: 'landing-gear', color: '#4a545f', dir: [0, 0, -1], spread: 1.4,
      rough: 0.3, metal: 0.7,
      boxes: [
        { shape: 'cyl', axis: 'z', seg: 12, x: [-5, 5], y: [-136, -126], z: [-40, -18] },
        { shape: 'cyl', axis: 'x', seg: 14, x: [-9, 9], y: [-136, -126], z: [-46, -38] },
        { shape: 'cyl', axis: 'z', seg: 12, x: [-30, -20], y: [24, 34], z: [-42, -14] },
        { shape: 'cyl', axis: 'z', seg: 12, x: [20, 30], y: [24, 34], z: [-42, -14] },
        { shape: 'cyl', axis: 'x', seg: 14, x: [-36, -14], y: [22, 36], z: [-50, -38] },
        { shape: 'cyl', axis: 'x', seg: 14, x: [14, 36], y: [22, 36], z: [-50, -38] }
      ] },

    /* Wing-to-body fairing. The packs genuinely live here, and without it
       the wing root meets the fuselage at a bare seam. */
    { node: 'ecs', color: '#b9c4d0', spread: 1.1, rough: 0.5,
      boxes: [{ shape: 'round', r: 8, bevel: 2, x: [-26, 26], y: [-34, 66], z: [-26, -8] }] },

    /* hydraulic bays sit in the wing root and the belly, not out along the
       span, run outboard they were thin lines skimming a swept surface */
    { node: 'hydraulics', color: '#8d7a5c', spread: 1.2, rough: 0.55,
      boxes: [
        { shape: 'cyl', axis: 'x', seg: 12, x: [-64, -22], y: [8, 24], z: [-20, -8] },
        { shape: 'cyl', axis: 'x', seg: 12, x: [22, 64], y: [8, 24], z: [-20, -8] },
        { shape: 'cyl', axis: 'y', seg: 12, x: [-12, 12], y: [140, 178], z: [4, 16] }
      ] }
  ]
});
