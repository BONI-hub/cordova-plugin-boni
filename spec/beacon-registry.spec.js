'use strict';

require('./setup.js');
var Beacon = require('cordova.plugin.boni.beacon'),
  BeaconRegistry = require('cordova.plugin.boni.beaconRegistry'),
  td = require('./test-data.js');


describe("A beacon-registry", function() {

  it("can register beacons if there are no errors", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.beacons = [];
    beaconRegistry.add(null, {});
    expect(beaconRegistry.beacons.length).toEqual(1);
  });

  it("can't register beacons if there are errors", function() {
    var beaconRegistry = new BeaconRegistry();
    beaconRegistry.beacons = [];
    beaconRegistry.add('test', {});
    expect(beaconRegistry.beacons.length).toEqual(0);
  });
});
