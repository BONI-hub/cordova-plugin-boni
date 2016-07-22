"use strict()";

module.exports = {
	uuid: ['fda50693-a4e2-4fb1-afcf-c6eb07647825',
		'a32773da-fd5d-11e4-a322-1697f925ec7b',
		'b9407f30-f5f8-466e-aff9-25556b57fe6d'
	],
	idleTime: 6000,
	rangingDuration: 3000,
	initialRangingDuration: 5000,
	identifier: 'BoniBeacon',
	apikey: 'jvnpnqqa76sfbdrf', //live
	proximity: {
		immediate: {
			name: 'ProximityImmediate',
			factor: 105
		},
		near: {
			name: 'ProximityNear',
			factor: 200
		},
		far: {
			name: 'ProximityFar'
		},
		buffer: 10
	}
};
