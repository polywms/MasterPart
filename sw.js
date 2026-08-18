const CACHE_NAME = 'mgl-pwa-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Event Install: Menyimpan UI Web ke dalam memori HP
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Event Activate: Membersihkan cache lama jika ada update versi aplikasi
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Event Fetch: Menampilkan UI dari cache saat offline
self.addEventListener('fetch', (event) => {
  // PENTING: Biarkan POST request (API Data Sparepart ke Google) lewat tanpa di-cache.
  // Karena data part-nya sudah diurus oleh IndexedDB secara mandiri di index.html
  if (event.request.method === 'POST') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Kembalikan dari cache jika ada, jika tidak, ambil dari internet
      return response || fetch(event.request);
    })
  );
});
