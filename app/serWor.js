var staticCacheName = 'transportStatic-v1'

self.addEventListener('install', function(event) {
	// save the scripts and styles needed for the page in cache cvc
	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache.addAll([
				'/',
				'scripts/main.js',
				'scripts/papaparse.js',
				'/polymerVulcanized.html',
				'bower_components/modernizr/modernizr.js',
				'styles/main.scss',
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
					return cache.delete(cacheName);
				})
			);
		})
	);
});


self.addEventListener('fetch', function(event) {
	// return with chached item if there is any otherwise take them from network
  event.respondWith(
  	caches.match(event.request).then(function(response) {
  		console.log(response)
  		if (response) return response;
  		return fetch(event.request);
  	})
  );
});