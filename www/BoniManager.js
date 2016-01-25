"use strict";

var config = require('cordova.plugin.boni.Config');

function BoniManager() {}

BoniManager.prototype.onImmediateToSpot = function(callback) {
	cordova.plugins.beaconRegistry.onImmediateToSpot(callback);
};

BoniManager.prototype.onNearToSpot = function(callback) {
	cordova.plugins.beaconRegistry.onNearToSpot(callback);
};

BoniManager.prototype.onFarFromSpot = function(callback) {
	cordova.plugins.beaconRegistry.onFarFromSpot(callback);
};

BoniManager.prototype.ranging = function() {

	var delegate = new cordova.plugins.locationManager.Delegate();

	delegate.didRangeBeaconsInRegion = function(pluginResult) {
		if (pluginResult && pluginResult.beacons) {
			for (var beaconIdx = 0; beaconIdx < pluginResult.beacons.length; beaconIdx++) {
				var currentBeacon = pluginResult.beacons[beaconIdx];
				cordova.plugins.beaconRegistry.observe(currentBeacon);
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

module.exports.boniManager = new BoniManager();
