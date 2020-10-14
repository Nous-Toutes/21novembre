import {set} from 'typesaurus';

import {events, Category, STATUS} from './model';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// GET EVENT
export const seedEvent = functions.https.onRequest(async (request, response) => {
	set(events, 'seed-event', {
		name: 'commisseriat du 11 ême arrondissement',
		category: Category.JUSTICE,
		location: new admin.firestore.GeoPoint(48.8534, 2.3488),
		number_of_people: 0,
		whatsapp_url: undefined,
		status: STATUS.VALIDATE
	});

	set(events, 'seed-event-waiting_leader', {
		name: 'commisseriat du 12 ême arrondissement',
		category: Category.JUSTICE,
		location: new admin.firestore.GeoPoint(48.8534, 2.3488),
		number_of_people: 0,
		whatsapp_url: undefined,
		status: STATUS.WAITING_FOR_LEADER
	});

	response.status(200).end();
});

