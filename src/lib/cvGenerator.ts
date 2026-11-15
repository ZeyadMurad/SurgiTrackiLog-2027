import jsPDF from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import type { CvData, CvTemplateConfig } from '../types/newTypes';
import { CV_COLOR_SCHEMES, CV_SECTION_LABELS } from './cvTemplates';

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function safeFileName(name: string, ext: string): string {
  const base = (name || 'Surgeon_CV').replace(/[^a-zA-Z0-9\u0600-\u06FF_-]+/g, '_');
  return `SurgiTrack_${base}_CV.${ext}`;
}

export function exportCVAsPDF(cvData: CvData, template: CvTemplateConfig): void {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = Math.max(36, (template.pageMargins?.left || 0.65) * 72);
  const contentWidth = pageWidth - marginX * 2;

  const colors = CV_COLOR_SCHEMES[cvData.colorScheme] || CV_COLOR_SCHEMES.navy;
  const primaryRgb = hexToRgb(colors.primary);
  const secondaryRgb = hexToRgb(colors.secondary);

  let y = 42;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 44) {
      doc.addPage();
      y = 44;
    }
  };

  // Header
  if (template.useColorAccent) {
    doc.setFillColor(...primaryRgb);
    doc.rect(0, 0, pageWidth, 92, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(cvData.fullName || 'Surgeon Curriculum Vitae', marginX, 38);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    if (cvData.title) {
      doc.text(cvData.title, marginX, 56);
    }

    const contactLine = [cvData.email, cvData.phone, cvData.country, cvData.address]
      .filter(Boolean)
      .join('  |  ');
    doc.setFontSize(9);
    if (contactLine) {
      doc.text(contactLine, marginX, 74, { maxWidth: contentWidth });
    }
    y = 114;
  } else {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(cvData.fullName || 'Surgeon Curriculum Vitae', marginX, y);
    y += 18;

    if (cvData.title) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text(cvData.title, marginX, y);
      y += 14;
    }

    const contactLine = [cvData.email, cvData.phone, cvData.country, cvData.address]
      .filter(Boolean)
      .join('  |  ');
    if (contactLine) {
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(contactLine, marginX, y, { maxWidth: contentWidth });
      y += 12;
    }
    doc.setDrawColor(...secondaryRgb);
    doc.setLineWidth(1.5);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 18;
  }

  const drawSectionHeading = (label: string) => {
    ensureSpace(36);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(...(template.useColorAccent ? primaryRgb : ([15, 23, 42] as [number, number, number])));
    doc.text(label.toUpperCase(), marginX, y);
    y += 5;
    doc.setDrawColor(...secondaryRgb);
    doc.setLineWidth(1);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 14;
  };

  const drawWrapped = (text: string, size = 9.5, color: [number, number, number] = [51, 65, 85], bold = false) => {
    if (!text) return;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * (size + 3) + 4);
    doc.text(lines, marginX, y);
    y += lines.length * (size + 3) + 4;
  };

  for (const sectionKey of template.sections.filter(s => s !== 'header')) {
    const label =
      CV_SECTION_LABELS[sectionKey]?.[cvData.language] ||
      CV_SECTION_LABELS[sectionKey]?.en ||
      sectionKey;

    if (sectionKey === 'professional_summary' && cvData.professionalSummary) {
      drawSectionHeading(label);
      drawWrapped(cvData.professionalSummary);
      y += 4;
    } else if (sectionKey === 'clinical_experience' && cvData.clinicalExperience) {
      drawSectionHeading(label);
      const ce = cvData.clinicalExperience;
      drawWrapped(
        `Total Documented Procedures: ${ce.totalProcedures} (Verified: ${ce.verifiedProcedures})  |  Total Training Hours: ${Math.round(ce.totalHours)}h (Verified: ${Math.round(ce.verifiedHours)}h)`,
        9.5,
        [15, 23, 42],
        true
      );
      if (ce.topProcedures.length > 0) {
        const procSummary = ce.topProcedures.map(p => `${p.name} (${p.count})`).join(', ');
        drawWrapped(`Key Procedures: ${procSummary}`);
      }
      y += 4;
    } else if (sectionKey === 'experience' && cvData.experience.length > 0) {
      drawSectionHeading(label);
      for (const exp of cvData.experience) {
        drawWrapped(`${exp.position} — ${exp.hospital}${exp.location ? ', ' + exp.location : ''}`, 10, [15, 23, 42], true);
        drawWrapped(`${exp.startDate} – ${exp.endDate}${exp.supervisor ? '  |  Supervisor: ' + exp.supervisor : ''}`, 8.5, [100, 116, 139]);
        if (exp.description) drawWrapped(exp.description);
        y += 2;
      }
    } else if (sectionKey === 'education' && cvData.education.length > 0) {
      drawSectionHeading(label);
      for (const edu of cvData.education) {
        drawWrapped(`${edu.degree}${edu.field ? ' — ' + edu.field : ''}`, 10, [15, 23, 42], true);
        drawWrapped(`${edu.institution}${edu.location ? ', ' + edu.location : ''} (${edu.startDate} – ${edu.endDate})`, 9, [71, 85, 105]);
      }
    } else if (sectionKey === 'skills_matrix' && cvData.skillsMatrix && cvData.skillsMatrix.length > 0) {
      drawSectionHeading(label);
      const lines = cvData.skillsMatrix.map(
        s => `• ${s.skillName}: ${s.exposureLevel} (${s.competencyStatus})`
      );
      for (const line of lines) {
        drawWrapped(line, 9);
      }
    } else if (sectionKey === 'certifications' && cvData.certifications.length > 0) {
      drawSectionHeading(label);
      for (const cert of cvData.certifications) {
        drawWrapped(`• ${cert.name} — ${cert.issuingBody} (${cert.issueDate})`, 9.5);
      }
    } else if (sectionKey === 'publications' && cvData.publications.length > 0) {
      drawSectionHeading(label);
      for (const pub of cvData.publications) {
        drawWrapped(
          `• ${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}.${pub.doi ? ' DOI: ' + pub.doi : ''}`,
          9
        );
      }
    } else if (sectionKey === 'awards' && cvData.awards.length > 0) {
      drawSectionHeading(label);
      for (const aw of cvData.awards) {
        drawWrapped(`• ${aw.title} — ${aw.issuer} (${aw.date})`, 9.5);
      }
    } else if (sectionKey === 'languages' && cvData.languages.length > 0) {
      drawSectionHeading(label);
      drawWrapped(
        cvData.languages
          .map(l => `${l.language} (${l.proficiency})${l.certification ? ' - ' + l.certification : ''}`)
          .join('  •  '),
        9.5
      );
    } else if (sectionKey === 'memberships' && cvData.memberships.length > 0) {
      drawSectionHeading(label);
      for (const m of cvData.memberships) {
        drawWrapped(`• ${m}`, 9.5);
      }
    } else if (sectionKey === 'references' && cvData.references.length > 0) {
      drawSectionHeading(label);
      for (const r of cvData.references) {
        drawWrapped(`${r.name} — ${r.position}, ${r.institution} (${r.email})`, 9.5);
      }
    }
  }

  doc.save(safeFileName(cvData.fullName, 'pdf'));
}

export async function exportCVAsDOCX(cvData: CvData, template: CvTemplateConfig): Promise<void> {
  const colors = CV_COLOR_SCHEMES[cvData.colorScheme] || CV_COLOR_SCHEMES.navy;
  const primaryHex = colors.primary.replace('#', '');
  const secondaryHex = colors.secondary.replace('#', '');
  const isRtl = cvData.language === 'ar';

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      bidirectional: isRtl,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
      children: [
        new TextRun({
          text: cvData.fullName || 'Surgeon Curriculum Vitae',
          bold: true,
          size: 36,
          color: primaryHex,
        }),
      ],
      spacing: { after: 80 },
    })
  );

  if (cvData.title) {
    children.push(
      new Paragraph({
        bidirectional: isRtl,
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        children: [
          new TextRun({
            text: cvData.title,
            size: 24,
            color: '475569',
          }),
        ],
        spacing: { after: 60 },
      })
    );
  }

  const contactLine = [cvData.email, cvData.phone, cvData.country, cvData.address]
    .filter(Boolean)
    .join('  |  ');
  if (contactLine) {
    children.push(
      new Paragraph({
        bidirectional: isRtl,
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        children: [new TextRun({ text: contactLine, size: 18, color: '64748B' })],
        border: {
          bottom: { color: secondaryHex, size: 12, space: 6, style: BorderStyle.SINGLE },
        },
        spacing: { after: 200 },
      })
    );
  }

  const addSectionHeader = (title: string) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        bidirectional: isRtl,
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        border: {
          bottom: { color: secondaryHex, size: 6, space: 4, style: BorderStyle.SINGLE },
        },
        spacing: { before: 220, after: 100 },
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 24,
            color: primaryHex,
          }),
        ],
      })
    );
  };

  const addBodyLine = (text: string, bold = false) => {
    children.push(
      new Paragraph({
        bidirectional: isRtl,
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { after: 80 },
        children: [new TextRun({ text, bold, size: 20, color: '1E293B' })],
      })
    );
  };

  for (const sectionKey of template.sections.filter(s => s !== 'header')) {
    const label =
      CV_SECTION_LABELS[sectionKey]?.[cvData.language] ||
      CV_SECTION_LABELS[sectionKey]?.en ||
      sectionKey;

    if (sectionKey === 'professional_summary' && cvData.professionalSummary) {
      addSectionHeader(label);
      addBodyLine(cvData.professionalSummary);
    } else if (sectionKey === 'clinical_experience' && cvData.clinicalExperience) {
      addSectionHeader(label);
      const ce = cvData.clinicalExperience;
      addBodyLine(
        `Total Procedures: ${ce.totalProcedures} (Verified: ${ce.verifiedProcedures}) | Total Hours: ${Math.round(ce.totalHours)}h (Verified: ${Math.round(ce.verifiedHours)}h)`,
        true
      );
      if (ce.topProcedures.length > 0) {
        addBodyLine(`Top Procedures: ${ce.topProcedures.map(p => `${p.name} (${p.count})`).join(', ')}`);
      }
    } else if (sectionKey === 'experience' && cvData.experience.length > 0) {
      addSectionHeader(label);
      for (const exp of cvData.experience) {
        addBodyLine(`${exp.position} — ${exp.hospital} (${exp.startDate} – ${exp.endDate})`, true);
        if (exp.description) addBodyLine(exp.description);
      }
    } else if (sectionKey === 'education' && cvData.education.length > 0) {
      addSectionHeader(label);
      for (const edu of cvData.education) {
        addBodyLine(`${edu.degree} — ${edu.field}, ${edu.institution} (${edu.startDate} – ${edu.endDate})`);
      }
    } else if (sectionKey === 'skills_matrix' && cvData.skillsMatrix && cvData.skillsMatrix.length > 0) {
      addSectionHeader(label);
      for (const s of cvData.skillsMatrix) {
        addBodyLine(`• ${s.skillName} — ${s.exposureLevel} (${s.competencyStatus})`);
      }
    } else if (sectionKey === 'certifications' && cvData.certifications.length > 0) {
      addSectionHeader(label);
      for (const cert of cvData.certifications) {
        addBodyLine(`• ${cert.name} — ${cert.issuingBody} (${cert.issueDate})`);
      }
    } else if (sectionKey === 'publications' && cvData.publications.length > 0) {
      addSectionHeader(label);
      for (const pub of cvData.publications) {
        addBodyLine(`• ${pub.authors} (${pub.year}). ${pub.title}. ${pub.journal}.${pub.doi ? ' DOI: ' + pub.doi : ''}`);
      }
    } else if (sectionKey === 'awards' && cvData.awards.length > 0) {
      addSectionHeader(label);
      for (const aw of cvData.awards) {
        addBodyLine(`• ${aw.title} — ${aw.issuer} (${aw.date})`);
      }
    } else if (sectionKey === 'languages' && cvData.languages.length > 0) {
      addSectionHeader(label);
      addBodyLine(
        cvData.languages
          .map(l => `${l.language} (${l.proficiency})${l.certification ? ' - ' + l.certification : ''}`)
          .join(' • ')
      );
    } else if (sectionKey === 'memberships' && cvData.memberships.length > 0) {
      addSectionHeader(label);
      for (const m of cvData.memberships) {
        addBodyLine(`• ${m}`);
      }
    } else if (sectionKey === 'references' && cvData.references.length > 0) {
      addSectionHeader(label);
      for (const r of cvData.references) {
        addBodyLine(`${r.name} — ${r.position}, ${r.institution} (${r.email})`);
      }
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeFileName(cvData.fullName, 'docx');
  a.click();
  URL.revokeObjectURL(url);
}
