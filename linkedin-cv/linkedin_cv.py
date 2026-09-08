#!/usr/bin/env python3
"""Build a LaTeX CV from an official LinkedIn 'Save to PDF' export.

This does not log in to LinkedIn or scrape HTML. Export the PDF yourself
(Profile → Resources / More → Save to PDF), then pass it here.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser
from copy import deepcopy
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent
SEED_PATH = ROOT / "resume_seed.json"
OUT_DIR = ROOT / "out"
INBOX_DIR = ROOT / "inbox"
SITE_DIR = ROOT.parent
GITHUB_USER = "psunil0001-sys"
LINKEDIN_URL = "https://www.linkedin.com/in/sunilkumar-pathipati-206098bb"
# Recruiter downloads use the generated ATS resume (same file as the pipeline PDF).
SITE_RESUME_FILE = "Sunilkumar_Pathipati_Resume.pdf"
GENERATED_CV_FILE = "Sunilkumar_Pathipati_CV.pdf"

LATEX_MAP = {
    "\\": r"\textbackslash{}",
    "&": r"\&",
    "%": r"\%",
    "$": r"\$",
    "#": r"\#",
    "_": r"\_",
    "{": r"\{",
    "}": r"\}",
    "~": r"\textasciitilde{}",
    "^": r"\textasciicircum{}",
}


def latex_escape(value: str) -> str:
    return "".join(LATEX_MAP.get(ch, ch) for ch in value)


def escape_tree(node):
    if isinstance(node, str):
        return latex_escape(node)
    if isinstance(node, list):
        return [escape_tree(item) for item in node]
    if isinstance(node, dict):
        return {key: escape_tree(val) for key, val in node.items()}
    return node


def github_headers() -> dict[str, str]:
    headers = {
        "User-Agent": "sunilkumar-portfolio-sync",
        "Accept": "application/vnd.github+json",
    }
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


def github_get(url: str, *, raw: bool = False) -> tuple[str, str | None]:
    headers = {"User-Agent": "sunilkumar-portfolio-sync"} if raw else github_headers()
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=20) as response:
        body = response.read().decode("utf-8", errors="replace")
        return body, response.headers.get("Link")


def next_github_url(link_header: str | None) -> str | None:
    if not link_header:
        return None
    for part in link_header.split(","):
        section = part.strip()
        if 'rel="next"' in section:
            start = section.find("<")
            end = section.find(">")
            if start >= 0 and end > start:
                return section[start + 1 : end]
    return None


def title_from_repo(name: str) -> str:
    if "-" in name and any(ch.isupper() for ch in name):
        return name.replace("-", " ")
    return " ".join(part[:1].upper() + part[1:] for part in re.split(r"[-_]", name) if part)


BOILERPLATE_LINE = re.compile(
    r"^(welcome to\b|this project was generated\b|your astro project\b|"
    r"this readme describes\b|getting started\b|prerequisites\b|"
    r"the astronomer cli\b|to report a bug\b|built with\b|powered by\b|"
    r"this command will spin up\b|note:\s+if you already have\b|"
    r"for more on how this dag\b|start airflow on your local\b|"
    r"a modern flutter-based\b)",
    re.I,
)


def is_boilerplate_text(plain: str) -> bool:
    compact = re.sub(r"\s+", " ", plain).strip()
    if not compact:
        return True
    if BOILERPLATE_LINE.search(compact):
        return True
    if compact.endswith("!") and compact.lower().startswith("welcome"):
        return True
    return False


def blurb_from_readme(markdown: str, fallback: str) -> str:
    text = re.sub(r"```[\s\S]*?```", "", markdown)
    chunks = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith(("#", "!", "|", ">")):
            continue
        if re.fullmatch(r"[=\-*._\s]+", line):
            continue
        plain = re.sub(r"[*`\[\]]", "", line)
        plain = re.sub(r"\(https?://[^)]+\)", "", plain)
        plain = re.sub(r"^[-*+]\s+", "", plain)
        plain = re.sub(r"\s+", " ", plain).strip()
        if len(plain) <= 40 or is_boilerplate_text(plain):
            continue
        chunks.append(plain)
        if len(" ".join(chunks)) > 220:
            break
    merged = re.sub(r"\s+", " ", " ".join(chunks)).strip()
    if merged and not is_boilerplate_text(merged):
        return merged[:360]
    return fallback


def professional_fallback(title: str, language: str | None) -> str:
    if language:
        return f"{title} — {language} source repository."
    return f"{title} source repository."


def fetch_github_repos() -> list[dict]:
    repos: list[dict] = []
    url = (
        f"https://api.github.com/users/{GITHUB_USER}/repos"
        "?type=owner&sort=pushed&per_page=100"
    )
    while url:
        raw, link = github_get(url)
        page = json.loads(raw)
        if isinstance(page, list):
            repos.extend(page)
        url = next_github_url(link)
    return repos


def fetch_github_projects() -> list[dict]:
    projects = []
    for repo in fetch_github_repos():
        if repo.get("fork") or repo.get("private"):
            continue
        name = repo["name"]
        title = title_from_repo(name)
        branch = repo.get("default_branch") or "main"
        description = (repo.get("description") or "").strip()
        fallback = (
            description
            if description and not is_boilerplate_text(description)
            else professional_fallback(title, repo.get("language"))
        )
        blurb = fallback
        for filename in ("README.md", "Readme.md", "readme.md"):
            try:
                markdown, _ = github_get(
                    f"https://raw.githubusercontent.com/{GITHUB_USER}/{name}/{branch}/{filename}",
                    raw=True,
                )
                blurb = blurb_from_readme(markdown, fallback)
                break
            except urllib.error.HTTPError:
                continue
        tags = list(repo.get("topics") or [])
        language = repo.get("language")
        if language and language not in tags:
            tags.insert(0, language)
        projects.append(
            {
                "slug": name,
                "title": title,
                "featured": False,
                "freelance": False,
                "blurb": blurb,
                "tags": tags[:8],
                "url": repo["html_url"],
                "stack": language or "Project",
            }
        )
    return projects


def project_keys(project: dict) -> set[str]:
    keys: set[str] = set()
    slug = str(project.get("slug") or "").strip()
    if slug:
        lowered = slug.lower()
        keys.add(lowered)
        keys.add(re.sub(r"[-_]", "", lowered))
    url = str(project.get("url") or "")
    match = re.search(r"github\.com/[^/]+/([^/#?]+)", url, re.I)
    if match:
        repo = match.group(1).removesuffix(".git").lower()
        keys.add(repo)
        keys.add(re.sub(r"[-_]", "", repo))
    return {key for key in keys if key}


CURATED_OVERRIDE_FIELDS = ("title", "blurb", "tags", "featured", "freelance", "stack")


def merge_projects(github_projects: list[dict], curated: list[dict]) -> list[dict]:
    """GitHub public non-forks are the catalog; curated presentation fields win on match."""
    unused = list(curated)
    merged: list[dict] = []

    def take_curated(item: dict) -> dict | None:
        keys = project_keys(item)
        for index, candidate in enumerate(unused):
            if keys & project_keys(candidate):
                return unused.pop(index)
        return None

    for repo in github_projects:
        match = take_curated(repo)
        item = dict(repo)
        if match:
            item["slug"] = match.get("slug") or item.get("slug")
            for field in CURATED_OVERRIDE_FIELDS:
                if field in match and match[field] is not None:
                    item[field] = deepcopy(match[field])
            item["featured"] = bool(match.get("featured"))
            if match.get("url"):
                item["url"] = match["url"]
        else:
            item["featured"] = False
        merged.append(item)

    for leftover in unused:
        item = deepcopy(leftover)
        item["featured"] = bool(item.get("featured"))
        merged.append(item)

    curated_index = [(project_keys(item), index) for index, item in enumerate(curated)]

    def rank(project: dict) -> tuple:
        keys = project_keys(project)
        position = len(curated)
        for candidate_keys, index in curated_index:
            if keys & candidate_keys:
                position = index
                break
        return (0 if project.get("featured") else 1, position, str(project.get("title") or "").lower())

    return sorted(merged, key=rank)


def linkedin_handle(data: dict) -> str:
    link = data.get("linkedin", "")
    return link.replace("https://www.", "").replace("https://", "").replace("linkedin.com/in/", "")


def load_seed() -> dict:
    return json.loads(SEED_PATH.read_text(encoding="utf-8"))


def extract_pdf_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    text = "\n".join(pages)
    text = text.replace("\u2022", "-")
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


SECTION_HEADERS = (
    "about",
    "experience",
    "education",
    "licenses & certifications",
    "licenses and certifications",
    "certifications",
    "skills",
    "top skills",
    "languages",
    "honors & awards",
    "volunteer experience",
    "publications",
    "projects",
    "contact",
)


def split_sections(text: str) -> dict[str, str]:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    buckets: dict[str, list[str]] = {"header": []}
    current = "header"
    for line in lines:
        key = line.lower().rstrip(":")
        if key in SECTION_HEADERS:
            current = key
            buckets.setdefault(current, [])
            continue
        buckets.setdefault(current, []).append(line)
    return {name: "\n".join(vals) for name, vals in buckets.items()}


def parse_linkedin(text: str, seed: dict) -> dict:
    overlay = deepcopy(seed)
    sections = split_sections(text)
    header_lines = [line for line in sections.get("header", "").splitlines() if line]
    if header_lines:
        overlay["name"] = header_lines[0]
    if len(header_lines) > 1 and len(header_lines[1]) < 140:
        overlay["headline"] = header_lines[1]
        if "|" in header_lines[1]:
            overlay["title"] = header_lines[1].split("|")[0].strip()
        else:
            overlay["title"] = header_lines[1].split(" at ")[0].strip()
    for line in header_lines[2:6]:
        if re.search(r"india|bengaluru|bangalore|germany", line, re.I):
            overlay["location"] = line
            break

    about = sections.get("about", "").strip()
    if len(about) > 80:
        overlay["summary"] = re.sub(r"\s+", " ", about)

    skills_blob = sections.get("skills", "") or sections.get("top skills", "")
    if skills_blob:
        skills = [item.strip(" ·•-,") for item in re.split(r"[\n,•·]", skills_blob) if item.strip()]
        skills = [item for item in skills if 1 < len(item) < 48][:24]
        if skills:
            overlay["skill_groups"] = [{"label": "LinkedIn", "skills": skills}] + overlay["skill_groups"]

    certs_blob = (
        sections.get("licenses & certifications", "")
        or sections.get("licenses and certifications", "")
        or sections.get("certifications", "")
    )
    if certs_blob:
        certs = [line.strip(" -") for line in certs_blob.splitlines() if 3 < len(line.strip()) < 80]
        if certs:
            overlay["certifications"] = list(dict.fromkeys(certs + overlay["certifications"]))

    langs = sections.get("languages", "")
    if langs:
        spoken = [item.strip() for item in re.split(r"[\n,·•]", langs) if item.strip()]
        spoken = [item.split("(")[0].strip() for item in spoken]
        spoken = [item for item in spoken if item and len(item) < 24]
        if spoken:
            overlay["spoken_languages"] = list(dict.fromkeys(spoken))

    exp_text = sections.get("experience", "")
    parsed_jobs = parse_experience(exp_text)
    if parsed_jobs:
        overlay["experience"] = merge_jobs(overlay["experience"], parsed_jobs)

    edu_text = sections.get("education", "")
    edu = parse_education(edu_text)
    if edu:
        overlay["education"] = {**overlay["education"], **edu}

    return overlay


def parse_experience(blob: str) -> list[dict]:
    if not blob.strip():
        return []
    jobs: list[dict] = []
    blocks = re.split(r"\n(?=[A-Z][^\n]{3,80}\n)", blob)
    date_re = re.compile(
        r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*"
        r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)",
        re.I,
    )
    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if len(lines) < 2:
            continue
        role = lines[0]
        company = lines[1]
        period = ""
        location = ""
        bullets: list[str] = []
        for line in lines[2:]:
            match = date_re.search(line)
            if match and not period:
                period = f"{match.group(1)} -- {match.group(2)}"
                continue
            if re.search(r"india|germany|bengaluru|bangalore|reutlingen", line, re.I) and not location:
                location = line
                continue
            if line.startswith("-") or line.startswith("•"):
                bullets.append(line.lstrip("-• ").strip())
            elif len(line) > 40:
                bullets.append(line)
        if role and company:
            jobs.append(
                {
                    "role": role,
                    "company": company,
                    "period": period or "",
                    "location": location,
                    "client": "",
                    "bullets": bullets or [f"Contributed as {role} at {company}."],
                }
            )
    return jobs[:12]


def merge_jobs(seed_jobs: list[dict], linkedin_jobs: list[dict]) -> list[dict]:
    merged = []
    used = set()
    for li_job in linkedin_jobs:
        match = next(
            (
                seed
                for seed in seed_jobs
                if seed["company"].split(",")[0].lower() in li_job["company"].lower()
                or li_job["company"].split(",")[0].lower() in seed["company"].lower()
            ),
            None,
        )
        if match:
            used.add(id(match))
            merged.append(
                {
                    **match,
                    "role": li_job["role"] or match["role"],
                    "period": li_job["period"] or match["period"],
                    "location": li_job["location"] or match["location"],
                    "bullets": li_job["bullets"] if len(li_job["bullets"]) >= len(match["bullets"]) else match["bullets"],
                }
            )
        else:
            merged.append(li_job)
    for seed in seed_jobs:
        if id(seed) not in used:
            merged.append(seed)
    return merged


def parse_education(blob: str) -> dict:
    if not blob.strip():
        return {}
    lines = [line.strip() for line in blob.splitlines() if line.strip()]
    edu: dict[str, str] = {}
    if lines:
        edu["school"] = lines[0]
    for line in lines[1:]:
        if re.search(r"bachelor|master|b\.tech|btech|m\.tech", line, re.I):
            edu["degree"] = line
        if re.search(r"20\d{2}", line):
            edu["period"] = line.replace("–", "--").replace("-", "--")
        if re.search(r"india|andhra|karnataka", line, re.I):
            edu["location"] = line
    return edu


def newest_pdf(folder: Path) -> Path | None:
    pdfs = list(folder.glob("*.pdf")) + list(folder.glob("*.PDF"))
    if not pdfs:
        return None
    return max(pdfs, key=lambda path: path.stat().st_mtime)


def watch_downloads(timeout: int) -> Path:
    downloads = Path.home() / "Downloads"
    if not downloads.is_dir():
        raise SystemExit(f"Downloads folder not found: {downloads}")
    print(f"Watching {downloads} for a new PDF (timeout {timeout}s)...")
    baseline = {path: path.stat().st_mtime for path in downloads.glob("*.pdf")}
    deadline = time.time() + timeout
    while time.time() < deadline:
        for path in downloads.glob("*.pdf"):
            mtime = path.stat().st_mtime
            if path.name.lower().startswith(".") or path.stat().st_size < 2000:
                continue
            if path not in baseline or mtime > baseline.get(path, 0) + 0.5:
                time.sleep(0.8)
                print(f"Found {path.name}")
                return path
        time.sleep(1)
    raise SystemExit("Timed out waiting for a LinkedIn PDF. Re-run with --pdf /path/to/file.pdf")


def render_tex(data: dict) -> str:
    payload = escape_tree(deepcopy(data))
    payload["linkedin_handle"] = latex_escape(linkedin_handle(data))
    env = Environment(
        loader=FileSystemLoader(str(ROOT)),
        autoescape=select_autoescape(enabled_extensions=()),
        trim_blocks=True,
        lstrip_blocks=True,
        variable_start_string="[[",
        variable_end_string="]]",
        block_start_string="[%",
        block_end_string="%]",
        comment_start_string="{=",
        comment_end_string="=}",
    )
    template = env.get_template("resume_template.tex.j2")
    return template.render(**payload)


def compile_pdf(tex_path: Path) -> Path | None:
    out_pdf = tex_path.with_suffix(".pdf")
    commands = []
    if shutil.which("latexmk"):
        commands.append(["latexmk", "-pdf", "-interaction=nonstopmode", "-halt-on-error", tex_path.name])
    if shutil.which("pdflatex"):
        commands.append(["pdflatex", "-interaction=nonstopmode", "-halt-on-error", tex_path.name])
    if shutil.which("tectonic"):
        commands.append(["tectonic", tex_path.name])
    if not commands:
        return None
    last_error = ""
    for cmd in commands:
        proc = subprocess.run(cmd, cwd=tex_path.parent, capture_output=True, text=True)
        if proc.returncode == 0 and out_pdf.exists():
            if shutil.which("latexmk"):
                subprocess.run(["latexmk", "-c", tex_path.name], cwd=tex_path.parent, capture_output=True)
            return out_pdf
        last_error = (proc.stdout or "")[-2000:] + "\n" + (proc.stderr or "")[-2000:]
    raise SystemExit(f"LaTeX compile failed:\n{last_error}")


def discover_inbox_pdf() -> Path | None:
    INBOX_DIR.mkdir(parents=True, exist_ok=True)
    return newest_pdf(INBOX_DIR)


def write_pdf(data: dict, tex_path: Path, pdf_path: Path) -> Path:
    tex_path.parent.mkdir(parents=True, exist_ok=True)
    tex_path.write_text(render_tex(data), encoding="utf-8")
    print(f"Wrote {tex_path} from resume_template.tex layout")
    compiled = compile_pdf(tex_path)
    if compiled is None:
        from pdf_fallback import render_pdf

        print("No LaTeX compiler found; writing PDF with the Python layout fallback.")
        print("Install texlive (pdflatex/latexmk) or tectonic for the LaTeX typeset version.")
        return render_pdf(data, pdf_path)
    shutil.copy2(compiled, pdf_path)
    return pdf_path


def curated_projects(seed: dict, data: dict) -> list:
    """Curated presentation overrides (title, blurb, tags, featured, freelance, stack)."""
    projects = seed.get("projects")
    if projects:
        return deepcopy(projects)
    return deepcopy(list(data.get("projects") or []))


def publish_site(data: dict, pdf_path: Path) -> None:
    site_public = SITE_DIR / "public"
    if not site_public.is_dir():
        return
    dest_resume = site_public / SITE_RESUME_FILE
    shutil.copy2(pdf_path, dest_resume)
    dest_cv = site_public / GENERATED_CV_FILE
    shutil.copy2(pdf_path, dest_cv)
    payload = dict(data)
    payload["resumeFile"] = SITE_RESUME_FILE
    live_path = site_public / "live.json"
    live_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Updated site data: {live_path}")
    print(f"Published recruiter resume: {dest_resume}")
    print(f"Mirrored generated artifact: {dest_cv}")


def resolve_pdf(
    *,
    pdf: Path | None = None,
    seed_only: bool = False,
    no_open: bool = True,
    watch: bool = False,
    timeout: int = 180,
) -> Path | None:
    if seed_only:
        return None
    if pdf:
        path = pdf.expanduser().resolve()
        if not path.is_file():
            raise SystemExit(f"PDF not found: {path}")
        return path
    inbox = discover_inbox_pdf()
    if inbox:
        print(f"Using LinkedIn export from inbox: {inbox}")
        return inbox
    if no_open and not watch:
        print("No inbox PDF found; compiling from resume_seed.json")
        return None
    if not no_open:
        print("Opening LinkedIn profile. In the browser: Resources / More → Save to PDF.")
        webbrowser.open(LINKEDIN_URL)
    return watch_downloads(timeout)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build a CV PDF from a LinkedIn Save-to-PDF export.")
    parser.add_argument("--pdf", type=Path, help="Path to a LinkedIn-exported PDF")
    parser.add_argument("--watch", action="store_true", help="Wait for a new PDF in ~/Downloads")
    parser.add_argument("--timeout", type=int, default=180, help="Watch timeout in seconds")
    parser.add_argument("--no-open", action="store_true", help="Do not open the LinkedIn profile in a browser")
    parser.add_argument("--seed-only", action="store_true", help="Skip LinkedIn PDF and compile from resume_seed.json")
    parser.add_argument(
        "--skip-github",
        action="store_true",
        help="Do not fetch GitHub repos; use curated seed projects only.",
    )
    parser.add_argument(
        "--github",
        action="store_true",
        help="Fetch public non-fork repos (default) and merge curated overrides into live.json.",
    )
    return parser.parse_args()


def build_base_data(
    *,
    pdf: Path | None = None,
    seed_only: bool = False,
    skip_github: bool = False,
    no_open: bool = True,
    watch: bool = False,
    timeout: int = 180,
) -> dict:
    seed = load_seed()
    pdf_path = resolve_pdf(
        pdf=pdf, seed_only=seed_only, no_open=no_open, watch=watch, timeout=timeout
    )
    data = deepcopy(seed)
    if pdf_path:
        print(f"Reading {pdf_path}")
        data = parse_linkedin(extract_pdf_text(pdf_path), seed)
    curated = curated_projects(seed, data)
    if skip_github:
        print("Skipping GitHub project fetch; using curated projects from resume_seed.json")
        data["projects"] = curated
        return data
    try:
        github_projects = fetch_github_projects()
        data["projects"] = merge_projects(github_projects, curated)
        print(f"Loaded {len(github_projects)} GitHub repos; published {len(data['projects'])} projects")
    except Exception as exc:
        print(f"GitHub fetch failed ({exc}); keeping curated projects")
        data["projects"] = curated
    return data


def main() -> int:
    args = parse_args()
    data = build_base_data(
        pdf=args.pdf,
        seed_only=args.seed_only,
        skip_github=args.skip_github,
        no_open=args.no_open,
        watch=args.watch,
        timeout=args.timeout,
    )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    named = OUT_DIR / SITE_RESUME_FILE
    pdf_path = write_pdf(data, OUT_DIR / "cv.tex", named)
    print(f"CV ready: {pdf_path}")
    publish_site(data, pdf_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
