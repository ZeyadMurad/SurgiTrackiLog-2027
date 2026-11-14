import { describe, it, expect } from 'vitest';
import { normalizeSurgeonName, matchDoctorCase } from '../lib/doctorUtils';
import type { ClinicalCase } from '../types';

// Helper: build a minimal ClinicalCase for matching tests (only the fields
// matchDoctorCase reads: userId, authorEmail, authorName).
function makeCase(partial: {
  userId?: string;
  authorEmail?: string;
  authorName?: string;
}): ClinicalCase {
  return partial as unknown as ClinicalCase;
}

describe('normalizeSurgeonName', () => {
  it('returns empty string for falsy input', () => {
    expect(normalizeSurgeonName(undefined)).toBe('');
    expect(normalizeSurgeonName('')).toBe('');
  });

  it('lowercases and strips academic titles, honorifics, and credentials', () => {
    expect(normalizeSurgeonName('Prof. Dr. med. John Smith, MD, FRCS')).toBe('john smith');
  });

  it('removes punctuation and collapses whitespace', () => {
    expect(normalizeSurgeonName('  Jane   Doe  ')).toBe('jane doe');
    expect(normalizeSurgeonName('Ali (Hussain) - Consultant')).toBe('ali hussain');
  });

  it('leaves names without titles intact (lowercased)', () => {
    expect(normalizeSurgeonName('Maya Khalil')).toBe('maya khalil');
  });
});

describe('matchDoctorCase', () => {
  const theCase = makeCase({
    userId: 'usr_1',
    authorEmail: 'alice@hospital.org',
    authorName: 'Dr. Alice Wong',
  });

  it('returns false when either argument is missing', () => {
    expect(matchDoctorCase(theCase, null)).toBe(false);
    expect(matchDoctorCase(theCase, undefined)).toBe(false);
    expect(matchDoctorCase(null as unknown as ClinicalCase, { userId: 'usr_1' })).toBe(false);
  });

  it('matches by exact userId', () => {
    expect(matchDoctorCase(theCase, { userId: 'usr_1', fullName: 'Someone Else' })).toBe(true);
  });

  it('matches by alias id', () => {
    expect(
      matchDoctorCase(theCase, { userId: 'usr_main', aliasIds: ['usr_1'], fullName: 'X' })
    ).toBe(true);
  });

  it('matches by author email (case-insensitive, trimmed)', () => {
    expect(matchDoctorCase(theCase, { email: '  Alice@HOSPITAL.org  ', fullName: 'Whoever' })).toBe(
      true
    );
  });

  it('matches by normalized full name (titles ignored)', () => {
    expect(matchDoctorCase(theCase, { fullName: 'Prof. Dr. Alice Wong' })).toBe(true);
  });

  it('does not match an unrelated doctor', () => {
    expect(
      matchDoctorCase(theCase, { userId: 'usr_999', email: 'bob@elsewhere.com', fullName: 'Bob' })
    ).toBe(false);
  });

  it('containment fallback matches a longer name against a shorter one', () => {
    const longCase = makeCase({ authorName: 'Alice Wong Specialist Surgeon' });
    expect(matchDoctorCase(longCase, { fullName: 'Alice Wong' })).toBe(true);
  });
});
