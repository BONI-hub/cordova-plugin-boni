"use strict";

var async = require('cordova.plugin.boni.аsync'),
    Spot = require('cordova.plugin.boni.spot'),
    Registry = require('cordova.plugin.boni.registry'),
    _ = require('cordova.plugin.boni.lodash');


var BeaconRegistry = function() {};

BeaconRegistry.prototype = function() {
    var spots = [],
        get = function(uuid, major, minor) {

            if (!uuid || !major || !minor) {
                /**
                 * If beacon's major id, minor id or uuid is not defined,
                 * return spot is not exists
                 */
                return;
            }

            major = parseInt(major);
            minor = parseInt(minor);

            /**
             * If all input arguments are valid, check whether the beacon already exists
             * in the beacon registry and return it. Otherwise undefined.
             */
            return _.find(spots, function(spot) {
                var beacon = spot.getSpotIdentifier();

                return (
                    beacon.uuid == uuid &&
                    beacon.major == major &&
                    beacon.minor == minor
                );
            });
        },
        add = function(error, spot) {

            if (!error) {

                /**
                 * If there are no errors, add spot to beacon registry
                 */
                spots.push(spot);
            }
        },

        clear = function() {
            spots = [];
        },

        size = function() {
            return spots.length;
        },

        register = function(beacon, done) {

            if (beacon && beacon.uuid) {

                var spot = new Spot(beacon);
                if (spot) {

                    this.applyProximityStrategy(spot);

                    async.waterfall([
                        function(callback) {
                            spot.getContent(callback);
                        }
                    ], function(err, spotWithData) {

                        if (!err && spotWithData && spotWithData.data && spotWithData.data.length > 0) {
                            add(null, spotWithData);
                            done(beacon);
                        } else {
                            add(null, spot);
                            done(null);
                        }
                    });
                }
            } else {
                throw 'Beacon is not valid';
            }
        },
        process = function(beacon) {

            if (!beacon) {
                throw "Beacon is not valid";
            }

            var spot = get(beacon.uuid, beacon.major,
                beacon.minor);

            /**
             * Check whether the spots is registered
             */
            if (spot) {
                /**
                 * Update iBeacon metadata
                 */
                var currentBeacon = spot.getSpotIdentifier();
                currentBeacon.proximity = beacon.proximity;
                currentBeacon.rssi = beacon.rssi;
                currentBeacon.tx = beacon.tx;
                currentBeacon.accuracy = beacon.accuracy;

                Registry.prototype.callRegisteredCallback.call(this, spot);

            } else {
                /**
                 * If it is not registered, retrieve its data.
                 * In this way only one server call is initiated to retrieve iBeacon Content (cloud) data.
                 */
                this.register(beacon, process);
            }
        };

    return {
        get: get,
        add: add,
        clear: clear,
        size: size,
        register: register,
        process: process
    };
}();

_.extend(BeaconRegistry.prototype, Registry.prototype);
BeaconRegistry.prototype.constructor = BeaconRegistry;

module.exports = BeaconRegistry;