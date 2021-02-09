import { createDocument, fetchDocument } from "tripledoc";
import {schema} from 'rdf-namespaces';

import {getAppFolderURI, getFolderFiles} from './Solid';

export const validateUserInfo = (userInfo) => {
    return (
        validateLblodID(userInfo.lblodID) &&
        validateMunicipality(userInfo.municipality) &&
        validatePostalCode(userInfo.postalCode)
    )
}

const validateLblodID = (lblodID) => {
    return true;
}

const validateMunicipality = (municipality) => {
    return true;
}

const validatePostalCode = (postalCode) => {
    return true;
}

export const saveUserInfo = async (userInfo, webID) => {

    const validInfo = validateUserInfo(userInfo);

    if (validInfo) {

        const appFolderURI = await getAppFolderURI(webID);
        const userDocument = createDocument(
            appFolderURI + "me.ttl"
        );

        const subject = userDocument.addSubject({
            identifier: "me"
        });
        subject.addRef(schema.sameAs, userInfo.lblodId);
        subject.addString(schema.addressLocality, userInfo.municipality);
        subject.addInteger(schema.postalCode, userInfo.postalCode);

        try {
            await userDocument.save([subject]);
            return true;
        } catch (e) {

            //TODO: handle fail of document save!
            console.log(e);

            return false;
        }
    }

    return false;
}

export const getUserInfo = async (webID) => {

    const appFolderURI = await getAppFolderURI(webID);
    const folderFiles = await getFolderFiles(appFolderURI);

    if (folderFiles) {
        const files = folderFiles.filter(
            folder => folder.name == 'me.ttl'
        );
    
        if (files.length > 0) {
            const userInfoDoc = await fetchDocument(files[0].url);

            if (userInfoDoc) {
                const subject = userInfoDoc.getSubject("#me");

                if (subject) {
                    return {
                        lblodId: subject.getRef(schema.sameAs),
                        address: {
                            municipality: subject.getString(schema.addressLocality),
                            postalCode: subject.getInteger(schema.postalCode)
                        },
                        // In futuref address will be removed!
                        municipality: subject.getString(schema.municipality),
                        postalCode: subject.getInteger(schema.postalCode)
                    }
                }
            }
        }
    }

    return null
}

