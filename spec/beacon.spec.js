'use strict';

var geletest = 'qkoooo';
var cordova = {};
cordova.plugins = {};
cordova.plugins.async = require('../www/lib/async.js');

var Beacon = require('../www/model/beacon.js');


var uuid = "fda50693-a4e2-4fb1-afcf-c6eb07647825",
  majorId = '1',
  minorId = '2',
  proximity = 'ProximityImmediate',
  rssi = '20',
  tx = '30',
  accuracy = '5.5',
  testBeacon = new Beacon(uuid, majorId, minorId, proximity, rssi, tx, accuracy);


describe("A beacon", function() {
  it("store UUID in upper case", function() {
    expect(testBeacon.uuid).toEqual(uuid.toUpperCase());
  });

  it("store major ID as integer", function() {
    expect(testBeacon.major).toEqual(parseInt(majorId));
    expect(typeof(testBeacon.major)).toEqual('number');
  });

  it("store minor ID as integer", function() {
    expect(testBeacon.minor).toEqual(parseInt(minorId));
    expect(typeof(testBeacon.minor)).toEqual('number');
  });

  it("store proximity as string", function() {
    expect(testBeacon.proximity).toEqual(proximity);
    expect(typeof(testBeacon.proximity)).toEqual('string');
  });

  it("store rssi as integer", function() {
    expect(testBeacon.rssi).toEqual(parseInt(rssi));
    expect(typeof(testBeacon.rssi)).toEqual('number');
  });

  it("store tx as integer", function() {
    expect(testBeacon.tx).toEqual(parseInt(tx));
    expect(typeof(testBeacon.tx)).toEqual('number');
  });

  it("store accuracy as integer", function() {
    expect(testBeacon.accuracy).toEqual(parseFloat(accuracy));
    expect(typeof(testBeacon.accuracy)).toEqual('number');
  });

  it("can retrieve content (cloud) data", function() {
    function dataReceived() {

    }
    testBeacon.getData(dataReceived);
  });
});
