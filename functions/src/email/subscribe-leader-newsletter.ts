import {mailchimp, subscribeToMailchimp} from '../utils/mailchimp';
import checkMissingParameters from '../utils/check-missing-params';
import * as functions from 'firebase-functions';

const subscribeLeaderNewsletter = async (
	snapshot: functions.firestore.DocumentSnapshot,
	_context: functions.EventContext
) => {
	const data = snapshot.data();
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
			phone_number: data?.phone_number,
			zipcode: data?.zipcode
		};

		const results = await subscribeToMailchimp(new_data);

		functions.logger.log(
			data?.email,
			results,
			'subscribed'
		);

		await snapshot.ref.update({
			haveBeenAddToMailchimp: true
		});

		functions.logger.info('function complete');
		return ('function complete');
	} catch (error: unknown) {
		functions.logger.error(error);
		return error;
	}
};

export default subscribeLeaderNewsletter;

