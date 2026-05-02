/**
 * @fileoverview ElectEd Service Worker
 * @description Provides offline caching, background sync, and push notification support.
 * Implements cache-first for static assets and network-first for API calls.
 * @version 2.0.0
 * @author Rishi
 */

'use strict';

/** @constant {string} Cache version — bump to invalidate all caches */
const CACHE_VERSION = 'elected-v2.0.0';

/** @constant {string} Static asset cache name */
const STATIC_CACHE = `${CACHE_VERSION}-static`;

/** @constant {string} Dynamic content cache name */
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

/** @constant {string[]} Assets to pre-cache on install */
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js'
];

/** @constant {string[]} Origins that should never be cached */
const NO_CACHE_ORIGINS = [
  'api.anthropic.com',
  'www.googletagmanager.com',
  'analytics.google.com',
  'translate.google.com'
];

/** @constant {number} Maximum cache age for dynamic assets (24 hours) */
const MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000;

/** @constant {number} Maximum number of dynamic cache entries */
const MAX_DYNAMIC_ENTRIES = 50;

/* ── Install: Pre-cache critical assets ─────────────────────── */
self.addEventListener('install', event => {
  console.info('[SW] Installing cache:', CACHE_VERSION);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => {
        console.info('[SW] Pre-cache complete');
        return self.skipWaiting();
      })
      .catch(err => console.warn('[SW] Pre-cache failed:', err))
  );
});

/* ── Activate: Clean stale caches ────────────────────────────── */
self.addEventListener('activate', event => {
  console.info('[SW] Activating — cleaning old caches');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map(k => {
            console.info('[SW] Deleting stale cache:', k);
            return caches.delete(k);
          })
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: Routing strategy ─────────────────────────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;

  // Ignore non-GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache analytics, API, or translation calls
  if (NO_CACHE_ORIGINS.some(o => url.hostname.includes(o))) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first for same-origin static assets
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-while-revalidate for Google Fonts
  if (url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Network-first for everything else
  event.respondWith(networkFirst(request));
});

/**
 * Cache-first strategy: returns cached response if available,
 * falls back to network and updates cache.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    // Return offline fallback
    const fallback = await caches.match('/index.html');
    return fallback || new Response('Offline — please reconnect.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Network-first strategy: tries network, falls back to cache.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await limitCacheSize(DYNAMIC_CACHE, MAX_DYNAMIC_ENTRIES);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('Network error.', { status: 503 });
  }
}

/**
 * Stale-while-revalidate: returns cache immediately, updates in background.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || fetchPromise;
}

/**
 * Limit the number of entries in a named cache.
 * @param {string} cacheName
 * @param {number} maxEntries
 */
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxEntries);
  }
}

/* ── Background Sync ─────────────────────────────────────────── */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-quiz-scores') {
    event.waitUntil(syncQuizScores());
  }
});

/**
 * Sync pending quiz scores when back online.
 * @returns {Promise<void>}
 */
async function syncQuizScores() {
  console.info('[SW] Background sync: quiz scores');
  // Scores are handled by Firebase in the main thread
}

/* ── Push Notifications ──────────────────────────────────────── */
self.addEventListener('push', event => {
  const data = event.data?.json() ?? { title: 'ElectEd', body: 'New election update!' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://placehold.co/192x192/C08B2F/0D1117?text=E',
      badge: 'https://placehold.co/96x96/C08B2F/0D1117?text=E',
      tag: 'elected-notification',
      renotify: true
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
