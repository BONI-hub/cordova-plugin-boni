"use strict";

var Beacon = require('cordova.plugin.boni.Beacon'),
  config = require('cordova.plugin.boni.Config'),
  _ = require('cordova.plugin.boni.Lodash'),
  beacons = []; //Array with the beacons in range

/**
 * Event callbacks
 */
var onFarFromSpot = null;
var onNearToSpot = null;
var onImmediateToSpot = null;

/**
 * Collection of all beacons in range
 */
function BeaconRegistry() {}

/**
 * Check whether the beacon defined with provided meta data is already registered
 * in the beacon registry.
 * @param  {Beacon} beacon object that represents beacon meatdata
 * @return {boolean}       true if provided beacon is already registered in beacon registry,
 *                         otherwise return false
 */
BeaconRegistry.prototype.getBeaconFromRegistry = function(uuid, major, minor) {

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
};

BeaconRegistry.prototype.applyProximityStrategy = function(beacon) {
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
};

function calculateProximityFactor(beacon) {
  return parseInt(parseInt(100 * beacon.rssi - beacon.tx) / beacon.tx);
}

function callRegisteredCallback(callback, beacon) {
  if (_.isFunction(callback) && beacon) {
    if (beacon.data) {
      callback(null, beacon.data);
    } else {
      callback('No data');
    }
  }
}

BeaconRegistry.prototype.observe = function(beacon) {

  var currentBeacon = this.getBeaconFromRegistry(beacon.uuid, beacon.major,
    beacon.minor);
  /**
   * Check whether the beacons is registered
   */
  if (currentBeacon) {

    /**
     * Update beacon metadata
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
            callRegisteredCallback(onImmediateToSpot, currentBeacon);
            break;
          case config.proximity.near.name:
            callRegisteredCallback(onNearToSpot, currentBeacon);
            break;
          case config.proximity.far.name:
            callRegisteredCallback(onFarFromSpot, currentBeacon);
            break;
          default:

        }
      }
    }

  } else {
    /**
     * If it is not registered, retrieve its data.
     * In this way only one server call is initiated to retrieve beacon data.
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
    currentBeacon.getData(add);
  }
};

/**
 * Add the beacon into beacon register
 * @param  {[type]} error  error message if there is any, null if there is no errors
 * @param  {Beacon} beacon beacon object that represents beacon meatdata
 */
function add(error, beacon) {

  if (!error) {

    /**
     * If there are no errors, add beacon to beacon registry
     */
    beacons.push(beacon);
  }
}

/**
 * Register onImmediateToSpot callback
 * @param  {Function} callback function to be called when the user is immediate to spot
 */
BeaconRegistry.prototype.onImmediateToSpot = function(callback) {
  onImmediateToSpot = callback;
};

/**
 * Register onNearToSpot callback
 * @param  {Function} callback function to be called when the user is near to spot
 */
BeaconRegistry.prototype.onNearToSpot = function(callback) {
  onNearToSpot = callback;
};

/**
 * Register onFarFromSpot callback
 * @param  {Function} callback function to be called when the user is far from spot
 */
BeaconRegistry.prototype.onFarFromSpot = function(callback) {
  onFarFromSpot = callback;
};

module.exports.beaconRegistry = new BeaconRegistry();
