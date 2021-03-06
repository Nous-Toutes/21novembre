import * as functions from 'firebase-functions';

function isString(x: any): x is string {
	return typeof x === 'string';
}

const MAILCHIMP_AUDIENCE_ID: string = functions.config()?.mailchimp?.mailchimp_audience_id;
const MAILCHIMP_API_KEY: string = functions.config()?.mailchimp?.mailchimp_api_key;
const MANDRILL_API_KEY: string = functions.config()?.mailchimp?.mandrill_api_key;
const SENDER_EMAIL = 'contact@noustoutes.org';

if (!isString(MAILCHIMP_AUDIENCE_ID)) {
	throw new Error('Missing MAILCHIMP_API_KEY');
}

if (!isString(MAILCHIMP_API_KEY)) {
	throw new Error('Missing MAILCHIMP_AUDIENCE_ID');
}

if (!isString(MANDRILL_API_KEY)) {
	throw new Error('Missing MANDRILL_API_KEY');
}

export {MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID, MANDRILL_API_KEY, SENDER_EMAIL};
