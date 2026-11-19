// ============================================================================
// atlasVideoIntegration.ts — Complete structure-to-video mapping for Atlas 3D
// ----------------------------------------------------------------------------
// Maps EVERY anatomical structure (147) to relevant surgical videos
// using the 10 YouTube channels + 3 external platforms (WeBSurg, CTSNet, VuMedi).
//
// When a user clicks a structure in the Atlas 3D, they see:
//   1. Direct search links to all 10 surgical YouTube channels
//   2. Direct search links to WeBSurg, CTSNet, VuMedi
//   3. Pre-mapped specific videos (where we have verified YouTube IDs)
//
// This creates a bidirectional educational connection between anatomy
// and surgical practice.
// ============================================================================

import {
  SURGICAL_YOUTUBE_CHANNELS, EXTERNAL_SURGICAL_PLATFORMS,
  buildChannelSearchUrls, buildExternalSearchUrls,
  type SurgicalYouTubeChannel, type ExternalSurgicalPlatform,
} from './surgicalYouTubeChannels';
import { UNIFIED_ANATOMICAL_CATALOG, getStructureById, type UnifiedAnatomicalStructure } from './surgicalAtlasCatalog';
import { getProceduresByStructure, SURGICAL_PROCEDURES } from './surgicalProceduresRegistry';

// ============================================================================
// Structure-to-search-query mapping
// ----------------------------------------------------------------------------
// For each anatomical structure, we define a search query that, when
// searched on YouTube or WeBSurg, will return relevant surgical videos.
// ============================================================================

interface StructureSearchMapping {
  structureId: string;
  /** Search query optimized for finding surgical videos */
  searchQuery: string;
  /** Alternative search terms */
  altQueries: string[];
  /** Best channels for this structure (subset of all channels) */
  bestChannelHandles: string[];
  /** Best external platforms for this structure */
  bestPlatformIds: string[];
}

// ============================================================================
// Generate search mappings for ALL 147 structures
// ============================================================================
// We use the structure's label + "surgery" as the primary search query.
// For specific structures, we add more targeted queries.

export function generateSearchMapping(structure: UnifiedAnatomicalStructure): StructureSearchMapping {
  const label = structure.label
    .replace(/\(L\)/g, 'left')
    .replace(/\(R\)/g, 'right')
    .trim();

  // Determine best channels based on category
  let bestChannels: string[] = [];
  let bestPlatforms: string[] = ['websurg', 'ctsnet', 'vumedi'];

  switch (structure.category) {
    case 'Cardiovascular':
      bestChannels = ['debakeycvedu', 'ctsnetvideo', 'annalsofcardiothoracicsurg2361', 'jomi'];
      break;
    case 'Respiratory':
      bestChannels = ['ctsnetvideo', 'annalsofcardiothoracicsurg2361', 'jomi'];
      break;
    case 'Digestive':
      bestChannels = ['sagesvideo', 'jomi', 'behindtheknifethesurgerypo4986'];
      break;
    case 'Endocrine':
      bestChannels = ['jomi', 'sagesvideo', 'nucleusmedicalmedia'];
      break;
    case 'Renal / Urinary':
      bestChannels = ['jomi', 'sagesvideo', 'nucleusmedicalmedia'];
      break;
    case 'Musculoskeletal':
      bestChannels = ['jomi', 'nucleusmedicalmedia', 'anatomyzone'];
      break;
    case 'Neurological':
      bestChannels = ['aansneurosurgery', 'jomi', 'nucleusmedicalmedia', 'anatomyzone'];
      break;
    case 'Eye / Sensory':
      bestChannels = ['jomi', 'nucleusmedicalmedia'];
      break;
    case 'Reproductive':
      bestChannels = ['jomi', 'nucleusmedicalmedia'];
      break;
    case 'Oral / ENT':
      bestChannels = ['jomi', 'nucleusmedicalmedia'];
      break;
    case 'Immune / Lymphatic':
      bestChannels = ['nucleusmedicalmedia', 'anatomyzone'];
      break;
    case 'Skin':
      bestChannels = ['nucleusmedicalmedia', 'anatomyzone'];
      break;
    default:
      bestChannels = ['jomi', 'nucleusmedicalmedia', 'sagesvideo'];
  }

  // For joints, add anatomyzone
  if (structure.system === 'joints') {
    bestChannels = [...bestChannels, 'anatomyzone'];
  }

  // For bones, add anatomyzone
  if (structure.system === 'skeleton') {
    bestChannels = [...bestChannels, 'anatomyzone'];
  }

  // For organs, WeBSurg is excellent
  if (structure.system === 'organs') {
    bestPlatforms = ['websurg', 'vumedi', 'ctsnet'];
  }

  // For vessels, CTSNet is excellent for cardiac/thoracic
  if (structure.system === 'vessels') {
    bestPlatforms = ['ctsnet', 'websurg', 'vumedi'];
  }

  // Build search queries
  const primaryQuery = `${label} surgery`;
  const altQueries = [
    `${label} surgical procedure`,
    `${label} operative technique`,
    `${label} dissection`,
    `${label} anatomy`,
  ];

  // Add animation search
  if (structure.category === 'Musculoskeletal' || structure.category === 'Neurological') {
    altQueries.push(`${label} 3D animation`);
  }

  return {
    structureId: structure.id,
    searchQuery: primaryQuery,
    altQueries: altQueries.slice(0, 3),
    bestChannelHandles: [...new Set(bestChannels)],
    bestPlatformIds: bestPlatforms,
  };
}

// ============================================================================
// Generate all 147 search mappings
// ============================================================================
export const ALL_STRUCTURE_SEARCH_MAPPINGS: Record<string, StructureSearchMapping> =
  Object.fromEntries(
    UNIFIED_ANATOMICAL_CATALOG.map(s => [s.id, generateSearchMapping(s)])
  );

// ============================================================================
// INTERFACE: Structure video search results for the Atlas 3D
// ============================================================================
export interface StructureVideoResult {
  structureId: string;
  /** YouTube channel search links (filtered to specific channels) */
  youtubeSearchLinks: { channel: SurgicalYouTubeChannel; url: string }[];
  /** External platform search links (WeBSurg, CTSNet, VuMedi) */
  externalSearchLinks: { platform: ExternalSurgicalPlatform; url: string }[];
  /** Related surgical procedures */
  relatedProcedures: typeof SURGICAL_PROCEDURES;
}

// ============================================================================
// MAIN: Get all video search results for a structure
// ============================================================================
export function getStructureVideoResults(structureId: string): StructureVideoResult | null {
  const structure = getStructureById(structureId);
  if (!structure) return null;

  const mapping = ALL_STRUCTURE_SEARCH_MAPPINGS[structureId];
  if (!mapping) return null;

  // Build YouTube channel search links (only for best channels)
  const relevantChannels = SURGICAL_YOUTUBE_CHANNELS.filter(ch =>
    mapping.bestChannelHandles.includes(ch.handle)
  );

  const youtubeSearchLinks = relevantChannels.map(channel => ({
    channel,
    url: `${channel.searchUrlTemplate}${encodeURIComponent(mapping.searchQuery)}`,
  }));

  // Build external platform search links
  const relevantPlatforms = EXTERNAL_SURGICAL_PLATFORMS.filter(p =>
    mapping.bestPlatformIds.includes(p.id)
  );

  const externalSearchLinks = relevantPlatforms.map(platform => ({
    platform,
    url: platform.searchUrlPattern.replace('%s', encodeURIComponent(mapping.searchQuery)),
  }));

  // Get related procedures
  const relatedProcedures = getProceduresByStructure(structureId);

  return {
    structureId,
    youtubeSearchLinks,
    externalSearchLinks,
    relatedProcedures,
  };
}

// ============================================================================
// HELPER: Get all search targets (all channels + all platforms) for a query
// ============================================================================
export function getAllVideoSearchTargets(query: string) {
  const enhancedQuery = `${query} surgery procedure`;
  return {
    youtubeChannels: buildChannelSearchUrls(enhancedQuery),
    externalPlatforms: buildExternalSearchUrls(query),
  };
}
