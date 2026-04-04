const CACHE = 'icon-hub-v2';
const ASSETS = [
  './',
  './index.html',
  './css/base.css',
  './js/app.js',
  './js/home.js',
  './js/modules.js',
  './manifest.json',
  './partials/header.html',
  './partials/footer.html',
  './data/apps.json',
  './assets/pwa/icon-192.png',
  './assets/pwa/icon-512.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
