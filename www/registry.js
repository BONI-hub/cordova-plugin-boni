"use strict";

var config = require('cordova.plugin.boni.config'),
    _ = require('cordova.plugin.boni.lodash');


var Registry = function() {};

Registry.prototype = function() {

    var _onFarFromSpot = null,
        _onNearToSpot = null,
        _onImmediateToSpot = null,
        _onAlwaysForSpot = null,

        applyProximityStrategy = function(spot) {

            if (!spot) {
                throw "Spot is not valid";
            }

            var identifier = spot.getSpotIdentifier();
            var proximityFactor = identifier.calculateProximityFactor();

            if (proximityFactor <= config.proximity.immediate.factor) {
                identifier.proximity = config.proximity.immediate.name;
            } else if (proximityFactor >=
                config.proximity.immediate.factor + config.proximity.buffer &&
                proximityFactor <= config.proximity.near.factor) {
                identifier.proximity = config.proximity.near.name;
            } else if (proximityFactor >=
                config.proximity.near.factor + config.proximity.buffer) {
                identifier.proximity = config.proximity.far.name;
            } else {
                /**
                 * If the proximityFactor is not in any of the buffers, keep the latest proximity
                 */
                identifier.proximity = identifier.previouseProximity;
            }
        },

        callRegisteredCallback = function(spot) {

            if (!spot) {
                throw "Spot is not valid";
            }

            var identifier = spot.getSpotIdentifier();

            applyProximityStrategy(spot);

            executeCallback(_onAlwaysForSpot, spot);

            /**
             * If previouse proximity is not set or previouse proximity is different
             * than the current. The idea is to call callback only on change.
             */
            if (!identifier.previouseProximity || identifier.proximity !==
                identifier.previouseProximity) {

                /**
                 * update the previouse proximity
                 */
                identifier.previouseProximity = identifier.proximity;

                /**
                 * Call the appropreate callbacks if there are registered
                 */
                switch (identifier.proximity) {
                    case config.proximity.immediate.name:
                        executeCallback(_onImmediateToSpot, spot);
                        break;
                    case config.proximity.near.name:
                        executeCallback(_onNearToSpot, spot);
                        break;
                    case config.proximity.far.name:
                        executeCallback(_onFarFromSpot, spot);
                        break;
                }
            }
        },

        executeCallback = function(callback, spot) {

            if (_.isFunction(callback) && spot) {
                var result = [];

                if (spot.data) {

                    for (var idx = 0; idx < spot.data.length; idx++) {

                        var currentData = spot.data[idx];
                        var currentDataResult = {};

                        /**
                         * Construct result object
                         */

                        currentDataResult.name = currentData.name;
                        currentDataResult.description = currentData.description;
                        currentDataResult.data = currentData.data;
                        currentDataResult.type = currentData.type;
                        currentDataResult.spotId = currentData.spotId;
                        currentDataResult.createdAt = currentData.CreatedAt;
                        currentDataResult.modifiedAt = currentData.ModifiedAt;
                        currentDataResult.id = currentData.Id;

                        result.push(currentDataResult);

                    }
                }

                callback(null, result);
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
        },

        onAlwaysForSpot = function(callback) {
            _onAlwaysForSpot = callback;
        };

    return {
        applyProximityStrategy: applyProximityStrategy,
        callRegisteredCallback: callRegisteredCallback,
        onFarFromSpot: onFarFromSpot,
        onNearToSpot: onNearToSpot,
        onImmediateToSpot: onImmediateToSpot,
        onAlwaysForSpot: onAlwaysForSpot
    };
}();

module.exports = Registry;