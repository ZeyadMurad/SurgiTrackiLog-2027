/**
 * Centralized Firestore collection path constants.
 *
 * Single source of truth for every collection/subcollection path used across the
 * app. Hardcoding path strings in 30+ files made it easy to drift from the
 * security rules in `firestore.rules`. Import from here instead.
 *
 * Path shape mirrors `firestore.rules` exactly — see ARCHITECTURE.md § Firestore
 * Data Model. If you change a path here, update `firestore.rules` and any
 * composite indexes in `firestore.indexes.json` to match.
 */

/** Top-level collections. */
export const COLLECTIONS = {
  /** Shared surgical community feed — the single source of truth for published cases. */
  communityCases: 'communityCases',
  /** Email/password fallback credential registry (salted SHA-256 hashes only). */
  accounts: 'accounts',
  /** Admin deletion tombstones. */
  deletedUsers: 'deleted_users',
  /** Persistent community & admin notifications. */
  notifications: 'notifications',
  /** Replies to notifications. */
  notificationReplies: 'notification_replies',
  /** Audit trail (super-admin read only, immutable once written). */
  auditLogs: 'audit_logs',
  /** Planned: super_admin role registry (see ARCHITECTURE.md § Security). */
  superAdmins: 'super_admins',
} as const;

/** Per-user subcollections (under `users/{userId}`). */
export const USER_SUBCOLLECTIONS = {
  clinicalCases: 'clinicalCases',
  viewedCommunityCases: 'viewedCommunityCases',
  supervisors: 'supervisors',
  trainingSessions: 'trainingSessions',
  skills: 'skills',
  recommendations: 'recommendations',
  savedArticles: 'savedArticles',
  backups: 'backups',
  notifications: 'notifications',
} as const;

/** Subcollections nested under a supervisor (under `users/{userId}/supervisors/{supervisorId}`). */
export const SUPERVISOR_SUBCOLLECTIONS = {
  trainingRecords: 'trainingRecords',
} as const;

/** Subcollections nested under a community case (under `communityCases/{caseId}`). */
export const COMMUNITY_CASE_SUBCOLLECTIONS = {
  comments: 'comments',
  likes: 'likes',
} as const;

/** Singleton / fixed-path documents. */
export const DOCS = {
  systemSettings: 'system/settings',
  testConnection: 'test/connection',
} as const;

/** Public read-only news namespace (under `public/surgicalNews/{articleId}`). */
export const PUBLIC = {
  surgicalNews: 'surgicalNews',
} as const;

// ---------------------------------------------------------------------------
// Path builders — return fully-qualified collection paths as strings.
// Use with Firestore helpers: collection(db, path), doc(db, path), etc.
// ---------------------------------------------------------------------------

/** `users/{userId}` */
export const userDoc = (userId: string): string => `users/${userId}`;

/** `users/{userId}/{sub}` — a per-user subcollection. */
export const userSubcollection = (userId: string, sub: keyof typeof USER_SUBCOLLECTIONS): string =>
  `users/${userId}/${USER_SUBCOLLECTIONS[sub]}`;

/** `users/{userId}/clinicalCases/{caseId}` */
export const clinicalCaseDoc = (userId: string, caseId: string): string =>
  `users/${userId}/clinicalCases/${caseId}`;

/** `users/{userId}/viewedCommunityCases/{caseId}` */
export const viewedCommunityCaseDoc = (userId: string, caseId: string): string =>
  `users/${userId}/viewedCommunityCases/${caseId}`;

/** `users/{userId}/supervisors/{supervisorId}` */
export const supervisorDoc = (userId: string, supervisorId: string): string =>
  `users/${userId}/supervisors/${supervisorId}`;

/** `users/{userId}/supervisors/{supervisorId}/trainingRecords` */
export const trainingRecordsCollection = (userId: string, supervisorId: string): string =>
  `users/${userId}/supervisors/${supervisorId}/trainingRecords`;

/** `users/{userId}/supervisors/{supervisorId}/trainingRecords/{recordId}` */
export const trainingRecordDoc = (
  userId: string,
  supervisorId: string,
  recordId: string
): string => `users/${userId}/supervisors/${supervisorId}/trainingRecords/${recordId}`;

/** `users/{userId}/trainingSessions/{sessionId}` */
export const trainingSessionDoc = (userId: string, sessionId: string): string =>
  `users/${userId}/trainingSessions/${sessionId}`;

/** `users/{userId}/skills/{skillId}` */
export const skillDoc = (userId: string, skillId: string): string =>
  `users/${userId}/skills/${skillId}`;

/** `users/{userId}/recommendations/{recommendationId}` */
export const recommendationDoc = (userId: string, recommendationId: string): string =>
  `users/${userId}/recommendations/${recommendationId}`;

/** `users/{userId}/savedArticles/{articleId}` */
export const savedArticleDoc = (userId: string, articleId: string): string =>
  `users/${userId}/savedArticles/${articleId}`;

/** `users/{userId}/backups/{backupId}` */
export const backupDoc = (userId: string, backupId: string): string =>
  `users/${userId}/backups/${backupId}`;

/** `users/{userId}/notifications/{notificationId}` */
export const userNotificationDoc = (userId: string, notificationId: string): string =>
  `users/${userId}/notifications/${notificationId}`;

// ---- Community feed paths ----

/** `communityCases/{caseId}` */
export const communityCaseDoc = (caseId: string): string => `communityCases/${caseId}`;

/** `communityCases/{caseId}/comments` */
export const communityCommentsCollection = (caseId: string): string =>
  `communityCases/${caseId}/comments`;

/** `communityCases/{caseId}/comments/{commentId}` */
export const communityCommentDoc = (caseId: string, commentId: string): string =>
  `communityCases/${caseId}/comments/${commentId}`;

/** `communityCases/{caseId}/likes` */
export const communityLikesCollection = (caseId: string): string =>
  `communityCases/${caseId}/likes`;

/** `communityCases/{caseId}/likes/{likeId}` (likeId == userId to prevent duplicates) */
export const communityLikeDoc = (caseId: string, likeId: string): string =>
  `communityCases/${caseId}/likes/${likeId}`;

// ---- Misc top-level paths ----

/** `accounts/{accountId}` (accountId == auth uid) */
export const accountDoc = (accountId: string): string => `accounts/${accountId}`;

/** `deleted_users/{uid}` */
export const deletedUserDoc = (uid: string): string => `deleted_users/${uid}`;

/** `notifications/{notificationId}` (persistent global notifications) */
export const globalNotificationDoc = (notificationId: string): string =>
  `notifications/${notificationId}`;

/** `notification_replies/{replyId}` */
export const notificationReplyDoc = (replyId: string): string => `notification_replies/${replyId}`;

/** `audit_logs/{logId}` */
export const auditLogDoc = (logId: string): string => `audit_logs/${logId}`;

/** `public/surgicalNews/{articleId}` */
export const publicSurgicalNewsDoc = (articleId: string): string =>
  `public/surgicalNews/${articleId}`;
