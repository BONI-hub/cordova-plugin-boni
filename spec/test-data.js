"use strict()";

var Beacon = require('cordova.plugin.boni.beacon');

module.exports = {

  notRegisteredBeacon: new Beacon('fda50693-a4e2-4fb1-afcf-c6eb07647825','1','2','ProximityImmediate','20','30','5.5'),

  registeredBeacon: new Beacon('1111-2222-3333-4444-5555','1','2','ProximityImmediate','20','30','5.5'),

  beaconNoContent: new Beacon('1111-2222-3333-4444-5555','3','4','ProximityImmediate','20','30','5.5')
};
