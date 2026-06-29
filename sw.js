/* FoodMe service worker — cache shell, network-first for HTML */
const CACHE = 'foodme-v1';
const SHELL = ['/', '/index.html', '/shared/fm-design.css', '/shared/fm-premium.css', '/shared/fm-premium.js', '/manifest.json'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(SHELL).catch(function () {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.match(/^\/[^./]+$/)) {
    e.respondWith(
      fetch(e.request).then(function (r) { return r; }).catch(function () {
        return caches.match('/index.html');
      })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      return cached || fetch(e.request).then(function (r) {
        if (r && r.status === 200 && (url.pathname.startsWith('/shared/') || url.pathname.endsWith('.css'))) {
          var clone = r.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, clone); });
        }
        return r;
      });
    })
  );
});
