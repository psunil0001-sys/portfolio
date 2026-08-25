# Sunilkumar Pathipati — Portfolio

Recruiter-facing site built from resume data and public GitHub projects.

Live URL (after GitHub Pages is enabled):

https://psunil0001-sys.github.io/portfolio/

## Local

```bash
npm install
npm run dev
```

Open the URL Vite prints. Because this project is configured for GitHub Pages, the app is served at `/portfolio/` (for example `http://localhost:5173/portfolio/`).

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages (free)

1. Create a public repository named `portfolio` under `psunil0001-sys`.
2. Push this project to `main`.
3. In the repo: **Settings → Pages → Source: GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

The shareable recruiter link is then:

`https://psunil0001-sys.github.io/portfolio/`
