
import {db} from './firestore';
import {collection, subcollection} from 'typesaurus';
import {firestore} from 'firebase-admin';

export enum Category {
	POLICE = 'POLICE',
	JUSTICE = 'JUSTICE'
}

export type EventResponse = Event & {isFull: boolean};

export enum STATUS {
	WAITING_FOR_LEADER = 'WAITING_FOR_LEADER',
	VALIDATE = 'VALIDATE'
}

export type Event = {
	name: string;
	location: firestore.GeoPoint;
	category: Category;
	number_of_people: number;
	whatsapp_url: string | undefined;
	status: STATUS;
	address: string;
	department: string;
	id: string;
	voie: string;
	zipcode: string;
	city: string;
};

export type Counteur = {
	count: number;
};

export type Feminist = {
	first_name: string;
	email: string;
	event_id: string;
	zipcode: string;
	phone_number: string;
	haveBeenAddToMailchimp: boolean;
	optin: boolean;
};

export type localLeader = {
	first_name: string;
	email: string;
	event_id: string;
	zipcode: string;
	phone_number: string;
	whatsapp_url: string;
	haveBeenAddToMailchimp: false;
	optin: boolean;
};

export const events = collection<Event>('events');
export const feminists = subcollection<Feminist, Event>('feminists', events);
export const leaders = subcollection<localLeader, Event>('leaders', events);

export {db};

