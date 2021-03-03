import { fetchDocument, createDocument } from "tripledoc";
import {schema, space} from 'rdf-namespaces';
import auth from 'solid-auth-client';
import FileClient from 'solid-file-client';

const fileClient = new FileClient(auth);

const getPublicFolderURI = async (webID) => {
    const profileDoc = await fetchDocument(webID);
    const profile = profileDoc.getSubject(webID);

    const storageFolder = await fileClient.readFolder(
        profile.getRef(space.storage)
    )

    const publicFolders = storageFolder.folders.filter(
        folder => folder.name == 'public'
    )

    if (publicFolders.length > 0) {
        return publicFolders[0].url
    }

    const result = await fileClient.createFolder(
        storageFolder.url + "public/"
    )

    // TODO: handle fail of folder creation!
    console.log(result);

    return result.url;
}

export const getAppFolderURI = async (webID) => {

    const publicFolder = await fileClient.readFolder(
        await getPublicFolderURI(webID)
    );

    const appFolders = publicFolder.folders.filter(
        folder => folder.name == 'solidelections'
    )

    if (appFolders.length > 0) {
        return appFolders[0].url;
    }

    const result = await fileClient.createFolder(
        publicFolder.url + "solidelections/"
    );

    // TODO: handle fail of folder creation!
    console.log(result);

    return result.url;
}

export const getFolderFiles = async (uri) => {
    const folder = await fileClient.readFolder(uri);

    if (folder) {
        return folder.files;
    }

    return null;
}