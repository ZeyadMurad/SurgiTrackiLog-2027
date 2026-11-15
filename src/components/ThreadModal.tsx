// ============================================================================
// ThreadModal.tsx — Create a new community thread
// ============================================================================

import React, { useState, useEffect } from 'react';
import { X, Send, Link2, Plus, Hash } from 'lucide-react';
import type { CommunityThread, ThreadCategory, SupportedLanguage } from '../types/newTypes';

const I18N = {
  en: {
    title: 'Start a New Discussion',
    subtitle: 'Open a thread for the surgical community',
    threadTitle: 'Thread Title',
    titlePlaceholder: 'e.g., Best approach for recurrent inguinal hernia repair?',
    bodyLabel: 'Discussion Body',
    bodyPlaceholder: 'Describe the topic in detail. You can use markdown. Be specific to get better responses.',
    category: 'Category',
    tags: 'Tags',
    tagsPlaceholder: 'Add tags (press Enter)',
    tagsHelp: 'Press Enter to add a tag. Maximum 8 tags.',
    linkCase: 'Link to a published case (optional)',
    selectCase: 'Select a case…',
    cancel: 'Cancel',
    submit: 'Publish Thread',
    publishing: 'Publishing…',
    caseDiscussion: 'Case Discussion',
    technique: 'Technique',
    research: 'Research',
    education: 'Education',
    guidelines: 'Guidelines',
    complications: 'Complications',
    general: 'General',
    career: 'Career',
    titleRequired: 'Title is required (min 10 characters)',
    bodyRequired: 'Body is required (min 50 characters)',
  },
  ar: {
    title: 'ابدأ مناقشة جديدة',
    subtitle: 'افتح مناقشة للمجتمع الجراحي',
    threadTitle: 'عنوان المناقشة',
    titlePlaceholder: 'مثال: ما هو أفضل نهج لإصلاق الفتق الإربي المتكرر؟',
    bodyLabel: 'نص المناقشة',
    bodyPlaceholder: 'صف الموضوع بالتفصيل. يمكنك استخدام Markdown. كن محدداً للحصول على إجابات أفضل.',
    category: 'الفئة',
    tags: 'الوسوم',
    tagsPlaceholder: 'أضف وسماً (اضغط Enter)',
    tagsHelp: 'اضغط Enter لإضافة وسم. الحد الأقصى 8 وسوم.',
    linkCase: 'ربط بحالة منشورة (اختياري)',
    selectCase: 'اختر حالة…',
    cancel: 'إلغاء',
    submit: 'نشر المناقشة',
    publishing: 'جارٍ النشر…',
    caseDiscussion: 'مناقشة حالة',
    technique: 'تقنية',
    research: 'بحث',
    education: 'تعليم',
    guidelines: 'إرشادات',
    complications: 'مضاعفات',
    general: 'عام',
    career: 'مسار مهني',
    titleRequired: 'العنوان مطلوب (10 أحرف على الأقل)',
    bodyRequired: 'النص مطلوب (50 حرفاً على الأقل)',
  },
  de: {
    title: 'Neue Diskussion starten',
    subtitle: 'Eröffnen Sie eine Diskussion für die chirurgische Community',
    threadTitle: 'Diskussionstitel',
    titlePlaceholder: 'z.B. Bestes Vorgehen bei rezidivierender Leistenhernie?',
    bodyLabel: 'Diskussionstext',
    bodyPlaceholder: 'Beschreiben Sie das Thema ausführlich. Sie können Markdown verwenden.',
    category: 'Kategorie',
    tags: 'Tags',
    tagsPlaceholder: 'Tag hinzufügen (Enter drücken)',
    tagsHelp: 'Enter drücken, um Tag hinzuzufügen. Maximal 8 Tags.',
    linkCase: 'Mit veröffentlichtem Fall verknüpfen (optional)',
    selectCase: 'Fall auswählen…',
    cancel: 'Abbrechen',
    submit: 'Diskussion veröffentlichen',
    publishing: 'Veröffentlichen…',
    caseDiscussion: 'Falldiskussion',
    technique: 'Technik',
    research: 'Forschung',
    education: 'Bildung',
    guidelines: 'Leitlinien',
    complications: 'Komplikationen',
    general: 'Allgemein',
    career: 'Karriere',
    titleRequired: 'Titel erforderlich (mind. 10 Zeichen)',
    bodyRequired: 'Text erforderlich (mind. 50 Zeichen)',
  },
} as const;

type Lang = keyof typeof I18N;

export interface ThreadModalProps {
  language: Lang;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CommunityThread, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'repliesCount' | 'likesCount' | 'viewedByUserIds' | 'likedByUserIds' | 'followers'>) => Promise<void>;
  isSubmitting: boolean;
  currentUserId: string;
  currentUserName: string;
  currentUserSpecialty?: string;
  currentUserDegree?: string;
  currentUserPhotoUrl?: string;
  currentUserPosition?: string;
  publishedCases?: { id: string; caseReference: string; primaryDiagnosis: string }[];
}

export const ThreadModal: React.FC<ThreadModalProps> = ({
  language,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  currentUserId,
  currentUserName,
  currentUserSpecialty,
  currentUserDegree,
  currentUserPhotoUrl,
  currentUserPosition,
  publishedCases = [],
}) => {
  const t = I18N[language];
  const isRtl = language === 'ar';

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<ThreadCategory>('general');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [linkedCaseId, setLinkedCaseId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setBody('');
      setCategory('general');
      setTags([]);
      setTagInput('');
      setLinkedCaseId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 8) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async () => {
    if (title.trim().length < 10 || body.trim().length < 50) return;

    const linkedCase = linkedCaseId
      ? publishedCases.find(c => c.id === linkedCaseId)
      : undefined;

    await onSubmit({
      authorId: currentUserId,
      authorName: currentUserName,
      authorDegree: currentUserDegree,
      authorSpecialty: currentUserSpecialty,
      authorPhotoUrl: currentUserPhotoUrl,
      authorPosition: currentUserPosition,
      title: title.trim(),
      body: body.trim(),
      category,
      tags,
      status: 'open',
      linkedCaseId: linkedCase?.id,
      linkedCaseReference: linkedCase?.caseReference,
      linkedCaseTitle: linkedCase?.primaryDiagnosis,
    });
  };

  const categories: ThreadCategory[] = [
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
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
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
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: 'white',
            zIndex: 1,
            borderRadius: '0.75rem 0.75rem 0 0',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {t.title}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '0.375rem',
              color: '#64748b',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
          {/* Title */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '0.5rem',
              }}
            >
              {t.threadTitle}
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
            {title.length > 0 && title.length < 10 && (
              <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {t.titleRequired}
              </p>
            )}
          </div>

          {/* Body */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '0.5rem',
              }}
            >
              {t.bodyLabel}
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={t.bodyPlaceholder}
              rows={6}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                lineHeight: 1.5,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
              {body.length > 0 && body.length < 50 ? (
                <p style={{ color: '#dc2626', fontSize: '0.75rem' }}>{t.bodyRequired}</p>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{body.length} characters</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '0.5rem',
              }}
            >
              {t.category}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{
                    padding: '0.5rem 0.875rem',
                    border: `1px solid ${category === c ? '#2563eb' : '#cbd5e1'}`,
                    background: category === c ? '#2563eb' : 'white',
                    color: category === c ? 'white' : '#334155',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                  }}
                >
                  {t[c === 'case_discussion' ? 'caseDiscussion' : c as keyof typeof t]}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '0.5rem',
              }}
            >
              {t.tags}
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.375rem',
                padding: '0.5rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                minHeight: '42px',
              }}
            >
              {tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.5rem',
                    background: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '0.25rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <Hash size={10} />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6366f1',
                      padding: 0,
                      display: 'inline-flex',
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={t.tagsPlaceholder}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: '1 1 120px',
                  minWidth: '120px',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>{t.tagsHelp}</p>
          </div>

          {/* Linked case (optional) */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '0.5rem',
              }}
            >
              <Link2 size={14} style={{ marginInlineEnd: '0.25rem', verticalAlign: 'middle' }} />
              {t.linkCase}
            </label>
            <select
              value={linkedCaseId}
              onChange={e => setLinkedCaseId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.625rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              <option value="">{t.selectCase}</option>
              {publishedCases.map(c => (
                <option key={c.id} value={c.id}>
                  {c.caseReference} — {c.primaryDiagnosis}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            position: 'sticky',
            bottom: 0,
            background: 'white',
            borderRadius: '0 0 0.75rem 0.75rem',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.625rem 1.25rem',
              border: '1px solid #cbd5e1',
              background: 'white',
              color: '#334155',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || title.trim().length < 10 || body.trim().length < 50}
            style={{
              padding: '0.625rem 1.25rem',
              border: 'none',
              background:
                isSubmitting || title.trim().length < 10 || body.trim().length < 50
                  ? '#94a3b8'
                  : '#2563eb',
              color: 'white',
              borderRadius: '0.5rem',
              cursor:
                isSubmitting || title.trim().length < 10 || body.trim().length < 50
                  ? 'not-allowed'
                  : 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Send size={16} />
            {isSubmitting ? t.publishing : t.submit}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreadModal;
