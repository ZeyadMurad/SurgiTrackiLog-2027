import type { SupportedLanguage } from '../../types';
import type { UnifiedAnatomicalStructure } from '../surgicalAtlasCatalog';
import { getStructureById } from '../surgicalAtlasCatalog';

export interface LocalizedText {
  en: string;
  ar: string;
  de: string;
}

export interface AnatomicalRelationItem {
  targetId: string;
  targetName: LocalizedText;
  relationType: 'anterior' | 'posterior' | 'medial' | 'lateral' | 'superior' | 'inferior' | 'adjacent' | 'enclosed';
  description: LocalizedText;
}

export interface VascularNerveItem {
  name: LocalizedText;
  kind: 'arterial' | 'venous' | 'nerve' | 'lymphatic';
  highlightId?: string;
  bodyPartsQuery?: string;
  note: LocalizedText;
}

export interface SurgicalExposureItem {
  approachName: LocalizedText;
  landmarks: LocalizedText;
  planes: LocalizedText;
  structuresAtRisk: LocalizedText;
}

export interface StructureKnowledgeProfile {
  structureId: string;
  localizedName: LocalizedText;
  latinName: string;
  regionLabel: LocalizedText;
  isVascularPriority?: boolean;
  bodyPartsFmaId?: string;
  bodyPartsSearchQueries: string[];
  summary: LocalizedText;
  subStructures: Array<{
    name: LocalizedText;
    bodyPartsQuery?: string;
    role: LocalizedText;
  }>;
  relations: AnatomicalRelationItem[];
  vascularAndNerve: VascularNerveItem[];
  surgicalApproaches: SurgicalExposureItem[];
  clinicalCorrelations: LocalizedText[];
  anatomicalVariations: LocalizedText[];
  references: string[];
}

export const VASCULAR_PRIORITY_SHORTCUTS: Array<{
  id: string;
  label: LocalizedText;
  tag: string;
  bodyPartsQuery: string;
}> = [
  {
    id: 'aorta',
    label: { en: 'Thoracic & Abdominal Aorta', ar: 'الأبهر الصدري والبطني', de: 'Thorakale & Abdominelle Aorta' },
    tag: 'EVAR · TEVAR · Open AAA',
    bodyPartsQuery: 'aorta',
  },
  {
    id: 'coronary_arteries',
    label: { en: 'Coronary Arteries & Heart', ar: 'الشرايين التاجية والقلب', de: 'Koronararterien & Herz' },
    tag: 'LCA · LAD · RCA · CABG',
    bodyPartsQuery: 'coronary artery',
  },
  {
    id: 'carotid_r',
    label: { en: 'Carotid Bifurcation (R/L)', ar: 'الشريان السباتي وتفرعه', de: 'Karotisgabel (R/L)' },
    tag: 'CEA · CAS · CN X/XII',
    bodyPartsQuery: 'carotid',
  },
  {
    id: 'arteries_pelvis',
    label: { en: 'Iliac Arteries & Veins', ar: 'الأوعية الحرقفية', de: 'Iliakalgefäße' },
    tag: 'Common · External · Internal Iliac',
    bodyPartsQuery: 'iliac',
  },
  {
    id: 'arteries_leg_r',
    label: { en: 'Femoral, Popliteal & Tibial', ar: 'الفخذي والمأبضي والظنبوبي', de: 'Femoral · Popliteal · Tibial' },
    tag: 'Fem-Pop · Bypass · SFA',
    bodyPartsQuery: 'femoral artery',
  },
  {
    id: 'vena_cava_inferior',
    label: { en: 'IVC & Deep Venous Axis', ar: 'الوريد الأجوف السفلي والأوردة', de: 'V. cava inferior & Venen' },
    tag: 'IVC · Iliac · Saphenous',
    bodyPartsQuery: 'vena cava',
  },
];

export const KNOWLEDGE_PROFILES: Record<string, StructureKnowledgeProfile> = {
  heart: {
    structureId: 'heart',
    localizedName: { en: 'Heart', ar: 'القلب', de: 'Herz' },
    latinName: 'Cor',
    regionLabel: { en: 'Middle Mediastinum (Thorax)', ar: 'المنصف الأوسط (الصدر)', de: 'Mittleres Mediastinum (Thorax)' },
    isVascularPriority: true,
    bodyPartsFmaId: 'FMA9839',
    bodyPartsSearchQueries: ['coronary', 'atrium', 'ventricle', 'pulmonary trunk', 'arch of aorta'],
    summary: {
      en: 'Four-chambered fibromuscular pump within the pericardial sac of the middle mediastinum, supplying systemic circulation via the ascending aorta and coronary circulation via the aortic sinuses.',
      ar: 'عضو عضلي ليفي رباعي الحجرات داخل كيس التامور في المنصف الأوسط، يضخ الدم للدوران الجهازي عبر الأبهر الصاعد والدوران التاجي عبر الجيوب الأبهرية.',
      de: 'Vierkammrige fibromuskuläre Pumpe im Herzbeutel des mittleren Mediastinums mit Versorgung des großen Kreislaufs über die Aorta ascendens.',
    },
    subStructures: [
      {
        name: { en: 'Left & Right Atrium', ar: 'الأذين الأيسر والأيمن', de: 'Linker & Rechter Vorhof' },
        bodyPartsQuery: 'atrium',
        role: { en: 'Venous inflow chambers (SVC/IVC to RA, pulmonary veins to LA)', ar: 'حجرتا استقبال الوريدي الأجوف والأوردة الرئوية', de: 'Venöse Einstromkammern' },
      },
      {
        name: { en: 'Left & Right Ventricle', ar: 'البطين الأيسر والأيمن', de: 'Linker & Rechter Ventrikel' },
        bodyPartsQuery: 'ventricle',
        role: { en: 'Outflow chambers via pulmonary trunk & ascending aorta', ar: 'حجرتا الضخ إلى الجذع الرئوي والأبهر الصاعد', de: 'Ausstromkammern in Truncus pulmonalis & Aorta' },
      },
      {
        name: { en: 'Coronary Arterial Tree (RCA, LMCA, LAD, LCx)', ar: 'الشجرة التاجية (RCA, LMCA, LAD, LCx)', de: 'Koronararterien (RCA, LCA, RIVA, RCX)' },
        bodyPartsQuery: 'coronary artery',
        role: { en: 'Epicardial myocardial perfusion arising from aortic sinuses', ar: 'تروية عضلة القلب من الجيوب الأبهرية', de: 'Epikardiale Myokardperfusion' },
      },
      {
        name: { en: 'Coronary Sinus & Cardiac Veins', ar: 'الجيب الإكليلي والأوردة القلبية', de: 'Sinus coronarius & Herzvenen' },
        bodyPartsQuery: 'coronary sinus',
        role: { en: 'Venous drainage into the posterior right atrium', ar: 'التصريف الوريدي للقلب نحو الأذين الأيمن', de: 'Venöser Abfluss in den rechten Vorhof' },
      },
    ],
    relations: [
      {
        targetId: 'aorta',
        targetName: { en: 'Ascending Aorta & Arch', ar: 'الأبهر الصاعد والقوس الأبهرية', de: 'Aorta ascendens & Aortenbogen' },
        relationType: 'superior',
        description: { en: 'Originates from the left ventricular outflow tract superiorly and anteriorly.', ar: 'ينشأ من مخرج البطين الأيسر للأعلى والأمام.', de: 'Entspringt kranial aus dem linksventrikulären Ausflusstrakt.' },
      },
      {
        targetId: 'coronary_arteries',
        targetName: { en: 'Coronary Arteries', ar: 'الشرايين التاجية', de: 'Koronararterien' },
        relationType: 'adjacent',
        description: { en: 'Course within the atrioventricular and interventricular grooves.', ar: 'تسير داخل الأثلام الأذينية البطينية وبين البطينين.', de: 'Verlaufen im Sulcus coronarius und interventricularis.' },
      },
      {
        targetId: 'lung_l',
        targetName: { en: 'Left & Right Lungs', ar: 'الرئتان اليسرى واليمنى', de: 'Linke & Rechte Lunge' },
        relationType: 'lateral',
        description: { en: 'Cardiac notch of the left lung accommodates the cardiac apex; phrenic nerves run between pericardium and mediastinal pleura.', ar: 'تستوعب الثلمة القلبية للرئة اليسرى قمة القلب ويمر العصب الحجابي بين التامور والجنبة.', de: 'Incisura cardiaca links; N. phrenicus zwischen Perikard und Pleura.' },
      },
      {
        targetId: 'diaphragm',
        targetName: { en: 'Diaphragm (Central Tendon)', ar: 'الحجاب الحاجز (الوتر المركزي)', de: 'Zwerchfell (Centrum tendineum)' },
        relationType: 'inferior',
        description: { en: 'Inferior diaphragmatic surface rests directly on the central tendon.', ar: 'يستقر السطح السفلي للقلب مباشرة على الوتر المركزي للحجاب الحاجز.', de: 'Facies diaphragmatica ruht direkt auf dem Centrum tendineum.' },
      },
      {
        targetId: 'esophagus',
        targetName: { en: 'Thoracic Esophagus', ar: 'المريء الصدري', de: 'Thorakaler Ösophagus' },
        relationType: 'posterior',
        description: { en: 'Posterior to the left atrium (critical anatomical relation during TEE and left atrial ablation).', ar: 'يقع خلف الأذين الأيسر مباشرة (مهم في صدى المريء وكي الأذين).', de: 'Unmittelbar dorsal des linken Vorhofs (wichtig für TEE/Ablation).' },
      },
      {
        targetId: 'vena_cava_superior',
        targetName: { en: 'Superior & Inferior Vena Cava', ar: 'الوريد الأجوف العلوي والسفلي', de: 'Vena cava superior & inferior' },
        relationType: 'posterior',
        description: { en: 'Enter the superior and inferior posterior walls of the right atrium (cardiopulmonary bypass cannulation sites).', ar: 'تصبان في الجدار الخلفي العلوي والسفلي للأذين الأيمن (مواقع القثطرة المجازة القلبية).', de: 'Münden in den rechten Vorhof (Kanülierung für HLM).' },
      },
    ],
    vascularAndNerve: [
      {
        name: { en: 'Right Coronary Artery (RCA)', ar: 'الشريان التاجي الأيمن (RCA)', de: 'Rechte Koronararterie (RCA)' },
        kind: 'arterial',
        highlightId: 'coronary_arteries',
        bodyPartsQuery: 'right coronary artery',
        note: { en: 'Supplies SA node (~60%), AV node (~85–90%), right atrium, right ventricle & inferior LV wall.', ar: 'يروي العقدة الجيبية (~60%) والأذينية البطينية (~85-90%) والبطين الأيمن.', de: 'Versorgt Sinusknoten (~60%), AV-Knoten (~85-90%) & rechten Ventrikel.' },
      },
      {
        name: { en: 'Left Main, LAD & Circumflex (LMCA / LAD / LCx)', ar: 'الجذع الأيسر والأمامي النازل والمنعطف', de: 'Hauptstamm (LCA), RIVA (LAD) & RCX' },
        kind: 'arterial',
        highlightId: 'coronary_arteries',
        bodyPartsQuery: 'left coronary artery',
        note: { en: 'LAD supplies anterior LV wall, apex, and anterior two-thirds of the interventricular septum.', ar: 'يروي LAD الجدار الأمامي للبطين الأيسر والقمة وثلثي الحاجز بين البطينين.', de: 'RIVA versorgt Vorderwand, Apex und vorderes Septumdrittel.' },
      },
      {
        name: { en: 'Coronary Sinus & Great/Middle Cardiac Veins', ar: 'الجيب الإكليلي والأوردة القلبية', de: 'Sinus coronarius & V. cardiaca magna' },
        kind: 'venous',
        bodyPartsQuery: 'coronary sinus',
        note: { en: 'Collects ~85% of myocardial venous return into the right atrium below the fossa ovalis.', ar: 'يجمع معظم العود الوريدي العضلي إلى الأذين الأيمن.', de: 'Sammelt Großteil des myokardialen venösen Rückflusses.' },
      },
      {
        name: { en: 'Cardiac Plexus (Vagus CN X & Sympathetic T1–T4)', ar: 'الضفيرة القلبية (المبهم والودي T1-T4)', de: 'Plexus cardiacus (N. vagus & Sympathikus)' },
        kind: 'nerve',
        note: { en: 'Parasympathetic vagal fibers slow HR; thoracic sympathetic fibers increase chronotropy and inotropy.', ar: 'ألياف المبهم تبطئ النبض والودية الصدرية تزيد التقلص والسرعة.', de: 'Parasympathische (Vagus) und sympathische Innervation.' },
      },
    ],
    surgicalApproaches: [
      {
        approachName: { en: 'Median Sternotomy (CABG / Valve / Aortic Root)', ar: 'بضع القص الناصف (مجازة تاجية / صمامات)', de: 'Mediane Sternotomie (ACB / Klappen)' },
        landmarks: { en: 'Suprasternal notch to xiphoid process along the midline.', ar: 'من الثلمة فوق القص حتى الناتئ الرهابي على الخط الناصف.', de: 'Jugulum bis Processus xiphoideus median.' },
        planes: { en: 'Skin → Subcutaneous tissue → Pectoral fascia/periosteum → Sternum → Anterior mediastinal thymic fat → Pericardium.', ar: 'الجلد ← تحت الجلد ← سمحاق القص ← عظم القص ← النسيج التوتي ← التامور.', de: 'Haut → Subkutis → Sternum → Thymusfettkörper → Perikard.' },
        structuresAtRisk: { en: 'Right ventricle (if adherent), innominate vein, internal thoracic arteries, bilateral phrenic nerves.', ar: 'البطين الأيمن، الوريد العضدي الرأسي، الشريانان الصدريان الباطنان، العصب الحجابي.', de: 'Rechter Ventrikel, V. brachiocephalica, A. thoracica interna, N. phrenicus.' },
      },
    ],
    clinicalCorrelations: [
      {
        en: 'LAD occlusion ("widowmaker") produces anterior STEMI and cardiogenic shock if proximal to first septal/diagonal branches.',
        ar: 'انسداد الشريان الأمامي النازل LAD يسبب احتشاءً أمامياً واسعاً وقد يؤدي لصدمة قلبية.',
        de: 'Proximaler RIVA-Verschluss verursacht ausgedehnten Vorderwandinfarkt.',
      },
      {
        en: 'Pericardial effusion >150 mL acutely can precipitate cardiac tamponade (Beck triad: hypotension, JVD, muffled heart sounds).',
        ar: 'تراكم السائل التاموري الحاد يسبب اندحاساً قلبياً (ثلاثي بيك).',
        de: 'Akuter Perikarderguss kann zur Herzbeuteltamponade führen.',
      },
    ],
    anatomicalVariations: [
      {
        en: 'Coronary dominance: Right-dominant (~85%), Left-dominant (~8%), Co-dominant (~7%) depending on PDA origin.',
        ar: 'السيادة التاجية: يمينية (~85%)، يسارية (~8%)، مشتركة (~7%).',
        de: 'Versorgungstyp: Rechtsdominant (~85%), Linksdominant (~8%), Ausgeglichen (~7%).',
      },
    ],
    references: ['BodyParts3D 4.3 DBCLS (FMA7088 / FMA9839)', 'STS Adult Cardiac Surgery Guidelines'],
  },

  aorta: {
    structureId: 'aorta',
    localizedName: { en: 'Aorta (Ascending, Arch, Thoracic & Abdominal)', ar: 'الشريان الأبهر (الصاعد، القوس، الصدري والبطني)', de: 'Aorta (Ascendens, Bogen, Thorakal & Abdominell)' },
    latinName: 'Aorta',
    regionLabel: { en: 'Thorax & Retroperitoneal Abdomen', ar: 'الصدر وخلف الصفاق البطني', de: 'Thorax & Retroperitoneum' },
    isVascularPriority: true,
    bodyPartsFmaId: 'FMA3734',
    bodyPartsSearchQueries: ['aorta', 'arch of aorta', 'ascending aorta', 'descending aorta'],
    summary: {
      en: 'Primary systemic arterial conduit extending from the aortic valve (L3-T4 arch) down the retroperitoneum anterior to L1–L4 vertebrae, bifurcating into the common iliac arteries at L4.',
      ar: 'الشريان الجهازي الرئيسي الممتد من الصمام الأبهري عبر قوس الأبهر والصدر وخلف الصفاق البطني ليتفرع إلى الحرقفيين المشتركين عند الفقرة L4.',
      de: 'Hauptschlagader von der Aortenklappe über den Aortenbogen durch das Retroperitoneum bis zur Aortenbifurkation auf Höhe LWK 4.',
    },
    subStructures: [
      { name: { en: 'Ascending Aorta', ar: 'الأبهر الصاعد', de: 'Aorta ascendens' }, bodyPartsQuery: 'ascending aorta', role: { en: 'Gives off left and right coronary arteries from aortic sinuses', ar: 'يعطي الشريانين التاجيين الأيمن والأيسر', de: 'Abgang der Koronararterien' } },
      { name: { en: 'Arch of Aorta', ar: 'قوس الأبهر', de: 'Aortenbogen' }, bodyPartsQuery: 'arch of aorta', role: { en: 'Gives off brachiocephalic, left common carotid & left subclavian', ar: 'يعطي الجذع العضدي الرأسي والسباتي الأيسر وتحت الترقوة الأيسر', de: 'Truncus brachiocephalicus, A. carotis comm. sin., A. subclavia sin.' } },
      { name: { en: 'Descending Thoracic & Abdominal Aorta', ar: 'الأبهر النازل الصدري والبطني', de: 'Aorta descendens & abdominalis' }, bodyPartsQuery: 'descending aorta', role: { en: 'Celiac trunk (T12), SMA (L1), Renal arteries (L1–L2), IMA (L3)', ar: 'الجذع الزلاقي، المساريقي العلوي، الكلويان، المساريقي السفلي', de: 'Truncus coeliacus, AMS, Nierenarterien, AMI' } },
    ],
    relations: [
      { targetId: 'vena_cava_inferior', targetName: { en: 'Inferior Vena Cava', ar: 'الوريد الأجوف السفلي', de: 'Vena cava inferior' }, relationType: 'lateral', description: { en: 'IVC lies immediately to the right of the abdominal aorta in the retroperitoneum.', ar: 'يقع الوريد الأجوف السفلي مباشرة على يمين الأبهر البطني.', de: 'VCI liegt unmittelbar rechts der Aorta abdominalis.' } },
      { targetId: 'heart', targetName: { en: 'Heart', ar: 'القلب', de: 'Herz' }, relationType: 'inferior', description: { en: 'Aortic root arises from the left ventricle.', ar: 'ينشأ جذر الأبهر من البطين الأيسر.', de: 'Aortenwurzel entspringt dem linken Ventrikel.' } },
      { targetId: 'kidney_l', targetName: { en: 'Left & Right Kidneys', ar: 'الكليتان', de: 'Nieren' }, relationType: 'lateral', description: { en: 'Left renal vein crosses anteriorly over the abdominal aorta just inferior to the SMA origin ("nutcracker" plane).', ar: 'يعبر الوريد الكلوي الأيسر أمام الأبهر البطني أسفل المساريقي العلوي.', de: 'Linke Nierenvene kreuzt ventral über die Aorta unterhalb der AMS.' } },
      { targetId: 'spine', targetName: { en: 'Thoracolumbar Spine', ar: 'العمود الفقري الصدري القطني', de: 'Brust- & Lendenwirbelsäule' }, relationType: 'posterior', description: { en: 'Lumbar arteries arise from the posterior wall directly onto vertebral bodies.', ar: 'تنشأ الشرايين القطنية من الجدار الخلفي مباشرة أمام الأجسام الفقرية.', de: 'Lumbalarterien entspringen dorsal auf den Wirbelkörpern.' } },
    ],
    vascularAndNerve: [
      { name: { en: 'Celiac Trunk, SMA & IMA', ar: 'الجذع الزلاقي والمساريقي العلوي والسفلي', de: 'Truncus coeliacus, AMS & AMI' }, kind: 'arterial', highlightId: 'arteries_abdomen', bodyPartsQuery: 'celiac trunk', note: { en: 'Visceral branches critical during AAA repair and mesenteric revascularization.', ar: 'فروع حشوية حاسمة أثناء إصلاح أم الدم الأبهرية.', de: 'Viszerale Äste bei BAA-Reparatur.' } },
      { name: { en: 'Left Renal Vein (Anterior Crossing)', ar: 'الوريد الكلوي الأيسر', de: 'V. renalis sinistra' }, kind: 'venous', bodyPartsQuery: 'left renal vein', note: { en: 'Key landmark just below SMA; guides proximal infrarenal aortic clamp placement.', ar: 'معلم رئيسي يحدد عنق التثبيت تحت الكلوي للأبهر.', de: 'Schlüsselstruktur für infrarenale Aortenklemme.' } },
      { name: { en: 'Superior Hypogastric Plexus & Left Recurrent Laryngeal Nerve', ar: 'الضفيرة الخثلية العلوية والعصب الحنجري الراجع الأيسر', de: 'Plexus hypogastricus sup. & N. laryngeus recurrens sin.' }, kind: 'nerve', note: { en: 'Recurrent laryngeal loops under aortic arch at ligamentum arteriosum; hypogastric plexus overlies aortic bifurcation.', ar: 'الحنجري الراجع يلتف تحت قوس الأبهر؛ والضفيرة الخثلية أمام التفرع الأبهري.', de: 'N. recurrens unter Aortenbogen; Plexus hypogastricus über Bifurkation.' } },
    ],
    surgicalApproaches: [
      {
        approachName: { en: 'Midline Transperitoneal Infrarenal AAA Exposure', ar: 'الفتح البطني الناصف للأبهر تحت الكلوي', de: 'Mediane Laparotomie (infrarenale Aorta)' },
        landmarks: { en: 'Xiphoid to pubis; transverse mesocolon elevated; ligament of Treitz divided.', ar: 'من الرهابي للعانة مع إزاحة القولون المعترض ورباط ترايتز.', de: 'Xiphoid bis Symphyse; Treitz-Band durchtrennt.' },
        planes: { en: 'Linea alba → Peritoneum → Retract small bowel right → Posterior retroperitoneum medial to IMV → Left renal vein landmark.', ar: 'الخط الأبيض ← الصفاق ← إزاحة الأمعاء يميناً ← الصفاق الخلفي ← الوريد الكلوي الأيسر.', de: 'Linea alba → Peritoneum → Retroperitoneum → V. renalis sin.' },
        structuresAtRisk: { en: 'Left renal vein, duodenum (3rd/4th part), inferior mesenteric vein, ureters at iliac bifurcation, superior hypogastric plexus.', ar: 'الوريد الكلوي الأيسر، العفج، الحالبان، الضفيرة الخثلية العلوية.', de: 'V. renalis sin., Duodenum, Ureteren, Plexus hypogastricus.' },
      },
    ],
    clinicalCorrelations: [
      { en: 'Infrarenal AAA ≥5.5 cm (men) / ≥5.0 cm (women) warrants EVAR vs open repair; evaluate proximal neck length/angulation and iliac access.', ar: 'تمدد الأبهر البطني ≥5.5 سم يستدعي التقييم لإصلاح EVAR أو الفتح الجراحي.', de: 'Infrarenales BAA ab 5,5 cm (Männer) / 5,0 cm (Frauen) therapiepflichtig.' },
      { en: 'Stanford Type A dissection (ascending aorta) is a surgical emergency; Type B uncomplicated is managed medically/TEVAR.', ar: 'تسلخ الأبهر نمط Stanford A حالة إسعافية جراحية فورية.', de: 'Typ-A-Dissektion ist ein kardiochirurgischer Notfall.' },
    ],
    anatomicalVariations: [
      { en: 'Bovine aortic arch (~15–20%), aberrant right subclavian artery (~0.5–1%), circumaortic or retroaortic left renal vein (~2–3%).', ar: 'قوس أبهري بقري (~15-20%) أو وريد كلوي أيسر خلف الأبهر (~2-3%).', de: 'Boviner Bogen (~15-20%), retroaortale linke Nierenvene (~2-3%).' },
    ],
    references: ['BodyParts3D 4.3 DBCLS (FMA3734 / FMA3768 / FMA3784)', 'ESVS Abdominal Aorto-iliac Guidelines'],
  },

  carotid_r: {
    structureId: 'carotid_r',
    localizedName: { en: 'Carotid Artery System (Common, Internal & External)', ar: 'الشريان السباتي (المشترك، الباطن، والظاهر)', de: 'A. carotis (communis, interna & externa)' },
    latinName: 'Arteria carotis communis / interna / externa',
    regionLabel: { en: 'Anterior Cervical Triangle (Neck)', ar: 'المثلث العنقي الأمامي (العنق)', de: 'Trigonum caroticum (Hals)' },
    isVascularPriority: true,
    bodyPartsFmaId: 'FMA69325',
    bodyPartsSearchQueries: ['carotid'],
    summary: {
      en: 'Major cerebral and craniofacial arterial trunk within the carotid sheath alongside the internal jugular vein (lateral) and vagus nerve (posterior). Bifurcates around C3–C4 (upper border of thyroid cartilage).',
      ar: 'الشريان المغذي الرئيسي للدماغ والرأس داخل الغمد السباتي مع الوريد الوداجي الباطن وحشياً والعصب المبهم خلفياً، ويتفرع عند C3-C4.',
      de: 'Hauptversorgungsgefäß für Gehirn und Kopf in der Vagina carotica mit V. jugularis interna und N. vagus; Gabelung meist bei HWK 3–4.',
    },
    subStructures: [
      { name: { en: 'Common Carotid Artery', ar: 'الشريان السباتي المشترك', de: 'A. carotis communis' }, bodyPartsQuery: 'common carotid artery', role: { en: 'Bifurcates into ICA & ECA at upper border of thyroid cartilage', ar: 'يتفرع إلى الباطن والظاهر عند الحافة العلوية للغضروف الدرقي', de: 'Teilung in ACI & ACE am Schildknorpeloberrand' } },
      { name: { en: 'Internal Carotid Artery (ICA)', ar: 'الشريان السباتي الباطن', de: 'A. carotis interna' }, bodyPartsQuery: 'internal carotid artery', role: { en: 'No cervical branches; supplies anterior/middle cerebral circulation', ar: 'بلا فروع عنقية؛ يروي الدوران الدماغي الأمامي والأوسط', de: 'Keine Halsäste; versorgt Gehirn & Orbita' } },
      { name: { en: 'Carotid Sinus / Bulb', ar: 'الجيب السباتي', de: 'Sinus caroticus' }, bodyPartsQuery: 'carotid sinus', role: { en: 'Baroreceptor zone; frequent site of atherosclerotic plaque', ar: 'منطقة مستقبلات الضغط والموقع الأشيع للتصلب العصيدي', de: 'Barorezeptorzone & Prädilektionsstelle für Plaques' } },
    ],
    relations: [
      { targetId: 'larynx', targetName: { en: 'Thyroid Cartilage & Larynx', ar: 'الحنجرة والغضروف الدرقي', de: 'Kehlkopf & Schildknorpel' }, relationType: 'medial', description: { en: 'Upper border of thyroid cartilage marks C4 carotid bifurcation.', ar: 'الحافة العلوية للغضروف الدرقي توازي تفرع السباتي.', de: 'Schildknorpeloberrand entspricht der Karotisbifurkation.' } },
      { targetId: 'thyroid', targetName: { en: 'Thyroid Gland', ar: 'الغدة الدرقية', de: 'Schilddrüse' }, relationType: 'medial', description: { en: 'Lateral thyroid lobe abuts the medial wall of the carotid sheath.', ar: 'يجاور الفص الدرقي الجدار الإنسي للغمد السباتي.', de: 'Schilddrüsenlappen grenzt medial an die Vagina carotica.' } },
    ],
    vascularAndNerve: [
      { name: { en: 'Hypoglossal Nerve (CN XII)', ar: 'العصب تحت اللسان (CN XII)', de: 'N. hypoglossus (XII)' }, kind: 'nerve', note: { en: 'Crosses ICA/ECA 1–2 cm above bifurcation, tethered by sternocleidomastoid branch of occipital artery.', ar: 'يعبر فوق التفرع السباتي بـ 1-2 سم؛ يجب حمايته في استئصال باطنة السباتي.', de: 'Kreuzt ACI/ACE 1–2 cm kranial der Bifurkation.' } },
      { name: { en: 'Vagus Nerve (CN X)', ar: 'العصب المبهم (CN X)', de: 'N. vagus (X)' }, kind: 'nerve', note: { en: 'Lies posteriorly inside the carotid sheath between CCA/ICA and IJV.', ar: 'يسير خلفياً داخل الغمد السباتي بين الشريان والوريد الوداجي.', de: 'Verläuft dorsal zwischen Arterie und V. jugularis interna.' } },
      { name: { en: 'Internal Jugular Vein (IJV)', ar: 'الوريد الوداجي الباطن', de: 'V. jugularis interna' }, kind: 'venous', bodyPartsQuery: 'internal jugular vein', note: { en: 'Lateral to carotid artery; common facial vein marks approximate bifurcation level.', ar: 'وحشي الشريان؛ والوريد الوجهي المشترك يحدد مستوى التفرع.', de: 'Lateral der Arterie; V. facialis communis markiert die Bifurkation.' } },
    ],
    surgicalApproaches: [
      {
        approachName: { en: 'Carotid Endarterectomy (CEA) — Longitudinal Anterior SCM', ar: 'استئصال باطنة الشريان السباتي (CEA)', de: 'Karotis-Thrombendarteriektomie (CEA)' },
        landmarks: { en: 'Anterior border of sternocleidomastoid muscle toward angle of mandible.', ar: 'الحافة الأمامية للعضلة القترائية باتجاه زاوية الفك السفلي.', de: 'Vorderrand M. sternocleidomastoideus zum Kieferwinkel.' },
        planes: { en: 'Skin → Platysma → Deep cervical fascia (anterior SCM) → Ligate common facial vein → Carotid sheath.', ar: 'الجلد ← المبطحة ← اللفافة العنقية ← ربط الوريد الوجهي المشترك ← الغمد السباتي.', de: 'Haut → Platysma → Halsfaszie → V. facialis comm. → Vagina carotica.' },
        structuresAtRisk: { en: 'CN XII (hypoglossal), CN X (vagus), superior laryngeal nerve, marginal mandibular branch of CN VII, glossopharyngeal nerve (high dissection).', ar: 'CN XII، المبهم CN X، الحنجري العلوي، الفرع الفكي الهامشي للوجهي.', de: 'N. XII, N. X, N. laryngeus sup., R. marginalis mandibulae.' },
      },
    ],
    clinicalCorrelations: [
      { en: 'Symptomatic carotid stenosis ≥50–99% (NASCET) benefits from CEA within 14 days of TIA/minor stroke.', ar: 'تضيق السباتي العرضي ≥50-99% يستفيد من الجراحة خلال 14 يوماً.', de: 'Symptomatische Karotisstenose ≥50–99% indiziert zeitnahe CEA.' },
    ],
    anatomicalVariations: [
      { en: 'High carotid bifurcation (C2–C3, ~10%); retrojugular vagus nerve (~5%).', ar: 'تفرع سباتي مرتفع (~10%) أو مسار أمامي/خلفي غير اعتيادي للمبهم.', de: 'Hohe Bifurkation bei HWK 2–3 (~10%).' },
    ],
    references: ['BodyParts3D 4.3 DBCLS (FMA69325 / FMA69326 / FMA75867)', 'ESVS Carotid Guidelines'],
  },

  arteries_pelvis: {
    structureId: 'arteries_pelvis',
    localizedName: { en: 'Iliac Arteries (Common, External & Internal)', ar: 'الشرايين الحرقفية (المشترك، الظاهر والباطن)', de: 'Beckenarterien (A. iliaca communis, externa & interna)' },
    latinName: 'Arteriae iliacae',
    regionLabel: { en: 'Pelvis & Iliac Fossa', ar: 'الحوض والحفرة الحرقفية', de: 'Becken & Fossa iliaca' },
    isVascularPriority: true,
    bodyPartsSearchQueries: ['common iliac artery', 'external iliac artery', 'internal iliac artery'],
    summary: {
      en: 'Terminal aortic branches beginning at L4. Common iliac bifurcates over the sacroiliac joint into external iliac (continuing under inguinal ligament as CFA) and internal iliac (pelvic viscera & gluteal supply).',
      ar: 'التفرع الانتهائي للأبهر عند L4؛ يتفرع الحرقفي المشترك إلى الظاهر (يصبح الفخذي المشترك تحت الرباط الإربي) والباطن لتروية أحشاء الحوض.',
      de: 'Endäste der Aorta ab LWK 4; Teilung in A. iliaca externa (wird zu AFC) und A. iliaca interna.',
    },
    subStructures: [
      { name: { en: 'Common & External Iliac Artery', ar: 'الشريان الحرقفي المشترك والظاهر', de: 'A. iliaca communis & externa' }, bodyPartsQuery: 'common iliac artery', role: { en: 'Main conduit for EVAR/TEVAR/TAVR delivery & iliofemoral bypass', ar: 'المسار الرئيسي لقثاطر EVAR وتروية الطرف السفلي', de: 'Zugangsweg für EVAR/TAVR & iliofemorale Rekonstruktion' } },
      { name: { en: 'Internal Iliac (Hypogastric) Artery', ar: 'الشريان الحرقفي الباطن', de: 'A. iliaca interna' }, bodyPartsQuery: 'internal iliac artery', role: { en: 'Preservation prevents buttock claudication and pelvic ischemia', ar: 'الحفاظ عليه يمنع العرج الأليوي ونقص تروية الحوض', de: 'Erhalt verhindert Gesäßclaudicatio und Beckenischämie' } },
    ],
    relations: [
      { targetId: 'ureter_r', targetName: { en: 'Ureters (Right & Left)', ar: 'الحالبان', de: 'Ureteren' }, relationType: 'anterior', description: { en: 'Ureters cross anteriorly directly over the common iliac bifurcation ("water under the bridge").', ar: 'يعبر الحالبان أمام تفرع الحرقفي المشترك مباشرة.', de: 'Ureteren überkreuzen direkt ventral der Iliakalbifurkation.' } },
      { targetId: 'veins_pelvis', targetName: { en: 'Iliac Veins', ar: 'الأوردة الحرقفية', de: 'Iliakalvenen' }, relationType: 'posterior', description: { en: 'Right common iliac artery compresses the left common iliac vein against L5 (May-Thurner site).', ar: 'يضغط الحرقفي المشترك الأيمن على الوريد الحرقفي الأيسر (نقطة ماي-ثورنر).', de: 'Rechte AIC kreuzt über linke V. iliaca communis (May-Thurner).' } },
    ],
    vascularAndNerve: [
      { name: { en: 'Inferior Epigastric & Deep Circumflex Iliac Arteries', ar: 'الشريان الشرسوفي السفلي والمنعطف الحرقفي العميق', de: 'A. epigastrica inf. & A. circumflexa ilium prof.' }, kind: 'arterial', bodyPartsQuery: 'external iliac artery', note: { en: 'Mark distal border of external iliac artery before inguinal ligament.', ar: 'تحدد النهاية القاصية للحرقفي الظاهر قبل الرباط الإربي.', de: 'Markieren Übergang zur A. femoralis communis.' } },
      { name: { en: 'Obturator & Genitofemoral Nerves', ar: 'العصب الساد والفخذي التناسلي', de: 'N. obturatorius & N. genitofemoralis' }, kind: 'nerve', note: { en: 'Genitofemoral runs on psoas; obturator lies deep in pelvic sidewall.', ar: 'يسير الفخذي التناسلي على العضلة القطنية والساد عميقاً بالحوض.', de: 'N. genitofemoralis auf M. psoas; N. obturatorius tief an Beckenwand.' } },
    ],
    surgicalApproaches: [
      {
        approachName: { en: 'Retroperitoneal Gibson / Rutherford Morison Iliac Exposure', ar: 'الكشف خلف الصفاق للحرقفي (شق غيبسون)', de: 'Retroperitonealer Zugang zur Beckenachse' },
        landmarks: { en: '2 cm medial to ASIS curving toward pubic tubercle.', ar: '2 سم إنسي الشوكة الحرقفية الأمامية العلوية نحو العانة.', de: '2 cm medial der Spina iliaca ant. sup. zur Symphyse.' },
        planes: { en: 'External oblique → Internal oblique → Transversus abdominis → Sweep peritoneum medially (ureter stays on peritoneum).', ar: 'المائلة الظاهرة ← الباطنة ← المستعرضة ← دفع الصفاق إنسياً (يبقى الحالب ملتصقاً بالصفاق).', de: 'Bauchwandmuskulatur → Peritoneum medialisieren (Ureter bleibt am Peritoneum).' },
        structuresAtRisk: { en: 'Ureter, iliac vein posterior injury, inferior epigastric vessels.', ar: 'الحالب، الوريد الحرقفي، الأوعية الشرسوفية السفلية.', de: 'Ureter, V. iliaca, A./V. epigastrica inferior.' },
      },
    ],
    clinicalCorrelations: [
      { en: 'Aortoiliac occlusive disease (Leriche syndrome: claudication, absent femoral pulses, erectile dysfunction).', ar: 'متلازمة ليريش في انسداد الأبهر والحرقفي.', de: 'Leriche-Syndrom bei aortoiliakalem Verschluss.' },
    ],
    anatomicalVariations: [
      { en: 'Corona mortis (~15–30%): anastomotic vessel between obturator and external iliac/inferior epigastric over superior pubic ramus.', ar: 'إكليل الموت (~15-30%) مفاغرة وعائية فوق الشعبة العانية العلوية.', de: 'Corona mortis (~15–30%) über Ramus superior ossis pubis.' },
    ],
    references: ['BodyParts3D 4.3 DBCLS (Iliac Arterial Tree)', 'Rutherford Vascular Surgery'],
  },

  arteries_leg_r: {
    structureId: 'arteries_leg_r',
    localizedName: { en: 'Lower Extremity Arteries (Femoral, Popliteal & Tibial)', ar: 'شرايين الطرف السفلي (الفخذي، المأبضي، والظنبوبي)', de: 'Beinarterien (Femoralis, Poplitea & Tibiales)' },
    latinName: 'A. femoralis, A. poplitea, Aa. tibiales',
    regionLabel: { en: 'Femoral Triangle · Hunter Canal · Popliteal Fossa · Leg', ar: 'المثلث الفخذي · الحفرة المأبضية · الساق', de: 'Leiste · Adduktorenkanal · Kniekehle · Unterschenkel' },
    isVascularPriority: true,
    bodyPartsSearchQueries: ['femoral artery', 'popliteal artery', 'tibial artery'],
    summary: {
      en: 'Continuous infrainguinal arterial axis: Common Femoral Artery (CFA) bifurcates into Profunda Femoris (PFA) and Superficial Femoral Artery (SFA), passing through the adductor hiatus into the Popliteal Artery and Trifurcation (ATA, Tibioperoneal trunk → PTA & Peroneal).',
      ar: 'المحور الشرياني للطرف السفلي: الفخذي المشترك يتفرع للفخذي العميق والسطحي، ثم الشريان المأبضي خلف الركبة ثم الثلاثي الظنبوبي الأمامي والخلفي والشظوي.',
      de: 'Infrainguinale Achse: AFC → A. profunda femoris & AFS → durch Adduktorenhiatus zur A. poplitea → Trifurkation (ATA, ATP, A. fibularis).',
    },
    subStructures: [
      { name: { en: 'Common & Deep Femoral Artery (CFA / PFA)', ar: 'الفخذي المشترك والفخذي العميق', de: 'A. femoralis communis & profunda' }, bodyPartsQuery: 'femoral artery', role: { en: 'Mid-inguinal point pulse; primary endarterectomy & catheterization site', ar: 'نبض المغبن الرئيسي وموقع استئصال البطانة والقثطرة', de: 'Leistenpuls & primärer Punktions-/TEA-Ort' } },
      { name: { en: 'Popliteal Artery', ar: 'الشريان المأبضي', de: 'A. poplitea' }, bodyPartsQuery: 'popliteal artery', role: { en: 'Deepest structure in popliteal fossa (medial to vein and tibial nerve)', ar: 'أعمق بنية بالحفرة المأبضية (إنسي الوريد والعصب الظنبوبي)', de: 'Tiefste Struktur der Kniekehle (medial von Vene & N. tibialis)' } },
      { name: { en: 'Anterior & Posterior Tibial + Peroneal Arteries', ar: 'الظنبوبي الأمامي والخلفي والشظوي', de: 'A. tibialis ant./post. & A. fibularis' }, bodyPartsQuery: 'tibial artery', role: { en: 'Pedal outflow vessels (dorsalis pedis & posterior tibial pulse)', ar: 'شرايين التدفق للقدم (ظهر القدم والكعب الإنسي)', de: 'Unterschenkel-Ausstromgefäße zum Fuß' } },
    ],
    relations: [
      { targetId: 'veins_leg_r', targetName: { en: 'Femoral, Popliteal & Great Saphenous Veins', ar: 'الأوردة الفخذية والمأبضية والصافن الأكبر', de: 'V. femoralis, poplitea & saphena magna' }, relationType: 'medial', description: { en: 'NAVEL lateral-to-medial in femoral triangle: Nerve, Artery, Vein, Empty space, Lymphatics.', ar: 'ترتيب المثلث الفخذي من الوحشي للإنسي: عصب، شريان، وريد، ليمفاويات (NAVEL).', de: 'IVAN von innen nach außen in der Leiste.' } },
      { targetId: 'femur_r', targetName: { en: 'Femur & Adductor Canal', ar: 'عظم الفخذ ونفق المقربات', de: 'Femur & Adduktorenkanal' }, relationType: 'posterior', description: { en: 'SFA sits anteromedial to femur inside Hunter canal; exits adductor hiatus into popliteal fossa.', ar: 'يسير SFA في نفق هنتر ويخرج عبر فرجة المقربة الكبيرة للحفرة المأبضية.', de: 'AFS zieht durch den Adduktorenhiatus in die Fossa poplitea.' } },
    ],
    vascularAndNerve: [
      { name: { en: 'Femoral Nerve & Saphenous Nerve', ar: 'العصب الفخذي والعصب الصافن', de: 'N. femoralis & N. saphenus' }, kind: 'nerve', note: { en: 'Femoral nerve lies lateral to CFA outside the femoral sheath; saphenous nerve accompanies SFA in Hunter canal.', ar: 'الفخذي وحشي الغمد؛ والصابن يرافق الفخذي السطحي بنفق هنتر.', de: 'N. femoralis lateral außerhalb der Gefäßscheide; N. saphenus im Adduktorenkanal.' } },
      { name: { en: 'Tibial & Common Peroneal Nerves', ar: 'العصب الظنبوبي والشظوي المشترك', de: 'N. tibialis & N. fibularis communis' }, kind: 'nerve', highlightId: 'sciatic_r', note: { en: 'Sciatic divides above popliteal fossa; tibial nerve lies superficial/lateral to popliteal vein and artery.', ar: 'العصب الظنبوبي سطحي ووحشي للأوعية المأبضية.', de: 'N. tibialis oberflächlich-lateral zu Vene und Arterie.' } },
      { name: { en: 'Great Saphenous Vein (GSV)', ar: 'الوريد الصافن الأكبر', de: 'V. saphena magna' }, kind: 'venous', highlightId: 'veins_leg_r', bodyPartsQuery: 'great saphenous vein', note: { en: 'Gold-standard autogenous conduit for femoro-popliteal / distal tibial bypass.', ar: 'الوريد القياسي الذهبي لعمليات المجازة الفخذية المأبضية والظنبوبية.', de: 'Goldstandard-Bypassmaterial für femoropopliteale/-krurale Bypässe.' } },
    ],
    surgicalApproaches: [
      {
        approachName: { en: 'Vertical Groin CFA Exposure + Medial Above/Below-Knee Popliteal Exposure', ar: 'كشف الشريان الفخذي والمأبضي من الجانب الإنسي', de: 'Inguinaler AFC-Zugang & medialer Poplitea-Zugang' },
        landmarks: { en: 'Groin pulse 1.5 cm lateral to pubic tubercle; medial distal thigh/proximal calf 1 cm posterior to tibia.', ar: 'نبض المغبن؛ ومدخل إنسي الساق خلف الحافة الخلفية للظنبوب بـ 1 سم.', de: 'Leistenpuls; 1 cm dorsal der Tibiakante medial.' },
        planes: { en: 'Above-knee: sartorius posterior retraction; Below-knee: divide gastrocnemius medial head / soleus arch for tibioperoneal trunk.', ar: 'تحت الركبة: تحرير الرأس الإنسي للتوأمية وقوس النعلية لكشف الجذع الظنبوبي الشظوي.', de: 'Infragenual: M. gastrocnemius medial abhalten, Soleusarkade spalten.' },
        structuresAtRisk: { en: 'Saphenous vein & nerve, femoral nerve lateral branches, profunda femoris vein crossing, popliteal vein injury.', ar: 'الوريد والعصب الصافن، فروع العصب الفخذي، الوريد المأبضي.', de: 'V./N. saphenus, V. poplitea, N. tibialis.' },
      },
    ],
    clinicalCorrelations: [
      { en: 'Popliteal aneurysms (>2 cm) carry high thrombosis and distal embolization risk rather than rupture.', ar: 'أمهات الدم المأبضية (>2 سم) تحمل خطراً عالياً للخثار والصمات القاصية.', de: 'Popliteaaneurysmen neigen stark zu Thrombosierung und Embolisation.' },
    ],
    anatomicalVariations: [
      { en: 'High origin of anterior tibial artery (~2–5%) passing anterior to popliteus muscle.', ar: 'منشأ مرتفع للشريان الظنبوبي الأمامي (~2-5%).', de: 'Hoher Abgang der A. tibialis anterior (~2–5%).' },
    ],
    references: ['BodyParts3D 4.3 DBCLS (FMA20797 / FMA77380 / FMA44336)', 'ESVS CLTI Guidelines'],
  },

  liver: {
    structureId: 'liver',
    localizedName: { en: 'Liver', ar: 'الكبد', de: 'Leber' },
    latinName: 'Hepar',
    regionLabel: { en: 'Right Upper Quadrant (Abdomen)', ar: 'الربع العلوي الأيمن (البطن)', de: 'Rechter Oberbauch' },
    bodyPartsFmaId: 'FMA7197',
    bodyPartsSearchQueries: ['liver', 'hepatic'],
    summary: {
      en: 'Largest visceral organ divided functionally into 8 Couinaud segments by hepatic veins and portal triad branches, suspended by falciform, coronary, and triangular ligaments.',
      ar: 'أكبر عضو حشوي، يُقسم وظيفياً إلى 8 شدف كوينو عبر الأوردة الكبدية والثلث البابي.',
      de: 'Größtes inneres Organ, funktionell in 8 Couinaud-Segmente durch Lebervenen und Glisson-Trias unterteilt.',
    },
    subStructures: [
      { name: { en: 'Right & Left Hepatic Lobes', ar: 'الفص الكبدي الأيمن والأيسر', de: 'Rechter & Linker Leberlappen' }, bodyPartsQuery: 'liver', role: { en: 'Divided along Cantlie line (gallbladder fossa to IVC)', ar: 'مفصولان بخط كانتلي بين المرارة والأجوف السفلي', de: 'Getrennt durch Cantlie-Linie (Gallenblase zur VCI)' } },
      { name: { en: 'Portal Triad & Hepatic Veins', ar: 'الثلاثي البابي والأوردة الكبدية', de: 'Glisson-Trias & Lebervenen' }, bodyPartsQuery: 'hepatic', role: { en: 'Dual inflow (portal vein ~75%, hepatic artery ~25%) and RHV/MHV/LHV outflow', ar: 'تروية مزدوجة عبر الوريد البابي والشريان الكبدي وتصريف للأجوف السفلي', de: 'Duale Perfusion & Abfluss in die VCI' } },
    ],
    relations: [
      { targetId: 'gallbladder', targetName: { en: 'Gallbladder & Cystic Duct', ar: 'المرارة والقناة المرارية', de: 'Gallenblase' }, relationType: 'inferior', description: { en: 'Rests in the gallbladder fossa marking the Cantlie plane between segments IVb and V.', ar: 'تستقر في حفرة المرارة محددة خط كانتلي بين الشدفة IVb و V.', de: 'Liegt in der Fossa vesicae biliaris (Segment IVb/V).' } },
      { targetId: 'vena_cava_inferior', targetName: { en: 'Inferior Vena Cava', ar: 'الوريد الأجوف السفلي', de: 'Vena cava inferior' }, relationType: 'posterior', description: { en: 'Retrohepatic IVC receives right, middle, left hepatic veins and short Spigelian veins.', ar: 'الأجوف السفلي خلف الكبد يستقبل الأوردة الكبدية الثلاثة.', de: 'Retrohepatische VCI nimmt rechte, mittlere & linke Lebervene auf.' } },
      { targetId: 'stomach', targetName: { en: 'Stomach', ar: 'المعدة', de: 'Magen' }, relationType: 'inferior', description: { en: 'Left lateral sector (II/III) overlaps anterior stomach.', ar: 'يغطي القطاع الجانبي الأيسر الوجه الأمامي للمعدة.', de: 'Linker Leberlappen überlagert den Magen.' } },
    ],
    vascularAndNerve: [
      { name: { en: 'Proper Hepatic Artery (25% flow, 50% O2)', ar: 'الشريان الكبدي المخصوص', de: 'A. hepatica propria' }, kind: 'arterial', bodyPartsQuery: 'hepatic artery', note: { en: 'Courses within hepatoduodenal ligament (Pringle maneuver controls inflow).', ar: 'يسير في الرباط الكبدي العفجي (مناورة برينغل).', de: 'Verläuft im Lig. hepatoduodenale (Pringle-Manöver).' } },
      { name: { en: 'Portal Vein (75% flow)', ar: 'الوريد البابي', de: 'V. portae hepatis' }, kind: 'venous', bodyPartsQuery: 'portal vein', note: { en: 'Lies posterior to hepatic artery and CBD inside hepatoduodenal ligament.', ar: 'يقع خلف الشريان الكبدي والقناة الجامعة.', de: 'Liegt dorsal von Arterie und Ductus choledochus.' } },
    ],
    surgicalApproaches: [
      {
        approachName: { en: 'Right Subcostal (Kocher) / Mercedes Incision & Pringle Control', ar: 'الشق تحت الضلعي الأيمن ومناورة برينغل', de: 'Rechter Rippenbogenrandschnitt & Pringle-Manöver' },
        landmarks: { en: '2 fingerbreadths below right costal margin; foramen of Winslow.', ar: 'أسفل الحافة الضلعية اليمنى؛ ثقبة وينسلو.', de: '2 Querfinger unter rechtem Rippenbogen; Foramen epiploicum.' },
        planes: { en: 'Divide falciform ligament → Mobilize triangular/coronary ligaments → Identify hepatoduodenal ligament.', ar: 'قطع الرباط المنجلي ← تحرير الأربطة المثلثية والإكليلية ← الرباط الكبدي العفجي.', de: 'Lig. falciforme → Dreiecksbänder → Lig. hepatoduodenale.' },
        structuresAtRisk: { en: 'Short retrohepatic IVC veins, MHV during right/left hepatectomy, aberrant left/right hepatic arteries.', ar: 'أوردة الأجوف السفلي القصيرة، الوريد الكبدي الأوسط، الشرايين الكبدية الزائغة.', de: 'Kurze Lebervenen zur VCI, mittlere Lebervene, akzessorische Arterien.' },
      },
    ],
    clinicalCorrelations: [
      { en: 'Pringle maneuver occludes the hepatoduodenal ligament (portal triad) to control parenchymal bleeding during resection.', ar: 'تغلق مناورة برينغل الثلاثي البابي للسيطرة على النزف أثناء استئصال الكبد.', de: 'Pringle-Manöver klemmt das Lig. hepatoduodenale temporär ab.' },
    ],
    anatomicalVariations: [
      { en: 'Replaced right hepatic artery from SMA (~11–18%); replaced left hepatic artery from left gastric (~10%).', ar: 'شريان كبدي أيمن منشأه SMA (~11-18%) أو أيسر من المعدي الأيسر (~10%).', de: 'Akzessorische rechte Leberarterie aus AMS (~11–18%).' },
    ],
    references: ['BodyParts3D 4.3 DBCLS (FMA7197)', 'Brisbane 2000 Hepatic Resection Terminology'],
  },

  brain: {
    structureId: 'brain',
    localizedName: { en: 'Brain & Cerebral Circulation', ar: 'الدماغ والدوران الدماغي', de: 'Gehirn & Zerebrale Zirkulation' },
    latinName: 'Encephalon',
    regionLabel: { en: 'Cranial Vault', ar: 'جوف القحف', de: 'Schädelhöhle' },
    isVascularPriority: true,
    bodyPartsSearchQueries: ['cerebral artery', 'basilar artery', 'cerebellar', 'sinus'],
    summary: {
      en: 'Central nervous system housed within the cranial vault, perfused by the Circle of Willis (paired internal carotids and vertebrobasilar system) and drained via dural venous sinuses.',
      ar: 'الجهاز العصبي المركزي داخل القحف، يُروى عبر حلقة ويليس (السباتيين الباطنين والنظام الفقري القاعدي) ويصرف عبر الجيوب الوريدية الجافية.',
      de: 'Zentrales Nervensystem, versorgt über den Circulus arteriosus Willisii und drainiert über die Sinus durae matris.',
    },
    subStructures: [
      { name: { en: 'Circle of Willis & Cerebral Arteries (ACA/MCA/PCA)', ar: 'حلقة ويليس والشرايين الدماغية', de: 'Circulus Willisii (ACA/MCA/PCA)' }, bodyPartsQuery: 'cerebral artery', role: { en: 'Anastomotic arterial ring at the skull base', ar: 'الحلقة الشريانية المفاغرة في قاعدة القحف', de: 'Arterieller Gefäßring an der Schädelbasis' } },
      { name: { en: 'Basilar & Vertebral Arteries', ar: 'الشريان القاعدي والفقري', de: 'A. basilaris & Aa. vertebrales' }, bodyPartsQuery: 'basilar artery', role: { en: 'Posterior fossa & brainstem perfusion', ar: 'تروية الحفرة الخلفية وجذع الدماغ', de: 'Versorgung von Hirnstamm & Kleinhirn' } },
      { name: { en: 'Dural Venous Sinuses (Superior Sagittal / Transverse)', ar: 'الجيوب الوريدية الجافية', de: 'Sinus sagittalis sup. & transversus' }, bodyPartsQuery: 'sagittal sinus', role: { en: 'Primary venous drainage into internal jugular veins', ar: 'التصريف الوريدي الرئيسي للوريدين الوداجيين الباطنين', de: 'Venöser Hauptabfluss zur V. jugularis interna' } },
    ],
    relations: [
      { targetId: 'skull', targetName: { en: 'Cranium & Pterion', ar: 'القحف والجناح الصدغي (Pterion)', de: 'Schädel & Pterion' }, relationType: 'enclosed', description: { en: 'Pterion overlies the anterior branch of the middle meningeal artery.', ar: 'يغطي الجناح الصدغي الفرع الأمامي للشريان السحائي الأوسط.', de: 'Das Pterion liegt über dem R. anterior der A. meningea media.' } },
      { targetId: 'brainstem', targetName: { en: 'Brainstem', ar: 'جذع الدماغ', de: 'Hirnstamm' }, relationType: 'inferior', description: { en: 'Continuous inferiorly with midbrain, pons, and medulla at tentorial notch.', ar: 'يتصل للأسفل مع جذع الدماغ عند الثلمة الخيمية.', de: 'Kontinuierlich kaudal mit Mittelhirn, Pons und Medulla.' } },
    ],
    vascularAndNerve: [
      { name: { en: 'Middle Cerebral Artery (MCA)', ar: 'الشريان الدماغي الأوسط (MCA)', de: 'A. cerebri media' }, kind: 'arterial', bodyPartsQuery: 'middle cerebral artery', note: { en: 'Courses through Sylvian fissure; supplies lateral convexity & lenticulostriate perforators.', ar: 'يسير في شق سيلفيوس ويروي الوجه الوحشي لنصف الكرة المخية.', de: 'Verläuft im Sulcus lateralis; häufigste Lokalisation von Schlaganfällen.' } },
    ],
    surgicalApproaches: [
      {
        approachName: { en: 'Pterional (Frontotemporal) Craniotomy', ar: 'حج القحف الجبهي الصدغي (Pterional)', de: 'Pterionale Kraniotomie' },
        landmarks: { en: 'Zygomatic arch, keyhole (frontozygomatic suture), temporal line.', ar: 'القوس الوجنية والدرز الجبهي الوجني.', de: 'Jochbogen, Keyhole, Linea temporalis.' },
        planes: { en: 'Scalp & galea (protect frontalis branch CN VII) → Temporalis muscle → Bone flap → Dura → Sylvian fissure.', ar: 'فروة الرأس ← العضلة الصدغية ← السديلة العظمية ← الأم الجافية ← شق سيلفيوس.', de: 'Kopfschwarte → M. temporalis → Knochendeckel → Dura → Fissura Sylvii.' },
        structuresAtRisk: { en: 'Frontalis branch of facial nerve, middle meningeal artery, Sylvian veins, optic nerve.', ar: 'الفرع الجبهي للعصب الوجهي، السحائي الأوسط، أوردة سيلفيوس، العصب البصري.', de: 'R. frontalis N. VII, A. meningea media, N. opticus.' },
      },
    ],
    clinicalCorrelations: [
      { en: 'Aneurysmal SAH frequently involves AComm (~30–35%), PComm (~25%), and MCA bifurcation (~20%).', ar: 'النزف تحت العنكبوتية ينشأ غالباً من أمهات دم AComm وPComm وتفرع MCA.', de: 'Aneurysmatische SAB häufig an ACoA, ACoP oder MCA-Bifurkation.' },
    ],
    anatomicalVariations: [
      { en: 'Fetal origin of PCA (~15–20%); hypoplastic A1 segment (~10%).', ar: 'منشأ جنيني لـ PCA (~15-20%) أو نقص تنسج القطعة A1.', de: 'Fetaler Ursprung der ACP (~15–20%).' },
    ],
    references: ['BodyParts3D 4.3 DBCLS (Cerebral Arteries & Sinuses)', 'Rhoton Cranial Anatomy'],
  },
};

const ALIAS_MAP: Record<string, string> = {
  coronary_arteries: 'heart',
  carotid_l: 'carotid_r',
  arteries_leg_l: 'arteries_leg_r',
  arteries_abdomen: 'aorta',
  arteries_thorax: 'aorta',
  vena_cava_inferior: 'aorta',
  vena_cava_superior: 'heart',
  veins_pelvis: 'arteries_pelvis',
  veins_leg_l: 'arteries_leg_r',
  veins_leg_r: 'arteries_leg_r',
  brainstem: 'brain',
};

export function getKnowledgeProfile(structure: UnifiedAnatomicalStructure): StructureKnowledgeProfile {
  const direct = KNOWLEDGE_PROFILES[structure.id] || KNOWLEDGE_PROFILES[ALIAS_MAP[structure.id] || ''];
  if (direct && structure.id === direct.structureId) {
    return direct;
  }

  // Dynamic verified profile derived from the structure's catalog entry + curated domain knowledge
  const label = structure.label;
  const fallbackQueries: string[] = [];
  const cleanLabel = label.replace(/\s*\([LR]\)\s*/g, '').trim();
  if (cleanLabel) fallbackQueries.push(cleanLabel.toLowerCase());

  if (direct) {
    return {
      ...direct,
      structureId: structure.id,
      localizedName: { en: label, ar: `${label} (${direct.localizedName.ar})`, de: label },
      bodyPartsFmaId: structure.fmaId || direct.bodyPartsFmaId,
      bodyPartsSearchQueries: fallbackQueries.length > 0 ? [cleanLabel, ...direct.bodyPartsSearchQueries] : direct.bodyPartsSearchQueries,
    };
  }

  return {
    structureId: structure.id,
    localizedName: { en: label, ar: label, de: label },
    latinName: cleanLabel,
    regionLabel: { en: structure.category, ar: structure.category, de: structure.category },
    isVascularPriority: structure.system === 'vessels',
    bodyPartsFmaId: structure.fmaId,
    bodyPartsSearchQueries: fallbackQueries,
    summary: {
      en: `Verified anatomical structure in the ${structure.system} system (${structure.category}). Inspect 3D surface geometry, BodyParts3D hierarchy, and surgical danger zones.`,
      ar: `بنية تشريحية موثقة ضمن نظام ${structure.system} (${structure.category}). استعرض المجسم ثلاثي الأبعاد والتسلسل التشريحي ومناطق الخطر الجراحية.`,
      de: `Verifizierte anatomische Struktur im System ${structure.system} (${structure.category}). Inspizieren Sie 3D-Geometrie, Hierarchie und Gefahrenzonen.`,
    },
    subStructures: [],
    relations: [],
    vascularAndNerve: [],
    surgicalApproaches: [],
    clinicalCorrelations: [
      {
        en: structure.fmaId
          ? `Mapped to Foundational Model of Anatomy identifier ${structure.fmaId} with verified 3D surface mesh.`
          : 'Mapped to verified macroscopic 3D surface mesh in the anatomical catalog.',
        ar: structure.fmaId
          ? `مرتبط بالمعرف التشريحي القياسي ${structure.fmaId} مع مجسم ثلاثي الأبعاد موثق.`
          : 'مرتبط بمجسم سطحي ثلاثي الأبعاد موثق في الفهرس التشريحي.',
        de: structure.fmaId
          ? `Verknüpft mit der FMA-ID ${structure.fmaId} und verifiziertem 3D-Oberflächennetz.`
          : 'Verknüpft mit verifiziertem 3D-Oberflächennetz.',
      },
    ],
    anatomicalVariations: [],
    references: [
      structure.fmaId ? `BodyParts3D 4.3 DBCLS (${structure.fmaId})` : 'open-anatomy-3d / BodyParts3D 4.3 (CC BY 4.0)',
    ],
  };
}

export function pickText(text: LocalizedText, language: SupportedLanguage): string {
  return text[language] || text.en;
}

export function resolveRelatedHighlightId(id: string): UnifiedAnatomicalStructure | undefined {
  return getStructureById(id);
}
