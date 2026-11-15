// ============================================================================
// CommunityThreadsView.tsx — Surgical Community Threads (مناقشات)
// ----------------------------------------------------------------------------
// A long-form discussion component that allows surgeons to open threaded
// discussions around clinical cases or independent surgical topics. Threads
// are stored permanently in Firestore (`communityThreads` collection) and
// synced to all followers.
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Pin,
  CheckCircle2,
  Eye,
  Heart,
  Reply,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  GraduationCap,
  Beaker,
  BookOpen,
  ShieldAlert,
  Briefcase,
  Trophy,
  Calendar,
  User,
  X,
} from 'lucide-react';
import type { CommunityThread, ThreadReply, ThreadCategory, ThreadStatus } from '../types/newTypes';
import { ThreadModal } from './ThreadModal';
import { ThreadView } from './ThreadView';

// ============================================================================
// i18n (mini) — extend the existing translation pattern if available
// ============================================================================

const I18N = {
  en: {
    threadsTitle: 'Surgical Community Threads',
    threadsSubtitle: 'Open in-depth discussions around clinical cases and surgical topics',
    newThread: 'New Thread',
    searchThreads: 'Search threads by title, tag, or author…',
    all: 'All',
    category: 'Category',
    sort: 'Sort',
    newest: 'Newest',
    mostReplied: 'Most Replied',
    mostLiked: 'Most Liked',
    pinned: 'Pinned',
    solved: 'Solved',
    open: 'Open',
    answered: 'Answered',
    closed: 'Closed',
    replies: 'replies',
    views: 'views',
    likes: 'likes',
    noThreads: 'No threads found. Start the conversation!',
    caseDiscussion: 'Case Discussion',
    technique: 'Technique',
    research: 'Research',
    education: 'Education',
    guidelines: 'Guidelines',
    complications: 'Complications',
    general: 'General',
    career: 'Career',
    linkedCase: 'Linked Case',
    openDiscussion: 'Open Discussion',
    followed: 'Following',
    by: 'by',
  },
  ar: {
    threadsTitle: 'مناقشات المجتمع الجراحي',
    threadsSubtitle: 'افتح مناقشات معمّقة حول الحالات السريرية والمواضيع الجراحية',
    newThread: 'مناقشة جديدة',
    searchThreads: 'ابحث في المناقشات بالعنوان، الوسم، أو الكاتب…',
    all: 'الكل',
    category: 'الفئة',
    sort: 'ترتيب',
    newest: 'الأحدث',
    mostReplied: 'الأكثر ردوداً',
    mostLiked: 'الأكثر إعجاباً',
    pinned: 'مثبّت',
    solved: 'تم الحل',
    open: 'مفتوح',
    answered: 'تمت الإجابة',
    closed: 'مغلق',
    replies: 'ردود',
    views: 'مشاهدات',
    likes: 'إعجابات',
    noThreads: 'لا توجد مناقشات. ابدأ المحادثة!',
    caseDiscussion: 'مناقشة حالة',
    technique: 'تقنية',
    research: 'بحث',
    education: 'تعليم',
    guidelines: 'إرشادات',
    complications: 'مضاعفات',
    general: 'عام',
    career: 'مسار مهني',
    linkedCase: 'حالة مرتبطة',
    openDiscussion: 'مناقشة مفتوحة',
    followed: 'متابع',
    by: 'بواسطة',
  },
  de: {
    threadsTitle: 'Chirurgische Community-Diskussionen',
    threadsSubtitle: 'Eröffnen Sie vertiefende Diskussionen zu klinischen Fällen und chirurgischen Themen',
    newThread: 'Neue Diskussion',
    searchThreads: 'Diskussionen nach Titel, Tag oder Autor suchen…',
    all: 'Alle',
    category: 'Kategorie',
    sort: 'Sortieren',
    newest: 'Neueste',
    mostReplied: 'Meiste Antworten',
    mostLiked: 'Meiste Likes',
    pinned: 'Angepinnt',
    solved: 'Gelöst',
    open: 'Offen',
    answered: 'Beantwortet',
    closed: 'Geschlossen',
    replies: 'Antworten',
    views: 'Aufrufe',
    likes: 'Likes',
    noThreads: 'Keine Diskussionen gefunden. Starten Sie die Konversation!',
    caseDiscussion: 'Falldiskussion',
    technique: 'Technik',
    research: 'Forschung',
    education: 'Bildung',
    guidelines: 'Leitlinien',
    complications: 'Komplikationen',
    general: 'Allgemein',
    career: 'Karriere',
    linkedCase: 'Verknüpfter Fall',
    openDiscussion: 'Offene Diskussion',
    followed: 'Folgt',
    by: 'von',
  },
} as const;

type Lang = keyof typeof I18N;

// ============================================================================
// Category metadata
// ============================================================================

const CATEGORY_META: Record<
  ThreadCategory,
  { icon: React.ElementType; color: string; bg: string; key: keyof typeof I18N['en'] }
> = {
  case_discussion: { icon: Stethoscope, color: 'text-blue-700', bg: 'bg-blue-100', key: 'caseDiscussion' },
  technique: { icon: Beaker, color: 'text-purple-700', bg: 'bg-purple-100', key: 'technique' },
  research: { icon: Beaker, color: 'text-indigo-700', bg: 'bg-indigo-100', key: 'research' },
  education: { icon: GraduationCap, color: 'text-emerald-700', bg: 'bg-emerald-100', key: 'education' },
  guidelines: { icon: BookOpen, color: 'text-cyan-700', bg: 'bg-cyan-100', key: 'guidelines' },
  complications: { icon: ShieldAlert, color: 'text-rose-700', bg: 'bg-rose-100', key: 'complications' },
  general: { icon: MessageSquare, color: 'text-slate-700', bg: 'bg-slate-100', key: 'general' },
  career: { icon: Briefcase, color: 'text-amber-700', bg: 'bg-amber-100', key: 'career' },
};

const STATUS_META: Record<ThreadStatus, { color: string; key: keyof typeof I18N['en'] }> = {
  open: { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', key: 'open' },
  answered: { color: 'text-blue-700 bg-blue-50 border-blue-200', key: 'answered' },
  closed: { color: 'text-slate-500 bg-slate-50 border-slate-200', key: 'closed' },
  pinned: { color: 'text-amber-700 bg-amber-50 border-amber-200', key: 'pinned' },
};

// ============================================================================
// Component
// ============================================================================

export interface CommunityThreadsViewProps {
  language: Lang;
  currentUserId: string;
  currentUserName: string;
  currentUserSpecialty?: string;
  currentUserDegree?: string;
  currentUserPhotoUrl?: string;
  currentUserPosition?: string;
  threads: CommunityThread[];
  threadReplies?: Record<string, ThreadReply[]>;
  /** Linked published community cases (id -> title) for case-discussions. */
  publishedCases?: { id: string; caseReference: string; primaryDiagnosis: string }[];
  onCreateThread: (data: Omit<CommunityThread, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'repliesCount' | 'likesCount' | 'viewedByUserIds' | 'likedByUserIds' | 'followers'>) => Promise<void>;
  onToggleLike: (threadId: string) => Promise<void>;
  onToggleFollow: (threadId: string) => Promise<void>;
  onIncrementView: (threadId: string) => Promise<void>;
  onFetchReplies?: (threadId: string) => Promise<void>;
  onAddReply: (threadId: string, body: string, parentReplyId?: string) => Promise<void>;
  onToggleReplyLike?: (threadId: string, replyId: string) => Promise<void>;
  onMarkSolution: (threadId: string, replyId: string) => Promise<void>;
  onUpdateThreadStatus: (threadId: string, status: ThreadStatus) => Promise<void>;
}

export const CommunityThreadsView: React.FC<CommunityThreadsViewProps> = ({
  language,
  currentUserId,
  currentUserName,
  currentUserSpecialty,
  currentUserDegree,
  currentUserPhotoUrl,
  currentUserPosition,
  threads,
  threadReplies = {},
  publishedCases = [],
  onCreateThread,
  onToggleLike,
  onToggleFollow,
  onIncrementView,
  onFetchReplies,
  onAddReply,
  onToggleReplyLike,
  onMarkSolution,
  onUpdateThreadStatus,
}) => {
  const t = I18N[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ThreadCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'mostReplied' | 'mostLiked'>('newest');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openedThreadId, setOpenedThreadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRtl = language === 'ar';

  // ----- Filter and sort
  const filteredThreads = useMemo(() => {
    let list = [...threads].filter(th => !th.deletedByAdmin);

    // Pinned always first
    list.sort((a, b) => {
      if (a.pinnedAt && !b.pinnedAt) return -1;
      if (!a.pinnedAt && b.pinnedAt) return 1;
      return 0;
    });

    if (selectedCategory !== 'all') {
      list = list.filter(th => th.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        th =>
          th.title.toLowerCase().includes(q) ||
          th.body.toLowerCase().includes(q) ||
          th.tags.some(tg => tg.toLowerCase().includes(q)) ||
          th.authorName.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'mostReplied') {
      list.sort((a, b) => (b.repliesCount || 0) - (a.repliesCount || 0));
    } else if (sortBy === 'mostLiked') {
      list.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
    }

    // Re-apply pinned first after sort
    list.sort((a, b) => {
      if (a.pinnedAt && !b.pinnedAt) return -1;
      if (!a.pinnedAt && b.pinnedAt) return 1;
      return 0;
    });

    return list;
  }, [threads, searchQuery, selectedCategory, sortBy]);

  const openedThread = openedThreadId
    ? threads.find(th => th.id === openedThreadId) || null
    : null;

  const handleCreate = async (data: Omit<CommunityThread, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'repliesCount' | 'likesCount' | 'viewedByUserIds' | 'likedByUserIds' | 'followers'>) => {
    setIsSubmitting(true);
    try {
      await onCreateThread(data);
      setShowCreateModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenThread = async (threadId: string) => {
    setOpenedThreadId(threadId);
    if (onFetchReplies) {
      onFetchReplies(threadId).catch(() => {});
    }
    if (!threads.find(th => th.id === threadId)?.viewedByUserIds?.includes(currentUserId)) {
      await onIncrementView(threadId);
    }
  };

  const categories: (ThreadCategory | 'all')[] = [
    'all',
    'case_discussion',
    'technique',
    'research',
    'education',
    'guidelines',
    'complications',
    'general',
    'career',
  ];

  return (
    <div
      className="community-threads-view"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        padding: '1.5rem',
        maxWidth: '1280px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '0.75rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <MessageSquare size={28} className="text-blue-600" />
              {t.threadsTitle}
            </h1>
            <p style={{ color: '#475569', marginTop: '0.25rem', fontSize: '0.95rem' }}>
              {t.threadsSubtitle}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <Plus size={18} />
            {t.newThread}
          </button>
        </div>

        {/* Search + Filters */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: isRtl ? 'auto' : '0.75rem',
                right: isRtl ? '0.75rem' : 'auto',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchThreads}
              style={{
                width: '100%',
                padding: '0.625rem 2.5rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                background: 'white',
                outline: 'none',
              }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as ThreadCategory | 'all')}
            style={{
              padding: '0.625rem 1rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? t.all : t[CATEGORY_META[c as ThreadCategory]?.key as keyof typeof t]}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            style={{
              padding: '0.625rem 1rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            <option value="newest">{t.newest}</option>
            <option value="mostReplied">{t.mostReplied}</option>
            <option value="mostLiked">{t.mostLiked}</option>
          </select>
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          {categories.map(c => {
            const isActive = selectedCategory === c;
            if (c === 'all') {
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    padding: '0.375rem 0.75rem',
                    border: `1px solid ${isActive ? '#2563eb' : '#cbd5e1'}`,
                    background: isActive ? '#2563eb' : 'white',
                    color: isActive ? 'white' : '#334155',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {t.all}
                </button>
              );
            }
            const meta = CATEGORY_META[c];
            const Icon = meta.icon;
            return (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                style={{
                  padding: '0.375rem 0.75rem',
                  border: `1px solid ${isActive ? '#2563eb' : '#cbd5e1'}`,
                  background: isActive ? '#2563eb' : 'white',
                  color: isActive ? 'white' : '#334155',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <Icon size={14} />
                {t[meta.key as keyof typeof t]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Threads list */}
      {filteredThreads.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            background: 'white',
            border: '1px dashed #cbd5e1',
            borderRadius: '0.75rem',
          }}
        >
          <MessageSquare size={48} style={{ margin: '0 auto 1rem', color: '#94a3b8' }} />
          <p style={{ color: '#64748b', fontSize: '1rem' }}>{t.noThreads}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {filteredThreads.map(thread => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              language={language}
              currentUserId={currentUserId}
              onOpen={() => handleOpenThread(thread.id)}
              onToggleLike={() => onToggleLike(thread.id)}
              onToggleFollow={() => onToggleFollow(thread.id)}
            />
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreateModal && (
        <ThreadModal
          language={language}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserSpecialty={currentUserSpecialty}
          currentUserDegree={currentUserDegree}
          currentUserPhotoUrl={currentUserPhotoUrl}
          currentUserPosition={currentUserPosition}
          publishedCases={publishedCases}
        />
      )}

      {/* Thread detail view */}
      {openedThread && (
        <ThreadView
          language={language}
          thread={openedThread}
          replies={threadReplies[openedThread.id] || []}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserSpecialty={currentUserSpecialty}
          currentUserDegree={currentUserDegree}
          currentUserPhotoUrl={currentUserPhotoUrl}
          currentUserPosition={currentUserPosition}
          onClose={() => setOpenedThreadId(null)}
          onAddReply={onAddReply}
          onToggleLike={() => onToggleLike(openedThread.id)}
          onToggleFollow={() => onToggleFollow(openedThread.id)}
          onMarkSolution={onMarkSolution}
          onUpdateStatus={status => onUpdateThreadStatus(openedThread.id, status)}
          onToggleReplyLike={onToggleReplyLike ? (replyId) => onToggleReplyLike(openedThread.id, replyId) : undefined}
        />
      )}
    </div>
  );
};

// ============================================================================
// ThreadCard
// ============================================================================

interface ThreadCardProps {
  thread: CommunityThread;
  language: Lang;
  currentUserId: string;
  onOpen: () => void;
  onToggleLike: () => void;
  onToggleFollow: () => void;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  language,
  currentUserId,
  onOpen,
  onToggleLike,
  onToggleFollow,
}) => {
  const t = I18N[language];
  const isRtl = language === 'ar';
  const meta = CATEGORY_META[thread.category];
  const Icon = meta.icon;
  const statusMeta = STATUS_META[thread.status];
  const liked = thread.likedByUserIds?.includes(currentUserId) || false;
  const followed = thread.followers?.includes(currentUserId) || false;
  const hasSolution = !!thread.acceptedReplyId;

  return (
    <div
      onClick={onOpen}
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        boxShadow: thread.pinnedAt ? '0 0 0 1px #f59e0b' : '0 1px 2px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        (e.currentTarget as HTMLElement).style.borderColor = '#94a3b8';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = thread.pinnedAt
          ? '0 0 0 1px #f59e0b'
          : '0 1px 2px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
      }}
    >
      {/* Top row: badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <span
          className={meta.color}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: meta.bg,
          }}
        >
          <Icon size={12} />
          {t[meta.key as keyof typeof t]}
        </span>
        <span
          className={statusMeta.color}
          style={{
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 500,
            border: `1px solid ${statusMeta.color.includes('emerald') ? '#bbf7d0' : statusMeta.color.includes('blue') ? '#bfdbfe' : '#e2e8f0'}`,
          }}
        >
          {t[statusMeta.key as keyof typeof t]}
        </span>
        {hasSolution && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.625rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: '#dcfce7',
              color: '#15803d',
            }}
          >
            <CheckCircle2 size={12} />
            {t.solved}
          </span>
        )}
        {thread.pinnedAt && (
          <Pin size={14} className="text-amber-600" style={{ marginInlineStart: 'auto' }} />
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#0f172a',
          margin: '0 0 0.5rem 0',
          lineHeight: 1.4,
        }}
      >
        {thread.title}
      </h3>

      {/* Linked case badge */}
      {thread.linkedCaseId && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.625rem',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '0.375rem',
            fontSize: '0.8rem',
            color: '#1d4ed8',
            marginBottom: '0.75rem',
          }}
        >
          <Stethoscope size={12} />
          {t.linkedCase}: {thread.linkedCaseReference || 'Case'}
        </div>
      )}

      {/* Body preview */}
      <p
        style={{
          color: '#475569',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          margin: '0 0 0.75rem 0',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {thread.body}
      </p>

      {/* Tags */}
      {thread.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {thread.tags.slice(0, 5).map(tag => (
            <span
              key={tag}
              style={{
                padding: '0.125rem 0.5rem',
                background: '#f1f5f9',
                color: '#475569',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: author + stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f1f5f9',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {thread.authorPhotoUrl ? (
            <img
              src={thread.authorPhotoUrl}
              alt={thread.authorName}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={16} className="text-indigo-600" />
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1e293b' }}>
              {thread.authorName}
              {thread.authorDegree && (
                <span style={{ color: '#64748b', fontWeight: 400, marginInlineStart: '0.25rem' }}>
                  {thread.authorDegree}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {thread.authorSpecialty} · {new Date(thread.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Eye size={14} /> {thread.viewsCount || 0}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Reply size={14} /> {thread.repliesCount || 0}
          </span>
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleLike();
            }}
            style={{
              background: liked ? '#fef2f2' : 'transparent',
              border: 'none',
              color: liked ? '#dc2626' : '#64748b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.85rem',
            }}
          >
            <Heart size={14} fill={liked ? '#dc2626' : 'none'} /> {thread.likesCount || 0}
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFollow();
            }}
            style={{
              background: followed ? '#ecfdf5' : 'transparent',
              border: 'none',
              color: followed ? '#059669' : '#64748b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.85rem',
            }}
          >
            <Trophy size={14} /> {followed ? t.followed : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityThreadsView;
