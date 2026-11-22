import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Loader2,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import type { SupportedLanguage } from '../../types';
import {
  UNIFIED_ANATOMICAL_CATALOG,
  type AnatomySystem,
} from '../../lib/surgicalAtlasCatalog';
import {
  getAtlasCopy,
  type LabelingLevel,
  type VisualizationMode,
} from '../../lib/atlas/atlasI18n';
import { getKnowledgeProfile, pickText } from '../../lib/atlas/atlasKnowledgeRegistry';

const SYSTEM_MATERIAL_PROPS: Record<AnatomySystem, { color: string; roughness: number; opacity: number }> = {
  skin: { color: '#dca98e', roughness: 0.68, opacity: 0.14 },
  skeleton: { color: '#e2e8f0', roughness: 0.58, opacity: 1 },
  joints: { color: '#ff9a3c', roughness: 0.38, opacity: 0.78 },
  muscles: { color: '#a82828', roughness: 0.52, opacity: 0.9 },
  organs: { color: '#d96b52', roughness: 0.34, opacity: 1 },
  vessels: { color: '#dc2626', roughness: 0.28, opacity: 1 },
  nerves: { color: '#facc15', roughness: 0.34, opacity: 1 },
};

const PICK_PRIORITY: Record<AnatomySystem, number> = {
  vessels: 5,
  organs: 4,
  nerves: 4,
  joints: 3,
  skeleton: 2,
  muscles: 1,
  skin: -1,
};

export type BodyCameraPreset = 'front' | 'back' | 'left' | 'right' | 'superior' | 'inferior';

const CAMERA_PRESETS: Record<BodyCameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  front: { pos: [0, 0.94, 3.05], target: [0, 0.92, 0] },
  back: { pos: [0, 0.94, -3.05], target: [0, 0.92, 0] },
  left: { pos: [-3.05, 0.94, 0], target: [0, 0.92, 0] },
  right: { pos: [3.05, 0.94, 0], target: [0, 0.92, 0] },
  superior: { pos: [0, 3.6, 0.45], target: [0, 0.92, 0] },
  inferior: { pos: [0, -0.75, 2.65], target: [0, 0.92, 0] },
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

interface ProjectedLabel {
  id: string;
  text: string;
  x: number;
  y: number;
  isSelected: boolean;
  isVascular: boolean;
  isSecondaryHighlight: boolean;
}

export interface HumanBodyViewerProps {
  language: SupportedLanguage;
  sex: 'male' | 'female';
  selectedId: string | null;
  secondaryHighlightIds?: string[];
  hoveredId: string | null;
  vizMode: VisualizationMode;
  visibleSystems: Record<AnatomySystem, boolean>;
  systemOpacities: Record<AnatomySystem, number>;
  isolatedSystem: AnatomySystem | null;
  isolatedStructureId: string | null;
  hiddenStructureIds: Set<string>;
  labelLevel: LabelingLevel | 0;
  deepMode: boolean;
  sectionRatio: number; // 0 = no slice, 0.05..1.0 = top-down Y clipping height
  compactReference?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onSelectStructure: (id: string | null, clonedGroup?: THREE.Group | null) => void;
  onHoverStructure: (id: string | null) => void;
  onExtractSelection?: (group: THREE.Group | null) => void;
}

function getMeshKey(object: THREE.Object3D): string | null {
  let curr: THREE.Object3D | null = object;
  while (curr) {
    if (curr.userData?.anatomyKey) return curr.userData.anatomyKey as string;
    if (curr.name && CATALOG_BY_ID.has(curr.name)) return curr.name;
    curr = curr.parent;
  }
  return null;
}

function clonePartsGroup(part: AnatomyPartRuntime): THREE.Group {
  const group = new THREE.Group();
  for (const mesh of part.meshes) {
    const clonedMesh = new THREE.Mesh(
      mesh.geometry.clone(),
      (mesh.material as THREE.MeshStandardMaterial).clone(),
    );
    mesh.updateWorldMatrix(true, false);
    clonedMesh.applyMatrix4(mesh.matrixWorld);
    clonedMesh.userData.anatomyKey = part.key;
    clonedMesh.name = part.key;
    group.add(clonedMesh);
  }
  return group;
}

export const HumanBodyViewer: React.FC<HumanBodyViewerProps> = ({
  language,
  sex,
  selectedId,
  secondaryHighlightIds = [],
  hoveredId,
  vizMode,
  visibleSystems,
  systemOpacities,
  isolatedSystem,
  isolatedStructureId,
  hiddenStructureIds,
  labelLevel,
  deepMode,
  sectionRatio,
  compactReference = false,
  isFullscreen = false,
  onToggleFullscreen,
  onSelectStructure,
  onHoverStructure,
  onExtractSelection,
}) => {
  const t = getAtlasCopy(language);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [webglLost, setWebglLost] = useState(false);
  const [activePreset, setActivePreset] = useState<BodyCameraPreset>('front');
  const [projectedLabels, setProjectedLabels] = useState<ProjectedLabel[]>([]);

  // Three.js mutable refs
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const partsRef = useRef<Map<string, AnatomyPartRuntime>>(new Map());
  const modelRootRef = useRef<THREE.Group | null>(null);
  const clipPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, -1, 0), 3.0));
  const modelBoundsRef = useRef<{ minY: number; maxY: number }>({ minY: 0, maxY: 1.82 });
  const cameraTweenRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const requestRenderRef = useRef<() => void>(() => {});
  const selectedIdRef = useRef<string | null>(selectedId);
  const secondaryIdsRef = useRef<string[]>(secondaryHighlightIds);
  const labelLevelRef = useRef<LabelingLevel | 0>(labelLevel);
  const languageRef = useRef<SupportedLanguage>(language);
  const onSelectRef = useRef(onSelectStructure);
  const onHoverRef = useRef(onHoverStructure);
  const onExtractRef = useRef(onExtractSelection);

  selectedIdRef.current = selectedId;
  secondaryIdsRef.current = secondaryHighlightIds;
  labelLevelRef.current = labelLevel;
  languageRef.current = language;
  onSelectRef.current = onSelectStructure;
  onHoverRef.current = onHoverStructure;
  onExtractRef.current = onExtractSelection;

  // Update labels projection when camera or selection changes
  const updateProjectedLabels = useCallback(() => {
    const mount = mountRef.current;
    const camera = cameraRef.current;
    const parts = partsRef.current;
    const lvl = labelLevelRef.current;
    if (!mount || !camera || parts.size === 0 || lvl === 0 || compactReference) {
      setProjectedLabels([]);
      return;
    }

    const w = mount.clientWidth;
    const h = mount.clientHeight;
    if (w < 80 || h < 80) return;

    const sel = selectedIdRef.current;
    const secSet = new Set(secondaryIdsRef.current);
    const lang = languageRef.current;

    const priorityIds: string[] = [];
    if (sel) priorityIds.push(sel);
    for (const sid of secondaryIdsRef.current) {
      if (!priorityIds.includes(sid)) priorityIds.push(sid);
    }

    const landmarkTier1 = ['heart', 'aorta', 'brain', 'liver', 'lung_r', 'stomach', 'kidney_r', 'spine'];
    const landmarkTier2 = ['carotid_r', 'coronary_arteries', 'arteries_pelvis', 'arteries_leg_r', 'vena_cava_inferior', 'spleen', 'colon', 'bladder'];
    const landmarkTier3 = ['carotid_l', 'arteries_leg_l', 'veins_leg_r', 'pancreas', 'gallbladder', 'thyroid', 'trachea', 'femur_r', 'sciatic_r'];

    if (lvl >= 1) priorityIds.push(...landmarkTier1);
    if (lvl >= 2) priorityIds.push(...landmarkTier2);
    if (lvl >= 3) priorityIds.push(...landmarkTier3);

    const uniqueIds = Array.from(new Set(priorityIds));
    const maxCount = lvl === 1 ? 6 : lvl === 2 ? 11 : 16;

    const placed: ProjectedLabel[] = [];
    const vec = new THREE.Vector3();

    for (const id of uniqueIds) {
      if (placed.length >= maxCount) break;
      const part = parts.get(id);
      const cat = CATALOG_BY_ID.get(id);
      if (!part || !cat) continue;
      if (part.meshes.every((m) => !m.visible)) continue;

      vec.copy(part.center).project(camera);
      if (vec.z < -1 || vec.z > 1) continue;

      const x = ((vec.x + 1) / 2) * w;
      const y = ((-vec.y + 1) / 2) * h;
      if (x < 48 || x > w - 48 || y < 34 || y > h - 42) continue;

      // Greedy overlap prevention (minimum box separation)
      const isFocus = id === sel || secSet.has(id);
      const collides = placed.some(
        (p) => Math.abs(p.x - x) < 118 && Math.abs(p.y - y) < 28,
      );
      if (collides && !isFocus) continue;

      const profile = getKnowledgeProfile(cat);
      const labelText = pickText(profile.localizedName, lang).split('(')[0].trim();

      placed.push({
        id,
        text: labelText,
        x,
        y,
        isSelected: id === sel,
        isVascular: cat.system === 'vessels',
        isSecondaryHighlight: secSet.has(id) && id !== sel,
      });
    }

    setProjectedLabels(placed);
  }, [compactReference]);

  // Apply visual styling across all parts (3 visualization modes, layer opacity, isolation, highlights)
  const applyMaterialsAndVisibility = useCallback(() => {
    const parts = partsRef.current;
    if (parts.size === 0) return;

    const secSet = new Set(secondaryHighlightIds);
    const hasFocusSelection = Boolean(selectedId);

    parts.forEach((part, id) => {
      const sys = part.system;
      const sysVisible = visibleSystems[sys] ?? true;
      const isIsolatedOut =
        (isolatedSystem !== null && sys !== isolatedSystem) ||
        (isolatedStructureId !== null && id !== isolatedStructureId);
      const isHiddenStruct = hiddenStructureIds.has(id);

      const finalVisible = sysVisible && !isIsolatedOut && !isHiddenStruct;
      for (const m of part.meshes) {
        m.visible = finalVisible;
      }

      const isSelected = id === selectedId;
      const isHovered = id === hoveredId;
      const isSecondary = secSet.has(id) && !isSelected;

      const sysOpacity = systemOpacities[sys] ?? 1;
      let targetOpacity = part.baseOpacity * sysOpacity;
      let emissiveHex = 0x000000;
      let emissiveIntensity = 0;
      let colorOverride: THREE.Color | null = null;
      let wireframe = false;

      if (vizMode === 'holographic') {
        if (sys === 'skin') {
          targetOpacity = Math.min(0.11, sysOpacity * 0.12);
          colorOverride = new THREE.Color('#0ea5e9');
          emissiveHex = 0x0284c7;
          emissiveIntensity = 0.25;
        } else if (sys === 'vessels') {
          targetOpacity = 0.94 * sysOpacity;
          colorOverride = new THREE.Color(id.includes('vein') || id.includes('vena') ? '#38bdf8' : '#00d9ff');
          emissiveHex = id.includes('vein') || id.includes('vena') ? 0x2563eb : 0x00d9ff;
          emissiveIntensity = 0.35;
        } else if (sys === 'organs') {
          targetOpacity = 0.62 * sysOpacity;
          colorOverride = new THREE.Color('#38bdf8');
          emissiveHex = 0x0369a1;
          emissiveIntensity = 0.22;
        } else if (sys === 'nerves') {
          targetOpacity = 0.85 * sysOpacity;
          colorOverride = new THREE.Color('#8beaff');
          emissiveHex = 0x38bdf8;
          emissiveIntensity = 0.3;
        } else {
          targetOpacity = Math.min(0.28, targetOpacity * 0.32);
          colorOverride = new THREE.Color('#1d4ed8');
          emissiveHex = 0x1e3a8a;
          emissiveIntensity = 0.14;
        }
      } else if (vizMode === 'layers') {
        if (sys === 'skin') {
          targetOpacity = Math.min(0.32, sysOpacity * 0.38);
        }
      }

      // Focus dimming when an organ/vessel is selected
      if (hasFocusSelection && !isSelected && !isSecondary && !isHovered) {
        if (sys === 'skin') {
          targetOpacity = Math.min(targetOpacity, 0.06);
        } else if (vizMode === 'full') {
          targetOpacity = Math.min(targetOpacity, sys === 'skeleton' ? 0.32 : 0.42);
        }
      }

      if (isSelected) {
        targetOpacity = 1;
        emissiveHex = 0x00d9ff;
        emissiveIntensity = 0.52;
      } else if (isSecondary) {
        targetOpacity = Math.max(targetOpacity, 0.95);
        emissiveHex = 0xf59e0b;
        emissiveIntensity = 0.42;
      } else if (isHovered) {
        targetOpacity = Math.max(targetOpacity, 0.9);
        emissiveHex = 0x38bdf8;
        emissiveIntensity = 0.32;
      }

      const transparent = targetOpacity < 0.99;
      for (const mat of part.materials) {
        mat.color.copy(colorOverride || part.baseColor);
        mat.opacity = Math.max(0, Math.min(1, targetOpacity));
        mat.transparent = transparent;
        mat.depthWrite = !transparent;
        mat.emissive.setHex(emissiveHex);
        mat.emissiveIntensity = emissiveIntensity;
        mat.wireframe = wireframe;
        mat.clippingPlanes = sectionRatio > 0.01 ? [clipPlaneRef.current] : [];
        mat.clipShadows = sectionRatio > 0.01;
        mat.needsUpdate = true;
      }
    });

    requestRenderRef.current();
    updateProjectedLabels();
  }, [
    selectedId,
    secondaryHighlightIds,
    hoveredId,
    vizMode,
    visibleSystems,
    systemOpacities,
    isolatedSystem,
    isolatedStructureId,
    hiddenStructureIds,
    sectionRatio,
    updateProjectedLabels,
  ]);

  // Update clipping plane height from sectionRatio
  useEffect(() => {
    const { minY, maxY } = modelBoundsRef.current;
    if (sectionRatio <= 0.01) {
      clipPlaneRef.current.constant = maxY + 2;
    } else {
      const cutY = maxY - (maxY - minY) * Math.min(0.95, Math.max(0.05, sectionRatio));
      clipPlaneRef.current.constant = cutY;
    }
    applyMaterialsAndVisibility();
  }, [sectionRatio, applyMaterialsAndVisibility]);

  // When selectedId changes programmatically (e.g. from left navigation or quiz), focus camera smoothly and extract mesh clone
  useEffect(() => {
    if (!selectedId) {
      onExtractRef.current?.(null);
      return;
    }
    const part = partsRef.current.get(selectedId);
    if (part) {
      onExtractRef.current?.(clonePartsGroup(part));
      const controls = controlsRef.current;
      const camera = cameraRef.current;
      if (controls && camera) {
        const offsetDir = camera.position.clone().sub(controls.target).normalize();
        const dist = deepMode ? 0.72 : 1.18;
        const targetPos = part.center.clone().add(offsetDir.multiplyScalar(dist));
        cameraTweenRef.current = {
          pos: targetPos,
          target: part.center.clone(),
        };
        requestRenderRef.current();
      }
    }
  }, [selectedId, deepMode]);

  useEffect(() => {
    applyMaterialsAndVisibility();
  }, [applyMaterialsAndVisibility]);

  // Initialize Three.js WebGL scene + load Male/Female GLB
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    setLoading(true);
    setLoadProgress(0);
    setLoadError(null);
    setWebglLost(false);

    let disposed = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setLoading(false);
      setLoadError('WebGL initialization failed.');
      return;
    }

    const w = Math.max(200, mount.clientWidth);
    const h = Math.max(200, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.localClippingEnabled = true;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglLost(true);
    };
    const handleContextRestored = () => {
      setWebglLost(false);
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // RoomEnvironment PBR illumination
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;

    // Medical HUD 3-Point Studio Lighting
    const hemi = new THREE.HemisphereLight(0x8beaff, 0x071426, 0.8);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xf3f8ff, 1.35);
    keyLight.position.set(2.4, 3.2, 2.8);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x00d9ff, 0.85);
    rimLight.position.set(-2.5, 2.0, -2.5);
    scene.add(rimLight);

    // Subtle holographic floor platform ring
    const ringGeo = new THREE.RingGeometry(0.46, 0.5, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.position.y = 0.01;
    scene.add(floorRing);

    const outerRingGeo = new THREE.RingGeometry(0.62, 0.635, 64);
    outerRingGeo.rotateX(-Math.PI / 2);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x258bff,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.position.y = 0.008;
    scene.add(outerRing);

    const camera = new THREE.PerspectiveCamera(36, w / h, 0.04, 30);
    camera.position.set(...CAMERA_PRESETS.front.pos);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.front.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.35;
    controls.maxDistance = 6.0;
    controls.update();
    controlsRef.current = controls;

    let rafId = 0;
    let renderQueued = false;

    const renderFrame = () => {
      renderQueued = false;
      if (disposed) return;

      let keepAnimating = controls.update();
      if (cameraTweenRef.current) {
        const tween = cameraTweenRef.current;
        camera.position.lerp(tween.pos, 0.14);
        controls.target.lerp(tween.target, 0.14);
        if (
          camera.position.distanceTo(tween.pos) < 0.012 &&
          controls.target.distanceTo(tween.target) < 0.012
        ) {
          camera.position.copy(tween.pos);
          controls.target.copy(tween.target);
          cameraTweenRef.current = null;
        } else {
          keepAnimating = true;
        }
      }

      renderer.render(scene, camera);
      updateProjectedLabels();

      if (keepAnimating) {
        requestRender();
      }
    };

    const requestRender = () => {
      if (disposed || renderQueued) return;
      renderQueued = true;
      rafId = window.requestAnimationFrame(renderFrame);
    };
    requestRenderRef.current = requestRender;

    controls.addEventListener('change', requestRender);

    // Load GLB model
    const gltfLoader = new GLTFLoader();
    gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    const modelUrl = sex === 'female' ? '/models/anatomy-female.glb' : '/models/anatomy-male.glb';

    gltfLoader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;
        const root = gltf.scene;
        modelRootRef.current = root;

        const partsMap = new Map<string, AnatomyPartRuntime>();
        const tempBox = new THREE.Box3();
        const overallBox = new THREE.Box3();

        root.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            const key = getMeshKey(mesh);
            if (!key) return;
            const cat = CATALOG_BY_ID.get(key);
            if (!cat) return;

            mesh.userData.anatomyKey = key;
            const sysProps = SYSTEM_MATERIAL_PROPS[cat.system];
            const baseColor = new THREE.Color(cat.color || sysProps.color);

            const mat = new THREE.MeshStandardMaterial({
              color: baseColor,
              roughness: sysProps.roughness,
              metalness: cat.system === 'vessels' ? 0.12 : 0.05,
              transparent: sysProps.opacity < 0.99,
              opacity: sysProps.opacity,
              depthWrite: sysProps.opacity >= 0.99,
              side: THREE.DoubleSide,
            });
            mesh.material = mat;

            mesh.updateWorldMatrix(true, false);
            tempBox.setFromObject(mesh);
            overallBox.union(tempBox);

            let entry = partsMap.get(key);
            if (!entry) {
              entry = {
                key,
                system: cat.system,
                baseColor,
                baseRoughness: sysProps.roughness,
                baseOpacity: sysProps.opacity,
                meshes: [],
                materials: [],
                center: new THREE.Vector3(),
              };
              partsMap.set(key, entry);
            }
            entry.meshes.push(mesh);
            entry.materials.push(mat);
          }
        });

        // Compute centers for each anatomical part
        const partBox = new THREE.Box3();
        partsMap.forEach((part) => {
          partBox.makeEmpty();
          for (const m of part.meshes) {
            partBox.expandByObject(m);
          }
          partBox.getCenter(part.center);
        });

        // Add subtle joint spheres for joints if missing meshes
        UNIFIED_ANATOMICAL_CATALOG.forEach((cat) => {
          if (cat.system !== 'joints' || partsMap.has(cat.id)) return;
          const anchor = sex === 'female' ? cat.anchorFemale || cat.anchorMale : cat.anchorMale || cat.anchorFemale;
          if (!anchor) return;
          const sphereGeo = new THREE.SphereGeometry(0.022, 14, 14);
          const sphereMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(cat.color || '#ff9a3c'),
            roughness: 0.35,
            transparent: true,
            opacity: 0.78,
          });
          const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
          sphereMesh.position.set(anchor[0], anchor[1], anchor[2]);
          sphereMesh.userData.anatomyKey = cat.id;
          sphereMesh.name = cat.id;
          root.add(sphereMesh);

          partsMap.set(cat.id, {
            key: cat.id,
            system: 'joints',
            baseColor: new THREE.Color(cat.color || '#ff9a3c'),
            baseRoughness: 0.35,
            baseOpacity: 0.78,
            meshes: [sphereMesh],
            materials: [sphereMat],
            center: sphereMesh.position.clone(),
          });
        });

        if (!overallBox.isEmpty()) {
          modelBoundsRef.current = { minY: overallBox.min.y, maxY: overallBox.max.y };
        }

        scene.add(root);
        partsRef.current = partsMap;
        setLoading(false);
        setLoadProgress(100);
        applyMaterialsAndVisibility();

        // If an ID was pre-selected, extract it right away
        if (selectedIdRef.current && partsMap.has(selectedIdRef.current)) {
          const part = partsMap.get(selectedIdRef.current)!;
          onExtractRef.current?.(clonePartsGroup(part));
        }

        requestRender();
      },
      (progress) => {
        if (progress.total > 0) {
          setLoadProgress(Math.min(99, Math.round((progress.loaded / progress.total) * 100)));
        }
      },
      (err) => {
        if (disposed) return;
        setLoading(false);
        setLoadError(err instanceof Error ? err.message : 'Unable to load 3D model');
      },
    );

    // Raycasting interaction (click vs drag detection)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const pickStructureAt = (clientX: number, clientY: number): AnatomyPartRuntime | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const candidateMeshes: THREE.Mesh[] = [];
      partsRef.current.forEach((part) => {
        for (const m of part.meshes) {
          if (m.visible) candidateMeshes.push(m);
        }
      });

      const hits = raycaster.intersectObjects(candidateMeshes, false);
      if (hits.length === 0) return null;

      // Prioritize internal organs/vessels/nerves over translucent skin
      let best: AnatomyPartRuntime | null = null;
      let bestScore = -999;
      for (const hit of hits.slice(0, 8)) {
        const key = getMeshKey(hit.object);
        if (!key) continue;
        const part = partsRef.current.get(key);
        if (!part) continue;
        const prio = PICK_PRIORITY[part.system] ?? 0;
        if (prio > bestScore) {
          bestScore = prio;
          best = part;
        }
      }
      return best;
    };

    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons !== 0) return;
      const part = pickStructureAt(e.clientX, e.clientY);
      renderer.domElement.style.cursor = part ? 'pointer' : 'grab';
      onHoverRef.current(part ? part.key : null);
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist > 6) return;
      const part = pickStructureAt(e.clientX, e.clientY);
      if (part) {
        onSelectRef.current(part.key, clonePartsGroup(part));
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // ResizeObserver for crisp layout sync
    const ro = new ResizeObserver((entries) => {
      if (disposed) return;
      for (const entry of entries) {
        const rw = Math.max(120, Math.round(entry.contentRect.width));
        const rh = Math.max(120, Math.round(entry.contentRect.height));
        camera.aspect = rw / rh;
        camera.updateProjectionMatrix();
        renderer.setSize(rw, rh);
        requestRender();
      }
    });
    ro.observe(mount);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      partsRef.current.forEach((part) => {
        part.meshes.forEach((m) => m.geometry?.dispose());
        part.materials.forEach((mat) => mat.dispose());
      });
      partsRef.current.clear();
      ringGeo.dispose();
      ringMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [sex]); // Reload only when biological sex GLB switches

  const jumpToPreset = (preset: BodyCameraPreset) => {
    setActivePreset(preset);
    const p = CAMERA_PRESETS[preset];
    cameraTweenRef.current = {
      pos: new THREE.Vector3(...p.pos),
      target: new THREE.Vector3(...p.target),
    };
    requestRenderRef.current();
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[radial-gradient(ellipse_at_center,_#0F2744_0%,_#08172B_58%,_#050E1C_100%)]">
      {/* Subtle HUD concentric floor crosshair SVG */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full opacity-25"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="atlasGridGlow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#071426" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="800" fill="url(#atlasGridGlow)" />
        <circle cx="400" cy="400" r="240" fill="none" stroke="#258BFF" strokeWidth="0.6" strokeDasharray="4 6" />
        <circle cx="400" cy="400" r="330" fill="none" stroke="#00D9FF" strokeWidth="0.4" strokeOpacity="0.5" />
      </svg>

      {/* Three.js Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* 3D-to-2D Anatomical Labeling Engine */}
      {!loading && !compactReference && projectedLabels.length > 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          {projectedLabels.map((lbl) => (
            <button
              key={lbl.id}
              type="button"
              onClick={() => {
                const part = partsRef.current.get(lbl.id);
                onSelectStructure(lbl.id, part ? clonePartsGroup(part) : null);
              }}
              style={{
                left: `${lbl.x}px`,
                top: `${lbl.y}px`,
                transform: 'translate(-50%, -100%)',
              }}
              className={`pointer-events-auto absolute px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide transition whitespace-nowrap border cursor-pointer ${
                lbl.isSelected
                  ? 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#F3F8FF] shadow-[0_0_12px_rgba(0,217,255,0.45)]'
                  : lbl.isSecondaryHighlight
                  ? 'bg-amber-500/20 border-amber-400/80 text-amber-100'
                  : lbl.isVascular
                  ? 'bg-[#0B1B31]/90 border-[#00D9FF]/45 text-[#8BEAFF] hover:border-[#00D9FF]'
                  : 'bg-[#071426]/85 border-[#258BFF]/35 text-[#F3F8FF]/90 hover:border-[#00D9FF]'
              }`}
            >
              {lbl.text}
            </button>
          ))}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#071426]/85 px-6 text-center">
          <Loader2 className="w-9 h-9 text-[#00D9FF] animate-spin mb-3" />
          <p className="text-xs font-semibold text-[#F3F8FF]">{t.loadingBody}</p>
          <div className="w-48 h-1.5 bg-[#10243D] rounded-full overflow-hidden mt-3 border border-[#258BFF]/30">
            <div
              className="h-full bg-gradient-to-r from-[#258BFF] to-[#00D9FF] transition-all duration-200"
              style={{ width: `${Math.max(8, loadProgress)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono tabular-nums text-[#8BEAFF] mt-1.5">
            {loadProgress}%
          </span>
        </div>
      )}

      {/* Error / WebGL Loss Recovery */}
      {(loadError || webglLost) && !loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#071426]/90 px-6 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
          <p className="text-xs font-semibold text-[#F3F8FF]">
            {loadError || 'WebGL context interrupted. Use Systems or Search to inspect anatomy.'}
          </p>
        </div>
      )}

      {/* Bottom Camera Controls Bar (hidden in compact PIP reference mode) */}
      {!compactReference && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-[#0B1B31]/92 border border-[#258BFF]/35 rounded-xl px-2 py-1.5 shadow-lg max-w-[96%] overflow-x-auto">
          {(['front', 'back', 'left', 'right', 'superior', 'inferior'] as BodyCameraPreset[]).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => jumpToPreset(preset)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer whitespace-nowrap shrink-0 ${
                activePreset === preset
                  ? 'bg-[#258BFF] text-white'
                  : 'text-[#91A7C0] hover:text-[#F3F8FF] hover:bg-[#10243D]'
              }`}
            >
              {t.perspectives[preset]}
            </button>
          ))}
          <div className="w-px h-4 bg-[#258BFF]/30 mx-1 shrink-0" />
          <button
            type="button"
            onClick={() => jumpToPreset('front')}
            title={t.resetView}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#8BEAFF] hover:bg-[#10243D] transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw size={13} />
            <span>{t.resetView}</span>
          </button>
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              title={isFullscreen ? t.exitFullscreen : t.fullscreen}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold text-[#8BEAFF] hover:bg-[#10243D] transition cursor-pointer whitespace-nowrap shrink-0"
            >
              {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}
        </div>
      )}

      {/* Compact PIP label */}
      {compactReference && (
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-semibold text-[#8BEAFF] bg-[#071426]/85 border border-[#00D9FF]/30 px-2 py-0.5 rounded flex items-center gap-1">
            <Eye size={10} className="text-[#00D9FF]" />
            <span>Spatial Ref</span>
          </span>
        </div>
      )}
    </div>
  );
};
