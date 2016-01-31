"use strict()";

module.exports = {
	uuid: ['fda50693-a4e2-4fb1-afcf-c6eb07647825',
		'a32773da-fd5d-11e4-a322-1697f925ec7b'
	],
	identifier: 'BoniBeacon',
	apikey: 'noxn9y12iygp6xtr', //local
	//apikey: 'bmtnzdda16k2wled', //test
	//apikey: 'jvnpnqqa76sfbdrf', //live
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
