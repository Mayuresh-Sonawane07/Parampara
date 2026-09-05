# WebAR Implementation & Target Descriptor Guide

Project: **PARAMPARA AR LITE**
Tradition: **Warli Painting (Maharashtra)** • Flagship Experience

---

## 1. WebAR Architecture

Parampara AR Lite uses an open-source, zero-cost WebAR pipeline:
- **No paid SDKs**: No 8th Wall, no Unity cloud services, no proprietary licensing.
- **Client-Side Processing**: Operates entirely in modern mobile and desktop browsers via standard `navigator.mediaDevices.getUserMedia` and WebGL.
- **Privacy First**: Video streams are analyzed locally and never transmitted to external servers.

---

## 2. Target Artwork Specifications

The Warli AR Target image is located at:
`/ar-assets/warli-target.jpg`

- **Dimensions**: 1200 x 1200 px (300 DPI equivalent)
- **Contrast**: High-contrast white rice pigment (#FBFBF9) over rich terracotta ochre (#832B1E)
- **Feature Density**: Features over 40 spiral dancers, geometric chevron borders, fine branch foliage, and diamond grid lines that provide high feature point density for stable camera recognition.

---

## 3. AR.js Natural Feature Tracking (NFT) Descriptors

In AR.js, NFT replaces traditional black-and-white fiducial markers by tracking natural visual gradients across multiple image resolutions (pyramids).

Generated files located in `/ar-assets/`:
- `warli-target.iset`: Image set pyramid storing downscaled versions for multi-distance recognition.
- `warli-target.fset`: Tracking feature coordinate points.
- `warli-target.fset3`: Fast initialization feature points for instant acquisition.

### How to Regenerate or Train New Target Descriptors:
1. Ensure the artwork image is at least 1000px wide, uncompressed, with high sharp contrast.
2. Run the NFT Marker Creator CLI tool:
   ```bash
   npx @kalwalt/nft-marker-creator ar-assets/warli-target.jpg
   ```
3. The generator outputs `.fset`, `.fset3`, and `.iset` files sharing the base name prefix.
4. Reference the prefix in the A-Frame / AR.js `<a-nft>` tag:
   ```html
   <a-nft type="nft" url="/ar-assets/warli-target" smooth="true">
     <!-- 3D or 2D Hotspot Entities -->
   </a-nft>
   ```

---

## 4. Interactive Hotspots

Hotspot positions are normalized percentages `(x, y)` from 0 to 100 on the artwork:
1. **The Tarpa Spiral Dance**: `(50.0, 52.0)` — Spiral dancers moving counter-clockwise around the tarpa wind player.
2. **Mother Goddess Palaghata**: `(28.0, 25.0)` — Enclosed in the sacred Lagna chauk wedding square.
3. **Sacred Tree of Life**: `(78.0, 30.0)` — Branching Mahua tree sheltering peacocks, bees, and squirrels.
4. **Agricultural Cultivation**: `(50.0, 82.0)` — Farmers plowing with bullocks and women pounding grain.

---

## 5. Graceful Fallback Protocol

If camera permissions are denied, the browser is unsupported, or device tracking encounters hardware constraints:
1. Parampara automatically detects the failure and presents:
   `"AR is unavailable on this device."`
2. Users can immediately launch the **Interactive Digital Experience**.
3. The fallback provides the identical high-resolution Warli canvas, interactive pulsating hotspot pins, modal information cards, speech synthesis narration, and quiz access.
