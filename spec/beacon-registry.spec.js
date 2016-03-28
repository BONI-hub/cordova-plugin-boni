'use strict';

require('./setup.js');
var Beacon = require('cordova.plugin.boni.beacon'),
  BeaconRegistry = require('cordova.plugin.boni.beaconRegistry'),
  td = require('./test-data.js');


describe("A beacon-registry", function() {

  it("can register beacons if there are no errors", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    beaconRegistry.add(null, {});
    expect(beaconRegistry.size()).toEqual(1);
  });

  it("can't register beacons if there are errors", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    beaconRegistry.add('test', {});
    expect(beaconRegistry.size()).toEqual(0);
  });

  it("return null if request a beacon without uuid", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var beacon = beaconRegistry.get(null, '1', '2');
    expect(beacon).toEqual(null);
  });

  it("return null if request a beacon without major id", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var beacon = beaconRegistry.get('1111-222-333', null, '2');
    expect(beacon).toEqual(null);
  });

  it("return null if request a beacon without minor id", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var beacon = beaconRegistry.get('1111-222-333', '1', null);
    expect(beacon).toEqual(null);
  });

  it("return null if request a beacon but the registry is empty", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var beacon = beaconRegistry.get('1111-222-333', '1', '2');
    expect(beacon).toEqual(null);
  });

  it("return beacon if request a beacon that is in the registry", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    beaconRegistry.add(null, td.registeredBeacon);
    var beacon = beaconRegistry.get(td.registeredBeacon.uuid, td.registeredBeacon.major, td.registeredBeacon.minor);
    expect(beacon.uuid).toEqual(td.registeredBeacon.uuid);
    expect(beacon.major).toEqual(td.registeredBeacon.major);
    expect(beacon.minor).toEqual(td.registeredBeacon.minor);
  });
});
