
import * as functions from 'firebase-functions';

// SUBSCRIBE_TO_NEWSLETTER
export const subscribed_to_newsletter = functions.region('europe-west3').firestore
	.document('events/{eventId}/feminists/{feministId}')
	.onCreate(async (snap, _context) => {
		/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
		return (await import('./subscribe-newsletter')).default(snap, _context);
	});

export const subscribed_leader_to_newsletter = functions.region('europe-west3').firestore
	.document('events/{eventId}/leaders/{leaderId}')
	.onCreate(async (snap, _context) => {
		/* eslint-disable-next-line node/no-unsupported-features/es-syntax */
		return (await import('./subscribe-leader-newsletter')).default(snap, _context);
	});

