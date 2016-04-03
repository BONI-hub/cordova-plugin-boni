"use strict";

var async = require('cordova.plugin.boni.аsync'),
  config = require('cordova.plugin.boni.config'),
  Spot = require('cordova.plugin.boni.spot'),
  _ = require('cordova.plugin.boni.lodash');


/**
 * Collection of all iBeacons in range
 */
var BeaconRegistry = function() {};

BeaconRegistry.prototype = function() {
  var _spots = [],
    /**
     * Event callbacks
     */
    _onFarFromSpot = null,
    _onNearToSpot = null,
    _onImmediateToSpot = null,


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
      return _.find(_spots, function(spot) {
        var beacon = spot.getBeacon();

        return (
          beacon.uuid === uuid &&
          beacon.major === major.toString() &&
          beacon.minor === minor.toString()
        );
      });
    },

    add = function(error, spot) {

      if (!error) {

        /**
         * If there are no errors, add spot to beacon registry
         */
        _spots.push(spot);

      }
    },

    clear = function() {
      _spots = [];
    },

    size = function() {
      return _spots.length;
    },

    applyProximityStrategy = function(spot) {

      if (spot) {
        var beacon = spot.getBeacon();
        var proximityFactor = calculateProximityFactor(beacon);

        if (proximityFactor <= config.proximity.immediate.factor) {
          beacon.proximity = config.proximity.immediate.name;
        } else if (proximityFactor >=
          config.proximity.immediate.factor + config.proximity.buffer &&
          proximityFactor <= config.proximity.near.factor) {
          beacon.proximity = config.proximity.near.name;
        } else if (proximityFactor >=
          config.proximity.near.factor + config.proximity.buffer) {
          beacon.proximity = config.proximity.far.name;
        } else {
          /**
           * If the proximityFactor is not in any of the buffers, keep the latest proximity
           */
          beacon.proximity = beacon.previouseProximity;
        }
      }

      function calculateProximityFactor(beacon) {
        return parseInt(parseInt(100 * beacon.rssi - beacon.tx) / beacon.tx);
      }
    },

    register = function(beacon, done) {

      if (beacon) {

        var spot = new Spot(beacon);

        if (spot) {
          applyProximityStrategy(spot);

          async.waterfall([
            function(callback) {

              spot.getData(callback);
            }
          ], function(err, spotWithData) {

            if (!err && spotWithData && spotWithData.data && spotWithData.data.length > 0) {

              add(null, spotWithData);
              done(beacon);
            } else {
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
        throw 'Beacon is not valid';
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
        var currentBeacon = spot.getBeacon();
        currentBeacon.proximity = beacon.proximity;
        currentBeacon.rssi = beacon.rssi;
        currentBeacon.tx = beacon.tx;
        currentBeacon.accuracy = beacon.accuracy;

        applyProximityStrategy(spot);

        if (currentBeacon.proximity) {

          /**
           * If previouse proximity is not set or previouse proximity is different
           * than the current. The idea is to call callback only on change.
           */
          if (!currentBeacon.previouseProximity || currentBeacon.proximity !==
            currentBeacon.previouseProximity) {

            /**
             * update the previouse proximity
             */
            currentBeacon.previouseProximity = currentBeacon.proximity;

            /**
             * Call the appropreate callbacks if there are registered
             */
            switch (currentBeacon.proximity) {
              case config.proximity.immediate.name:
                callRegisteredCallback(_onImmediateToSpot, spot);
                break;
              case config.proximity.near.name:
                callRegisteredCallback(_onNearToSpot, spot);
                break;
              case config.proximity.far.name:
                callRegisteredCallback(_onFarFromSpot, spot);
                break;
              default:

            }
          }
        }

      } else {
        /**
         * If it is not registered, retrieve its data.
         * In this way only one server call is initiated to retrieve iBeacon Content (cloud) data.
         */
        register(beacon, process);
      }

      function callRegisteredCallback(callback, spot) {

        if (_.isFunction(callback) && spot) {
          if (spot.data) {
            callback(null, spot.data);
          }
        }
      }
    },

    /**
     * Register onImmediateToSpot callback
     * @param  {Function} callback function to be called when the user is immediate to spot
     */
    onImmediateToSpot = function(callback) {
      _onImmediateToSpot = callback;
    },

    /**
     * Register onNearToSpot callback
     * @param  {Function} callback function to be called when the user is near to spot
     */
    onNearToSpot = function(callback) {
      _onNearToSpot = callback;
    },

    /**
     * Register onFarFromSpot callback
     * @param  {Function} callback function to be called when the user is far from spot
     */
    onFarFromSpot = function(callback) {
      _onFarFromSpot = callback;
    };

  return {
    clear: clear,
    size: size,
    add: add,
    register: register,
    applyProximityStrategy: applyProximityStrategy,
    process: process,
    get: get,
    onFarFromSpot: onFarFromSpot,
    onNearToSpot: onNearToSpot,
    onImmediateToSpot: onImmediateToSpot
  };
}();


module.exports = BeaconRegistry;
