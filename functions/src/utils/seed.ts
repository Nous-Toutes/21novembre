import {set} from 'typesaurus';

import {events, Category, STATUS} from './model';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// GET EVENT
export const seedEvent = functions.https.onRequest(async (request, response) => {
	set(events, 'seed-event', {
		name: 'Commissariat de police d\'Oyonnax',
		category: Category.JUSTICE,
		location: new admin.firestore.GeoPoint(48.8534, 2.3488),
		number_of_people: 0,
		whatsapp_url: undefined,
		status: STATUS.VALIDATE,
		address: '57 Rue Pasteur 01100 OYONNAX',
		city: 'OYONNAX',
		zipcode: '01',
		voie: '57 Rue Pasteur'
	});

	set(events, 'seed-event-waiting_leader', {
		name: 'Commissariat de police de Bourg en Bresse',
		category: Category.JUSTICE,
		location: new admin.firestore.GeoPoint(48.8524, 2.3478),
		number_of_people: 0,
		whatsapp_url: undefined,
		status: STATUS.WAITING_FOR_LEADER,
		address: '4 Rue des Remparts 01000 BOURG EN BRESSE',
		city: 'BOURG EN BRESSE',
		zipcode: '01',
		voie: '4 Rue des Remparts'
	});

	response.status(200).end();
});

