import * as functions from 'firebase-functions';
// @ts-ignore incorrect typescript typings
import * as Mailchimp from 'mailchimp-api-v3';

let mailchimp: Mailchimp;

try {
	mailchimp = new Mailchimp(config.mailchimpApiKey);
} catch (error) {
	functions.logger.error(error);
}

export const addUserToList = functions.handler.auth.user.onCreate(
	async (user): Promise<void> => {
		console.log('start to add x');

		if (!mailchimp) {
			functions.logger.error('no mailchimp !!!');
			return;
		}

		const {email, uid} = user;
		if (!email) {
			logs.userNoEmail();
			return;
		}

		try {
			logs.userAdding(uid, config.mailchimpAudienceId);
			const results = await mailchimp.post(
				`/lists/${config.mailchimpAudienceId}/members`,
				{
					email_address: email,
					status: config.mailchimpContactStatus
				}
			);
			logs.userAdded(
				uid,
				config.mailchimpAudienceId,
				results.id,
				config.mailchimpContactStatus
			);
			logs.complete();
		} catch (error) {
			logs.errorAddUser(error);
		}
	}
);
