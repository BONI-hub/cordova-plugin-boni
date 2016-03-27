'use strict';

require('./setup.js');
var Beacon = require('cordova.plugin.boni.beacon');
var td = require('./test-data.js');

describe("A beacon", function() {
  it("can't be created without uuid", function() {
    expect(function() {
      new Beacon(null, '1', '2', 'ProximityImmediate', '20', '30', '5.5');
    }).toThrow(new Error('Mandatory argument is not provided'));
  });

  it("can't be created without major id", function() {
    expect(function() {
      new Beacon('fda50693-a4e2-4fb1-afcf-c6eb07647825', null, '2', 'ProximityImmediate', '20', '30', '5.5');
    }).toThrow(new Error('Mandatory argument is not provided'));
  });

  it("can't be created without minor id", function() {
    expect(function() {
      new Beacon('fda50693-a4e2-4fb1-afcf-c6eb07647825', '1', null, 'ProximityImmediate', '20', '30', '5.5');
    }).toThrow(new Error('Mandatory argument is not provided'));
  });

  it("store UUID in upper case", function() {
    expect(td.notRegisteredBeacon.uuid).toEqual(td.notRegisteredBeacon.uuid.toUpperCase());
  });

  it("store major ID as integer", function() {
    expect(td.notRegisteredBeacon.major).toEqual(parseInt(td.notRegisteredBeacon.major));
    expect(typeof(td.notRegisteredBeacon.major)).toEqual('number');
  });

  it("store minor ID as integer", function() {
    expect(td.notRegisteredBeacon.minor).toEqual(parseInt(td.notRegisteredBeacon.minor));
    expect(typeof(td.notRegisteredBeacon.minor)).toEqual('number');
  });

  it("store proximity as string", function() {
    expect(td.notRegisteredBeacon.proximity).toEqual(td.notRegisteredBeacon.proximity);
    expect(typeof(td.notRegisteredBeacon.proximity)).toEqual('string');
  });

  it("store rssi as integer", function() {
    expect(td.notRegisteredBeacon.rssi).toEqual(parseInt(td.notRegisteredBeacon.rssi));
    expect(typeof(td.notRegisteredBeacon.rssi)).toEqual('number');
  });

  it("store tx as integer", function() {
    expect(td.notRegisteredBeacon.tx).toEqual(parseInt(td.notRegisteredBeacon.tx));
    expect(typeof(td.notRegisteredBeacon.tx)).toEqual('number');
  });

  it("store accuracy as integer", function() {
    expect(td.notRegisteredBeacon.accuracy).toEqual(parseFloat(td.notRegisteredBeacon.accuracy));
    expect(typeof(td.notRegisteredBeacon.accuracy)).toEqual('number');
  });

  it("return 'No spots' error message if there is no content (cloud) data attached", function(done) {
    function dataReceived(err) {
      expect(err).toEqual('No spots');
      done();
    }
    td.notRegisteredBeacon.getData(dataReceived);
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
    td.registeredBeacon.getData(dataReceived);
  });
});
