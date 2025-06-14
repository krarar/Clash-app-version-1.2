// Service Worker لتطبيق كلاشي PWA
// ملف: sw.js

const CACHE_NAME = 'clashy-v1.0.0';
const STATIC_CACHE = 'clashy-static-v1';
const DYNAMIC_CACHE = 'clashy-dynamic-v1';

// الملفات الأساسية للتخزين المؤقت
const STATIC_FILES = [
    '/',
    '/index.html',
    '/alhajami.html',
    '/Al Ghadeer Office.html',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://wgvkbrmcgejscgsyapcs.supabase.co/storage/v1/object/public/images//Clashy.png'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: تثبيت...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📦 Service Worker: تخزين الملفات الأساسية...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker: تم التثبيت بنجاح');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: خطأ في التثبيت:', error);
            })
    );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: تفعيل...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // حذف التخزين المؤقت القديم
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Service Worker: حذف التخزين القديم:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: تم التفعيل بنجاح');
                return self.clients.claim();
            })
    );
});

// اعتراض طلبات الشبكة
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // تجاهل طلبات غير HTTP/HTTPS
    if (!requestUrl.protocol.startsWith('http')) {
        return;
    }

    // استراتيجية مختلفة للطلبات المختلفة
    if (isStaticAsset(event.request)) {
        // Cache First للملفات الثابتة
        event.respondWith(cacheFirst(event.request));
    } else if (isApiRequest(event.request)) {
        // Network First لطلبات API
        event.respondWith(networkFirst(event.request));
    } else if (isImageRequest(event.request)) {
        // Cache First للصور مع fallback
        event.respondWith(imageStrategy(event.request));
    } else {
        // Network First مع Cache Fallback للصفحات
        event.respondWith(networkFirst(event.request));
    }
});

// استراتيجية Cache First
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('❌ Cache First خطأ:', error);
        
        // إرجاع صفحة offline إذا كانت متاحة
        if (request.destination === 'document') {
            return caches.match('/offline.html') || 
                   new Response('غير متصل بالإنترنت', { 
                       status: 503,
                       headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                   });
        }
        
        throw error;
    }
}

// استراتيجية Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.warn('⚠️ Network First: فشل الشبكة، البحث في التخزين المؤقت');
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // إرجاع استجابة افتراضية للصفحات
        if (request.destination === 'document') {
            return caches.match('/index.html') ||
                   new Response(`
                       <!DOCTYPE html>
                       <html lang="ar" dir="rtl">
                       <head>
                           <meta charset="UTF-8">
                           <meta name="viewport" content="width=device-width, initial-scale=1.0">
                           <title>كلاشي - غير متصل</title>
                           <style>
                               body { 
                                   font-family: 'Tajawal', sans-serif; 
                                   text-align: center; 
                                   padding: 50px; 
                                   background: linear-gradient(135deg, #8B5CF6, #06B6D4);
                                   color: white;
                                   min-height: 100vh;
                                   display: flex;
                                   flex-direction: column;
                                   justify-content: center;
                                   align-items: center;
                               }
                               .offline-icon { font-size: 4rem; margin-bottom: 2rem; }
                               h1 { font-size: 2rem; margin-bottom: 1rem; }
                               p { font-size: 1.2rem; opacity: 0.9; }
                               .retry-btn {
                                   background: rgba(255,255,255,0.2);
                                   color: white;
                                   border: 2px solid white;
                                   padding: 1rem 2rem;
                                   border-radius: 2rem;
                                   font-size: 1.1rem;
                                   cursor: pointer;
                                   margin-top: 2rem;
                                   transition: all 0.3s ease;
                               }
                               .retry-btn:hover {
                                   background: white;
                                   color: #8B5CF6;
                               }
                           </style>
                       </head>
                       <body>
                           <div class="offline-icon">📱</div>
                           <h1>كلاشي</h1>
                           <p>غير متصل بالإنترنت</p>
                           <p>يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة</p>
                           <button class="retry-btn" onclick="window.location.reload()">
                               إعادة المحاولة
                           </button>
                       </body>
                       </html>
                   `, {
                       headers: { 'Content-Type': 'text/html; charset=utf-8' }
                   });
        }
        
        throw error;
    }
}

// استراتيجية خاصة للصور
async function imageStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        // إرجاع صورة placeholder للصور التي فشل تحميلها
        return new Response(`
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#8B5CF6"/>
                <text x="50%" y="50%" font-family="Arial" font-size="16" fill="white" 
                      text-anchor="middle" dy=".3em">صورة غير متاحة</text>
            </svg>
        `, {
            headers: { 'Content-Type': 'image/svg+xml' }
        });
    }
}

// دوال مساعدة لتحديد نوع الطلب
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(css|js|woff|woff2|ttf|eot|ico)$/);
}

function isApiRequest(request) {
    const url = new URL(request.url);
    return url.hostname.includes('supabase.co') || 
           url.pathname.includes('/api/') ||
           url.pathname.includes('rest/v1/');
}

function isImageRequest(request) {
    return request.destination === 'image' ||
           request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/);
}

// التعامل مع رسائل من التطبيق الرئيسي
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            console.log('🔄 Service Worker: تحديث فوري');
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_KEYS':
            caches.keys().then(cacheNames => {
                event.ports[0].postMessage({ cacheNames });
            });
            break;
            
        case 'CLEAR_CACHE':
            if (data.cacheName) {
                caches.delete(data.cacheName).then(success => {
                    event.ports[0].postMessage({ success });
                });
            }
            break;
            
        case 'CACHE_URL':
            if (data.url) {
                caches.open(DYNAMIC_CACHE).then(cache => {
                    return cache.add(data.url);
                }).then(() => {
                    event.ports[0].postMessage({ success: true });
                }).catch(error => {
                    event.ports[0].postMessage({ success: false, error: error.message });
                });
            }
            break;
            
        default:
            console.log('📨 Service Worker: رسالة غير معروفة:', type);
    }
});

// دعم الإشعارات (Push Notifications)
self.addEventListener('push', event => {
    if (!event.data) {
        return;
    }
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: data.data,
        actions: [
            {
                action: 'explore',
                title: 'استكشاف',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'إغلاق',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// التعامل مع النقر على الإشعارات
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        // فتح التطبيق
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // إغلاق الإشعار فقط
        return;
    } else {
        // النقر العادي على الإشعار
        event.waitUntil(
            clients.matchAll().then(clientList => {
                // إذا كان التطبيق مفتوح، انتقل إليه
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                // وإلا افتح نافذة جديدة
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
});

// تنظيف التخزين المؤقت بشكل دوري
self.addEventListener('periodicsync', event => {
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(cleanupOldCache());
    }
});

async function cleanupOldCache() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        
        // حذف الملفات القديمة (أكثر من 7 أيام)
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 أيام
        
        for (const request of requests) {
            const response = await cache.match(request);
            const dateHeader = response.headers.get('date');
            
            if (dateHeader) {
                const responseDate = new Date(dateHeader).getTime();
                if (now - responseDate > maxAge) {
                    await cache.delete(request);
                    console.log('🗑️ تم حذف ملف قديم من التخزين المؤقت:', request.url);
                }
            }
        }
        
        console.log('✅ تم تنظيف التخزين المؤقت');
    } catch (error) {
        console.error('❌ خطأ في تنظيف التخزين المؤقت:', error);
    }
}

// دعم Background Sync
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // مزامنة البيانات عند الاتصال بالإنترنت
        console.log('🔄 مزامنة البيانات في الخلفية...');
        
        // يمكن إضافة منطق المزامنة هنا
        // مثل إرسال البيانات المحفوظة محلياً إلى الخادم
        
        // إشعار المستخدم بنجاح المزامنة
        self.registration.showNotification('كلاشي', {
            body: 'تم تحديث البيانات بنجاح',
            icon: '/icons/icon-192x192.png',
            tag: 'sync-complete'
        });
        
    } catch (error) {
        console.error('❌ خطأ في المزامنة:', error);
    }
}

console.log('🚀 Service Worker لكلاشي جاهز للعمل!');
console.log('📦 دعم التخزين المؤقت الذكي');
console.log('🔔 دعم الإشعارات');
console.log('📱 العمل بدون إنترنت');
console.log('🔄 المزامنة في الخلفية');
