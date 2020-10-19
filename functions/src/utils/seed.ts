
import * as functions from 'firebase-functions';
import seeding from "../seed/index"

export const seedEvent = functions.https.onRequest(async (request, response) => {
	await seeding()
	response.status(200).end();
});

