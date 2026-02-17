// Service Worker for Car Rental Ranchi
// Version 4.0.8 - Network-first for all resources - February 17, 2026

const CACHE_NAME = 'car-rental-ranchi-v21';
const STATIC_CACHE = 'static-v21';
const DYNAMIC_CACHE = 'dynamic-v21';
const IMAGE_CACHE = 'images-v21';

const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.min.css',
    '/js/script.min.js',
    '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Handle images separately with longer cache
    if (request.destination === 'image') {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                return cachedResponse || fetch(request).then((response) => {
                    return caches.open(IMAGE_CACHE).then((cache) => {
                        cache.put(request, response.clone());
                        return response;
                    });
                });
            }).catch(() => caches.match('/offline.html'))
        );
        return;
    }
    
    // Network first for API calls and forms
    if (request.method !== 'GET' || url.pathname.includes('/api/')) {
        event.respondWith(
            fetch(request).catch(() => caches.match('/offline.html'))
        );
        return;
    }
    
    // Network first for HTML pages to prevent stale cached content on back navigation
    if (request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(request).then((response) => {
                // Cache the fresh response
                const responseToCache = response.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(request, responseToCache);
                });
                return response;
            }).catch(() => {
                // Fallback to cache if network fails
                return caches.match(request).then((cachedResponse) => {
                    return cachedResponse || caches.match('/offline.html');
                });
            })
        );
        return;
    }
    
    // Network first for CSS/JS/fonts to always get latest updates
    event.respondWith(
        fetch(request).then((response) => {
            if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(request, responseToCache);
                });
            }
            return response;
        }).catch(() => {
            // Fallback to cache if network fails
            return caches.match(request).then((cachedResponse) => {
                return cachedResponse || caches.match('/offline.html');
            });
        })
    );
});

// Activate event - WIPE ALL old caches to force fresh content
self.addEventListener('activate', (event) => {
    const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete ALL caches that don't match current version
                    if (!currentCaches.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    return self.clients.claim();
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-bookings') {
        event.waitUntil(syncBookings());
    }
});

async function syncBookings() {
    // Retrieve pending bookings from IndexedDB and sync
}

// Push notification support
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from Car Rental Ranchi',
        icon: '/images/favicon-192x192.png',
        badge: '/images/favicon-48x48.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'book',
                title: 'Book Now'
            },
            {
                action: 'close',
                title: 'Close'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Car Rental Ranchi', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'book') {
        event.waitUntil(
            clients.openWindow('https://carrentalranchi.com/#booking')
        );
    }
});
