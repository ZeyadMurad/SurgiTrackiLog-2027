import React, { useState } from 'react';
import {
  X,
  UserPlus,
  UserCheck,
  Award,
  Building,
  BookOpen,
  Lock,
  ChevronRight,
  ChevronLeft,
  Users,
  Heart,
  MessageSquare,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ClinicalCase } from '../types';
import { translations } from '../lib/i18n';
import { matchDoctorCase, normalizeSurgeonName } from '../lib/doctorUtils';

interface DoctorProfileModalProps {
  doctor: {
    userId: string;
    fullName: string;
    academicDegree?: string;
    academicTitle?: string;
    specialty: string;
    hospital: string;
    profilePhotoUrl?: string;
    biography?: string;
    followers?: string[];
    following?: string[];
    pendingFollowRequests?: string[];
    followersCount: number;
    followingCount: number;
    showProgressStats?: boolean;
    showPortfolioToFollowers?: boolean;
    requireApprovalToFollow?: boolean;
    totalHours?: number;
    totalProcedures?: number;
    verifiedHours?: number;
    verifiedProcedures?: number;
    publishedCasesCount?: number;
    email?: string;
    aliasIds?: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCaseDetail?: (c: ClinicalCase) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor: initialDoctor,
  isOpen,
  onClose,
  onOpenCaseDetail,
}) => {
  const { profile, user, language, myUids } = useAuth();
  const { communityCases, allDoctors, toggleFollowDoctor, stats } = useData();
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';

  const [currentDoctor, setCurrentDoctor] = useState<any>(initialDoctor);
  const [activeTab, setActiveTab] = useState<'profile' | 'followers' | 'following' | 'cases'>('profile');

  // Keep state in sync when parent passes a new doctor
  React.useEffect(() => {
    setCurrentDoctor(initialDoctor);
    setActiveTab('profile');
  }, [initialDoctor]);

  if (!isOpen || !currentDoctor) return null;

  // Find live updated doctor from allDoctors if available
  const liveDoctor = allDoctors.find(d =>
    d.userId === currentDoctor.userId ||
    (d.aliasIds && (d.aliasIds.includes(currentDoctor.userId) || (currentDoctor.aliasIds && currentDoctor.aliasIds.some((a: string) => d.aliasIds?.includes(a))))) ||
    (d.email && currentDoctor.email && d.email.toLowerCase() === currentDoctor.email.toLowerCase()) ||
    normalizeSurgeonName(d.fullName) === normalizeSurgeonName(currentDoctor.fullName)
  ) || currentDoctor;

  const currentUids = myUids.length > 0 ? myUids : ([profile?.userId, user?.uid].filter(Boolean) as string[]);
  const currentEmails = [profile?.email?.toLowerCase(), user?.email?.toLowerCase()].filter(Boolean) as string[];

  const isSelf = Boolean(
    (liveDoctor.userId && currentUids.includes(liveDoctor.userId)) ||
    (liveDoctor.aliasIds && liveDoctor.aliasIds.some((id: string) => currentUids.includes(id))) ||
    (liveDoctor.email && currentEmails.includes(liveDoctor.email.toLowerCase())) ||
    (profile?.fullName && normalizeSurgeonName(profile.fullName) === normalizeSurgeonName(liveDoctor.fullName))
  );

  const doctorAliases = Array.from(
    new Set([liveDoctor.userId, ...(liveDoctor.aliasIds || [])].filter(Boolean))
  ) as string[];

  const isFollowing = (profile?.following || []).some(id => doctorAliases.includes(id));
  const isRequested =
    !isFollowing &&
    Boolean(liveDoctor.pendingFollowRequests?.some((id: string) => currentUids.includes(id)));

  const doctorCases = communityCases.filter(c => matchDoctorCase(c, liveDoctor));
  const displayedCasesCount = Math.max(doctorCases.length, Number(liveDoctor.publishedCasesCount) || 0);
  const rawVerifiedHours = isSelf ? stats.verifiedHours : Number(liveDoctor.verifiedHours || 0);
  const rawTotalHours = isSelf ? stats.totalHours : Number(liveDoctor.totalHours || 0);
  const displayedHours = rawVerifiedHours > 0 ? rawVerifiedHours : rawTotalHours;
  const rawVerifiedOps = isSelf ? stats.verifiedProcedures : Number(liveDoctor.verifiedProcedures || 0);
  const rawTotalOps = isSelf ? stats.totalProcedures : Number(liveDoctor.totalProcedures || 0);
  const displayedProcedures = rawVerifiedOps > 0 ? rawVerifiedOps : rawTotalOps;

  const followersList: string[] = liveDoctor.followers || [];
  const followingList: string[] = liveDoctor.following || [];

  const handleFollowClick = async () => {
    if (isSelf) return;
    await toggleFollowDoctor(liveDoctor.userId);
  };

  const switchToDoctor = (doc: any) => {
    setCurrentDoctor(doc);
    setActiveTab('profile');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto animate-fadeIn flex flex-col max-h-[92vh]">
        {/* Header Cover & Close / Back */}
        <div className="h-24 bg-gradient-to-r from-[#101C32] via-[#0E4646] to-[#0D9488] relative flex items-start justify-between p-4 shrink-0">
          {activeTab !== 'profile' ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition cursor-pointer text-xs font-semibold"
            >
              {isRTL ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
              <span>{isRTL ? 'العودة للملف' : 'Back to Profile'}</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-xs transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Avatar & Identity Bar (Name/Specialty sit cleanly on white background) */}
        <div className="px-6 bg-white pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-end justify-between gap-4 -mt-10">
            <div className="relative z-10">
              {liveDoctor.profilePhotoUrl ? (
                <img
                  src={liveDoctor.profilePhotoUrl}
                  alt={liveDoctor.fullName}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md bg-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-teal-800 text-white font-bold text-2xl flex items-center justify-center ring-4 ring-white shadow-md">
                  {liveDoctor.fullName.substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {!isSelf && (
              <div className="shrink-0 pt-12">
                <button
                  onClick={handleFollowClick}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                    isFollowing
                      ? 'bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 border border-slate-300'
                      : isRequested
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-[#0D9488] hover:bg-teal-700 text-white shadow-teal-900/10'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={14} className="text-teal-700" />
                      <span>{isRTL ? 'تتابعه (إلغاء)' : 'Following'}</span>
                    </>
                  ) : isRequested ? (
                    <>
                      <Clock size={14} className="text-amber-700" />
                      <span>{isRTL ? 'تم الطلب' : 'Requested'}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} />
                      <span>{isRTL ? 'متابعة الطبيب' : 'Follow Surgeon'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-slate-900 text-base">
                {liveDoctor.academicTitle ? `${liveDoctor.academicTitle} ` : ''}
                {liveDoctor.fullName}
              </h3>
              {liveDoctor.academicDegree && (
                <span className="text-[10px] bg-slate-100 font-mono text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                  {liveDoctor.academicDegree}
                </span>
              )}
            </div>
            <p className="text-xs text-teal-800 font-semibold mt-0.5">{liveDoctor.specialty}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <Building size={11} /> {liveDoctor.hospital}
            </p>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 bg-[#FBFDFE] flex-1">
          {/* TAB 1: MAIN PROFILE VIEW */}
          {activeTab === 'profile' && (
            <>
              {/* Colleague Bio */}
              {liveDoctor.biography && (
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                    {isRTL ? 'نبذة عن الجراح' : 'About Surgeon'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{liveDoctor.biography}</p>
                </div>
              )}

              {/* Requirement: Followers, Following, and Cases Shared cards are CLICKABLE! */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                {/* Followers Card */}
                <button
                  type="button"
                  onClick={() => setActiveTab('followers')}
                  className="bg-white hover:bg-teal-50/50 p-3 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-2xs transition-all text-center group cursor-pointer"
                >
                  <span className="text-base font-bold text-slate-900 font-mono group-hover:text-teal-700 block">
                    {liveDoctor.followersCount || followersList.length}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                    {isRTL ? 'المتابعون' : 'Followers'}
                  </span>
                  <span className="text-[9px] text-teal-600 group-hover:underline block mt-1 font-medium">
                    {isRTL ? 'عرض القائمة ←' : 'View list →'}
                  </span>
                </button>

                {/* Following Card */}
                <button
                  type="button"
                  onClick={() => setActiveTab('following')}
                  className="bg-white hover:bg-teal-50/50 p-3 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-2xs transition-all text-center group cursor-pointer"
                >
                  <span className="text-base font-bold text-slate-900 font-mono group-hover:text-teal-700 block">
                    {liveDoctor.followingCount || followingList.length}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                    {isRTL ? 'يتابع' : 'Following'}
                  </span>
                  <span className="text-[9px] text-teal-600 group-hover:underline block mt-1 font-medium">
                    {isRTL ? 'عرض القائمة ←' : 'View list →'}
                  </span>
                </button>

                {/* Cases Shared Card */}
                <button
                  type="button"
                  onClick={() => setActiveTab('cases')}
                  className="bg-white hover:bg-teal-50/50 p-3 rounded-2xl border border-slate-200 hover:border-teal-400 shadow-2xs transition-all text-center group cursor-pointer"
                >
                  <span className="text-base font-bold text-teal-800 font-mono block">
                    {displayedCasesCount}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                    {isRTL ? 'حالات منشورة' : 'Cases Shared'}
                  </span>
                  <span className="text-[9px] text-teal-600 group-hover:underline block mt-1 font-medium">
                    {isRTL ? 'عرض الحالات ←' : 'All cases →'}
                  </span>
                </button>
              </div>

              {/* Privacy Controlled Section: Training Progress Stats */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Award size={14} className="text-teal-600" />
                    {isRTL ? 'سجل التدريب والعمليات المعتمد' : 'Verified Surgical Training Metrics'}
                  </h4>
                  {liveDoctor.showProgressStats === false && (
                    <span className="flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                      <Lock size={10} /> {isRTL ? 'إحصائيات خاصة' : 'Private'}
                    </span>
                  )}
                </div>

                {liveDoctor.showProgressStats !== false ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                      <span className="text-[10px] font-semibold text-teal-900 uppercase block">
                        {isRTL ? 'ساعات التدريب السريري' : 'Documented Training Hours'}
                      </span>
                      <span className="text-base font-bold text-teal-950 font-mono">
                        {displayedHours} hrs
                      </span>
                      {rawVerifiedHours === 0 && displayedHours > 0 && (
                        <span className="block text-[9px] text-teal-700 mt-0.5">
                          {isRTL ? 'إجمالي مسجل (بانتظار الاعتماد)' : 'Logged hours (pending review)'}
                        </span>
                      )}
                    </div>
                    <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100">
                      <span className="text-[10px] font-semibold text-teal-900 uppercase block">
                        {isRTL ? 'العمليات الجراحية الموثقة' : 'Surgical Procedures'}
                      </span>
                      <span className="text-base font-bold text-teal-950 font-mono">
                        {displayedProcedures} ops
                      </span>
                      {rawVerifiedOps === 0 && displayedProcedures > 0 && (
                        <span className="block text-[9px] text-teal-700 mt-0.5">
                          {isRTL ? 'إجمالي العمليات المسجلة' : 'Documented procedures'}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-1">
                    <Lock size={16} className="mx-auto text-slate-400" />
                    <p className="text-xs text-slate-600 font-medium">
                      {isRTL
                        ? 'فضل هذا الجراح إبقاء تفاصيل ساعاته التدريبية خاصة.'
                        : 'This surgeon has set their training hours & matrix to private.'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {isRTL
                        ? 'الحالات السريرية المنشورة في المجتمع فقط هي المتاحة.'
                        : 'Only publicly shared clinical cases are viewable.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Recent Published Clinical Cases Preview */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <BookOpen size={14} className="text-teal-600" />
                    {isRTL ? 'الحالات السريرية المنشورة' : 'Clinical Cases Shared by Surgeon'} (
                    {doctorCases.length})
                  </h4>
                  {doctorCases.length > 2 && (
                    <button
                      onClick={() => setActiveTab('cases')}
                      className="text-[11px] text-teal-700 font-bold hover:underline cursor-pointer"
                    >
                      {isRTL ? 'عرض الكل' : 'View All'}
                    </button>
                  )}
                </div>

                {doctorCases.length > 0 ? (
                  <div className="space-y-2">
                    {doctorCases.slice(0, 3).map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          if (onOpenCaseDetail) onOpenCaseDetail(c);
                        }}
                        className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/20 transition cursor-pointer flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold bg-slate-900 text-teal-300 px-1.5 py-0.5 rounded">
                              {c.caseReference}
                            </span>
                            <span className="text-[11px] text-slate-500">{c.presentationDate}</span>
                          </div>
                          <h5 className="font-semibold text-slate-900 text-xs mt-1 line-clamp-1">
                            {c.primaryDiagnosis}
                          </h5>
                          <p className="text-[10px] text-slate-500 line-clamp-1">
                            {c.surgicalProcedure?.procedureName || c.chiefComplaint}
                          </p>
                        </div>
                        <ChevronRight size={14} className="text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-2 text-center">
                    {isRTL ? 'لم ينشر هذا الجراح أي حالات سريرية بعد.' : 'No clinical cases published yet.'}
                  </p>
                )}
              </div>
            </>
          )}

          {/* TAB 2: FOLLOWERS LIST VIEW */}
          {activeTab === 'followers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Users size={15} className="text-teal-600" />
                  <span>
                    {isRTL
                      ? `المتابعون لـ ${liveDoctor.fullName}`
                      : `Surgeons Following Dr. ${liveDoctor.fullName}`}
                  </span>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                    {followersList.length}
                  </span>
                </h4>
              </div>

              {followersList.length > 0 ? (
                <div className="space-y-2">
                  {followersList.map(followerId => {
                    const followerDoc = allDoctors.find(
                      d => d.userId === followerId || d.aliasIds?.includes(followerId)
                    );
                    const fAliases = [followerId, ...(followerDoc?.aliasIds || [])];
                    const isFollowingThisFollower = (profile?.following || []).some(id => fAliases.includes(id));
                    const isRequestedFollower =
                      !isFollowingThisFollower &&
                      Boolean(followerDoc?.pendingFollowRequests?.some(id => currentUids.includes(id)));
                    const isSelfFollower = currentUids.some(id => fAliases.includes(id));

                    return (
                      <div
                        key={followerId}
                        className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-teal-300 flex items-center justify-between gap-3 transition"
                      >
                        <div
                          onClick={() => followerDoc && switchToDoctor(followerDoc)}
                          className="flex items-center gap-3 cursor-pointer group flex-1"
                        >
                          {followerDoc?.profilePhotoUrl ? (
                            <img
                              src={followerDoc.profilePhotoUrl}
                              alt={followerDoc.fullName}
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-teal-500/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-300 font-bold text-xs flex items-center justify-center">
                              {(followerDoc?.fullName || 'DR').substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs group-hover:text-teal-700 transition line-clamp-1">
                              {followerDoc?.fullName || `Colleague (${followerId.substring(0, 8)})`}
                            </h5>
                            <p className="text-[10px] text-teal-800 font-medium">
                              {followerDoc?.specialty || 'Surgeon'} • {followerDoc?.hospital || 'Hospital'}
                            </p>
                          </div>
                        </div>

                        {!isSelfFollower && (
                          <button
                            onClick={async () => {
                              await toggleFollowDoctor(followerDoc?.userId || followerId);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 ${
                              isFollowingThisFollower
                                ? 'bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 border border-slate-200'
                                : isRequestedFollower
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs'
                            }`}
                          >
                            {isFollowingThisFollower
                              ? (isRTL ? 'تتابعه' : 'Following')
                              : isRequestedFollower
                                ? (isRTL ? 'تم الطلب' : 'Requested')
                                : (isRTL ? 'متابعة' : 'Follow')}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center space-y-1">
                  <Users size={20} className="mx-auto text-slate-400" />
                  <p className="text-xs text-slate-500 font-medium">
                    {isRTL ? 'لا يوجد متابعون لهذا الجراح بعد.' : 'No followers yet.'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {isRTL ? 'كن أول من يتابع هذا الجراح لتصلك منشوراته!' : 'Be the first to follow this surgeon!'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FOLLOWING LIST VIEW */}
          {activeTab === 'following' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Users size={15} className="text-teal-600" />
                  <span>
                    {isRTL
                      ? `الجراحون الذين يتابعهم ${liveDoctor.fullName}`
                      : `Surgeons Followed by Dr. ${liveDoctor.fullName}`}
                  </span>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                    {followingList.length}
                  </span>
                </h4>
              </div>

              {followingList.length > 0 ? (
                <div className="space-y-2">
                  {followingList.map(followedId => {
                    const followedDoc = allDoctors.find(
                      d => d.userId === followedId || d.aliasIds?.includes(followedId)
                    );
                    const fAliases = [followedId, ...(followedDoc?.aliasIds || [])];
                    const isFollowingThisSurgeon = (profile?.following || []).some(id => fAliases.includes(id));
                    const isRequestedSurgeon =
                      !isFollowingThisSurgeon &&
                      Boolean(followedDoc?.pendingFollowRequests?.some(id => currentUids.includes(id)));
                    const isSelfFollowed = currentUids.some(id => fAliases.includes(id));

                    return (
                      <div
                        key={followedId}
                        className="p-3 bg-white rounded-2xl border border-slate-200 hover:border-teal-300 flex items-center justify-between gap-3 transition"
                      >
                        <div
                          onClick={() => followedDoc && switchToDoctor(followedDoc)}
                          className="flex items-center gap-3 cursor-pointer group flex-1"
                        >
                          {followedDoc?.profilePhotoUrl ? (
                            <img
                              src={followedDoc.profilePhotoUrl}
                              alt={followedDoc.fullName}
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-teal-500/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-300 font-bold text-xs flex items-center justify-center">
                              {(followedDoc?.fullName || 'DR').substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs group-hover:text-teal-700 transition line-clamp-1">
                              {followedDoc?.fullName || `Colleague (${followedId.substring(0, 8)})`}
                            </h5>
                            <p className="text-[10px] text-teal-800 font-medium">
                              {followedDoc?.specialty || 'Surgeon'} • {followedDoc?.hospital || 'Hospital'}
                            </p>
                          </div>
                        </div>

                        {!isSelfFollowed && (
                          <button
                            onClick={async () => {
                              await toggleFollowDoctor(followedDoc?.userId || followedId);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer shrink-0 ${
                              isFollowingThisSurgeon
                                ? 'bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 border border-slate-200'
                                : isRequestedSurgeon
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-2xs'
                            }`}
                          >
                            {isFollowingThisSurgeon
                              ? (isRTL ? 'تتابعه' : 'Following')
                              : isRequestedSurgeon
                                ? (isRTL ? 'تم الطلب' : 'Requested')
                                : (isRTL ? 'متابعة' : 'Follow')}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center space-y-1">
                  <Users size={20} className="mx-auto text-slate-400" />
                  <p className="text-xs text-slate-500 font-medium">
                    {isRTL ? 'هذا الجراح لا يتابع أي أطباء حالياً.' : 'This surgeon is not following anyone yet.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COMPLETE PUBLISHED CASES LIST */}
          {activeTab === 'cases' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <BookOpen size={15} className="text-teal-600" />
                  <span>
                    {isRTL
                      ? `جميع الحالات المنشورة بواسطة ${liveDoctor.fullName}`
                      : `All Clinical Cases Shared by Dr. ${liveDoctor.fullName}`}
                  </span>
                  <span className="bg-teal-100 text-teal-800 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                    {doctorCases.length}
                  </span>
                </h4>
              </div>

              {doctorCases.length > 0 ? (
                <div className="space-y-3">
                  {doctorCases.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        if (onOpenCaseDetail) onOpenCaseDetail(c);
                      }}
                      className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold bg-[#101C32] text-teal-300 px-2 py-0.5 rounded-lg">
                          {c.caseReference}
                        </span>
                        <span className="text-[11px] text-slate-400">{c.presentationDate}</span>
                      </div>

                      <h5 className="font-bold text-slate-900 text-sm group-hover:text-teal-800 transition">
                        {c.primaryDiagnosis}
                      </h5>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {c.chiefComplaint || c.historyOfPresentIllness}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-semibold text-teal-800">{c.specialty}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 font-mono">
                            <Heart size={12} className="text-rose-500" /> {c.likesCount || 0}
                          </span>
                          <span className="flex items-center gap-1 font-mono">
                            <MessageSquare size={12} className="text-teal-600" />{' '}
                            {c.comments?.length || c.commentsCount || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 bg-white rounded-2xl border border-dashed border-slate-200 text-center space-y-1">
                  <BookOpen size={20} className="mx-auto text-slate-400" />
                  <p className="text-xs text-slate-500 font-medium">
                    {isRTL ? 'لم يتم العثور على أي حالات سريرية منشورة.' : 'No published clinical cases found.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
