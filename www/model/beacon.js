'use strict';

/**
 * Object that represent beacon and contains all its metadata
 * @param {guid} uuid      	unique beacon identifier
 * @param {int} major     	supplementary beacon identifier
 * @param {int} minor     	supplementary beacon identifier
 * @param {string} proximity How far is the user from the beacon:
 *                         		- ProximityUnknown - when proximity is negative
 *                         		- ProximityImmediate - less than 0,5m far away from the beacon
 *                         		- ProximityNear - less than 4m far away from the beacon
 *                         		- ProximityFar - more than 4m far away from the beacon
 * @param {int} rssi      	signal strength
 * @param {int} tx        	transmission power
 * @param {float} accuracy  rough distance estimate limited to two decimal places (in meteres)
 */
var Beacon = function(uuid, major, minor, proximity, rssi, tx, accuracy) {
  /**
   * Check whether the mandatory arguments are provided
   */
  if (!uuid || !major || !minor) {
    throw 'Mandatory argument is not provided';
  }

  this.uuid = uuid.toUpperCase();
  this.major = parseInt(major);
  this.minor = parseInt(minor);
  this.rssi = parseInt(rssi);
  this.tx = parseInt(tx);
  this.accuracy = parseFloat(accuracy);
  this.proximity = proximity;
};

Beacon.prototype = function() {

}();

module.exports = Beacon;
