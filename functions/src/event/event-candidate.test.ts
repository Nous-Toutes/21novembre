import * as api from '..';
import {Response, Request} from '../../jest.setup';
import {db} from '../utils/firestore';

describe('candidateEvent', () => {
	test('should only be call on post event', async () => {
		const response = new Response();

		const request = new Request({}, 'GET');

		// @ts-ignore
		await api.candidatEvent(request, response);

		expect(response.getStatus()).toBe(404);

		expect(
			response
				.getValue()
				.includes('request /candidateEvent with method GET dosn\'t exist')
		).toBeTruthy();
	});

	test('should have all the champ', async () => {
		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			email: 'lucas@noustoutes.io',
			zipcode: '94700',
			phone_number: '+XX',
			optin: false
		};

		const response = new Response();

		const request = new Request(body, 'POST');

		// @ts-ignore
		await api.candidatEvent(request, response);

		expect(response.getStatus()).toBe(400);

		expect(
			response.getValue().includes('is missing from the POST Body')
		).toBeTruthy();
	});

	test('should have a good event_id', async () => {
		const body = {
			first_name: 'lucas',
			event_id: 'fake_seed_event',
			email: 'lucas@noustoutes.io',
			zipcode: '94700',
			whatsapp_url: 'helloWhatsapp',
			phone_number: '+XX',
			optin: false
		};

		const response = new Response();

		const request = new Request(body, 'POST');

		// @ts-ignore
		await api.candidatEvent(request, response);

		expect(response.getStatus()).toBe(400);

		expect(response.getValue().includes('match any event')).toBeTruthy();
	});

	test('should not be already a leader', async () => {
		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			email: 'lucas@noustoutes.io',
			zipcode: '94700',
			phone_number: '+XX',
			whatsapp_url: 'helloWhatsapp',
			optin: false
		};

		// CREATE ALREADY A LEADER
		await db
			.collection('events')
			.doc(body.event_id)
			.collection('leaders')
			.doc(body.email)
			.set(body);

		const response = new Response();

		const request = new Request(body, 'POST');

		// @ts-ignore
		await api.candidatEvent(request, response);

		expect(response.getStatus()).toBe(400);

		expect(
			response.getValue().includes('There is already a leader for the event')
		).toBeTruthy();

		// Reset
		await db
			.collection('events')
			.doc(body.event_id)
			.collection('leaders')
			.doc(body.email)
			.delete();
	});

	test('should candidate without issue', async done => {
		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			email: 'lucas@noustoutes.io',
			whatsapp_url: 'helloWhatsapp',
			zipcode: '94700',
			phone_number: '+XX',
			optin: true
		};

		const leadersRef = db
			.collection('events')
			.doc(body.event_id)
			.collection('leaders');

		const leaders = await leadersRef.get();

		await Promise.all(
      leaders?.docs.map(async u => leadersRef.doc(u.id).delete())
		);

		const request = new Request(body, 'POST');
		const response = new Response();

		// @ts-ignore
		await api.candidatEvent(request, response);

		const status = response.getStatus();
		const value = response.getValue();

		expect(status).toBe(200);

		expect(value).toMatchInlineSnapshot(`
      Object {
        "address": "57 Rue Pasteur 01100 OYONNAX",
        "category": "JUSTICE",
        "city": "OYONNAX",
        "department": "01",
        "id": "seed-event",
        "isFull": false,
        "location": Object {
          "_latitude": 48.8534,
          "_longitude": 2.3488,
        },
        "name": "Commissariat de police d'Oyonnax",
        "number_of_people": 0,
        "status": "VALIDATE",
        "voie": "57 Rue Pasteur",
        "whatsapp_url": "helloWhatsapp",
        "zipcode": "01",
      }
    `);

		const leader = await db
			.collection('events')
			.doc(body.event_id)
			.collection('leaders')
			.doc(body.email)
			.get();

		// CHECK THE FEMINIST EXIST
		expect(leader.exists).toBeTruthy();
		done();
	});
});
