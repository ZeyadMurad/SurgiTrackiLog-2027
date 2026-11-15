import type {
  CvTemplateConfig,
  CvTemplateId,
  CvColorScheme,
  CvLanguage,
} from '../types/newTypes';

export const CV_COLOR_SCHEMES: Record<
  CvColorScheme,
  { name: Record<CvLanguage, string>; primary: string; secondary: string }
> = {
  navy: {
    name: { en: 'Academic Navy', ar: 'أزرق أكاديمي داكن', de: 'Akademisches Marineblau' },
    primary: '#101C32',
    secondary: '#0D9488',
  },
  burgundy: {
    name: { en: 'Surgical Burgundy', ar: 'عنابي جراحي', de: 'Chirurgisches Burgund' },
    primary: '#7F1D1D',
    secondary: '#B45309',
  },
  forest: {
    name: { en: 'Clinical Forest', ar: 'أخضر سريري', de: 'Klinisches Tannengrün' },
    primary: '#064E3B',
    secondary: '#059669',
  },
  charcoal: {
    name: { en: 'Executive Charcoal', ar: 'رمادي فحمي', de: 'Anthrazit' },
    primary: '#1E293B',
    secondary: '#475569',
  },
  black: {
    name: { en: 'Classic Black', ar: 'أسود كلاسيكي', de: 'Klassisches Schwarz' },
    primary: '#0F172A',
    secondary: '#334155',
  },
};

export const CV_SECTION_LABELS: Record<string, Record<CvLanguage, string>> = {
  professional_summary: {
    en: 'Professional Summary',
    ar: 'الملخص المهني',
    de: 'Berufliches Profil',
  },
  clinical_experience: {
    en: 'Verified Operative & Clinical Portfolio',
    ar: 'الخبرة السريرية والعمليات الموثقة',
    de: 'Dokumentierte klinische & operative Erfahrung',
  },
  experience: {
    en: 'Surgical & Clinical Appointments',
    ar: 'الخبرة والمناصب الطبية',
    de: 'Berufliche Laufbahn',
  },
  education: {
    en: 'Education & Academic Degrees',
    ar: 'التعليم والمؤهلات الأكاديمية',
    de: 'Studium & Akademische Grade',
  },
  skills_matrix: {
    en: 'Surgical Skills & Competencies',
    ar: 'مصفوفة المهارات والكفاءات الجراحية',
    de: 'Chirurgische Fähigkeiten & Kompetenzen',
  },
  certifications: {
    en: 'Board Certifications & Licenses',
    ar: 'الشهادات المهنية والتراخيص',
    de: 'Zertifikate & Approbationen',
  },
  publications: {
    en: 'Peer-Reviewed Publications',
    ar: 'المنشورات والأبحاث العلمية',
    de: 'Wissenschaftliche Publikationen',
  },
  awards: {
    en: 'Honors & Awards',
    ar: 'الجوائز والتكريمات',
    de: 'Auszeichnungen & Stipendien',
  },
  languages: {
    en: 'Languages',
    ar: 'اللغات',
    de: 'Sprachkenntnisse',
  },
  memberships: {
    en: 'Society Memberships',
    ar: 'العضويات المهنية',
    de: 'Fachgesellschaften',
  },
  references: {
    en: 'Academic & Clinical References',
    ar: 'المراجع العلمية والمهنية',
    de: 'Referenzen',
  },
};

const ALL_SECTIONS = [
  'header',
  'professional_summary',
  'clinical_experience',
  'experience',
  'education',
  'skills_matrix',
  'certifications',
  'publications',
  'awards',
  'languages',
  'memberships',
  'references',
];

export const CV_TEMPLATES: CvTemplateConfig[] = [
  {
    id: 'academic_research',
    name: { en: 'Academic Research', ar: 'أكاديمي وبحثي', de: 'Akademisch & Forschung' },
    description: {
      en: 'Emphasizes publications, board certifications, clinical logbook stats, and teaching.',
      ar: 'يركز على الأبحاث المنشورة والشهادات وإحصائيات السجل الجراحي.',
      de: 'Fokus auf Publikationen, Facharztausbildung und Operationskatalog.',
    },
    pageMargins: { top: 0.65, bottom: 0.65, left: 0.7, right: 0.7 },
    fontFamily: 'Georgia, serif',
    fontSize: { base: 10, heading: 14 },
    useColorAccent: true,
    sections: [
      'header',
      'professional_summary',
      'education',
      'experience',
      'publications',
      'clinical_experience',
      'certifications',
      'skills_matrix',
      'awards',
      'languages',
      'references',
    ],
  },
  {
    id: 'clinical_consultant',
    name: { en: 'Clinical Consultant', ar: 'استشاري سريري', de: 'Oberarzt / Facharzt' },
    description: {
      en: 'Executive hospital leadership format highlighting surgical volume and subspecialty mastery.',
      ar: 'تصميم تنفيذي يبرز الخبرة القيادية وحجم العمليات الموثقة.',
      de: 'Führungsformat für Oberärzte mit Schwerpunkt auf Operationsvolumen.',
    },
    pageMargins: { top: 0.6, bottom: 0.6, left: 0.65, right: 0.65 },
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: { base: 10, heading: 14 },
    useColorAccent: true,
    sections: ALL_SECTIONS,
  },
  {
    id: 'resident_trainee',
    name: { en: 'Resident / Trainee', ar: 'طبيب مقيم / متدرب', de: 'Assistenzarzt' },
    description: {
      en: 'Ideal for surgical residency applications showcasing verified hours, rotations, and skills.',
      ar: 'مناسب لطلبات الإقامة والتدريب الجراحي مع إبراز ساعات التدريب والمهارات.',
      de: 'Ideal für Weiterbildungsassistenten mit Nachweis der Weiterbildungsstunden.',
    },
    pageMargins: { top: 0.6, bottom: 0.6, left: 0.65, right: 0.65 },
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: { base: 10, heading: 13.5 },
    useColorAccent: true,
    sections: [
      'header',
      'professional_summary',
      'clinical_experience',
      'skills_matrix',
      'experience',
      'education',
      'certifications',
      'publications',
      'languages',
      'references',
    ],
  },
  {
    id: 'international_fellowship',
    name: { en: 'International Fellowship', ar: 'زمالة دولية', de: 'Internationale Fellowship' },
    description: {
      en: 'Tailored for international fellowship committees with competency verification metrics.',
      ar: 'مصمم للتقديم على برامج الزمالة الدولية مع مؤشرات الكفاءة الموثقة.',
      de: 'Optimiert für internationale Fellowship-Bewerbungen.',
    },
    pageMargins: { top: 0.6, bottom: 0.6, left: 0.65, right: 0.65 },
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: { base: 10, heading: 14 },
    useColorAccent: true,
    sections: ALL_SECTIONS,
  },
  {
    id: 'minimal_one_page',
    name: { en: 'Minimal — One Page', ar: 'مختصر — صفحة واحدة', de: 'Kompakt (1 Seite)' },
    description: {
      en: 'Clean high-density layout focused on core credentials and operative metrics.',
      ar: 'تصميم مكثف وأنيق يركز على المؤهلات الأساسية والعمليات.',
      de: 'Klares, kompaktes Einseiten-Layout.',
    },
    pageMargins: { top: 0.5, bottom: 0.5, left: 0.55, right: 0.55 },
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: { base: 9.5, heading: 12.5 },
    useColorAccent: false,
    sections: [
      'header',
      'professional_summary',
      'experience',
      'clinical_experience',
      'education',
      'certifications',
      'skills_matrix',
      'languages',
    ],
  },
  {
    id: 'european_german',
    name: { en: 'European (German WBO Style)', ar: 'أوروبي (نظام ألماني)', de: 'Europäisch (ÄK-Standard)' },
    description: {
      en: 'Structured Lebenslauf format aligned with German Ärztekammer Weiterbildung standards.',
      ar: 'تنسيق سيرة ذاتية أوروبي متوافق مع معايير التدريب الألمانية.',
      de: 'Tabellarischer Lebenslauf gemäß Vorgaben der Landesärztekammern.',
    },
    pageMargins: { top: 0.65, bottom: 0.65, left: 0.7, right: 0.7 },
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: { base: 10, heading: 13.5 },
    useColorAccent: false,
    sections: [
      'header',
      'professional_summary',
      'experience',
      'education',
      'clinical_experience',
      'certifications',
      'skills_matrix',
      'publications',
      'languages',
      'references',
    ],
  },
  {
    id: 'arabic_classic',
    name: { en: 'Arabic Classic (RTL)', ar: 'عربي كلاسيكي (RTL)', de: 'Arabisch Klassisch (RTL)' },
    description: {
      en: 'Right-to-left structured medical curriculum vitae with clear hierarchical sections.',
      ar: 'سيرة ذاتية طبية عربية كلاسيكية متكاملة من اليمين إلى اليسار.',
      de: 'Klassischer medizinischer Lebenslauf mit RTL-Unterstützung.',
    },
    pageMargins: { top: 0.65, bottom: 0.65, left: 0.7, right: 0.7 },
    fontFamily: 'Tahoma, Arial, sans-serif',
    fontSize: { base: 10.5, heading: 14 },
    useColorAccent: true,
    sections: ALL_SECTIONS,
  },
  {
    id: 'modern_visual',
    name: { en: 'Modern Visual Portfolio', ar: 'حديث وبصري', de: 'Modernes Portfolio' },
    description: {
      en: 'Contemporary accent banner layout combining operative logbook metrics and narrative.',
      ar: 'تصميم عصري يجمع بين الشريط اللوني وإحصائيات السجل الجراحي.',
      de: 'Modernes Layout mit Farb-Header und Leistungsübersicht.',
    },
    pageMargins: { top: 0.6, bottom: 0.6, left: 0.65, right: 0.65 },
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: { base: 10, heading: 14 },
    useColorAccent: true,
    sections: ALL_SECTIONS,
  },
];

export function getDefaultTemplateForLanguage(language: CvLanguage): CvTemplateId {
  if (language === 'ar') return 'arabic_classic';
  if (language === 'de') return 'european_german';
  return 'clinical_consultant';
}
