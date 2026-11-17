// ============================================================================
// CommunityStoriesView.tsx — Surgical Community Stories (24h ephemeral posts)
// ----------------------------------------------------------------------------
// Adds Instagram-style "Share a Story" feature with 24-hour auto-expiry.
// Stories appear at the top of the community page and disappear automatically.
// ============================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Plus,
  X,
  Clock,
  Eye,
  Trash2,
  Send,
  Image as ImageIcon,
  Video,
  FileText,
  Stethoscope,
  Link2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Pause,
} from 'lucide-react';
import type {
  EphemeralCommunityStory,
  StoryMediaType,
  SupportedLanguage,
} from '../types/newTypes';

const I18N = {
  en: {
    title: 'Surgical Stories & Clinical Pearls',
    subtitle: 'Share a 24-hour story with your surgical community',
    addStory: 'Share a Story',
    myStory: 'Your Story',
    viewAll: 'View All',
    noStories: 'No active stories. Share the first one!',
    expires: 'expires in',
    hours: 'hours',
    minutes: 'minutes',
    expired: 'Expired',
    storyType: {
      image: 'Photo',
      video: 'Video',
      text: 'Text Story',
      case_link: 'Case Story',
      media_link: 'Media Story',
    },
    storyTitle: {
      image: 'Photo Story',
      video: 'Video Story',
      text: 'Text Story',
      case_link: 'Case Story',
      media_link: 'Media Story',
    },
    createStory: 'Create Story',
    storyTypeLabel: 'Story Type',
    background: 'Background Color',
    caption: 'Caption (optional)',
    captionPlaceholder: 'Add a caption or clinical pearl…',
    textContent: 'Text content (markdown supported)',
    textPlaceholder: 'Share a clinical pearl, learning point, or interesting case observation…',
    mediaUrl: 'Media URL (image or video)',
    linkCase: 'Link to a published case',
    linkMedia: 'Link to visual library media',
    selectCase: 'Select a case…',
    selectMedia: 'Select media…',
    cancel: 'Cancel',
    publish: 'Publish Story (24h)',
    publishing: 'Publishing…',
    deleteStory: 'Delete Story',
    confirmDelete: 'Delete this story? This cannot be undone.',
    views: 'views',
    replyToStory: 'Reply to story (private DM to author)',
    replyPlaceholder: 'Send a private reply…',
    send: 'Send',
    showReplies: 'Show replies',
    hideReplies: 'Hide replies',
    highlighted: 'Highlighted',
    backgroundColors: [
      { name: 'Navy', value: '#1e3a8a' },
      { name: 'Burgundy', value: '#7c2d12' },
      { name: 'Forest', value: '#14532d' },
      { name: 'Charcoal', value: '#1f2937' },
      { name: 'Purple', value: '#581c87' },
      { name: 'Teal', value: '#134e4a' },
    ],
  },
  ar: {
    title: 'قصص جراحية ولآلئ سريرية',
    subtitle: 'شارك قصة لمدة 24 ساعة مع مجتمعك الجراحي',
    addStory: 'شارك قصة',
    myStory: 'قصتك',
    viewAll: 'عرض الكل',
    noStories: 'لا توجد قصص نشطة. شارك القصة الأولى!',
    expires: 'تنتهي خلال',
    hours: 'ساعة',
    minutes: 'دقيقة',
    expired: 'منتهية',
    storyType: {
      image: 'صورة',
      video: 'فيديو',
      text: 'قصة نصية',
      case_link: 'قصة حالة',
      media_link: 'قصة وسائط',
    },
    storyTitle: {
      image: 'قصة صورة',
      video: 'قصة فيديو',
      text: 'قصة نصية',
      case_link: 'قصة حالة',
      media_link: 'قصة وسائط',
    },
    createStory: 'إنشاء قصة',
    storyTypeLabel: 'نوع القصة',
    background: 'لون الخلفية',
    caption: 'تعليق (اختياري)',
    captionPlaceholder: 'أضف تعليقاً أو لؤلؤة سريرية…',
    textContent: 'المحتوى النصي (يدعم Markdown)',
    textPlaceholder: 'شارك لؤلؤة سريرية، نقطة تعليم، أو ملاحظة حالة مثيرة…',
    mediaUrl: 'رابط الوسائط (صورة أو فيديو)',
    linkCase: 'ربط بحالة منشورة',
    linkMedia: 'ربط بوسائط المكتبة المرئية',
    selectCase: 'اختر حالة…',
    selectMedia: 'اختر وسائط…',
    cancel: 'إلغاء',
    publish: 'نشر القصة (24h)',
    publishing: 'جارٍ النشر…',
    deleteStory: 'حذف القصة',
    confirmDelete: 'حذف هذه القصة؟ لا يمكن التراجع.',
    views: 'مشاهدات',
    replyToStory: 'الرد على القصة (رسالة خاصة للمؤلف)',
    replyPlaceholder: 'أرسل رداً خاصاً…',
    send: 'إرسال',
    showReplies: 'عرض الردود',
    hideReplies: 'إخفاء الردود',
    highlighted: 'مميّزة',
    backgroundColors: [
      { name: 'كحلي', value: '#1e3a8a' },
      { name: 'خمري', value: '#7c2d12' },
      { name: 'غابي', value: '#14532d' },
      { name: 'فحمي', value: '#1f2937' },
      { name: 'بنفسجي', value: '#581c87' },
      { name: 'فيروزي', value: '#134e4a' },
    ],
  },
  de: {
    title: 'Chirurgische Geschichten & Clinical Pearls',
    subtitle: 'Teilen Sie eine 24-Stunden-Story mit Ihrer chirurgischen Community',
    addStory: 'Story teilen',
    myStory: 'Ihre Story',
    viewAll: 'Alle anzeigen',
    noStories: 'Keine aktiven Stories. Teilen Sie die erste!',
    expires: 'läuft ab in',
    hours: 'Stunden',
    minutes: 'Minuten',
    expired: 'Abgelaufen',
    storyType: {
      image: 'Foto',
      video: 'Video',
      text: 'Text-Story',
      case_link: 'Fall-Story',
      media_link: 'Medien-Story',
    },
    storyTitle: {
      image: 'Foto-Story',
      video: 'Video-Story',
      text: 'Text-Story',
      case_link: 'Fall-Story',
      media_link: 'Medien-Story',
    },
    createStory: 'Story erstellen',
    storyTypeLabel: 'Story-Typ',
    background: 'Hintergrundfarbe',
    caption: 'Caption (optional)',
    captionPlaceholder: 'Caption oder Clinical Pearl hinzufügen…',
    textContent: 'Text-Inhalt (Markdown unterstützt)',
    textPlaceholder: 'Teilen Sie ein Clinical Pearl oder interessante Beobachtung…',
    mediaUrl: 'Medien-URL (Bild oder Video)',
    linkCase: 'Mit veröffentlichtem Fall verknüpfen',
    linkMedia: 'Mit Medienbibliothek verknüpfen',
    selectCase: 'Fall auswählen…',
    selectMedia: 'Medien auswählen…',
    cancel: 'Abbrechen',
    publish: 'Story veröffentlichen (24h)',
    publishing: 'Veröffentlichen…',
    deleteStory: 'Story löschen',
    confirmDelete: 'Story löschen? Kann nicht rückgängig gemacht werden.',
    views: 'Aufrufe',
    replyToStory: 'Auf Story antworten (private DM an Autor)',
    replyPlaceholder: 'Private Antwort senden…',
    send: 'Senden',
    showReplies: 'Antworten anzeigen',
    hideReplies: 'Antworten verbergen',
    highlighted: 'Hervorgehoben',
    backgroundColors: [
      { name: 'Marineblau', value: '#1e3a8a' },
      { name: 'Bordeaux', value: '#7c2d12' },
      { name: 'Waldgrün', value: '#14532d' },
      { name: 'Anthrazit', value: '#1f2937' },
      { name: 'Lila', value: '#581c87' },
      { name: 'Blaugrün', value: '#134e4a' },
    ],
  },
} as const;

type Lang = SupportedLanguage;

export const STORY_TYPE_ICONS: Record<StoryMediaType, React.ElementType> = {
  image: ImageIcon,
  video: Video,
  text: FileText,
  case_link: Stethoscope,
  media_link: Link2,
};

// ============================================================================
// Component
// ============================================================================

export interface CommunityStoriesViewProps {
  language: Lang;
  currentUserId: string;
  currentUserName: string;
  currentUserSpecialty?: string;
  currentUserDegree?: string;
  currentUserPhotoUrl?: string;
  currentUserPosition?: string;
  stories: EphemeralCommunityStory[];
  /** Published community cases (id -> reference + diagnosis) for case-link stories */
  publishedCases?: { id: string; caseReference: string; primaryDiagnosis: string }[];
  /** Saved visual media (id -> title) for media-link stories */
  visualMedia?: { id: string; title: string }[];
  onCreateStory: (story: Omit<EphemeralCommunityStory, 'id' | 'createdAt' | 'expiresAt' | 'viewedByUserIds' | 'viewsCount' | 'updatedAt'>) => Promise<void>;
  onDeleteStory: (storyId: string) => Promise<void>;
  onViewStory: (storyId: string) => Promise<void>;
  onReplyToStory?: (storyId: string, message: string) => Promise<void>;
  focusedStoryId?: string | null;
  onClearFocusedStory?: () => void;
  viewerNamesMap?: Record<string, string>;
}

export const CommunityStoriesView: React.FC<CommunityStoriesViewProps> = ({
  language,
  currentUserId,
  currentUserName,
  currentUserSpecialty,
  currentUserDegree,
  currentUserPhotoUrl,
  currentUserPosition,
  stories,
  publishedCases = [],
  visualMedia = [],
  onCreateStory,
  onDeleteStory,
  onViewStory,
  onReplyToStory,
  focusedStoryId,
  onClearFocusedStory,
  viewerNamesMap = {},
}) => {
  const t = I18N[language];
  const isRtl = language === 'ar';
  const [showCreate, setShowCreate] = useState(false);
  const [openedStoryIndex, setOpenedStoryIndex] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  // Update time every minute for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Filter out expired stories (24h expiry)
  const activeStories = useMemo(() => {
    return stories.filter(s => {
      const expiresAt = new Date(s.expiresAt).getTime();
      return expiresAt > now && !s.deletedByAdmin;
    });
  }, [stories, now]);

  // Group by author — show as "story rings"
  const storiesByAuthor = useMemo(() => {
    const map = new Map<string, EphemeralCommunityStory[]>();
    for (const s of activeStories) {
      if (!map.has(s.authorId)) map.set(s.authorId, []);
      map.get(s.authorId)!.push(s);
    }
    return Array.from(map.entries());
  }, [activeStories]);

  const handleOpenStory = useCallback(async (story: EphemeralCommunityStory) => {
    if (!story.viewedByUserIds?.includes(currentUserId)) {
      await onViewStory(story.id);
    }
  }, [currentUserId, onViewStory]);

  // Open first story of an author
  const openAuthorStory = (authorId: string) => {
    const authorStories = activeStories.filter(s => s.authorId === authorId);
    const firstIdx = activeStories.findIndex(s => s.id === authorStories[0]?.id);
    if (firstIdx >= 0) {
      setOpenedStoryIndex(firstIdx);
      handleOpenStory(authorStories[0]);
    }
  };

  useEffect(() => {
    if (!focusedStoryId || activeStories.length === 0) return;
    const matchIdx = activeStories.findIndex(s => s.id === focusedStoryId);
    if (matchIdx >= 0) {
      setOpenedStoryIndex(matchIdx);
      handleOpenStory(activeStories[matchIdx]);
      onClearFocusedStory?.();
    }
  }, [focusedStoryId, activeStories, handleOpenStory, onClearFocusedStory]);

  const openedStory = openedStoryIndex !== null ? activeStories[openedStoryIndex] : null;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        padding: '0.5rem 0',
      }}
    >
      {/* Story Bar (horizontal scroll) */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {/* Add story button */}
        <button
          onClick={() => setShowCreate(true)}
          style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.375rem',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #dc2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <Plus size={28} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500 }}>
            {t.addStory}
          </span>
        </button>

        {/* Story rings by author */}
        {storiesByAuthor.map(([authorId, authorStories]) => {
          const firstStory = authorStories[0];
          const isOwn = authorId === currentUserId;
          const hasUnviewed = authorStories.some(s => !s.viewedByUserIds?.includes(currentUserId));
          return (
            <button
              key={authorId}
              onClick={() => openAuthorStory(authorId)}
              style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.375rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  padding: '3px',
                  background: hasUnviewed
                    ? 'linear-gradient(135deg, #7c3aed, #db2777, #f59e0b)'
                    : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: 'white',
                    padding: '2px',
                    overflow: 'hidden',
                  }}
                >
                  {firstStory.authorPhotoUrl ? (
                    <img
                      src={firstStory.authorPhotoUrl}
                      alt={firstStory.authorName}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: '#e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4338ca',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                      }}
                    >
                      {firstStory.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 500, maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isOwn ? t.myStory : firstStory.authorName.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {activeStories.length === 0 && (
        <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
          {t.noStories}
        </div>
      )}

      {/* Create story modal */}
      {showCreate && (
        <CreateStoryModal
          language={language}
          onClose={() => setShowCreate(false)}
          onCreate={async (story) => {
            await onCreateStory(story);
            setShowCreate(false);
          }}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserSpecialty={currentUserSpecialty}
          currentUserDegree={currentUserDegree}
          currentUserPhotoUrl={currentUserPhotoUrl}
          currentUserPosition={currentUserPosition}
          publishedCases={publishedCases}
          visualMedia={visualMedia}
        />
      )}

      {/* Story viewer */}
      {openedStory && (
        <StoryViewer
          language={language}
          story={openedStory}
          currentUserId={currentUserId}
          onClose={() => setOpenedStoryIndex(null)}
          onPrev={() => {
            if (openedStoryIndex !== null && openedStoryIndex > 0) {
              const prev = activeStories[openedStoryIndex - 1];
              setOpenedStoryIndex(openedStoryIndex - 1);
              handleOpenStory(prev);
            }
          }}
          onNext={() => {
            if (openedStoryIndex !== null && openedStoryIndex < activeStories.length - 1) {
              const next = activeStories[openedStoryIndex + 1];
              setOpenedStoryIndex(openedStoryIndex + 1);
              handleOpenStory(next);
            } else {
              setOpenedStoryIndex(null);
            }
          }}
          onDelete={() => {
            onDeleteStory(openedStory.id);
            setOpenedStoryIndex(null);
          }}
          onReply={onReplyToStory}
          isOwn={openedStory.authorId === currentUserId}
          hasNext={openedStoryIndex !== null && openedStoryIndex < activeStories.length - 1}
          hasPrev={openedStoryIndex !== null && openedStoryIndex > 0}
          viewerNamesMap={viewerNamesMap}
        />
      )}
    </div>
  );
};

// ============================================================================
// CreateStoryModal
// ============================================================================

interface CreateStoryModalProps {
  language: Lang;
  onClose: () => void;
  onCreate: (story: Omit<EphemeralCommunityStory, 'id' | 'createdAt' | 'expiresAt' | 'viewedByUserIds' | 'viewsCount' | 'updatedAt'>) => Promise<void>;
  currentUserId: string;
  currentUserName: string;
  currentUserSpecialty?: string;
  currentUserDegree?: string;
  currentUserPhotoUrl?: string;
  currentUserPosition?: string;
  publishedCases?: { id: string; caseReference: string; primaryDiagnosis: string }[];
  visualMedia?: { id: string; title: string }[];
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  language,
  onClose,
  onCreate,
  currentUserId,
  currentUserName,
  currentUserSpecialty,
  currentUserDegree,
  currentUserPhotoUrl,
  currentUserPosition,
  publishedCases = [],
  visualMedia = [],
}) => {
  const t = I18N[language];
  const isRtl = language === 'ar';
  const [storyType, setStoryType] = useState<StoryMediaType>('text');
  const [textContent, setTextContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#1e3a8a');
  const [linkedCaseId, setLinkedCaseId] = useState('');
  const [linkedMediaId, setLinkedMediaId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (storyType === 'text' && textContent.trim().length < 10) return;
    if ((storyType === 'image' || storyType === 'video') && !mediaUrl.trim()) return;
    if (storyType === 'case_link' && !linkedCaseId) return;
    if (storyType === 'media_link' && !linkedMediaId) return;

    setIsSubmitting(true);
    try {
      const linkedCase = linkedCaseId ? publishedCases.find(c => c.id === linkedCaseId) : undefined;
      const linkedMedia = linkedMediaId ? visualMedia.find(m => m.id === linkedMediaId) : undefined;

      await onCreate({
        authorId: currentUserId,
        authorName: currentUserName,
        authorDegree: currentUserDegree,
        authorSpecialty: currentUserSpecialty,
        authorPhotoUrl: currentUserPhotoUrl,
        authorPosition: currentUserPosition,
        mediaType: storyType,
        text: storyType === 'text' ? textContent.trim() : caption.trim() || undefined,
        mediaUrl: mediaUrl.trim() || undefined,
        backgroundColor: storyType === 'text' ? backgroundColor : undefined,
        linkedCaseId: linkedCase?.id,
        linkedCaseReference: linkedCase?.caseReference,
        linkedMediaId: linkedMedia?.id,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions: { value: StoryMediaType; label: string; icon: React.ElementType }[] = [
    { value: 'text', label: t.storyType.text, icon: FileText },
    { value: 'image', label: t.storyType.image, icon: ImageIcon },
    { value: 'video', label: t.storyType.video, icon: Video },
    { value: 'case_link', label: t.storyType.case_link, icon: Stethoscope },
    { value: 'media_link', label: t.storyType.media_link, icon: Link2 },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{
          background: 'white',
          borderRadius: '0.75rem',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} className="text-amber-500" />
            {t.createStory}
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', display: 'grid', gap: '1rem' }}>
          {/* 24h notice */}
          <div
            style={{
              padding: '0.625rem 0.875rem',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              color: '#92400e',
            }}
          >
            <Clock size={14} />
            {language === 'ar'
              ? 'قصتك ستظهر لمدة 24 ساعة ثم تختفي تلقائياً'
              : language === 'de'
              ? 'Ihre Story wird 24 Stunden lang angezeigt und verschwindet dann automatisch'
              : 'Your story will be visible for 24 hours then disappear automatically'}
          </div>

          {/* Type selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
              {t.storyTypeLabel}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {typeOptions.map(opt => {
                const Icon = opt.icon;
                const isActive = storyType === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setStoryType(opt.value)}
                    style={{
                      padding: '0.5rem 0.875rem',
                      border: `1px solid ${isActive ? '#f59e0b' : '#cbd5e1'}`,
                      background: isActive ? '#fef3c7' : 'white',
                      color: isActive ? '#92400e' : '#475569',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <Icon size={14} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional content */}
          {storyType === 'text' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                  {t.background}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {t.backgroundColors.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setBackgroundColor(c.value)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: c.value,
                        border: backgroundColor === c.value ? '3px solid #f59e0b' : '2px solid transparent',
                        cursor: 'pointer',
                      }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                  {t.textContent}
                </label>
                <textarea
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  placeholder={t.textPlaceholder}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>
            </>
          )}

          {(storyType === 'image' || storyType === 'video') && (
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                {t.mediaUrl}
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={e => setMediaUrl(e.target.value)}
                placeholder="https://…"
                style={{
                  width: '100%',
                  padding: '0.625rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                  {t.caption}
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder={t.captionPlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {storyType === 'case_link' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                {t.linkCase}
              </label>
              <select
                value={linkedCaseId}
                onChange={e => setLinkedCaseId(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', background: 'white' }}
              >
                <option value="">{t.selectCase}</option>
                {publishedCases.map(c => (
                  <option key={c.id} value={c.id}>{c.caseReference} — {c.primaryDiagnosis}</option>
                ))}
              </select>
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                  {t.caption}
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder={t.captionPlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {storyType === 'media_link' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                {t.linkMedia}
              </label>
              <select
                value={linkedMediaId}
                onChange={e => setLinkedMediaId(e.target.value)}
                style={{ width: '100%', padding: '0.625rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', background: 'white' }}
              >
                <option value="">{t.selectMedia}</option>
                {visualMedia.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
              <div style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                  {t.caption}
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder={t.captionPlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.625rem',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={onClose}
            style={{ padding: '0.625rem 1.25rem', border: '1px solid #cbd5e1', background: 'white', color: '#334155', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              padding: '0.625rem 1.25rem',
              background: isSubmitting ? '#94a3b8' : '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isSubmitting ? 'wait' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <Clock size={14} />
            {isSubmitting ? t.publishing : t.publish}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// StoryViewer — full-screen story viewer with auto-advance + 24h countdown
// ============================================================================

interface StoryViewerProps {
  language: Lang;
  story: EphemeralCommunityStory;
  currentUserId: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDelete: () => void;
  onReply?: (storyId: string, message: string) => Promise<void>;
  isOwn: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  viewerNamesMap?: Record<string, string>;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  language,
  story,
  currentUserId: _currentUserId,
  onClose,
  onPrev,
  onNext,
  onDelete,
  onReply,
  isOwn,
  hasPrev,
  hasNext,
  viewerNamesMap = {},
}) => {
  const t = I18N[language];
  const isRtl = language === 'ar';
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [showViews, setShowViews] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setProgress(0);
    setShowViews(false);
    setConfirmingDelete(false);
    setReplySent(false);
  }, [story.id]);

  // Auto-advance after 8 seconds
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          if (hasNext) onNext();
          else onClose();
          return 100;
        }
        return p + 100 / 80; // 8 seconds = 80 ticks at 100ms
      });
    }, 100);
    return () => clearInterval(interval);
  }, [paused, hasNext, onClose, onNext]);

  // Compute remaining time for 24h expiry display
  const now = Date.now();
  const expiresAtMs = new Date(story.expiresAt).getTime();
  const remainingMs = expiresAtMs - now;
  const remainingHours = Math.floor(remainingMs / (60 * 60 * 1000));
  const remainingMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

  const handleReply = async () => {
    if (!replyText.trim() || !onReply) return;
    await onReply(story.id, replyText.trim());
    setReplyText('');
    setReplySent(true);
    setTimeout(() => setReplySent(false), 2500);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0f172a',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          aspectRatio: '9/16',
          maxHeight: '90vh',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          background: story.backgroundColor || '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(255,255,255,0.2)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'white',
              transition: 'width 0.1s linear',
            }}
          />
        </div>

        {/* Author header */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: 0,
            right: 0,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            zIndex: 10,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.4), transparent)',
          }}
        >
          {story.authorPhotoUrl ? (
            <img
              src={story.authorPhotoUrl}
              alt={story.authorName}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }}
            />
          ) : (
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'white', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {story.authorName.charAt(0)}
            </div>
          )}
          <div style={{ flex: 1, color: 'white' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {story.authorName}
              {story.authorDegree && <span style={{ opacity: 0.85, fontWeight: 400, marginLeft: '0.25rem' }}>{story.authorDegree}</span>}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={10} />
              {t.expires} {remainingHours}{t.hours} {remainingMinutes}{t.minutes}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}>
            <X size={20} />
          </button>
        </div>

        {/* Story content */}
        {story.mediaType === 'text' && (
          <div
            style={{
              padding: '2rem',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: 500,
              lineHeight: 1.5,
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
            }}
          >
            {story.text}
          </div>
        )}

        {(story.mediaType === 'image' || story.mediaType === 'video') && story.mediaUrl && (
          <>
            {story.mediaType === 'image' && (
              <img
                src={story.mediaUrl}
                alt={story.text || 'Story'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            {story.mediaType === 'video' && (
              <video
                src={story.mediaUrl}
                autoPlay
                muted
                loop
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            {story.text && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '12px',
                  right: '12px',
                  padding: '0.75rem 1rem',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                }}
              >
                {story.text}
              </div>
            )}
          </>
        )}

        {story.mediaType === 'case_link' && (
          <div
            style={{
              padding: '2rem',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Stethoscope size={48} style={{ margin: '0 auto 1rem', color: 'white' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {language === 'ar' ? 'قصة حالة' : language === 'de' ? 'Fall-Story' : 'Case Story'}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.85, marginBottom: '0.5rem' }}>
              {story.linkedCaseReference}
            </div>
            {story.text && <div style={{ fontSize: '0.9rem', marginTop: '1rem' }}>{story.text}</div>}
          </div>
        )}

        {story.mediaType === 'media_link' && (
          <div style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>
            <Link2 size={48} style={{ margin: '0 auto 1rem', color: 'white' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>
              {language === 'ar' ? 'قصة وسائط' : language === 'de' ? 'Medien-Story' : 'Media Story'}
            </div>
            {story.text && <div style={{ fontSize: '0.9rem', marginTop: '1rem' }}>{story.text}</div>}
          </div>
        )}

        {/* Nav arrows */}
        {hasPrev && (
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '8px',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {hasNext && (
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            style={{
              position: 'absolute',
              top: '50%',
              right: '8px',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Pause indicator */}
        {paused && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', opacity: 0.6 }}>
            <Pause size={48} />
          </div>
        )}

        {/* Footer: views + reply */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 16px',
            background: 'linear-gradient(0deg, rgba(0,0,0,0.6), transparent)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          {!isOwn && onReply && (
            <>
              <input
                type="text"
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={replySent ? (language === 'ar' ? 'تم إرسال الرد ✓' : 'Reply sent ✓') : t.replyPlaceholder}
                onKeyDown={e => { if (e.key === 'Enter') handleReply(); }}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.875rem',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '9999px',
                  color: 'white',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim()}
                style={{
                  background: replyText.trim() ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={14} />
              </button>
            </>
          )}
          {isOwn && (
            <>
              <button
                onClick={() => setShowViews(!showViews)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '9999px',
                  padding: '0.5rem 0.875rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                <Eye size={14} />
                {story.viewsCount || 0} {t.views}
              </button>
              {!confirmingDelete ? (
                <button
                  onClick={() => setConfirmingDelete(true)}
                  style={{
                    background: 'rgba(220, 38, 38, 0.55)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <Trash2 size={14} />
                  {t.deleteStory}
                </button>
              ) : (
                <button
                  onClick={() => onDelete()}
                  style={{
                    background: '#dc2626',
                    border: '1px solid white',
                    color: 'white',
                    padding: '0.5rem 0.875rem',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <Trash2 size={14} />
                  {language === 'ar' ? 'تأكيد الحذف' : language === 'de' ? 'Bestätigen' : 'Confirm Delete'}
                </button>
              )}
            </>
          )}
        </div>

        {/* Views list for owner */}
        {isOwn && showViews && (
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              left: '16px',
              right: '16px',
              maxHeight: '40%',
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.85)',
              borderRadius: '0.5rem',
              padding: '0.625rem',
              zIndex: 11,
            }}
          >
            <div style={{ color: 'white', fontSize: '0.75rem', marginBottom: '0.375rem', fontWeight: 600 }}>
              {t.views} ({story.viewedByUserIds?.length || 0}):
            </div>
            {story.viewedByUserIds?.length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>—</div>
            )}
            {/* In a full implementation, you would resolve user names from IDs */}
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.75rem' }}>
              {story.viewedByUserIds?.map(uid => (
                <div key={uid} style={{ padding: '0.125rem 0' }}>
                  {viewerNamesMap[uid] || uid}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityStoriesView;
