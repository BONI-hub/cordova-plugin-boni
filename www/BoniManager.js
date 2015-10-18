"use strict";

var config = require('cordova.plugin.boni.Config');

function BoniManager() {}

BoniManager.prototype.onUserJustInSpot = function(callback) {
	cordova.plugins.beaconRegistry.onUserJustInSpot(callback);
};

BoniManager.prototype.onUserImmediateToSpot = function(callback) {
	cordova.plugins.beaconRegistry.onUserImmediateToSpot(callback);
};

BoniManager.prototype.onUserNearToSpot = function(callback) {
	cordova.plugins.beaconRegistry.onUserNearToSpot(callback);
};

BoniManager.prototype.onUserFarFromSpot = function(callback) {
	cordova.plugins.beaconRegistry.onUserFarFromSpot(callback);
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
