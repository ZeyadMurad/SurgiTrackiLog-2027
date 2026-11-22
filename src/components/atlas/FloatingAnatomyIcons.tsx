import React, { useState } from 'react';
import {
  Compass,
  GitFork,
  HeartPulse,
  Scissors,
  FileText,
  BookOpen,
  Box,
  GraduationCap,
  Stethoscope,
  MoreHorizontal,
  ChevronUp,
} from 'lucide-react';
import type { SupportedLanguage } from '../../types';
import {
  getAtlasCopy,
  type KnowledgeDomainId,
} from '../../lib/atlas/atlasI18n';

const DOMAIN_ICONS: Record<KnowledgeDomainId, React.ElementType> = {
  explorer: Compass,
  relations: GitFork,
  vascular_nerve: HeartPulse,
  surgical_anatomy: Scissors,
  clinical_info: FileText,
  medical_library: BookOpen,
  model_lab: Box,
  learning_quiz: GraduationCap,
  procedures: Stethoscope,
};

const PRIMARY_DOMAINS: KnowledgeDomainId[] = [
  'explorer',
  'relations',
  'vascular_nerve',
  'surgical_anatomy',
  'medical_library',
];

const SECONDARY_DOMAINS: KnowledgeDomainId[] = [
  'clinical_info',
  'model_lab',
  'learning_quiz',
  'procedures',
];

export interface FloatingAnatomyIconsProps {
  language: SupportedLanguage;
  activeDomain: KnowledgeDomainId;
  onSelectDomain: (domain: KnowledgeDomainId) => void;
  organTitle: string;
}

export const FloatingAnatomyIcons: React.FC<FloatingAnatomyIconsProps> = ({
  language,
  activeDomain,
  onSelectDomain,
  organTitle,
}) => {
  const t = getAtlasCopy(language);
  const [expandedMore, setExpandedMore] = useState(
    SECONDARY_DOMAINS.includes(activeDomain),
  );

  const visibleDomains = expandedMore
    ? [...PRIMARY_DOMAINS, ...SECONDARY_DOMAINS]
    : PRIMARY_DOMAINS;

  return (
    <div className="relative bg-[#0B1B31] border border-[#00D9FF]/25 rounded-2xl p-2.5 overflow-hidden">
      {/* Fine holographic SVG connecting lines */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-35"
        viewBox="0 0 600 72"
        preserveAspectRatio="none"
      >
        <line x1="20" y1="36" x2="580" y2="36" stroke="#258BFF" strokeWidth="0.7" strokeDasharray="3 4" />
        <circle cx="20" cy="36" r="2.5" fill="#00D9FF" />
        <circle cx="580" cy="36" r="2.5" fill="#00D9FF" />
      </svg>

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleDomains.map((domId) => {
            const Icon = DOMAIN_ICONS[domId];
            const info = t.domains[domId];
            const isActive = activeDomain === domId;
            return (
              <button
                key={domId}
                type="button"
                title={`${info.label} — ${info.description} (${organTitle})`}
                onClick={() => onSelectDomain(domId)}
                className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#F3F8FF] shadow-[0_0_14px_rgba(0,217,255,0.35)]'
                    : 'bg-[#071426]/85 border-[#258BFF]/35 text-[#8BEAFF] hover:border-[#00D9FF] hover:text-[#F3F8FF]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                    isActive
                      ? 'bg-[#00D9FF] text-[#071426] border-[#00D9FF]'
                      : 'bg-[#10243D] text-[#00D9FF] border-[#258BFF]/40 group-hover:border-[#00D9FF]'
                  }`}
                >
                  <Icon size={11} />
                </span>
                <span>{info.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setExpandedMore((v) => !v)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-[#10243D] hover:bg-[#258BFF]/30 text-[#8BEAFF] border border-[#258BFF]/40 transition cursor-pointer whitespace-nowrap shrink-0"
        >
          {expandedMore ? <ChevronUp size={12} /> : <MoreHorizontal size={12} />}
          <span>{expandedMore ? t.lessDomains : `${t.moreDomains} (+4)`}</span>
        </button>
      </div>
    </div>
  );
};
