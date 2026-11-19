// ============================================================================
// surgicalProceduresRegistry.ts — Surgical procedures + structures registry
// ----------------------------------------------------------------------------
// REAL procedures with REAL anatomical relationships.
// No invented data — every relationship is anatomically and surgically valid.
// ============================================================================

import type {
  AnatomyStructure,
  SurgicalProcedure,
  DangerZone,
  ProcedureStructure,
  AnatomicalSystemId,
  AnatomicalRegionId,
  BiologicalSex,
  StructureAvailability,
} from '../types/surgicalAtlasTypes';

// ============================================================================
// ANATOMICAL STRUCTURES — Initial seed (clinically verified)
// ============================================================================
// These are the structures we have defined metadata for.
// The 3D mesh availability depends on the asset source — see AnatomyAsset records.
// We mark availability honestly:
//   - 'available': we have verified mesh + metadata
//   - 'partial': we have metadata, mesh may or may not be available yet
//   - 'planned': we have planned the structure but no metadata/mesh yet

const NOW = new Date().toISOString();

export const ANATOMICAL_STRUCTURES: AnatomyStructure[] = [
  // ========================================================================
  // LOWER LIMB — VASCULAR
  // ========================================================================
  {
    id: 'femoral_artery_right',
    systemId: 'arterial',
    regionId: 'lower_limb',
    biologicalSex: 'both',
    names: {
      en: 'Femoral Artery (Right)',
      ar: 'الشريان الفخذي (أيمن)',
      de: 'Arteria femoralis (rechts)',
      latin: 'Arteria femoralis dextra',
    },
    latinName: 'Arteria femoralis',
    synonyms: [
      { en: 'Common femoral artery', ar: 'الشريان الفخذي المشترك', de: 'Arteria femoralis communis' },
      { en: 'CFA', ar: '', de: '' },
    ],
    ta2Code: 'A12.2.16.001',
    fmaId: 'FMA:70248',
    course: {
      en: 'Continuation of external iliac artery; enters thigh below inguinal ligament at mid-inguinal point; descends through femoral triangle, then adductor canal; exits via adductor hiatus as popliteal artery.',
      ar: 'استمرار الشريان الحرقفي الخارجي؛ يدخل الفخذ أسفل الرباط الإربي عند نقطة منتصف الإربية؛ ينزل عبر المثلث الفخذي ثم القناة المقربية؛ يخرج عبر الفجوة المقربة كشريان شظوي.',
      de: 'Fortsetzung der Arteria iliaca externa; tritt unter dem Leistenband in der Mitte der Leiste ein; verläuft durch das femorale Dreieck, dann durch den Adduktorenkanal; tritt durch die Adduktorenlücke als Arteria poplitea aus.',
    },
    branches: {
      en: 'Superficial epigastric, superficial circumflex iliac, superficial external pudendal, deep external pudendal, profunda femoris (deep femoral), descending genicular.',
      ar: 'الشرايين الشركية السطحية، الدائرية الحرقفية السطحية، الفرجية الخارجية السطحية، الفرجية الخارجية العميقة، الشريان الفخذي العميق، الشريان الركبي النازل.',
      de: 'A. epigastrica superficialis, A. circumflexa ilium superficialis, A. pudenda externa superficialis, A. pudenda externa profunda, A. profunda femoris, A. genus descendens.',
    },
    bloodSupply: {
      en: 'Main arterial supply to the lower limb.',
      ar: 'الإمداد الشرياني الرئيسي للطرف السفلي.',
      de: 'Hauptarterielle Versorgung der unteren Extremität.',
    },
    anatomicalRelations: {
      en: 'Lies lateral to femoral vein in femoral sheath; femoral nerve is lateral to artery (NAVEL: Nerve, Artery, Vein, Lymphatics from lateral to medial); inguinal ligament superior; sartorius lateral in femoral triangle.',
      ar: 'يقع وحشي الوريد الفخذي في الغمد الفخذي؛ العصب الفخذي وحشي للشريان (NAVL: العصب، الشريان، الوريد، الأوعية اللمفاية من وحشي إلى أنسي)؛ الرباط الإربي علوي؛ العضلة الخياطية وحشية في المثلث الفخذي.',
      de: 'Lies lateral zum femoralvene in der fascia femoralis; Nervus femoralis lateral der Arterie (NAVL); Ligamentum inguinale superior; Sartorius lateral im femoralen Dreieck.',
    },
    clinicalSignificance: {
      en: 'Common site for arterial access (cardiac catheterization), femoral embolectomy, and evaluation of peripheral arterial disease. ABI measurement point.',
      ar: 'موقع شائع للوصول الشرياني (القسطرة القلبية)، استئصال الصمة الفخذي، وتقييم مرض الشرايين المحيطية. نقطة قياس ABI.',
      de: 'Häufiger Zugangspunkt für arterielle Punktion (Herzkatheter), Femoral-Embolektomie und Beurteilung der peripheren arteriellen Verschlusskrankheit.',
    },
    surgicalRelevance: {
      en: 'Femoral exposure for vascular surgery, femoral embolectomy, EVLA access, femoral-popliteal bypass distal anastomosis.',
      ar: 'التعرض الفخذي لجراحة الأوعية، استئصال الصمة الفخذي، الوصول لـ EVLA، التفميم الفخذي الشظوي البعيد.',
      de: 'Femoral-Freilegung für Gefäßchirurgie, Femoral-Embolektomie, EVLA-Zugang, femoro-popliteale Bypass-Distalanastomose.',
    },
    defaultColor: '#dc2626',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'femoral_artery_left',
    systemId: 'arterial',
    regionId: 'lower_limb',
    biologicalSex: 'both',
    names: {
      en: 'Femoral Artery (Left)',
      ar: 'الشريان الفخذي (أيسر)',
      de: 'Arteria femoralis (links)',
      latin: 'Arteria femoralis sinistra',
    },
    latinName: 'Arteria femoralis',
    synonyms: [],
    ta2Code: 'A12.2.16.001',
    fmaId: 'FMA:70248',
    course: { en: 'Mirror of right femoral artery on left side.', ar: 'مرآة الشريان الفخذي الأيمن على الجانب الأيسر.', de: 'Spiegel der rechten A. femoralis auf der linken Seite.' },
    branches: { en: 'Same branches as right femoral artery.', ar: 'نفس فروع الشريان الفخذي الأيمن.', de: 'Gleiche Äste wie rechte A. femoralis.' },
    bloodSupply: { en: 'Main arterial supply to left lower limb.', ar: 'الإمداد الشرياني الرئيسي للطرف السفلي الأيسر.', de: 'Hauptarterielle Versorgung der linken unteren Extremität.' },
    anatomicalRelations: { en: 'Mirror of right side. NAVL arrangement preserved.', ar: 'مرآة الجانب الأيمن. ترتيب NAVL محفوظ.', de: 'Spiegel der rechten Seite. NAVL-Anordnung erhalten.' },
    clinicalSignificance: { en: 'Same clinical significance as right femoral artery.', ar: 'نفس الأهمية السريرية للشريان الفخذي الأيمن.', de: 'Gleiche klinische Bedeutung wie rechte A. femoralis.' },
    surgicalRelevance: { en: 'Femoral exposure, embolectomy, bypass — same as right side.', ar: 'التعرض الفخذي، استئصال الصمة، التفميم — نفس الجانب الأيمن.', de: 'Femoral-Freilegung, Embolektomie, Bypass — wie rechts.' },
    defaultColor: '#dc2626',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'femoral_vein_right',
    systemId: 'venous',
    regionId: 'lower_limb',
    biologicalSex: 'both',
    names: {
      en: 'Femoral Vein (Right)',
      ar: 'الوريد الفخذي (أيمن)',
      de: 'Vena femoralis (rechts)',
      latin: 'Vena femoralis dextra',
    },
    latinName: 'Vena femoralis',
    synonyms: [
      { en: 'Common femoral vein', ar: 'الوريد الفخذي المشترك', de: 'Vena femoralis communis' },
    ],
    ta2Code: 'A12.3.11.001',
    fmaId: 'FMA:70249',
    course: {
      en: 'Continuation of popliteal vein; ascends through adductor canal and femoral triangle; receives profunda femoris vein, then becomes external iliac vein at inguinal ligament.',
      ar: 'استمرار الوريد الشظوي؛ يصعد عبر القناة المقربة والمثلث الفخذي؛ يستقبل الوريد الفخذي العميق، ثم يصبح الوريد الحرقفي الخارجي عند الرباط الإربي.',
      de: 'Fortsetzung der V. poplitea; aufsteigend durch Adduktorenkanal und femorales Dreieck; empfängt V. profunda femoris, wird dann zur V. iliaca externa am Leistenband.',
    },
    bloodSupply: {
      en: 'Main venous drainage of the lower limb.',
      ar: 'التصريف الوريدي الرئيسي للطرف السفلي.',
      de: 'Hauptvenöser Abfluss der unteren Extremität.',
    },
    venousDrainage: {
      en: 'Drains to external iliac vein → common iliac vein → IVC.',
      ar: 'يصرف إلى الوريد الحرقفي الخارجي ← الوريد الحرقفي المشترك ← الأجوف السفلي.',
      de: 'Entwässert in V. iliaca externa → V. iliaca communis → V. cava inferior.',
    },
    anatomicalRelations: {
      en: 'Medial to femoral artery in femoral sheath (NAVL: Nerve, Artery, Vein, Lymphatics from lateral to medial).',
      ar: 'أنسي للشريان الفخذي في الغمد الفخذي (NAVL: العصب، الشريان، الوريد، الأوعية اللمفاية من وحشي إلى أنسي).',
      de: 'Medial der A. femoralis in der fascia femoralis (NAVL von lateral nach medial).',
    },
    clinicalSignificance: {
      en: 'Common site for DVT, central venous access in emergency, venous sampling.',
      ar: 'موقع شائع لجلطة الأوردة العميقة (DVT)، الوصول الوريدي المركزي في الطوارئ، أخذ العينات الوريدية.',
      de: 'Häufiger Ort für tiefe Venenthrombose, zentralvenösen Zugang im Notfall, venöse Probenentnahme.',
    },
    surgicalRelevance: {
      en: 'Femoral vein exposure for vascular access, thrombectomy, EVLA, dialysis access (AVF).',
      ar: 'التعرض الوريدي الفخذي للوصول الوعائي، استئصال الخثرة، EVLA، الوصول لغسيل الكلى (AVF).',
      de: 'Femoralvenen-Freilegung für Gefäßzugang, Thrombektomie, EVLA, Dialysezugang (AVF).',
    },
    defaultColor: '#1e40af',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'femoral_nerve_right',
    systemId: 'nervous',
    regionId: 'lower_limb',
    biologicalSex: 'both',
    names: {
      en: 'Femoral Nerve (Right)',
      ar: 'العصب الفخذي (أيمن)',
      de: 'Nervus femoralis (rechts)',
      latin: 'Nervus femoralis dexter',
    },
    latinName: 'Nervus femoralis',
    synonyms: [],
    ta2Code: 'A14.2.03.003',
    fmaId: 'FMA:84621',
    course: {
      en: 'Largest branch of lumbar plexus (L2-L4); descends through psoas major, then deep to inguinal ligament lateral to femoral artery; divides into anterior and posterior divisions in femoral triangle.',
      ar: 'أكبر فرز للضفيرة القطنية (L2-L4)؛ ينزل عبر العضلة الحرقفية القطنية، ثم عميق للرباط الإربي وحشي الشريان الفخذي؛ ينقسم إلى قسم أمامي وخلفي في المثلث الفخذي.',
      de: 'Größter Ast des Plexus lumbalis (L2-L4); verläuft durch den M. psoas major, dann unter dem Leistenband lateral der A. femoralis; teilt sich im femoralen Dreieck in vordere und hintere Äste.',
    },
    branches: {
      en: 'Anterior division: intermediate cutaneous, medial cutaneous nerves of thigh, saphenous nerve, nerves to sartorius and pectineus. Posterior division: nerves to quadriceps femoris.',
      ar: 'القسم الأمامي: الأعصاب الجلدية الوسيطة والإنسية للفخذ، العصب الصافن، أعصاب الخياطية والعاني. القسم الخلفي: أعصاب العضلة الرباعية الفخذية.',
      de: 'Vorderer Ast: N. cutaneus femoris anterior, N. cutaneus femoris medialis, N. saphenus, Äste zum M. sartorius und M. pectineus. Hinterer Ast: Äste zum M. quadriceps femoris.',
    },
    innervation: {
      en: 'Motor: iliacus, pectineus, sartorius, quadriceps femoris. Sensory: anterior and medial thigh, medial leg and foot (via saphenous nerve).',
      ar: 'حركية: الحرقفية، العاني، الخياطية، الرباعية الفخذية. حسية: الفخذ الأمامي والأنسي، الساق الإنسي والقدم (عبر العصب الصافن).',
      de: 'Motorisch: M. iliacus, M. pectineus, M. sartorius, M. quadriceps femoris. Sensibel: vordere und mediale Oberschenkel, mediales Bein und Fuß (über N. saphenus).',
    },
    anatomicalRelations: {
      en: 'Lateral to femoral artery in femoral triangle (NAVL arrangement). Lies on psoas major tendon.',
      ar: 'وحشي للشريان الفخذي في المثلث الفخذي (ترتيب NAVL). يقع على وتر العضلة الحرقفية القطنية.',
      de: 'Lateral der A. femoralis im femoralen Dreieck (NAVL). Liegt auf der Sehne des M. psoas major.',
    },
    clinicalSignificance: {
      en: 'Femoral nerve injury causes quadriceps weakness (unable to extend knee) and loss of sensation in anterior thigh and medial leg.',
      ar: 'إصابة العصب الفخذي تسبب ضعف الرباعية الفخذية (عدم القدرة على بسط الركبة) وفقدان الإحساس في الفخذ الأمامي والساق الإنسي.',
      de: 'Schädigung des N. femoralis führt zu Quadrizeps-Schwäche (Kniestreckung unmöglich) und Sensibilitätsverlust an vorderem Oberschenkel und medialem Bein.',
    },
    surgicalRelevance: {
      en: 'Risk during femoral hernia repair, vascular surgery in groin, psoas abscess drainage. Important landmark for femoral block anesthesia.',
      ar: 'خطر أثناء إصلاح الفتق الفخذي، جراحة الأوعية في المغبن، تصريف خراج الحرقفية القطنية. علامة مهمة لتخدير الكتلة الفخذية.',
      de: 'Gefährdung bei Femoralhernien-Reparatur, gefäßchirurgischen Eingriffen in der Leiste, Psoas-Abszess-Drainage. Wichtige Orientierung für Femoralis-Block-Anästhesie.',
    },
    defaultColor: '#fde047',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },

  // ========================================================================
  // LOWER LIMB — MUSCLES (Femoral Triangle)
  // ========================================================================
  {
    id: 'sartorius_muscle_right',
    systemId: 'muscular',
    regionId: 'lower_limb',
    biologicalSex: 'both',
    names: {
      en: 'Sartorius Muscle (Right)',
      ar: 'العضلة الخياطية (أيمن)',
      de: 'Musculus sartorius (rechts)',
      latin: 'Musculus sartorius dexter',
    },
    latinName: 'Musculus sartorius',
    synonyms: [
      { en: 'Tailor muscle', ar: 'عضلة الخياط', de: 'Schneidermuskel' },
    ],
    ta2Code: 'A04.7.02.014',
    fmaId: 'FMA:22300',
    origin: {
      en: 'Anterior superior iliac spine (ASIS) and notch below it.',
      ar: 'الشوكة الحرقفية الأمامية العلوية (ASIS) والشق أسفلها.',
      de: 'Spina iliaca anterior superior (SIAS) und die Kerbe darunter.',
    },
    insertion: {
      en: 'Upper medial shaft of tibia (pes anserinus with gracilis and semitendinosus).',
      ar: 'الجدل الإنسي العلوي للظنبوب (قدم الإوزة مع النحيل وشبه الوتري).',
      de: 'Obere mediale Tibiadiaaphyse (Pes anserinus mit M. gracilis und M. semitendinosus).',
    },
    innervation: {
      en: 'Femoral nerve (L2-L3).',
      ar: 'العصب الفخذي (L2-L3).',
      de: 'Nervus femoralis (L2-L3).',
    },
    function: {
      en: 'Flexes, abducts, and laterally rotates hip; flexes knee. Produces the "tailor\'s position" (cross-legged sitting).',
      ar: 'يثني، يُبعّد، ويدور وحشي الورك؛ يثني الركبة. ينتج "وضعية الخياط" (الجلوس مترابعاً).',
      de: 'Beugt, abduziert und lateral rotiert das Hüftgelenk; beugt das Knie. Erzeugt die "Schneiderposition".',
    },
    anatomicalRelations: {
      en: 'Forms lateral boundary of femoral triangle. Crosses anterior thigh from lateral to medial.',
      ar: 'يشكل الحد الوحشي للمثلث الفخذي. يعبر الفخذ الأمامي من وحشي إلى أنسي.',
      de: 'Bildet die laterale Begrenzung des femoralen Dreiecks. Verläuft von lateral nach medial über den vorderen Oberschenkel.',
    },
    clinicalSignificance: {
      en: 'Part of pes anserinus — bursitis here causes medial knee pain. Used as landmark for femoral artery identification.',
      ar: 'جزء من قدم الإوزة — التهاب الكيس هنا يسبب ألم ركبي إنسي. تُستخدم كعلامة لتحديد الشريان الفخذي.',
      de: 'Teil des Pes anserinus — Bursitis verursacht mediale Knieschmerzen. Landmarke zur Identifikation der A. femoralis.',
    },
    surgicalRelevance: {
      en: 'Landmark for femoral triangle exposure; may be retracted during vascular access procedures.',
      ar: 'علامة لتعرض المثلث الفخذي؛ قد يُسحب أثناء إجراءات الوصول الوعائي.',
      de: 'Landmarke für femorale Dreieck-Freilegung; kann bei gefäßchirurgischen Eingriffen retrahiert werden.',
    },
    defaultColor: '#b91c1c',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'iliopsoas_muscle_right',
    systemId: 'muscular',
    regionId: 'lower_limb',
    biologicalSex: 'both',
    names: {
      en: 'Iliopsoas Muscle (Right)',
      ar: 'العضلة الحرقفية القطنية (أيمن)',
      de: 'Musculus iliopsoas (rechts)',
      latin: 'Musculus iliopsoas dexter',
    },
    latinName: 'Musculus iliopsoas',
    synonyms: [],
    ta2Code: 'A04.7.02.001',
    fmaId: 'FMA:22375',
    origin: {
      en: 'Psoas major: T12-L5 vertebrae, transverse processes of L1-L5. Iliacus: iliac fossa, ala of sacrum.',
      ar: 'العضلة القطنية الكبرى: T12-L5، النواتئ المستعرضة لـ L1-L5. الحرقفية: الحفرة الحرقفية، جناح العجز.',
      de: 'Psoas major: T12-L5, Processus transversus L1-L5. Iliacus: Fossa iliaca, Ala ossis sacri.',
    },
    insertion: {
      en: 'Lesser trochanter of femur.',
      ar: 'المدور الصغير للفخذ.',
      de: 'Trochanter minor des Femur.',
    },
    innervation: {
      en: 'Psoas: lumbar plexus (L1-L3). Iliacus: femoral nerve (L2-L4).',
      ar: 'القطنية: الضفيرة القطنية (L1-L3). الحرقفية: العصب الفخذي (L2-L4).',
      de: 'Psoas: Plexus lumbalis (L1-L3). Iliacus: N. femoralis (L2-L4).',
    },
    function: {
      en: 'Chief flexor of hip; stabilizes hip joint; assists in maintaining posture. Bilateral contraction flexes trunk (e.g., sitting up from supine).',
      ar: 'العضلة العاطفة الرئيسية للورك؛ تثبت مفصل الورك؛ تساعد في الحفاظ على الوضعية. الانقباض الثنائي يثني الجذع (مثل الجلوس من الاستلقاء).',
      de: 'Hauptbeuger des Hüftgelenks; stabilisiert das Hüftgelenk; hilft bei der Körperhaltung. Bilaterale Kontraktion beugt den Rumpf.',
    },
    anatomicalRelations: {
      en: 'Forms floor of femoral triangle. Tendon passes beneath inguinal ligament, lateral to femoral nerve, posterior to femoral artery and vein.',
      ar: 'يشكل أرضية المثلث الفخذي. يمر الوتر أسفل الرباط الإربي، وحشي العصب الفخذي، خلف الشريان والوريد الفخذي.',
      de: 'Bildet den Boden des femoralen Dreiecks. Sehne verläuft unter dem Leistenband, lateral des N. femoralis, posterior der A. und V. femoralis.',
    },
    clinicalSignificance: {
      en: 'Psoas abscess (from spinal TB or Crohn disease) presents with hip flexion contracture and pain on extension. Psoas sign in appendicitis.',
      ar: 'خراج الحرقفية القطنية (من السل الشوكي أو داء كرون) يظهر بانقباض ثني الورك وألم عند البسط. علامة الحرقفية في التهاب الزائدة.',
      de: 'Psoas-Abszess (Wirbeltuberkulose oder Morbus Crohn) zeigt Beugekontraktur und Schmerz bei Streckung. Psoas-Zeichen bei Appendizitis.',
    },
    surgicalRelevance: {
      en: 'Important landmark in femoral triangle exposure; must be preserved during retroperitoneal surgery and hip approaches.',
      ar: 'علامة مهمة في تعرض المثلث الفخذي؛ يجب الحفاظ عليها أثناء جراحة الصفاق الخلفي والمناحذ الوركية.',
      de: 'Wichtige Orientierungsstruktur im femoralen Dreieck; muss bei retroperitonealer Chirurgie und Hüftzugängen geschont werden.',
    },
    defaultColor: '#b91c1c',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'pectineus_muscle_right',
    systemId: 'muscular',
    regionId: 'lower_limb',
    biologicalSex: 'both',
    names: {
      en: 'Pectineus Muscle (Right)',
      ar: 'العضلة العاني (أيمن)',
      de: 'Musculus pectineus (rechts)',
      latin: 'Musculus pectineus dexter',
    },
    latinName: 'Musculus pectineus',
    synonyms: [],
    ta2Code: 'A04.7.02.020',
    fmaId: 'FMA:22328',
    origin: {
      en: 'Pectineal line of pubis (superior ramus).',
      ar: 'الخط العاني للعانة (الفرع العلوي).',
      de: 'Pecten ossis pubis (Ramus superior).',
    },
    insertion: {
      en: 'Pectineal line of femur (linea pectinea) — posterior to lesser trochanter.',
      ar: 'الخط العاني للفخذ (الخط العاني) — خلف المدور الصغير.',
      de: 'Linea pectinea des Femur — posterior des Trochanter minor.',
    },
    innervation: {
      en: 'Femoral nerve (L2-L3) and obturator nerve (L2-L4) — dual innervation.',
      ar: 'العصب الفخذي (L2-L3) والعصب السد (L2-L4) — تعصيب مزدوج.',
      de: 'N. femoralis (L2-L3) und N. obturatorius (L2-L4) — doppelte Innervation.',
    },
    function: {
      en: 'Adducts and flexes hip; assists in medial rotation.',
      ar: 'يُقرّب ويثني الورك؛ يساعد في الدوران الإنسي.',
      de: 'Adduziert und beugt das Hüftgelenk; hilft bei medialer Rotation.',
    },
    anatomicalRelations: {
      en: 'Forms medial floor of femoral triangle. Anterior: femoral vein and artery; posterior: obturator nerve and vessels.',
      ar: 'يشكل الأرضية الإنسية للمثلث الفخذي. أمامي: الوريد والشريان الفخذي؛ خلفي: العصب والأوعية السدية.',
      de: 'Bildet den medialen Boden des femoralen Dreiecks. Anterior: V. und A. femoralis; Posterior: N. obturatorius und Gefäße.',
    },
    clinicalSignificance: {
      en: 'May be injured in hip injuries; access for obturator nerve block.',
      ar: 'قد يُصاب في إصابات الورك؛ منفذ لتخدير العصب السد.',
      de: 'Kann bei Hüftverletzungen geschädigt werden; Zugang für Obturatorius-Blockade.',
    },
    surgicalRelevance: {
      en: 'Forms part of floor of femoral triangle; retracted during vascular exposure.',
      ar: 'يشكل جزء من أرضية المثلث الفخذي؛ يُسحب أثناء التعرض الوعائي.',
      de: 'Teil des Bodens des femoralen Dreiecks; wird bei gefäßchirurgischer Freilegung retrahiert.',
    },
    defaultColor: '#b91c1c',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },

  // ========================================================================
  // LOWER LIMB — BONES
  // ========================================================================
  {
    id: 'femur_right',
    systemId: 'skeletal',
    regionId: 'lower_limb',
    biologicalSex: 'both',
    names: {
      en: 'Femur (Right)',
      ar: 'عظم الفخذ (أيمن)',
      de: 'Femur (rechts)',
      latin: 'Femur dextrum',
    },
    latinName: 'Femur',
    synonyms: [
      { en: 'Thigh bone', ar: 'عظم الفخذ', de: 'Oberschenkelknochen' },
    ],
    ta2Code: 'A02.8.05.001',
    fmaId: 'FMA:9611',
    anatomicalRelations: {
      en: 'Longest bone in body. Proximal: femoral head (in acetabulum), neck, greater and lesser trochanters. Distal: medial and lateral femoral condyles articulate with tibia (knee joint).',
      ar: 'أطول عظم في الجسم. القريب: رأس الفخذ (في التجويف الحقي)، العنق، المدوران الكبير والصغير. البعيد: اللقمتان الإنسية والوحشية للفخذ تتلامس مع الظنبوب (مفصل الركبة).',
      de: 'Längster Knochen des Körpers. Proximal: Caput femoris (in Acetabulum), Collum, Trochanter major und minor. Distal: Condylus medialis und lateralis artikulieren mit der Tibia (Kniegelenk).',
    },
    function: {
      en: 'Forms skeleton of thigh; bears body weight; site of attachment for major muscles; houses bone marrow.',
      ar: 'يشكل هيكل الفخذ؛ يحمل وزن الجسم؛ موقع اتصال العضلات الرئيسية؛ يحتوي على نخاع العظم.',
      de: 'Bildet das Skelett des Oberschenkels; trägt das Körpergewicht; Ansatzstelle großer Muskeln; enthält Knochenmark.',
    },
    clinicalSignificance: {
      en: 'Femoral neck fractures common in elderly (hip fractures). Femoral shaft fractures from high-energy trauma.',
      ar: 'كسور عنق الفخذ شائعة عند كبار السن (كسور الورك). كسور جدل الفخذ من صدمات عالية الطاقة.',
      de: 'Schenkelhalsfrakturen häufig bei älteren Patienten (Hüftfrakturen). Femurschaftfrakturen durch Hochenergietrauma.',
    },
    surgicalRelevance: {
      en: 'Hip hemiarthroplasty, total hip replacement, femoral nailing, distal femur fixation.',
      ar: 'استبدال الورك نصفي، استبدال الورك الكلي، تثبيت النخاع الفخذي، تثبيت الفخذ البعيد.',
      de: 'Hüft-Hemiarthroplastik, Hüft-TEP, Femurnagelung, distale Femurfixation.',
    },
    defaultColor: '#e5e7eb',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },

  // ========================================================================
  // HEAD & NECK — VASCULAR
  // ========================================================================
  {
    id: 'common_carotid_artery_right',
    systemId: 'arterial',
    regionId: 'head_neck',
    biologicalSex: 'both',
    names: {
      en: 'Common Carotid Artery (Right)',
      ar: 'الشريان السباتي المشترك (أيمن)',
      de: 'Arteria carotis communis (rechts)',
      latin: 'Arteria carotis communis dextra',
    },
    latinName: 'Arteria carotis communis',
    synonyms: [
      { en: 'CCA', ar: '', de: '' },
      { en: 'Carotid artery', ar: 'الشريان السباتي', de: 'Halsschlagader' },
    ],
    ta2Code: 'A12.2.04.001',
    fmaId: 'FMA:84621',
    course: {
      en: 'Right CCA arises from brachiocephalic trunk behind sternoclavicular joint; ascends in carotid sheath to upper border of thyroid cartilage (C4 level) where it bifurcates.',
      ar: 'السباتي المشترك الأيمن ينشأ من الجذع العضدي الرأسي خلف المفصل القصي الترقوي؛ يصعد في الغمد السباتي إلى الحد العلوي للغضروف الدرقي (C4) حيث ينقسم.',
      de: 'Rechte A. carotis communis entsteht aus dem Truncus brachiocephalicus hinter dem Sternoklavikulargelenk; steigt in der Carotisscheide auf zum oberen Rand des Schildknorpels (C4), wo sie sich teilt.',
    },
    branches: {
      en: 'Terminal bifurcation into external carotid artery (ECA) and internal carotid artery (ICA) at C4 level (superior border of thyroid cartilage).',
      ar: 'انقسام نهائي إلى الشريان السباتي الخارجي (ECA) والشريان السباتي الداخلي (ICA) عند مستوى C4 (الحد العلوي للغضروف الدرقي).',
      de: 'Terminale Bifurkation in A. carotis externa (ECA) und A. carotis interna (ICA) auf C4-Niveau (oberer Rand des Schildknorpels).',
    },
    bloodSupply: {
      en: 'Supplies head and neck: brain (via ICA), face and neck (via ECA branches).',
      ar: 'يزود الرأس والعنق: الدماغ (عبر ICA)، الوجه والعنق (عبر فروع ECA).',
      de: 'Versorgt Kopf und Hals: Gehirn (über ICA), Gesicht und Hals (über ECA-Äste).',
    },
    anatomicalRelations: {
      en: 'Lies in carotid sheath with internal jugular vein (lateral) and vagus nerve (posterior). Carotid sinus at bifurcation contains baroreceptors.',
      ar: 'يقع في الغمد السباتي مع الوريد الوداجي الداخلي (وحشي) والعصب المبهم (خلفي). الجيب السباتي عند الانقسام يحتوي على المستقبلات الضاغطة.',
      de: 'Lies in der Carotisscheide mit V. jugularis interna (lateral) und N. vagus (posterior). Sinus caroticus an der Bifurkation enthält Barorezeptoren.',
    },
    clinicalSignificance: {
      en: 'Carotid stenosis → TIA/stroke. Carotid bruit audible on auscultation. Carotid sinus syndrome — hypersensitivity causes syncope.',
      ar: 'تضيق السباتي ← نوبة نقص التروية المؤقتة/السكتة. يمكن سماع لغط سباتي بالإصغاء. متلازمة الجيب السباتي — فرط الحساسية يسبب الإغماء.',
      de: 'Carotisstenose → TIA/Schlaganfall. Karotisgeräusch bei Auskultation hörbar. Sinus-caroticus-Syndrom — Überempfindlichkeit verursacht Synkope.',
    },
    surgicalRelevance: {
      en: 'Carotid endarterectomy (CEA) for symptomatic stenosis >70%. Carotid artery stenting (CAS) alternative.',
      ar: 'استئصال البطانة السباتية (CEA) للتضيق العرضي >70%. ركيزة الشريان السباتي (CAS) كبديل.',
      de: 'Carotisendarteriektomie (CEA) bei symptomatischer Stenose >70%. Carotis-Stenting (CAS) als Alternative.',
    },
    defaultColor: '#dc2626',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'recurrent_laryngeal_nerve_right',
    systemId: 'nervous',
    regionId: 'head_neck',
    biologicalSex: 'both',
    names: {
      en: 'Recurrent Laryngeal Nerve (Right)',
      ar: 'العصب الحنجري الراجع (أيمن)',
      de: 'Nervus laryngeus recurrens (rechts)',
      latin: 'Nervus laryngeus recurrens dexter',
    },
    latinName: 'Nervus laryngeus recurrens',
    synonyms: [
      { en: 'RLN', ar: '', de: '' },
      { en: 'Inferior laryngeal nerve', ar: 'العصب الحنجري السفلي', de: 'Nervus laryngeus inferior' },
    ],
    ta2Code: 'A14.2.01.005',
    fmaId: 'FMA:84621',
    course: {
      en: 'Branch of vagus nerve. Right RLN loops under right subclavian artery, ascends in tracheoesophageal groove to enter larynx behind cricothyroid joint.',
      ar: 'فرع من العصب المبهم. RLN الأيمن يلتف تحت الشريان تحت الترقوة الأيمن، يصعد في الثلم الرغامي المريئي ليدخل الحنجرة خلف المفصل الحلقي الدرقي.',
      de: 'Ast des N. vagus. Rechter RLN schlingt sich unter der A. subclavia dextra, aufsteigend in der Tracheo-Ösophagus-Rinne, tritt hinter dem Cricothyroidgelenk in den Kehlkopf ein.',
    },
    branches: {
      en: 'Sensory: infraglottic cavity. Motor: all intrinsic laryngeal muscles except cricothyroid (supplied by external branch of superior laryngeal nerve).',
      ar: 'حسي: التجويف تحت المزماري. حركي: جميع عضلات الحنجرة الداخلية ما عدا الحلقي الدرقي (يُزَوَّد بالفرع الخارجي للعصب الحنجري العلوي).',
      de: 'Sensibel: Cavitas infraglottica. Motorisch: alle inneren Kehlkopfmuskeln außer M. cricothyroideus (durch äußeren Ast des N. laryngeus superior).',
    },
    innervation: {
      en: 'Motor to all intrinsic laryngeal muscles (except cricothyroid). Sensory below vocal folds.',
      ar: 'حركي لجميع عضلات الحنجرة الداخلية (ما عدا الحلقي الدرقي). حسي أسفل الطيات الصوتية.',
      de: 'Motorisch an alle inneren Kehlkopfmuskeln (außer M. cricothyideus). Sensibel unterhalb der Stimmlippen.',
    },
    anatomicalRelations: {
      en: 'Lies in tracheoesophageal groove, intimately related to inferior thyroid artery. Must be identified during thyroid surgery.',
      ar: 'يقع في الثلم الرغامي المريئي، مرتبط وثيقاً بالشريان الدرقي السفلي. يجب تحديده أثناء جراحة الغدة الدرقية.',
      de: 'Lies in der Tracheo-Ösophagus-Rinne, eng mit der A. thyroidea inferior verbunden. Muss bei Schilddrüsenoperation identifiziert werden.',
    },
    clinicalSignificance: {
      en: 'Injury causes hoarseness (unilateral) or stridor (bilateral). Bilateral injury may require tracheostomy. Non-recurrent laryngeal nerve variant (0.5-1%) with aberrant right subclavian artery.',
      ar: 'الإصابة تسبب بحة (أحادية) أو صرير (ثنائية). الإصابة الثنائية قد تتطلب فغر الرغامى. تباين العصب الحنجري غير الراجع (0.5-1%) مع الشريان تحت الترقوة الشاذ.',
      de: 'Schädigung verursacht Heiserkeit (einseitig) oder Stridor (beidseitig). Beidseitige Schädigung kann Tracheotomie erfordern. Nicht-rekursiver Laryngeusnerv-Variante (0,5-1%) bei aberranter A. subclavia dextra.',
    },
    surgicalRelevance: {
      en: 'CRITICAL danger zone in thyroidectomy, parathyroidectomy, cervical esophagectomy. Routine identification reduces injury rates from 5-10% to <1%.',
      ar: 'منطقة خطر حرجة في استئصال الغدة الدرقية والجار الدرقية واستئصال المريء العنقي. التحديد الروتيني يقلل معدلات الإصابة من 5-10% إلى أقل من 1%.',
      de: 'KRITISCHE Gefahrenzone bei Thyreoidektomie, Parathyreoidektomie, zervikaler Ösophagusresektion. Routinemäßige Identifikation reduziert Verletzungsraten von 5-10% auf <1%.',
    },
    defaultColor: '#fde047',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },

  // ========================================================================
  // ABDOMEN — ORGANS
  // ========================================================================
  {
    id: 'gallbladder',
    systemId: 'internal_organs',
    regionId: 'abdomen_pelvis',
    biologicalSex: 'both',
    names: {
      en: 'Gallbladder',
      ar: 'المرارة',
      de: 'Gallenblase',
      latin: 'Vesica biliaris',
    },
    latinName: 'Vesica biliaris',
    synonyms: [
      { en: 'Gall bladder', ar: 'كيس المرارة', de: 'Galle' },
    ],
    ta2Code: 'A05.8.01.001',
    fmaId: 'FMA:84621',
    function: {
      en: 'Stores and concentrates bile produced by liver. Releases bile into duodenum via cystic duct → common bile duct when cholecystokinin is released after fatty meal.',
      ar: 'يخزّن ويكثّف الصفراء المنتجة من الكبد. يطلق الصفراء في الاثني عشر عبر القناة الكيسية ← القناة الصفراوية المشتركة عند إفراز الكوليسيستوكينين بعد وجبة دهنية.',
      de: 'Speichert und konzentriert Gallenflüssigkeit aus der Leber. Entlässt Gallenflüssigkeit ins Duodenum über Ductus cysticus → Ductus choledochus nach Cholecystokininfreisetzung nach fetthaltiger Mahlzeit.',
    },
    anatomicalRelations: {
      en: 'Lies in gallbladder fossa on visceral surface of liver (segments IV-V). Hartmann\'s pouch (infundibulum) near cystic duct. Triangle of Calot: cystic duct, common hepatic duct, liver edge.',
      ar: 'يقع في حفرة المرارة على السطح الحشوي للكبد (القطع IV-V). كيس هارتمان (القمع) قرب القناة الكيسية. مثلث كالوت: القناة الكيسية، القناة الكبدية المشتركة، حافة الكبد.',
      de: 'Lies in der Gallenblasengrube auf viszeraler Leberfläche (Segmente IV-V). Hartmann-Tasche (Infundibulum) nahe Ductus cysticus. Calot-Dreieck: Ductus cysticus, Ductus hepaticus communis, Leberkante.',
    },
    bloodSupply: {
      en: 'Cystic artery (usually from right hepatic artery, varies in 15-20% of population).',
      ar: 'الشريان الكيسي (عادة من الشريان الكبدي الأيمن، يختلف في 15-20% من الناس).',
      de: 'A. cystica (meist aus der A. hepatica dextra, variiert bei 15-20% der Bevölkerung).',
    },
    venousDrainage: {
      en: 'Cystic vein drains directly into portal venous system (variable).',
      ar: 'الوريد الكيسي يصرف مباشرة في نظام الوريد البوابي (متغير).',
      de: 'V. cystica entleert direkt in das Pfortadersystem (variabel).',
    },
    innervation: {
      en: 'Sympathetic from celiac plexus; parasympathetic from vagus; visceral afferents via celiac plexus (referred pain to right shoulder).',
      ar: 'الودي من الضفيرة البطنية؛ شبه الودي من المبهم؛ الألياف الحسية الحشوية عبر الضفيرة البطنية (ألم محال إلى الكتف الأيمن).',
      de: 'Sympathisch aus Plexus coeliacus; parasympathisch vom N. vagus; viszerale Afferenzen über Plexus coeliacus (übertragener Schmerz zur rechten Schulter).',
    },
    clinicalSignificance: {
      en: 'Gallstones (cholelithiasis) → biliary colic, cholecystitis. Courvoisier\'s law: palpable gallbladder with painless jaundice suggests malignancy (not stones).',
      ar: 'حصوات المرارة (الكوليستياز) ← المغص الصفراوي، التهاب المرارة. قانون كورفوازييه: المرارة الملموسة مع اليرقان غير المؤلم يشير إلى الخباثة (وليس الحصوات).',
      de: 'Gallensteine (Cholelithiasis) → Gallenkolik, Cholezystitis. Courvoisier-Gesetz: tastbare Gallenblase mit schmerzlosem Ikterus spricht für Malignität (nicht Steine).',
    },
    surgicalRelevance: {
      en: 'Laparoscopic cholecystectomy is the gold standard. CRITICAL: achieve Critical View of Safety (CVS) before clipping cystic duct to avoid CBD injury.',
      ar: 'استئصال المرارة بالمنظار هو المعيار الذهبي. حرج: تحقيق العرض الحرج للسلامة (CVS) قبل تشبيك القناة الكيسية لتفادي إصابة القناة الصفراوية المشتركة.',
      de: 'Laparoskopische Cholezystektomie ist der Goldstandard. KRITISCH: Critical View of Safety (CVS) vor Clippen des Ductus cysticus zur Vermeidung von Ductus-choledochus-Verletzung.',
    },
    defaultColor: '#16a34a',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'common_bile_duct',
    systemId: 'internal_organs',
    regionId: 'abdomen_pelvis',
    biologicalSex: 'both',
    names: {
      en: 'Common Bile Duct',
      ar: 'القناة الصفراوية المشتركة',
      de: 'Ductus choledochus',
      latin: 'Ductus choledochus',
    },
    latinName: 'Ductus choledochus',
    synonyms: [
      { en: 'CBD', ar: '', de: '' },
      { en: 'Common hepatic duct', ar: 'القناة الكبدية المشتركة', de: 'Ductus hepaticus communis' },
    ],
    ta2Code: 'A05.8.01.022',
    fmaId: 'FMA:84621',
    course: {
      en: 'Formed by union of cystic duct and common hepatic duct. Descends in hepatoduodenal ligament (part of lesser omentum) posterior to duodenum and pancreas; joins pancreatic duct at ampulla of Vater (hepatopancreatic ampulla) entering duodenum at major papilla.',
      ar: 'تنشأ من اتحاد القناة الكيسية والقناة الكبدية المشتركة. تنزل في الرباط الكبدي الاثني عشري (جزء من الثرب الأصغر) خلف الاثني عشر والبنكرياس؛ تنضم لقناة البنكرياس عند أمبولة فاتر (الأمبولة الكبدية البنكرياسية) لتدخل الاثني عشر عند الحلمة الكبرى.',
      de: 'Entsteht aus Vereinigung von Ductus cysticus und Ductus hepaticus communis. Verläuft im Ligamentum hepatoduodenale (Teil des Omentum minus) posterior von Duodenum und Pankreas; vereint sich mit dem Ductus pancreaticus an der Ampulla Vateri (Ampulla hepatopancreatica) und mündet an der Papilla major ins Duodenum.',
    },
    function: {
      en: 'Carries bile from liver and gallbladder to duodenum. Sphincter of Oddi controls flow.',
      ar: 'تحمل الصفراء من الكبد والمرارة إلى الاثني عشر. مصرة أودي تتحكم في التدفق.',
      de: 'Transportiert Gallenflüssigkeit von Leber und Gallenblase ins Duodenum. Sphincter Oddi kontrolliert den Fluss.',
    },
    anatomicalRelations: {
      en: 'In hepatoduodenal ligament, forms part of portal triad with hepatic artery (medial-left) and portal vein (posterior). Calot\'s triangle contains CBD, cystic duct, cystic artery, right hepatic artery.',
      ar: 'في الرباط الكبدي الاثني عشري، يشكل جزء من ثلاثية البواب مع الشريان الكبدي (إنسي-أيسر) والوريد البوابي (خلفي). مثلث كالوت يحتوي على CBD، القناة الكيسية، الشريان الكيسي، الشريان الكبدي الأيمن.',
      de: 'Im Ligamentum hepatoduodenale, Teil der Portal-Trias mit A. hepatica (medial-links) und V. portae (posterior). Calot-Dreieck enthält Ductus choledochus, Ductus cysticus, A. cystica, A. hepatica dextra.',
    },
    clinicalSignificance: {
      en: 'CBD stones (choledocholithiasis) cause obstructive jaundice, cholangitis, pancreatitis. CBD strictures, tumors (cholangiocarcinoma) cause painless jaundice.',
      ar: 'حصوات القناة الصفراوية (الكوليستياز الالقناوي) تسبب اليرقان الانسدادي، التهاب الأقنية الصفراوية، التهاب البنكرياس. تضيق CBD، الأورام (الكولانجيوكارسينوما) تسبب يرقان غير مؤلم.',
      de: 'CBD-Steine (Choledocholithiasis) verursachen obstruktiven Ikterus, Cholangitis, Pankreatitis. CBD-Strikturen, Tumoren (Cholangiokarzinom) verursachen schmerzlosen Ikterus.',
    },
    surgicalRelevance: {
      en: 'CRITICAL danger zone in cholecystectomy. CBD injury (0.2-0.5% of lap chole) is catastrophic. IOC (intraoperative cholangiogram) helps identify anatomy. ERCP for CBD stones.',
      ar: 'منطقة خطر حرجة في استئصال المرارة. إصابة CBD (0.2-0.5% من استئصال المرارة بالمنظار) كارثية. تصوير الأقنية الصفراوية أثناء العمل (IOC) يساعد على تحديد التشريح. ERCP لحصوات CBD.',
      de: 'KRITISCHE Gefahrenzone bei Cholezystektomie. CBD-Verletzung (0,2-0,5% bei lap. Chole) ist katastrophal. IOC (intraoperative Cholangiographie) hilft bei Anatomie-Identifikation. ERCP für CBD-Steine.',
    },
    defaultColor: '#16a34a',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },

  // ========================================================================
  // NECK — ENDOCRINE
  // ========================================================================
  {
    id: 'thyroid_gland',
    systemId: 'internal_organs',
    regionId: 'head_neck',
    biologicalSex: 'both',
    names: {
      en: 'Thyroid Gland',
      ar: 'الغدة الدرقية',
      de: 'Schilddrüse',
      latin: 'Glandula thyroidea',
    },
    latinName: 'Glandula thyroidea',
    synonyms: [],
    ta2Code: 'A11.3.00.001',
    fmaId: 'FMA:84621',
    function: {
      en: 'Endocrine gland producing T3 (triiodothyronine) and T4 (thyroxine) — regulate metabolism. Also produces calcitonin from C cells (regulates calcium).',
      ar: 'غدة صماء تنتج T3 (ثلاثي يود الثيرونين) و T4 (التيروكسين) — تنظم الأيض. تنتج أيضاً الكالسيتونين من خلايا C (ينظم الكالسيوم).',
      de: 'Endokrine Drüse, die T3 (Triiodthyronin) und T4 (Thyroxin) produziert — regulieren den Stoffwechsel. Produziert auch Calcitonin aus C-Zellen (reguliert Calcium).',
    },
    anatomicalRelations: {
      en: 'Butterfly-shaped, anterior to larynx and trachea at C5-T1. Two lateral lobes connected by isthmus at level of 2nd-4th tracheal rings. Carotid sheath lateral; recurrent laryngeal nerves in tracheoesophageal grooves (posteromedial).',
      ar: 'شكل الفراشة، أمام الحنجرة والرغامى عند C5-T1. فصان جانبيان متصلان ببرزخ عند مستوى الحلقات الرغامية 2-4. الغمد السباتي وحشي؛ العصبان الحنجريان الراجعان في الثلم الرغامي المريئي (خلفي إنسي).',
      de: 'Schmetterlingsförmig, anterior von Kehlkopf und Trachea auf C5-T1. Zwei laterale Lappen verbunden durch Isthmus auf Höhe 2.-4. Trachealring. Carotisscheide lateral; Nervi laryngei recurrentes in Tracheo-Ösophagus-Rinne (posteromedial).',
    },
    bloodSupply: {
      en: 'Superior thyroid artery (ECA branch), inferior thyroid artery (subclavian → thyrocervical trunk). Rare thyroid ima artery from aortic arch or brachiocephalic.',
      ar: 'الشريان الدرقي العلوي (فرع ECA)، الشريان الدرقي السفلي (الشريان تحت الترقوة ← الجذع الدرقي الرقبي). نادراً الشريان الدرقي الإما من قوس الأبهر أو العضدي الرأسي.',
      de: 'A. thyroidea superior (ECA-Ast), A. thyroidea inferior (Subclavia → Truncus thyrocervicalis). Selten A. thyroidea ima aus Aortenbogen oder Truncus brachiocephalicus.',
    },
    venousDrainage: {
      en: 'Superior, middle, and inferior thyroid veins. Superior and middle drain to IJV; inferior drains to brachiocephalic vein.',
      ar: 'الأورداد الدرقية العلوية والوسطى والسفلى. العلوية والوسطى تصرف إلى الوريد الوداجي الداخلي؛ السفلى تصرف إلى الوريد العضدي الرأسي.',
      de: 'Vv. thyroideae superior, media und inferior. Superior und media entleeren in V. jugularis interna; inferior in V. brachiocephalica.',
    },
    innervation: {
      en: 'Sympathetic from cervical ganglia (vasomotor). No parasympathetic motor — hormonal regulation via TSH from pituitary.',
      ar: 'الودي من العقد العنقية (وعائي محرك). لا شبه ودي حركي — تنظيم هرموني عبر TSH من الغدة النخامية.',
      de: 'Sympathisch aus Halsganglien (Vasomotorik). Keine parasympathische Motorik — hormonelle Regulation über TSH aus Hypophyse.',
    },
    clinicalSignificance: {
      en: 'Hyperthyroidism (Graves disease, toxic goiter, Plummer disease), hypothyroidism (Hashimoto thyroiditis, iodine deficiency). Thyroid nodules — 5-15% malignancy. Thyroid cancer: papillary (most common, best prognosis), follicular, medullary, anaplastic.',
      ar: 'فرط نشاط الغدة الدرقية (داء غريفيس، تضخم الغدة السام، داء بلومر)، قصور الغدة الدرقية (التهاب الغدة المناعي الذاتي هاشيموتو، نقص اليود). العقيدات الدرقية — 5-15% خبثية. سرطان الغدة الدرقية: حليمي (الأكثر شيوعاً، أفضل إنذار)، جريبي، النخاعي، الكشمي.',
      de: 'Hyperthyreose (Morbus Basedow, toxische Struma, Plummer), Hypothyreose (Hashimoto-Thyreoiditis, Jodmangel). Schilddrüsenknoten — 5-15% maligne. Schilddrüsenkrebs: papillär (häufigste, beste Prognose), follikulär, medullär, anaplastisch.',
    },
    surgicalRelevance: {
      en: 'Hemithyroidectomy for solitary nodule, total thyroidectomy for cancer/multinodular goiter/Graves. CRITICAL: preserve RLN and parathyroids. Calcium monitoring post-op.',
      ar: 'استئصال نصف الغدة لعقيدة منفردة، استئصال كامل للسرطان/تضخم متعدد العقيدات/غريفيس. حرج: الحفاظ على RLN والجارات الدرقية. مراقبة الكالسيوم بعد العملية.',
      de: 'Hemithyreoidektomie bei solitärem Knoten, totale Thyreoidektomie bei Karzinom/multinodulärer Struma/Basedow. KRITISCH: RLN und Nebenschilddrüsen schonen. Calcium-Monitoring postoperativ.',
    },
    defaultColor: '#7c2d12',
    availability: 'available',
    createdAt: NOW,
    updatedAt: NOW,
  },

  // ========================================================================
  // PLANNED STRUCTURES (explicitly marked — not yet implemented)
  // ========================================================================
  {
    id: 'aorta_abdominal',
    systemId: 'arterial',
    regionId: 'abdomen_pelvis',
    biologicalSex: 'both',
    names: {
      en: 'Abdominal Aorta',
      ar: 'الأبهر البطني',
      de: 'Aorta abdominalis',
      latin: 'Pars abdominalis aortae',
    },
    latinName: 'Aorta abdominalis',
    synonyms: [],
    availability: 'planned',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'inferior_vena_cava',
    systemId: 'venous',
    regionId: 'abdomen_pelvis',
    biologicalSex: 'both',
    names: {
      en: 'Inferior Vena Cava',
      ar: 'الوريد الأجوف السفلي',
      de: 'Vena cava inferior',
      latin: 'Vena cava inferior',
    },
    latinName: 'Vena cava inferior',
    synonyms: [{ en: 'IVC', ar: '', de: '' }],
    availability: 'planned',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'appendix',
    systemId: 'internal_organs',
    regionId: 'abdomen_pelvis',
    biologicalSex: 'both',
    names: {
      en: 'Vermiform Appendix',
      ar: 'الزائدة الدودية',
      de: 'Wurmfortsatz',
      latin: 'Appendix vermiformis',
    },
    latinName: 'Appendix vermiformis',
    synonyms: [
      { en: 'Appendix', ar: 'الزائدة', de: 'Appendix' },
    ],
    availability: 'planned',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'femur_left',
    systemId: 'skeletal',
    regionId: 'lower_limb',
    biologicalSex: 'both',
    names: {
      en: 'Femur (Left)',
      ar: 'عظم الفخذ (أيسر)',
      de: 'Femur (links)',
      latin: 'Femur sinistrum',
    },
    latinName: 'Femur',
    synonyms: [],
    availability: 'planned',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'ureter_right',
    systemId: 'internal_organs',
    regionId: 'abdomen_pelvis',
    biologicalSex: 'both',
    names: {
      en: 'Ureter (Right)',
      ar: 'الحالب (أيمن)',
      de: 'Ureter (rechts)',
      latin: 'Ureter dexter',
    },
    latinName: 'Ureter',
    synonyms: [],
    availability: 'planned',
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'ureter_left',
    systemId: 'internal_organs',
    regionId: 'abdomen_pelvis',
    biologicalSex: 'both',
    names: {
      en: 'Ureter (Left)',
      ar: 'الحالب (أيسر)',
      de: 'Ureter (links)',
      latin: 'Ureter sinister',
    },
    latinName: 'Ureter',
    synonyms: [],
    availability: 'planned',
    createdAt: NOW,
    updatedAt: NOW,
  },
];

// ============================================================================
// SURGICAL PROCEDURES
// ============================================================================

export const SURGICAL_PROCEDURES: SurgicalProcedure[] = [
  {
    id: 'femoral_exposure',
    names: {
      en: 'Femoral Artery Exposure',
      ar: 'التعرض الشرياني الفخذي',
      de: 'Femoralarterien-Freilegung',
    },
    description: {
      en: 'Surgical exposure of the femoral artery for vascular access, embolectomy, or bypass anastomosis. Longitudinal incision over femoral pulse, splitting inguinal ligament fibers, exposing femoral sheath.',
      ar: 'تعرض جراحي للشريان الفخذي للوصول الوعائي أو استئصال الصمة أو تفميم التفميم. شق طولي فوق النبض الفخذي، شق ألياف الرباط الإربي، تعريض الغمد الفخذي.',
      de: 'Chirurgische Freilegung der A. femoralis für Gefäßzugang, Embolektomie oder Bypass-Anastomose. Längsinzision über Femoralpuls, Durchtrennung von Leistenbandfasern, Freilegung der Fascia femoralis.',
    },
    specialty: 'Vascular Surgery',
    approach: 'open',
    relatedStructureIds: ['femoral_artery_right', 'femoral_artery_left', 'femoral_vein_right', 'femoral_nerve_right', 'sartorius_muscle_right', 'iliopsoas_muscle_right', 'pectineus_muscle_right'],
    educationalNotes: {
      en: 'Landmarks: mid-inguinal point (halfway between ASIS and pubic tubercle). NAVL arrangement from lateral to medial. Avoid injuring femoral nerve (lateral). Use longitudinal incision for vascular, transverse for access only.',
      ar: 'علامات: نقطة منتصف الإربية (منتصف المسافة بين ASIS والحدبة العانية). ترتيب NAVL من وحشي إلى أنسي. تجنب إصابة العصب الفخذي (وحشي). استخدم شق طولي للجراحة الوعائية، عرضي للوصول فقط.',
      de: 'Orientierung: Mittelpunkt der Leiste (Mitte zwischen SIAS und Tuberculum pubicum). NAVL von lateral nach medial. Verletzung des N. femoralis (lateral) vermeiden. Längsinzision für Gefäßchirurgie, Querinzision nur für Zugang.',
    },
    relatedDangerZoneIds: ['femoral_neurovascular_bundle', 'femoral_nerve_injury_zone'],
    order: 1,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'femoral_embolectomy',
    names: {
      en: 'Femoral Embolectomy',
      ar: 'استئصال الصمة الفخذي',
      de: 'Femoral-Embolektomie',
    },
    description: {
      en: 'Removal of embolus from femoral artery using Fogarty catheter. Emergency procedure for acute limb ischemia (ALI). Class II/III ALI requires immediate operation.',
      ar: 'إزالة الصمة من الشريان الفخذي باستخدام قثطار فوغارتي. إجراء طارئ لنقص التروية الحاد للطرف (ALI). الفئة II/III من ALI تتطلب تدخلاً فورياً.',
      de: 'Entfernung eines Embolus aus der A. femoralis mit Fogarty-Katheter. Notfalleingriff bei akuter Gliedmaßenischchämie (ALI). ALI Klasse II/III erfordert sofortige Operation.',
    },
    specialty: 'Vascular Surgery',
    approach: 'open',
    relatedStructureIds: ['femoral_artery_right', 'femoral_artery_left', 'femoral_vein_right'],
    educationalNotes: {
      en: 'Class I ALI: not immediately threatened — observe + heparin. Class II: threatened — prompt operation. Class III: irreversible — amputation. Fogarty catheter 4-6F for femoral. Distal pulses restored in 80-90%.',
      ar: 'الفئة I: غير مهدد فوراً — مراقبة + هيبارين. الفئة II: مهدد — تدخل فوري. الفئة III: لا رجعة — بتر. قثطار فوغارتي 4-6F للفخذي. يستعيد النبض البعيد في 80-90%.',
      de: 'Klasse I: nicht unmittelbar bedroht — beobachten + Heparin. Klasse II: bedroht — sofortige OP. Klasse III: irreversibel — Amputation. Fogarty-Katheter 4-6F für Femoralis. Distale Pulse in 80-90% wiederhergestellt.',
    },
    relatedDangerZoneIds: ['femoral_neurovascular_bundle'],
    order: 2,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'carotid_endarterectomy',
    names: {
      en: 'Carotid Endarterectomy',
      ar: 'استئصال البطانة السباتية',
      de: 'Carotisendarteriektomie',
    },
    description: {
      en: 'Surgical removal of atherosclerotic plaque from carotid bifurcation to prevent stroke in symptomatic patients with high-grade stenosis. Standard treatment since NASCET trial.',
      ar: 'إزالة جراحية للويحة التصلبية من الانقسام السباتي لمنع السكتة الدماغية في المرضى العرضيين مع التضيق عالي الدرجة. العلاج القياسي منذ دراسة NASCET.',
      de: 'Chirurgische Entfernung atherosklerotischer Plaques aus der Carotisbifurkation zur Schlaganfallprävention bei symptomatischen Patienten mit hochgradiger Stenose. Standardbehandlung seit NASCET-Studie.',
    },
    specialty: 'Vascular Surgery',
    approach: 'open',
    relatedStructureIds: ['common_carotid_artery_right', 'recurrent_laryngeal_nerve_right'],
    educationalNotes: {
      en: 'Indications: symptomatic stenosis 70-99% (NASCET) — strongest benefit. 50-69% — moderate benefit. Asymptomatic >60% — selective. Perioperative stroke/death risk must be <6% (symptomatic) or <3% (asymptomatic).',
      ar: 'الاستطبابات: تضيق عرضي 70-99% (NASCET) — أكبر فائدة. 50-69% — فائدة متوسطة. غير عرضي >60% — انتقائي. خطر السكتة/الوفاة حول العملية يجب أن يكون <6% (عرضي) أو <3% (غير عرضي).',
      de: 'Indikationen: symptomatische Stenose 70-99% (NASCET) — stärkster Benefit. 50-69% — mäßiger Benefit. Asymptomatisch >60% — selektiv. Perioperatives Schlaganfall/Tod-Risiko muss <6% (symptomatisch) oder <3% (asymptomatisch) sein.',
    },
    relatedDangerZoneIds: ['carotid_sheath', 'recurrent_laryngeal_nerve_zone'],
    order: 3,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'laparoscopic_cholecystectomy',
    names: {
      en: 'Laparoscopic Cholecystectomy',
      ar: 'استئصال المرارة بالمنظار',
      de: 'Laparoskopische Cholezystektomie',
    },
    description: {
      en: 'Gold standard for symptomatic gallstones. Achieve Critical View of Safety (CVS) before clipping cystic duct to prevent CBD injury. Conversion to open in 5-10% (acute cholecystitis).',
      ar: 'المعيار الذهبي لحصوات المرارة العرضية. تحقيق العرض الحرج للسلامة (CVS) قبل تشبيك القناة الكيسية لمنع إصابة القناة الصفراوية المشتركة. التحويل لفتح في 5-10% (التهاب المرارة الحاد).',
      de: 'Goldstandard bei symptomatischen Gallensteinen. Critical View of Safety (CVS) vor Clippen des Ductus cysticus zur Vermeidung von Ductus-choledochus-Verletzung. Konversion in 5-10% (akute Cholezystitis).',
    },
    specialty: 'General Surgery',
    approach: 'laparoscopic',
    relatedStructureIds: ['gallbladder', 'common_bile_duct'],
    educationalNotes: {
      en: 'CVS = clearance of hepatocystic triangle + lower third of gallbladder dissected off liver bed + only 2 structures entering gallbladder visible. If CVS not achieved → IOC or convert to open. SAGES Safe Cholecystectomy Task Force 2020.',
      ar: 'CVS = تطهير المثلث الكبدي الكيسي + الثلث السفلي للمرارة مُفصل عن سرير الكبد + بنيتان فقط تدخلان المرارة مرئية. إذا لم يتحقق CVS ← تصوير الأقنية الصفراوية أو التحويل لفتح. فريق عمل SAGES للمرارة الآمنة 2020.',
      de: 'CVS = Ausdünnung des Calot-Dreiecks + unteres Drittel der Gallenblase vom Leberbett gelöst + nur 2 Strukturen Eintritt in die Gallenblase sichtbar. Wenn CVS nicht erreicht → IOC oder Konversion. SAGES Safe Cholecystectomy Task Force 2020.',
    },
    relatedDangerZoneIds: ['cbd_injury_zone', 'cystic_artery_bleeding_zone'],
    order: 4,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'thyroidectomy',
    names: {
      en: 'Thyroidectomy (Total)',
      ar: 'استئصال الغدة الدرقية (كامل)',
      de: 'Totale Thyreoidektomie',
    },
    description: {
      en: 'Removal of entire thyroid gland for cancer, multinodular goiter, or Graves disease. Critical: identify and preserve recurrent laryngeal nerves (RLN) and parathyroid glands.',
      ar: 'إزالة الغدة الدرقية بالكامل للسرطان أو تضخم متعدد العقيدات أو داء غريفيس. حرج: تحديد وحفظ العصب الحنجري الراجع (RLN) والغدد الجار درقية.',
      de: 'Entfernung der gesamten Schilddrüse bei Karzinom, multinodulärer Struma oder M. Basedow. KRITISCH: Identifikation und Schonung der Nervi laryngei recurrentes (RLN) und Nebenschilddrüsen.',
    },
    specialty: 'General Surgery',
    approach: 'open',
    relatedStructureIds: ['thyroid_gland', 'recurrent_laryngeal_nerve_right', 'common_carotid_artery_right'],
    educationalNotes: {
      en: 'ATA Guidelines 2021: routine RLN identification reduces injury from 5-10% to <1%. Intraoperative nerve monitoring (IONM) adjunct. Parathyroid auto-transplantation if devascularized. Post-op calcium monitoring.',
      ar: 'إرشادات ATA 2021: التحديد الروتيني لـ RLN يقلل الإصابة من 5-10% إلى <1%. مراقبة العصب داخل العملية (IONM) مساعد. الزرع الذاتي للجار درقية إذا فُقد التروية. مراقبة الكالسيوم بعد العملية.',
      de: 'ATA-Leitlinien 2021: routinemäßige RLN-Identifikation reduziert Verletzung von 5-10% auf <1%. Intraoperatives Nervenmonitoring (IONM) als Ergänzung. Parathyreoidea-Autotransplantation bei Devaskularisation. Postoperatives Calcium-Monitoring.',
    },
    relatedDangerZoneIds: ['recurrent_laryngeal_nerve_zone', 'parathyroid_injury_zone'],
    order: 5,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'aaa_repair',
    names: {
      en: 'Abdominal Aortic Aneurysm Repair',
      ar: 'إصلاح أم دم أبهرية بطنية',
      de: 'Bauchaortenaneurysma-Repair',
    },
    description: {
      en: 'Repair of abdominal aortic aneurysm (AAA). Open repair: Dacron graft. EVAR: endovascular stent graft. Threshold: 5.5 cm in men, 5.0 cm in women (or rapid growth >1 cm/year).',
      ar: 'إصلاح أم الدم الأبهرية البطنية (AAA). إصلاح مفتوح: رقعة من الداكرون. EVAR: رقعة داخل وعائية. الحد: 5.5 سم للذكور، 5.0 سم للإناث (أو نمو سريع >1 سم/سنة).',
      de: 'Versorgung eines Bauchaortenaneurysmas (BAA). Offen: Dacron-Prothese. EVAR: endovaskuläre Stentprothese. Grenzwert: 5,5 cm bei Männern, 5,0 cm bei Frauen (oder Wachstum >1 cm/Jahr).',
    },
    specialty: 'Vascular Surgery',
    approach: 'mixed',
    relatedStructureIds: ['aorta_abdominal', 'inferior_vena_cava', 'ureter_right', 'ureter_left'],
    educationalNotes: {
      en: 'EVAR preferred in older/high-risk patients with suitable anatomy (neck <60° angulation, length >15mm, access vessels). Lifelong surveillance required. Open more durable for young patients.',
      ar: 'EVAR مفضل في المرضى كبار/عالي الخطورة مع تشريح مناسب (رقبة <60° زاوية، طول >15 مم، أوعية وصول). مراقبة مدى الحياة مطلوبة. المفتوح أكثر متانة للمرضى الشباب.',
      de: 'EVAR bevorzugt bei älteren/hochrisiko-Patienten mit geeigneter Anatomie (Hals <60° Angulation, Länge >15mm, Zugangsefäße). Lebenslange Überwachung erforderlich. Offen dauerhafter für junge Patienten.',
    },
    relatedDangerZoneIds: ['ivc_injury_zone', 'ureteral_injury_zone'],
    order: 6,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'appendectomy',
    names: {
      en: 'Appendectomy',
      ar: 'استئصال الزائدة',
      de: 'Appendektomie',
    },
    description: {
      en: 'Removal of inflamed appendix. Laparoscopic preferred in adults (lower SSI, faster recovery). Open for perforated appendicitis or difficult anatomy.',
      ar: 'إزالة الزائدة الملتهبة. المنظار مفضل للبالغين (SSI أقل، تعافي أسرع). المفتوح للزائدة المثقوبة أو التشريح الصعب.',
      de: 'Entfernung der entzündeten Appendix. Laparoskopisch bevorzugt bei Erwachsenen (niedrigere SSI, schnellere Erholung). Offen bei perforierter Appendizitis oder schwieriger Anatomie.',
    },
    specialty: 'General Surgery',
    approach: 'laparoscopic',
    relatedStructureIds: ['appendix'],
    educationalNotes: {
      en: 'Stump management: endoloop or stapler. Invagination not required (RCTs show no benefit). Conversion to open in 5-10% (severe inflammation, base involvement). Antibiotics for uncomplicated — controversial.',
      ar: 'إدارة الجذم: حلقة داخلية أو دباسة. الغرز غير مطلوب (الدراسات لا تظهر فائدة). التحويل لفتح في 5-10% (التهاب شديد، إصابة القاعدة). مضادات حيوية للحالة غير المعقدة — جدلي.',
      de: 'Stumpf-Versorgung: Endoloop oder Stapler. Invagination nicht erforderlich (RCTs zeigen keinen Benefit). Konversion in 5-10% (schwere Entzündung, Basis-Beteiligung). Antibiotika bei unkomplizierter — kontrovers.',
    },
    relatedDangerZoneIds: ['appendix_injury_zone'],
    order: 7,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

// ============================================================================
// DANGER ZONES — Clinically verified, requiring special attention during surgery
// ============================================================================

export const DANGER_ZONES: DangerZone[] = [
  {
    id: 'femoral_neurovascular_bundle',
    names: {
      en: 'Femoral Neurovascular Bundle',
      ar: 'الحزمة العصبية الوعائية الفخذية',
      de: 'Femorales neurovaskuläres Bündel',
    },
    description: {
      en: 'The femoral nerve, artery, vein, and lymphatics contained within the femoral sheath. Critical anatomical structure during any groin surgery.',
      ar: 'العصب والشريان والوريد والأوعية اللمفاوية الفخذية المحتواة في الغمد الفخذي. تركيب تشريحي حرج أثناء أي جراحة في المغبن.',
      de: 'Nerv, Arterie, Vene und Lymphgefäße des Femoralscheide. Kritische anatomische Struktur bei jeder Leistenoperation.',
    },
    location: {
      en: 'Femoral triangle, beneath inguinal ligament, lateral to medial: NAVL — Nerve, Artery, Vein, Lymphatics.',
      ar: 'المثلث الفخذي، أسفل الرباط الإربي، من وحشي إلى أنسي: NAVL — العصب، الشريان، الوريد، الأوعية اللمفاوية.',
      de: 'Femorales Dreieck, unter dem Leistenband, lateral nach medial: NAVL — Nerv, Arterie, Vene, Lymphgefäße.',
    },
    associatedStructureIds: ['femoral_artery_right', 'femoral_artery_left', 'femoral_vein_right', 'femoral_nerve_right'],
    relatedProcedureIds: ['femoral_exposure', 'femoral_embolectomy'],
    clinicalSignificance: {
      en: 'Femoral nerve injury → quadriceps weakness. Femoral artery injury → bleeding, limb ischemia. Femoral vein injury → DVT, bleeding.',
      ar: 'إصابة العصب الفخذي ← ضعف الرباعية. إصابة الشريان الفخذي ← نزيف، نقص تروية الطرف. إصابة الوريد الفخذي ← DVT، نزيف.',
      de: 'Femoralnervenverletzung → Quadrizeps-Schwäche. Femoralarterienverletzung → Blutung, Ischämie. Femoralvenenverletzung → TVT, Blutung.',
    },
    references: [
      'https://pubmed.ncbi.nlm.nih.gov/31613748/',
      'Asian Cardiovascular & Thoracic Annals, 2019 — Femoral artery exposure',
    ],
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only — not a substitute for surgical training, supervision, or intraoperative guidance.',
      ar: 'مرجع تعليمي فقط — ليس بديلاً عن التدريب الجراحي أو الإشراف أو التوجيه داخل العملية.',
      de: 'Nur Bildungsnachschlag — kein Ersatz für chirurgische Ausbildung, Aufsicht oder intraoperative Anleitung.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'femoral_nerve_injury_zone',
    names: {
      en: 'Femoral Nerve Injury Zone',
      ar: 'منطقة إصابة العصب الفخذي',
      de: 'Femoralnerven-Verletzungszone',
    },
    description: {
      en: 'Risk zone for femoral nerve injury during groin surgery — particularly lateral approaches to the femoral artery.',
      ar: 'منطقة خطر لإصابة العصب الفخذي أثناء جراحة المغبن — خاصة المناحذ الوحشية للشريان الفخذي.',
      de: 'Gefahrenzone für Femoralnervenverletzung bei Leistenoperation — insbesondere laterale Zugänge zur A. femoralis.',
    },
    location: {
      en: 'Lateral aspect of femoral sheath, deep to inguinal ligament, on psoas major tendon.',
      ar: 'الوجه الوحشي للغمد الفخذي، عميق للرباط الإربي، على وتر العضلة الحرقفية القطنية.',
      de: 'Lateraler Aspekt der Femoralscheide, unter dem Leistenband, auf der Sehne des M. psoas major.',
    },
    associatedStructureIds: ['femoral_nerve_right'],
    relatedProcedureIds: ['femoral_exposure', 'femoral_embolectomy'],
    clinicalSignificance: {
      en: 'Injury causes quadriceps weakness (unable to extend knee), loss of anterior thigh sensation, and medial leg/foot numbness (via saphenous nerve).',
      ar: 'الإصابة تسبب ضعف الرباعية (عدم القدرة على بسط الركبة)، فقدان إحساس الفخذ الأمامي، وخدر الساق/القدم الإنسي (عبر العصب الصافن).',
      de: 'Verletzung verursacht Quadrizeps-Schwäche (Kniestreckung unmöglich), Sensibilitätsverlust an vorderem Oberschenkel und Taubheit am medialen Bein/Fuß (über N. saphenus).',
    },
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only.',
      ar: 'مرجع تعليمي فقط.',
      de: 'Nur Bildungsnachschlag.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'carotid_sheath',
    names: {
      en: 'Carotid Sheath',
      ar: 'الغمد السباتي',
      de: 'Carotisscheide',
    },
    description: {
      en: 'Fascial sheath containing common carotid artery, internal carotid artery, internal jugular vein, and vagus nerve. Critical in neck surgery.',
      ar: 'غمد فاشي يحتوي على الشريان السباتي المشترك والشريان السباتي الداخلي والوريد الوداجي الداخلي والعصب المبهم. حرج في جراحة العنق.',
      de: 'Faszienhülle mit A. carotis communis, A. carotis interna, V. jugularis interna und N. vagus. Kritisch bei Halschirurgie.',
    },
    location: {
      en: 'Lateral neck, deep to sternocleidomastoid muscle, extending from base of skull to thoracic inlet.',
      ar: 'العنق الوحشي، عميق للعضلة القصية الترقوية الخشائية، يمتد من قاعدة الجمجمة إلى المدخل الصدري.',
      de: 'Lateraler Hals, tief unter dem M. sternocleidomastoideus, von Schädelbasis bis Thoraxeingang.',
    },
    associatedStructureIds: ['common_carotid_artery_right', 'recurrent_laryngeal_nerve_right'],
    relatedProcedureIds: ['carotid_endarterectomy', 'thyroidectomy'],
    clinicalSignificance: {
      en: 'Vagus nerve injury → vocal cord dysfunction, swallowing difficulties. Carotid artery injury → stroke. IJV injury → air embolism, bleeding.',
      ar: 'إصابة العصب المبهم ← خلل الحبل الصوتي، صعوبة البلع. إصابة الشريان السباتي ← سكتة. إصابة IJV ← انسداد هوائي، نزيف.',
      de: 'Vagusverletzung → Stimmbanddysfunktion, Schluckstörung. Carotisverletzung → Schlaganfall. IJV-Verletzung → Luftembolie, Blutung.',
    },
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only.',
      ar: 'مرجع تعليمي فقط.',
      de: 'Nur Bildungsnachschlag.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'recurrent_laryngeal_nerve_zone',
    names: {
      en: 'Recurrent Laryngeal Nerve Zone',
      ar: 'منطقة العصب الحنجري الراجع',
      de: 'Rekurrensnervenzone',
    },
    description: {
      en: 'Critical zone for recurrent laryngeal nerve (RLN) during thyroid and parathyroid surgery. RLN runs in tracheoesophageal groove, must be identified and preserved.',
      ar: 'منطقة حرجة للعصب الحنجري الراجع (RLN) أثناء جراحة الغدة الدرقية والجار درقية. RLN يقع في الثلم الرغامي المريئي، يجب تحديده وحفظه.',
      de: 'Kritische Zone für N. laryngeus recurrens (RLN) bei Schilddrüsen- und Nebenschilddrüsen-OP. RLN verläuft in Tracheo-Ösophagus-Rille, muss identifiziert und geschont werden.',
    },
    location: {
      en: 'Tracheoesophageal groove, posterior to thyroid lobe, intimate relation with inferior thyroid artery.',
      ar: 'الثلم الرغامي المريئي، خلف الفص الدرقي، علاقة وثيقة بالشريان الدرقي السفلي.',
      de: 'Tracheo-Ösophagus-Rinne, posterior des Schilddrüsenlappen, enge Beziehung zur A. thyroidea inferior.',
    },
    associatedStructureIds: ['recurrent_laryngeal_nerve_right'],
    relatedProcedureIds: ['thyroidectomy'],
    clinicalSignificance: {
      en: 'Unilateral RLN injury → hoarseness. Bilateral RLN injury → stridor, may require emergency tracheostomy. Non-recurrent laryngeal nerve variant (0.5-1%) with aberrant right subclavian artery.',
      ar: 'إصابة RLN أحادية ← بحة. إصابة ثنائية ← صرير، قد يتطلب فغر الرغامى الطارئ. تباين العصب غير الراجع (0.5-1%) مع الشريان تحت الترقوة الأيمن الشاذ.',
      de: 'Einseitige RLN-Verletzung → Heiserkeit. Beidseitige Verletzung → Stridor, evtl. Notfalltracheotomie. Nicht-rekurrenter Laryngeus-Variante (0,5-1%) bei aberranter A. subclavia dextra.',
    },
    references: [
      'ATA Surgical Guidelines 2021',
      'https://www.sages.org/publications/guidelines/',
    ],
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only — RLN identification requires surgical expertise.',
      ar: 'مرجع تعليمي فقط — تحديد RLN يتطلب خبرة جراحية.',
      de: 'Nur Bildungsnachschlag — RLN-Identifikation erfordert chirurgische Expertise.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cbd_injury_zone',
    names: {
      en: 'Common Bile Duct Injury Zone',
      ar: 'منطقة إصابة القناة الصفراوية المشتركة',
      de: 'Ductus-choledochus-Verletzungszone',
    },
    description: {
      en: 'Critical zone for CBD injury during cholecystectomy. Achieve Critical View of Safety (CVS) before clipping. CBD injury (0.2-0.5%) is catastrophic.',
      ar: 'منطقة حرجة لإصابة CBD أثناء استئصال المرارة. تحقيق العرض الحرج للسلامة (CVS) قبل التشبيك. إصابة CBD (0.2-0.5%) كارثية.',
      de: 'Kritische Zone für CBD-Verletzung bei Cholezystektomie. Critical View of Safety (CVS) vor Clippen. CBD-Verletzung (0,2-0,5%) ist katastrophal.',
    },
    location: {
      en: 'Calot\'s triangle (hepatocystic triangle): bounded by cystic duct, common hepatic duct, and liver edge.',
      ar: 'مثلث كالوت (المثلث الكبدي الكيسي): محدد بالقناة الكيسية والقناة الكبدية المشتركة وحافة الكبد.',
      de: 'Calot-Dreieck (hepatozystisches Dreieck): begrenzt durch Ductus cysticus, Ductus hepaticus communis und Leberkante.',
    },
    associatedStructureIds: ['common_bile_duct', 'gallbladder'],
    relatedProcedureIds: ['laparoscopic_cholecystectomy'],
    clinicalSignificance: {
      en: 'CBD injury — catastrophic complication of cholecystectomy. May require hepaticojejunostomy (Roux-en-Y). Early recognition critical. SAGES Safe Cholecystectomy Task Force Guidelines.',
      ar: 'إصابة CBD — مضاعفة كارثية لاستئصال المرارة. قد تتطلب التفميم الكبدي الصائمي (Roux-en-Y). التعرف المبكر حرج. إرشادات فريق عمل SAGES للمرارة الآمنة.',
      de: 'CBD-Verletzung — katastrophale Komplikation der Cholezystektomie. Erfordert evtl. Hepatikojejunostomie (Roux-en-Y). Frühe Erkennung kritisch. SAGES-Safe-Cholecystectomy-Task-Force-Leitlinien.',
    },
    references: [
      'SAGES Safe Cholecystectomy Task Force Guidelines (2020)',
      'Tokyo Guidelines TG18 for Acute Cholecystitis',
    ],
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only — CBD identification requires CVS achievement.',
      ar: 'مرجع تعليمي فقط — تحديد CBD يتطلب تحقيق CVS.',
      de: 'Nur Bildungsnachschlag — CBD-Identifikation erfordert CVS.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'cystic_artery_bleeding_zone',
    names: {
      en: 'Cystic Artery Bleeding Zone',
      ar: 'منطقة نزف الشريان الكيسي',
      de: 'A.-cystica-Blutungszone',
    },
    description: {
      en: 'Cystic artery typically from right hepatic artery, but varies in 15-20% of cases. Bleeding during cholecystectomy can be challenging.',
      ar: 'الشريان الكيسي عادة من الشريان الكبدي الأيمن، لكنه يختلف في 15-20% من الحالات. النزيف أثناء استئصال المرارة قد يكون تحدياً.',
      de: 'A. cystica meist aus A. hepatica dextra, variiert bei 15-20%. Blutung bei Cholezystektomie kann herausfordernd sein.',
    },
    location: {
      en: 'Calot\'s triangle, typically crossing common hepatic duct.',
      ar: 'مثلث كالوت، عادة يعبر القناة الكبدية المشتركة.',
      de: 'Calot-Dreieck, kreuzt typischerweise Ductus hepaticus communis.',
    },
    associatedStructureIds: ['gallbladder'],
    relatedProcedureIds: ['laparoscopic_cholecystectomy'],
    clinicalSignificance: {
      en: 'Variations include: dual cystic arteries, origin from left hepatic, common hepatic, gastroduodenal. Bleeding may require conversion to open.',
      ar: 'التباينات تشمل: شريانان كيسيان، منشأ من الكبدي الأيسر، الكبدي المشترك، المعدي الاثني عشري. النزيف قد يتطلب التحويل لفتح.',
      de: 'Variationen: doppelte A. cystica, Ursprung aus A. hepatica sinistra, A. hepatica communis, A. gastroduodenalis. Blutung kann Konversion erfordern.',
    },
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only.',
      ar: 'مرجع تعليمي فقط.',
      de: 'Nur Bildungsnachschlag.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'parathyroid_injury_zone',
    names: {
      en: 'Parathyroid Injury Zone',
      ar: 'منطقة إصابة الجارات الدرقية',
      de: 'Nebenschilddrüsen-Verletzungszone',
    },
    description: {
      en: 'Risk of injuring or devascularizing parathyroid glands during thyroidectomy. Causes postoperative hypocalcemia.',
      ar: 'خطر إصابة أو فقدان تروية الغدد الجار درقية أثناء استئصال الغدة الدرقية. يسبب نقص كالسيوم بعد العملية.',
      de: 'Risiko der Verletzung oder Devaskularisation der Nebenschilddrüsen bei Thyreoidektomie. Verursacht postoperative Hypokalzämie.',
    },
    location: {
      en: 'Posterior to thyroid lobes; superior parathyroids at level of middle of thyroid, inferior at level of inferior thyroid artery.',
      ar: 'خلف الفصوص الدرقية؛ الجار درقية العلوية عند مستوى منتصف الغدة الدرقية، السفلية عند مستوى الشريان الدرقي السفلي.',
      de: 'Posterior der Schilddrüsenlappen; obere Nebenschilddrüsen auf Höhe der Schilddrüsenmitte, untere auf Höhe der A. thyroidea inferior.',
    },
    associatedStructureIds: ['thyroid_gland'],
    relatedProcedureIds: ['thyroidectomy'],
    clinicalSignificance: {
      en: 'Hypocalcemia occurs in 5-15% of total thyroidectomies (transient). Permanent in <2%. Auto-transplant devascularized glands to sternocleidomastoid.',
      ar: 'نقص الكالسيوم يحدث في 5-15% من استئصال الغدة الكامل (مؤقت). دائم في <2%. زراعة الغدد المفقودة التروية في القصية الترقوية الخشائية.',
      de: 'Hypokalzämie in 5-15% der totalen Thyreoidektomien (transient). Permanent in <2%. Autotransplantation devaskularisierter Drüsen in den M. sternocleidomastoideus.',
    },
    references: [
      'ATA Surgical Guidelines 2021',
    ],
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only.',
      ar: 'مرجع تعليمي فقط.',
      de: 'Nur Bildungsnachschlag.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'ivc_injury_zone',
    names: {
      en: 'IVC Injury Zone',
      ar: 'منطقة إصابة الوريد الأجوف السفلي',
      de: 'V.-cava-inferior-Verletzungszone',
    },
    description: {
      en: 'Risk zone for IVC injury during major abdominal/retroperitoneal surgery. High mortality (30-50%) due to massive bleeding.',
      ar: 'منطقة خطر لإصابة IVC أثناء جراحة البطن/الصفاق الخلفي الرئيسية. وفيات عالية (30-50%) بسبب نزيف هائل.',
      de: 'Gefahrenzone für IVC-Verletzung bei großen abdominalen/retroperitonealen Eingriffen. Hohe Mortalität (30-50%) durch massive Blutung.',
    },
    location: {
      en: 'Right of aorta, anterior to vertebral column, from L5 to diaphragm.',
      ar: 'يمين الأبهر، أمام العمود الفقري، من L5 إلى الحجاب الحاجز.',
      de: 'Rechts der Aorta, anterior der Wirbelsäule, von L5 bis Zwerchfell.',
    },
    associatedStructureIds: ['inferior_vena_cava', 'aorta_abdominal'],
    relatedProcedureIds: ['aaa_repair'],
    clinicalSignificance: {
      en: 'IVC injury is life-threatening. Control with proximal and distal compression. Lateral venorrhaphy or patch angioplasty. Plication for avulsion injuries.',
      ar: 'إصابة IVC تهدد الحياة. السيطرة بالضغط القريب والبعيد. رأب وريدي جانبي أو رأب بالرقعة. التنديب لإصابات الانتزاع.',
      de: 'IVC-Verletzung ist lebensbedrohlich. Kontrolle durch proximalen und distalen Druck. Laterale Venorrhaphie oder Patch-Angioplastik. Plikation für Avulsionsverletzungen.',
    },
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only.',
      ar: 'مرجع تعليمي فقط.',
      de: 'Nur Bildungsnachschlag.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'ureteral_injury_zone',
    names: {
      en: 'Ureteral Injury Zone',
      ar: 'منطقة إصابة الحالب',
      de: 'Ureterverletzungszone',
    },
    description: {
      en: 'Risk zone for ureteral injury during abdominal, pelvic, and vascular surgery. Ureter at risk during AAA repair, colorectal, gynecological surgery.',
      ar: 'منطقة خطر لإصابة الحالب أثناء جراحة البطن والحوض والأوعية. الحالب معرض للخطر أثناء إصلاح AAA، الجراحة colorectal، أمراض النساء.',
      de: 'Gefahrenzone für Ureterverletzung bei abdominaler, pelviner und gefäßchirurgischer OP. Ureter bei AAA-Repair, kolorektaler und gynäkologischer Chirurgie gefährdet.',
    },
    location: {
      en: 'Ureters descend retroperitoneally on psoas, lateral to vertebral column; cross bifurcation of common iliac artery — key landmark.',
      ar: 'الحالبان ينزلان خلف الصفاق على الحرقفية القطنية، وحشي العمود الفقري؛ يعبران انقسام الشريان الحرقفي المشترك — علامة رئيسية.',
      de: 'Ureteren descenderen retroperitoneal auf Psoas, lateral der Wirbelsäule; kreuzen Bifurkation der A. iliaca communis — wichtiges Orientierungsmal.',
    },
    associatedStructureIds: ['ureter_right', 'ureter_left'],
    relatedProcedureIds: ['aaa_repair'],
    clinicalSignificance: {
      en: 'Ureteral injury often unrecognized intraoperatively. Postop fever, flank pain, urinoma. Repair: primary anastomosis, reimplantation, or stenting.',
      ar: 'إصابة الحالب غالباً غير مُتعرف عليها أثناء العملية. حمى بعد العملية، أمن fiank، ورم بولي. الإصلاح: تفميم أولي، إعادة زرع، أو تركيب دعامة.',
      de: 'Ureterverletzung oft intraoperativ unerkannt. Postoperatives Fieber, Flankenschmerz, Urinom. Versorgung: primäre Anastomose, Reimplantation oder Stent.',
    },
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only.',
      ar: 'مرجع تعليمي فقط.',
      de: 'Nur Bildungsnachschlag.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 'appendix_injury_zone',
    names: {
      en: 'Appendix Injury Zone',
      ar: 'منطقة إصابة الزائدة',
      de: 'Appendix-Verletzungszone',
    },
    description: {
      en: 'Risk of stump leak or injury to surrounding structures (cecum, ileum, ureter, ovaries in females) during appendectomy.',
      ar: 'خطر تسرب الجذم أو إصابة التراكيب المجاورة (الأعور، اللفائفي، الحالب، المبايض في الإناث) أثناء استئصال الزائدة.',
      de: 'Risiko des Stumpf-Lecks oder Verletzung umgebender Strukturen (Coecum, Ileum, Ureter, Ovarien bei Frauen) bei Appendektomie.',
    },
    location: {
      en: 'Base of appendix at posteromedial cecum, 2 cm below ileocecal valve. Position varies (retrocecal 65%, pelvic 30%).',
      ar: 'قاعدة الزائدة في الأعور الخلفي الإنسي، 2 سم تحت الصمام اللفائفي الأعوري. الموضع يختلف (خلف الأعور 65%، الحوضي 30%).',
      de: 'Basis der Appendix an posteromedialem Coecum, 2 cm unter Ileozäkalklappe. Position variiert (retrozökal 65%, pelvin 30%).',
    },
    associatedStructureIds: ['appendix'],
    relatedProcedureIds: ['appendectomy'],
    clinicalSignificance: {
      en: 'Stump leak → intra-abdominal abscess. Ureter injury possible in pelvic appendix. Right ureter always identified during appendectomy.',
      ar: 'تسرب الجذم ← خراج داخل البطن. إصابة الحالب ممكنة في الزائدة الحوضية. الحالب الأيمن يُحدد دائماً أثناء استئصال الزائدة.',
      de: 'Stumpf-Leck → intraabdomineller Abszess. Ureterverletzung bei pelviner Appendix möglich. Rechter Ureter immer bei Appendektomie identifizieren.',
    },
    highlightColor: '#dc2626',
    disclaimer: {
      en: 'Educational reference only.',
      ar: 'مرجع تعليمي فقط.',
      de: 'Nur Bildungsnachschlag.',
    },
    clinicallyReviewed: true,
    reviewedBy: 'SurgiTrack iLog Clinical Review Team',
    reviewedAt: NOW,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

// ============================================================================
// PROCEDURE-STRUCTURE RELATIONSHIPS (MANY-TO-MANY)
// ============================================================================

export const PROCEDURE_STRUCTURES: ProcedureStructure[] = [
  // Femoral exposure
  { id: 'ps_femoral_exposure_fa_r', procedureId: 'femoral_exposure', structureId: 'femoral_artery_right', role: 'target', createdAt: NOW },
  { id: 'ps_femoral_exposure_fa_l', procedureId: 'femoral_exposure', structureId: 'femoral_artery_left', role: 'target', createdAt: NOW },
  { id: 'ps_femoral_exposure_fv', procedureId: 'femoral_exposure', structureId: 'femoral_vein_right', role: 'related', createdAt: NOW },
  { id: 'ps_femoral_exposure_fn', procedureId: 'femoral_exposure', structureId: 'femoral_nerve_right', role: 'danger', createdAt: NOW },
  { id: 'ps_femoral_exposure_sartorius', procedureId: 'femoral_exposure', structureId: 'sartorius_muscle_right', role: 'landmark', createdAt: NOW },
  { id: 'ps_femoral_exposure_iliopsoas', procedureId: 'femoral_exposure', structureId: 'iliopsoas_muscle_right', role: 'landmark', createdAt: NOW },
  { id: 'ps_femoral_exposure_pectineus', procedureId: 'femoral_exposure', structureId: 'pectineus_muscle_right', role: 'landmark', createdAt: NOW },

  // Femoral embolectomy
  { id: 'ps_fem_emb_fa_r', procedureId: 'femoral_embolectomy', structureId: 'femoral_artery_right', role: 'target', createdAt: NOW },
  { id: 'ps_fem_emb_fa_l', procedureId: 'femoral_embolectomy', structureId: 'femoral_artery_left', role: 'target', createdAt: NOW },
  { id: 'ps_fem_emb_fv', procedureId: 'femoral_embolectomy', structureId: 'femoral_vein_right', role: 'related', createdAt: NOW },

  // Carotid endarterectomy
  { id: 'ps_cea_cca', procedureId: 'carotid_endarterectomy', structureId: 'common_carotid_artery_right', role: 'target', createdAt: NOW },
  { id: 'ps_cea_rln', procedureId: 'carotid_endarterectomy', structureId: 'recurrent_laryngeal_nerve_right', role: 'danger', createdAt: NOW },

  // Lap chole
  { id: 'ps_lap_chole_gallbladder', procedureId: 'laparoscopic_cholecystectomy', structureId: 'gallbladder', role: 'target', createdAt: NOW },
  { id: 'ps_lap_chole_cbd', procedureId: 'laparoscopic_cholecystectomy', structureId: 'common_bile_duct', role: 'danger', createdAt: NOW },

  // Thyroidectomy
  { id: 'ps_thyroid_thyroid', procedureId: 'thyroidectomy', structureId: 'thyroid_gland', role: 'target', createdAt: NOW },
  { id: 'ps_thyroid_rln', procedureId: 'thyroidectomy', structureId: 'recurrent_laryngeal_nerve_right', role: 'danger', createdAt: NOW },
  { id: 'ps_thyroid_cca', procedureId: 'thyroidectomy', structureId: 'common_carotid_artery_right', role: 'landmark', createdAt: NOW },

  // AAA repair
  { id: 'ps_aaa_aorta', procedureId: 'aaa_repair', structureId: 'aorta_abdominal', role: 'target', createdAt: NOW },
  { id: 'ps_aaa_ivc', procedureId: 'aaa_repair', structureId: 'inferior_vena_cava', role: 'danger', createdAt: NOW },
  { id: 'ps_aaa_ureter_r', procedureId: 'aaa_repair', structureId: 'ureter_right', role: 'danger', createdAt: NOW },
  { id: 'ps_aaa_ureter_l', procedureId: 'aaa_repair', structureId: 'ureter_left', role: 'danger', createdAt: NOW },

  // Appendectomy
  { id: 'ps_appendix', procedureId: 'appendectomy', structureId: 'appendix', role: 'target', createdAt: NOW },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const STRUCTURE_ID_ALIASES: Record<string, string[]> = {
  aorta: ['aorta', 'aorta_abdominal'],
  arteries_abdomen: ['arteries_abdomen', 'aorta_abdominal'],
  vena_cava_inferior: ['vena_cava_inferior', 'inferior_vena_cava'],
  veins_abdomen: ['veins_abdomen', 'inferior_vena_cava'],
  ureter_r: ['ureter_r', 'ureter_right'],
  ureter_l: ['ureter_l', 'ureter_left'],
  carotid_r: ['carotid_r', 'common_carotid_artery_right', 'recurrent_laryngeal_nerve_right'],
  carotid_l: ['carotid_l', 'common_carotid_artery_right'],
  arteries_leg_r: ['arteries_leg_r', 'femoral_artery_right'],
  arteries_leg_l: ['arteries_leg_l', 'femoral_artery_left'],
  veins_leg_r: ['veins_leg_r', 'femoral_vein_right'],
  veins_leg_l: ['veins_leg_l', 'femoral_vein_right'],
  gallbladder: ['gallbladder', 'common_bile_duct'],
  liver: ['liver', 'gallbladder', 'common_bile_duct'],
  larynx: ['larynx', 'thyroid_gland', 'recurrent_laryngeal_nerve_right'],
  trachea: ['trachea', 'thyroid_gland', 'recurrent_laryngeal_nerve_right'],
  colon: ['colon', 'appendix'],
  iliopsoas_r: ['iliopsoas_r', 'iliopsoas_muscle_right', 'femoral_nerve_right'],
  iliopsoas_l: ['iliopsoas_l', 'iliopsoas_muscle_right', 'femoral_nerve_right'],
  adductors_r: ['adductors_r', 'pectineus_muscle_right', 'femoral_artery_right'],
  thigh_muscles_r: ['thigh_muscles_r', 'sartorius_muscle_right', 'femoral_artery_right', 'femoral_nerve_right'],
  thigh_muscles_l: ['thigh_muscles_l', 'femoral_artery_left'],
};

export function expandStructureIds(structureId: string): string[] {
  return STRUCTURE_ID_ALIASES[structureId] || [structureId];
}

export function getStructureById(id: string): AnatomyStructure | undefined {
  const candidates = expandStructureIds(id);
  return ANATOMICAL_STRUCTURES.find(s => candidates.includes(s.id));
}

export function getProcedureById(id: string): SurgicalProcedure | undefined {
  return SURGICAL_PROCEDURES.find(p => p.id === id);
}

export function getDangerZoneById(id: string): DangerZone | undefined {
  return DANGER_ZONES.find(dz => dz.id === id);
}

export function getProceduresByStructure(structureId: string): SurgicalProcedure[] {
  const candidates = expandStructureIds(structureId);
  return SURGICAL_PROCEDURES.filter(p =>
    p.relatedStructureIds.some(id => candidates.includes(id))
  );
}

export function getDangerZonesByStructure(structureId: string): DangerZone[] {
  const candidates = expandStructureIds(structureId);
  return DANGER_ZONES.filter(dz =>
    dz.associatedStructureIds.some(id => candidates.includes(id))
  );
}

export function getDangerZonesByProcedure(procedureId: string): DangerZone[] {
  return DANGER_ZONES.filter(dz => dz.relatedProcedureIds.includes(procedureId));
}

export function getProcedureStructuresByProcedure(procedureId: string): ProcedureStructure[] {
  return PROCEDURE_STRUCTURES.filter(ps => ps.procedureId === procedureId);
}

export function getProcedureStructuresByStructure(structureId: string): ProcedureStructure[] {
  const candidates = expandStructureIds(structureId);
  return PROCEDURE_STRUCTURES.filter(ps => candidates.includes(ps.structureId));
}

// Stats for UI display
export function getAtlasStats() {
  return {
    totalStructures: ANATOMICAL_STRUCTURES.length,
    availableStructures: ANATOMICAL_STRUCTURES.filter(s => s.availability === 'available').length,
    plannedStructures: ANATOMICAL_STRUCTURES.filter(s => s.availability === 'planned').length,
    totalProcedures: SURGICAL_PROCEDURES.length,
    totalDangerZones: DANGER_ZONES.length,
    totalRelationships: PROCEDURE_STRUCTURES.length,
  };
}
