![BONI](https://raw.githubusercontent.com/BONI-hub/boni.io/gh-pages/img/logo/logo-cordova.png)

[![Travis](https://img.shields.io/travis/BONI-hub/cordova-plugin-boni.svg)](https://travis-ci.org/BONI-hub/cordova-plugin-boni)
[![Codecov](https://img.shields.io/codecov/c/github/BONI-hub/cordova-plugin-boni/master.svg)](https://codecov.io/github/BONI-hub/cordova-plugin-boni?branch=master)
[![npm](https://img.shields.io/npm/v/cordova-plugin-boni.svg)](https://www.npmjs.com/package/cordova-plugin-boni)

[http://boni.io](http://boni.io)

Overview
========

The BONI platform provides a complete backend solution for your mobile application that facilitate the interaction with Bluetooth Low Energy Beacons (iBeacons).

Once you install the BONI SDK, your mobile app will be able to detect Bluetooth Low Energy Beacons. Once the beacon has been detected, the BONI SDK gets the payload that receive from it and send it to BONI Server that exchange the beacon payload for predefined content and send it back to the mobile app.

![enter image description here](http://boni.io/img/front-banner.svg)

BONI SDK is the Content gateway for your mobile app. It takes care about iBeacon detection and delivering of appropreate Content.

BONI Console is a lightweight Content Management System that helps you to organize your BONI Content and map it to BONI Spot.

Our goal is to enable developers to start create smarter mobile apps with no need for writing server code or maintaining servers.

Our SDK is ready to use out of the box with minimal configuration on your part.

Supported Platforms
===================

-	Android
-	iOS

Installation
============

As a Cordova plugin, BONI SDK can be installed with the next command:

```
Latest Stable Version:
cordova plugin add cordova-plugin-boni
```

```
Development Version:
cordova plugin add https://github.com/BONI-hub/cordova-plugin-boni.git
```

See also:

-	[Add Plugins](https://cordova.apache.org/docs/en/6.x/guide/cli/index.html#add-plugins)

Sample
======

```
onDeviceReady: function() {
  app.receivedEvent('deviceready');

  cordova.plugins.boni.configure({
    uuid: ['your-ibeacon-uuid']
  });

  cordova.plugins.boni.ranging();

  cordova.plugins.boni.onAlwaysForSpot(function(error, beacons) {
    console.log("Always");
    document.body.style.background = "purple";
  });
  cordova.plugins.boni.onImmediateToSpot(function(error,beacons) {
      console.log("Immediate");
      document.body.style.background = "green";
  });
  cordova.plugins.boni.onNearToSpot(function(error, beacons) {
      console.log("NEAR");
      document.body.style.background = "red";
  });
  cordova.plugins.boni.onFarFromSpot(function(error, beacons) {
      console.log("FAR");
      document.body.style.background = "blue";
  });
}
```

See also:

-	[Documentation](http://boni.io/docs/)
