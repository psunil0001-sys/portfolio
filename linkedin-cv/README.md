# CV helper

Builds a resume from `resume_seed.json`, an optional LinkedIn **Save to PDF** in `inbox/`, and live GitHub repos. Layout: [`resume_template.tex`](resume_template.tex).

This folder lives **inside the portfolio repo**. Site docs: [`../README.md`](../README.md).

Does **not** log into LinkedIn or scrape HTML.

## From the portfolio root (preferred)

```bash
npm run refresh
```

## From this folder

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

python linkedin_cv.py --no-open
```

`--no-open` uses `inbox/*.pdf` if present, otherwise the seed. It does not open a browser.

## Flags

| Flag | Meaning |
|------|---------|
| `--no-open` | No browser; inbox PDF or seed |
| `--pdf PATH` | Explicit LinkedIn export |
| `--seed-only` | Ignore inbox/PDF |
| `--watch` | Wait for a new PDF in `~/Downloads` |
| `--skip-github` | Do not fetch repos |

## Outputs

- `out/cv.tex`, `out/Sunilkumar_Pathipati_CV.pdf`
- `../public/live.json` and `../public/Sunilkumar_Pathipati_CV.pdf` for the website

## LinkedIn inbox

Copy **Save to PDF** to `inbox/Profile.pdf`, then `npm run refresh` or push to `main` so Actions rebuilds the CV and site.
