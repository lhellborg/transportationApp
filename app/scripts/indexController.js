
import repository from './repository.js'

// load database with default train schedule
function loadDatabase() {
	parseCsv('../trainSchedule_GTFS/stops.txt', function(data) {
		repository.storeStations(data);
	});

	parseCsv('../trainSchedule_GTFS/stop_times.txt', function(data) {
		repository.storeTimetable(data);
	});

// read csv files and transform them to json
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

// to create a datalist with stations to be selected by the user input
repository.getStations(function(stations) {
	var datalist = document.getElementById('stations');
	var stationOld = '';
	stations.forEach(function(station) {
		var stationNew = station.stop_name;
		if (stationOld !== stationNew) { //disregard duplicate stations

			var option = document.createElement('option');
			option.value = station.stop_name;
			datalist.appendChild(option);
			stationOld = station.stop_name;
		}
	})
});

// register a service worker
function registerSW() {
  if (!navigator.serviceWorker) return;

  var indexController = this;

  navigator.serviceWorker.register('/serWor.js', {
  	scope: '/'
  }).then(function(registration) {
  	if (!navigator.serviceWorker.controller) {
  		return; //no service worker
  	}

  	if (registration.waiting) {
  		registration.waiting.postMessage({action: 'skipWaiting'}); //all updates should go out directly
  		console.log('service worker waiting')
  	}
  	console.log('registered a service worker with scope: ', registration.scope);
  }).catch(function() {
  	console.log('serviceWorker not registered')
  });
}



export default function IndexController() {

	loadDatabase();
	registerSW();
}