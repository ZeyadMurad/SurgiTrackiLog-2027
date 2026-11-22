import { listTigrisPrefix, getTigrisTextObject, type TigrisObjectSummary } from './tigrisClient';

export type BodyPartsSystem =
  | 'vessels'
  | 'organs'
  | 'skeleton'
  | 'muscles'
  | 'nerves'
  | 'joints'
  | 'skin'
  | 'other';

export type BodyPartsRegion =
  | 'head_neck'
  | 'thorax'
  | 'abdomen'
  | 'pelvis'
  | 'upper_limb'
  | 'lower_limb'
  | 'spine'
  | 'systemic';

export interface BodyPartsMeshAsset {
  fjId: string;
  bpId: string;
  fmaId: string;
  manifestFmaId?: string;
  name: string;
  s3Key: string;
  size: number;
  faces: number;
  verts: number;
  system: BodyPartsSystem;
  region: BodyPartsRegion;
  isVascularPriority: boolean;
}

export interface FmaAssemblyEntry {
  fmaId: string;
  relation: string;
  fjIds: string[];
}

interface RegistryCache {
  assets: BodyPartsMeshAsset[];
  byFjId: Map<string, BodyPartsMeshAsset>;
  fmaMap: Map<string, FmaAssemblyEntry>;
  systemCounts: Record<BodyPartsSystem, number>;
  vascularCount: number;
  loadedAt: number;
}

const REGISTRY_TTL_MS = 6 * 60 * 60 * 1000;
let cachedRegistry: RegistryCache | null = null;
let inflightLoad: Promise<RegistryCache> | null = null;

function classifySystem(name: string): BodyPartsSystem {
  const n = name.toLowerCase();
  if (
    /\b(artery|arteries|aorta|aortic|vein|veins|venous|vena cava|sinus|carotid|iliac|femoral|popliteal|tibial|brachial|radial|ulnar|subclavian|jugular|coronary|mesenteric|renal|celiac|pulmonary trunk|saphenous|portal|peroneal|fibular|basilic|cephalic|axillary|vertebral artery|basilar)\b/.test(n)
  ) {
    return 'vessels';
  }
  if (
    /\b(nerve|nerves|plexus|ganglion|spinal cord|brain|cerebr|cerebell|medulla|pons|midbrain|thalamus|hippocampus|amygdala|ventricle of brain|meninges|dura|sciatic|vagus|phrenic|median|ulnar nerve|radial nerve|femoral nerve|brachial plexus|cranial)\b/.test(n)
  ) {
    return 'nerves';
  }
  if (
    /\b(ligament|capsule|meniscus|articular|disc|cartilage|symphysis|joint)\b/.test(n)
  ) {
    return 'joints';
  }
  if (
    /\b(bone|bones|vertebra|rib|ribs|sternum|clavicle|scapula|humerus|radius|ulna|carpal|metacarpal|phalanx|pelvis|ilium|ischium|pubis|sacrum|coccyx|femur|patella|tibia|fibula|tarsal|metatarsal|calcaneus|talus|skull|cranium|mandible|maxilla|zygomatic|temporal|parietal|frontal|occipital|sphenoid|ethmoid|hyoid|tooth|molar|incisor|premolar|canine)\b/.test(n)
  ) {
    return 'skeleton';
  }
  if (
    /\b(muscle|muscles|diaphragm|tendon|aponeurosis|pectoralis|deltoid|biceps|triceps|rectus|oblique|gluteus|quadriceps|hamstring|gastrocnemius|soleus|trapezius|latissimus|sternocleidomastoid|masseter|temporalis|psoas|iliacus|sartorius|adductor)\b/.test(n)
  ) {
    return 'muscles';
  }
  if (/\b(skin|integument|subcutaneous|nipple|nail)\b/.test(n)) {
    return 'skin';
  }
  if (
    /\b(heart|atrium|ventricle|valve|pericardium|myocardium|lung|bronch|trachea|larynx|pharynx|liver|hepatic|gallbladder|bile|pancreas|spleen|stomach|esophagus|duodenum|jejunum|ileum|colon|cecum|appendix|rectum|kidney|ureter|bladder|urethra|thyroid|adrenal|thymus|pituitary|prostate|uterus|ovary|testis|eye|ear|tongue|salivary|parotid)\b/.test(n)
  ) {
    return 'organs';
  }
  return 'other';
}

function classifyRegion(name: string): BodyPartsRegion {
  const n = name.toLowerCase();
  if (
    /\b(brain|cerebr|skull|cranium|head|neck|carotid|jugular|thyroid|larynx|pharynx|eye|ear|tooth|molar|mandible|maxilla|tongue|parotid|facial|vagus|glossopharyngeal|hypoglossal)\b/.test(n)
  ) {
    return 'head_neck';
  }
  if (
    /\b(heart|coronary|atrium|ventricle|aorta|thoracic|lung|bronch|trachea|esophagus|rib|sternum|clavicle|mediastin|pericard|pulmonary|pectoral|intercostal|diaphragm|thymus)\b/.test(n)
  ) {
    return 'thorax';
  }
  if (
    /\b(liver|hepatic|gallbladder|stomach|spleen|pancreas|kidney|renal|adrenal|duodenum|jejunum|ileum|colon|cecum|appendix|mesenteric|celiac|portal|abdominal|vena cava|lumbar|psoas)\b/.test(n)
  ) {
    return 'abdomen';
  }
  if (/\b(pelvis|pelvic|iliac|bladder|ureter|rectum|uterus|ovary|prostate|sacrum|coccyx|ilium|ischium|pubis|glute)\b/.test(n)) {
    return 'pelvis';
  }
  if (
    /\b(shoulder|scapula|humerus|elbow|radius|ulna|wrist|hand|carpal|metacarpal|finger|brachial|axillary|subclavian|deltoid|biceps|triceps|cephalic|basilic)\b/.test(n)
  ) {
    return 'upper_limb';
  }
  if (
    /\b(hip|femur|femoral|thigh|knee|patella|popliteal|tibia|tibial|fibula|fibular|peroneal|ankle|foot|tarsal|metatarsal|toe|calcaneus|talus|saphenous|quadriceps|gastrocnemius|soleus|sciatic)\b/.test(n)
  ) {
    return 'lower_limb';
  }
  if (/\b(vertebra|spinal|spine|cervical|thoracic|lumbar)\b/.test(n)) {
    return 'spine';
  }
  return 'systemic';
}

function isVascularPriorityName(name: string): boolean {
  const n = name.toLowerCase();
  return /\b(aorta|aortic|iliac|femoral|popliteal|tibial|carotid|coronary|vena cava|jugular|subclavian|renal artery|renal vein|mesenteric|celiac|brachial|radial artery|ulnar artery|saphenous|pulmonary)\b/.test(
    n,
  );
}

function parseManifestCsv(csvText: string): Map<string, { fmaId: string; faces: number; verts: number }> {
  const map = new Map<string, { fmaId: string; faces: number; verts: number }>();
  const lines = csvText.split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    // fj_id,bp_id,fma_id,name,faces,verts,bytes,mtime
    const parts = line.split(',');
    if (parts.length < 7) continue;
    const fjId = parts[0].trim();
    const fmaId = parts[2].trim();
    const faces = Number(parts[parts.length - 4]) || 0;
    const verts = Number(parts[parts.length - 3]) || 0;
    if (fjId) {
      map.set(fjId, { fmaId, faces, verts });
    }
  }
  return map;
}

function parseFma2Obj(text: string): Map<string, FmaAssemblyEntry> {
  const map = new Map<string, FmaAssemblyEntry>();
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;
    const cols = line.split('\t');
    if (cols.length < 3) continue;
    const fmaId = cols[0].trim();
    const relation = cols[1].trim();
    const fjIds = cols[2]
      .split('+')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!fmaId || fjIds.length === 0) continue;
    const existing = map.get(fmaId);
    if (!existing || fjIds.length > existing.fjIds.length) {
      map.set(fmaId, { fmaId, relation, fjIds });
    }
  }
  return map;
}

function parseMeshFilename(obj: TigrisObjectSummary): {
  fjId: string;
  bpId: string;
  fmaId: string;
  name: string;
} | null {
  const prefix = 'BodyParts3D_4.3/meshes/';
  if (!obj.key.startsWith(prefix) || !obj.key.toLowerCase().endsWith('.obj')) return null;
  const base = obj.key.slice(prefix.length, -4);
  const firstSep = base.indexOf('_');
  const secondSep = firstSep !== -1 ? base.indexOf('_', firstSep + 1) : -1;
  const thirdSep = secondSep !== -1 ? base.indexOf('_', secondSep + 1) : -1;
  if (firstSep === -1 || secondSep === -1 || thirdSep === -1) return null;
  const fjId = base.slice(0, firstSep);
  const bpId = base.slice(firstSep + 1, secondSep);
  const fmaId = base.slice(secondSep + 1, thirdSep);
  const name = base.slice(thirdSep + 1);
  if (!fjId || !name) return null;
  return { fjId, bpId, fmaId, name };
}

async function listAllMeshObjects(): Promise<TigrisObjectSummary[]> {
  const all: TigrisObjectSummary[] = [];
  let token: string | undefined;
  let guard = 0;
  do {
    const page = await listTigrisPrefix('BodyParts3D_4.3/meshes/', 1000, undefined, token);
    all.push(...page.objects);
    token = page.isTruncated && page.nextContinuationToken ? page.nextContinuationToken : undefined;
    guard++;
  } while (token && guard < 12);
  return all;
}

export async function getBodyPartsRegistry(): Promise<RegistryCache> {
  if (cachedRegistry && Date.now() - cachedRegistry.loadedAt < REGISTRY_TTL_MS) {
    return cachedRegistry;
  }
  if (inflightLoad) {
    return inflightLoad;
  }

  inflightLoad = (async () => {
    const [meshObjects, manifestCsv, fma2ObjText] = await Promise.all([
      listAllMeshObjects(),
      getTigrisTextObject('BodyParts3D_4.3/MANIFEST.csv', 2 * 1024 * 1024).catch(() => ''),
      getTigrisTextObject('BodyParts3D_4.3/metadata/FMA2Obj.txt', 2 * 1024 * 1024).catch(() => ''),
    ]);

    const manifestMap = manifestCsv ? parseManifestCsv(manifestCsv) : new Map();
    const fmaMap = fma2ObjText ? parseFma2Obj(fma2ObjText) : new Map();

    const assets: BodyPartsMeshAsset[] = [];
    const byFjId = new Map<string, BodyPartsMeshAsset>();
    const systemCounts: Record<BodyPartsSystem, number> = {
      vessels: 0,
      organs: 0,
      skeleton: 0,
      muscles: 0,
      nerves: 0,
      joints: 0,
      skin: 0,
      other: 0,
    };
    let vascularCount = 0;

    for (const obj of meshObjects) {
      const parsed = parseMeshFilename(obj);
      if (!parsed) continue;
      const m = manifestMap.get(parsed.fjId);
      const system = classifySystem(parsed.name);
      const region = classifyRegion(parsed.name);
      const isVascularPriority = isVascularPriorityName(parsed.name);
      const asset: BodyPartsMeshAsset = {
        fjId: parsed.fjId,
        bpId: parsed.bpId,
        fmaId: parsed.fmaId,
        manifestFmaId: m?.fmaId,
        name: parsed.name,
        s3Key: obj.key,
        size: obj.size,
        faces: m?.faces || 0,
        verts: m?.verts || 0,
        system,
        region,
        isVascularPriority,
      };
      assets.push(asset);
      byFjId.set(parsed.fjId, asset);
      systemCounts[system] += 1;
      if (isVascularPriority) vascularCount += 1;
    }

    const reg: RegistryCache = {
      assets,
      byFjId,
      fmaMap,
      systemCounts,
      vascularCount,
      loadedAt: Date.now(),
    };
    cachedRegistry = reg;
    return reg;
  })();

  try {
    return await inflightLoad;
  } finally {
    inflightLoad = null;
  }
}

export async function searchBodyPartsRegistry(opts: {
  query?: string;
  system?: string;
  region?: string;
  vascularOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{
  totalAssets: number;
  filteredCount: number;
  systemCounts: Record<BodyPartsSystem, number>;
  vascularCount: number;
  items: BodyPartsMeshAsset[];
}> {
  const reg = await getBodyPartsRegistry();
  const q = (opts.query || '').trim().toLowerCase();
  const sys = (opts.system || '').trim().toLowerCase();
  const rgn = (opts.region || '').trim().toLowerCase();
  const vascularOnly = Boolean(opts.vascularOnly);
  const limit = Math.min(Math.max(1, opts.limit || 60), 200);
  const offset = Math.max(0, opts.offset || 0);

  let filtered = reg.assets;
  if (vascularOnly) {
    filtered = filtered.filter((a) => a.isVascularPriority || a.system === 'vessels');
  }
  if (sys && sys !== 'all') {
    filtered = filtered.filter((a) => a.system === sys);
  }
  if (rgn && rgn !== 'all') {
    filtered = filtered.filter((a) => a.region === rgn);
  }
  if (q) {
    const terms = q.split(/\s+/).filter(Boolean);
    filtered = filtered.filter((a) => {
      const hay = `${a.name} ${a.fjId} ${a.bpId} ${a.fmaId} ${a.manifestFmaId || ''}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }

  // Prioritize smaller/clean named structures and vascular priority when searching
  const sorted = [...filtered].sort((a, b) => {
    if (a.isVascularPriority !== b.isVascularPriority) {
      return a.isVascularPriority ? -1 : 1;
    }
    return a.name.length - b.name.length;
  });

  return {
    totalAssets: reg.assets.length,
    filteredCount: sorted.length,
    systemCounts: reg.systemCounts,
    vascularCount: reg.vascularCount,
    items: sorted.slice(offset, offset + limit),
  };
}

export async function resolveBodyPartsStructure(opts: {
  fmaId?: string;
  query?: string;
  maxParts?: number;
}): Promise<{
  fmaId: string | null;
  query: string;
  totalMatchedComponents: number;
  components: BodyPartsMeshAsset[];
}> {
  const reg = await getBodyPartsRegistry();
  const maxParts = Math.min(Math.max(1, opts.maxParts || 20), 40);
  const fmaId = (opts.fmaId || '').trim().toUpperCase();
  const query = (opts.query || '').trim().toLowerCase();

  const components: BodyPartsMeshAsset[] = [];
  const seen = new Set<string>();

  if (fmaId) {
    const entry = reg.fmaMap.get(fmaId);
    if (entry) {
      for (const fj of entry.fjIds) {
        const asset = reg.byFjId.get(fj);
        if (asset && !seen.has(asset.fjId)) {
          seen.add(asset.fjId);
          components.push(asset);
        }
      }
    }
    // Also include direct FMA filename matches if FMA2Obj returned fewer
    for (const a of reg.assets) {
      if ((a.fmaId.toUpperCase() === fmaId || a.manifestFmaId?.toUpperCase() === fmaId) && !seen.has(a.fjId)) {
        seen.add(a.fjId);
        components.push(a);
      }
    }
  }

  if (components.length === 0 && query) {
    const terms = query.split(/[\s,()/-]+/).filter((t) => t.length >= 2);
    for (const a of reg.assets) {
      const hay = `${a.name} ${a.fmaId}`.toLowerCase();
      if (terms.length > 0 && terms.every((t) => hay.includes(t)) && !seen.has(a.fjId)) {
        seen.add(a.fjId);
        components.push(a);
      }
    }
  }

  // Sort deterministically by size (keeps component loading progressive and snappy)
  const totalMatchedComponents = components.length;
  const prioritized = [...components]
    .sort((a, b) => a.size - b.size)
    .slice(0, maxParts);

  return {
    fmaId: fmaId || null,
    query: opts.query || '',
    totalMatchedComponents,
    components: prioritized,
  };
}
