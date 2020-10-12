/* eslint-disable import/no-mutable-exports */

import * as functions from 'firebase-functions';

// @ts-ignore incorrect typescript typings
import * as Mailchimp from 'mailchimp-api-v3';
import {MAILCHIMP_API_KEY, MANDRILL_API_KEY} from './config';

// @ts-ignore
import * as MailchimpTransactional from '@mailchimp/mailchimp_transactional'


// @eslint-ignore
let mailchimp: Mailchimp;

let mailchimpTransactionnal

try {
	// @ts-ignore
	mailchimp = new Mailchimp(MAILCHIMP_API_KEY);
	mailchimpTransactionnal = MailchimpTransactional(MANDRILL_API_KEY)
} catch (error: unknown) {
	functions.logger.error(error);
}

export {mailchimp, mailchimpTransactionnal};
