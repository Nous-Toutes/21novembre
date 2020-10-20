import * as api from '..';
import {Response, Request} from '../../jest.setup';

describe('Events', () => {
	test('should only be call on GET event', async () => {
		const response = new Response();
		const request = new Request({}, 'GET');

		// @ts-ignore
		await api.events(request, response);

		expect(response.getValue().includes('request /events with method')).toBeTruthy();
	});

	test('should find all event', async done => {
		const body = {
			department: '75'
		};
		const request = new Request(body, 'POST');
		const response = new Response();

		// @ts-ignore
		await api.events(request, response);

		const status = response.getStatus();
		const value = response.getValue();

		expect(status).toBe(200);

		const isArray = Array.isArray(value);

		expect(isArray).toBeTruthy();
		done();
	});
});
