"use strict";

var config = require('cordova.plugin.boni.config'),
  BeaconRegistry = require('cordova.plugin.boni.beaconRegistry'),
  beaconRegistry = new BeaconRegistry();

function Boni() {}

Boni.prototype.onImmediateToSpot = function(callback) {
  beaconRegistry.onImmediateToSpot(callback);
};

Boni.prototype.onNearToSpot = function(callback) {
  beaconRegistry.onNearToSpot(callback);
};

Boni.prototype.onFarFromSpot = function(callback) {
  beaconRegistry.onFarFromSpot(callback);
};

Boni.prototype.ranging = function() {

  var delegate = new cordova.plugins.locationManager.Delegate();

  delegate.didRangeBeaconsInRegion = function(pluginResult) {
    if (pluginResult && pluginResult.beacons) {
      for (var beaconIdx = 0; beaconIdx < pluginResult.beacons.length; beaconIdx++) {
        var currentBeacon = pluginResult.beacons[beaconIdx];
        beaconRegistry.process(currentBeacon);
      }
    }
  };

  cordova.plugins.locationManager.setDelegate(delegate);

  for (var supportedBeaconIdx = 0; supportedBeaconIdx < config.uuid.length; supportedBeaconIdx++) {
    var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(config.identifier +
      supportedBeaconIdx, config.uuid[supportedBeaconIdx]);

    // required in iOS 8+
    cordova.plugins.locationManager.requestWhenInUseAuthorization();
    // or cordova.plugins.locationManager.requestAlwaysAuthorization()
    //
    cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
      .fail(console.error)
      .done();
  }
};

module.exports.boni = new Boni();
