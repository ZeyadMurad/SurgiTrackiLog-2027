// ============================================================================
// SurgicalAtlas3D.tsx — Futuristic Medical HUD Surgical Anatomy Workstation
// ----------------------------------------------------------------------------
// Orchestrates:
//   - Full-Body 3D GLB Workstation (HumanBodyViewer)
//   - Independent 3D Organ Focus Viewer + Tigris S3 BodyParts3D 4.3 Streaming
//   - 3 Approved Visualization Modes (Full Anatomical, Holographic, Layer-Based)
//   - 9 Anatomical Knowledge Domains + Floating Holographic Hub
//   - Vascular Surgery Priority + Surgical Dissection + Labeling Engine + Quiz
//   - EN / AR (RTL) / DE (LTR) localized medical terminology
// ============================================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Search,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Heart,
  Eye,
  EyeOff,
  Crosshair,
  Tag,
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
import {
  UNIFIED_ANATOMICAL_CATALOG,
  getStructureById,
  searchStructures,
  type AnatomySystem,
  type UnifiedAnatomicalStructure,
} from '../lib/surgicalAtlasCatalog';
import {
  getAtlasCopy,
  type KnowledgeDomainId,
  type LabelingLevel,
  type VisualizationMode,
  type WorkspaceLayoutMode,
} from '../lib/atlas/atlasI18n';
import {
  VASCULAR_PRIORITY_SHORTCUTS,
  getKnowledgeProfile,
  pickText,
} from '../lib/atlas/atlasKnowledgeRegistry';
import type { BodyPartsMeshAsset } from '../lib/atlas/bodypartsClient';
import { HumanBodyViewer } from './atlas/HumanBodyViewer';
import {
  OrganFocusViewer,
  type LoadedOrganComponent,
  type OrganDimensions,
} from './atlas/OrganFocusViewer';
import { AnatomicalNavigation } from './atlas/AnatomicalNavigation';
import { FloatingAnatomyIcons } from './atlas/FloatingAnatomyIcons';
import { KnowledgeDomainPanels } from './atlas/KnowledgeDomainPanels';

export interface SurgicalAtlas3DProps {
  language: SupportedLanguage;
  existingVideos?: any[];
  onNavigateToVideo?: (queryOrVideoId: string) => void;
  onStructureClick?: (structure: string, relatedProcedure: string) => void;
}

const DEFAULT_VISIBLE_SYSTEMS: Record<AnatomySystem, boolean> = {
  skin: true,
  skeleton: true,
  joints: true,
  muscles: true,
  organs: true,
  vessels: true,
  nerves: true,
};

const DEFAULT_SYSTEM_OPACITIES: Record<AnatomySystem, number> = {
  skin: 0.14,
  skeleton: 0.9,
  joints: 0.78,
  muscles: 0.85,
  organs: 1,
  vessels: 1,
  nerves: 1,
};

export const SurgicalAtlas3D: React.FC<SurgicalAtlas3DProps> = ({
  language,
  onNavigateToVideo,
}) => {
  const t = getAtlasCopy(language);
  const isRtl = language === 'ar';
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Core workstation state
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Visualization & Dissection state (Default = Full Anatomical Visualization)
  const [vizMode, setVizMode] = useState<VisualizationMode>('full');
  const [layoutMode, setLayoutMode] = useState<WorkspaceLayoutMode>('body');
  const [visibleSystems, setVisibleSystems] = useState<Record<AnatomySystem, boolean>>(DEFAULT_VISIBLE_SYSTEMS);
  const [systemOpacities, setSystemOpacities] = useState<Record<AnatomySystem, number>>(DEFAULT_SYSTEM_OPACITIES);
  const [isolatedSystem, setIsolatedSystem] = useState<AnatomySystem | null>(null);
  const [isolatedStructureId, setIsolatedStructureId] = useState<string | null>(null);
  const [hiddenStructureIds, setHiddenStructureIds] = useState<Set<string>>(new Set());
  const [dissectionLayerIndex, setDissectionLayerIndex] = useState(0);
  const [sectionRatio, setSectionRatio] = useState(0);
  const [labelLevel, setLabelLevel] = useState<LabelingLevel | 0>(1);
  const [deepMode, setDeepMode] = useState(false);

  // Selection & Synchronized Organ Focus state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [secondaryHighlightIds, setSecondaryHighlightIds] = useState<string[]>([]);
  const [clonedGlbGroup, setClonedGlbGroup] = useState<THREE.Group | null>(null);
  const [directBodyPartsAsset, setDirectBodyPartsAsset] = useState<BodyPartsMeshAsset | null>(null);
  const [activeDomain, setActiveDomain] = useState<KnowledgeDomainId>('explorer');
  const [loadedComponents, setLoadedComponents] = useState<LoadedOrganComponent[]>([]);
  const [organDimensions, setOrganDimensions] = useState<OrganDimensions | null>(null);
  const [isolatedSubPartId, setIsolatedSubPartId] = useState<string | null>(null);
  const [hiddenSubPartIds, setHiddenSubPartIds] = useState<Set<string>>(new Set());

  const selectedStructure: UnifiedAnatomicalStructure | null = useMemo(() => {
    if (selectedId) {
      return getStructureById(selectedId) || null;
    }
    if (directBodyPartsAsset) {
      return {
        id: directBodyPartsAsset.fjId,
        label: directBodyPartsAsset.name,
        system: (directBodyPartsAsset.system === 'other' ? 'organs' : directBodyPartsAsset.system) as AnatomySystem,
        category: directBodyPartsAsset.region,
        color: '#00D9FF',
        source: 'bodyparts3d',
        fmaId: directBodyPartsAsset.fmaId,
        hasRealMesh: true,
      };
    }
    return null;
  }, [selectedId, directBodyPartsAsset]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchStructures(searchQuery).slice(0, 10);
  }, [searchQuery]);

  // Select a structure from 3D body, left navigation, or search
  const handleSelectStructure = useCallback(
    (id: string | null, clonedGroup?: THREE.Group | null) => {
      if (!id) {
        setSelectedId(null);
        setDirectBodyPartsAsset(null);
        setClonedGlbGroup(null);
        setLayoutMode('body');
        setSecondaryHighlightIds([]);
        return;
      }
      setDirectBodyPartsAsset(null);
      setSelectedId(id);
      if (clonedGroup !== undefined) {
        setClonedGlbGroup(clonedGroup);
      }
      setIsolatedSubPartId(null);
      setHiddenSubPartIds(new Set());
      setSecondaryHighlightIds([]);
      setSearchOpen(false);
      setMobileNavOpen(false);
      setLayoutMode((prev) => (prev === 'body' ? 'dual' : prev));
    },
    [],
  );

  const handleSelectBodyPartsAsset = useCallback((asset: BodyPartsMeshAsset) => {
    setSelectedId(null);
    setClonedGlbGroup(null);
    setDirectBodyPartsAsset(asset);
    setIsolatedSubPartId(null);
    setHiddenSubPartIds(new Set());
    setMobileNavOpen(false);
    setLayoutMode('dual');
  }, []);

  const handleReturnToFullBody = useCallback(() => {
    setLayoutMode('body');
  }, []);

  // Surgical Dissection layer index drives progressive reversible visibility
  const handleChangeDissectionLayer = useCallback(
    (idx: number) => {
      setDissectionLayerIndex(idx);
      setVizMode('layers');
      const layers = t.dissectionLayers;
      const nextVis: Record<AnatomySystem, boolean> = {
        skin: false,
        skeleton: false,
        joints: false,
        muscles: false,
        organs: false,
        vessels: false,
        nerves: false,
      };
      for (let i = idx; i < layers.length; i++) {
        for (const s of layers[i].systems) {
          nextVis[s as AnatomySystem] = true;
        }
      }
      setVisibleSystems(nextVis);
      setIsolatedSystem(null);
    },
    [t.dissectionLayers],
  );

  const handleChangeVizMode = useCallback((mode: VisualizationMode) => {
    setVizMode(mode);
    if (mode === 'full') {
      setVisibleSystems(DEFAULT_VISIBLE_SYSTEMS);
      setSystemOpacities(DEFAULT_SYSTEM_OPACITIES);
      setIsolatedSystem(null);
      setDissectionLayerIndex(0);
    } else if (mode === 'holographic') {
      setVisibleSystems(DEFAULT_VISIBLE_SYSTEMS);
      setIsolatedSystem(null);
    }
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const showOrganPanel = Boolean(selectedStructure) && layoutMode !== 'body';
  const hoveredCat = hoveredId ? getStructureById(hoveredId) : null;
  const activeProfile = selectedStructure ? getKnowledgeProfile(selectedStructure) : null;

  return (
    <div
      ref={containerRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative flex flex-col w-full min-h-[760px] lg:h-[calc(100vh-148px)] bg-[#071426] text-[#F3F8FF] border border-[#00D9FF]/30 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(3,10,22,0.7)]"
    >
      {/* ==================== TOP FUTURISTIC MEDICAL HUD BAR ==================== */}
      <header className="flex flex-wrap items-center justify-between gap-2.5 px-3.5 py-2.5 bg-[#0B1B31] border-b border-[#258BFF]/30 z-30 shrink-0">
        {/* Left: Brand & Mobile Nav Trigger */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="lg:hidden p-2 rounded-xl bg-[#10243D] border border-[#258BFF]/35 text-[#8BEAFF] cursor-pointer"
            aria-label="Toggle Anatomical Navigation"
          >
            {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-tight text-[#F3F8FF] whitespace-nowrap">
                {t.brandTitle}
              </span>
              <span className="hidden sm:inline text-[10px] font-mono text-[#00D9FF]">
                3D HUD
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-[#91A7C0] truncate">
              {t.brandSubtitle}
            </p>
          </div>
        </div>

        {/* Center: Live Anatomical Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00D9FF]" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            placeholder={t.searchPlaceholder}
            className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-[#071426] border border-[#258BFF]/40 text-xs text-[#F3F8FF] placeholder-[#91A7C0]/75 focus:outline-none focus:border-[#00D9FF]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#91A7C0] hover:text-[#F3F8FF] cursor-pointer"
            >
              <X size={13} />
            </button>
          )}

          {searchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-[#0B1B31] border border-[#00D9FF]/45 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 p-1">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectStructure(item.id)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs text-start hover:bg-[#10243D] transition cursor-pointer"
                >
                  <span className="font-semibold text-[#F3F8FF] truncate">{item.label}</span>
                  <span className="text-[10px] font-mono text-[#8BEAFF] shrink-0">
                    {item.fmaId || item.system}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Sex Switcher, 3 Visualization Modes, Layout, Labels & Deep Mode */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {/* Male / Female Switch */}
          <div className="flex items-center bg-[#071426] p-0.5 rounded-lg border border-[#258BFF]/30">
            {(['male', 'female'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSex(s)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                  sex === s
                    ? 'bg-[#258BFF] text-white'
                    : 'text-[#91A7C0] hover:text-[#F3F8FF]'
                }`}
              >
                {s === 'male' ? t.male : t.female}
              </button>
            ))}
          </div>

          {/* Exactly Three Approved Visualization Modes */}
          <div className="flex items-center bg-[#071426] p-0.5 rounded-lg border border-[#258BFF]/30">
            {(
              [
                { id: 'full', label: t.modeFull },
                { id: 'holographic', label: t.modeHolographic },
                { id: 'layers', label: t.modeLayers },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleChangeVizMode(m.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
                  vizMode === m.id
                    ? 'bg-[#00D9FF] text-[#071426] font-bold'
                    : 'text-[#91A7C0] hover:text-[#F3F8FF]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Labeling Engine Level */}
          <div className="hidden xl:flex items-center gap-1 bg-[#071426] px-2 py-1 rounded-lg border border-[#258BFF]/30">
            <Tag size={11} className="text-[#00D9FF]" />
            <select
              value={labelLevel}
              onChange={(e) => setLabelLevel(Number(e.target.value) as LabelingLevel | 0)}
              className="bg-transparent text-[11px] font-semibold text-[#8BEAFF] focus:outline-none cursor-pointer"
              aria-label={t.labelLevel}
            >
              <option value={1} className="bg-[#0B1B31]">{t.labelL1}</option>
              <option value={2} className="bg-[#0B1B31]">{t.labelL2}</option>
              <option value={3} className="bg-[#0B1B31]">{t.labelL3}</option>
              <option value={0} className="bg-[#0B1B31]">{t.labelOff}</option>
            </select>
          </div>

          {/* Deep Anatomy Mode */}
          <button
            type="button"
            onClick={() => setDeepMode((d) => !d)}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer whitespace-nowrap ${
              deepMode
                ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF]'
                : 'bg-[#071426] border-[#258BFF]/30 text-[#91A7C0] hover:text-[#F3F8FF]'
            }`}
          >
            <Sparkles size={12} />
            <span>{t.deepAnatomy}</span>
          </button>

          {/* Layout Switcher when organ selected */}
          {selectedStructure && (
            <div className="flex items-center bg-[#071426] p-0.5 rounded-lg border border-[#00D9FF]/40">
              {(
                [
                  { id: 'body', label: t.layoutBody },
                  { id: 'dual', label: t.layoutDual },
                  { id: 'focus', label: t.layoutFocus },
                ] as const
              ).map((lm) => (
                <button
                  key={lm.id}
                  type="button"
                  onClick={() => setLayoutMode(lm.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
                    layoutMode === lm.id
                      ? 'bg-[#258BFF] text-white'
                      : 'text-[#8BEAFF] hover:text-white'
                  }`}
                >
                  {lm.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ==================== MAIN 3-ZONE ANATOMICAL WORKSPACE ==================== */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT ZONE: Anatomical Navigation (Desktop sidebar + Mobile/Tablet drawer) */}
        <aside
          className={`${
            mobileNavOpen
              ? 'fixed inset-y-0 left-0 z-40 w-72 p-2 bg-[#071426]/95'
              : 'hidden lg:block w-72 shrink-0 p-2'
          } h-full overflow-hidden`}
        >
          <AnatomicalNavigation
            language={language}
            sex={sex}
            searchQuery={searchQuery}
            selectedId={selectedId}
            visibleSystems={visibleSystems}
            systemOpacities={systemOpacities}
            isolatedSystem={isolatedSystem}
            onSelectStructure={(id) => handleSelectStructure(id)}
            onToggleSystemVisibility={(sys) =>
              setVisibleSystems((prev) => ({ ...prev, [sys]: !prev[sys] }))
            }
            onSetSystemOpacity={(sys, opacity) =>
              setSystemOpacities((prev) => ({ ...prev, [sys]: opacity }))
            }
            onToggleIsolateSystem={(sys) =>
              setIsolatedSystem((prev) => (prev === sys ? null : sys))
            }
            onShowAllSystems={() => {
              setVisibleSystems(DEFAULT_VISIBLE_SYSTEMS);
              setIsolatedSystem(null);
              setIsolatedStructureId(null);
              setHiddenStructureIds(new Set());
            }}
            onHideAllSystems={() => {
              setVisibleSystems({
                skin: false,
                skeleton: false,
                joints: false,
                muscles: false,
                organs: false,
                vessels: false,
                nerves: false,
              });
            }}
            onSelectBodyPartsAsset={handleSelectBodyPartsAsset}
            activeBodyPartsFjId={directBodyPartsAsset?.fjId || null}
          />
        </aside>

        {/* CENTER + RIGHT ZONES */}
        <main className="flex-1 min-w-0 flex flex-col lg:flex-row gap-2 p-2 overflow-hidden">
          {/* CENTER ZONE: Full 3D Human Body Reference */}
          <section
            className={`relative rounded-2xl border border-[#258BFF]/25 overflow-hidden transition-all duration-300 ${
              layoutMode === 'focus' && showOrganPanel
                ? 'hidden lg:block lg:w-52 xl:w-60 shrink-0 h-56 lg:h-full'
                : showOrganPanel
                ? 'h-[360px] lg:h-full lg:flex-1 min-w-0'
                : 'flex-1 h-[480px] lg:h-full min-w-0'
            }`}
          >
            <HumanBodyViewer
              language={language}
              sex={sex}
              selectedId={selectedId}
              secondaryHighlightIds={secondaryHighlightIds}
              hoveredId={hoveredId}
              vizMode={vizMode}
              visibleSystems={visibleSystems}
              systemOpacities={systemOpacities}
              isolatedSystem={isolatedSystem}
              isolatedStructureId={isolatedStructureId}
              hiddenStructureIds={hiddenStructureIds}
              labelLevel={labelLevel}
              deepMode={deepMode}
              sectionRatio={sectionRatio}
              compactReference={layoutMode === 'focus' && showOrganPanel}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
              onSelectStructure={handleSelectStructure}
              onHoverStructure={setHoveredId}
              onExtractSelection={(grp) => setClonedGlbGroup(grp)}
            />

            {/* Hover Tooltip HUD */}
            {hoveredCat && hoveredCat.id !== selectedId && (
              <div className="pointer-events-none absolute top-3 left-3 z-20 bg-[#071426]/90 border border-[#00D9FF]/45 rounded-xl px-3 py-1.5">
                <div className="text-xs font-bold text-[#F3F8FF]">{hoveredCat.label}</div>
                <div className="text-[10px] text-[#8BEAFF]">
                  {hoveredCat.category} {hoveredCat.fmaId ? `· ${hoveredCat.fmaId}` : ''}
                </div>
              </div>
            )}

            {/* Quick Return to Full Body banner when in Organ Focus */}
            {layoutMode === 'focus' && showOrganPanel && (
              <button
                type="button"
                onClick={handleReturnToFullBody}
                className="absolute bottom-2.5 left-2.5 right-2.5 z-20 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-[#258BFF] hover:bg-[#00D9FF] hover:text-[#071426] text-white text-[11px] font-bold transition cursor-pointer"
              >
                {isRtl ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                <span>{t.returnFullBody}</span>
              </button>
            )}
          </section>

          {/* RIGHT / SELECTED ANATOMY HUB ZONE */}
          <section
            className={`flex flex-col gap-2 min-w-0 overflow-y-auto ${
              layoutMode === 'focus' && showOrganPanel
                ? 'flex-1'
                : showOrganPanel
                ? 'w-full lg:w-[460px] xl:w-[530px] shrink-0'
                : 'w-full lg:w-80 xl:w-88 shrink-0'
            }`}
          >
            {/* Empty State: Full-Body Entry Guide & Vascular Surgery Priority */}
            {!selectedStructure && (
              <div className="flex flex-col gap-3 h-full bg-[#0B1B31] border border-[#258BFF]/25 rounded-2xl p-4 overflow-y-auto">
                <div>
                  <h2 className="text-sm font-extrabold text-[#F3F8FF]">{t.noSelectionTitle}</h2>
                  <p className="text-xs text-[#91A7C0] mt-1 leading-relaxed">{t.noSelectionHint}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#071426]/80 border border-[#00D9FF]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00D9FF]">
                    <Heart size={14} />
                    <span>{t.vascularBanner}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {VASCULAR_PRIORITY_SHORTCUTS.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handleSelectStructure(v.id)}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#10243D]/70 hover:bg-[#10243D] border border-[#258BFF]/30 hover:border-[#00D9FF] text-start transition cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#F3F8FF] truncate">
                            {pickText(v.label, language)}
                          </div>
                          <div className="text-[10px] font-mono text-[#8BEAFF]">{v.tag}</div>
                        </div>
                        <Crosshair size={14} className="text-[#00D9FF] shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Organ Focus Shortcuts */}
                <div className="p-3 rounded-xl bg-[#071426]/80 border border-[#258BFF]/25 space-y-2">
                  <div className="text-xs font-bold text-[#8BEAFF]">Major Anatomical Organs</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['heart', 'liver', 'brain', 'kidney_r', 'lung_r', 'stomach'].map((oid) => {
                      const cat = getStructureById(oid);
                      if (!cat) return null;
                      return (
                        <button
                          key={oid}
                          type="button"
                          onClick={() => handleSelectStructure(oid)}
                          className="px-2.5 py-2 rounded-lg bg-[#10243D]/65 hover:bg-[#258BFF]/25 border border-[#258BFF]/25 hover:border-[#00D9FF] text-xs font-semibold text-[#F3F8FF] text-start truncate transition cursor-pointer"
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto pt-2 border-t border-[#258BFF]/20 text-[10px] text-[#91A7C0] space-y-1">
                  <p>{t.attribution}</p>
                  <p className="text-[#8BEAFF]/80">{t.educationalNotice}</p>
                </div>
              </div>
            )}

            {/* Selected Organ Workspace: Independent 3D Organ Viewer + 9 Knowledge Domains */}
            {selectedStructure && (
              <div className="flex flex-col gap-2 h-full min-h-0">
                {/* Selected Organ Control Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#0B1B31] border border-[#00D9FF]/35 rounded-2xl shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={handleReturnToFullBody}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#10243D] hover:bg-[#258BFF] text-[#8BEAFF] hover:text-white border border-[#258BFF]/40 text-[11px] font-bold transition cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? <ArrowRight size={13} /> : <ArrowLeft size={13} />}
                      <span>{t.returnFullBody}</span>
                    </button>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#F3F8FF] truncate">
                        {activeProfile ? pickText(activeProfile.localizedName, language) : selectedStructure.label}
                      </h3>
                    </div>
                  </div>

                  {selectedId && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setIsolatedStructureId((prev) => (prev === selectedId ? null : selectedId))
                        }
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                          isolatedStructureId === selectedId
                            ? 'bg-[#00D9FF] text-[#071426] border-[#00D9FF]'
                            : 'bg-[#10243D] text-[#8BEAFF] border-[#258BFF]/35'
                        }`}
                      >
                        {isolatedStructureId === selectedId ? t.unisolate : t.isolate}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHiddenStructureIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(selectedId)) next.delete(selectedId);
                            else next.add(selectedId);
                            return next;
                          })
                        }
                        className="p-1.5 rounded-lg bg-[#10243D] text-[#8BEAFF] border border-[#258BFF]/35 cursor-pointer"
                        title={hiddenStructureIds.has(selectedId) ? t.show : t.hide}
                      >
                        {hiddenStructureIds.has(selectedId) ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Independent 3D Organ Viewer */}
                {showOrganPanel && (
                  <div className={layoutMode === 'focus' ? 'h-[360px] shrink-0' : 'h-[290px] shrink-0'}>
                    <OrganFocusViewer
                      language={language}
                      selectedStructure={selectedStructure}
                      clonedGlbGroup={clonedGlbGroup}
                      directBodyPartsAsset={directBodyPartsAsset}
                      vizMode={vizMode}
                      deepMode={deepMode}
                      sectionRatio={sectionRatio}
                      isolatedSubPartId={isolatedSubPartId}
                      hiddenSubPartIds={hiddenSubPartIds}
                      onSelectSubPart={(sub) => {
                        if (sub) setActiveDomain('explorer');
                      }}
                      onComponentsLoaded={(comps, dims) => {
                        setLoadedComponents(comps);
                        setOrganDimensions(dims);
                      }}
                      onSyncHighlightBody={() => {
                        if (selectedId) {
                          setLayoutMode('dual');
                          setSecondaryHighlightIds([selectedId]);
                        }
                      }}
                    />
                  </div>
                )}

                {/* Holographic Floating Nine Domains Hub */}
                <FloatingAnatomyIcons
                  language={language}
                  activeDomain={activeDomain}
                  onSelectDomain={(dom) => {
                    setActiveDomain(dom);
                    if (layoutMode === 'body') setLayoutMode('dual');
                  }}
                  organTitle={selectedStructure.label}
                />

                {/* Selected Knowledge Domain Workspace */}
                {showOrganPanel && (
                  <KnowledgeDomainPanels
                    language={language}
                    activeDomain={activeDomain}
                    selectedStructure={selectedStructure}
                    directBodyPartsAsset={directBodyPartsAsset}
                    loadedComponents={loadedComponents}
                    organDimensions={organDimensions}
                    isolatedSubPartId={isolatedSubPartId}
                    hiddenSubPartIds={hiddenSubPartIds}
                    deepMode={deepMode}
                    sectionRatio={sectionRatio}
                    dissectionLayerIndex={dissectionLayerIndex}
                    onToggleDeepMode={() => setDeepMode((d) => !d)}
                    onChangeSectionRatio={setSectionRatio}
                    onChangeDissectionLayer={handleChangeDissectionLayer}
                    onToggleIsolateSubPart={setIsolatedSubPartId}
                    onToggleHideSubPart={(subId) =>
                      setHiddenSubPartIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(subId)) next.delete(subId);
                        else next.add(subId);
                        return next;
                      })
                    }
                    onHighlightStructureIn3D={(targetId) => {
                      setSecondaryHighlightIds([targetId]);
                      if (layoutMode === 'focus') setLayoutMode('dual');
                    }}
                    onSelectStructureIn3D={(targetId) => handleSelectStructure(targetId)}
                    onNavigateToVideo={onNavigateToVideo}
                  />
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default SurgicalAtlas3D;
