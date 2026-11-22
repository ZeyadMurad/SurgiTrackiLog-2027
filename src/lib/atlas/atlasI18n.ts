import type { SupportedLanguage } from '../../types';

export type VisualizationMode = 'full' | 'holographic' | 'layers';
export type LabelingLevel = 1 | 2 | 3;
export type WorkspaceLayoutMode = 'body' | 'dual' | 'focus';
export type KnowledgeDomainId =
  | 'explorer'
  | 'relations'
  | 'vascular_nerve'
  | 'surgical_anatomy'
  | 'clinical_info'
  | 'medical_library'
  | 'model_lab'
  | 'learning_quiz'
  | 'procedures';

export interface AtlasCopy {
  brandTitle: string;
  brandSubtitle: string;
  searchPlaceholder: string;
  male: string;
  female: string;
  modeFull: string;
  modeHolographic: string;
  modeLayers: string;
  layoutBody: string;
  layoutDual: string;
  layoutFocus: string;
  returnFullBody: string;
  deepAnatomy: string;
  labelLevel: string;
  labelL1: string;
  labelL2: string;
  labelL3: string;
  labelOff: string;
  fullscreen: string;
  exitFullscreen: string;
  tabSystems: string;
  tabRegions: string;
  tabVascular: string;
  tabBodyParts: string;
  showAll: string;
  hideAll: string;
  resetView: string;
  isolate: string;
  unisolate: string;
  opacity: string;
  hide: string;
  show: string;
  moreDomains: string;
  lessDomains: string;
  loadingBody: string;
  loadingOrgan: string;
  loadingTigris: string;
  noSelectionTitle: string;
  noSelectionHint: string;
  vascularBanner: string;
  perspectives: {
    front: string;
    back: string;
    left: string;
    right: string;
    superior: string;
    inferior: string;
    medial: string;
    lateral: string;
    oblique: string;
  };
  domains: Record<KnowledgeDomainId, { label: string; shortLabel: string; description: string }>;
  dissectionTitle: string;
  dissectionSubtitle: string;
  dissectionLayers: Array<{ id: string; label: string; systems: string[] }>;
  sectionPlane: string;
  sectionReset: string;
  dimensionsLabel: string;
  meshLimitsNotice: string;
  bodyPartsVerifiedBadge: string;
  syncHighlightBody: string;
  openInLibrary: string;
  attribution: string;
  educationalNotice: string;
  quizStart: string;
  quizNext: string;
  quizScore: string;
  quizCorrect: string;
  quizIncorrect: string;
  quizHighlight3D: string;
}

const ATLAS_COPY: Record<SupportedLanguage, AtlasCopy> = {
  en: {
    brandTitle: 'Surgical Atlas 3D',
    brandSubtitle: 'BodyParts3D 4.3 · Holographic Surgical Workstation',
    searchPlaceholder: 'Search anatomy, vessels, FMA ID, or 3,210 BodyParts3D meshes...',
    male: 'Male',
    female: 'Female',
    modeFull: 'Full Anatomical',
    modeHolographic: 'Holographic Body',
    modeLayers: 'Layer-Based',
    layoutBody: 'Full Body',
    layoutDual: 'Dual View',
    layoutFocus: 'Organ Focus',
    returnFullBody: 'Return to Full Body',
    deepAnatomy: 'Deep Anatomy',
    labelLevel: 'Labels',
    labelL1: 'L1 Basic',
    labelL2: 'L2 Interm.',
    labelL3: 'L3 Surgical',
    labelOff: 'Off',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    tabSystems: 'Systems',
    tabRegions: 'Regions',
    tabVascular: 'Vascular',
    tabBodyParts: 'BP3D 4.3',
    showAll: 'Show All',
    hideAll: 'Hide All',
    resetView: 'Reset',
    isolate: 'Isolate',
    unisolate: 'Show Context',
    opacity: 'Opacity',
    hide: 'Hide',
    show: 'Show',
    moreDomains: 'More',
    lessDomains: 'Less',
    loadingBody: 'Loading full-body 3D anatomical workstation...',
    loadingOrgan: 'Initializing independent 3D organ viewer...',
    loadingTigris: 'Streaming BodyParts3D 4.3 meshes from Tigris S3...',
    noSelectionTitle: 'Full Human Anatomy Ready',
    noSelectionHint: 'Select any organ or blood vessel directly on the 3D body, from Systems, or from Vascular Priority to launch the Independent Organ Hub.',
    vascularBanner: 'Vascular Surgery Priority',
    perspectives: {
      front: 'Anterior',
      back: 'Posterior',
      left: 'Left',
      right: 'Right',
      superior: 'Superior',
      inferior: 'Inferior',
      medial: 'Medial',
      lateral: 'Lateral',
      oblique: 'Oblique',
    },
    domains: {
      explorer: { label: 'Anatomy Explorer', shortLabel: 'Explorer', description: 'Sub-structures & BodyParts3D components' },
      relations: { label: 'Anatomical Relations', shortLabel: 'Relations', description: 'Verified adjacent structures in 3D' },
      vascular_nerve: { label: 'Vascular & Nerve Supply', shortLabel: 'Vascular', description: 'Arterial, venous & neural supply' },
      surgical_anatomy: { label: 'Surgical Anatomy', shortLabel: 'Surgical', description: 'Landmarks, tissue planes & danger zones' },
      clinical_info: { label: 'Clinical Information', shortLabel: 'Clinical', description: 'Correlations, variations & FMA metadata' },
      medical_library: { label: 'Medical Library', shortLabel: 'Library', description: 'Verified surgical videos & references' },
      model_lab: { label: '3D Model Lab', shortLabel: '3D Lab', description: 'Dissection layers, section slice & Deep Mode' },
      learning_quiz: { label: 'Learning & Quiz', shortLabel: 'Quiz', description: 'Interactive surgical anatomy assessment' },
      procedures: { label: 'Related Procedures', shortLabel: 'Procedures', description: 'Operative approaches & video links' },
    },
    dissectionTitle: 'Surgical Dissection Sequence',
    dissectionSubtitle: 'Progressive reversible anatomical layer stripping',
    dissectionLayers: [
      { id: 'skin', label: '01. Skin & Integument', systems: ['skin'] },
      { id: 'muscles', label: '02. Fascia & Musculature', systems: ['muscles'] },
      { id: 'vessels', label: '03. Arterial & Venous Tree', systems: ['vessels'] },
      { id: 'nerves', label: '04. Neurovascular & Plexuses', systems: ['nerves'] },
      { id: 'organs', label: '05. Deep Viscera & Organs', systems: ['organs'] },
      { id: 'skeleton', label: '06. Skeletal & Joint Framework', systems: ['skeleton', 'joints'] },
    ],
    sectionPlane: 'Cross-Section Clipping',
    sectionReset: 'Clear Section',
    dimensionsLabel: 'Geometric Bounding Span',
    meshLimitsNotice: 'Macroscopic surface meshes — microscopic histology is not implied.',
    bodyPartsVerifiedBadge: 'BodyParts3D 4.3 · Tigris S3 Verified',
    syncHighlightBody: 'Highlight on Full Body',
    openInLibrary: 'Open in Visual Library',
    attribution: 'Geometry: BodyParts3D 4.3 © DBCLS (CC BY-SA 2.1 JP) & open-anatomy-3d / HuBMAP HRA (CC BY 4.0).',
    educationalNotice: 'Surgical anatomy education workstation — verify intraoperatively under attending supervision.',
    quizStart: 'Restart Assessment',
    quizNext: 'Next Question',
    quizScore: 'Score',
    quizCorrect: 'Verified Correct',
    quizIncorrect: 'Review Anatomy',
    quizHighlight3D: 'Inspect Structure in 3D',
  },
  ar: {
    brandTitle: 'الأطلس الجراحي 3D',
    brandSubtitle: 'BodyParts3D 4.3 · محطة التشريح الجراحي الهولوغرامية',
    searchPlaceholder: 'ابحث في الأعضاء، الأوعية الدموية، FMA، أو 3,210 مجسم BodyParts3D...',
    male: 'ذكر',
    female: 'أنثى',
    modeFull: 'تشريح كامل',
    modeHolographic: 'جسم هولوغرامي',
    modeLayers: 'طبقات تشريحية',
    layoutBody: 'الجسم الكامل',
    layoutDual: 'عرض مزدوج',
    layoutFocus: 'تركيز العضو',
    returnFullBody: 'العودة للجسم الكامل',
    deepAnatomy: 'التشريح العميق',
    labelLevel: 'التسميات',
    labelL1: 'م1 أساسي',
    labelL2: 'م2 متوسط',
    labelL3: 'م3 جراحي',
    labelOff: 'إخفاء',
    fullscreen: 'ملء الشاشة',
    exitFullscreen: 'إنهاء ملء الشاشة',
    tabSystems: 'الأنظمة',
    tabRegions: 'المناطق',
    tabVascular: 'الأوعية',
    tabBodyParts: 'BP3D 4.3',
    showAll: 'إظهار الكل',
    hideAll: 'إخفاء الكل',
    resetView: 'إعادة ضبط',
    isolate: 'عزل',
    unisolate: 'إظهار المحيط',
    opacity: 'الشفافية',
    hide: 'إخفاء',
    show: 'إظهار',
    moreDomains: 'المزيد',
    lessDomains: 'أقل',
    loadingBody: 'جارٍ تحميل محطة التشريح الثلاثي الأبعاد للجسم الكامل...',
    loadingOrgan: 'جارٍ تهيئة عارض العضو المستقل 3D...',
    loadingTigris: 'جارٍ جلب مجسمات BodyParts3D 4.3 من مخزن Tigris S3...',
    noSelectionTitle: 'منصة التشريح البشري الكامل جاهزة',
    noSelectionHint: 'اختر أي عضو أو وعاء دموي مباشرة على المجسم ثلاثي الأبعاد أو من الأنظمة أو أولوية جراحة الأوعية لفتح مركز العضو المستقل.',
    vascularBanner: 'أولوية جراحة الأوعية الدموية',
    perspectives: {
      front: 'أمامي',
      back: 'خلفي',
      left: 'أيسر',
      right: 'أيمن',
      superior: 'علوي',
      inferior: 'سفلي',
      medial: 'إنسي',
      lateral: 'وحشي',
      oblique: 'مائل',
    },
    domains: {
      explorer: { label: 'مستكشف التشريح', shortLabel: 'المستكشف', description: 'التراكيب الفرعية ومجسمات BodyParts3D' },
      relations: { label: 'العلاقات التشريحية', shortLabel: 'العلاقات', description: 'البنى المجاورة الموثقة ثلاثياً' },
      vascular_nerve: { label: 'التروية والأعصاب', shortLabel: 'الأوعية', description: 'التغذية الشريانية والوريدية والعصبية' },
      surgical_anatomy: { label: 'التشريح الجراحي', shortLabel: 'جراحي', description: 'المعالم والطبقات ومناطق الخطر' },
      clinical_info: { label: 'المعلومات السريرية', shortLabel: 'سريري', description: 'الارتباطات السريرية والاختلافات التشريحية' },
      medical_library: { label: 'المكتبة الطبية', shortLabel: 'المكتبة', description: 'الفيديوهات الجراحية والمراجع الموثقة' },
      model_lab: { label: 'مختبر النماذج 3D', shortLabel: 'المختبر', description: 'طبقات التشريح، المقطع العرضي والوضع العميق' },
      learning_quiz: { label: 'التعلم والاختبارات', shortLabel: 'الاختبار', description: 'اختبارات تفاعلية مرتبطة بالمجسم' },
      procedures: { label: 'الإجراءات الجراحية', shortLabel: 'العمليات', description: 'المداخل الجراحية وروابط العمليات' },
    },
    dissectionTitle: 'تسلسل التسليخ الجراحي التدريجي',
    dissectionSubtitle: 'كشف وإعادة الطبقات التشريحية بشكل عكوس',
    dissectionLayers: [
      { id: 'skin', label: '01. الجلد والنسيج السطحي', systems: ['skin'] },
      { id: 'muscles', label: '02. اللفافة والعضلات', systems: ['muscles'] },
      { id: 'vessels', label: '03. الشبكة الشريانية والوريدية', systems: ['vessels'] },
      { id: 'nerves', label: '04. الأعصاب والضفائر العصبية', systems: ['nerves'] },
      { id: 'organs', label: '05. الأحشاء والأعضاء العميقة', systems: ['organs'] },
      { id: 'skeleton', label: '06. الهيكل العظمي والمفاصل', systems: ['skeleton', 'joints'] },
    ],
    sectionPlane: 'القطع المقطعي العرضي',
    sectionReset: 'إلغاء المقطع',
    dimensionsLabel: 'الأبعاد الهندسية للمجسم',
    meshLimitsNotice: 'مجسمات سطحية عيانية — لا تدعي تفاصيل نسيجية مجهرية.',
    bodyPartsVerifiedBadge: 'BodyParts3D 4.3 · موثق من Tigris S3',
    syncHighlightBody: 'تحديد على الجسم الكامل',
    openInLibrary: 'فتح في المكتبة المرئية',
    attribution: 'المجسمات: BodyParts3D 4.3 © DBCLS (CC BY-SA 2.1 JP) و open-anatomy-3d / HuBMAP HRA (CC BY 4.0).',
    educationalNotice: 'محطة تعليمية للتشريح الجراحي — يجب دائماً الالتزام بإشراف الاستشاري وبروتوكولات غرفة العمليات.',
    quizStart: 'إعادة الاختبار',
    quizNext: 'السؤال التالي',
    quizScore: 'النتيجة',
    quizCorrect: 'إجابة صحيحة موثقة',
    quizIncorrect: 'راجع التشريح',
    quizHighlight3D: 'فحص البنية في 3D',
  },
  de: {
    brandTitle: 'Surgical Atlas 3D',
    brandSubtitle: 'BodyParts3D 4.3 · Holografische Chirurgie-Workstation',
    searchPlaceholder: 'Anatomie, Gefäße, FMA-ID oder 3.210 BodyParts3D-Meshes suchen...',
    male: 'Männlich',
    female: 'Weiblich',
    modeFull: 'Vollanatomie',
    modeHolographic: 'Hologramm',
    modeLayers: 'Schichtmodus',
    layoutBody: 'Ganzkörper',
    layoutDual: 'Dual-Ansicht',
    layoutFocus: 'Organ-Fokus',
    returnFullBody: 'Zurück zum Ganzkörper',
    deepAnatomy: 'Tiefenanatomie',
    labelLevel: 'Labels',
    labelL1: 'Stufe 1',
    labelL2: 'Stufe 2',
    labelL3: 'Stufe 3',
    labelOff: 'Aus',
    fullscreen: 'Vollbild',
    exitFullscreen: 'Beenden',
    tabSystems: 'Systeme',
    tabRegions: 'Regionen',
    tabVascular: 'Gefäße',
    tabBodyParts: 'BP3D 4.3',
    showAll: 'Alle zeigen',
    hideAll: 'Alle aus',
    resetView: 'Reset',
    isolate: 'Isolieren',
    unisolate: 'Kontext zeigen',
    opacity: 'Transparenz',
    hide: 'Ausblenden',
    show: 'Einblenden',
    moreDomains: 'Mehr',
    lessDomains: 'Weniger',
    loadingBody: '3D-Ganzkörper-Workstation wird geladen...',
    loadingOrgan: 'Unabhängiger 3D-Organviewer wird initialisiert...',
    loadingTigris: 'BodyParts3D 4.3 Meshes werden aus Tigris S3 geladen...',
    noSelectionTitle: 'Vollständige Humananatomie bereit',
    noSelectionHint: 'Wählen Sie ein Organ oder Gefäß direkt am 3D-Körper oder in der Navigation, um den unabhängigen Organ-Hub zu öffnen.',
    vascularBanner: 'Priorität Gefäßchirurgie',
    perspectives: {
      front: 'Anterior',
      back: 'Posterior',
      left: 'Links',
      right: 'Rechts',
      superior: 'Kranial',
      inferior: 'Kaudal',
      medial: 'Medial',
      lateral: 'Lateral',
      oblique: 'Schräg',
    },
    domains: {
      explorer: { label: 'Anatomie-Explorer', shortLabel: 'Explorer', description: 'Substrukturen & BodyParts3D-Komponenten' },
      relations: { label: 'Topografische Beziehungen', shortLabel: 'Relationen', description: 'Verifizierte Nachbarstrukturen in 3D' },
      vascular_nerve: { label: 'Gefäße & Innervation', shortLabel: 'Gefäße', description: 'Arterielle, venöse & nervale Versorgung' },
      surgical_anatomy: { label: 'Chirurgische Anatomie', shortLabel: 'Chirurgie', description: 'Landmarks, Schichten & Gefahrenzonen' },
      clinical_info: { label: 'Klinische Informationen', shortLabel: 'Klinik', description: 'Korrelationen, Varianten & FMA-Daten' },
      medical_library: { label: 'Medizinische Bibliothek', shortLabel: 'Bibliothek', description: 'Verifizierte OP-Videos & Referenzen' },
      model_lab: { label: '3D-Modell-Labor', shortLabel: '3D-Labor', description: 'Präparationsschichten, Schnitt & Tiefenmodus' },
      learning_quiz: { label: 'Lernen & Quiz', shortLabel: 'Quiz', description: 'Interaktives Chirurgie-Anatomie-Quiz' },
      procedures: { label: 'Verwandte Eingriffe', shortLabel: 'Eingriffe', description: 'Zugangswege & OP-Video-Links' },
    },
    dissectionTitle: 'Chirurgische Präparationsfolge',
    dissectionSubtitle: 'Reversible schichtweise Darstellung',
    dissectionLayers: [
      { id: 'skin', label: '01. Haut & Subkutis', systems: ['skin'] },
      { id: 'muscles', label: '02. Faszien & Muskulatur', systems: ['muscles'] },
      { id: 'vessels', label: '03. Arterien & Venen', systems: ['vessels'] },
      { id: 'nerves', label: '04. Nerven & Plexus', systems: ['nerves'] },
      { id: 'organs', label: '05. Tiefe Organe', systems: ['organs'] },
      { id: 'skeleton', label: '06. Skelett & Gelenke', systems: ['skeleton', 'joints'] },
    ],
    sectionPlane: 'Querschnitt-Ebene',
    sectionReset: 'Schnitt zurücksetzen',
    dimensionsLabel: 'Geometrische Abmessungen',
    meshLimitsNotice: 'Makroskopische Oberflächenmodelle — keine mikroskopische Histologie.',
    bodyPartsVerifiedBadge: 'BodyParts3D 4.3 · Tigris S3 Verifiziert',
    syncHighlightBody: 'Am Ganzkörper markieren',
    openInLibrary: 'In Mediathek öffnen',
    attribution: 'Geometrie: BodyParts3D 4.3 © DBCLS (CC BY-SA 2.1 JP) & open-anatomy-3d / HuBMAP HRA (CC BY 4.0).',
    educationalNotice: 'Chirurgisches Anatomie-Ausbildungssystem — klinische Entscheidungen obliegen dem Facharzt.',
    quizStart: 'Quiz neu starten',
    quizNext: 'Nächste Frage',
    quizScore: 'Ergebnis',
    quizCorrect: 'Korrekt verifiziert',
    quizIncorrect: 'Anatomie prüfen',
    quizHighlight3D: 'Struktur in 3D prüfen',
  },
};

export function getAtlasCopy(language: SupportedLanguage): AtlasCopy {
  return ATLAS_COPY[language] || ATLAS_COPY.en;
}

export const REGION_LABELS: Record<
  string,
  { en: string; ar: string; de: string; structureIds: string[] }
> = {
  head_neck: {
    en: 'Head & Neck',
    ar: 'الرأس والعنق',
    de: 'Kopf & Hals',
    structureIds: ['skull', 'brain', 'brainstem', 'carotid_l', 'carotid_r', 'thyroid', 'larynx', 'trachea', 'arteries_head'],
  },
  thorax: {
    en: 'Thorax & Mediastinum',
    ar: 'الصدر والمنصف',
    de: 'Thorax & Mediastinum',
    structureIds: ['heart', 'coronary_arteries', 'aorta', 'vena_cava_superior', 'lung_l', 'lung_r', 'esophagus', 'rib_cage', 'sternum', 'diaphragm', 'arteries_thorax', 'veins_thorax'],
  },
  abdomen: {
    en: 'Abdomen & Retroperitoneum',
    ar: 'البطن وخلف الصفاق',
    de: 'Abdomen & Retroperitoneum',
    structureIds: ['aorta', 'vena_cava_inferior', 'liver', 'gallbladder', 'stomach', 'spleen', 'pancreas', 'kidney_l', 'kidney_r', 'duodenum', 'small_intestine', 'colon', 'appendix', 'arteries_abdomen', 'veins_abdomen'],
  },
  pelvis: {
    en: 'Pelvis & Iliac Axis',
    ar: 'الحوض والمحور الحرقفي',
    de: 'Becken & Iliakalregion',
    structureIds: ['pelvis', 'bladder', 'ureter_l', 'ureter_r', 'rectum', 'uterus', 'prostate', 'arteries_pelvis', 'veins_pelvis'],
  },
  upper_limb: {
    en: 'Upper Extremity',
    ar: 'الطرف العلوي',
    de: 'Obere Extremität',
    structureIds: ['clavicle_l', 'clavicle_r', 'humerus_l', 'humerus_r', 'radius_l', 'ulna_l', 'arteries_arm_l', 'arteries_arm_r', 'veins_arm_l', 'veins_arm_r', 'shoulder_l', 'elbow_l', 'wrist_l'],
  },
  lower_limb: {
    en: 'Lower Extremity (Femoral · Popliteal · Tibial)',
    ar: 'الطرف السفلي (الفخذي · المأبضي · الظنبوبي)',
    de: 'Untere Extremität (Femoral · Popliteal · Tibial)',
    structureIds: ['femur_l', 'femur_r', 'tibia_l', 'tibia_r', 'arteries_leg_l', 'arteries_leg_r', 'veins_leg_l', 'veins_leg_r', 'hip_l', 'knee_l', 'ankle_l'],
  },
  spine: {
    en: 'Vertebral Column & Spinal Cord',
    ar: 'العمود الفقري والنخاع الشوكي',
    de: 'Wirbelsäule & Rückenmark',
    structureIds: ['spine', 'spinal_cord', 'sacrum', 'sciatic_l', 'sciatic_r'],
  },
};

export const SYSTEM_LOCALIZED: Record<string, { en: string; ar: string; de: string }> = {
  skin: { en: 'Integumentary (Skin)', ar: 'الجلد والنسيج السطحي', de: 'Integument (Haut)' },
  skeleton: { en: 'Skeletal System', ar: 'الجهاز الهيكلي العظمي', de: 'Skelettsystem' },
  joints: { en: 'Articular & Joints', ar: 'المفاصل والأربطة', de: 'Gelenke & Bänder' },
  muscles: { en: 'Muscular System', ar: 'الجهاز العضلي', de: 'Muskelsystem' },
  organs: { en: 'Visceral Organs', ar: 'الأعضاء والأحشاء', de: 'Innere Organe' },
  vessels: { en: 'Cardiovascular & Vessels', ar: 'الأوعية الدموية', de: 'Gefäßsystem' },
  nerves: { en: 'Nervous System', ar: 'الجهاز العصبي', de: 'Nervensystem' },
};
