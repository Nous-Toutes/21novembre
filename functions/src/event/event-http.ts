import * as functions from 'firebase-functions';

import {all, set, update, get, field, value} from 'typesaurus';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import {events, feminists, STATUS, leaders, Event} from '../utils/model';
import {logger} from 'firebase-functions';
import checkMissingParameters from '../utils/check-missing-params';
import {sendTransactionalEmail, TEMPLATE_IDS} from '../utils/mailchimp';

type EventResponse = Event & {isFull: boolean};

export const eventsFunction = functions.region('europe-west3').https.onRequest(async (request, response) => {
	try {
		if (request.method !== 'GET') {
			response.status(404).send(`request /events with method ${request.method} dosn't exist`);
			return;
		}

		const all_event = await all(events);

		const events_normalize: EventResponse[] = all_event.map(event => {
			const isFull = (event.data.number_of_people >= 49);

			const newEvent: EventResponse = {
				...event?.data,
				whatsapp_url: undefined,
				isFull
			};

			return newEvent;
		});

		response.status(200).json(events_normalize).end();
	} catch (genericError: unknown) {
		// @ts-ignore
		logger.error(new Error(genericError));
	}
});

// GET EVENT
export const joinEvent = functions.region('europe-west3').https.onRequest(async (request, response) => {
	if (request.method !== 'POST') {
		response.status(404).send(`request /joinEvent with method ${request.method} dosn't exist`);
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
});

export const candidatEvent = functions.region('europe-west3').https.onRequest(async (request, response) => {
	if (request.method !== 'POST') {
		response.status(404).send(`request /candidateEvent with method ${request.method} dosn't exist`);
		return;
	}

	const element_to_check = ['first_name', 'email', 'event_id', 'zipcode', 'phone_number', 'whatsapp_url', 'optin'];
	const errors = checkMissingParameters(element_to_check, request.body);

	if (errors?.length) {
		response.status(400).send(`in the body of the request, ${errors.join(',')} is missing from the POST Body`);
		logger.debug(`in the body of the request, ${errors.join(',')} is missing from the POST Body`);
		return;
	}

	const {event_id}: {event_id: string} = request.body;

	const event = await get(events, event_id);

	if (!event?.data) {
		response.status(400).send(`the event id: ${event_id} doesn't match any event`);
		return;
	}

	if (event?.data?.status !== STATUS.VALIDATE) {
		response.status(400).send(`the event source, ${event_id} is already validate`);
		return;
	}

	const feminist = feminists(event_id);
	const leader = leaders(event_id);
	const existing_leaders = await all(leader);

	if (existing_leaders?.[0]) {
		response.status(400).send(`There is already a leader for the event : ${event_id}`);
		return;
	}

	await set(leader, request.body.email, {
		email: request.body.email,
		event_id: request.body.event_id,
		first_name: request.body.first_name,
		zipcode: request.body.zipcode,
		phone_number: request.body.phone_number,
		whatsapp_url: request.body.whatsapp_url,
		optin: request.body.optin,
		haveBeenAddToMailchimp: false
	});

	// Don't updateG the event to +1 for leader and whatsapp URL
	await update(events, event_id, [
		field('whatsapp_url', request.body.whatsapp_url),
		field('status',	STATUS.VALIDATE)
	]);

	const isFull = (event.data.number_of_people >= 49);

	const eventReponse: EventResponse = {
		...event.data, isFull,
		status: STATUS.VALIDATE,
		whatsapp_url: request.body.whatsapp_url
	};

	// SEND E_MAIL TO ORGANISATRICE
	await sendTransactionalEmail({
		email: request.body.email,
		first_name: request.body.first_name,
		whatsapp_url: request.body.whatsapp_url,
		template: TEMPLATE_IDS.YOU_ARE_SUBSCRIBED_AS_LEADER
	});

	// Send e-mail to participante
	const feminist_waiting_for_validation = await all(feminist);

	await Promise.all(feminist_waiting_for_validation.map(async ({data}) => {
		return sendTransactionalEmail({
			email: data.email,
			first_name: data.first_name,
			whatsapp_url: request.body.whatsapp_url,
			template: TEMPLATE_IDS.THE_EVENT_WAS_VALIDATE_TODAY
		});
	}));

	response.status(200).json(eventReponse);
});

