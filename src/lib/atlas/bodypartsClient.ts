export type BodyPartsSystem =
  | 'vessels'
  | 'organs'
  | 'skeleton'
  | 'muscles'
  | 'nerves'
  | 'joints'
  | 'skin'
  | 'other';

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
  region: string;
  isVascularPriority: boolean;
}

export interface BodyPartsRegistryResponse {
  totalAssets: number;
  filteredCount: number;
  systemCounts: Record<BodyPartsSystem, number>;
  vascularCount: number;
  items: BodyPartsMeshAsset[];
}

export interface BodyPartsResolveResponse {
  fmaId: string | null;
  query: string;
  totalMatchedComponents: number;
  components: BodyPartsMeshAsset[];
}

const resolveCache = new Map<string, BodyPartsResolveResponse>();
const registryCache = new Map<string, BodyPartsRegistryResponse>();

export function buildBodyPartsAssetUrl(s3Key: string): string {
  return `/api/atlas/bodyparts/asset?key=${encodeURIComponent(s3Key)}`;
}

export async function fetchBodyPartsRegistry(params: {
  q?: string;
  system?: string;
  region?: string;
  vascularOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<BodyPartsRegistryResponse> {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  if (params.system) sp.set('system', params.system);
  if (params.region) sp.set('region', params.region);
  if (params.vascularOnly) sp.set('vascularOnly', 'true');
  sp.set('limit', String(params.limit ?? 50));
  sp.set('offset', String(params.offset ?? 0));

  const cacheKey = sp.toString();
  const hit = registryCache.get(cacheKey);
  if (hit) return hit;

  const res = await fetch(`/api/atlas/bodyparts/registry?${cacheKey}`);
  if (!res.ok) {
    throw new Error(`Registry HTTP ${res.status}`);
  }
  const data = (await res.json()) as BodyPartsRegistryResponse;
  registryCache.set(cacheKey, data);
  return data;
}

export async function resolveBodyPartsComponents(params: {
  fmaId?: string;
  q?: string;
  maxParts?: number;
}): Promise<BodyPartsResolveResponse> {
  const sp = new URLSearchParams();
  if (params.fmaId) sp.set('fmaId', params.fmaId);
  if (params.q) sp.set('q', params.q);
  sp.set('maxParts', String(params.maxParts ?? 16));

  const cacheKey = sp.toString();
  const hit = resolveCache.get(cacheKey);
  if (hit) return hit;

  const res = await fetch(`/api/atlas/bodyparts/resolve?${cacheKey}`);
  if (!res.ok) {
    throw new Error(`Resolve HTTP ${res.status}`);
  }
  const data = (await res.json()) as BodyPartsResolveResponse;
  resolveCache.set(cacheKey, data);
  return data;
}
