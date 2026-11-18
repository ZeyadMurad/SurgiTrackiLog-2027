import React, { useState } from 'react';
import {
  Activity,
  BookOpen,
  Brain,
  CheckCircle2,
  Compass,
  FileText,
  FlaskConical,
  Globe,
  Images,
  Layers,
  MessageSquare,
  Play,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  Users,
  X,
  Youtube,
} from 'lucide-react';
import type { SupportedLanguage } from '../types';

const I18N = {
  en: {
    nav: { features: 'Features', stats: 'Stats', testimonials: 'Testimonials', login: 'Sign In', signup: 'Create Account' },
    hero: {
      badge: 'SurgiTrack iLog 2027 · V3 Release',
      title: 'SurgiTrack iLog 2027',
      subtitle: 'Verified Clinical Logbook, 3D Surgical Atlas & AI Training Portfolio',
      description: 'Document surgical cases with SHA-256 supervisor verification, explore an interactive 3D Surgical Atlas, practice 117 clinical simulations, consult AI Surgical Mentor 24/7, and connect to live PubMed research — in one unified platform.',
      ctaPrimary: 'Get Started Free',
      ctaSecondary: 'Interactive Tour',
      watchVideo: '4-step clinical workflow preview',
    },
    tour: {
      title: 'SurgiTrack iLog 2027 — Platform Walkthrough',
      subtitle: 'Explore how modern surgical trainees document, study, and get certified.',
      steps: [
        {
          badge: 'Step 1 · Logbook & Verification',
          title: 'Structured Case Logging & SHA-256 Signatures',
          desc: 'Record operative roles, ASA/ICD-10 codes, and net training hours. Export bilingual German (Ärztekammer) & international portfolios verified with SHA-256 consultant signatures.',
        },
        {
          badge: 'Step 2 · 3D Anatomy & Video',
          title: 'Interactive 3D Surgical Atlas → Visual Library V3',
          desc: 'Toggle 6 anatomical layers (Skin, Muscle, Vessels, Nerves, Organs, Bones), inspect danger zones like Calot triangle or the femoral nerve, and jump directly to verified surgical videos.',
        },
        {
          badge: 'Step 3 · 24/7 AI & Simulation',
          title: 'AI Surgical Mentor & 117 Case Simulations',
          desc: 'Ask AI Mentor for pre-op preparation checklists, differential diagnoses, or personalized logbook gap analyses alongside 351 evidence-based clinical MCQs.',
        },
        {
          badge: 'Step 4 · Research & Community',
          title: 'Live PubMed Citations & Global Peer Threads',
          desc: 'Search 36M+ PubMed records, copy instant APA / MLA / Vancouver citations, follow international colleagues, and discuss operative pearls in Community Threads & 24h Stories.',
        },
      ],
      startNow: 'Create Free Account',
    },
    featuresTitle: 'Everything a Modern Surgeon Needs',
    featuresSubtitle: 'Comprehensive clinical tools built for residents, fellows, and attending surgeons',
    features: [
      { icon: 'Layers', title: '3D Surgical Atlas', desc: 'Interactive multi-layer 3D anatomy explorer highlighting danger zones and linking straight to verified operative videos.' },
      { icon: 'Brain', title: 'AI Surgical Mentor', desc: '24/7 clinical education assistant analyzing your logbook portfolio for differential diagnosis and pre-op prep.' },
      { icon: 'Images', title: 'Visual Library V3', desc: 'Verified surgical demonstrations from YouTube Surgical Channels, WeBSurg (IRCAD), and CTSNet — embeddable in-app.' },
      { icon: 'FlaskConical', title: '117 Simulation Cases', desc: 'Interactive case-based simulations across 19 surgical specialties with 351 MCQs and detailed rationales.' },
      { icon: 'BookOpen', title: 'PubMed Citations & Research', desc: 'Search NCBI E-utilities, find similar published case reports, and copy formatted APA, MLA & Vancouver citations.' },
      { icon: 'FileText', title: 'Smart CV & German Portfolio', desc: 'Auto-generate academic CVs in PDF/DOCX and official Weiterbildung logs in EN, AR, and DE.' },
      { icon: 'MessageSquare', title: 'Peer Threads & 24h Stories', desc: 'Case-linked surgical discussions, peer-reviewed solutions, and 24-hour clinical pearls.' },
      { icon: 'ShieldCheck', title: 'Biometric & Offline PWA', desc: 'Touch ID / Face ID quick verification, offline clinical cache, and installable mobile/desktop app experience.' },
    ],
    statsTitle: 'Trusted by Surgeons Worldwide',
    statsSubtitle: 'Designed for international surgical residencies and fellowship programs',
    stats: [
      { value: '500+', label: 'Active Surgeons', icon: 'Users' },
      { value: '10,000+', label: 'Cases Logged', icon: 'Activity' },
      { value: '117', label: 'Simulation Cases', icon: 'FlaskConical' },
      { value: '50,000+', label: 'Training Hours', icon: 'TrendingUp' },
      { value: '28+', label: 'Verified Videos', icon: 'Youtube' },
      { value: '19', label: 'Surgical Specialties', icon: 'Stethoscope' },
    ],
    testimonialsTitle: 'What Surgeons Say',
    testimonialsSubtitle: 'Feedback from residents, fellows, and program directors',
    testimonials: [
      { name: 'Dr. Mohammed Bardom', role: 'Vascular Surgery Resident', text: 'SurgiTrack iLog transformed how I document my training. The auto-verified hours feature saved me weeks of paperwork.', avatar: 'MB' },
      { name: 'Prof. Thomas Weber', role: 'Vascular Surgery Consultant, UKE Hamburg', text: 'As a Weiterbildungsbefugter, I require my trainees to use SurgiTrack. The digital signature with SHA-256 is excellent for verification.', avatar: 'TW' },
      { name: 'Dr. Zeyad Ali Murad', role: 'Surgical Trainee, Berlin', text: 'Combining the 3D Surgical Atlas with verified operative videos and community threads gives me rapid clarity before entering theater.', avatar: 'ZM' },
      { name: 'Dr. Sarah Lindqvist', role: 'Pediatric Surgery Fellow', text: '117 simulation cases with detailed explanations — better than any textbook. I use it daily before theatre.', avatar: 'SL' },
    ],
    cta: {
      title: 'Ready to Elevate Your Surgical Portfolio?',
      subtitle: 'Join surgeons using SurgiTrack iLog 2027 daily. Free to start — works seamlessly across web, iOS, and Android.',
      primary: 'Create Your Free Account',
      secondary: 'Sign In to Your Account',
    },
    footer: 'SurgiTrack iLog 2027 – Professional Surgical Training, Clinical Logbook & Medical Portfolio Platform',
  },
  ar: {
    nav: { features: 'الميزات', stats: 'الإحصائيات', testimonials: 'آراء الجراحين', login: 'تسجيل الدخول', signup: 'إنشاء حساب' },
    hero: {
      badge: 'SurgiTrack iLog 2027 · الإصدار الثالث V3',
      title: 'SurgiTrack iLog 2027',
      subtitle: 'سجل سريري موثّق، أطلس جراحي ثلاثي الأبعاد، ومرشد ذكاء اصطناعي للجراحين',
      description: 'وثّق حالاتك الجراحية بتوقيع رقمي SHA-256، استكشف الأطلس الجراحي 3D، تدرّب على 117 حالة محاكاة، استشر المرشد الجراحي الذكي 24/7، وابحث مباشرة في PubMed — في منصة واحدة.',
      ctaPrimary: 'ابدأ مجاناً',
      ctaSecondary: 'جولة تفاعلية',
      watchVideo: 'استعراض تفاعلي من 4 خطوات',
    },
    tour: {
      title: 'جولة داخل منصة SurgiTrack iLog 2027',
      subtitle: 'تعرّف على أدوات التوثيق الجراحي والتعلم الطبي المتقدمة.',
      steps: [
        {
          badge: 'الخطوة 1 · السجل والتوثيق',
          title: 'توثيق الحالات والتوقيع الرقمي SHA-256',
          desc: 'سجّل الدور الجراحي ورموز ICD-10 وساعات التدريب الصافية مع إمكانية تصدير السجل الألماني والعالمي موثقاً بتوقيع المشرف.',
        },
        {
          badge: 'الخطوة 2 · الأطلس ثلاثي الأبعاد والمكتبة المرئية',
          title: 'الأطلس الجراحي 3D ← المكتبة المرئية V3',
          desc: 'تحكّم في 6 طبقات تشريحية (الجلد، العضلات، الأوعية، الأعصاب، الأعضاء، العظام)، اكتشف مناطق الخطر، وانتقل بنقرة واحدة للفيديوهات الجراحية المتحقق منها.',
        },
        {
          badge: 'الخطوة 3 · الذكاء الاصطناعي والمحاكاة',
          title: 'المرشد الجراحي الذكي و117 حالة محاكاة',
          desc: 'استشر المرشد الجراحي بالذكاء الاصطناعي للتحضير للعمليات والتشخيص التفريقي وتحليل فجوات محفظتك مع 351 سؤال محاكاة.',
        },
        {
          badge: 'الخطوة 4 · الأبحاث والمجتمع',
          title: 'تكامل PubMed المباشر ومناقشات الأقران',
          desc: 'ابحث في PubMed مباشرة، انسخ الاقتباسات بصيغ APA/MLA/Vancouver، وشارك في مناقشات المجتمع والقصص السريرية.',
        },
      ],
      startNow: 'أنشئ حسابك المجاني',
    },
    featuresTitle: 'كل ما يحتاجه الجراح العصري',
    featuresSubtitle: 'أدوات متكاملة للتدريب الجراحي والتوثيق السريري والنمو الأكاديمي',
    features: [
      { icon: 'Layers', title: 'الأطلس الجراحي 3D', desc: 'نموذج تشريحي ثلاثي الأبعاد بـ 6 طبقات يوضح مناطق الخطر ويرتبط مباشرة بالفيديوهات الجراحية.' },
      { icon: 'Brain', title: 'المرشد الجراحي الذكي', desc: 'مساعد تعليمي 24/7 يحلل محفظتك السريرية ويقدم خطط تحضير جراحي وتشخيص تفريقي.' },
      { icon: 'Images', title: 'المكتبة المرئية V3', desc: 'فيديوهات جراحية مُتحقق منها من يوتيوب الطبي وWeBSurg وCTSNet قابلة للتشغيل داخل التطبيق.' },
      { icon: 'FlaskConical', title: '117 حالة محاكاة', desc: 'محاكاة تفاعلية عبر 19 تخصصاً جراحياً مع 351 سؤال اختيار متعدد وشروحات علمية.' },
      { icon: 'BookOpen', title: 'تكامل PubMed والاقتباس', desc: 'بحث حي عبر NCBI PubMed، استعراض حالات مشابهة، ونسخ فوري لصيغ APA / MLA / Vancouver.' },
      { icon: 'FileText', title: 'مولّد السيرة الذاتية والسجل الألماني', desc: 'توليد تلقائي للسيرة الذاتية PDF/DOCX وسجلات Weiterbildung باللغات العربية والإنجليزية والألمانية.' },
      { icon: 'MessageSquare', title: 'مناقشات المجتمع والقصص', desc: 'سلاسل نقاش سريرية مرتبطة بالحالات وقصص تعليمية لمدة 24 ساعة.' },
      { icon: 'ShieldCheck', title: 'البصمة وتطبيق PWA دون إنترنت', desc: 'تفعيل البصمة / Face ID، وتثبيت المنصة كتطبيق على الهاتف والكمبيوتر مع حفظ البيانات.' },
    ],
    statsTitle: 'موثوق به من جراحين حول العالم',
    statsSubtitle: 'مصمم لبرامج الإقامة والزمالة الجراحية الدولية',
    stats: [
      { value: '500+', label: 'جراح نشط', icon: 'Users' },
      { value: '10,000+', label: 'حالة موثّقة', icon: 'Activity' },
      { value: '117', label: 'حالة محاكاة', icon: 'FlaskConical' },
      { value: '50,000+', label: 'ساعة تدريب', icon: 'TrendingUp' },
      { value: '28+', label: 'فيديو مُتحقق', icon: 'Youtube' },
      { value: '19', label: 'تخصص جراحي', icon: 'Stethoscope' },
    ],
    testimonialsTitle: 'ماذا يقول الجراحون',
    testimonialsSubtitle: 'آراء حقيقية من المقيمين والاستشاريين ومديري البرامج',
    testimonials: [
      { name: 'د. محمد بردوم', role: 'مقيم جراحة الأوعية', text: 'SurgiTrack iLog غيّر طريقة توثيقي للتدريب، ووفّر عليّ أسابيع من العمل الورقي.', avatar: 'MB' },
      { name: 'أ.د. توماس ويبر', role: 'استشاري جراحة الأوعية، هامبورغ', text: 'التوقيع الرقمي SHA-256 وسجلات التدريب المنظمة تجعل اعتماد الساعات دقيقاً وموثوقاً.', avatar: 'TW' },
      { name: 'د. زياد علي مراد', role: 'متدرب جراحي، برلين', text: 'الدمج بين الأطلس ثلاثي الأبعاد والفيديوهات الجراحية والمرشد الذكي يمنح تحضيراً ممتازاً قبل العمليات.', avatar: 'ZM' },
      { name: 'د. سارة ليندكفيست', role: 'زميلة جراحة الأطفال', text: '117 حالة محاكاة بشروحات تفصيلية أعتمد عليها يومياً قبل دخول غرفة العمليات.', avatar: 'SL' },
    ],
    cta: {
      title: 'جاهز للارتقاء بملفك الجراحي؟',
      subtitle: 'انضم لمئات الجراحين على SurgiTrack iLog 2027 مجاناً عبر الويب أو كتطبيق مثبت.',
      primary: 'أنشئ حسابك المجاني',
      secondary: 'تسجيل الدخول',
    },
    footer: 'SurgiTrack iLog 2027 – منصة التدريب الجراحي الاحترافي والسجل السريري الموثّق',
  },
  de: {
    nav: { features: 'Funktionen', stats: 'Statistik', testimonials: 'Erfahrungen', login: 'Anmelden', signup: 'Konto erstellen' },
    hero: {
      badge: 'SurgiTrack iLog 2027 · V3 Release',
      title: 'SurgiTrack iLog 2027',
      subtitle: 'Verifiziertes OP-Logbuch, 3D-Chirurgie-Atlas & KI-Mentor für Chirurgen',
      description: 'Dokumentieren Sie Eingriffe mit SHA-256-Signatur, erkunden Sie den 3D-Anatomie-Atlas, trainieren Sie 117 Simulationen, nutzen Sie den KI-Mentor und durchsuchen Sie PubMed direkt auf einer Plattform.',
      ctaPrimary: 'Kostenlos starten',
      ctaSecondary: 'Interaktive Tour',
      watchVideo: '4-Schritte-Plattformvorschau',
    },
    tour: {
      title: 'SurgiTrack iLog 2027 — Plattform-Rundgang',
      subtitle: 'Entdecken Sie den Workflow für Weiterbildung und klinische Dokumentation.',
      steps: [
        {
          badge: 'Schritt 1 · Logbuch & Zertifizierung',
          title: 'OP-Dokumentation & SHA-256-Signaturen',
          desc: 'Erfassen Sie Eingriffe, ICD-10-Codes und Weiterbildungsstunden nach Ärztekammer-Standard mit kryptographischer Oberarzt-Signatur.',
        },
        {
          badge: 'Schritt 2 · 3D-Atlas & OP-Videos',
          title: 'Interaktiver 3D-Atlas → Mediathek V3',
          desc: 'Schalten Sie 6 anatomische Schichten um, erkennen Sie Gefahrenzonen und öffnen Sie direkt passende verifizierte OP-Videos.',
        },
        {
          badge: 'Schritt 3 · KI-Mentor & Simulation',
          title: '24/7 KI-Mentor & 117 Fall-Simulationen',
          desc: 'Erhalten Sie OP-Vorbereitungspläne, Differentialdiagnosen und personalisierte Auswertungen Ihres Logbuchs.',
        },
        {
          badge: 'Schritt 4 · Forschung & Community',
          title: 'PubMed-Zitationen & Chirurgische Threads',
          desc: 'PubMed live durchsuchen, APA/MLA/Vancouver-Zitate kopieren und klinische Fälle weltweit diskutieren.',
        },
      ],
      startNow: 'Kostenloses Konto erstellen',
    },
    featuresTitle: 'Alles für die moderne chirurgische Weiterbildung',
    featuresSubtitle: 'Entwickelt für Assistenzärzte, Fachärzte und Weiterbildungsbefugte',
    features: [
      { icon: 'Layers', title: '3D-Chirurgie-Atlas', desc: 'Interaktives 3D-Anatomiemodell mit 6 Schichten, Gefahrenzonen und direkter Video-Verknüpfung.' },
      { icon: 'Brain', title: 'KI-Chirurgie-Mentor', desc: '24/7 Lernassistent zur OP-Vorbereitung, Differentialdiagnostik und Portfolio-Analyse.' },
      { icon: 'Images', title: 'Mediathek V3', desc: 'Verifizierte OP-Videos von YouTube Surgical Channels, WeBSurg (IRCAD) und CTSNet.' },
      { icon: 'FlaskConical', title: '117 Fall-Simulationen', desc: 'Interaktive klinische Simulationen aus 19 chirurgischen Fachgebieten inkl. 351 MCQs.' },
      { icon: 'BookOpen', title: 'PubMed-Forschungsintegration', desc: 'Direkte NCBI-Suche mit automatischen APA-, MLA- und Vancouver-Zitationen.' },
      { icon: 'FileText', title: 'CV-Generator & Weiterbildungs-Export', desc: 'Automatischer Lebenslauf (PDF/DOCX) und Weiterbildungsberichte auf DE, EN und AR.' },
      { icon: 'MessageSquare', title: 'Community-Threads & Stories', desc: 'Fallbezogene Fachdiskussionen und 24-Stunden-OP-Highlights.' },
      { icon: 'ShieldCheck', title: 'Biometrie & Offline-PWA', desc: 'Touch ID / Face ID Schutz, Offline-Verfügbarkeit und App-Installation.' },
    ],
    statsTitle: 'Weltweit von Chirurgen genutzt',
    statsSubtitle: 'Konzipiert für klinische Weiterbildungsprogramme',
    stats: [
      { value: '500+', label: 'Aktive Chirurgen', icon: 'Users' },
      { value: '10.000+', label: 'Erfasste Fälle', icon: 'Activity' },
      { value: '117', label: 'Simulationen', icon: 'FlaskConical' },
      { value: '50.000+', label: 'OP-Stunden', icon: 'TrendingUp' },
      { value: '28+', label: 'Verifizierte Videos', icon: 'Youtube' },
      { value: '19', label: 'Fachgebiete', icon: 'Stethoscope' },
    ],
    testimonialsTitle: 'Stimmen aus der Klinik',
    testimonialsSubtitle: 'Erfahrungen von Weiterbildungsassistenten und Chefärzten',
    testimonials: [
      { name: 'Dr. Mohammed Bardom', role: 'Assistenzarzt Gefäßchirurgie', text: 'SurgiTrack iLog hat meine Weiterbildungsdokumentation revolutioniert und spart jede Woche wertvolle Zeit.', avatar: 'MB' },
      { name: 'Prof. Thomas Weber', role: 'Leitender Oberarzt Gefäßchirurgie, UKE Hamburg', text: 'Die SHA-256-Signatur und die strukturierte Stundenerfassung bieten volle Rechtssicherheit für Weiterbildungszeugnisse.', avatar: 'TW' },
      { name: 'Dr. Zeyad Ali Murad', role: 'Arzt in Weiterbildung, Berlin', text: 'Die Verbindung von 3D-Atlas, OP-Videos und KI-Mentor ist ideal zur gezielten OP-Vorbereitung.', avatar: 'ZM' },
      { name: 'Dr. Sarah Lindqvist', role: 'Fachärztin Kinderchirurgie', text: '117 klinische Simulationen mit ausführlichen Erklärungen — mein täglicher Begleiter vor dem OP-Saal.', avatar: 'SL' },
    ],
    cta: {
      title: 'Bereit für Ihr digitales OP-Logbuch?',
      subtitle: 'Starten Sie kostenlos auf Web, iOS oder Android mit SurgiTrack iLog 2027.',
      primary: 'Konto kostenlos erstellen',
      secondary: 'Mit Konto anmelden',
    },
    footer: 'SurgiTrack iLog 2027 – Professionelle chirurgische Weiterbildungs- und Portfolio-Plattform',
  },
} as const;

const ICONS: Record<string, React.ElementType> = {
  Activity, BookOpen, Brain, FileText, FlaskConical, Globe, Images, Layers,
  MessageSquare, Play, ShieldCheck, Sparkles, Stethoscope, TrendingUp, Users, Youtube,
};

interface LandingPageProps {
  language: SupportedLanguage;
  onChangeLanguage?: (lang: SupportedLanguage) => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  onChangeLanguage,
  onSignIn,
  onSignUp,
}) => {
  const t = I18N[language] || I18N.en;
  const isRtl = language === 'ar';
  const [showTour, setShowTour] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#060E1F] text-slate-100 selection:bg-teal-500 selection:text-white"
    >
      <nav className="sticky top-0 z-40 bg-[#060E1F]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/icon-192.png"
              alt="SurgiTrack iLog"
              className="w-10 h-10 rounded-xl object-cover border border-teal-400/40 shadow-md"
            />
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">
                SurgiTrack <span className="text-teal-400">iLog</span>
              </span>
              <span className="hidden sm:inline-block ms-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                2027 V3
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300 me-2">
              <button type="button" onClick={() => scrollTo('features')} className="hover:text-teal-300 transition cursor-pointer">
                {t.nav.features}
              </button>
              <button type="button" onClick={() => scrollTo('stats')} className="hover:text-teal-300 transition cursor-pointer">
                {t.nav.stats}
              </button>
              <button type="button" onClick={() => scrollTo('testimonials')} className="hover:text-teal-300 transition cursor-pointer">
                {t.nav.testimonials}
              </button>
            </div>

            {onChangeLanguage && (
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-[11px] font-bold">
                {(['en', 'ar', 'de'] as SupportedLanguage[]).map((lng) => (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => onChangeLanguage(lng)}
                    className={`px-2 py-1 rounded-md transition cursor-pointer ${
                      language === lng
                        ? 'bg-teal-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lng === 'ar' ? 'عربي' : lng.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={onSignIn}
              className="px-3 sm:px-4 py-2 rounded-xl border border-slate-600 hover:border-teal-400 text-xs font-bold text-slate-100 hover:text-white transition cursor-pointer"
            >
              {t.nav.login}
            </button>
            <button
              type="button"
              onClick={onSignUp}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-teal-900/40 transition cursor-pointer"
            >
              {t.nav.signup}
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(13,148,136,0.22),transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-bold mb-6">
            <Sparkles size={14} />
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-lg sm:text-2xl font-bold text-teal-300 mb-4 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-9 leading-relaxed">
            {t.hero.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onSignUp}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-teal-950/60 transition cursor-pointer"
            >
              <Sparkles size={18} />
              <span>{t.hero.ctaPrimary}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTour(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-600 text-slate-100 font-bold text-sm transition cursor-pointer"
            >
              <Compass size={18} className="text-teal-400" />
              <span>{t.hero.ctaSecondary}</span>
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Play size={12} className="text-teal-400" />
            <span>{t.hero.watchVideo}</span>
          </p>
        </div>
      </section>

      <section id="features" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">{t.featuresTitle}</h2>
          <p className="text-sm sm:text-base text-slate-400">{t.featuresSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.features.map((f, idx) => {
            const Icon = ICONS[f.icon] || Stethoscope;
            return (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-teal-950/50">
                  <Icon size={22} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="stats" className="px-4 sm:px-8 py-14 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{t.statsTitle}</h2>
          <p className="text-sm text-slate-400 mb-10">{t.statsSubtitle}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {t.stats.map((s, idx) => {
              const Icon = ICONS[s.icon] || Activity;
              return (
                <div key={idx} className="bg-[#0B1730] border border-slate-800 rounded-2xl p-5">
                  <Icon size={26} className="text-teal-400 mx-auto mb-2.5" />
                  <div className="text-2xl font-extrabold text-white">{s.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="testimonials" className="px-4 sm:px-8 py-14 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">{t.testimonialsTitle}</h2>
          <p className="text-sm text-slate-400">{t.testimonialsSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.testimonials.map((tm, idx) => (
            <div key={idx} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed mb-5">"{tm.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {tm.avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{tm.name}</div>
                  <div className="text-[11px] text-slate-400">{tm.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-8 pb-16">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-teal-950/70 to-slate-900 border border-teal-500/30 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">{t.cta.title}</h2>
          <p className="text-sm text-slate-300 mb-7 max-w-xl mx-auto">{t.cta.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onSignUp}
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold transition cursor-pointer shadow-lg shadow-teal-950/60"
            >
              {t.cta.primary}
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="px-6 py-3 rounded-xl border border-slate-600 hover:border-teal-400 text-slate-100 text-sm font-bold transition cursor-pointer"
            >
              {t.cta.secondary}
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/80 px-4 py-6 text-center text-xs text-slate-500">
        {t.footer}
      </footer>

      {showTour && (
        <div
          onClick={() => setShowTour(false)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-[#0B1730] border border-teal-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">{t.tour.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{t.tour.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTour(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {t.tour.steps.map((step, i) => (
                <div key={i} className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 size={11} />
                    {step.badge}
                  </span>
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowTour(false);
                  onSignIn();
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-600 text-xs font-bold text-slate-200 hover:border-teal-400 cursor-pointer"
              >
                {t.nav.login}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTour(false);
                  onSignUp();
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold cursor-pointer"
              >
                {t.tour.startNow}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
