import {readFileSync} from 'fs';
import {parse} from 'papaparse';
import {set} from 'typesaurus';
import * as admin from 'firebase-admin';
// @ts-ignore
import * as slug from 'limax';

import {events, Category, STATUS, leaders} from '../utils/model';

interface IrawEvent {
	departement: string;
	service: string;
	adresse_geographique: string;
	voie: string;
	code_postal: string;
	commune: string;
	Latitude: string;
	Longitude: string;
	'Action prévue (cocher la case)': string;
	'Référent.e (prénom)': string;
	'Référent.e (mail)': string;
	'Groupe WhatsApp de l\'action (UNIQUEMENT LE LIEN)': string;
}

const importFile = () => {
	const file = readFileSync('secret.csv', 'utf8');
	const result = parse(file, {header: true});

	if (result.data) {
		// @ts-ignore
		result.data.forEach(async (event: IrawEvent) => {
			try {
				const status = event?.['Groupe WhatsApp de l\'action (UNIQUEMENT LE LIEN)'] ? STATUS.VALIDATE : STATUS.WAITING_FOR_LEADER;
				const id = slug(`evt_${event?.service}_${event?.adresse_geographique}`);
				const name = event?.service;

				const findCategory = () => {
					if (name?.toLowerCase()?.includes('police')) {
						return Category.POLICE;
					}

					if (name?.toLowerCase()?.includes('justice')) {
						return Category.JUSTICE;
					}

					return Category.JUSTICE;
				};

				const new_event = {
					department: event?.departement,
					name,
					category: findCategory(),
					location: new admin.firestore.GeoPoint(Number(event?.Latitude), Number(event?.Longitude)),
					number_of_people: 0,
					whatsapp_url: event?.['Groupe WhatsApp de l\'action (UNIQUEMENT LE LIEN)'] ?? '',
					status,
					address: event?.adresse_geographique ?? '',
					city: event?.commune ?? '',
					zipcode: event?.code_postal ?? '',
					voie: event?.voie ?? '',
					id
				};

				await set(events, id, new_event);
				
				if(status == STATUS.VALIDATE){
				const leader= leaders(id);

				await set(leader, event?.["Référent.e (mail)"]?.trim(), {
					first_name: event?.["Référent.e (prénom)"] ?? "",
					event_id: id,
					email:  event?.["Référent.e (mail)"]?.trim() ?? "",
					zipcode: "",
					phone_number: '',
					whatsapp_url: event?.['Groupe WhatsApp de l\'action (UNIQUEMENT LE LIEN)'] ?? '',
					haveBeenAddToMailchimp: false,
					optin: true
				});
				}
			} catch (error: unknown) {
				console.log(error);
			}
		});
	}
};

export default importFile;
