import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Send,
  UserPlus,
  UserCheck,
  CheckCircle2,
  Clock,
  Building,
  ShieldCheck,
  X,
  Users,
  Activity,
  FileCheck2,
  FileText,
  Trash2,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { ClinicalCase, CaseComment, CaseLike } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { matchDoctorCase, normalizeSurgeonName } from '../lib/doctorUtils';
import { db, formatPublicationDateTime, getTimestampMs } from '../lib/firebase';

interface SurgicalCommunityPostProps {
  post: ClinicalCase;
  onEdit?: (c: ClinicalCase) => void;
  onDelete?: (id: string) => void;
  onSelectDoctor?: (doctorId: string) => void;
  isOwnerManagementView?: boolean; // Only true when inside "Your Posts"
  defaultShowComments?: boolean;
  isHighlighted?: boolean;
  onViewed?: (caseId: string) => void;
}

export const SurgicalCommunityPost: React.FC<SurgicalCommunityPostProps> = ({
  post,
  onEdit,
  onDelete,
  onSelectDoctor,
  isOwnerManagementView = false,
  defaultShowComments = false,
  isHighlighted = false,
  onViewed,
}) => {
  const { allDoctors, toggleLikeCase, addCommentToCase, deleteCommentFromCase, toggleFollowDoctor, deleteCaseAttachment } = useData();
  const { profile, user, language, myUids } = useAuth();
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';

  const articleRef = useRef<HTMLElement | null>(null);
  const [showComments, setShowComments] = useState(defaultShowComments);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showLikersModal, setShowLikersModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [interactionError, setInteractionError] = useState('');
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  const [attToDelete, setAttToDelete] = useState<{ id: string; title: string } | null>(null);
  const [subComments, setSubComments] = useState<CaseComment[]>([]);
  const [subLikes, setSubLikes] = useState<CaseLike[]>([]);

  useEffect(() => {
    if (defaultShowComments) setShowComments(true);
  }, [defaultShowComments]);

  // Lazy subcollection listeners: only stream /comments when thread is expanded and /likes when likers modal is open
  useEffect(() => {
    if (!post?.id || !showComments) return;
    const unsubComments = onSnapshot(
      collection(db, 'communityCases', post.id, 'comments'),
      (snap) => {
        const list = snap.docs.map(d => ({ ...(d.data() as CaseComment), id: d.id || (d.data() as any).id }));
        setSubComments(list);
      },
      (err) => {
        console.warn(`Comments subcollection listener (${post.id}):`, err.message);
      }
    );
    return () => unsubComments();
  }, [post?.id, showComments]);

  useEffect(() => {
    if (!post?.id || !showLikersModal) return;
    const unsubLikes = onSnapshot(
      collection(db, 'communityCases', post.id, 'likes'),
      (snap) => {
        const list = snap.docs.map(d => ({ ...(d.data() as CaseLike), userId: (d.data() as any).userId || d.id }));
        setSubLikes(list);
      },
      (err) => {
        console.warn(`Likes subcollection listener (${post.id}):`, err.message);
      }
    );
    return () => unsubLikes();
  }, [post?.id, showLikersModal]);

  // Mark post as viewed in Community ONLY when visibly scrolled into view (or opened/interacted with)
  useEffect(() => {
    if (!onViewed || !post?.id || !articleRef.current) return;
    if (typeof IntersectionObserver === 'undefined') {
      onViewed(post.id);
      return;
    }
    let timer: ReturnType<typeof setTimeout> | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          if (!timer) {
            timer = setTimeout(() => {
              onViewed(post.id);
            }, 500);
          }
        } else if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: [0.35] }
    );
    observer.observe(articleRef.current);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [onViewed, post?.id]);

  const userIds = myUids.length > 0 ? myUids : ([user?.uid, profile?.userId].filter(Boolean) as string[]);
  const userEmails = [user?.email?.toLowerCase().trim(), profile?.email?.toLowerCase().trim()].filter(Boolean) as string[];

  // Requirement 1: Show Edit and Delete icons only to the original post owner.
  // Followers and other users must NOT see these icons or have permission to modify others' posts.
  const isPostOwner = Boolean(
    (post.userId && userIds.includes(post.userId)) ||
    (post.authorEmail && userEmails.includes(post.authorEmail.toLowerCase().trim())) ||
    (post.authorName && profile?.fullName && normalizeSurgeonName(post.authorName) === normalizeSurgeonName(profile.fullName) && userEmails.length > 0)
  );
  const isAuthor = isPostOwner;
  const isSuperAdmin = profile?.role === 'super_admin';

  const isLiked = useMemo(() => {
    if (subLikes.some(l => userIds.includes(l.userId))) return true;
    return Boolean(userIds.some(id => (post.likedByUserIds || []).includes(id)));
  }, [subLikes, post.likedByUserIds, userIds]);

  const likedUsersList = useMemo(() => {
    const map = new Map<string, { userId: string; fullName: string; specialty?: string; photoUrl?: string }>();
    subLikes.forEach(l => {
      if (l.userId) {
        map.set(l.userId, {
          userId: l.userId,
          fullName: l.fullName,
          specialty: l.specialty,
          photoUrl: l.photoUrl,
        });
      }
    });
    (post.likedByUsers || []).forEach(u => {
      if (u.userId && !map.has(u.userId)) {
        map.set(u.userId, u);
      }
    });
    return Array.from(map.values());
  }, [subLikes, post.likedByUsers]);

  const likesCount = Math.max(likedUsersList.length, subLikes.length, post.likesCount || 0);

  const comments = useMemo(() => {
    const map = new Map<string, CaseComment>();
    subComments.forEach(c => {
      if (c?.id) map.set(c.id, c);
    });
    (post.comments || []).forEach(c => {
      if (c?.id && !map.has(c.id)) map.set(c.id, c);
    });
    return Array.from(map.values()).sort(
      (a, b) =>
        (getTimestampMs(a.createdAtServer) || getTimestampMs(a.createdAt)) -
        (getTimestampMs(b.createdAtServer) || getTimestampMs(b.createdAt))
    );
  }, [subComments, post.comments]);

  const commentsCount = Math.max(comments.length, post.commentsCount || 0);
  const publishedDateTimeStr = formatPublicationDateTime(
    post,
    language === 'ar' ? 'ar-EG' : language === 'de' ? 'de-DE' : 'en-GB'
  );

  const authorDoc = allDoctors.find(
    d => d.userId === post.userId || d.aliasIds?.includes(post.userId) || matchDoctorCase(post, d)
  );
  const authorAliases = Array.from(
    new Set([post.userId, ...(authorDoc?.aliasIds || [])].filter(Boolean))
  ) as string[];
  const isFollowingAuthor = (profile?.following || []).some(id => authorAliases.includes(id));
  const isRequestedAuthor =
    !isFollowingAuthor &&
    Boolean(authorDoc?.pendingFollowRequests?.some(id => userIds.includes(id)));

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setInteractionError('');
    if (onViewed) onViewed(post.id);
    try {
      await toggleLikeCase(post.id);
    } catch (err: any) {
      setInteractionError(err?.message || 'Unable to save like right now.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || submittingComment) return;
    setSubmittingComment(true);
    setInteractionError('');
    if (onViewed) onViewed(post.id);
    try {
      await addCommentToCase(post.id, commentInput);
      setCommentInput('');
    } catch (err: any) {
      setInteractionError(err?.message || 'Unable to post comment right now.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (deletingCommentId) return;
    setDeletingCommentId(commentId);
    setInteractionError('');
    try {
      await deleteCommentFromCase(post.id, commentId);
    } catch (err: any) {
      setInteractionError(err?.message || 'Unable to delete comment.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <article
      ref={articleRef}
      id={`community-case-${post.id}`}
      className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition-all duration-300 ${
        isHighlighted
          ? 'border-teal-500 ring-2 ring-teal-500/40 shadow-lg shadow-teal-900/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* 1. Author Bar */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/60">
        <div
          onClick={() => onSelectDoctor && onSelectDoctor(post.userId)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            {post.authorPhotoUrl ? (
              <img
                src={post.authorPhotoUrl}
                alt={post.authorName}
                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-teal-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-[#101C32] text-teal-300 font-bold text-xs flex items-center justify-center ring-2 ring-teal-500/30">
                {(post.authorName || 'Dr').substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition">
                {post.authorName || 'Specialist Surgeon'}
              </h4>
              <ShieldCheck size={13} className="text-teal-600" />
            </div>
            <p className="text-[11px] text-teal-800 font-medium">
              {post.authorSpecialty || post.specialty} • <span className="text-slate-400 font-normal">{post.authorHospital || post.hospital}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Follow author button (if not own post and not in owner management view) */}
          {!isAuthor && (
            <button
              onClick={() => toggleFollowDoctor(authorDoc?.userId || post.userId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isFollowingAuthor
                  ? 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 border border-slate-200'
                  : isRequestedAuthor
                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
              }`}
            >
              {isFollowingAuthor ? (
                <>
                  <UserCheck size={12} className="text-teal-700" />
                  <span>{isRTL ? 'تتابعه' : 'Following'}</span>
                </>
              ) : isRequestedAuthor ? (
                <>
                  <Clock size={12} className="text-amber-700" />
                  <span>{isRTL ? 'تم الطلب' : 'Requested'}</span>
                </>
              ) : (
                <>
                  <UserPlus size={12} />
                  <span>{isRTL ? 'متابعة' : 'Follow'}</span>
                </>
              )}
            </button>
          )}

          {/* Requirement 1: Original Post Owner Actions ONLY (Followers and others never see or access these) */}
          {isPostOwner && (
            <div className="flex items-center gap-1.5">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(post)}
                  className="px-2.5 py-1 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded-lg border border-teal-200 transition cursor-pointer"
                  title={isRTL ? 'تعديل الحالة' : 'Edit Case'}
                >
                  {isRTL ? 'تعديل' : 'Edit'}
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeletePostModal(true)}
                  className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition cursor-pointer flex items-center gap-1"
                  title={isRTL ? 'حذف المنشور نهائياً' : 'Delete Case Permanently'}
                >
                  <Trash2 size={12} />
                  <span>{isRTL ? 'حذف' : 'Delete'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Public Case Header Banner - Clean, Professional Dark Navy Banner (NO Edit, Delete, or PDF buttons as requested) */}
      <div className="bg-[#101C32] text-white p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          {/* Reference Badge */}
          <div className="shrink-0 bg-teal-900/60 border border-teal-400/30 text-teal-300 font-mono text-xs font-bold px-3 py-2 rounded-xl flex flex-col items-center justify-center text-center shadow-xs">
            <span className="text-[9px] text-teal-400 tracking-wider">REF</span>
            <span className="text-xs font-bold tracking-tight">{post.caseReference}</span>
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
              {post.primaryDiagnosis}
            </h3>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
              <span>{post.hospital}</span>
              <span>•</span>
              <span className="font-mono text-teal-300">{post.presentationDate}</span>
              {publishedDateTimeStr && (
                <>
                  <span>•</span>
                  <span className="text-[11px] text-slate-300 inline-flex items-center gap-1" title={isRTL ? 'تاريخ ووقت النشر' : 'Published date & time'}>
                    <Clock size={11} className="text-teal-300" />
                    <span>{isRTL ? `نُشر ${publishedDateTimeStr}` : `Published ${publishedDateTimeStr}`}</span>
                  </span>
                </>
              )}
              {post.specialty && (
                <>
                  <span>•</span>
                  <span className="text-[10px] bg-teal-900/50 text-teal-300 px-2 py-0.5 rounded-md border border-teal-500/30">
                    {post.specialty}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Compact Single-Page Professional Layout (Concise, high-density, no sprawling 3 pages) */}
      <div className="p-4 sm:p-5 space-y-3.5 text-xs text-slate-700 bg-[#FBFDFE]">
        {/* Top Split Grid: Presentation & Investigations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Left: Presentation, Complaint & Clinical History */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="font-bold text-teal-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={13} className="text-teal-600" />
                1. Presentation & Clinical History
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {post.patientAge}y • {post.patientSex || 'Undisclosed'}
              </span>
            </div>

            <div className="space-y-1.5 leading-relaxed">
              <p>
                <strong className="text-slate-900">Chief Complaint:</strong> {post.chiefComplaint}
                {post.durationOfSymptoms && <span className="text-slate-400 font-mono"> ({post.durationOfSymptoms})</span>}
              </p>
              {post.historyOfPresentIllness && (
                <p className="text-slate-600 line-clamp-3" title={post.historyOfPresentIllness}>
                  <strong className="text-slate-900">HPI:</strong> {post.historyOfPresentIllness}
                </p>
              )}
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 grid grid-cols-2 gap-2">
                <div>
                  <strong className="text-slate-800">Medical:</strong> {post.relevantMedicalHistory || 'Nil'}
                </div>
                <div>
                  <strong className="text-slate-800">Surgical:</strong> {post.surgicalHistory || 'Nil'}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Investigations & Exam Findings */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="font-bold text-teal-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 size={13} className="text-teal-600" />
                2. Key Investigations & Exam
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {post.investigations?.length || 0} tests
              </span>
            </div>

            {post.investigations && post.investigations.length > 0 ? (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {post.investigations.slice(0, 3).map((inv, idx) => (
                  <div key={idx} className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-[11px]">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{inv.name}</strong>
                      <span className="text-[10px] text-teal-700 font-mono">{inv.category}</span>
                    </div>
                    <p className="text-slate-600 mt-0.5 line-clamp-1">{inv.result}</p>
                  </div>
                ))}
              </div>
            ) : post.examination?.local ? (
              <p className="text-slate-600 leading-relaxed text-[11px]">
                <strong className="text-slate-900">Local Exam:</strong> {post.examination.local}
              </p>
            ) : (
              <p className="text-slate-400 italic text-[11px]">No formal investigations recorded.</p>
            )}
          </div>
        </div>

        {/* Bottom Card: Operative Record & Clinical Outcome */}
        {post.surgicalProcedure ? (
          <div className="bg-teal-50/50 p-3.5 rounded-2xl border border-teal-200/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-teal-200/60">
              <span className="font-bold text-teal-950 text-[11px] uppercase tracking-wider">
                3. Operative Record & Surgical Procedure
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-900 font-bold px-2 py-0.5 rounded-full border border-teal-300">
                {post.surgicalProcedure.participationRole}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div>
                <strong className="text-teal-950">Procedure:</strong>
                <p className="text-slate-800 font-semibold">{post.surgicalProcedure.procedureName}</p>
              </div>
              <div>
                <strong className="text-teal-950">Date & Anesthesia:</strong>
                <p className="text-slate-700">{post.surgicalProcedure.procedureDate} ({post.surgicalProcedure.anaesthesiaType || 'GETA'})</p>
              </div>
              <div>
                <strong className="text-teal-950">Outcome / Follow-up:</strong>
                <p className="text-slate-700 truncate">{post.followUp?.clinicalProgress || post.surgicalProcedure.outcome || 'Uneventful'}</p>
              </div>
            </div>

            {post.surgicalProcedure.procedureSummary && (
              <div className="pt-1.5 border-t border-teal-200/40 text-[11px] text-slate-700">
                <strong className="text-teal-950">Operative Summary: </strong>
                <span className="text-slate-600">{post.surgicalProcedure.procedureSummary}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-600">
            <strong className="text-slate-900">Clinical Management:</strong> {post.management?.initial || 'Conservative medical therapy'}
          </div>
        )}

        {/* Expandable Full Case Details Reader Toggle for Followers */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              if (!showFullDetails && onViewed) onViewed(post.id);
              setShowFullDetails(prev => !prev);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <BookOpen size={13} className="text-teal-700" />
            <span>
              {showFullDetails
                ? (isRTL ? 'إخفاء التفاصيل السريرية الكاملة' : 'Hide Full Clinical Case Details')
                : (isRTL ? 'قراءة تفاصيل الحالة الكاملة' : 'Read Full Clinical Case Details')}
            </span>
            {showFullDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showFullDetails && (
            <div className="mt-3 p-4 bg-white rounded-2xl border border-teal-200/80 space-y-4 text-[11px] text-slate-700 animate-fadeIn">
              {/* Complete History */}
              <div className="space-y-1.5">
                <h5 className="font-bold text-teal-900 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1">
                  {isRTL ? 'التاريخ المرضي الكامل' : 'Complete Clinical History'}
                </h5>
                {post.historyOfPresentIllness && (
                  <p className="leading-relaxed whitespace-pre-line">
                    <strong className="text-slate-900">HPI:</strong> {post.historyOfPresentIllness}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {post.drugHistory && <p><strong className="text-slate-900">Medications:</strong> {post.drugHistory}</p>}
                  {post.allergies && <p><strong className="text-slate-900">Allergies:</strong> {post.allergies}</p>}
                  {post.familyHistory && <p><strong className="text-slate-900">Family History:</strong> {post.familyHistory}</p>}
                  {post.socialHistory && <p><strong className="text-slate-900">Social History:</strong> {post.socialHistory}</p>}
                </div>
              </div>

              {/* Complete Physical Examination */}
              {post.examination && Object.values(post.examination).some(Boolean) && (
                <div className="space-y-1.5">
                  <h5 className="font-bold text-teal-900 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1">
                    {isRTL ? 'الفحص السريري المفصل' : 'Detailed Physical Examination'}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {post.examination.general && <p><strong className="text-slate-900">General:</strong> {post.examination.general}</p>}
                    {post.examination.vitals && <p><strong className="text-slate-900">Vitals:</strong> {post.examination.vitals}</p>}
                    {post.examination.cardiovascular && <p><strong className="text-slate-900">CVS:</strong> {post.examination.cardiovascular}</p>}
                    {post.examination.respiratory && <p><strong className="text-slate-900">Respiratory:</strong> {post.examination.respiratory}</p>}
                    {post.examination.abdominal && <p><strong className="text-slate-900">Abdominal:</strong> {post.examination.abdominal}</p>}
                    {post.examination.neurological && <p><strong className="text-slate-900">Neurological:</strong> {post.examination.neurological}</p>}
                    {post.examination.local && <p><strong className="text-slate-900">Local Exam:</strong> {post.examination.local}</p>}
                    {post.examination.other && <p><strong className="text-slate-900">Other:</strong> {post.examination.other}</p>}
                  </div>
                </div>
              )}

              {/* All Investigations */}
              {post.investigations && post.investigations.length > 0 && (
                <div className="space-y-1.5">
                  <h5 className="font-bold text-teal-900 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1">
                    {isRTL ? `كافة الفحوصات والاستقصاءات (${post.investigations.length})` : `All Investigations (${post.investigations.length})`}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {post.investigations.map((inv, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-slate-900">{inv.name}</strong>
                          <span className="text-[10px] font-mono text-teal-700">{inv.date || inv.category}</span>
                        </div>
                        <p className="text-slate-700">{inv.result}</p>
                        {inv.summary && <p className="text-slate-500 text-[10px]">{inv.summary}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assessment, Differential, Management & Operative Findings */}
              <div className="space-y-1.5">
                <h5 className="font-bold text-teal-900 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1">
                  {isRTL ? 'التشخيص التفريقي والخطة العلاجية والعملية' : 'Assessment, Management & Operative Details'}
                </h5>
                <div className="space-y-1 leading-relaxed">
                  {post.icd10Code && <p><strong className="text-slate-900">ICD-10:</strong> <span className="font-mono">{post.icd10Code}</span></p>}
                  {post.secondaryDiagnoses && <p><strong className="text-slate-900">Secondary Diagnoses:</strong> {post.secondaryDiagnoses}</p>}
                  {post.differentialDiagnosis && <p><strong className="text-slate-900">Differential Diagnosis:</strong> {post.differentialDiagnosis}</p>}
                  {post.clinicalAssessment && <p><strong className="text-slate-900">Clinical Assessment:</strong> {post.clinicalAssessment}</p>}
                  {post.management?.initial && <p><strong className="text-slate-900">Initial Management:</strong> {post.management.initial}</p>}
                  {post.management?.medical && <p><strong className="text-slate-900">Medical Therapy:</strong> {post.management.medical}</p>}
                  {post.management?.surgical && <p><strong className="text-slate-900">Surgical Plan:</strong> {post.management.surgical}</p>}
                  {post.management?.treatmentPlan && <p><strong className="text-slate-900">Treatment Plan:</strong> {post.management.treatmentPlan}</p>}
                  {post.management?.complications && <p><strong className="text-slate-900">Complications:</strong> {post.management.complications}</p>}
                  {post.surgicalProcedure?.indication && <p><strong className="text-slate-900">Operative Indication:</strong> {post.surgicalProcedure.indication}</p>}
                  {post.surgicalProcedure?.surgicalApproach && <p><strong className="text-slate-900">Surgical Approach:</strong> {post.surgicalProcedure.surgicalApproach}</p>}
                  {post.surgicalProcedure?.operativeFindings && <p><strong className="text-slate-900">Operative Findings:</strong> {post.surgicalProcedure.operativeFindings}</p>}
                  {post.followUp && (post.followUp.followUpDate || post.followUp.woundStatus || post.followUp.clinicalProgress) && (
                    <p>
                      <strong className="text-slate-900">Follow-up:</strong>{' '}
                      {[post.followUp.followUpDate, post.followUp.woundStatus, post.followUp.clinicalProgress].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Attached Educational Files & Clinical Media */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="pt-2 border-t border-slate-200/60 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-900">
              <span className="flex items-center gap-1.5">
                <FileText size={13} className="text-teal-600" />
                {isRTL ? 'الملفات المرفوعة والمرفقات الطبية' : 'Attached Educational Files'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {post.attachments.length} {isRTL ? 'ملف' : 'files'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {post.attachments.map((att, idx) => (
                <div key={att.id || idx} className="relative rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs flex flex-col justify-between">
                  <div>
                    {att.url && (att.url.startsWith('data:image') || att.url.startsWith('http')) ? (
                      <img src={att.url} alt={att.title} className="w-full h-28 object-cover bg-slate-100" />
                    ) : (
                      <div className="w-full h-28 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center">
                        <FileText size={28} className="text-teal-600 mb-1" />
                        <span className="text-[10px] text-slate-500 font-mono truncate max-w-full px-2">{att.title}</span>
                      </div>
                    )}
                    <div className="p-2.5">
                      <p className="font-bold text-xs text-slate-800 truncate" title={att.title}>{att.title}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-teal-700 mt-0.5">
                        <CheckCircle2 size={10} /> {isRTL ? 'موافقة تعليمية' : 'Consent Verified'}
                      </span>
                    </div>
                  </div>

                  {isPostOwner && (
                    <div className="p-2 pt-0 flex justify-end border-t border-slate-100 bg-slate-50">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAttToDelete({ id: att.id, title: att.title });
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                        title={isRTL ? 'حذف الملف نهائياً' : 'Delete file'}
                      >
                        <Trash2 size={12} />
                        <span>{isRTL ? 'حذف الملف' : 'Delete File'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Social Interactions Bar */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Like Heart Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isLiked
                ? 'bg-rose-50 text-rose-600 border border-rose-200 scale-105'
                : 'bg-white text-slate-600 hover:text-rose-600 border border-slate-200'
            }`}
          >
            <Heart size={15} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
            <span>{likesCount}</span>
          </button>

          {/* Likers Trigger */}
          {likesCount > 0 && (
            <button
              onClick={() => setShowLikersModal(true)}
              className="text-[11px] text-slate-500 hover:text-teal-700 transition cursor-pointer hidden sm:inline"
            >
              {likedUsersList.length > 0
                ? `${isRTL ? 'أعجب به' : 'Liked by'} ${likedUsersList[0].fullName}${likesCount > 1 ? ` +${likesCount - 1}` : ''}`
                : `${likesCount} ${isRTL ? 'إعجاب' : 'likes'}`}
            </button>
          )}

          {/* Comment Toggle */}
          <button
            onClick={() => {
              if (!showComments && onViewed) onViewed(post.id);
              setShowComments(!showComments);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
          >
            <MessageSquare size={14} className="text-teal-600" />
            <span>{commentsCount} {isRTL ? 'تعليق' : 'Comments'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
          {interactionError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between gap-2">
              <span>{interactionError}</span>
              <button type="button" onClick={() => setInteractionError('')} className="text-red-500 hover:text-red-700 cursor-pointer">
                <X size={13} />
              </button>
            </div>
          )}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              disabled={submittingComment}
              placeholder={isRTL ? 'أضف تعليقاً أو استفساراً جراحياً...' : 'Add a surgical comment or clinical feedback...'}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!commentInput.trim() || submittingComment}
              className="bg-[#0D9488] hover:bg-teal-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Send size={13} />
              <span>{submittingComment ? '...' : isRTL ? 'إرسال' : 'Post'}</span>
            </button>
          </form>

          {comments.length > 0 && (
            <div className="space-y-2 pt-2">
              {comments.map((cmt) => {
                const isCommentAuthor = Boolean(cmt.userId && userIds.includes(cmt.userId));
                const cmtMs = getTimestampMs(cmt.createdAtServer) || getTimestampMs(cmt.createdAt);
                const cmtTimeLabel = cmtMs
                  ? new Date(cmtMs).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-GB', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';
                return (
                  <div key={cmt.id} className="bg-white p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900">{cmt.userName}</span>
                        {cmt.userSpecialty && (
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                            {cmt.userSpecialty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {cmtTimeLabel}
                        </span>
                        {(isCommentAuthor || isSuperAdmin) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(cmt.id)}
                            disabled={deletingCommentId === cmt.id}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-50"
                            title={isRTL ? 'حذف التعليق' : 'Delete comment'}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{cmt.commentText}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Likers Modal */}
      {showLikersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-rose-500 fill-rose-500" />
                <h3 className="font-bold text-xs text-slate-900">
                  {isRTL ? 'الأطباء المعجبون بهذه الحالة' : 'Colleagues who liked this case'}
                </h3>
              </div>
              <button
                onClick={() => setShowLikersModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {likedUsersList.map((u, i) => (
                <div key={u.userId || i} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {(u.fullName || 'Dr').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{u.fullName}</h5>
                    <p className="text-[10px] text-slate-500">{u.specialty || 'Surgeon'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* In-App Post Deletion Confirmation Modal */}
      {showDeletePostModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isRTL ? 'تأكيد حذف المنشور الجراحي' : 'Delete Published Case'}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {isRTL
                  ? `هل أنت متأكد من حذف الحالة "${post.caseReference}" نهائياً من محفظتك ومجتمع الجراحين؟`
                  : `Are you sure you want to permanently delete case ${post.caseReference} from your portfolio and the surgical community?`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeletePostModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDelete) onDelete(post.id);
                  setShowDeletePostModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{isRTL ? 'تأكيد الحذف' : 'Delete Case'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Case Attachment Deletion Confirmation Modal */}
      {attToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isRTL ? 'تأكيد حذف الملف' : 'Delete File'}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {isRTL
                  ? `هل أنت متأكد من حذف الملف "${attToDelete.title}" نهائياً؟`
                  : `Are you sure you want to permanently delete "${attToDelete.title}"?`}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAttToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteCaseAttachment(post.id, attToDelete.id);
                  setAttToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{isRTL ? 'تأكيد الحذف' : 'Delete File'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
