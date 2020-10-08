import {set} from 'typesaurus';

import {events} from '../models/event';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// GET EVENT
export const seedEvent = functions.https.onRequest(async (request, response) => {
	set(events, 'seed-event', {
		name: 'commisseriat du 11 ême arrondissement',
		category: 0,
		location: new admin.firestore.GeoPoint(90, -90),
		number_of_people: 0,
		whatsappUrl: undefined
	});

	response.status(200).end();
});

