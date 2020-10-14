import {set} from 'typesaurus';

import {events, Category, STATUS} from '../utils/model';

import * as admin from 'firebase-admin';
// Import {testEnv} from "../../jest.setup"
import * as api from '..';

describe('Events', () => {
	test('should find all event', async done => {
		set(events, 'seed-event', {
			name: 'commisseriat du 11 ême arrondissement',
			category: Category.JUSTICE,
			location: new admin.firestore.GeoPoint(48.8534, 2.3488),
			number_of_people: 0,
			whatsappUrl: undefined,
			status: STATUS.VALIDATE
		});

		set(events, 'seed-event-waiting_leader', {
			name: 'commisseriat du 12 ême arrondissement',
			category: Category.JUSTICE,
			location: new admin.firestore.GeoPoint(48.8534, 2.3488),
			number_of_people: 0,
			whatsappUrl: undefined,
			status: STATUS.WAITING_FOR_LEADER
		});

		const request = {method: 'GET'};

		let status = '';
		let value: any = {};

		const response = {
			status: (value_: any) => {
				status = value_;
				return response;
			},
			send: (value_: any) => {
				value = value_;
				return response;
			},
			end: () => {
				return response;
			},
			json: (value_: any) => {
				value = value_;
				return response;
			},
			redirect: (value_: any) => {
				value = value_;
				return response;
			}
		};

		// @ts-ignore
		await api.events(request, response);

		expect(status).toBe(200);

		expect(value).toMatchInlineSnapshot(
			`
      Array [
        Object {
          "category": "JUSTICE",
          "isFull": false,
          "location": Object {
            "_latitude": 48.8534,
            "_longitude": 2.3488,
          },
          "name": "commisseriat du 11 ême arrondissement",
          "number_of_people": 0,
          "status": "VALIDATE",
          "whatsappUrl": undefined,
        },
        Object {
          "category": "JUSTICE",
          "isFull": false,
          "location": Object {
            "_latitude": 48.8534,
            "_longitude": 2.3488,
          },
          "name": "commisseriat du 12 ême arrondissement",
          "number_of_people": 0,
          "status": "WAITING_FOR_LEADER",
          "whatsappUrl": undefined,
        },
      ]
    `
		);

		done();
	});
});
