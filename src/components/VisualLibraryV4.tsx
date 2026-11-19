// ============================================================================
// VisualLibraryV4.tsx — Unified Surgical Visual Library (V4 + Verified Videos)
// ----------------------------------------------------------------------------
// Integrates:
//   1. All-Sources Live Search + 26 Live Verified Embedded Operative Videos
//   2. 10 Verified Surgical YouTube Channels + Curated Playlist
//   3. 3 Major Surgical Platforms (WeBSurg IRCAD, CTSNet, VuMedi)
//   4. 147-Structure Surgical Atlas 3D Bidirectional Video Explorer
//   5. Multi-language (EN / AR / DE) + Bookmarks + Community Thread Discussion
// ============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Play,
  ExternalLink,
  Bookmark,
  Images,
  Youtube,
  Globe,
  Stethoscope,
  Brain,
  Bone,
  Heart,
  Activity,
  Baby,
  Armchair,
  TrendingUp,
  Video,
  X,
  Sparkles,
  BookOpen,
  ChevronRight,
  Network,
  Compass,
  MessageSquare,
  ListVideo,
} from 'lucide-react';
import {
  SURGICAL_YOUTUBE_CHANNELS,
  SURGICAL_PLAYLISTS,
  EXTERNAL_SURGICAL_PLATFORMS,
} from '../lib/surgicalYouTubeChannels';
import { getStructureVideoResults, getAllVideoSearchTargets } from '../lib/atlasVideoIntegration';
import { UNIFIED_ANATOMICAL_CATALOG, searchStructures } from '../lib/surgicalAtlasCatalog';
import { VERIFIED_VISUAL_MEDIA } from '../lib/visualLibraryVerified';
import type { VisualMedia } from '../types/newTypes';
import type { SupportedLanguage } from '../types';

const I18N = {
  en: {
    title: 'Surgical Visual Library',
    subtitle: '26 curated verified operative videos + multi-channel search across 10 YouTube channels, WeBSurg, CTSNet & VuMedi + 147 Atlas 3D structures',
    search: 'Search any surgical procedure, anatomy, or technique (e.g. cholecystectomy, EVAR, thyroidectomy)...',
    tabSearch: 'Search & Verified Videos',
    tabChannels: 'YouTube Channels',
    tabPlatforms: 'Surgical Platforms',
    tabAtlas: 'Atlas 3D Explorer',
    searchInChannel: 'Search in',
    browseChannels: 'Verified Surgical YouTube Channels',
    browsePlatforms: 'External Surgical Platforms',
    atlasIntegration: 'Surgical Atlas 3D — 147 Structures Video Integration',
    totalChannels: 'YT Channels',
    totalPlatforms: 'Platforms',
    totalStructures: '3D Structures',
    totalVideos: 'Verified & Indexed',
    curatedHeading: 'Curated Verified Operative Videos',
    channelSearchHeading: 'Search Directly Inside Surgical Channels',
    platformSearchHeading: 'Search External Surgical Platforms',
    allSpecialties: 'All Specialties',
    savedOnly: 'Saved',
    clickStructure: 'Click any anatomical structure to view procedures, YouTube channels, and platform search links',
    searchStructure: 'Matching structures for',
    procedures: 'procedures',
    watchVideo: 'Watch Video',
    openOnYouTube: 'Open Source',
    discussCase: 'Discuss in Threads',
    openInAtlas: 'Inspect in 3D Atlas',
    visitChannel: 'Visit Channel',
    visitPlatform: 'Visit Platform',
    playlistHeading: 'Curated Surgical Education Playlist',
    disclaimer: 'Educational surgical reference only. Always follow attending supervision and institutional protocols.',
  },
  ar: {
    title: 'المكتبة الطبية المرئية الجراحية',
    subtitle: '26 فيديو جراحي موثق + بحث مباشر في 10 قنوات يوتيوب جراحية وWeBSurg وCTSNet وVuMedi + تكامل 147 بنية تشريحية ثلاثية الأبعاد',
    search: 'ابحث عن أي إجراء جراحي أو بنية تشريحية أو تقنية (مثل: cholecystectomy، EVAR، thyroidectomy)...',
    tabSearch: 'البحث والفيديوهات الموثقة',
    tabChannels: 'قنوات يوتيوب الجراحية',
    tabPlatforms: 'المنصات الجراحية',
    tabAtlas: 'استكشاف الأطلس 3D',
    searchInChannel: 'ابحث في',
    browseChannels: 'قنوات يوتيوب الجراحية الموثوقة',
    browsePlatforms: 'المنصات الجراحية العالمية',
    atlasIntegration: 'تكامل الأطلس الجراحي 3D — 147 بنية تشريحية',
    totalChannels: 'قناة يوتيوب',
    totalPlatforms: 'منصات عالمية',
    totalStructures: 'بنية تشريحية',
    totalVideos: 'فيديو متاح',
    curatedHeading: 'فيديوهات عمليات حقيقية منتقاة وموثقة',
    channelSearchHeading: 'البحث المباشر داخل القنوات الجراحية',
    platformSearchHeading: 'البحث في المنصات الجراحية الخارجية',
    allSpecialties: 'كل التخصصات',
    savedOnly: 'المحفوظة',
    clickStructure: 'انقر أي بنية تشريحية لعرض الإجراءات وروابط القنوات والمنصات الجراحية',
    searchStructure: 'التراكيب المطابقة لـ',
    procedures: 'إجراءات',
    watchVideo: 'مشاهدة الفيديو',
    openOnYouTube: 'فتح المصدر',
    discussCase: 'مناقشة في المجتمع',
    openInAtlas: 'عرض في الأطلس 3D',
    visitChannel: 'زيارة القناة',
    visitPlatform: 'زيارة المنصة',
    playlistHeading: 'قائمة تشغيل تعليمية جراحية مختارة',
    disclaimer: 'مرجع تعليمي جراحي فقط. التزم دائماً بإشراف الاستشاري وبروتوكولات المؤسسة.',
  },
  de: {
    title: 'Chirurgische Mediathek',
    subtitle: '26 kuratierte OP-Videos + Suche über 10 chirurgische YouTube-Kanäle, WeBSurg, CTSNet & VuMedi + 147 3D-Atlas-Strukturen',
    search: 'Suche nach Eingriff, Anatomie oder Technik (z. B. Cholecystectomy, EVAR, Thyroidectomy)...',
    tabSearch: 'Suche & Verifizierte Videos',
    tabChannels: 'YouTube-Kanäle',
    tabPlatforms: 'OP-Plattformen',
    tabAtlas: '3D-Atlas Integration',
    searchInChannel: 'Suchen in',
    browseChannels: 'Verifizierte Chirurgische YouTube-Kanäle',
    browsePlatforms: 'Externe OP-Plattformen',
    atlasIntegration: '3D-Atlas — 147 anatomische Strukturen',
    totalChannels: 'YT-Kanäle',
    totalPlatforms: 'Plattformen',
    totalStructures: '3D-Strukturen',
    totalVideos: 'Verfügbare Videos',
    curatedHeading: 'Kuratierte verifizierte OP-Videos',
    channelSearchHeading: 'Direktsuche in chirurgischen Kanälen',
    platformSearchHeading: 'Suche auf externen Plattformen',
    allSpecialties: 'Alle Fachgebiete',
    savedOnly: 'Gespeichert',
    clickStructure: 'Struktur anklicken für Eingriffe, YouTube-Kanäle und Plattform-Links',
    searchStructure: 'Passende Strukturen für',
    procedures: 'Eingriffe',
    watchVideo: 'Video ansehen',
    openOnYouTube: 'Quelle öffnen',
    discussCase: 'Im Forum diskutieren',
    openInAtlas: 'Im 3D-Atlas öffnen',
    visitChannel: 'Kanal öffnen',
    visitPlatform: 'Plattform öffnen',
    playlistHeading: 'Kuratierte chirurgische Playlist',
    disclaimer: 'Nur zu Ausbildungszwecken. Befolgen Sie stets klinikinterne Standards.',
  },
} as const;

const CONTENT_TYPE_ICONS: Record<string, React.ElementType> = {
  surgical_videos: Video,
  animations: Images,
  lectures: BookOpen,
  podcasts: Network,
  mixed: Sparkles,
};

const SPECIALTY_ICONS: Record<string, React.ElementType> = {
  'Cardiac Surgery': Heart,
  'Vascular Surgery': TrendingUp,
  'Thoracic Surgery': Activity,
  'General Surgery': Stethoscope,
  Neurosurgery: Brain,
  'Orthopedic Surgery': Bone,
  'Plastic Surgery': Armchair,
  'Pediatric Surgery': Baby,
  'Minimally Invasive Surgery': Video,
};

export interface VisualLibraryV4Props {
  language: SupportedLanguage;
  currentUserId?: string;
  savedMediaIds?: string[];
  onSaveMedia?: (mediaId: string) => Promise<void>;
  onOpenThreadForMedia?: (mediaId: string, title: string) => void;
  onOpenInAtlas?: () => void;
  initialQuery?: string;
}

export const VisualLibraryV4: React.FC<VisualLibraryV4Props> = ({
  language,
  savedMediaIds = [],
  onSaveMedia,
  onOpenThreadForMedia,
  onOpenInAtlas,
  initialQuery = '',
}) => {
  const t = I18N[language] || I18N.en;
  const isRtl = language === 'ar';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'search' | 'channels' | 'platforms' | 'atlas'>('search');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlySaved, setOnlySaved] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VisualMedia | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setActiveTab('search');
    }
  }, [initialQuery]);

  const categories = useMemo(
    () => Array.from(new Set(VERIFIED_VISUAL_MEDIA.map((m) => m.category))),
    [],
  );

  const filteredCurated = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VERIFIED_VISUAL_MEDIA.filter((item) => {
      if (onlySaved && !savedMediaIds.includes(item.id)) return false;
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.procedureName || '').toLowerCase().includes(q) ||
        (item.anatomicalSystem || '').toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.tags || []).some((tg) => tg.toLowerCase().includes(q))
      );
    });
  }, [query, selectedCategory, onlySaved, savedMediaIds]);

  const searchTargets = useMemo(() => {
    if (!query.trim()) return null;
    return getAllVideoSearchTargets(query.trim());
  }, [query]);

  const atlasSearchResults = useMemo(() => {
    if (activeTab !== 'atlas' || !query.trim()) return [];
    return searchStructures(query).slice(0, 12);
  }, [query, activeTab]);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b from-[#0a0f1c] to-[#101C32] text-slate-100 shadow-xl"
    >
      {/* HEADER + STATS */}
      <div className="p-5 sm:p-6 border-b border-slate-800 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-teal-400" />
              <span>{t.title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">{t.subtitle}</p>
          </div>
          {onOpenInAtlas && (
            <button
              type="button"
              onClick={onOpenInAtlas}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-xs font-bold text-cyan-200 cursor-pointer"
            >
              <Compass size={14} /> {t.openInAtlas}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <StatBadge value={SURGICAL_YOUTUBE_CHANNELS.length} label={t.totalChannels} icon={Youtube} color="#ef4444" />
          <StatBadge value={EXTERNAL_SURGICAL_PLATFORMS.length} label={t.totalPlatforms} icon={Globe} color="#14b8a6" />
          <StatBadge value={UNIFIED_ANATOMICAL_CATALOG.length} label={t.totalStructures} icon={Brain} color="#8b5cf6" />
          <StatBadge value={`${VERIFIED_VISUAL_MEDIA.length} + 18,000+`} label={t.totalVideos} icon={Video} color="#f59e0b" />
        </div>

        {/* SEARCH INPUT */}
        <div className="relative">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full bg-[#070D1A] border border-slate-700 focus:border-teal-500 rounded-xl ps-10 pe-9 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* 4 COHESIVE TABS */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'search', label: t.tabSearch, icon: Search },
            { id: 'channels', label: `${t.tabChannels} (${SURGICAL_YOUTUBE_CHANNELS.length})`, icon: Youtube },
            { id: 'platforms', label: `${t.tabPlatforms} (${EXTERNAL_SURGICAL_PLATFORMS.length})`, icon: Globe },
            { id: 'atlas', label: `${t.tabAtlas} (${UNIFIED_ANATOMICAL_CATALOG.length})`, icon: Brain },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  active
                    ? 'bg-[#0D9488] border-teal-500 text-white shadow-sm'
                    : 'bg-[#070D1A] border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* === TAB 1: SEARCH & CURATED VERIFIED VIDEOS === */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Multi-channel & platform live search cards when user enters query */}
            {searchTargets && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                    <Youtube size={14} /> {t.channelSearchHeading} ({searchTargets.youtubeChannels.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchTargets.youtubeChannels.map(({ channel, url }) => {
                      const Icon = CONTENT_TYPE_ICONS[channel.contentType] || Video;
                      return (
                        <a
                          key={channel.handle}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3.5 rounded-xl bg-[#070D1A] border border-slate-800 hover:border-rose-500/60 transition flex flex-col gap-2 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shrink-0">
                              <Youtube size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-white truncate">{channel.name}</div>
                              <div className="text-[10px] text-slate-400">{channel.subscribersApprox}</div>
                            </div>
                            <Icon size={14} className="text-slate-500 shrink-0" />
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{channel.specialties.join(' · ')}</p>
                          <span className="text-[11px] font-bold text-rose-400 group-hover:text-rose-300 inline-flex items-center gap-1">
                            {t.searchInChannel} {channel.name} <ExternalLink size={11} />
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-1.5">
                    <Globe size={14} /> {t.platformSearchHeading} ({searchTargets.externalPlatforms.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {searchTargets.externalPlatforms.map(({ platform, url }) => (
                      <a
                        key={platform.id}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl bg-[#070D1A] border border-slate-800 hover:border-teal-500/60 transition flex flex-col gap-2 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shrink-0">
                            <Globe size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white truncate">{platform.name}</div>
                            <div className="text-[10px] text-teal-400">{platform.contentCount}</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{platform.description}</p>
                        <span className="text-[11px] font-bold text-teal-400 group-hover:text-teal-300 inline-flex items-center gap-1">
                          {t.searchInChannel} {platform.name.split('—')[0].trim()} <ExternalLink size={11} />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Curated Verified Embedded Videos */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Play size={14} className="text-teal-400" /> {t.curatedHeading} ({filteredCurated.length})
                </h3>
                <div className="flex flex-wrap items-center gap-1.5">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-[#070D1A] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none"
                  >
                    <option value="ALL">{t.allSpecialties}</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {onSaveMedia && (
                    <button
                      type="button"
                      onClick={() => setOnlySaved((v) => !v)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer ${
                        onlySaved
                          ? 'bg-amber-500/20 border-amber-400/50 text-amber-200'
                          : 'bg-[#070D1A] border-slate-700 text-slate-300'
                      }`}
                    >
                      <Bookmark size={12} /> {t.savedOnly} ({savedMediaIds.length})
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCurated.map((media) => {
                  const isSaved = savedMediaIds.includes(media.id);
                  return (
                    <div
                      key={media.id}
                      className="rounded-xl bg-[#070D1A] border border-slate-800 hover:border-teal-500/50 overflow-hidden flex flex-col transition"
                    >
                      <div
                        className="relative aspect-video bg-slate-900 cursor-pointer group"
                        onClick={() => (media.embedUrl ? setActiveVideo(media) : window.open(media.url, '_blank', 'noopener,noreferrer'))}
                      >
                        {media.thumbnailUrl ? (
                          <img
                            src={media.thumbnailUrl}
                            alt={media.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-teal-400">
                            <Globe size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-center justify-center">
                          <div className="w-11 h-11 rounded-full bg-teal-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                            <Play size={18} className="ms-0.5" />
                          </div>
                        </div>
                        {media.duration && (
                          <span className="absolute bottom-2 end-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                            {media.duration}
                          </span>
                        )}
                        <span className="absolute top-2 start-2 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-bold text-teal-300">
                          {media.category}
                        </span>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{media.title}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{media.description}</p>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] text-slate-400 truncate">{media.author || media.institution}</span>
                          <div className="flex items-center gap-1.5">
                            {onSaveMedia && (
                              <button
                                type="button"
                                onClick={() => onSaveMedia(media.id)}
                                className={`p-1.5 rounded-lg border cursor-pointer ${
                                  isSaved
                                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                                }`}
                                title={t.savedOnly}
                              >
                                <Bookmark size={12} />
                              </button>
                            )}
                            {onOpenThreadForMedia && (
                              <button
                                type="button"
                                onClick={() => onOpenThreadForMedia(media.id, media.title)}
                                className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-teal-300 cursor-pointer"
                                title={t.discussCase}
                              >
                                <MessageSquare size={12} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => (media.embedUrl ? setActiveVideo(media) : window.open(media.url, '_blank', 'noopener,noreferrer'))}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0D9488] hover:bg-teal-600 text-white text-[11px] font-bold cursor-pointer"
                            >
                              <Play size={11} /> {t.watchVideo}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* === TAB 2: 10 VERIFIED SURGICAL YOUTUBE CHANNELS === */}
        {activeTab === 'channels' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-white">{t.browseChannels} ({SURGICAL_YOUTUBE_CHANNELS.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SURGICAL_YOUTUBE_CHANNELS.map((channel) => (
                <div
                  key={channel.handle}
                  className="rounded-xl bg-[#070D1A] border border-slate-800 p-4 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white shrink-0">
                        <Youtube size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{channel.name}</div>
                        <div className="text-[11px] text-rose-400 font-semibold">
                          {channel.subscribersApprox} · {channel.contentType.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{channel.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {channel.specialties.slice(0, 4).map((spec) => {
                        const SpecIcon = SPECIALTY_ICONS[spec] || Stethoscope;
                        return (
                          <span
                            key={spec}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-semibold"
                          >
                            <SpecIcon size={10} /> {spec}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                    >
                      <ExternalLink size={12} /> {t.visitChannel}
                    </a>
                    {query.trim() && (
                      <a
                        href={`${channel.searchUrlTemplate}${encodeURIComponent(query.trim() + ' surgery')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold"
                      >
                        <Search size={11} /> "{query.trim()}"
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {SURGICAL_PLAYLISTS.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <ListVideo size={14} className="text-rose-400" /> {t.playlistHeading}
                </h4>
                <div className="flex flex-wrap gap-3">
                  {SURGICAL_PLAYLISTS.map((pl) => (
                    <a
                      key={pl.url}
                      href={pl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#070D1A] border border-slate-800 hover:border-rose-500/50 text-xs font-bold text-white"
                    >
                      <Youtube size={16} className="text-rose-500" />
                      <span>{pl.name}</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* === TAB 3: EXTERNAL SURGICAL PLATFORMS === */}
        {activeTab === 'platforms' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">{t.browsePlatforms} ({EXTERNAL_SURGICAL_PLATFORMS.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXTERNAL_SURGICAL_PLATFORMS.map((platform) => (
                <div
                  key={platform.id}
                  className="rounded-xl bg-[#070D1A] border border-slate-800 p-4 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-teal-900 flex items-center justify-center text-white shrink-0">
                        <Globe size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white">{platform.name}</div>
                        <div className="text-[11px] text-teal-400 font-semibold">{platform.contentCount}</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{platform.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {platform.specialties.slice(0, 6).map((spec) => (
                        <span key={spec} className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-semibold">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={
                      query.trim()
                        ? platform.searchUrlPattern.replace('%s', encodeURIComponent(query.trim()))
                        : platform.baseUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0D9488] hover:bg-teal-600 text-white text-xs font-bold"
                  >
                    <ExternalLink size={12} /> {query.trim() ? `${t.searchInChannel} ${platform.name.split('—')[0].trim()}` : t.visitPlatform}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === TAB 4: ATLAS 3D 147-STRUCTURE EXPLORER === */}
        {activeTab === 'atlas' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Brain size={16} className="text-violet-400" /> {t.atlasIntegration}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{t.clickStructure}</p>
              </div>
            </div>

            {query.trim() && atlasSearchResults.length > 0 && (
              <p className="text-xs text-teal-300 font-semibold">
                {t.searchStructure}: "{query.trim()}" ({atlasSearchResults.length})
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(query.trim() ? atlasSearchResults : UNIFIED_ANATOMICAL_CATALOG.slice(0, 48)).map((structure) => (
                <StructureVideoCard key={structure.id} structure={structure} language={language} />
              ))}
            </div>

            {!query.trim() && (
              <div className="rounded-xl border border-dashed border-slate-700 bg-[#070D1A] p-3 text-center text-xs text-slate-400">
                + {UNIFIED_ANATOMICAL_CATALOG.length - 48} more anatomical structures — type in the search box above to filter all {UNIFIED_ANATOMICAL_CATALOG.length} structures.
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER DISCLAIMER */}
      <div className="px-5 py-3 border-t border-slate-800 bg-[#070D1A] text-center text-[11px] text-slate-400">
        {t.disclaimer}
      </div>

      {/* INLINE VIDEO PLAYER MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#101C32] border border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{activeVideo.title}</h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {activeVideo.author || activeVideo.institution} · {activeVideo.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="aspect-video bg-black">
              {activeVideo.embedUrl && (
                <iframe
                  src={activeVideo.embedUrl}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 bg-[#070D1A]">
              <p className="text-xs text-slate-300 flex-1 min-w-[200px]">{activeVideo.description}</p>
              <a
                href={activeVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D9488] hover:bg-teal-600 text-white text-xs font-bold shrink-0"
              >
                <ExternalLink size={12} /> {t.openOnYouTube}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function StructureVideoCard({
  structure,
  language,
}: {
  structure: (typeof UNIFIED_ANATOMICAL_CATALOG)[0];
  language: SupportedLanguage;
}) {
  const t = I18N[language] || I18N.en;
  const [expanded, setExpanded] = useState(false);
  const videoResults = useMemo(() => getStructureVideoResults(structure.id), [structure.id]);

  return (
    <div
      onClick={() => setExpanded((v) => !v)}
      className="rounded-xl bg-[#070D1A] border border-slate-800 hover:border-slate-600 overflow-hidden cursor-pointer transition"
    >
      <div className="p-3 flex items-center gap-2.5">
        <span
          className="w-4 h-4 rounded shrink-0"
          style={{ backgroundColor: structure.color || '#334155' }}
        />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-white truncate">{structure.label}</div>
          <div className="text-[10px] text-slate-400">
            {structure.category} · {videoResults?.relatedProcedures.length || 0} {t.procedures}
          </div>
        </div>
        <ChevronRight size={14} className={`text-slate-400 transition ${expanded ? 'rotate-90' : ''}`} />
      </div>

      {expanded && videoResults && (
        <div className="px-3 pb-3 pt-2 border-t border-slate-800 space-y-2">
          {videoResults.relatedProcedures.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase text-violet-300">{t.procedures}</div>
              {videoResults.relatedProcedures.map((proc) => (
                <div key={proc.id} className="text-[11px] text-slate-200 flex items-center gap-1.5">
                  <Stethoscope size={10} className="text-violet-400 shrink-0" />
                  <span>{proc.names[language as keyof typeof proc.names] || proc.names.en}</span>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase text-rose-400">YouTube Channels</div>
            {videoResults.youtubeSearchLinks.slice(0, 4).map(({ channel, url }) => (
              <a
                key={channel.handle}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block text-[11px] text-rose-300 hover:text-rose-200 truncate"
              >
                → {channel.name}
              </a>
            ))}
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase text-teal-400">{t.tabPlatforms}</div>
            {videoResults.externalSearchLinks.map(({ platform, url }) => (
              <a
                key={platform.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block text-[11px] text-teal-300 hover:text-teal-200 truncate"
              >
                → {platform.name.split('—')[0].trim()} ({platform.contentCount})
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBadge({
  value,
  label,
  icon: Icon,
  color,
}: {
  value: string | number;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070D1A]"
      style={{ border: `1px solid ${color}40` }}
    >
      <Icon size={14} style={{ color }} />
      <span className="text-xs font-extrabold" style={{ color }}>
        {value}
      </span>
      <span className="text-[11px] text-slate-400">{label}</span>
    </div>
  );
}

export default VisualLibraryV4;
