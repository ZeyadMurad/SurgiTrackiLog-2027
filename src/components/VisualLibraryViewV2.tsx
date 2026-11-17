// ============================================================================
// VisualLibraryViewV2.tsx — Updated Visual Library with REAL thumbnails
// ----------------------------------------------------------------------------
// Fixes:
//   1. Real thumbnails from public CDNs (WeBSurg, CTSNet, YouTube, MedTube, etc.)
//   2. Fallback to category-specific gradient (not plain black) when image fails
//   3. Direct deep-link to video (not platform home)
//   4. Additional platforms (OPMED, SAGES, EAES, JOMI, VestraSurg, CSL, SurgicalTheatre, GastroAtlas)
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Search,
  Play,
  ExternalLink,
  Eye,
  Bookmark,
  Images,
  Stethoscope,
  Brain,
  Bone,
  Heart as HeartIcon,
  Activity,
  Baby,
  Armchair,
  TrendingUp,
  Video,
  FileText,
  X,
  Globe,
  AlertTriangle,
  PlayCircle,
  RefreshCw,
} from 'lucide-react';
import type {
  VisualMedia,
  MediaCategory,
  MediaType,
  MediaSource,
  SupportedLanguage,
} from '../types/newTypes';
import {
  CURATED_VISUAL_MEDIA_V2,
  ALL_EXTERNAL_SOURCES,
  getDirectVideoUrl,
  getThumbnailWithFallback,
} from '../lib/externalPlatformsV2';
import { ANATOMICAL_SYSTEMS } from '../lib/externalPlatforms';

// ============================================================================
// REUSE i18n from original VisualLibraryView (kept identical)
// ============================================================================

const I18N = {
  en: {
    title: 'Visual Library',
    subtitle: 'Browse surgical videos, images, and lectures from global platforms',
    searchPlaceholder: 'Search by procedure, specialty, or anatomy…',
    allCategories: 'All Specialties',
    allSystems: 'All Systems',
    allTypes: 'All Types',
    allSources: 'All Sources',
    featured: 'Featured',
    browseBySource: 'Browse by Source',
    addMedia: 'Add Media',
    noResults: 'No media found matching your filters.',
    externalContent: 'External',
    viewOnSource: 'View video on original platform',
    watchNow: 'Watch Now',
    embedNotAvailable: 'Embedded playback not available. Click below to view on the original platform.',
    searchingExternal: 'Searching external platforms…',
    searchExternal: 'Search External',
    save: 'Save',
    saved: 'Saved',
    likes: 'Likes',
    views: 'Views',
    duration: 'Duration',
    author: 'Author',
    institution: 'Institution',
    graphicWarning: 'This media contains graphic surgical content.',
    linkedToThread: 'Open discussion about this media',
    directVideoLink: 'Open this video directly',
    categories: {
      'Cardiac Surgery': 'Cardiac Surgery',
      'Thoracic Surgery': 'Thoracic Surgery',
      'Vascular Surgery': 'Vascular Surgery',
      'General Surgery': 'General Surgery',
      'Orthopedic Surgery': 'Orthopedic Surgery',
      'Neurosurgery': 'Neurosurgery',
      'Plastic Surgery': 'Plastic Surgery',
      'Pediatric Surgery': 'Pediatric Surgery',
      'Transplant Surgery': 'Transplant Surgery',
      'Trauma Surgery': 'Trauma Surgery',
      'Minimally Invasive Surgery': 'MIS',
      'Robotic Surgery': 'Robotic',
      'Endoscopic Surgery': 'Endoscopic',
      'Other': 'Other',
    },
  },
  ar: {
    title: 'المكتبة المرئية',
    subtitle: 'تصفّح فيديوهات وصور ومحاضرات جراحية من منصات عالمية',
    searchPlaceholder: 'ابحث بالإجراء، التخصص، أو التشريح…',
    allCategories: 'كل التخصصات',
    allSystems: 'كل الأجهزة',
    allTypes: 'كل الأنواع',
    allSources: 'كل المصادر',
    featured: 'مميّز',
    browseBySource: 'تصفّح حسب المصدر',
    addMedia: 'أضف محتوى',
    noResults: 'لا توجد نتائج مطابقة لفلترتك.',
    externalContent: 'خارجي',
    viewOnSource: 'شاهد الفيديو على المنصة الأصلية',
    watchNow: 'شاهد الآن',
    embedNotAvailable: 'التشغيل المضمّن غير متاح. اضغط أدناه للعرض على المنصة الأصلية.',
    searchingExternal: 'جارٍ البحث في المنصات الخارجية…',
    searchExternal: 'بحث خارجي',
    save: 'حفظ',
    saved: 'محفوظ',
    likes: 'إعجابات',
    views: 'مشاهدات',
    duration: 'المدة',
    author: 'المؤلف',
    institution: 'المؤسسة',
    graphicWarning: 'هذا المحتوى يحتوي على مشاهد جراحية صريحة.',
    linkedToThread: 'افتح مناقشة حول هذا المحتوى',
    directVideoLink: 'افتح الفيديو مباشرة',
    categories: {
      'Cardiac Surgery': 'جراحة القلب',
      'Thoracic Surgery': 'جراحة الصدر',
      'Vascular Surgery': 'جراحة الأوعية',
      'General Surgery': 'جراحة عامة',
      'Orthopedic Surgery': 'جراحة العظام',
      'Neurosurgery': 'جراحة الأعصاب',
      'Plastic Surgery': 'جراحة التجميل',
      'Pediatric Surgery': 'جراحة الأطفال',
      'Transplant Surgery': 'جراحة الزراعة',
      'Trauma Surgery': 'جراحة الإصابات',
      'Minimally Invasive Surgery': 'الجراحة قليلة التوغل',
      'Robotic Surgery': 'الجراحة الروبوتية',
      'Endoscopic Surgery': 'الجراحة بالمنظار',
      'Other': 'أخرى',
    },
  },
  de: {
    title: 'Mediathek',
    subtitle: 'Durchsuchen Sie chirurgische Videos, Bilder und Vorträge von globalen Plattformen',
    searchPlaceholder: 'Suche nach Eingriff, Fachgebiet oder Anatomie…',
    allCategories: 'Alle Fachgebiete',
    allSystems: 'Alle Systeme',
    allTypes: 'Alle Typen',
    allSources: 'Alle Quellen',
    featured: 'Empfohlen',
    browseBySource: 'Nach Quelle durchsuchen',
    addMedia: 'Medien hinzufügen',
    noResults: 'Keine Medien gefunden.',
    externalContent: 'Extern',
    viewOnSource: 'Video auf Originalplattform ansehen',
    watchNow: 'Jetzt ansehen',
    embedNotAvailable: 'Eingebettete Wiedergabe nicht verfügbar. Klicken Sie unten.',
    searchingExternal: 'Externe Plattformen werden durchsucht…',
    searchExternal: 'Externe Suche',
    save: 'Speichern',
    saved: 'Gespeichert',
    likes: 'Likes',
    views: 'Aufrufe',
    duration: 'Dauer',
    author: 'Autor',
    institution: 'Institution',
    graphicWarning: 'Dieses Medium enthält grafische chirurgische Inhalte.',
    linkedToThread: 'Diskussion zu diesem Medium eröffnen',
    directVideoLink: 'Video direkt öffnen',
    categories: {
      'Cardiac Surgery': 'Herzchirurgie',
      'Thoracic Surgery': 'Thoraxchirurgie',
      'Vascular Surgery': 'Gefäßchirurgie',
      'General Surgery': 'Allgemeinchirurgie',
      'Orthopedic Surgery': 'Orthopädie',
      'Neurosurgery': 'Neurochirurgie',
      'Plastic Surgery': 'Plastische Chirurgie',
      'Pediatric Surgery': 'Kinderchirurgie',
      'Transplant Surgery': 'Transplantationschirurgie',
      'Trauma Surgery': 'Unfallchirurgie',
      'Minimally Invasive Surgery': 'MIC',
      'Robotic Surgery': 'Robotik',
      'Endoscopic Surgery': 'Endoskopie',
      'Other': 'Andere',
    },
  },
} as const;

type Lang = keyof typeof I18N;

const CATEGORY_ICONS: Record<MediaCategory, React.ElementType> = {
  'Cardiac Surgery': HeartIcon,
  'Thoracic Surgery': Activity,
  'Vascular Surgery': TrendingUp,
  'General Surgery': Stethoscope,
  'Orthopedic Surgery': Bone,
  'Neurosurgery': Brain,
  'Plastic Surgery': Armchair,
  'Pediatric Surgery': Baby,
  'Transplant Surgery': Activity,
  'Trauma Surgery': AlertTriangle,
  'Minimally Invasive Surgery': Video,
  'Robotic Surgery': Armchair,
  'Endoscopic Surgery': Video,
  'Other': Images,
};

const MEDIA_TYPE_ICONS: Record<MediaType, React.ElementType> = {
  video: PlayCircle,
  image: Images,
  animation: Activity,
  article: FileText,
  lecture: FileText,
  case_presentation: Stethoscope,
};

// ============================================================================
// Main component (uses new V2 data)
// ============================================================================

export interface VisualLibraryViewV2Props {
  language: Lang;
  currentUserId: string;
  savedMediaIds?: string[];
  onSaveMedia?: (mediaId: string) => Promise<void>;
  onIncrementView?: (mediaId: string) => Promise<void>;
  onOpenThreadForMedia?: (mediaId: string, title: string) => void;
  /** Optional callback when user clicks refresh — re-fetches news/cases/stories */
  onRefresh?: () => Promise<void>;
}

export const VisualLibraryViewV2: React.FC<VisualLibraryViewV2Props> = ({
  language,
  currentUserId,
  savedMediaIds = [],
  onSaveMedia,
  onIncrementView,
  onOpenThreadForMedia,
  onRefresh,
}) => {
  const t = I18N[language];
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'all'>('all');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<MediaSource | 'all'>('all');
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [openedMedia, setOpenedMedia] = useState<VisualMedia | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use the V2 curated media (with real thumbnails) — replace the V1 seed
  const allMedia = useMemo(() => CURATED_VISUAL_MEDIA_V2, []);

  const filteredMedia = useMemo(() => {
    let list = [...allMedia];

    if (selectedCategory !== 'all') {
      list = list.filter(m => m.category === selectedCategory);
    }
    if (selectedSystem !== 'all') {
      list = list.filter(
        m => m.anatomicalSystem?.toLowerCase().includes(selectedSystem.toLowerCase())
      );
    }
    if (selectedSource !== 'all') {
      list = list.filter(m => m.source === selectedSource);
    }
    if (selectedType !== 'all') {
      list = list.filter(m => m.mediaType === selectedType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q) ||
          m.procedureName?.toLowerCase().includes(q) ||
          m.tags.some(tg => tg.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allMedia, searchQuery, selectedCategory, selectedSystem, selectedSource, selectedType]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const openMedia = (media: VisualMedia) => {
    setOpenedMedia(media);
    if (onIncrementView) onIncrementView(media.id);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        padding: '1.5rem',
        maxWidth: '1440px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Images size={28} className="text-purple-600" />
            {t.title}
            <button
              onClick={handleRefresh}
              title="Refresh"
              style={{
                background: 'transparent',
                border: '1px solid #cbd5e1',
                borderRadius: '0.375rem',
                padding: '0.375rem',
                cursor: 'pointer',
                color: '#475569',
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '0.5rem',
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </h1>
          <p style={{ color: '#475569', marginTop: '0.25rem', fontSize: '0.95rem' }}>{t.subtitle}</p>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {filteredMedia.length} {language === 'ar' ? 'عنصر' : 'items'} · {ALL_EXTERNAL_SOURCES.length} {language === 'ar' ? 'منصة عالمية' : 'global platforms'}
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 320px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: isRtl ? 'auto' : '0.75rem',
              right: isRtl ? '0.75rem' : 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{
              width: '100%',
              padding: '0.75rem 2.75rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value as MediaCategory | 'all')}
          style={{ padding: '0.625rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
        >
          <option value="all">{t.allCategories}</option>
          {(Object.keys(t.categories) as MediaCategory[]).map(c => (
            <option key={c} value={c}>
              {t.categories[c]}
            </option>
          ))}
        </select>

        <select
          value={selectedSystem}
          onChange={e => setSelectedSystem(e.target.value)}
          style={{ padding: '0.625rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
        >
          <option value="all">{t.allSystems}</option>
          {ANATOMICAL_SYSTEMS.map(sys => (
            <option key={sys.id} value={sys.id}>
              {sys[language] || sys.en}
            </option>
          ))}
        </select>

        <select
          value={selectedSource}
          onChange={e => setSelectedSource(e.target.value as MediaSource | 'all')}
          style={{ padding: '0.625rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
        >
          <option value="all">{t.allSources}</option>
          {ALL_EXTERNAL_SOURCES.map(s => (
            <option key={s.id} value={s.id}>
              {s.displayName}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as MediaType | 'all')}
          style={{ padding: '0.625rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
        >
          <option value="all">{t.allTypes}</option>
          <option value="video">Video</option>
          <option value="image">Image</option>
          <option value="animation">Animation</option>
          <option value="article">Article</option>
          <option value="lecture">Lecture</option>
          <option value="case_presentation">Case</option>
        </select>
      </div>

      {/* Browse by source — featured platforms (with logos) */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
          borderRadius: '0.75rem',
          marginBottom: '1.5rem',
          border: '1px solid #ddd6fe',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#5b21b6', margin: '0 0 0.75rem 0' }}>
          {t.browseBySource}
        </h3>
        <div style={{ display: 'flex', gap: '0.625rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {ALL_EXTERNAL_SOURCES.map(source => (
            <a
              key={source.id}
              href={
                source.searchUrl
                  ? source.searchUrl.replace('%s', encodeURIComponent(searchQuery || 'surgery'))
                  : source.baseUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0.875rem',
                background: 'white',
                border: '1px solid #d8b4fe',
                borderRadius: '0.5rem',
                color: '#6b21a8',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {source.logoUrl ? (
                <img
                  src={source.logoUrl}
                  alt=""
                  style={{ width: '16px', height: '16px', borderRadius: '2px' }}
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Globe size={14} />
              )}
              {source.displayName}
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>

      {/* Media grid */}
      {filteredMedia.length === 0 ? (
        <div
          style={{
            padding: '3rem 1rem',
            textAlign: 'center',
            background: 'white',
            border: '1px dashed #cbd5e1',
            borderRadius: '0.75rem',
          }}
        >
          <Images size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
          <p style={{ color: '#64748b', fontSize: '1rem' }}>{t.noResults}</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {filteredMedia.map(media => (
            <MediaCardV2
              key={media.id}
              media={media}
              language={language}
              currentUserId={currentUserId}
              saved={savedMediaIds.includes(media.id)}
              onOpen={() => openMedia(media)}
              onSave={onSaveMedia}
              onOpenThread={onOpenThreadForMedia}
            />
          ))}
        </div>
      )}

      {/* Media modal */}
      {openedMedia && (
        <MediaModalV2
          media={openedMedia}
          language={language}
          currentUserId={currentUserId}
          saved={savedMediaIds.includes(openedMedia.id)}
          onSave={onSaveMedia}
          onOpenThread={onOpenThreadForMedia}
          onClose={() => setOpenedMedia(null)}
        />
      )}
    </div>
  );
};

// ============================================================================
// MediaCardV2 — Uses real thumbnails with gradient fallback
// ============================================================================

interface MediaCardV2Props {
  media: VisualMedia;
  language: Lang;
  currentUserId: string;
  saved: boolean;
  onOpen: () => void;
  onSave?: (mediaId: string) => Promise<void>;
  onOpenThread?: (mediaId: string, title: string) => void;
}

const MediaCardV2: React.FC<MediaCardV2Props> = ({
  media,
  language,
  currentUserId,
  saved,
  onOpen,
  onSave,
  onOpenThread,
}) => {
  const t = I18N[language];
  const [imageError, setImageError] = useState(false);
  const Icon = CATEGORY_ICONS[media.category];
  const TypeIcon = MEDIA_TYPE_ICONS[media.mediaType];
  const thumbnail = getThumbnailWithFallback(media);

  // Gradient fallback background
  const cardBg = imageError || thumbnail.isGradient
    ? thumbnail.gradient
    : undefined;

  return (
    <div
      onClick={onOpen}
      style={{
        background: 'white',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Thumbnail with REAL image + gradient fallback */}
      <div
        style={{
          position: 'relative',
          height: '180px',
          background: cardBg || '#f1f5f9', // Light gray placeholder (NOT black)
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {thumbnail.url && !imageError ? (
          <img
            src={thumbnail.url}
            alt={media.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              setImageError(true);
            }}
            loading="lazy"
          />
        ) : (
          // Gradient fallback with type icon (NOT black background)
          <div
            style={{
              width: '100%',
              height: '100%',
              background: cardBg || thumbnail.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <TypeIcon size={48} style={{ color: 'rgba(255,255,255,0.8)' }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 500 }}>
              {media.source.toUpperCase()}
            </span>
          </div>
        )}

        {/* Play overlay for videos */}
        {media.mediaType === 'video' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Play size={20} className="text-purple-700" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Duration badge */}
        {media.duration && (
          <div
            style={{
              position: 'absolute',
              bottom: '0.5rem',
              insetInlineEnd: '0.5rem',
              padding: '0.125rem 0.5rem',
              background: 'rgba(0,0,0,0.85)',
              color: 'white',
              fontSize: '0.75rem',
              borderRadius: '0.25rem',
              fontWeight: 600,
            }}
          >
            {media.duration}
          </div>
        )}

        {/* External badge */}
        {media.isExternal && (
          <div
            style={{
              position: 'absolute',
              top: '0.5rem',
              insetInlineStart: '0.5rem',
              padding: '0.25rem 0.5rem',
              background: 'rgba(124, 58, 237, 0.95)',
              color: 'white',
              fontSize: '0.7rem',
              borderRadius: '0.25rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <Globe size={10} />
            {media.source.toUpperCase()}
          </div>
        )}

        {/* Warning badge */}
        {media.warningContent && (
          <div
            style={{
              position: 'absolute',
              top: '0.5rem',
              insetInlineEnd: '0.5rem',
              padding: '0.25rem 0.5rem',
              background: 'rgba(220, 38, 38, 0.95)',
              color: 'white',
              fontSize: '0.7rem',
              borderRadius: '0.25rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <AlertTriangle size={10} />
            +18
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '0.875rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category chip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.5rem',
            background: '#f1f5f9',
            color: '#475569',
            borderRadius: '0.25rem',
            fontSize: '0.7rem',
            fontWeight: 500,
            marginBottom: '0.5rem',
            alignSelf: 'flex-start',
          }}
        >
          <Icon size={11} />
          {t.categories[media.category]}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#0f172a',
            margin: '0 0 0.375rem 0',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {media.title}
        </h3>

        {/* Author */}
        {media.author && (
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>
            {media.author}
            {media.institution ? ` · ${media.institution}` : ''}
          </p>
        )}

        {/* Tags */}
        {media.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {media.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                style={{
                  padding: '0.125rem 0.375rem',
                  background: '#f1f5f9',
                  color: '#475569',
                  borderRadius: '0.25rem',
                  fontSize: '0.7rem',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'auto',
            paddingTop: '0.5rem',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <Eye size={12} /> {media.viewsCount || 0}
          </span>

          {onSave && (
            <button
              onClick={e => {
                e.stopPropagation();
                onSave(media.id);
              }}
              style={{
                background: saved ? '#fef3c7' : 'transparent',
                border: 'none',
                color: saved ? '#d97706' : '#94a3b8',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
              }}
            >
              <Bookmark size={14} fill={saved ? '#d97706' : 'none'} />
              {saved ? t.saved : t.save}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MediaModalV2 — With real thumbnails and direct deep-link to video
// ============================================================================

interface MediaModalV2Props {
  media: VisualMedia;
  language: Lang;
  currentUserId: string;
  saved: boolean;
  onSave?: (mediaId: string) => Promise<void>;
  onOpenThread?: (mediaId: string, title: string) => void;
  onClose: () => void;
}

const MediaModalV2: React.FC<MediaModalV2Props> = ({
  media,
  language,
  currentUserId,
  saved,
  onSave,
  onOpenThread,
  onClose,
}) => {
  const t = I18N[language];
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const thumbnail = getThumbnailWithFallback(media);

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
        style={{
          background: 'white',
          borderRadius: '0.75rem',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            position: 'sticky',
            top: 0,
            background: 'white',
            zIndex: 1,
            borderRadius: '0.75rem 0.75rem 0 0',
          }}
        >
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0, flex: 1, paddingRight: '1rem' }}>
            {media.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#475569',
              padding: '0.375rem',
              borderRadius: '0.375rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Video/embed area — Show thumbnail with play overlay, then load iframe on click */}
        <div style={{ position: 'relative', background: '#0f172a', aspectRatio: '16/9', maxHeight: '60vh' }}>
          {media.warningContent && !embedLoaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '1rem',
              }}
            >
              <AlertTriangle size={48} className="text-red-500" />
              <p style={{ marginTop: '0.75rem', fontSize: '0.95rem' }}>{t.graphicWarning}</p>
              <button
                onClick={() => setEmbedLoaded(true)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}
              >
                {language === 'ar' ? 'عرض المحتوى' : language === 'de' ? 'Inhalt anzeigen' : 'View Content'}
              </button>
            </div>
          )}

          {media.embedUrl && (!media.warningContent || embedLoaded) ? (
            <iframe
              src={media.embedUrl}
              title={media.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            // Show real thumbnail with play overlay
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: imageError ? thumbnail.gradient : '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (media.externalSourceUrl) {
                  window.open(media.externalSourceUrl, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {thumbnail.url && !imageError ? (
                <img
                  src={thumbnail.url}
                  alt={media.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  onError={() => setImageError(true)}
                />
              ) : null}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  color: 'white',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Play size={32} className="text-purple-700" fill="currentColor" />
                </div>
                <p style={{ fontSize: '0.875rem', textAlign: 'center', padding: '0 1rem' }}>
                  {t.embedNotAvailable}
                </p>
                <a
                  href={getDirectVideoUrl(media)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.625rem 1.25rem',
                    background: '#7c3aed',
                    color: 'white',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <ExternalLink size={14} />
                  {t.directVideoLink}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {media.description && (
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {media.description}
            </p>
          )}

          {/* Meta grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.75rem',
              padding: '0.875rem 1rem',
              background: '#f8fafc',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            {media.procedureName && (
              <MetaItem label={language === 'ar' ? 'الإجراء' : 'Procedure'} value={media.procedureName} />
            )}
            {media.anatomicalSystem && (
              <MetaItem label={language === 'ar' ? 'الجهاز' : 'System'} value={media.anatomicalSystem} />
            )}
            {media.author && <MetaItem label={t.author} value={media.author} />}
            {media.institution && <MetaItem label={t.institution} value={media.institution} />}
            {media.duration && <MetaItem label={t.duration} value={media.duration} />}
            {media.publicationDate && (
              <MetaItem
                label={language === 'ar' ? 'النشر' : 'Published'}
                value={new Date(media.publicationDate).toLocaleDateString()}
              />
            )}
          </div>

          {/* Tags */}
          {media.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {media.tags.map(tag => (
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

          {/* Actions — DIRECT deep-link to video (not platform home) */}
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            {/* This opens the specific video URL directly on the source platform */}
            <a
              href={getDirectVideoUrl(media)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.625rem 1rem',
                background: '#7c3aed',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <Play size={14} />
              {t.watchNow}
            </a>

            {onSave && (
              <button
                onClick={() => onSave(media.id)}
                style={{
                  padding: '0.625rem 1rem',
                  background: saved ? '#fef3c7' : 'white',
                  color: saved ? '#d97706' : '#475569',
                  border: `1px solid ${saved ? '#fde68a' : '#cbd5e1'}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <Bookmark size={14} fill={saved ? '#d97706' : 'none'} />
                {saved ? t.saved : t.save}
              </button>
            )}

            {onOpenThread && (
              <button
                onClick={() => onOpenThread(media.id, media.title)}
                style={{
                  padding: '0.625rem 1rem',
                  background: 'white',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <Stethoscope size={14} />
                {t.linkedToThread}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetaItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 500 }}>{value}</div>
  </div>
);

export default VisualLibraryViewV2;
