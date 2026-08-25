# Sunilkumar Pathipati — Portfolio

Recruiter site plus a CV builder. One GitHub repo, one refresh command, GitHub Actions rebuilds the resume and deploys the site.

**Live site:** https://psunil0001-sys.github.io/portfolio/

This does **not** log into LinkedIn. Export **Save to PDF** yourself, then drop it in `linkedin-cv/inbox/`.

---

## How it fits together

```
linkedin-cv/inbox/Profile.pdf   (optional LinkedIn export)
linkedin-cv/resume_seed.json    (baseline profile)
GitHub API (psunil0001-sys)
        │
        ▼
npm run refresh   →  public/live.json + public/Sunilkumar_Pathipati_CV.pdf
        │
        ▼
git push / Actions  →  GitHub Pages
```

The resume the site serves is always the one built from LinkedIn data plus live GitHub repos.

---

## One-time setup

```bash
cd /home/sunny/Resume/portfolio
npm install
```

Python venv is created automatically by `npm run refresh`. Optional nicer PDF typesetting:

```bash
sudo apt install texlive-latex-recommended texlive-latex-extra latexmk
```

Without TeX, a ReportLab PDF is still generated.

---

## Commands

| Command | Result |
|---------|--------|
| `npm run refresh` | CV from inbox PDF (or seed) + GitHub projects; updates site `live.json` and the resume PDF |
| `npm run dev` | Local site at http://127.0.0.1:5173/ |
| `npm run build` | Production build |
| `npm run lint` | oxlint |

---

## After LinkedIn changes

1. LinkedIn → **Resources / More → Save to PDF**
2. Copy to `linkedin-cv/inbox/Profile.pdf`
3. `npm run refresh`
4. Commit and push `main` (include the inbox PDF if you want CI to use it)

Or skip the local refresh: commit the PDF and push; Actions runs `linkedin_cv.py --no-open` and deploys.

Re-run without a new commit: **Actions → Deploy GitHub Pages → Run workflow**.

---

## GitHub Actions

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

1. Install Python deps
2. Build the CV (`--no-open` → inbox PDF or seed)
3. `npm ci` + `GITHUB_PAGES=true` build
4. Deploy Pages

**Settings → Pages → Source: GitHub Actions.**

---

## Layout

```
portfolio/                      git root
  linkedin-cv/
    inbox/                      drop LinkedIn PDFs here
    linkedin_cv.py
    pdf_fallback.py
    resume_seed.json
    resume_template.tex(.j2)
  public/
    live.json
    Sunilkumar_Pathipati_CV.pdf
  src/
    components/fx/              motion primitives
  .github/workflows/deploy.yml
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Resume on the site is stale | `npm run refresh`, commit `public/` (or inbox PDF) and push |
| Projects look out of date | They come live from the GitHub API at page load; hard-refresh the browser |
| 404 on Pages | URL must include `/portfolio/`; wait for a green deploy |
