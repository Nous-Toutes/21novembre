import * as functions from 'firebase-functions';
import axios from 'axios';
import {events, STATUS, stats} from './model';
import {query, where, set} from 'typesaurus';

export const scheduledFunction = functions.region('europe-west3').pubsub.schedule('every 1 minutes').onRun(async _context => {
	try {
		await axios.post('https://europe-west3-nous-toutes.cloudfunctions.net/joinEvent', {warm: true});
		await axios.post('https://europe-west3-nous-toutes.cloudfunctions.net/events', {warm: true});
		await axios.post('https://europe-west3-nous-toutes.cloudfunctions.net/candidatEvent', {warm: true});
		await axios.post('https://europe-west3-nous-toutes.cloudfunctions.net/Stats', {warm: true});

		const all_events = await query(events, [where('number_of_people', '!=', 0)]);
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

		const personne_inscrite = sum;
		const evenement_valide = validateEventLength;

		await set(stats, 'default', {personne_inscrite, evenement_valide});
	} catch (error: unknown) {
		console.log(error);
	}

	return null;
});
