import {db} from '../utils/firestore';

import {collection, subcollection} from 'typesaurus';

export enum Category {
	POLICE,
	JUSTICE
}

export type Event = {
	name: string;
	location: {
		latitude: number;
		longitude: number;
	};
	category: Category;
	number_of_people: number;
};

export type Counteur = {
	count: number;
};

export type Feminist = {
	first_name: string;
	last_name: string;
	email: string;
	event_id: string;
	zipcode: string;
	phone_number: string;
};

export const events = collection<Event>('events');
export const feminists = subcollection<Feminist, Event>('feminists', events);

export {db};

