import * as functions from 'firebase-functions';

function isString(x: any): x is string {
	return typeof x === 'string';
}

const MAILCHIMP_AUDIENCE_ID: string = functions.config()?.mailchimp?.mailchimp_audience_id;
const MAILCHIMP_API_KEY: string = functions.config()?.mailchimp?.mailchimp_api_key;

if (!isString(MAILCHIMP_AUDIENCE_ID)) {
	throw new Error('Missing MAILCHIMP_API_KEY');
}

if (!isString(MAILCHIMP_API_KEY)) {
	throw new Error('Missing MAILCHIMP_AUDIENCE_ID');
}

export {MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID};
