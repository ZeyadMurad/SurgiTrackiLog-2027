import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Heart,
  Eye,
  Trash2,
  X,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  Loader2,
  Stethoscope,
  Scissors,
  FlaskConical,
  Award,
  Layers,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CommunityStory, StoryCategory } from '../types';
import { getTimestampMs } from '../lib/firebase';

interface CommunityStoriesSectionProps {
  onOpenRelatedCase?: (caseId: string) => void;
  focusedStoryId?: string | null;
  onClearFocusedStory?: () => void;
}

const STORY_CATEGORIES: {
  id: StoryCategory;
  labelEn: string;
  labelAr: string;
  badgeClass: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'clinical_pearl',
    labelEn: 'Clinical Pearl',
    labelAr: 'درّة سريرية',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    icon: <Stethoscope size={12} />,
  },
  {
    id: 'or_moment',
    labelEn: 'OR Moment',
    labelAr: 'لحظة عمليات',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    icon: <Scissors size={12} />,
  },
  {
    id: 'technique',
    labelEn: 'Technique',
    labelAr: 'تقنية جراحية',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    icon: <Layers size={12} />,
  },
  {
    id: 'research_note',
    labelEn: 'Research Note',
    labelAr: 'ملاحظة بحثية',
    badgeClass: 'bg-violet-50 text-violet-800 border-violet-200',
    icon: <FlaskConical size={12} />,
  },
  {
    id: 'milestone',
    labelEn: 'Milestone',
    labelAr: 'إنجاز تدريبي',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: <Award size={12} />,
  },
];

export const CommunityStoriesSection: React.FC<CommunityStoriesSectionProps> = ({
  onOpenRelatedCase,
  focusedStoryId,
  onClearFocusedStory,
}) => {
  const {
    communityStories,
    cases,
    hasMoreStories,
    loadingMoreStories,
    loadMoreStories,
    createCommunityStory,
    deleteCommunityStory,
    toggleLikeStory,
    markStoryViewed,
  } = useData();
  const { profile, user, language, myUids } = useAuth();
  const isRTL = language === 'ar';
  const currentActorUids = myUids.length > 0 ? myUids : ([user?.uid, profile?.userId].filter(Boolean) as string[]);
  const isSuperAdmin =
    user?.email?.toLowerCase().trim() === 'zeadmorud2030@gmail.com' || profile?.role === 'super_admin';

  const [activeStory, setActiveStory] = useState<CommunityStory | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<StoryCategory>('clinical_pearl');
  const [relatedCaseId, setRelatedCaseId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [viewerError, setViewerError] = useState('');
  const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);

  const publishedOwnCases = cases.filter(c => c.isPublished);

  useEffect(() => {
    if (!focusedStoryId || communityStories.length === 0) return;
    const match = communityStories.find(s => s.id === focusedStoryId);
    if (match) {
      setActiveStory(match);
      markStoryViewed(match.id).catch(() => {});
      if (onClearFocusedStory) onClearFocusedStory();
    }
  }, [focusedStoryId, communityStories]);

  // Keep open story synced with real-time updates (likes, views)
  const liveActiveStory = activeStory
    ? communityStories.find(s => s.id === activeStory.id) || activeStory
    : null;

  const handleOpenStory = (story: CommunityStory) => {
    setViewerError('');
    setActiveStory(story);
    markStoryViewed(story.id).catch(() => {});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError(isRTL ? 'يرجى اختيار ملف صورة صالح (JPG / PNG / WebP).' : 'Please select a valid image file (JPG / PNG / WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormError(isRTL ? 'الحد الأقصى لحجم الصورة هو 10 ميجابايت.' : 'Maximum image size is 10 MB.');
      return;
    }
    setFormError('');
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreviewUrl(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const resetCreateModal = () => {
    setTitle('');
    setContent('');
    setCategory('clinical_pearl');
    setRelatedCaseId('');
    setImageFile(null);
    setImagePreviewUrl('');
    setFormError('');
    setShowCreateModal(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setFormError(isRTL ? 'العنوان والمحتوى السريري مطلوبان.' : 'Title and clinical note content are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await createCommunityStory({
        title: title.trim(),
        content: content.trim(),
        category,
        imageFile,
        relatedCaseId: relatedCaseId || undefined,
      });
      resetCreateModal();
    } catch (err: any) {
      setFormError(err?.message || (isRTL ? 'تعذر نشر القصة السريرية.' : 'Failed to publish story update.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    setDeletingStoryId(storyId);
    setViewerError('');
    try {
      await deleteCommunityStory(storyId);
      setActiveStory(null);
    } catch (err: any) {
      setViewerError(err?.message || (isRTL ? 'تعذر حذف القصة السريرية.' : 'Unable to delete story.'));
    } finally {
      setDeletingStoryId(null);
    }
  };

  const LEGACY_CATEGORY_META: Record<string, { id: StoryCategory; labelEn: string; labelAr: string; badgeClass: string; icon: React.ReactNode }> = {
    operative_tip: {
      id: 'operative_tip',
      labelEn: 'Operative Tip',
      labelAr: 'نصيحة جراحية',
      badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      icon: <Scissors size={12} />,
    },
    case_update: {
      id: 'case_update',
      labelEn: 'Case Update',
      labelAr: 'تحديث حالة',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <FileText size={12} />,
    },
  };

  const getCategoryMeta = (catId: StoryCategory) =>
    STORY_CATEGORIES.find(c => c.id === catId) || LEGACY_CATEGORY_META[catId] || STORY_CATEGORIES[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{isRTL ? 'قصص ودرر سريرية مباشرة' : 'Clinical Pearls & Surgical Stories'}</span>
              <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-mono font-semibold">
                {communityStories.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isRTL
                ? 'ملاحظات غرفة العمليات السريعة، التقنيات المختصرة، وإنجازات الزملاء في الوقت الحقيقي'
                : 'Real-time OR pearls, brief operative tips, and colleague surgical milestones'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs transition cursor-pointer"
        >
          <Plus size={14} />
          <span>{isRTL ? 'مشاركة قصة / درّة سريرية' : 'Share Clinical Story'}</span>
        </button>
      </div>

      {/* Horizontal Stories Strip */}
      <div className="flex items-stretch gap-3 overflow-x-auto pb-1 scrollbar-none">
        {/* Quick Create Card */}
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="shrink-0 w-36 sm:w-40 rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/40 hover:bg-teal-50 p-3 flex flex-col items-center justify-center text-center gap-2 transition cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition">
            <Plus size={18} />
          </div>
          <span className="text-[11px] font-bold text-teal-900 leading-tight">
            {isRTL ? 'أضف تحديثاً سريرياً' : 'Post New Story'}
          </span>
          <span className="text-[9px] text-teal-700">
            {isRTL ? 'ملاحظة أو صورة' : 'Note or OR photo'}
          </span>
        </button>

        {communityStories.map(story => {
          const cat = getCategoryMeta(story.category);
          const isViewed = (story.viewedByUserIds || []).some(uid => currentActorUids.includes(uid));
          const isLiked = (story.likedByUserIds || []).some(uid => currentActorUids.includes(uid));

          return (
            <div
              key={story.id}
              onClick={() => handleOpenStory(story)}
              className={`shrink-0 w-56 sm:w-64 rounded-2xl border p-3 flex flex-col justify-between transition cursor-pointer hover:shadow-md ${
                !isViewed
                  ? 'border-teal-400 bg-gradient-to-br from-teal-50/50 via-white to-white ring-1 ring-teal-200/60'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeClass}`}
                  >
                    {cat.icon}
                    <span>{isRTL ? cat.labelAr : cat.labelEn}</span>
                  </span>
                  {!isViewed && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" title="Unread" />
                  )}
                </div>

                {story.imageUrl && (
                  <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <h4 className="text-xs font-bold text-slate-900 line-clamp-1" title={story.title}>
                  {story.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {story.content}
                </p>
              </div>

              <div className="pt-2.5 mt-2 border-t border-slate-200/70 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {story.authorPhotoUrl ? (
                    <img
                      src={story.authorPhotoUrl}
                      alt={story.authorName}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#101C32] text-teal-300 text-[9px] font-bold flex items-center justify-center shrink-0">
                      {(story.authorName || 'DR').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[10px] font-semibold text-slate-700 truncate">
                    {story.authorName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 shrink-0">
                  <span className={`inline-flex items-center gap-0.5 ${isLiked ? 'text-rose-600 font-bold' : ''}`}>
                    <Heart size={10} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                    {story.likesCount ?? story.likedByUserIds?.length ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Eye size={10} />
                    {story.viewsCount ?? story.viewedByUserIds?.length ?? 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {communityStories.length === 0 && (
          <div className="flex-1 min-w-[220px] rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-semibold text-slate-600">
              {isRTL ? 'لا توجد قصص سريرية بعد' : 'No surgical stories shared yet'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isRTL ? 'كن أول من يشارك درّة سريرية مع زملائه!' : 'Be the first to share a quick clinical pearl with colleagues.'}
            </p>
          </div>
        )}

        {hasMoreStories && (
          <button
            type="button"
            onClick={loadMoreStories}
            disabled={loadingMoreStories}
            className="shrink-0 w-32 rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-teal-50/50 p-3 flex flex-col items-center justify-center text-center gap-1.5 text-slate-700 text-[11px] font-bold transition cursor-pointer disabled:opacity-60"
          >
            {loadingMoreStories ? <Loader2 size={16} className="animate-spin text-teal-600" /> : <Plus size={16} />}
            <span>{loadingMoreStories ? (isRTL ? 'جاري التحميل...' : 'Loading...') : (isRTL ? 'المزيد' : 'Load More')}</span>
          </button>
        )}
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto animate-fadeIn">
            <div className="px-6 py-4 bg-[#101C32] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-teal-300" />
                <h3 className="font-bold text-sm">
                  {isRTL ? 'مشاركة قصة أو درّة سريرية' : 'Share Clinical Pearl / Surgical Story'}
                </h3>
              </div>
              <button
                type="button"
                onClick={resetCreateModal}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {isRTL ? 'التصنيف' : 'Category'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STORY_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition cursor-pointer ${
                        category === cat.id
                          ? 'bg-[#0D9488] text-white border-[#0D9488]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.icon}
                      <span>{isRTL ? cat.labelAr : cat.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRTL ? 'عنوان القصة / الملاحظة *' : 'Title *'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isRTL ? 'مثال: خطوة آمنة لتحديد القناة الصفراوية...' : 'e.g., Critical View of Safety tip in acute cholecystitis'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRTL ? 'التفاصيل السريرية (مجهولة الهوية تماماً) *' : 'Clinical Content (Strictly Anonymized) *'}
                </label>
                <textarea
                  rows={4}
                  required
                  maxLength={5000}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={isRTL ? 'اكتب الدرة السريرية أو الملاحظة الجراحية دون ذكر أي بيانات تعريفية للمريض...' : 'Share your operative pearl, key anatomy tip, or research reflection without any patient identifiers...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {publishedOwnCases.length > 0 && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isRTL ? 'ربط بحالة سريرية منشورة (اختياري)' : 'Link Published Clinical Case (Optional)'}
                  </label>
                  <select
                    value={relatedCaseId}
                    onChange={(e) => setRelatedCaseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    <option value="">{isRTL ? '-- بدون ربط بحالة --' : '-- No linked case --'}</option>
                    {publishedOwnCases.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.caseReference} — {c.primaryDiagnosis}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRTL ? 'إرفاق صورة توضيحية مجهولة الهوية (اختياري)' : 'Attach Anonymized Image (Optional)'}
                </label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 rounded-2xl p-3 cursor-pointer transition">
                  <ImageIcon size={16} className="text-teal-700" />
                  <span className="font-semibold text-slate-700">
                    {imageFile
                      ? imageFile.name
                      : (isRTL ? 'اختر صورة لرفعها إلى السحابة' : 'Select photo to upload to Cloud Storage')}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {imagePreviewUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                    <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreviewUrl('');
                      }}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetCreateModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold shadow-sm transition cursor-pointer disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{submitting ? (isRTL ? 'جاري النشر...' : 'Publishing...') : (isRTL ? 'نشر في المجتمع' : 'Publish Story')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Detail Viewer Modal */}
      {liveActiveStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 bg-[#101C32] text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {liveActiveStory.authorPhotoUrl ? (
                  <img
                    src={liveActiveStory.authorPhotoUrl}
                    alt={liveActiveStory.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-400 shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {(liveActiveStory.authorName || 'DR').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate">{liveActiveStory.authorName}</h4>
                  <p className="text-[11px] text-teal-200 truncate">
                    {liveActiveStory.authorSpecialty || 'Surgeon'}
                    {liveActiveStory.authorHospital ? ` • ${liveActiveStory.authorHospital}` : ''}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {(() => {
                  const cat = getCategoryMeta(liveActiveStory.category);
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.badgeClass}`}
                    >
                      {cat.icon}
                      <span>{isRTL ? cat.labelAr : cat.labelEn}</span>
                    </span>
                  );
                })()}
                <span className="text-[11px] font-mono text-slate-400">
                  {new Date(
                    getTimestampMs(liveActiveStory.createdAtServer || liveActiveStory.createdAt) || Date.now()
                  ).toLocaleString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {liveActiveStory.title}
              </h3>

              {viewerError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                  {viewerError}
                </div>
              )}

              {liveActiveStory.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-72 flex items-center justify-center">
                  <img
                    src={liveActiveStory.imageUrl}
                    alt={liveActiveStory.title}
                    className="w-full max-h-72 object-contain"
                  />
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {liveActiveStory.content}
              </p>

              {liveActiveStory.relatedCaseId && onOpenRelatedCase && (
                <button
                  type="button"
                  onClick={() => {
                    const targetCaseId = liveActiveStory.relatedCaseId!;
                    setActiveStory(null);
                    onOpenRelatedCase(targetCaseId);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <FileText size={14} />
                  <span>{isRTL ? 'الانتقال إلى الحالة السريرية المرتبطة' : 'Open Linked Surgical Case'}</span>
                  <ExternalLink size={12} />
                </button>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const isLiked = (liveActiveStory.likedByUserIds || []).some(uid =>
                      currentActorUids.includes(uid)
                    );
                    return (
                      <button
                        type="button"
                        onClick={() => toggleLikeStory(liveActiveStory.id)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          isLiked
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50'
                        }`}
                      >
                        <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                        <span>{liveActiveStory.likesCount ?? liveActiveStory.likedByUserIds?.length ?? 0}</span>
                      </button>
                    );
                  })()}

                  <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-500">
                    <Eye size={14} />
                    {liveActiveStory.viewsCount ?? liveActiveStory.viewedByUserIds?.length ?? 0}{' '}
                    {isRTL ? 'مشاهدة' : 'views'}
                  </span>
                </div>

                {(isSuperAdmin || currentActorUids.includes(liveActiveStory.authorId)) && (
                  <button
                    type="button"
                    disabled={deletingStoryId === liveActiveStory.id}
                    onClick={() => handleDeleteStory(liveActiveStory.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition cursor-pointer disabled:opacity-60"
                  >
                    {deletingStoryId === liveActiveStory.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                    <span>{isRTL ? 'حذف' : 'Delete'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
