import indexController from './indexController.js';
import repository from './repository.js';
import _ from 'underscore';

indexController();

var depStationTime = {};
var arrStationTime = {};

$( "#departureStation" ).focusout(function() {
    var depStation = $(this).val();
    $( "#departure_station" ).text(depStation);

    repository.getTimedata(function(times) {
		// console.log(times);
		depStationTime = {} //empty the object
		times.forEach(function(time) {
			if (depStation === time.station) {
				depStationTime[time.trip_id] = time.departure_time;
			}
		})
	})

});

$( "#arrivalStation" ).focusout(function() {
	var arrStation = $(this).val();
	$( "#arrival_station" ).text(arrStation);

	repository.getTimedata(function(times) {
		// console.log(times);
		arrStationTime = {} //empty the object
		times.forEach(function(time) {
			if (arrStation === time.station) {
				arrStationTime[time.trip_id] = time.departure_time;
			}
		})
	})
});

$( "#searchBtn" ).click(function() {
	$('#timeTable > tr').remove();
	console.log(depStationTime);
	console.log(arrStationTime);

	var tripIDdep = _.keys(depStationTime);
	var tripIDarr = _.keys(arrStationTime);
	var tripIDinBoth = _.intersection(tripIDdep, tripIDarr);
	console.log(tripIDinBoth);

	if (tripIDinBoth.length !== 0) {
		tripIDinBoth.forEach(function(trip) {
			var p = "1/1/1970 "; //just any date to be able to count difference in time
			var duration = new Date(new Date(p+ arrStationTime[trip]) - new Date(p+depStationTime[trip])).toUTCString().split(" ")[4];;
			if (depStationTime[trip] < arrStationTime[trip]) {
				$('#timeTable').append('<tr><td>' + trip+ '</td><td>' + '  ' + depStationTime[trip] +
					'</td><td>' + arrStationTime[trip] + '</td><td>' + duration + '</td></tr>');
			}
		})
	} else {
		$('#timeTable').append('<tr><td> Sorry, no trains could be found </td>')
	}

});


