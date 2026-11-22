import React, { useMemo, useState } from 'react';
import {
  Compass,
  GitFork,
  HeartPulse,
  Scissors,
  GraduationCap,
  Eye,
  EyeOff,
  ShieldAlert,
  Play,
  ExternalLink,
  Youtube,
  Globe,
  CheckCircle2,
  XCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { SupportedLanguage } from '../../types';
import type { UnifiedAnatomicalStructure } from '../../lib/surgicalAtlasCatalog';
import { ANATOMICAL_HIERARCHY } from '../../lib/anatomicalHierarchy';
import {
  getProceduresByStructure,
  getDangerZonesByStructure,
} from '../../lib/surgicalProceduresRegistry';
import { getRelatedVideosForStructure } from '../../lib/visualLibraryBridge';
import { getStructureVideoResults, getAllVideoSearchTargets } from '../../lib/atlasVideoIntegration';
import {
  getAtlasCopy,
  type KnowledgeDomainId,
} from '../../lib/atlas/atlasI18n';
import {
  getKnowledgeProfile,
  pickText,
  resolveRelatedHighlightId,
} from '../../lib/atlas/atlasKnowledgeRegistry';
import { ATLAS_QUIZ_BANK } from '../../lib/atlas/atlasQuizData';
import type { BodyPartsMeshAsset } from '../../lib/atlas/bodypartsClient';
import type { LoadedOrganComponent, OrganDimensions } from './OrganFocusViewer';

export interface KnowledgeDomainPanelsProps {
  language: SupportedLanguage;
  activeDomain: KnowledgeDomainId;
  selectedStructure: UnifiedAnatomicalStructure;
  directBodyPartsAsset?: BodyPartsMeshAsset | null;
  loadedComponents: LoadedOrganComponent[];
  organDimensions: OrganDimensions | null;
  isolatedSubPartId: string | null;
  hiddenSubPartIds: Set<string>;
  deepMode: boolean;
  sectionRatio: number;
  dissectionLayerIndex: number;
  onToggleDeepMode: () => void;
  onChangeSectionRatio: (val: number) => void;
  onChangeDissectionLayer: (idx: number) => void;
  onToggleIsolateSubPart: (subId: string | null) => void;
  onToggleHideSubPart: (subId: string) => void;
  onHighlightStructureIn3D: (targetId: string) => void;
  onSelectStructureIn3D: (targetId: string) => void;
  onNavigateToVideo?: (queryOrVideoId: string) => void;
}

export const KnowledgeDomainPanels: React.FC<KnowledgeDomainPanelsProps> = ({
  language,
  activeDomain,
  selectedStructure,
  directBodyPartsAsset = null,
  loadedComponents,
  organDimensions,
  isolatedSubPartId,
  hiddenSubPartIds,
  deepMode,
  sectionRatio,
  dissectionLayerIndex,
  onToggleDeepMode,
  onChangeSectionRatio,
  onChangeDissectionLayer,
  onToggleIsolateSubPart,
  onToggleHideSubPart,
  onHighlightStructureIn3D,
  onSelectStructureIn3D,
  onNavigateToVideo,
}) => {
  const t = getAtlasCopy(language);
  const profile = useMemo(() => getKnowledgeProfile(selectedStructure), [selectedStructure]);

  const procedures = useMemo(
    () => getProceduresByStructure(selectedStructure.id),
    [selectedStructure.id],
  );
  const dangerZones = useMemo(
    () => getDangerZonesByStructure(selectedStructure.id),
    [selectedStructure.id],
  );
  const relatedVideos = useMemo(
    () => getRelatedVideosForStructure(selectedStructure.id),
    [selectedStructure.id],
  );
  const externalVideoData = useMemo(
    () => getStructureVideoResults(selectedStructure.id),
    [selectedStructure.id],
  );
  const fallbackTargets = useMemo(
    () => getAllVideoSearchTargets(selectedStructure.label),
    [selectedStructure.label],
  );
  const hierarchyLinks = useMemo(() => {
    const fma = directBodyPartsAsset?.fmaId || selectedStructure.fmaId;
    if (!fma) return [];
    return ANATOMICAL_HIERARCHY.filter(
      (r) => r.parentId === fma || r.childId === fma,
    ).slice(0, 12);
  }, [selectedStructure.fmaId, directBodyPartsAsset]);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  const prioritizedQuiz = useMemo(() => {
    const matching = ATLAS_QUIZ_BANK.filter((q) => q.targetStructureId === selectedStructure.id);
    const others = ATLAS_QUIZ_BANK.filter((q) => q.targetStructureId !== selectedStructure.id);
    return [...matching, ...others];
  }, [selectedStructure.id]);

  const currentQuestion = prioritizedQuiz[quizIdx % prioritizedQuiz.length];

  const handleAnswerQuiz = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    if (!answeredIds.has(currentQuestion.id)) {
      const nextSet = new Set(answeredIds);
      nextSet.add(currentQuestion.id);
      setAnsweredIds(nextSet);
      if (optIdx === currentQuestion.correctIndex) {
        setQuizScore((s) => s + 1);
      }
    }
  };

  return (
    <div className="bg-[#0B1B31] border border-[#258BFF]/25 rounded-2xl p-3.5 text-[#F3F8FF] space-y-3 overflow-y-auto max-h-[430px]">
      {/* Domain Title Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#258BFF]/20">
        <div>
          <h4 className="text-xs font-bold text-[#00D9FF] uppercase tracking-wider">
            {t.domains[activeDomain].label}
          </h4>
          <p className="text-[11px] text-[#91A7C0] mt-0.5">
            {t.domains[activeDomain].description}
          </p>
        </div>
        <span className="text-[10px] font-mono text-[#8BEAFF] bg-[#10243D] border border-[#258BFF]/30 px-2 py-0.5 rounded">
          {directBodyPartsAsset?.fmaId || selectedStructure.fmaId || selectedStructure.system}
        </span>
      </div>

      {/* 1. ANATOMY EXPLORER */}
      {activeDomain === 'explorer' && (
        <div className="space-y-3">
          <p className="text-xs text-[#F3F8FF]/90 leading-relaxed">
            {pickText(profile.summary, language)}
          </p>

          {loadedComponents.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#8BEAFF] flex items-center gap-1.5">
                <Compass size={13} className="text-[#00D9FF]" />
                <span>3D Sub-Components ({loadedComponents.length})</span>
              </div>
              <div className="space-y-1">
                {loadedComponents.map((comp) => {
                  const isIso = isolatedSubPartId === comp.id;
                  const isHid = hiddenSubPartIds.has(comp.id);
                  return (
                    <div
                      key={comp.id}
                      className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-[#071426]/80 border border-[#258BFF]/25"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold truncate">{comp.name}</div>
                        <div className="text-[9px] font-mono text-[#91A7C0]">
                          {comp.fjId || comp.id} {comp.fmaId ? `· ${comp.fmaId}` : ''} · {comp.meshCount} meshes
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onToggleIsolateSubPart(isIso ? null : comp.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer border ${
                            isIso
                              ? 'bg-[#00D9FF] text-[#071426] border-[#00D9FF]'
                              : 'bg-[#10243D] text-[#8BEAFF] border-[#258BFF]/30'
                          }`}
                        >
                          {t.isolate}
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleHideSubPart(comp.id)}
                          className="p-1 rounded bg-[#10243D] text-[#8BEAFF] border border-[#258BFF]/30 cursor-pointer"
                        >
                          {isHid ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {profile.subStructures.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#8BEAFF]">Regional Divisions</div>
              {profile.subStructures.map((sub, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#10243D]/60 border border-[#258BFF]/20">
                  <div className="text-xs font-bold text-[#F3F8FF]">{pickText(sub.name, language)}</div>
                  <div className="text-[11px] text-[#91A7C0] mt-0.5">{pickText(sub.role, language)}</div>
                </div>
              ))}
            </div>
          )}

          {hierarchyLinks.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#8BEAFF]">BodyParts3D Hierarchy (FMA)</div>
              <div className="space-y-1">
                {hierarchyLinks.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-[#071426]/65 border border-[#258BFF]/15"
                  >
                    <span className="truncate text-[#F3F8FF]">
                      {h.parentName} <span className="text-[#00D9FF]">→</span> {h.childName}
                    </span>
                    <span className="text-[9px] font-mono text-[#8BEAFF] shrink-0">{h.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. ANATOMICAL RELATIONS EXPLORER */}
      {activeDomain === 'relations' && (
        <div className="space-y-2">
          {profile.relations.length > 0 ? (
            profile.relations.map((rel, i) => {
              const targetExists = Boolean(resolveRelatedHighlightId(rel.targetId));
              return (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-[#071426]/80 border border-[#258BFF]/25 flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <GitFork size={13} className="text-[#00D9FF] shrink-0" />
                      <span className="text-xs font-bold truncate">{pickText(rel.targetName, language)}</span>
                      <span className="text-[10px] font-mono text-amber-300 uppercase">
                        {rel.relationType}
                      </span>
                    </div>
                    {targetExists && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => onHighlightStructureIn3D(rel.targetId)}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/50 hover:bg-amber-500/30 cursor-pointer"
                        >
                          Highlight 3D
                        </button>
                        <button
                          type="button"
                          onClick={() => onSelectStructureIn3D(rel.targetId)}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10243D] text-[#8BEAFF] border border-[#258BFF]/35 hover:border-[#00D9FF] cursor-pointer"
                        >
                          Focus
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[#91A7C0] leading-relaxed">
                    {pickText(rel.description, language)}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-[#91A7C0] py-2">
              {pickText(profile.summary, language)} — check adjacent systems using Layer Visibility or BodyParts3D hierarchy.
            </div>
          )}
        </div>
      )}

      {/* 3. VASCULAR & NERVE SUPPLY */}
      {activeDomain === 'vascular_nerve' && (
        <div className="space-y-2">
          {profile.vascularAndNerve.length > 0 ? (
            profile.vascularAndNerve.map((vn, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#071426]/80 border border-[#258BFF]/25 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <HeartPulse
                      size={13}
                      className={
                        vn.kind === 'arterial'
                          ? 'text-rose-400'
                          : vn.kind === 'venous'
                          ? 'text-sky-400'
                          : 'text-amber-300'
                      }
                    />
                    <span className="text-xs font-bold truncate">{pickText(vn.name, language)}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px] font-mono uppercase text-[#8BEAFF]">{vn.kind}</span>
                    {vn.highlightId && (
                      <button
                        type="button"
                        onClick={() => onHighlightStructureIn3D(vn.highlightId!)}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#10243D] text-[#00D9FF] border border-[#00D9FF]/40 cursor-pointer"
                      >
                        Show 3D
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-[#91A7C0] leading-relaxed">
                  {pickText(vn.note, language)}
                </p>
              </div>
            ))
          ) : (
            <div className="text-xs text-[#91A7C0]">
              Vascular & neurovascular mapping available for priority vessels, heart, liver, brain, and regional trunks.
            </div>
          )}
        </div>
      )}

      {/* 4. SURGICAL ANATOMY & DANGER ZONES */}
      {activeDomain === 'surgical_anatomy' && (
        <div className="space-y-3">
          {profile.surgicalApproaches.map((ap, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#071426]/80 border border-[#00D9FF]/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#00D9FF]">
                <Scissors size={13} />
                <span>{pickText(ap.approachName, language)}</span>
              </div>
              <div className="text-[11px] text-[#F3F8FF]/90">
                <strong className="text-[#8BEAFF]">Landmarks:</strong> {pickText(ap.landmarks, language)}
              </div>
              <div className="text-[11px] text-[#91A7C0]">
                <strong className="text-[#8BEAFF]">Tissue Planes:</strong> {pickText(ap.planes, language)}
              </div>
              <div className="text-[11px] text-amber-200 bg-amber-950/30 border border-amber-500/30 rounded-lg p-2">
                <strong>Structures at Risk:</strong> {pickText(ap.structuresAtRisk, language)}
              </div>
            </div>
          ))}

          {dangerZones.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                <ShieldAlert size={13} />
                <span>Surgical Danger Zones ({dangerZones.length})</span>
              </div>
              {dangerZones.map((dz) => (
                <div key={dz.id} className="p-2.5 rounded-xl bg-rose-950/25 border border-rose-500/35 space-y-1">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-rose-200">
                    <span>{dz.names[language] || dz.names.en}</span>
                    {dz.clinicallyReviewed && (
                      <span className="text-[10px] font-mono uppercase text-emerald-300">Verified</span>
                    )}
                  </div>
                  <p className="text-[11px] text-rose-100/85 leading-relaxed">
                    {dz.description[language] || dz.description.en}
                  </p>
                  <p className="text-[10px] text-amber-200/90 leading-relaxed">
                    {dz.clinicalSignificance[language] || dz.clinicalSignificance.en}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. CLINICAL INFORMATION */}
      {activeDomain === 'clinical_info' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-[#071426]/70 border border-[#258BFF]/20">
              <div className="text-[#91A7C0] text-[10px]">Region</div>
              <div className="font-semibold text-[#F3F8FF]">{pickText(profile.regionLabel, language)}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#071426]/70 border border-[#258BFF]/20">
              <div className="text-[#91A7C0] text-[10px]">FMA / Source ID</div>
              <div className="font-mono text-[#8BEAFF]">
                {directBodyPartsAsset?.fjId || selectedStructure.fmaId || selectedStructure.id}
              </div>
            </div>
            {selectedStructure.kanji && (
              <div className="p-2 rounded-lg bg-[#071426]/70 border border-[#258BFF]/20 col-span-2">
                <div className="text-[#91A7C0] text-[10px]">BodyParts3D (漢字 / かな)</div>
                <div className="font-semibold text-[#F3F8FF]">
                  {selectedStructure.kanji} {selectedStructure.kana ? `(${selectedStructure.kana})` : ''}
                </div>
              </div>
            )}
          </div>

          {profile.clinicalCorrelations.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#8BEAFF]">Clinical Correlations</div>
              {profile.clinicalCorrelations.map((c, i) => (
                <div key={i} className="p-2 rounded-lg bg-[#10243D]/60 border border-[#258BFF]/20 text-[11px] text-[#F3F8FF]/90 leading-relaxed">
                  {pickText(c, language)}
                </div>
              ))}
            </div>
          )}

          {profile.anatomicalVariations.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-amber-300">Anatomical Variations</div>
              {profile.anatomicalVariations.map((v, i) => (
                <div key={i} className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/25 text-[11px] text-amber-100/90 leading-relaxed">
                  {pickText(v, language)}
                </div>
              ))}
            </div>
          )}

          <div className="text-[10px] text-[#91A7C0] pt-1 border-t border-[#258BFF]/20">
            {t.attribution}
          </div>
        </div>
      )}

      {/* 6. MEDICAL LIBRARY INTEGRATION (Direct Bridge — No Duplicate Library) */}
      {activeDomain === 'medical_library' && (
        <div className="space-y-3">
          {relatedVideos.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#8BEAFF]">Verified SurgiTrack Operative Videos</div>
              {relatedVideos.slice(0, 4).map((v) => (
                <button
                  key={v.videoId}
                  type="button"
                  onClick={() => onNavigateToVideo?.(v.title)}
                  className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#071426]/80 border border-[#258BFF]/30 hover:border-[#00D9FF] text-start transition cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#F3F8FF] truncate">{v.title}</div>
                    <div className="text-[10px] text-[#91A7C0]">
                      {v.author} {v.duration ? `· ${v.duration}` : ''}
                    </div>
                  </div>
                  <Play size={14} className="text-[#00D9FF] shrink-0" />
                </button>
              ))}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#8BEAFF]">Surgical Channels & External Libraries</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {(externalVideoData?.youtubeSearchLinks || fallbackTargets.youtubeChannels)
                .slice(0, 4)
                .map(({ channel, url }) => (
                  <a
                    key={channel.handle}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg bg-[#10243D]/70 border border-[#258BFF]/25 hover:border-[#00D9FF] text-[11px] text-[#F3F8FF]"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Youtube size={12} className="text-rose-400 shrink-0" />
                      <span className="truncate">{channel.name}</span>
                    </span>
                    <ExternalLink size={11} className="text-[#8BEAFF] shrink-0" />
                  </a>
                ))}
              {(externalVideoData?.externalSearchLinks || fallbackTargets.externalPlatforms).map(
                ({ platform, url }) => (
                  <a
                    key={platform.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg bg-[#10243D]/70 border border-[#258BFF]/25 hover:border-[#00D9FF] text-[11px] text-[#F3F8FF]"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Globe size={12} className="text-[#00D9FF] shrink-0" />
                      <span className="truncate">{platform.name}</span>
                    </span>
                    <ExternalLink size={11} className="text-[#8BEAFF] shrink-0" />
                  </a>
                ),
              )}
            </div>
          </div>

          {onNavigateToVideo && (
            <button
              type="button"
              onClick={() => onNavigateToVideo(selectedStructure.label)}
              className="w-full py-2 px-3 rounded-xl bg-[#258BFF] hover:bg-[#00D9FF] hover:text-[#071426] text-white text-xs font-bold transition cursor-pointer"
            >
              {t.openInLibrary} →
            </button>
          )}
        </div>
      )}

      {/* 7. 3D MODEL LAB (Dissection Layers, Section Clipping, Deep Mode & Geometric Measurements) */}
      {activeDomain === 'model_lab' && (
        <div className="space-y-3">
          {/* Deep Anatomy Mode */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#071426]/80 border border-[#00D9FF]/30">
            <div>
              <div className="text-xs font-bold text-[#F3F8FF] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#00D9FF]" />
                <span>{t.deepAnatomy}</span>
              </div>
              <div className="text-[10px] text-[#91A7C0] mt-0.5">{t.meshLimitsNotice}</div>
            </div>
            <button
              type="button"
              onClick={onToggleDeepMode}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                deepMode
                  ? 'bg-[#00D9FF] text-[#071426] border-[#00D9FF]'
                  : 'bg-[#10243D] text-[#8BEAFF] border-[#258BFF]/40'
              }`}
            >
              {deepMode ? 'Active' : 'Enable'}
            </button>
          </div>

          {/* Surgical Dissection Layer Exploration */}
          <div className="p-2.5 rounded-xl bg-[#071426]/80 border border-[#258BFF]/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8BEAFF] flex items-center gap-1.5">
                <Layers size={13} className="text-[#00D9FF]" />
                <span>{t.dissectionTitle}</span>
              </span>
              <span className="text-[10px] font-mono text-[#00D9FF]">
                {dissectionLayerIndex}/{t.dissectionLayers.length}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={t.dissectionLayers.length - 1}
              step={1}
              value={dissectionLayerIndex}
              onChange={(e) => onChangeDissectionLayer(Number(e.target.value))}
              className="w-full accent-[#00D9FF] cursor-pointer"
            />
            <div className="grid grid-cols-2 gap-1">
              {t.dissectionLayers.map((layer, idx) => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => onChangeDissectionLayer(idx)}
                  className={`px-2 py-1 rounded text-[10px] text-start transition cursor-pointer truncate border ${
                    idx >= dissectionLayerIndex
                      ? 'bg-[#10243D] border-[#00D9FF]/40 text-[#F3F8FF]'
                      : 'bg-[#071426]/40 border-slate-800 text-slate-500 line-through'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cross-Section Clipping Plane */}
          <div className="p-2.5 rounded-xl bg-[#071426]/80 border border-[#258BFF]/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8BEAFF]">{t.sectionPlane}</span>
              {sectionRatio > 0.01 && (
                <button
                  type="button"
                  onClick={() => onChangeSectionRatio(0)}
                  className="text-[10px] text-[#00D9FF] hover:underline cursor-pointer"
                >
                  {t.sectionReset}
                </button>
              )}
            </div>
            <input
              type="range"
              min={0}
              max={0.9}
              step={0.05}
              value={sectionRatio}
              onChange={(e) => onChangeSectionRatio(Number(e.target.value))}
              className="w-full accent-[#00D9FF] cursor-pointer"
            />
          </div>

          {/* Valid Geometric Measurements */}
          {organDimensions && (
            <div className="p-2.5 rounded-xl bg-[#10243D]/70 border border-[#258BFF]/30">
              <div className="text-[10px] text-[#91A7C0]">{t.dimensionsLabel} ({organDimensions.sourceLabel})</div>
              <div className="text-xs font-mono font-bold text-[#8BEAFF] mt-1 tabular-nums">
                W: {organDimensions.widthMm} mm · H: {organDimensions.heightMm} mm · D: {organDimensions.depthMm} mm
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. LEARNING & QUIZ */}
      {activeDomain === 'learning_quiz' && currentQuestion && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#8BEAFF] flex items-center gap-1.5">
              <GraduationCap size={14} className="text-[#00D9FF]" />
              <span>Question {(quizIdx % prioritizedQuiz.length) + 1}/{prioritizedQuiz.length}</span>
            </span>
            <span className="font-mono font-bold text-[#00D9FF] tabular-nums">
              {t.quizScore}: {quizScore}
            </span>
          </div>

          <p className="text-xs font-semibold text-[#F3F8FF] leading-relaxed bg-[#071426]/80 p-2.5 rounded-xl border border-[#258BFF]/25">
            {pickText(currentQuestion.question, language)}
          </p>

          <div className="space-y-1.5">
            {currentQuestion.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              const isRight = idx === currentQuestion.correctIndex;
              const showFeedback = selectedOption !== null;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAnswerQuiz(idx)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs text-start border transition cursor-pointer ${
                    showFeedback
                      ? isRight
                        ? 'bg-emerald-950/50 border-emerald-400 text-emerald-100'
                        : isChosen
                        ? 'bg-rose-950/50 border-rose-400 text-rose-100'
                        : 'bg-[#071426]/60 border-[#258BFF]/15 text-[#91A7C0]'
                      : 'bg-[#10243D]/70 border-[#258BFF]/30 hover:border-[#00D9FF] text-[#F3F8FF]'
                  }`}
                >
                  <span>{pickText(opt, language)}</span>
                  {showFeedback && isRight && <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />}
                  {showFeedback && isChosen && !isRight && <XCircle size={14} className="text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="p-2.5 rounded-xl bg-[#071426]/90 border border-[#00D9FF]/35 space-y-2">
              <div className="text-[11px] font-bold text-[#00D9FF]">
                {selectedOption === currentQuestion.correctIndex ? t.quizCorrect : t.quizIncorrect}
              </div>
              <p className="text-[11px] text-[#F3F8FF]/90 leading-relaxed">
                {pickText(currentQuestion.explanation, language)}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onSelectStructureIn3D(currentQuestion.targetStructureId)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#10243D] border border-[#00D9FF]/40 text-[#8BEAFF] cursor-pointer"
                >
                  {t.quizHighlight3D}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOption(null);
                    setQuizIdx((i) => i + 1);
                  }}
                  className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#258BFF] text-white cursor-pointer"
                >
                  {t.quizNext} →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. RELATED SURGICAL PROCEDURES */}
      {activeDomain === 'procedures' && (
        <div className="space-y-2">
          {procedures.length > 0 ? (
            procedures.map((proc) => (
              <div key={proc.id} className="p-2.5 rounded-xl bg-[#071426]/80 border border-[#258BFF]/25 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#F3F8FF]">
                    {proc.names[language] || proc.names.en}
                  </span>
                  <span className="text-[10px] font-mono text-[#8BEAFF]">{proc.specialty}</span>
                </div>
                <p className="text-[11px] text-[#91A7C0] leading-relaxed">
                  {proc.description[language] || proc.description.en}
                </p>
                {onNavigateToVideo && (
                  <button
                    type="button"
                    onClick={() => onNavigateToVideo(proc.names.en)}
                    className="text-[11px] font-semibold text-[#00D9FF] hover:underline cursor-pointer pt-1"
                  >
                    Watch Operative Videos →
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-xs text-[#91A7C0]">
              Select a vascular trunk, heart, liver, thyroid, carotid, or visceral organ to view mapped surgical procedures.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
