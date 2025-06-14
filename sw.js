// Service Worker for Clashy PWA
const CACHE_NAME = 'clashy-v2.1.0';
const OFFLINE_URL = '/index.html';

// Files to cache for offline functionality
const CACHE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/alhajami.html',
  '/Al Ghadeer Office.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'https://wgvkbrmcgejscgsyapcs.supabase.co/storage/v1/object/public/images//Clashy.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching files');
        return cache.addAll(CACHE_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker: All files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('📦 Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // Fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache GET requests to same origin
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // If both cache and network fail, show offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return a custom offline response
            return new Response(
              JSON.stringify({
                error: 'Offline',
                message: 'This content is not available offline'
              }),
              {
                status: 200,
                statusText: 'OK',
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );
          });
      })
  );
});

// Background sync for when connectivity is restored
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background operations here
      syncData()
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push received', event);
  
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد من كلاشي',
    icon: 'https://wgvkbrmcgejscgsyapcs.supabase.co/storage/v1/object/public/images//Clashy.png',
    badge: 'https://wgvkbrmcgejscgsyapcs.supabase.co/storage/v1/object/public/images//Clashy.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'تصفح المنتجات',
        icon: 'https://via.placeholder.com/24x24/8B5CF6/FFFFFF?text=📦'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: 'https://via.placeholder.com/24x24/64748B/FFFFFF?text=✖️'
      }
    ],
    requireInteraction: true,
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification('كلاشي - السوق الإلكتروني', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notification clicked', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/?view=products')
    );
  } else if (event.action === 'close') {
    // Do nothing, just close
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('🔔 Service Worker: Notification closed', event);
});

// Sync data function
async function syncData() {
  try {
    console.log('🔄 Service Worker: Syncing data...');
    
    // Here you can add logic to sync offline changes
    // with your Supabase database when connectivity is restored
    
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        message: 'تم مزامنة البيانات بنجاح'
      });
    });
    
  } catch (error) {
    console.error('❌ Service Worker: Sync failed', error);
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('💬 Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('⏰ Service Worker: Periodic sync', event.tag);
  
  if (event.tag === 'content-sync') {
    event.waitUntil(syncData());
  }
});

// Handle app shortcuts
self.addEventListener('notificationclick', (event) => {
  if (event.action === 'products') {
    clients.openWindow('/?view=products');
  } else if (event.action === 'stores') {
    clients.openWindow('/?view=stores');
  } else if (event.action === 'create-store') {
    clients.openWindow('/?action=create-store');
  } else if (event.action === 'cart') {
    clients.openWindow('/?view=cart');
  }
});

console.log('🚀 Service Worker: Loaded successfully');
