import {query, where, limit} from 'typesaurus';

import {events, EventResponse, STATUS} from '../utils/model';

import * as functions from 'firebase-functions';
import checkMissingParameters from '../utils/check-missing-params';

const getEvents = async (
	request: functions.https.Request,
	response: functions.Response
) => {
	try {
		if (request.method === 'GET') {
			const all_event = await query(events, [limit(100)]);

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
			return;
		}

		if (request.method !== 'POST') {
			response.status(404).send(`request /events with method ${request.method} dosn't exist`);
			return;
		}

		if (request.body?.warm === true) {
			response.status(200).send('function warmed');
			return;
		}

		// CHECK if the postcode exist
		const element_to_check = ['department'];
		const errors = checkMissingParameters(element_to_check, request.body);

		if (errors?.length) {
			response.status(400).send(`in the body of the request, ${errors.join(',')} is missing from the POST Body`);
			functions.logger.debug(`in the body of the request, ${errors.join(',')} is missing from the POST Body`);
			return;
		}

		let newDepartment = request.body?.department;

		if (newDepartment.startsWith('0')) {
			newDepartment = newDepartment.slice(1);
		}

		const all_event = await query(events, [where('department', '==', newDepartment)]);

		const events_normalize: EventResponse[] = all_event.map(event => {
			const isFull = (event.data.number_of_people >= 49);

			let {number_of_people} = event.data;

			if (event.data.status === STATUS.VALIDATE) {
				number_of_people += 1;
			}

			const newEvent: EventResponse = {
				...event?.data,
				whatsapp_url: undefined,
				number_of_people,
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

