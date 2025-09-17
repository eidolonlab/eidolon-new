const CACHE_NAME = 'eidolon-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/user-guide.html',
  '/privacy-policy.html',
  '/terms-of-service.html'
];

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  // Take control immediately
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Network first for HTML, cache first for assets
        if (event.request.destination === 'document') {
          return fetch(event.request).catch(() => response);
        }
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