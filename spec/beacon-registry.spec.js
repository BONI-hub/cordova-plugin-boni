'use strict';

require('./setup.js');
var Spot = require('cordova.plugin.boni.spot'),
    Beacon = require('cordova.plugin.boni.beacon'),
    BeaconRegistry = require('cordova.plugin.boni.beaconRegistry'),
    td = require('./test-data.js');


describe("A beacon-registry", function() {

    describe("add", function() {

        it("can add object when no errors", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            beaconRegistry.add(null, {});
            expect(beaconRegistry.size()).toEqual(1);
        });

        it("can't add object when there are errors", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            beaconRegistry.add('test', {});
            expect(beaconRegistry.size()).toEqual(0);
        });

    });

    describe("get", function() {

        it("return null if no uuid", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            var beacon = beaconRegistry.get(null, '1', '2');
            expect(beacon).toEqual(null);
        });

        it("return null if no major id", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            var beacon = beaconRegistry.get('1111-222-333', null, '2');
            expect(beacon).toEqual(null);
        });

        it("return null if no minor id", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            var beacon = beaconRegistry.get('1111-222-333', '1', null);
            expect(beacon).toEqual(null);
        });

        it("return null if try to get a beacon but the registry is empty", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            var beacon = beaconRegistry.get('1111-222-333', '1', '2');
            expect(beacon).toEqual(null);
        });

        it("return beacon if try to get a beacon that is in the registry", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            beaconRegistry.add(null, new Spot(td.registeredBeacon));
            var spot = beaconRegistry.get(td.registeredBeacon.uuid, td.registeredBeacon.major, td.registeredBeacon.minor);
            expect(spot.getSpotIdentifier().uuid).toEqual(td.registeredBeacon.uuid);
            expect(spot.getSpotIdentifier().major).toEqual(td.registeredBeacon.major);
            expect(spot.getSpotIdentifier().minor).toEqual(td.registeredBeacon.minor);
        });

    });

    describe("applyProximityStrategy", function() {

        it("is immediate if the proximity factor is less than 106", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            var rssi = 106,
                tx = 100;
            var beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5'),
                spot = new Spot(beacon);
            beaconRegistry.applyProximityStrategy(spot);
            expect(spot.getSpotIdentifier().proximity).toEqual('ProximityImmediate');
        });

        it("not changed if cuurent is in the buffer and previouse is immediate", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            var rssi = 106,
                tx = 100,
                beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5'),
                spot = new Spot(beacon);
            beaconRegistry.applyProximityStrategy(spot);
            expect(spot.getSpotIdentifier().proximity).toEqual('ProximityImmediate');
            spot.getSpotIdentifier().rssi = 111;
            spot.getSpotIdentifier().tx = 100;
            spot.getSpotIdentifier().previouseProximity = 'ProximityImmediate';
            beaconRegistry.applyProximityStrategy(spot);
            expect(spot.getSpotIdentifier().proximity).toEqual('ProximityImmediate');
        });

        it("is near if the proximity factor is more than 115 and less than 200", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            var rssi = 116,
                tx = 100,
                beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5'),
                spot = new Spot(beacon);
            beaconRegistry.applyProximityStrategy(spot);
            expect(spot.getSpotIdentifier().proximity).toEqual('ProximityNear');
        });

        it("not changed if cuurent is in the buffer and previouse is near", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            var rssi = 116,
                tx = 100,
                beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5'),
                spot = new Spot(beacon);
            beaconRegistry.applyProximityStrategy(spot);
            expect(spot.getSpotIdentifier().proximity).toEqual('ProximityNear');
            spot.getSpotIdentifier().rssi = 206;
            spot.getSpotIdentifier().tx = 100;
            spot.getSpotIdentifier().previouseProximity = 'ProximityNear';
            beaconRegistry.applyProximityStrategy(spot);
            expect(spot.getSpotIdentifier().proximity).toEqual('ProximityNear');
        });

        it("is far if the proximity factor is more than 210", function() {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            var rssi = 211,
                tx = 100,
                beacon = new Beacon('111-222-333', '1', '2', 'ProximityUnknown', rssi, tx, '1.5'),
                spot = new Spot(beacon);
            beaconRegistry.applyProximityStrategy(spot);
            expect(spot.getSpotIdentifier().proximity).toEqual('ProximityFar');
        });

    });

    describe("register", function() {

        it("do not register beacon if beacon is not defined", function() {
            var beaconRegistry = new BeaconRegistry();
            expect(function() {
                beaconRegistry.register(null);
            }).toThrow(new Error('Beacon is not valid'));
        });

        //This is needed to decrease the number of requests to server
        it("register beacon even it has no corresponding spot", function(done) {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            expect(beaconRegistry.size()).toEqual(0);
            beaconRegistry.register(td.notRegisteredBeacon, function() {
                expect(beaconRegistry.size()).toEqual(1);
                done();
            });
        });

        it("register beacon if beacon has corresponding spot and conent", function(done) {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            expect(beaconRegistry.size()).toEqual(0);
            beaconRegistry.register(td.registeredBeacon, function() {
                expect(beaconRegistry.size()).toEqual(1);
                done();
            });
        });

        it("do not register beacon if beacon is not valid (does not have uuid)", function() {
            var beaconRegistry = new BeaconRegistry();
            expect(function() { beaconRegistry.register({ "test": "test" }); }).toThrow(new Error('Beacon is not valid'));
        });

    });

    describe("process", function() {

        it("can throw exception Beacon is not valid", function() {
            var beaconRegistry = new BeaconRegistry();
            expect(function() { beaconRegistry.process(); }).toThrow("Beacon is not valid");
        });

        it("call onImmediateToSpot if the beacon is immediate and has corresponding spot and content", function(done) {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            expect(beaconRegistry.size()).toEqual(0);
            beaconRegistry.onImmediateToSpot(function() {
                expect(beaconRegistry.size()).toEqual(1);
                done();
            });
            beaconRegistry.process(td.registeredBeacon);
        });

        it("call onNearToSpot if the beacon is near and has corresponding spot and content", function(done) {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            expect(beaconRegistry.size()).toEqual(0);
            beaconRegistry.onNearToSpot(function() {
                expect(beaconRegistry.size()).toEqual(1);
                done();
            });
            td.registeredBeacon.rssi = 116;
            td.registeredBeacon.tx = 100;
            beaconRegistry.process(td.registeredBeacon);
        });

        it("call onFarFromSpot if the beacon is far and has corresponding spot and content", function(done) {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            expect(beaconRegistry.size()).toEqual(0);
            beaconRegistry.onFarFromSpot(function() {
                expect(beaconRegistry.size()).toEqual(1);
                done();
            });
            td.registeredBeacon.rssi = 211;
            td.registeredBeacon.tx = 100;
            beaconRegistry.process(td.registeredBeacon);
        });

        it("call onAlwaysForSpot always when there is a corresponding spot and content", function(done) {
            var beaconRegistry = new BeaconRegistry();
            beaconRegistry.clear();
            expect(beaconRegistry.size()).toEqual(0);
            beaconRegistry.onAlwaysForSpot(function() {
                expect(beaconRegistry.size()).toEqual(1);
                done();
            });
            beaconRegistry.process(td.registeredBeacon);
        });

    });

});