const CACHE_NAME = 'msp-sales-app-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// Install Service Worker
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Fetch Data (Agar bisa dibuka offline)
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(rec => {
      return rec || fetch(evt.request);
    })
  );
});
