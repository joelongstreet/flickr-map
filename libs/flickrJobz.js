var twix    = require('twix');
var db      = require('./db');
var flickr  = require('./flickr');


var runJob = function(dates){
  var moment = require('moment');

  var fetch = function(date){
    var dateString = moment(date).format('YYYY-MM-DD');

    flickr.fetchPhotosByDate(dateString, function(err, photos){
      if(photos instanceof Array){
        console.log('collected photos for: ', dateString);
        db.saveFlickrPhotos(dateString, photos);
      }
    });
  };

  dates.forEach(function(date){
    fetch(date);
  });
};


exports.fillGapsInTimeline = function(){
  var yesterday     = new Date().getTime() - 86400000;
  var startDate     = new Date('February 1, 2004').getTime();
  var range         = moment(startDate).twix(yesterday);
  var iterator      = range.iterate('days');
  var missingDates  = [];

  db.client.keys('*', function(err, dates){
    while(iterator.hasNext()){
      var nextDate = iterator.next();
      var formattedDate = moment(nextDate).format('YYYY-MM-DD');
      if(dates.indexOf(formattedDate) == -1){
        missingDates.push(formattedDate);
      }
    }

    runJob(missingDates);
  });
};