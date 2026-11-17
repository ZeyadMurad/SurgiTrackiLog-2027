import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  arrayUnion,
} from 'firebase/firestore';
import {
  auth,
  db,
  authPersistenceReady,
  cleanPayload,
  getTimestampMs,
  isFirestoreQuotaError,
  safeSetLocalStorage,
  uploadMediaToStorage,
  getFirebaseAuthErrorMessage,
} from '../lib/firebase';
import { UserProfile, SupportedLanguage, AppNotification, NotificationReply } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (data: Partial<UserProfile> & { password: string }) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteCurrentAccount: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateProfilePhoto: (photoDataUrl: string) => Promise<void>;
  setLanguage: (lang: SupportedLanguage) => void;
  language: SupportedLanguage;
  getAllRegisteredUsers: () => Promise<UserProfile[]>;
  adminDeleteUserAccount: (userId: string) => Promise<void>;
  accountDeletedByAdmin: boolean;
  dismissDeletedAccountModal: () => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  broadcastNotification: (notif: { title: string; message: string; category: AppNotification['category'] }) => Promise<void>;
  replyToNotification: (notificationId: string, title: string, replyMessage: string) => Promise<void>;
  notificationReplies: NotificationReply[];
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markNotificationsAsRead: (notificationIds: string[]) => Promise<void>;
  patchProfileLocal: (updates: Partial<UserProfile>) => void;
  myUids: string[];
}

const AuthContext = createContext<AuthContextType | null>(null);

const LOCAL_PROFILE_KEY = 'surgitrack_active_profile';
const LOCAL_LANG_KEY = 'surgitrack_lang';
const LOCAL_NOTIFS_KEY = 'surgitrack_notifications';
const LOCAL_REPLIES_KEY = 'surgitrack_notification_replies';
const PROFILE_UID_CACHE_PREFIX = 'surgitrack_profile_';

function saveActiveProfileCaches(prof: UserProfile) {
  safeSetLocalStorage(LOCAL_PROFILE_KEY, prof);
  if (prof.userId && prof.userId !== 'local-surgeon-001') {
    safeSetLocalStorage(PROFILE_UID_CACHE_PREFIX + prof.userId, prof);
  }
}

function readCachedProfileForUid(uid: string, email?: string | null): UserProfile | null {
  try {
    const cleanEmail = (email || '').trim().toLowerCase();
    const candidates = [
      localStorage.getItem(PROFILE_UID_CACHE_PREFIX + uid),
      localStorage.getItem(LOCAL_PROFILE_KEY),
    ];
    for (const raw of candidates) {
      if (!raw) continue;
      const parsed = JSON.parse(raw) as UserProfile;
      if (
        parsed &&
        (parsed.userId === uid ||
          parsed.aliasIds?.includes(uid) ||
          (cleanEmail && parsed.email?.toLowerCase().trim() === cleanEmail))
      ) {
        return { ...parsed, status: 'active', emailVerified: true };
      }
    }
  } catch {
    // ignore malformed cache
  }
  return null;
}

function withAuthTimeout<T>(promise: Promise<T>, ms: number = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('__AUTH_STARTUP_TIMEOUT__')), ms)
    ),
  ]);
}
const SUPER_ADMIN_EMAIL = 'zeadmorud2030@gmail.com';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getLocalNotifications(): AppNotification[] {
  try {
    const data = localStorage.getItem(LOCAL_NOTIFS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalNotifications(list: AppNotification[]) {
  safeSetLocalStorage(LOCAL_NOTIFS_KEY, list.slice(0, 50));
}

function getLocalReplies(): NotificationReply[] {
  try {
    const data = localStorage.getItem(LOCAL_REPLIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalReplies(list: NotificationReply[]) {
  safeSetLocalStorage(LOCAL_REPLIES_KEY, list.slice(0, 50));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem(LOCAL_LANG_KEY) as SupportedLanguage) || 'en';
  });

  const [accountDeletedByAdmin, setAccountDeletedByAdmin] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(getLocalNotifications());
  const [notificationReplies, setNotificationReplies] = useState<NotificationReply[]>(getLocalReplies());

  // Prevent race condition between createUserWithEmailAndPassword + onAuthStateChanged
  const registeringUidRef = useRef<string | null>(null);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    safeSetLocalStorage(LOCAL_LANG_KEY, lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (profile && user) {
      updateUserProfile({ preferredLanguage: lang });
    }
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Helper: Find & merge any legacy Firestore user profiles sharing the same normalized email
  // Only writes back to Firestore when fields actually differ (prevents write->onSnapshot cascades).
  const unifyEmailProfile = async (
    baseProfile: UserProfile,
    activeUid: string
  ): Promise<UserProfile> => {
    const cleanEmail = (baseProfile.email || '').trim().toLowerCase();
    const baseAliases = Array.from(new Set([activeUid, ...(baseProfile.aliasIds || [])].filter(Boolean)));
    if (!cleanEmail) {
      return {
        ...baseProfile,
        userId: activeUid,
        aliasIds: baseAliases,
        emailVerified: true,
        status: 'active',
      };
    }

    try {
      const emailCandidates = Array.from(
        new Set([cleanEmail, (baseProfile.email || '').trim()].filter(Boolean))
      );
      const usersSnap = await getDocs(
        query(collection(db, 'users'), where('email', 'in', emailCandidates), limit(10))
      );
      const matchingDocs: UserProfile[] = [];
      usersSnap.forEach(d => {
        const uData = d.data() as UserProfile;
        if (
          !uData.deletedByAdmin &&
          uData.status !== 'deleted' &&
          uData.email &&
          uData.email.trim().toLowerCase() === cleanEmail
        ) {
          matchingDocs.push({ ...uData, userId: d.id });
        }
      });

      if (matchingDocs.length === 0) {
        return {
          ...baseProfile,
          userId: activeUid,
          aliasIds: baseAliases,
          email: cleanEmail,
          emailVerified: true,
          status: 'active',
          role: cleanEmail === SUPER_ADMIN_EMAIL ? 'super_admin' : (baseProfile.role || 'normal_user'),
        };
      }

      const allAliases = Array.from(
        new Set([
          activeUid,
          baseProfile.userId,
          ...(baseProfile.aliasIds || []),
          ...matchingDocs.flatMap(m => [m.userId, ...(m.aliasIds || [])]),
        ].filter(Boolean))
      );

      const allFollowers = Array.from(
        new Set([
          ...(baseProfile.followers || []),
          ...matchingDocs.flatMap(m => m.followers || []),
        ].filter(Boolean))
      ).filter(fid => !allAliases.includes(fid));

      const allFollowing = Array.from(
        new Set([
          ...(baseProfile.following || []),
          ...matchingDocs.flatMap(m => m.following || []),
        ].filter(Boolean))
      ).filter(fid => !allAliases.includes(fid));

      const allPending = Array.from(
        new Set([
          ...(baseProfile.pendingFollowRequests || []),
          ...matchingDocs.flatMap(m => m.pendingFollowRequests || []),
        ].filter(Boolean))
      ).filter(fid => !allAliases.includes(fid));

      const richestPhoto =
        baseProfile.profilePhotoUrl ||
        matchingDocs.find(m => m.profilePhotoUrl)?.profilePhotoUrl ||
        '';

      const richestName =
        (baseProfile.fullName && baseProfile.fullName !== 'Surgeon Trainee' ? baseProfile.fullName : '') ||
        matchingDocs.find(m => m.fullName && m.fullName !== 'Surgeon Trainee')?.fullName ||
        baseProfile.fullName;

      const richestHospital =
        (baseProfile.hospitals && baseProfile.hospitals !== 'University Medical Center' ? baseProfile.hospitals : '') ||
        matchingDocs.find(m => m.hospitals && m.hospitals !== 'University Medical Center')?.hospitals ||
        (baseProfile.hospitals && baseProfile.hospitals !== 'University Medical Center' ? baseProfile.hospitals : '') ||
        '';

      const richestSpecialty =
        (baseProfile.specialty && baseProfile.specialty !== 'General Surgery' ? baseProfile.specialty : '') ||
        matchingDocs.find(m => m.specialty && m.specialty !== 'General Surgery')?.specialty ||
        baseProfile.specialty ||
        'General Surgery';

      const richestBio =
        (baseProfile.biography && baseProfile.biography !== 'Surgical trainee portfolio.' ? baseProfile.biography : '') ||
        matchingDocs.find(m => m.biography && m.biography !== 'Surgical trainee portfolio.')?.biography ||
        baseProfile.biography ||
        '';

      const maxTotalHours = Math.max(
        Number(baseProfile.totalHours) || 0,
        ...matchingDocs.map(m => Number(m.totalHours) || 0)
      );
      const maxVerifiedHours = Math.max(
        Number(baseProfile.verifiedHours) || 0,
        ...matchingDocs.map(m => Number(m.verifiedHours) || 0)
      );
      const maxTotalProcs = Math.max(
        Number(baseProfile.totalProcedures) || 0,
        ...matchingDocs.map(m => Number(m.totalProcedures) || 0)
      );
      const maxVerifiedProcs = Math.max(
        Number(baseProfile.verifiedProcedures) || 0,
        ...matchingDocs.map(m => Number(m.verifiedProcedures) || 0)
      );
      const maxPublishedCount = Math.max(
        Number(baseProfile.publishedCasesCount) || 0,
        ...matchingDocs.map(m => Number(m.publishedCasesCount) || 0)
      );

      const unified: UserProfile = {
        ...matchingDocs[0],
        ...baseProfile,
        userId: activeUid,
        aliasIds: allAliases,
        email: cleanEmail,
        fullName: richestName || 'Surgeon Trainee',
        profilePhotoUrl: richestPhoto,
        hospitals: richestHospital,
        specialty: richestSpecialty,
        biography: richestBio,
        followers: allFollowers,
        following: allFollowing,
        pendingFollowRequests: allPending,
        followersCount: allFollowers.length,
        followingCount: allFollowing.length,
        totalHours: maxTotalHours,
        verifiedHours: maxVerifiedHours,
        totalProcedures: maxTotalProcs,
        verifiedProcedures: maxVerifiedProcs,
        publishedCasesCount: maxPublishedCount,
        emailVerified: true,
        status: 'active',
        role: cleanEmail === SUPER_ADMIN_EMAIL ? 'super_admin' : (baseProfile.role || 'normal_user'),
        updatedAt: baseProfile.updatedAt || new Date().toISOString(),
      };

      const needsPrimarySync =
        baseProfile.status !== 'active' ||
        baseProfile.emailVerified !== true ||
        baseProfile.userId !== activeUid ||
        JSON.stringify(baseProfile.aliasIds || []) !== JSON.stringify(allAliases) ||
        JSON.stringify(baseProfile.followers || []) !== JSON.stringify(allFollowers) ||
        JSON.stringify(baseProfile.following || []) !== JSON.stringify(allFollowing) ||
        (matchingDocs.length > 1 && baseProfile.fullName !== unified.fullName);

      if (needsPrimarySync) {
        await setDoc(
          doc(db, 'users', activeUid),
          cleanPayload({ ...unified, updatedAt: new Date().toISOString() }),
          { merge: true }
        ).catch(() => {});
      }

      return unified;
    } catch (err) {
      console.warn('Email profile unification note:', err);
      return {
        ...baseProfile,
        userId: activeUid,
        aliasIds: baseAliases,
        email: cleanEmail,
        emailVerified: true,
        status: 'active',
      };
    }
  };

  // Monitor genuine Firebase Auth session (backed by browserLocalPersistence)
  useEffect(() => {
    let active = true;
    authPersistenceReady.catch(() => {});

    // Safety guard: never allow startup splash screen to freeze indefinitely
    const safetyTimer = window.setTimeout(() => {
      if (active) setLoading(false);
    }, 4500);

    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!active) return;
      if (!currentUser) {
        setUser(null);
        setProfile(null);
        setNotifications([]);
        setNotificationReplies([]);
        localStorage.removeItem(LOCAL_PROFILE_KEY);
        localStorage.removeItem(LOCAL_NOTIFS_KEY);
        localStorage.removeItem(LOCAL_REPLIES_KEY);
        window.clearTimeout(safetyTimer);
        setLoading(false);
        return;
      }

      // If registerWithEmail is currently writing the initial user doc, let it finish cleanly
      if (registeringUidRef.current === currentUser.uid) {
        setUser(currentUser);
        window.clearTimeout(safetyTimer);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      const cleanEmail = (currentUser.email || '').trim().toLowerCase();

      // Hydrate immediately from per-UID cache so UI renders without waiting on Firestore
      const cachedProfile = readCachedProfileForUid(currentUser.uid, currentUser.email);
      if (cachedProfile) {
        setProfile(cachedProfile);
        window.clearTimeout(safetyTimer);
        setLoading(false);
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await withAuthTimeout(getDoc(userDocRef), 4000);
        if (!active) return;

        if (docSnap.exists()) {
          let data = docSnap.data() as UserProfile;
          if (data.deletedByAdmin || data.status === 'deleted') {
            setAccountDeletedByAdmin(true);
            await fbSignOut(auth).catch(() => {});
            setUser(null);
            setProfile(null);
            localStorage.removeItem(LOCAL_PROFILE_KEY);
            window.clearTimeout(safetyTimer);
            setLoading(false);
            return;
          }
          if (cleanEmail === SUPER_ADMIN_EMAIL && data.role !== 'super_admin') {
            data.role = 'super_admin';
            setDoc(userDocRef, { role: 'super_admin', status: 'active', emailVerified: true }, { merge: true }).catch(() => {});
          }
          data = await withAuthTimeout(unifyEmailProfile(data, currentUser.uid), 4000).catch(() => data);
          if (!active) return;
          setProfile(data);
          saveActiveProfileCaches(data);
        } else {
          // Check tombstone before reconstructing
          const tombSnap = await withAuthTimeout(getDoc(doc(db, 'deleted_users', currentUser.uid)), 3000).catch(() => null);
          if (tombSnap?.exists()) {
            setAccountDeletedByAdmin(true);
            await fbSignOut(auth).catch(() => {});
            setUser(null);
            setProfile(null);
            localStorage.removeItem(LOCAL_PROFILE_KEY);
            window.clearTimeout(safetyTimer);
            setLoading(false);
            return;
          }
          // Recover or synthesize permanent user doc if missing
          const fallbackProf: UserProfile = {
            userId: currentUser.uid,
            aliasIds: [currentUser.uid],
            fullName: currentUser.displayName || 'Surgeon Trainee',
            email: cleanEmail,
            country: 'Germany',
            medicalQualification: 'MD / MBBS',
            currentPosition: 'Surgical Trainee',
            specialty: 'General Surgery',
            hospitals: '',
            biography: '',
            profilePhotoUrl: currentUser.photoURL || '',
            role: cleanEmail === SUPER_ADMIN_EMAIL ? 'super_admin' : 'normal_user',
            preferredLanguage: language,
            theme: 'light',
            emailVerified: true,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const recovered = await withAuthTimeout(unifyEmailProfile(fallbackProf, currentUser.uid), 4000).catch(
            () => fallbackProf
          );
          setDoc(userDocRef, cleanPayload(recovered), { merge: true }).catch(() => {});
          if (!active) return;
          setProfile(recovered);
          saveActiveProfileCaches(recovered);
        }
      } catch (err) {
        console.warn('Firestore profile fetch fallback:', err);
        if (!cachedProfile && active) {
          const fallbackProf: UserProfile = {
            userId: currentUser.uid,
            aliasIds: [currentUser.uid],
            fullName: currentUser.displayName || cleanEmail.split('@')[0] || 'Surgeon Trainee',
            email: cleanEmail,
            country: 'Germany',
            medicalQualification: 'MD / MBBS',
            currentPosition: 'Surgical Trainee',
            specialty: 'General Surgery',
            hospitals: '',
            biography: '',
            profilePhotoUrl: currentUser.photoURL || '',
            role: cleanEmail === SUPER_ADMIN_EMAIL ? 'super_admin' : 'normal_user',
            preferredLanguage: language,
            theme: 'light',
            emailVerified: true,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setProfile(fallbackProf);
          saveActiveProfileCaches(fallbackProf);
        }
      } finally {
        window.clearTimeout(safetyTimer);
        if (active) setLoading(false);
      }
    });

    return () => {
      active = false;
      window.clearTimeout(safetyTimer);
      unsubAuth();
    };
  }, []);

  // Real-time listener for current user's profile updates & admin deletion
  useEffect(() => {
    const authUid = auth.currentUser?.uid;
    const currentUid = authUid || profile?.userId;
    if (!authUid || !currentUid) return;

    try {
      const unsubUser = onSnapshot(
        doc(db, 'users', currentUid),
        (docSnap) => {
          if (!docSnap.exists() && profile && !accountDeletedByAdmin && registeringUidRef.current !== currentUid) {
            // Confirm tombstone before locking out so transient network misses don't log users out
            getDoc(doc(db, 'deleted_users', currentUid))
              .then(tomb => {
                if (tomb.exists()) {
                  setAccountDeletedByAdmin(true);
                  logout();
                }
              })
              .catch(() => {});
            return;
          }
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            if (data.deletedByAdmin === true || data.status === 'deleted') {
              setAccountDeletedByAdmin(true);
              logout();
              return;
            }
            setProfile(prev => {
              if (!prev) return { ...data, status: 'active', emailVerified: true };
              const mergedAliases = Array.from(
                new Set([...(prev.aliasIds || []), ...(data.aliasIds || []), data.userId || currentUid, prev.userId].filter(Boolean))
              );
              const merged: UserProfile = {
                ...prev,
                ...data,
                userId: data.userId || prev.userId || currentUid,
                aliasIds: mergedAliases,
                emailVerified: true,
                status: 'active',
                followers: Array.isArray(data.followers) ? data.followers : (prev.followers || []),
                following: Array.isArray(data.following) ? data.following : (prev.following || []),
                pendingFollowRequests: Array.isArray(data.pendingFollowRequests)
                  ? data.pendingFollowRequests
                  : (prev.pendingFollowRequests || []),
                followersCount: Array.isArray(data.followers)
                  ? data.followers.length
                  : (Number(data.followersCount) || 0),
                followingCount: Array.isArray(data.following)
                  ? data.following.length
                  : (Number(data.followingCount) || 0),
              };
              const unchanged =
                prev.fullName === merged.fullName &&
                prev.specialty === merged.specialty &&
                prev.hospitals === merged.hospitals &&
                prev.biography === merged.biography &&
                prev.profilePhotoUrl === merged.profilePhotoUrl &&
                prev.requireApprovalToFollow === merged.requireApprovalToFollow &&
                prev.showProgressStats === merged.showProgressStats &&
                prev.showPortfolioToFollowers === merged.showPortfolioToFollowers &&
                JSON.stringify(prev.aliasIds || []) === JSON.stringify(merged.aliasIds || []) &&
                JSON.stringify(prev.followers || []) === JSON.stringify(merged.followers || []) &&
                JSON.stringify(prev.following || []) === JSON.stringify(merged.following || []) &&
                JSON.stringify(prev.pendingFollowRequests || []) === JSON.stringify(merged.pendingFollowRequests || []) &&
                prev.totalHours === merged.totalHours &&
                prev.totalProcedures === merged.totalProcedures &&
                prev.verifiedHours === merged.verifiedHours &&
                prev.verifiedProcedures === merged.verifiedProcedures &&
                prev.publishedCasesCount === merged.publishedCasesCount;

              if (unchanged) return prev;
              saveActiveProfileCaches(merged);
              return merged;
            });
          }
        },
        (err) => {
          console.warn('User realtime sync notice:', err);
        }
      );

      const unsubTombstone = onSnapshot(
        doc(db, 'deleted_users', currentUid),
        (tombSnap) => {
          if (tombSnap.exists()) {
            setAccountDeletedByAdmin(true);
            logout();
          }
        },
        () => {}
      );

      return () => {
        unsubUser();
        unsubTombstone();
      };
    } catch (e) {
      console.warn('Could not attach user status listener:', e);
    }
  }, [user?.uid, profile?.userId]);

  // Scoped Real-Time Listener for Notifications (ONLY when signed in; strictly respects privacy & minimizes reads)
  useEffect(() => {
    const authUid = auth.currentUser?.uid || user?.uid;
    if (!authUid) {
      setNotifications([]);
      return;
    }

    const notifSources = {
      personal: [] as AppNotification[],
      broadcasts: [] as AppNotification[],
      legacyBroadcasts: [] as AppNotification[],
    };

    const publishMergedNotifs = () => {
      const map = new Map<string, AppNotification>();
      for (const list of [notifSources.personal, notifSources.broadcasts, notifSources.legacyBroadcasts]) {
        for (const item of list) {
          if (item?.id) map.set(item.id, item);
        }
      }
      const merged = Array.from(map.values()).sort(
        (a, b) =>
          getTimestampMs((b as any).createdAtServer || b.createdAt) -
          getTimestampMs((a as any).createdAtServer || a.createdAt)
      );
      setNotifications(merged);
      saveLocalNotifications(merged);
    };

    const unsubs: (() => void)[] = [];

    try {
      // 1. Notifications addressed directly to this user's Firebase UID
      const personalQuery = query(
        collection(db, 'notifications'),
        where('targetUserId', '==', authUid),
        limit(40)
      );
      unsubs.push(
        onSnapshot(
          personalQuery,
          (snap) => {
            notifSources.personal = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
            publishMergedNotifs();
          },
          (e) => {
            if (!isFirestoreQuotaError(e)) console.warn('Personal notifications note:', e);
          }
        )
      );

      // 2. Platform-wide admin broadcasts (explicit flag)
      const broadcastQuery = query(
        collection(db, 'notifications'),
        where('isBroadcast', '==', true),
        limit(20)
      );
      unsubs.push(
        onSnapshot(
          broadcastQuery,
          (snap) => {
            notifSources.broadcasts = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
            publishMergedNotifs();
          },
          (e) => {
            if (!isFirestoreQuotaError(e)) console.warn('Broadcast notifications note:', e);
          }
        )
      );

      // 3. Backward-compatibility listener for legacy untagged admin broadcasts (excludes private administrative targeted docs)
      const legacyBroadcastQuery = query(
        collection(db, 'notifications'),
        where('category', 'in', ['general', 'urgent', 'clinical', 'administrative', 'announcement', 'maintenance', 'update']),
        limit(15)
      );
      unsubs.push(
        onSnapshot(
          legacyBroadcastQuery,
          (snap) => {
            notifSources.legacyBroadcasts = snap.docs
              .map(d => ({ id: d.id, ...(d.data() as any) }) as AppNotification)
              .filter(n => !n.targetUserId);
            publishMergedNotifs();
          },
          () => {}
        )
      );
    } catch (e) {
      console.warn('Could not attach notifications listeners:', e);
    }

    return () => {
      unsubs.forEach(u => u());
    };
  }, [user?.uid]);

  // Real-time bounded listener for user replies (only needed by Super Admin)
  useEffect(() => {
    const authUid = auth.currentUser?.uid || user?.uid;
    const isAdmin =
      Boolean(authUid) &&
      (profile?.role === 'super_admin' || user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL);
    if (!isAdmin) return;
    try {
      const repliesQuery = query(
        collection(db, 'notification_replies'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const unsubReplies = onSnapshot(
        repliesQuery,
        (snap) => {
          const fetchedReplies: NotificationReply[] = [];
          snap.forEach((d) => {
            fetchedReplies.push({ id: d.id, ...(d.data() as any) });
          });
          fetchedReplies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setNotificationReplies(fetchedReplies);
          saveLocalReplies(fetchedReplies);
        },
        () => {}
      );

      return () => unsubReplies();
    } catch {
      // ignore
    }
  }, [profile?.role, user?.email, user?.uid]);

  // Broadcast Notification to all users (strictly Admin)
  const broadcastNotification = async (notif: { title: string; message: string; category: AppNotification['category'] }) => {
    const isSuperAdmin = user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL || profile?.role === 'super_admin';
    if (!isSuperAdmin) {
      throw new Error('Access denied: Broadcasting notifications is strictly reserved for system administrators.');
    }

    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: notif.title,
      message: notif.message,
      category: notif.category,
      type: 'admin_broadcast',
      isBroadcast: true,
      senderUserId: auth.currentUser?.uid || profile?.userId,
      senderEmail: user?.email || profile?.email || SUPER_ADMIN_EMAIL,
      senderName: profile?.fullName || 'SurgiTrack Administration',
      createdAt: new Date().toISOString(),
      readByUserIds: [],
    };

    try {
      await setDoc(doc(db, 'notifications', newNotif.id), cleanPayload({
        ...newNotif,
        createdAtServer: serverTimestamp(),
      }));
    } catch (e) {
      console.warn('Firestore notification broadcast note:', e);
    }

    const current = getLocalNotifications();
    const updated = [newNotif, ...current.filter(n => n.id !== newNotif.id)];
    setNotifications(updated);
    saveLocalNotifications(updated);
  };

  // Reply to admin notification
  const replyToNotification = async (notificationId: string, title: string, replyMessage: string) => {
    if (!replyMessage.trim() || !auth.currentUser?.uid) return;

    const reply: NotificationReply = {
      id: 'reply_' + Date.now(),
      notificationId,
      notificationTitle: title,
      userId: auth.currentUser.uid,
      userEmail: profile?.email || user?.email || '',
      userName: profile?.fullName || 'Surgeon Trainee',
      replyMessage: replyMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'notification_replies', reply.id), reply);
    } catch (e) {
      console.warn('Firestore notification reply note:', e);
    }

    const current = getLocalReplies();
    const updated = [reply, ...current];
    setNotificationReplies(updated);
    saveLocalReplies(updated);
  };

  const myUids = React.useMemo(
    () =>
      Array.from(
        new Set([profile?.userId, user?.uid, ...(profile?.aliasIds || [])].filter(Boolean))
      ) as string[],
    [profile?.userId, user?.uid, profile?.aliasIds]
  );

  const markNotificationAsRead = async (notificationId: string) => {
    await markNotificationsAsRead([notificationId]);
  };

  // Batch mark multiple notifications as read in Firestore using arrayUnion (atomic & idempotent)
  const markNotificationsAsRead = async (notificationIds: string[]) => {
    const uid = auth.currentUser?.uid || profile?.userId;
    if (!uid || notificationIds.length === 0) return;

    const targetIdsSet = new Set(notificationIds);
    const toUpdate = notifications.filter(
      n => targetIdsSet.has(n.id) && !(n.readByUserIds || []).some(id => myUids.includes(id))
    );
    if (toUpdate.length === 0) return;

    const idsToAdd = Array.from(new Set([uid, ...myUids]));

    const updatedList = notifications.map(n => {
      if (!targetIdsSet.has(n.id)) return n;
      const existingReads = n.readByUserIds || [];
      return { ...n, readByUserIds: Array.from(new Set([...existingReads, ...idsToAdd])) };
    });
    setNotifications(updatedList);
    saveLocalNotifications(updatedList);

    try {
      const batch = writeBatch(db);
      for (const n of toUpdate) {
        batch.update(doc(db, 'notifications', n.id), {
          readByUserIds: arrayUnion(...idsToAdd),
        });
      }
      await batch.commit();
    } catch (e) {
      for (const n of toUpdate) {
        try {
          await updateDoc(doc(db, 'notifications', n.id), {
            readByUserIds: arrayUnion(...idsToAdd),
          });
        } catch {
          // ignore missing doc
        }
      }
    }
  };

  const unreadNotificationCount = myUids.length > 0
    ? notifications.filter(
        n =>
          (!n.targetUserId || myUids.includes(n.targetUserId)) &&
          !(n.readByUserIds || []).some(id => myUids.includes(id))
      ).length
    : 0;

  const loginWithGoogle = async () => {
    await authPersistenceReady;
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const u = res.user;
      setUser(u);

      const cleanEmail = (u.email || '').toLowerCase().trim();
      const ref = doc(db, 'users', u.uid);
      const snap = await getDoc(ref);
      let baseProf: UserProfile;
      if (snap.exists()) {
        baseProf = snap.data() as UserProfile;
        if (baseProf.deletedByAdmin || baseProf.status === 'deleted') {
          setAccountDeletedByAdmin(true);
          await fbSignOut(auth).catch(() => {});
          throw new Error(
            language === 'ar'
              ? 'لقد تم حذف حسابك من إدارة الموقع.'
              : 'Your account has been deleted by the administration.'
          );
        }
        if (!baseProf.profilePhotoUrl && u.photoURL) {
          baseProf.profilePhotoUrl = u.photoURL;
        }
      } else {
        baseProf = {
          userId: u.uid,
          aliasIds: [u.uid],
          fullName: u.displayName || 'Surgeon Trainee',
          email: cleanEmail,
          country: 'Germany',
          medicalQualification: 'MD / MBBS',
          currentPosition: 'Surgical Trainee',
          specialty: 'General Surgery',
          hospitals: '',
          biography: 'Surgical trainee portfolio.',
          profilePhotoUrl: u.photoURL || '',
          role: cleanEmail === SUPER_ADMIN_EMAIL ? 'super_admin' : 'normal_user',
          preferredLanguage: language,
          theme: 'light',
          emailVerified: true,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      const userProf = await unifyEmailProfile(
        { ...baseProf, emailVerified: true, status: 'active' },
        u.uid
      );
      await setDoc(ref, cleanPayload(userProf), { merge: true });
      setProfile(userProf);
      saveActiveProfileCaches(userProf);
    } catch (err: any) {
      if (err?.message?.includes('حذف حسابك') || err?.message?.includes('deleted by the administration')) {
        throw err;
      }
      throw new Error(getFirebaseAuthErrorMessage(err, language, 'login'));
    }
  };

  const registerWithEmail = async (data: Partial<UserProfile> & { password: string }) => {
    const { password, email, fullName, profilePhotoUrl, ...rest } = data;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      throw new Error(
        language === 'ar'
          ? 'يرجى إدخال عنوان بريد إلكتروني صحيح.'
          : 'Please enter a valid email address.'
      );
    }
    if (!password || password.length < 6) {
      throw new Error(
        language === 'ar'
          ? 'كلمة المرور يجب ألا تقل عن 6 أحرف.'
          : 'Password must be at least 6 characters long.'
      );
    }
    if (!fullName || !fullName.trim()) {
      throw new Error(
        language === 'ar'
          ? 'يرجى إدخال الاسم الكامل.'
          : 'Please enter your full name.'
      );
    }

    await authPersistenceReady;

    let credUser: User;
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      credUser = cred.user;
      registeringUidRef.current = credUser.uid;
      await updateProfile(credUser, { displayName: fullName.trim() }).catch(() => {});
    } catch (err: any) {
      throw new Error(getFirebaseAuthErrorMessage(err, language, 'register'));
    }

    try {
      const uid = credUser.uid;
      let finalPhotoUrl = profilePhotoUrl || '';
      if (finalPhotoUrl && finalPhotoUrl.startsWith('data:')) {
        finalPhotoUrl = await uploadMediaToStorage(uid, 'avatars', finalPhotoUrl, 'avatar').catch(() => finalPhotoUrl);
      }

      const isAdmin = cleanEmail === SUPER_ADMIN_EMAIL;
      const nowIso = new Date().toISOString();

      const baseProfile: UserProfile = {
        userId: uid,
        aliasIds: [uid],
        fullName: fullName.trim(),
        email: cleanEmail,
        country: rest.country || 'Germany',
        medicalQualification: rest.medicalQualification || 'MD / MBBS',
        currentPosition: rest.currentPosition || 'Surgical Trainee',
        specialty: rest.specialty || 'General Surgery',
        hospitals: rest.hospitals || '',
        biography: rest.biography || '',
        profilePhotoUrl: finalPhotoUrl,
        role: isAdmin ? 'super_admin' : 'normal_user',
        preferredLanguage: language,
        theme: 'light',
        emailVerified: true,
        status: 'active',
        followers: [],
        following: [],
        followersCount: 0,
        followingCount: 0,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // Merge any historical alias doc if email existed in legacy data before
      const finalProfile = await unifyEmailProfile(baseProfile, uid);
      await setDoc(doc(db, 'users', uid), cleanPayload(finalProfile), { merge: true });

      setUser(credUser);
      setProfile(finalProfile);
      saveActiveProfileCaches(finalProfile);
    } finally {
      registeringUidRef.current = null;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      throw new Error(
        language === 'ar'
          ? 'يرجى إدخال عنوان بريد إلكتروني صحيح.'
          : 'Please enter a valid email address.'
      );
    }
    if (!pass) {
      throw new Error(
        language === 'ar'
          ? 'يرجى إدخال كلمة المرور.'
          : 'Please enter your password.'
      );
    }

    await authPersistenceReady;

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const u = cred.user;
      setUser(u);

      const ref = doc(db, 'users', u.uid);
      const snap = await getDoc(ref);

      let loadedProfile: UserProfile;
      if (snap.exists()) {
        loadedProfile = snap.data() as UserProfile;
        if (loadedProfile.deletedByAdmin || loadedProfile.status === 'deleted') {
          setAccountDeletedByAdmin(true);
          await fbSignOut(auth).catch(() => {});
          setUser(null);
          setProfile(null);
          localStorage.removeItem(LOCAL_PROFILE_KEY);
          throw new Error(
            language === 'ar'
              ? 'لقد تم حذف حسابك من إدارة الموقع.'
              : 'Your account has been deleted by the administration.'
          );
        }
      } else {
        loadedProfile = {
          userId: u.uid,
          aliasIds: [u.uid],
          fullName: u.displayName || 'Surgeon Trainee',
          email: cleanEmail,
          country: 'Germany',
          medicalQualification: 'MD / MBBS',
          currentPosition: 'Surgical Trainee',
          specialty: 'General Surgery',
          hospitals: '',
          biography: '',
          profilePhotoUrl: u.photoURL || '',
          role: cleanEmail === SUPER_ADMIN_EMAIL ? 'super_admin' : 'normal_user',
          preferredLanguage: language,
          theme: 'light',
          emailVerified: true,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      const unified = await unifyEmailProfile(
        { ...loadedProfile, emailVerified: true, status: 'active' },
        u.uid
      );
      await setDoc(ref, cleanPayload(unified), { merge: true });
      setProfile(unified);
      saveActiveProfileCaches(unified);
    } catch (err: any) {
      if (err?.message?.includes('إدارة الموقع') || err?.message?.includes('deleted by the administration')) {
        throw err;
      }
      throw new Error(getFirebaseAuthErrorMessage(err, language, 'login'));
    }
  };

  const sendPasswordReset = async (email: string) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      throw new Error(
        language === 'ar'
          ? 'يرجى إدخال عنوان بريد إلكتروني صحيح.'
          : 'Please enter a valid email address.'
      );
    }
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (err: any) {
      throw new Error(getFirebaseAuthErrorMessage(err, language, 'reset'));
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error(
        language === 'ar'
          ? 'يجب تسجيل الدخول أولاً لتغيير كلمة المرور.'
          : 'You must be signed in to change your password.'
      );
    }
    if (!newPassword || newPassword.length < 6) {
      throw new Error(
        language === 'ar'
          ? 'كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف.'
          : 'New password must be at least 6 characters long.'
      );
    }

    try {
      if (currentPassword && currentUser.email) {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
      }
      await updatePassword(currentUser, newPassword);
    } catch (err: any) {
      throw new Error(getFirebaseAuthErrorMessage(err, language, 'password_change'));
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Firebase sign out note:', e);
    }
    setUser(null);
    setProfile(null);
    setNotifications([]);
    setNotificationReplies([]);
    localStorage.removeItem(LOCAL_PROFILE_KEY);
    localStorage.removeItem(LOCAL_NOTIFS_KEY);
    localStorage.removeItem(LOCAL_REPLIES_KEY);
  };

  const dismissDeletedAccountModal = () => {
    setAccountDeletedByAdmin(false);
  };

  const deleteCurrentAccount = async () => {
    const uid = auth.currentUser?.uid || user?.uid || profile?.userId;

    if (uid) {
      try {
        await deleteDoc(doc(db, 'users', uid));
        await deleteDoc(doc(db, 'accounts', uid)).catch(() => {});
      } catch (e) {
        console.warn('Firestore delete note:', e);
      }
    }

    if (auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
      } catch (e) {
        console.warn('Auth user delete note:', e);
      }
    }

    setUser(null);
    setProfile(null);
    setNotifications([]);
    setNotificationReplies([]);
    if (uid) {
      localStorage.removeItem(PROFILE_UID_CACHE_PREFIX + uid);
    }
    localStorage.removeItem(LOCAL_PROFILE_KEY);
    localStorage.removeItem(LOCAL_NOTIFS_KEY);
    localStorage.removeItem(LOCAL_REPLIES_KEY);
  };

  const patchProfileLocal = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return prev;
      const merged: UserProfile = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveActiveProfileCaches(merged);
      return merged;
    });
  };

  // Safe partial update: only writes updated fields with merge:true (never overwrites unrelated user data)
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const nowIso = new Date().toISOString();
    const partialPatch = cleanPayload({ ...data, updatedAt: nowIso });
    const updated: UserProfile = {
      ...profile,
      ...partialPatch,
    };
    setProfile(updated);
    saveActiveProfileCaches(updated);

    const targetUid = auth.currentUser?.uid || updated.userId;
    if (!targetUid) return;

    try {
      await setDoc(doc(db, 'users', targetUid), partialPatch, { merge: true });
      if (data.fullName && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: data.fullName }).catch(() => {});
      }
    } catch (e) {
      console.warn('Failed to update cloud profile:', e);
    }
  };

  const updateProfilePhoto = async (photoDataUrl: string) => {
    const targetUid = auth.currentUser?.uid || profile?.userId || '';
    let storedUrl = photoDataUrl;
    if (photoDataUrl && photoDataUrl.startsWith('data:') && targetUid) {
      storedUrl = await uploadMediaToStorage(targetUid, 'avatars', photoDataUrl, 'avatar').catch(() => photoDataUrl);
    }
    await updateUserProfile({ profilePhotoUrl: storedUrl });
  };

  const getAllRegisteredUsers = async (): Promise<UserProfile[]> => {
    const list: UserProfile[] = [];
    try {
      const snap = await getDocs(collection(db, 'users'));
      snap.forEach(d => {
        const uData = d.data() as UserProfile;
        if (!uData.deletedByAdmin && uData.status !== 'deleted' && !uData.disabled) {
          list.push({ ...uData, userId: d.id });
        }
      });
    } catch (e) {
      console.warn('Firestore users listing note:', e);
    }

    if (profile && !profile.deletedByAdmin && profile.status !== 'deleted' && !list.some(u => u.userId === profile.userId)) {
      list.push(profile);
    }

    return list;
  };

  // Admin deletes user account: sets tombstone + status: 'deleted'
  const adminDeleteUserAccount = async (targetUserId: string) => {
    try {
      await setDoc(doc(db, 'deleted_users', targetUserId), {
        userId: targetUserId,
        deletedAt: new Date().toISOString(),
        deletedBy: SUPER_ADMIN_EMAIL,
        reason: 'Account removed by site administration.',
      });

      await setDoc(
        doc(db, 'users', targetUserId),
        {
          status: 'deleted',
          deletedByAdmin: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      await deleteDoc(doc(db, 'accounts', targetUserId)).catch(() => {});

      try {
        const commCasesSnap = await getDocs(
          query(collection(db, 'communityCases'), where('userId', '==', targetUserId))
        );
        for (const cDoc of commCasesSnap.docs) {
          await deleteDoc(doc(db, 'communityCases', cDoc.id));
        }
        const storiesSnap = await getDocs(
          query(collection(db, 'communityStories'), where('authorId', '==', targetUserId))
        );
        for (const sDoc of storiesSnap.docs) {
          await deleteDoc(doc(db, 'communityStories', sDoc.id));
        }
      } catch (e) {
        console.warn('Could not clean up community cases for deleted user:', e);
      }

      try {
        await addDoc(collection(db, 'audit_logs'), {
          action: 'admin_delete_account',
          targetUserId,
          deletedBy: user?.email || profile?.email || SUPER_ADMIN_EMAIL,
          timestamp: new Date().toISOString(),
          message: 'Your SurgiTrack iLog account has been deleted by the platform administration. You no longer have access to this account.',
        });
      } catch (e) {
        console.warn('Audit log write error:', e);
      }

      try {
        await setDoc(doc(db, 'notifications', `del_${targetUserId}`), {
          id: `del_${targetUserId}`,
          targetUserId,
          title: 'Account Deletion Notice',
          message: 'Your SurgiTrack iLog account has been deleted by the platform administration. You no longer have access to this account.',
          category: 'administrative',
          type: 'admin_broadcast',
          senderUserId: auth.currentUser?.uid || profile?.userId || targetUserId,
          senderName: 'SurgiTrack Administration',
          senderEmail: SUPER_ADMIN_EMAIL,
          createdAt: new Date().toISOString(),
          createdAtServer: serverTimestamp(),
          readByUserIds: [],
        });
      } catch (e) {
        console.warn('Deletion notification write error:', e);
      }
    } catch (e) {
      console.warn('Admin delete firestore error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        sendPasswordReset,
        changePassword,
        logout,
        deleteCurrentAccount,
        updateUserProfile,
        updateProfilePhoto,
        setLanguage,
        language,
        getAllRegisteredUsers,
        adminDeleteUserAccount,
        accountDeletedByAdmin,
        dismissDeletedAccountModal,
        notifications,
        unreadNotificationCount,
        broadcastNotification,
        replyToNotification,
        notificationReplies,
        markNotificationAsRead,
        markNotificationsAsRead,
        patchProfileLocal,
        myUids,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
