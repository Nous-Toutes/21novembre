import * as api from '..';
import {testEnv} from '../../jest.setup';
import {mocked} from 'ts-jest/utils';

import * as mailchimp from '../utils/mailchimp';
jest.mock('../utils/mailchimp');

mocked(mailchimp.mailchimp, true);
mocked(mailchimp.subscribeToMailchimp, true);

const body = {
	first_name: 'lucas',
	event_id: 'seed-event',
	email: 'lucas@noustoutes.io',
	zipcode: '94700',
	phone_number: '+XX',
	optin: true
};

describe('Subscribe to mailchimp', () => {
	test('should not work if no optin', async done => {
		const wraped = testEnv.wrap(api.subscribed_leader_to_newsletter);
		const new_body = body;

		new_body.optin = false;
		const snap = testEnv.firestore.makeDocumentSnapshot(new_body, 'events/{eventId}/leaders/{feministId}');
		const result = await wraped(snap);

		expect(result.includes('The feminist doesnt want to opt-in')).toBeTruthy();
		expect(mocked(mailchimp.subscribeToMailchimp).mock.calls).toHaveLength(0);
		done();
	});

	test('should check e-mail', async done => {
		const wraped = testEnv.wrap(api.subscribed_leader_to_newsletter);
		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			zipcode: '94700',
			phone_number: '+XX',
			optin: true
		};

		const snap = testEnv.firestore.makeDocumentSnapshot(body, 'events/{eventId}/leaders/{feministId}');
		const result = await wraped(snap);

		expect(result.includes('is missing from the POST Body')).toBeTruthy();
		expect(mocked(mailchimp.subscribeToMailchimp).mock.calls).toHaveLength(0);
		done();
	});

	test('should work parfaitly', async done => {
		const wraped = testEnv.wrap(api.subscribed_leader_to_newsletter);

		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			email: 'lucas@noustoutes.io',
			zipcode: '94700',

			phone_number: '+XX',
			optin: true
		};
		const snap = testEnv.firestore.makeDocumentSnapshot(body, 'events/seed-event-waiting_leader/leaders/alreadyAddToMailchimp');

		await wraped(snap);

		expect(mocked(mailchimp.subscribeToMailchimp).mock.calls).toHaveLength(1);
		done();
	});

	test('should not be call twice', async done => {
		const wraped = testEnv.wrap(api.subscribed_leader_to_newsletter);

		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			email: 'lucas@noustoutes.io',
			zipcode: '94700',
			phone_number: '+XX',
			haveBeenAddToMailchimp: true,
			optin: true
		};

		const snap = testEnv.firestore.makeDocumentSnapshot(body, 'events/seed-event-waiting_leader/leaders/alreadyAddToMailchimp');

		const result = await wraped(snap);

		expect(result.includes('already added to mailchimp')).toBeTruthy();

		expect(mocked(mailchimp.subscribeToMailchimp).mock.calls).toHaveLength(1);
		done();
	});
});
