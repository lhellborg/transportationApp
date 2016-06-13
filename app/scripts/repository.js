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
		timeTableStore.createIndex('by_stations', 'station');

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

// to get all items in 'station' idb
repository.getStations = function(callback) {

	dbPromise.then(function(db){
		if (!db) return;

		var stationData = db.transaction('station').objectStore('station').index('by_stations');

		return stationData.getAll().then(callback);

	});
}

// lookup departure stations
repository.getTimedata = function(callback) {
	dbPromise.then(function(db) {
		if (!db) return;

	 	var timeData = db.transaction('timeTable', 'readwrite').objectStore('timeTable').index('by_stations');
	 	return timeData.getAll().then(callback);
	})
}

// // lookup departure stations
// repository.getTimedata = function(depStation, callback) {
// 	var keyRangeValue = IDBKeyRange.only(depStation);
// 	dbPromise.then(function(db) {
// 		if (!db) return;

// 	 	var timeData = db.transaction('timeTable', 'readwrite').objectStore('timeTable').index('by_stations');

// 	 	return timeData.openCursor(keyRangeValue).then(callback);
// 	})
// }

// populate the timeTable with data from stop-times.txt and with the name of hte station
repository.storeTimetable = function(data) {

	repository.getStations(function(stations) {
		// make an object with a stopID and stopName pair
		var stationNamesById = {};
		stations.forEach(function(station) {
			stationNamesById[station.stop_id] = station.stop_name;
		})

		dbPromise.then(function(db) {
			if (!db) return;

			var tx = db.transaction('timeTable', 'readwrite');
			var store = tx.objectStore('timeTable');

			data.forEach(function(trip) {
				var stationName = stationNamesById[trip.stop_id]; //add the name of the station
				store.put({
					trip: (trip.trip_id + trip.stop_sequence),
					trip_id: trip.trip_id,
					arrival_time: trip.arrival_time,
					departure_time: trip.departure_time,
					stop_id: trip.stop_id,
					station: stationName,
					stop_sequence: trip.stop_sequence
				});
			})

		})

	})

}

export default repository;


