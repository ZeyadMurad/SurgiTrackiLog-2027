import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDocFromServer,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import firebaseConfigFallback from '../../firebase-applet-config.json';

/**
 * SECURITY: Firebase credentials are read from environment variables (.env file,
 * excluded from Git via .gitignore) instead of being hardcoded in the repository.
 * In Vite, only variables prefixed with VITE_ are exposed to the client bundle.
 * See .env.example for the required variable names.
 * The committed `firebase-applet-config.json` contains EMPTY values on purpose:
 * AI Studio re-injects the real config at deploy time; everywhere else you must
 * copy .env.example to .env and fill in the values.
 */
const firebaseConfigFromEnv: FirebaseOptions = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

const hasEnvConfig = Boolean(
  firebaseConfigFromEnv.projectId && firebaseConfigFromEnv.apiKey && firebaseConfigFromEnv.appId
);

if (!hasEnvConfig) {
  console.warn(
    '[SurgiTrack] Firebase environment variables are missing (VITE_FIREBASE_*). ' +
      'Copy .env.example to .env and fill in the values. Falling back to firebase-applet-config.json.'
  );
}

const firebaseConfig: FirebaseOptions = hasEnvConfig
  ? firebaseConfigFromEnv
  : (firebaseConfigFallback as FirebaseOptions);

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const firestoreDbId =
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
  (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;

// Initialize Firestore with robust auto-detect long-polling, ignoreUndefinedProperties, and persistent local caching
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
      ignoreUndefinedProperties: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    firestoreDbId
  );
} catch {
  try {
    firestoreInstance = initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
        ignoreUndefinedProperties: true,
      },
      firestoreDbId
    );
  } catch {
    firestoreInstance = getFirestore(app, firestoreDbId);
  }
}

export const db = firestoreInstance;

/**
 * Recursively strips undefined keys from plain objects/arrays while preserving
 * Firestore sentinels (serverTimestamp, arrayUnion), Timestamp, and Date instances.
 */
export function cleanPayload<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanPayload(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const proto = Object.getPrototypeOf(obj);
    if (proto !== Object.prototype && proto !== null) {
      return obj;
    }
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (val !== undefined) {
        cleaned[key] = cleanPayload(val);
      }
    }
    return cleaned as T;
  }
  return obj;
}

export function getTimestampMs(val: any): number {
  if (!val) return 0;
  if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
  if (typeof val === 'string') {
    const ms = Date.parse(val);
    return Number.isNaN(ms) ? 0 : ms;
  }
  if (typeof val?.toMillis === 'function') {
    return val.toMillis();
  }
  if (typeof val?.seconds === 'number') {
    return val.seconds * 1000 + Math.floor((val.nanoseconds || 0) / 1_000_000);
  }
  if (val instanceof Date) {
    return val.getTime();
  }
  return 0;
}

export function getCasePublishTimestampMs(c: {
  publishedAtServer?: any;
  publishedAt?: string;
  createdAtServer?: any;
  createdAt?: string;
}): number {
  return (
    getTimestampMs(c.publishedAtServer) ||
    getTimestampMs(c.publishedAt) ||
    getTimestampMs(c.createdAtServer) ||
    getTimestampMs(c.createdAt) ||
    0
  );
}

export function formatPublicationDateTime(
  c: { publishedAtServer?: any; publishedAt?: string; createdAtServer?: any; createdAt?: string },
  locale: string = 'en-GB'
): string {
  const ms = getCasePublishTimestampMs(c);
  if (!ms) return '';
  try {
    return new Date(ms).toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return new Date(ms).toISOString();
  }
}

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const FIRESTORE_QUOTA_UPGRADE_URL = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firestoreDbId}/data?openUpgradeDialog=true`;

export function isFirestoreQuotaError(error: unknown): boolean {
  const errAny = error as any;
  const code = String(errAny?.code || '').toLowerCase();
  const message = String(errAny?.message || error || '').toLowerCase();
  return (
    code === 'resource-exhausted' ||
    message.includes('resource-exhausted') ||
    message.includes('quota limit exceeded') ||
    message.includes('quota exceeded') ||
    message.includes('free daily read units')
  );
}

export function formatFirestoreQuotaUserMessage(language: string = 'en'): string {
  if (language === 'ar') {
    return 'تم استنفاد حصة القراءة اليومية المجانية لقاعدة بيانات Firestore لهذا اليوم، وسيتم إعادة تعيينها تلقائياً غداً (أو يمكنك الترقية من وحدة تحكم Firebase). تم حفظ التغييرات محلياً مؤقتاً.';
  }
  if (language === 'de') {
    return 'Das kostenlose tägliche Firestore-Lesekontingent ist erschöpft und wird morgen zurückgesetzt (oder kann in der Firebase Console erweitert werden). Änderungen wurden vorerst lokal gespeichert.';
  }
  return 'Firestore free daily read quota has been exceeded for today and will reset tomorrow (or can be upgraded in Firebase Console). Changes have been saved locally.';
}

export function stripLargeInlineData<T>(value: T, maxDataUrlLength: number = 16_000): T {
  if (typeof value === 'string') {
    if (value.startsWith('data:') && value.length > maxDataUrlLength) {
      return '' as unknown as T;
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(item => stripLargeInlineData(item, maxDataUrlLength)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) {
      return value;
    }
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = stripLargeInlineData(v, maxDataUrlLength);
    }
    return out as T;
  }
  return value;
}

const EVICTABLE_CACHE_KEYS = [
  'surgitrack_local_community_cases',
  'surgitrack_notification_replies',
  'surgitrack_notifications',
];

export function safeSetLocalStorage(key: string, value: unknown): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  const serialize = (val: unknown) => (typeof val === 'string' ? val : JSON.stringify(val));
  try {
    localStorage.setItem(key, serialize(value));
    return true;
  } catch {
    // Evict large non-essential caches first when storage quota is reached
    for (const evictKey of EVICTABLE_CACHE_KEYS) {
      if (evictKey !== key) {
        try {
          localStorage.removeItem(evictKey);
        } catch {
          // ignore
        }
      }
    }
    try {
      localStorage.setItem(key, serialize(value));
      return true;
    } catch {
      // Final fallback: strip bulky inline data: URLs (> 4KB) from the cached copy only
      if (typeof value !== 'string') {
        try {
          const compact = stripLargeInlineData(value, 4_000);
          localStorage.setItem(key, JSON.stringify(compact));
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  }
}

export function saveCompactCommunityCache(cases: any[]): void {
  const compactList = (Array.isArray(cases) ? cases : [])
    .slice(0, 15)
    .map(c => stripLargeInlineData(c, 8_000));
  safeSetLocalStorage('surgitrack_local_community_cases', compactList);
}

// Connectivity test
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error?.message?.includes('offline') || error?.code === 'unavailable') {
      console.info('Firestore is operating in offline mode with full local persistence.');
    }
  }
}
testConnection().catch(() => {});
