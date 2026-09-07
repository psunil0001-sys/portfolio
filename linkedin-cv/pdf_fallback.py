"""Pure-Python PDF fallback when pdflatex/tectonic are not installed.

ATS-oriented: selectable Times text, single column, standard headings, no images.
"""

from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import ListFlowable, ListItem, Paragraph, SimpleDocTemplate, Spacer

INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#333333")


def _href(url: str, label: str | None = None) -> str:
    href = url if url.startswith(("http://", "https://", "mailto:")) else f"https://{url}"
    safe_url = xml_escape(href, {'"': "&quot;"})
    text = xml_escape(label or url)
    return f'<link href="{safe_url}">{text}</link>'


def render_pdf(data: dict, out_path: Path) -> Path:
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Name", fontName="Times-Bold", fontSize=18, textColor=INK, leading=22, spaceAfter=4, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="Headline", fontName="Times-Roman", fontSize=11, textColor=INK, leading=14, spaceAfter=2, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="Meta", fontName="Times-Roman", fontSize=9, textColor=MUTED, leading=12, spaceAfter=8, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="Section", fontName="Times-Bold", fontSize=12, textColor=INK, leading=15, spaceBefore=10, spaceAfter=4, alignment=TA_LEFT, borderPadding=0))
    styles.add(ParagraphStyle(name="Body", fontName="Times-Roman", fontSize=10, textColor=INK, leading=13, alignment=TA_LEFT, spaceAfter=4))
    styles.add(ParagraphStyle(name="Role", fontName="Times-Bold", fontSize=11, textColor=INK, leading=14, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="Sub", fontName="Times-Roman", fontSize=9.5, textColor=MUTED, leading=12, alignment=TA_LEFT, spaceAfter=2))
    styles.add(ParagraphStyle(name="CvBullet", fontName="Times-Roman", fontSize=10, textColor=INK, leading=13, alignment=TA_LEFT))
    styles.add(ParagraphStyle(name="Skill", fontName="Times-Roman", fontSize=10, textColor=INK, leading=13, spaceAfter=1, alignment=TA_LEFT))

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title=f'{data["name"]} - Resume',
        author=data["name"],
    )
    story = []
    story.append(Paragraph(xml_escape(data["name"]), styles["Name"]))
    story.append(Paragraph(xml_escape(f'{data["title"]}  |  {data["headline"]}'), styles["Headline"]))
    linkedin = data.get("linkedin") or ""
    github = data.get("github") or ""
    contact = "  |  ".join(
        [
            xml_escape(data["location"]),
            _href(f'mailto:{data["email"]}', data["email"]),
            xml_escape(data["phone"]),
            _href(linkedin, linkedin),
            _href(github, github),
        ]
    )
    story.append(Paragraph(contact, styles["Meta"]))

    story.append(Paragraph("Professional Summary", styles["Section"]))
    story.append(Paragraph(xml_escape(data["summary"]), styles["Body"]))

    story.append(Paragraph("Technical Skills", styles["Section"]))
    skill_items = []
    for group in data["skill_groups"]:
        skills = ", ".join(xml_escape(item) for item in group.get("skills") or group.get("items") or [])
        skill_items.append(ListItem(Paragraph(f"<b>{xml_escape(group['label'])}:</b> {skills}", styles["Skill"]), leftIndent=8))
    skill_items.append(
        ListItem(
            Paragraph(
                f"<b>Spoken languages:</b> {', '.join(xml_escape(item) for item in data['spoken_languages'])}",
                styles["Skill"],
            ),
            leftIndent=8,
        )
    )
    story.append(ListFlowable(skill_items, bulletType="bullet", leftIndent=12, bulletFontSize=8, spaceAfter=4))

    story.append(Paragraph("Professional Experience", styles["Section"]))
    for job in data["experience"]:
        company = job["company"]
        if job.get("client"):
            company += f" (Client: {job['client']})"
        story.append(Paragraph(xml_escape(job["role"]), styles["Role"]))
        story.append(
            Paragraph(
                xml_escape(f'{company}  |  {job["location"]}  |  {job["period"]}'),
                styles["Sub"],
            )
        )
        items = [ListItem(Paragraph(xml_escape(bullet), styles["CvBullet"]), leftIndent=8) for bullet in job["bullets"]]
        story.append(ListFlowable(items, bulletType="bullet", leftIndent=12, bulletFontSize=8, spaceBefore=1, spaceAfter=6))

    if data.get("projects"):
        story.append(Paragraph("Projects", styles["Section"]))
        for project in data["projects"]:
            kind = "Freelance" if project.get("freelance") else "Project"
            story.append(
                Paragraph(
                    xml_escape(f'{project["title"]}  |  {project.get("stack") or "Project"}  |  {kind}'),
                    styles["Role"],
                )
            )
            url = project.get("url") or ""
            if url:
                story.append(Paragraph(_href(url), styles["Sub"]))
            story.append(Paragraph(xml_escape(project["blurb"]), styles["Body"]))
            story.append(Spacer(1, 4))

    story.append(Paragraph("Education", styles["Section"]))
    edu = data["education"]
    story.append(Paragraph(xml_escape(edu["degree"]), styles["Role"]))
    story.append(
        Paragraph(
            xml_escape(f'{edu["school"]}  |  {edu["location"]}  |  {edu["period"]}'),
            styles["Sub"],
        )
    )

    story.append(Paragraph("Certifications", styles["Section"]))
    certs = [ListItem(Paragraph(xml_escape(item), styles["CvBullet"]), leftIndent=8) for item in data["certifications"]]
    story.append(ListFlowable(certs, bulletType="bullet", leftIndent=12, bulletFontSize=8))

    doc.build(story)
    return out_path
