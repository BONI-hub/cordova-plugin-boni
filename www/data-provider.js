"use strict";

var Everlive = require('cordova.plugin.boni.Everlive');
var config = require('cordova.plugin.boni.Config');

function DataProvider() {
	this.provider = new Everlive(config.apikey);
}

DataProvider.prototype.getData = function(type, query, callback) {
	var currentType = this.provider.data(type);
	currentType.get(query, function(data) {
		console.log("DATA: " + JSON.stringify(data));
		callback(null, data);
	}, function(err) {
		console.log(err.message);
		callback(err.message);
	});
};

module.exports.dataProvider = new DataProvider();
