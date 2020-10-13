/* eslint-disable import/no-mutable-exports */

import * as functions from 'firebase-functions';

// @ts-ignore incorrect typescript typings
import * as Mailchimp from 'mailchimp-api-v3';
import {MAILCHIMP_API_KEY, MANDRILL_API_KEY, SENDER_EMAIL, MAILCHIMP_AUDIENCE_ID} from './config';

// @ts-ignore
import * as mailchimpTransactionalModule from '@mailchimp/mailchimp_transactional';

// @eslint-ignore
let mailchimp: Mailchimp;

let mailchimpTransactional: any;

try {
	// @ts-ignore
	mailchimp = new Mailchimp(MAILCHIMP_API_KEY);
	mailchimpTransactional = mailchimpTransactionalModule(MANDRILL_API_KEY);
} catch (error: unknown) {
	functions.logger.error(error);
}

// “Vous êtes sur liste d’attente”
// “Une orga s’est inscrite donc votre participation est validée”
// “Vous êtes bien inscrite à l’événement”
// “Vous êtes bien inscrite comme organisatrice”
enum TEMPLATE_IDS {
	'YOU_ARE_ON_WAITING_LIST' = 'vous-tes-sur-liste-d-attente',
	'THE_EVENT_WAS_VALIDATE_TODAY' = 'une-organisatrice-s-est-inscrite-donc-votre-participation-est-valid-e',
	'YOU_ARE_INVITED_TO_THE_EVENT' ='vous-tes-bien-inscrite-l-v-nement',
	'YOU_ARE_SUBSCRIBED_AS_LEADER' = 'vous-tes-bien-inscrite-comme-organisatrice'
}

interface ISendTransactionnalEmail {
	template: TEMPLATE_IDS;
	email: string;
	first_name: string;
}

const subscribeToMailchimp = async (email: string) => {
	return mailchimp.post(
		`/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
		{
			email_address: email,
			status: 'subscribed'
		}
	);
};

const sendTransactionalEmail = async (parameters: ISendTransactionnalEmail) => {
	// https://mandrillapp.com/api/docs/messages.JSON.html#method=send-template
	// No key neded i guess with the mailchimpTransactionnal module
	const message = {
		template_name: parameters.template,
		template_content: [
			{
				first_name: parameters.first_name
			}
		],
		message: {
			from_email: SENDER_EMAIL,
			to: [
				{
					email: parameters.email,
					name: parameters.first_name,
					type: 'to'
				}
			]
		}
	};

	const result = await mailchimpTransactional.sendTemplate(message);

	functions.logger.info(result);

	if (result?.status === 'error') {
		functions.logger.error(result);
		functions.logger.error(new Error(result?.message));
	}
};

export {mailchimp, sendTransactionalEmail, TEMPLATE_IDS, subscribeToMailchimp};
