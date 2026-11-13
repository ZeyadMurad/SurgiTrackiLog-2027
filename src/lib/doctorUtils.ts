import { ClinicalCase } from '../types';

/**
 * Normalizes surgeon names by removing academic prefixes, honorifics,
 * punctuation, and extra whitespace for reliable comparison.
 */
export function normalizeSurgeonName(name?: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(prof|dr|med|phd|md|fellow|consultant|specialist|mbbch|mbbs|facs|febvs|mrce|frcs)\b/gi, '')
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Robust multi-factor matcher between a clinical case and a surgeon/doctor.
 * Checks:
 * 1. Exact userId match across main ID and alias IDs
 * 2. Author email match (case-insensitive)
 * 3. Normalized full name match
 */
export function matchDoctorCase(
  c: ClinicalCase,
  doctor?: {
    userId?: string;
    id?: string;
    email?: string;
    fullName?: string;
    authorName?: string;
    aliasIds?: string[];
  } | null
): boolean {
  if (!c || !doctor) return false;

  const docIds = [doctor.userId, doctor.id, ...(doctor.aliasIds || [])].filter(Boolean) as string[];
  if (c.userId && docIds.includes(c.userId)) return true;

  const docEmail = doctor.email?.toLowerCase().trim();
  const caseEmail = (c as any).authorEmail?.toLowerCase().trim();
  if (docEmail && caseEmail && docEmail === caseEmail) return true;

  const cleanCaseAuthor = normalizeSurgeonName(c.authorName);
  const cleanDocName = normalizeSurgeonName(doctor.fullName);
  if (cleanCaseAuthor && cleanDocName && cleanCaseAuthor === cleanDocName) return true;

  // Containment fallback for slight full-name extensions
  if (cleanCaseAuthor && cleanDocName && cleanCaseAuthor.length >= 4 && cleanDocName.length >= 4) {
    if (cleanCaseAuthor.includes(cleanDocName) || cleanDocName.includes(cleanCaseAuthor)) {
      return true;
    }
  }

  return false;
}
