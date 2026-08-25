"""Pure-Python PDF fallback when pdflatex/tectonic are not installed."""

from __future__ import annotations

from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Table,
    TableStyle,
)

INK = colors.HexColor("#0B0F14")
TEAL = colors.HexColor("#1AA38C")
MUTED = colors.HexColor("#4A5560")


def render_pdf(data: dict, out_path: Path) -> Path:
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Name", fontName="Times-Bold", fontSize=20, textColor=INK, leading=24, spaceAfter=2))
    styles.add(ParagraphStyle(name="Headline", fontName="Times-Roman", fontSize=11, textColor=TEAL, leading=14, spaceAfter=6))
    styles.add(ParagraphStyle(name="Meta", fontName="Times-Roman", fontSize=8.5, textColor=MUTED, leading=12, spaceAfter=8))
    styles.add(ParagraphStyle(name="Section", fontName="Times-Bold", fontSize=10.5, textColor=INK, leading=13, spaceBefore=8, spaceAfter=4))
    styles.add(ParagraphStyle(name="Body", fontName="Times-Roman", fontSize=9.2, textColor=INK, leading=12, alignment=TA_JUSTIFY, spaceAfter=4))
    styles.add(ParagraphStyle(name="Role", fontName="Times-Bold", fontSize=10, textColor=INK, leading=13))
    styles.add(ParagraphStyle(name="Company", fontName="Times-Roman", fontSize=9.2, textColor=TEAL, leading=12))
    styles.add(ParagraphStyle(name="Dates", fontName="Times-Italic", fontSize=8.5, textColor=MUTED, leading=11, alignment=TA_RIGHT))
    styles.add(ParagraphStyle(name="CvBullet", fontName="Times-Roman", fontSize=9, textColor=INK, leading=12))
    styles.add(ParagraphStyle(name="Skill", fontName="Times-Roman", fontSize=9, textColor=INK, leading=12, spaceAfter=2))

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=14 * mm,
        bottomMargin=14 * mm,
    )
    story = []
    story.append(Paragraph(xml_escape(data["name"]), styles["Name"]))
    story.append(Paragraph(xml_escape(f'{data["title"]}  |  {data["headline"]}'), styles["Headline"]))
    contact = "  ·  ".join(
        [
            xml_escape(data["location"]),
            xml_escape(data["email"]),
            xml_escape(data["phone"]),
            xml_escape(data["linkedin"]),
            xml_escape(data["github"]),
        ]
    )
    story.append(Paragraph(contact, styles["Meta"]))
    story.append(Paragraph("PROFESSIONAL SUMMARY", styles["Section"]))
    story.append(Paragraph(xml_escape(data["summary"]), styles["Body"]))
    story.append(Paragraph("TECHNICAL SKILLS", styles["Section"]))
    for group in data["skill_groups"]:
        skills = ", ".join(xml_escape(item) for item in group.get("skills") or group.get("items") or [])
        story.append(Paragraph(f"<b>{xml_escape(group['label'])}:</b> {skills}", styles["Skill"]))
    story.append(
        Paragraph(
            f"<b>Languages:</b> {', '.join(xml_escape(item) for item in data['spoken_languages'])}",
            styles["Skill"],
        )
    )
    story.append(Paragraph("PROFESSIONAL EXPERIENCE", styles["Section"]))
    for job in data["experience"]:
        company = job["company"]
        if job.get("client"):
            company += f"  (Client: {job['client']})"
        table = Table(
            [
                [Paragraph(xml_escape(job["role"]), styles["Role"]), Paragraph(xml_escape(job["period"]), styles["Dates"])],
                [Paragraph(xml_escape(company), styles["Company"]), Paragraph(xml_escape(job["location"]), styles["Dates"])],
            ],
            colWidths=[125 * mm, 50 * mm],
        )
        table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
        story.append(table)
        items = [ListItem(Paragraph(xml_escape(bullet), styles["CvBullet"]), leftIndent=8) for bullet in job["bullets"]]
        story.append(ListFlowable(items, bulletType="bullet", leftIndent=12, bulletFontSize=7, spaceBefore=2, spaceAfter=6))
    if data.get("projects"):
        story.append(Paragraph("PROJECTS", styles["Section"]))
        for project in data["projects"]:
            table = Table(
                [
                    [
                        Paragraph(xml_escape(project["title"]), styles["Role"]),
                        Paragraph("Freelance", styles["Dates"]),
                    ],
                    [
                        Paragraph(xml_escape(project.get("stack") or "Project"), styles["Company"]),
                        Paragraph(xml_escape(project.get("url") or ""), styles["Dates"]),
                    ],
                ],
                colWidths=[125 * mm, 50 * mm],
            )
            table.setStyle(
                TableStyle(
                    [
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 0),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ]
                )
            )
            story.append(table)
            story.append(
                ListFlowable(
                    [ListItem(Paragraph(xml_escape(project["blurb"]), styles["CvBullet"]), leftIndent=8)],
                    bulletType="bullet",
                    leftIndent=12,
                    bulletFontSize=7,
                    spaceBefore=2,
                    spaceAfter=6,
                )
            )
    story.append(Paragraph("EDUCATION", styles["Section"]))
    edu = data["education"]
    table = Table(
        [
            [Paragraph(xml_escape(edu["degree"]), styles["Role"]), Paragraph(xml_escape(edu["period"]), styles["Dates"])],
            [Paragraph(xml_escape(edu["school"]), styles["Company"]), Paragraph(xml_escape(edu["location"]), styles["Dates"])],
        ],
        colWidths=[125 * mm, 50 * mm],
    )
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0)]))
    story.append(table)
    story.append(Paragraph("CERTIFICATIONS", styles["Section"]))
    certs = [ListItem(Paragraph(xml_escape(item), styles["CvBullet"]), leftIndent=8) for item in data["certifications"]]
    story.append(ListFlowable(certs, bulletType="bullet", leftIndent=12, bulletFontSize=7))
    doc.build(story)
    return out_path
