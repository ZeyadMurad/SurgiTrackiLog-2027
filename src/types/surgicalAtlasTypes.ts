// ============================================================================
// surgicalAtlasTypes.ts — Complete Data Architecture for Surgical Atlas 3D
// ----------------------------------------------------------------------------
// 13 TypeScript entities that extend the existing SurgiTrack iLog schema.
// Add this file at: src/types/surgicalAtlasTypes.ts
// Then add `export * from './surgicalAtlasTypes';` to src/types/index.ts
// ============================================================================

import type { SupportedLanguage } from './index';

// ============================================================================
// ENUMS
// ============================================================================

export type AnatomicalSystemId =
  | 'skin_subcutaneous'
  | 'muscular'
  | 'skeletal'
  | 'arterial'
  | 'venous'
  | 'nervous'
  | 'internal_organs'
  | 'lymphatic'
  | 'ligaments_tendons'
  | 'fascia_connective';

export type AnatomicalRegionId =
  | 'head_neck'
  | 'thorax'
  | 'abdomen_pelvis'
  | 'back_spine'
  | 'upper_limb'
  | 'lower_limb'
  | 'whole_body';

export type BiologicalSex = 'male' | 'female';

export type AssetSourceId =
  | 'l1a6_atlas'
  | 'open_anatomy_3d'
  | 'mnemoatlas'
  | 'z_anatomy'
  | 'hubmap_hra'
  | 'bodyparts3d'
  | 'surgitrack_internal';

export type AssetFormat = 'glb' | 'gltf' | 'obj' | 'vtk' | 'stl' | 'fbx';

export type CompressionType = 'none' | 'draco' | 'meshopt' | 'manual';

export type StructureAvailability = 'available' | 'partial' | 'planned' | 'pending';

export type LicenseId =
  | 'MIT'
  | 'CC-BY-4.0'
  | 'CC-BY-SA-2.1-JP'
  | 'CC-BY-SA-4.0'
  | 'CC0-1.0'
  | 'proprietary'
  | 'surgitrack_internal';

// ============================================================================
// CORE ANATOMICAL ENTITIES
// ============================================================================

/**
 * 1. AnatomySystem — One of the 10 anatomical systems.
 * Each system has independent visibility controls in the viewer.
 */
export interface AnatomySystem {
  id: AnatomicalSystemId;
  names: LocalizedText;
  description: LocalizedText;
  /** Default color used for highlighting structures of this system */
  defaultColor: string;
  /** Icon (lucide-react name) */
  icon: string;
  /** Default visibility on first load */
  defaultVisible: boolean;
  /** Order in the layer panel */
  order: number;
}

/**
 * 2. AnatomyRegion — A top-level body region.
 * Used for lazy-loading anatomical assets by body part.
 */
export interface AnatomyRegion {
  id: AnatomicalRegionId;
  names: LocalizedText;
  description: LocalizedText;
  /** Bounding box in 3D space (used for "focus region" camera animation) */
  boundingBox: BoundingBox3D;
  /** Order of regions in the navigation */
  order: number;
}

/**
 * 3. AnatomyStructure — A single selectable anatomical structure.
 * This is the atomic unit of the atlas. A structure has its own mesh,
 * can be highlighted, isolated, and linked to surgical procedures.
 */
export interface AnatomyStructure {
  id: string;                      // Stable internal ID, e.g. "femoral_artery_right"
  systemId: AnatomicalSystemId;
  regionId: AnatomicalRegionId;
  biologicalSex: BiologicalSex | 'both';

  /** Localized anatomical names */
  names: LocalizedText;
  /** Latin anatomical name (Terminologia Anatomica) */
  latinName?: string;
  /** Synonyms for search */
  synonyms: LocalizedText[];
  /** TA2 code if available */
  ta2Code?: string;
  /** FMA ID if available */
  fmaId?: string;
  /** Original source ID (e.g. BodyParts3D segment ID) */
  sourceOriginalId?: string;

  /** Clinical and educational info (all optional — only fill what applies) */
  origin?: LocalizedText;          // for muscles
  insertion?: LocalizedText;       // for muscles
  course?: LocalizedText;          // for vessels/nerves
  branches?: LocalizedText;        // for vessels
  bloodSupply?: LocalizedText;
  venousDrainage?: LocalizedText;
  innervation?: LocalizedText;
  anatomicalRelations?: LocalizedText;
  function?: LocalizedText;
  clinicalSignificance?: LocalizedText;
  surgicalRelevance?: LocalizedText;

  /** Asset linkage */
  assetId?: string;                // FK to AnatomyAsset
  /** Default color when not highlighted */
  defaultColor?: string;
  /** Bounding box for camera focus */
  boundingBox?: BoundingBox3D;
  /** Hierarchical parent (e.g. "femoral artery" parent = "lower limb arterial") */
  parentId?: string;
  /** True if this structure's geometry is actually available (vs planned) */
  availability: StructureAvailability;

  createdAt: string;
  updatedAt: string;
}

/**
 * 4. AnatomyAsset — A 3D model file (GLB, GLTF, OBJ).
 * Assets are loaded by region. Each asset may contain many meshes,
 * each linked to an AnatomyStructure via `structureId`.
 */
export interface AnatomyAsset {
  id: string;
  sourceId: AssetSourceId;
  /** Path relative to /public/models/ — e.g. "male/thigh/femoral_triangle.glb" */
  filePath: string;
  format: AssetFormat;
  /** Compression applied to the file */
  compression: CompressionType;
  /** File size in bytes */
  fileSizeBytes: number;
  /** MD5 or SHA-256 checksum for integrity verification */
  checksum?: string;
  /** Stable IDs of structures contained in this asset */
  containedStructureIds: string[];
  /** Region this asset belongs to (for lazy loading) */
  regionId: AnatomicalRegionId;
  biologicalSex: BiologicalSex | 'both';
  /** License under which this asset is used */
  licenseId: LicenseId;
  /** Attribution text required by the license */
  attribution: string;
  /** Whether asset has been actually downloaded and verified */
  downloadStatus: 'verified' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
}

/**
 * 5. LocalizedText — Multilingual text container.
 * Used across all anatomical entities.
 */
export interface LocalizedText {
  en: string;
  ar?: string;
  de?: string;
  latin?: string;
}

/**
 * 6. BoundingBox3D — AABB in 3D space (for camera focus).
 */
export interface BoundingBox3D {
  min: [number, number, number];
  max: [number, number, number];
}

// ============================================================================
// SURGICAL INTELLIGENCE ENTITIES
// ============================================================================

/**
 * 7. SurgicalProcedure — A named surgical procedure (not a patient case).
 * Example: "Laparoscopic Cholecystectomy", "Carotid Endarterectomy".
 */
export interface SurgicalProcedure {
  id: string;
  names: LocalizedText;
  description: LocalizedText;
  /** Surgical specialty: General Surgery, Vascular, Cardiac, etc. */
  specialty: string;
  /** Surgical approach: open, laparoscopic, robotic, endoscopic, percutaneous */
  approach: 'open' | 'laparoscopic' | 'robotic' | 'endoscopic' | 'percutaneous' | 'mixed';
  /** ICD-10-PCS or CPT code if applicable */
  proceduralCode?: string;
  /** Anatomical structures directly involved in this procedure */
  relatedStructureIds: string[];
  /** Short educational notes (NOT patient-specific operative instructions) */
  educationalNotes?: LocalizedText;
  /** Key danger zones to be aware of */
  relatedDangerZoneIds: string[];
  /** Order in procedure lists */
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 8. ProcedureStructure — Many-to-many between procedures and structures.
 * Optional link table for richer metadata (e.g. role of the structure in the procedure).
 * (Note: We also store relatedStructureIds directly on SurgicalProcedure for performance.
 *  This table is for admin-level queries and analytics.)
 */
export interface ProcedureStructure {
  id: string;
  procedureId: string;
  structureId: string;
  /** Role of the structure in the procedure: target, landmark, danger, related */
  role: 'target' | 'landmark' | 'danger' | 'related';
  /** Optional notes specific to this procedure-structure relationship */
  notes?: LocalizedText;
  createdAt: string;
}

/**
 * 9. VideoStructure — Many-to-many between existing SurgicalVideo records and structures.
 * Links existing VisualLibrary videos to anatomical structures WITHOUT duplicating them.
 */
export interface VideoStructure {
  id: string;
  /** Reference to existing video record in VisualLibrary */
  videoId: string;
  structureId: string;
  /** Optional: procedure this video primarily demonstrates for this structure */
  procedureId?: string;
  /** Display order when showing related videos for a structure */
  displayOrder: number;
  /** True if this video should be featured (shown first) for this structure */
  featured: boolean;
  createdAt: string;
}

/**
 * 10. DangerZone — Clinically critical anatomical region.
 * Highlights areas requiring special attention during surgery.
 */
export interface DangerZone {
  id: string;
  names: LocalizedText;
  description: LocalizedText;
  /** Anatomical location */
  location: LocalizedText;
  /** Structures that compose this danger zone */
  associatedStructureIds: string[];
  /** Procedures where this danger zone is relevant */
  relatedProcedureIds: string[];
  clinicalSignificance: LocalizedText;
  /** Educational references (PubMed URLs, textbook chapters) */
  references?: string[];
  /** Visual highlight color in the 3D viewer (default red-ish) */
  highlightColor: string;
  /** Educational disclaimer shown alongside */
  disclaimer: LocalizedText;
  /** Has this been clinically reviewed? */
  clinicallyReviewed: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ADMIN & METADATA ENTITIES
// ============================================================================

/**
 * 11. AnatomyTranslation — User-contributed translations for structures.
 * Allows extending Arabic/German translations without modifying the source.
 */
export interface AnatomyTranslation {
  id: string;
  structureId: string;
  language: SupportedLanguage;
  fieldName: keyof AnatomyStructure;
  translatedValue: string;
  /** Translator user ID */
  translatorId: string;
  translatorName: string;
  /** Review status */
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 12. AnatomyReference — Educational reference for a structure.
 * PubMed links, textbook citations, etc.
 */
export interface AnatomyReference {
  id: string;
  structureId: string;
  referenceType: 'pubmed' | 'textbook' | 'journal' | 'guideline' | 'video';
  title: string;
  authors?: string;
  source: string;
  url?: string;
  publicationDate?: string;
  /** Optional notes about why this reference is relevant */
  notes?: LocalizedText;
  createdAt: string;
}

/**
 * 13. AssetLicense — Registry of all licenses used in the atlas.
 * Single source of truth for license compliance.
 */
export interface AssetLicense {
  id: LicenseId;
  name: string;
  version?: string;
  spdxIdentifier: string;
  commercialUse: boolean;
  modificationAllowed: boolean;
  redistributionAllowed: boolean;
  shareAlikeRequired: boolean;
  attributionRequired: boolean;
  /** Full license text or link */
  fullTextUrl: string;
  /** Required attribution string template */
  attributionTemplate: string;
}

// ============================================================================
// AGGREGATE TYPES (for UI convenience)
// ============================================================================

/** Full anatomical structure info panel payload (structure + translations + references + procedures + videos) */
export interface AnatomicalStructureFullInfo {
  structure: AnatomyStructure;
  system: AnatomySystem;
  region: AnatomyRegion;
  procedures: SurgicalProcedure[];
  dangerZones: DangerZone[];
  relatedVideos: VideoStructure[];
  references: AnatomyReference[];
  translations: AnatomyTranslation[];
}

/** Anatomical search result */
export interface AnatomicalSearchResult {
  structure: AnatomyStructure;
  system: AnatomySystem;
  region: AnatomyRegion;
  score: number;          // relevance score
  matchedField: string;   // which field matched (name, synonym, latin, etc.)
}

/** Atlas viewer state */
export interface AtlasViewerState {
  biologicalSex: BiologicalSex;
  visibleSystems: AnatomicalSystemId[];
  selectedStructureId: string | null;
  isolatedStructureId: string | null;
  highlightedStructureIds: string[];
  opacityOverrides: Record<string, number>; // structureId → opacity (0-1)
  activeRegionId: AnatomicalRegionId | 'whole_body';
  cameraView: 'front' | 'back' | 'left' | 'right' | 'superior' | 'inferior' | 'free';
  loadingRegion: AnatomicalRegionId | null;
  searchQuery: string;
  showDangerZones: boolean;
  clippingMode: 'none' | 'axial' | 'coronal' | 'sagittal';
  clippingPosition: number;  // -1 to 1
}

export const DEFAULT_VIEWER_STATE: AtlasViewerState = {
  biologicalSex: 'male',
  visibleSystems: [
    'skin_subcutaneous', 'muscular', 'skeletal', 'arterial',
    'venous', 'nervous', 'internal_organs',
  ],
  selectedStructureId: null,
  isolatedStructureId: null,
  highlightedStructureIds: [],
  opacityOverrides: {},
  activeRegionId: 'whole_body',
  cameraView: 'front',
  loadingRegion: null,
  searchQuery: '',
  showDangerZones: true,
  clippingMode: 'none',
  clippingPosition: 0,
};

// ============================================================================
// CONSTANTS — Counters and metadata
// ============================================================================

export const ANATOMICAL_SYSTEMS_COUNT = 10;
export const ANATOMICAL_REGIONS_COUNT = 7;
export const BIOLOGICAL_SEXES_COUNT = 2;

export const ALL_ANATOMICAL_SYSTEM_IDS: AnatomicalSystemId[] = [
  'skin_subcutaneous', 'muscular', 'skeletal', 'arterial',
  'venous', 'nervous', 'internal_organs', 'lymphatic',
  'ligaments_tendons', 'fascia_connective',
];

export const ALL_ANATOMICAL_REGION_IDS: AnatomicalRegionId[] = [
  'head_neck', 'thorax', 'abdomen_pelvis', 'back_spine',
  'upper_limb', 'lower_limb', 'whole_body',
];
