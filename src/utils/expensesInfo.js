import { createDocument, fetchDocument } from "tripledoc"
import {schema, rdf} from 'rdf-namespaces'

import { getAppFolderURI, getFolderFiles } from "./Solid"

const actionToJSON = (action) => {
    return {
        identifier: action.getString(schema.identifier),
        price: action.getDecimal(schema.price),
        priceCurrency: action.getString(schema.priceCurrency),
        description: action.getString(schema.description)
    }
}

const buyActionsToJSON = (buyActions) => {
    return buyActions.map(action => {
        return {
            ...actionToJSON(action),
            isExpense: true
        }
    })
}

const donateActionsToJSON = (donateActions) => {
    return donateActions.map(action => {
        return {
            ...actionToJSON(action),
            isExpense: false
        }
    })
}

export const getExpensesInfo = async (webID) => {

    const appFolderURI = await getAppFolderURI(webID);
    const folderFiles = await getFolderFiles(appFolderURI);

    if (! folderFiles) return null;

    const files = folderFiles.filter(
        folder => folder.name == 'a105.ttl'
    )

    if (! files.length > 0) return null;

    const expensesInfoDoc = await fetchDocument(files[0].url);

    if (! expensesInfoDoc) return null;

    const expenses = buyActionsToJSON(
        expensesInfoDoc.getAllSubjectsOfType(schema.BuyAction)
    )
    const donations = donateActionsToJSON(
        expensesInfoDoc.getAllSubjectsOfType(schema.DonateAction)
    )

    return expenses.concat(donations)
}

const addAction = (doc, agentURI, data) => {
    const action = doc.addSubject();

    action.addRef(schema.recipient, agentURI);
    action.addString(schema.identifier, data.identifier);
    action.addString(schema.description, data.description);
    action.addDecimal(schema.price, data.price);
    action.addString(schema.priceCurrency, data.priceCurrency);

    if (data.isExpense) {
        action.addRef(rdf.type, schema.BuyAction);
    } else {
        action.addRef(rdf.type, schema.DonateAction);
    }

    return action
}

//This function expects valid expenses and funds data.
export const saveA105Data = async (webID, agentURI, data) => {
    const appFolderURI = await getAppFolderURI(webID);
    console.log(appFolderURI);
    const expensesDocument = createDocument(
        appFolderURI + "a105.ttl"
    );

    console.log(data);

    const actions = data.map(
        actionData => addAction(expensesDocument, agentURI, actionData)
    );

    console.log(actions);

    try {
        await expensesDocument.save(actions);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}