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

  it("proximity strategy is immediate if the proximity factor is les than 106", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var rssi = 106,
    tx = 100;
    var beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5');
    beaconRegistry.applyProximityStrategy(beacon);
    expect(beacon.proximity).toEqual('ProximityImmediate');
  });

  it("proximity strategy is immediate if the proximity factor is less than 106", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var rssi = 106,
    tx = 100;
    var beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5');
    beaconRegistry.applyProximityStrategy(beacon);
    expect(beacon.proximity).toEqual('ProximityImmediate');
  });

  it("proximity strategy not changed if it is immediate and then in the buffer", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var rssi = 106,
    tx = 100;
    var beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5');
    beaconRegistry.applyProximityStrategy(beacon);
    expect(beacon.proximity).toEqual('ProximityImmediate');
    beacon.rssi = 111;
    beacon.tx = 100;
    beacon.previouseProximity = 'ProximityImmediate';
    beaconRegistry.applyProximityStrategy(beacon);
    expect(beacon.proximity).toEqual('ProximityImmediate');
  });

  it("proximity strategy is near if the proximity factor is more than 115 and less than 200", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var rssi = 116,
    tx = 100;
    var beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5');
    beaconRegistry.applyProximityStrategy(beacon);
    expect(beacon.proximity).toEqual('ProximityNear');
  });

  it("proximity strategy not changed if it is near and then in the buffer", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var rssi = 116,
    tx = 100;
    var beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5');
    beaconRegistry.applyProximityStrategy(beacon);
    expect(beacon.proximity).toEqual('ProximityNear');
    beacon.rssi = 206;
    beacon.tx = 100;
    beacon.previouseProximity = 'ProximityNear';
    beaconRegistry.applyProximityStrategy(beacon);
    expect(beacon.proximity).toEqual('ProximityNear');
  });

  it("proximity strategy is far if the proximity factor is more than 210", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.clear();
    var rssi = 211,
    tx = 100;
    var beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5');
    beaconRegistry.applyProximityStrategy(beacon);
    expect(beacon.proximity).toEqual('ProximityFar');
  });
});
