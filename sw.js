// Service Worker for Car Rental Ranchi
// Version 1.1.0 - Progressive Web App - Updated February 14, 2026

const CACHE_NAME = 'car-rental-ranchi-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/enhanced-3d.css',
    '/js/script.js',
    '/js/enhanced-3d.js',
    '/favicon.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then((response) => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Cache successful GET requests
                    if (event.request.method === 'GET') {
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                    }
                    
                    return response;
                });
            })
            .catch(() => {
                // Return offline page if available
                return caches.match('/offline.html');
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
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
    console.log('Syncing pending bookings...');
}

// Push notification support
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from Car Rental Ranchi',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
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
            clients.openWindow('https://www.carrentalranchi.com/#booking')
        );
    }
});
