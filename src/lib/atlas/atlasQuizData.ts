import type { LocalizedText } from './atlasKnowledgeRegistry';

export interface AtlasQuizQuestion {
  id: string;
  targetStructureId: string;
  category: 'identify' | 'vascular' | 'nerve' | 'surgical' | 'danger_zone';
  question: LocalizedText;
  options: LocalizedText[];
  correctIndex: number;
  explanation: LocalizedText;
}

export const ATLAS_QUIZ_BANK: AtlasQuizQuestion[] = [
  {
    id: 'q-aorta-renal',
    targetStructureId: 'aorta',
    category: 'vascular',
    question: {
      en: 'During open infrarenal abdominal aortic aneurysm (AAA) repair, which venous structure crosses anteriorly over the abdominal aorta just inferior to the SMA origin and serves as the key landmark for proximal clamp placement?',
      ar: 'أثناء الإصلاح الجراحي المفتوح لأم الدم الأبهرية تحت الكلوية، ما البنية الوريدية التي تعبر أمام الأبهر البطني أسفل منشأ الشريان المساريقي العلوي وتشكل معلماً أساسياً لمكان التثبيت القريب؟',
      de: 'Welche venöse Struktur überkreuzt bei der offenen infrarenalen BAA-Reparatur ventral die Aorta abdominalis unterhalb der AMS und dient als Leitstruktur für die proximale Klemme?',
    },
    options: [
      { en: 'Left renal vein', ar: 'الوريد الكلوي الأيسر', de: 'Vena renalis sinistra' },
      { en: 'Inferior mesenteric vein', ar: 'الوريد المساريقي السفلي', de: 'Vena mesenterica inferior' },
      { en: 'Right gonadal vein', ar: 'الوريد التناسلي الأيمن', de: 'Vena testicularis/ovarica dextra' },
      { en: 'Superior vena cava', ar: 'الوريد الأجوف العلوي', de: 'Vena cava superior' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'The left renal vein crosses anteriorly over the abdominal aorta just below the SMA origin ("nutcracker" angle) and marks the infrarenal neck for aortic cross-clamping.',
      ar: 'يعبر الوريد الكلوي الأيسر أمام الأبهر البطني أسفل الشريان المساريقي العلوي مباشرة ويمثل المعلم التشريحي لعنق التثبيت تحت الكلوي.',
      de: 'Die Vena renalis sinistra kreuzt ventral über die Aorta direkt unterhalb des AMS-Abgangs und markiert den infrarenalen Aortenhals.',
    },
  },
  {
    id: 'q-carotid-nerves',
    targetStructureId: 'carotid_r',
    category: 'nerve',
    question: {
      en: 'During carotid endarterectomy (CEA), which cranial nerve courses posteriorly inside the carotid sheath between the carotid artery and internal jugular vein?',
      ar: 'أثناء عملية استئصال باطنة الشريان السباتي (CEA)، أي عصب قحفي يسير خلفياً داخل الغمد السباتي بين الشريان السباتي والوريد الوداجي الباطن؟',
      de: 'Welcher Hirnnerv verläuft bei der Karotis-TEA dorsal innerhalb der Vagina carotica zwischen A. carotis und V. jugularis interna?',
    },
    options: [
      { en: 'Phrenic nerve (C3–C5)', ar: 'العصب الحجابي (C3–C5)', de: 'Nervus phrenicus' },
      { en: 'Vagus nerve (CN X)', ar: 'العصب المبهم (CN X)', de: 'Nervus vagus (CN X)' },
      { en: 'Spinal accessory nerve (CN XI)', ar: 'العصب الإضافي الشوكي (CN XI)', de: 'Nervus accessorius (CN XI)' },
      { en: 'Brachial plexus superior trunk', ar: 'الجذع العلوي للضفيرة العضدية', de: 'Truncus superior des Plexus brachialis' },
    ],
    correctIndex: 1,
    explanation: {
      en: 'The vagus nerve (CN X) lies posteriorly within the carotid sheath between the artery and IJV; injury causes ipsilateral vocal cord paralysis and hoarseness.',
      ar: 'يسير العصب المبهم (CN X) خلفياً داخل الغمد السباتي بين الشريان والوريد الوداجي الباطن، وأذيته تسبب شلل الحبل الصوتي وبحة الصوت.',
      de: 'Der N. vagus liegt dorsal in der Vagina carotica zwischen Arterie und V. jugularis interna; seine Verletzung führt zur Rekurrensparese.',
    },
  },
  {
    id: 'q-iliac-ureter',
    targetStructureId: 'arteries_pelvis',
    category: 'danger_zone',
    question: {
      en: 'Where do the right and left ureters cross the pelvic arterial axis, creating a classic surgical danger zone ("water under the bridge")?',
      ar: 'أين يعبر الحالبان المحور الشرياني الحوضي مشكلين منطقة خطر جراحية كلاسيكية؟',
      de: 'Wo überkreuzen die Ureteren die Beckenarterien und bilden eine klassische chirurgische Gefahrenzone?',
    },
    options: [
      { en: 'Anterior to the common iliac bifurcation', ar: 'أمام تفرع الشريان الحرقفي المشترك', de: 'Ventral der Bifurkation der A. iliaca communis' },
      { en: 'Posterior to the internal iliac trunk', ar: 'خلف الجذع الحرقفي الباطن', de: 'Dorsal der A. iliaca interna' },
      { en: 'Inferior to the inguinal ligament', ar: 'أسفل الرباط الإربي', de: 'Kaudal des Leistenbandes' },
      { en: 'Lateral to the deep femoral artery', ar: 'وحشي الشريان الفخذي العميق', de: 'Lateral der A. profunda femoris' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'At the pelvic brim, each ureter crosses anteriorly over the bifurcation of the common iliac artery into external and internal iliac arteries while remaining adherent to the posterior peritoneum.',
      ar: 'عند حافة الحوض يعبر كل حالب أمام تفرع الشريان الحرقفي المشترك مباشرة مع بقائه ملتصقاً بالصفاق الخلفي.',
      de: 'Am Beckeneingang überkreuzt der Ureter ventral die Teilungsstelle der A. iliaca communis.',
    },
  },
  {
    id: 'q-femoral-navel',
    targetStructureId: 'arteries_leg_r',
    category: 'identify',
    question: {
      en: 'In the femoral triangle, what is the anatomical lateral-to-medial order of major structures (NAVEL)?',
      ar: 'في المثلث الفخذي، ما الترتيب التشريحي الصحيح للبنى الرئيسية من الوحشي إلى الإنسي (NAVEL)؟',
      de: 'Wie lautet die anatomische Reihenfolge im Trigonum femorale von lateral nach medial?',
    },
    options: [
      { en: 'Vein → Artery → Nerve → Lymphatics', ar: 'وريد ← شريان ← عصب ← ليمفاويات', de: 'Vene → Arterie → Nerv → Lymphknoten' },
      { en: 'Nerve → Artery → Vein → Empty space → Lymphatics', ar: 'عصب ← شريان ← وريد ← مسافة خالية ← ليمفاويات', de: 'Nerv → Arterie → Vene → Leerraum → Lymphgefäße' },
      { en: 'Artery → Nerve → Vein → Lymphatics', ar: 'شريان ← عصب ← وريد ← ليمفاويات', de: 'Arterie → Nerv → Vene → Lymphgefäße' },
      { en: 'Lymphatics → Nerve → Artery → Vein', ar: 'ليمفاويات ← عصب ← شريان ← وريد', de: 'Lymphgefäße → Nerv → Arterie → Vene' },
    ],
    correctIndex: 1,
    explanation: {
      en: 'From lateral to medial: Femoral Nerve (outside femoral sheath), Femoral Artery, Femoral Vein, femoral canal (Empty space), and Lymphatics (NAVEL).',
      ar: 'من الوحشي للإنسي: العصب الفخذي (خارج الغمد)، الشريان الفخذي، الوريد الفخذي، القناة الفخذية، ثم الليمفاويات.',
      de: 'Von lateral nach medial: N. femoralis (außerhalb der Gefäßscheide), A. femoralis, V. femoralis, Canalis femoralis, Lymphknoten.',
    },
  },
  {
    id: 'q-heart-coronary',
    targetStructureId: 'heart',
    category: 'vascular',
    question: {
      en: 'Which coronary artery typically supplies the anterior two-thirds of the interventricular septum and the left ventricular apex?',
      ar: 'أي شريان تاجي يروي عادةً الثلثين الأماميين من الحاجز بين البطينين وقمة البطين الأيسر؟',
      de: 'Welche Koronararterie versorgt typischerweise die vorderen zwei Drittel des Kammerseptums und die Herzspitze?',
    },
    options: [
      { en: 'Left Anterior Descending (LAD)', ar: 'الشريان التاجي الأمامي النازل الأيسر (LAD)', de: 'Ramus interventricularis anterior (RIVA / LAD)' },
      { en: 'Right marginal branch', ar: 'الفرع الهامشي الأيمن', de: 'Ramus marginalis dexter' },
      { en: 'Coronary sinus', ar: 'الجيب الإكليلي', de: 'Sinus coronarius' },
      { en: 'Sinoatrial nodal artery', ar: 'شريان العقدة الجيبية', de: 'A. nodi sinuatrialis' },
    ],
    correctIndex: 0,
    explanation: {
      en: 'The Left Anterior Descending (LAD / RIVA) courses in the anterior interventricular sulcus and perfuses the anterior LV wall, apex, and anterior two-thirds of the septum.',
      ar: 'يسير LAD في الثلم الأمامي بين البطينين ويروي الجدار الأمامي للبطين الأيسر والقمة وثلثي الحاجز.',
      de: 'Der RIVA (LAD) verläuft im Sulcus interventricularis anterior und versorgt Vorderwand, Apex und vorderes Septum.',
    },
  },
  {
    id: 'q-liver-pringle',
    targetStructureId: 'liver',
    category: 'surgical',
    question: {
      en: 'During hepatic resection, clamping the hepatoduodenal ligament (Pringle maneuver) temporarily occludes which structures?',
      ar: 'أثناء استئصال الكبد، ما البنى التي تُغلق مؤقتاً عند تطبيق مناورة برينغل على الرباط الكبدي العفجي؟',
      de: 'Welche Strukturen werden beim Pringle-Manöver im Lig. hepatoduodenale temporär abgeklemmt?',
    },
    options: [
      { en: 'Hepatic veins and retrohepatic IVC', ar: 'الأوردة الكبدية والأجوف السفلي', de: 'Lebervenen und V. cava inferior' },
      { en: 'Hepatic artery proper, portal vein, and common bile duct', ar: 'الشريان الكبدي المخصوص، الوريد البابي، والقناة الصفراوية الجامعة', de: 'A. hepatica propria, V. portae & Ductus choledochus' },
      { en: 'Left gastric artery and splenic vein', ar: 'الشريان المعدي الأيسر والوريد الطحالي', de: 'A. gastrica sinistra & V. splenica' },
      { en: 'Celiac trunk and superior mesenteric artery', ar: 'الجذع الزلاقي والشريان المساريقي العلوي', de: 'Truncus coeliacus & A. mesenterica superior' },
    ],
    correctIndex: 1,
    explanation: {
      en: 'The Pringle maneuver compresses the portal triad (proper hepatic artery, portal vein, and common bile duct) within the free edge of the hepatoduodenal ligament.',
      ar: 'تضغط مناورة برينغل على الثلاثي البابي (الشريان الكبدي والوريد البابي والقناة الجامعة) داخل الرباط الكبدي العفجي.',
      de: 'Das Pringle-Manöver komprimiert die Glisson-Trias im Lig. hepatoduodenale.',
    },
  },
  {
    id: 'q-popliteal-depth',
    targetStructureId: 'arteries_leg_r',
    category: 'surgical',
    question: {
      en: 'When approaching the popliteal fossa posteriorly, what is the superficial-to-deep relationship of the neurovascular bundle?',
      ar: 'عند الدخول الجراحي للحفرة المأبضية من الخلف، ما الترتيب الصحيح من السطحي إلى العميق للحزمة الوعائية العصبية؟',
      de: 'Wie liegen die Leitungsbahnen in der Fossa poplitea von oberflächlich nach tief?',
    },
    options: [
      { en: 'Popliteal Artery → Popliteal Vein → Tibial Nerve', ar: 'الشريان المأبضي ← الوريد المأبضي ← العصب الظنبوبي', de: 'Arterie → Vene → N. tibialis' },
      { en: 'Tibial Nerve → Popliteal Vein → Popliteal Artery', ar: 'العصب الظنبوبي ← الوريد المأبضي ← الشريان المأبضي', de: 'N. tibialis → V. poplitea → A. poplitea' },
      { en: 'Popliteal Vein → Tibial Nerve → Popliteal Artery', ar: 'الوريد المأبضي ← العصب الظنبوبي ← الشريان المأبضي', de: 'V. poplitea → N. tibialis → A. poplitea' },
      { en: 'Saphenous Nerve → Femoral Artery → Popliteal Vein', ar: 'العصب الصافن ← الشريان الفخذي ← الوريد المأبضي', de: 'N. saphenus → A. femoralis → V. poplitea' },
    ],
    correctIndex: 1,
    explanation: {
      en: 'From superficial (posterior) to deep (anterior, resting on the posterior knee capsule): Tibial Nerve, Popliteal Vein, then Popliteal Artery (NeVA).',
      ar: 'من السطحي (الخلف) إلى العميق (أماماً قرب محفظة الركبة): العصب الظنبوبي، فالوريد المأبضي، ثم الشريان المأبضي.',
      de: 'Von dorsal (oberflächlich) nach ventral (tief): N. tibialis, V. poplitea, A. poplitea.',
    },
  },
];
