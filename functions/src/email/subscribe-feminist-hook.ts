
import * as functions from 'firebase-functions';
import {mailchimp, subscribeToMailchimp} from '../utils/mailchimp';
import checkMissingParameters from '../utils/check-missing-params';

// SUBSCRIBE_TO_NEWSLETTER
export const subscribed_to_newsletter = functions.region('europe-west3').firestore
	.document('events/{eventId}/feminists/{feministId}')
	.onCreate(async (snap, _context) => {
		try {
			const data = snap.data();

			if (!mailchimp) {
				functions.logger.error('erreur initializing mailchimp');
				return ('erreur initializing mailchimp');
			}

			if (data?.haveBeenAddToMailchimp) {
				functions.logger.info('already added to mailchimp');
				return ('already added to mailchimp');
			}

			if (!data?.optin) {
				functions.logger.info('The feminist doesnt want to opt-in');
				return ('The feminist doesnt want to opt-in');
			}

			const element_to_check = ['first_name', 'email', 'event_id', 'zipcode', 'phone_number', 'optin'];
			const errors = checkMissingParameters(element_to_check, data);

			if (errors?.length) {
				functions.logger.debug(`in the body of the request, ${errors.join(',')} is missing from the POST Body`);
				return (`in the body of the request, ${errors.join(',')} is missing from the POST Body`);
			}

			const new_data = {
				email: data?.email,
				first_name: data?.first_name,
				event_id: data?.event_id,
				last_name: data?.last_name,
				phone_number: data?.phone_number,
				zipcode: data?.zipcode
			};

			const results = await subscribeToMailchimp(new_data);

			functions.logger.log(
				data?.email,
				results,
				'subscribed'
			);

			await snap.ref.update({
				haveBeenAddToMailchimp: true
			});

			functions.logger.info('function complete');
			return 'function complete';
		} catch (error: unknown) {
			functions.logger.error(error);
			return error;
		}

		// SEND E_MAIL TO PEOPLE EXISTING to wait or with validateData

	// Vous êtes bien inscrite à l’événement
	// Vous êtes sur liste d’attente
	});

export const subscribed_leader_to_newsletter = functions.region('europe-west3').firestore
	.document('events/{eventId}/leaders/{leaderId}')
	.onCreate(async (snap, _context) => {
		const data = snap.data();
		try {
			if (!mailchimp) {
				functions.logger.error('erreur initializing mailchimp');
				return ('erreur initializing mailchimp');
			}

			if (data?.haveBeenAddToMailchimp) {
				functions.logger.info('already added to mailchimp');
				return ('already added to mailchimp');
			}

			if (!data?.optin) {
				functions.logger.info('The feminist doesnt want to opt-in');
				return ('The feminist doesnt want to opt-in');
			}

			const element_to_check = ['first_name', 'email', 'event_id', 'zipcode', 'phone_number', 'optin'];
			const errors = checkMissingParameters(element_to_check, data);

			if (errors?.length) {
				functions.logger.debug(`in the body of the request, ${errors.join(',')} is missing from the POST Body`);
				return (`in the body of the request, ${errors.join(',')} is missing from the POST Body`);
			}

			const new_data = {
				email: data?.email,
				first_name: data?.first_name,
				event_id: data?.event_id,
				last_name: data?.last_name,
				phone_number: data?.phone_number,
				zipcode: data?.zipcode
			};

			const results = await subscribeToMailchimp(new_data);

			functions.logger.log(
				data?.email,
				results,
				'subscribed'
			);

			await snap.ref.update({
				haveBeenAddToMailchimp: true
			});

			functions.logger.info('function complete');
			return ('function complete');
		} catch (error: unknown) {
			functions.logger.error(error);
			return error;
		}
	});

