//the serviceWorker
var staticCacheName = 'transportStatic-v4'

self.addEventListener('install', function(event) {
    // save the scripts and styles needed for the page in cache
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                '/',
                'images/caltrainMap.png',
                'scripts/app.js',
                'scripts/papaparse.js',
                'scripts/repository.js',
                'scripts/indexController.js',
                '/polymerVulcanized.html',
                'bower_components/modernizr/modernizr.js',
                'styles/main.css',
                'bower_components/jquery/dist/jquery.js',
                'bower_components/webcomponentsjs/webcomponents.js'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all( //wait for all promises to resolve
                cacheNames.filter(function(cacheName) {
                    // delete all the old versions of our cache that is not the current cache
                    return cacheName.startsWith('transportStatic-') && cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


self.addEventListener('fetch', function(event) {
    // return with chached item if there is any otherwise take them from network
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) return response;
            return fetch(event.request);
        })
    );
});


// listen for a waiting service worker to install
self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
        console.log('waiting worker installed')
    }
});