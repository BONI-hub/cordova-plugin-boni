'use strict';

require('./setup.js');
var Registry = require('cordova.plugin.boni.registry');


describe("A registry", function() {

    it("callRegisteredCallback throw exception if Spot is not valid", function() {
        var registry = new Registry();
        expect(function() { registry.callRegisteredCallback(); }).toThrow("Spot is not valid");
    });

    it("applyProximityStrategy throw exception if Spot is not valid", function() {
        var registry = new Registry();
        expect(function() { registry.applyProximityStrategy(); }).toThrow("Spot is not valid");
    });

});