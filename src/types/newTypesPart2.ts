// ============================================================================
// newTypesPart2.ts — V2 Extensions (24h Ephemeral Stories, Auto-Refresh, V2 Sim)
// ============================================================================

export type StoryMediaType =
  | "image"
  | "video"
  | "text"
  | "case_link"
  | "media_link";

export interface EphemeralCommunityStory {
  id: string;
  authorId: string;
  authorName: string;
  authorDegree?: string;
  authorSpecialty?: string;
  authorPhotoUrl?: string;
  authorPosition?: string;
  mediaType: StoryMediaType;
  text?: string;
  mediaUrl?: string;
  backgroundColor?: string;
  linkedCaseId?: string;
  linkedCaseReference?: string;
  linkedMediaId?: string;
  viewedByUserIds: string[];
  viewsCount: number;
  deletedByAdmin?: boolean;
  deletedAt?: string;
  expiresAt: string;
  expiresAtServer?: any;
  createdAt: string;
  createdAtServer?: any;
  updatedAt: string;
}

export type RefreshSection =
  | "news"
  | "research"
  | "community"
  | "cases"
  | "threads"
  | "stories";

export interface RefreshState {
  isRefreshing: boolean;
  lastRefreshAt: string | null;
  error: string | null;
}

export type SimulationUrgency = "elective" | "urgent" | "emergency";
