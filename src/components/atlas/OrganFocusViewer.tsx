import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {
  RotateCcw,
  Eye,
  EyeOff,
  Loader2,
  Layers,
  Crosshair,
  SlidersHorizontal,
} from 'lucide-react';
import type { SupportedLanguage } from '../../types';
import type { UnifiedAnatomicalStructure } from '../../lib/surgicalAtlasCatalog';
import {
  getAtlasCopy,
  type VisualizationMode,
} from '../../lib/atlas/atlasI18n';
import {
  buildBodyPartsAssetUrl,
  resolveBodyPartsComponents,
  type BodyPartsMeshAsset,
} from '../../lib/atlas/bodypartsClient';
import { getKnowledgeProfile } from '../../lib/atlas/atlasKnowledgeRegistry';

export type OrganPerspective = 'front' | 'back' | 'medial' | 'lateral' | 'superior' | 'inferior' | 'oblique';

const ORGAN_CAM_DIRS: Record<OrganPerspective, [number, number, number]> = {
  front: [0, 0.12, 1],
  back: [0, 0.12, -1],
  medial: [-1, 0.08, 0.15],
  lateral: [1, 0.08, 0.15],
  superior: [0, 1, 0.12],
  inferior: [0, -1, 0.25],
  oblique: [0.72, 0.45, 0.85],
};

export interface LoadedOrganComponent {
  id: string;
  name: string;
  fjId?: string;
  fmaId?: string;
  system?: string;
  visible: boolean;
  meshCount: number;
}

export interface OrganDimensions {
  widthMm: number;
  heightMm: number;
  depthMm: number;
  sourceLabel: string;
}

export interface OrganFocusViewerProps {
  language: SupportedLanguage;
  selectedStructure: UnifiedAnatomicalStructure | null;
  clonedGlbGroup: THREE.Group | null;
  directBodyPartsAsset?: BodyPartsMeshAsset | null;
  vizMode: VisualizationMode;
  deepMode: boolean;
  sectionRatio: number;
  isolatedSubPartId: string | null;
  hiddenSubPartIds: Set<string>;
  onSelectSubPart?: (subPart: LoadedOrganComponent | null) => void;
  onComponentsLoaded?: (components: LoadedOrganComponent[], dims: OrganDimensions | null) => void;
  onSyncHighlightBody?: () => void;
}

function colorForBodyPartsAsset(asset: BodyPartsMeshAsset): number {
  const n = asset.name.toLowerCase();
  if (n.includes('vein') || n.includes('venous') || n.includes('vena cava') || n.includes('sinus')) return 0x2563eb;
  if (asset.system === 'vessels' || n.includes('artery') || n.includes('aorta') || n.includes('coronary')) return 0xdc2626;
  if (asset.system === 'nerves' || n.includes('nerve') || n.includes('plexus')) return 0xfacc15;
  if (asset.system === 'skeleton') return 0xe2e8f0;
  if (asset.system === 'muscles') return 0xb91c1c;
  if (asset.system === 'joints') return 0xff9a3c;
  return 0xd96b52;
}

export const OrganFocusViewer: React.FC<OrganFocusViewerProps> = ({
  language,
  selectedStructure,
  clonedGlbGroup,
  directBodyPartsAsset = null,
  vizMode,
  deepMode,
  sectionRatio,
  isolatedSubPartId,
  hiddenSubPartIds,
  onSelectSubPart,
  onComponentsLoaded,
  onSyncHighlightBody,
}) => {
  const t = getAtlasCopy(language);
  const mountRef = useRef<HTMLDivElement | null>(null);

  const [organOpacity, setOrganOpacity] = useState(1);
  const [perspective, setPerspective] = useState<OrganPerspective>('oblique');
  const [streamingTigris, setStreamingTigris] = useState(false);
  const [loadedSource, setLoadedSource] = useState<'glb' | 'bodyparts3d' | 'none'>('none');
  const [loadedParts, setLoadedParts] = useState<LoadedOrganComponent[]>([]);
  const [activeSubPartId, setActiveSubPartId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<OrganDimensions | null>(null);
  const [tigrisProgress, setTigrisProgress] = useState<{ loaded: number; total: number }>({ loaded: 0, total: 0 });

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const assemblyRootRef = useRef<THREE.Group | null>(null);
  const subGroupsRef = useRef<Map<string, { group: THREE.Object3D; baseColors: Map<THREE.Mesh, THREE.Color>; meta: LoadedOrganComponent }>>(new Map());
  const clipPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, -1, 0), 5));
  const cameraTweenRef = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const requestRenderRef = useRef<() => void>(() => {});
  const onSelectSubPartRef = useRef(onSelectSubPart);
  const onComponentsLoadedRef = useRef(onComponentsLoaded);
  onSelectSubPartRef.current = onSelectSubPart;
  onComponentsLoadedRef.current = onComponentsLoaded;

  const disposeObjectGroup = (group: THREE.Object3D) => {
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose();
        if (Array.isArray(m.material)) {
          m.material.forEach((mat) => mat.dispose());
        } else if (m.material) {
          m.material.dispose();
        }
      }
    });
  };

  // Apply visibility, opacity, mode, clipping, and highlight inside the organ scene
  const applyOrganStyling = useCallback(() => {
    const clipEnabled = sectionRatio > 0.01;
    clipPlaneRef.current.constant = clipEnabled ? 1.15 - sectionRatio * 2.2 : 5;

    subGroupsRef.current.forEach(({ group, baseColors }, subId) => {
      const isIsolatedOut = isolatedSubPartId !== null && subId !== isolatedSubPartId;
      const isHidden = hiddenSubPartIds.has(subId);
      group.visible = !isIsolatedOut && !isHidden;

      const isActive = subId === activeSubPartId;

      group.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (!mat) return;
          const origColor = baseColors.get(mesh) || new THREE.Color('#d96b52');

          let opacity = organOpacity;
          let emissiveHex = 0x000000;
          let emissiveInt = 0;

          if (vizMode === 'holographic') {
            mat.color.copy(origColor).lerp(new THREE.Color('#00D9FF'), 0.48);
            opacity = Math.min(opacity, 0.78);
            emissiveHex = 0x0284c7;
            emissiveInt = 0.28;
          } else {
            mat.color.copy(origColor);
          }

          if (isActive) {
            emissiveHex = 0x00d9ff;
            emissiveInt = 0.52;
            opacity = 1;
          }

          mat.opacity = Math.max(0.05, Math.min(1, opacity));
          mat.transparent = mat.opacity < 0.99;
          mat.depthWrite = !mat.transparent;
          mat.emissive.setHex(emissiveHex);
          mat.emissiveIntensity = emissiveInt;
          mat.clippingPlanes = clipEnabled ? [clipPlaneRef.current] : [];
          mat.needsUpdate = true;
        }
      });
    });

    requestRenderRef.current();
  }, [organOpacity, vizMode, sectionRatio, isolatedSubPartId, hiddenSubPartIds, activeSubPartId]);

  useEffect(() => {
    applyOrganStyling();
  }, [applyOrganStyling]);

  // Initialize independent WebGL scene once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return;
    }

    const w = Math.max(180, mount.clientWidth);
    const h = Math.max(180, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.localClippingEnabled = true;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.65;

    const hemi = new THREE.HemisphereLight(0x8beaff, 0x071426, 0.9);
    scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xf3f8ff, 1.45);
    keyLight.position.set(2.5, 3.0, 2.8);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x00d9ff, 0.95);
    rimLight.position.set(-2.5, 1.5, -2.5);
    scene.add(rimLight);

    // Holographic pedestal ring below organ
    const pedGeo = new THREE.RingGeometry(0.68, 0.72, 64);
    pedGeo.rotateX(-Math.PI / 2);
    const pedMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.42,
      side: THREE.DoubleSide,
    });
    const ped = new THREE.Mesh(pedGeo, pedMat);
    ped.position.y = -0.92;
    scene.add(ped);

    const assemblyRoot = new THREE.Group();
    scene.add(assemblyRoot);
    assemblyRootRef.current = assemblyRoot;

    const camera = new THREE.PerspectiveCamera(36, w / h, 0.04, 40);
    camera.position.set(1.9, 1.15, 2.2);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.45;
    controls.maxDistance = 6.5;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI; // Full 360-degree inspection across all axes
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    let rafId = 0;
    let renderQueued = false;

    const renderFrame = () => {
      renderQueued = false;
      if (disposed) return;

      let keep = controls.update();
      if (cameraTweenRef.current) {
        const tw = cameraTweenRef.current;
        camera.position.lerp(tw.pos, 0.16);
        controls.target.lerp(tw.target, 0.16);
        if (camera.position.distanceTo(tw.pos) < 0.015) {
          camera.position.copy(tw.pos);
          controls.target.copy(tw.target);
          cameraTweenRef.current = null;
        } else {
          keep = true;
        }
      }

      renderer.render(scene, camera);
      if (keep) requestRender();
    };

    const requestRender = () => {
      if (disposed || renderQueued) return;
      renderQueued = true;
      rafId = window.requestAnimationFrame(renderFrame);
    };
    requestRenderRef.current = requestRender;
    controls.addEventListener('change', requestRender);

    // Raycast sub-parts inside the organ viewer
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const onDown = (e: PointerEvent) => {
      downX = e.clientX;
      downY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const meshes: THREE.Mesh[] = [];
      subGroupsRef.current.forEach(({ group }) => {
        if (!group.visible) return;
        group.traverse((o) => {
          if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
        });
      });

      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length > 0) {
        let curr: THREE.Object3D | null = hits[0].object;
        while (curr && !curr.userData?.organSubPartId) {
          curr = curr.parent;
        }
        const subId = (curr?.userData?.organSubPartId as string) || null;
        setActiveSubPartId(subId);
        if (subId && subGroupsRef.current.has(subId)) {
          onSelectSubPartRef.current?.(subGroupsRef.current.get(subId)!.meta);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);

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
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      if (assemblyRootRef.current) disposeObjectGroup(assemblyRootRef.current);
      subGroupsRef.current.clear();
      pedGeo.dispose();
      pedMat.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Load selected organ: instant cloned GLB + progressive BodyParts3D 4.3 OBJ assembly from Tigris
  useEffect(() => {
    const assemblyRoot = assemblyRootRef.current;
    if (!assemblyRoot) return;

    let cancelled = false;

    const clearAssembly = () => {
      while (assemblyRoot.children.length > 0) {
        const ch = assemblyRoot.children[0];
        assemblyRoot.remove(ch);
        disposeObjectGroup(ch);
      }
      subGroupsRef.current.clear();
      setActiveSubPartId(null);
    };

    const normalizeAndMountGroup = (container: THREE.Group, isBodyPartsMm: boolean, sourceLabel: string) => {
      // BodyParts3D OBJs are Z-up in millimeters -> convert to Y-up
      if (isBodyPartsMm) {
        container.rotation.x = -Math.PI / 2;
      }
      container.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(container);
      if (box.isEmpty()) return;

      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const scaleFactor = isBodyPartsMm ? 1 : 1000;
      const dims: OrganDimensions = {
        widthMm: Math.round(size.x * scaleFactor),
        heightMm: Math.round(size.y * scaleFactor),
        depthMm: Math.round(size.z * scaleFactor),
        sourceLabel,
      };
      setDimensions(dims);

      const maxDim = Math.max(size.x, size.y, size.z, 0.001);
      const normScale = 1.48 / maxDim;
      container.scale.setScalar(normScale);
      container.position.set(
        -center.x * normScale,
        -center.y * normScale,
        -center.z * normScale,
      );
      container.updateMatrixWorld(true);

      const metas: LoadedOrganComponent[] = [];
      subGroupsRef.current.forEach(({ meta }) => metas.push(meta));
      setLoadedParts(metas);
      onComponentsLoadedRef.current?.(metas, dims);
      applyOrganStyling();
      requestRenderRef.current();
    };

    clearAssembly();

    // Case 1: User picked an individual BodyParts3D 4.3 OBJ mesh directly from the Tigris catalog
    if (directBodyPartsAsset) {
      setStreamingTigris(true);
      setTigrisProgress({ loaded: 0, total: 1 });
      setLoadedSource('bodyparts3d');

      const loader = new OBJLoader();
      const container = new THREE.Group();
      assemblyRoot.add(container);

      loader.load(
        buildBodyPartsAssetUrl(directBodyPartsAsset.s3Key),
        (objGroup) => {
          if (cancelled) {
            disposeObjectGroup(objGroup);
            return;
          }
          const baseColors = new Map<THREE.Mesh, THREE.Color>();
          const hex = colorForBodyPartsAsset(directBodyPartsAsset);
          let meshCount = 0;
          objGroup.userData.organSubPartId = directBodyPartsAsset.fjId;

          objGroup.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const m = child as THREE.Mesh;
              m.geometry.computeVertexNormals();
              const baseColor = new THREE.Color(hex);
              m.material = new THREE.MeshStandardMaterial({
                color: baseColor,
                roughness: directBodyPartsAsset.system === 'vessels' ? 0.3 : 0.42,
                metalness: directBodyPartsAsset.system === 'vessels' ? 0.14 : 0.06,
                side: THREE.DoubleSide,
              });
              baseColors.set(m, baseColor);
              meshCount++;
            }
          });

          const meta: LoadedOrganComponent = {
            id: directBodyPartsAsset.fjId,
            name: directBodyPartsAsset.name,
            fjId: directBodyPartsAsset.fjId,
            fmaId: directBodyPartsAsset.fmaId,
            system: directBodyPartsAsset.system,
            visible: true,
            meshCount,
          };
          subGroupsRef.current.set(directBodyPartsAsset.fjId, {
            group: objGroup,
            baseColors,
            meta,
          });
          container.add(objGroup);
          normalizeAndMountGroup(container, true, `BodyParts3D 4.3 (${directBodyPartsAsset.fjId})`);
          setTigrisProgress({ loaded: 1, total: 1 });
          setStreamingTigris(false);
        },
        undefined,
        () => {
          if (!cancelled) setStreamingTigris(false);
        },
      );

      return () => {
        cancelled = true;
      };
    }

    // Case 2: User selected a GLB structure -> mount instant GLB clone first, then upgrade progressively with BodyParts3D 4.3 components
    if (clonedGlbGroup && selectedStructure) {
      const container = new THREE.Group();
      assemblyRoot.add(container);

      const glbBaseColors = new Map<THREE.Mesh, THREE.Color>();
      let glbMeshCount = 0;
      const glbClone = clonedGlbGroup.clone();
      glbClone.userData.organSubPartId = selectedStructure.id;
      glbClone.traverse((o) => {
        if ((o as THREE.Mesh).isMesh) {
          const m = o as THREE.Mesh;
          const clonedMat = (m.material as THREE.MeshStandardMaterial).clone();
          clonedMat.opacity = 1;
          clonedMat.transparent = false;
          clonedMat.depthWrite = true;
          clonedMat.emissive.setHex(0x000000);
          m.material = clonedMat;
          glbBaseColors.set(m, clonedMat.color.clone());
          glbMeshCount++;
        }
      });

      subGroupsRef.current.set(selectedStructure.id, {
        group: glbClone,
        baseColors: glbBaseColors,
        meta: {
          id: selectedStructure.id,
          name: selectedStructure.label,
          fmaId: selectedStructure.fmaId,
          system: selectedStructure.system,
          visible: true,
          meshCount: glbMeshCount,
        },
      });
      container.add(glbClone);
      setLoadedSource('glb');
      normalizeAndMountGroup(container, false, 'GLB Surface Mesh');

      // Progressive upgrade with BodyParts3D 4.3 multi-part sub-components from Tigris S3
      const profile = getKnowledgeProfile(selectedStructure);
      const queryToUse = profile.bodyPartsSearchQueries[0] || selectedStructure.label.replace(/\([LR]\)/g, '').trim();

      setStreamingTigris(true);
      resolveBodyPartsComponents({
        fmaId: profile.bodyPartsFmaId,
        q: queryToUse,
        maxParts: 10,
      })
        .then(async (resolved) => {
          if (cancelled || resolved.components.length === 0) {
            if (!cancelled) setStreamingTigris(false);
            return;
          }

          const loader = new OBJLoader();
          const bp3dContainer = new THREE.Group();
          const loadedPairs: Array<{ asset: BodyPartsMeshAsset; obj: THREE.Group }> = [];
          setTigrisProgress({ loaded: 0, total: resolved.components.length });

          await Promise.all(
            resolved.components.map(
              (asset) =>
                new Promise<void>((resolveOne) => {
                  loader.load(
                    buildBodyPartsAssetUrl(asset.s3Key),
                    (objGroup) => {
                      if (!cancelled) {
                        loadedPairs.push({ asset, obj: objGroup });
                        setTigrisProgress((p) => ({ ...p, loaded: Math.min(p.total, p.loaded + 1) }));
                      } else {
                        disposeObjectGroup(objGroup);
                      }
                      resolveOne();
                    },
                    undefined,
                    () => resolveOne(),
                  );
                }),
            ),
          );

          if (cancelled || loadedPairs.length === 0) {
            if (!cancelled) setStreamingTigris(false);
            return;
          }

          // Swap cleanly from single-piece GLB clone to multi-part BodyParts3D 4.3 assembly
          clearAssembly();
          assemblyRoot.add(bp3dContainer);
          setLoadedSource('bodyparts3d');

          for (const { asset, obj } of loadedPairs) {
            const baseColors = new Map<THREE.Mesh, THREE.Color>();
            const hex = colorForBodyPartsAsset(asset);
            let meshCount = 0;
            obj.userData.organSubPartId = asset.fjId;

            obj.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh;
                m.geometry.computeVertexNormals();
                const c = new THREE.Color(hex);
                m.material = new THREE.MeshStandardMaterial({
                  color: c,
                  roughness: asset.system === 'vessels' ? 0.3 : 0.42,
                  metalness: asset.system === 'vessels' ? 0.14 : 0.06,
                  side: THREE.DoubleSide,
                });
                baseColors.set(m, c);
                meshCount++;
              }
            });

            subGroupsRef.current.set(asset.fjId, {
              group: obj,
              baseColors,
              meta: {
                id: asset.fjId,
                name: asset.name,
                fjId: asset.fjId,
                fmaId: asset.fmaId,
                system: asset.system,
                visible: true,
                meshCount,
              },
            });
            bp3dContainer.add(obj);
          }

          normalizeAndMountGroup(
            bp3dContainer,
            true,
            `BodyParts3D 4.3 Assembly (${loadedPairs.length} parts)`,
          );
          setStreamingTigris(false);
        })
        .catch(() => {
          if (!cancelled) setStreamingTigris(false);
        });
    } else {
      setLoadedSource('none');
      setLoadedParts([]);
      setDimensions(null);
    }

    return () => {
      cancelled = true;
    };
  }, [selectedStructure, clonedGlbGroup, directBodyPartsAsset, applyOrganStyling]);

  // Adjust camera distance smoothly when Deep Anatomy Mode toggles
  useEffect(() => {
    const dir = ORGAN_CAM_DIRS[perspective];
    const dist = deepMode ? 1.65 : 2.65;
    const len = Math.hypot(dir[0], dir[1], dir[2]) || 1;
    cameraTweenRef.current = {
      pos: new THREE.Vector3((dir[0] / len) * dist, (dir[1] / len) * dist, (dir[2] / len) * dist),
      target: new THREE.Vector3(0, 0, 0),
    };
    requestRenderRef.current();
  }, [deepMode, perspective]);

  const jumpOrganPerspective = (p: OrganPerspective) => {
    setPerspective(p);
  };

  return (
    <div className="relative flex flex-col w-full h-full bg-[#071426] border border-[#00D9FF]/25 rounded-2xl overflow-hidden">
      {/* Top Organ Viewer HUD Header */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#0B1B31] border-b border-[#258BFF]/25 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Crosshair size={14} className="text-[#00D9FF] shrink-0" />
            <span className="text-xs font-bold text-[#F3F8FF] truncate">
              {directBodyPartsAsset
                ? directBodyPartsAsset.name
                : selectedStructure?.label || 'Organ 3D Viewer'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#91A7C0] mt-0.5 truncate">
            <span>{loadedSource === 'bodyparts3d' ? t.bodyPartsVerifiedBadge : 'GLB 3D Mesh'}</span>
            {dimensions && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[#8BEAFF]">
                  {dimensions.widthMm}×{dimensions.heightMm}×{dimensions.depthMm} mm
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onSyncHighlightBody && (
            <button
              type="button"
              onClick={onSyncHighlightBody}
              title={t.syncHighlightBody}
              className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[#10243D] hover:bg-[#258BFF]/30 text-[#8BEAFF] border border-[#258BFF]/35 transition cursor-pointer whitespace-nowrap"
            >
              {t.syncHighlightBody}
            </button>
          )}
          <button
            type="button"
            onClick={() => jumpOrganPerspective('oblique')}
            title={t.resetView}
            className="p-1.5 rounded-lg bg-[#10243D] hover:bg-[#258BFF]/30 text-[#8BEAFF] border border-[#258BFF]/30 transition cursor-pointer"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Independent 3D Organ WebGL Viewport */}
      <div className="relative flex-1 min-h-[240px] bg-[radial-gradient(ellipse_at_center,_#102948_0%,_#08172B_58%,_#050E1C_100%)]">
        <div ref={mountRef} className="w-full h-full" />

        {/* Streaming BodyParts3D progress pill */}
        {streamingTigris && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-2 bg-[#071426]/90 border border-[#00D9FF]/45 rounded-lg px-2.5 py-1.5">
            <Loader2 size={13} className="text-[#00D9FF] animate-spin" />
            <span className="text-[10px] font-semibold text-[#F3F8FF]">
              {t.loadingTigris}{' '}
              {tigrisProgress.total > 0 && (
                <span className="font-mono tabular-nums text-[#8BEAFF]">
                  ({tigrisProgress.loaded}/{tigrisProgress.total})
                </span>
              )}
            </span>
          </div>
        )}

        {/* Sub-parts quick count */}
        {!streamingTigris && loadedParts.length > 1 && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-[#071426]/85 border border-[#258BFF]/35 rounded-lg px-2 py-1 text-[10px] text-[#8BEAFF]">
            <Layers size={11} className="text-[#00D9FF]" />
            <span className="font-mono tabular-nums">{loadedParts.length}</span>
            <span>components</span>
          </div>
        )}

        {/* Perspective presets bar */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-[#0B1B31]/90 border border-[#258BFF]/30 rounded-lg px-1.5 py-1 overflow-x-auto max-w-full">
            {(['oblique', 'front', 'back', 'medial', 'lateral', 'superior', 'inferior'] as OrganPerspective[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => jumpOrganPerspective(p)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer whitespace-nowrap ${
                  perspective === p
                    ? 'bg-[#258BFF] text-white'
                    : 'text-[#91A7C0] hover:text-[#F3F8FF]'
                }`}
              >
                {t.perspectives[p]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#0B1B31]/90 border border-[#258BFF]/30 rounded-lg px-2 py-1">
            <SlidersHorizontal size={11} className="text-[#00D9FF]" />
            <span className="text-[10px] text-[#91A7C0]">{t.opacity}</span>
            <input
              type="range"
              min={0.15}
              max={1}
              step={0.05}
              value={organOpacity}
              onChange={(e) => setOrganOpacity(Number(e.target.value))}
              className="w-16 accent-[#00D9FF] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Loaded Sub-Components Strip */}
      {loadedParts.length > 0 && (
        <div className="bg-[#0B1B31] border-t border-[#258BFF]/25 px-3 py-2 max-h-28 overflow-y-auto shrink-0">
          <div className="flex flex-wrap gap-1.5">
            {loadedParts.map((part) => {
              const isHidden = hiddenSubPartIds.has(part.id);
              const isIso = isolatedSubPartId === part.id;
              const isAct = activeSubPartId === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => {
                    setActiveSubPartId(part.id);
                    onSelectSubPart?.(part);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium border transition cursor-pointer ${
                    isAct || isIso
                      ? 'bg-[#00D9FF]/15 border-[#00D9FF] text-[#F3F8FF]'
                      : isHidden
                      ? 'bg-[#071426]/60 border-slate-700/50 text-slate-500 line-through'
                      : 'bg-[#10243D] border-[#258BFF]/30 text-[#8BEAFF] hover:border-[#00D9FF]/60'
                  }`}
                >
                  {isHidden ? <EyeOff size={10} /> : <Eye size={10} className="text-[#00D9FF]" />}
                  <span className="truncate max-w-[160px]">{part.name}</span>
                  {part.fjId && <span className="font-mono text-[9px] text-[#91A7C0]">{part.fjId}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
