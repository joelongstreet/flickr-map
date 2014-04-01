var flapi   = require('flapi');
var client  = new flapi({
  oauth_consumer_key    : process.env.FLICKR_KEY,
  oauth_consumer_secret : process.env.FLICKR_SECRET
});


var parsePhotos = function(photos){
  var parsed = [];
  photos.forEach(function(photo){
    if(photo.latitude) parsed.push(photo);
  });

  return parsed;
};


exports.fetchPhotosByDate = function(date, next){
  client.api({
    method  : 'flickr.interestingness.getList',
    params  : {
      date    : date,
      extras  : 'geo'
    },
    next    : function(results){
      if(results.photos){
        next(null, parsePhotos(results.photos.photo));
      } else next(404, []);
    }
  });
};
