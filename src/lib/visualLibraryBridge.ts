// ============================================================================
// visualLibraryBridge.ts — Links Atlas 3D structures to LIVE VERIFIED videos
// ----------------------------------------------------------------------------
// Bridges open-anatomy-3d 147 structures + surgical procedures to the live
// verified videos in VERIFIED_VISUAL_MEDIA (visualLibraryVerified.ts).
// Zero dead/404 video links.
// ============================================================================

import type { VideoStructure } from '../types/surgicalAtlasTypes';
import { VERIFIED_VISUAL_MEDIA } from './visualLibraryVerified';
import { getStructureById as getCatalogStructure } from './surgicalAtlasCatalog';
import { expandStructureIds } from './surgicalProceduresRegistry';

export interface VisualLibraryVideo {
  videoId: string;
  structureId: string;
  procedureId?: string;
  title: string;
  thumbnailUrl: string;
  duration?: string;
  author: string;
  youtubeUrl: string;
  displayOrder: number;
  featured: boolean;
}

const STRUCTURE_TO_MEDIA_IDS: Record<string, { mediaId: string; procedureId?: string }[]> = {
  gallbladder: [
    { mediaId: 'vl-yt-cvs-1', procedureId: 'laparoscopic_cholecystectomy' },
    { mediaId: 'vl-yt-cvs-2', procedureId: 'laparoscopic_cholecystectomy' },
    { mediaId: 'vl-yt-ercp-1', procedureId: 'laparoscopic_cholecystectomy' },
  ],
  liver: [
    { mediaId: 'vl-yt-cvs-1', procedureId: 'laparoscopic_cholecystectomy' },
    { mediaId: 'vl-yt-ercp-1', procedureId: 'laparoscopic_cholecystectomy' },
  ],
  pancreas: [
    { mediaId: 'vl-yt-whipple-1' },
    { mediaId: 'vl-yt-whipple-2' },
    { mediaId: 'vl-yt-ercp-1' },
  ],
  stomach: [
    { mediaId: 'vl-yt-peds-1' },
    { mediaId: 'vl-yt-whipple-2' },
  ],
  small_intestine: [
    { mediaId: 'vl-yt-whipple-1' },
    { mediaId: 'vl-yt-append-1', procedureId: 'appendectomy' },
  ],
  appendix: [
    { mediaId: 'vl-yt-append-1', procedureId: 'appendectomy' },
  ],
  colon: [
    { mediaId: 'vl-yt-append-1', procedureId: 'appendectomy' },
  ],
  abdominal_muscles: [
    { mediaId: 'vl-yt-hernia-tep' },
    { mediaId: 'vl-yt-hernia-tapp' },
  ],
  aorta: [
    { mediaId: 'vl-yt-evar-1', procedureId: 'aaa_repair' },
    { mediaId: 'vl-yt-evar-2', procedureId: 'aaa_repair' },
  ],
  arteries_abdomen: [
    { mediaId: 'vl-yt-evar-1', procedureId: 'aaa_repair' },
    { mediaId: 'vl-yt-evar-2', procedureId: 'aaa_repair' },
  ],
  vena_cava_inferior: [
    { mediaId: 'vl-yt-evar-1', procedureId: 'aaa_repair' },
  ],
  carotid_r: [
    { mediaId: 'vl-yt-cea-1', procedureId: 'carotid_endarterectomy' },
    { mediaId: 'vl-yt-cea-2', procedureId: 'carotid_endarterectomy' },
  ],
  carotid_l: [
    { mediaId: 'vl-yt-cea-1', procedureId: 'carotid_endarterectomy' },
    { mediaId: 'vl-yt-cea-2', procedureId: 'carotid_endarterectomy' },
  ],
  heart: [
    { mediaId: 'vl-yt-cabg-1' },
    { mediaId: 'vl-yt-avr-1' },
    { mediaId: 'vl-yt-avr-2' },
  ],
  coronary_arteries: [
    { mediaId: 'vl-yt-cabg-1' },
  ],
  lung_r: [
    { mediaId: 'vl-yt-vats-1' },
    { mediaId: 'vl-yt-vats-2' },
    { mediaId: 'vl-yt-trauma-1' },
  ],
  lung_l: [
    { mediaId: 'vl-yt-vats-1' },
    { mediaId: 'vl-yt-vats-2' },
    { mediaId: 'vl-yt-trauma-1' },
  ],
  bronchi: [
    { mediaId: 'vl-yt-vats-1' },
    { mediaId: 'vl-yt-vats-2' },
  ],
  larynx: [
    { mediaId: 'vl-yt-thyroid-1', procedureId: 'thyroidectomy' },
  ],
  trachea: [
    { mediaId: 'vl-yt-thyroid-1', procedureId: 'thyroidectomy' },
  ],
  brain: [
    { mediaId: 'vl-yt-neuro-1' },
  ],
  cerebellum: [
    { mediaId: 'vl-yt-neuro-1' },
  ],
  brainstem: [
    { mediaId: 'vl-yt-neuro-1' },
  ],
  cranial_nerves: [
    { mediaId: 'vl-yt-neuro-1' },
    { mediaId: 'vl-yt-thyroid-1', procedureId: 'thyroidectomy' },
  ],
  kidney_l: [
    { mediaId: 'vl-yt-transplant-1' },
  ],
  kidney_r: [
    { mediaId: 'vl-yt-transplant-1' },
  ],
  ureter_l: [
    { mediaId: 'vl-yt-transplant-1', procedureId: 'aaa_repair' },
  ],
  ureter_r: [
    { mediaId: 'vl-yt-transplant-1', procedureId: 'aaa_repair' },
  ],
  prostate: [
    { mediaId: 'vl-yt-rarp-1' },
  ],
  bladder: [
    { mediaId: 'vl-yt-rarp-1' },
  ],
  knee_l: [{ mediaId: 'vl-yt-tka-1' }],
  knee_r: [{ mediaId: 'vl-yt-tka-1' }],
  hip_l: [{ mediaId: 'vl-yt-tha-1' }],
  hip_r: [{ mediaId: 'vl-yt-tha-1' }],
  arteries_leg_r: [{ mediaId: 'vl-yt-evar-1', procedureId: 'femoral_exposure' }],
  arteries_leg_l: [{ mediaId: 'vl-yt-evar-1', procedureId: 'femoral_exposure' }],
};

function toBridgeVideo(
  media: (typeof VERIFIED_VISUAL_MEDIA)[number],
  structureId: string,
  displayOrder: number,
  featured: boolean,
  procedureId?: string,
): VisualLibraryVideo {
  return {
    videoId: media.id,
    structureId,
    procedureId,
    title: media.title,
    thumbnailUrl: media.thumbnailUrl || '',
    duration: media.duration,
    author: media.author || media.institution || 'SurgiTrack Library',
    youtubeUrl: media.externalSourceUrl || media.url,
    displayOrder,
    featured,
  };
}

export const STRUCTURE_VIDEO_MAPPING: VisualLibraryVideo[] = Object.entries(
  STRUCTURE_TO_MEDIA_IDS,
).flatMap(([structureId, refs]) =>
  refs
    .map((ref, idx) => {
      const media = VERIFIED_VISUAL_MEDIA.find((m) => m.id === ref.mediaId);
      if (!media) return null;
      return toBridgeVideo(media, structureId, idx + 1, idx === 0, ref.procedureId);
    })
    .filter((v): v is VisualLibraryVideo => Boolean(v)),
);

const CATEGORY_TO_MEDIA_CATEGORY: Record<string, string[]> = {
  Cardiovascular: ['Cardiac Surgery', 'Vascular Surgery'],
  Respiratory: ['Thoracic Surgery', 'Trauma Surgery'],
  Digestive: ['General Surgery', 'Minimally Invasive Surgery', 'Endoscopic Surgery'],
  Endocrine: ['General Surgery'],
  'Renal / Urinary': ['Transplant Surgery', 'Robotic Surgery'],
  Musculoskeletal: ['Orthopedic Surgery'],
  Neurological: ['Neurosurgery'],
  Reproductive: ['Robotic Surgery'],
  'Oral / ENT': ['Plastic Surgery', 'General Surgery'],
};

export function getRelatedVideosForStructure(
  structureId: string,
  _existingVideos: any[] = [],
): VisualLibraryVideo[] {
  const candidates = expandStructureIds(structureId);
  const direct = STRUCTURE_VIDEO_MAPPING.filter((v) =>
    candidates.includes(v.structureId),
  );
  if (direct.length > 0) {
    return direct.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.displayOrder - b.displayOrder;
    });
  }

  // Category-based fallback using verified live videos
  const catStruct = getCatalogStructure(structureId);
  const mediaCats = catStruct ? CATEGORY_TO_MEDIA_CATEGORY[catStruct.category] || [] : [];
  if (mediaCats.length > 0) {
    return VERIFIED_VISUAL_MEDIA.filter(
      (m) => m.mediaType === 'video' && mediaCats.includes(m.category),
    )
      .slice(0, 3)
      .map((m, idx) => toBridgeVideo(m, structureId, idx + 1, idx === 0));
  }

  return [];
}

export function getRelatedVideosForProcedure(procedureId: string): VisualLibraryVideo[] {
  return STRUCTURE_VIDEO_MAPPING.filter((v) => v.procedureId === procedureId).sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.displayOrder - b.displayOrder;
  });
}

export function generateVideoStructureRecords(): VideoStructure[] {
  const now = new Date().toISOString();
  return STRUCTURE_VIDEO_MAPPING.map((v, idx) => ({
    id: `vs_${idx + 1}_${v.videoId}_${v.structureId}`,
    videoId: v.videoId,
    structureId: v.structureId,
    procedureId: v.procedureId,
    displayOrder: v.displayOrder,
    featured: v.featured,
    createdAt: now,
  }));
}
