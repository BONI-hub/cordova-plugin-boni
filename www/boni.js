"use strict";

var config = require('cordova.plugin.boni.config'),
  BeaconRegistry = require('cordova.plugin.boni.beaconRegistry'),
  _ = require('cordova.plugin.boni.lodash'),
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

Boni.prototype.onAlwaysForSpot = function(callback) {
  beaconRegistry.onAlwaysForSpot(callback);
};

Boni.prototype.configure = function(configObj) {
  if(!configObj){
    return;
  }

  if(configObj.uuid && _.isArray(configObj.uuid)){
    for(var idx = 0; idx < configObj.uuid.length; idx++){
      config.uuid.push(configObj.uuid[idx]);
    }
  }
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
