import React from 'react';

/**
 * Global Academic Footer Attribution
 * Strictly adheres to visual reference file_00000000e684820b89ee229a59c8a750_df9d5984.png
 * Text: "SurgiTrackiLog is designed by Dr. Zeyad Ali Murad; University of Aden 2026"
 * Typography: Times New Roman, italic, ~9-10px, subtle dark navy color, centered on one line.
 * Visuals: Central Caduceus medical emblem flanked by horizontal lines, green/teal ECG pulse lines,
 * and elegant curved navy/turquoise dual-wave bottom border.
 */
export const GlobalAcademicFooter: React.FC = () => {
  return (
    <footer className="w-full relative z-30 select-none overflow-hidden pt-6 pb-2 pointer-events-auto">
      {/* Decorative Medical Top Layer: ECG waveforms, central Caduceus emblem & flanking lines */}
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between gap-2 sm:gap-4 mb-2">
        {/* Left ECG Waveform */}
        <div className="hidden xs:flex items-center flex-1 justify-end max-w-[120px] sm:max-w-[180px]">
          <svg
            viewBox="0 0 120 24"
            className="w-full h-5 text-teal-500 overflow-visible"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 0 12 L 35 12 L 42 5 L 48 20 L 54 2 L 60 22 L 66 12 L 120 12" />
          </svg>
        </div>

        {/* Center: Flanking Lines & Caduceus Emblem */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-1">
          <div className="h-[1px] bg-slate-300/80 flex-1 max-w-[100px] sm:max-w-[160px]" />
          
          {/* Medical Caduceus / Rod of Asclepius Emblem */}
          <div className="shrink-0 text-teal-800 flex items-center justify-center p-1">
            <svg
              viewBox="0 0 32 32"
              className="w-6 h-6 text-[#101C32]"
              fill="currentColor"
              aria-hidden="true"
            >
              {/* Central Staff */}
              <circle cx="16" cy="4" r="2.2" />
              <rect x="15.2" y="6" width="1.6" height="22" rx="0.8" />
              {/* Wings */}
              <path
                d="M 16 7 C 12 5, 7 6, 5 10 C 8 10, 12 9, 15 11 Z"
                opacity="0.9"
              />
              <path
                d="M 16 7 C 20 5, 25 6, 27 10 C 24 10, 20 9, 17 11 Z"
                opacity="0.9"
              />
              {/* Coiled Serpents */}
              <path
                d="M 12 14 C 12 11, 20 11, 20 14 C 20 17, 12 18, 12 21 C 12 24, 20 24, 20 27"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M 20 14 C 20 11, 12 11, 12 14 C 12 17, 20 18, 20 21 C 20 24, 12 24, 12 27"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="h-[1px] bg-slate-300/80 flex-1 max-w-[100px] sm:max-w-[160px]" />
        </div>

        {/* Right ECG Waveform */}
        <div className="hidden xs:flex items-center flex-1 justify-start max-w-[120px] sm:max-w-[180px]">
          <svg
            viewBox="0 0 120 24"
            className="w-full h-5 text-teal-500 overflow-visible"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 0 12 L 54 12 L 60 5 L 66 20 L 72 2 L 78 22 L 84 12 L 120 12" />
          </svg>
        </div>
      </div>

      {/* Attribution Text: Times New Roman, italic, ~9-10px, subtle dark navy, centered on one line */}
      <div className="text-center px-4 mb-2">
        <p
          className="font-serif italic text-[9px] sm:text-[10px] text-slate-800 tracking-tight leading-tight select-text inline-block"
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
        >
          SurgiTrackiLog is designed by Dr. Zeyad Ali Murad; University of Aden 2026
        </p>
      </div>

      {/* Curved Navy/Turquoise Dual-Wave Bottom Graphic */}
      <div className="w-full leading-none overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          className="w-full h-7 sm:h-9 block"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Turquoise / Teal Accent Wave Line */}
          <path
            d="M 0,25 C 320,42 720,10 1080,28 C 1260,36 1380,22 1440,25"
            stroke="#0D9488"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Deep Navy Bottom Wave Fill */}
          <path
            d="M 0,28 C 320,45 720,13 1080,31 C 1260,39 1380,25 1440,28 L 1440,60 L 0,60 Z"
            fill="#101C32"
          />
        </svg>
      </div>
    </footer>
  );
};
