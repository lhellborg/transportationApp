import idb from 'idb';

var dbPromise = idb.open('caltrain', 1, function(upgradeDb) {
	if(upgradeDb.oldVersion === 0) {

		// create a database called "caltrain" with an objectStore: "station"
		// that uses stop-id as its key and has an index called "stations"
		// which is sorted by the "stop-name"

		var stationStore = upgradeDb.createObjectStore('station', {
			keyPath: 'stop_id'
		});
		stationStore.createIndex('by_stations', 'stop_name');

		var timeTableStore = upgradeDb.createObjectStore('timeTable', {
			keyPath: 'trip'
		});
		timeTableStore.createIndex('by_trip', 'trip_id');
		timeTableStore.createIndex('by_stations', 'stop_id');

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

		var stationData = db.transaction('station').objectStore('station').index('by_stations');
		var datalist = document.getElementById('stations');


		return stationData.getAll().then(function(stations) {
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
		})


	});
}

// populate tthe timeTable with data from stop-times.txt
repository.storeTimetable = function(data) {
	dbPromise.then(function(db) {
		if (!db) return;

		var tx = db.transaction('timeTable', 'readwrite');
		var store = tx.objectStore('timeTable');

		data.forEach(function(trip) {
			store.put({
				trip: (trip.trip_id + trip.stop_sequence),
				trip_id: trip.trip_id,
				arrival_time: trip.arrival_time,
				departure_time: trip.departure_time,
				stop_id: trip.stop_id,
				stop_sequence: trip.stop_sequence
			});
		})

	})
}

export default repository;


