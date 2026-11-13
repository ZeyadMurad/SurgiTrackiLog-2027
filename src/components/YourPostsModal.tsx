import React, { useState } from 'react';
import {
  X,
  FileText,
  Heart,
  MessageSquare,
  Users,
  Trash2,
  Edit3,
  Plus,
  Share2,
  CheckCircle2,
  Eye,
  AlertTriangle,
  UserCheck,
  UserPlus,
  UserMinus,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { ClinicalCase } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { SurgicalCommunityPost } from './SurgicalCommunityPost';
import { AddCaseModal } from './AddCaseModal';
import { matchDoctorCase } from '../lib/doctorUtils';
import { getCasePublishTimestampMs } from '../lib/firebase';

interface YourPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewCase: () => void;
}

export const YourPostsModal: React.FC<YourPostsModalProps> = ({
  isOpen,
  onClose,
  onOpenNewCase,
}) => {
  const {
    communityCases,
    cases,
    deleteCase,
    updateCase,
    publishCaseToCommunity,
    allDoctors,
    toggleFollowDoctor,
    acceptFollowRequest,
    declineFollowRequest,
  } = useData();
  const { user, profile, language, myUids } = useAuth();
  const isRTL = language === 'ar';

  const [activeTab, setActiveTab] = useState<'posts' | 'network'>('posts');
  const [postsSubTab, setPostsSubTab] = useState<'published' | 'drafts'>('published');
  const [networkSubTab, setNetworkSubTab] = useState<'followers' | 'following' | 'requests'>('followers');

  const currentUid = user?.uid || profile?.userId || 'local-surgeon-001';
  const userEmail = (user?.email || profile?.email || '').toLowerCase().trim();

  // Published posts authored by current user (from community cases or published cases)
  const myPublishedPosts = React.useMemo(() => {
    const pubList: ClinicalCase[] = [];
    const seen = new Set<string>();

    const checkIsMine = (c: ClinicalCase) => {
      if (c.userId && myUids.includes(c.userId)) return true;
      return matchDoctorCase(c, {
        userId: profile?.userId,
        id: user?.uid,
        email: userEmail,
        fullName: profile?.fullName,
        aliasIds: profile?.aliasIds,
      });
    };

    communityCases.forEach(c => {
      if (checkIsMine(c)) {
        if (!seen.has(c.id)) {
          seen.add(c.id);
          pubList.push(c);
        }
      }
    });

    cases.forEach(c => {
      if (checkIsMine(c) && c.isPublished) {
        if (!seen.has(c.id)) {
          seen.add(c.id);
          pubList.push(c);
        }
      }
    });

    return pubList.sort((a, b) => getCasePublishTimestampMs(b) - getCasePublishTimestampMs(a));
  }, [communityCases, cases, profile?.userId, user?.uid, userEmail, profile?.fullName, profile?.aliasIds, myUids]);

  // Drafts & Unpublished Logbook cases authored by current user
  const myDraftPosts = React.useMemo(() => {
    const checkIsMine = (c: ClinicalCase) => {
      if (c.userId && myUids.includes(c.userId)) return true;
      return matchDoctorCase(c, {
        userId: profile?.userId,
        id: user?.uid,
        email: userEmail,
        fullName: profile?.fullName,
        aliasIds: profile?.aliasIds,
      });
    };
    return cases.filter(c => {
      const isMine = checkIsMine(c);
      const notInCommunity = !communityCases.some(comm => comm.id === c.id);
      return isMine && (!c.isPublished || notInCommunity);
    });
  }, [cases, communityCases, profile?.userId, user?.uid, userEmail, profile?.fullName, profile?.aliasIds, myUids]);

  // Overall engagement metrics
  const totalLikes = myPublishedPosts.reduce((acc, p) => acc + (p.likesCount || 0), 0);
  const totalComments = myPublishedPosts.reduce((acc, p) => acc + (p.commentsCount || (p.comments?.length || 0)), 0);
  const followersList = profile?.followers || [];
  const followingList = profile?.following || [];
  const pendingRequestsList = profile?.pendingFollowRequests || [];

  const [editingPost, setEditingPost] = useState<ClinicalCase | null>(null);
  const [draftToDelete, setDraftToDelete] = useState<ClinicalCase | null>(null);
  const [actionError, setActionError] = useState('');

  if (!isOpen) return null;

  // Resolve Doctor objects
  const getDoctorInfo = (id: string) => {
    return allDoctors.find(d => d.userId === id || d.aliasIds?.includes(id)) || {
      userId: id,
      fullName: `Dr. Colleague (${id.substring(0, 6)})`,
      specialty: 'Surgical Trainee',
      hospital: 'University Medical Center',
      profilePhotoUrl: '',
      followersCount: 0,
      followingCount: 0,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-[#101C32] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-bold">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isRTL ? 'منشوراتك وتفاعل الزملاء الجراحين' : 'Your Published Surgical Posts & Engagement'}
              </h2>
              <p className="text-xs text-slate-300">
                {profile?.fullName || 'Dr. Surgeon'} • {isRTL ? 'إدارة منشوراتك ومتابعة المعلقين والمعجبين' : 'Manage your posts and track commenters & followers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Engagement Overview Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => setActiveTab('posts')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              activeTab === 'posts' ? 'bg-teal-50/80 border-teal-400 shadow-xs' : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              {isRTL ? 'منشوراتك المعلنة' : 'Published Posts'}
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">{myPublishedPosts.length}</span>
          </button>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              {isRTL ? 'إجمالي الإعجابات' : 'Total Likes'}
            </span>
            <span className="text-lg font-bold text-rose-600 mt-0.5 block flex items-center gap-1.5">
              <Heart size={16} className="fill-rose-500" /> {totalLikes}
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">
              {isRTL ? 'إجمالي التعليقات' : 'Total Comments'}
            </span>
            <span className="text-lg font-bold text-teal-700 mt-0.5 block flex items-center gap-1.5">
              <MessageSquare size={16} className="text-teal-600" /> {totalComments}
            </span>
          </div>

          <button
            onClick={() => {
              setActiveTab('network');
              setNetworkSubTab('followers');
            }}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
              activeTab === 'network' ? 'bg-teal-50/80 border-teal-400 shadow-xs' : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
            title={isRTL ? 'عرض قائمة المتابعين ومن تتابعهم' : 'View Followers & Following Lists'}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">
                {isRTL ? 'المتابعون / تتابعهم' : 'Followers / Following'}
              </span>
              <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded-full">
                {isRTL ? 'إدارة' : 'Manage'}
              </span>
            </div>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block flex items-center gap-1.5">
              <Users size={16} className="text-teal-600" /> {followersList.length} / {followingList.length}
            </span>
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-white px-6 pt-2 gap-3 text-xs">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-2.5 font-bold transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'posts' ? 'border-[#0D9488] text-teal-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText size={14} />
            <span>{isRTL ? 'منشوراتي ومسوداتي' : 'My Publications & Drafts'} ({myPublishedPosts.length + myDraftPosts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`pb-2.5 font-bold transition cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'network' ? 'border-[#0D9488] text-teal-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={14} />
            <span>{isRTL ? 'شبكة المتابعة والزملاء' : 'Colleague Network'}</span>
            {pendingRequestsList.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingRequestsList.length}
              </span>
            )}
          </button>
        </div>

        {/* Dynamic View Body */}
        {activeTab === 'network' ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FBFDFE]">
            {/* Sub-tabs for Network */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setNetworkSubTab('followers')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  networkSubTab === 'followers' ? 'bg-[#0D9488] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isRTL ? 'المتابعون' : 'Followers'} ({followersList.length})
              </button>
              <button
                onClick={() => setNetworkSubTab('following')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  networkSubTab === 'following' ? 'bg-[#0D9488] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isRTL ? 'من تتابعهم' : 'Following'} ({followingList.length})
              </button>
              <button
                onClick={() => setNetworkSubTab('requests')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  networkSubTab === 'requests' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{isRTL ? 'طلبات المتابعة المعلقة' : 'Pending Requests'}</span>
                <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingRequestsList.length}
                </span>
              </button>
            </div>

            {/* Content for Followers */}
            {networkSubTab === 'followers' && (
              <div className="space-y-3">
                {followersList.length > 0 ? (
                  followersList.map(fid => {
                    const docInfo = getDoctorInfo(fid);
                    return (
                      <div key={fid} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {docInfo.profilePhotoUrl ? (
                            <img src={docInfo.profilePhotoUrl} alt={docInfo.fullName} className="w-10 h-10 rounded-2xl object-cover ring-1 ring-teal-500/20" />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-[#101C32] text-teal-300 font-bold text-xs flex items-center justify-center">
                              {docInfo.fullName.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{docInfo.fullName}</h4>
                            <p className="text-[11px] text-teal-800">{docInfo.specialty} • <span className="text-slate-400">{docInfo.hospital}</span></p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-2.5 py-1 rounded-xl border border-teal-200">
                          {isRTL ? 'يتابعك' : 'Follower'}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    {isRTL ? 'ليس لديك متابعون بعد. انشر حالات جراحية للحصول على متابعين من الزملاء.' : 'No followers yet. Publish clinical cases to gain peer followers.'}
                  </div>
                )}
              </div>
            )}

            {/* Content for Following */}
            {networkSubTab === 'following' && (
              <div className="space-y-3">
                {followingList.length > 0 ? (
                  followingList.map(fid => {
                    const docInfo = getDoctorInfo(fid);
                    return (
                      <div key={fid} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {docInfo.profilePhotoUrl ? (
                            <img src={docInfo.profilePhotoUrl} alt={docInfo.fullName} className="w-10 h-10 rounded-2xl object-cover ring-1 ring-teal-500/20" />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-[#101C32] text-teal-300 font-bold text-xs flex items-center justify-center">
                              {docInfo.fullName.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{docInfo.fullName}</h4>
                            <p className="text-[11px] text-teal-800">{docInfo.specialty} • <span className="text-slate-400">{docInfo.hospital}</span></p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            await toggleFollowDoctor(fid);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                        >
                          <UserMinus size={13} />
                          <span>{isRTL ? 'إلغاء المتابعة' : 'Unfollow'}</span>
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    {isRTL ? 'أنت لا تتابع أي جراح حالياً. استكشف المجتمع وتابع زملاءك.' : 'You are not following any surgeons yet. Explore the community and follow peers.'}
                  </div>
                )}
              </div>
            )}

            {/* Content for Pending Requests */}
            {networkSubTab === 'requests' && (
              <div className="space-y-3">
                {pendingRequestsList.length > 0 ? (
                  pendingRequestsList.map(reqId => {
                    const docInfo = getDoctorInfo(reqId);
                    return (
                      <div key={reqId} className="p-3.5 bg-white rounded-2xl border border-amber-200 shadow-2xs flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {docInfo.profilePhotoUrl ? (
                            <img src={docInfo.profilePhotoUrl} alt={docInfo.fullName} className="w-10 h-10 rounded-2xl object-cover ring-1 ring-amber-500/20" />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-[#101C32] text-amber-300 font-bold text-xs flex items-center justify-center">
                              {docInfo.fullName.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{docInfo.fullName}</h4>
                            <p className="text-[11px] text-amber-800">{docInfo.specialty} • <span className="text-slate-400">{docInfo.hospital}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => acceptFollowRequest(reqId)}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1"
                          >
                            <Check size={12} />
                            <span>{isRTL ? 'قبول' : 'Accept'}</span>
                          </button>
                          <button
                            onClick={() => declineFollowRequest(reqId)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer"
                          >
                            <span>{isRTL ? 'رفض' : 'Decline'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    {isRTL ? 'لا توجد طلبات متابعة معلقة حالياً.' : 'No pending follow requests at this time.'}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Posts Feed / Management */
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FBFDFE]">
            {/* Sub-tab switcher: Published in Community vs Drafts & Portfolio Cases */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPostsSubTab('published')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    postsSubTab === 'published'
                      ? 'bg-[#0D9488] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Share2 size={13} />
                  <span>{isRTL ? 'المنشورات في المجتمع' : 'Published in Community'}</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                    {myPublishedPosts.length}
                  </span>
                </button>

                <button
                  onClick={() => setPostsSubTab('drafts')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    postsSubTab === 'drafts'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText size={13} />
                  <span>{isRTL ? 'المسودات وسجل الحالات' : 'Drafts & Portfolio Cases'}</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                    {myDraftPosts.length}
                  </span>
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenNewCase();
                }}
                className="bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus size={14} />
                <span>{isRTL ? 'نشر حالة جديدة' : 'Publish New Case'}</span>
              </button>
            </div>

            {actionError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2">
                <span>{actionError}</span>
                <button type="button" onClick={() => setActionError('')} className="text-red-500 hover:text-red-700 cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* View 1: Published Posts */}
            {postsSubTab === 'published' && (
              <>
                {myPublishedPosts.length > 0 ? (
                  <div className="space-y-6">
                    {myPublishedPosts.map((post, idx) => {
                      const ownerPost = { ...post, userId: post.userId || currentUid };
                      return (
                        <div key={post.id ? `${post.id}-${idx}` : `my-post-${idx}`} className="relative">
                          <SurgicalCommunityPost
                            post={ownerPost}
                            isOwnerManagementView={true}
                            onEdit={(c) => setEditingPost(c)}
                            onDelete={async (id) => {
                              setActionError('');
                              try {
                                await deleteCase(id);
                              } catch (e: any) {
                                setActionError(e?.message || 'Failed to delete published post.');
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                      <FileText size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isRTL ? 'لم تقم بنشر أي حالة سريرية في المجتمع حتى الآن' : 'No Published Posts Yet'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {isRTL
                        ? 'يمكنك نشر الحالات السريرية المعقدة أو النموذجية مع الزملاء الجراحين ومتابعة تفاعلهم معها من هنا.'
                        : 'Publish your surgical cases to the community to exchange surgical insights with peer surgeons.'}
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenNewCase();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
                    >
                      <Plus size={15} />
                      <span>{isRTL ? 'نشر أول حالة الآن' : 'Publish Your First Case Now'}</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* View 2: Drafts & Portfolio Cases */}
            {postsSubTab === 'drafts' && (
              <>
                {myDraftPosts.length > 0 ? (
                  <div className="space-y-4">
                    {myDraftPosts.map((draft) => (
                      <div
                        key={draft.id}
                        className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-slate-300 transition space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200">
                              {draft.caseReference}
                            </span>
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              {isRTL ? 'مسودة / غير منشورة في المجتمع' : 'Draft / Private in Portfolio'}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {draft.presentationDate}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                setActionError('');
                                try {
                                  await publishCaseToCommunity(draft.id);
                                  setPostsSubTab('published');
                                } catch (e: any) {
                                  setActionError(e?.message || 'Failed to publish clinical case.');
                                }
                              }}
                              className="bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                              title={isRTL ? 'نشر هذه الحالة للزملاء في المجتمع' : 'Publish this case to Community Feed'}
                            >
                              <Share2 size={13} />
                              <span>{isRTL ? 'نشر في المجتمع' : 'Publish to Community'}</span>
                            </button>

                            <button
                              onClick={() => setEditingPost(draft)}
                              className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                              title={isRTL ? 'تعديل المسودة' : 'Edit Case Draft'}
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              onClick={() => setDraftToDelete(draft)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title={isRTL ? 'حذف المسودة' : 'Delete Draft'}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-slate-900">
                            {draft.primaryDiagnosis || 'Untitled Clinical Case'}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                            {draft.chiefComplaint || draft.historyOfPresentIllness || 'No description provided.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>{draft.specialty}</span>
                          <span>•</span>
                          <span>{draft.hospital}</span>
                          <span>•</span>
                          <span>{draft.patientAge} Y / {draft.patientSex}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                      <FileText size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {isRTL ? 'لا توجد مسودات غير منشورة' : 'No Unpublished Drafts'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {isRTL
                        ? 'جميع حالاتك السريرية منشورة في المجتمع الجراحي أو يمكنك إنشاء مسودة حالة جديدة.'
                        : 'All your portfolio clinical cases are currently published or you can start a new draft.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* In-app Draft Deletion Modal */}
      {draftToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-red-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isRTL ? 'تأكيد حذف المسودة' : 'Confirm Draft Deletion'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isRTL
                ? `هل أنت متأكد من حذف المسودة "${draftToDelete.caseReference}" نهائياً؟`
                : `Are you sure you want to permanently delete draft "${draftToDelete.caseReference}"?`}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDraftToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteCase(draftToDelete.id);
                    setDraftToDelete(null);
                  } catch (e: any) {
                    setActionError(e?.message || 'Failed to delete draft.');
                    setDraftToDelete(null);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                {isRTL ? 'نعم، حذف نهائي' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal if owner edits their post */}
      {editingPost && (
        <AddCaseModal
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          existingCase={editingPost}
          onSave={async (caseData, publishToCommunity) => {
            if (publishToCommunity) {
              await publishCaseToCommunity(editingPost.id, caseData);
            } else {
              await updateCase(editingPost.id, caseData);
            }
            setEditingPost(null);
            return editingPost.id;
          }}
        />
      )}
    </div>
  );
};
