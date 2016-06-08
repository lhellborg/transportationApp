import idb from 'idb';

var dbPromise = idb.open('caltrain', 1, function(upgradeDb) {
	if(upgradeDb.oldVersion === 0) {

		// create a database called "caltrain" with an objectStore: "station"
		// that uses stop-id as its key and has an index called "stations"
		// which is sorted by the "stop-name"

		var stationStore = upgradeDb.createObjectStore('station', {
			keyPath: 'stop_id'
		});
		stationStore.createIndex('station', 'stop_name');

		// var timeTableStore = upgradeDb.createObjectStore('timeTable', {
		// 	keyPath: ''
		// });
		// timeTableStore.createIndex('timeTable', '');

	}
});

var repository = {
};

// to store stations in the 'station' database from the file stops.txt
repository.storeStations = function(data) {

	dbPromise.then(function(db){
		if (!db) return;

		var tx = db.transaction('station', 'readwrite');
		var store = tx.objectStore('station');

		data.forEach(function (stop) {
			store.put({
				stop_name: stop.stop_name,
				stop_id: stop.stop_id
			});
		})
	});
}

// to create a datalist with stations to be selected by the user input
repository.showStations = function() {

	dbPromise.then(function(db){
		if (!db) return;

		var stationData = db.transaction('station').objectStore('station').index('stations');
		var datalist = document.getElementById('stations');


		return stationData.getAll().then(function(stations) {
			var stationOld = '';
			stations.forEach(function(station) {
				var stationNew = station.stop_name;
				if (stationOld !== stationNew) {

					var option = document.createElement('option');
					option.value = station.stop_name;
					datalist.appendChild(option);
					stationOld = station.stop_name;
				}
			})
		})


	});
}


export default repository;


