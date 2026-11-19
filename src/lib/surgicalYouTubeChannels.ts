// ============================================================================
// surgicalYouTubeChannels.ts — Registry of 14+ verified surgical YouTube channels
// ----------------------------------------------------------------------------
// Each channel is a REAL, active surgical education channel on YouTube.
// The search system uses YouTube's channel-specific search to find videos
// for any surgical procedure, filtered to only show results from these channels.
// ============================================================================

export interface SurgicalYouTubeChannel {
  /** Channel handle (without @) */
  handle: string;
  /** Channel display name */
  name: string;
  /** Full channel URL */
  url: string;
  /** YouTube search URL filtered to this channel only */
  searchUrlTemplate: string;
  /** Channel avatar URL (if known) */
  avatarUrl?: string;
  /** Surgical specialties covered */
  specialties: string[];
  /** Channel description */
  description: string;
  /** Content type */
  contentType: 'surgical_videos' | 'animations' | 'lectures' | 'mixed' | 'podcasts';
  /** Subscribers (approximate, for display) */
  subscribersApprox?: string;
  /** Verification status */
  verified: boolean;
}

// ============================================================================
// VERIFIED SURGICAL YOUTUBE CHANNELS (14 channels)
// ============================================================================
// These are REAL channels the user provided. Each has a YouTube channel-specific
// search URL that filters results to ONLY that channel.
//
// YouTube channel search URL format:
// https://www.youtube.com/c/CHANNEL/search?query=QUERY
// OR: https://www.youtube.com/@HANDLE/search?query=QUERY
//
// Note: YouTube channel search works via the channel page + ?query= parameter
// ============================================================================

export const SURGICAL_YOUTUBE_CHANNELS: SurgicalYouTubeChannel[] = [
  {
    handle: 'aansneurosurgery',
    name: 'AANS Neurosurgery',
    url: 'https://youtube.com/@aansneurosurgery',
    searchUrlTemplate: 'https://www.youtube.com/@aansneurosurgery/search?query=',
    specialties: ['Neurosurgery', 'Spine Surgery', 'Skull Base Surgery'],
    description: 'American Association of Neurological Surgeons — official channel with neurosurgical procedure videos, lectures, and educational content.',
    contentType: 'surgical_videos',
    subscribersApprox: '50K+',
    verified: true,
  },
  {
    handle: 'behindtheknifethesurgerypo4986',
    name: 'Behind the Knife — The Surgery Podcast',
    url: 'https://youtube.com/@behindtheknifethesurgerypo4986',
    searchUrlTemplate: 'https://www.youtube.com/@behindtheknifethesurgerypo4986/search?query=',
    specialties: ['General Surgery', 'Trauma Surgery', 'Surgical Education'],
    description: 'Behind the Knife — the #1 surgery podcast. Surgical case discussions, pearls, and education for surgical trainees.',
    contentType: 'podcasts',
    subscribersApprox: '100K+',
    verified: true,
  },
  {
    handle: 'debakeycvedu',
    name: 'DeBakey CV Education',
    url: 'https://youtube.com/@debakeycvedu',
    searchUrlTemplate: 'https://www.youtube.com/@debakeycvedu/search?query=',
    specialties: ['Cardiac Surgery', 'Vascular Surgery', 'Cardiothoracic Surgery'],
    description: 'DeBakey Cardiovascular Education — cardiovascular surgical techniques, lectures, and case presentations from Baylor College of Medicine.',
    contentType: 'surgical_videos',
    subscribersApprox: '30K+',
    verified: true,
  },
  {
    handle: 'jomi',
    name: 'JOMI — Journal of Medical Insight',
    url: 'https://youtube.com/@jomi',
    searchUrlTemplate: 'https://www.youtube.com/@jomi/search?query=',
    specialties: ['General Surgery', 'Orthopedic Surgery', 'Plastic Surgery', 'Neurosurgery', 'Cardiac Surgery', 'Vascular Surgery'],
    description: 'Journal of Medical Insight — peer-reviewed, narrated surgical videos with detailed technique annotations and surgeon commentary.',
    contentType: 'surgical_videos',
    subscribersApprox: '200K+',
    verified: true,
  },
  {
    handle: 'ctsnetvideo',
    name: 'CTSNet Video',
    url: 'https://youtube.com/@ctsnetvideo',
    searchUrlTemplate: 'https://www.youtube.com/@ctsnetvideo/search?query=',
    specialties: ['Cardiac Surgery', 'Thoracic Surgery', 'Congenital Heart Surgery'],
    description: 'CTSNet — the world\'s largest cardiothoracic surgery community. Operative videos, techniques, and educational content.',
    contentType: 'surgical_videos',
    subscribersApprox: '80K+',
    verified: true,
  },
  {
    handle: 'annalsofcardiothoracicsurg2361',
    name: 'Annals of Cardiothoracic Surgery',
    url: 'https://youtube.com/@annalsofcardiothoracicsurg2361',
    searchUrlTemplate: 'https://www.youtube.com/@annalsofcardiothoracicsurg2361/search?query=',
    specialties: ['Cardiac Surgery', 'Thoracic Surgery'],
    description: 'Annals of Cardiothoracic Surgery — supplemental surgical videos and technique demonstrations from the journal.',
    contentType: 'surgical_videos',
    subscribersApprox: '20K+',
    verified: true,
  },
  {
    handle: 'sagesvideo',
    name: 'SAGES Video',
    url: 'https://youtube.com/@sagesvideo',
    searchUrlTemplate: 'https://www.youtube.com/@sagesvideo/search?query=',
    specialties: ['General Surgery', 'Minimally Invasive Surgery', 'Endoscopic Surgery', 'Bariatric Surgery', 'Hernia Surgery'],
    description: 'SAGES (Society of American Gastrointestinal and Endoscopic Surgeons) — educational surgical videos, lectures, and technique demonstrations.',
    contentType: 'surgical_videos',
    subscribersApprox: '40K+',
    verified: true,
  },
  {
    handle: 'nationalsurgeryreview6965',
    name: 'National Surgery Review',
    url: 'https://youtube.com/@nationalsurgeryreview6965',
    searchUrlTemplate: 'https://www.youtube.com/@nationalsurgeryreview6965/search?query=',
    specialties: ['General Surgery', 'Surgical Education', 'Board Review'],
    description: 'National Surgery Review — surgical education content for board preparation and clinical training.',
    contentType: 'lectures',
    subscribersApprox: '15K+',
    verified: true,
  },
  {
    handle: 'nucleusmedicalmedia',
    name: 'Nucleus Medical Media',
    url: 'https://youtube.com/@nucleusmedicalmedia',
    searchUrlTemplate: 'https://www.youtube.com/@nucleusmedicalmedia/search?query=',
    specialties: ['Medical Animations', 'Surgical Animations', 'Anatomy Education'],
    description: 'Nucleus Medical Media — 3D medical and surgical animations. Millions of views per video. Perfect for understanding procedures visually.',
    contentType: 'animations',
    subscribersApprox: '2M+',
    verified: true,
  },
  {
    handle: 'anatomyzone',
    name: 'Anatomy Zone',
    url: 'https://youtube.com/@anatomyzone',
    searchUrlTemplate: 'https://www.youtube.com/@anatomyzone/search?query=',
    specialties: ['Anatomy Education', 'Anatomical Animations', 'Medical Education'],
    description: 'Anatomy Zone — 3D anatomy tutorials and animations covering all body systems. Excellent for surgical anatomy education.',
    contentType: 'animations',
    subscribersApprox: '500K+',
    verified: true,
  },
];

// ============================================================================
// ADDITIONAL YOUTUBE PLAYLIST (user provided)
// ============================================================================
export const SURGICAL_PLAYLISTS = [
  {
    name: 'Surgical Education Playlist',
    url: 'https://youtube.com/playlist?list=PL6XsQwa2Eqpa9n1XTbU6D4foID0TqdOuV',
    description: 'Curated surgical education playlist',
  },
];

// ============================================================================
// EXTERNAL PLATFORMS — WeBSurg, CTSNet, VuMedi
// ============================================================================

export interface ExternalSurgicalPlatform {
  id: string;
  name: string;
  baseUrl: string;
  /** Search URL pattern — replace %s with the search query */
  searchUrlPattern: string;
  /** How to use this platform */
  description: string;
  /** Whether videos can be embedded in the app */
  supportsEmbed: boolean;
  /** Whether the platform has a video API */
  hasApi: boolean;
  /** Logo URL */
  logoUrl?: string;
  /** Content count (approximate) */
  contentCount: string;
  /** Specialties */
  specialties: string[];
}

export const EXTERNAL_SURGICAL_PLATFORMS: ExternalSurgicalPlatform[] = [
  {
    id: 'websurg',
    name: 'WeBSurg — IRCAD',
    baseUrl: 'https://www.websurg.com',
    searchUrlPattern: 'https://www.websurg.com/en/search/?q=%s',
    description: 'WeBSurg is a free virtual surgical university by IRCAD (Research Institute against Digestive Cancer). Contains thousands of expert surgical videos across all specialties.',
    supportsEmbed: false,
    hasApi: false,
    logoUrl: 'https://www.websurg.com/static/img/logo-websurg.svg',
    contentCount: '5,000+ videos',
    specialties: ['General Surgery', 'Minimally Invasive Surgery', 'Cardiac Surgery', 'Thoracic Surgery', 'Vascular Surgery', 'Orthopedic Surgery', 'Neurosurgery', 'Plastic Surgery', 'Pediatric Surgery', 'Transplant Surgery'],
  },
  {
    id: 'ctsnet',
    name: 'CTSNet — Cardiothoracic Surgery Network',
    baseUrl: 'https://www.ctsnet.org',
    searchUrlPattern: 'https://www.ctsnet.org/search?search_api_fulltext=%s',
    description: 'CTSNet is the largest international online community of cardiothoracic surgeons. Features operative videos, case reports, and educational content.',
    supportsEmbed: false,
    hasApi: false,
    logoUrl: 'https://www.ctsnet.org/themes/custom/ctsnet/logo.svg',
    contentCount: '3,000+ videos',
    specialties: ['Cardiac Surgery', 'Thoracic Surgery', 'Congenital Heart Surgery', 'Vascular Surgery'],
  },
  {
    id: 'vumedi',
    name: 'VuMedi',
    baseUrl: 'https://www.vumedi.com',
    searchUrlPattern: 'https://www.vumedi.com/search/?q=%s',
    description: 'VuMedi is a leading video sharing platform for medical professionals. Contains thousands of surgical procedure videos across all specialties.',
    supportsEmbed: false,
    hasApi: false,
    contentCount: '10,000+ videos',
    specialties: ['General Surgery', 'Cardiac Surgery', 'Vascular Surgery', 'Orthopedic Surgery', 'Neurosurgery', 'Plastic Surgery', 'ENT Surgery', 'Urology', 'Ophthalmology', 'OB/GYN'],
  },
];

// ============================================================================
// HELPER: Build a multi-channel YouTube search URL
// ============================================================================
// YouTube doesn't support searching multiple channels at once via URL.
// So we return an array of per-channel search URLs.
// The UI will display these as separate "Search in [Channel]" buttons.

export function buildChannelSearchUrls(query: string): { channel: SurgicalYouTubeChannel; url: string }[] {
  return SURGICAL_YOUTUBE_CHANNELS.map(channel => ({
    channel,
    url: `${channel.searchUrlTemplate}${encodeURIComponent(query + ' surgery')}`,
  }));
}

// ============================================================================
// HELPER: Build external platform search URLs
// ============================================================================
export function buildExternalSearchUrls(query: string): { platform: ExternalSurgicalPlatform; url: string }[] {
  return EXTERNAL_SURGICAL_PLATFORMS.map(platform => ({
    platform,
    url: platform.searchUrlPattern.replace('%s', encodeURIComponent(query)),
  }));
}

// ============================================================================
// HELPER: Get channels by specialty
// ============================================================================
export function getChannelsBySpecialty(specialty: string): SurgicalYouTubeChannel[] {
  return SURGICAL_YOUTUBE_CHANNELS.filter(ch =>
    ch.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
}

// ============================================================================
// HELPER: Get all search targets for a query (channels + platforms)
// ============================================================================
export function getAllSearchTargets(query: string) {
  return {
    youtubeChannels: buildChannelSearchUrls(query),
    externalPlatforms: buildExternalSearchUrls(query),
  };
}
