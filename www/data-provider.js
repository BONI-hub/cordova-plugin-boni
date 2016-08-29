"use strict";

var Everlive = require('cordova.plugin.boni.everlive'),
    config = require('cordova.plugin.boni.config');

function DataProvider() {
    this.provider = new Everlive({
        appId: config.apikey,
        scheme: "https"
    });
}

DataProvider.prototype = function() {

    var getData = function(type, query, callback) {
        var currentType = this.provider.data(type);

        currentType.get(query)
            .then(function(data) {
                    callback(null, data);
                },
                function(error) {
                    callback(error);
                });
    };

    return {
        getData: getData
    };
}();

module.exports = DataProvider;