var should  = require('should');
var moment  = require('moment');
var db      = require('../libs/db');

describe('Database', function(){

  it('should return a list of photos when the date exists in the past', function(done){
    var yesterday     = new Date().getTime() - 86400000;
    var formattedDate = moment(yesterday).format('YYYY-MM-DD');

    db.fetchPhotosByDate(formattedDate, function(err, photos){
      photos.should.be.instanceof(Array);
      var firstPhoto = photos[0];
      should.exist(firstPhoto);
      firstPhoto.should.have.properties('latitude', 'longitude', 'id');
      done();
    });
  });


  it('should return an error when the date is in the future', function(done){
    var tomorrow      = new Date().getTime() + 86400000;
    var formattedDate = moment(tomorrow).format('YYYY-MM-DD');

    db.fetchPhotosByDate(formattedDate, function(err, photos){
      should.exist(err);
      photos.should.be.instanceof(Array).and.have.lengthOf(0);
      done();
    });
  });

});