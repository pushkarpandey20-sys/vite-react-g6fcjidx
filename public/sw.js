/* ─── BhaktiGo Service Worker ────────────────────────────
   Strategy:
   - Static assets (JS/CSS/fonts) → Cache First
   - API calls (Supabase)         → Network First
   - Pages/navigation             → Network First with offline fallback
   ─────────────────────────────────────────────────────── */

const CACHE_NAME = 'devsetu-v1';
const STATIC_CACHE = 'devsetu-static-v1';
const API_CACHE = 'devsetu-api-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

const OFFLINE_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BhaktiGo – Offline</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Nunito', sans-serif;
      background: #1a0f07;
      color: #FFF8F0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }
    .icon { font-size: 72px; margin-bottom: 24px; }
    h1 { font-size: 28px; color: #F0C040; margin-bottom: 12px; font-family: serif; }
    p { color: rgba(255,248,240,0.6); font-size: 15px; line-height: 1.6; max-width: 320px; margin-bottom: 32px; }
    button {
      background: linear-gradient(135deg, #FF6B00, #D4A017);
      color: #fff;
      border: none;
      padding: 14px 32px;
      border-radius: 30px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="icon">🕉️</div>
  <h1>You're Offline</h1>
  <p>The divine connection is temporarily unavailable. Please check your internet and try again.</p>
  <button onclick="window.location.reload()">🔄 Try Again</button>
</body>
</html>`;

// ── Install: cache static assets ──────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== API_CACHE && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: smart routing strategy ────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') return;

  // Supabase API → Network First, cache for 5 min
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(networkFirst(request, API_CACHE, 300));
    return;
  }

  // Static assets (JS/CSS/fonts/images) → Cache First
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|otf|png|jpg|jpeg|svg|ico|webp)$/)
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // HTML navigation → Network First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(OFFLINE_PAGE, { headers: { 'Content-Type': 'text/html' } })
      )
    );
    return;
  }

  // Everything else → Network First
  event.respondWith(networkFirst(request, CACHE_NAME, 60));
});

// ── Cache First strategy ──────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408 });
  }
}

// ── Network First strategy ────────────────────────────────
async function networkFirst(request, cacheName, maxAgeSeconds) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('', { status: 408 });
  }
}

// ── Push notifications ────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || '🕉️ BhaktiGo';
  const options = {
    body: data.body || 'You have a new update from BhaktiGo',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
