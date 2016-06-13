
import repository from './repository.js'


//could not retireve data from caltrain: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:9000' is therefore not allowed access.

// import JSZip from 'jszip'
// import JSZipUtils from 'jszip-utils'

// function retrieveCaltrainData() {

// 	JSZipUtils.getBinaryContent( "http://www.caltrain.com/Assets/GTFS/caltrain/Caltrain-GTFS.zip" ,
// 	function(error, data) {
// 		if (error) {
// 			throw error;
// 		}

// 		var zip = new JSZip(data);
// 		console.log(zip)
// 	});
// }


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
			datalist.appendChild(option); //the list of stations to be selected from
			stationOld = station.stop_name;
		}
	})
});

// register a service worker
function registerSW() {
  if (!navigator.serviceWorker) return; //if the browser does not support servieWorker

  var indexController = this;

  navigator.serviceWorker.register('/serWor.js', {
  	scope: '/'
  }).then(function(registration) {
  	if (!navigator.serviceWorker.controller) {
  		return; //no service worker
  	}

  	if (registration.waiting) {//check to see if there is a service worker waiting to replace the active one
  		registration.waiting.postMessage({action: 'skipWaiting'}); //all updates should go out directly send a message to the service Worker script
  		console.log('service worker waiting')
  	}
  	console.log('registered a service worker with scope: ', registration.scope);
  }).catch(function() {
  	console.log('serviceWorker not registered')
  });
}



export default function IndexController() {

	// retrieveCaltrainData(); not working
	loadDatabase();
	registerSW();
}