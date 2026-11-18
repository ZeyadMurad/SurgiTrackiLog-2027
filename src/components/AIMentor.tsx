import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, X, User, Loader, Bot } from 'lucide-react';
import type { SupportedLanguage } from '../types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS: Record<SupportedLanguage, string[]> = {
  en: [
    '65-year-old with severe RLQ pain, fever 38.5°C, leukocytosis — what is the differential diagnosis?',
    'How should I prepare for a laparoscopic cholecystectomy and check the Critical View of Safety?',
    'Analyze my current surgical portfolio and suggest key training focus areas.',
  ],
  ar: [
    'مريض 65 سنة بألم حاد في الربع السفلي الأيمن وحمى 38.5° — ما التشخيص التفريقي؟',
    'كيف أحضّر لاستئصال المرارة بالمنظار مع تطبيق Critical View of Safety؟',
    'حلل محفظتي الجراحية الحالية واقترح أولويات التدريب القادمة.',
  ],
  de: [
    '65-jähriger Patient mit RLQ-Schmerz, Fieber 38,5 °C und Leukozytose — Differentialdiagnose?',
    'Wie bereite ich eine laparoskopische Cholezystektomie mit Critical View of Safety optimal vor?',
    'Analysiere mein aktuelles OP-Logbuch und empfehle Schwerpunkte für die Weiterbildung.',
  ],
};

const I18N = {
  en: {
    title: 'AI Surgical Mentor',
    subtitle: '24/7 surgical education assistant',
    placeholder: 'Ask about procedures, differential diagnoses, or your portfolio...',
    thinking: 'Analyzing clinically...',
    disclaimer: 'Educational guidance only. Always follow institutional protocols & attending supervision.',
    suggestedTitle: 'Suggested questions:',
    welcome: 'Hello! I am your AI Surgical Mentor. Ask me about procedure steps, anatomy landmarks, differential diagnoses, or insights from your logged portfolio.',
  },
  ar: {
    title: 'المرشد الجراحي الذكي',
    subtitle: 'مساعد تعليمي جراحي 24/7',
    placeholder: 'اسأل عن الإجراءات الجراحية أو التشخيص التفريقي أو محفظتك...',
    thinking: 'جارٍ التحليل السريري...',
    disclaimer: 'لأغراض تعليمية فقط. اتبع دائماً إشراف الاستشاري وبروتوكولات المستشفى.',
    suggestedTitle: 'أسئلة مقترحة:',
    welcome: 'مرحباً! أنا مرشدك الجراحي بالذكاء الاصطناعي. اسألني عن خطوات العمليات، المعالم التشريحية، التشخيص التفريقي، أو تحليل محفظتك التدريبية.',
  },
  de: {
    title: 'KI-Chirurgie-Mentor',
    subtitle: '24/7 Weiterbildungsassistent',
    placeholder: 'Fragen zu OP-Schritten, Differentialdiagnosen oder Ihrem Logbuch...',
    thinking: 'Klinische Analyse läuft...',
    disclaimer: 'Nur zu Ausbildungszwecken. Folgen Sie stets den Klinikstandards und Oberärzten.',
    suggestedTitle: 'Beispielfragen:',
    welcome: 'Hallo! Ich bin Ihr KI-Chirurgie-Mentor. Fragen Sie zu OP-Vorbereitung, Anatomie, Differentialdiagnosen oder zur Auswertung Ihres OP-Logbuchs.',
  },
} as const;

export interface AIMentorPortfolioStats {
  totalCases: number;
  totalProcedures: number;
  verifiedProcedures: number;
  totalHours: number;
  verifiedHours: number;
  topProcedures: { name: string; count: number }[];
  proceduresBySpecialty: { specialty: string; count: number }[];
  skillsMatrix: { skillName: string; competencyStatus: string; totalHours: number }[];
}

interface AIMentorProps {
  language: SupportedLanguage;
  portfolioStats?: AIMentorPortfolioStats;
}

export const AIMentor: React.FC<AIMentorProps> = ({ language, portfolioStats }) => {
  const t = I18N[language] || I18N.en;
  const isRtl = language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: t.welcome,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [isOpen, messages.length, t.welcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: cleanText,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setShowSuggested(false);
    setIsLoading(true);

    try {
      const resp = await fetch('/api/ai-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
          language,
          portfolioStats,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data?.error || `HTTP ${resp.status}`);
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data?.reply || 'Unable to generate a response.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠ ${error?.message || 'AI Mentor is temporarily busy. Please try again in a moment.'}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t.title}
          title={t.title}
          style={{
            position: 'fixed',
            bottom: '84px',
            insetInlineEnd: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #db2777)',
            border: '2px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.45)',
            zIndex: 60,
            transition: 'transform 0.2s',
          }}
        >
          <Brain size={25} color="white" />
        </button>
      )}

      {isOpen && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{
            position: 'fixed',
            bottom: '20px',
            insetInlineEnd: '20px',
            width: 'min(420px, calc(100vw - 32px))',
            height: 'min(620px, calc(100vh - 96px))',
            background: '#0a0f1c',
            border: '1px solid #475569',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
            zIndex: 70,
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '0.9rem 1.15rem',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexShrink: 0,
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Brain size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{t.title}</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.88 }}>{t.subtitle}</div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.35rem',
              }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{
            padding: '0.45rem 0.9rem',
            background: 'rgba(245, 158, 11, 0.12)',
            color: '#fbbf24',
            fontSize: '0.72rem',
            textAlign: 'center',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
          }}>
            ⚠ {t.disclaimer}
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: msg.role === 'user' ? '#0d9488' : 'linear-gradient(135deg, #7c3aed, #db2777)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {msg.role === 'user' ? <User size={15} color="white" /> : <Bot size={15} color="white" />}
                </div>
                <div style={{
                  maxWidth: '78%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: '12px',
                  background: msg.role === 'user' ? '#0d9488' : '#1e293b',
                  color: msg.role === 'user' ? 'white' : '#f1f5f9',
                  fontSize: '0.84rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Bot size={15} color="white" />
                </div>
                <div style={{
                  padding: '0.65rem 0.9rem',
                  borderRadius: '12px',
                  background: '#1e293b',
                  color: '#cbd5e1',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}>
                  <Loader size={14} className="animate-spin" />
                  {t.thinking}
                </div>
              </div>
            )}

            {showSuggested && messages.length <= 1 && (
              <div style={{ marginTop: '0.25rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.45rem', fontWeight: 600 }}>
                  {t.suggestedTitle}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {(SUGGESTED_PROMPTS[language] || SUGGESTED_PROMPTS.en).map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(prompt)}
                      style={{
                        padding: '0.55rem 0.8rem',
                        background: '#1e293b',
                        border: '1px solid #334155',
                        color: '#cbd5e1',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        textAlign: isRtl ? 'right' : 'left',
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '0.85rem', borderTop: '1px solid #334155', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                rows={1}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.75rem',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  minHeight: '40px',
                  maxHeight: '110px',
                }}
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                style={{
                  width: '40px',
                  height: '40px',
                  background: input.trim() && !isLoading ? '#7c3aed' : '#334155',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isLoading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIMentor;
