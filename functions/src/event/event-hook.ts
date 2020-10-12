
import * as functions from 'firebase-functions';
import {mailchimp} from '../utils/mailchimp';

// VALIDATE EVENT SEND AN EMAIL TO THE PEOPLE
export const send_email_on_event_validate = functions.region('europe-west3').firestore
	.document('events/{eventId}')
	.onUpdate(async (snap, _context) => {
        const data = snap.data();
        
        // Check if e-mail not send already 

		if (!mailchimp) {
			functions.logger.error('no mailchimp !!!');
			return;
        }
        
        //1. find the event


        // 2. Find all the people of the event


        // 3. Send them an e-mail
        
    })