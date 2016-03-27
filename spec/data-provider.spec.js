'use strict';

require('./setup.js');
var DataProvider = require('cordova.plugin.boni.dataProvider'),
  Everlive = require('cordova.plugin.boni.everlive'),
  td = require('./test-data.js');
var dataProvider = new DataProvider();

describe("A Data Provider", function() {
  it("can return error if type is not provided", function(done) {
    var type = '',
      query = new Everlive.Query();

    function dataReceived(err) {
      expect(err).toEqual('The specified content type was not found.');

      done();
    }
    dataProvider.getData(type, query, dataReceived);
  });

  it("can return not filtered data if query is not provided", function(done) {
    var type = 'Spot';

    function dataReceived(err, result) {
      expect(err).toEqual(null);
      expect(result.result.length).toBeGreaterThan(0);
      done();
    }
    dataProvider.getData(type, null, dataReceived);
  });

  it("can return filtered data if query is provided", function(done) {
    var type = 'Spot',
      query = new Everlive.Query();
      query.where()
        .and()
        .eq('uuid', td.registeredBeacon.uuid.toString())
        .eq('major', td.registeredBeacon.major.toString())
        .eq('minor', td.registeredBeacon.minor.toString());


    function dataReceived(err, result) {
      expect(err).toEqual(null);
      expect(result.result.length).toEqual(1);
      done();
    }
    dataProvider.getData(type, query, dataReceived);
  });
});
