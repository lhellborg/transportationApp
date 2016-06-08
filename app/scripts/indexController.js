
import repository from './repository.js'


function loadDatabase() {

	var stops = [];


	parseCsv('../trainSchedule_GTFS/stops.txt', function(data) {
		repository.storeStations(data);
	});

	parseCsv('../trainSchedule_GTFS/stop_times.txt', function(data) {
		repository.storeTimetable(data);
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