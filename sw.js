// VB Treinos — Service Worker (Offline Cache)
var CACHE = 'vb-treinos-v2';
var ASSETS = [
  '/', '/index.html', '/css/styles.css',
  '/js/exercises.js', '/js/workoutLogic.js', '/js/onboarding.js', '/js/app.js',
  '/manifest.json'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(names) {
    return Promise.all(names.filter(function(n){ return n !== CACHE; }).map(function(n){ return caches.delete(n); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('githubusercontent.com') || e.request.url.includes('fonts.g')) {
    e.respondWith(caches.open(CACHE).then(function(c) {
      return c.match(e.request).then(function(r) {
        return r || fetch(e.request).then(function(res) { c.put(e.request, res.clone()); return res; });
      });
    }));
  } else {
    e.respondWith(caches.match(e.request).then(function(r) { return r || fetch(e.request); }));
  }
});
