var redis   = require('redis');
var flickr  = require('./flickr');
var client  = {};

if(process.env.REDIS_HOST){
  client = redis.createClient(process.env.REDIS_PORT,
    process.env.REDIS_HOST,
    { auth_pass : process.env.REDIS_PASS }
  );
} else{
  client = redis.createClient();
}


exports.fetchPhotosByDate = function(date, next){

  var goGetIt = function(date, next){
    flickr.fetchPhotosByDate(date, function(err, apiResults){
      if(apiResults instanceof Array){
        saveFlickrPhotos(date, apiResults);
        if(next) next(err, apiResults);
      } else{
        if(next) next(err, []);
      }
    });
  };

  client.get(date, function(err, results){
    if(results){
      if(next) next(err, JSON.parse(results));
    } else{
      goGetIt(date, function(err, photos){
        if(next) next(err, photos);
      });
    }
  });
};


// We're limited on storage since we're using a free
// db solution, so it's essential that the object
// be cleaned of unused information before we store
var saveFlickrPhotos = function(key, photos){
  var photosToSave = [];
  photos.forEach(function(photo){
    photosToSave.push({
      id        : photo.id,
      owner     : photo.owner,
      secret    : photo.secret,
      server    : photo.server,
      farm      : photo.farm,
      title     : photo.title,
      latitude  : photo.latitude,
      longitude : photo.longitude
    });
  });

  client.set(key, JSON.stringify(photosToSave));
};


exports.saveFlickrPhotos = saveFlickrPhotos;
exports.client = client;
