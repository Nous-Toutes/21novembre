import * as path from 'path';
import * as test from 'firebase-functions-test';
import {set} from 'typesaurus';

import {events, Category, STATUS, feminists, leaders} from './src/utils/model';

import * as admin from 'firebase-admin';

jest.setTimeout(50000);

const testEnv = test(
	{
		databaseURL: 'https://nous-toutes-test.firebaseio.com',
		storageBucket: 'nous-toutes-test.appspot.com',
		projectId: 'nous-toutes-test'
	},
	path.resolve(__dirname, './nous-toutes-test.json')
);

testEnv.mockConfig(
	{
		mailchimp: {
			mailchimp_audience_id: 'FEMINIST',
			mailchimp_api_key: 'FEMINIST',
			mandrill_api_key: 'FEMINIST',
			sender_email: 'FEMINIST'
		}
	});

jest.mock('./src/utils/mailchimp.ts', () => {
	return {
		mailchimp: jest.fn().mockReturnValue(undefined),
		sendTransactionalEmail: jest.fn().mockReturnValue(undefined),
		TEMPLATE_IDS: jest.fn().mockReturnValue(undefined),
		subscribeToMailchimp: jest.fn().mockReturnValue(undefined),
		sendConfirmationCampagnUnique: jest.fn().mockReturnValue(undefined)
	};
});

class Request {
	body: any;
	method: string;
	constructor(body: any, method: any) {
		this.method = method ?? 'GET';
		this.body = body;
	}
}

class Response {
	statusValue: number;
	value: any;

	constructor() {
		this.value = {};
		this.statusValue = 999;
	}

	status(newStatus: number) {
		this.statusValue = newStatus;
		return this;
	}

	send(newValue: any) {
		this.value = newValue;
		return this;
	}

	end() {
		return this;
	}

	json(newValue: any) {
		this.value = newValue;
		return this;
	}

	redirect() {
		return this;
	}

	getStatus() {
		return this.statusValue;
	}

	getValue() {
		return this.value;
	}
}

// SEED

set(events, 'seed-event', {
	name: 'commisseriat du 11 ême arrondissement',
	category: Category.JUSTICE,
	location: new admin.firestore.GeoPoint(48.8534, 2.3488),
	number_of_people: 0,
	whatsapp_url: undefined,
	status: STATUS.VALIDATE
});

set(events, 'seed-event-waiting_leader', {
	name: 'commisseriat du 12 ême arrondissement',
	category: Category.JUSTICE,
	location: new admin.firestore.GeoPoint(48.8534, 2.3488),
	number_of_people: 0,
	whatsapp_url: undefined,
	status: STATUS.WAITING_FOR_LEADER
});

const feminist = feminists('seed-event-waiting_leader');
set(feminist, 'alreadyAddToMailchimp', {
	first_name: 'lucas',
	event_id: 'seed-event',
	email: 'lucas@noustoutes.io',
	zipcode: '94700',
	phone_number: '+XX',
	haveBeenAddToMailchimp: false,
	optin: true
});

const leader = leaders('seed-event-waiting_leader');
set(leader, 'alreadyAddToMailchimp', {
	first_name: 'lucas',
	event_id: 'seed-event',
	email: 'lucas@noustoutes.io',
	zipcode: '94700',
	phone_number: '+XX',
	whatsapp_url: 'https://whatsapp.test',
	haveBeenAddToMailchimp: false,
	optin: true
});

export {testEnv, Request, Response};

