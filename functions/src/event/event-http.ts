import * as functions from 'firebase-functions';
import {events, STATUS} from '../utils/model';
import {all, query, where} from 'typesaurus';

export const eventsFunction = functions.region('europe-west3').https.onRequest(async (request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Methods', 'POST, GET');
	response.set('Access-Control-Allow-Headers', 'Content-Type');
	response.set('Access-Control-Max-Age', '3600');

	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./events')).default(request, response);
});

// GET EVENT
export const joinEvent = functions.region('europe-west3').https.onRequest(async (request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Methods', 'POST');
	response.set('Access-Control-Allow-Headers', 'Content-Type');
	response.set('Access-Control-Max-Age', '3600');

	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./join-event')).default(request, response);
});

// GET EVENT
export const quitEvent = functions.region('europe-west3').https.onRequest(async (request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Methods', 'POST');
	response.set('Access-Control-Allow-Headers', 'Content-Type');
	response.set('Access-Control-Max-Age', '3600');

	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./quit-event')).default(request, response);
});

export const candidatEvent = functions.runWith({memory: '1GB'}).region('europe-west3').https.onRequest(async (request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Methods', 'POST');
	response.set('Access-Control-Allow-Headers', 'Content-Type');
	response.set('Access-Control-Max-Age', '3600');

	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./candidat-event')).default(request, response);
});

export const Stats = functions.runWith({memory: '1GB'}).region('europe-west3').https.onRequest(async (_request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	response.header('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Methods', 'POST');
	response.set('Access-Control-Allow-Headers', 'Content-Type');
	response.set('Access-Control-Max-Age', '3600');

	const all_events = await all(events);
	const validateEvent = await query(events, [where('status', '==', STATUS.VALIDATE)]);

	const validateEventLength = validateEvent.length;

	// Calcul the sum
	let sum = 0;

	all_events.forEach(a => {
		const number = Number(a.data.number_of_people);
		if (Number.isInteger(number)) {
			sum += Number(a.data.number_of_people);
		}
	});

	sum += validateEventLength;

	response.json({personne_inscrite: sum, evenement_valide: validateEventLength});
});
