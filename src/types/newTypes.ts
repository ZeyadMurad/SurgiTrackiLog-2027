import type {
  SupportedLanguage,
  UserProfile,
  ClinicalCase,
  UserSkill,
  TrainingRecord,
} from './index';

export type {
  SupportedLanguage,
  UserProfile,
  ClinicalCase,
  UserSkill,
  TrainingRecord,
};

// ============================================================================
// 1) Community Threads
// ============================================================================

export type ThreadCategory =
  | 'case_discussion'
  | 'technique'
  | 'research'
  | 'education'
  | 'guidelines'
  | 'complications'
  | 'general'
  | 'career';

export type ThreadStatus = 'open' | 'answered' | 'closed' | 'pinned';

export interface CommunityThread {
  id: string;
  authorId: string;
  authorName: string;
  authorDegree?: string;
  authorSpecialty?: string;
  authorPhotoUrl?: string;
  authorPosition?: string;
  title: string;
  body: string;
  category: ThreadCategory;
  tags: string[];
  status: ThreadStatus;
  linkedCaseId?: string;
  linkedCaseReference?: string;
  linkedCaseTitle?: string;
  acceptedReplyId?: string;
  pinnedAt?: string;
  deletedByAdmin?: boolean;
  viewsCount: number;
  repliesCount: number;
  likesCount: number;
  viewedByUserIds: string[];
  likedByUserIds: string[];
  followers: string[];
  lastReplyByUserId?: string;
  lastReplyByName?: string;
  lastActivityAt?: string;
  lastActivityAtServer?: any;
  createdAt: string;
  createdAtServer?: any;
  updatedAt: string;
  updatedAtServer?: any;
}

export interface ThreadReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorDegree?: string;
  authorSpecialty?: string;
  authorPhotoUrl?: string;
  authorPosition?: string;
  body: string;
  parentReplyId?: string;
  likedByUserIds: string[];
  likesCount: number;
  deletedByAdmin?: boolean;
  createdAt: string;
  createdAtServer?: any;
  updatedAt: string;
}

// ============================================================================
// 2) Visual Library
// ============================================================================

export type MediaCategory =
  | 'Cardiac Surgery'
  | 'Thoracic Surgery'
  | 'Vascular Surgery'
  | 'General Surgery'
  | 'Orthopedic Surgery'
  | 'Neurosurgery'
  | 'Plastic Surgery'
  | 'Pediatric Surgery'
  | 'Transplant Surgery'
  | 'Trauma Surgery'
  | 'Minimally Invasive Surgery'
  | 'Robotic Surgery'
  | 'Endoscopic Surgery'
  | 'Other';

export type MediaType =
  | 'video'
  | 'image'
  | 'animation'
  | 'article'
  | 'lecture'
  | 'case_presentation';

export type MediaSource =
  | 'websurg'
  | 'ctsnet'
  | 'youtube'
  | 'medtube'
  | 'jsurg'
  | 'gms'
  | 'opmed'
  | 'sages'
  | 'eaes'
  | 'jomi'
  | 'vestrasurg'
  | 'csl'
  | 'surgicaltheatre'
  | 'gastroatlas'
  | 'user';

export interface VisualMedia {
  id: string;
  title: string;
  description?: string;
  category: MediaCategory;
  procedureName?: string;
  anatomicalSystem?: string;
  mediaType: MediaType;
  source: MediaSource;
  url: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  author?: string;
  institution?: string;
  publicationDate?: string;
  language: SupportedLanguage;
  tags: string[];
  keywords?: string[];
  viewsCount?: number;
  likesCount?: number;
  isExternal?: boolean;
  externalSourceUrl?: string;
  warningContent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalMediaSourceConfig {
  id: MediaSource;
  displayName: string;
  baseUrl: string;
  searchUrlTemplate: string;
  searchUrl?: string;
  logoUrl?: string;
  description?: string;
  categories: MediaCategory[];
  supportsEmbed: boolean;
}

export interface AnatomicalSystemConfig {
  id: string;
  en: string;
  ar: string;
  de: string;
}

// ============================================================================
// 3) Simulation Lab
// ============================================================================

export type SimulationSessionType =
  | 'vr_simulation'
  | 'box_trainer'
  | 'cadaveric'
  | 'virtual_patient'
  | 'case_based_quiz'
  | 'team_scenario'
  | 'procedural_rehearsal';

export interface SimulationPlatform {
  id: string;
  name: string;
  provider: string;
  description: string;
  websiteUrl: string;
  isFree: boolean;
  isVRBased: boolean;
  isWebBased: boolean;
  requiresHardware: boolean;
  recommendedFor: string[];
  certificationsOffered?: string[];
  region?: string;
}

export interface SimulationQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rationale: string;
  reference?: string;
}

export interface SimulationCase {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'urgent';
  urgency?: 'elective' | 'urgent' | 'emergency';
  estimatedMinutes: number;
  scenario: string;
  skillsTested: string[];
  questions: SimulationQuestion[];
}

export interface SimulationQuizResult {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface SimulationSession {
  id: string;
  userId: string;
  traineeId?: string;
  sessionDate: string;
  sessionType: SimulationSessionType;
  platformId?: string;
  platformName?: string;
  scenarioName: string;
  procedureName?: string;
  specialty?: string;
  durationMinutes: number;
  overallScore?: number;
  accuracyScore?: number;
  skillsPracticed?: string[];
  quizResults?: SimulationQuizResult[];
  verified: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// 4) Smart CV Builder
// ============================================================================

export type CvLanguage = 'en' | 'ar' | 'de';

export type CvTemplateId =
  | 'academic_research'
  | 'clinical_consultant'
  | 'resident_trainee'
  | 'international_fellowship'
  | 'minimal_one_page'
  | 'european_german'
  | 'arabic_classic'
  | 'modern_visual';

export type CvColorScheme =
  | 'navy'
  | 'burgundy'
  | 'forest'
  | 'charcoal'
  | 'black';

export interface CvEducationEntry {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
}

export interface CvExperienceEntry {
  id: string;
  position: string;
  hospital: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
  supervisor?: string;
}

export interface CvCertification {
  id: string;
  name: string;
  issuingBody: string;
  issueDate: string;
  expiryDate?: string;
}

export interface CvPublication {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi?: string;
  type: 'journal_article' | 'conference_paper' | 'book_chapter' | 'poster' | 'other';
}

export interface CvAward {
  id: string;
  title: string;
  issuer: string;
  date: string;
}

export interface CvLanguageProficiency {
  language: string;
  proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
  certification?: string;
}

export interface CvReference {
  id: string;
  name: string;
  position: string;
  institution: string;
  email: string;
  phone?: string;
  relationship: string;
}

export interface CvClinicalExperienceSummary {
  totalProcedures: number;
  verifiedProcedures: number;
  totalHours: number;
  verifiedHours: number;
  proceduresBySpecialty: { specialty: string; count: number }[];
  proceduresByRole: { role: string; count: number }[];
  topProcedures: { name: string; count: number }[];
}

export interface CvSkillMatrixItem {
  skillName: string;
  exposureLevel: string;
  competencyStatus: string;
  totalHours?: number;
}

export interface CvData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address?: string;
  country: string;
  nationality?: string;
  dateOfBirth?: string;
  profilePhotoUrl?: string;
  professionalSummary: string;
  education: CvEducationEntry[];
  experience: CvExperienceEntry[];
  clinicalExperience?: CvClinicalExperienceSummary;
  skillsMatrix?: CvSkillMatrixItem[];
  certifications: CvCertification[];
  publications: CvPublication[];
  awards: CvAward[];
  languages: CvLanguageProficiency[];
  memberships: string[];
  references: CvReference[];
  conferences: string[];
  language: CvLanguage;
  template: CvTemplateId;
  colorScheme: CvColorScheme;
  lastGeneratedAt: string;
}

export interface CvTemplateConfig {
  id: CvTemplateId;
  name: Record<CvLanguage, string>;
  description: Record<CvLanguage, string>;
  pageMargins: { top: number; bottom: number; left: number; right: number };
  fontFamily: string;
  fontSize: { base: number; heading: number };
  useColorAccent: boolean;
  sections: string[];
}

export * from './newTypesPart2';
