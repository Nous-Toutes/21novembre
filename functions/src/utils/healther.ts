import * as functions from 'firebase-functions';
import axios from 'axios';

export const scheduledFunction = functions.region('europe-west3').pubsub.schedule('every 1 minutes').onRun(async _context => {
	try {
		await axios.post('https://europe-west3-nous-toutes.cloudfunctions.net/joinEvent', {warm: true});
		await axios.get('https://europe-west3-nous-toutes.cloudfunctions.net/events');
		await axios.post('https://europe-west3-nous-toutes.cloudfunctions.net/candidatEvent', {warm: true});
	} catch (error: unknown) {
		console.log(error);
	}

	return null;
});
