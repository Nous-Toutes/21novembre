import {all} from 'typesaurus';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import {events, EventResponse} from '../utils/model';

import * as functions from 'firebase-functions';

const getEvents = async (
	request: functions.https.Request,
	response: functions.Response
) => {
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
		functions.logger.error(new Error(genericError));
	}
};

export default getEvents;

