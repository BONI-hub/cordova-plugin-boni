"use strict";

var Beacon = require('cordova.plugin.boni.beacon'),
  config = require('cordova.plugin.boni.config'),
  _ = require('cordova.plugin.boni.lodash');


/**
 * Collection of all iBeacons in range
 */
var BeaconRegistry = function() {};

BeaconRegistry.prototype = function(){
  var beacons = [],
  /**
   * Event callbacks
   */
  _onFarFromSpot = null,
  _onNearToSpot = null,
  _onImmediateToSpot = null,

  /**
   * Check whether the iBeacon defined with provided meta data is already registered
   * in the beacon registry.
   * @param  {Beacon} beacon object that represents iBeacon metadata
   * @return {boolean}       true if provided iBeacon is already registered in beacon registry,
   *                         otherwise return false
   */
  get = function(uuid, major, minor) {

    if (!uuid || !major || !minor) {
      /**
       * If beacon's major id, minor id or uuid is not defined,
       * return beacon is not exists
       */
      return;
    }

    uuid = uuid.toUpperCase();
    major = parseInt(major);
    minor = parseInt(minor);

    /**
     * If all input arguments are valid, check whether the beacon already exists
     * in the beacon registry and return it. Otherwise undefined.
     */
    return _.find(beacons, {
      'uuid': uuid,
      'major': major,
      'minor': minor
    });
  },

  clear = function(){
    beacons = [];
  },

  size = function(){
    return beacons.length;
  },

  applyProximityStrategy = function(beacon) {
    if (beacon) {
      var proximityFactor = calculateProximityFactor(beacon);

      if (proximityFactor <= config.proximity.immediate.factor) {
        beacon.proximity = config.proximity.immediate.name;
      } else if (proximityFactor >
        config.proximity.immediate.factor + config.proximity.buffer &&
        proximityFactor <= config.proximity.near.factor) {
        beacon.proximity = config.proximity.near.name;
      } else if (proximityFactor >
        config.proximity.near.factor + config.proximity.buffer) {
        beacon.proximity = config.proximity.far.name;
      } else {
        /**
         * If the proximityFactor is in any of the buffers, keep the latest proximity
         */
        beacon.proximity = beacon.previouseProximity;
      }
    }

    function calculateProximityFactor(beacon) {
      return parseInt(parseInt(100 * beacon.rssi - beacon.tx) / beacon.tx);
    }
  },

  observe = function(beacon) {

    function callRegisteredCallback(callback, beacon) {
      if (_.isFunction(callback) && beacon) {
        if (beacon.data) {
          callback(null, beacon.data);
        } else {
          callback('No data');
        }
      }
    }

    var currentBeacon = this.get(beacon.uuid, beacon.major,
      beacon.minor);
    /**
     * Check whether the beacons is registered
     */
    if (currentBeacon) {

      /**
       * Update iBeacon metadata
       */
      currentBeacon.proximity = beacon.proximity;
      currentBeacon.rssi = beacon.rssi;
      currentBeacon.tx = beacon.tx;
      currentBeacon.accuracy = beacon.accuracy;

      this.applyProximityStrategy(currentBeacon);

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
              callRegisteredCallback(_onImmediateToSpot, currentBeacon);
              break;
            case config.proximity.near.name:
              callRegisteredCallback(_onNearToSpot, currentBeacon);
              break;
            case config.proximity.far.name:
              callRegisteredCallback(_onFarFromSpot, currentBeacon);
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
      currentBeacon = new Beacon(
        beacon.uuid,
        beacon.major,
        beacon.minor,
        beacon.proximity,
        beacon.rssi,
        beacon.tx,
        beacon.accuracy
      );
      this.applyProximityStrategy(currentBeacon);
      currentBeacon.getData(this.add);
    }
  },

  /**
   * Add the beacon into beacon register
   * @param  {[type]} error  error message if there is any, null if there is no errors
   * @param  {Beacon} beacon beacon object that represents beacon meatdata
   */
  add = function(error, beacon) {

    if (!error) {

      /**
       * If there are no errors, add beacon to beacon registry
       */
      beacons.push(beacon);
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
    applyProximityStrategy: applyProximityStrategy,
    observe: observe,
    get: get,
    onFarFromSpot: onFarFromSpot,
    onNearToSpot: onNearToSpot,
    onImmediateToSpot: onImmediateToSpot
  };
}();


module.exports = BeaconRegistry;
