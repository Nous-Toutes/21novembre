import * as path from 'path';
import * as test from 'firebase-functions-test';

jest.setTimeout(50000);

const testEnv = test(
	{
		databaseURL: 'https://nous-toutes-test.firebaseio.com',
		storageBucket: 'nous-toutes-test.appspot.com',
		projectId: 'nous-toutes-test'
	},
	path.resolve(__dirname, './nous-toutes-test.json')
);

testEnv.mockConfig(
	{
		mailchimp: {
			mailchimp_audience_id: 'FEMINIST',
			mailchimp_api_key: 'FEMINIST'
		}
	});
