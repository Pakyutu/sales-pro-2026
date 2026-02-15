const CACHE_NAME = 'sales-pro-v41'; // JANGAN LUPA NAIKKAN INI JADI v41
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 1. INSTALL: Langsung aktif tanpa nunggu
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. AKTIVASI: Hapus cache versi lama (PENTING BIAR BERSIH)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // Ambil alih kontrol seketika
});

// 3. FETCH: Strategi "Network First" dengan PAKSAAN (cache: 'reload')
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Cek apakah yang diminta adalah halaman utama (HTML)
  if (url.origin === location.origin && (url.pathname === '/' || url.pathname.endsWith('index.html'))) {
    event.respondWith(
      // INI KUNCINYA: { cache: 'reload' } memaksa browser mengabaikan cache internalnya
      fetch(request, { cache: 'reload' })
        .then(networkResponse => {
          // Kalau berhasil dapat data baru dari internet, simpan ke cache SW
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Kalau internet mati, baru pasrah pakai cache lama
          return caches.match(request);
        })
    );
  } else {
    // Untuk gambar/font/script lain, pakai Cache dulu biar ngebut
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request);
      })
    );
  }
});
