// ============================================================================
// ThreadView.tsx — Detailed thread view with replies
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Heart,
  Eye,
  Reply,
  Pin,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Lock,
  Trash2,
} from 'lucide-react';
import type { CommunityThread, ThreadReply, ThreadStatus, SupportedLanguage } from '../types/newTypes';

const I18N = {
  en: {
    back: 'Back to Threads',
    replies: 'Replies',
    replyPlaceholder: 'Write your reply… Be respectful and evidence-based.',
    submitReply: 'Post Reply',
    posting: 'Posting…',
    noReplies: 'No replies yet. Be the first to contribute.',
    solution: 'Accepted Solution',
    markSolution: 'Mark as Solution',
    unmarkSolution: 'Unmark Solution',
    by: 'by',
    closeThread: 'Close Thread',
    reopenThread: 'Reopen Thread',
    pinThread: 'Pin',
    unpinThread: 'Unpin',
    linkedCase: 'Linked Case',
    follow: 'Follow Thread',
    unfollow: 'Following',
    confirmCloseThread: 'Close this thread to new replies?',
    confirmOpenThread: 'Reopen this thread to new replies?',
    threadClosed: 'This thread is closed to new replies.',
    cancel: 'Cancel',
  },
  ar: {
    back: 'العودة للمناقشات',
    replies: 'الردود',
    replyPlaceholder: 'اكتب ردك… كن محترماً ومبنياً على الأدلة العلمية.',
    submitReply: 'نشر الرد',
    posting: 'جارٍ النشر…',
    noReplies: 'لا توجد ردود بعد. كن أول من يساهم.',
    solution: 'الحل المقبول',
    markSolution: 'تعيين كحل',
    unmarkSolution: 'إلغاء التعيين',
    by: 'بواسطة',
    closeThread: 'إغلاق المناقشة',
    reopenThread: 'إعادة فتح المناقشة',
    pinThread: 'تثبيت',
    unpinThread: 'إلغاء التثبيت',
    linkedCase: 'الحالة المرتبطة',
    follow: 'متابعة المناقشة',
    unfollow: 'متابَع',
    confirmCloseThread: 'إغلاق المناقشة أمام الردود الجديدة؟',
    confirmOpenThread: 'إعادة فتح المناقشة أمام الردود الجديدة؟',
    threadClosed: 'هذه المناقشة مغلقة أمام الردود الجديدة.',
    cancel: 'إلغاء',
  },
  de: {
    back: 'Zurück zu Diskussionen',
    replies: 'Antworten',
    replyPlaceholder: 'Antwort schreiben… Seien Sie respektvoll und evidenzbasiert.',
    submitReply: 'Antwort posten',
    posting: 'Posten…',
    noReplies: 'Noch keine Antworten. Seien Sie der erste.',
    solution: 'Akzeptierte Lösung',
    markSolution: 'Als Lösung markieren',
    unmarkSolution: 'Lösung entfernen',
    by: 'von',
    closeThread: 'Diskussion schließen',
    reopenThread: 'Diskussion wieder öffnen',
    pinThread: 'Anpinnen',
    unpinThread: 'Lösen',
    linkedCase: 'Verknüpfter Fall',
    follow: 'Diskussion folgen',
    unfollow: 'Folgt',
    confirmCloseThread: 'Diese Diskussion für neue Antworten schließen?',
    confirmOpenThread: 'Diese Diskussion wieder öffnen?',
    threadClosed: 'Diese Diskussion ist für neue Antworten geschlossen.',
    cancel: 'Abbrechen',
  },
} as const;

type Lang = keyof typeof I18N;

export interface ThreadViewProps {
  language: Lang;
  thread: CommunityThread;
  replies?: ThreadReply[];
  currentUserId: string;
  currentUserName: string;
  currentUserSpecialty?: string;
  currentUserDegree?: string;
  currentUserPhotoUrl?: string;
  currentUserPosition?: string;
  onClose: () => void;
  onAddReply: (threadId: string, body: string, parentReplyId?: string) => Promise<void>;
  onToggleLike: () => Promise<void>;
  onToggleFollow: () => Promise<void>;
  onMarkSolution: (threadId: string, replyId: string) => Promise<void>;
  onUpdateStatus: (status: ThreadStatus) => Promise<void>;
  onToggleReplyLike?: (replyId: string) => Promise<void>;
}

export const ThreadView: React.FC<ThreadViewProps> = ({
  language,
  thread,
  replies = [],
  currentUserId,
  currentUserName,
  currentUserSpecialty,
  currentUserDegree,
  currentUserPhotoUrl,
  currentUserPosition,
  onClose,
  onAddReply,
  onToggleLike,
  onToggleFollow,
  onMarkSolution,
  onUpdateStatus,
  onToggleReplyLike,
}) => {
  const t = I18N[language];
  const isRtl = language === 'ar';
  const [replyText, setReplyText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [parentReplyId, setParentReplyId] = useState<string | undefined>();

  const liked = thread.likedByUserIds?.includes(currentUserId) || false;
  const followed = thread.followers?.includes(currentUserId) || false;
  const isClosed = thread.status === 'closed';
  const isAuthor = thread.authorId === currentUserId;

  const sortedReplies = [...replies].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleSubmitReply = async () => {
    if (replyText.trim().length < 5) return;
    setIsPosting(true);
    try {
      await onAddReply(thread.id, replyText.trim(), parentReplyId);
      setReplyText('');
      setParentReplyId(undefined);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{
          background: 'white',
          borderRadius: '0.75rem',
          width: '100%',
          maxWidth: '880px',
          margin: '1.5rem 0',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            position: 'sticky',
            top: 0,
            background: 'white',
            zIndex: 2,
            borderRadius: '0.75rem 0.75rem 0 0',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#475569',
              padding: '0.375rem',
              borderRadius: '0.375rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <ArrowLeft size={20} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.back}</span>
          </button>
          <div style={{ flex: 1 }} />
          {isAuthor && (
            <>
              <button
                onClick={() =>
                  onUpdateStatus(thread.status === 'closed' ? 'open' : 'closed')
                }
                style={{
                  background: 'transparent',
                  border: '1px solid #cbd5e1',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.8rem',
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                {isClosed ? <Lock size={14} /> : <Lock size={14} />}
                {isClosed ? t.reopenThread : t.closeThread}
              </button>
            </>
          )}
          <button
            onClick={onToggleFollow}
            style={{
              background: followed ? '#ecfdf5' : 'transparent',
              border: `1px solid ${followed ? '#a7f3d0' : '#cbd5e1'}`,
              padding: '0.375rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.8rem',
              color: followed ? '#059669' : '#475569',
              cursor: 'pointer',
            }}
          >
            {followed ? t.unfollow : t.follow}
          </button>
        </div>

        {/* Thread body */}
        <div style={{ padding: '1.5rem' }}>
          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {thread.pinnedAt && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#d97706' }}>
                <Pin size={16} />
              </span>
            )}
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {thread.title}
            </h1>
          </div>

          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            {thread.authorPhotoUrl ? (
              <img
                src={thread.authorPhotoUrl}
                alt={thread.authorName}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#e0e7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={20} className="text-indigo-600" />
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
                {thread.authorName}
                {thread.authorDegree && (
                  <span style={{ color: '#64748b', fontWeight: 400, marginInlineStart: '0.25rem' }}>
                    {thread.authorDegree}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {thread.authorSpecialty} · {new Date(thread.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Linked case banner */}
          {thread.linkedCaseId && (
            <div
              style={{
                padding: '0.625rem 0.875rem',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: '#1d4ed8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={14} />
              {t.linkedCase}: {thread.linkedCaseReference} — {thread.linkedCaseTitle}
            </div>
          )}

          {/* Body */}
          <div
            style={{
              color: '#1e293b',
              fontSize: '0.95rem',
              lineHeight: 1.65,
              whiteSpace: 'pre-wrap',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              marginBottom: '1rem',
            }}
          >
            {thread.body}
          </div>

          {/* Tags */}
          {thread.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {thread.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    padding: '0.25rem 0.625rem',
                    background: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '0.25rem',
                    fontSize: '0.8rem',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Stats + like */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              padding: '0.75rem 0',
              borderTop: '1px solid #f1f5f9',
              borderBottom: '1px solid #f1f5f9',
              color: '#64748b',
              fontSize: '0.875rem',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <Eye size={14} /> {thread.viewsCount || 0}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <Reply size={14} /> {thread.repliesCount || 0} {t.replies}
            </span>
            <button
              onClick={onToggleLike}
              style={{
                background: liked ? '#fef2f2' : 'transparent',
                border: 'none',
                color: liked ? '#dc2626' : '#64748b',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.875rem',
              }}
            >
              <Heart size={14} fill={liked ? '#dc2626' : 'none'} />
              {thread.likesCount || 0}
            </button>
          </div>
        </div>

        {/* Replies */}
        <div style={{ padding: '0 1.5rem 1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>
            {t.replies} ({sortedReplies.length})
          </h3>

          {sortedReplies.length === 0 ? (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#94a3b8',
                border: '1px dashed #cbd5e1',
                borderRadius: '0.5rem',
              }}
            >
              <Reply size={32} style={{ margin: '0 auto 0.5rem', color: '#cbd5e1' }} />
              <p style={{ fontSize: '0.9rem' }}>{t.noReplies}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {sortedReplies.map(reply => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  language={language}
                  currentUserId={currentUserId}
                  isThreadAuthor={isAuthor}
                  onMarkSolution={() => onMarkSolution(thread.id, reply.id)}
                  isSolution={thread.acceptedReplyId === reply.id}
                  onToggleLike={onToggleReplyLike}
                  onReplyTo={() => {
                    setParentReplyId(reply.id);
                    setReplyText('');
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Reply input */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            borderRadius: '0 0 0.75rem 0.75rem',
            position: 'sticky',
            bottom: 0,
          }}
        >
          {isClosed ? (
            <div
              style={{
                padding: '0.75rem',
                textAlign: 'center',
                background: '#f1f5f9',
                borderRadius: '0.5rem',
                color: '#64748b',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <Lock size={14} />
              {t.threadClosed}
            </div>
          ) : (
            <>
              {parentReplyId && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#475569',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Reply size={12} />
                  Replying to a reply
                  <button
                    onClick={() => setParentReplyId(undefined)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#e0e7ff',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {currentUserPhotoUrl ? (
                    <img
                      src={currentUserPhotoUrl}
                      alt={currentUserName}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <User size={18} className="text-indigo-600" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={t.replyPlaceholder}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.625rem',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      outline: 'none',
                      lineHeight: 1.5,
                      background: 'white',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '0.5rem',
                    }}
                  >
                    <button
                      onClick={handleSubmitReply}
                      disabled={isPosting || replyText.trim().length < 5}
                      style={{
                        padding: '0.5rem 1rem',
                        background: isPosting || replyText.trim().length < 5 ? '#94a3b8' : '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: isPosting || replyText.trim().length < 5 ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                      }}
                    >
                      <Send size={14} />
                      {isPosting ? t.posting : t.submitReply}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ReplyItem
// ============================================================================

interface ReplyItemProps {
  reply: ThreadReply;
  language: Lang;
  currentUserId: string;
  isThreadAuthor: boolean;
  isSolution: boolean;
  onMarkSolution: () => void;
  onToggleLike?: (replyId: string) => Promise<void>;
  onReplyTo: () => void;
}

const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  language,
  currentUserId,
  isThreadAuthor,
  isSolution,
  onMarkSolution,
  onToggleLike,
  onReplyTo,
}) => {
  const t = I18N[language];
  const liked = reply.likedByUserIds?.includes(currentUserId) || false;
  const isOwn = reply.authorId === currentUserId;

  return (
    <div
      style={{
        padding: '1rem',
        background: isSolution ? '#f0fdf4' : 'white',
        border: `1px solid ${isSolution ? '#bbf7d0' : '#e2e8f0'}`,
        borderRadius: '0.5rem',
        borderInlineStart: isSolution ? '3px solid #16a34a' : undefined,
      }}
    >
      {/* Solution badge */}
      {isSolution && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.625rem',
            background: '#dcfce7',
            color: '#15803d',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          <CheckCircle2 size={14} />
          {t.solution}
        </div>
      )}

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
        {reply.authorPhotoUrl ? (
          <img
            src={reply.authorPhotoUrl}
            alt={reply.authorName}
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
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
            {reply.authorName}
            {reply.authorDegree && (
              <span style={{ color: '#64748b', fontWeight: 400, marginInlineStart: '0.25rem' }}>
                {reply.authorDegree}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={10} />
            {new Date(reply.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          color: '#1e293b',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          marginBottom: '0.75rem',
        }}
      >
        {reply.body}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
        {onToggleLike && (
          <button
            onClick={() => onToggleLike(reply.id)}
            style={{
              background: liked ? '#fef2f2' : 'transparent',
              border: 'none',
              color: liked ? '#dc2626' : '#64748b',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
            }}
          >
            <Heart size={12} fill={liked ? '#dc2626' : 'none'} />
            {reply.likesCount || 0}
          </button>
        )}

        <button
          onClick={onReplyTo}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.5rem',
          }}
        >
          <Reply size={12} />
          {language === 'ar' ? 'رد' : language === 'de' ? 'Antworten' : 'Reply'}
        </button>

        {(isThreadAuthor || isOwn) && !isSolution && (
          <button
            onClick={onMarkSolution}
            style={{
              background: 'transparent',
              border: '1px solid #cbd5e1',
              color: '#475569',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.8rem',
            }}
          >
            <CheckCircle2 size={12} />
            {t.markSolution}
          </button>
        )}
      </div>
    </div>
  );
};

export default ThreadView;
