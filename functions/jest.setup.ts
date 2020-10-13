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
			mailchimp_api_key: 'FEMINIST',
			mandrill_api_key: 'FEMINIST',
			sender_email: 'FEMINIST',
		}
	});

jest.mock( './src/utils/mailchimp.ts', () => {
	return {
		mailchimp: jest.fn().mockReturnValue(undefined), 
		sendTransactionalEmail: jest.fn().mockReturnValue(undefined),
		TEMPLATE_IDS: jest.fn().mockReturnValue(undefined), 
		subscribeToMailchimp: jest.fn().mockReturnValue(undefined),
		sendConfirmationCampagnUnique: jest.fn().mockReturnValue(undefined)
	};
});

export  {testEnv}