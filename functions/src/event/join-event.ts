import {set, update, get, value} from 'typesaurus';

import * as functions from 'firebase-functions';

import {events, feminists, STATUS, EventResponse} from '../utils/model';
import checkMissingParameters from '../utils/check-missing-params';
import {sendTransactionalEmail, TEMPLATE_IDS} from '../utils/mailchimp';

const joinEvent = async (
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

	const element_to_check = ['first_name', 'email', 'event_id', 'zipcode', 'phone_number', 'optin'];
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

	if (event?.data.number_of_people >= 49) {
		response.status(400).send(`the event source, ${event_id} already have 50 peoples`);
		return;
	}

	const feminist = feminists(event_id);

	// Check exist before so we don't increment if it's exist
	await set(feminist, request.body.email, {
		email: request.body.email,
		event_id: request.body.event_id,
		first_name: request.body.first_name,
		zipcode: request.body.zipcode,
		phone_number: request.body.phone_number,
		optin: request.body.optin,
		haveBeenAddToMailchimp: false
	});

	// Increment the value of number of people
	await update(events, event_id, {
		number_of_people: value('increment', 1)
	});

	// SEND AN EMAIL to THE FEMINIST

	if (event?.data.status === STATUS.VALIDATE) {
		await sendTransactionalEmail({
			email: request.body.email,
			first_name: request.body.first_name,
			whatsapp_url: event?.data?.whatsapp_url,
			template: TEMPLATE_IDS.YOU_ARE_INVITED_TO_THE_EVENT
		});
	}

	if (event?.data.status === STATUS.WAITING_FOR_LEADER) {
		await sendTransactionalEmail({
			email: request.body.email,
			first_name: request.body.first_name,
			whatsapp_url: event?.data?.whatsapp_url,
			template: TEMPLATE_IDS.YOU_ARE_ON_WAITING_LIST
		});
	}

	const isFull = (event.data.number_of_people >= 49);
	const eventReponse: EventResponse = {...event.data, isFull, number_of_people: event.data.number_of_people + 1};

	response.status(200).json(eventReponse);
};

export default joinEvent;

