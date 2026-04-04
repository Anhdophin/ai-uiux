const CACHE='anhdophin-ebook-pwa-v4';
const ASSETS=['./','./index.html','./assets/styles.css','./assets/reader-format.css','./assets/app.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=> e.waitUntil((async()=>{
  const keys = await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  const isLibraryRequest = url.pathname.includes('/library/') || url.pathname.includes('/api/library-index');
  if (isLibraryRequest) {
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    const copy=res.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy));
    return res;
  }).catch(()=>r)));
});
