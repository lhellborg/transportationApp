
import repository from './repository.js'


function loadDatabase() {

	var stops = [];


	parseCsv('../trainSchedule_GTFS/stops.txt', function(data) {
		repository.storeStations(data);
	});

	function parseCsv(url, callback){
		Papa.parse(url, {
			delimiter: ",",
			download:true,
			header:true,
			complete: function(results) {
				callback(results.data);
			}
		});
	};
}

repository.showStations();

	function registerSW() {
	  if (!navigator.serviceWorker) return;

	  var indexController = this;

	  navigator.serviceWorker.register('scripts/sw/index.js').then(function() {
	  	console.log('registered a new service worker');
	  }).catch(function() {
	  	console.log('not registered')
	  });
	}



export default function IndexController() {

	loadDatabase();
	registerSW();
}