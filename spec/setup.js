#!/usr/bin/env node

'use strict';

var path = require('path');
var modulePath = path.resolve(__dirname);

var Module = require('module');
var originalRequire = Module.prototype.require;

Module.prototype.require = function() {
  var moduleId = arguments[0];
  switch (moduleId) {
    case 'cordova.plugin.boni.everlive':
      arguments[0] = modulePath + '/../www/lib/everlive.all.js';
      break;
    case 'cordova.plugin.boni.lodash':
      arguments[0] = modulePath + '/../www/lib/lodash.js';
      break;
    case 'cordova.plugin.boni.config':
      arguments[0] = modulePath + '/test-config.js';
      break;
    case 'cordova.plugin.boni.spot':
      arguments[0] = modulePath + '/../www/model/spot.js';
      break;
    case 'cordova.plugin.boni.beacon':
      arguments[0] = modulePath + '/../www/model/beacon.js';
      break;
    case 'cordova.plugin.boni.аsync':
      arguments[0] = modulePath + '/../www/lib/async.js';
      break;
    case 'cordova.plugin.boni.dataProvider':
      arguments[0] = modulePath + '/../www/data-provider.js';
      break;
    case 'cordova.plugin.boni.beaconRegistry':
      arguments[0] = modulePath + '/../www/beacon-registry.js';
      break;
    case 'cordova.plugin.boni.registry':
      arguments[0] = modulePath + '/../www/registry.js';
      break;
    case 'cordova.plugin.boni':
      arguments[0] = modulePath + '/../www/boni.js';
      break;

  }
  return originalRequire.apply(this, arguments);
};

// Mock the console object to store the output in-memory
var console = {};
console.stdout = '';
console.log = function(log) {
  console.stdout = log;
};
console.reset = function() {
  console.stdout = '';
};
