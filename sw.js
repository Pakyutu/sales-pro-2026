// sw.js - VERSI "AUTO UPDATE" (Gak Perlu Ganti Angka Lagi)
const CACHE_NAME = 'sales-pro-permanent'; 
const URLS_TO_CACHE = ['./', './index.html', './manifest.json'];

// 1. INSTALL: Langsung siap kerja
self.addEventListener('install', event => {
    self.skipWaiting(); // Jangan antre, langsung aktif
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

// 2. ACTIVATE: Hapus cache sampah (selain cache utama)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Ambil alih kontrol HP seketika
});

// 3. FETCH: STRATEGI "INTERNET DULU BARU MEMORI"
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // HORE! ADA INTERNET & DAPAT DATA BARU
                // Kita simpan data baru ini ke memori biar besok kalau offline tetap update
                if(networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // YAH, GAK ADA INTERNET / OFFLINE
                // Ya sudah, pakai data yang ada di memori aja
                return caches.match(event.request);
            })
    );
});
