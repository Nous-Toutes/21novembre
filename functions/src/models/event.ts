/* eslint-disable @typescript-eslint/no-unused-vars */

import {db} from '../utils/firestore';
import {collection, subcollection} from 'typesaurus';
import {firestore} from 'firebase-admin';

export enum DATE {
	'SEPTEMBER' ='SEPTEMBER'
}
export enum Category {
	POLICE = 'POLICE',
	JUSTICE = 'JUSTICE'
}

export enum STATUS {
	WAITING_FOR_LEADER = 'WAITING_FOR_LEADER',
	WAITING_FOR_VALIDATION= 'WAITING_FOR_VALIDATION',
	VALIDATE = 'VALIDATE'
}

export type Event = {
	name: string;
	location: firestore.GeoPoint;
	category: Category;
	number_of_people: number;
	whatsappUrl: string | undefined;
	status: STATUS;
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
	date: DATE;
};

export type localLeader = {
	first_name: string;
	email: string;
	event_id: string;
	zipcode: string;
	phone_number: string;
	whatsappUrl: string;
	date: DATE;
};

export const events = collection<Event>('events');
export const feminists = subcollection<Feminist, Event>('feminists', events);
export const leaders = subcollection<localLeader, Event>('leaders', events);

export {db};

