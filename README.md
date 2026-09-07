# Sunilkumar Pathipati — Portfolio

Recruiter site plus a CV builder. One GitHub repo, one refresh command, GitHub Actions rebuilds the generated CV artifact and deploys the site.

**Live site:** https://psunil0001-sys.github.io/portfolio/

This does **not** log into LinkedIn. Export **Save to PDF** yourself, then drop it in `linkedin-cv/inbox/`.

---

## How it fits together

```
linkedin-cv/inbox/Profile.pdf   (optional LinkedIn export)
linkedin-cv/resume_seed.json    (baseline profile + curated projects)
        │
        ▼
npm run refresh   →  public/live.json + public/Sunilkumar_Pathipati_CV.pdf
                     (does not replace the recruiter resume PDF)
        │
        ▼
git push / Actions  →  GitHub Pages
```

Recruiter **Download resume** links serve `public/Sunilkumar_Pathipati_Resume.pdf` (the full resume). The pipeline writes a separate generated artifact, `Sunilkumar_Pathipati_CV.pdf`, and must not point `resumeFile` at that stub.

Project cards come from curated `src/data/projects.ts` (LLM JUnit4 featured). Refresh/CI uses `--skip-github` so a live GitHub repo list does not overwrite that allowlist.

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

Without TeX, a ReportLab PDF is still generated as the CV artifact.

---

## Commands

| Command | Result |
|---------|--------|
| `npm run refresh` | CV from inbox PDF (or seed); updates `live.json` without replacing curated projects or the full resume |
| `npm run dev` | Local site at http://127.0.0.1:5173/ |
| `npm run build` | Production build |
| `npm run lint` | oxlint |

---

## After LinkedIn changes

1. LinkedIn → **Resources / More → Save to PDF**
2. Copy to `linkedin-cv/inbox/Profile.pdf`
3. `npm run refresh`
4. Commit and push `main` (include the inbox PDF if you want CI to use it)

Or skip the local refresh: commit the PDF and push; Actions runs `linkedin_cv.py --no-open --skip-github` and deploys.

Re-run without a new commit: **Actions → Deploy GitHub Pages → Run workflow**.

---

## GitHub Actions

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

1. Install Python deps
2. Build the CV (`--no-open --skip-github` → inbox PDF or seed, curated projects)
3. `npm ci` + `npm run lint` + `GITHUB_PAGES=true` build
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
    Sunilkumar_Pathipati_Resume.pdf   recruiter download
    Sunilkumar_Pathipati_CV.pdf       generated CV artifact
  src/
    data/projects.ts            curated project cards
    components/fx/              motion primitives
  .github/workflows/deploy.yml
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Resume on the site is stale | Replace `public/Sunilkumar_Pathipati_Resume.pdf`, commit, and push. Do not copy the generated CV over it. |
| Project blurbs look wrong | Edit `src/data/projects.ts` and the matching entries in `linkedin-cv/resume_seed.json`. |
| 404 on Pages | URL must include `/portfolio/`; wait for a green deploy |
