/* eslint-disable import/no-mutable-exports */

import * as functions from 'firebase-functions';

// @ts-ignore incorrect typescript typings
import * as Mailchimp from 'mailchimp-api-v3';
import {MAILCHIMP_API_KEY} from './config';

// @eslint-ignore
let mailchimp: Mailchimp;

try {
	// @ts-ignore
	mailchimp = new Mailchimp(MAILCHIMP_API_KEY);
} catch (error: unknown) {
	functions.logger.error(error);
}

export {mailchimp};
