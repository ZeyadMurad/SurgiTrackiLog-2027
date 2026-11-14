/**
 * MEDICAL JOURNALS — citation / reference export helpers.
 *
 * Generates reference files importable by:
 *  - EndNote        (.enw, EndNote tagged import format)
 *  - Rayyan         (.csv, Rayyan tabular import) — also RIS
 *  - Zotero / Mendeley / EndNote / Rayyan (.ris, universal RIS)
 *
 * Used by the Medical Journals research engine to push a search result
 * set straight into a systematic-review / reference-management workflow.
 */

export interface ExportableArticle {
  id: string;
  title: string;
  authors: string;
  journal: string;
  pubDate: string;
  doi: string | null;
  url: string;
  pmid?: string;
}

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// "A, B, C" / "A; B" / "A and B" -> ["A","B","C"]
const splitAuthors = (s: string): string[] =>
  (s || '')
    .split(/,|;|\band\b/i)
    .map((a) => a.trim().replace(/\.$/, ''))
    .filter(Boolean);

const yearOf = (pubDate: string): string => (pubDate || '').substring(0, 4);

/* ---- EndNote tagged format (.enw) ----
   %0 Journal Article | %T Title | %A Author | %J Journal | %D Year | %DOI | %U URL | %M PMID */
export function exportArticlesEndNote(articles: ExportableArticle[]) {
  const lines: string[] = [];
  for (const a of articles) {
    lines.push('%0 Journal Article');
    if (a.title) lines.push(`%T ${a.title}`);
    for (const au of splitAuthors(a.authors)) lines.push(`%A ${au}`);
    if (a.journal) lines.push(`%J ${a.journal}`);
    if (yearOf(a.pubDate)) lines.push(`%D ${yearOf(a.pubDate)}`);
    if (a.doi) lines.push(`%R ${a.doi}`, `%DOI ${a.doi}`);
    if (a.url) lines.push(`%U ${a.url}`);
    if (a.pmid) lines.push(`%M ${a.pmid}`);
    lines.push(''); // blank line between records
  }
  downloadBlob('SurgiTrack_EndNote.enw', lines.join('\n'), 'application/octet-stream');
}

/* ---- RIS (.ris) — universal reference format (EndNote, Zotero, Mendeley, Rayyan) ---- */
export function exportArticlesRIS(articles: ExportableArticle[]) {
  const lines: string[] = [];
  for (const a of articles) {
    lines.push('TY  - JOUR');
    if (a.title) lines.push(`TI  - ${a.title}`);
    for (const au of splitAuthors(a.authors)) lines.push(`AU  - ${au}`);
    if (a.journal) lines.push(`JO  - ${a.journal}`);
    if (yearOf(a.pubDate)) lines.push(`PY  - ${yearOf(a.pubDate)}`);
    if (a.doi) lines.push(`DO  - ${a.doi}`);
    if (a.url) lines.push(`UR  - ${a.url}`);
    if (a.pmid) lines.push(`AN  - ${a.pmid}`);
    lines.push('ER  - ', '');
  }
  downloadBlob('SurgiTrack_References.ris', lines.join('\n'), 'application/octet-stream');
}

/* ---- Rayyan CSV (.csv) — Rayyan's tabular import format ----
   Columns: title, authors, journal, year, doi, pmid, url */
export function exportArticlesRayyanCsv(articles: ExportableArticle[]) {
  const esc = (v: string) => {
    const s = String(v ?? '');
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const rows: string[][] = [
    ['title', 'authors', 'journal', 'year', 'doi', 'pmid', 'url'],
    ...articles.map((a) => [
      a.title,
      a.authors,
      a.journal,
      yearOf(a.pubDate),
      a.doi || '',
      a.pmid || '',
      a.url,
    ]),
  ];
  const csv = rows.map((r) => r.map(esc).join(',')).join('\r\n');
  downloadBlob('SurgiTrack_Rayyan.csv', '\ufeff' + csv, 'text/csv;charset=utf-8;');
}
