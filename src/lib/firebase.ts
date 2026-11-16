import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  indexedDBLocalPersistence,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDocFromServer,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import firebaseConfigFallback from '../../firebase-applet-config.json';

/**
 * SECURITY: Firebase credentials are read from environment variables (.env file,
 * excluded from Git via .gitignore) instead of being hardcoded in the repository.
 * In Vite, only variables prefixed with VITE_ are exposed to the client bundle.
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
      'Falling back to firebase-applet-config.json.'
  );
}

const firebaseConfig: FirebaseOptions = hasEnvConfig
  ? firebaseConfigFromEnv
  : (firebaseConfigFallback as FirebaseOptions);

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
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
export const auth = getAuth(app);
export const storage = getStorage(app);

// Explicitly enforce durable multi-tab browser persistence so Firebase Auth sessions
// survive page refreshes, tab switches, browser restarts, and deployments.
export const authPersistenceReady: Promise<void> = (async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    try {
      await setPersistence(auth, indexedDBLocalPersistence);
    } catch {
      // Memory persistence fallback
    }
  }
})();

/**
 * Upload a compressed media Data URL or File to Firebase Storage under users/{uid}/...
 * Returns a durable HTTPS download URL when Firebase Storage is configured and reachable,
 * otherwise falls back gracefully to the compressed data URL so clinical data is never lost.
 */
export async function uploadMediaToStorage(
  uid: string,
  folder: 'avatars' | 'cases' | 'stories',
  fileOrDataUrl: File | string,
  fileNamePrefix: string = 'media'
): Promise<string> {
  const bucketConfigured = Boolean(firebaseConfig.storageBucket);
  if (!uid || uid === 'local-surgeon-001' || !bucketConfigured || !navigator.onLine) {
    if (typeof fileOrDataUrl === 'string') return fileOrDataUrl;
    throw new Error('Cannot upload binary file while offline');
  }

  const safeName = `${fileNamePrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const path = `users/${uid}/${folder}/${safeName}`;
  const refObj = storageRef(storage, path);

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Storage upload timeout')), 4500)
  );

  try {
    const uploadTask = (async () => {
      if (typeof fileOrDataUrl === 'string') {
        if (!fileOrDataUrl.startsWith('data:')) return fileOrDataUrl;
        await uploadString(refObj, fileOrDataUrl, 'data_url');
      } else {
        await uploadBytes(refObj, fileOrDataUrl, {
          contentType: fileOrDataUrl.type || 'application/octet-stream',
        });
      }
      return await getDownloadURL(refObj);
    })();

    return await Promise.race([uploadTask, timeoutPromise]);
  } catch (err) {
    console.warn('[SurgiTrack Storage] Falling back to inline compressed media:', (err as any)?.message || err);
    if (typeof fileOrDataUrl === 'string') {
      return fileOrDataUrl;
    }
    throw err;
  }
}

export async function deleteStorageObjectByUrl(urlOrPath?: string): Promise<void> {
  if (!urlOrPath || !auth.currentUser) return;
  if (urlOrPath.startsWith('data:')) return;
  try {
    if (urlOrPath.startsWith('users/')) {
      await deleteObject(storageRef(storage, urlOrPath));
      return;
    }
    if (urlOrPath.includes('firebasestorage.googleapis.com') || urlOrPath.includes('storage.googleapis.com')) {
      const targetRef = storageRef(storage, urlOrPath);
      await deleteObject(targetRef);
    }
  } catch (err) {
    console.warn('[SurgiTrack Storage] Delete notice:', (err as any)?.message || err);
  }
}

export function getFirebaseAuthErrorMessage(err: any, language: string = 'en', flow: 'login' | 'register' | 'reset' | 'password_change' = 'login'): string {
  const code = String(err?.code || '').toLowerCase();
  const rawMsg = String(err?.message || '');

  if (code.includes('auth/too-many-requests')) {
    return language === 'ar'
      ? 'تم حظر المحاولات مؤقتاً بسبب تكرار المحاولات الفاشلة. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى.'
      : language === 'de'
      ? 'Zu viele fehlgeschlagene Anmeldeversuche. Bitte warten Sie einige Minuten und versuchen Sie es erneut.'
      : 'Too many failed attempts. Please wait a few minutes before trying again.';
  }

  if (code.includes('auth/invalid-email')) {
    return language === 'ar'
      ? 'صيغة البريد الإلكتروني غير صالحة. يرجى التحقق من البريد المدخل.'
      : language === 'de'
      ? 'Ungültiges E-Mail-Format. Bitte überprüfen Sie Ihre Eingabe.'
      : 'Invalid email address format. Please enter a valid email.';
  }

  if (code.includes('auth/email-already-in-use')) {
    return language === 'ar'
      ? 'هذا البريد الإلكتروني مسجل بالفعل في المنصة. يرجى تسجيل الدخول مباشرة.'
      : language === 'de'
      ? 'Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich direkt an.'
      : 'An account with this email already exists. Please log in instead.';
  }

  if (code.includes('auth/weak-password')) {
    return language === 'ar'
      ? 'كلمة المرور ضعيفة جداً. يجب أن تتكون من 6 أحرف على الأقل.'
      : language === 'de'
      ? 'Das Passwort ist zu schwach. Es muss mindestens 6 Zeichen lang sein.'
      : 'Password is too weak. It must be at least 6 characters long.';
  }

  if (
    code.includes('auth/invalid-credential') ||
    code.includes('auth/wrong-password') ||
    code.includes('auth/user-not-found') ||
    code.includes('auth/invalid-login-credentials')
  ) {
    if (flow === 'reset') {
      return language === 'ar'
        ? 'تعذر إرسال رابط استعادة كلمة المرور. يرجى التحقق من البريد الإلكتروني المدخل.'
        : 'Could not send password reset email. Please verify the email address.';
    }
    return language === 'ar'
      ? 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور والمحاولة مجدداً.'
      : language === 'de'
      ? 'Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail-Adresse und Ihr Passwort.'
      : 'Invalid email or password. Please check your credentials and try again.';
  }

  if (code.includes('auth/requires-recent-login')) {
    return language === 'ar'
      ? 'لأسباب أمنية، يرجى إعادة إدخال كلمة المرور الحالية أو تسجيل الخروج والدخول مجدداً قبل تغيير كلمة المرور.'
      : 'For security reasons, please enter your current password or sign in again before changing your password.';
  }

  if (code.includes('auth/network-request-failed')) {
    return language === 'ar'
      ? 'تعذر الاتصال بخادم المصادقة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.'
      : 'Network error while contacting authentication service. Please check your connection.';
  }

  if (code.includes('auth/popup-closed-by-user')) {
    return language === 'ar'
      ? 'تم إغلاق نافذة تسجيل الدخول عبر Google قبل إتمام العملية.'
      : 'Google sign-in popup was closed before completing.';
  }

  if (code.includes('auth/unauthorized-domain')) {
    return language === 'ar'
      ? 'النطاق الحالي غير مصرح به في إعدادات Firebase Auth.'
      : 'This domain is not authorized in Firebase Authentication settings.';
  }

  return rawMsg || (language === 'ar' ? 'حدث خطأ في المصادقة.' : 'Authentication error occurred.');
}

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

// Explicit connectivity verification helper (invoked only after auth, not on anonymous boot)
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.message?.includes('offline') || error?.code === 'unavailable') {
      console.info('Firestore is operating in offline mode with full local persistence.');
    }
    return false;
  }
}
