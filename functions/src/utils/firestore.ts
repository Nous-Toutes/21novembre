import * as admin from 'firebase-admin';

admin.initializeApp();
const {firestore} = admin;
const db = admin.firestore();

export {db, admin, firestore};
