const CACHE_NAME = 'eidolon-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for spaced retrieval notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'retrieval-reminder') {
    event.waitUntil(sendRetrievalReminder());
  }
});

async function sendRetrievalReminder() {
  const registration = await self.registration;
  registration.showNotification('Time for Memory Training', {
    body: 'Practice retrieving your recent memory weaves',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'retrieval-reminder',
    actions: [
      {
        action: 'train',
        title: 'Start Training'
      },
      {
        action: 'later',
        title: 'Remind Later'
      }
    ]
  });
}