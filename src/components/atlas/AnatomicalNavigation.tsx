import React, { useEffect, useMemo, useState } from 'react';
import {
  Layers,
  Bone,
  Heart,
  Brain,
  Activity,
  Stethoscope,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Database,
  Loader2,
  MapPin,
  Search,
} from 'lucide-react';
import type { SupportedLanguage } from '../../types';
import {
  SYSTEM_ORDER,
  UNIFIED_ANATOMICAL_CATALOG,
  type AnatomySystem,
  type UnifiedAnatomicalStructure,
} from '../../lib/surgicalAtlasCatalog';
import {
  getAtlasCopy,
  REGION_LABELS,
  SYSTEM_LOCALIZED,
} from '../../lib/atlas/atlasI18n';
import {
  VASCULAR_PRIORITY_SHORTCUTS,
  pickText,
} from '../../lib/atlas/atlasKnowledgeRegistry';
import {
  fetchBodyPartsRegistry,
  type BodyPartsMeshAsset,
  type BodyPartsRegistryResponse,
} from '../../lib/atlas/bodypartsClient';

const SYSTEM_ICONS: Record<AnatomySystem, React.ElementType> = {
  skin: Layers,
  skeleton: Bone,
  joints: Activity,
  muscles: Activity,
  organs: Stethoscope,
  vessels: Heart,
  nerves: Brain,
};

export interface AnatomicalNavigationProps {
  language: SupportedLanguage;
  sex: 'male' | 'female';
  searchQuery: string;
  selectedId: string | null;
  visibleSystems: Record<AnatomySystem, boolean>;
  systemOpacities: Record<AnatomySystem, number>;
  isolatedSystem: AnatomySystem | null;
  onSelectStructure: (id: string) => void;
  onToggleSystemVisibility: (sys: AnatomySystem) => void;
  onSetSystemOpacity: (sys: AnatomySystem, opacity: number) => void;
  onToggleIsolateSystem: (sys: AnatomySystem) => void;
  onShowAllSystems: () => void;
  onHideAllSystems: () => void;
  onSelectBodyPartsAsset: (asset: BodyPartsMeshAsset) => void;
  activeBodyPartsFjId?: string | null;
}

export const AnatomicalNavigation: React.FC<AnatomicalNavigationProps> = ({
  language,
  sex,
  searchQuery,
  selectedId,
  visibleSystems,
  systemOpacities,
  isolatedSystem,
  onSelectStructure,
  onToggleSystemVisibility,
  onSetSystemOpacity,
  onToggleIsolateSystem,
  onShowAllSystems,
  onHideAllSystems,
  onSelectBodyPartsAsset,
  activeBodyPartsFjId,
}) => {
  const t = getAtlasCopy(language);
  const [navTab, setNavTab] = useState<'systems' | 'regions' | 'vascular' | 'bp3d'>('systems');
  const [expandedSystem, setExpandedSystem] = useState<AnatomySystem | null>('vessels');
  const [expandedRegion, setExpandedRegion] = useState<string>('thorax');

  // BodyParts3D 4.3 Tigris Registry state
  const [bpFilterSys, setBpFilterSys] = useState<string>('vessels');
  const [bpLocalSearch, setBpLocalSearch] = useState('');
  const [bpLoading, setBpLoading] = useState(false);
  const [bpData, setBpData] = useState<BodyPartsRegistryResponse | null>(null);
  const [bpError, setBpError] = useState<string | null>(null);

  const sexCatalog = useMemo(
    () =>
      UNIFIED_ANATOMICAL_CATALOG.filter(
        (s) => !s.sex || s.sex === 'both' || s.sex === sex,
      ),
    [sex],
  );

  const groupedBySystem = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const map = new Map<AnatomySystem, UnifiedAnatomicalStructure[]>();
    for (const sys of SYSTEM_ORDER) {
      map.set(sys, []);
    }
    for (const item of sexCatalog) {
      if (q) {
        const hay = `${item.label} ${item.id} ${item.fmaId || ''} ${item.category} ${item.kanji || ''}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      map.get(item.system)?.push(item);
    }
    return map;
  }, [sexCatalog, searchQuery]);

  // Fetch BodyParts3D 4.3 registry from Tigris backend when BP3D tab is active or search query changes
  useEffect(() => {
    if (navTab !== 'bp3d') return;
    let cancelled = false;
    setBpLoading(true);
    setBpError(null);
    const effectiveQ = (bpLocalSearch || searchQuery).trim();

    fetchBodyPartsRegistry({
      q: effectiveQ,
      system: bpFilterSys,
      limit: 60,
      offset: 0,
    })
      .then((res) => {
        if (!cancelled) {
          setBpData(res);
          setBpLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setBpError(err instanceof Error ? err.message : 'Unable to load BodyParts3D registry.');
          setBpLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navTab, bpFilterSys, bpLocalSearch, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-[#0B1B31] border border-[#258BFF]/25 rounded-2xl overflow-hidden text-[#F3F8FF]">
      {/* Segmented Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1.5 bg-[#071426] border-b border-[#258BFF]/25 shrink-0">
        {(
          [
            { id: 'systems', label: t.tabSystems },
            { id: 'regions', label: t.tabRegions },
            { id: 'vascular', label: t.tabVascular },
            { id: 'bp3d', label: t.tabBodyParts },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setNavTab(tab.id)}
            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap truncate ${
              navTab === tab.id
                ? 'bg-[#258BFF] text-white shadow-[0_0_12px_rgba(37,139,255,0.4)]'
                : 'text-[#91A7C0] hover:text-[#F3F8FF] hover:bg-[#10243D]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Systems & Visibility Controls */}
      {navTab === 'systems' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#258BFF]/20 bg-[#10243D]/40 shrink-0">
            <span className="text-[11px] font-semibold text-[#8BEAFF]">
              {sexCatalog.length} structures
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onShowAllSystems}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10243D] hover:bg-[#258BFF]/30 text-[#8BEAFF] border border-[#258BFF]/30 cursor-pointer"
              >
                {t.showAll}
              </button>
              <button
                type="button"
                onClick={onHideAllSystems}
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10243D] hover:bg-[#258BFF]/30 text-[#91A7C0] border border-[#258BFF]/25 cursor-pointer"
              >
                {t.hideAll}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {SYSTEM_ORDER.map((sys) => {
              const Icon = SYSTEM_ICONS[sys];
              const list = groupedBySystem.get(sys) || [];
              const isVisible = visibleSystems[sys];
              const isIso = isolatedSystem === sys;
              const isExpanded = expandedSystem === sys || Boolean(searchQuery.trim());
              const sysLabel = SYSTEM_LOCALIZED[sys]?.[language] || SYSTEM_LOCALIZED[sys]?.en || sys;

              return (
                <div
                  key={sys}
                  className={`rounded-xl border transition ${
                    isIso
                      ? 'border-[#00D9FF]/60 bg-[#10243D]/80'
                      : 'border-[#258BFF]/20 bg-[#071426]/65'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 px-2.5 py-2">
                    <button
                      type="button"
                      onClick={() => setExpandedSystem(expandedSystem === sys ? null : sys)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-start cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown size={13} className="text-[#00D9FF] shrink-0" />
                      ) : (
                        <ChevronRight size={13} className="text-[#91A7C0] shrink-0" />
                      )}
                      <Icon size={14} className={isVisible ? 'text-[#00D9FF] shrink-0' : 'text-slate-600 shrink-0'} />
                      <span className={`text-xs font-semibold truncate ${isVisible ? 'text-[#F3F8FF]' : 'text-slate-500'}`}>
                        {sysLabel}
                      </span>
                      <span className="text-[10px] font-mono tabular-nums text-[#91A7C0] shrink-0">
                        {list.length}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleIsolateSystem(sys)}
                        title={t.isolate}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition cursor-pointer border ${
                          isIso
                            ? 'bg-[#00D9FF] text-[#071426] border-[#00D9FF]'
                            : 'bg-[#10243D] text-[#91A7C0] border-[#258BFF]/25 hover:text-[#F3F8FF]'
                        }`}
                      >
                        {t.isolate}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleSystemVisibility(sys)}
                        title={isVisible ? t.hide : t.show}
                        className="p-1 rounded hover:bg-[#10243D] text-[#8BEAFF] cursor-pointer"
                      >
                        {isVisible ? <Eye size={13} /> : <EyeOff size={13} className="text-slate-500" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-2.5 pb-2 space-y-1 border-t border-[#258BFF]/15 pt-1.5">
                      <div className="flex items-center gap-2 px-1 pb-1">
                        <span className="text-[10px] text-[#91A7C0]">{t.opacity}</span>
                        <input
                          type="range"
                          min={0.05}
                          max={1}
                          step={0.05}
                          value={systemOpacities[sys]}
                          onChange={(e) => onSetSystemOpacity(sys, Number(e.target.value))}
                          className="flex-1 accent-[#00D9FF] h-1 cursor-pointer"
                        />
                        <span className="text-[10px] font-mono tabular-nums text-[#8BEAFF] w-7 text-end">
                          {Math.round(systemOpacities[sys] * 100)}%
                        </span>
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-0.5 pr-0.5">
                        {list.map((struct) => {
                          const isSel = struct.id === selectedId;
                          return (
                            <button
                              key={struct.id}
                              type="button"
                              onClick={() => onSelectStructure(struct.id)}
                              className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-[11px] text-start transition cursor-pointer ${
                                isSel
                                  ? 'bg-[#00D9FF]/20 border border-[#00D9FF]/70 text-[#F3F8FF] font-semibold'
                                  : 'text-[#91A7C0] hover:bg-[#10243D] hover:text-[#F3F8FF] border border-transparent'
                              }`}
                            >
                              <span className="truncate">{struct.label}</span>
                              {struct.fmaId && (
                                <span className="text-[9px] font-mono text-[#8BEAFF]/80 shrink-0">
                                  {struct.fmaId}
                                </span>
                              )}
                            </button>
                          );
                        })}
                        {list.length === 0 && (
                          <div className="text-[10px] text-[#91A7C0] px-2 py-1">No matching items</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Regions Navigation */}
      {navTab === 'regions' && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {Object.entries(REGION_LABELS).map(([regionKey, region]) => {
            const isExpanded = expandedRegion === regionKey;
            const label = region[language] || region.en;
            const structs = region.structureIds
              .map((id) => sexCatalog.find((s) => s.id === id))
              .filter((s): s is UnifiedAnatomicalStructure => Boolean(s));

            return (
              <div key={regionKey} className="rounded-xl border border-[#258BFF]/20 bg-[#071426]/65">
                <button
                  type="button"
                  onClick={() => setExpandedRegion(isExpanded ? '' : regionKey)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-start cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin size={13} className="text-[#00D9FF] shrink-0" />
                    <span className="text-xs font-semibold text-[#F3F8FF] truncate">{label}</span>
                  </div>
                  <span className="text-[10px] font-mono tabular-nums text-[#8BEAFF]">{structs.length}</span>
                </button>
                {isExpanded && (
                  <div className="px-2 pb-2 space-y-0.5 border-t border-[#258BFF]/15 pt-1.5">
                    {structs.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onSelectStructure(s.id)}
                        className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-[11px] text-start transition cursor-pointer ${
                          s.id === selectedId
                            ? 'bg-[#00D9FF]/20 border border-[#00D9FF]/70 text-[#F3F8FF] font-semibold'
                            : 'text-[#91A7C0] hover:bg-[#10243D] hover:text-[#F3F8FF]'
                        }`}
                      >
                        <span className="truncate">{s.label}</span>
                        {s.fmaId && <span className="text-[9px] font-mono text-[#8BEAFF]/75">{s.fmaId}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: Vascular Surgery Priority */}
      {navTab === 'vascular' && (
        <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
          <div className="bg-[#10243D]/70 border border-[#00D9FF]/30 rounded-xl p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#00D9FF]">
              <Heart size={13} />
              <span>{t.vascularBanner}</span>
            </div>
            <p className="text-[10px] text-[#91A7C0] mt-1 leading-relaxed">
              Aorta · Iliac · Femoral · Popliteal · Tibial · Carotid · Coronary
            </p>
          </div>

          {VASCULAR_PRIORITY_SHORTCUTS.map((v) => {
            const isSel = selectedId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectStructure(v.id)}
                className={`w-full rounded-xl p-2.5 text-start border transition cursor-pointer ${
                  isSel
                    ? 'bg-[#00D9FF]/15 border-[#00D9FF] text-[#F3F8FF]'
                    : 'bg-[#071426]/75 border-[#258BFF]/25 hover:border-[#00D9FF]/60 text-[#F3F8FF]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold">{pickText(v.label, language)}</span>
                  <Crosshair size={13} className="text-[#00D9FF] shrink-0" />
                </div>
                <div className="text-[10px] text-[#8BEAFF] mt-1 font-mono">{v.tag}</div>
              </button>
            );
          })}

          <div className="pt-1 border-t border-[#258BFF]/20 space-y-1">
            <div className="text-[10px] font-semibold text-[#91A7C0] px-1">All Vascular Structures (3D GLB)</div>
            {(groupedBySystem.get('vessels') || []).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectStructure(v.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-start transition cursor-pointer ${
                  selectedId === v.id
                    ? 'bg-[#00D9FF]/20 text-[#F3F8FF] font-semibold border border-[#00D9FF]/60'
                    : 'text-[#91A7C0] hover:bg-[#10243D] hover:text-[#F3F8FF]'
                }`}
              >
                <span className="truncate">{v.label}</span>
                {v.fmaId && <span className="text-[9px] font-mono text-[#8BEAFF]/75">{v.fmaId}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: BodyParts3D 4.3 Live Tigris Registry (3,210 verified meshes) */}
      {navTab === 'bp3d' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-2 border-b border-[#258BFF]/20 space-y-2 bg-[#071426]/70 shrink-0">
            <div className="flex items-center justify-between text-[10px] text-[#8BEAFF]">
              <span className="flex items-center gap-1 font-semibold">
                <Database size={11} className="text-[#00D9FF]" />
                <span>{t.bodyPartsVerifiedBadge}</span>
              </span>
              {bpData && (
                <span className="font-mono tabular-nums">{bpData.totalAssets} OBJs</span>
              )}
            </div>

            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#91A7C0]" />
              <input
                type="text"
                value={bpLocalSearch}
                onChange={(e) => setBpLocalSearch(e.target.value)}
                placeholder="e.g. aorta, carotid, femoral, coronary..."
                className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-[#10243D] border border-[#258BFF]/30 text-[11px] text-[#F3F8FF] placeholder-[#91A7C0]/70 focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {(['vessels', 'organs', 'nerves', 'skeleton', 'muscles', 'all'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setBpFilterSys(s)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                    bpFilterSys === s
                      ? 'bg-[#00D9FF] text-[#071426]'
                      : 'bg-[#10243D] text-[#91A7C0] hover:text-[#F3F8FF]'
                  }`}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {bpLoading && (
              <div className="flex items-center justify-center py-8 text-xs text-[#8BEAFF] gap-2">
                <Loader2 size={14} className="animate-spin text-[#00D9FF]" />
                <span>Loading BodyParts3D 4.3...</span>
              </div>
            )}
            {bpError && !bpLoading && (
              <div className="text-[11px] text-amber-300 p-2 bg-amber-950/30 rounded-lg border border-amber-500/30">
                {bpError}
              </div>
            )}
            {!bpLoading && !bpError && bpData && (
              <>
                <div className="text-[10px] text-[#91A7C0] px-1 pb-1">
                  Showing {bpData.items.length} of {bpData.filteredCount} verified meshes
                </div>
                {bpData.items.map((asset) => {
                  const isSel = activeBodyPartsFjId === asset.fjId;
                  return (
                    <button
                      key={asset.fjId}
                      type="button"
                      onClick={() => onSelectBodyPartsAsset(asset)}
                      className={`w-full rounded-lg p-2 text-start border transition cursor-pointer ${
                        isSel
                          ? 'bg-[#00D9FF]/15 border-[#00D9FF] text-[#F3F8FF]'
                          : 'bg-[#071426]/65 border-[#258BFF]/20 hover:border-[#00D9FF]/55 text-[#F3F8FF]'
                      }`}
                    >
                      <div className="text-[11px] font-semibold truncate">{asset.name}</div>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-[#8BEAFF]/80 mt-0.5">
                        <span>{asset.fjId}</span>
                        <span aria-hidden="true">·</span>
                        <span>{asset.fmaId}</span>
                        <span aria-hidden="true">·</span>
                        <span>{Math.round(asset.size / 1024)} KB</span>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
