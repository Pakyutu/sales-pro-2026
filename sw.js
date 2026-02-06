const CACHE_NAME = 'msp-cache-v1.0.21'; // <--- UBAH NOMOR INI SETIAP UPDATE (misal v1.0.3)

const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo.png'
];

// 1. Tahap Install (Langsung ganti sif tanpa nunggu tab ditutup)
self.addEventListener('install', (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// 2. Tahap Aktivasi (Hapus Cache lama yang sudah basi)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim(); // Langsung ambil kendali aplikasi
    })
  );
});

// 3. Tahap Fetch (Ambil data dari internet dulu, kalau gagal baru ambil cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});






















