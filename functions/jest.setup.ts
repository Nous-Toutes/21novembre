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
	origin: any;
	
	constructor() {
		this.value = {};
		this.origin = {};
		this.statusValue = 999;
	}

	set(field: string, value?: string){
		this.origin[field] = value
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
	name: 'Commissariat de police d\'Oyonnax',
	category: Category.JUSTICE,
	location: new admin.firestore.GeoPoint(48.8534, 2.3488),
	number_of_people: 0,
	whatsapp_url: undefined,
	status: STATUS.VALIDATE,
	address: '57 Rue Pasteur 01100 OYONNAX',
	city: 'OYONNAX',
	zipcode: '01',
	voie: '57 Rue Pasteur',
	department: '01',
	id: 'seed-event'

});

set(events, 'seed-event-waiting_leader', {
	name: 'Commissariat de police de Bourg en Bresse',
	category: Category.JUSTICE,
	location: new admin.firestore.GeoPoint(48.8524, 2.3478),
	number_of_people: 0,
	whatsapp_url: undefined,
	status: STATUS.WAITING_FOR_LEADER,
	address: '4 Rue des Remparts 01000 BOURG EN BRESSE',
	city: 'BOURG EN BRESSE',
	zipcode: '01',
	voie: '4 Rue des Remparts',
	department: '01',
	id: 'seed-event-waiting_leader'
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

