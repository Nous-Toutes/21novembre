import * as functions from 'firebase-functions';

import {all, set, update, get, field} from 'typesaurus';
import {events, feminists} from '../models/event';
import {firestore} from '../utils/firestore';

export const eventsFunction = functions.region('europe-west3').https.onRequest(async (request, response) => {
	if (request.method !== 'GET') {
		response.status(404).send(`request /events with method ${request.method} dosn't exist`);
		return;
	}

	const all_event = await all(events);
	const event_normalize = all_event.map(event => event?.data);

	response.status(200).json(event_normalize).end();
});

const checkMissingParameters = (element_to_check: string[], request: functions.https.Request) => {
	const errors: string[] = [];

	for (const element of element_to_check) {
		if (request?.body?.[element] || request?.body?.[element] === '') {
			errors.push(element);
			return;
		}
	}

	return errors;
};

// GET EVENT
export const joinEvent = functions.region('europe-west3').https.onRequest(async (request, response) => {
	if (request.method !== 'POST') {
		response.status(404).send(`request /joinEvent with method ${request.method} dosn't exist`);
		return;
	}

	// Check data arrived
	const element_to_check = ['first_name', 'last_name', 'email', 'event_id', 'zipcode', 'phone_number'];
	const errors = checkMissingParameters(element_to_check, request);

	if (errors?.length) {
		response.status(400).send(`in the body of the request, ${errors.join(',')} is missing from the POST request`);
		return;
	}

	const {event_id}: {event_id: string} = request.body;

	// Check less then 50 people !
	const feminist = feminists(event_id);

	const event = await get(events, event_id);

	if (!event?.data) {
		response.status(400).send(`the event source, ${event_id} doesn't match any user`);
		return;
	}

	if (event?.data.number_of_people >= 50) {
		response.status(400).send(`the event source, ${event_id} already have 50 peoples`);
		return;
	}

	// Check exist before so we don't increment if it's exist
	await set(feminist, request.body.email, {
		email: request.body.email,
		event_id: request.body.event_id,
		first_name: request.body.first_name,
		last_name: request.body.last_name,
		zipcode: request.body.zipcode,
		phone_number: request.body.phone_number
	});

	// Increment the value of number of people
	await update(events, event_id, [
		// @ts-ignore
		field('number_of_people', firestore.FieldValue.increment(1))
	]);

	response.status(200).send('ok!');
});

export const candidatEvent = functions.region('europe-west3').https.onRequest(async (request, response) => {
	response.status(200).send('ok!');
});

