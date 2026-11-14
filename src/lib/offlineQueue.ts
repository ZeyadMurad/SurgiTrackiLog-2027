/**
 * Offline sync queue — pure types + helpers extracted from DataContext.
 *
 * This is Phase 1 of the DataContext decomposition (see ARCHITECTURE.md): move
 * the queue's data shape and pure manipulation logic into a standalone, unit-
 * testable module. The stateful wrappers (read/write localStorage, dispatch to
 * Firestore) stay in DataContext and consume these helpers. Behavior is
 * identical; only the location of the pure logic changed.
 */
import type { SyncStatus } from '../types';

/** localStorage key prefix for a user's offline action queue. */
export const OFFLINE_QUEUE_KEY = 'surgitrack_offline_queue_';

/** Build the per-user localStorage key for the offline queue. */
export const offlineQueueKey = (uid: string): string => `${OFFLINE_QUEUE_KEY}${uid}`;

/** A queued offline mutation, replayed to Firestore when connectivity returns. */
export interface OfflineQueueItem {
  id: string;
  type: 'case' | 'community_case' | 'supervisor' | 'record' | 'session' | 'skill';
  action: 'create' | 'update' | 'delete';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  parentId?: string;
  timestamp: string;
}

/**
 * Append an item to the queue, replacing any existing pending item for the same
 * (id, action) pair so the latest mutation wins. Pure: returns a new array and
 * never mutates the input.
 */
export function dedupeAndEnqueue(
  queue: OfflineQueueItem[],
  item: OfflineQueueItem
): OfflineQueueItem[] {
  const filtered = queue.filter(q => !(q.id === item.id && q.action === item.action));
  return [...filtered, item];
}

/**
 * Initial sync status for a freshly mounted provider. `pendingCount` is derived
 * from the persisted queue length by the caller.
 */
export function initialSyncStatus(pendingCount: number): SyncStatus {
  return {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    pendingCount,
    isSyncing: false,
    lastSyncTime: new Date().toLocaleTimeString(),
  };
}
