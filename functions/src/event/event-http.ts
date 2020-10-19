import * as functions from 'firebase-functions';

export const eventsFunction = functions.region('europe-west3').https.onRequest(async (request, response) => {
	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./events')).default(request, response);
});

// GET EVENT
export const joinEvent = functions.region('europe-west3').https.onRequest(async (request, response) => {
	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./join-event')).default(request, response);
});



export const candidatEvent = functions.runWith({memory: '1GB'}).region('europe-west3').https.onRequest(async (request, response) => {
	/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
	return (await import('./candidat-event')).default(request, response);
});

