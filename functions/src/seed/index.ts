import {readFileSync} from 'fs';
import { parse } from "papaparse";
import {set} from 'typesaurus';
import * as admin from 'firebase-admin';
// @ts-ignore
import * as slug from 'limax';

import {events, Category, STATUS} from '../utils/model';


interface IrawEvent {
    departement: string;
    service: string;
    adresse_geographique: string;
    voie: string;
    code_postal: string;
    commune: string;
    Latitude: string;
    Longitude: string
    "Action prévue (cocher la case)": string;
    "Référent.e (prénom)": string;
    "Référent.e (mail)": string;
    "Groupe WhatsApp de l\'action (UNIQUEMENT LE LIEN)": string;
}

const importFile = () => {
    const file = readFileSync('secret.csv', 'utf8');
    const result = parse(file, {header: true});

    console.log(result.data)

    if(result.data){
        // @ts-ignore
        result.data.forEach(async (event: IrawEvent, index) => {

            try{
            const status = event?.["Groupe WhatsApp de l'action (UNIQUEMENT LE LIEN)"] ? STATUS.VALIDATE : STATUS.WAITING_FOR_LEADER 
            const id = slug(`evt_${event?.service}_${event?.adresse_geographique}`)
            const name = event?.service

            const findCategory = () => {
                if(name?.toLowerCase()?.includes("police")){
                    return Category.POLICE
                }

                if(name?.toLowerCase()?.includes("justice")){
                    return Category.JUSTICE
                }

                return Category.JUSTICE
            }
            
            const new_event = {
                departement: event?.departement,
                name,
                category: findCategory(),
                location: new admin.firestore.GeoPoint(Number(event?.Latitude), Number(event?.Longitude)),
                number_of_people: 0,
                whatsapp_url: event?.["Groupe WhatsApp de l'action (UNIQUEMENT LE LIEN)"] ?? "",
                status,
                address: event?.adresse_geographique ?? "",
                city: event?.commune ?? "",
                zipcode: event?.code_postal ?? "",
                voie: event?.voie ?? "",
                id
            }

        await set(events, id, new_event)
        }
        catch(err){
            console.log(err)
        }

	});

    }

}

export default importFile