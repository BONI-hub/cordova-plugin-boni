'use strict';

var async = require('cordova.plugin.boni.аsync'),
  Everlive = require('cordova.plugin.boni.everlive'),
  DataProvider = require('cordova.plugin.boni.dataProvider');

var Spot = function(beacon) {

  /**
   * Check whether the mandatory arguments are provided
   */
  if (!beacon) {
    throw 'Mandatory argument is not provided';
  }

  this._beacon = beacon;
};

Spot.prototype = function() {

  var getBeacon = function() {
      return this._beacon;
    },

    /**
     * Get the Content (cloud) data based on the iBeacon signal (uuid, major and minor ID)
     * @param  {Function} done Callback to be called when the Content (cloud) data is retrieved
     */
    getData = function(done) {

      var dataProvider = new DataProvider();

      /**
       * This is because of the async scope
       */
      var that = this;

      /**
       * Organize all actions related to retrieve of Content (cloud) objects here.
       */
      async.waterfall([
        function(callback) {

          var query = new Everlive.Query();
          var beacon = that.getBeacon();

          query.where()
            .and()
            .eq('uuid', beacon.uuid.toLowerCase())
            .eq('major', beacon.major.toString())
            .eq('minor', beacon.minor.toString());

          /**
           * Determine the spot based on the signal that came from iBeacon
           */
          dataProvider.getData(
            'Spot', query,
            callback
          );
        },
        function(spot, callback) {

          /**
           * If there is a spot for this iBeacon
           */
          if (spot.result.length > 0) {

            /**
             * Prepare a query that filter the Content items by spotId
             */
            var query = new Everlive.Query();

            // Assume that beacon:spot = 1:1
            query.where().eq('spotId', spot.result[0].Id);

            /**
             * Get the Content (cloud) data
             */
            dataProvider.getData(
              'Content', query,
              callback
            );
          } else {
            callback('No spots');
          }

        }
      ], function(err, cloudData) {

        /**
         * If there is a Content (cloud) data, pass it to the mobile app
         */
        if (cloudData && cloudData.result) {

          //Pass the entire cloud data
          that.data = cloudData.result;
        }

        done(err, that);
      });
    };

  return {
    getData: getData,
    getBeacon: getBeacon
  };

}();

module.exports = Spot;
