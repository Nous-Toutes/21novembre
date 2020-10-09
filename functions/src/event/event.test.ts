import {db} from '../utils/firestore';

describe('Events', () => {
	test('should find all event', async done => {
		const event = await db.collection('events').get();
		console.log(event.empty);
		done();
	});
});
