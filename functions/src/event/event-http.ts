import * as functions from 'firebase-functions';

import {get} from 'typesaurus';
import {stats} from '../utils/model';

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

	const stat = await get(stats, 'default');
	const data = stat?.data;
	response.json(data);
});
