
import * as functions from 'firebase-functions';
import seeding from '../seed';

export const seedEvent = functions.https.onRequest(async (_request, response) => {
	seeding();
	response.status(200).end();
});

