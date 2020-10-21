import {update, get, value, remove} from 'typesaurus';

import * as functions from 'firebase-functions';

import {events, feminists, EventResponse} from '../utils/model';
import checkMissingParameters from '../utils/check-missing-params';

const quitEvent = async (
	request: functions.https.Request,
	response: functions.Response
) => {
	if (request.method !== 'POST') {
		response.status(404).send(`request /joinEvent with method ${request.method} dosn't exist`);
		return;
	}

	if (request.body?.warm === true) {
		response.status(200).send('function warmed');
		return;
	}

	const element_to_check = ['email', 'event_id'];

	const errors = checkMissingParameters(element_to_check, request.body);

	if (errors?.length) {
		response.status(400).send(`in the body of the request, ${errors.join(',')} is missing from the POST Body`);
		return;
	}

	const {event_id}: {event_id: string} = request.body;

	const event = await get(events, event_id);

	if (!event?.data) {
		response.status(400).send(`the event id: ${event_id} doesn't match any event`);
		return;
	}

	const feminist = feminists(event_id);

	// Check exist before so we don't increment if it's exist
	const existing_user = await get(feminist, request.body.email);

	if (!existing_user?.data?.email) {
		const isFull = (event.data.number_of_people >= 49);
		const eventReponse: EventResponse = {...event.data, isFull};

		response.status(200).json(eventReponse);
		return;
	}

	// Check exist before so we don't increment if it's exist
	await remove(feminist, request.body.email);

	// Increment the value of number of people
	await update(events, event_id, {
		number_of_people: value('increment', -1)
	});

	const isFull = (event.data.number_of_people >= 49);
	const eventReponse: EventResponse = {...event.data, isFull, number_of_people: event.data.number_of_people + 1};

	response.status(200).json(eventReponse);
};

export default quitEvent;

