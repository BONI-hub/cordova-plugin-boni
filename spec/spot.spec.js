'use strict';

require('./setup.js');
var td = require('./test-data.js'),
  Spot = require('cordova.plugin.boni.spot');

describe("A beacon", function() {

  it("can't be created without beacon", function() {
    expect(function() {
      new Spot(null);
    }).toThrow(new Error('Mandatory argument is not provided'));
  });

  it("return 'No spots' error message if there is no content (cloud) data attached", function(done) {
    function dataReceived(err) {
      expect(err).toEqual('No spots');
      done();
    }
    var spot = new Spot(td.notRegisteredBeacon);
    spot.getData(dataReceived);
  });

  //This test is based on the existance of real data in Local BONI environment
  it("return content (cloud) data if there is one already attached", function(done) {
    function dataReceived(err, result) {
      expect(err).toEqual(null);
      expect(result.data.length).toEqual(1); // There is 1 content item attached to Spot
      expect(result.data[0].name).toEqual('Test Content [do not delete]');
      expect(result.data[0].description).toEqual('Test Description');
      expect(result.data[0].data.url).toEqual('http://boni.io');
      expect(result.data[0].data.imageUrl).toEqual('http://image.io');
      done();
    }
    var spot = new Spot(td.registeredBeacon);
    spot.getData(dataReceived);
  });
});
