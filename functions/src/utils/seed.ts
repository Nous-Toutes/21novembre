import {set} from 'typesaurus';

import {events} from '../models/event';

import * as functions from 'firebase-functions';

// GET EVENT
export const seedEvent = functions.https.onRequest(async (request, response) => {
	set(events, 'seed-event', {
		name: 'commisseriat du 11 ême arrondissement',
		category: 0,
		location: {
			latitude: 222,
			longitude: 2999
		},
		number_of_people: 0
	});

	response.status(200).end();
});

