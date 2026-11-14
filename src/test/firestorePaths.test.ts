import { describe, it, expect } from 'vitest';
import {
  COLLECTIONS,
  USER_SUBCOLLECTIONS,
  SUPERVISOR_SUBCOLLECTIONS,
  COMMUNITY_CASE_SUBCOLLECTIONS,
  userDoc,
  userSubcollection,
  clinicalCaseDoc,
  viewedCommunityCaseDoc,
  supervisorDoc,
  trainingRecordsCollection,
  trainingRecordDoc,
  trainingSessionDoc,
  skillDoc,
  communityCaseDoc,
  communityCommentsCollection,
  communityCommentDoc,
  communityLikesCollection,
  communityLikeDoc,
  accountDoc,
  deletedUserDoc,
  publicSurgicalNewsDoc,
} from '../lib/firestorePaths';

describe('firestorePaths — constants', () => {
  it('COLLECTIONS holds the top-level collection names', () => {
    expect(COLLECTIONS.communityCases).toBe('communityCases');
    expect(COLLECTIONS.accounts).toBe('accounts');
    expect(COLLECTIONS.deletedUsers).toBe('deleted_users');
    expect(COLLECTIONS.notifications).toBe('notifications');
    expect(COLLECTIONS.auditLogs).toBe('audit_logs');
  });

  it('USER_SUBCOLLECTIONS maps logical keys to Firestore names', () => {
    expect(USER_SUBCOLLECTIONS.clinicalCases).toBe('clinicalCases');
    expect(USER_SUBCOLLECTIONS.supervisors).toBe('supervisors');
    expect(USER_SUBCOLLECTIONS.skills).toBe('skills');
    expect(USER_SUBCOLLECTIONS.recommendations).toBe('recommendations');
    expect(USER_SUBCOLLECTIONS.backups).toBe('backups');
  });

  it('SUPERVISOR_SUBCOLLECTIONS and COMMUNITY_CASE_SUBCOLLECTIONS are correct', () => {
    expect(SUPERVISOR_SUBCOLLECTIONS.trainingRecords).toBe('trainingRecords');
    expect(COMMUNITY_CASE_SUBCOLLECTIONS.comments).toBe('comments');
    expect(COMMUNITY_CASE_SUBCOLLECTIONS.likes).toBe('likes');
  });
});

describe('firestorePaths — per-user builders', () => {
  it('userDoc produces users/{userId}', () => {
    expect(userDoc('usr_123')).toBe('users/usr_123');
  });

  it('userSubcollection produces users/{userId}/{sub}', () => {
    expect(userSubcollection('u1', 'clinicalCases')).toBe('users/u1/clinicalCases');
    expect(userSubcollection('u1', 'supervisors')).toBe('users/u1/supervisors');
  });

  it('clinicalCaseDoc and viewedCommunityCaseDoc are scoped under the user', () => {
    expect(clinicalCaseDoc('u1', 'CAS-2026-001')).toBe('users/u1/clinicalCases/CAS-2026-001');
    expect(viewedCommunityCaseDoc('u1', 'case_9')).toBe('users/u1/viewedCommunityCases/case_9');
  });

  it('supervisor + nested trainingRecord paths are correct', () => {
    expect(supervisorDoc('u1', 'sup_2')).toBe('users/u1/supervisors/sup_2');
    expect(trainingRecordsCollection('u1', 'sup_2')).toBe(
      'users/u1/supervisors/sup_2/trainingRecords'
    );
    expect(trainingRecordDoc('u1', 'sup_2', 'rec_3')).toBe(
      'users/u1/supervisors/sup_2/trainingRecords/rec_3'
    );
  });

  it('trainingSessionDoc and skillDoc are scoped under the user', () => {
    expect(trainingSessionDoc('u1', 'sess_1')).toBe('users/u1/trainingSessions/sess_1');
    expect(skillDoc('u1', 'skill_7')).toBe('users/u1/skills/skill_7');
  });
});

describe('firestorePaths — community feed builders', () => {
  it('communityCaseDoc is the shared feed root', () => {
    expect(communityCaseDoc('case_42')).toBe('communityCases/case_42');
  });

  it('comments subcollection and doc are nested under the case', () => {
    expect(communityCommentsCollection('case_42')).toBe('communityCases/case_42/comments');
    expect(communityCommentDoc('case_42', 'cmt_1')).toBe('communityCases/case_42/comments/cmt_1');
  });

  it('likes are keyed per userId to prevent duplicates', () => {
    expect(communityLikesCollection('case_42')).toBe('communityCases/case_42/likes');
    expect(communityLikeDoc('case_42', 'uid_99')).toBe('communityCases/case_42/likes/uid_99');
  });
});

describe('firestorePaths — misc top-level builders', () => {
  it('accountDoc, deletedUserDoc, publicSurgicalNewsDoc', () => {
    expect(accountDoc('uid_1')).toBe('accounts/uid_1');
    expect(deletedUserDoc('uid_1')).toBe('deleted_users/uid_1');
    expect(publicSurgicalNewsDoc('art_5')).toBe('public/surgicalNews/art_5');
  });
});
