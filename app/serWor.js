self.addEventListener('fetch', function(event) {

  event.respondWith(
  	new Response('HEllo World dcdcdc')
  	);

  console.log('yo')
});