import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import request from 'request';

var requestSettings = {
  method: 'GET',
  url: "http://www.caltrain.com/Assets/GTFS/caltrain/Caltrain-GTFS.zip",
  encoding: null
};

request(requestSettings, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
    feed.entity.forEach(function(entity) {
      if (entity.trip_update) {
        console.log(entity.trip_update);
      }
    });
  }
});

