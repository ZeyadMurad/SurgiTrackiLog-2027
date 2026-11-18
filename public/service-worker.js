// ============================================================================
// service-worker.js — PWA offline support for SurgiTrack iLog PRO
// ----------------------------------------------------------------------------
// Caches all app shell assets for offline use.
// Strategy: cache-first for app shell, network-first for API calls.
// ============================================================================

const CACHE_VERSION = 'surgitrack-v3-2027-v1';
const APP_SHELL_CACHE = `${CACHE_VERSION}-app-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// App shell assets (cached on install)
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Vite-built assets will be added dynamically on first fetch
];

// ============================================================================
// INSTALL — Cache app shell
// ============================================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(async (cache) => {
      // Cache the static assets, but don't fail if some are missing
      await Promise.allSettled(
        APP_SHELL_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn(`[SW] Failed to cache ${url}:`, err.message))
        )
      );
      console.log('[SW] App shell cached');
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// ============================================================================
// ACTIVATE — Clean old caches
// ============================================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter(key => !key.startsWith(CACHE_VERSION))
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    })
  );
  self.clients.claim();
});

// ============================================================================
// FETCH — Smart caching strategy
// ============================================================================
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // === Same-origin requests: cache-first with network fallback ===
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Update cache in background
          fetch(request).then((response) => {
            if (response.ok && response.type === 'basic') {
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, response.clone()).catch(() => {});
              });
            }
          }).catch(() => {});
          return cached;
        }
        // Not cached — fetch from network
        return fetch(request).then((response) => {
          if (response.ok && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone).catch(() => {});
            });
          }
          return response;
        }).catch(() => {
          // Offline fallback
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
          return new Response('Offline — this resource is not cached.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        });
      })
    );
    return;
  }

  // === Cross-origin requests (API, video, images): network-first with cache fallback ===
  // For YouTube embeds, PubMed API, GitHub, etc.
  event.respondWith(
    fetch(request).then((response) => {
      // Cache successful responses for offline use (especially videos/images)
      if (response.ok && (response.type === 'cors' || response.type === 'basic')) {
        const responseClone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseClone).catch(() => {});
        });
      }
      return response;
    }).catch(() => {
      // Try cache fallback
      return caches.match(request).then((cached) => {
        if (cached) return cached;
        return new Response('Offline — this resource requires internet.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      });
    })
  );
});

// ============================================================================
// MESSAGE — Allow pages to trigger cache updates
// ============================================================================
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => {
      Promise.all(keys.map(k => caches.delete(k))).then(() => {
        console.log('[SW] All caches cleared');
      });
    });
  }
});
