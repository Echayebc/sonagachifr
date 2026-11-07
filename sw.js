const CACHE = 'sonagachifr-v2';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon.jpeg'
];

// وقت التثبيت - خزن الملفات
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

// وقت التفعيل - امسح القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE ? caches.delete(k) : null)
    )).then(() => self.clients.claim())
  );
});

// وقت الاستعمال - اخدم بلا انترنت
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      return caches.open(CACHE).then(c => {
        c.put(e.request, res.clone());
        return res;
      });
    }).catch(() => caches.match('./index.html')))
  );
});
