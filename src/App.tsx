/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderPlus,
  UserCheck,
  Clock,
  Award,
  Sparkles,
  FileCheck2,
  Newspaper,
  HardDrive,
  User,
  ShieldAlert,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  AlertTriangle,
  BookOpen,
  Bell,
  Send,
  MessageSquare,
  CheckCircle2,
  Users,
  Download,
  LogOut,
  UserPlus,
  Heart,
  Globe2,
  LibraryBig,
  TrendingUp,
  MonitorSmartphone,
  MessagesSquare,
  Images,
  FlaskConical,
  FileText,
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { SurgiTrackLogo } from './components/SurgiTrackLogo';
import { matchDoctorCase } from './lib/doctorUtils';
import { AuthView } from './components/AuthView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { TrainingCharts } from './components/TrainingCharts';
import { ClinicalCasesView } from './components/ClinicalCasesView';
import { SupervisorView } from './components/SupervisorView';
import { TrainingSessionsView } from './components/TrainingSessionsView';
import { SkillsMatrixView } from './components/SkillsMatrixView';
import { RecommendationGenerator } from './components/RecommendationGenerator';
import { GermanPortfolioView } from './components/GermanPortfolioView';
import { SurgicalNewsView } from './components/SurgicalNewsView';
import { PubMedSearchEngineView } from './components/PubMedSearchEngineView';
import { MedicalJournalsView } from './components/MedicalJournalsView';
import { AccreditationView } from './components/AccreditationView';
import { LearningCurveView } from './components/LearningCurveView';
import { BackupRestoreView } from './components/BackupRestoreView';
import { UserProfileView } from './components/UserProfileView';
import { AdminPanelView } from './components/AdminPanelView';
import { AddCaseModal } from './components/AddCaseModal';
import { SurgicalCommunityView, FocusedCommunityTarget } from './components/SurgicalCommunityView';
import { TraineePortfolioExportModal } from './components/TraineePortfolioExportModal';
import { YourPostsModal } from './components/YourPostsModal';
import { GlobalAcademicFooter } from './components/GlobalAcademicFooter';
import { CommunityThreadsView } from './components/CommunityThreadsView';
import { VisualLibraryView } from './components/VisualLibraryView';
import { SimulationLabView } from './components/SimulationLabView';
import { CvBuilderView } from './components/CvBuilderView';
import { translations } from './lib/i18n';
import {
  getCasePublishTimestampMs,
  getTimestampMs,
  FIRESTORE_QUOTA_UPGRADE_URL,
  formatFirestoreQuotaUserMessage,
} from './lib/firebase';

type ActiveView =
  | 'news'
  | 'community'
  | 'pubmed'
  | 'dashboard'
  | 'cases'
  | 'supervisors'
  | 'sessions'
  | 'skills'
  | 'recommendations'
  | 'german'
  | 'backup'
  | 'profile'
  | 'accreditation'
  | 'journals'
  | 'learning'
  | 'community_threads'
  | 'visual_library'
  | 'simulation_lab'
  | 'cv_builder'
  | 'admin';

const SUPER_ADMIN_EMAIL = 'zeadmorud2030@gmail.com';

function SurgiTrackApp() {
  const {
    user,
    profile,
    loading,
    language,
    setLanguage,
    logout,
    deleteCurrentAccount,
    accountDeletedByAdmin,
    dismissDeletedAccountModal,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markNotificationsAsRead,
    replyToNotification,
    myUids,
  } = useAuth();
  const {
    stats,
    syncStatus,
    cases,
    trainingRecords,
    trainingSessions,
    supervisors,
    addCase,
    communityCases,
    allDoctors,
    viewedCommunityCaseIds,
    firestoreQuotaExceeded,
    dismissQuotaWarning,
    acceptFollowRequest,
    declineFollowRequest,
    skills,
    threads,
    threadReplies,
    fetchThreadReplies,
    createThread,
    toggleThreadLike,
    toggleThreadFollow,
    incrementThreadView,
    addThreadReply,
    toggleReplyLike,
    markThreadSolution,
    updateThreadStatus,
    savedVisualMediaIds,
    toggleSaveVisualMedia,
    simulationSessions,
    logSimulationSession,
  } = useData();

  // DEFAULT VIEW: Surgical Literature & News (as requested by user)
  const [activeView, setActiveView] = useState<ActiveView>('news');
  const [literatureTab, setLiteratureTab] = useState<'stream' | 'journals' | 'pubmed'>('stream');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'learning' | 'visual_library' | 'simulation_lab'>('overview');
  const [communityTab, setCommunityTab] = useState<'cases' | 'threads'>('cases');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [showQuickCaseModal, setShowQuickCaseModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showYourPostsModal, setShowYourPostsModal] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [focusedCommunityTarget, setFocusedCommunityTarget] = useState<FocusedCommunityTarget | null>(null);
  const [dismissedBannerCaseId, setDismissedBannerCaseId] = useState<string | null>(null);

  // Notifications Modal State & Reply State
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [notifCategoryFilter, setNotifCategoryFilter] = useState<'all' | 'social' | 'admin'>('all');
  const [replyingToNotifId, setReplyingToNotifId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replySuccessMessage, setReplySuccessMessage] = useState('');
  const [replyError, setReplyError] = useState('');
  const [installPromptEvt, setInstallPromptEvt] = useState<any>(null);

  // PWA install prompt — capture the browser's deferred install event so the
  // top-bar "Install App" button can trigger it on demand.
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (!installPromptEvt) return;
    installPromptEvt.prompt();
    const choice = await installPromptEvt.userChoice;
    if (choice?.outcome === 'accepted') setInstallPromptEvt(null);
  };

  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL || profile?.role === 'super_admin';

  // 1. CRITICAL: Real-Time Admin Deletion Lockout Screen
  if (accountDeletedByAdmin) {
    return (
      <div className="min-h-screen bg-[#070D1A] flex items-center justify-center p-4 text-white z-50">
        <div className="bg-[#101C32] border-2 border-red-500/70 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert size={36} />
          </div>
          <h2 className="text-xl font-bold text-white">
            {isRTL ? 'تم حذف حسابك بواسطة إدارة المنصة' : 'Account Deleted by Administration'}
          </h2>
          <p className="text-xs text-red-200 leading-relaxed bg-red-950/40 p-4 rounded-2xl border border-red-500/30">
            {isRTL
              ? 'تم حذف حسابك في SurgiTrack iLog بواسطة إدارة المنصة. لم يعد بإمكانك الوصول إلى هذا الحساب.'
              : 'Your SurgiTrack iLog account has been deleted by the platform administration. You no longer have access to this account.'}
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            {isRTL ? 'إدارة المنصة: zeadmorud2030@gmail.com' : 'Administrator: zeadmorud2030@gmail.com'}
          </p>
          <button
            onClick={() => dismissDeletedAccountModal()}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer shadow-lg shadow-red-900/30"
          >
            {isRTL ? 'العودة إلى شاشة الدخول' : 'Return to Login Screen'}
          </button>
        </div>
      </div>
    );
  }

  // If still checking auth status — display official emblem background & splash
  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#060E1F] flex flex-col items-center justify-center text-white overflow-hidden">
        <img
          src="/icon-512.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,148,136,0.22),rgba(6,14,31,0.9)_65%)]" />
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border border-teal-400/50 mb-4 bg-[#0B1730]">
            <img
              src="/icon-512.png"
              alt="SurgiTrack iLog"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-base font-extrabold tracking-tight text-white">
            SurgiTrack <span className="text-teal-400">iLog</span>
          </p>
          <p className="text-xs font-medium text-teal-300/90 mt-1">
            {isRTL ? 'جارٍ تحميل المنصة الجراحية...' : 'Loading Surgical Training Platform...'}
          </p>
        </div>
      </div>
    );
  }

  // If user is not authenticated: render dedicated AuthView
  if (!user && !profile) {
    return <AuthView />;
  }

  // Direct immediate access once authenticated (no email verification lock)

  const myPostsCount = communityCases.filter(c => matchDoctorCase(c, {
    userId: profile?.userId,
    id: user?.uid,
    email: user?.email || profile?.email,
    fullName: profile?.fullName,
    aliasIds: profile?.aliasIds,
  })).length;

  // Independent Community Unread Publication Counter:
  // Counts ONLY unviewed Community publications from followed surgeons (persisted per user in viewedCommunityCaseIds).
  // Completely independent of notifications read state.
  const followingIds = profile?.following || [];
  const viewedSet = new Set(viewedCommunityCaseIds);

  const isFollowedAuthor = (post: any) => {
    if (post.userId && followingIds.includes(post.userId)) return true;
    const docMatch = allDoctors.find(d => matchDoctorCase(post, d));
    if (docMatch) {
      if (followingIds.includes(docMatch.userId)) return true;
      if (docMatch.aliasIds?.some(id => followingIds.includes(id))) return true;
    }
    const postEmail = (post.authorEmail || '').toLowerCase().trim();
    if (postEmail) {
      return allDoctors.some(
        d =>
          d.email?.toLowerCase().trim() === postEmail &&
          (followingIds.includes(d.userId) || Boolean(d.aliasIds?.some(id => followingIds.includes(id))))
      );
    }
    return false;
  };

  const unviewedFollowedCases = [...communityCases]
    .filter(c => {
      const isOwn =
        (c.userId && myUids.includes(c.userId)) ||
        matchDoctorCase(c, {
          userId: profile?.userId,
          id: user?.uid,
          email: user?.email || profile?.email,
          fullName: profile?.fullName,
          aliasIds: profile?.aliasIds,
        });
      if (isOwn) return false;
      if (!isFollowedAuthor(c)) return false;
      return !viewedSet.has(c.id);
    })
    .sort((a, b) => getCasePublishTimestampMs(b) - getCasePublishTimestampMs(a));

  const newCommunityCount = unviewedFollowedCases.length;
  const latestUnseenFollowedCase = unviewedFollowedCases[0] || null;

  const openCommunityView = async (targetCaseId?: string, openComments: boolean = false, navigationRef?: string) => {
    if (navigationRef === 'community_threads') {
      setCommunityTab('threads');
    } else {
      setCommunityTab('cases');
      if (targetCaseId) {
        setFocusedCommunityTarget({ caseId: targetCaseId, openComments });
      }
    }
    setActiveView('community');
    setMobileMenuOpen(false);
  };

  // Unified Hub Navigation Helper: keeps Learning Curve, Visual Library, Simulation Lab inside Dashboard;
  // Medical Journals & PubMed inside Literature; and Threads inside Community.
  const navigateTo = (target: ActiveView) => {
    if (target === 'learning' || target === 'visual_library' || target === 'simulation_lab') {
      setDashboardTab(target);
      setActiveView('dashboard');
    } else if (target === 'journals') {
      setLiteratureTab('journals');
      setActiveView('news');
    } else if (target === 'pubmed') {
      setLiteratureTab('pubmed');
      setActiveView('news');
    } else if (target === 'community_threads') {
      setCommunityTab('threads');
      setActiveView('community');
    } else {
      setActiveView(target);
    }
    setMobileMenuOpen(false);
  };

  // Streamlined Sidebar Navigation reflecting the 3 Cohesive Hubs + Portfolio Modules
  const navItems: {
    id: ActiveView;
    label: string;
    icon: any;
    count?: number;
    newCount?: number;
    subLinks?: { id: string; label: string; icon: any; isActive: boolean; onClick: () => void }[];
  }[] = [
    {
      id: 'news',
      label: isRTL ? 'الأدبيات والأبحاث' : language === 'de' ? 'Fachliteratur & Forschung' : 'Literature & Journals',
      icon: BookOpen,
      subLinks: [
        {
          id: 'stream',
          label: isRTL ? 'أحدث الدراسات المتجددة' : 'Latest Studies (Live)',
          icon: Newspaper,
          isActive: activeView === 'news' && literatureTab === 'stream',
          onClick: () => { setLiteratureTab('stream'); setActiveView('news'); setMobileMenuOpen(false); },
        },
        {
          id: 'journals',
          label: isRTL ? 'محرك المجلات الطبية' : 'Medical Journals',
          icon: LibraryBig,
          isActive: activeView === 'news' && literatureTab === 'journals',
          onClick: () => { setLiteratureTab('journals'); setActiveView('news'); setMobileMenuOpen(false); },
        },
        {
          id: 'pubmed',
          label: 'PubMed Archive',
          icon: BookOpen,
          isActive: activeView === 'news' && literatureTab === 'pubmed',
          onClick: () => { setLiteratureTab('pubmed'); setActiveView('news'); setMobileMenuOpen(false); },
        },
      ],
    },
    {
      id: 'community',
      label: isRTL ? 'المجتمع والمناقشات' : language === 'de' ? 'Chirurgische Community' : 'Surgical Community',
      icon: Users,
      count: (communityCases?.length || 0) + threads.length,
      newCount: newCommunityCount,
      subLinks: [
        {
          id: 'cases',
          label: isRTL ? 'الحالات السريرية' : 'Clinical Cases',
          icon: Users,
          isActive: activeView === 'community' && communityTab === 'cases',
          onClick: () => { setCommunityTab('cases'); openCommunityView(); },
        },
        {
          id: 'threads',
          label: isRTL ? 'المناقشات (Threads)' : 'Surgical Threads',
          icon: MessagesSquare,
          isActive: activeView === 'community' && communityTab === 'threads',
          onClick: () => { setCommunityTab('threads'); setActiveView('community'); setMobileMenuOpen(false); },
        },
      ],
    },
    {
      id: 'dashboard',
      label: t.dashboard,
      icon: LayoutDashboard,
      subLinks: [
        {
          id: 'overview',
          label: isRTL ? 'نظرة عامة' : 'Overview',
          icon: LayoutDashboard,
          isActive: activeView === 'dashboard' && dashboardTab === 'overview',
          onClick: () => { setDashboardTab('overview'); setActiveView('dashboard'); setMobileMenuOpen(false); },
        },
        {
          id: 'learning',
          label: isRTL ? 'منحنى التعلم' : 'Learning Curve',
          icon: TrendingUp,
          isActive: activeView === 'dashboard' && dashboardTab === 'learning',
          onClick: () => { setDashboardTab('learning'); setActiveView('dashboard'); setMobileMenuOpen(false); },
        },
        {
          id: 'visual_library',
          label: isRTL ? 'المكتبة المرئية' : 'Visual Library',
          icon: Images,
          isActive: activeView === 'dashboard' && dashboardTab === 'visual_library',
          onClick: () => { setDashboardTab('visual_library'); setActiveView('dashboard'); setMobileMenuOpen(false); },
        },
        {
          id: 'simulation_lab',
          label: isRTL ? 'مختبر المحاكاة' : 'Simulation Lab',
          icon: FlaskConical,
          isActive: activeView === 'dashboard' && dashboardTab === 'simulation_lab',
          onClick: () => { setDashboardTab('simulation_lab'); setActiveView('dashboard'); setMobileMenuOpen(false); },
        },
      ],
    },
    { id: 'cases', label: t.cases, icon: FolderPlus, count: cases.length },
    { id: 'supervisors', label: t.logbookEntries || (isRTL ? 'سجل العمليات والمهارات' : 'Logbook Entries'), icon: UserCheck, count: supervisors.length },
    { id: 'cv_builder', label: language === 'ar' ? 'مُولّد السيرة الذاتية' : language === 'de' ? 'CV-Generator' : 'CV Builder', icon: FileText },
    { id: 'accreditation', label: isRTL ? 'الاعتماد الدولي' : 'Accreditation', icon: Globe2 },
    { id: 'recommendations', label: t.recommendations, icon: Sparkles },
    { id: 'german', label: t.germanPortfolio, icon: FileCheck2 },
    { id: 'backup', label: t.backup, icon: HardDrive },
    { id: 'profile', label: t.profile, icon: User },
    ...(isSuperAdmin ? [{ id: 'admin' as ActiveView, label: isRTL ? 'لوحة المدير العام' : 'Super Admin', icon: ShieldAlert }] : []),
  ];

  // Bottom Quick Navigation Bar: 5 clean thumb-accessible hubs
  // Community (incl. Threads), Dashboard (incl. Learning Curve, Visual Library, Simulation Lab), Cases, Logbook, Literature (incl. Medical Journals & PubMed)
  const quickNavItems = [
    { id: 'community' as ActiveView, label: isRTL ? 'المجتمع' : 'Community', icon: Users, count: (communityCases?.length || 0) + threads.length, newCount: newCommunityCount },
    { id: 'dashboard' as ActiveView, label: t.quickNavDashboard, icon: LayoutDashboard },
    { id: 'cases' as ActiveView, label: t.quickNavCases, icon: FolderPlus, count: cases.length },
    { id: 'supervisors' as ActiveView, label: t.quickNavLogbook || (isRTL ? 'سجل العمليات' : 'Logbook'), icon: UserCheck, count: supervisors.length },
    { id: 'news' as ActiveView, label: t.quickNavNews, icon: BookOpen },
  ];

  return (
    <div className={`min-h-screen bg-[#F4F7FA] text-slate-900 flex flex-col font-sans ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#101C32] text-white border-b border-teal-500/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 shrink-0"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Official Logo (Clickable returns to news) */}
            <button onClick={() => setActiveView('news')} className="cursor-pointer text-left shrink-0">
              <SurgiTrackLogo size={36} textColor="text-white" />
            </button>
          </div>

          {/* Center/Right Actions: Sync status, Language, AI Assistant, User Avatar, Logout & Delete icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sync Indicator */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                !syncStatus.isOnline
                  ? 'bg-amber-950/40 text-amber-300 border-amber-600/40'
                  : syncStatus.isSyncing
                  ? 'bg-blue-950/40 text-blue-300 border-blue-600/40'
                  : 'bg-teal-950/40 text-teal-300 border-teal-500/40'
              }`}
            >
              {!syncStatus.isOnline ? (
                <>
                  <WifiOff size={13} className="text-amber-400" />
                  <span>{t.offline}</span>
                </>
              ) : syncStatus.isSyncing ? (
                <>
                  <RefreshCw size={13} className="animate-spin text-blue-400" />
                  <span>{t.syncing}</span>
                </>
              ) : (
                <>
                  <Wifi size={13} className="text-teal-400" />
                  <span>{t.online}</span>
                </>
              )}
            </div>

            {/* PWA Install App button — visible whenever the browser offers installation */}
            {installPromptEvt && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-1.5 bg-teal-500/20 hover:bg-teal-500/35 border border-teal-400/50 text-teal-200 hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0"
                title={isRTL ? 'تثبيت SurgiTrack كتطبيق على جهازك (يعمل دون إنترنت للبيانات المحفوظة)' : 'Install SurgiTrack as an app (offline-ready for cached data)'}
              >
                <MonitorSmartphone size={14} />
                <span className="hidden sm:inline">{isRTL ? 'تثبيت التطبيق' : 'Install App'}</span>
              </button>
            )}

            {/* Trainee Portfolio Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-teal-400/40 transition cursor-pointer"
              title={isRTL ? 'تصدير بورتفوليو وسجل المتدرب الطبي' : 'Export Full Surgical Portfolio'}
            >
              <Download size={13} className="text-teal-400" />
              <span className="hidden md:inline">{isRTL ? 'تصدير البورتفوليو' : 'Export Portfolio'}</span>
            </button>

            {/* Direct Quick "Your Posts" (منشوراتك) Button */}
            <button
              onClick={() => setShowYourPostsModal(true)}
              className="flex items-center gap-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 hover:text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-teal-400/40 transition cursor-pointer"
              title={isRTL ? 'منشوراتك ومتابعة المعلقين عليها' : 'Your Posts & Follower Engagement'}
            >
              <MessageSquare size={13} className="text-teal-400" />
              <span className="hidden sm:inline">{isRTL ? 'منشوراتك' : 'Your Posts'}</span>
              {myPostsCount > 0 && (
                <span className="bg-teal-400 text-slate-900 text-[10px] font-bold px-1.5 rounded-full">
                  {myPostsCount}
                </span>
              )}
            </button>

            {/* Notifications Bell with Unread Badge */}
            <button
              onClick={() => setNotificationsModalOpen(true)}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer shrink-0"
              title={isRTL ? 'إشعارات الإدارة العامة والتنبيهات' : 'Administrative Notifications'}
            >
              <Bell size={16} />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar with Dropdown Menu (Requirement 5) */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-9 h-9 rounded-xl overflow-hidden bg-teal-500/20 border-2 border-teal-400/50 text-teal-300 flex items-center justify-center font-bold text-xs hover:border-teal-300 transition cursor-pointer shrink-0 shadow-xs"
                title={isRTL ? 'حسابك وقائمة الإجراءات' : 'Account & Actions'}
              >
                {profile?.profilePhotoUrl ? (
                  <img
                    src={profile.profilePhotoUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{profile?.fullName ? profile.fullName.substring(0, 2).toUpperCase() : 'DR'}</span>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div
                    className={`absolute top-12 ${
                      isRTL ? 'left-0' : 'right-0'
                    } z-50 w-72 bg-[#101C32] border border-teal-500/30 rounded-2xl shadow-2xl p-3 text-white space-y-2 animate-fadeIn`}
                  >
                    {/* User Card */}
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center font-bold text-sm shrink-0">
                        {profile?.profilePhotoUrl ? (
                          <img
                            src={profile.profilePhotoUrl}
                            alt={profile.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{profile?.fullName ? profile.fullName.substring(0, 2).toUpperCase() : 'DR'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-white truncate">
                          {profile?.fullName || t.doctor}
                        </h4>
                        <p className="text-[10px] text-teal-300 truncate">
                          {profile?.currentPosition || 'Surgeon Trainee'}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">
                          {profile?.email || user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Action 0: AI Surgical Assistant (Moved from top header) */}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setAiAssistantOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white transition cursor-pointer text-xs font-bold shadow-xs"
                      title={t.aiAssistant}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles size={16} />
                        <span>{t.aiAssistant}</span>
                      </div>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono">AI</span>
                    </button>

                    {/* Action 1: Your Posts (منشوراتك) - Explicit user requirement */}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setShowYourPostsModal(true);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/35 border border-teal-400/40 text-teal-200 hover:text-white transition cursor-pointer text-xs font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare size={16} className="text-teal-400" />
                        <span>{isRTL ? 'منشوراتك (متابعة منشوراتي)' : 'Your Posts & Interactions'}</span>
                      </div>
                      <span className="bg-teal-500/40 text-teal-200 px-2 py-0.5 rounded-full text-[10px] font-mono">
                        {myPostsCount}
                      </span>
                    </button>

                    {/* Action 2: Export Surgical Portfolio */}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setShowExportModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition cursor-pointer text-xs font-semibold"
                    >
                      <Download size={15} className="text-teal-400" />
                      <span>{isRTL ? 'تصدير البورتفوليو الرسمي' : 'Export Full Portfolio'}</span>
                    </button>

                    {/* Action 3: Profile & Photo Settings */}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveView('profile');
                      }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition cursor-pointer text-xs font-semibold"
                    >
                      <User size={15} className="text-teal-400" />
                      <span>{isRTL ? 'الملف الشخصي والبيانات' : 'Profile & Credentials'}</span>
                    </button>

                    {/* Action 4: Backup & Restore */}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setActiveView('backup');
                      }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-slate-200 hover:text-white transition cursor-pointer text-xs font-semibold"
                    >
                      <HardDrive size={15} className="text-teal-400" />
                      <span>{t.backup}</span>
                    </button>

                    {/* Action 5: Language Switcher (Moved from top header) */}
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-teal-300">
                        <span>{isRTL ? 'تغيير لغة التطبيق' : 'Interface Language'}</span>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">{language}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 bg-white/10 p-1 rounded-xl">
                        <button
                          onClick={() => setLanguage('en')}
                          className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            language === 'en' ? 'bg-[#0D9488] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          EN
                        </button>
                        <button
                          onClick={() => setLanguage('ar')}
                          className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            language === 'ar' ? 'bg-[#0D9488] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          عربي
                        </button>
                        <button
                          onClick={() => setLanguage('de')}
                          className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                            language === 'de' ? 'bg-[#0D9488] text-white shadow-xs' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          DE
                        </button>
                      </div>
                    </div>

                    {/* Action 6: Logout */}
                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-950/40 transition cursor-pointer text-xs font-semibold"
                      >
                        <LogOut size={14} className="text-red-400" />
                        <span>{isRTL ? 'تسجيل الخروج' : 'Log Out'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Viewport */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-2">
          <div className="bg-white rounded-3xl border border-slate-200 p-3 shadow-xs space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id || (item.id === 'news' && (activeView === 'journals' || activeView === 'pubmed')) || (item.id === 'dashboard' && (activeView === 'learning' || activeView === 'visual_library' || activeView === 'simulation_lab')) || (item.id === 'community' && activeView === 'community_threads');
              const isAdminItem = item.id === 'admin';
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => item.id === 'community' ? openCommunityView() : navigateTo(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? isAdminItem
                          ? 'bg-red-900 text-white shadow-xs'
                          : 'bg-[#101C32] text-white shadow-xs'
                        : isAdminItem
                        ? 'text-red-700 bg-red-50 hover:bg-red-100'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon size={16} className={isActive ? 'text-teal-400 shrink-0' : isAdminItem ? 'text-red-600 shrink-0' : 'text-slate-500 shrink-0'} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.newCount !== undefined && item.newCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-600 text-white tabular-nums">
                          {item.newCount}
                        </span>
                      )}
                      {item.count !== undefined && item.count > 0 && (
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full tabular-nums ${
                            isActive ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>

                  {isActive && item.subLinks && item.subLinks.length > 0 && (
                    <div className="ps-4 space-y-0.5 pt-0.5 pb-1">
                      {item.subLinks.map(sub => {
                        const SubIcon = sub.icon;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={sub.onClick}
                            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                              sub.isActive
                                ? 'bg-teal-50 text-teal-800 font-bold'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            <SubIcon size={13} className={sub.isActive ? 'text-teal-600 shrink-0' : 'text-slate-400 shrink-0'} />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Surgical Assistant Sidebar Button */}
          <button
            onClick={() => setAiAssistantOpen(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-3xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-teal-900/10 transition cursor-pointer"
            title={t.aiAssistant}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} />
              <span>{t.aiAssistant}</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono">AI</span>
          </button>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {isRTL ? 'إجراء سريع' : 'Quick Logbook Action'}
            </span>
            <button
              onClick={() => setShowQuickCaseModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-xs cursor-pointer"
            >
              <Plus size={15} /> + {t.addNewCase}
            </button>
          </div>

          {/* Desktop Sidebar Language Switcher */}
          <div className="bg-white rounded-3xl border border-slate-200 p-3 shadow-xs space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {isRTL ? 'لغة الواجهة' : 'Interface Language'}
            </span>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${
                  language === 'en' ? 'bg-[#0D9488] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${
                  language === 'ar' ? 'bg-[#0D9488] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => setLanguage('de')}
                className={`py-1.5 rounded-lg transition cursor-pointer ${
                  language === 'de' ? 'bg-[#0D9488] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                DE
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 max-w-[80%] bg-[#101C32] text-white p-5 flex flex-col justify-between shadow-2xl h-full overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <SurgiTrackLogo size={30} textColor="text-white" />
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Drawer AI Assistant Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAiAssistantOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} />
                    <span>{t.aiAssistant}</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono">AI</span>
                </button>

                <div className="space-y-1">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id || (item.id === 'news' && (activeView === 'journals' || activeView === 'pubmed')) || (item.id === 'dashboard' && (activeView === 'learning' || activeView === 'visual_library' || activeView === 'simulation_lab')) || (item.id === 'community' && activeView === 'community_threads');
                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          onClick={() => {
                            if (item.id === 'community') {
                              openCommunityView();
                            } else {
                              navigateTo(item.id);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                            isActive ? 'bg-[#0D9488] text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={16} />
                            <span>{item.label}</span>
                          </div>
                          {item.newCount !== undefined && item.newCount > 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white tabular-nums">
                              {item.newCount}
                            </span>
                          )}
                        </button>
                        {isActive && item.subLinks && (
                          <div className="ps-4 space-y-0.5 pb-1">
                            {item.subLinks.map(sub => {
                              const SubIcon = sub.icon;
                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={sub.onClick}
                                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold ${
                                    sub.isActive ? 'bg-white/15 text-teal-300' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <SubIcon size={13} />
                                  <span>{sub.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Drawer Language Switcher */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider block">
                    {isRTL ? 'لغة التطبيق' : 'Language'}
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-white/10 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`py-1.5 rounded-lg transition cursor-pointer ${
                        language === 'en' ? 'bg-[#0D9488] text-white' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('ar')}
                      className={`py-1.5 rounded-lg transition cursor-pointer ${
                        language === 'ar' ? 'bg-[#0D9488] text-white' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      عربي
                    </button>
                    <button
                      onClick={() => setLanguage('de')}
                      className={`py-1.5 rounded-lg transition cursor-pointer ${
                        language === 'de' ? 'bg-[#0D9488] text-white' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      DE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Main Viewport */}
        <main className="flex-1 min-w-0 pb-28">
          {/* Firestore Daily Read Quota Notice (Dismissible) */}
          {firestoreQuotaExceeded && (
            <div className="mb-4 bg-amber-50 border border-amber-300 text-amber-950 rounded-2xl px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={17} />
                </div>
                <p className="text-xs font-medium leading-relaxed text-amber-900">
                  {formatFirestoreQuotaUserMessage(language)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={FIRESTORE_QUOTA_UPGRADE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-2xs"
                >
                  {isRTL ? 'إدارة حصة Firebase' : language === 'de' ? 'Firebase-Kontingent verwalten' : 'Manage Firebase Quota'}
                </a>
                <button
                  type="button"
                  onClick={dismissQuotaWarning}
                  className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-200/60 transition cursor-pointer"
                  aria-label="Dismiss quota notice"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Live Clickable Community New-Case Alert Banner */}
          {activeView !== 'community' && latestUnseenFollowedCase && dismissedBannerCaseId !== latestUnseenFollowedCase.id && (
            <div className="mb-4 bg-gradient-to-r from-[#101C32] to-[#0E4646] text-white rounded-2xl border border-teal-500/40 px-4 py-3 shadow-md flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-teal-300 flex items-center gap-1.5">
                    <span>
                      {isRTL
                        ? `حالة جراحية جديدة في المجتمع (${newCommunityCount})`
                        : `New Clinical Case in Community (${newCommunityCount})`}
                    </span>
                    <span>•</span>
                    <span className="text-white truncate">{latestUnseenFollowedCase.authorName || 'Colleague Surgeon'}</span>
                  </p>
                  <p className="text-xs font-semibold text-white truncate">
                    {latestUnseenFollowedCase.primaryDiagnosis}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openCommunityView(latestUnseenFollowedCase.id)}
                  className="bg-[#0D9488] hover:bg-teal-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                >
                  {isRTL ? 'قراءة الحالة والتعليق ←' : 'Read & Comment →'}
                </button>
                <button
                  type="button"
                  onClick={() => setDismissedBannerCaseId(latestUnseenFollowedCase.id)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  aria-label="Dismiss new case alert"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Back to Main Hub Banner (Visible on all views except news) */}
          {activeView !== 'news' && (
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-xs">
              <button
                onClick={() => setActiveView('news')}
                className="flex items-center gap-2 text-xs font-bold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-2xs"
                title={t.returnToMainHub}
              >
                {isRTL ? <ArrowRight size={16} className="text-[#0D9488]" /> : <ArrowLeft size={16} className="text-[#0D9488]" />}
                <span>{t.backToMain}</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="hidden sm:inline">{t.currentSection}:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                  {navItems.find(n => n.id === activeView)?.label || activeView}
                </span>
              </div>
            </div>
          )}

          {/* HUB 1: Unified Surgical Literature & Medical Journals Hub (Auto-Updating Studies + Medical Journals + PubMed) */}
          {(activeView === 'news' || activeView === 'journals' || activeView === 'pubmed') && (
            <div className="space-y-5 animate-fadeIn">
              {/* Literature Hub Segmented Switcher */}
              <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => { setLiteratureTab('stream'); setActiveView('news'); }}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      literatureTab === 'stream'
                        ? 'bg-[#101C32] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Newspaper size={15} className={literatureTab === 'stream' ? 'text-teal-400' : 'text-slate-500'} />
                    <span>{isRTL ? 'أحدث الدراسات المتجددة' : language === 'de' ? 'Aktuelle Studien' : 'Latest Studies'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLiteratureTab('journals'); setActiveView('news'); }}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      literatureTab === 'journals'
                        ? 'bg-[#101C32] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LibraryBig size={15} className={literatureTab === 'journals' ? 'text-teal-400' : 'text-slate-500'} />
                    <span>{isRTL ? 'المجلات الطبية' : language === 'de' ? 'Medizinische Journale' : 'Medical Journals'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLiteratureTab('pubmed'); setActiveView('news'); }}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      literatureTab === 'pubmed'
                        ? 'bg-[#101C32] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen size={15} className={literatureTab === 'pubmed' ? 'text-teal-400' : 'text-slate-500'} />
                    <span>{isRTL ? 'بحث PubMed الشامل' : 'PubMed Archive'}</span>
                  </button>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 text-[11px] font-medium text-slate-500">
                  <span>PubMed</span>
                  <span aria-hidden="true">·</span>
                  <span>Europe PMC</span>
                  <span aria-hidden="true">·</span>
                  <span>Crossref</span>
                  <span aria-hidden="true">·</span>
                  <span>Cochrane</span>
                </div>
              </div>

              {literatureTab === 'stream' && <SurgicalNewsView />}
              {literatureTab === 'journals' && <MedicalJournalsView />}
              {literatureTab === 'pubmed' && <PubMedSearchEngineView />}
            </div>
          )}

          {/* HUB 2: Unified Peer Surgical Community & Discussions (Clinical Cases + Threads) */}
          {(activeView === 'community' || activeView === 'community_threads') && (
            <SurgicalCommunityView
              focusedCaseTarget={focusedCommunityTarget}
              onClearFocusedCase={() => setFocusedCommunityTarget(null)}
              communityTab={communityTab}
              onChangeCommunityTab={setCommunityTab}
              threadsCount={threads.length}
              threadsSlot={
                <CommunityThreadsView
                  language={language}
                  currentUserId={profile?.userId || user?.uid || 'local-surgeon-001'}
                  currentUserName={profile?.fullName || user?.displayName || 'Surgeon'}
                  currentUserSpecialty={profile?.specialty}
                  currentUserDegree={profile?.medicalQualification}
                  currentUserPhotoUrl={profile?.profilePhotoUrl}
                  currentUserPosition={profile?.currentPosition}
                  threads={threads}
                  threadReplies={threadReplies}
                  publishedCases={cases
                    .filter(c => c.isPublished)
                    .map(c => ({
                      id: c.id,
                      caseReference: c.caseReference,
                      primaryDiagnosis: c.primaryDiagnosis,
                    }))}
                  onCreateThread={createThread}
                  onToggleLike={toggleThreadLike}
                  onToggleFollow={toggleThreadFollow}
                  onIncrementView={incrementThreadView}
                  onFetchReplies={fetchThreadReplies}
                  onAddReply={addThreadReply}
                  onToggleReplyLike={toggleReplyLike}
                  onMarkSolution={markThreadSolution}
                  onUpdateThreadStatus={updateThreadStatus}
                  onOpenCase={(caseId: string) => {
                    setCommunityTab('cases');
                    openCommunityView(caseId, false);
                  }}
                />
              }
            />
          )}

          {/* HUB 3: Unified Surgical Dashboard (Overview + Learning Curve + Visual Library + Simulation Lab) */}
          {(activeView === 'dashboard' || activeView === 'learning' || activeView === 'visual_library' || activeView === 'simulation_lab') && (
            <div className="space-y-5 animate-fadeIn">
              {/* Dashboard Hub Workspace Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full lg:w-auto overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => { setDashboardTab('overview'); setActiveView('dashboard'); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      dashboardTab === 'overview'
                        ? 'bg-[#101C32] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutDashboard size={15} className={dashboardTab === 'overview' ? 'text-teal-400' : 'text-slate-500'} />
                    <span>{isRTL ? 'نظرة عامة' : language === 'de' ? 'Übersicht' : 'Overview'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setDashboardTab('learning'); setActiveView('dashboard'); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      dashboardTab === 'learning'
                        ? 'bg-[#101C32] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TrendingUp size={15} className={dashboardTab === 'learning' ? 'text-teal-400' : 'text-slate-500'} />
                    <span>{isRTL ? 'منحنى التعلم' : language === 'de' ? 'Lernkurve' : 'Learning Curve'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setDashboardTab('visual_library'); setActiveView('dashboard'); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      dashboardTab === 'visual_library'
                        ? 'bg-[#101C32] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Images size={15} className={dashboardTab === 'visual_library' ? 'text-teal-400' : 'text-slate-500'} />
                    <span>{isRTL ? 'المكتبة المرئية' : language === 'de' ? 'Mediathek' : 'Visual Library'}</span>
                    {savedVisualMediaIds.length > 0 && (
                      <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${dashboardTab === 'visual_library' ? 'bg-white/15 text-teal-200' : 'bg-slate-200 text-slate-700'}`}>
                        {savedVisualMediaIds.length}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setDashboardTab('simulation_lab'); setActiveView('dashboard'); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      dashboardTab === 'simulation_lab'
                        ? 'bg-[#101C32] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FlaskConical size={15} className={dashboardTab === 'simulation_lab' ? 'text-teal-400' : 'text-slate-500'} />
                    <span>{isRTL ? 'مختبر المحاكاة' : language === 'de' ? 'Simulationslabor' : 'Simulation Lab'}</span>
                    {simulationSessions.length > 0 && (
                      <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${dashboardTab === 'simulation_lab' ? 'bg-white/15 text-teal-200' : 'bg-slate-200 text-slate-700'}`}>
                        {simulationSessions.length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="hidden xl:flex items-center gap-2 px-3 text-[11px] font-medium text-slate-500">
                  <span>{isRTL ? 'مركز التعلم والتحليل الجراحي' : 'Surgical Mastery & Analytics Hub'}</span>
                </div>
              </div>

              {dashboardTab === 'learning' && <LearningCurveView />}
              {dashboardTab === 'visual_library' && (
                <VisualLibraryView
                  language={language}
                  currentUserId={profile?.userId || user?.uid || 'local-surgeon-001'}
                  savedMediaIds={savedVisualMediaIds}
                  onSaveMedia={toggleSaveVisualMedia}
                  onOpenThreadForMedia={() => {
                    setCommunityTab('threads');
                    setActiveView('community');
                  }}
                />
              )}
              {dashboardTab === 'simulation_lab' && (
                <SimulationLabView
                  language={language}
                  currentUserId={profile?.userId || user?.uid || 'local-surgeon-001'}
                  traineeId={profile?.userId || user?.uid}
                  simulationSessions={simulationSessions}
                  onLogSession={logSimulationSession}
                />
              )}

              {dashboardTab === 'overview' && (
            <div className="space-y-6">
              {/* Dashboard Greeting Banner */}
              <div className="bg-[#101C32] rounded-2xl p-6 sm:p-7 text-white border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-teal-300 block mb-1.5">
                    SurgiTrack iLog · Executive Portfolio Dashboard
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {profile?.fullName || t.doctor}, {t.welcomeToSurgicalPortfolio}
                  </h1>
                  <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                    {t.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <button
                    onClick={() => setShowQuickCaseModal(true)}
                    className="flex items-center gap-1.5 bg-[#0D9488] hover:bg-teal-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={15} /> {t.addNewCase}
                  </button>
                  <button
                    onClick={() => setActiveView('supervisors')}
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap"
                  >
                    <UserCheck size={15} /> {t.supervisors}
                  </button>
                </div>
              </div>

              {/* Integrated Learning & Simulation Modules inside Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setDashboardTab('learning')}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500 p-5 text-start transition group cursor-pointer flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:bg-[#0D9488] group-hover:text-white transition-colors">
                      <TrendingUp size={21} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">
                      {stats.totalProcedures} {isRTL ? 'إجراء' : 'ops'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {isRTL ? 'منحنى التعلم الجراحي' : language === 'de' ? 'Chirurgische Lernkurve' : 'Learning Curve Analytics'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {isRTL ? 'تحليل تطور الاستقلالية الجراحية ومؤشر الكفاءة مقارنة بالأهداف.' : 'Track procedural autonomy, rolling competency curves & target benchmarks.'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDashboardTab('visual_library')}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500 p-5 text-start transition group cursor-pointer flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Images size={21} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">
                      {savedVisualMediaIds.length} {isRTL ? 'محفوظ' : 'saved'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-800 transition-colors">
                      {isRTL ? 'المكتبة المرئية الجراحية' : language === 'de' ? 'Chirurgische Mediathek' : 'Surgical Visual Library'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {isRTL ? 'فيديوهات عمليات منتقاة وبحث متكامل في WeBSurg وCTSNet وMedTube.' : 'Curated operative videos & multi-platform search across WeBSurg and CTSNet.'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDashboardTab('simulation_lab')}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500 p-5 text-start transition group cursor-pointer flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <FlaskConical size={21} />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">
                      {simulationSessions.length} {isRTL ? 'جلسة' : 'sessions'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                      {isRTL ? 'مختبر المحاكاة والتدريب' : language === 'de' ? 'Simulationslabor' : 'Simulation Lab'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {isRTL ? 'حالات محاكاة تفاعلية مع أسئلة تقييم ودليل 10 منصات محاكاة عالمية.' : 'Interactive surgical case simulations, rationales & 10 global VR platforms.'}
                    </p>
                  </div>
                </button>
              </div>

              {/* 8 Real Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 tabular-nums">
                <div
                  onClick={() => setActiveView('cases')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition cursor-pointer"
                >
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.totalCases}</span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">{stats.totalCases}</span>
                  <span className="text-[10px] text-teal-700 font-medium mt-1 block">{t.documentedLogbook}</span>
                </div>

                <div
                  onClick={() => setActiveView('supervisors')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition cursor-pointer"
                >
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.totalProcedures}</span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">{stats.totalProcedures}</span>
                  <span className="text-[10px] text-teal-700 font-medium mt-1 block">{t.operativeTheatres}</span>
                </div>

                <div
                  onClick={() => setActiveView('supervisors')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition cursor-pointer"
                >
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.totalHours}</span>
                  <span className="text-xl sm:text-2xl font-bold text-teal-700 mt-1 block">{stats.totalHours}h</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">{stats.weeklyAverageHours} {t.hrsPerWeek}</span>
                </div>

                <div
                  onClick={() => setActiveView('supervisors')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition cursor-pointer"
                >
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.verifiedHours}</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 block">{stats.verifiedHours}h</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">{stats.unverifiedHours}h {t.pendingReview}</span>
                </div>

                <div
                  onClick={() => setActiveView('supervisors')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition cursor-pointer"
                >
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.totalSupervisors}</span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">{stats.totalSupervisors}</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">{t.authorizedSupervisors}</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.totalHospitals}</span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">{stats.totalHospitals}</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">{t.clinicalAffiliations}</span>
                </div>

                <div
                  onClick={() => setActiveView('supervisors')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition cursor-pointer"
                >
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.skillsPracticed}</span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">{stats.skillsPracticed}</span>
                  <span className="text-[10px] text-teal-700 font-medium mt-1 block">{t.activeSkills}</span>
                </div>

                <div
                  onClick={() => setActiveView('supervisors')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition cursor-pointer"
                >
                  <span className="text-[11px] text-slate-500 font-semibold block">{t.assessedCompetencies}</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 block">{stats.assessedCompetencies}</span>
                  <span className="text-[10px] text-emerald-600 font-medium mt-1 block">{t.supervisorConfirmed}</span>
                </div>
              </div>

              {/* Interactive Training Analytics & Charts */}
              <TrainingCharts records={trainingRecords} sessions={trainingSessions} />

              {/* Recent Cases & Operations Quick List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900">{t.recentClinicalCases}</h3>
                    <button
                      onClick={() => setActiveView('cases')}
                      className="text-xs text-teal-700 font-bold hover:underline cursor-pointer"
                    >
                      {t.viewAll} ({cases.length})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {cases.slice(0, 3).map((c, idx) => (
                      <div
                        key={c.id ? `${c.id}-${idx}` : `recent-case-${idx}`}
                        onClick={() => setActiveView('cases')}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-300 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="truncate max-w-[240px]">
                          <span className="text-[10px] font-mono font-bold text-teal-800">
                            {c.caseReference}
                          </span>
                          <span className="font-bold text-xs text-slate-800 block mt-0.5 truncate">
                            {c.primaryDiagnosis}
                          </span>
                          <span className="text-[10px] text-slate-500">{c.hospital}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 shrink-0" />
                      </div>
                    ))}
                    {cases.length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center">{isRTL ? 'لا توجد حالات موثقة بعد.' : 'No clinical cases logged yet.'}</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900">{t.recentSupervisedOperations}</h3>
                    <button
                      onClick={() => setActiveView('supervisors')}
                      className="text-xs text-teal-700 font-bold hover:underline cursor-pointer"
                    >
                      {t.viewAll} ({trainingRecords.length})
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {trainingRecords.slice(0, 3).map((r, idx) => (
                      <div
                        key={r.id ? `${r.id}-${idx}` : `recent-rec-${idx}`}
                        onClick={() => setActiveView('supervisors')}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-300 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="truncate max-w-[240px]">
                          <span className="font-bold text-xs text-slate-800 block truncate">
                            {r.procedureName || r.specialty}
                          </span>
                          <span className="text-[10px] text-teal-700 font-semibold tabular-nums">
                            {r.participationRole} · {r.netTrainingHours}h
                          </span>
                          <span className="text-[10px] text-slate-400 block">{r.trainingDate}</span>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 shrink-0" />
                      </div>
                    ))}
                    {trainingRecords.length === 0 && (
                      <p className="text-xs text-slate-400 py-4 text-center">{isRTL ? 'لا توجد عمليات موثقة بعد.' : 'No operations recorded yet.'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
              )}
            </div>
          )}

          {activeView === 'cases' && <ClinicalCasesView />}
          {activeView === 'supervisors' && <SupervisorView />}
          {activeView === 'sessions' && <TrainingSessionsView />}
          {activeView === 'skills' && <SkillsMatrixView />}
          {activeView === 'recommendations' && <RecommendationGenerator />}
          {activeView === 'german' && <GermanPortfolioView />}
          {activeView === 'accreditation' && <AccreditationView />}
          {activeView === 'backup' && <BackupRestoreView />}
          {activeView === 'profile' && (
            <UserProfileView
              onNavigateToBackup={() => setActiveView('backup')}
              onOpenYourPosts={() => setShowYourPostsModal(true)}
            />
          )}
          {activeView === 'cv_builder' && (
            <CvBuilderView
              language={language}
              profile={profile}
              cases={cases}
              trainingRecords={trainingRecords}
              skills={skills}
              supervisors={supervisors}
            />
          )}
          {activeView === 'admin' && <AdminPanelView />}
        </main>
      </div>

      {/* Global Academic Footer Attribution (Strictly adheres to visual reference file_00000000e684820b89ee229a59c8a750_df9d5984.png) */}
      <GlobalAcademicFooter />

      {/* Fixed Bottom Quick Access Navigation Bar (Dashboard, Clinical Cases, Training Sessions, Skills Matrix, News) */}
      <nav aria-label={t.quickAccess} className="fixed bottom-3 inset-x-0 mx-auto z-40 w-[95%] max-w-2xl pointer-events-none">
        <div className="pointer-events-auto bg-[#101C32]/95 backdrop-blur-md text-white border border-teal-500/40 rounded-2xl sm:rounded-full p-1.5 shadow-2xl flex items-center justify-between gap-1">
          {quickNavItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id || (item.id === 'news' && (activeView === 'journals' || activeView === 'pubmed')) || (item.id === 'dashboard' && (activeView === 'learning' || activeView === 'visual_library' || activeView === 'simulation_lab')) || (item.id === 'community' && activeView === 'community_threads');
            return (
              <button
                key={item.id}
                onClick={() => item.id === 'community' ? openCommunityView() : navigateTo(item.id)}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-1.5 rounded-xl sm:rounded-full transition cursor-pointer text-center ${
                  isActive
                    ? 'bg-[#0D9488] text-white font-bold shadow-md shadow-teal-900/50'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={item.label}
              >
                <div className="relative shrink-0">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-teal-400'} />
                  {'newCount' in item && (item as any).newCount > 0 ? (
                    <span className="absolute -top-2 -right-2.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 rounded-full leading-tight shadow-xs">
                      {(item as any).newCount}
                    </span>
                  ) : item.count !== undefined && item.count > 0 ? (
                    <span className="absolute -top-1.5 -right-2 bg-teal-400 text-slate-900 text-[9px] font-bold px-1 rounded-full leading-tight">
                      {item.count}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] sm:text-xs font-semibold truncate max-w-[70px] sm:max-w-none">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Notifications Drawer / Modal */}
      {notificationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {/* Header */}
            {/* Header with Filter Tabs */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Bell size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {isRTL ? 'مركز الإشعارات والتنبيهات' : 'Notifications & Activity Center'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {isRTL ? 'إشعارات المجتمع، المتابعون الجدد، والرسائل الإدارية' : 'Community updates, follow requests, and administrative announcements'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {unreadNotificationCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const unreadIds = notifications
                          .filter(n => (!n.targetUserId || myUids.includes(n.targetUserId)) && !(n.readByUserIds || []).some(id => myUids.includes(id)))
                          .map(n => n.id)
                          .filter(Boolean);
                        if (unreadIds.length > 0) {
                          markNotificationsAsRead(unreadIds);
                        }
                      }}
                      className="text-[11px] font-bold text-teal-800 bg-teal-100 hover:bg-teal-200 px-2.5 py-1 rounded-xl transition cursor-pointer"
                    >
                      {isRTL ? 'تحديد الكل كمقروء' : 'Mark all read'}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setNotificationsModalOpen(false);
                      setReplyingToNotifId(null);
                      setReplyText('');
                    }}
                    className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setNotifCategoryFilter('all')}
                  className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                    notifCategoryFilter === 'all'
                      ? 'bg-teal-700 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isRTL ? 'الكل' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setNotifCategoryFilter('social')}
                  className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                    notifCategoryFilter === 'social'
                      ? 'bg-teal-700 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isRTL ? 'المجتمع والمتابعة' : 'Community & Follows'}
                </button>
                <button
                  type="button"
                  onClick={() => setNotifCategoryFilter('admin')}
                  className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
                    notifCategoryFilter === 'admin'
                      ? 'bg-teal-700 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isRTL ? 'توجيهات الإدارة' : 'Administrative'}
                </button>
              </div>
            </div>

            {/* Content List */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              {replySuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{replySuccessMessage}</span>
                </div>
              )}

              {(() => {
                const relevantNotifs = notifications.filter(n => !n.targetUserId || myUids.includes(n.targetUserId));
                const filtered = relevantNotifs.filter(n => {
                  if (notifCategoryFilter === 'social') {
                    return n.category === 'social' || n.type?.startsWith('follow') || n.type?.startsWith('new_');
                  }
                  if (notifCategoryFilter === 'admin') {
                    return n.category !== 'social' && !n.type?.startsWith('follow') && !n.type?.startsWith('new_');
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                      <Bell size={32} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700">
                        {isRTL ? 'لا توجد إشعارات في هذا التصنيف حالياً.' : 'No notifications in this category.'}
                      </p>
                    </div>
                  );
                }

                return filtered.map((notif) => {
                  const isRead = myUids.some(uid => (notif.readByUserIds || []).includes(uid));
                  const isReplying = replyingToNotifId === notif.id;
                  const isFollowRequest = notif.type === 'follow_request';
                  const isNewFollower = notif.type === 'new_follower' || notif.type === 'follow_accepted';
                  const isLike = notif.type === 'new_like';
                  const isComment = notif.type === 'new_comment';
                  const isNewCase = notif.type === 'new_case' || notif.type === 'new_story';

                  return (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-4 rounded-2xl border transition space-y-2.5 ${
                        !isRead
                          ? 'bg-teal-50/50 border-teal-300 shadow-2xs'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isFollowRequest && (
                            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                              <UserPlus size={14} />
                            </span>
                          )}
                          {isNewFollower && (
                            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                              <UserCheck size={14} />
                            </span>
                          )}
                          {isLike && (
                            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                              <Heart size={14} />
                            </span>
                          )}
                          {isComment && (
                            <span className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                              <MessageSquare size={14} />
                            </span>
                          )}
                          {isNewCase && (
                            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                              <BookOpen size={14} />
                            </span>
                          )}

                          <span className="font-bold text-slate-900 text-sm leading-snug">
                            {notif.title}
                          </span>
                          {!isRead && (
                            <span className="text-[9px] font-bold uppercase bg-teal-600 text-white px-2 py-0.5 rounded-full">
                              {isRTL ? 'جديد' : 'New'}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {new Date(getTimestampMs(notif.createdAtServer || notif.createdAt) || Date.now()).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white/70 p-3 rounded-xl border border-slate-200/60">
                        {notif.message}
                      </p>

                      {/* Quick Follow Request Action Buttons or Status */}
                      {isFollowRequest && notif.senderUserId && (
                        <div className="pt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          {notif.status === 'accepted' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl">
                              <CheckCircle2 size={13} />
                              <span>{isRTL ? 'تم قبول الطلب' : 'Accepted'}</span>
                            </span>
                          ) : notif.status === 'rejected' || notif.status === 'declined' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-200 text-slate-700 px-3 py-1 rounded-xl">
                              <span>{isRTL ? 'تم الرفض' : 'Declined'}</span>
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={async () => {
                                  await acceptFollowRequest(notif.senderUserId!, notif.id);
                                  await markNotificationAsRead(notif.id);
                                  setReplySuccessMessage(isRTL ? 'تم قبول طلب المتابعة بنجاح!' : 'Follow request accepted!');
                                  setTimeout(() => setReplySuccessMessage(''), 4000);
                                }}
                                className="bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-2xs"
                              >
                                <CheckCircle2 size={13} />
                                <span>{isRTL ? 'قبول الطلب' : 'Accept Request'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  await declineFollowRequest(notif.senderUserId!, notif.id);
                                  await markNotificationAsRead(notif.id);
                                  setReplySuccessMessage(isRTL ? 'تم رفض طلب المتابعة.' : 'Follow request declined.');
                                  setTimeout(() => setReplySuccessMessage(''), 4000);
                                }}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer"
                              >
                                <span>{isRTL ? 'رفض' : 'Decline'}</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {/* Social Click Action: Go to Specific Case or Community */}
                      {(isLike || isComment || isNewCase || isNewFollower) && (
                        <div className="pt-1 flex justify-end">
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation();
                              await markNotificationAsRead(notif.id);
                              await openCommunityView(notif.targetCaseId, notif.type === 'new_comment', notif.navigationRef);
                              setNotificationsModalOpen(false);
                            }}
                            className="text-teal-700 font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>
                              {notif.targetCaseId
                                ? (isRTL ? 'عرض الحالة في المجتمع ←' : 'View in Community →')
                                : (isRTL ? 'فتح في المجتمع الجراحي ←' : 'View in Community →')}
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Admin Announcement Actions */}
                      {(!notif.type || notif.type === 'admin_broadcast') && (
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {isRTL ? 'المرسل: إدارة المنصة' : 'From: SurgiTrack Administration'}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReplyingToNotifId(isReplying ? null : notif.id);
                              setReplyText('');
                              setReplyError('');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-950 bg-white hover:bg-teal-100 border border-teal-300 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-2xs"
                          >
                            <MessageSquare size={13} />
                            <span>{isReplying ? (isRTL ? 'إلغاء الرد' : 'Cancel') : (isRTL ? 'الرد على الإدارة' : 'Reply to Admin')}</span>
                          </button>
                        </div>
                      )}

                      {/* Reply Input Box for Admin Announcements */}
                      {isReplying && (
                        <div className="pt-3 border-t border-slate-200 space-y-2 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                          <label className="block text-[11px] font-bold text-slate-700">
                            {isRTL ? 'كتابة ردك المباشر للإدارة العامة:' : 'Write your response to administration:'}
                          </label>
                          {replyError && (
                            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-800 font-semibold">
                              {replyError}
                            </div>
                          )}
                          <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => {
                              setReplyText(e.target.value);
                              if (replyError) setReplyError('');
                            }}
                            placeholder={isRTL ? 'اكتب ردك أو استفسارك هنا وسيصل للمدير العام فورياً...' : 'Type your reply here, it will be visible in the admin control center...'}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              disabled={replySending || !replyText.trim()}
                              onClick={async () => {
                                setReplySending(true);
                                setReplyError('');
                                try {
                                  await replyToNotification(notif.id, notif.title, replyText);
                                  setReplySuccessMessage(isRTL ? 'تم إرسال ردك للإدارة بنجاح!' : 'Reply submitted successfully!');
                                  setReplyingToNotifId(null);
                                  setReplyText('');
                                  setTimeout(() => setReplySuccessMessage(''), 4000);
                                } catch (e: any) {
                                  setReplyError(isRTL ? `تعذر إرسال الرد: ${e.message}` : `Failed to send reply: ${e.message}`);
                                } finally {
                                  setReplySending(false);
                                }
                              }}
                              className="bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <Send size={12} />
                              <span>{replySending ? 'Sending...' : isRTL ? 'إرسال الرد' : 'Send Reply'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setNotificationsModalOpen(false)}
                className="bg-[#101C32] hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition cursor-pointer"
              >
                {isRTL ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        language={language}
      />

      {/* Official Trainee Portfolio Export Modal */}
      <TraineePortfolioExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* Your Posts Management Modal (Requirement 5) */}
      <YourPostsModal
        isOpen={showYourPostsModal}
        onClose={() => setShowYourPostsModal(false)}
        onOpenNewCase={() => {
          setShowYourPostsModal(false);
          setShowQuickCaseModal(true);
        }}
      />

      {/* Quick Add Case Modal */}
      {showQuickCaseModal && (
        <AddCaseModal
          isOpen={showQuickCaseModal}
          onClose={() => setShowQuickCaseModal(false)}
          onSave={async (c, publishToCommunity) => {
            const id = await addCase(c, publishToCommunity);
            setShowQuickCaseModal(false);
            return id;
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <SurgiTrackApp />
      </DataProvider>
    </AuthProvider>
  );
}
