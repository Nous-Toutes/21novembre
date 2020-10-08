
import * as functions from 'firebase-functions';
import {mailchimp} from '../utils/mailchimp';
import {MAILCHIMP_AUDIENCE_ID} from '../utils/config';

// SUBSCRIBE_TO_NEWSLETTER
export const subscribed_to_newsletter = functions.firestore
	.document('events/{eventId}/feminists/{feministId}')
	.onCreate(async (snap, _context) => {
		const data = snap.data();

		if (!mailchimp) {
			functions.logger.error('no mailchimp !!!');
			return;
		}

		if (!data?.email) {
			functions.logger.error('no user email');
			return;
		}

		try {
			const results = await mailchimp.post(
				`/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
				{
					email_address: data?.email,
					status: 'subscribed'
				}
			);

			functions.logger.log(
			data?.email,
			MAILCHIMP_AUDIENCE_ID,
			results.id,
			'subscribed'
			);
			functions.logger.info('function complete');
		} catch (error: unknown) {
			functions.logger.error(error);
		}
	});
