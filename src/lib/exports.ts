import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Supervisor, TrainingRecord, UserProfile, UserSkill, TrainingSession, ClinicalCase } from '../types';

export interface ExportDataPayload {
  trainee: UserProfile;
  supervisor: Supervisor;
  records: TrainingRecord[];
  sessions: TrainingSession[];
  skills: UserSkill[];
}

/**
 * 1. Professional Multi-Sheet Excel Export (.xlsx)
 * Strictly conforms to Section 11 of the Master Specification
 */
export interface SupervisorPortfolioPayload {
  trainee: UserProfile;
  supervisor: Supervisor;
  cases: ClinicalCase[];
  records: TrainingRecord[];
  sessions: TrainingSession[];
  skills: UserSkill[];
}

/**
 * 1. Professional Multi-Sheet Excel Export (.xlsx) for Specific Supervisor
 */
export function exportSupervisorExcel(payload: Partial<SupervisorPortfolioPayload> & ExportDataPayload) {
  const { trainee, supervisor, records, sessions = [], skills = [], cases = [] } = payload;
  const wb = XLSX.utils.book_new();

  // Calculate training metrics
  const sortedDates = records.map(r => r.trainingDate).filter(Boolean).sort();
  const startDate = sortedDates[0] || 'N/A';
  const endDate = sortedDates[sortedDates.length - 1] || 'N/A';
  const opHours = records.reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0) +
                  sessions.reduce((sum, s) => sum + (Number(s.netTrainingHours) || 0), 0);
  const skillsHours = skills.reduce((sum, s) => sum + (Number(s.totalDocumentedHours) || 0), 0);
  const totalHours = opHours + skillsHours;
  const verifiedHours = records.filter(r => r.verified).reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0) +
                        skills.filter(s => s.competencyStatus === 'Competency Confirmed' || s.competencyStatus === 'Supervisor Assessed').reduce((sum, s) => sum + (Number(s.totalDocumentedHours) || 0), 0);
  const totalOperations = records.filter(r => r.procedureName).length;
  const totalCases = cases.length;

  // SHEET 1: Training Summary
  const summaryRows: any[][] = [
    ['SURGITRACK iLog - SUPERVISED SURGICAL PORTFOLIO'],
    ['Official Supervisor-Specific Training Logbook & Documentation'],
    [''],
    ['TRAINEE INFORMATION'],
    ['Full Name', trainee.fullName],
    ['Medical Qualification', trainee.medicalQualification],
    ['Specialty', trainee.specialty],
    ['Current Position', trainee.currentPosition],
    ['Email', trainee.email],
    [''],
    ['SUPERVISING SURGEON INFORMATION'],
    ['Full Name', `${supervisor.academicDegree || ''} ${supervisor.academicTitle || ''} ${supervisor.fullName}`.trim()],
    ['Professional Position', supervisor.professionalPosition],
    ['Specialty / Subspecialty', `${supervisor.specialty} ${supervisor.subspecialty ? '/ ' + supervisor.subspecialty : ''}`],
    ['Department', supervisor.department],
    ['Hospital / Institution', supervisor.hospital],
    ['Country', supervisor.country],
    ['Email', supervisor.email || 'N/A'],
    [''],
    ['SUPERVISED TRAINING & PORTFOLIO METRICS'],
    ['Training Period', `${startDate} to ${endDate}`],
    ['Total Documented Clinical Cases', totalCases],
    ['Total Supervised Surgical Operations', totalOperations],
    ['Supervised Operations Training Hours', `${opHours.toFixed(2)} hrs`],
    ['Surgical Skills Training Hours', `${skillsHours.toFixed(2)} hrs`],
    ['Total Documented Training Hours', `${totalHours.toFixed(2)} hrs`],
    ['Verified Training Hours', `${verifiedHours.toFixed(2)} hrs`],
    ['Total Surgical Skills Registered', skills.length],
    ['Confirmed / Assessed Competencies', skills.filter(s => s.competencyStatus === 'Competency Confirmed' || s.competencyStatus === 'Supervisor Assessed').length],
    [''],
    ['A. TRAINEE DECLARATION'],
    ['"I hereby certify that the clinical cases, surgical operations, surgical skills, and training hours documented herein represent an accurate record of my surgical training."'],
    ['Trainee Full Name:', trainee.fullName],
    ['Medical Qualification:', trainee.medicalQualification],
    ['Authenticated Email:', trainee.email],
    ['Trainee Signature:', '________________________'],
    ['Date of Export:', new Date().toLocaleDateString()],
    [''],
    ['B. OFFICIAL DEPARTMENT / INSTITUTIONAL CERTIFICATION'],
    ['Department:', supervisor.department],
    ['Hospital / Institution:', supervisor.hospital],
    ['Institutional Stamp Area:', '_________________________ [Stamp Area]'],
    [''],
    ['C. SUPERVISOR CERTIFICATION'],
    ['"I hereby confirm that the training activities, clinical cases, surgical skills, and documented training hours recorded in this portfolio accurately reflect the trainee\'s supervised clinical and surgical experience under my supervision."'],
    ['Supervisor Full Name:', `${supervisor.academicDegree || ''} ${supervisor.academicTitle || ''} ${supervisor.fullName}`.trim()],
    ['Academic & Professional Title:', `${supervisor.academicTitle || ''} ${supervisor.professionalPosition}`.trim()],
    ['Specialty & Department:', `${supervisor.specialty} - ${supervisor.department}`],
    ['Hospital / Institution:', supervisor.hospital],
    ['Supervisor Email:', supervisor.email || 'N/A'],
    ['Supervisor Signature:', '________________________ (Sign manually)'],
    ['Date:', '________________________'],
    ['Official Supervisor Stamp:', '_________________________ [Stamp Area]'],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Portfolio Summary');

  // SHEET 2: Clinical Cases
  const caseHeaders = ['Case Ref', 'Date', 'Age/Sex', 'Hospital', 'Specialty', 'Primary Diagnosis', 'Procedure', 'Role', 'Clinical Outcome'];
  const caseRows = cases.map(c => [
    c.caseReference,
    c.presentationDate,
    `${c.patientAge} / ${c.patientSex || 'Undisclosed'}`,
    c.hospital,
    c.specialty,
    c.primaryDiagnosis,
    c.surgicalProcedure?.procedureName || 'Non-operative',
    c.surgicalProcedure?.participationRole || '—',
    c.management?.outcome || 'Uneventful',
  ]);
  const wsCases = XLSX.utils.aoa_to_sheet([caseHeaders, ...caseRows]);
  XLSX.utils.book_append_sheet(wb, wsCases, 'Clinical Cases');

  // SHEET 3: Supervised Surgical Operations
  const opHeaders = [
    'Date',
    'Procedure Name',
    'Specialty',
    'Case Ref',
    'Activity Type',
    'Participation Role',
    'Net Hours',
    'Supervision Level',
    'Verified',
    'Responsibilities & Surgical Steps',
  ];
  const opRows = records.map(r => [
    r.procedureDate || r.trainingDate,
    r.procedureName,
    r.specialty || supervisor.specialty,
    r.clinicalCaseRef || '—',
    r.activityType,
    r.participationRole,
    r.netTrainingHours,
    r.supervisionLevel,
    r.verified ? 'Verified' : 'Documented',
    r.responsibilities || r.descriptionOfParticipation || '',
  ]);
  const wsOps = XLSX.utils.aoa_to_sheet([opHeaders, ...opRows]);
  XLSX.utils.book_append_sheet(wb, wsOps, 'Surgical Operations');

  // SHEET 4: Surgical Skills & Competency Matrix
  const skillsHeaders = ['Skill Name', 'Specialty', 'Category', 'Exposure Level', 'Competency Status', 'Sessions', 'Hours', 'Supervisor Feedback'];
  const skillRows = skills.map(s => [
    s.name,
    s.specialty,
    s.category,
    s.exposureLevel,
    s.competencyStatus,
    s.totalRecordedSessions,
    s.totalDocumentedHours,
    s.feedbackNotes || '',
  ]);
  const wsSkills = XLSX.utils.aoa_to_sheet([skillsHeaders, ...skillRows]);
  XLSX.utils.book_append_sheet(wb, wsSkills, 'Surgical Skills');

  // Generate and download
  const fileName = `SurgiTrack_iLog_${supervisor.fullName.replace(/\s+/g, '_')}_Portfolio.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * 2. Professional Word Export (.docx)
 */
export async function exportSupervisorWord(payload: ExportDataPayload) {
  const { trainee, supervisor, records } = payload;
  const totalHours = records.reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'SURGITRACK iLog - CLINICAL & SURGICAL PORTFOLIO',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Supervisor-Specific Training Logbook & Certification', italics: true }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '1. Trainee & Supervisor Profile',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Trainee: ', bold: true }),
              new TextRun(`${trainee.fullName} (${trainee.medicalQualification}, ${trainee.currentPosition})\n`),
              new TextRun({ text: 'Supervisor: ', bold: true }),
              new TextRun(`${supervisor.academicDegree || ''} ${supervisor.fullName} - ${supervisor.professionalPosition}\n`),
              new TextRun({ text: 'Hospital / Institution: ', bold: true }),
              new TextRun(`${supervisor.department}, ${supervisor.hospital}, ${supervisor.country}\n`),
              new TextRun({ text: 'Total Documented Training Hours: ', bold: true }),
              new TextRun(`${totalHours.toFixed(1)} Hours across ${records.length} documented surgical records.`),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '2. Operative & Training Procedures Summary',
            heading: HeadingLevel.HEADING_1,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Date', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Procedure', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Role', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Net Hours', bold: true })] })] }),
                ],
              }),
              ...records.map(r =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(r.trainingDate || '')] }),
                    new TableCell({ children: [new Paragraph(r.procedureName || '')] }),
                    new TableCell({ children: [new Paragraph(r.participationRole || '')] }),
                    new TableCell({ children: [new Paragraph(`${r.netTrainingHours}h`)] }),
                  ],
                })
              ),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            text: '3. Official Supervisor Attestation & Review',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: 'I hereby confirm that the training activities, clinical cases, surgical skills, and documented training hours recorded in this portfolio accurately reflect the trainee\'s supervised clinical and surgical experience under my supervision.',
          }),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: `Supervisor: ${supervisor.academicDegree || ''} ${supervisor.fullName}\n` }),
              new TextRun({ text: `Date: _________________________\n` }),
              new TextRun({ text: `Official Signature: _________________________\n` }),
              new TextRun({ text: `Hospital / Department Stamp:\n\n_________________________ [Stamp Area]` }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SurgiTrack_iLog_${supervisor.fullName.replace(/\s+/g, '_')}_Portfolio.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 3. Professional PDF Export (.pdf) for Specific Supervisor
 * Strict compliance with Requirement 6 & 7: Contains 3 sections + Official Certification Page
 */
export function exportSupervisorPDF(payload: Partial<SupervisorPortfolioPayload> & ExportDataPayload) {
  const { trainee, supervisor, records = [], sessions = [], skills = [], cases = [] } = payload;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const opHours = records.reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0) +
                  sessions.reduce((sum, s) => sum + (Number(s.netTrainingHours) || 0), 0);
  const skillsHours = skills.reduce((sum, s) => sum + (Number(s.totalDocumentedHours) || 0), 0);
  const totalHours = opHours + skillsHours;
  const verifiedHours = records.filter(r => r.verified).reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0) +
                        skills.filter(s => s.competencyStatus === 'Competency Confirmed' || s.competencyStatus === 'Supervisor Assessed').reduce((sum, s) => sum + (Number(s.totalDocumentedHours) || 0), 0);

  // Top Deep Navy Header Banner (#101C32)
  doc.setFillColor(16, 28, 50);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('SURGITRACK iLog - SUPERVISED SURGICAL PORTFOLIO', 14, 13);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Clinical Logbook & Verified Surgical Qualifications', 14, 20);

  // Trainee & Supervisor Information Box
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Trainee: ${trainee.fullName}`, 14, 36);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Qualification: ${trainee.medicalQualification} | Position: ${trainee.currentPosition} | Email: ${trainee.email}`, 14, 42);
  doc.text(`Supervising Surgeon: ${supervisor.academicDegree || ''} ${supervisor.academicTitle || ''} ${supervisor.fullName} • ${supervisor.professionalPosition}`, 14, 47);
  doc.text(`Institution: ${supervisor.department}, ${supervisor.hospital}, ${supervisor.country} | Email: ${supervisor.email || 'N/A'}`, 14, 52);
  doc.text(
    `Portfolio Metrics: ${cases.length} Cases | ${records.length} Operations | Net Hours: ${totalHours.toFixed(1)}h (Verified: ${verifiedHours.toFixed(1)}h) | ${skills.length} Skills`,
    14,
    57
  );

  // SECTION 1: Clinical Cases under this supervisor
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136); // Teal #0D9488
  doc.text('1. Supervised Clinical Cases Logbook', 14, 64);

  const caseTableData = cases.slice(0, 15).map(c => [
    c.caseReference,
    c.presentationDate,
    c.primaryDiagnosis.substring(0, 32),
    c.surgicalProcedure?.procedureName ? c.surgicalProcedure.procedureName.substring(0, 28) : 'Non-op',
    c.surgicalProcedure?.participationRole || '—',
    c.hospital.substring(0, 20),
  ]);

  autoTable(doc, {
    startY: 67,
    head: [['Case Ref', 'Date', 'Primary Diagnosis', 'Procedure', 'Role', 'Hospital']],
    body: caseTableData.length > 0 ? caseTableData : [['No clinical cases recorded under this supervisor.', '', '', '', '', '']],
    headStyles: { fillColor: [13, 148, 136], textColor: 255 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    margin: { left: 14, right: 14 },
  });

  // SECTION 2: Supervised Surgical Operations & Logbook Entries
  let nextY = (doc as any).lastAutoTable?.finalY + 8 || 120;
  if (nextY > 230) {
    doc.addPage();
    nextY = 20;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 28, 50);
  doc.text('2. Supervised Surgical Operations & Logbook Entries', 14, nextY);

  const opTableData = records.slice(0, 15).map(r => [
    r.trainingDate,
    r.procedureName.substring(0, 35),
    r.participationRole,
    r.supervisionLevel.substring(0, 20),
    `${r.netTrainingHours}h`,
    r.verified ? 'Verified' : 'Documented',
  ]);

  autoTable(doc, {
    startY: nextY + 3,
    head: [['Date', 'Procedure Name', 'Role', 'Supervision', 'Hours', 'Status']],
    body: opTableData.length > 0 ? opTableData : [['No surgical operations logged under this supervisor.', '', '', '', '', '']],
    headStyles: { fillColor: [16, 28, 50], textColor: 255 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    margin: { left: 14, right: 14 },
  });

  // SECTION 3: Surgical Skills & Competency Matrix
  let skillsY = (doc as any).lastAutoTable?.finalY + 8 || 160;
  if (skillsY > 220) {
    doc.addPage();
    skillsY = 20;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text('3. Technical Surgical Skills & Competency Matrix', 14, skillsY);

  const skillsTableData = skills.slice(0, 15).map(s => [
    s.name.substring(0, 32),
    s.specialty,
    s.exposureLevel.substring(0, 24),
    s.competencyStatus,
    `${s.totalRecordedSessions} sess`,
    `${s.totalDocumentedHours}h`,
  ]);

  autoTable(doc, {
    startY: skillsY + 3,
    head: [['Skill Name', 'Specialty', 'Exposure Level', 'Competency Status', 'Sessions', 'Hours']],
    body: skillsTableData.length > 0 ? skillsTableData : [['No surgical skills recorded under this supervisor.', '', '', '', '', '']],
    headStyles: { fillColor: [13, 148, 136], textColor: 255 },
    styles: { fontSize: 7.5, cellPadding: 2 },
    margin: { left: 14, right: 14 },
  });

  // SECTION 4: Professional 3-Card Institutional Certification Section (Matches Attachment IMG_20261107_001759.png)
  const endTableY = (doc as any).lastAutoTable?.finalY || 180;
  let certY = endTableY + 10;
  if (certY > 185) {
    doc.addPage();
    certY = 22;
  }

  const boxWidth = 58;
  const boxHeight = 72;
  const boxRadius = 3;
  const col1X = 14;
  const col2X = 76;
  const col3X = 138;

  // Draw 3 Outer Rounded Cards
  doc.setDrawColor(186, 230, 253);
  doc.setLineWidth(0.6);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(col1X, certY, boxWidth, boxHeight, boxRadius, boxRadius, 'FD');
  doc.roundedRect(col2X, certY, boxWidth, boxHeight, boxRadius, boxRadius, 'FD');
  doc.roundedRect(col3X, certY, boxWidth, boxHeight, boxRadius, boxRadius, 'FD');

  // --- CARD 1: 1. Trainee Declaration ---
  doc.setFillColor(16, 28, 50);
  doc.roundedRect(col1X, certY, boxWidth, 10, boxRadius, boxRadius, 'F');
  doc.rect(col1X, certY + 5, boxWidth, 5, 'F');
  doc.setFillColor(13, 148, 136);
  doc.circle(col1X + 5, certY + 5, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Trainee Declaration', col1X + 9, certY + 6.5);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  const traineeDecl = 'I hereby certify that the clinical cases, surgical operations, surgical skills, and training hours documented herein represent an accurate record of my surgical training.';
  const traineeDeclLines = doc.splitTextToSize(traineeDecl, boxWidth - 6);
  doc.text(traineeDeclLines, col1X + 3, certY + 15);

  // Teal divider
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.4);
  doc.line(col1X + 3, certY + 36, col1X + boxWidth - 3, certY + 36);

  // Trainee Signature and Date of Exposure
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(16, 28, 50);
  doc.text('Trainee Signature:', col1X + 3, certY + 44);
  doc.setDrawColor(148, 163, 184);
  doc.line(col1X + 27, certY + 44, col1X + boxWidth - 3, certY + 44);

  doc.text('Date of Exposure:', col1X + 3, certY + 54);
  doc.text('_____ / _____ / _____', col1X + 27, certY + 54);

  // --- CARD 2: 2. Supervisor Certification ---
  doc.setFillColor(16, 28, 50);
  doc.roundedRect(col2X, certY, boxWidth, 10, boxRadius, boxRadius, 'F');
  doc.rect(col2X, certY + 5, boxWidth, 5, 'F');
  doc.setFillColor(13, 148, 136);
  doc.circle(col2X + 5, certY + 5, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Supervisor Certification', col2X + 9, certY + 6.5);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  const supDecl = 'I hereby confirm that the training activities, clinical cases, surgical skills, and documented training hours recorded in this portfolio accurately reflect the trainee\'s supervision.';
  const supDeclLines = doc.splitTextToSize(supDecl, boxWidth - 6);
  doc.text(supDeclLines, col2X + 3, certY + 15);

  // Teal divider
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.4);
  doc.line(col2X + 3, certY + 36, col2X + boxWidth - 3, certY + 36);

  // Supervisor Credentials & Sign-off
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Supervisor: ${supervisor.academicDegree || 'MD, PhD, FEBVS'}`, col2X + 3, certY + 41);
  doc.setFont('helvetica', 'bold');
  doc.text(`${supervisor.academicTitle || 'Prof. Dr. med.'} ${supervisor.fullName}`, col2X + 3, certY + 45);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.text(`${supervisor.department}`.substring(0, 36), col2X + 3, certY + 49);
  doc.text(`${supervisor.hospital}`.substring(0, 36), col2X + 3, certY + 52.5);
  doc.text(`Email: ${supervisor.email || 'supervisor@hospital.org'}`, col2X + 3, certY + 56);

  doc.setFontSize(6.5);
  doc.text('Date: _______________', col2X + 3, certY + 61);
  doc.text('Supervisor Signature: _________________', col2X + 3, certY + 65.5);
  doc.text('Official Stamp: ______________________', col2X + 3, certY + 70);

  // --- CARD 3: 3. Official Department / Institutional Certification ---
  doc.setFillColor(16, 28, 50);
  doc.roundedRect(col3X, certY, boxWidth, 10, boxRadius, boxRadius, 'F');
  doc.rect(col3X, certY + 5, boxWidth, 5, 'F');
  doc.setFillColor(13, 148, 136);
  doc.circle(col3X + 5, certY + 5, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Department Certification', col3X + 9, certY + 6.5);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text(`${supervisor.department}`.substring(0, 36), col3X + 3, certY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${supervisor.hospital}`.substring(0, 36), col3X + 3, certY + 19);

  // Teal divider
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.4);
  doc.line(col3X + 3, certY + 24, col3X + boxWidth - 3, certY + 24);

  // Departmental Seal Stamp Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(16, 28, 50);
  doc.text('Departmental Seal:', col3X + 3, certY + 29);

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.roundedRect(col3X + 3, certY + 32, boxWidth - 6, 36, 3, 3);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text('[Official Institutional Seal & Stamp]', col3X + 11, certY + 51);

  // Sub-footer line underneath the 3 cards matching IMG_20261107_001759.png
  const subFooterY = certY + boxHeight + 8;
  doc.setDrawColor(13, 148, 136);
  doc.setLineWidth(0.8);
  doc.line(14, subFooterY, 68, subFooterY);
  doc.line(142, subFooterY, 196, subFooterY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136);
  doc.text('Official signatures and institutional certification', 105, subFooterY + 1, { align: 'center' });

  // Bottom teal & navy accent band
  doc.setFillColor(13, 148, 136);
  doc.rect(0, 288, 210, 3, 'F');
  doc.setFillColor(16, 28, 50);
  doc.rect(0, 291, 210, 6, 'F');

  const fileName = `SurgiTrack_iLog_${supervisor.fullName.replace(/\s+/g, '_')}_Portfolio.pdf`;
  doc.save(fileName);
}

/**
 * 4. German Medical Portfolio Export (Deutsches Operationslogbuch / Weiterbildungsportfolio)
 * Strictly adheres to Section 13 of the Master Specification
 */
export function exportGermanPortfolio(payload: ExportDataPayload, format: 'xlsx' | 'pdf' | 'docx' = 'xlsx') {
  const { trainee, supervisor, records, skills } = payload;

  // Accurate German terminology mapping (Section 13)
  const mapGermanRole = (role: string) => {
    switch (role) {
      case 'Observer':
        return 'Beobachtet';
      case 'Assisted':
        return 'Assistiert';
      case 'First Assistant':
        return 'Als Erstassistent tätig';
      case 'Second Assistant':
        return 'Als Zweitassistent tätig';
      case 'Performed Specific Steps Under Direct Supervision':
        return 'Einzelne operative Schritte unter direkter Supervision durchgeführt';
      case 'Performed Under Supervision':
      case 'Performed Procedure Under Direct Supervision':
        return 'Unter direkter Supervision durchgeführte operative Teilschritte';
      default:
        return 'Teilnahme an chirurgischen Eingriffen';
    }
  };

  if (format === 'xlsx') {
    const wb = XLSX.utils.book_new();
    const sortedDates = records.map(r => r.trainingDate).filter(Boolean).sort();
    const startDate = sortedDates[0] || 'N/A';
    const endDate = sortedDates[sortedDates.length - 1] || 'N/A';
    const totalHours = records.reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0);

    const summaryRows = [
      ['DEUTSCHES TÄTIGKEITS- UND OPERATIONSPORTFOLIO'],
      ['Chirurgische Weiterbildung & Dokumentierte Weiterbildungsstunden'],
      [''],
      ['ANGABEN ZUR PERSON (WEITERBILDUNGSASSISTENT / TRAINEE)'],
      ['Name des Weiterbildungsassistenten:', trainee.fullName],
      ['Medizinische Qualifikation:', trainee.medicalQualification],
      ['Aktuelle Position:', trainee.currentPosition],
      ['Fachgebiet:', trainee.specialty],
      [''],
      ['BETREUENDER FACHARZT / WEITERBILDUNGSBEFUGTER'],
      ['Name des Weiterbildungsbefugten:', `${supervisor.academicDegree || ''} ${supervisor.fullName}`.trim()],
      ['Akademischer Titel:', supervisor.academicTitle || 'N/A'],
      ['Berufliche Position:', supervisor.professionalPosition],
      ['Klinik / Krankenhaus:', supervisor.hospital],
      ['Abteilung:', supervisor.department],
      ['Fachgebiet:', supervisor.specialty],
      [''],
      ['ÜBERSICHT DER WEITERBILDUNGSDATEN'],
      ['Weiterbildungszeitraum:', `${startDate} bis ${endDate}`],
      ['Dokumentierte Weiterbildungsstunden gesamt:', `${totalHours.toFixed(2)} Stunden`],
      ['Anzahl dokumentierter operativer Eingriffe:', records.length],
      [''],
      ['BESTÄTIGUNG DES WEITERBILDUNGSBEFUGTEN'],
      ['Hiermit wird bestätigt, dass die oben genannten klinischen Tätigkeiten und operativen Teilschritte ordnungsgemäß abgeleistet und überprüft wurden.'],
      ['Datum:', '________________________'],
      ['Unterschrift des betreuenden Facharztes:', '________________________ (Manuelle Unterschrift)'],
      ['Dienststempel der Klinik / Abteilung:', '[  STEMPELFLÄCHE FREI  ]'],
    ];

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Übersicht');

    // Operationslogbuch
    const opHeaders = [
      'Datum',
      'Klinik / Krankenhaus',
      'Abteilung',
      'Bezeichnung des operativen Eingriffs',
      'Art der Beteiligung (WBO-konform)',
      'Dauer (Netto Std.)',
      'Klinische Bemerkungen & Teilschritte',
    ];

    const opRows = records.map(r => [
      r.trainingDate,
      r.hospital || supervisor.hospital,
      r.department || supervisor.department,
      r.procedureName,
      mapGermanRole(r.participationRole),
      r.netTrainingHours,
      r.responsibilities || r.descriptionOfParticipation || '',
    ]);

    const wsOps = XLSX.utils.aoa_to_sheet([opHeaders, ...opRows]);
    XLSX.utils.book_append_sheet(wb, wsOps, 'Operationslogbuch');

    // Kompetenzmatrix
    const skillHeaders = ['Klinische Kompetenz', 'Fachgebiet', 'Beteiligungsgrad', 'Status', 'Dokumentierte Stunden'];
    const skillRows = skills.map(s => [
      s.nameGerman || s.name,
      s.specialty,
      mapGermanRole(s.exposureLevel),
      s.competencyStatus === 'Competency Confirmed' ? 'Bestätigte Kompetenz' : s.competencyStatus,
      s.totalDocumentedHours,
    ]);
    const wsSkills = XLSX.utils.aoa_to_sheet([skillHeaders, ...skillRows]);
    XLSX.utils.book_append_sheet(wb, wsSkills, 'Kompetenzmatrix');

    XLSX.writeFile(wb, `Deutsches_Operationslogbuch_${trainee.fullName.replace(/\s+/g, '_')}.xlsx`);
  } else {
    // PDF German export
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFillColor(16, 28, 50);
    doc.rect(0, 0, 210, 26, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('DEUTSCHES OPERATIONS- UND WEITERBILDUNGSLOGBUCH', 14, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Dokumentation der chirurgischen Weiterbildung & operativen Teilschritte', 14, 19);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.text(`Weiterbildungsassistent: ${trainee.fullName} (${trainee.medicalQualification || 'Arzt'})`, 14, 35);
    doc.text(`Betreuender Facharzt: ${supervisor.academicDegree || ''} ${supervisor.fullName} - ${supervisor.professionalPosition}`, 14, 41);
    doc.text(`Klinik: ${supervisor.department}, ${supervisor.hospital}`, 14, 47);

    const tableData = records.map(r => [
      r.trainingDate || '',
      r.procedureName || '',
      mapGermanRole(r.participationRole),
      `${r.netTrainingHours} Std.`,
      r.responsibilities ? r.responsibilities.substring(0, 45) + '...' : '',
    ]);

    autoTable(doc, {
      startY: 54,
      head: [['Datum', 'Operativer Eingriff', 'Art der Beteiligung', 'Dauer', 'Aufgaben / Teilschritte']],
      body: tableData,
      headStyles: { fillColor: [13, 148, 136], textColor: 255 },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || 160;
    let certY = finalY + 15;
    if (certY > 230) {
      doc.addPage();
      certY = 30;
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Bestätigung des betreuenden Facharztes (Weiterbildungsbefugter):', 14, certY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Die Richtigkeit und Vollständigkeit der obigen Angaben zur chirurgischen Tätigkeit werden hiermit bestätigt.', 14, certY + 5);

    doc.rect(14, certY + 10, 85, 26);
    doc.text('Unterschrift des Facharztes:', 16, certY + 15);
    doc.text('Datum: ____________________', 16, certY + 31);

    doc.rect(110, certY + 10, 85, 26);
    doc.text('Dienststempel der Klinik / Abteilung:', 112, certY + 15);

    doc.save(`Deutsches_Operationslogbuch_${trainee.fullName.replace(/\s+/g, '_')}.pdf`);
  }
}

/**
 * 5. Full Cumulative Trainee Surgical Career Portfolio Export (.pdf & .xlsx)
 * Enables one-click instant download of the complete surgical logbook
 */
export function exportFullTraineePortfolio(
  trainee: UserProfile,
  cases: ClinicalCase[],
  supervisors: Supervisor[],
  records: TrainingRecord[],
  sessions: TrainingSession[],
  skills: UserSkill[],
  format: 'pdf' | 'xlsx' = 'pdf'
) {
  const totalCases = cases.length;
  const totalOperations = records.filter(r => r.procedureName).length;
  const totalHours = records.reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0) +
                     sessions.reduce((sum, s) => sum + (Number(s.netTrainingHours) || 0), 0);
  const verifiedHours = records.filter(r => r.verified).reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0) +
                        sessions.filter(s => s.verified).reduce((sum, s) => sum + (Number(s.netTrainingHours) || 0), 0);
  const hospitals = Array.from(new Set([
    ...cases.map(c => c.hospital).filter(Boolean),
    ...supervisors.map(s => s.hospital).filter(Boolean),
    ...records.map(r => r.hospital).filter(Boolean),
  ]));

  if (format === 'xlsx') {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Trainee Summary
    const summaryRows = [
      ['SURGITRACK - CUMULATIVE SURGICAL CAREER PORTFOLIO'],
      ['Official Trainee Training Logbook & Documentation'],
      [''],
      ['TRAINEE PROFILE'],
      ['Full Name:', trainee.fullName],
      ['Medical Qualification:', trainee.medicalQualification],
      ['Specialty:', trainee.specialty],
      ['Current Position:', trainee.currentPosition],
      ['Country:', trainee.country],
      ['Primary Hospitals:', hospitals.join(', ') || trainee.hospitals],
      ['Generated On:', new Date().toLocaleDateString()],
      [''],
      ['CUMULATIVE TRAINING METRICS'],
      ['Total Documented Clinical Cases:', totalCases],
      ['Total Supervised Surgical Operations:', totalOperations],
      ['Total Training Hours (Net Break-Deducted):', `${totalHours.toFixed(1)} Hours`],
      ['Verified Official Hours:', `${verifiedHours.toFixed(1)} Hours`],
      ['Active Surgical Skills Registered:', skills.length],
      ['Competencies Confirmed / Assessed:', skills.filter(s => s.competencyStatus === 'Competency Confirmed' || s.competencyStatus === 'Supervisor Assessed').length],
      ['Supervising Surgeons Affiliated:', supervisors.length],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Trainee Summary');

    // Sheet 2: Clinical Cases
    const caseHeaders = ['Case Ref', 'Date', 'Age/Sex', 'Hospital', 'Specialty', 'Primary Diagnosis', 'Procedure', 'Role', 'Outcome'];
    const caseRows = cases.map(c => [
      c.caseReference,
      c.presentationDate,
      `${c.patientAge} / ${c.patientSex || 'Undisclosed'}`,
      c.hospital,
      c.specialty,
      c.primaryDiagnosis,
      c.surgicalProcedure?.procedureName || 'Non-operative',
      c.surgicalProcedure?.participationRole || '—',
      c.management?.outcome || 'Uneventful',
    ]);
    const wsCases = XLSX.utils.aoa_to_sheet([caseHeaders, ...caseRows]);
    XLSX.utils.book_append_sheet(wb, wsCases, 'Clinical Cases');

    // Sheet 3: Supervised Surgical Operations
    const opHeaders = ['Date', 'Procedure Name', 'Specialty', 'Hospital', 'Role', 'Supervision', 'Net Hours', 'Case Ref'];
    const opRows = records.map(r => [
      r.trainingDate,
      r.procedureName,
      r.specialty,
      r.hospital,
      r.participationRole,
      r.supervisionLevel,
      r.netTrainingHours,
      r.clinicalCaseRef || '—',
    ]);
    const wsOps = XLSX.utils.aoa_to_sheet([opHeaders, ...opRows]);
    XLSX.utils.book_append_sheet(wb, wsOps, 'Operations');

    // Sheet 4: Skills Matrix
    const skillHeaders = ['Skill (English)', 'German WBO Term', 'Specialty', 'Category', 'Exposure Level', 'Status', 'Sessions', 'Hours'];
    const skillRows = skills.map(s => [
      s.name,
      s.nameGerman || '',
      s.specialty,
      s.category,
      s.exposureLevel,
      s.competencyStatus,
      s.totalRecordedSessions,
      s.totalDocumentedHours,
    ]);
    const wsSkills = XLSX.utils.aoa_to_sheet([skillHeaders, ...skillRows]);
    XLSX.utils.book_append_sheet(wb, wsSkills, 'Skills Matrix');

    XLSX.writeFile(wb, `SurgiTrack_Trainee_Portfolio_${trainee.fullName.replace(/\s+/g, '_')}.xlsx`);
  } else {
    // PDF Export
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFillColor(16, 28, 50);
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('SURGITRACK iLog - CUMULATIVE SURGICAL PORTFOLIO', 14, 13);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Comprehensive Trainee Logbook & Verified Surgical Qualifications', 14, 20);

    // Trainee Header Info
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Trainee: ${trainee.fullName}`, 14, 37);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Qualification: ${trainee.medicalQualification} | Position: ${trainee.currentPosition} | Email: ${trainee.email}`, 14, 43);
    doc.text(`Specialty: ${trainee.specialty} | Country: ${trainee.country} | Primary Hospitals: ${hospitals.slice(0, 2).join(', ') || trainee.hospitals}`, 14, 48);
    doc.text(`Total Cases: ${totalCases} | Operations: ${totalOperations} | Net Hours: ${totalHours.toFixed(1)}h (Verified: ${verifiedHours.toFixed(1)}h) | Skills: ${skills.length}`, 14, 53);

    // Section 1: Cases
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136);
    doc.text('1. Clinical Cases Logbook', 14, 61);

    const caseTableData = cases.slice(0, 15).map(c => [
      c.caseReference,
      c.presentationDate,
      c.primaryDiagnosis.substring(0, 32),
      c.surgicalProcedure?.procedureName ? c.surgicalProcedure.procedureName.substring(0, 28) : 'Non-op',
      c.surgicalProcedure?.participationRole || '—',
      c.hospital.substring(0, 20),
    ]);

    autoTable(doc, {
      startY: 64,
      head: [['Case Ref', 'Date', 'Primary Diagnosis', 'Procedure', 'Role', 'Hospital']],
      body: caseTableData.length > 0 ? caseTableData : [['No clinical cases recorded yet.', '', '', '', '', '']],
      headStyles: { fillColor: [13, 148, 136], textColor: 255 },
      styles: { fontSize: 7.5, cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });

    // Section 2: Operations
    let nextY = (doc as any).lastAutoTable?.finalY + 8 || 120;
    if (nextY > 230) {
      doc.addPage();
      nextY = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 28, 50);
    doc.text('2. Supervised Surgical Operations & Logbook Entries', 14, nextY);

    const opTableData = records.slice(0, 15).map(r => [
      r.trainingDate,
      r.procedureName.substring(0, 35),
      r.participationRole,
      r.supervisionLevel.substring(0, 20),
      `${r.netTrainingHours}h`,
      r.verified ? 'Verified' : 'Documented',
    ]);

    autoTable(doc, {
      startY: nextY + 3,
      head: [['Date', 'Procedure Name', 'Role', 'Supervision', 'Hours', 'Status']],
      body: opTableData.length > 0 ? opTableData : [['No operations recorded yet.', '', '', '', '', '']],
      headStyles: { fillColor: [16, 28, 50], textColor: 255 },
      styles: { fontSize: 7.5, cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });

    // Section 3: Skills Matrix
    let skillsY = (doc as any).lastAutoTable?.finalY + 8 || 170;
    if (skillsY > 220) {
      doc.addPage();
      skillsY = 20;
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136);
    doc.text('3. Technical Surgical Skills & Competency Matrix', 14, skillsY);

    const skillsTableData = skills.slice(0, 15).map(s => [
      s.name.substring(0, 32),
      s.specialty,
      s.exposureLevel.substring(0, 24),
      s.competencyStatus,
      `${s.totalRecordedSessions} sess`,
      `${s.totalDocumentedHours}h`,
    ]);

    autoTable(doc, {
      startY: skillsY + 3,
      head: [['Skill Name', 'Specialty', 'Exposure Level', 'Competency Status', 'Sessions', 'Hours']],
      body: skillsTableData.length > 0 ? skillsTableData : [['No surgical skills recorded yet.', '', '', '', '', '']],
      headStyles: { fillColor: [13, 148, 136], textColor: 255 },
      styles: { fontSize: 7.5, cellPadding: 2 },
      margin: { left: 14, right: 14 },
    });

    // Signatures & Official Stamp (Requirement 7)
    const finalY = (doc as any).lastAutoTable?.finalY || 180;
    let signY = finalY + 10;
    if (signY > 210) {
      doc.addPage();
      signY = 22;
    }

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 28, 50);
    doc.text('A. Trainee Declaration & Portfolio Certification:', 14, signY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text('“I hereby certify that the clinical cases, surgical operations, surgical skills, and training hours documented herein represent an accurate record of my surgical training.”', 14, signY + 4);

    doc.setDrawColor(203, 213, 225);
    doc.rect(14, signY + 7, 182, 18);
    doc.text(`Trainee: ${trainee.fullName}  |  Qualification: ${trainee.medicalQualification}  |  Email: ${trainee.email}`, 17, signY + 12);
    doc.text(`Trainee Signature: ________________________________________      Date of Export: ${new Date().toLocaleDateString()}`, 17, signY + 19);

    const stampY = signY + 28;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 28, 50);
    doc.text('B. Official Department / Institutional Certification:', 14, stampY);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Department: ${trainee.specialty} Department  |  Hospital: ${hospitals[0] || trainee.hospitals}`, 14, stampY + 5);
    doc.text('Official Departmental Seal:  _________________________ [Stamp Area]', 14, stampY + 11);

    doc.save(`SurgiTrack_iLog_Trainee_Portfolio_${trainee.fullName.replace(/\s+/g, '_')}.pdf`);
  }
}

