// ============================================================================
// SimulationLabView.tsx — Simulation Lab with platform catalog, internal
//                          case-based simulations, and session logging.
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  ExternalLink,
  Play,
  Plus,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  Trophy,
  Activity,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Star,
  Save,
  Brain,
  Cpu,
  HardDrive,
  Globe,
  Video,
  FileText,
  RotateCcw,
} from 'lucide-react';
import type {
  SimulationPlatform,
  SimulationSession,
  SimulationCase,
  SimulationQuestion,
  SimulationSessionType,
  SupportedLanguage,
} from '../types/newTypes';
import {
  SIMULATION_PLATFORMS,
  INTERNAL_SIMULATION_CASES,
} from '../lib/simulationPlatforms';

const I18N = {
  en: {
    title: 'Simulation Lab',
    subtitle: 'Practice with global simulation platforms and internal case-based simulations',
    tabs: {
      platforms: 'Platforms Catalog',
      internal: 'Internal Simulations',
      sessions: 'My Sessions',
    },
    platforms: {
      featured: 'Featured Platforms',
      visitSite: 'Visit Platform',
      freePlatform: 'Free',
      paidPlatform: 'Premium',
      vr: 'VR-based',
      web: 'Web-based',
      hardware: 'Hardware required',
      noHardware: 'No hardware required',
      recommended: 'Recommended for',
      certifications: 'Certifications offered',
      region: 'Region',
    },
    internal: {
      startSim: 'Start Simulation',
      duration: 'Duration',
      difficulty: 'Difficulty',
      skillsTested: 'Skills Tested',
      minutes: 'min',
      question: 'Question',
      of: 'of',
      next: 'Next',
      prev: 'Previous',
      submit: 'Submit Answers',
      correctAnswer: 'Correct answer',
      explanation: 'Explanation',
      rationale: 'Rationale',
      yourAnswer: 'Your answer',
      correct: 'Correct',
      incorrect: 'Incorrect',
      resultsSummary: 'Results Summary',
      score: 'Score',
      correctCount: 'Correct answers',
      retake: 'Retake Simulation',
      back: 'Back to Simulations',
      selectAnswer: 'Please select an answer',
    },
    sessions: {
      empty: 'No simulation sessions logged yet. Start practicing!',
      loggedOn: 'Logged on',
      platform: 'Platform',
      scenario: 'Scenario',
      duration: 'Duration (min)',
      score: 'Score',
      verified: 'Verified',
      pending: 'Pending verification',
    },
    difficulties: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    },
    sessionTypes: {
      vr_simulation: 'VR Simulation',
      box_trainer: 'Box Trainer',
      cadaveric: 'Cadaveric',
      virtual_patient: 'Virtual Patient',
      case_based_quiz: 'Case-based Quiz',
      team_scenario: 'Team Scenario',
      procedural_rehearsal: 'Procedural Rehearsal',
    },
    logSession: 'Log a Session',
  },
  ar: {
    title: 'مختبر المحاكاة',
    subtitle: 'تدرّب على منصات المحاكاة العالمية والمحاكاة الداخلية التفاعلية',
    tabs: {
      platforms: 'كتالوج المنصات',
      internal: 'محاكاة داخلية',
      sessions: 'جلساتي',
    },
    platforms: {
      featured: 'منصات مميزة',
      visitSite: 'زيارة المنصة',
      freePlatform: 'مجاني',
      paidPlatform: 'مدفوع',
      vr: 'يعتمد على VR',
      web: 'عبر الويب',
      hardware: 'يتطلب جهاز',
      noHardware: 'بدون جهاز',
      recommended: 'موصى به لـ',
      certifications: 'الشهادات المقدمة',
      region: 'المنطقة',
    },
    internal: {
      startSim: 'ابدأ المحاكاة',
      duration: 'المدة',
      difficulty: 'المستوى',
      skillsTested: 'المهارات المختبرة',
      minutes: 'دقيقة',
      question: 'سؤال',
      of: 'من',
      next: 'التالي',
      prev: 'السابق',
      submit: 'إرسال الإجابات',
      correctAnswer: 'الإجابة الصحيحة',
      explanation: 'الشرح',
      rationale: 'الأساس المنطقي',
      yourAnswer: 'إجابتك',
      correct: 'صحيح',
      incorrect: 'خطأ',
      resultsSummary: 'ملخص النتائج',
      score: 'النتيجة',
      correctCount: 'الإجابات الصحيحة',
      retake: 'إعادة المحاكاة',
      back: 'العودة للمحاكاة',
      selectAnswer: 'يرجى اختيار إجابة',
    },
    sessions: {
      empty: 'لا توجد جلسات مسجلة بعد. ابدأ التدريب!',
      loggedOn: 'سُجّل في',
      platform: 'المنصة',
      scenario: 'السيناريو',
      duration: 'المدة (دقيقة)',
      score: 'النتيجة',
      verified: 'موثّق',
      pending: 'بانتظار التحقق',
    },
    difficulties: {
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم',
    },
    sessionTypes: {
      vr_simulation: 'محاكاة VR',
      box_trainer: 'صندوق تدريب',
      cadaveric: 'على جثة',
      virtual_patient: 'مريض افتراضي',
      case_based_quiz: 'اختبار حالة',
      team_scenario: 'سيناريو فريق',
      procedural_rehearsal: 'تدريب إجراء',
    },
    logSession: 'تسجيل جلسة',
  },
  de: {
    title: 'Simulationslabor',
    subtitle: 'Üben Sie mit globalen Simulationsplattformen und internen fallbasierten Simulationen',
    tabs: {
      platforms: 'Plattform-Katalog',
      internal: 'Interne Simulationen',
      sessions: 'Meine Sitzungen',
    },
    platforms: {
      featured: 'Empfohlene Plattformen',
      visitSite: 'Plattform besuchen',
      freePlatform: 'Kostenlos',
      paidPlatform: 'Premium',
      vr: 'VR-basiert',
      web: 'Web-basiert',
      hardware: 'Hardware erforderlich',
      noHardware: 'Keine Hardware erforderlich',
      recommended: 'Empfohlen für',
      certifications: 'Zertifikate',
      region: 'Region',
    },
    internal: {
      startSim: 'Simulation starten',
      duration: 'Dauer',
      difficulty: 'Schwierigkeit',
      skillsTested: 'Getestete Fähigkeiten',
      minutes: 'Min.',
      question: 'Frage',
      of: 'von',
      next: 'Weiter',
      prev: 'Zurück',
      submit: 'Antworten abgeben',
      correctAnswer: 'Richtige Antwort',
      explanation: 'Erklärung',
      rationale: 'Begründung',
      yourAnswer: 'Ihre Antwort',
      correct: 'Richtig',
      incorrect: 'Falsch',
      resultsSummary: 'Ergebniszusammenfassung',
      score: 'Punktzahl',
      correctCount: 'Richtige Antworten',
      retake: 'Simulation wiederholen',
      back: 'Zurück zu Simulationen',
      selectAnswer: 'Bitte Antwort auswählen',
    },
    sessions: {
      empty: 'Noch keine Sitzungen protokolliert. Beginnen Sie mit dem Üben!',
      loggedOn: 'Protokolliert am',
      platform: 'Plattform',
      scenario: 'Szenario',
      duration: 'Dauer (Min.)',
      score: 'Punktzahl',
      verified: 'Verifiziert',
      pending: 'Ausstehend',
    },
    difficulties: {
      beginner: 'Anfänger',
      intermediate: 'Fortgeschritten',
      advanced: 'Experte',
    },
    sessionTypes: {
      vr_simulation: 'VR-Simulation',
      box_trainer: 'Box-Trainer',
      cadaveric: 'Kadaver',
      virtual_patient: 'Virtueller Patient',
      case_based_quiz: 'Fallbasiertes Quiz',
      team_scenario: 'Team-Szenario',
      procedural_rehearsal: 'Proben',
    },
    logSession: 'Sitzung protokollieren',
  },
} as const;

type Lang = keyof typeof I18N;

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  beginner: { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' },
  intermediate: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  advanced: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' },
};

// ============================================================================
// Main Component
// ============================================================================

export interface SimulationLabViewProps {
  language: Lang;
  currentUserId: string;
  traineeId?: string;
  simulationSessions?: SimulationSession[];
  onLogSession?: (session: Omit<SimulationSession, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateSession?: (id: string, updates: Partial<SimulationSession>) => Promise<void>;
}

export const SimulationLabView: React.FC<SimulationLabViewProps> = ({
  language,
  currentUserId,
  traineeId,
  simulationSessions = [],
  onLogSession,
  onUpdateSession,
}) => {
  const t = I18N[language];
  const isRtl = language === 'ar';
  const [activeTab, setActiveTab] = useState<'platforms' | 'internal' | 'sessions'>('platforms');

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        padding: '1.5rem',
        maxWidth: '1440px',
        margin: '0 auto',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
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
          <FlaskConical size={28} className="text-cyan-600" />
          {t.title}
        </h1>
        <p style={{ color: '#475569', marginTop: '0.25rem', fontSize: '0.95rem' }}>{t.subtitle}</p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '1.5rem',
        }}
      >
        {(['platforms', 'internal', 'sessions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.25rem',
              background: activeTab === tab ? 'white' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid #0891b2' : '3px solid transparent',
              color: activeTab === tab ? '#0e7490' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: activeTab === tab ? 600 : 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '-2px',
            }}
          >
            {tab === 'platforms' && <Globe size={16} />}
            {tab === 'internal' && <Brain size={16} />}
            {tab === 'sessions' && <Activity size={16} />}
            {t.tabs[tab]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'platforms' && <PlatformsTab language={language} />}
      {activeTab === 'internal' && (
        <InternalSimulationsTab
          language={language}
          currentUserId={currentUserId}
          traineeId={traineeId}
          onLogSession={onLogSession}
        />
      )}
      {activeTab === 'sessions' && (
        <SessionsTab
          language={language}
          sessions={simulationSessions}
        />
      )}
    </div>
  );
};

// ============================================================================
// PlatformsTab — Global simulation platforms catalog
// ============================================================================

const PlatformsTab: React.FC<{ language: Lang }> = ({ language }) => {
  const t = I18N[language].platforms;
  const [filter, setFilter] = useState<'all' | 'free' | 'web'>('all');

  const platforms = useMemo(() => {
    if (filter === 'free') return SIMULATION_PLATFORMS.filter(p => p.isFree);
    if (filter === 'web') return SIMULATION_PLATFORMS.filter(p => p.isWebBased && !p.requiresHardware);
    return SIMULATION_PLATFORMS;
  }, [filter]);

  return (
    <div>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
          {language === 'ar' ? 'الكل' : language === 'de' ? 'Alle' : 'All'}
        </FilterChip>
        <FilterChip active={filter === 'free'} onClick={() => setFilter('free')}>
          {t.freePlatform}
        </FilterChip>
        <FilterChip active={filter === 'web'} onClick={() => setFilter('web')}>
          {t.noHardware}
        </FilterChip>
      </div>

      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0e7490', marginBottom: '1rem' }}>
        {t.featured}
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1rem',
        }}
      >
        {platforms.map(platform => (
          <PlatformCard key={platform.id} platform={platform} language={language} />
        ))}
      </div>
    </div>
  );
};

const FilterChip: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: '0.375rem 0.875rem',
      background: active ? '#0891b2' : 'white',
      color: active ? 'white' : '#475569',
      border: `1px solid ${active ? '#0891b2' : '#cbd5e1'}`,
      borderRadius: '9999px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: 500,
    }}
  >
    {children}
  </button>
);

const PlatformCard: React.FC<{ platform: SimulationPlatform; language: Lang }> = ({
  platform,
  language,
}) => {
  const t = I18N[language].platforms;
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {/* Badges */}
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {platform.isFree ? (
          <Badge bg="#dcfce7" color="#15803d">
            {t.freePlatform}
          </Badge>
        ) : (
          <Badge bg="#fef3c7" color="#b45309">
            {t.paidPlatform}
          </Badge>
        )}
        {platform.isVRBased && (
          <Badge bg="#e0e7ff" color="#3730a3">
            <Cpu size={10} /> {t.vr}
          </Badge>
        )}
        {platform.isWebBased && !platform.requiresHardware && (
          <Badge bg="#dbeafe" color="#1d4ed8">
            <Globe size={10} /> {t.web}
          </Badge>
        )}
        {platform.requiresHardware && (
          <Badge bg="#fee2e2" color="#b91c1c">
            <HardDrive size={10} /> {t.hardware}
          </Badge>
        )}
      </div>

      {/* Name + provider */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
        {platform.name}
      </h3>
      <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0.75rem 0' }}>
        {platform.provider}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: '0.85rem',
          color: '#475569',
          lineHeight: 1.5,
          marginBottom: '0.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {platform.description}
      </p>

      {/* Recommended */}
      {platform.recommendedFor.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginBottom: '0.25rem' }}>
            {t.recommended}:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {platform.recommendedFor.slice(0, 3).map(r => (
              <span
                key={r}
                style={{
                  padding: '0.125rem 0.5rem',
                  background: '#f1f5f9',
                  color: '#475569',
                  borderRadius: '0.25rem',
                  fontSize: '0.7rem',
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {platform.certificationsOffered && platform.certificationsOffered.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginBottom: '0.25rem' }}>
            <Award size={11} style={{ verticalAlign: 'middle', marginInlineEnd: '0.25rem' }} />
            {t.certifications}:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {platform.certificationsOffered.map(c => (
              <span
                key={c}
                style={{
                  padding: '0.125rem 0.5rem',
                  background: '#fef3c7',
                  color: '#b45309',
                  borderRadius: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Visit button */}
      <a
        href={platform.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginTop: 'auto',
          padding: '0.5rem 1rem',
          background: '#0891b2',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.375rem',
          alignSelf: 'stretch',
        }}
      >
        <ExternalLink size={14} />
        {t.visitSite}
      </a>
    </div>
  );
};

const Badge: React.FC<{ bg: string; color: string; children: React.ReactNode }> = ({ bg, color, children }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      padding: '0.2rem 0.5rem',
      background: bg,
      color,
      borderRadius: '0.25rem',
      fontSize: '0.7rem',
      fontWeight: 600,
    }}
  >
    {children}
  </span>
);

// ============================================================================
// InternalSimulationsTab — Interactive case-based simulations
// ============================================================================

const InternalSimulationsTab: React.FC<{
  language: Lang;
  currentUserId: string;
  traineeId?: string;
  onLogSession?: (session: Omit<SimulationSession, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}> = ({ language, currentUserId, traineeId, onLogSession }) => {
  const t = I18N[language].internal;
  const [activeCase, setActiveCase] = useState<SimulationCase | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const startCase = (caseData: SimulationCase) => {
    setActiveCase(caseData);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  const submitCase = async () => {
    if (!activeCase || !onLogSession) {
      setShowResults(true);
      return;
    }
    const correctCount = activeCase.questions.filter(
      q => answers[q.id] === q.correctIndex
    ).length;

    const quizResults = activeCase.questions.map(q => ({
      questionId: q.id,
      question: q.question,
      selectedAnswer: q.options[answers[q.id] ?? -1] || 'No answer',
      correctAnswer: q.options[q.correctIndex],
      isCorrect: answers[q.id] === q.correctIndex,
    }));

    const overallScore = Math.round((correctCount / activeCase.questions.length) * 100);

    await onLogSession({
      userId: currentUserId,
      traineeId: traineeId,
      sessionDate: new Date().toISOString().split('T')[0],
      sessionType: 'case_based_quiz',
      scenarioName: activeCase.title,
      procedureName: activeCase.title,
      specialty: activeCase.category,
      durationMinutes: activeCase.estimatedMinutes,
      overallScore,
      accuracyScore: overallScore,
      skillsPracticed: activeCase.skillsTested,
      quizResults,
      verified: false,
    });

    setShowResults(true);
  };

  if (showResults && activeCase) {
    return (
      <ResultsView
        language={language}
        caseData={activeCase}
        answers={answers}
        onRetake={() => startCase(activeCase)}
        onBack={() => {
          setActiveCase(null);
          setShowResults(false);
        }}
      />
    );
  }

  if (activeCase) {
    const question = activeCase.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === activeCase.questions.length - 1;
    const allAnswered = activeCase.questions.every(q => answers[q.id] !== undefined);
    const currentAnswer = answers[question.id];

    return (
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={() => setActiveCase(null)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            marginBottom: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            fontSize: '0.875rem',
          }}
        >
          <ChevronLeft size={16} />
          {t.back}
        </button>

        {/* Case title + scenario */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            {activeCase.title}
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '0.625rem',
              flexWrap: 'wrap',
              marginBottom: '1rem',
              fontSize: '0.8rem',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#64748b' }}>
              <Clock size={12} /> {activeCase.estimatedMinutes} {t.minutes}
            </span>
            <span
              style={{
                display: 'inline-flex',
                padding: '0.125rem 0.5rem',
                background: DIFFICULTY_COLORS[activeCase.difficulty].bg,
                color: DIFFICULTY_COLORS[activeCase.difficulty].text,
                borderRadius: '0.25rem',
                fontWeight: 600,
              }}
            >
              {I18N[language].difficulties[activeCase.difficulty]}
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            {activeCase.scenario}
          </p>

          {/* Skills tested */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {activeCase.skillsTested.map(s => (
              <span
                key={s}
                style={{
                  padding: '0.125rem 0.5rem',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${((currentQuestionIndex + 1) / activeCase.questions.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0891b2, #06b6d4)',
                transition: 'width 0.3s',
              }}
            />
          </div>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
            {t.question} {currentQuestionIndex + 1} {t.of} {activeCase.questions.length}
          </span>
        </div>

        {/* Question */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1rem',
          }}
        >
          <p style={{ fontSize: '1rem', color: '#0f172a', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {question.question}
          </p>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setAnswers({ ...answers, [question.id]: idx })}
                style={{
                  padding: '0.875rem 1rem',
                  background: currentAnswer === idx ? '#e0f2fe' : 'white',
                  border: `1px solid ${currentAnswer === idx ? '#0891b2' : '#cbd5e1'}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'start',
                  fontSize: '0.9rem',
                  color: currentAnswer === idx ? '#0c4a6e' : '#1e293b',
                  fontWeight: currentAnswer === idx ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: currentAnswer === idx ? '#0891b2' : '#e2e8f0',
                    color: currentAnswer === idx ? 'white' : '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.625rem' }}>
          <button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            style={{
              padding: '0.625rem 1.25rem',
              background: currentQuestionIndex === 0 ? '#f1f5f9' : 'white',
              color: currentQuestionIndex === 0 ? '#94a3b8' : '#475569',
              border: `1px solid ${currentQuestionIndex === 0 ? '#e2e8f0' : '#cbd5e1'}`,
              borderRadius: '0.5rem',
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <ChevronLeft size={14} />
            {t.prev}
          </button>

          {isLastQuestion ? (
            <button
              onClick={submitCase}
              disabled={!allAnswered}
              style={{
                padding: '0.625rem 1.25rem',
                background: allAnswered ? '#16a34a' : '#94a3b8',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: allAnswered ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <CheckCircle2 size={14} />
              {t.submit}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={currentAnswer === undefined}
              style={{
                padding: '0.625rem 1.25rem',
                background: currentAnswer === undefined ? '#94a3b8' : '#0891b2',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: currentAnswer === undefined ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              {t.next}
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // List of available simulations
  return (
    <div>
      <div
        style={{
          padding: '1rem 1.25rem',
          background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #a5f3fc',
        }}
      >
        <p style={{ fontSize: '0.9rem', color: '#0e7490', margin: 0 }}>
          <Brain size={14} style={{ verticalAlign: 'middle', marginInlineEnd: '0.25rem' }} />
          {language === 'ar'
            ? 'محاكاة تفاعلية قائمة على الحالات السريرية. اختبر معرفتك وحلّل أداءك.'
            : language === 'de'
            ? 'Interaktive fallbasierte Simulationen. Testen Sie Ihr Wissen und analysieren Sie Ihre Leistung.'
            : 'Interactive case-based simulations. Test your knowledge and analyze your performance.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {INTERNAL_SIMULATION_CASES.map(caseData => (
          <div
            key={caseData.id}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  padding: '0.2rem 0.625rem',
                  background: DIFFICULTY_COLORS[caseData.difficulty].bg,
                  color: DIFFICULTY_COLORS[caseData.difficulty].text,
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {I18N[language].difficulties[caseData.difficulty]}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{caseData.category}</span>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
              {caseData.title}
            </h3>

            <p
              style={{
                fontSize: '0.85rem',
                color: '#475569',
                lineHeight: 1.5,
                marginBottom: '0.75rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {caseData.scenario}
            </p>

            <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} /> {caseData.estimatedMinutes} {t.minutes}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <FileText size={12} /> {caseData.questions.length} {language === 'ar' ? 'أسئلة' : 'questions'}
              </span>
            </div>

            <button
              onClick={() => startCase(caseData)}
              style={{
                marginTop: 'auto',
                padding: '0.625rem 1rem',
                background: '#0891b2',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
              }}
            >
              <Play size={14} />
              {t.startSim}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// ResultsView
// ============================================================================

const ResultsView: React.FC<{
  language: Lang;
  caseData: SimulationCase;
  answers: Record<string, number>;
  onRetake: () => void;
  onBack: () => void;
}> = ({ language, caseData, answers, onRetake, onBack }) => {
  const t = I18N[language].internal;
  const correctCount = caseData.questions.filter(q => answers[q.id] === q.correctIndex).length;
  const score = Math.round((correctCount / caseData.questions.length) * 100);

  const scoreColor =
    score >= 80 ? '#15803d' : score >= 60 ? '#b45309' : '#b91c1c';
  const scoreBg =
    score >= 80 ? '#dcfce7' : score >= 60 ? '#fef3c7' : '#fee2e2';

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Summary card */}
      <div
        style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '1rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: scoreBg,
            color: scoreColor,
            marginBottom: '0.75rem',
            fontSize: '1.75rem',
            fontWeight: 700,
          }}
        >
          {score}%
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
          {t.resultsSummary}
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#475569' }}>
          {correctCount} / {caseData.questions.length} {t.correctCount}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            onClick={onRetake}
            style={{
              padding: '0.625rem 1rem',
              background: '#0891b2',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <RotateCcw size={14} />
            {t.retake}
          </button>
          <button
            onClick={onBack}
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
            {t.back}
          </button>
        </div>
      </div>

      {/* Question-by-question review */}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {caseData.questions.map((q, idx) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correctIndex;
          return (
            <div
              key={q.id}
              style={{
                background: 'white',
                border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
                borderLeft: `4px solid ${isCorrect ? '#16a34a' : '#dc2626'}`,
                borderRadius: '0.5rem',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {isCorrect ? (
                  <CheckCircle2 size={18} className="text-green-600" />
                ) : (
                  <XCircle size={18} className="text-red-600" />
                )}
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                  {t.question} {idx + 1}
                </span>
                <span style={{ fontSize: '0.85rem', color: isCorrect ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
                  {isCorrect ? t.correct : t.incorrect}
                </span>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {q.question}
              </p>

              {userAnswer !== undefined && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                    {t.yourAnswer}:
                  </span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      marginLeft: '0.25rem',
                      color: isCorrect ? '#15803d' : '#b91c1c',
                      fontWeight: 500,
                    }}
                  >
                    {q.options[userAnswer]}
                  </span>
                </div>
              )}

              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 500 }}>
                  {t.correctAnswer}:
                </span>
                <span style={{ fontSize: '0.85rem', marginLeft: '0.25rem', color: '#1e293b', fontWeight: 600 }}>
                  {q.options[q.correctIndex]}
                </span>
              </div>

              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  background: '#f8fafc',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.85rem',
                  color: '#475569',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: '#1e293b' }}>{t.explanation}: </strong>
                {q.explanation}
              </div>
              <div
                style={{
                  marginTop: '0.5rem',
                  padding: '0.625rem 0.875rem',
                  background: '#f0f9ff',
                  borderRadius: '0.375rem',
                  border: '1px solid #bae6fd',
                  fontSize: '0.85rem',
                  color: '#0c4a6e',
                  lineHeight: 1.5,
                }}
              >
                <strong>{t.rationale}: </strong>
                {q.rationale}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SessionsTab — User's logged simulation sessions
// ============================================================================

const SessionsTab: React.FC<{ language: Lang; sessions: SimulationSession[] }> = ({
  language,
  sessions,
}) => {
  const t = I18N[language].sessions;

  if (sessions.length === 0) {
    return (
      <div
        style={{
          padding: '3rem 1rem',
          textAlign: 'center',
          background: 'white',
          border: '1px dashed #cbd5e1',
          borderRadius: '0.75rem',
        }}
      >
        <Activity size={48} style={{ margin: '0 auto 1rem', color: '#cbd5e1' }} />
        <p style={{ color: '#64748b', fontSize: '1rem' }}>{t.empty}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <th style={{ padding: '0.875rem 1rem', textAlign: 'start', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
              {t.loggedOn}
            </th>
            <th style={{ padding: '0.875rem 1rem', textAlign: 'start', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
              {t.scenario}
            </th>
            <th style={{ padding: '0.875rem 1rem', textAlign: 'start', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
              {t.duration}
            </th>
            <th style={{ padding: '0.875rem 1rem', textAlign: 'start', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
              {t.score}
            </th>
            <th style={{ padding: '0.875rem 1rem', textAlign: 'start', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
              {t.verified}
            </th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#1e293b' }}>
                {new Date(s.sessionDate).toLocaleDateString()}
              </td>
              <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 500 }}>
                {s.scenarioName}
                {s.platformName && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{s.platformName}</div>
                )}
              </td>
              <td style={{ padding: '0.875rem 1rem', fontSize: '0.85rem', color: '#475569' }}>{s.durationMinutes}</td>
              <td style={{ padding: '0.875rem 1rem' }}>
                {s.overallScore !== undefined ? (
                  <span
                    style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background:
                        s.overallScore >= 80 ? '#dcfce7' : s.overallScore >= 60 ? '#fef3c7' : '#fee2e2',
                      color: s.overallScore >= 80 ? '#15803d' : s.overallScore >= 60 ? '#b45309' : '#b91c1c',
                    }}
                  >
                    {s.overallScore}%
                  </span>
                ) : (
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                )}
              </td>
              <td style={{ padding: '0.875rem 1rem' }}>
                {s.verified ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#15803d', fontSize: '0.8rem', fontWeight: 600 }}>
                    <CheckCircle2 size={14} />
                    {t.verified}
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#b45309', fontSize: '0.8rem' }}>
                    <Clock size={14} />
                    {t.pending}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimulationLabView;
