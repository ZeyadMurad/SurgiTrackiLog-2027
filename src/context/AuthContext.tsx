import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  deleteUser,
  sendEmailVerification,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, getTimestampMs, isFirestoreQuotaError, safeSetLocalStorage } from '../lib/firebase';
import { UserProfile, SupportedLanguage, AppNotification, NotificationReply } from '../types';

interface StoredAccountRecord {
  uid: string;
  email: string;
  passwordHash: string;
  fullName: string;
  profile: UserProfile;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (data: Partial<UserProfile> & { password: string }) => Promise<void>;
  resetPasswordDirect: (email: string, newPass: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteCurrentAccount: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateProfilePhoto: (photoDataUrl: string) => Promise<void>;
  setLanguage: (lang: SupportedLanguage) => void;
  language: SupportedLanguage;
  getAllRegisteredUsers: () => Promise<UserProfile[]>;
  adminDeleteUserAccount: (userId: string) => Promise<void>;

  // Real Email Link Verification (Strict 30-Second Server-Enforced Expiration)
  sendVerificationLink: (email: string) => Promise<{ success: boolean; expiresInSeconds: number; verificationUrl?: string; message: string }>;
  verifyTokenLink: (token: string) => Promise<{ valid: boolean; email?: string; error?: string }>;
  checkVerificationStatus: (email?: string) => Promise<boolean>;
  markAccountVerified: (email: string) => Promise<void>;

  // Real-time Admin Deletion Lockout
  accountDeletedByAdmin: boolean;
  dismissDeletedAccountModal: () => void;

  // Real-time Admin Notifications & Replies
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_PROFILE_KEY = 'surgitrack_cached_profile';
const LOCAL_ACCOUNTS_KEY = 'surgitrack_registered_accounts';
const LOCAL_LANG_KEY = 'surgitrack_language';
const LOCAL_NOTIFS_KEY = 'surgitrack_local_notifications';
const LOCAL_REPLIES_KEY = 'surgitrack_local_replies';
const SUPER_ADMIN_EMAIL = 'zeadmorud2030@gmail.com';

// Cryptographic SHA-256 hash
async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_surgitrack_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      hash = (hash << 5) - hash + password.charCodeAt(i);
      hash |= 0;
    }
    return 'h_' + Math.abs(hash);
  }
}

function getLocalAccounts(): Record<string, StoredAccountRecord> {
  try {
    const data = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLocalAccount(account: StoredAccountRecord) {
  const accounts = getLocalAccounts();
  accounts[account.email.toLowerCase()] = account;
  safeSetLocalStorage(LOCAL_ACCOUNTS_KEY, accounts);
}

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
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_PROFILE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem(LOCAL_LANG_KEY) as SupportedLanguage) || 'en';
  });

  // Real-time admin deletion lockout state
  const [accountDeletedByAdmin, setAccountDeletedByAdmin] = useState(false);

  // Notifications and replies state
  const [notifications, setNotifications] = useState<AppNotification[]>(getLocalNotifications());
  const [notificationReplies, setNotificationReplies] = useState<NotificationReply[]>(getLocalReplies());

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

  // Helper: Find & merge all non-deleted Firestore user profiles sharing the same normalized email
  const unifyEmailProfile = async (
    baseProfile: UserProfile,
    activeUid: string
  ): Promise<UserProfile> => {
    const cleanEmail = (baseProfile.email || '').trim().toLowerCase();
    if (!cleanEmail) return { ...baseProfile, userId: activeUid, aliasIds: Array.from(new Set([activeUid, ...(baseProfile.aliasIds || [])])) };

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
          aliasIds: Array.from(new Set([activeUid, ...(baseProfile.aliasIds || [])])),
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
        baseProfile.hospitals ||
        'University Medical Center';

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
        emailVerified: Boolean(
          baseProfile.emailVerified ||
          matchingDocs.some(m => m.emailVerified) ||
          cleanEmail === SUPER_ADMIN_EMAIL
        ),
        status:
          baseProfile.emailVerified || matchingDocs.some(m => m.emailVerified || m.status === 'active') || cleanEmail === SUPER_ADMIN_EMAIL
            ? 'active'
            : (baseProfile.status || 'unverified'),
        role: cleanEmail === SUPER_ADMIN_EMAIL ? 'super_admin' : (baseProfile.role || 'normal_user'),
        updatedAt: new Date().toISOString(),
      };

      // Sync unified aliases & social arrays back to active doc + any accessible sibling docs
      await setDoc(doc(db, 'users', activeUid), unified, { merge: true }).catch(() => {});
      for (const m of matchingDocs) {
        if (m.userId !== activeUid) {
          await setDoc(
            doc(db, 'users', m.userId),
            {
              aliasIds: allAliases,
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
              ...(richestPhoto && !m.profilePhotoUrl ? { profilePhotoUrl: richestPhoto } : {}),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch(() => {});
        }
      }

      return unified;
    } catch (err) {
      console.warn('Email profile unification note:', err);
      return {
        ...baseProfile,
        userId: activeUid,
        aliasIds: Array.from(new Set([activeUid, ...(baseProfile.aliasIds || [])])),
      };
    }
  };

  // Check initial session & set up Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            let data = docSnap.data() as UserProfile;
            // Check if user was deleted or flagged by admin
            if (data.deletedByAdmin || data.status === 'deleted') {
              setAccountDeletedByAdmin(true);
              logout();
              return;
            }
            if (currentUser.email === SUPER_ADMIN_EMAIL && data.role !== 'super_admin') {
              data.role = 'super_admin';
              await setDoc(userDocRef, { role: 'super_admin' }, { merge: true });
            }
            if (currentUser.emailVerified && !data.emailVerified) {
              data.emailVerified = true;
              data.status = 'active';
            }
            data = await unifyEmailProfile(data, currentUser.uid);
            setProfile(data);
            safeSetLocalStorage(LOCAL_PROFILE_KEY, data);
          }
        } catch (err) {
          console.warn('Firestore profile fetch error:', err);
        }
      } else {
        const cached = localStorage.getItem(LOCAL_PROFILE_KEY);
        if (cached) {
          try {
            const p = JSON.parse(cached) as UserProfile;
            if (p.deletedByAdmin || p.status === 'deleted') {
              setAccountDeletedByAdmin(true);
              logout();
              return;
            }
            setProfile(p);
            setUser({
              uid: p.userId,
              email: p.email,
              displayName: p.fullName,
            } as any);
          } catch {
            setProfile(null);
            setUser(null);
          }
        } else {
          setProfile(null);
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time listener for current user's profile updates & admin deletion
  useEffect(() => {
    const currentUid = profile?.userId || user?.uid;
    if (!currentUid) return;

    try {
      // 1. Listen to user doc for deletions AND live social/credential updates
      const unsubUser = onSnapshot(doc(db, 'users', currentUid), (docSnap) => {
        if (!docSnap.exists() && profile && !accountDeletedByAdmin) {
          setAccountDeletedByAdmin(true);
          logout();
        } else if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          if (data.deletedByAdmin === true || data.status === 'deleted') {
            setAccountDeletedByAdmin(true);
            logout();
            return;
          }
          setProfile(prev => {
            if (!prev) return data;
            const mergedAliases = Array.from(
              new Set([...(prev.aliasIds || []), ...(data.aliasIds || []), data.userId || currentUid, prev.userId].filter(Boolean))
            );
            const merged: UserProfile = {
              ...prev,
              ...data,
              userId: data.userId || prev.userId || currentUid,
              aliasIds: mergedAliases,
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
              prev.emailVerified === merged.emailVerified &&
              prev.status === merged.status &&
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
            safeSetLocalStorage(LOCAL_PROFILE_KEY, merged);
            return merged;
          });
        }
      }, (err) => {
        console.warn('User realtime sync notice:', err);
      });

      // 2. Listen to deleted_users tombstone collection
      const unsubTombstone = onSnapshot(doc(db, 'deleted_users', currentUid), (tombSnap) => {
        if (tombSnap.exists()) {
          setAccountDeletedByAdmin(true);
          logout();
        }
      }, () => {});

      return () => {
        unsubUser();
        unsubTombstone();
      };
    } catch (e) {
      console.warn('Could not attach user status listener:', e);
    }
  }, [profile?.userId, user?.uid]);

  // Real-time bounded listener for notifications (admin broadcasts & social alerts)
  useEffect(() => {
    try {
      const notifsQuery = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const unsubNotifs = onSnapshot(notifsQuery, (snap) => {
        const fetched: AppNotification[] = [];
        snap.forEach((d) => {
          fetched.push({ id: d.id, ...(d.data() as any) });
        });
        // Sort newest first using serverTimestamp when available
        fetched.sort(
          (a, b) =>
            getTimestampMs((b as any).createdAtServer || b.createdAt) -
            getTimestampMs((a as any).createdAtServer || a.createdAt)
        );
        setNotifications(fetched);
        saveLocalNotifications(fetched);
      }, (e) => {
        if (!isFirestoreQuotaError(e)) {
          console.warn('Notifications snapshot error:', e);
        }
      });

      return () => {
        unsubNotifs();
      };
    } catch (e) {
      console.warn('Could not attach notifications listeners:', e);
    }
  }, []);

  // Real-time bounded listener for user replies (only needed by Super Admin)
  useEffect(() => {
    const isAdmin = profile?.role === 'super_admin' || user?.email?.toLowerCase() === 'zeadmorud2030@gmail.com';
    if (!isAdmin) return;
    try {
      const repliesQuery = query(
        collection(db, 'notification_replies'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const unsubReplies = onSnapshot(repliesQuery, (snap) => {
        const fetchedReplies: NotificationReply[] = [];
        snap.forEach((d) => {
          fetchedReplies.push({ id: d.id, ...(d.data() as any) });
        });
        fetchedReplies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotificationReplies(fetchedReplies);
        saveLocalReplies(fetchedReplies);
      }, () => {});

      return () => unsubReplies();
    } catch {
      // ignore
    }
  }, [profile?.role, user?.email]);

  // Send Real Verification Link (Strict 30-Second Server-Enforced Expiration & Native Delivery)
  const sendVerificationLink = async (email: string) => {
    // 1. Dispatch through Firebase Auth official mail servers if user session exists
    if (auth.currentUser && auth.currentUser.email?.toLowerCase() === email.trim().toLowerCase()) {
      try {
        await sendEmailVerification(auth.currentUser);
        console.log('[SurgiTrack Auth] Native Firebase verification email sent to', email);
      } catch (fbErr) {
        console.warn('[SurgiTrack Auth] Firebase sendEmailVerification note:', fbErr);
      }
    }

    // 2. Dispatch server-enforced 30-second token verification link
    const res = await fetch('/api/auth/send-verification-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to dispatch verification link.');
    }

    return {
      success: true,
      expiresInSeconds: data.expiresInSeconds || 30,
      verificationUrl: data.verificationUrl,
      message: data.message,
    };
  };

  // Validate Verification Token Link from Clicked Email URL
  const verifyTokenLink = async (token: string) => {
    const res = await fetch(`/api/auth/verify-token?token=${encodeURIComponent(token)}`);
    const data = await res.json();

    if (!res.ok || !data.valid) {
      throw new Error(data.error || 'This verification link has expired. Please request a new verification link.');
    }

    if (data.email) {
      await markAccountVerified(data.email);
    }

    return {
      valid: true,
      email: data.email,
      message: data.message,
    };
  };

  // Check verification status from server
  const checkVerificationStatus = async (targetEmail?: string): Promise<boolean> => {
    const emailToCheck = (targetEmail || profile?.email || user?.email || '').trim().toLowerCase();
    if (!emailToCheck) return false;

    if (emailToCheck === SUPER_ADMIN_EMAIL) return true;

    try {
      const res = await fetch(`/api/auth/verification-status?email=${encodeURIComponent(emailToCheck)}`);
      const data = await res.json();
      if (data.verified) {
        await markAccountVerified(emailToCheck);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Mark account as verified consistently across local storage, profile state, and Firestore
  const markAccountVerified = async (verifiedEmail: string) => {
    const cleanEmail = verifiedEmail.trim().toLowerCase();
    const accounts = getLocalAccounts();
    const local = accounts[cleanEmail];

    if (local) {
      local.profile.emailVerified = true;
      local.profile.status = 'active';
      saveLocalAccount(local);
    }

    if (profile && profile.email.toLowerCase() === cleanEmail) {
      const updated: UserProfile = { ...profile, emailVerified: true, status: 'active' };
      setProfile(updated);
      safeSetLocalStorage(LOCAL_PROFILE_KEY, updated);

      const idsToVerify = Array.from(new Set([updated.userId, user?.uid, ...(updated.aliasIds || [])].filter(Boolean))) as string[];
      for (const id of idsToVerify) {
        try {
          await setDoc(doc(db, 'users', id), { emailVerified: true, status: 'active' }, { merge: true });
        } catch (e) {
          console.warn('Firestore user verification update note:', e);
        }
      }
    }
  };

  // Broadcast Notification to all users (strictly Admin)
  const broadcastNotification = async (notif: { title: string; message: string; category: AppNotification['category'] }) => {
    const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL || profile?.role === 'super_admin';
    if (!isSuperAdmin) {
      throw new Error('Access denied: Broadcasting notifications is strictly reserved for system administrators.');
    }

    const newNotif: AppNotification = {
      id: 'notif_' + Date.now(),
      title: notif.title,
      message: notif.message,
      category: notif.category,
      senderEmail: user?.email || profile?.email || SUPER_ADMIN_EMAIL,
      senderName: profile?.fullName || 'SurgiTrack Administration',
      createdAt: new Date().toISOString(),
      readByUserIds: [],
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'notifications', newNotif.id), {
        ...newNotif,
        createdAtServer: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Firestore notification broadcast note:', e);
    }

    // Save locally
    const current = getLocalNotifications();
    const updated = [newNotif, ...current.filter(n => n.id !== newNotif.id)];
    setNotifications(updated);
    saveLocalNotifications(updated);
  };

  // Reply to admin notification
  const replyToNotification = async (notificationId: string, title: string, replyMessage: string) => {
    if (!replyMessage.trim()) return;

    const reply: NotificationReply = {
      id: 'reply_' + Date.now(),
      notificationId,
      notificationTitle: title,
      userId: profile?.userId || user?.uid || 'anonymous',
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

  // Mark single notification as read atomically in Firestore & local state
  const markNotificationAsRead = async (notificationId: string) => {
    await markNotificationsAsRead([notificationId]);
  };

  const myUids = React.useMemo(
    () =>
      Array.from(
        new Set([profile?.userId, user?.uid, ...(profile?.aliasIds || [])].filter(Boolean))
      ) as string[],
    [profile?.userId, user?.uid, profile?.aliasIds]
  );

  // Batch mark multiple notifications as read in Firestore using arrayUnion (atomic & idempotent)
  const markNotificationsAsRead = async (notificationIds: string[]) => {
    const uid = profile?.userId || user?.uid;
    if (!uid || notificationIds.length === 0) return;

    const targetIdsSet = new Set(notificationIds);
    const toUpdate = notifications.filter(
      n => targetIdsSet.has(n.id) && !(n.readByUserIds || []).some(id => myUids.includes(id))
    );
    if (toUpdate.length === 0) return;

    const idsToAdd = Array.from(new Set([uid, ...myUids]));

    // Optimistically update local state & cache immediately
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
      console.warn('Batch mark read update note, falling back to individual updates:', e);
      for (const n of toUpdate) {
        try {
          await updateDoc(doc(db, 'notifications', n.id), {
            readByUserIds: arrayUnion(...idsToAdd),
          });
        } catch { /* ignore individual missing doc */ }
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
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const u = res.user;
    setUser(u);

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
        email: (u.email || '').toLowerCase().trim(),
        country: 'Germany',
        medicalQualification: 'MD / MBBS',
        currentPosition: 'Surgical Trainee',
        specialty: 'General Surgery',
        hospitals: 'University Medical Center',
        biography: 'Surgical trainee portfolio.',
        profilePhotoUrl: u.photoURL || '',
        role: u.email?.toLowerCase() === SUPER_ADMIN_EMAIL ? 'super_admin' : 'normal_user',
        preferredLanguage: language,
        theme: 'light',
        emailVerified: u.emailVerified === true || (u.email || '').toLowerCase() === SUPER_ADMIN_EMAIL,
        status: u.emailVerified === true || (u.email || '').toLowerCase() === SUPER_ADMIN_EMAIL ? 'active' : 'unverified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // SECURITY FIX: `emailVerified` was hardcoded to `true` for ANY authenticated Firebase
    // user, even before Google verified their email — the profile stored in Firestore then
    // claimed a verified status the UI trusts (client-side verification forgery).
    // It is now derived from the actual Firebase token state (admin email stays verified).
    const isVerifiedSession =
      u.emailVerified === true || (u.email || '').toLowerCase() === SUPER_ADMIN_EMAIL;

    const userProf = await unifyEmailProfile(
      { ...baseProf, emailVerified: isVerifiedSession, status: isVerifiedSession ? 'active' : (baseProf.status || 'unverified') },
      u.uid
    );
    await setDoc(ref, userProf, { merge: true });
    setProfile(userProf);
    safeSetLocalStorage(LOCAL_PROFILE_KEY, userProf);
  };

  const registerWithEmail = async (data: Partial<UserProfile> & { password: string }) => {
    const { password, email, fullName, ...rest } = data;
    if (!email) throw new Error('Email is required');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

    const cleanEmail = email.trim().toLowerCase();
    const accounts = getLocalAccounts();

    // Check if email already registered locally OR in Firestore users/accounts across devices
    if (accounts[cleanEmail]) {
      throw new Error(
        language === 'ar'
          ? 'هذا البريد الإلكتروني مسجل بالفعل في منصة SurgiTrack. يرجى تسجيل الدخول مباشرة.'
          : 'This email is already registered. Please proceed to log in.'
      );
    }

    try {
      const [existingUsersSnap, existingAccountsSnap] = await Promise.all([
        getDocs(query(collection(db, 'users'), where('email', '==', cleanEmail))),
        getDocs(query(collection(db, 'accounts'), where('email', '==', cleanEmail))),
      ]);
      const hasActiveCloudUser = existingUsersSnap.docs.some(d => {
        const ud = d.data();
        return !ud.deletedByAdmin && ud.status !== 'deleted';
      });
      if (hasActiveCloudUser || !existingAccountsSnap.empty) {
        throw new Error(
          language === 'ar'
            ? 'هذا البريد الإلكتروني مسجل بالفعل في السحابة. يرجى تسجيل الدخول مباشرة أو استخدام استعادة كلمة المرور.'
            : 'This email is already registered on SurgiTrack. Please log in or reset your password.'
        );
      }
    } catch (dupErr: any) {
      if (dupErr?.message?.includes('already registered') || dupErr?.message?.includes('مسجل بالفعل')) {
        throw dupErr;
      }
    }

    const passwordHash = await hashPassword(password);
    let uid = 'usr_' + Math.abs(cleanEmail.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(36) + '_' + Date.now().toString(36).substring(3);

    // Try Firebase Auth
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      uid = cred.user.uid;
      if (fullName) {
        await updateProfile(cred.user, { displayName: fullName });
      }
      setUser(cred.user);
      if (cleanEmail !== SUPER_ADMIN_EMAIL) {
        try {
          await sendEmailVerification(cred.user);
          console.log('[SurgiTrack Auth] Native email verification dispatched via Google Firebase for', cleanEmail);
        } catch (evErr) {
          console.warn('[SurgiTrack Auth] Initial sendEmailVerification note:', evErr);
        }
      }
    } catch (firebaseErr: any) {
      console.warn('Firebase Auth direct email provider note:', firebaseErr.message);
      await fbSignOut(auth).catch(() => {});
      setUser({
        uid,
        email: cleanEmail,
        displayName: fullName || 'Surgeon',
      } as any);
    }

    const isVerifiedAdmin = cleanEmail === SUPER_ADMIN_EMAIL;

    const newProfile: UserProfile = {
      userId: uid,
      aliasIds: [uid],
      fullName: fullName || 'Surgeon Trainee',
      email: cleanEmail,
      country: rest.country || 'Germany',
      medicalQualification: rest.medicalQualification || 'MD / MBBS',
      currentPosition: rest.currentPosition || 'Surgical Trainee',
      specialty: rest.specialty || 'General Surgery',
      hospitals: rest.hospitals || '',
      biography: rest.biography || '',
      profilePhotoUrl: rest.profilePhotoUrl || '',
      role: isVerifiedAdmin ? 'super_admin' : 'normal_user',
      preferredLanguage: language,
      theme: 'light',
      emailVerified: isVerifiedAdmin,
      status: isVerifiedAdmin ? 'active' : 'unverified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const accountRecord: StoredAccountRecord = {
      uid,
      email: cleanEmail,
      passwordHash,
      fullName: newProfile.fullName,
      profile: newProfile,
      updatedAt: new Date().toISOString(),
    };

    saveLocalAccount(accountRecord);
    setProfile(newProfile);
    safeSetLocalStorage(LOCAL_PROFILE_KEY, newProfile);

    try {
      await setDoc(doc(db, 'users', uid), newProfile);
      await setDoc(doc(db, 'accounts', uid), {
        uid,
        email: cleanEmail,
        passwordHash,
        fullName: newProfile.fullName,
        createdAt: new Date().toISOString(),
      });
    } catch (fsErr) {
      console.warn('Saved account locally, queued for sync:', fsErr);
    }

    // Automatically send 30-second verification link for non-admin accounts (Requirement 4.A)
    if (!isVerifiedAdmin) {
      try {
        await sendVerificationLink(cleanEmail);
      } catch (err) {
        console.warn('Dispatch link warning:', err);
      }
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const inputHash = await hashPassword(pass);

    // 1. Try Firebase Auth
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      setUser(cred.user);
      const ref = doc(db, 'users', cred.user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        let p = snap.data() as UserProfile;
        if (p.deletedByAdmin || p.status === 'deleted') {
          setAccountDeletedByAdmin(true);
          logout();
          throw new Error(
            language === 'ar'
              ? 'لقد تم حذف حسابك من إدارة الموقع.'
              : 'Your account has been deleted by the administration.'
          );
        }
        p = await unifyEmailProfile(p, cred.user.uid);
        setProfile(p);
        safeSetLocalStorage(LOCAL_PROFILE_KEY, p);
        return;
      }
    } catch (fbErr: any) {
      if (fbErr.message?.includes('إدارة الموقع') || fbErr.message?.includes('deleted')) {
        throw fbErr;
      }
      console.warn('Firebase Auth direct login error, verifying with Cloud & Local Account Registry:', fbErr.code || fbErr.message);
    }

    // 2. Check local accounts registry
    const accounts = getLocalAccounts();
    const localMatch = accounts[cleanEmail];

    if (localMatch) {
      if (localMatch.passwordHash !== inputHash) {
        throw new Error(
          language === 'ar'
            ? 'كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور والمحاولة مجدداً.'
            : language === 'de'
            ? 'Das eingegebene Passwort ist falsch. Bitte überprüfen Sie Ihre Eingabe.'
            : 'Incorrect password. Please verify your password and try again.'
        );
      }

      if (localMatch.profile.deletedByAdmin || localMatch.profile.status === 'deleted') {
        setAccountDeletedByAdmin(true);
        logout();
        throw new Error(
          language === 'ar'
            ? 'لقد تم حذف حسابك من إدارة الموقع.'
            : 'Your account has been deleted by the administration.'
        );
      }

      await fbSignOut(auth).catch(() => {});
      const unifiedLocal = await unifyEmailProfile(localMatch.profile, localMatch.uid);
      saveLocalAccount({
        ...localMatch,
        profile: unifiedLocal,
        fullName: unifiedLocal.fullName,
        updatedAt: new Date().toISOString(),
      });
      setUser({
        uid: localMatch.uid,
        email: localMatch.email,
        displayName: unifiedLocal.fullName,
      } as any);
      setProfile(unifiedLocal);
      safeSetLocalStorage(LOCAL_PROFILE_KEY, unifiedLocal);
      return;
    }

    // 3. Check Firestore accounts collection (bounded by email)
    try {
      const snap = await getDocs(
        query(collection(db, 'accounts'), where('email', '==', cleanEmail), limit(5))
      );
      let foundDoc: any = null;
      snap.forEach(d => {
        const data = d.data();
        if (data.email && data.email.toLowerCase() === cleanEmail) {
          foundDoc = data;
        }
      });

      if (foundDoc) {
        if (foundDoc.passwordHash !== inputHash) {
          throw new Error(
            language === 'ar'
              ? 'كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور والمحاولة مجدداً.'
              : 'Incorrect password. Please verify your password and try again.'
          );
        }

        const userRef = doc(db, 'users', foundDoc.uid);
        const userSnap = await getDoc(userRef);
        const rawUserProf: UserProfile = userSnap.exists()
          ? (userSnap.data() as UserProfile)
          : {
              userId: foundDoc.uid,
              fullName: foundDoc.fullName || 'Surgeon',
              email: cleanEmail,
              country: 'Germany',
              medicalQualification: 'MD',
              currentPosition: 'Surgical Trainee',
              specialty: 'General Surgery',
              hospitals: 'University Medical Center',
              biography: '',
              role: cleanEmail === SUPER_ADMIN_EMAIL ? 'super_admin' : 'normal_user',
              preferredLanguage: language,
              theme: 'light',
              // SECURITY FIX: the fallback (client-side) login path previously marked every
              // synthesized profile as emailVerified:true — a verification forgery. Only the
              // platform admin is considered verified here; everyone else stays unverified
              // until they verify through Firebase Auth.
              emailVerified: cleanEmail === SUPER_ADMIN_EMAIL,
              status: cleanEmail === SUPER_ADMIN_EMAIL ? 'active' : 'unverified',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

        if (rawUserProf.deletedByAdmin || rawUserProf.status === 'deleted') {
          setAccountDeletedByAdmin(true);
          logout();
          throw new Error(
            language === 'ar'
              ? 'لقد تم حذف حسابك من إدارة الموقع.'
              : 'Your account has been deleted by the administration.'
          );
        }

        const userProf = await unifyEmailProfile(rawUserProf, foundDoc.uid);

        saveLocalAccount({
          uid: foundDoc.uid,
          email: cleanEmail,
          passwordHash: foundDoc.passwordHash,
          fullName: userProf.fullName,
          profile: userProf,
          updatedAt: new Date().toISOString(),
        });

        await fbSignOut(auth).catch(() => {});
        setUser({
          uid: foundDoc.uid,
          email: cleanEmail,
          displayName: userProf.fullName,
        } as any);
        setProfile(userProf);
        safeSetLocalStorage(LOCAL_PROFILE_KEY, userProf);
        return;
      }
    } catch (e: any) {
      if (e.message.includes('password') || e.message.includes('deleted')) throw e;
    }

    throw new Error(
      language === 'ar'
        ? 'لم يتم العثور على حساب بهذا البريد الإلكتروني. يرجى إنشاء حساب جديد أولاً من تبويب "إنشاء حساب جديد".'
        : language === 'de'
        ? 'Kein Konto mit dieser E-Mail-Adresse gefunden. Bitte registrieren Sie sich zuerst.'
        : 'No account found with this email. Please register a new account first using the "Create Account" tab.'
    );
  };

  const resetPasswordDirect = async (email: string, newPass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const newHash = await hashPassword(newPass);

    const accounts = getLocalAccounts();
    const local = accounts[cleanEmail];

    if (local) {
      local.passwordHash = newHash;
      saveLocalAccount(local);
    }

    try {
      const snap = await getDocs(
        query(collection(db, 'accounts'), where('email', '==', cleanEmail), limit(5))
      );
      for (const d of snap.docs) {
        const data = d.data();
        if (data.email && data.email.toLowerCase() === cleanEmail) {
          await setDoc(doc(db, 'accounts', d.id), { passwordHash: newHash }, { merge: true });
        }
      }
    } catch (e) {
      console.warn('Direct password reset Firestore sync note:', e);
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
    localStorage.removeItem(LOCAL_PROFILE_KEY);
  };

  const dismissDeletedAccountModal = () => {
    setAccountDeletedByAdmin(false);
  };

  const deleteCurrentAccount = async () => {
    const currentEmail = user?.email || profile?.email;
    const uid = user?.uid || profile?.userId;

    if (currentEmail) {
      const accounts = getLocalAccounts();
      delete accounts[currentEmail.toLowerCase()];
      safeSetLocalStorage(LOCAL_ACCOUNTS_KEY, accounts);
    }

    if (uid) {
      try {
        await deleteDoc(doc(db, 'users', uid));
        await deleteDoc(doc(db, 'accounts', uid));
      } catch (e) {
        console.warn('Firestore delete note:', e);
      }
    }

    if (user && auth.currentUser) {
      try {
        await deleteUser(auth.currentUser);
      } catch (e) {
        console.warn('Auth user delete note:', e);
      }
    }

    setUser(null);
    setProfile(null);
    localStorage.removeItem(LOCAL_PROFILE_KEY);
  };

  const patchProfileLocal = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      if (!prev) return prev;
      const merged: UserProfile = {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      safeSetLocalStorage(LOCAL_PROFILE_KEY, merged);
      if (merged.email) {
        const accounts = getLocalAccounts();
        const key = merged.email.toLowerCase();
        if (accounts[key]) {
          accounts[key].profile = merged;
          accounts[key].fullName = merged.fullName;
          safeSetLocalStorage(LOCAL_ACCOUNTS_KEY, accounts);
        }
      }
      return merged;
    });
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setProfile(updated);
    safeSetLocalStorage(LOCAL_PROFILE_KEY, updated);

    if (updated.email) {
      const accounts = getLocalAccounts();
      if (accounts[updated.email.toLowerCase()]) {
        accounts[updated.email.toLowerCase()].profile = updated;
        accounts[updated.email.toLowerCase()].fullName = updated.fullName;
        safeSetLocalStorage(LOCAL_ACCOUNTS_KEY, accounts);
      }
    }

    try {
      await setDoc(doc(db, 'users', updated.userId), updated, { merge: true });
      const siblingIds = Array.from(new Set([...(updated.aliasIds || []), user?.uid].filter(Boolean))) as string[];
      for (const sid of siblingIds) {
        if (sid !== updated.userId) {
          await setDoc(doc(db, 'users', sid), { ...data, updatedAt: updated.updatedAt }, { merge: true }).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Failed to update cloud profile, saved locally:', e);
    }
  };

  const updateProfilePhoto = async (photoDataUrl: string) => {
    await updateUserProfile({ profilePhotoUrl: photoDataUrl });
  };

  const getAllRegisteredUsers = async (): Promise<UserProfile[]> => {
    const list: UserProfile[] = [];
    try {
      const snap = await getDocs(collection(db, 'users'));
      snap.forEach(d => {
        const uData = d.data() as UserProfile;
        if (!uData.deletedByAdmin && uData.status !== 'deleted') {
          list.push(uData);
        }
      });
    } catch (e) {
      console.warn('Firestore users listing note:', e);
    }

    const accounts = getLocalAccounts();
    Object.values(accounts).forEach(acc => {
      if (
        !acc.profile.deletedByAdmin &&
        acc.profile.status !== 'deleted' &&
        !list.some(u => u.email.toLowerCase() === acc.email.toLowerCase())
      ) {
        list.push(acc.profile);
      }
    });

    if (profile && !profile.deletedByAdmin && profile.status !== 'deleted' && !list.some(u => u.userId === profile.userId)) {
      list.push(profile);
    }

    return list;
  };

  // Admin deletes user account: immediately flags user and marks tombstone so their active session closes instantly!
  const adminDeleteUserAccount = async (targetUserId: string) => {
    // 1. Mark in local accounts
    const accounts = getLocalAccounts();
    let targetEmail = '';
    for (const [em, acc] of Object.entries(accounts)) {
      if (acc.uid === targetUserId || acc.profile.userId === targetUserId) {
        targetEmail = em;
        delete accounts[em];
      }
    }
    safeSetLocalStorage(LOCAL_ACCOUNTS_KEY, accounts);

    // 2. Set tombstone in Firestore 'deleted_users' AND update 'users/{id}' with status: 'deleted'
    // so any connected device running onSnapshot triggers immediate logout & app closure!
    try {
      await setDoc(doc(db, 'deleted_users', targetUserId), {
        userId: targetUserId,
        deletedAt: new Date().toISOString(),
        deletedBy: SUPER_ADMIN_EMAIL,
        reason: 'Account removed by site administration.',
      });

      await setDoc(doc(db, 'users', targetUserId), {
        status: 'deleted',
        deletedByAdmin: true,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      await deleteDoc(doc(db, 'accounts', targetUserId));

      // 3. Remove all community cases published by this user
      try {
        const commCasesSnap = await getDocs(collection(db, 'communityCases'));
        for (const cDoc of commCasesSnap.docs) {
          const cData = cDoc.data();
          if (cData.userId === targetUserId) {
            await deleteDoc(doc(db, 'communityCases', cDoc.id));
          }
        }
      } catch (e) {
        console.warn('Could not clean up community cases for deleted user:', e);
      }

      // 4. Create formal audit log entry
      try {
        await addDoc(collection(db, 'audit_logs'), {
          action: 'admin_delete_account',
          targetUserId,
          targetEmail,
          deletedBy: user?.email || profile?.email || SUPER_ADMIN_EMAIL,
          timestamp: new Date().toISOString(),
          message: 'Your SurgiTrack iLog account has been deleted by the platform administration. You no longer have access to this account.',
        });
      } catch (e) {
        console.warn('Audit log write error:', e);
      }

      // 5. Send formal notification record
      try {
        await setDoc(doc(db, 'notifications', `del_${targetUserId}`), {
          id: `del_${targetUserId}`,
          targetUserId,
          title: 'Account Deletion Notice',
          message: 'Your SurgiTrack iLog account has been deleted by the platform administration. You no longer have access to this account.',
          category: 'administrative',
          type: 'admin_broadcast',
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
        resetPasswordDirect,
        logout,
        deleteCurrentAccount,
        updateUserProfile,
        updateProfilePhoto,
        setLanguage,
        language,
        getAllRegisteredUsers,
        adminDeleteUserAccount,
        sendVerificationLink,
        verifyTokenLink,
        checkVerificationStatus,
        markAccountVerified,
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
