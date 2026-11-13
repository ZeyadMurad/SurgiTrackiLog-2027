import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  runTransaction,
  writeBatch,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import {
  auth,
  db,
  handleFirestoreError,
  OperationType,
  cleanPayload,
  getCasePublishTimestampMs,
  getTimestampMs,
  isFirestoreQuotaError,
  safeSetLocalStorage,
  saveCompactCommunityCache,
} from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  ClinicalCase,
  CaseComment,
  CaseLike,
  Supervisor,
  TrainingRecord,
  TrainingSession,
  UserSkill,
  RecommendationLetter,
  SavedArticle,
  SyncStatus,
  AppNotification,
} from '../types';
import { DEFAULT_SURGICAL_SKILLS } from '../lib/medicalDefaults';
import { matchDoctorCase, normalizeSurgeonName } from '../lib/doctorUtils';
import { estimateJsonByteSize } from '../lib/imageUtils';

export interface DoctorProfileSummary {
  userId: string;
  email?: string;
  aliasIds?: string[];
  fullName: string;
  academicDegree?: string;
  academicTitle?: string;
  specialty: string;
  hospital: string;
  profilePhotoUrl?: string;
  biography?: string;
  followers?: string[];
  following?: string[];
  pendingFollowRequests?: string[];
  followersCount: number;
  followingCount: number;
  showProgressStats?: boolean;
  showPortfolioToFollowers?: boolean;
  requireApprovalToFollow?: boolean;
  totalHours?: number;
  totalProcedures?: number;
  verifiedHours?: number;
  verifiedProcedures?: number;
  publishedCasesCount?: number;
  status?: string;
  deletedByAdmin?: boolean;
  disabled?: boolean;
  emailVerified?: boolean;
}

interface DataContextType {
  cases: ClinicalCase[];
  supervisors: Supervisor[];
  trainingRecords: TrainingRecord[];
  trainingSessions: TrainingSession[];
  skills: UserSkill[];
  recommendations: RecommendationLetter[];
  savedArticles: SavedArticle[];
  communityCases: ClinicalCase[];
  allDoctors: DoctorProfileSummary[];
  syncStatus: SyncStatus;
  hasMoreCommunityCases: boolean;
  loadingMoreCommunity: boolean;
  viewedCommunityCaseIds: string[];
  firestoreQuotaExceeded: boolean;
  dismissQuotaWarning: () => void;

  // Actions
  loadMoreCommunityCases: () => void;
  fetchCommunityCaseById: (caseId: string) => Promise<ClinicalCase | null>;
  markCommunityCasesViewed: (caseIds: string[]) => Promise<void>;
  addCase: (c: Omit<ClinicalCase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, publishToCommunity?: boolean) => Promise<string>;
  updateCase: (id: string, c: Partial<ClinicalCase>) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  deleteCaseAttachment: (caseId: string, attachmentId: string) => Promise<void>;
  publishCaseToCommunity: (caseId: string, overrideData?: Partial<ClinicalCase>) => Promise<void>;
  unpublishCaseFromCommunity: (caseId: string) => Promise<void>;
  toggleLikeCase: (caseId: string) => Promise<void>;
  addCommentToCase: (caseId: string, commentText: string) => Promise<void>;
  deleteCommentFromCase: (caseId: string, commentId: string) => Promise<void>;
  toggleFollowDoctor: (targetDoctorId: string) => Promise<{ status: 'followed' | 'unfollowed' | 'requested' | 'cancelled' }>;
  acceptFollowRequest: (requesterId: string, notificationId?: string) => Promise<void>;
  declineFollowRequest: (requesterId: string, notificationId?: string) => Promise<void>;

  addSupervisor: (s: Omit<Supervisor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateSupervisor: (id: string, s: Partial<Supervisor>) => Promise<void>;
  deleteSupervisor: (id: string) => Promise<void>;

  addTrainingRecord: (r: Omit<TrainingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTrainingRecord: (id: string, supervisorId: string, r: Partial<TrainingRecord>) => Promise<void>;
  deleteTrainingRecord: (id: string, supervisorId: string) => Promise<void>;

  addTrainingSession: (s: Omit<TrainingSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTrainingSession: (id: string, s: Partial<TrainingSession>) => Promise<void>;
  deleteTrainingSession: (id: string) => Promise<void>;

  addSkill: (s: Omit<UserSkill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateSkill: (id: string, s: Partial<UserSkill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;

  saveRecommendation: (r: Omit<RecommendationLetter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  deleteRecommendation: (id: string) => Promise<void>;

  toggleSaveArticle: (article: any) => Promise<void>;
  isArticleSaved: (articleId: string) => boolean;
  syncNow: () => Promise<void>;

  // Restore payload
  restorePortfolioData: (data: any) => Promise<void>;

  // Calculations
  stats: {
    totalCases: number;
    totalProcedures: number;
    verifiedProcedures: number;
    totalSessions: number;
    totalHours: number;
    verifiedHours: number;
    unverifiedHours: number;
    totalSupervisors: number;
    totalHospitals: number;
    skillsPracticed: number;
    assessedCompetencies: number;
    weeklyAverageHours: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Local storage persistent fallback keys
const STORAGE_PREFIX = 'surgitrack_local_';
const OFFLINE_QUEUE_KEY = 'surgitrack_offline_queue_';

interface OfflineQueueItem {
  id: string;
  type: 'case' | 'community_case' | 'supervisor' | 'record' | 'session' | 'skill';
  action: 'create' | 'update' | 'delete';
  data?: any;
  parentId?: string;
  timestamp: string;
}

const MAX_FIRESTORE_DOC_BYTES = 920_000;

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, patchProfileLocal, myUids } = useAuth();
  const currentUid = profile?.userId || user?.uid || 'local-surgeon-001';
  const lastSyncedMetricsRef = useRef<string>('');

  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationLetter[]>([]);
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [communityCases, setCommunityCases] = useState<ClinicalCase[]>([]);
  const [serverSortedCases, setServerSortedCases] = useState<ClinicalCase[]>([]);
  const [legacySortedCases, setLegacySortedCases] = useState<ClinicalCase[]>([]);
  const [fetchedExtraCases, setFetchedExtraCases] = useState<ClinicalCase[]>([]);
  const [communityPageSize, setCommunityPageSize] = useState<number>(15);
  const [hasMoreCommunityCases, setHasMoreCommunityCases] = useState<boolean>(false);
  const [loadingMoreCommunity, setLoadingMoreCommunity] = useState<boolean>(false);
  const [viewedCommunityCaseIds, setViewedCommunityCaseIds] = useState<string[]>([]);
  const [firestoreQuotaExceeded, setFirestoreQuotaExceeded] = useState<boolean>(false);
  const dismissQuotaWarning = () => setFirestoreQuotaExceeded(false);
  const [rawDoctors, setAllDoctors] = useState<DoctorProfileSummary[]>([]);

  // Real-time Notification Dispatcher (supports deterministic IDs to guarantee idempotency / zero duplicates)
  const dispatchNotification = async (
    notif: Omit<AppNotification, 'id' | 'createdAt'>,
    explicitId?: string
  ) => {
    const notifId = explicitId || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullNotif = cleanPayload({
      ...notif,
      id: notifId,
      createdAt: new Date().toISOString(),
      createdAtServer: serverTimestamp(),
      readByUserIds: [],
    });
    try {
      await setDoc(doc(db, 'notifications', notifId), fullNotif, { merge: true });
    } catch (e) {
      console.warn('Dispatch notification error:', e);
    }
  };

  // Queue helper methods
  const getOfflineQueue = (): OfflineQueueItem[] => {
    try {
      const q = localStorage.getItem(OFFLINE_QUEUE_KEY + currentUid);
      return q ? JSON.parse(q) : [];
    } catch {
      return [];
    }
  };

  const saveOfflineQueue = (items: OfflineQueueItem[]) => {
    safeSetLocalStorage(OFFLINE_QUEUE_KEY + currentUid, items);
    setSyncStatus(prev => ({ ...prev, pendingCount: items.length }));
  };

  const enqueueOfflineAction = (item: OfflineQueueItem) => {
    const queue = getOfflineQueue();
    // Filter existing duplicate pending item for the same entity id if needed
    const filtered = queue.filter(q => !(q.id === item.id && q.action === item.action));
    const updated = [...filtered, item];
    saveOfflineQueue(updated);
  };

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() => {
    const qCount = (() => {
      try {
        const q = localStorage.getItem(OFFLINE_QUEUE_KEY + (user?.uid || profile?.userId || 'local-surgeon-001'));
        return q ? JSON.parse(q).length : 0;
      } catch {
        return 0;
      }
    })();
    return {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      pendingCount: qCount,
      isSyncing: false,
      lastSyncTime: new Date().toLocaleTimeString(),
    };
  });

  // Process offline sync queue to Cloud Firestore
  const processOfflineSyncQueue = async () => {
    const syncUid = profile?.userId || user?.uid;
    if (!syncUid || syncUid === 'local-surgeon-001') return;
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));
    const failedItems: OfflineQueueItem[] = [];

    for (let idx = 0; idx < queue.length; idx++) {
      const item = queue[idx];
      try {
        if (item.type === 'case') {
          if (item.action === 'delete') {
            await deleteDoc(doc(db, 'users', syncUid, 'clinicalCases', item.id));
          } else {
            await setDoc(doc(db, 'users', syncUid, 'clinicalCases', item.id), cleanPayload(item.data), { merge: true });
          }
        } else if (item.type === 'community_case') {
          if (item.action === 'delete') {
            await deleteDoc(doc(db, 'communityCases', item.id));
          } else {
            await setDoc(doc(db, 'communityCases', item.id), cleanPayload(item.data), { merge: true });
          }
        } else if (item.type === 'supervisor') {
          if (item.action === 'delete') {
            await deleteDoc(doc(db, 'users', syncUid, 'supervisors', item.id));
          } else {
            await setDoc(doc(db, 'users', syncUid, 'supervisors', item.id), cleanPayload(item.data), { merge: true });
          }
        } else if (item.type === 'record') {
          if (item.parentId) {
            if (item.action === 'delete') {
              await deleteDoc(doc(db, 'users', syncUid, 'supervisors', item.parentId, 'trainingRecords', item.id));
            } else {
              await setDoc(doc(db, 'users', syncUid, 'supervisors', item.parentId, 'trainingRecords', item.id), cleanPayload(item.data), { merge: true });
            }
          }
        } else if (item.type === 'session') {
          if (item.action === 'delete') {
            await deleteDoc(doc(db, 'users', syncUid, 'trainingSessions', item.id));
          } else {
            await setDoc(doc(db, 'users', syncUid, 'trainingSessions', item.id), cleanPayload(item.data), { merge: true });
          }
        } else if (item.type === 'skill') {
          if (item.action === 'delete') {
            await deleteDoc(doc(db, 'users', syncUid, 'skills', item.id));
          } else {
            await setDoc(doc(db, 'users', syncUid, 'skills', item.id), cleanPayload(item.data), { merge: true });
          }
        }
      } catch (err: any) {
        if (isFirestoreQuotaError(err)) {
          setFirestoreQuotaExceeded(true);
          failedItems.push(...queue.slice(idx));
          break;
        }
        console.warn(`Sync failed for item ${item.id}:`, err.message);
        failedItems.push(item);
      }
    }

    saveOfflineQueue(failedItems);
    setSyncStatus(prev => ({
      ...prev,
      isSyncing: false,
      pendingCount: failedItems.length,
      lastSyncTime: new Date().toLocaleTimeString(),
    }));
  };

  const syncNow = async () => {
    await processOfflineSyncQueue();
  };

  // Track online / offline events and auto-sync immediately on reconnect
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      processOfflineSyncQueue();
    };
    const handleOffline = () => setSyncStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (navigator.onLine && user) {
      processOfflineSyncQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Helper to load or initialize state from localStorage
  const loadLocal = <T,>(key: string, defaultVal: T): T => {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + currentUid + '_' + key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const saveLocal = (key: string, val: any) => {
    safeSetLocalStorage(STORAGE_PREFIX + currentUid + '_' + key, val);
  };

  // Load user-scoped local cache on session change; never fabricate clinical records/hours for real authenticated users
  useEffect(() => {
    const loadedCases = loadLocal<ClinicalCase[]>('cases', []);
    const loadedSupervisors = loadLocal<Supervisor[]>('supervisors', []);
    const loadedRecords = loadLocal<TrainingRecord[]>('records', []);
    const loadedSessions = loadLocal<TrainingSession[]>('sessions', []);
    const loadedSkills = loadLocal<UserSkill[]>('skills', []);
    const loadedRecs = loadLocal<RecommendationLetter[]>('recommendations', []);
    const loadedArticles = loadLocal<SavedArticle[]>('articles', []);

    if (currentUid === 'local-surgeon-001' && loadedSupervisors.length === 0) {
      // Seed demo starter portfolio ONLY for unauthenticated local-guest mode
      const initialSupervisor: Supervisor = {
        id: 'sup-prof-weber',
        userId: currentUid,
        fullName: 'Thomas Weber',
        academicDegree: 'MD, PhD, FEBVS',
        academicTitle: 'Prof. Dr. med.',
        professionalPosition: 'Consultant Vascular Surgeon & Head of Dept',
        specialty: 'Vascular Surgery',
        subspecialty: 'Endovascular & Aortic Surgery',
        department: 'Department of Vascular and Endovascular Surgery',
        hospital: 'University Hospital Hamburg-Eppendorf',
        university: 'University of Hamburg',
        country: 'Germany',
        email: 't.weber@uke-hamburg.de',
        additionalNotes: 'Authorized Weiterbildungsbefugter for Vascular Surgery according to German Ärztekammer.',
        createdAt: '2026-01-15T08:00:00Z',
        updatedAt: '2026-01-15T08:00:00Z',
      };

      const initialCase: ClinicalCase = {
        id: 'case-vasc-001',
        userId: currentUid,
        caseReference: 'CAS-2026-0042',
        patientAge: 68,
        patientSex: 'Male',
        presentationDate: '2026-10-14',
        hospital: 'University Hospital Hamburg-Eppendorf',
        department: 'Vascular Surgery',
        specialty: 'Vascular Surgery',
        chiefComplaint: 'Severe left calf claudication at 50 meters, progressing to nocturnal rest pain.',
        historyOfPresentIllness: 'A 68-year-old gentleman presented with a 4-month history of deteriorating left lower limb ischemia. Pain awakens patient at night, relieved by hanging the leg over bed edge.',
        durationOfSymptoms: '4 months',
        relevantMedicalHistory: 'Hypertension, Type 2 Diabetes Mellitus, 40 pack-year smoking history.',
        surgicalHistory: 'Elective open cholecystectomy in 2018.',
        drugHistory: 'Aspirin 100mg od, Atorvastatin 40mg od, Ramipril 5mg od, Metformin 1000mg bd.',
        allergies: 'Penicillin (mild cutaneous rash).',
        familyHistory: 'Father had abdominal aortic aneurysm repair.',
        socialHistory: 'Retired mechanical engineer, independent.',
        examination: {
          general: 'Well-nourished, hemodynamically stable.',
          vitals: 'BP: 135/82 mmHg, HR: 72 bpm, SpO2: 98% on room air.',
          cardiovascular: 'Regular rhythm, no carotid or abdominal bruits.',
          local: 'Left foot cooler than right; delayed capillary refill (4s); absent dorsalis pedis and posterior tibial pulses on the left.',
        },
        investigations: [
          {
            name: 'Doppler Ultrasound / ABI',
            category: 'Imaging',
            date: '2026-10-14',
            result: 'Left ABI = 0.42 (Critical Limb Ischemia); Right ABI = 0.88.',
            summary: 'Monophasic flow in distal left tibials.',
          },
          {
            name: 'CT Angiography',
            category: 'Imaging',
            date: '2026-10-15',
            result: 'Occlusion of the left superficial femoral artery (SFA) from mid-thigh with reconstitution at P1 popliteal segment.',
            summary: 'Suitable distal target for femoro-popliteal bypass.',
          },
          {
            name: 'Coagulation Profile & Creatinine',
            category: 'Laboratory',
            date: '2026-10-14',
            result: 'INR 1.05, aPTT 29s, Creatinine 1.1 mg/dL.',
            summary: 'Adequate renal reserve for iodinated contrast.',
          },
        ],
        primaryDiagnosis: 'Critical Limb-Threatening Ischemia (Fontaine Stage III / Rutherford Category 4), Left Lower Extremity',
        secondaryDiagnoses: 'Peripheral Arterial Occlusive Disease (PAOD), Essential Hypertension',
        icd10Code: 'I70.24',
        clinicalAssessment: 'Symptomatic left SFA chronic total occlusion warranting urgent revascularization to prevent tissue loss.',
        management: {
          initial: 'Optimized best medical therapy (Statin, Antiplatelet), analgesia, hydration.',
          surgical: 'Left Femoro-Popliteal Bypass Surgery with autologous reversed great saphenous vein graft.',
          treatmentPlan: 'Scheduled for operative intervention under spinal anesthesia.',
          outcome: 'Successful revascularization with restoration of strong palpable posterior tibial pulse.',
        },
        surgicalProcedure: {
          procedureName: 'Left Femoro-Popliteal Bypass (Reversed Vein Graft)',
          procedureDate: '2026-10-16',
          specialty: 'Vascular Surgery',
          indication: 'Critical Limb-Threatening Ischemia',
          surgicalApproach: 'Longitudinal groin incision over common femoral bifurcation and medial infra-genicular popliteal exposure.',
          operativeFindings: 'Severe calcification at SFA origin; excellent calibre (>4mm) ipsilateral great saphenous vein.',
          procedureSummary: 'Saphenous vein harvested; systemic heparin administered; End-to-side proximal anastomosis to common femoral artery (6-0 Prolene); tunnelled through subsartorial canal; distal end-to-side anastomosis to P3 popliteal artery (7-0 Prolene). Excellent thrill and hemostasis achieved.',
          anaesthesiaType: 'Spinal with sedation',
          outcome: 'Immediate triphasic signals in pedal vessels, warm foot.',
          participationRole: 'Performed Specific Steps Under Direct Supervision',
        },
        followUp: {
          followUpDate: '2026-10-22',
          clinicalProgress: 'Uneventful recovery, ambulating without claudication.',
          woundStatus: 'Clean surgical wounds, no haematoma or surgical site infection.',
          finalOutcome: 'Graft patent on discharge duplex scan.',
        },
        createdAt: '2026-10-14T10:00:00Z',
        updatedAt: '2026-10-22T14:30:00Z',
      };

      const initialRecord: TrainingRecord = {
        id: 'rec-001',
        userId: currentUid,
        supervisorId: 'sup-prof-weber',
        trainingDate: '2026-10-16',
        procedureDate: '2026-10-16',
        hospital: 'University Hospital Hamburg-Eppendorf',
        department: 'Vascular Surgery',
        specialty: 'Vascular Surgery',
        activityType: 'Operative Theatre',
        procedureName: 'Left Femoro-Popliteal Bypass (Reversed Vein)',
        clinicalCaseRef: 'CAS-2026-0042',
        startTime: '08:30',
        endTime: '13:00',
        breakDurationMinutes: 30,
        netTrainingHours: 4.0,
        surgicalExposure: 'Performed Specific Steps Under Direct Supervision',
        participationRole: 'Performed Specific Steps Under Direct Supervision',
        participationGerman: 'Einzelne operative Schritte unter direkter Supervision durchgeführt',
        descriptionOfParticipation: 'Under Prof. Weber\'s direct scrubbed guidance, dissected the common and superficial femoral arteries, assisted with saphenous vein harvesting, and performed the distal arteriotomy and assisted anastomotic running suture.',
        responsibilities: 'Surgical exposure of vessels, heparin timing documentation, vascular clamp application, graft flushing, skin closure.',
        surgicalTechniquesObserved: 'Proximal end-to-side vascular anastomosis, vein graft distention testing.',
        surgicalTechniquesPracticed: 'Vessel mobilization, arteriotomy using Potts scissors, parachute suture technique, subcuticular closure.',
        supervisionLevel: 'Direct Supervision',
        skillsAcquired: ['Vessel Exposure', 'Vascular Clamping', 'Arteriotomy', 'Vascular Suturing', 'Skin Closure'],
        learningPoints: 'Avoid vein torsion during subsartorial tunnelling; maintain gentle traction during 7-0 Prolene anastomoses.',
        supervisorFeedback: 'Excellently prepared, gentle handling of vessels, good knot security. Approved for documented WBO logbook hours.',
        additionalNotes: 'Documented in UKE surgical logbook registry.',
        verified: true,
        createdAt: '2026-10-16T14:00:00Z',
        updatedAt: '2026-10-16T14:00:00Z',
      };

      const initialSession: TrainingSession = {
        id: 'sess-001',
        userId: currentUid,
        supervisorId: 'sup-prof-weber',
        supervisorName: 'Prof. Dr. med. Thomas Weber',
        hospital: 'University Hospital Hamburg-Eppendorf',
        department: 'Vascular Surgery',
        trainingDate: '2026-10-16',
        startTime: '07:30',
        endTime: '16:00',
        breakDurationMinutes: 60,
        netTrainingHours: 7.5,
        sessionType: 'Theatre',
        trainingActivities: 'Morning multidisciplinary vascular team handover, surgical theater operations, post-op patient review in recovery unit.',
        skillsPracticed: ['Vascular Access', 'Vessel Exposure', 'Arteriotomy', 'Vascular Suturing'],
        notes: 'Full day clinical theatre attendance under Prof. Weber.',
        verified: true,
        createdAt: '2026-10-16T17:00:00Z',
        updatedAt: '2026-10-16T17:00:00Z',
      };

      const initialSkills: UserSkill[] = DEFAULT_SURGICAL_SKILLS.map((d, index) => ({
        id: `skill-${index + 1}`,
        userId: currentUid,
        name: d.name,
        nameGerman: d.nameGerman,
        specialty: d.specialty,
        category: d.category,
        exposureLevel: index === 3 || index === 4 || index === 14 ? 'Performed Specific Steps Under Direct Supervision' : 'Observed',
        competencyStatus: index === 3 || index === 4 ? 'Practicing' : index === 14 ? 'Supervisor Assessed' : 'Learning',
        totalRecordedSessions: index === 3 ? 12 : index === 14 ? 8 : 4,
        totalDocumentedHours: index === 3 ? 24 : index === 14 ? 16 : 8,
        lastPracticedDate: '2026-10-16',
        supervisors: ['Prof. Dr. med. Thomas Weber'],
        hospitals: ['University Hospital Hamburg-Eppendorf'],
        createdAt: '2026-01-20T00:00:00Z',
        updatedAt: '2026-10-16T00:00:00Z',
      }));

      setSupervisors([initialSupervisor]);
      setCases([initialCase]);
      setTrainingRecords([initialRecord]);
      setTrainingSessions([initialSession]);
      setSkills(initialSkills);

      saveLocal('supervisors', [initialSupervisor]);
      saveLocal('cases', [initialCase]);
      saveLocal('records', [initialRecord]);
      saveLocal('sessions', [initialSession]);
      saveLocal('skills', initialSkills);
    } else {
      setCases(loadedCases);
      setSupervisors(loadedSupervisors);
      setTrainingRecords(loadedRecords);
      setTrainingSessions(loadedSessions);
      setSkills(loadedSkills);
      setRecommendations(loadedRecs);
      setSavedArticles(loadedArticles);
    }

    // Community cases local cache initialization (no mock fallback)
    try {
      const storedCommunity = localStorage.getItem('surgitrack_local_community_cases');
      if (storedCommunity) {
        const parsed = JSON.parse(storedCommunity) as ClinicalCase[];
        setCommunityCases(Array.isArray(parsed) ? parsed.filter(c => c.isPublished !== false) : []);
      } else {
        setCommunityCases([]);
      }
    } catch {
      setCommunityCases([]);
    }
  }, [currentUid]);

  // Global Community Cases Real-Time Paginated Listener + one-time legacy fallback (minimizes read units)
  useEffect(() => {
    let unsubServerCommunity: (() => void) | undefined;
    let isMounted = true;

    const mapVisibleCase = (d: any): ClinicalCase => ({ ...d.data(), id: d.id || d.data().id }) as ClinicalCase;
    const isVisiblePublished = (c: ClinicalCase) =>
      c.isPublished !== false && !(c as any).isDraft && !(c as any).deletedByAdmin;

    try {
      const serverQuery = query(
        collection(db, 'communityCases'),
        orderBy('publishedAtServer', 'desc'),
        limit(communityPageSize + 1)
      );
      unsubServerCommunity = onSnapshot(
        serverQuery,
        (snapshot) => {
          const hasMore = snapshot.docs.length > communityPageSize;
          const sliced = snapshot.docs
            .slice(0, communityPageSize)
            .map(mapVisibleCase)
            .filter(isVisiblePublished);
          setServerSortedCases(sliced);
          setHasMoreCommunityCases(hasMore);
          setLoadingMoreCommunity(false);
        },
        (err) => {
          if (isFirestoreQuotaError(err)) {
            setFirestoreQuotaExceeded(true);
          } else {
            console.warn('Server-sorted community listener note:', err.message);
          }
          setLoadingMoreCommunity(false);
        }
      );

      // One-time bounded legacy fetch on initial mount for older posts without publishedAtServer
      if (communityPageSize <= 15) {
        const legacyQuery = query(
          collection(db, 'communityCases'),
          orderBy('publishedAt', 'desc'),
          limit(12)
        );
        getDocs(legacyQuery)
          .then((snapshot) => {
            if (!isMounted) return;
            const sliced = snapshot.docs.map(mapVisibleCase).filter(isVisiblePublished);
            setLegacySortedCases(sliced);
          })
          .catch((err) => {
            if (isFirestoreQuotaError(err)) {
              setFirestoreQuotaExceeded(true);
            }
          });
      }
    } catch (e) {
      console.warn('Community listener init warning:', e);
      setLoadingMoreCommunity(false);
    }

    return () => {
      isMounted = false;
      if (unsubServerCommunity) unsubServerCommunity();
    };
  }, [communityPageSize]);

  // Merge server-sorted, legacy-sorted, and on-demand notification-targeted cases cleanly newest-first
  useEffect(() => {
    const mergedMap = new Map<string, ClinicalCase>();
    const insertList = (items: ClinicalCase[], preferExisting: boolean) => {
      for (const item of items) {
        if (!item?.id) continue;
        if (item.isPublished === false || (item as any).isDraft || (item as any).deletedByAdmin) continue;
        if (!preferExisting || !mergedMap.has(item.id)) {
          mergedMap.set(item.id, item);
        }
      }
    };
    insertList(serverSortedCases, false);
    insertList(legacySortedCases, true);
    insertList(fetchedExtraCases, true);

    if (mergedMap.size === 0 && serverSortedCases.length === 0 && legacySortedCases.length === 0) {
      return;
    }

    const sorted = Array.from(mergedMap.values()).sort((a, b) => {
      const diff = getCasePublishTimestampMs(b) - getCasePublishTimestampMs(a);
      if (diff !== 0) return diff;
      return getTimestampMs(b.createdAtServer || b.createdAt) - getTimestampMs(a.createdAtServer || a.createdAt);
    });

    setCommunityCases(sorted);
    saveCompactCommunityCache(sorted);
  }, [serverSortedCases, legacySortedCases, fetchedExtraCases]);

  // Global Registered Surgeons Real-Time Listener (bounded to protect read quota)
  useEffect(() => {
    let unsubUsers: (() => void) | undefined;
    try {
      const usersQuery = query(collection(db, 'users'), limit(120));
      unsubUsers = onSnapshot(
        usersQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const rawDocs: DoctorProfileSummary[] = snapshot.docs
              .map(d => {
                const uData = d.data();
                const followersArr: string[] = Array.isArray(uData.followers) ? Array.from(new Set(uData.followers)) : [];
                const followingArr: string[] = Array.isArray(uData.following) ? Array.from(new Set(uData.following)) : [];
                const pendingArr: string[] = Array.isArray(uData.pendingFollowRequests)
                  ? Array.from(new Set(uData.pendingFollowRequests))
                  : [];
                const emailStr = (uData.email || '').toLowerCase().trim();
                const verifiedHoursVal = Number(uData.verifiedHours ?? uData.totalHours) || 0;
                const verifiedProceduresVal = Number(uData.verifiedProcedures ?? uData.totalProcedures) || 0;
                const totalHoursVal = Number(uData.totalHours ?? uData.verifiedHours) || 0;
                const totalProceduresVal = Number(uData.totalProcedures ?? uData.verifiedProcedures) || 0;
                const docAliases = Array.from(
                  new Set([
                    d.id,
                    ...(uData.userId && uData.userId !== d.id ? [uData.userId] : []),
                    ...(Array.isArray(uData.aliasIds) ? uData.aliasIds : []),
                  ].filter(Boolean))
                );

                return {
                  userId: d.id,
                  email: emailStr,
                  aliasIds: docAliases,
                  fullName: (uData.fullName || 'Dr. Medical Trainee').trim(),
                  academicDegree: uData.medicalQualification || uData.academicDegree || 'MD / MBBS',
                  academicTitle: uData.academicTitle || (uData.currentPosition?.includes('Consultant') ? 'Consultant' : 'Dr.'),
                  specialty: uData.specialty || 'General Surgery',
                  hospital: uData.hospitals || uData.hospital || 'University Hospital',
                  profilePhotoUrl: uData.profilePhotoUrl || '',
                  biography: uData.biography || (uData.currentPosition ? `${uData.currentPosition} • ${uData.specialty}` : 'Registered Surgeon'),
                  followers: followersArr,
                  following: followingArr,
                  pendingFollowRequests: pendingArr,
                  followersCount: followersArr.length,
                  followingCount: followingArr.length,
                  showProgressStats: uData.showProgressStats !== false,
                  showPortfolioToFollowers: uData.showPortfolioToFollowers !== false,
                  requireApprovalToFollow: Boolean(uData.requireApprovalToFollow),
                  totalHours: totalHoursVal,
                  totalProcedures: totalProceduresVal,
                  verifiedHours: verifiedHoursVal,
                  verifiedProcedures: verifiedProceduresVal,
                  publishedCasesCount: Number(uData.publishedCasesCount) || 0,
                  status: uData.status,
                  deletedByAdmin: Boolean(uData.deletedByAdmin),
                  disabled: Boolean(uData.disabled || uData.isDisabled || uData.status === 'disabled'),
                  emailVerified: uData.emailVerified !== false,
                };
              })
              .filter(
                d =>
                  !d.deletedByAdmin &&
                  d.status !== 'deleted' &&
                  d.status !== 'disabled' &&
                  !d.disabled &&
                  d.status !== 'unverified' &&
                  d.emailVerified !== false
              );

            // Unify duplicate account documents sharing the same verified email
            const emailGroups = new Map<string, DoctorProfileSummary[]>();
            const unkeyedDocs: DoctorProfileSummary[] = [];

            rawDocs.forEach(docItem => {
              if (docItem.email) {
                const list = emailGroups.get(docItem.email) || [];
                list.push(docItem);
                emailGroups.set(docItem.email, list);
              } else {
                unkeyedDocs.push(docItem);
              }
            });

            const mergedList: DoctorProfileSummary[] = [...unkeyedDocs];

            emailGroups.forEach((groupDocs, email) => {
              if (groupDocs.length === 1) {
                mergedList.push(groupDocs[0]);
              } else {
                const primaryDoc =
                  groupDocs.find(g => g.profilePhotoUrl && g.fullName.length > 3) ||
                  groupDocs.find(g => g.fullName.length > 3) ||
                  groupDocs[0];
                const allAliasIds = Array.from(new Set(groupDocs.flatMap(g => [g.userId, ...(g.aliasIds || [])])));
                const allFollowers = Array.from(new Set(groupDocs.flatMap(g => g.followers || []))).filter(id => !allAliasIds.includes(id));
                const allFollowing = Array.from(new Set(groupDocs.flatMap(g => g.following || []))).filter(id => !allAliasIds.includes(id));
                const allPending = Array.from(new Set(groupDocs.flatMap(g => g.pendingFollowRequests || []))).filter(id => !allAliasIds.includes(id));
                const maxTotalHours = Math.max(...groupDocs.map(g => g.totalHours ?? 0));
                const maxVerifiedHours = Math.max(...groupDocs.map(g => g.verifiedHours ?? 0));
                const maxTotalProcedures = Math.max(...groupDocs.map(g => g.totalProcedures ?? 0));
                const maxVerifiedProcedures = Math.max(...groupDocs.map(g => g.verifiedProcedures ?? 0));
                const maxPublished = Math.max(...groupDocs.map(g => g.publishedCasesCount || 0));

                mergedList.push({
                  ...primaryDoc,
                  email,
                  aliasIds: allAliasIds,
                  followers: allFollowers,
                  following: allFollowing,
                  pendingFollowRequests: allPending,
                  followersCount: allFollowers.length,
                  followingCount: allFollowing.length,
                  totalHours: maxTotalHours,
                  verifiedHours: maxVerifiedHours,
                  totalProcedures: maxTotalProcedures,
                  verifiedProcedures: maxVerifiedProcedures,
                  publishedCasesCount: maxPublished,
                });
              }
            });

            setAllDoctors(mergedList);
          } else {
            setAllDoctors([]);
          }
        },
        (err) => {
          if (isFirestoreQuotaError(err)) {
            setFirestoreQuotaExceeded(true);
          } else {
            console.warn('Global users listener note:', err.message);
          }
        }
      );
    } catch (e) {
      console.warn('Users listener init warning:', e);
    }

    return () => {
      if (unsubUsers) unsubUsers();
    };
  }, []);

  // Load & sync per-user viewed community cases from local cache + Firestore subcollection
  useEffect(() => {
    const viewKey = `surgitrack_viewed_comm_${currentUid}`;
    try {
      const raw = localStorage.getItem(viewKey);
      const parsed = raw ? JSON.parse(raw) : [];
      setViewedCommunityCaseIds(Array.isArray(parsed) ? parsed : []);
    } catch {
      setViewedCommunityCaseIds([]);
    }
  }, [currentUid]);

  // Personal cloud synchronization across all linked UIDs for cases, supervisors, training records, sessions, skills & articles
  const myUidsKey = myUids.filter(id => id && id !== 'local-surgeon-001').join('|');
  useEffect(() => {
    const syncUids = myUidsKey ? myUidsKey.split('|') : [];
    if (syncUids.length === 0) return;

    const unsubs: (() => void)[] = [];
    const recordUnsubs = new Map<string, () => void>();
    const casesByUid = new Map<string, ClinicalCase[]>();
    const supsByUid = new Map<string, Supervisor[]>();
    const sessionsByUid = new Map<string, TrainingSession[]>();
    const skillsByUid = new Map<string, UserSkill[]>();
    const recsByUid = new Map<string, RecommendationLetter[]>();
    const articlesByUid = new Map<string, SavedArticle[]>();
    const recordsBySup = new Map<string, TrainingRecord[]>();

    const dedupeById = <T extends { id?: string; userId?: string }>(items: T[]): T[] => {
      const seen = new Set<string>();
      return items.filter((item, idx) => {
        const key = item.id ? String(item.id) : (item.userId ? String(item.userId) : `item_${idx}`);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    const rebuildAllTrainingRecords = () => {
      const combined: TrainingRecord[] = [];
      recordsBySup.forEach(arr => combined.push(...arr));
      const deduped = dedupeById(combined);
      setTrainingRecords(deduped);
      saveLocal('records', deduped);
    };

    const syncRecordListenersForUid = (uid: string, supIds: string[]) => {
      const activeKeys = new Set(supIds.map(sid => `${uid}::${sid}`));
      for (const [key, unsub] of recordUnsubs.entries()) {
        if (key.startsWith(`${uid}::`) && !activeKeys.has(key)) {
          unsub();
          recordUnsubs.delete(key);
          recordsBySup.delete(key);
        }
      }
      for (const sid of supIds) {
        const compositeKey = `${uid}::${sid}`;
        if (!recordUnsubs.has(compositeKey)) {
          const recRef = collection(db, 'users', uid, 'supervisors', sid, 'trainingRecords');
          const unsub = onSnapshot(
            recRef,
            (recSnap) => {
              const supRecs = dedupeById(
                recSnap.docs.map(rd => ({ ...rd.data(), id: rd.id || rd.data().id, supervisorId: sid }) as TrainingRecord)
              );
              recordsBySup.set(compositeKey, supRecs);
              rebuildAllTrainingRecords();
            },
            (err) => console.warn(`Training records sync notice (${sid}):`, err.message)
          );
          recordUnsubs.set(compositeKey, unsub);
        }
      }
      if (supIds.length === 0) {
        rebuildAllTrainingRecords();
      }
    };

    try {
      setSyncStatus(prev => ({ ...prev, isSyncing: true }));

      for (const uid of syncUids) {
        // 1. Clinical Cases
        unsubs.push(
          onSnapshot(
            collection(db, 'users', uid, 'clinicalCases'),
            (snapshot) => {
              casesByUid.set(
                uid,
                snapshot.docs.map(d => ({ ...d.data(), id: d.id || d.data().id }) as ClinicalCase)
              );
              const merged = dedupeById(Array.from(casesByUid.values()).flat());
              setCases(merged);
              saveLocal('cases', merged);
            },
            (err) => console.warn(`Cases sync note (${uid}):`, err.message)
          )
        );

        // 2. Supervisors (+ nested Training Records)
        unsubs.push(
          onSnapshot(
            collection(db, 'users', uid, 'supervisors'),
            (snapshot) => {
              const uidSups = snapshot.docs.map(d => ({ ...d.data(), id: d.id || d.data().id }) as Supervisor);
              supsByUid.set(uid, uidSups);
              const merged = dedupeById(Array.from(supsByUid.values()).flat());
              setSupervisors(merged);
              saveLocal('supervisors', merged);
              syncRecordListenersForUid(uid, uidSups.map(s => s.id).filter(Boolean));
            },
            (err) => console.warn(`Supervisors sync note (${uid}):`, err.message)
          )
        );

        // 3. Training Sessions
        unsubs.push(
          onSnapshot(
            collection(db, 'users', uid, 'trainingSessions'),
            (snapshot) => {
              sessionsByUid.set(
                uid,
                snapshot.docs.map(d => ({ ...d.data(), id: d.id || d.data().id }) as TrainingSession)
              );
              const merged = dedupeById(Array.from(sessionsByUid.values()).flat());
              setTrainingSessions(merged);
              saveLocal('sessions', merged);
            },
            (err) => console.warn(`Sessions sync note (${uid}):`, err.message)
          )
        );

        // 4. Skills
        unsubs.push(
          onSnapshot(
            collection(db, 'users', uid, 'skills'),
            (snapshot) => {
              skillsByUid.set(
                uid,
                snapshot.docs.map(d => ({ ...d.data(), id: d.id || d.data().id }) as UserSkill)
              );
              const merged = dedupeById(Array.from(skillsByUid.values()).flat());
              setSkills(merged);
              saveLocal('skills', merged);
            },
            (err) => console.warn(`Skills sync note (${uid}):`, err.message)
          )
        );

        // 5. Recommendations
        unsubs.push(
          onSnapshot(
            collection(db, 'users', uid, 'recommendations'),
            (snapshot) => {
              recsByUid.set(
                uid,
                snapshot.docs.map(d => ({ ...d.data(), id: d.id || d.data().id }) as RecommendationLetter)
              );
              const merged = dedupeById(Array.from(recsByUid.values()).flat());
              setRecommendations(merged);
              saveLocal('recommendations', merged);
            },
            (err) => console.warn(`Recommendations sync note (${uid}):`, err.message)
          )
        );

        // 6. Saved Articles
        unsubs.push(
          onSnapshot(
            collection(db, 'users', uid, 'savedArticles'),
            (snapshot) => {
              articlesByUid.set(
                uid,
                snapshot.docs.map(d => ({ ...d.data(), id: d.id || d.data().id }) as SavedArticle)
              );
              const merged = dedupeById(Array.from(articlesByUid.values()).flat());
              setSavedArticles(merged);
              saveLocal('articles', merged);
            },
            (err) => console.warn(`Saved articles sync note (${uid}):`, err.message)
          )
        );
        // 7. Viewed Community Cases (per-user persisted unread publication tracking)
        unsubs.push(
          onSnapshot(
            collection(db, 'users', uid, 'viewedCommunityCases'),
            (snapshot) => {
              const cloudIds = snapshot.docs.map(d => d.id || (d.data() as any)?.caseId).filter(Boolean) as string[];
              if (cloudIds.length > 0) {
                setViewedCommunityCaseIds(prev => {
                  const merged = Array.from(new Set([...prev, ...cloudIds]));
                  safeSetLocalStorage(`surgitrack_viewed_comm_${currentUid}`, merged);
                  return merged;
                });
              }
            },
            (err) => console.warn(`Viewed community sync note (${uid}):`, err.message)
          )
        );
      }

      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date().toLocaleTimeString(),
      }));
    } catch (err: any) {
      console.warn('Sync setup error:', err);
      setSyncStatus(prev => ({ ...prev, isSyncing: false, syncError: err.message }));
    }

    return () => {
      unsubs.forEach(u => u());
      for (const unsub of recordUnsubs.values()) {
        unsub();
      }
      recordUnsubs.clear();
    };
  }, [myUidsKey, currentUid]);

  const loadMoreCommunityCases = () => {
    if (loadingMoreCommunity) return;
    setLoadingMoreCommunity(true);
    setCommunityPageSize(prev => prev + 15);
  };

  const fetchCommunityCaseById = async (caseId: string): Promise<ClinicalCase | null> => {
    if (!caseId) return null;
    const existing = communityCases.find(c => c.id === caseId);
    if (existing) return existing;
    try {
      const snap = await getDoc(doc(db, 'communityCases', caseId));
      if (!snap.exists()) return null;
      const fetched = { ...snap.data(), id: snap.id || snap.data().id } as ClinicalCase;
      if (fetched.isPublished === false || (fetched as any).isDraft || (fetched as any).deletedByAdmin) {
        return null;
      }
      setFetchedExtraCases(prev => [fetched, ...prev.filter(c => c.id !== fetched.id)]);
      return fetched;
    } catch (err) {
      console.warn('Could not fetch community case by id:', err);
      return null;
    }
  };

  const markCommunityCasesViewed = async (caseIds: string[]) => {
    const cleanIds = Array.from(new Set(caseIds.filter(Boolean)));
    if (cleanIds.length === 0) return;

    const unseen = cleanIds.filter(id => !viewedCommunityCaseIds.includes(id));
    if (unseen.length === 0) return;

    const nextIds = Array.from(new Set([...viewedCommunityCaseIds, ...unseen]));
    setViewedCommunityCaseIds(nextIds);
    safeSetLocalStorage(`surgitrack_viewed_comm_${currentUid}`, nextIds);

    const persistUid = auth.currentUser?.uid || (currentUid !== 'local-surgeon-001' ? currentUid : '');
    if (!persistUid || !navigator.onLine) return;

    try {
      const batch = writeBatch(db);
      const nowIso = new Date().toISOString();
      for (const caseId of unseen) {
        batch.set(
          doc(db, 'users', persistUid, 'viewedCommunityCases', caseId),
          {
            caseId,
            userId: persistUid,
            viewedAt: nowIso,
            viewedAtServer: serverTimestamp(),
          },
          { merge: true }
        );
      }
      await batch.commit();
    } catch (err) {
      console.warn('Could not persist viewedCommunityCases:', err);
    }
  };

  // Derive live allDoctors with accurate publishedCasesCount from rawDoctors + communityCases without race conditions
  const allDoctors = useMemo(() => {
    return rawDoctors.map(d => {
      const count = communityCases.filter(c => matchDoctorCase(c, d)).length;
      return d.publishedCasesCount === count ? d : { ...d, publishedCasesCount: count };
    });
  }, [rawDoctors, communityCases]);

  // Statistics calculation (tracks both total documented and supervisor-verified metrics, including surgical clinical cases)
  const stats = useMemo(() => {
    const totalCases = cases.length;
    const recordProcs = trainingRecords.filter(r => Boolean(r.procedureName?.trim()));
    const recordedCaseRefs = new Set(recordProcs.map(r => r.clinicalCaseRef).filter(Boolean));
    const extraCaseProcs = cases.filter(
      c => Boolean(c.surgicalProcedure?.procedureName?.trim()) && !recordedCaseRefs.has(c.caseReference)
    );
    const totalProcedures = recordProcs.length + extraCaseProcs.length;
    const verifiedProcedures = trainingRecords.filter(r => r.verified === true && Boolean(r.procedureName?.trim())).length;
    const totalSessions = trainingSessions.length;

    const skillsHours = skills.reduce((acc, s) => acc + (Number(s.totalDocumentedHours) || 0), 0);
    const verifiedSkillsHours = skills
      .filter(s => s.competencyStatus === 'Competency Confirmed' || s.competencyStatus === 'Supervisor Assessed')
      .reduce((acc, s) => acc + (Number(s.totalDocumentedHours) || 0), 0);

    const totalHours =
      trainingRecords.reduce((acc, r) => acc + (Number(r.netTrainingHours) || Number(r.hoursCount) || 0), 0) +
      skillsHours +
      trainingSessions.reduce((acc, s) => acc + (Number(s.netTrainingHours) || Number(s.hours) || 0), 0);

    const verifiedHours =
      trainingRecords
        .filter(r => r.verified === true)
        .reduce((acc, r) => acc + (Number(r.netTrainingHours) || Number(r.hoursCount) || 0), 0) +
      verifiedSkillsHours +
      trainingSessions
        .filter(s => s.verified === true)
        .reduce((acc, s) => acc + (Number(s.netTrainingHours) || Number(s.hours) || 0), 0);

    const unverifiedHours = Math.max(0, totalHours - verifiedHours);
    const totalSupervisors = supervisors.length;

    const hospitalSet = new Set<string>();
    cases.forEach(c => c.hospital && hospitalSet.add(c.hospital));
    supervisors.forEach(s => s.hospital && hospitalSet.add(s.hospital));
    trainingRecords.forEach(r => r.hospital && hospitalSet.add(r.hospital));

    const skillsPracticed = skills.filter(s => s.totalRecordedSessions > 0).length;
    const assessedCompetencies = skills.filter(
      s => s.competencyStatus === 'Competency Confirmed' || s.competencyStatus === 'Supervisor Assessed'
    ).length;

    const dates = trainingRecords
      .map(r => r.trainingDate)
      .concat(trainingSessions.map(s => s.trainingDate))
      .filter(Boolean)
      .sort();
    let weeks = 1;
    if (dates.length > 1) {
      const diff = Math.max(1, (new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()) / (7 * 24 * 3600 * 1000));
      weeks = Math.round(diff);
    }
    const weeklyAverageHours = Number((totalHours / weeks).toFixed(1));

    return {
      totalCases,
      totalProcedures,
      verifiedProcedures,
      totalSessions,
      totalHours: Number(totalHours.toFixed(1)),
      verifiedHours: Number(verifiedHours.toFixed(1)),
      unverifiedHours: Number(unverifiedHours.toFixed(1)),
      totalSupervisors,
      totalHospitals: hospitalSet.size,
      skillsPracticed,
      assessedCompetencies,
      weeklyAverageHours,
    };
  }, [cases, trainingRecords, trainingSessions, supervisors, skills]);

  // Auto-sync real documented & verified surgical metrics + published case count across all user's Firestore alias docs
  useEffect(() => {
    const syncTargets = myUids.filter(id => id && id !== 'local-surgeon-001');
    if (syncTargets.length === 0 || !navigator.onLine) return;

    const myPubCount = communityCases.filter(c =>
      matchDoctorCase(c, {
        userId: profile?.userId || currentUid,
        id: user?.uid,
        aliasIds: myUids,
        email: user?.email || profile?.email,
        fullName: profile?.fullName,
      })
    ).length;

    const metricsKey = `${syncTargets.join(',')}|${stats.totalHours}|${stats.verifiedHours}|${stats.totalProcedures}|${stats.verifiedProcedures}|${myPubCount}`;
    if (lastSyncedMetricsRef.current === metricsKey) return;

    const timer = setTimeout(async () => {
      try {
        const syncPayload = cleanPayload({
          totalHours: stats.totalHours,
          verifiedHours: stats.verifiedHours,
          totalProcedures: stats.totalProcedures,
          verifiedProcedures: stats.verifiedProcedures,
          publishedCasesCount: myPubCount,
          updatedAt: new Date().toISOString(),
        });

        for (const uid of syncTargets) {
          await setDoc(doc(db, 'users', uid), syncPayload, { merge: true }).catch(() => {});
        }
        lastSyncedMetricsRef.current = metricsKey;
      } catch (err) {
        console.warn('Metrics auto-sync warning:', err);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [myUidsKey, profile?.email, profile?.fullName, stats.totalHours, stats.verifiedHours, stats.totalProcedures, stats.verifiedProcedures, communityCases]);

  // Helper: Notify ALL eligible followers across all alias UIDs with deterministic ID (prevents missed alerts or duplicates)
  const notifyFollowersOfPublishedCase = async (publishedCase: ClinicalCase) => {
    if (!publishedCase.isPublished) return;
    const targetUid = profile?.userId || user?.uid || currentUid;
    const selfDoc = allDoctors.find(
      d =>
        d.userId === targetUid ||
        (d.aliasIds && d.aliasIds.some(a => myUids.includes(a))) ||
        (profile?.email && d.email && d.email.toLowerCase() === profile.email.toLowerCase())
    );

    const authorDocIdsToCheck = Array.from(
      new Set([targetUid, ...myUids, ...(selfDoc?.aliasIds || [])].filter(id => id && id !== 'local-surgeon-001'))
    );

    let liveDocFollowers: string[] = [];
    if (navigator.onLine) {
      for (const uid of authorDocIdsToCheck) {
        try {
          const freshSnap = await getDoc(doc(db, 'users', uid));
          if (freshSnap.exists() && Array.isArray(freshSnap.data().followers)) {
            liveDocFollowers.push(...freshSnap.data().followers);
          }
        } catch {
          // Proceed with remaining alias docs
        }
      }
    }

    const baseFollowerIds = Array.from(
      new Set([...(profile?.followers || []), ...(selfDoc?.followers || []), ...liveDocFollowers])
    ).filter(fid => fid && !myUids.includes(fid));

    // Resolve each follower to all their known alias UIDs so notifications reach whichever device/login method they use
    const recipientUids = new Set<string>();
    for (const fid of baseFollowerIds) {
      recipientUids.add(fid);
      const followerDoc = allDoctors.find(d => d.userId === fid || d.aliasIds?.includes(fid));
      if (followerDoc) {
        if (followerDoc.userId && !myUids.includes(followerDoc.userId)) {
          recipientUids.add(followerDoc.userId);
        }
        followerDoc.aliasIds?.forEach(alias => {
          if (alias && !myUids.includes(alias)) recipientUids.add(alias);
        });
      }
    }

    const caseTitle = publishedCase.primaryDiagnosis || publishedCase.caseReference || 'Clinical Case';
    const authorDisplayName = (publishedCase.authorName || profile?.fullName || 'Colleague Surgeon').trim();

    for (const followerId of recipientUids) {
      const deterministicId = `notif_pub_${publishedCase.id}_${followerId}`;
      await dispatchNotification(
        {
          title: 'New Clinical Case Published',
          message: `${authorDisplayName} published a new case: "${caseTitle}"`,
          category: 'social',
          type: 'new_case',
          senderUserId: publishedCase.userId || targetUid,
          senderName: authorDisplayName,
          senderPhotoUrl: publishedCase.authorPhotoUrl || profile?.profilePhotoUrl || '',
          targetUserId: followerId,
          targetCaseId: publishedCase.id,
          targetCaseTitle: caseTitle,
          navigationRef: `/community/case/${publishedCase.id}`,
        },
        deterministicId
      );
    }
  };

  // Helper: Verify ownership before mutating/deleting a clinical case
  const verifyCaseOwnership = (caseId: string): ClinicalCase | undefined => {
    const personalTarget = cases.find(c => c.id === caseId);
    const communityTarget = communityCases.find(c => c.id === caseId);
    const target = personalTarget || communityTarget;
    if (!target) return undefined;

    const activeEmail = (user?.email || profile?.email || auth.currentUser?.email || '').toLowerCase().trim();
    const isAdmin =
      profile?.role === 'super_admin' || activeEmail === 'zeadmorud2030@gmail.com';
    const combinedAliases = Array.from(
      new Set([
        ...(profile?.aliasIds || []),
        ...myUids,
        currentUid,
        profile?.userId,
        user?.uid,
        auth.currentUser?.uid,
      ].filter(Boolean))
    ) as string[];

    const isOwner =
      !target.userId ||
      target.userId === 'local-surgeon-001' ||
      combinedAliases.includes(target.userId) ||
      matchDoctorCase(target, {
        userId: profile?.userId || currentUid,
        id: user?.uid || auth.currentUser?.uid,
        email: activeEmail,
        fullName: profile?.fullName || user?.displayName || undefined,
        aliasIds: combinedAliases,
      });

    // Cases stored inside the user's own personal logbook (`cases`) are always owned by the active portfolio
    if (!personalTarget && !isOwner && !isAdmin) {
      throw new Error('Permission denied: Only the original author can modify or delete this clinical case.');
    }
    return target;
  };

  // CRUD Cases & Community Publishing (atomic Firestore commits + server timestamps)
  const addCase = async (
    c: Omit<ClinicalCase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
    publishToCommunity: boolean = false
  ): Promise<string> => {
    const id = `case_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const effectiveUid = auth.currentUser?.uid || profile?.userId || currentUid;
    const authorName = (profile?.fullName || user?.displayName || 'Dr. Medical Trainee').trim();
    const authorSpecialty = profile?.specialty || c.specialty;
    const authorHospital = profile?.hospitals || c.hospital;
    const authorPhotoUrl = profile?.profilePhotoUrl || '';
    const authorEmail = (auth.currentUser?.email || user?.email || profile?.email || '').toLowerCase().trim();
    const nowIso = new Date().toISOString();

    const newCase: ClinicalCase = {
      ...c,
      id,
      userId: effectiveUid,
      authorEmail,
      isPublished: Boolean(publishToCommunity),
      publishedAt: publishToCommunity ? nowIso : undefined,
      authorName,
      authorSpecialty,
      authorHospital,
      authorPhotoUrl,
      likesCount: 0,
      likedByUserIds: [],
      likedByUsers: [],
      commentsCount: 0,
      comments: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const cleanedCase = cleanPayload(newCase);
    const payloadBytes = estimateJsonByteSize(cleanedCase);
    if (payloadBytes >= MAX_FIRESTORE_DOC_BYTES) {
      throw new Error(
        `Clinical case payload is too large (${Math.round(payloadBytes / 1024)} KB) for Cloud Firestore (limit 920 KB). Please remove large attachments or compress images.`
      );
    }

    const cloudCasePayload = cleanPayload({
      ...cleanedCase,
      createdAtServer: serverTimestamp(),
      updatedAtServer: serverTimestamp(),
      ...(publishToCommunity ? { publishedAtServer: serverTimestamp() } : {}),
    });

    if (navigator.onLine) {
      const hasCloudSession = Boolean(effectiveUid && effectiveUid !== 'local-surgeon-001');
      if (hasCloudSession || publishToCommunity) {
        const batch = writeBatch(db);
        if (hasCloudSession) {
          batch.set(doc(db, 'users', effectiveUid, 'clinicalCases', id), {
            ...cloudCasePayload,
            userId: effectiveUid,
          });
        }
        if (publishToCommunity) {
          batch.set(doc(db, 'communityCases', id), cloudCasePayload);
        }
        try {
          await batch.commit();
        } catch (err: any) {
          if (isFirestoreQuotaError(err)) {
            console.warn('Clinical case saved locally (Firestore daily quota exceeded).');
            setFirestoreQuotaExceeded(true);
            enqueueOfflineAction({ id, type: 'case', action: 'create', data: cleanedCase, timestamp: nowIso });
            if (publishToCommunity) {
              enqueueOfflineAction({ id, type: 'community_case', action: 'create', data: cleanedCase, timestamp: nowIso });
            }
          } else {
            console.warn('Failed to commit clinical case to Firestore:', err);
            if (String(err?.message || '').toLowerCase().includes('permission')) {
              handleFirestoreError(err, OperationType.CREATE, publishToCommunity ? `communityCases/${id}` : `users/${effectiveUid}/clinicalCases/${id}`);
            }
            throw new Error(`Failed to save clinical case to cloud database: ${err.message || String(err)}`);
          }
        }

        // Sync any additional linked alias UIDs in background without blocking publish confirmation
        const aliasTargets = Array.from(new Set([profile?.userId, user?.uid, currentUid].filter(Boolean))) as string[];
        for (const uid of aliasTargets) {
          if (uid === 'local-surgeon-001' || uid === effectiveUid) continue;
          setDoc(doc(db, 'users', uid, 'clinicalCases', id), { ...cloudCasePayload, userId: uid }, { merge: true }).catch(() => {});
        }
      }
    } else {
      enqueueOfflineAction({ id, type: 'case', action: 'create', data: cleanedCase, timestamp: nowIso });
      if (publishToCommunity) {
        enqueueOfflineAction({ id, type: 'community_case', action: 'create', data: cleanedCase, timestamp: nowIso });
      }
    }

    const updated = [newCase, ...cases.filter(item => item.id !== id)];
    setCases(updated);
    saveLocal('cases', updated);

    if (publishToCommunity) {
      const updatedCommunity = [newCase, ...communityCases.filter(item => item.id !== id)];
      setCommunityCases(updatedCommunity);
      saveCompactCommunityCache(updatedCommunity);
      // Dispatch persistent notifications to followers ONLY after Firestore commit confirms
      await notifyFollowersOfPublishedCase(newCase);
    }

    return id;
  };

  const updateCase = async (id: string, updates: Partial<ClinicalCase>) => {
    const existingCase = verifyCaseOwnership(id);
    const authorEmail = (auth.currentUser?.email || user?.email || profile?.email || '').toLowerCase().trim();
    const authorName = (profile?.fullName || user?.displayName || existingCase?.authorName || '').trim();
    const authorSpecialty = profile?.specialty || updates.specialty || existingCase?.authorSpecialty;
    const authorHospital = profile?.hospitals || updates.hospital || existingCase?.authorHospital;
    const authorPhotoUrl = profile?.profilePhotoUrl ?? existingCase?.authorPhotoUrl;
    const nowIso = new Date().toISOString();

    const cleanedUpdates = cleanPayload({
      ...updates,
      ...(authorEmail ? { authorEmail } : {}),
      ...(authorName ? { authorName } : {}),
      ...(authorSpecialty ? { authorSpecialty } : {}),
      ...(authorHospital ? { authorHospital } : {}),
      ...(authorPhotoUrl !== undefined ? { authorPhotoUrl } : {}),
      updatedAt: nowIso,
    });

    const isAlreadyPublished = communityCases.some(c => c.id === id);
    const shouldSyncCommunity = isAlreadyPublished || Boolean(updates.isPublished);
    const resolvedOwnerUid = auth.currentUser?.uid || existingCase?.userId || currentUid;
    const fullMergedForCommunity = existingCase
      ? cleanPayload({
          ...existingCase,
          ...cleanedUpdates,
          userId: resolvedOwnerUid,
          isPublished: updates.isPublished ?? existingCase.isPublished ?? isAlreadyPublished,
        })
      : cleanedUpdates;

    const bytesToValidate = estimateJsonByteSize(fullMergedForCommunity);
    if (bytesToValidate >= MAX_FIRESTORE_DOC_BYTES) {
      throw new Error(
        `Clinical case payload is too large (${Math.round(bytesToValidate / 1024)} KB) for Cloud Firestore (limit 920 KB). Please remove large attachments.`
      );
    }

    const cloudUpdates = cleanPayload({
      ...cleanedUpdates,
      updatedAtServer: serverTimestamp(),
    });
    const cloudCommunityPayload = cleanPayload({
      ...fullMergedForCommunity,
      updatedAtServer: serverTimestamp(),
      ...(!existingCase?.publishedAtServer && shouldSyncCommunity ? { publishedAtServer: serverTimestamp(), publishedAt: fullMergedForCommunity.publishedAt || nowIso } : {}),
    });

    if (navigator.onLine) {
      const targetUids = Array.from(new Set([auth.currentUser?.uid, profile?.userId, user?.uid, currentUid].filter(Boolean))) as string[];
      for (const uid of targetUids) {
        if (uid === 'local-surgeon-001') continue;
        try {
          await setDoc(doc(db, 'users', uid, 'clinicalCases', id), cloudUpdates, { merge: true });
        } catch { /* proceed across aliases */ }
      }
      if (shouldSyncCommunity) {
        try {
          await setDoc(doc(db, 'communityCases', id), cloudCommunityPayload, { merge: true });
        } catch (err: any) {
          if (isFirestoreQuotaError(err)) {
            console.warn('Case update saved locally (Firestore daily quota exceeded).');
            setFirestoreQuotaExceeded(true);
            enqueueOfflineAction({ id, type: 'community_case', action: 'update', data: fullMergedForCommunity, timestamp: nowIso });
          } else {
            console.warn('Failed to update published case in Firestore communityCases:', err);
            throw new Error(`Failed to update Community post: ${err.message || String(err)}`);
          }
        }
      }
    } else {
      enqueueOfflineAction({ id, type: 'case', action: 'update', data: cleanedUpdates, timestamp: nowIso });
      if (shouldSyncCommunity) {
        enqueueOfflineAction({ id, type: 'community_case', action: 'update', data: fullMergedForCommunity, timestamp: nowIso });
      }
    }

    const updated = cases.map(c => c.id === id ? { ...c, ...cleanedUpdates } : c);
    setCases(updated);
    saveLocal('cases', updated);

    const updatedCommunity = communityCases.map(c => c.id === id ? { ...c, ...fullMergedForCommunity } : c);
    setCommunityCases(updatedCommunity);
    saveCompactCommunityCache(updatedCommunity);
  };

  const publishCaseToCommunity = async (caseId: string, overrideData?: Partial<ClinicalCase>) => {
    const target = verifyCaseOwnership(caseId);
    if (!target) {
      throw new Error('Clinical case not found.');
    }
    const mergedSource: ClinicalCase = { ...target, ...(overrideData || {}) };
    const effectiveUid = auth.currentUser?.uid || profile?.userId || mergedSource.userId || currentUid;
    const authorName = (profile?.fullName || mergedSource.authorName || 'Dr. Medical Resident').trim();
    const authorSpecialty = profile?.specialty || mergedSource.authorSpecialty || mergedSource.specialty;
    const authorHospital = profile?.hospitals || mergedSource.authorHospital || mergedSource.hospital;
    const authorPhotoUrl = profile?.profilePhotoUrl || mergedSource.authorPhotoUrl || '';
    const authorEmail = (auth.currentUser?.email || user?.email || profile?.email || (mergedSource as any).authorEmail || '').toLowerCase().trim();
    const nowIso = new Date().toISOString();
    const isFirstPublish = !mergedSource.isPublished || !mergedSource.publishedAt;

    const fullUpdated: ClinicalCase = cleanPayload({
      ...mergedSource,
      userId: effectiveUid,
      isPublished: true,
      publishedAt: isFirstPublish ? nowIso : mergedSource.publishedAt,
      authorName,
      authorEmail,
      authorSpecialty,
      authorHospital,
      authorPhotoUrl,
      likesCount: mergedSource.likesCount || 0,
      likedByUserIds: mergedSource.likedByUserIds || [],
      likedByUsers: mergedSource.likedByUsers || [],
      commentsCount: mergedSource.commentsCount || 0,
      comments: mergedSource.comments || [],
      updatedAt: nowIso,
    });

    const payloadBytes = estimateJsonByteSize(fullUpdated);
    if (payloadBytes >= MAX_FIRESTORE_DOC_BYTES) {
      throw new Error(
        `Clinical case payload is too large (${Math.round(payloadBytes / 1024)} KB) for Cloud Firestore (limit 920 KB). Please remove large attachments.`
      );
    }

    const cloudPublishPayload = cleanPayload({
      ...fullUpdated,
      updatedAtServer: serverTimestamp(),
      ...(mergedSource.publishedAtServer && mergedSource.isPublished
        ? {}
        : { publishedAtServer: serverTimestamp() }),
      ...(mergedSource.createdAtServer ? {} : { createdAtServer: serverTimestamp() }),
    });

    if (navigator.onLine) {
      try {
        const batch = writeBatch(db);
        batch.set(doc(db, 'communityCases', caseId), cloudPublishPayload, { merge: true });
        if (effectiveUid && effectiveUid !== 'local-surgeon-001') {
          batch.set(
            doc(db, 'users', effectiveUid, 'clinicalCases', caseId),
            { ...cloudPublishPayload, userId: effectiveUid },
            { merge: true }
          );
        }
        await batch.commit();

        const aliasUids = Array.from(new Set([profile?.userId, user?.uid, currentUid].filter(Boolean))) as string[];
        for (const uid of aliasUids) {
          if (uid === 'local-surgeon-001' || uid === effectiveUid) continue;
          setDoc(doc(db, 'users', uid, 'clinicalCases', caseId), { ...cloudPublishPayload, userId: uid }, { merge: true }).catch(() => {});
        }
      } catch (e: any) {
        if (isFirestoreQuotaError(e)) {
          console.warn('Published case queued locally (Firestore daily quota exceeded).');
          setFirestoreQuotaExceeded(true);
          enqueueOfflineAction({ id: caseId, type: 'community_case', action: 'create', data: fullUpdated, timestamp: nowIso });
          enqueueOfflineAction({ id: caseId, type: 'case', action: 'update', data: fullUpdated, timestamp: nowIso });
        } else {
          console.warn('Failed to publish case to Firestore:', e);
          if (String(e?.message || '').toLowerCase().includes('permission')) {
            handleFirestoreError(e, OperationType.WRITE, `communityCases/${caseId}`);
          }
          throw new Error(`Failed to publish case to community feed: ${e.message || String(e)}`);
        }
      }
    } else {
      enqueueOfflineAction({ id: caseId, type: 'community_case', action: 'create', data: fullUpdated, timestamp: nowIso });
      enqueueOfflineAction({ id: caseId, type: 'case', action: 'update', data: fullUpdated, timestamp: nowIso });
    }

    const updatedCasesList = cases.map(c => c.id === caseId ? fullUpdated : c);
    setCases(updatedCasesList);
    saveLocal('cases', updatedCasesList);

    const updatedCommunity = [fullUpdated, ...communityCases.filter(c => c.id !== caseId)];
    setCommunityCases(updatedCommunity);
    saveCompactCommunityCache(updatedCommunity);

    await notifyFollowersOfPublishedCase(fullUpdated);
  };

  const unpublishCaseFromCommunity = async (caseId: string) => {
    verifyCaseOwnership(caseId);
    if (navigator.onLine) {
      try {
        await deleteDoc(doc(db, 'communityCases', caseId));
      } catch (e: any) {
        if (isFirestoreQuotaError(e)) {
          console.warn('Unpublish queued locally (Firestore daily quota exceeded).');
          setFirestoreQuotaExceeded(true);
          enqueueOfflineAction({ id: caseId, type: 'community_case', action: 'delete', timestamp: new Date().toISOString() });
        } else {
          console.warn('Failed to unpublish case from Firestore communityCases:', e);
          throw new Error(`Failed to remove post from community feed: ${e.message || String(e)}`);
        }
      }
    } else {
      enqueueOfflineAction({ id: caseId, type: 'community_case', action: 'delete', timestamp: new Date().toISOString() });
    }

    const targetUids = Array.from(new Set([...myUids, currentUid].filter(Boolean))) as string[];
    if (navigator.onLine) {
      for (const uid of targetUids) {
        if (uid === 'local-surgeon-001') continue;
        try {
          await setDoc(doc(db, 'users', uid, 'clinicalCases', caseId), { isPublished: false, updatedAt: new Date().toISOString() }, { merge: true });
        } catch { /* proceed */ }
      }
    } else {
      enqueueOfflineAction({ id: caseId, type: 'case', action: 'update', data: { isPublished: false, updatedAt: new Date().toISOString() }, timestamp: new Date().toISOString() });
    }

    const updatedCasesList = cases.map(c => c.id === caseId ? { ...c, isPublished: false, updatedAt: new Date().toISOString() } : c);
    setCases(updatedCasesList);
    saveLocal('cases', updatedCasesList);

    const updatedCommunity = communityCases.filter(c => c.id !== caseId);
    setCommunityCases(updatedCommunity);
    saveCompactCommunityCache(updatedCommunity);
  };

  const deleteCase = async (id: string) => {
    const target = verifyCaseOwnership(id);
    const inPersonalCases = cases.some(c => c.id === id);
    const hasCommunityCopy = communityCases.some(c => c.id === id) || Boolean(target?.isPublished);

    if (navigator.onLine) {
      try {
        const targetUids = Array.from(new Set([...myUids, currentUid, auth.currentUser?.uid].filter(Boolean))) as string[];
        for (const uid of targetUids) {
          if (uid === 'local-surgeon-001') continue;
          try {
            await deleteDoc(doc(db, 'users', uid, 'clinicalCases', id));
          } catch (uidErr: any) {
            if (isFirestoreQuotaError(uidErr)) throw uidErr;
          }
        }
        if (hasCommunityCopy) {
          try {
            await deleteDoc(doc(db, 'communityCases', id));
          } catch (commErr: any) {
            if (isFirestoreQuotaError(commErr)) throw commErr;
            if (!inPersonalCases) throw commErr;
            console.warn('Skipped legacy community copy delete:', commErr?.message);
          }
        }
      } catch (err: any) {
        if (isFirestoreQuotaError(err)) {
          console.warn('Case delete queued locally (Firestore daily quota exceeded).');
          setFirestoreQuotaExceeded(true);
          enqueueOfflineAction({ id, type: 'case', action: 'delete', timestamp: new Date().toISOString() });
          if (hasCommunityCopy) {
            enqueueOfflineAction({ id, type: 'community_case', action: 'delete', timestamp: new Date().toISOString() });
          }
        } else {
          console.warn('Failed to delete case from Firestore:', err);
          throw new Error(`Failed to delete case from database: ${err.message || String(err)}`);
        }
      }
    } else {
      enqueueOfflineAction({ id, type: 'case', action: 'delete', timestamp: new Date().toISOString() });
      if (hasCommunityCopy) {
        enqueueOfflineAction({ id, type: 'community_case', action: 'delete', timestamp: new Date().toISOString() });
      }
    }

    const updated = cases.filter(c => c.id !== id);
    setCases(updated);
    saveLocal('cases', updated);

    const updatedCommunity = communityCases.filter(c => c.id !== id);
    setCommunityCases(updatedCommunity);
    saveCompactCommunityCache(updatedCommunity);
  };

  const deleteCaseAttachment = async (caseId: string, attachmentId: string) => {
    const target = verifyCaseOwnership(caseId);
    if (!target) return;

    const updatedAttachments = (target.attachments || []).filter(a => a.id !== attachmentId);
    const updatedCase: ClinicalCase = {
      ...target,
      attachments: updatedAttachments,
      updatedAt: new Date().toISOString(),
    };

    const updatedCases = cases.map(c => c.id === caseId ? updatedCase : c);
    setCases(updatedCases);
    saveLocal('cases', updatedCases);

    const updatedCommunity = communityCases.map(c => c.id === caseId ? updatedCase : c);
    setCommunityCases(updatedCommunity);
    saveCompactCommunityCache(updatedCommunity);

    if (currentUid && currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({
          id: caseId,
          type: 'case',
          action: 'update',
          data: { attachments: updatedAttachments },
          timestamp: new Date().toISOString(),
        });
      } else {
        try {
          await setDoc(doc(db, 'users', currentUid, 'clinicalCases', caseId), { attachments: updatedAttachments }, { merge: true });
          if (communityCases.some(c => c.id === caseId)) {
            await setDoc(doc(db, 'communityCases', caseId), { attachments: updatedAttachments }, { merge: true });
          }
        } catch (err) {
          console.warn('Failed to delete attachment from Firestore:', err);
          enqueueOfflineAction({
            id: caseId,
            type: 'case',
            action: 'update',
            data: { attachments: updatedAttachments },
            timestamp: new Date().toISOString(),
          });
        }
      }
    }
  };

  // Social Interactions (Zero-Read Atomic WriteBatches + Graceful Quota/Offline Fallback)
  const toggleLikeCase = async (caseId: string) => {
    let target = communityCases.find(c => c.id === caseId) || null;
    if (!target && navigator.onLine) {
      try {
        target = await fetchCommunityCaseById(caseId);
      } catch (err) {
        if (isFirestoreQuotaError(err)) {
          setFirestoreQuotaExceeded(true);
        }
      }
    }
    if (!target) return;

    const actorLikeId = auth.currentUser?.uid || currentUid;
    const activeIds = Array.from(new Set([actorLikeId, currentUid, ...myUids].filter(Boolean))) as string[];
    const alreadyLikedLocal = (target.likedByUserIds || []).some(id => activeIds.includes(id));
    const becameLiked = !alreadyLikedLocal;
    const nowIso = new Date().toISOString();

    const likerEntry = cleanPayload({
      userId: actorLikeId,
      fullName: profile?.fullName || 'Colleague Surgeon',
      specialty: profile?.specialty || 'Surgery Resident',
      photoUrl: profile?.profilePhotoUrl || '',
    });

    const updatedLikedByUserIds = becameLiked
      ? Array.from(new Set([...(target.likedByUserIds || []), actorLikeId]))
      : (target.likedByUserIds || []).filter(id => !activeIds.includes(id));
    const updatedLikedByUsers = becameLiked
      ? [...(target.likedByUsers || []).filter(u => !activeIds.includes(u.userId)), likerEntry]
      : (target.likedByUsers || []).filter(u => !activeIds.includes(u.userId));
    const updatedLikesCount = Math.max(0, updatedLikedByUserIds.length);

    const localSocialPatch: Partial<ClinicalCase> = cleanPayload({
      likesCount: updatedLikesCount,
      likedByUserIds: updatedLikedByUserIds,
      likedByUsers: updatedLikedByUsers,
      updatedAt: nowIso,
    });

    const applyLocalLikeState = () => {
      const updatedCommunity = communityCases.map(c => c.id === caseId ? { ...c, ...localSocialPatch } : c);
      setCommunityCases(updatedCommunity);
      setFetchedExtraCases(prev => prev.map(c => c.id === caseId ? { ...c, ...localSocialPatch } : c));
      saveCompactCommunityCache(updatedCommunity);
      setCases(prev => prev.map(c => c.id === caseId ? { ...c, ...localSocialPatch } : c));
    };

    // Optimistic update immediately so UI stays responsive
    applyLocalLikeState();

    if (actorLikeId !== 'local-surgeon-001' && navigator.onLine) {
      try {
        const commRef = doc(db, 'communityCases', caseId);
        const likeDocRef = doc(db, 'communityCases', caseId, 'likes', actorLikeId);
        const batch = writeBatch(db);

        if (becameLiked) {
          const likePayload: CaseLike = cleanPayload({
            userId: actorLikeId,
            caseId,
            fullName: profile?.fullName || 'Colleague Surgeon',
            specialty: profile?.specialty || 'Surgery Resident',
            photoUrl: profile?.profilePhotoUrl || '',
            createdAt: nowIso,
            createdAtServer: serverTimestamp(),
          });
          batch.set(likeDocRef, likePayload);
          batch.update(commRef, cleanPayload({
            likesCount: increment(1),
            likedByUserIds: arrayUnion(actorLikeId),
            likedByUsers: arrayUnion(likerEntry),
            updatedAt: nowIso,
            updatedAtServer: serverTimestamp(),
          }));
        } else {
          batch.delete(likeDocRef);
          batch.update(commRef, cleanPayload({
            likesCount: updatedLikesCount,
            likedByUserIds: arrayRemove(...activeIds),
            likedByUsers: updatedLikedByUsers,
            updatedAt: nowIso,
            updatedAtServer: serverTimestamp(),
          }));
        }

        await batch.commit();

        if (target.userId && activeIds.includes(target.userId)) {
          setDoc(doc(db, 'users', currentUid, 'clinicalCases', caseId), localSocialPatch, { merge: true }).catch(() => {});
        }
      } catch (e: any) {
        if (isFirestoreQuotaError(e)) {
          console.warn('Like persisted locally (Firestore daily quota exceeded).');
          setFirestoreQuotaExceeded(true);
          return;
        }
        console.warn('Like write error:', e?.message || e);
        throw new Error(`Could not save like: ${e?.message || String(e)}`);
      }
    }

    if (becameLiked && target.userId && !activeIds.includes(target.userId)) {
      const authorDoc = allDoctors.find(d => d.userId === target.userId || d.aliasIds?.includes(target.userId) || matchDoctorCase(target, d));
      const recipientIds = Array.from(
        new Set([target.userId, authorDoc?.userId, ...(authorDoc?.aliasIds || [])].filter(id => id && !activeIds.includes(id)))
      ) as string[];
      for (const recipientId of recipientIds) {
        const deterministicLikeNotifId = `notif_like_${caseId}_${actorLikeId}_${recipientId}`;
        await dispatchNotification(
          {
            title: 'Case Recommended',
            message: `${profile?.fullName || 'A surgical colleague'} liked your clinical case: "${target.primaryDiagnosis || target.caseReference}"`,
            category: 'social',
            type: 'new_like',
            senderUserId: actorLikeId,
            senderName: profile?.fullName || 'Colleague Surgeon',
            senderPhotoUrl: profile?.profilePhotoUrl || '',
            targetUserId: recipientId,
            targetCaseId: caseId,
            targetCaseTitle: target.primaryDiagnosis || target.caseReference,
            navigationRef: `/community/case/${caseId}`,
          },
          deterministicLikeNotifId
        );
      }
    }
  };

  const addCommentToCase = async (caseId: string, commentText: string) => {
    if (!commentText.trim()) return;
    let target = communityCases.find(c => c.id === caseId) || null;
    if (!target && navigator.onLine) {
      try {
        target = await fetchCommunityCaseById(caseId);
      } catch (err) {
        if (isFirestoreQuotaError(err)) {
          setFirestoreQuotaExceeded(true);
        }
      }
    }
    if (!target) {
      throw new Error('Clinical case not found in community feed.');
    }

    const actorUid = auth.currentUser?.uid || currentUid;
    const activeIds = Array.from(new Set([actorUid, currentUid, ...myUids].filter(Boolean))) as string[];
    const commentId = `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const nowIso = new Date().toISOString();

    const newCommentSummary: CaseComment = cleanPayload({
      id: commentId,
      caseId,
      userId: actorUid,
      userName: profile?.fullName || 'Dr. Colleague Surgeon',
      userSpecialty: profile?.specialty || 'Surgical Trainee',
      userPhotoUrl: profile?.profilePhotoUrl || '',
      commentText: commentText.trim(),
      createdAt: nowIso,
    });

    const updatedComments = [...(target.comments || []), newCommentSummary];
    const localPatch: Partial<ClinicalCase> = cleanPayload({
      commentsCount: Math.max(updatedComments.length, (Number(target.commentsCount) || 0) + 1),
      comments: updatedComments,
      updatedAt: nowIso,
    });

    const updatedCommunity = communityCases.map(c => c.id === caseId ? { ...c, ...localPatch } : c);
    setCommunityCases(updatedCommunity);
    setFetchedExtraCases(prev => prev.map(c => c.id === caseId ? { ...c, ...localPatch } : c));
    saveCompactCommunityCache(updatedCommunity);
    setCases(prev => prev.map(c => c.id === caseId ? { ...c, ...localPatch } : c));

    if (actorUid !== 'local-surgeon-001' && navigator.onLine) {
      try {
        const commRef = doc(db, 'communityCases', caseId);
        const commentDocRef = doc(db, 'communityCases', caseId, 'comments', commentId);
        const batch = writeBatch(db);

        batch.set(commentDocRef, {
          ...newCommentSummary,
          createdAtServer: serverTimestamp(),
        });

        batch.update(commRef, cleanPayload({
          commentsCount: increment(1),
          comments: arrayUnion(newCommentSummary),
          updatedAt: nowIso,
          updatedAtServer: serverTimestamp(),
        }));

        await batch.commit();

        if (target.userId && activeIds.includes(target.userId)) {
          setDoc(doc(db, 'users', currentUid, 'clinicalCases', caseId), localPatch, { merge: true }).catch(() => {});
        }
      } catch (e: any) {
        if (isFirestoreQuotaError(e)) {
          console.warn('Comment persisted locally (Firestore daily quota exceeded).');
          setFirestoreQuotaExceeded(true);
          return;
        }
        console.warn('Comment write error:', e?.message || e);
        throw new Error(`Failed to post comment: ${e?.message || String(e)}`);
      }
    }

    if (target.userId && !activeIds.includes(target.userId)) {
      const authorDoc = allDoctors.find(d => d.userId === target.userId || d.aliasIds?.includes(target.userId) || matchDoctorCase(target, d));
      const recipientIds = Array.from(
        new Set([target.userId, authorDoc?.userId, ...(authorDoc?.aliasIds || [])].filter(id => id && !activeIds.includes(id)))
      ) as string[];
      for (const recipientId of recipientIds) {
        const deterministicCmtNotifId = `notif_cmt_${caseId}_${commentId}_${recipientId}`;
        await dispatchNotification(
          {
            title: 'New Discussion Comment',
            message: `${profile?.fullName || 'A surgical colleague'} commented on "${target.primaryDiagnosis || target.caseReference}": "${commentText.trim().substring(0, 70)}"`,
            category: 'social',
            type: 'new_comment',
            senderUserId: actorUid,
            senderName: profile?.fullName || 'Colleague Surgeon',
            senderPhotoUrl: profile?.profilePhotoUrl || '',
            targetUserId: recipientId,
            targetCaseId: caseId,
            targetCaseTitle: target.primaryDiagnosis || target.caseReference,
            navigationRef: `/community/case/${caseId}`,
          },
          deterministicCmtNotifId
        );
      }
    }
  };

  const deleteCommentFromCase = async (caseId: string, commentId: string) => {
    const actorUid = auth.currentUser?.uid || currentUid;
    const isAdmin = profile?.role === 'super_admin' || user?.email?.toLowerCase() === 'zeadmorud2030@gmail.com';
    const activeIds = Array.from(new Set([actorUid, currentUid, ...myUids].filter(Boolean))) as string[];

    const target = communityCases.find(c => c.id === caseId) || fetchedExtraCases.find(c => c.id === caseId) || null;
    const existingComments = Array.isArray(target?.comments) ? target.comments : [];
    const targetComment = existingComments.find(cm => cm.id === commentId);

    if (targetComment && !isAdmin && targetComment.userId && !activeIds.includes(targetComment.userId)) {
      throw new Error('Permission denied: You can only delete your own comment.');
    }

    const nextComments = existingComments.filter(cm => cm.id !== commentId);
    const nextCount = Math.max(0, nextComments.length);
    const nowIso = new Date().toISOString();

    const applyLocalDeleteState = () => {
      const updatedCommunity = communityCases.map(c =>
        c.id === caseId ? { ...c, comments: nextComments, commentsCount: nextCount, updatedAt: nowIso } : c
      );
      setCommunityCases(updatedCommunity);
      setFetchedExtraCases(prev =>
        prev.map(c => c.id === caseId ? { ...c, comments: nextComments, commentsCount: nextCount, updatedAt: nowIso } : c)
      );
      saveCompactCommunityCache(updatedCommunity);
    };

    applyLocalDeleteState();

    if (actorUid !== 'local-surgeon-001' && navigator.onLine) {
      const commRef = doc(db, 'communityCases', caseId);
      const commentRef = doc(db, 'communityCases', caseId, 'comments', commentId);
      const casePatch = cleanPayload({
        comments: nextComments,
        commentsCount: nextCount,
        updatedAt: nowIso,
        updatedAtServer: serverTimestamp(),
      });

      try {
        const batch = writeBatch(db);
        batch.delete(commentRef);
        batch.update(commRef, casePatch);
        await batch.commit();
      } catch (e: any) {
        if (isFirestoreQuotaError(e)) {
          console.warn('Delete comment applied locally (Firestore daily quota exceeded).');
          setFirestoreQuotaExceeded(true);
          return;
        }
        // Fallback if legacy comment has no subcollection document (existing().userId rule)
        try {
          await updateDoc(commRef, casePatch);
        } catch (fallbackErr: any) {
          if (isFirestoreQuotaError(fallbackErr)) {
            console.warn('Delete comment applied locally (Firestore daily quota exceeded).');
            setFirestoreQuotaExceeded(true);
            return;
          }
          console.warn('Delete comment error:', fallbackErr?.message || fallbackErr);
          throw new Error(fallbackErr?.message || 'Could not delete comment.');
        }
      }
    }
  };

  const toggleFollowDoctor = async (
    targetDoctorId: string
  ): Promise<{ status: 'followed' | 'unfollowed' | 'requested' | 'cancelled' }> => {
    const targetDoc = allDoctors.find(
      d => d.userId === targetDoctorId || (d.aliasIds && d.aliasIds.includes(targetDoctorId))
    );
    const resolvedTargetId = targetDoc?.userId || targetDoctorId;
    const targetAliases = Array.from(new Set([resolvedTargetId, targetDoctorId, ...(targetDoc?.aliasIds || [])]));
    const activeMyUids = Array.from(new Set([currentUid, ...myUids].filter(Boolean))) as string[];

    const currentFollowing = profile?.following || [];
    const isFollowing = currentFollowing.some(id => targetAliases.includes(id));
    const isRequested = Boolean(targetDoc?.pendingFollowRequests?.some(id => activeMyUids.includes(id)));
    const requiresApproval = Boolean(targetDoc?.requireApprovalToFollow);

    if (isFollowing) {
      const updatedFollowing = currentFollowing.filter(id => !targetAliases.includes(id));
      patchProfileLocal({
        following: updatedFollowing,
        followingCount: updatedFollowing.length,
      });

      setAllDoctors(prev =>
        prev.map(d => {
          if (d.userId !== resolvedTargetId && !d.aliasIds?.includes(resolvedTargetId)) return d;
          const nextFollowers = (d.followers || []).filter(id => !activeMyUids.includes(id));
          return {
            ...d,
            followers: nextFollowers,
            followersCount: nextFollowers.length,
          };
        })
      );

      if (currentUid !== 'local-surgeon-001' && navigator.onLine) {
        try {
          await runTransaction(db, async (tx) => {
            const selfRef = doc(db, 'users', currentUid);
            const targetRef = doc(db, 'users', resolvedTargetId);
            const [selfSnap, targetSnap] = await Promise.all([tx.get(selfRef), tx.get(targetRef)]);

            if (selfSnap.exists()) {
              const sData = selfSnap.data();
              const nextSelfFollowing = (Array.isArray(sData.following) ? sData.following : []).filter(
                (id: string) => !targetAliases.includes(id)
              );
              tx.update(selfRef, {
                following: nextSelfFollowing,
                followingCount: nextSelfFollowing.length,
                updatedAt: new Date().toISOString(),
              });
            }

            if (targetSnap.exists()) {
              const tData = targetSnap.data();
              const nextTargetFollowers = (Array.isArray(tData.followers) ? tData.followers : []).filter(
                (id: string) => !activeMyUids.includes(id)
              );
              tx.update(targetRef, {
                followers: nextTargetFollowers,
                followersCount: nextTargetFollowers.length,
                updatedAt: new Date().toISOString(),
              });
            }
          });
        } catch (err) {
          console.warn('Unfollow transaction note:', err);
        }
      }
      return { status: 'unfollowed' };
    }

    if (isRequested) {
      // Cancel pending follow request cleanly
      setAllDoctors(prev =>
        prev.map(d => {
          if (d.userId !== resolvedTargetId && !d.aliasIds?.includes(resolvedTargetId)) return d;
          const nextPending = (d.pendingFollowRequests || []).filter(id => !activeMyUids.includes(id));
          return { ...d, pendingFollowRequests: nextPending };
        })
      );

      if (currentUid !== 'local-surgeon-001' && navigator.onLine) {
        try {
          await runTransaction(db, async (tx) => {
            const targetRef = doc(db, 'users', resolvedTargetId);
            const targetSnap = await tx.get(targetRef);
            if (targetSnap.exists()) {
              const tData = targetSnap.data();
              const nextPending = (Array.isArray(tData.pendingFollowRequests) ? tData.pendingFollowRequests : []).filter(
                (id: string) => !activeMyUids.includes(id)
              );
              tx.update(targetRef, {
                pendingFollowRequests: nextPending,
                updatedAt: new Date().toISOString(),
              });
            }
          });
        } catch (err) {
          console.warn('Cancel follow request note:', err);
        }
      }
      return { status: 'cancelled' };
    }

    if (requiresApproval) {
      setAllDoctors(prev =>
        prev.map(d => {
          if (d.userId !== resolvedTargetId && !d.aliasIds?.includes(resolvedTargetId)) return d;
          const nextPending = Array.from(new Set([...(d.pendingFollowRequests || []), currentUid]));
          return { ...d, pendingFollowRequests: nextPending };
        })
      );

      if (currentUid !== 'local-surgeon-001' && navigator.onLine) {
        try {
          await runTransaction(db, async (tx) => {
            const targetRef = doc(db, 'users', resolvedTargetId);
            const targetSnap = await tx.get(targetRef);
            if (targetSnap.exists()) {
              const tData = targetSnap.data();
              const nextPending = Array.from(
                new Set([...(Array.isArray(tData.pendingFollowRequests) ? tData.pendingFollowRequests : []), currentUid])
              );
              tx.update(targetRef, {
                pendingFollowRequests: nextPending,
                updatedAt: new Date().toISOString(),
              });
            }
          });
        } catch (err) {
          console.warn('Follow request transaction note:', err);
        }
      }

      await dispatchNotification({
        title: 'New Follow Request',
        message: `${profile?.fullName || 'A colleague'} requested to follow your surgical portfolio.`,
        category: 'social',
        type: 'follow_request',
        senderUserId: currentUid,
        senderName: profile?.fullName || 'Colleague Surgeon',
        senderPhotoUrl: profile?.profilePhotoUrl || '',
        targetUserId: resolvedTargetId,
        status: 'pending',
      });

      return { status: 'requested' };
    } else {
      const updatedFollowing = Array.from(new Set([...currentFollowing, resolvedTargetId]));
      patchProfileLocal({
        following: updatedFollowing,
        followingCount: updatedFollowing.length,
      });

      setAllDoctors(prev =>
        prev.map(d => {
          if (d.userId !== resolvedTargetId && !d.aliasIds?.includes(resolvedTargetId)) return d;
          const nextFollowers = Array.from(new Set([...(d.followers || []), currentUid]));
          return {
            ...d,
            followers: nextFollowers,
            followersCount: nextFollowers.length,
          };
        })
      );

      if (currentUid !== 'local-surgeon-001' && navigator.onLine) {
        try {
          await runTransaction(db, async (tx) => {
            const selfRef = doc(db, 'users', currentUid);
            const targetRef = doc(db, 'users', resolvedTargetId);
            const [selfSnap, targetSnap] = await Promise.all([tx.get(selfRef), tx.get(targetRef)]);

            if (selfSnap.exists()) {
              const sData = selfSnap.data();
              const nextSelfFollowing = Array.from(
                new Set([...(Array.isArray(sData.following) ? sData.following : []), resolvedTargetId])
              );
              tx.update(selfRef, {
                following: nextSelfFollowing,
                followingCount: nextSelfFollowing.length,
                updatedAt: new Date().toISOString(),
              });
            }

            if (targetSnap.exists()) {
              const tData = targetSnap.data();
              const nextTargetFollowers = Array.from(
                new Set([...(Array.isArray(tData.followers) ? tData.followers : []), currentUid])
              );
              tx.update(targetRef, {
                followers: nextTargetFollowers,
                followersCount: nextTargetFollowers.length,
                updatedAt: new Date().toISOString(),
              });
            }
          });
        } catch (err) {
          console.warn('Follow transaction note:', err);
        }
      }

      await dispatchNotification({
        title: 'New Colleague Follower',
        message: `${profile?.fullName || 'A colleague'} is now following your surgical portfolio and clinical cases.`,
        category: 'social',
        type: 'new_follower',
        senderUserId: currentUid,
        senderName: profile?.fullName || 'Colleague Surgeon',
        senderPhotoUrl: profile?.profilePhotoUrl || '',
        targetUserId: resolvedTargetId,
      });

      return { status: 'followed' };
    }
  };

  const acceptFollowRequest = async (requesterId: string, notificationId?: string) => {
    if (!profile) return;
    const pending = profile.pendingFollowRequests || [];
    const currentFollowers = profile.followers || [];
    const updatedPending = pending.filter(id => id !== requesterId);
    const updatedFollowers = Array.from(new Set([...currentFollowers, requesterId]));

    patchProfileLocal({
      pendingFollowRequests: updatedPending,
      followers: updatedFollowers,
      followersCount: updatedFollowers.length,
    });

    setAllDoctors(prev =>
      prev.map(d => {
        if (d.userId === currentUid) {
          return { ...d, pendingFollowRequests: updatedPending, followers: updatedFollowers, followersCount: updatedFollowers.length };
        }
        if (d.userId === requesterId) {
          const nextFollowing = Array.from(new Set([...(d.following || []), currentUid]));
          return { ...d, following: nextFollowing, followingCount: nextFollowing.length };
        }
        return d;
      })
    );

    if (currentUid !== 'local-surgeon-001' && navigator.onLine) {
      try {
        await runTransaction(db, async (tx) => {
          const selfRef = doc(db, 'users', currentUid);
          const reqRef = doc(db, 'users', requesterId);
          const [selfSnap, reqSnap] = await Promise.all([tx.get(selfRef), tx.get(reqRef)]);

          if (selfSnap.exists()) {
            const sData = selfSnap.data();
            const nextPending = (Array.isArray(sData.pendingFollowRequests) ? sData.pendingFollowRequests : []).filter(
              (id: string) => id !== requesterId
            );
            const nextFollowers = Array.from(
              new Set([...(Array.isArray(sData.followers) ? sData.followers : []), requesterId])
            );
            tx.update(selfRef, {
              pendingFollowRequests: nextPending,
              followers: nextFollowers,
              followersCount: nextFollowers.length,
              updatedAt: new Date().toISOString(),
            });
          }

          if (reqSnap.exists()) {
            const rData = reqSnap.data();
            const nextReqFollowing = Array.from(
              new Set([...(Array.isArray(rData.following) ? rData.following : []), currentUid])
            );
            tx.update(reqRef, {
              following: nextReqFollowing,
              followingCount: nextReqFollowing.length,
              updatedAt: new Date().toISOString(),
            });
          }
        });

        if (notificationId) {
          await updateDoc(doc(db, 'notifications', notificationId), {
            status: 'accepted',
            readByUserIds: arrayUnion(currentUid),
          });
        }
      } catch (err) {
        console.warn('Accept follow request transaction note:', err);
      }
    }

    await dispatchNotification({
      title: 'Follow Request Accepted',
      message: `${profile?.fullName || 'The surgeon'} accepted your follow request.`,
      category: 'social',
      type: 'follow_accepted',
      senderUserId: currentUid,
      senderName: profile?.fullName || 'Colleague Surgeon',
      senderPhotoUrl: profile?.profilePhotoUrl || '',
      targetUserId: requesterId,
    });
  };

  const declineFollowRequest = async (requesterId: string, notificationId?: string) => {
    if (!profile) return;
    const pending = profile.pendingFollowRequests || [];
    const updatedPending = pending.filter(id => id !== requesterId);

    patchProfileLocal({
      pendingFollowRequests: updatedPending,
    });

    setAllDoctors(prev =>
      prev.map(d =>
        d.userId === currentUid ? { ...d, pendingFollowRequests: updatedPending } : d
      )
    );

    if (currentUid !== 'local-surgeon-001' && navigator.onLine) {
      try {
        await runTransaction(db, async (tx) => {
          const selfRef = doc(db, 'users', currentUid);
          const selfSnap = await tx.get(selfRef);
          if (selfSnap.exists()) {
            const sData = selfSnap.data();
            const nextPending = (Array.isArray(sData.pendingFollowRequests) ? sData.pendingFollowRequests : []).filter(
              (id: string) => id !== requesterId
            );
            tx.update(selfRef, {
              pendingFollowRequests: nextPending,
              updatedAt: new Date().toISOString(),
            });
          }
        });

        if (notificationId) {
          await updateDoc(doc(db, 'notifications', notificationId), {
            status: 'rejected',
            readByUserIds: arrayUnion(currentUid),
          });
        }
      } catch (err) {
        console.warn('Decline follow request transaction note:', err);
      }
    }

    await dispatchNotification({
      title: 'Follow Request Declined',
      message: `${profile?.fullName || 'The surgeon'} declined your follow request.`,
      category: 'social',
      type: 'follow_rejected',
      senderUserId: currentUid,
      senderName: profile?.fullName || 'Colleague Surgeon',
      senderPhotoUrl: profile?.profilePhotoUrl || '',
      targetUserId: requesterId,
    });
  };

  // CRUD Supervisors
  const addSupervisor = async (s: Omit<Supervisor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `sup_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSup: Supervisor = cleanPayload({
      ...s,
      id,
      userId: currentUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = [...supervisors, newSup];
    setSupervisors(updated);
    saveLocal('supervisors', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'supervisor', action: 'create', data: newSup, timestamp: new Date().toISOString() });
      } else {
        try {
          await setDoc(doc(db, 'users', currentUid, 'supervisors', id), newSup);
        } catch (err) {
          console.warn('Saved supervisor locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'supervisor', action: 'create', data: newSup, timestamp: new Date().toISOString() });
        }
      }
    }
    return id;
  };

  const updateSupervisor = async (id: string, s: Partial<Supervisor>) => {
    const patch = cleanPayload({ ...s, updatedAt: new Date().toISOString() });
    const updated = supervisors.map(item => item.id === id ? { ...item, ...patch } : item);
    setSupervisors(updated);
    saveLocal('supervisors', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'supervisor', action: 'update', data: patch, timestamp: new Date().toISOString() });
      } else {
        try {
          await setDoc(doc(db, 'users', currentUid, 'supervisors', id), patch, { merge: true });
        } catch (err) {
          console.warn('Updated supervisor locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'supervisor', action: 'update', data: patch, timestamp: new Date().toISOString() });
        }
      }
    }
  };

  const deleteSupervisor = async (id: string) => {
    const updated = supervisors.filter(item => item.id !== id);
    setSupervisors(updated);
    saveLocal('supervisors', updated);

    // Also remove associated records
    const removedRecords = trainingRecords.filter(r => r.supervisorId === id);
    const remainingRecords = trainingRecords.filter(r => r.supervisorId !== id);
    setTrainingRecords(remainingRecords);
    saveLocal('records', remainingRecords);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'supervisor', action: 'delete', timestamp: new Date().toISOString() });
      } else {
        try {
          for (const rec of removedRecords) {
            try {
              await deleteDoc(doc(db, 'users', currentUid, 'supervisors', id, 'trainingRecords', rec.id));
            } catch { /* ignore */ }
          }
          await deleteDoc(doc(db, 'users', currentUid, 'supervisors', id));
        } catch (err) {
          console.warn('Deleted supervisor locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'supervisor', action: 'delete', timestamp: new Date().toISOString() });
        }
      }
    }
  };

  // CRUD Training Records (Supervisor-Specific)
  const addTrainingRecord = async (r: Omit<TrainingRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRec: TrainingRecord = cleanPayload({
      ...r,
      id,
      userId: currentUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = [newRec, ...trainingRecords];
    setTrainingRecords(updated);
    saveLocal('records', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'record', action: 'create', parentId: r.supervisorId, data: newRec, timestamp: new Date().toISOString() });
      } else {
        try {
          await setDoc(doc(db, 'users', currentUid, 'supervisors', r.supervisorId, 'trainingRecords', id), newRec);
        } catch (err) {
          console.warn('Saved training record locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'record', action: 'create', parentId: r.supervisorId, data: newRec, timestamp: new Date().toISOString() });
        }
      }
    }
    return id;
  };

  const updateTrainingRecord = async (id: string, supervisorId: string, r: Partial<TrainingRecord>) => {
    const patch = cleanPayload({ ...r, updatedAt: new Date().toISOString() });
    const updated = trainingRecords.map(item => item.id === id ? { ...item, ...patch } : item);
    setTrainingRecords(updated);
    saveLocal('records', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'record', action: 'update', parentId: supervisorId, data: patch, timestamp: new Date().toISOString() });
      } else {
        try {
          await setDoc(doc(db, 'users', currentUid, 'supervisors', supervisorId, 'trainingRecords', id), patch, { merge: true });
        } catch (err) {
          console.warn('Updated record locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'record', action: 'update', parentId: supervisorId, data: patch, timestamp: new Date().toISOString() });
        }
      }
    }
  };

  const deleteTrainingRecord = async (id: string, supervisorId: string) => {
    const updated = trainingRecords.filter(item => item.id !== id);
    setTrainingRecords(updated);
    saveLocal('records', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'record', action: 'delete', parentId: supervisorId, timestamp: new Date().toISOString() });
      } else {
        try {
          await deleteDoc(doc(db, 'users', currentUid, 'supervisors', supervisorId, 'trainingRecords', id));
        } catch (err) {
          console.warn('Deleted record locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'record', action: 'delete', parentId: supervisorId, timestamp: new Date().toISOString() });
        }
      }
    }
  };

  // CRUD Training Sessions
  const addTrainingSession = async (s: Omit<TrainingSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSess: TrainingSession = cleanPayload({
      ...s,
      id,
      userId: currentUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = [newSess, ...trainingSessions];
    setTrainingSessions(updated);
    saveLocal('sessions', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'session', action: 'create', data: newSess, timestamp: new Date().toISOString() });
      } else {
        try {
          await setDoc(doc(db, 'users', currentUid, 'trainingSessions', id), newSess);
        } catch (err) {
          console.warn('Saved session locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'session', action: 'create', data: newSess, timestamp: new Date().toISOString() });
        }
      }
    }
    return id;
  };

  const updateTrainingSession = async (id: string, s: Partial<TrainingSession>) => {
    const patch = cleanPayload({ ...s, updatedAt: new Date().toISOString() });
    const updated = trainingSessions.map(item => item.id === id ? { ...item, ...patch } : item);
    setTrainingSessions(updated);
    saveLocal('sessions', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'session', action: 'update', data: patch, timestamp: new Date().toISOString() });
      } else {
        try {
          await setDoc(doc(db, 'users', currentUid, 'trainingSessions', id), patch, { merge: true });
        } catch (err) {
          console.warn('Updated session locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'session', action: 'update', data: patch, timestamp: new Date().toISOString() });
        }
      }
    }
  };

  const deleteTrainingSession = async (id: string) => {
    const updated = trainingSessions.filter(item => item.id !== id);
    setTrainingSessions(updated);
    saveLocal('sessions', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'session', action: 'delete', timestamp: new Date().toISOString() });
      } else {
        try {
          await deleteDoc(doc(db, 'users', currentUid, 'trainingSessions', id));
        } catch (err) {
          console.warn('Deleted session locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'session', action: 'delete', timestamp: new Date().toISOString() });
        }
      }
    }
  };

  // CRUD Skills
  const addSkill = async (s: Omit<UserSkill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `skill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSkill: UserSkill = cleanPayload({
      ...s,
      id,
      userId: currentUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = [...skills, newSkill];
    setSkills(updated);
    saveLocal('skills', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'skill', action: 'create', data: newSkill, timestamp: new Date().toISOString() });
      } else {
        try {
          await setDoc(doc(db, 'users', currentUid, 'skills', id), newSkill);
        } catch (err) {
          console.warn('Saved skill locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'skill', action: 'create', data: newSkill, timestamp: new Date().toISOString() });
        }
      }
    }
    return id;
  };

  const updateSkill = async (id: string, s: Partial<UserSkill>) => {
    const patch = cleanPayload({ ...s, updatedAt: new Date().toISOString() });
    const updated = skills.map(item => item.id === id ? { ...item, ...patch } : item);
    setSkills(updated);
    saveLocal('skills', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'skill', action: 'update', data: patch, timestamp: new Date().toISOString() });
      } else {
        try {
          await setDoc(doc(db, 'users', currentUid, 'skills', id), patch, { merge: true });
        } catch (err) {
          console.warn('Updated skill locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'skill', action: 'update', data: patch, timestamp: new Date().toISOString() });
        }
      }
    }
  };

  const deleteSkill = async (id: string) => {
    const updated = skills.filter(item => item.id !== id);
    setSkills(updated);
    saveLocal('skills', updated);

    if (currentUid !== 'local-surgeon-001') {
      if (!navigator.onLine) {
        enqueueOfflineAction({ id, type: 'skill', action: 'delete', timestamp: new Date().toISOString() });
      } else {
        try {
          await deleteDoc(doc(db, 'users', currentUid, 'skills', id));
        } catch (err) {
          console.warn('Deleted skill locally, queued for sync:', err);
          enqueueOfflineAction({ id, type: 'skill', action: 'delete', timestamp: new Date().toISOString() });
        }
      }
    }
  };

  // Recommendation Letters
  const saveRecommendation = async (r: Omit<RecommendationLetter, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    const id = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRec: RecommendationLetter = cleanPayload({
      ...r,
      id,
      userId: currentUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const updated = [newRec, ...recommendations];
    setRecommendations(updated);
    saveLocal('recommendations', updated);

    if (currentUid !== 'local-surgeon-001') {
      try {
        await setDoc(doc(db, 'users', currentUid, 'recommendations', id), newRec);
      } catch (err) {
        console.warn('Saved recommendation locally:', err);
      }
    }
    return id;
  };

  const deleteRecommendation = async (id: string) => {
    const updated = recommendations.filter(item => item.id !== id);
    setRecommendations(updated);
    saveLocal('recommendations', updated);

    if (currentUid !== 'local-surgeon-001') {
      try {
        await deleteDoc(doc(db, 'users', currentUid, 'recommendations', id));
      } catch (err) {
        console.warn('Deleted recommendation locally:', err);
      }
    }
  };

  // Articles bookmarking (persisted locally and synced to Firestore)
  const toggleSaveArticle = async (article: any) => {
    const existing = savedArticles.find(a => a.id === article.id);
    let updated: SavedArticle[];
    if (existing) {
      updated = savedArticles.filter(a => a.id !== article.id);
      if (currentUid !== 'local-surgeon-001' && navigator.onLine) {
        for (const uid of myUids) {
          if (uid === 'local-surgeon-001') continue;
          await deleteDoc(doc(db, 'users', uid, 'savedArticles', article.id)).catch(() => {});
        }
      }
    } else {
      const newArticle: SavedArticle = cleanPayload({
        ...article,
        userId: currentUid,
        savedAt: new Date().toISOString(),
      });
      updated = [newArticle, ...savedArticles];
      if (currentUid !== 'local-surgeon-001' && navigator.onLine) {
        await setDoc(doc(db, 'users', currentUid, 'savedArticles', article.id), newArticle, { merge: true }).catch(() => {});
      }
    }
    setSavedArticles(updated);
    saveLocal('articles', updated);
  };

  const isArticleSaved = (articleId: string) => {
    return savedArticles.some(a => a.id === articleId);
  };

  // Full Restore (local + Firestore persistence)
  const restorePortfolioData = async (data: any) => {
    const targetUid = auth.currentUser?.uid || profile?.userId || currentUid;
    const isCloudUser = Boolean(targetUid && targetUid !== 'local-surgeon-001');

    if (Array.isArray(data.cases)) {
      setCases(data.cases);
      saveLocal('cases', data.cases);
      if (isCloudUser && navigator.onLine) {
        for (const item of data.cases) {
          if (item?.id) {
            await setDoc(doc(db, 'users', targetUid, 'clinicalCases', item.id), cleanPayload({ ...item, userId: targetUid }), { merge: true }).catch(() => {});
          }
        }
      }
    }
    if (Array.isArray(data.supervisors)) {
      setSupervisors(data.supervisors);
      saveLocal('supervisors', data.supervisors);
      if (isCloudUser && navigator.onLine) {
        for (const item of data.supervisors) {
          if (item?.id) {
            await setDoc(doc(db, 'users', targetUid, 'supervisors', item.id), cleanPayload({ ...item, userId: targetUid }), { merge: true }).catch(() => {});
          }
        }
      }
    }
    if (Array.isArray(data.records)) {
      setTrainingRecords(data.records);
      saveLocal('records', data.records);
      if (isCloudUser && navigator.onLine) {
        for (const item of data.records) {
          if (item?.id && item?.supervisorId) {
            await setDoc(doc(db, 'users', targetUid, 'supervisors', item.supervisorId, 'trainingRecords', item.id), cleanPayload({ ...item, userId: targetUid }), { merge: true }).catch(() => {});
          }
        }
      }
    }
    if (Array.isArray(data.sessions)) {
      setTrainingSessions(data.sessions);
      saveLocal('sessions', data.sessions);
      if (isCloudUser && navigator.onLine) {
        for (const item of data.sessions) {
          if (item?.id) {
            await setDoc(doc(db, 'users', targetUid, 'trainingSessions', item.id), cleanPayload({ ...item, userId: targetUid }), { merge: true }).catch(() => {});
          }
        }
      }
    }
    if (Array.isArray(data.skills)) {
      setSkills(data.skills);
      saveLocal('skills', data.skills);
      if (isCloudUser && navigator.onLine) {
        for (const item of data.skills) {
          if (item?.id) {
            await setDoc(doc(db, 'users', targetUid, 'skills', item.id), cleanPayload({ ...item, userId: targetUid }), { merge: true }).catch(() => {});
          }
        }
      }
    }
    if (Array.isArray(data.recommendations)) {
      setRecommendations(data.recommendations);
      saveLocal('recommendations', data.recommendations);
      if (isCloudUser && navigator.onLine) {
        for (const item of data.recommendations) {
          if (item?.id) {
            await setDoc(doc(db, 'users', targetUid, 'recommendations', item.id), cleanPayload({ ...item, userId: targetUid }), { merge: true }).catch(() => {});
          }
        }
      }
    }
  };

  return (
    <DataContext.Provider
      value={{
        cases,
        supervisors,
        trainingRecords,
        trainingSessions,
        skills,
        recommendations,
        savedArticles,
        communityCases,
        allDoctors,
        syncStatus,
        hasMoreCommunityCases,
        loadingMoreCommunity,
        viewedCommunityCaseIds,
        firestoreQuotaExceeded,
        dismissQuotaWarning,
        loadMoreCommunityCases,
        fetchCommunityCaseById,
        markCommunityCasesViewed,
        addCase,
        updateCase,
        deleteCase,
        deleteCaseAttachment,
        publishCaseToCommunity,
        unpublishCaseFromCommunity,
        toggleLikeCase,
        addCommentToCase,
        deleteCommentFromCase,
        toggleFollowDoctor,
        acceptFollowRequest,
        declineFollowRequest,
        addSupervisor,
        updateSupervisor,
        deleteSupervisor,
        addTrainingRecord,
        updateTrainingRecord,
        deleteTrainingRecord,
        addTrainingSession,
        updateTrainingSession,
        deleteTrainingSession,
        addSkill,
        updateSkill,
        deleteSkill,
        saveRecommendation,
        deleteRecommendation,
        toggleSaveArticle,
        isArticleSaved,
        restorePortfolioData,
        syncNow,
        stats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
