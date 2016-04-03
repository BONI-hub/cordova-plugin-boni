'use strict';

require('./setup.js');
var Beacon = require('cordova.plugin.boni.beacon');

describe("A beacon", function() {

  it("can't be created without uuid", function() {
    expect(function() {
      new Beacon(null, '1', '2', 'ProximityImmediate', '20', '30', '5.5');
    }).toThrow(new Error('Mandatory argument is not provided'));
  });

  it("can't be created without major id", function() {
    expect(function() {
      new Beacon('fda50693-a4e2-4fb1-afcf-c6eb07647825', null, '2', 'ProximityImmediate', '20', '30', '5.5');
    }).toThrow(new Error('Mandatory argument is not provided'));
  });

  it("can't be created without minor id", function() {
    expect(function() {
      new Beacon('fda50693-a4e2-4fb1-afcf-c6eb07647825', '1', null, 'ProximityImmediate', '20', '30', '5.5');
    }).toThrow(new Error('Mandatory argument is not provided'));
  });

  it("store UUID in upper case", function() {
    var uuid = 'aaa-bbb-ccc',
      beacon = new Beacon(uuid, '1', '2', 'ProximityImmediate', '20', '30', '5.5');
    expect(beacon.uuid).toEqual(uuid.toUpperCase());
  });

  it("store major ID as integer", function() {
    var majorId = '1',
      beacon = new Beacon('aaa-bbb-ccc', majorId, '2', 'ProximityImmediate', '20', '30', '5.5');
    expect(beacon.major).toEqual(parseInt(majorId));
    expect(typeof(beacon.major)).toEqual('number');
  });

  it("store minor ID as integer", function() {
    var minorId = '2',
      beacon = new Beacon('aaa-bbb-ccc', '1', minorId, 'ProximityImmediate', '20', '30', '5.5');
    expect(beacon.minor).toEqual(parseInt(minorId));
    expect(typeof(beacon.minor)).toEqual('number');
  });

  it("store proximity as string", function() {
    var proximity = 'ProximityImmediate',
      beacon = new Beacon('aaa-bbb-ccc', '1', '2', proximity, '20', '30', '5.5');
    expect(beacon.proximity).toEqual(beacon.proximity);
    expect(typeof(beacon.proximity)).toEqual('string');
  });

  it("store rssi as integer", function() {
    var rssi = '20',
      beacon = new Beacon('aaa-bbb-ccc', '1', '2', 'ProximityImmediate', rssi, '30', '5.5');
    expect(beacon.rssi).toEqual(parseInt(rssi));
    expect(typeof(beacon.rssi)).toEqual('number');
  });

  it("store tx as integer", function() {
    var tx = '30',
      beacon = new Beacon('aaa-bbb-ccc', '1', '2', 'ProximityImmediate', '20', tx, '5.5');
    expect(beacon.tx).toEqual(parseInt(tx));
    expect(typeof(beacon.tx)).toEqual('number');
  });

  it("store accuracy as integer", function() {
    var accuracy = '5.5',
      beacon = new Beacon('aaa-bbb-ccc', '1', '2', 'ProximityImmediate', '20', '30', accuracy);
    expect(beacon.accuracy).toEqual(parseFloat(accuracy));
    expect(typeof(beacon.accuracy)).toEqual('number');
  });
});
