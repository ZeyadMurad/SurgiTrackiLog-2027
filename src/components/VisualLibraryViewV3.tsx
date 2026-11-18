// ============================================================================
// VisualLibraryViewV3.tsx — Fixed Visual Library with REAL video links
// ----------------------------------------------------------------------------
// FIXES:
// 1. All videos have verified YouTube IDs — clicking opens the EXACT video
// 2. YouTube videos can be embedded directly in the app (iframe)
// 3. Removed fake platforms (OPMED, EAES, VestraSurg, JOMI, CSL, SurgicalTheatre, GastroAtlas)
// 4. Only real, working platforms kept: YouTube + WeBSurg + CTSNet
// 5. When user searches, falls back to YouTube search with direct deep-link
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
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
  Youtube,
} from 'lucide-react';
import type {
  VisualMedia,
  MediaCategory,
  MediaType,
  MediaSource,
  SupportedLanguage,
} from '../types/newTypes';
import {
  VERIFIED_VISUAL_MEDIA,
  VERIFIED_EXTERNAL_SOURCES,
  extractYouTubeId,
  buildYouTubeSearchUrl,
} from '../lib/visualLibraryVerified';

const I18N = {
  en: {
    title: 'Visual Library',
    subtitle: 'Browse surgical videos, animations, and lectures from verified sources',
    searchPlaceholder: 'Search by procedure, specialty, or anatomy…',
    allCategories: 'All Specialties',
    allTypes: 'All Types',
    allSources: 'All Sources',
    browseBySource: 'Browse by Source',
    noResults: 'No media found matching your filters.',
    externalContent: 'External',
    watchOnYouTube: 'Watch on YouTube',
    watchInApp: 'Play in App',
    noVideoFound: 'No specific video found. Search YouTube for this procedure:',
    searchYouTube: 'Search YouTube for this procedure',
    save: 'Save',
    saved: 'Saved',
    views: 'views',
    duration: 'Duration',
    author: 'Author',
    institution: 'Institution',
    graphicWarning: 'This media contains graphic surgical content.',
    viewContent: 'View Content',
    animations: 'Animations',
    videos: 'Videos',
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
    subtitle: 'تصفّح فيديوهات ورسوم متحركة ومحاضرات جراحية من مصادر مُتحقق منها',
    searchPlaceholder: 'ابحث بالإجراء، التخصص، أو التشريح…',
    allCategories: 'كل التخصصات',
    allTypes: 'كل الأنواع',
    allSources: 'كل المصادر',
    browseBySource: 'تصفّح حسب المصدر',
    noResults: 'لا توجد نتائج مطابقة لفلترتك.',
    externalContent: 'خارجي',
    watchOnYouTube: 'شاهد على يوتيوب',
    watchInApp: 'شغّل في التطبيق',
    noVideoFound: 'لم يتم العثور على فيديو محدد. ابحث في يوتيوب عن هذا الإجراء:',
    searchYouTube: 'ابحث في يوتيوب عن هذا الإجراء',
    save: 'حفظ',
    saved: 'محفوظ',
    views: 'مشاهدات',
    duration: 'المدة',
    author: 'المؤلف',
    institution: 'المؤسسة',
    graphicWarning: 'هذا المحتوى يحتوي على مشاهد جراحية صريحة.',
    viewContent: 'عرض المحتوى',
    animations: 'الرسوم المتحركة',
    videos: 'الفيديوهات',
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
    subtitle: 'Chirurgische Videos, Animationen und Vorträge von verifizierten Quellen',
    searchPlaceholder: 'Suche nach Eingriff, Fachgebiet oder Anatomie…',
    allCategories: 'Alle Fachgebiete',
    allTypes: 'Alle Typen',
    allSources: 'Alle Quellen',
    browseBySource: 'Nach Quelle durchsuchen',
    noResults: 'Keine Medien gefunden.',
    externalContent: 'Extern',
    watchOnYouTube: 'Auf YouTube ansehen',
    watchInApp: 'In App abspielen',
    noVideoFound: 'Kein spezifisches Video gefunden. Auf YouTube suchen:',
    searchYouTube: 'Auf YouTube suchen',
    save: 'Speichern',
    saved: 'Gespeichert',
    views: 'Aufrufe',
    duration: 'Dauer',
    author: 'Autor',
    institution: 'Institution',
    graphicWarning: 'Grafische chirurgische Inhalte.',
    viewContent: 'Inhalt anzeigen',
    animations: 'Animationen',
    videos: 'Videos',
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

// ============================================================================
// Main Component
// ============================================================================

export interface VisualLibraryViewV3Props {
  language: Lang;
  currentUserId: string;
  savedMediaIds?: string[];
  onSaveMedia?: (mediaId: string) => Promise<void>;
  onIncrementView?: (mediaId: string) => Promise<void>;
  onOpenThreadForMedia?: (mediaId: string, title: string) => void;
  initialQuery?: string;
}

export const VisualLibraryViewV3: React.FC<VisualLibraryViewV3Props> = ({
  language,
  currentUserId,
  savedMediaIds = [],
  onSaveMedia,
  onIncrementView,
  onOpenThreadForMedia,
  initialQuery = '',
}) => {
  const t = I18N[language] || I18N.en;
  const isRtl = language === 'ar';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'all'>('all');
  const [selectedSource, setSelectedSource] = useState<MediaSource | 'all'>('all');
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [openedMedia, setOpenedMedia] = useState<VisualMedia | null>(null);

  // Use the VERIFIED media list (only real videos with working deep links)
  const allMedia = useMemo(() => VERIFIED_VISUAL_MEDIA, []);

  const filteredMedia = useMemo(() => {
    let list = [...allMedia];

    if (selectedCategory !== 'all') {
      list = list.filter(m => m.category === selectedCategory);
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
  }, [allMedia, searchQuery, selectedCategory, selectedSource, selectedType]);

  const openMedia = (media: VisualMedia) => {
    setOpenedMedia(media);
    if (onIncrementView) onIncrementView(media.id);
  };

  // When no media found, show a YouTube search button as fallback
  const youTubeSearchUrl = searchQuery.trim()
    ? buildYouTubeSearchUrl(searchQuery)
    : null;

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
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#0f172a',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <Images size={28} className="text-purple-600" />
          {t.title}
        </h1>
        <p style={{ color: '#475569', marginTop: '0.25rem', fontSize: '0.95rem' }}>{t.subtitle}</p>
        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          {filteredMedia.length} {language === 'ar' ? 'عنصر' : 'items'} · {VERIFIED_EXTERNAL_SOURCES.length} {language === 'ar' ? 'منصات مُتحقق منها' : 'verified sources'}
        </p>
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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value as MediaCategory | 'all')}
          style={{ padding: '0.625rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
        >
          <option value="all">{t.allCategories}</option>
          {(Object.keys(t.categories) as MediaCategory[]).map(c => (
            <option key={c} value={c}>{t.categories[c]}</option>
          ))}
        </select>

        <select
          value={selectedSource}
          onChange={e => setSelectedSource(e.target.value as MediaSource | 'all')}
          style={{ padding: '0.625rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
        >
          <option value="all">{t.allSources}</option>
          {VERIFIED_EXTERNAL_SOURCES.map(s => (
            <option key={s.id} value={s.id}>{s.displayName}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as MediaType | 'all')}
          style={{ padding: '0.625rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
        >
          <option value="all">{t.allTypes}</option>
          <option value="video">{t.videos}</option>
          <option value="animation">{t.animations}</option>
          <option value="image">Image</option>
          <option value="article">Article</option>
          <option value="lecture">Lecture</option>
          <option value="case_presentation">Case</option>
        </select>
      </div>

      {/* Browse by source */}
      <div style={{
        padding: '1rem 1.25rem',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderRadius: '0.75rem',
        marginBottom: '1.5rem',
        border: '1px solid #fde68a',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#92400e', margin: '0 0 0.75rem 0' }}>
          {t.browseBySource}
        </h3>
        <div style={{ display: 'flex', gap: '0.625rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {VERIFIED_EXTERNAL_SOURCES.map(source => (
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
                border: '1px solid #fcd34d',
                borderRadius: '0.5rem',
                color: '#92400e',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {source.id === 'youtubesurg' ? <Youtube size={14} /> : <Globe size={14} />}
              {source.displayName}
              <ExternalLink size={10} />
            </a>
          ))}
        </div>
      </div>

      {/* Media grid OR fallback YouTube search */}
      {filteredMedia.length === 0 ? (
        <div style={{
          padding: '2rem 1rem',
          textAlign: 'center',
          background: 'white',
          border: '1px dashed #cbd5e1',
          borderRadius: '0.75rem',
        }}>
          <Images size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1rem' }}>{t.noResults}</p>
          {youTubeSearchUrl && (
            <a
              href={youTubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                background: '#dc2626',
                color: 'white',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
              }}
            >
              <Youtube size={18} />
              {t.searchYouTube}
            </a>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {filteredMedia.map(media => (
            <MediaCardV3
              key={media.id}
              media={media}
              language={language}
              saved={savedMediaIds.includes(media.id)}
              onOpen={() => openMedia(media)}
              onSave={onSaveMedia}
              onOpenThread={onOpenThreadForMedia}
            />
          ))}
        </div>
      )}

      {/* Media modal with embedded YouTube player */}
      {openedMedia && (
        <MediaModalV3
          media={openedMedia}
          language={language}
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
// MediaCardV3 — Uses real YouTube thumbnails
// ============================================================================

interface MediaCardV3Props {
  media: VisualMedia;
  language: Lang;
  saved: boolean;
  onOpen: () => void;
  onSave?: (mediaId: string) => Promise<void>;
  onOpenThread?: (mediaId: string, title: string) => void;
}

const MediaCardV3: React.FC<MediaCardV3Props> = ({
  media,
  language,
  saved,
  onOpen,
  onSave,
  onOpenThread,
}) => {
  const t = I18N[language] || I18N.en;
  const Icon = CATEGORY_ICONS[media.category];
  const thumbnailUrl = media.thumbnailUrl;

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
      {/* Thumbnail */}
      <div style={{
        position: 'relative',
        height: '180px',
        background: '#f1f5f9',
        overflow: 'hidden',
      }}>
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={media.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            onError={e => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#94a3b8',
            gap: '0.5rem',
          }}>
            <Globe size={32} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{media.source.toUpperCase()}</span>
          </div>
        )}

        {/* Play overlay */}
        {media.mediaType === 'video' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255,0,0,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Play size={20} color="white" fill="white" />
            </div>
          </div>
        )}

        {/* Duration badge */}
        {media.duration && (
          <div style={{
            position: 'absolute',
            bottom: '0.5rem',
            insetInlineEnd: '0.5rem',
            padding: '0.125rem 0.5rem',
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            fontSize: '0.75rem',
            borderRadius: '0.25rem',
            fontWeight: 600,
          }}>
            {media.duration}
          </div>
        )}

        {/* YouTube badge */}
        {media.source === 'youtubesurg' && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            insetInlineStart: '0.5rem',
            padding: '0.25rem 0.5rem',
            background: 'rgba(220, 38, 38, 0.95)',
            color: 'white',
            fontSize: '0.7rem',
            borderRadius: '0.25rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}>
            <Youtube size={10} />
            YouTube
          </div>
        )}

        {/* Warning badge */}
        {media.warningContent && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            insetInlineEnd: '0.5rem',
            padding: '0.25rem 0.5rem',
            background: 'rgba(220, 38, 38, 0.95)',
            color: 'white',
            fontSize: '0.7rem',
            borderRadius: '0.25rem',
            fontWeight: 600,
          }}>
            +18
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '0.875rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
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
        }}>
          <Icon size={11} />
          {t.categories[media.category]}
        </div>

        <h3 style={{
          fontSize: '0.95rem',
          fontWeight: 600,
          color: '#0f172a',
          margin: '0 0 0.375rem 0',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {media.title}
        </h3>

        {media.author && (
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>
            {media.author}
            {media.institution ? ` · ${media.institution}` : ''}
          </p>
        )}

        {media.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            {media.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                padding: '0.125rem 0.375rem',
                background: '#f1f5f9',
                color: '#475569',
                borderRadius: '0.25rem',
                fontSize: '0.7rem',
              }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: '0.5rem',
          borderTop: '1px solid #f1f5f9',
        }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
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
// MediaModalV3 — Embedded YouTube player (works directly in app!)
// ============================================================================

interface MediaModalV3Props {
  media: VisualMedia;
  language: Lang;
  saved: boolean;
  onSave?: (mediaId: string) => Promise<void>;
  onOpenThread?: (mediaId: string, title: string) => void;
  onClose: () => void;
}

const MediaModalV3: React.FC<MediaModalV3Props> = ({
  media,
  language,
  saved,
  onSave,
  onOpenThread,
  onClose,
}) => {
  const t = I18N[language] || I18N.en;
  const [showContent, setShowContent] = useState(!media.warningContent);

  // Extract YouTube ID for embedding
  const youtubeId = media.source === 'youtubesurg' ? extractYouTubeId(media.url) : null;
  const canEmbed = !!youtubeId && !!media.embedUrl;

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
        }}
      >
        {/* Header */}
        <div style={{
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
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: 0, flex: 1, paddingRight: '1rem' }}>
            {media.title}
          </h2>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#475569',
            padding: '0.375rem',
            borderRadius: '0.375rem',
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Video area */}
        <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9', maxHeight: '60vh' }}>
          {/* Content warning overlay */}
          {media.warningContent && !showContent && (
            <div style={{
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
            }}>
              <AlertTriangle size={48} className="text-red-500" />
              <p style={{ marginTop: '0.75rem', fontSize: '0.95rem' }}>{t.graphicWarning}</p>
              <button
                onClick={() => setShowContent(true)}
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
                {t.viewContent}
              </button>
            </div>
          )}

          {/* YouTube iframe (works directly in app — YouTube allows embedding!) */}
          {canEmbed && showContent ? (
            <iframe
              src={media.embedUrl}
              title={media.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : showContent ? (
            // For non-YouTube videos (WeBSurg, CTSNet) — open in new tab
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'white',
              padding: '1.5rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #7c2d12 0%, #1e293b 100%)',
            }}>
              <Globe size={48} style={{ opacity: 0.6 }} />
              <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
                {language === 'ar' ? 'هذا الفيديو متاح على المنصة الأصلية فقط' : language === 'de' ? 'Dieses Video ist nur auf der Originalplattform verfügbar' : 'This video is only available on the original platform'}
              </p>
              <a
                href={media.externalSourceUrl || media.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: '#7c3aed',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <ExternalLink size={16} />
                {language === 'ar' ? 'افتح الفيديو على المنصة الأصلية' : language === 'de' ? 'Video öffnen' : 'Open Video on Original Platform'}
              </a>
            </div>
          ) : null}
        </div>

        {/* Details */}
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {media.description && (
            <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {media.description}
            </p>
          )}

          {/* Meta grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            background: '#f8fafc',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
          }}>
            {media.procedureName && <MetaItem label={language === 'ar' ? 'الإجراء' : 'Procedure'} value={media.procedureName} />}
            {media.author && <MetaItem label={t.author} value={media.author} />}
            {media.institution && <MetaItem label={t.institution} value={media.institution} />}
            {media.duration && <MetaItem label={t.duration} value={media.duration} />}
          </div>

          {/* Tags */}
          {media.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {media.tags.map(tag => (
                <span key={tag} style={{
                  padding: '0.25rem 0.625rem',
                  background: '#e0e7ff',
                  color: '#3730a3',
                  borderRadius: '0.25rem',
                  fontSize: '0.8rem',
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions — DIRECT deep-link to the EXACT video */}
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <a
              href={media.externalSourceUrl || media.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.625rem 1rem',
                background: media.source === 'youtubesurg' ? '#dc2626' : '#7c3aed',
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
              {media.source === 'youtubesurg' ? <Youtube size={14} /> : <Play size={14} />}
              {media.source === 'youtubesurg' ? t.watchOnYouTube : (language === 'ar' ? 'شاهد على المنصة الأصلية' : 'Watch on Original Platform')}
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
                {language === 'ar' ? 'افتح مناقشة' : language === 'de' ? 'Diskussion' : 'Open Discussion'}
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

export default VisualLibraryViewV3;
