import * as api from '..';
import {Response, Request} from '../../jest.setup';
import {db} from '../utils/firestore';

describe('joinEvent', () => {
	test('should only be call on post event', async () => {
		const response = new Response();

		const request = new Request({}, 'GET');

		// @ts-ignore
		await api.joinEvent(request, response);

		expect(response.getStatus()).toBe(404);

		expect(response.getValue().includes('request /events with method'));
	});

	test('should join without issue', async done => {
		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			email: 'lucas+noustoutes@geitner.io',
			zipcode: '94700',
			phone_number: '+XX',
			optin: true
		};

		const request = new Request(body, 'POST');
		const response = new Response();

		// @ts-ignore
		await api.joinEvent(request, response);

		const status = response.getStatus();
		const value = response.getValue();

		expect(status).toBe(200);

		expect(value).toMatchInlineSnapshot(`
      Object {
        "category": "JUSTICE",
        "isFull": false,
        "location": Object {
          "_latitude": 48.8534,
          "_longitude": 2.3488,
        },
        "name": "commisseriat du 11 ême arrondissement",
        "number_of_people": 1,
        "status": "VALIDATE",
        "whatsappUrl": null,
      }
	`);

		const feminist = await db.collection('events').doc(body.event_id).collection('feminists').doc(body.email).get();

		// CHECK THE FEMINIST EXIST
		expect(feminist.exists).toBeTruthy();
		done();
	});
});
