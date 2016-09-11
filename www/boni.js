"use strict";

var config = require('cordova.plugin.boni.config'),
    BeaconRegistry = require('cordova.plugin.boni.beaconRegistry'),
    Beacon = require('cordova.plugin.boni.beacon'),
    _ = require('cordova.plugin.boni.lodash'),
    beaconRegistry = new BeaconRegistry();

function Boni() {
    cordova.plugins.BluetoothStatus.initPlugin();
}

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
    if (!configObj) {
        return;
    }

    if (configObj.uuid && _.isArray(configObj.uuid)) {
        for (var idx = 0; idx < configObj.uuid.length; idx++) {
            config.uuid.push(configObj.uuid[idx]);
        }
    }

    if (configObj.idleTime) {
        config.idleTime = configObj.idleTime;
    }

    if (configObj.rangingDuration) {
        config.rangingDuration = configObj.rangingDuration;
    }

    if (configObj.initialRangingDuration) {
        config.initialRangingDuration = configObj.initialRangingDuration;
    }
};

Boni.prototype.startRangingMultipleSpots = function() {
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

Boni.prototype.stopRangingMultipleSpots = function() {
    for (var supportedBeaconIdx = 0; supportedBeaconIdx < config.uuid.length; supportedBeaconIdx++) {
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(config.identifier +
            supportedBeaconIdx, config.uuid[supportedBeaconIdx]);

        cordova.plugins.locationManager.stopRangingBeaconsInRegion(beaconRegion)
            .fail(function(e) { console.error(e); })
            .done();
    }
};

Boni.prototype.rangingMultipleSpots = function(rangingDuration, idleTime) {
    if (!rangingDuration) {
        rangingDuration = config.rangingDuration;
    }

    if (!idleTime) {
        idleTime = config.idleTime;
    }

    var that = this;

    setInterval(function() {
        that.startRangingMultipleSpots();
        setTimeout(function() {
            that.stopRangingMultipleSpots();
        }, rangingDuration);
    }, rangingDuration + idleTime);
};

Boni.prototype.ranging = function() {

    function listHandler(a) {
        console.log(JSON.stringify(a));
    }

    function fail(e) {
        console.log("Failed" + e);
    }


    function getScanResult() {

        WifiWizard.getScanResults(listHandler, fail);
    }

    getScanResult();

    if (!cordova.plugins.BluetoothStatus.BTenabled) {
        if (device.platform == "Android") {
            cordova.plugins.BluetoothStatus.enableBT();
        } else {
            alert("Bluetooth is disabled! Please enable it!");
        }
    }

    var delegate = new cordova.plugins.locationManager.Delegate();

    delegate.didRangeBeaconsInRegion = function(pluginResult) {
        console.log("didRangeBeaconsInRegion");
        if (pluginResult && pluginResult.beacons) {
            for (var beaconIdx = 0; beaconIdx < pluginResult.beacons.length; beaconIdx++) {
                var currentBeacon = pluginResult.beacons[beaconIdx];
                var currentBeaconObj = new Beacon(
                    currentBeacon.uuid,
                    currentBeacon.major,
                    currentBeacon.minor,
                    currentBeacon.proximity,
                    currentBeacon.rssi,
                    currentBeacon.tx,
                    currentBeacon.accuracy
                );
                beaconRegistry.process(currentBeaconObj);
            }
        }
    };

    cordova.plugins.locationManager.setDelegate(delegate);

    var that = this;

    // Initial ranging
    that.startRangingMultipleSpots();
    setTimeout(function() {
        that.stopRangingMultipleSpots();

        that.rangingMultipleSpots();

    }, config.initialRangingDuration);

};

module.exports.boni = new Boni();