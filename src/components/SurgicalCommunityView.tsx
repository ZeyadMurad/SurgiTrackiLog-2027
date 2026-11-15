import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  BookOpen,
  UserCheck,
  Sparkles,
  ChevronDown,
  Loader2,
  MessagesSquare,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { ClinicalCase } from '../types';
import { SurgeonsCarousel } from './SurgeonsCarousel';
import { SurgicalCommunityPost } from './SurgicalCommunityPost';
import { DoctorProfileModal } from './DoctorProfileModal';
import { AddCaseModal } from './AddCaseModal';
import { SURGICAL_SPECIALTIES } from '../lib/medicalDefaults';
import { matchDoctorCase } from '../lib/doctorUtils';
import { getCasePublishTimestampMs } from '../lib/firebase';

export interface FocusedCommunityTarget {
  caseId: string;
  openComments?: boolean;
}

interface SurgicalCommunityViewProps {
  focusedCaseTarget?: FocusedCommunityTarget | null;
  onClearFocusedCase?: () => void;
  communityTab?: 'cases' | 'threads';
  onChangeCommunityTab?: (tab: 'cases' | 'threads') => void;
  threadsCount?: number;
  threadsSlot?: React.ReactNode;
}

export const SurgicalCommunityView: React.FC<SurgicalCommunityViewProps> = ({
  focusedCaseTarget,
  onClearFocusedCase,
  communityTab: controlledTab,
  onChangeCommunityTab,
  threadsCount = 0,
  threadsSlot,
}) => {
  const [internalTab, setInternalTab] = useState<'cases' | 'threads'>('cases');
  const activeCommunityTab = controlledTab ?? internalTab;
  const setActiveCommunityTab = (tab: 'cases' | 'threads') => {
    setInternalTab(tab);
    onChangeCommunityTab?.(tab);
  };
  const {
    communityCases,
    allDoctors,
    deleteCase,
    addCase,
    updateCase,
    publishCaseToCommunity,
    unpublishCaseFromCommunity,
    hasMoreCommunityCases,
    loadingMoreCommunity,
    loadMoreCommunityCases,
    fetchCommunityCaseById,
    markCommunityCasesViewed,
  } = useData();
  const { profile, language } = useAuth();
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';

  const [feedTab, setFeedTab] = useState<'all' | 'following'>('all');
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCase, setEditingCase] = useState<ClinicalCase | null>(null);
  const [activeFocusedId, setActiveFocusedId] = useState<string | null>(null);
  const [openCommentsCaseId, setOpenCommentsCaseId] = useState<string | null>(null);

  useEffect(() => {
    const targetId = focusedCaseTarget?.caseId;
    if (!targetId) return;
    let cancelled = false;

    setActiveCommunityTab('cases');
    setFeedTab('all');
    setSearch('');
    setSelectedSpecialty('All');
    setActiveFocusedId(targetId);
    if (focusedCaseTarget.openComments) {
      setOpenCommentsCaseId(targetId);
    }

    const locateAndScroll = async () => {
      await fetchCommunityCaseById(targetId);
      if (cancelled) return;
      if (focusedCaseTarget.openComments) {
        markCommunityCasesViewed([targetId]).catch(() => {});
      }
      setTimeout(() => {
        if (cancelled) return;
        const el = document.getElementById(`community-case-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 220);
    };
    locateAndScroll();

    const clearTimer = setTimeout(() => {
      if (cancelled) return;
      setActiveFocusedId(null);
      if (onClearFocusedCase) onClearFocusedCase();
    }, 5500);

    return () => {
      cancelled = true;
      clearTimeout(clearTimer);
    };
  }, [focusedCaseTarget, onClearFocusedCase]);

  const handlePostViewed = useCallback(
    (caseId: string) => {
      markCommunityCasesViewed([caseId]).catch(() => {});
    },
    [markCommunityCasesViewed]
  );

  const specialties = ['All', ...SURGICAL_SPECIALTIES];
  const followingList = profile?.following || [];

  const followingCases = useMemo(() => {
    return communityCases.filter(post => {
      if (post.userId && followingList.includes(post.userId)) return true;
      const authorDoc = allDoctors.find(d => matchDoctorCase(post, d));
      if (authorDoc) {
        if (followingList.includes(authorDoc.userId)) return true;
        if (authorDoc.aliasIds && authorDoc.aliasIds.some((id: string) => followingList.includes(id))) return true;
      }
      const postEmail = (post as any).authorEmail?.toLowerCase().trim();
      if (postEmail) {
        const matchedFollowed = allDoctors.some(
          d =>
            d.email?.toLowerCase().trim() === postEmail &&
            (followingList.includes(d.userId) || d.aliasIds?.some((id: string) => followingList.includes(id)))
        );
        if (matchedFollowed) return true;
      }
      return false;
    });
  }, [communityCases, followingList, allDoctors]);

  const activePool = useMemo(() => {
    const raw = feedTab === 'all' ? communityCases : followingCases;
    return [...raw].sort((a, b) => getCasePublishTimestampMs(b) - getCasePublishTimestampMs(a));
  }, [feedTab, communityCases, followingCases]);

  const filteredPosts = useMemo(() => {
    return activePool.filter(post => {
      if (!post) return false;
      const q = (search || '').toLowerCase().trim();
      const matchSearch =
        !q ||
        (post.caseReference || '').toLowerCase().includes(q) ||
        (post.primaryDiagnosis || '').toLowerCase().includes(q) ||
        (post.hospital || '').toLowerCase().includes(q) ||
        (post.authorName || '').toLowerCase().includes(q) ||
        (post.surgicalProcedure?.procedureName || '').toLowerCase().includes(q) ||
        (post.chiefComplaint || '').toLowerCase().includes(q);

      const matchSpec =
        selectedSpecialty === 'All' ||
        post.specialty === selectedSpecialty ||
        post.authorSpecialty === selectedSpecialty;

      return matchSearch && matchSpec;
    });
  }, [activePool, search, selectedSpecialty]);

  const handleSelectDoctorById = (doctorId: string) => {
    const doc = allDoctors.find(d => d.userId === doctorId || d.aliasIds?.includes(doctorId));
    if (doc) setSelectedDoctor(doc);
  };

  const focusCaseInFeed = (caseId: string) => {
    setFeedTab('all');
    setSearch('');
    setSelectedSpecialty('All');
    setActiveFocusedId(caseId);
    setTimeout(() => {
      const el = document.getElementById(`community-case-${caseId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    setTimeout(() => {
      setActiveFocusedId(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Community Unified Hub Switcher (Clinical Cases + Surgical Threads) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveCommunityTab('cases')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
              activeCommunityTab === 'cases'
                ? 'bg-[#101C32] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={15} className={activeCommunityTab === 'cases' ? 'text-teal-400' : 'text-slate-500'} />
            <span>{isRTL ? 'الحالات السريرية' : language === 'de' ? 'Klinische Fälle' : 'Clinical Cases'}</span>
            <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${activeCommunityTab === 'cases' ? 'bg-white/15 text-teal-200' : 'bg-slate-200 text-slate-700'}`}>
              {communityCases.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCommunityTab('threads')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
              activeCommunityTab === 'threads'
                ? 'bg-[#101C32] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessagesSquare size={15} className={activeCommunityTab === 'threads' ? 'text-teal-400' : 'text-slate-500'} />
            <span>{isRTL ? 'المناقشات الجراحية (Threads)' : language === 'de' ? 'Diskussionen (Threads)' : 'Surgical Threads'}</span>
            <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${activeCommunityTab === 'threads' ? 'bg-white/15 text-teal-200' : 'bg-slate-200 text-slate-700'}`}>
              {threadsCount}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCase(null);
            setShowAddModal(true);
          }}
          className="bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus size={15} />
          <span>{isRTL ? 'نشر حالة سريرية' : 'Publish Case'}</span>
        </button>
      </div>

      {activeCommunityTab === 'threads' && threadsSlot ? (
        <div className="animate-fadeIn">{threadsSlot}</div>
      ) : (
        <>
      {/* Community Header Banner */}
      <div className="bg-gradient-to-r from-[#101C32] via-[#0E4646] to-[#0D9488] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-teal-200 text-xs font-semibold">
            <Users size={14} />
            <span>{isRTL ? 'المجتمع الجراحي التفاعلي' : 'Peer Surgical Community & Network'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {isRTL ? 'شبكة الجراحين وتبادل الحالات والمناقشات' : 'Connect, Share Clinical Cases & Discuss in Threads'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {isRTL
              ? 'تفاعل مع أقرانك من الجراحين، تابع زملاءك، ناقش الاستراتيجيات الجراحية في المناقشات، وانشر الحالات السريرية.'
              : 'Follow peer surgeons, review certified case records, and join focused clinical discussions in Threads.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setEditingCase(null);
                setShowAddModal(true);
              }}
              className="bg-white hover:bg-teal-50 text-teal-900 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus size={15} />
              <span>{isRTL ? 'نشر حالة سريرية في المجتمع' : 'Publish Surgical Case'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCommunityTab('threads')}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <MessagesSquare size={15} />
              <span>{isRTL ? 'فتح المناقشات الجراحية' : 'Open Surgical Threads'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Circular Surgeons Avatars Carousel */}
      <SurgeonsCarousel
        onSelectDoctor={(doc) => setSelectedDoctor(doc)}
      />

      {/* 2. Feed Tab Switcher & Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Tab Switcher: All Cases vs Following Feed */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setFeedTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                feedTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen size={14} className={feedTab === 'all' ? 'text-teal-600' : 'text-slate-400'} />
              <span>{isRTL ? 'جميع الحالات' : 'All Cases'}</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded-full font-semibold">
                {communityCases.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFeedTab('following')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                feedTab === 'following'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck size={14} className={feedTab === 'following' ? 'text-teal-600' : 'text-slate-400'} />
              <span>{isRTL ? 'خلاصة المتابعة' : 'Following Feed'}</span>
              <span className="text-[10px] bg-teal-100 text-teal-800 font-mono px-1.5 py-0.5 rounded-full font-semibold">
                {followingCases.length}
              </span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            {feedTab === 'following'
              ? (isRTL ? `حالات الأطباء الذين تتابعهم (${followingList.length} طبيب)` : `Cases from surgeons you follow (${followingList.length} followed)`)
              : (isRTL ? 'عرض جميع الحالات المنشورة في المجتمع الطبي' : 'Displaying all public clinical records in network')}
          </span>
        </div>

        {/* Search & Specialty Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRTL ? 'ابحث عن حالة، تشخيص، عملية، أو جراح...' : 'Search clinical cases, diagnoses, procedures, or surgeons...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Feed of Published Surgical Cases */}
      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          <>
            {filteredPosts.map((post, idx) => (
              <SurgicalCommunityPost
                key={post.id || `post-${idx}`}
                post={post}
                isHighlighted={activeFocusedId === post.id}
                defaultShowComments={openCommentsCaseId === post.id || activeFocusedId === post.id}
                onViewed={handlePostViewed}
                onEdit={(c) => {
                  setEditingCase(c);
                  setShowAddModal(true);
                }}
                onDelete={deleteCase}
                onSelectDoctor={handleSelectDoctorById}
              />
            ))}

            {hasMoreCommunityCases && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={loadMoreCommunityCases}
                  disabled={loadingMoreCommunity}
                  className="inline-flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-900 border border-teal-200 font-bold text-xs px-6 py-3 rounded-2xl shadow-xs transition cursor-pointer disabled:opacity-60"
                >
                  {loadingMoreCommunity ? (
                    <Loader2 size={15} className="animate-spin text-teal-600" />
                  ) : (
                    <ChevronDown size={15} className="text-teal-600" />
                  )}
                  <span>
                    {loadingMoreCommunity
                      ? (isRTL ? 'جاري تحميل المنشورات الأقدم...' : 'Loading older publications...')
                      : (isRTL ? 'عرض منشورات أقدم' : 'Load Older Publications')}
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              {feedTab === 'following' ? <UserCheck size={24} /> : <BookOpen size={24} />}
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {feedTab === 'following'
                ? (isRTL ? 'لا توجد حالات من الأطباء الذين تتابعهم' : 'No Cases From Followed Surgeons Yet')
                : (isRTL ? 'لم يتم العثور على حالات منشورة مطابقة' : 'No Published Cases Matching Filter')}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {feedTab === 'following'
                ? (isRTL
                    ? 'لم يقم الأطباء الذين تتابعهم بنشر حالات بعد، أو أنك لم تتابع زملاء جراحين حتى الآن. تصفح شريط الأطباء بالأعلى وتابعهم!'
                    : 'The surgeons you follow have not published any cases yet, or you are not following any surgeons yet. Follow colleagues from the carousel above!')
                : (isRTL
                    ? 'جرب تغيير كلمات البحث أو التخصص، أو قم بنشر أول حالة جراحية لك الآن.'
                    : 'Try adjusting your search criteria or publish your surgical case to the community.')}
            </p>
            {feedTab === 'following' && (
              <button
                onClick={() => setFeedTab('all')}
                className="mt-2 inline-flex items-center gap-1.5 bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-xs"
              >
                <span>{isRTL ? 'تصفح جميع الحالات' : 'Browse All Community Cases'}</span>
              </button>
            )}
          </div>
        )}
      </div>

        </>
      )}

      {/* Doctor Profile Modal */}
      <DoctorProfileModal
        doctor={selectedDoctor}
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
        onOpenCaseDetail={(c) => {
          setSelectedDoctor(null);
          focusCaseInFeed(c.id);
        }}
      />

      {/* Add / Edit Case Modal */}
      {showAddModal && (
        <AddCaseModal
          existingCase={editingCase || undefined}
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingCase(null);
          }}
          onSave={async (caseData, publishToCommunity) => {
            if (editingCase) {
              if (publishToCommunity === false) {
                await updateCase(editingCase.id, { ...caseData, isPublished: false });
                await unpublishCaseFromCommunity(editingCase.id);
              } else {
                await publishCaseToCommunity(editingCase.id, caseData);
              }
              return editingCase.id;
            } else {
              return await addCase(caseData, publishToCommunity ?? true);
            }
          }}
        />
      )}
    </div>
  );
};
