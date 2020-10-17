import * as api from '..';
import {Response, Request} from '../../jest.setup';
import {db} from '../utils/firestore';
describe('joinEvent', () => {
	beforeEach(async () => {
		// Await testEnv.firestore.clearFirestoreData({projectId: 'nous-toutes-test'});
	});

	test('should only be call on post event', async () => {
		const response = new Response();

		const request = new Request({}, 'GET');

		// @ts-ignore
		await api.joinEvent(request, response);

		expect(response.getStatus()).toBe(404);

		expect(
			response
				.getValue()
				.includes('request /joinEvent with method GET dosn\'t exist')
		).toBeTruthy();
	});

	test('should have all the champ', async () => {
		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			email: 'lucas@noustoutes.io',
			zipcode: '94700',
			optin: true
		};

		const response = new Response();

		const request = new Request(body, 'POST');

		// @ts-ignore
		await api.joinEvent(request, response);

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
			phone_number: '+XX',
			optin: true
		};

		const response = new Response();

		const request = new Request(body, 'POST');

		// @ts-ignore
		await api.joinEvent(request, response);

		expect(response.getStatus()).toBe(400);

		expect(response.getValue().includes('match any event')).toBeTruthy();
	});

	test('should not be already full', async () => {
		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			email: 'lucas@noustoutes.io',
			zipcode: '94700',
			phone_number: '+XX',
			optin: true
		};

		await db.collection('events').doc(body.event_id).update({
			number_of_people: 49
		});

		const response = new Response();

		const request = new Request(body, 'POST');

		// @ts-ignore
		await api.joinEvent(request, response);

		expect(response.getStatus()).toBe(400);

		expect(response.getValue().includes('have 50 peoples')).toBeTruthy();

		// Reset
		await db.collection('events').doc(body.event_id).update({
			number_of_people: 0
		});
	});

	test('should join without issue', async done => {
		const body = {
			first_name: 'lucas',
			event_id: 'seed-event',
			email: 'lucas@noustoutes.io',
			zipcode: '94700',
			phone_number: '+XX',
			optin: true
		};
		const feminist = db
			.collection('events')
			.doc(body.event_id)
			.collection('feminists')
			.doc(body.email);
		const old_feminist = await feminist.get();

		if (old_feminist.exists) {
			await feminist.delete();
		}

		const request = new Request(body, 'POST');
		const response = new Response();

		// @ts-ignore
		await api.joinEvent(request, response);

		const status = response.getStatus();
		const value = response.getValue();

		expect(status).toBe(200);

		expect(value).toMatchInlineSnapshot(`
      Object {
        "address": "57 Rue Pasteur 01100 OYONNAX",
        "category": "JUSTICE",
        "city": "OYONNAX",
        "isFull": false,
        "location": Object {
          "_latitude": 48.8534,
          "_longitude": 2.3488,
        },
        "name": "Commissariat de police d'Oyonnax",
        "number_of_people": 1,
        "status": "VALIDATE",
        "voie": "57 Rue Pasteur",
        "whatsapp_url": null,
        "zipcode": "01",
      }
    `);

		const new_feminist = await feminist.get();

		// CHECK THE FEMINIST EXIST
		expect(new_feminist.exists).toBeTruthy();
		done();
	});
});
