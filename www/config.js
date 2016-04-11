"use strict()";

module.exports = {
	uuid: [],
	identifier: 'BoniBeacon',
	apikey: 'noxn9y12iygp6xtr', //local
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
