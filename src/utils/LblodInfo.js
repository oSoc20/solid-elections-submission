import {fetchPostAbb, fetchGetDb, fetchPostDb} from './RequestDatabase';

const fetchUserInfo = async (personURI) => {
    const uriUSerInfo = new URLSearchParams({
        query: `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>

        SELECT ?list (MAX(?listName) AS ?listName) (MAX(?firstName) AS ?firstName) (MAX(?familyName) AS ?familyName) (MAX(?listNumber) AS ?listNumber) (MAX(?positionInResult) AS ?positionInResult) WHERE {
            BIND( <${personURI}> as ?person )
            ?list a mandaat:Kandidatenlijst;
            mandaat:heeftKandidaat ?person.
            ?person foaf:familyName ?familyName.
            ?person persoon:gebruikteVoornaam ?firstName.
    
            ?list skos:prefLabel ?listName;
                    mandaat:lijstnummer ?listNumber.
    
            ?electionResult mandaat:isResultaatVan ?person.
            ?electionResult mandaat:plaatsRangorde ?positionInResult.
        } GROUP BY ?list LIMIT 10
        `
    });

    const responseUser = await fetchPostAbb(uriUSerInfo);

    if (responseUser) {
        const dataUser = responseUser.result.results.bindings;

        return [true, dataUser];
    } else {
        return [false, null];
    }
}

const fetchUserAmount = async (personURI) => {
    const uriAmount = new URLSearchParams({
        query: `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>

        SELECT DISTINCT ?unit ?spentList ?spentCandidate2 WHERE {
            ?list a mandaat:Kandidatenlijst;
                    mandaat:heeftKandidaat <${personURI}>.
    
            ?list mandaat:behoortTot/mandaat:steltSamen/mandaat:isTijdspecialisatieVan/besluit:bestuurt ?unit.
            OPTIONAL { ?unit ext:maxSpentForList ?spentList. }
            OPTIONAL { ?unit ext:maxSpentForCandidate2 ?spentCandidate2. }
        } ORDER BY DESC(?spentList) DESC(?spentCandidate2)
        `
    });

    const responseAmount = await fetchPostAbb(uriAmount);

    if (responseAmount) {
        const dataAmount = responseAmount.result.results.bindings;
        return [true, dataAmount]
    } else {
        return [false, null]
    }
}

const fetchExtraAmount = async (personURI) => {
    const uriExtra = new URLSearchParams({
        query: `
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        SELECT (COUNT(*) AS ?mandated) WHERE {
            <${personURI}> ext:gemandateerdVoorIndienenUitgavenVerkiezing ?list.
        }
        `
    });

    const responseExtra = await fetchPostAbb(uriExtra);

    if (responseExtra) {
        const dataExtra = responseExtra.result.results.bindings;

        return [true, dataExtra];
    } else {
        return [false, null];
    }
}

const fetchLBLODInfo = async (personURI) => {
    const [userSuccess, dataUser] = await fetchUserInfo(personURI);
    const [amountSuccess, dataAmount] = await fetchUserAmount(personURI);
    const [extraSuccess, dataExtra] = await fetchExtraAmount(personURI);

    if (userSuccess && amountSuccess && extraSuccess) {
        const lists = dataUser.map(list => {
            return {
                "URI": list.list.value,
                "name": list.listName.value,
                "number": list.listNumber.value,
                "position": list.positionInResult.value
            }
        });

        console.log(dataUser);
        console.log(dataAmount);
        console.log(dataExtra);

        var listAmount = null;
        var userAmount = null;

        dataAmount.forEach(binding => {
            if (binding.spentList != null) {
                listAmount = binding.spentList.value;
                userAmount = binding.spentCandidate2.value;
            }
        });

        const info = {
            name: dataUser[0].firstName.value,
            familyName: dataUser[0].familyName.value,
            lists: lists,
            userAmount: userAmount,
            listAmount: listAmount,
            mandated: (dataExtra.length > 0 ? dataExtra[0].mandated.value : null)
        }

        return [true, info];
    }

    return [false, null];
}

const validateLblodID = async (lblodID) => {
    const uri = new URLSearchParams({
        personURI: lblodID
    });

    const response = await fetchGetDb("person", uri);

    if (response.success && response.result.success) {

        const result = response.result.result[0];
        return [true, {
            firstName: result.name.value,
            lastName: result.familyName.value
        }];
    } else {
        return [false, null]
    }
}

const registerCandidate = async (webID, lblodID) => {

    console.log(webID);
    console.log(lblodID);

    const response = await fetchPostDb("store", JSON.stringify({
        "uri": webID,
        "lblod_id": lblodID
    }));

    console.log(response);

    if (response.success && response.result.success) {
        return true;
    } else {
        return false;
    }
}

export {
    fetchLBLODInfo,
    validateLblodID,
    registerCandidate
}