# Vendored files

Both files below are the legacy, non-module ("global") builds: the last three.js
release that still shipped a plain `<script src>` build and a matching non-module
`OrbitControls.js`, chosen specifically so `file://` keeps working with no local
server, no bundler and no build step, matching the rest of this repo.

| File | Source | Version | License |
|---|---|---|---|
| `three.min.js` | https://unpkg.com/three@0.147.0/build/three.min.js | r147 | MIT |
| `OrbitControls.js` | https://unpkg.com/three@0.147.0/examples/js/controls/OrbitControls.js | r147 | MIT |

Unmodified apart from being saved to disk. Do not run these through a bundler or
convert them to ES modules, that reintroduces the `file://` CORS restriction on
`type="module"` scripts in Chromium browsers that this specific build avoids.

To upgrade: three.js dropped this non-module build style after r147. There is no
newer drop-in replacement without either adopting ES modules (breaks `file://`)
or introducing a bundler (a bigger architectural change than vendoring a static
file). Re-evaluate before bumping past r147.
