/* Teardown :: smart TV, 3D model
 *
 * Panel up front, a proper back-cover shell behind the electronics layer
 * so X-ray has something real to fade: DDIC, ODM and the remote aren't
 * distinct physical volumes at this scale, same reasoning as elsewhere.
 */
TD.model('smart-tv', {
  spread: 60,
  parts: [
    { node: 'panel', color: '#232f3d',
      boxes: [ { x: [-445, 445], y: [-8, 8], z: [50, 550] } ] },
    { node: 'tv-backlight', color: '#d9c99a', dir: [0, 0.3, 0.1],
      boxes: [ { x: [-430, 430], y: [9, 15], z: [60, 540] } ] },
    { node: 'tv-soc', color: '#3a6ea8',
      boxes: [ { x: [-100, 100], y: [16, 32], z: [80, 140] } ] },
    { node: 'tv-memory', color: '#5b8a72',
      boxes: [ { x: [-100, 100], y: [16, 28], z: [145, 175] } ] },
    { node: 'tv-speakers', color: '#4a4a52',
      boxes: [
        { x: [-410, -330], y: [10, 26], z: [55, 95] },
        { x: [330, 410], y: [10, 26], z: [55, 95] }
      ] },
    { node: 'tv-psu', color: '#c9a227',
      boxes: [ { x: [140, 270], y: [16, 34], z: [80, 150] } ] },
    { node: 'tv-enclosure', color: '#9aa3ad', dir: [0, 1, -0.2], spread: 1.3, shell: true,
      boxes: [
        { x: [-445, 445], y: [36, 44], z: [50, 550] },    // back cover
        { x: [-445, 445], y: [16, 44], z: [540, 550] },   // top edge
        { x: [-445, 445], y: [16, 44], z: [50, 60] },     // bottom edge
        { x: [-445, -435], y: [16, 44], z: [50, 550] },   // left edge
        { x: [435, 445], y: [16, 44], z: [50, 550] }      // right edge
      ] }
  ]
});
