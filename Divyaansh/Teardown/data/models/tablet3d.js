/* Teardown :: tablet, 3D model
 *
 * A proper layer stack now: enclosure tray at the bottom, board-level
 * components in the middle, panel on top, rather than the original two
 * floating slabs. DDIC-equivalent connector/biometric/etc are included as
 * small real volumes; ODM isn't a physical part.
 */
TD.model('tablet', {
  spread: 24,
  parts: [
    { node: 'tablet-enclosure', color: '#767f8a', dir: [0, 0, -1], spread: 1.3, shell: true,
      boxes: [
        { x: [-110, 110], y: [-150, 150], z: [0, 2] },     // back
        { x: [-110, -105], y: [-150, 150], z: [2, 6] },    // left wall
        { x: [105, 110], y: [-150, 150], z: [2, 6] },      // right wall
        { x: [-110, 110], y: [145, 150], z: [2, 6] },      // top edge
        { x: [-110, 110], y: [-150, -145], z: [2, 6] }     // bottom edge
      ] },
    { node: 'tablet-battery', color: '#2f6d59',
      boxes: [ { x: [-90, 90], y: [-110, 60], z: [2, 5] } ] },
    { node: 'soc', color: '#3a6ea8',
      boxes: [ { x: [-30, 30], y: [70, 110], z: [2, 5.5] } ] },
    { node: 'tablet-dram', color: '#5b8a72',
      boxes: [ { x: [35, 70], y: [70, 105], z: [2, 5] } ] },
    { node: 'tablet-storage', color: '#4a4a52',
      boxes: [ { x: [-70, -35], y: [70, 105], z: [2, 5] } ] },
    { node: 'tablet-pmic', color: '#6d5c40',
      boxes: [ { x: [-30, 10], y: [112, 130], z: [2, 4] } ] },
    { node: 'tablet-modem', color: '#8a6fae',
      boxes: [ { x: [15, 55], y: [112, 135], z: [2, 4.5] } ] },
    { node: 'tablet-wifi', color: '#4fa3c9',
      boxes: [ { x: [-70, -30], y: [112, 135], z: [2, 4] } ] },
    { node: 'tablet-connector', color: '#aeb5bc', spread: 1.2,
      boxes: [ { x: [-15, 15], y: [-150, -145], z: [1, 4] } ] },
    { node: 'tablet-speakers', color: '#59636e',
      boxes: [
        { x: [-100, -75], y: [-148, -130], z: [2, 4.5] },
        { x: [75, 100], y: [-148, -130], z: [2, 4.5] }
      ] },
    { node: 'tablet-camera', color: '#0e1218', spread: 1.3,
      boxes: [ { x: [-15, 15], y: [135, 148], z: [2, 6.5] } ] },
    { node: 'tablet-biometric', color: '#c2a15a', spread: 1.25,
      boxes: [ { x: [85, 105], y: [130, 145], z: [2, 4] } ] },
    { node: 'tablet-panel', color: '#232f3d', dir: [0, 0, 1],
      boxes: [ { x: [-108, 108], y: [-148, 148], z: [6.3, 8.8] } ] }
  ]
});
