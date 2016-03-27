"use strict";

var Everlive = require('cordova.plugin.boni.everlive'),
  config = require('cordova.plugin.boni.config');

function DataProvider() {
  this.provider = new Everlive(config.apikey);
}

DataProvider.prototype.getData = function(type, query, callback) {
  var currentType = this.provider.data(type);
  currentType.get(query, function(data) {
    callback(null, data);
  }, function(err) {
    console.error(err.message);
    callback(err.message);
  });
};

module.exports = DataProvider;
