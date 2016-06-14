import indexController from './indexController.js';
import repository from './repository.js';
import _ from 'underscore';

indexController();

var depStationTime = {}; //an empty object to be filled with the chosen trips ids and times for the departure station
var arrStationTime = {}; //an empty object to be filled with the chosen trips ids and times for the arrival station

//the value of the chosen departure station collected when leaving the field
$("#departureStation").keyup(function() {
    var depStation = $(this).val();
    $("#departure_station").text(depStation);

    depStationTime = {}; //empty the object
    //populating the depStationTime  object with trips and time key value pairs for the selected station
    repository.getTimedata(depStation, function callback(cursor) {

        if (cursor) {
            depStationTime[cursor.value.trip_id] = cursor.value.departure_time;
            return cursor.continue().then(callback);
        }
    });
});

//the value of the chosen departure station collected when leaving the field
$("#arrivalStation").keyup(function() {
    var arrStation = $(this).val();
    $("#arrival_station").text(arrStation);

    arrStationTime = {}; //empty the object
    //populating the arrStationTime  object with trips and time key value pairs for the selected station
    repository.getTimedata(arrStation, function callback(cursor) {

        if (cursor) {
            arrStationTime[cursor.value.trip_id] = cursor.value.departure_time;
            return cursor.continue().then(callback);
        }
    });
});

//compare the trip id for the depStationTime and arrStaionTime and if same put it on the screen
$("#searchBtn").click(function() {
    $('#timeTable > tr').remove(); //empty the screen before printing out new ones

    var tripIDdep = _.keys(depStationTime);
    var tripIDarr = _.keys(arrStationTime);
    var tripIDinBoth = _.intersection(tripIDdep, tripIDarr); //compares the variables and look for the same key in both

    if (tripIDinBoth.length !== 0) { //if there is at least one trip between the stations
        tripIDinBoth.forEach(function(trip) {
            var p = "1/1/1970 "; //just any date to be able to count difference in time
            var duration = new Date(new Date(p + arrStationTime[trip]) - new Date(p + depStationTime[trip])).toUTCString().split(" ")[4];
            if (depStationTime[trip] < arrStationTime[trip]) {
                $('#timeTable').append('<tr><td>' + trip + '</td><td>' + '  ' + depStationTime[trip] +
                    '</td><td>' + arrStationTime[trip] + '</td><td>' + duration + '</td></tr>');
            }
        });
    } else { //if there is no trains between the two stations
        $('#timeTable').append('<tr><td> Sorry, no trains could be found </td>');
    }

});