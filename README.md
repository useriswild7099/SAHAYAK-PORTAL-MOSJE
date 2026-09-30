# MoSJE Sahayak — Multilingual IVR Case Continuity & Support Platform

Ethical, consent-driven multilingual IVR check-in service and caseworker continuity platform for MoSJE victim assistance. Built with React 19, TypeScript, Tailwind CSS, and WebGL Liquid Glass Optics (`dashersw/liquid-glass-js`).

---

## Deploying to Vercel

This repository is pre-configured for one-click deployment to **Vercel**.

### Method 1: Deploy via Vercel Dashboard (GitHub / GitLab / Bitbucket)

1. Push this codebase to your Git repository (e.g., GitHub).
2. Go to [vercel.com/new](https://vercel.com/new) and log in.
3. Import your `mosje-sahayak` repository.
4. Vercel will automatically detect the settings from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your application will be live in seconds with an SSL-enabled `.vercel.app` URL.

### Method 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally if not already installed:
   ```bash
   npm i -g vercel
   ```
2. In the project root directory, run:
   ```bash
   vercel
   ```
3. Follow the interactive prompts (select default options).
4. For production deployment:
   ```bash
   vercel --prod
   ```

---

## Production Features Configured for Vercel

- **Single Page Application (SPA) Deep Link Routing**: `vercel.json` provides rewrite rules ensuring that direct links and refreshes route to `index.html` without 404s.
- **Optimized Caching Headers**: Static bundle chunks in `/assets/` are served with `Cache-Control: public, max-age=31536000, immutable` for lightning-fast edge delivery.
- **Security Headers**: Standard headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`) are configured in `vercel.json`.
- **Vendor Chunk Splitting**: Configured in `vite.config.ts` to separate core libraries for optimized caching and fast initial loads.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting check
npm run lint

# Build for production
npm run build
```
