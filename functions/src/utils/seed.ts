
import * as functions from 'firebase-functions';
// Import seeding from '../seed';
// Import {set} from 'typesaurus';
// import {events, Category, STATUS, feminists, leaders} from './model';
// import * as admin from 'firebase-admin';

export const seedEvent = functions.https.onRequest(async (_request, response) => {
	// Seeding();

	// Set(events, 'seed-event', {
	// 	name: 'Commissariat de police d\'Oyonnax',
	// 	category: Category.JUSTICE,
	// 	location: new admin.firestore.GeoPoint(48.8534, 2.3488),
	// 	number_of_people: 0,
	// 	whatsapp_url: undefined,
	// 	status: STATUS.VALIDATE,
	// 	address: '57 Rue Pasteur 01100 OYONNAX',
	// 	city: 'OYONNAX',
	// 	zipcode: '01',
	// 	voie: '57 Rue Pasteur',
	// 	department: '01',
	// 	id: 'seed-event'

	// });

	// set(events, 'seed-event-waiting_leader', {
	// 	name: 'Commissariat de police de Bourg en Bresse',
	// 	category: Category.JUSTICE,
	// 	location: new admin.firestore.GeoPoint(48.8524, 2.3478),
	// 	number_of_people: 0,
	// 	whatsapp_url: undefined,
	// 	status: STATUS.WAITING_FOR_LEADER,
	// 	address: '4 Rue des Remparts 01000 BOURG EN BRESSE',
	// 	city: 'BOURG EN BRESSE',
	// 	zipcode: '01',
	// 	voie: '4 Rue des Remparts',
	// 	department: '01',
	// 	id: 'seed-event-waiting_leader'
	// });

	// const feminist = feminists('seed-event-waiting_leader');

	// set(feminist, 'alreadyAddToMailchimp', {
	// 	first_name: 'lucas',
	// 	event_id: 'seed-event',
	// 	email: 'lucas@noustoutes.io',
	// 	zipcode: '94700',
	// 	phone_number: '+XX',
	// 	haveBeenAddToMailchimp: false,
	// 	optin: true
	// });

	// const leader = leaders('seed-event-waiting_leader');
	// set(leader, 'alreadyAddToMailchimp', {
	// 	first_name: 'lucas',
	// 	event_id: 'seed-event',
	// 	email: 'lucas@noustoutes.io',
	// 	zipcode: '94700',
	// 	phone_number: '+XX',
	// 	whatsapp_url: 'https://whatsapp.test',
	// 	haveBeenAddToMailchimp: false,
	// 	optin: true
	// });

	response.status(200).end();
});

