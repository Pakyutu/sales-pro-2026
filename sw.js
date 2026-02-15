const CACHE_NAME = 'sales-pro-v37'; // NAIKKAN VERSI SETIAP UPDATE (v37, v38, dst)
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 1. PROSES INSTALL (Simpan Aset Penting)
self.addEventListener('install', event => {
  self.skipWaiting(); // Langsung aktifkan SW baru tanpa nunggu
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Memperbarui Cache...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. PROSES FETCH (Strategi Network-First untuk Update Aman)
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Jika yang diminta adalah file utama (HTML/Root), paksa cek internet dulu
  if (url.origin === location.origin && (url.pathname === '/' || url.pathname.endsWith('index.html'))) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Jika internet ada, simpan versi terbaru ke cache lalu kirim ke layar
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Jika internet mati/lemot, baru pakai yang ada di cache
          return caches.match(request);
        })
    );
  } else {
    // Untuk file lain (icon/font), pakai cache-first biar cepat
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request);
      })
    );
  }
});

// 3. PROSES AKTIVASI (Hapus Cache Lama Biar Gak Menuhi Memori)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Ambil kendali semua tab aplikasi
});
