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
		console.log(times);

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
		console.log(times);

		times.forEach(function(time) {
			if (arrStation === time.station) {
				if (depStationTime[time.trip_id] != undefined) {//if the same trip is found in the depStaionTIme object save the arrival station data
					arrStationTime[time.trip_id] = time.departure_time;
				}
			}
		})
	})
});

$( "#searchBtn" ).click(function() {
  console.log(depStationTime);
  console.log(arrStationTime);

  var tripIDdep = _.keys(depStationTime);
  var tripIDarr = _.keys(arrStationTime);
  var tripIDinBoth = _.intersection(tripIDdep, tripIDarr);
  console.log(tripIDinBoth);
  tripIDinBoth.forEach(function(trip) {
  	if (depStationTime[trip] < arrStationTime[trip]) {
  		$('#timeTable').append('<tr><td>' + trip+ '</td><td>' + '  ' +depStationTime[trip] + '</td><td>' + arrStationTime[trip] + '</td></tr>');
  	}
  })

});


