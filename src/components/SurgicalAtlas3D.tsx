// ============================================================================
// SurgicalAtlas3D.tsx — Real-GLB Interactive 3D Surgical Anatomy Atlas
// ----------------------------------------------------------------------------
// Powered by pure Three.js (GLTFLoader + MeshoptDecoder + RoomEnvironment +
// OrbitControls) loading real open-anatomy-3d GLB models:
//   - /models/anatomy-male.glb (140 structures)
//   - /models/anatomy-female.glb (145 structures)
// Integrates:
//   - 147 unified anatomical structures (EN + Japanese Kanji/Kana + FMA ID)
//   - BodyParts3D hierarchy (is-a / part-of relations)
//   - 7 verified surgical procedures + 10 clinical danger zones
//   - Live verified videos (visualLibraryBridge) + 10 surgical YT channels
// ============================================================================

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import {
  Search,
  Layers,
  Bone,
  Heart,
  Brain,
  Activity,
  Stethoscope,
  Eye,
  EyeOff,
  RotateCcw,
  User,
  Users,
  Play,
  Youtube,
  Info,
  X,
  Loader,
  ShieldAlert,
  Globe,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
import {
  UNIFIED_ANATOMICAL_CATALOG,
  SYSTEM_LABELS,
  SYSTEM_ORDER,
  CATEGORY_COLORS,
  getStructureById,
  searchStructures,
  type AnatomySystem,
} from '../lib/surgicalAtlasCatalog';
import { ANATOMICAL_HIERARCHY } from '../lib/anatomicalHierarchy';
import {
  DANGER_ZONES,
  getProceduresByStructure,
  getDangerZonesByStructure,
} from '../lib/surgicalProceduresRegistry';
import { getRelatedVideosForStructure } from '../lib/visualLibraryBridge';
import { getStructureVideoResults } from '../lib/atlasVideoIntegration';

const I18N = {
  en: {
    title: 'Surgical Atlas 3D',
    subtitle: 'Interactive 3D human anatomy for surgical training & danger zone mapping',
    search: 'Search 147 structures (English / 日本語 / FMA ID)...',
    layers: 'Anatomical Systems',
    male: 'Male',
    female: 'Female',
    resetView: 'Reset View',
    isolate: 'Isolate',
    showAll: 'Show All',
    hideAll: 'Hide All',
    opacity: 'Opacity',
    noResults: 'No structures found',
    procedures: 'Surgical Procedures',
    dangerZones: 'Danger Zones',
    relatedVideos: 'Verified Surgical Videos',
    channelSearch: 'Search Surgical Channels & Platforms',
    openInLibrary: 'Open in Surgical Library',
    loading: 'Loading 3D anatomical model...',
    loadError: 'Unable to load 3D model',
    webglError: '3D WebGL viewport unavailable in this browser — use Search & Panels to inspect all 147 structures.',
    selectStructure: 'Click any 3D structure or search above to inspect anatomy, danger zones & operative videos',
    front: 'Front',
    back: 'Back',
    left: 'Left',
    right: 'Right',
    superior: 'Superior',
    inferior: 'Inferior',
    system: 'System',
    category: 'Category',
    fmaId: 'FMA ID',
    japanese: 'Japanese (漢字 / かな)',
    hierarchy: 'Anatomical Hierarchy (BodyParts3D)',
    anatomical: 'Anatomical',
    clinical: 'Clinical',
    surgical: 'Surgical',
    layersExplore: 'Layer Visibility',
    disclaimer: 'Educational reference only — always follow supervising attending and institutional protocols.',
    attribution: 'Anatomy: BodyParts3D © DBCLS (CC BY 4.0); Female organs: HuBMAP HRA (CC BY 4.0); Female body: MakeHuman (CC0). Modified by open-anatomy-3d (CC BY 4.0).',
    stats: 'structures',
    sources: '5 anatomical datasets integrated',
  },
  ar: {
    title: 'الأطلس الجراحي ثلاثي الأبعاد',
    subtitle: 'تشريح بشري تفاعلي حقيقي للتدريب الجراحي واستكشاف مناطق الخطر',
    search: 'ابحث في 147 بنية تشريحية (إنجليزي / ياباني / FMA)...',
    layers: 'الأنظمة التشريحية',
    male: 'ذكر',
    female: 'أنثى',
    resetView: 'إعادة الضبط',
    isolate: 'عزل البنية',
    showAll: 'إظهار الكل',
    hideAll: 'إخفاء الكل',
    opacity: 'الشفافية',
    noResults: 'لا توجد نتائج مطابقة',
    procedures: 'الإجراءات الجراحية',
    dangerZones: 'مناطق الخطر الجراحية',
    relatedVideos: 'فيديوهات جراحية موثقة',
    channelSearch: 'بحث في القنوات والمنصات الجراحية',
    openInLibrary: 'فتح في المكتبة المرئية',
    loading: 'جارٍ تحميل النموذج التشريحي ثلاثي الأبعاد...',
    loadError: 'تعذر تحميل النموذج ثلاثي الأبعاد',
    webglError: 'تعذر تشغيل WebGL في هذا المتصفح — يمكنك البحث وتصفح جميع البنى التشريحية (147 بنية).',
    selectStructure: 'انقر على أي بنية ثلاثية الأبعاد أو ابحث أعلاه لاستعراض التشريح ومناطق الخطر والفيديوهات',
    front: 'أمامي',
    back: 'خلفي',
    left: 'أيسر',
    right: 'أيمن',
    superior: 'علوي',
    inferior: 'سفلي',
    system: 'النظام',
    category: 'الفئة',
    fmaId: 'معرّف FMA',
    japanese: 'الاسم الياباني (漢字 / かな)',
    hierarchy: 'التسلسل التشريحي (BodyParts3D)',
    anatomical: 'تشريحي',
    clinical: 'سريري',
    surgical: 'جراحي',
    layersExplore: 'التحكم بالطبقات',
    disclaimer: 'مرجع تعليمي فقط — اتبع دائماً إرشادات الجراح المشرف وبروتوكولات المستشفى.',
    attribution: 'التشريح: BodyParts3D © DBCLS (CC BY 4.0)؛ الأعضاء الأنثوية: HuBMAP HRA (CC BY 4.0)؛ الجسم الأنثوي: MakeHuman (CC0) عبر open-anatomy-3d.',
    stats: 'بنية تشريحية',
    sources: '5 مصادر تشريحية مدمجة',
  },
  de: {
    title: '3D-Chirurgischer Anatomie-Atlas',
    subtitle: 'Interaktive 3D-Anatomie für chirurgisches Training & Gefahrenzonen',
    search: '147 Strukturen durchsuchen (Englisch / Japanisch / FMA)...',
    layers: 'Anatomische Systeme',
    male: 'Männlich',
    female: 'Weiblich',
    resetView: 'Zurücksetzen',
    isolate: 'Isolieren',
    showAll: 'Alle zeigen',
    hideAll: 'Alle ausblenden',
    opacity: 'Transparenz',
    noResults: 'Keine Strukturen gefunden',
    procedures: 'Chirurgische Eingriffe',
    dangerZones: 'Gefahrenzonen',
    relatedVideos: 'Verifizierte OP-Videos',
    channelSearch: 'Suche in OP-Kanälen & Plattformen',
    openInLibrary: 'In Mediathek öffnen',
    loading: '3D-Anatomiemodell wird geladen...',
    loadError: '3D-Modell konnte nicht geladen werden',
    webglError: 'WebGL nicht verfügbar — nutzen Sie die Suche zur Inspektion aller 147 Strukturen.',
    selectStructure: 'Struktur im 3D-Modell anklicken oder suchen für Anatomie, Gefahrenzonen & OP-Videos',
    front: 'Vorne',
    back: 'Hinten',
    left: 'Links',
    right: 'Rechts',
    superior: 'Kranial',
    inferior: 'Kaudal',
    system: 'System',
    category: 'Kategorie',
    fmaId: 'FMA-ID',
    japanese: 'Japanisch (漢字 / かな)',
    hierarchy: 'Anatomische Hierarchie (BodyParts3D)',
    anatomical: 'Anatomisch',
    clinical: 'Klinisch',
    surgical: 'Chirurgisch',
    layersExplore: 'Schichtsteuerung',
    disclaimer: 'Nur zu Ausbildungszwecken — klinische Entscheidungen obliegen dem verantwortlichen Facharzt.',
    attribution: 'Anatomie: BodyParts3D © DBCLS (CC BY 4.0); Weibliche Organe: HuBMAP HRA (CC BY 4.0); MakeHuman (CC0), modifiziert durch open-anatomy-3d.',
    stats: 'Strukturen',
    sources: '5 anatomische Quellen integriert',
  },
} as const;

const SYSTEM_ICONS: Record<AnatomySystem, React.ElementType> = {
  skin: Layers,
  skeleton: Bone,
  joints: Activity,
  muscles: Activity,
  organs: Stethoscope,
  vessels: Heart,
  nerves: Brain,
};

const SYSTEM_MATERIAL_PROPS: Record<AnatomySystem, { color: string; roughness: number; opacity: number }> = {
  skin: { color: '#e6bfa3', roughness: 0.68, opacity: 0.16 },
  skeleton: { color: '#e5e7eb', roughness: 0.62, opacity: 1 },
  joints: { color: '#ff9a3c', roughness: 0.4, opacity: 0.72 },
  muscles: { color: '#b91c1c', roughness: 0.55, opacity: 0.88 },
  organs: { color: '#d97757', roughness: 0.36, opacity: 1 },
  vessels: { color: '#dc2626', roughness: 0.3, opacity: 1 },
  nerves: { color: '#facc15', roughness: 0.35, opacity: 1 },
};

const PICK_PRIORITY: Record<AnatomySystem, number> = {
  joints: 5,
  organs: 4,
  vessels: 3,
  nerves: 3,
  skeleton: 2,
  muscles: 1,
  skin: -1,
};

const CAMERA_PRESETS: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  front: { pos: [0, 0.92, 3.2], target: [0, 0.92, 0] },
  back: { pos: [0, 0.92, -3.2], target: [0, 0.92, 0] },
  left: { pos: [-3.2, 0.92, 0], target: [0, 0.92, 0] },
  right: { pos: [3.2, 0.92, 0], target: [0, 0.92, 0] },
  superior: { pos: [0, 3.85, 0.45], target: [0, 0.92, 0] },
  inferior: { pos: [0, -0.85, 2.75], target: [0, 0.92, 0] },
};

const CATALOG_BY_ID = new Map(UNIFIED_ANATOMICAL_CATALOG.map((s) => [s.id, s]));

interface AnatomyPartRuntime {
  key: string;
  system: AnatomySystem;
  baseColor: THREE.Color;
  baseRoughness: number;
  baseOpacity: number;
  meshes: THREE.Mesh[];
  materials: THREE.MeshStandardMaterial[];
  center: THREE.Vector3;
}

export interface SurgicalAtlas3DProps {
  language: SupportedLanguage;
  existingVideos?: any[];
  onNavigateToVideo?: (queryOrVideoId: string) => void;
  onStructureClick?: (structure: string, relatedProcedure: string) => void;
}

export const SurgicalAtlas3D: React.FC<SurgicalAtlas3DProps> = ({
  language,
  existingVideos = [],
  onNavigateToVideo,
  onStructureClick,
}) => {
  const t = I18N[language] || I18N.en;
  const isRtl = language === 'ar';

  const mountRef = useRef<HTMLDivElement | null>(null);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [layers, setLayers] = useState<Record<AnatomySystem, boolean>>({
    skin: true,
    skeleton: true,
    joints: true,
    muscles: false,
    organs: true,
    vessels: true,
    nerves: true,
  });
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [isolated, setIsolated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'anatomical' | 'clinical' | 'surgical'>('anatomical');
  const [cameraView, setCameraView] = useState('front');
  const [opacityOverrides, setOpacityOverrides] = useState<Record<string, number>>({});
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isModelLoading, setIsModelLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  // Refs for seamless Three.js state updates without recreating the WebGL canvas
  const layersRef = useRef(layers);
  const selectedKeyRef = useRef(selectedKey);
  const hoveredKeyRef = useRef(hoveredKey);
  const isolatedRef = useRef(isolated);
  const modeRef = useRef(mode);
  const opacityOverridesRef = useRef(opacityOverrides);

  const requestRenderRef = useRef<() => void>(() => {});
  const cameraGoalRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const partsRef = useRef<Map<string, AnatomyPartRuntime>>(new Map());
  const systemGroupsRef = useRef<Map<AnatomySystem, THREE.Object3D>>(new Map());
  const modelRootRef = useRef<THREE.Object3D | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    layersRef.current = layers;
    requestRenderRef.current();
  }, [layers]);

  useEffect(() => {
    selectedKeyRef.current = selectedKey;
    requestRenderRef.current();
  }, [selectedKey]);

  useEffect(() => {
    hoveredKeyRef.current = hoveredKey;
    requestRenderRef.current();
  }, [hoveredKey]);

  useEffect(() => {
    isolatedRef.current = isolated;
    requestRenderRef.current();
  }, [isolated]);

  useEffect(() => {
    modeRef.current = mode;
    requestRenderRef.current();
  }, [mode]);

  useEffect(() => {
    opacityOverridesRef.current = opacityOverrides;
    requestRenderRef.current();
  }, [opacityOverrides]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return [
      ...searchStructures(searchQuery),
      ...UNIFIED_ANATOMICAL_CATALOG.filter(
        (s) => s.fmaId && s.fmaId.toLowerCase().includes(q),
      ),
    ]
      .filter((item, idx, arr) => arr.findIndex((x) => x.id === item.id) === idx)
      .slice(0, 12);
  }, [searchQuery]);

  const selectedStructure = selectedKey ? getStructureById(selectedKey) : undefined;
  const selectedProcedures = useMemo(
    () => (selectedStructure ? getProceduresByStructure(selectedStructure.id) : []),
    [selectedStructure],
  );
  const selectedDangerZones = useMemo(
    () => (selectedStructure ? getDangerZonesByStructure(selectedStructure.id) : []),
    [selectedStructure],
  );
  const relatedVideos = useMemo(
    () => (selectedStructure ? getRelatedVideosForStructure(selectedStructure.id, existingVideos) : []),
    [selectedStructure, existingVideos],
  );
  const atlasVideoTargets = useMemo(
    () => (selectedStructure ? getStructureVideoResults(selectedStructure.id) : null),
    [selectedStructure],
  );
  const hierarchyLinks = useMemo(() => {
    if (!selectedStructure?.fmaId) return [];
    return ANATOMICAL_HIERARCHY.filter(
      (h) => h.childId === selectedStructure.fmaId || h.parentId === selectedStructure.fmaId,
    ).slice(0, 6);
  }, [selectedStructure]);

  // --------------------------------------------------------------------------
  // Initialize persistent Three.js WebGL scene once
  // --------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 420);

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param) || '');
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglUnavailable(true);
      setIsModelLoading(false);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1c);
    scene.fog = new THREE.FogExp2(0x0a0f1c, 0.03);
    sceneRef.current = scene;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 60);
    camera.position.set(...CAMERA_PRESETS.front.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.front.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.55;
    controls.maxDistance = 6.5;

    // 3-point Warm/Cool Studio Rig
    const hemi = new THREE.HemisphereLight(0xbae6fd, 0x0f172a, 0.9);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.85);
    keyLight.position.set(4, 7, 5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -2.2;
      keyLight.shadow.camera.right = 2.2;
      keyLight.shadow.camera.top = 2.5;
      keyLight.shadow.camera.bottom = -2.5;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x14b8a6, 0.9);
    rimLight.position.set(-4.5, 2.5, -4);
    scene.add(rimLight);

    // Subtle grounded contact shadow beneath standing model
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 12, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0,0,0,0.65)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(1.75, 1.75);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    scene.add(shadowPlane);

    const selColor = new THREE.Color('#14b8a6');
    const hoverColor = new THREE.Color('#fbbf24');
    const clinicalColor = new THREE.Color('#8b5cf6');
    const surgicalColor = new THREE.Color('#ef4444');

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;
    let lastTime = performance.now();

    const afterDraw = (cb: () => void) => {
      try {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (!gl.fenceSync) {
          frameId = window.setTimeout(cb, 80);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 6);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 6);
      } catch {
        frameId = window.setTimeout(cb, 80);
      }
    };

    const syncPartAppearance = () => {
      const vis = layersRef.current;
      const sel = selectedKeyRef.current;
      const hov = hoveredKeyRef.current;
      const iso = isolatedRef.current;
      const currentMode = modeRef.current;
      const opOverrides = opacityOverridesRef.current;

      for (const [sys, grp] of systemGroupsRef.current) {
        grp.visible = vis[sys];
      }

      for (const part of partsRef.current.values()) {
        const sysVisible = vis[part.system];
        const hideByIsolate = Boolean(iso && sel && part.key !== sel);
        const visible = sysVisible && !hideByIsolate;

        const isSel = part.key === sel;
        const isHov = part.key === hov;
        const customOpacity = opOverrides[part.key];
        const wantOpacity =
          customOpacity !== undefined
            ? customOpacity
            : isSel || isHov
            ? part.system === 'joints'
              ? 0.85
              : 1
            : part.baseOpacity;

        for (const mesh of part.meshes) {
          mesh.visible = visible;
        }

        for (const mat of part.materials) {
          if (isSel) {
            mat.emissive.copy(selColor);
            mat.emissiveIntensity = 0.65;
          } else if (isHov) {
            mat.emissive.copy(hoverColor);
            mat.emissiveIntensity = 0.48;
          } else if (currentMode === 'surgical' && (part.system === 'vessels' || part.system === 'nerves')) {
            mat.emissive.copy(surgicalColor);
            mat.emissiveIntensity = 0.22;
          } else if (currentMode === 'clinical' && part.system === 'organs') {
            mat.emissive.copy(clinicalColor);
            mat.emissiveIntensity = 0.18;
          } else {
            mat.emissiveIntensity = 0;
          }

          if (mat.opacity !== wantOpacity) {
            mat.opacity = wantOpacity;
            mat.transparent = wantOpacity < 1;
            mat.depthWrite = wantOpacity >= 1 && part.system !== 'skin' && part.system !== 'joints';
            mat.needsUpdate = true;
          }
        }
      }
    };

    const requestRender = () => {
      if (disposed || renderBusy) {
        if (renderBusy) renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05) || 0.016;
        lastTime = now;

        syncPartAppearance();

        let needsMore = false;
        const goal = cameraGoalRef.current;
        if (goal) {
          const alpha = 1 - Math.exp(-9 * dt);
          camera.position.lerp(goal.pos, alpha);
          controls.target.lerp(goal.target, alpha);
          if (
            camera.position.distanceTo(goal.pos) < 0.015 &&
            controls.target.distanceTo(goal.target) < 0.015
          ) {
            camera.position.copy(goal.pos);
            controls.target.copy(goal.target);
            cameraGoalRef.current = null;
          } else {
            needsMore = true;
          }
        }

        const moved = controls.update();
        if (moved && controls.enableDamping) {
          needsMore = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsMore) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    };

    requestRenderRef.current = requestRender;

    const onControlStart = () => {
      cameraGoalRef.current = null;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Raycasting for hover & click
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let downX = 0;
    let downY = 0;
    let lastHoverCheck = 0;

    const pickHit = (clientX: number, clientY: number): string | null => {
      const root = modelRootRef.current;
      if (!root) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObject(root, true);

      let best: THREE.Intersection | null = null;
      for (const hit of hits) {
        if (!hit.object.visible) continue;
        const sys = hit.object.userData.system as AnatomySystem | undefined;
        const key = hit.object.userData.anatomyKey as string | undefined;
        if (!sys || !key) continue;
        // Skip skin when internal layers exist along the ray unless nothing else is hit
        if (!best) {
          best = hit;
          continue;
        }
        const pb = PICK_PRIORITY[best.object.userData.system as AnatomySystem] ?? 0;
        const ph = PICK_PRIORITY[sys] ?? 0;
        if (ph > pb) {
          best = hit;
        }
      }
      return (best?.object.userData.anatomyKey as string | undefined) ?? null;
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (ev.buttons) return;
      const now = performance.now();
      if (now - lastHoverCheck < 50) return;
      lastHoverCheck = now;
      const key = pickHit(ev.clientX, ev.clientY);
      setHoveredKey((prev) => (prev === key ? prev : key));
      renderer.domElement.style.cursor = key ? 'pointer' : 'grab';
    };

    const onPointerDown = (ev: PointerEvent) => {
      downX = ev.clientX;
      downY = ev.clientY;
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 5) return;
      const key = pickHit(ev.clientX, ev.clientY);
      if (key) {
        setSelectedKey(key);
        const part = partsRef.current.get(key);
        if (part && modelRootRef.current) {
          const worldCenter = part.center.clone();
          modelRootRef.current.localToWorld(worldCenter);
          // Smoothly focus camera target softly toward structure while preserving distance
          const offset = camera.position.clone().sub(controls.target);
          cameraGoalRef.current = {
            target: worldCenter,
            pos: worldCenter.clone().add(offset),
          };
          requestRender();
        }
      }
    };

    const onPointerLeave = () => setHoveredKey(null);

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointerleave', onPointerLeave);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || disposed) return;
      const w = Math.max(entry.contentRect.width, 280);
      const h = Math.max(entry.contentRect.height, 360);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    });
    resizeObserver.observe(container);

    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave);
      controls.dispose();
      envTex.dispose();
      shadowTex.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      renderer.dispose();
      sceneRef.current = null;
    };
  }, []);

  // --------------------------------------------------------------------------
  // Load real GLB anatomy model when `sex` changes
  // --------------------------------------------------------------------------
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || webglUnavailable) return;

    let cancelled = false;
    setIsModelLoading(true);
    setLoadingProgress(0);
    setLoadError(null);

    const disposePreviousModel = () => {
      const oldRoot = modelRootRef.current;
      if (oldRoot) {
        scene.remove(oldRoot);
        oldRoot.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => m?.dispose?.());
          }
        });
        modelRootRef.current = null;
      }
      partsRef.current.clear();
      systemGroupsRef.current.clear();
    };

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    const modelPath = `/models/anatomy-${sex}.glb`;

    loader.load(
      modelPath,
      (gltf) => {
        if (cancelled) {
          gltf.scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) obj.geometry?.dispose();
          });
          return;
        }

        disposePreviousModel();

        const root = gltf.scene;
        const parts = new Map<string, AnatomyPartRuntime>();
        const systemGroups = new Map<AnatomySystem, THREE.Object3D>();
        const topLevelGroups = ['skin', 'skeleton', 'muscles', 'organs', 'vessels', 'nerves'];

        root.traverse((obj) => {
          if (obj.parent === root && topLevelGroups.includes(obj.name)) {
            systemGroups.set(obj.name as AnatomySystem, obj);
          }
          if (!(obj instanceof THREE.Mesh)) return;

          // Walk up hierarchy to locate nearest catalog key node
          let owner: THREE.Object3D | null = obj;
          while (owner && !CATALOG_BY_ID.has(owner.name)) {
            owner = owner.parent;
          }
          if (!owner) return;

          const info = CATALOG_BY_ID.get(owner.name)!;
          const sys = info.system;
          const base = SYSTEM_MATERIAL_PROPS[sys];

          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(info.color || base.color),
            roughness: base.roughness,
            metalness: sys === 'vessels' ? 0.08 : 0.02,
            transparent: base.opacity < 1,
            opacity: base.opacity,
            depthWrite: base.opacity >= 1 && sys !== 'skin',
            side: sys === 'skin' ? THREE.DoubleSide : THREE.FrontSide,
          });

          obj.material = mat;
          obj.castShadow = sys !== 'skin';
          obj.receiveShadow = true;
          if (sys === 'skin') obj.renderOrder = 10;

          obj.userData.anatomyKey = info.id;
          obj.userData.system = sys;

          let part = parts.get(info.id);
          if (!part) {
            part = {
              key: info.id,
              system: sys,
              baseColor: new THREE.Color(info.color || base.color),
              baseRoughness: base.roughness,
              baseOpacity: base.opacity,
              meshes: [],
              materials: [],
              center: new THREE.Vector3(),
            };
            parts.set(info.id, part);
          }
          part.meshes.push(obj);
          part.materials.push(mat);
        });

        // Add 12 clickable joint hotspot spheres from catalog anchors
        const jointsGroup = new THREE.Group();
        jointsGroup.name = 'joints';
        root.add(jointsGroup);
        systemGroups.set('joints', jointsGroup);

        const jointGeo = new THREE.SphereGeometry(0.038, 20, 14);
        for (const item of UNIFIED_ANATOMICAL_CATALOG) {
          if (item.system !== 'joints') continue;
          const anchor = sex === 'female' ? item.anchorFemale : item.anchorMale;
          if (!anchor) continue;
          const jMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(item.color || '#ff9a3c'),
            roughness: 0.35,
            metalness: 0.05,
            transparent: true,
            opacity: 0.72,
            depthWrite: false,
          });
          const jMesh = new THREE.Mesh(jointGeo, jMat);
          jMesh.position.set(...anchor);
          jMesh.renderOrder = 5;
          jMesh.userData.anatomyKey = item.id;
          jMesh.userData.system = 'joints';
          jointsGroup.add(jMesh);

          parts.set(item.id, {
            key: item.id,
            system: 'joints',
            baseColor: new THREE.Color(item.color || '#ff9a3c'),
            baseRoughness: 0.35,
            baseOpacity: 0.72,
            meshes: [jMesh],
            materials: [jMat],
            center: jMesh.position.clone(),
          });
        }

        // Compute centers for focus-on-select
        const box = new THREE.Box3();
        root.updateMatrixWorld(true);
        for (const part of parts.values()) {
          if (part.system === 'joints') continue;
          box.makeEmpty();
          for (const m of part.meshes) box.expandByObject(m);
          box.getCenter(part.center);
          root.worldToLocal(part.center);
        }

        scene.add(root);
        modelRootRef.current = root;
        partsRef.current = parts;
        systemGroupsRef.current = systemGroups;

        setIsModelLoading(false);
        setLoadingProgress(100);
        requestRenderRef.current();
      },
      (progressEvt) => {
        if (cancelled) return;
        if (progressEvt.total > 0) {
          setLoadingProgress(Math.round((progressEvt.loaded / progressEvt.total) * 100));
        }
      },
      (err) => {
        if (cancelled) return;
        console.error('Failed to load GLB model:', err);
        setIsModelLoading(false);
        setLoadError(t.loadError);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [sex, webglUnavailable, t.loadError]);

  // Smooth damped camera preset switcher
  const setCameraViewPreset = useCallback((view: string) => {
    setCameraView(view);
    const preset = CAMERA_PRESETS[view] || CAMERA_PRESETS.front;
    cameraGoalRef.current = {
      pos: new THREE.Vector3(...preset.pos),
      target: new THREE.Vector3(...preset.target),
    };
    requestRenderRef.current();
  }, []);

  const handleReset = useCallback(() => {
    setSelectedKey(null);
    setHoveredKey(null);
    setIsolated(false);
    setOpacityOverrides({});
    setLayers({
      skin: true,
      skeleton: true,
      joints: true,
      muscles: false,
      organs: true,
      vessels: true,
      nerves: true,
    });
    setCameraViewPreset('front');
  }, [setCameraViewPreset]);

  const handleSelectStructureFromList = useCallback((key: string) => {
    const struct = CATALOG_BY_ID.get(key);
    if (struct) {
      setLayers((prev) => ({ ...prev, [struct.system]: true }));
    }
    setSelectedKey(key);
    setShowSearchResults(false);
    const part = partsRef.current.get(key);
    if (part && modelRootRef.current) {
      const center = part.center.clone();
      modelRootRef.current.localToWorld(center);
      cameraGoalRef.current = {
        target: center,
        pos: center.clone().add(new THREE.Vector3(0, 0.08, 1.35)),
      };
      requestRenderRef.current();
    }
  }, []);

  const handleToggleLayer = (sys: AnatomySystem) => {
    setLayers((prev) => ({ ...prev, [sys]: !prev[sys] }));
  };

  const handleShowAll = () => {
    setLayers({ skin: true, skeleton: true, joints: true, muscles: true, organs: true, vessels: true, nerves: true });
  };

  const handleHideAll = () => {
    setLayers({ skin: false, skeleton: false, joints: false, muscles: false, organs: false, vessels: false, nerves: false });
  };

  const handleOpenVideos = (queryText: string) => {
    if (onNavigateToVideo) {
      onNavigateToVideo(queryText);
    } else if (onStructureClick) {
      onStructureClick(selectedStructure?.label || queryText, queryText);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-[#0a0f1c] text-slate-100 shadow-xl"
    >
      {/* TOP BAR */}
      <div className="bg-[#101C32] border-b border-slate-800 px-3 sm:px-4 py-2.5 flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2 me-auto">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 shrink-0">
            <Layers size={17} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">{t.title}</h2>
            <p className="text-[11px] text-slate-400 hidden sm:block">{t.subtitle}</p>
          </div>
        </div>

        {/* Search across 147 structures */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder={t.search}
            className="w-full bg-[#0a0f1c] border border-slate-700 focus:border-teal-500 rounded-xl ps-8 pe-7 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSearchResults(false);
              }}
              className="absolute top-1/2 -translate-y-1/2 end-2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={13} />
            </button>
          )}

          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full inset-x-0 mt-1.5 bg-[#101C32] border border-slate-700 rounded-xl shadow-2xl z-30 max-h-64 overflow-y-auto divide-y divide-slate-800">
              {searchResults.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectStructureFromList(s.id)}
                  className="w-full px-3 py-2 text-start hover:bg-slate-800/80 flex items-center gap-2.5 transition cursor-pointer"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color || '#0D9488' }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">{s.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {SYSTEM_LABELS[s.system][language] || SYSTEM_LABELS[s.system].en} · {s.category}
                      {s.kanji ? ` · ${s.kanji}` : ''}
                      {s.fmaId ? ` · ${s.fmaId}` : ''}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sex Switcher */}
        <div className="flex items-center bg-[#0a0f1c] p-0.5 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setSex('male')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              sex === 'male' ? 'bg-[#0D9488] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User size={12} /> {t.male}
          </button>
          <button
            type="button"
            onClick={() => setSex('female')}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
              sex === 'female' ? 'bg-[#0D9488] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users size={12} /> {t.female}
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-[#0a0f1c] p-0.5 rounded-xl border border-slate-700">
          {(['anatomical', 'clinical', 'surgical'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                mode === m ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t[m]}
            </button>
          ))}
        </div>

        {/* Camera Presets */}
        <div className="flex items-center gap-1 flex-wrap">
          {(['front', 'back', 'left', 'right', 'superior', 'inferior'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setCameraViewPreset(v)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                cameraView === v
                  ? 'bg-[#0D9488] border-teal-500 text-white'
                  : 'bg-[#0a0f1c] border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {t[v]}
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0a0f1c] border border-slate-700 text-slate-300 hover:text-white text-[10px] font-bold cursor-pointer"
            title={t.resetView}
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* MAIN 3-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] min-h-[580px]">
        {/* LEFT PANEL — Systems & Danger Zones Counter */}
        <aside className="bg-[#101C32] border-b lg:border-b-0 lg:border-e border-slate-800 p-3.5 space-y-3">
          <div className="rounded-xl bg-teal-500/10 border border-teal-500/30 px-2.5 py-2 text-center text-[11px] font-semibold text-teal-300">
            {UNIFIED_ANATOMICAL_CATALOG.length} {t.stats} · {t.sources}
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>{t.layersExplore}</span>
          </div>

          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={handleShowAll}
              className="flex-1 py-1.5 rounded-lg bg-[#0a0f1c] hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-200 cursor-pointer"
            >
              {t.showAll}
            </button>
            <button
              type="button"
              onClick={handleHideAll}
              className="flex-1 py-1.5 rounded-lg bg-[#0a0f1c] hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-200 cursor-pointer"
            >
              {t.hideAll}
            </button>
          </div>

          <div className="space-y-1.5">
            {SYSTEM_ORDER.map((sys) => {
              const Icon = SYSTEM_ICONS[sys];
              const isVisible = layers[sys];
              const count = UNIFIED_ANATOMICAL_CATALOG.filter((s) => s.system === sys).length;
              return (
                <button
                  key={sys}
                  type="button"
                  onClick={() => handleToggleLayer(sys)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                    isVisible
                      ? 'bg-teal-500/10 border-teal-500/40 text-white'
                      : 'bg-[#0a0f1c] border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon size={14} className={isVisible ? 'text-teal-400' : 'text-slate-500'} />
                  <span className="flex-1 text-start">
                    {SYSTEM_LABELS[sys][language] || SYSTEM_LABELS[sys].en}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{count}</span>
                  {isVisible ? <Eye size={12} className="text-teal-400" /> : <EyeOff size={12} />}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-2.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-300">
              <ShieldAlert size={14} /> {t.dangerZones}
            </span>
            <span className="text-xs font-mono font-bold text-rose-200">{DANGER_ZONES.length}</span>
          </div>
        </aside>

        {/* CENTER — Unobstructed 3D GLB Canvas */}
        <div className="relative h-[460px] lg:h-[600px] bg-[#0a0f1c]">
          {!webglUnavailable ? (
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300">
              <Layers size={38} className="text-teal-400 mb-2" />
              <p className="text-xs max-w-md">{t.webglError}</p>
            </div>
          )}

          {/* Loading / Error overlay */}
          {isModelLoading && !webglUnavailable && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20"
              style={{ backgroundColor: 'rgba(10, 15, 28, 0.88)' }}
            >
              <Loader size={30} className="animate-spin text-teal-400" />
              <span className="text-xs font-semibold text-slate-200">
                {t.loading} {loadingProgress > 0 ? `${loadingProgress}%` : ''}
              </span>
            </div>
          )}

          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-[#0a0f1c]/90">
              <ShieldAlert size={28} className="text-rose-400 mb-2" />
              <p className="text-xs text-rose-200">{loadError}</p>
            </div>
          )}

          {/* Hover Tooltip (solid dark surface — no backdrop-blur over WebGL) */}
          {hoveredKey && hoveredKey !== selectedKey && (
            <div
              className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg border border-amber-400/40 text-xs font-bold text-amber-300 shadow-lg z-10"
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)' }}
            >
              {getStructureById(hoveredKey)?.label || hoveredKey}
            </div>
          )}

          {/* Bottom Controls Overlay */}
          <div className="absolute bottom-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {selectedStructure ? (
              <div
                className="pointer-events-auto flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-700 shadow-lg"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)' }}
              >
                <button
                  type="button"
                  onClick={() => setIsolated((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    isolated ? 'bg-[#0D9488] text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <Eye size={12} /> {t.isolate}
                </button>
                <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-300">
                  <SlidersHorizontal size={12} className="text-teal-400" />
                  <span>{t.opacity}</span>
                  <input
                    type="range"
                    min={0.15}
                    max={1}
                    step={0.05}
                    value={opacityOverrides[selectedStructure.id] ?? 1}
                    onChange={(e) =>
                      setOpacityOverrides((prev) => ({
                        ...prev,
                        [selectedStructure.id]: parseFloat(e.target.value),
                      }))
                    }
                    className="w-20 accent-teal-500 cursor-pointer"
                  />
                </label>
              </div>
            ) : (
              <div
                className="pointer-events-auto mx-auto px-3 py-1.5 rounded-full border border-slate-700/80 text-[11px] text-slate-300 text-center"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)' }}
              >
                {t.selectStructure}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — Clinical, Hierarchy, Procedures, Danger Zones & Video Links */}
        <aside className="bg-[#101C32] border-t lg:border-t-0 lg:border-s border-slate-800 overflow-y-auto max-h-[600px]">
          {selectedStructure ? (
            <div className="divide-y divide-slate-800">
              {/* Header */}
              <div className="p-4 bg-gradient-to-br from-slate-800/70 to-[#101C32]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{selectedStructure.label}</h3>
                    {selectedStructure.fmaId && (
                      <p className="text-[11px] font-mono text-teal-400 mt-0.5">{selectedStructure.fmaId}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedKey(null)}
                    className="text-slate-400 hover:text-white p-1 cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                    {SYSTEM_LABELS[selectedStructure.system][language] || SYSTEM_LABELS[selectedStructure.system].en}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[selectedStructure.category] || '#64748b'}25`,
                      color: CATEGORY_COLORS[selectedStructure.category] || '#cbd5e1',
                    }}
                  >
                    {selectedStructure.category}
                  </span>
                  {selectedStructure.sex && selectedStructure.sex !== 'both' && (
                    <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] font-bold">
                      {selectedStructure.sex === 'male' ? t.male : t.female}
                    </span>
                  )}
                </div>

                {(selectedStructure.kanji || selectedStructure.kana) && (
                  <div className="mt-2.5 text-[11px] text-slate-300">
                    <span className="text-slate-500 block text-[10px] font-bold uppercase">{t.japanese}</span>
                    {selectedStructure.kanji} {selectedStructure.kana ? `(${selectedStructure.kana})` : ''}
                  </div>
                )}
              </div>

              {/* Surgical Procedures */}
              {selectedProcedures.length > 0 && (
                <div className="p-3.5 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Stethoscope size={13} /> {t.procedures} ({selectedProcedures.length})
                  </h4>
                  {selectedProcedures.map((proc) => (
                    <div key={proc.id} className="rounded-xl bg-[#0a0f1c] border border-slate-800 p-2.5">
                      <div className="text-xs font-bold text-white">
                        {proc.names[language as keyof typeof proc.names] || proc.names.en}
                      </div>
                      <div className="text-[10px] text-teal-400 mt-0.5">
                        {proc.specialty} · {proc.approach}
                      </div>
                      {proc.educationalNotes && (
                        <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                          {proc.educationalNotes[language as keyof typeof proc.educationalNotes] || proc.educationalNotes.en}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Danger Zones */}
              {selectedDangerZones.length > 0 && (
                <div className="p-3.5 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert size={13} /> {t.dangerZones} ({selectedDangerZones.length})
                  </h4>
                  {selectedDangerZones.map((dz) => (
                    <div key={dz.id} className="rounded-xl bg-rose-950/35 border border-rose-500/30 p-2.5">
                      <div className="text-xs font-bold text-rose-300">
                        {dz.names[language as keyof typeof dz.names] || dz.names.en}
                      </div>
                      <p className="text-[11px] text-slate-200 mt-1 leading-relaxed">
                        {dz.clinicalSignificance[language as keyof typeof dz.clinicalSignificance] || dz.clinicalSignificance.en}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* BodyParts3D Hierarchy */}
              {hierarchyLinks.length > 0 && (
                <div className="p-3.5 space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {t.hierarchy}
                  </h4>
                  {hierarchyLinks.map((h, i) => (
                    <div key={`${h.parentId}-${h.childId}-${i}`} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-teal-300">
                        {h.type}
                      </span>
                      <span className="truncate">
                        {h.childId === selectedStructure.fmaId ? `↳ ${h.parentName}` : `• ${h.childName}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Verified Related Videos + Surgical Library Bridge */}
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Youtube size={13} /> {t.relatedVideos}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleOpenVideos(selectedStructure.label)}
                    className="text-[11px] font-bold text-teal-400 hover:text-teal-300 cursor-pointer"
                  >
                    {t.openInLibrary} →
                  </button>
                </div>

                {relatedVideos.slice(0, 3).map((vid) => (
                  <a
                    key={vid.videoId}
                    href={vid.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[#0a0f1c] hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/40 transition"
                  >
                    {vid.thumbnailUrl && (
                      <img
                        src={vid.thumbnailUrl}
                        alt=""
                        className="w-14 h-9 rounded object-cover shrink-0 bg-slate-900"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-white line-clamp-2 leading-snug">{vid.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {vid.author} {vid.duration ? `· ${vid.duration}` : ''}
                      </div>
                    </div>
                    <Play size={13} className="text-rose-400 shrink-0" />
                  </a>
                ))}

                {/* Direct Surgical YouTube Channels & External Platforms */}
                {atlasVideoTargets && (
                  <div className="pt-1 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Globe size={11} className="text-teal-400" /> {t.channelSearch}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {atlasVideoTargets.youtubeSearchLinks.slice(0, 3).map(({ channel, url }) => (
                        <a
                          key={channel.handle}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-[10px] font-semibold text-rose-200"
                        >
                          <Youtube size={10} /> {channel.name} <ExternalLink size={9} />
                        </a>
                      ))}
                      {atlasVideoTargets.externalSearchLinks.map(({ platform, url }) => (
                        <a
                          key={platform.id}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-[10px] font-semibold text-teal-200"
                        >
                          <Globe size={10} /> {platform.name.split('—')[0].trim()} <ExternalLink size={9} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-[10px] text-amber-300 text-center leading-snug">
                  {t.disclaimer}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
              <Info size={34} className="text-slate-600" />
              <p className="text-xs leading-relaxed">{t.selectStructure}</p>
            </div>
          )}
        </aside>
      </div>

      {/* CC BY 4.0 ATTRIBUTION FOOTER */}
      <div className="bg-[#070D1A] border-t border-slate-800 px-4 py-2 text-[10px] text-slate-400 text-center">
        {t.attribution}
      </div>
    </div>
  );
};

export default SurgicalAtlas3D;
