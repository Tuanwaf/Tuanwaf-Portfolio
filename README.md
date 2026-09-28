# wafiq.dev — portfolio

Personal portfolio of **Tuan Ahmad Wafiq** — developer, AI trainer and game maker.
Live at **https://tuanwaf.github.io/Tuanwaf-Portfolio/** (installable as a PWA).

Built with Vite, three.js (extruded holographic logo + noise-morphing blobs), GSAP ScrollTrigger/SplitText, and Lenis smooth scroll.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/Tuanwaf-Portfolio/
npm run build      # outputs dist/
npm run preview    # serve the production build (service worker included)
```

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Where things live

- `src/data.js` — all content: projects, training, journey, certs, skills, other builds. Edit this to update the site.
- `index.html` — page layout; `src/style.css` — palette tokens (`:root`) and every section's styles.
- `src/main.js` — rendering, scroll animations, interactions; `src/scene.js` — the three.js background.
- `public/media/` — project preview clips (mp4) and posters; `public/img/` — photos and app icons.
- `scripts/make-assets.py` — regenerates the logo SVG, PWA icons and optimised photos from `scripts/logo_poly.json` (traced from the original logo).
