import * as functions from 'firebase-functions';

// @ts-ignore
import * as Mailchimp from '@mailchimp/mailchimp_marketing';

// @ts-ignore
import * as mailchimpTransactionalModule from '@mailchimp/mailchimp_transactional';

import {MAILCHIMP_API_KEY, MANDRILL_API_KEY, MAILCHIMP_AUDIENCE_ID, SENDER_EMAIL} from './config';

Mailchimp.setConfig({
	apiKey: MAILCHIMP_API_KEY,
	server: 'us18'
});

const mailchimp = Mailchimp;

const mailchimpTransactional = mailchimpTransactionalModule(MANDRILL_API_KEY);

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
	whatsapp_url?: string;
	email: string;
	first_name: string;
	address: string;
}

interface IMailchimpData {
	email: string;
	first_name: string;
	event_id: string;
	zipcode: string;
	phone_number: string;
}

const subscribeToMailchimp = async ({email, first_name, event_id, zipcode, phone_number}: IMailchimpData) => {
	const departement = zipcode?.slice(0, 2);

	const merge_fields = {
		MMERGE4: departement,
		MMERGE11: zipcode,
		MMERGE15: first_name,
		MMERGE10: phone_number,
		MMERGE13: event_id
	};

	return mailchimp.lists.addListMember(MAILCHIMP_AUDIENCE_ID, {
		email_address: email,
		status: 'subscribed',
		merge_fields
	});
};

const sendTransactionalEmail = async (parameters: ISendTransactionnalEmail) => {
	// https://mandrillapp.com/api/docs/messages.JSON.html#method=send-template
	// No key neded i guess with the mailchimpTransactionnal module
	const message = {
		template_name: parameters.template,
		template_content: [],
		message: {
			from_email: SENDER_EMAIL,
			to: [
				{
					email: parameters.email,
					name: parameters.first_name,
					type: 'to'
				}
			],
			merge_vars: [
				{
					rcpt: parameters.email,
					vars: [
						{
							name: 'first_name',
							content: parameters.first_name
						},
						{
							name: 'whatsapp_url',
							content: parameters?.whatsapp_url ?? ''
						},
						{
							name: 'address',
							content: parameters.address ?? ''
						}
					]
				}
			]

		}
	};

	const result = await mailchimpTransactional.messages.sendTemplate(message);

	functions.logger.info(result);

	if (result?.status === 'error') {
		functions.logger.error(result);
		functions.logger.error(new Error(result?.message));
	}
};

export {mailchimp, sendTransactionalEmail, TEMPLATE_IDS, subscribeToMailchimp};
