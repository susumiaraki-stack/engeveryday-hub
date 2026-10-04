// Service Worker สำหรับ PWA พื้นฐาน
const CACHE_NAME = 'eng-tracker-v1';
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
  );
});

// Network First strategy (ดึงข้อมูลสดจากเน็ตก่อนเสมอ ถ้าออฟไลน์ค่อยดึงจากแคช)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
