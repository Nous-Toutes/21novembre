import * as functions from 'firebase-functions';

export const eventsFunction = functions.region('europe-west3').https.onRequest(async (request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./events')).default(request, response);
});

// GET EVENT
export const joinEvent = functions.region('europe-west3').https.onRequest(async (request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
	response.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
	response.set('Accept', 'application/json, text/plain, */*');

	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./join-event')).default(request, response);
});

// GET EVENT
export const quitEvent = functions.region('europe-west3').https.onRequest(async (request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
	response.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
	response.set('Accept', 'application/json, text/plain, */*');
	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./quit-event')).default(request, response);
});

export const candidatEvent = functions.runWith({memory: '1GB'}).region('europe-west3').https.onRequest(async (request, response) => {
	response.set('Access-Control-Allow-Origin', '*');
	response.set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
	response.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
	response.set('Accept', 'application/json, text/plain, */*');
	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./candidat-event')).default(request, response);
});

