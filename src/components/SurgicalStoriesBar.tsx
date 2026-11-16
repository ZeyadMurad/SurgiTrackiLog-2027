import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Heart,
  Eye,
  Trash2,
  X,
  Camera,
  Send,
  Clock,
  Stethoscope,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { CommunityStory } from '../types';
import { compressImageFileToDataUrl } from '../lib/imageUtils';
import { getTimestampMs } from '../lib/firebase';

interface SurgicalStoriesBarProps {
  onSelectDoctorById?: (userId: string) => void;
}

const STORY_CATEGORY_LABELS: Record<CommunityStory['category'], { en: string; ar: string }> = {
  clinical_pearl: { en: 'Clinical Pearl', ar: 'لؤلؤة سريرية' },
  operative_tip: { en: 'Operative Tip', ar: 'نصيحة جراحية' },
  case_update: { en: 'Case Update', ar: 'تحديث حالة' },
  milestone: { en: 'Surgical Milestone', ar: 'إنجاز تدريبي' },
};

export const SurgicalStoriesBar: React.FC<SurgicalStoriesBarProps> = ({ onSelectDoctorById }) => {
  const { stories, createStory, toggleLikeStory, markStoryViewed, deleteStory } = useData();
  const { profile, user, language, myUids } = useAuth();
  const isRTL = language === 'ar';
  const activeUid = authUidFallback(user?.uid, profile?.userId);

  const [showComposer, setShowComposer] = useState(false);
  const [selectedStory, setSelectedStory] = useState<CommunityStory | null>(null);

  // Composer state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CommunityStory['category']>('clinical_pearl');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFileToDataUrl(file, {
        maxDimension: 1024,
        quality: 0.78,
        maxOutputBytes: 180_000,
      });
      setImageUrl(compressed);
    } catch {
      setError(isRTL ? 'تعذر معالجة الصورة.' : 'Could not process image.');
    }
    e.target.value = '';
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError(isRTL ? 'يرجى إدخال العنوان والمحتوى.' : 'Please enter both a title and content.');
      return;
    }
    setSubmitting(true);
    try {
      await createStory({
        title: title.trim(),
        content: content.trim(),
        category,
        imageUrl: imageUrl || undefined,
      });
      setTitle('');
      setContent('');
      setImageUrl('');
      setCategory('clinical_pearl');
      setShowComposer(false);
    } catch (err: any) {
      setError(err?.message || (isRTL ? 'تعذر نشر القصة الجراحية.' : 'Failed to publish story.'));
    } finally {
      setSubmitting(false);
    }
  };

  const openStory = (story: CommunityStory) => {
    setSelectedStory(story);
    markStoryViewed(story.id);
  };

  const liveSelectedStory = selectedStory
    ? stories.find(s => s.id === selectedStory.id) || selectedStory
    : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/70">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{isRTL ? 'القصص والتحديثات السريرية' : 'Surgical Stories & Clinical Pearls'}</span>
              <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                {stories.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isRTL
                ? 'شارك لمحات جراحية سريعة، ملاحظات غرف العمليات، وإنجازاتك التدريبية مع زملائك'
                : 'Share quick operative pearls, OR highlights, and surgical training updates in real time'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setError('');
            setShowComposer(true);
          }}
          className="inline-flex items-center gap-1.5 bg-[#101C32] hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer shadow-2xs"
        >
          <Plus size={14} className="text-teal-400" />
          <span>{isRTL ? 'إضافة قصة / تحديث' : 'Share Story'}</span>
        </button>
      </div>

      {stories.length > 0 ? (
        <div className="flex items-stretch gap-3 overflow-x-auto pb-1 scrollbar-none">
          {stories.map((story) => {
            const viewed = (story.viewedByUserIds || []).includes(activeUid);
            const liked = (story.likedByUserIds || []).includes(activeUid);
            const catLabel = isRTL
              ? STORY_CATEGORY_LABELS[story.category]?.ar || story.category
              : STORY_CATEGORY_LABELS[story.category]?.en || story.category;

            return (
              <div
                key={story.id}
                onClick={() => openStory(story)}
                className={`shrink-0 w-56 rounded-2xl p-3 border transition cursor-pointer flex flex-col justify-between gap-2 ${
                  viewed
                    ? 'bg-slate-50/70 border-slate-200 hover:bg-white hover:shadow-sm'
                    : 'bg-gradient-to-br from-teal-50/80 to-white border-teal-300 shadow-2xs hover:shadow-md'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100/80 text-teal-800 truncate">
                      {catLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(getTimestampMs(story.createdAtServer || story.createdAt) || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {story.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {story.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {story.authorPhotoUrl ? (
                      <img
                        src={story.authorPhotoUrl}
                        alt={story.authorName}
                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200"
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

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 shrink-0">
                    <span className={`inline-flex items-center gap-0.5 ${liked ? 'text-rose-600 font-bold' : ''}`}>
                      <Heart size={11} className={liked ? 'fill-rose-500 text-rose-500' : ''} />
                      {story.likesCount || 0}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Eye size={11} />
                      {story.viewsCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
          {isRTL
            ? 'لا توجد قصص سريرية بعد — كن أول من يشارك لمحة أو تحديثاً جراحياً!'
            : 'No surgical stories yet — be the first to share a clinical pearl or operative update!'}
        </div>
      )}

      {/* Share Story Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isRTL ? 'مشاركة قصة أو تحديث سريري' : 'Share Surgical Story / Update'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isRTL ? 'يظهر فوراً لجميع أعضاء المجتمع الجراحي' : 'Published in real time to the Surgical Community'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitStory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRTL ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CommunityStory['category'])}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                >
                  {(Object.keys(STORY_CATEGORY_LABELS) as CommunityStory['category'][]).map(key => (
                    <option key={key} value={key}>
                      {isRTL ? STORY_CATEGORY_LABELS[key].ar : STORY_CATEGORY_LABELS[key].en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRTL ? 'العنوان *' : 'Headline / Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={isRTL ? 'مثال: نقطة تقنية مهمة أثناء استئصال المرارة بالمنظار' : 'e.g. Key anatomical landmark during laparoscopic cholecystectomy'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isRTL ? 'التفاصيل السريرية *' : 'Clinical Update / Pearl *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={isRTL ? 'اكتب ملخص الملاحظة الجراحية أو الخبرة العملية...' : 'Write your surgical insight, learning point, or update...'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline cursor-pointer">
                  <Camera size={14} />
                  <span>{isRTL ? 'إرفاق صورة توضيحية (اختياري)' : 'Attach clinical image (optional)'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </label>
                {imageUrl && (
                  <div className="mt-2 relative w-32 h-20 rounded-xl overflow-hidden border border-slate-200">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-1 right-1 bg-slate-900/75 text-white rounded-full p-0.5 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold cursor-pointer"
                >
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>{submitting ? (isRTL ? 'جارٍ النشر...' : 'Publishing...') : isRTL ? 'نشر الآن' : 'Publish Story'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Reader Modal */}
      {liveSelectedStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  if (onSelectDoctorById && liveSelectedStory.authorId) {
                    setSelectedStory(null);
                    onSelectDoctorById(liveSelectedStory.authorId);
                  }
                }}
              >
                {liveSelectedStory.authorPhotoUrl ? (
                  <img
                    src={liveSelectedStory.authorPhotoUrl}
                    alt={liveSelectedStory.authorName}
                    className="w-11 h-11 rounded-2xl object-cover border border-teal-200"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-[#101C32] text-teal-300 font-bold text-sm flex items-center justify-center">
                    {(liveSelectedStory.authorName || 'DR').substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 hover:text-teal-700">
                    {liveSelectedStory.authorName}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {liveSelectedStory.authorSpecialty} {liveSelectedStory.authorHospital ? `• ${liveSelectedStory.authorHospital}` : ''}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock size={10} />
                    <span>
                      {new Date(getTimestampMs(liveSelectedStory.createdAtServer || liveSelectedStory.createdAt) || Date.now()).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStory(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {isRTL
                  ? STORY_CATEGORY_LABELS[liveSelectedStory.category]?.ar
                  : STORY_CATEGORY_LABELS[liveSelectedStory.category]?.en}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {liveSelectedStory.title}
              </h3>
              {liveSelectedStory.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-72 bg-slate-100">
                  <img
                    src={liveSelectedStory.imageUrl}
                    alt={liveSelectedStory.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                {liveSelectedStory.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleLikeStory(liveSelectedStory.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    (liveSelectedStory.likedByUserIds || []).includes(activeUid)
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Heart
                    size={14}
                    className={(liveSelectedStory.likedByUserIds || []).includes(activeUid) ? 'fill-rose-500 text-rose-500' : ''}
                  />
                  <span>{liveSelectedStory.likesCount || 0}</span>
                </button>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 px-2">
                  <Eye size={14} />
                  <span>{liveSelectedStory.viewsCount || 0}</span>
                </span>
              </div>

              {(myUids.includes(liveSelectedStory.authorId) ||
                profile?.role === 'super_admin' ||
                user?.email?.toLowerCase() === 'zeadmorud2030@gmail.com') && (
                <button
                  type="button"
                  onClick={async () => {
                    await deleteStory(liveSelectedStory.id);
                    setSelectedStory(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{isRTL ? 'حذف القصة' : 'Delete Story'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function authUidFallback(authUid?: string, profileUid?: string): string {
  return authUid || profileUid || 'local-surgeon-001';
}
