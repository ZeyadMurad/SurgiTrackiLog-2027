import { describe, it, expect } from 'vitest';
import {
  OFFLINE_QUEUE_KEY,
  offlineQueueKey,
  dedupeAndEnqueue,
  initialSyncStatus,
  type OfflineQueueItem,
} from '../lib/offlineQueue';

const item = (id: string, action: OfflineQueueItem['action'] = 'update'): OfflineQueueItem => ({
  id,
  type: 'case',
  action,
  data: { foo: 'bar' },
  timestamp: '2026-11-14T00:00:00.000Z',
});

describe('offlineQueue — keys', () => {
  it('OFFLINE_QUEUE_KEY is the documented prefix', () => {
    expect(OFFLINE_QUEUE_KEY).toBe('surgitrack_offline_queue_');
  });

  it('offlineQueueKey builds a per-user key', () => {
    expect(offlineQueueKey('usr_123')).toBe('surgitrack_offline_queue_usr_123');
  });
});

describe('offlineQueue — dedupeAndEnqueue', () => {
  it('appends a new item to an empty queue', () => {
    expect(dedupeAndEnqueue([], item('a'))).toEqual([item('a')]);
  });

  it('appends a new item after existing ones', () => {
    const queue = [item('a'), item('b')];
    expect(dedupeAndEnqueue(queue, item('c'))).toEqual([item('a'), item('b'), item('c')]);
  });

  it('replaces an existing pending item with the same (id, action)', () => {
    const queue = [item('a'), item('b')];
    const next = dedupeAndEnqueue(queue, item('a'));
    expect(next).toHaveLength(2);
    expect(next[1].id).toBe('a');
  });

  it('keeps both when the same id has a different action', () => {
    const queue = [item('a', 'create')];
    const next = dedupeAndEnqueue(queue, item('a', 'delete'));
    expect(next).toHaveLength(2);
  });

  it('does not mutate the input queue', () => {
    const queue = [item('a')];
    const snapshot = [...queue];
    dedupeAndEnqueue(queue, item('b'));
    expect(queue).toEqual(snapshot);
  });
});

describe('offlineQueue — initialSyncStatus', () => {
  it('builds an idle status with the given pending count', () => {
    const status = initialSyncStatus(3);
    expect(status.pendingCount).toBe(3);
    expect(status.isSyncing).toBe(false);
    expect(typeof status.lastSyncTime).toBe('string');
  });
});
