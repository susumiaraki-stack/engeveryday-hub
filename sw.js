// Service Worker สำหรับ PWA English Tracker
const CACHE_NAME = 'eng-tracker-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Network First strategy (ดึงข้อมูลสดจากเน็ตก่อนเสมอ ถ้าออฟไลน์ค่อยดึงจากแคช)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
