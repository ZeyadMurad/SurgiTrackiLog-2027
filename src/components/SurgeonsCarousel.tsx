import React, { useRef, useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, UserPlus, UserCheck, Users, Search, Filter, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../lib/i18n';
import { SURGICAL_SPECIALTIES } from '../lib/medicalDefaults';
import { matchDoctorCase } from '../lib/doctorUtils';

interface SurgeonsCarouselProps {
  onSelectDoctor: (doctor: any) => void;
}

export const SurgeonsCarousel: React.FC<SurgeonsCarouselProps> = ({ onSelectDoctor }) => {
  const { allDoctors, toggleFollowDoctor, communityCases } = useData();
  const { profile, user, language, myUids: authUids } = useAuth();
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [colleagueSearch, setColleagueSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showSearch, setShowSearch] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const currentFollowing = profile?.following || [];
  const myUids = authUids.length > 0 ? authUids : ([profile?.userId, user?.uid].filter(Boolean) as string[]);

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(doc => {
      if (!doc) return false;
      const q = (colleagueSearch || '').toLowerCase().trim();
      const matchSearch =
        !q ||
        (doc.fullName || '').toLowerCase().includes(q) ||
        (doc.specialty || '').toLowerCase().includes(q) ||
        (doc.hospital || '').toLowerCase().includes(q);

      const matchSpecialty =
        selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

      return matchSearch && matchSpecialty;
    });
  }, [allDoctors, colleagueSearch, selectedSpecialty]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3 relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
            <Users size={16} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{isRTL ? 'أطباء المجتمع الجراحي' : 'Surgical Community Colleagues'}</span>
              <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-mono font-semibold">
                {allDoctors.length}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isRTL ? 'تابع زملاءك الجراحين واطلع على حالاتهم السريرية' : 'Connect with surgeons, follow cases, and share clinical insights'}
            </p>
          </div>
        </div>

        {/* Filter & Scroll Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
              showSearch || colleagueSearch || selectedSpecialty !== 'All'
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Filter Colleagues"
          >
            <Search size={14} />
            <span className="text-[11px] hidden sm:inline">{isRTL ? 'بحث وتصفية' : 'Search'}</span>
          </button>

          <button
            onClick={() => scroll(isRTL ? 'right' : 'left')}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => scroll(isRTL ? 'left' : 'right')}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Expandable Search & Specialty Filter */}
      {showSearch && (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2 animate-fadeIn text-xs">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={colleagueSearch}
              onChange={(e) => setColleagueSearch(e.target.value)}
              placeholder={isRTL ? 'ابحث باسم الطبيب، التخصص، أو المستشفى...' : 'Search by name, specialty, or hospital...'}
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <Filter size={13} className="text-slate-400 shrink-0" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="All">{isRTL ? 'كل التخصصات' : 'All Specialties'}</option>
              {SURGICAL_SPECIALTIES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {(colleagueSearch || selectedSpecialty !== 'All') && (
              <button
                onClick={() => {
                  setColleagueSearch('');
                  setSelectedSpecialty('All');
                }}
                className="text-[11px] text-teal-800 hover:underline cursor-pointer shrink-0"
              >
                {isRTL ? 'إلغاء' : 'Reset'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Horizontal Avatars Track */}
      {filteredDoctors.length > 0 ? (
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-3 overflow-x-auto pb-1 scrollbar-none scroll-smooth"
        >
          {filteredDoctors.map((doc) => {
            const docAliases = [doc.userId, ...(doc.aliasIds || [])].filter(Boolean);
            const isFollowing = currentFollowing.some(id => docAliases.includes(id));
            const isSelf = myUids.some(id => docAliases.includes(id));
            const isRequested =
              !isFollowing &&
              Boolean(doc.pendingFollowRequests?.some(id => myUids.includes(id)));

            return (
              <div
                key={doc.userId}
                className="group shrink-0 w-40 sm:w-44 bg-slate-50/60 hover:bg-white hover:shadow-md border border-slate-200/90 rounded-2xl p-3 flex flex-col items-center text-center transition-all duration-200 relative"
              >
                {/* Circular Avatar with Ring & Status Indicator */}
                <div
                  onClick={() => onSelectDoctor(doc)}
                  className="relative cursor-pointer mb-2 transform group-hover:scale-105 transition"
                >
                  <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-teal-500 via-teal-300 to-emerald-400 shadow-sm">
                    {doc.profilePhotoUrl ? (
                      <img
                        src={doc.profilePhotoUrl}
                        alt={doc.fullName}
                        className="w-full h-full rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#101C32] text-teal-300 font-bold text-base flex items-center justify-center border-2 border-white">
                        {doc.fullName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Surgeon Name & Title */}
                <h4
                  onClick={() => onSelectDoctor(doc)}
                  className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-teal-700 cursor-pointer w-full"
                  title={doc.fullName}
                >
                  {doc.academicTitle ? `${doc.academicTitle} ` : ''}{doc.fullName}
                </h4>

                {/* Specialty & Hospital */}
                <p className="text-[10px] text-teal-800 font-semibold line-clamp-1 w-full mt-0.5">
                  {doc.specialty}
                </p>
                <p className="text-[9px] text-slate-400 line-clamp-1 w-full">
                  {doc.hospital}
                </p>

                {/* Followers and Published Cases Badges */}
                {(() => {
                  const casesCount = communityCases.filter(c => matchDoctorCase(c, doc)).length;
                  return (
                    <div className="flex items-center justify-center gap-1.5 my-1.5 text-[9px] font-medium w-full">
                      <span className="bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded font-mono font-semibold" title="Followers">
                        {doc.followersCount ?? (doc.followers?.length || 0)} {isRTL ? 'متابع' : 'foll.'}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-semibold" title="Published Cases">
                        {casesCount} {isRTL ? 'حالات' : 'cases'}
                      </span>
                    </div>
                  );
                })()}

                {/* Action: Follow / Requested / Following */}
                <div className="mt-auto w-full pt-2 border-t border-slate-200/70">
                  {isSelf ? (
                    <span className="text-[10px] text-slate-400 font-semibold block py-1">
                      {isRTL ? 'حسابك' : 'You'}
                    </span>
                  ) : (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await toggleFollowDoctor(doc.userId);
                      }}
                      className={`w-full py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                        isFollowing
                          ? 'bg-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-700'
                          : isRequested
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200'
                            : 'bg-[#0D9488] hover:bg-teal-700 text-white shadow-2xs'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck size={11} className="text-teal-700" />
                          <span>{isRTL ? 'تتابعه' : 'Following'}</span>
                        </>
                      ) : isRequested ? (
                        <>
                          <Clock size={11} className="text-amber-700" />
                          <span>{isRTL ? 'تم الطلب' : 'Requested'}</span>
                        </>
                      ) : (
                        <>
                          <UserPlus size={11} />
                          <span>{isRTL ? 'متابعة' : 'Follow'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          {isRTL ? 'لم يتم العثور على أطباء مطابقين لشروط البحث.' : 'No colleagues found matching your search filter.'}
        </div>
      )}
    </div>
  );
};
