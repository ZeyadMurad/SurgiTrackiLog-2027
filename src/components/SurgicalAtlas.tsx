// ============================================================================
// SurgicalAtlas.tsx — Interactive 3D Surgical Anatomy Atlas (Pure Three.js)
// ----------------------------------------------------------------------------
// Multi-part procedural anatomy groups: Skin, Muscle, Vessels, Nerves, Organs,
// Bones. Supports OrbitControls, coalesced on-demand rendering, software-WebGL
// guards, exponential damping for exploded layer view & camera presets,
// raycasting click inspection, and deep-linking into the Visual Library.
// ============================================================================

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Layers,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info,
  X,
  Eye,
  EyeOff,
  Activity,
  Play,
  Brain,
  Bone,
  Heart,
  Stethoscope,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SupportedLanguage } from '../types';

type LayerId = 'skin' | 'muscle' | 'vessels' | 'nerves' | 'organs' | 'bones';

interface SelectedStructureInfo {
  layerId: LayerId;
  name: string;
  description: string;
  dangerZone: string;
  procedure: string;
}

interface SurgicalAtlasProps {
  language: SupportedLanguage;
  onStructureClick?: (structure: string, relatedProcedure: string) => void;
}

const I18N = {
  en: {
    title: '3D Surgical Anatomy Atlas',
    subtitle: 'Rotate, zoom, toggle anatomical layers, or click any structure to explore danger zones and surgical videos',
    layers: 'Layers',
    showAll: 'Show All',
    hideAll: 'Hide All',
    resetView: 'Reset View',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    explode: 'Explode View',
    hideControls: 'Hide Controls',
    showControls: 'Show Controls',
    dangerZone: 'Surgical Danger Zone',
    clickToLearn: 'Click any 3D structure to inspect clinical landmarks & linked operative videos',
    watchVideo: 'Watch Related Video',
    relatedProcedure: 'Procedure',
    webglFallbackTitle: '3D Viewport Unavailable',
    webglFallbackBody: 'Your browser could not initialize a WebGL context. You can still inspect layer structures below.',
    skin: 'Skin & Subcutis',
    muscle: 'Abdominal Wall',
    vessels: 'Major Vessels',
    nerves: 'Nerve Plexus',
    organs: 'Viscera & Biliary',
    bones: 'Spine & Pelvis',
  },
  ar: {
    title: 'الأطلس الجراحي ثلاثي الأبعاد',
    subtitle: 'قم بالتدوير والتكبير وتبديل الطبقات أو النقر على أي بنية لاستكشاف مناطق الخطر والفيديوهات الجراحية',
    layers: 'الطبقات',
    showAll: 'إظهار الكل',
    hideAll: 'إخفاء الكل',
    resetView: 'إعادة الضبط',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    explode: 'تفكيك الطبقات',
    hideControls: 'إخفاء اللوحة',
    showControls: 'إظهار اللوحة',
    dangerZone: 'منطقة خطر جراحية',
    clickToLearn: 'انقر على أي بنية ثلاثية الأبعاد لعرض المعالم التشريحية والفيديو المرتبط',
    watchVideo: 'مشاهدة الفيديو المرتبط',
    relatedProcedure: 'الإجراء المرتبط',
    webglFallbackTitle: 'تعذر تشغيل العرض ثلاثي الأبعاد',
    webglFallbackBody: 'لم يتمكن المتصفح من تهيئة WebGL. يمكنك تصفح الطبقات والمعلومات أدناه.',
    skin: 'الجلد والنسيج تحت الجلد',
    muscle: 'عضلات جدار البطن',
    vessels: 'الأوعية الدموية الكبرى',
    nerves: 'الضفيرة والأعصاب',
    organs: 'الأحشاء والقنوات الصفراوية',
    bones: 'العمود الفقري والحوض',
  },
  de: {
    title: '3D-Chirurgischer Anatomie-Atlas',
    subtitle: 'Drehen, zoomen, Schichten ein-/ausblenden oder auf Strukturen klicken für Gefahrenzonen & OP-Videos',
    layers: 'Schichten',
    showAll: 'Alle zeigen',
    hideAll: 'Alle ausblenden',
    resetView: 'Ansicht zurücksetzen',
    zoomIn: 'Vergrößern',
    zoomOut: 'Verkleinern',
    explode: 'Explosionsansicht',
    hideControls: 'Steuerung ausblenden',
    showControls: 'Steuerung anzeigen',
    dangerZone: 'Chirurgische Gefahrenzone',
    clickToLearn: 'Klicken Sie auf eine 3D-Struktur für anatomische Orientierungspunkte & OP-Videos',
    watchVideo: 'Passendes Video ansehen',
    relatedProcedure: 'Eingriff',
    webglFallbackTitle: '3D-Ansicht nicht verfügbar',
    webglFallbackBody: 'WebGL konnte nicht initialisiert werden. Sie können die Strukturen unten durchsuchen.',
    skin: 'Haut & Subkutis',
    muscle: 'Bauchwandmuskulatur',
    vessels: 'Große Gefäße',
    nerves: 'Nervengeflecht',
    organs: 'Organe & Gallenwege',
    bones: 'Wirbelsäule & Becken',
  },
} as const;

const STRUCTURE_META: Record<
  SupportedLanguage,
  Record<LayerId, Omit<SelectedStructureInfo, 'layerId'>>
> = {
  en: {
    skin: {
      name: 'Anterior Abdominal Skin & Fascia',
      description: 'Outer cutaneous envelope including the umbilical ring and Camper/Scarpa fascial planes for trocar placement.',
      dangerZone: 'Avoid the inferior epigastric vessels along the lateral rectus border during paramedian or lateral port entry.',
      procedure: 'laparoscopic cholecystectomy',
    },
    muscle: {
      name: 'Rectus Abdominis & Oblique Wall',
      description: 'Paired rectus abdominis muscles separated by the midline linea alba with tendinous intersections and bilateral oblique aponeuroses.',
      dangerZone: 'Arcuate line inferiorly lacks posterior rectus sheath — higher risk of epigastric hematoma and incisional herniation.',
      procedure: 'inguinal hernia repair',
    },
    vessels: {
      name: 'Abdominal Aorta, IVC & Iliac Bifurcation',
      description: 'Retroperitoneal great vessels with renal arteries, superior mesenteric trunk, and common iliac bifurcation at L4.',
      dangerZone: 'Primary Veress needle / optical trocar entry at the umbilicus lies directly anterior to the aortic bifurcation in thin patients.',
      procedure: 'vascular surgery',
    },
    nerves: {
      name: 'Femoral, Ilioinguinal & Autonomic Nerves',
      description: 'Lumbar plexus branches descending beneath the inguinal ligament alongside sympathetic peri-aortic fibers.',
      dangerZone: 'Triangle of Pain (lateral to gonadal vessels, below iliopubic tract): never place tacks here during laparoscopic TEP/TAPP hernia repair.',
      procedure: 'inguinal hernia repair',
    },
    organs: {
      name: 'Hepatobiliary System, Stomach & Bowel',
      description: 'Right/left hepatic lobes, gallbladder fundus, cystic duct & artery, J-shaped stomach, and coiled small bowel loops.',
      dangerZone: 'Calot’s triangle (hepatocystic triangle): achieve the Critical View of Safety before clipping any tubular structure to avoid common bile duct injury.',
      procedure: 'cholecystectomy',
    },
    bones: {
      name: 'Lumbar Spine (L1–L5) & Pelvic Ring',
      description: 'Articulated lumbar vertebral bodies, spinous/transverse processes, intervertebral discs, sacrum, and iliac crests.',
      dangerZone: 'Sacral promontory and presacral venous plexus carry high bleeding risk during rectopexy or sacrocolpopexy fixation.',
      procedure: 'spine surgery',
    },
  },
  ar: {
    skin: {
      name: 'الجلد واللفافة السطحية لجدار البطن',
      description: 'الغلاف الجلدي الخارجي مع حلقة السرة وطبقات لفافة كامبر وسكاربا لتحديد نقاط إدخال المناظير الجراحية.',
      dangerZone: 'تجنب الشريان الشرسوفي السفلي على الحافة الجانبية للعضلة المستقيمة أثناء إدخال المبازل الجانبية.',
      procedure: 'laparoscopic cholecystectomy',
    },
    muscle: {
      name: 'العضلة المستقيمة والمائلة البطنية',
      description: 'العضلتان المستقيمتان البطنيتان يفصلهما الخط الأبيض (Linea Alba) مع التقاطعات الوترية والعضلات المائلة.',
      dangerZone: 'أسفل الخط المقوس يغيب الغمد الخلفي للعضلة المستقيمة مما يزيد خطر الورم الدموي والفتق الجراحي.',
      procedure: 'inguinal hernia repair',
    },
    vessels: {
      name: 'الأبهر البطني والوريد الأجوف والتفرع الحرقفي',
      description: 'الأوعية الكبرى خلف الصفاق مع الشرايين الكلوية والشريان المساريقي العلوي والتفرع الحرقفي عند مستوى L4.',
      dangerZone: 'عند إدخال إبرة فيريس أو المبزل الأول عند السرة يقع التفرع الأبهري والوريد الأجوف مباشرة في الخلف لدى المرضى النحيفين.',
      procedure: 'vascular surgery',
    },
    nerves: {
      name: 'العصب الفخذي والأعصاب الأربية والضفيرة',
      description: 'فروع الضفيرة القطنية النازلة نحو الرباط الأربي والألياف العصبية المحيطة بالأبهر.',
      dangerZone: 'مثلث الألم (وحشي الأوعية التناسلية وأسفل السبيل الحرقفي العاني): يُمنع تثبيت الدبابيس الجراحية هنا في إصلاح الفتق بالمنظار.',
      procedure: 'inguinal hernia repair',
    },
    organs: {
      name: 'الكبد والمرارة والمعدة والأمعاء',
      description: 'فصا الكبد الأيمن والأيسر، قاع المرارة، القناة والشريان المراري، المعدة، وحلقات الأمعاء الدقيقة.',
      dangerZone: 'مثلث كالو: يجب تحقيق الرؤية الحرجة للسلامة (Critical View of Safety) قبل قص أي قناة لتجنب إصابة القناة الصفراوية الجامعة.',
      procedure: 'cholecystectomy',
    },
    bones: {
      name: 'العمود الفقري القطني (L1–L5) والحوض',
      description: 'أجسام الفقرات القطنية مع النتوءات الشوكية والمعترضة والأقراص الغضروفية والعجز وعظم الحرقفة.',
      dangerZone: 'النتوء العجزي والضفيرة الوريدية أمام العجز معرضان لنزيف شديد عند التثبيت الجراحي في الحوض.',
      procedure: 'spine surgery',
    },
  },
  de: {
    skin: {
      name: 'Bauchdecke, Haut & Subkutis',
      description: 'Kutane Hülle inklusive Nabelring sowie Camper- und Scarpa-Faszie als Leitstruktur für den Trokarzugang.',
      dangerZone: 'Verlauf der A. epigastrica inferior am lateralen Rektusrand bei lateralen Trokarzugängen beachten.',
      procedure: 'laparoscopic cholecystectomy',
    },
    muscle: {
      name: 'M. rectus abdominis & schräge Bauchmuskulatur',
      description: 'Paarige Rektusmuskulatur mit Linea alba, Intersectiones tendineae sowie M. obliquus externus beidseits.',
      dangerZone: 'Unterhalb der Linea arcuata fehlt das hintere Rektusscheidenblatt — erhöhtes Risiko für Rektusscheidenhämatome.',
      procedure: 'inguinal hernia repair',
    },
    vessels: {
      name: 'Aorta abdominalis, V. cava inferior & Iliakalgefäße',
      description: 'Retroperitoneale Hauptgefäße mit Nierenarterien, A. mesenterica superior und Bifurkation auf Höhe L4.',
      dangerZone: 'Bei schlanken Patienten liegt die Aortenbifurkation beim umbilikalen Veress-/Trokarzugang unmittelbar dorsal.',
      procedure: 'vascular surgery',
    },
    nerves: {
      name: 'N. femoralis, N. ilioinguinalis & Plexus',
      description: 'Äste des Plexus lumbalis unter dem Leistenband sowie periaortale autonome Nervenfasern.',
      dangerZone: 'Triangle of Pain (lateral der Testikulargefäße, kaudal des Tractus iliopubicus): Keine Tacker-Fixation bei TEP/TAPP.',
      procedure: 'inguinal hernia repair',
    },
    organs: {
      name: 'Leber, Gallenblase, Magen & Dünndarm',
      description: 'Rechter/linker Leberlappen, Gallenblasenfundus, Ductus cysticus, Magenkurvatur und Dünndarmschlingen.',
      dangerZone: 'Calot-Dreieck: Vor Durchtrennung stets den Critical View of Safety darstellen, um eine Gallengangsverletzung zu vermeiden.',
      procedure: 'cholecystectomy',
    },
    bones: {
      name: 'Lendenwirbelsäule (L1–L5) & Beckenring',
      description: 'Lendenwirbelkörper, Dorn- und Querfortsätze, Bandscheiben, Os sacrum und Darmbeinschaufeln.',
      dangerZone: 'Am Promontorium drohen bei Fixationsnähten Blutungen aus dem präsakralen Venenplexus.',
      procedure: 'spine surgery',
    },
  },
};

const LAYER_EXPLODE_OFFSETS: Record<LayerId, THREE.Vector3> = {
  skin: new THREE.Vector3(0, 0, 1.35),
  muscle: new THREE.Vector3(0, 0, 0.72),
  organs: new THREE.Vector3(0, 0.12, 0.22),
  vessels: new THREE.Vector3(-0.35, 0, -0.25),
  nerves: new THREE.Vector3(0.35, 0, -0.45),
  bones: new THREE.Vector3(0, 0, -0.95),
};

function makeTissueTexture(baseHex: string, fiberHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = fiberHex;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.28;
    for (let y = 0; y < 256; y += 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 256; x += 32) {
        ctx.lineTo(x, y + Math.sin(x * 0.08 + y * 0.05) * 3);
      }
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const _defaultCamPos = new THREE.Vector3(0.4, 0.25, 5.8);
const _defaultTarget = new THREE.Vector3(0, 0, 0.15);

export const SurgicalAtlas: React.FC<SurgicalAtlasProps> = ({ language, onStructureClick }) => {
  const t = I18N[language] || I18N.en;
  const metaMap = STRUCTURE_META[language] || STRUCTURE_META.en;
  const isRtl = language === 'ar';

  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [layers, setLayers] = useState<Record<LayerId, boolean>>({
    skin: true,
    muscle: true,
    vessels: true,
    nerves: true,
    organs: true,
    bones: true,
  });
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [selectedLayerId, setSelectedLayerId] = useState<LayerId | null>(null);

  // Mutable refs so scene stays mounted smoothly across UI state updates
  const layersRef = useRef(layers);
  const explodeTargetRef = useRef(explodeFactor);
  const selectedLayerRef = useRef<LayerId | null>(selectedLayerId);
  const requestRenderRef = useRef<() => void>(() => {});
  const resetActionRef = useRef<() => void>(() => {});
  const zoomActionRef = useRef<(factor: number) => void>(() => {});

  useEffect(() => {
    layersRef.current = layers;
    requestRenderRef.current();
  }, [layers]);

  useEffect(() => {
    explodeTargetRef.current = explodeFactor;
    requestRenderRef.current();
  }, [explodeFactor]);

  useEffect(() => {
    selectedLayerRef.current = selectedLayerId;
    requestRenderRef.current();
  }, [selectedLayerId]);

  const layerItems: { id: LayerId; label: string; color: string; icon: React.ElementType }[] = [
    { id: 'skin', label: t.skin, color: '#f59e0b', icon: Layers },
    { id: 'muscle', label: t.muscle, color: '#ef4444', icon: Activity },
    { id: 'organs', label: t.organs, color: '#10b981', icon: Stethoscope },
    { id: 'vessels', label: t.vessels, color: '#e11d48', icon: Heart },
    { id: 'nerves', label: t.nerves, color: '#facc15', icon: Brain },
    { id: 'bones', label: t.bones, color: '#cbd5e1', icon: Bone },
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 360);

    // Software WebGL detection (used strictly for render cost / pacing)
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
      setWebglError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d1a);
    scene.fog = new THREE.FogExp2(0x070d1a, 0.045);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 80);
    camera.position.copy(_defaultCamPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(_defaultTarget);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.6;
    controls.maxDistance = 11;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI - 0.25;

    // 3-Point Warm Key / Cool Fill / Rim Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e6, 1.9);
    keyLight.position.set(4.5, 6, 5.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -4;
      keyLight.shadow.camera.right = 4;
      keyLight.shadow.camera.top = 4;
      keyLight.shadow.camera.bottom = -4;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x2dd4bf, 0.95);
    rimLight.position.set(-5, 2.5, -4);
    scene.add(rimLight);

    // Subtle grounded anatomical pedestal & contact shadow
    const disposables: { dispose: () => void }[] = [envTex];
    const track = <T extends { dispose: () => void }>(item: T): T => {
      disposables.push(item);
      return item;
    };

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 12, 128, 128, 122);
      grad.addColorStop(0, 'rgba(0,0,0,0.65)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = track(new THREE.CanvasTexture(shadowCanvas));
    const shadowPlane = new THREE.Mesh(
      track(new THREE.PlaneGeometry(5.6, 5.6)),
      track(
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          depthWrite: false,
          opacity: 0.7,
        }),
      ),
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.18;
    scene.add(shadowPlane);

    const atlasRoot = new THREE.Group();
    scene.add(atlasRoot);

    const layerGroups: Record<LayerId, THREE.Group> = {
      skin: new THREE.Group(),
      muscle: new THREE.Group(),
      vessels: new THREE.Group(),
      nerves: new THREE.Group(),
      organs: new THREE.Group(),
      bones: new THREE.Group(),
    };
    const interactiveMeshes: THREE.Mesh[] = [];
    const layerMaterials: Record<LayerId, THREE.MeshPhysicalMaterial[]> = {
      skin: [],
      muscle: [],
      vessels: [],
      nerves: [],
      organs: [],
      bones: [],
    };

    const registerPart = (
      layerId: LayerId,
      mesh: THREE.Mesh,
      mat: THREE.MeshPhysicalMaterial,
    ) => {
      mesh.userData.layerId = layerId;
      mesh.castShadow = layerId !== 'skin';
      mesh.receiveShadow = true;
      interactiveMeshes.push(mesh);
      layerMaterials[layerId].push(mat);
      layerGroups[layerId].add(mesh);
    };

    // Procedural tissue textures
    const muscleTex = track(makeTissueTexture('#991b1b', '#fca5a5'));
    muscleTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // ------------------------------------------------------------------------
    // 1. SKIN LAYER (Outer semi-transparent abdominal torso silhouette + umbilicus)
    // ------------------------------------------------------------------------
    const skinProfile = [
      new THREE.Vector2(1.45, -1.75),
      new THREE.Vector2(1.62, -1.05),
      new THREE.Vector2(1.48, -0.1),
      new THREE.Vector2(1.68, 0.95),
      new THREE.Vector2(1.52, 1.75),
    ];
    const skinGeo = track(new THREE.LatheGeometry(skinProfile, 36));
    skinGeo.scale(1.08, 1, 0.72);
    const skinMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf6c29b,
        roughness: 0.45,
        metalness: 0.0,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        side: THREE.DoubleSide,
        clearcoat: 0.25,
      }),
    );
    const skinShell = new THREE.Mesh(skinGeo, skinMat);
    skinShell.renderOrder = 10;
    registerPart('skin', skinShell, skinMat);

    const umbilicusMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xe7a97c,
        roughness: 0.55,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      }),
    );
    const umbilicusRing = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.11, 0.035, 14, 28)),
      umbilicusMat,
    );
    umbilicusRing.position.set(0, -0.2, 1.08);
    umbilicusRing.renderOrder = 11;
    registerPart('skin', umbilicusRing, umbilicusMat);

    // ------------------------------------------------------------------------
    // 2. MUSCLE LAYER (Rectus abdominis + tendinous intersections + linea alba + obliques)
    // ------------------------------------------------------------------------
    const rectusMat = track(
      new THREE.MeshPhysicalMaterial({
        map: muscleTex,
        color: 0xdc2626,
        roughness: 0.48,
        metalness: 0.02,
        clearcoat: 0.3,
      }),
    );
    const fasciaMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf1f5f9,
        roughness: 0.38,
        metalness: 0.04,
      }),
    );
    const obliqueMat = track(
      new THREE.MeshPhysicalMaterial({
        map: muscleTex,
        color: 0xb91c1c,
        roughness: 0.58,
        metalness: 0.02,
      }),
    );

    // Linea alba central tendon
    const lineaAlba = new THREE.Mesh(
      track(new THREE.CapsuleGeometry(0.055, 2.35, 6, 12)),
      fasciaMat,
    );
    lineaAlba.position.set(0, 0.05, 0.88);
    lineaAlba.scale.set(1, 1, 0.55);
    registerPart('muscle', lineaAlba, fasciaMat);

    [-1, 1].forEach((side) => {
      // Paired rectus abdominis columns
      const rectus = new THREE.Mesh(
        track(new THREE.CapsuleGeometry(0.24, 2.15, 8, 18)),
        rectusMat,
      );
      rectus.position.set(side * 0.34, 0.04, 0.82);
      rectus.rotation.z = side * -0.04;
      rectus.scale.set(1.05, 1, 0.48);
      registerPart('muscle', rectus, rectusMat);

      // 3 tendinous intersections per side
      [-0.45, 0.2, 0.78].forEach((yPos) => {
        const band = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.46, 0.05, 0.24)),
          fasciaMat,
        );
        band.position.set(side * 0.34, yPos, 0.85);
        registerPart('muscle', band, fasciaMat);
      });

      // External oblique lateral wall
      const oblique = new THREE.Mesh(
        track(new THREE.CapsuleGeometry(0.32, 1.9, 8, 16)),
        obliqueMat,
      );
      oblique.position.set(side * 0.98, 0.05, 0.52);
      oblique.rotation.set(0.06, side * -0.45, side * -0.14);
      oblique.scale.set(0.95, 1, 0.42);
      registerPart('muscle', oblique, obliqueMat);
    });

    // ------------------------------------------------------------------------
    // 3. VESSELS LAYER (Aorta, IVC, Renal Arteries, SMA, Common Iliac Bifurcation)
    // ------------------------------------------------------------------------
    const arteryMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xe11d48,
        roughness: 0.32,
        metalness: 0.05,
        clearcoat: 0.55,
      }),
    );
    const veinMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x2563eb,
        roughness: 0.34,
        metalness: 0.05,
        clearcoat: 0.5,
      }),
    );

    const makeTube = (
      layerId: LayerId,
      pts: THREE.Vector3[],
      radius: number,
      mat: THREE.MeshPhysicalMaterial,
    ) => {
      const curve = new THREE.CatmullRomCurve3(pts);
      const geo = track(new THREE.TubeGeometry(curve, 24, radius, 12, false));
      const mesh = new THREE.Mesh(geo, mat);
      registerPart(layerId, mesh, mat);
    };

    // Abdominal Aorta
    makeTube(
      'vessels',
      [
        new THREE.Vector3(-0.08, 1.65, -0.15),
        new THREE.Vector3(-0.1, 0.8, -0.12),
        new THREE.Vector3(-0.08, -0.05, -0.08),
        new THREE.Vector3(-0.05, -0.42, -0.05),
      ],
      0.11,
      arteryMat,
    );
    // Iliac bifurcations (Left & Right)
    makeTube(
      'vessels',
      [
        new THREE.Vector3(-0.05, -0.4, -0.05),
        new THREE.Vector3(-0.34, -0.95, 0.02),
        new THREE.Vector3(-0.56, -1.65, 0.14),
      ],
      0.075,
      arteryMat,
    );
    makeTube(
      'vessels',
      [
        new THREE.Vector3(-0.05, -0.4, -0.05),
        new THREE.Vector3(0.28, -0.95, 0.02),
        new THREE.Vector3(0.54, -1.65, 0.14),
      ],
      0.075,
      arteryMat,
    );
    // Renal arteries & SMA
    makeTube(
      'vessels',
      [new THREE.Vector3(-0.09, 0.65, -0.1), new THREE.Vector3(-0.68, 0.6, -0.18)],
      0.045,
      arteryMat,
    );
    makeTube(
      'vessels',
      [new THREE.Vector3(-0.09, 0.65, -0.1), new THREE.Vector3(0.66, 0.62, -0.18)],
      0.045,
      arteryMat,
    );
    makeTube(
      'vessels',
      [
        new THREE.Vector3(-0.08, 0.82, -0.1),
        new THREE.Vector3(0.02, 0.5, 0.22),
        new THREE.Vector3(0.05, 0.05, 0.35),
      ],
      0.045,
      arteryMat,
    );
    // Inferior Vena Cava & Iliac veins
    makeTube(
      'vessels',
      [
        new THREE.Vector3(0.19, 1.68, -0.18),
        new THREE.Vector3(0.18, 0.7, -0.14),
        new THREE.Vector3(0.14, -0.48, -0.1),
      ],
      0.125,
      veinMat,
    );
    makeTube(
      'vessels',
      [
        new THREE.Vector3(0.14, -0.45, -0.1),
        new THREE.Vector3(-0.22, -1.02, -0.04),
        new THREE.Vector3(-0.46, -1.65, 0.08),
      ],
      0.08,
      veinMat,
    );
    makeTube(
      'vessels',
      [
        new THREE.Vector3(0.14, -0.45, -0.1),
        new THREE.Vector3(0.42, -1.02, -0.04),
        new THREE.Vector3(0.64, -1.65, 0.08),
      ],
      0.08,
      veinMat,
    );

    // ------------------------------------------------------------------------
    // 4. NERVES LAYER (Lumbar plexus, femoral, ilioinguinal & peri-aortic nerves)
    // ------------------------------------------------------------------------
    const nerveMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xfacc15,
        emissive: 0x713f12,
        emissiveIntensity: 0.28,
        roughness: 0.35,
        metalness: 0.05,
      }),
    );

    [-1, 1].forEach((side) => {
      // Femoral nerve trunk
      makeTube(
        'nerves',
        [
          new THREE.Vector3(side * 0.25, 0.45, -0.35),
          new THREE.Vector3(side * 0.56, -0.35, -0.15),
          new THREE.Vector3(side * 0.74, -1.55, 0.18),
        ],
        0.036,
        nerveMat,
      );
      // Ilioinguinal nerve curving anteriorly toward inguinal canal
      makeTube(
        'nerves',
        [
          new THREE.Vector3(side * 0.28, 0.75, -0.32),
          new THREE.Vector3(side * 0.85, 0.15, 0.1),
          new THREE.Vector3(side * 0.64, -0.95, 0.55),
        ],
        0.025,
        nerveMat,
      );
    });
    // Celiac / sympathetic ganglion ring
    const celiacNode = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.16, 0.026, 10, 24)),
      nerveMat,
    );
    celiacNode.position.set(-0.04, 0.92, -0.02);
    registerPart('nerves', celiacNode, nerveMat);

    // ------------------------------------------------------------------------
    // 5. ORGANS LAYER (Liver lobes, Gallbladder + Cystic Duct, Stomach, Intestines)
    // ------------------------------------------------------------------------
    const liverMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x7c2d12,
        roughness: 0.3,
        metalness: 0.02,
        clearcoat: 0.55,
      }),
    );
    const gallbladderMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x10b981,
        emissive: 0x064e3b,
        emissiveIntensity: 0.22,
        roughness: 0.24,
        metalness: 0.02,
        clearcoat: 0.75,
      }),
    );
    const stomachMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf472b6,
        roughness: 0.38,
        metalness: 0.02,
        clearcoat: 0.45,
      }),
    );
    const bowelMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xfb7185,
        roughness: 0.42,
        metalness: 0.02,
        clearcoat: 0.35,
      }),
    );

    // Right hepatic lobe (anatomically patient right = viewer left, -X)
    const rightLiver = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.56, 24, 24)),
      liverMat,
    );
    rightLiver.position.set(-0.55, 1.05, 0.22);
    rightLiver.scale.set(1.25, 0.85, 0.78);
    registerPart('organs', rightLiver, liverMat);

    // Left hepatic lobe
    const leftLiver = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.38, 22, 22)),
      liverMat,
    );
    leftLiver.position.set(0.18, 1.12, 0.3);
    leftLiver.scale.set(1.35, 0.65, 0.68);
    registerPart('organs', leftLiver, liverMat);

    // Gallbladder + Cystic duct
    const gbFundus = new THREE.Mesh(
      track(new THREE.CapsuleGeometry(0.12, 0.24, 10, 18)),
      gallbladderMat,
    );
    gbFundus.position.set(-0.42, 0.66, 0.48);
    gbFundus.rotation.set(0.45, 0, -0.5);
    registerPart('organs', gbFundus, gallbladderMat);

    makeTube(
      'organs',
      [
        new THREE.Vector3(-0.34, 0.72, 0.4),
        new THREE.Vector3(-0.18, 0.68, 0.28),
        new THREE.Vector3(-0.12, 0.42, 0.22),
      ],
      0.03,
      gallbladderMat,
    );

    // J-shaped Stomach
    makeTube(
      'organs',
      [
        new THREE.Vector3(0.28, 1.25, 0.16),
        new THREE.Vector3(0.62, 0.88, 0.26),
        new THREE.Vector3(0.56, 0.46, 0.34),
        new THREE.Vector3(0.15, 0.42, 0.32),
      ],
      0.22,
      stomachMat,
    );

    // Coiled small bowel loops
    const bowelPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 22; i++) {
      const tNorm = i / 22;
      const x = Math.sin(tNorm * Math.PI * 5) * 0.56;
      const y = -0.05 - tNorm * 1.15;
      const z = 0.24 + Math.cos(tNorm * Math.PI * 5) * 0.16;
      bowelPts.push(new THREE.Vector3(x, y, z));
    }
    makeTube('organs', bowelPts, 0.105, bowelMat);

    // ------------------------------------------------------------------------
    // 6. BONES LAYER (L1-L5 Vertebrae, Spinous Processes, Discs, Sacrum & Pelvis)
    // ------------------------------------------------------------------------
    const boneMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xe2e8f0,
        roughness: 0.68,
        metalness: 0.04,
      }),
    );
    const discMat = track(
      new THREE.MeshPhysicalMaterial({
        color: 0x94a3b8,
        roughness: 0.5,
        metalness: 0.05,
      }),
    );

    for (let v = 0; v < 5; v++) {
      const yPos = 1.25 - v * 0.42;
      const body = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.22, 0.24, 0.28, 18)),
        boneMat,
      );
      body.position.set(0, yPos, -0.58);
      registerPart('bones', body, boneMat);

      // Spinous process posterior
      const spinous = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.08, 0.16, 0.26)),
        boneMat,
      );
      spinous.position.set(0, yPos - 0.04, -0.82);
      registerPart('bones', spinous, boneMat);

      // Transverse processes
      const trans = new THREE.Mesh(
        track(new THREE.BoxGeometry(0.66, 0.08, 0.09)),
        boneMat,
      );
      trans.position.set(0, yPos, -0.7);
      registerPart('bones', trans, boneMat);

      if (v < 4) {
        const disc = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.21, 0.21, 0.09, 16)),
          discMat,
        );
        disc.position.set(0, yPos - 0.21, -0.58);
        registerPart('bones', disc, discMat);
      }
    }

    // Sacrum & bilateral iliac wings
    const sacrum = new THREE.Mesh(
      track(new THREE.ConeGeometry(0.36, 0.72, 16)),
      boneMat,
    );
    sacrum.rotation.x = Math.PI;
    sacrum.scale.set(1.2, 1, 0.55);
    sacrum.position.set(0, -1.05, -0.56);
    registerPart('bones', sacrum, boneMat);

    [-1, 1].forEach((side) => {
      const wing = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.55, 18, 18)),
        boneMat,
      );
      wing.position.set(side * 0.78, -1.05, -0.22);
      wing.scale.set(0.95, 1.1, 0.34);
      wing.rotation.y = side * -0.42;
      registerPart('bones', wing, boneMat);
    });

    (Object.keys(layerGroups) as LayerId[]).forEach((lid) => {
      atlasRoot.add(layerGroups[lid]);
    });

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // ------------------------------------------------------------------------
    // Coalesced On-Demand Rendering + Smooth Damped Transitions
    // ------------------------------------------------------------------------
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let disposed = false;
    let currentExplode = 0;
    let desiredCamDist = _defaultCamPos.distanceTo(_defaultTarget);
    let resettingCamera = false;
    let lastTime = performance.now();

    const _offsetVec = new THREE.Vector3();

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
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        let needsMore = false;

        // Layer visibility & smooth exploded separation
        const vis = layersRef.current;
        const targetExplode = explodeTargetRef.current;
        if (Math.abs(currentExplode - targetExplode) > 0.002) {
          currentExplode = THREE.MathUtils.damp(currentExplode, targetExplode, 8, dt || 0.016);
          needsMore = true;
        } else {
          currentExplode = targetExplode;
        }

        const activeSel = selectedLayerRef.current;
        (Object.keys(layerGroups) as LayerId[]).forEach((lid) => {
          const grp = layerGroups[lid];
          grp.visible = vis[lid];
          const off = LAYER_EXPLODE_OFFSETS[lid];
          grp.position.set(off.x * currentExplode, off.y * currentExplode, off.z * currentExplode);

          layerMaterials[lid].forEach((m) => {
            if (activeSel === lid) {
              m.emissiveIntensity = Math.max(m.emissiveIntensity, 0.42);
            } else if (lid === 'nerves') {
              m.emissiveIntensity = 0.28;
            } else if (lid === 'organs' && m === gallbladderMat) {
              m.emissiveIntensity = 0.22;
            } else {
              m.emissiveIntensity = 0;
            }
          });
        });

        // Smooth camera reset or zoom transition
        if (resettingCamera) {
          camera.position.lerp(_defaultCamPos, 1 - Math.exp(-8 * (dt || 0.016)));
          controls.target.lerp(_defaultTarget, 1 - Math.exp(-8 * (dt || 0.016)));
          if (
            camera.position.distanceTo(_defaultCamPos) < 0.02 &&
            controls.target.distanceTo(_defaultTarget) < 0.02
          ) {
            camera.position.copy(_defaultCamPos);
            controls.target.copy(_defaultTarget);
            resettingCamera = false;
          } else {
            needsMore = true;
          }
        } else {
          const curDist = camera.position.distanceTo(controls.target);
          if (Math.abs(curDist - desiredCamDist) > 0.02) {
            const nextDist = THREE.MathUtils.damp(curDist, desiredCamDist, 10, dt || 0.016);
            _offsetVec.subVectors(camera.position, controls.target).normalize().multiplyScalar(nextDist);
            camera.position.copy(controls.target).add(_offsetVec);
            needsMore = true;
          }
        }

        const didControlMove = controls.update();
        if (didControlMove && controls.enableDamping) {
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

    resetActionRef.current = () => {
      resettingCamera = true;
      desiredCamDist = _defaultCamPos.distanceTo(_defaultTarget);
      requestRender();
    };

    zoomActionRef.current = (factor: number) => {
      resettingCamera = false;
      desiredCamDist = THREE.MathUtils.clamp(desiredCamDist * factor, 2.7, 10.5);
      requestRender();
    };

    const onControlStart = () => {
      resettingCamera = false;
      desiredCamDist = camera.position.distanceTo(controls.target);
    };
    const onControlChange = () => {
      desiredCamDist = camera.position.distanceTo(controls.target);
      requestRender();
    };

    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Raycasting (click vs drag discrimination)
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let downX = 0;
    let downY = 0;

    const onPointerDown = (ev: PointerEvent) => {
      downX = ev.clientX;
      downY = ev.clientY;
    };

    const onPointerUp = (ev: PointerEvent) => {
      const moved = Math.hypot(ev.clientX - downX, ev.clientY - downY);
      if (moved > 5) return; // Ignore orbit drags

      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointerNdc, camera);
      const visibleMeshes = interactiveMeshes.filter((m) => m.parent?.visible);
      const hits = raycaster.intersectObjects(visibleMeshes, false);

      if (hits.length > 0) {
        const hitLayer = hits[0].object.userData.layerId as LayerId | undefined;
        if (hitLayer) {
          setSelectedLayerId(hitLayer);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || disposed) return;
      const w = Math.max(entry.contentRect.width, 280);
      const h = Math.max(entry.contentRect.height, 300);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    });
    resizeObserver.observe(container);

    // Initial render
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  const toggleLayer = (id: LayerId) => {
    setLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showAll = () => {
    setLayers({ skin: true, muscle: true, vessels: true, nerves: true, organs: true, bones: true });
  };

  const hideAll = () => {
    setLayers({ skin: false, muscle: false, vessels: false, nerves: false, organs: false, bones: false });
  };

  const selectedInfo: SelectedStructureInfo | null = selectedLayerId
    ? { layerId: selectedLayerId, ...metaMap[selectedLayerId] }
    : null;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full h-[640px] sm:h-[700px] rounded-2xl overflow-hidden border border-slate-800 bg-[#070D1A] shadow-xl select-none"
    >
      {/* Dedicated WebGL Mount Container */}
      {!webglError ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300">
          <Layers size={40} className="text-teal-400 mb-3" />
          <h3 className="text-base font-bold text-white">{t.webglFallbackTitle}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">{t.webglFallbackBody}</p>
        </div>
      )}

      {/* Minimal Top-Left Spec Badge (No backdrop-blur over WebGL) */}
      <div className="pointer-events-none absolute top-3 inset-x-3 flex items-start justify-between gap-3">
        <div
          className="pointer-events-auto max-w-md rounded-xl px-3.5 py-2.5 border border-slate-700/80 shadow-lg"
          style={{ backgroundColor: 'rgba(10, 15, 28, 0.92)' }}
        >
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-teal-400 shrink-0" />
            <h2 className="text-sm font-bold text-white">{t.title}</h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.subtitle}</p>
        </div>

        {/* Selected Structure Inspection Drawer (Top-Right / End, non-overlapping center) */}
        {selectedInfo && (
          <div
            className="pointer-events-auto w-80 max-w-[90vw] rounded-xl p-3.5 border border-teal-500/60 shadow-2xl text-slate-200"
            style={{ backgroundColor: 'rgba(10, 15, 28, 0.96)' }}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="text-xs font-extrabold text-white leading-snug">{selectedInfo.name}</h3>
              <button
                type="button"
                onClick={() => setSelectedLayerId(null)}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">{selectedInfo.description}</p>

            <div className="rounded-lg bg-rose-950/70 border border-rose-500/40 p-2.5 mb-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-300 mb-1">
                <AlertTriangle size={13} className="shrink-0" />
                <span>{t.dangerZone}</span>
              </div>
              <p className="text-[11px] text-rose-100/90 leading-relaxed">{selectedInfo.dangerZone}</p>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 truncate">
                {t.relatedProcedure}: <strong className="text-teal-300">{selectedInfo.procedure}</strong>
              </span>
              <button
                type="button"
                onClick={() => onStructureClick?.(selectedInfo.name, selectedInfo.procedure)}
                className="inline-flex items-center gap-1.5 bg-[#0D9488] hover:bg-teal-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shrink-0"
              >
                <Play size={12} />
                <span>{t.watchVideo}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unified Collapsible Bottom Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[min(940px,96%)] flex flex-col items-center gap-1.5 pointer-events-none">
        <button
          type="button"
          onClick={() => setControlsCollapsed((v) => !v)}
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-700 text-[11px] font-semibold text-slate-200 hover:text-white cursor-pointer shadow"
          style={{ backgroundColor: 'rgba(10, 15, 28, 0.94)' }}
        >
          {controlsCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          <span>{controlsCollapsed ? t.showControls : t.hideControls}</span>
        </button>

        {!controlsCollapsed && (
          <div
            className="pointer-events-auto w-full rounded-xl border border-slate-700/90 p-3 shadow-2xl space-y-2.5"
            style={{ backgroundColor: 'rgba(10, 15, 28, 0.94)' }}
          >
            {/* Layer Visibility Row */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 me-1 flex items-center gap-1">
                <Layers size={13} className="text-teal-400" />
                {t.layers}:
              </span>
              {layerItems.map((item) => {
                const Icon = item.icon;
                const active = layers[item.id];
                const isSelected = selectedLayerId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleLayer(item.id)}
                    onDoubleClick={() => setSelectedLayerId(item.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer"
                    style={{
                      backgroundColor: active ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.65)',
                      borderColor: isSelected ? '#14b8a6' : active ? item.color : '#334155',
                      color: active ? '#f8fafc' : '#64748b',
                      opacity: active ? 1 : 0.7,
                    }}
                  >
                    <Icon size={13} style={{ color: active ? item.color : '#64748b' }} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="ms-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={showAll}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 cursor-pointer"
                >
                  <Eye size={12} /> {t.showAll}
                </button>
                <button
                  type="button"
                  onClick={hideAll}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 cursor-pointer"
                >
                  <EyeOff size={12} /> {t.hideAll}
                </button>
              </div>
            </div>

            {/* Explode Slider + Camera Tools Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800">
              <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-300 flex-1 min-w-[200px]">
                <span className="whitespace-nowrap">{t.explode}</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={explodeFactor}
                  onChange={(e) => setExplodeFactor(parseFloat(e.target.value))}
                  className="w-full max-w-[220px] accent-teal-500 cursor-pointer"
                />
                <span className="font-mono text-[10px] text-teal-300 w-9 tabular-nums">
                  {Math.round(explodeFactor * 100)}%
                </span>
              </label>

              {!selectedInfo && (
                <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Info size={13} className="text-teal-400 shrink-0" />
                  <span>{t.clickToLearn}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => zoomActionRef.current(0.82)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 cursor-pointer"
                  title={t.zoomIn}
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => zoomActionRef.current(1.22)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 cursor-pointer"
                  title={t.zoomOut}
                >
                  <ZoomOut size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => resetActionRef.current()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 cursor-pointer"
                >
                  <RotateCcw size={13} /> {t.resetView}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurgicalAtlas;
