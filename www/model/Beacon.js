'use strict';

var async = require('cordova.plugin.boni.Async');

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
 * @param {float} accuracy  rough distance estimate limited to two decimal places (in metres)
 */
function Beacon(uuid, major, minor, proximity, rssi, tx, accuracy) {

	/**
	 * Check whether the mandatory arguments are provided
	 */
	if (!uuid || !major || !minor) {
		console.log('Mandatory argument is not provided');
		return;
	}

	this.uuid = uuid.toUpperCase();
	this.major = parseInt(major);
	this.minor = parseInt(minor);
	this.rssi = parseInt(rssi);
	this.tx = parseInt(tx);
	this.accuracy = accuracy;
	this.proximity = proximity;
}

/**
 * Get the cloud data based on the beacon metadata (uuid, major and minor ID)
 * @param  {Function} done Callback to be called when the cloud data is retrieved
 */
Beacon.prototype.getData = function(done) {

	/**
	 * This is because of the async scope
	 */
	var that = this;

	/**
	 * Organize all actions related to retrieve of cloud object here.
	 */
	async.waterfall([
		function(callback) {

			/**
			 * Get data from the cloud
			 */
			cordova.plugins.everliveProvider.getData(
				'Spot', {
					'uuid': that.uuid,
					'major': that.major,
					'minor': that.minor
				},
				callback
			);
		}
	], function(err, cloudData) {

		/**
		 * Get the first item from the cloud object.
		 * There should be only one item.
		 */
		if (cloudData && cloudData.result[0] && cloudData.result[0].data) {
			that.data = cloudData.result[0].data;
		}

		done(err, that);
	});
};

/**
 * Parse the Beacon object and print it in the console
 */
Beacon.prototype.toString = function() {
	console.log(
		'UUID:' + this.uuid +
		', Major: ' + this.major +
		', Minor: ' + this.minor +
		', Proximity: ' + this.proximity +
		', RSSI: ' + this.rssi +
		', Tx: ' + this.tx +
		', Accuracy: ' + this.accuracy +
		', Data: ' + this.data
	);
};

module.exports = Beacon;
