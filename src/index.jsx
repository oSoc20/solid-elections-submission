import React, {useState, useEffect} from 'react';
import {useWebId} from '@solid/react';
import {TripleDocument, TripleSubject} from 'tripledoc';
import {initAppStorage} from './utils/SolidWrapper';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoggedIn, LoggedOut } from '@solid/react';
import CandidateDataForm from "./components/form/candidateDataForm";
import FormSent from "./components/alert/formSent";
import NotConnected from "./components/alert/notConnected";
import A105 from "./components/form/A105";
import Footer from "./components/footer";
import App from './App';
import {fetchGetDb, fetchPostDb, fetchPostAbb} from './utils/RequestDatabase';
import {createAppDocument, listDocuments, createExpense, createDonation} from './utils/SolidWrapper';
import {fetchDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';

const Index = () => {
    const webId = useWebId();
    const [appContainer, setAppContainer] = useState();
    const [userData, setUserData] = useState(); 
    const [userInfo, setUserInfo] = useState(null); //Contains all user info we can use
    const [profileUri, setProfileUri] = useState(null); //Contains WebID + me.ttl (user's profile info)
    const [loaded, setLoaded] = useState(false);
    const APP_NAME = "solidelections"; //This is the folder name on the solid pod

    //We refresh appContainer and webID when data changed
    useEffect(() => {
        updateAppContainer();
    }, [webId]);

    useEffect(()=> {
        profileExist();
    }, [appContainer]);

    useEffect(() => {
        updateUserInfo();
    }, [userData]);

    useEffect(() => {
        //console.log(userInfo);
        if (userInfo != null) {
            //The userInfo is now set, we tell to the component it can load
            setLoaded(true);
        }
    }, [userInfo]);

    //This method is use by candidateDataForm to refresh appContainer after saving profile because if the file me.ttl
    //doesn't exist before, form G103 will not refresh appContainer and so an error will append. That's why we have to refresh appContainer
    //to fetch the new file into it.
    async function updateAppContainer() {
        console.log("appContainer is refreshing...");
        setLoaded(false);
        setUserInfo(null);
        const getAppStorage = async (webID) => {
            const appContainer = await initAppStorage(webID, APP_NAME);
            if (appContainer != null) {
                setAppContainer(appContainer);
            } else {
                alert("PANIC: We couldn't acces the app folder on the Solid Pod.");
            }
        };
        if (typeof webId === 'string') {
            getAppStorage(webId);
        }
    }

    async function profileExist() {
        console.log("Checking if profile exist...");
        if (appContainer != null) {
            let documents = listDocuments(appContainer);
            let userDataLink = documents.find(link => {
                let indexFile = link.lastIndexOf('/');
                let file = link.substr(indexFile + 1);
    
                return file == "me.ttl";
            });
    
            if (userDataLink != null) {
                setProfileUri(userDataLink);

                let userDataDoc = await fetchDocument(userDataLink);
                if (userDataDoc != null) {
                    setUserData(userDataDoc.getSubject("#me"));
                }
            } else {
                //No file "me.ttl", the user profile doesn't exist tell the component it can load
                setLoaded(true);
            }
        }
    }

    async function updateUserInfo() {
        console.log("Updating user info...");
        if (userData != null) {
            let personURI = userData.getString(schema.sameAs);
            if (personURI != null) {
                let uriUSerInfo = new URLSearchParams({
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

                let uriAmount = new URLSearchParams({
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

                let uriExtra = new URLSearchParams({
                    query: `
                    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
                    SELECT (COUNT(*) AS ?mandated) WHERE {
                        <${personURI}> ext:gemandateerdVoorIndienenUitgavenVerkiezing ?list.
                    }
                    `
                });


                let responseUser = await fetchPostAbb(uriUSerInfo);
                let responseAmount = await fetchPostAbb(uriAmount);
                let responseExtra = await fetchPostAbb(uriExtra);

                if (responseUser.success && responseAmount.success && responseExtra.success) {
                    let dataUser = responseUser.result.results.bindings;
                    let dataAmount = responseAmount.result.results.bindings;
                    let dataExtra = responseExtra.result.results.bindings;

                    let lists = dataUser.map((list) => {
                        return {
                            "URI": list.list.value,
                            "name": list.listName.value,
                            "number": list.listNumber.value,
                            "position": list.positionInResult.value
                        }
                    });

                    var listAmout = null;
                    var userAmount = null;

                    dataAmount.forEach((binding) => {
                        if (binding.spentList != null) {
                            listAmout = binding.spentList;
                            userAmount = binding.spentCandidate2;
                        }
                    });

                    setUserInfo({
                        "webId": webId,
                        "appContainer": appContainer,
                        "profile": profileUri,
                        "personUri": personURI,
                        "name": dataUser[0].firstName.value,
                        "familyName": dataUser[0].familyName.value,
                        "lists": lists,
                        "userAmount": userAmount != null ? userAmount.value : null,
                        "listAmount": listAmout != null ? listAmout.value : null,
                        "mandated": (dataExtra.length > 0 ? dataExtra[0].mandated.value : null),
                        "address": {
                            "municipality": userData.getString(schema.addressLocality),
                            "street": userData.getString(schema.streetAddress),
                            "postalCode": userData.getInteger(schema.postalCode)
                        }
                    });

                    return true;
                }
            }

            //Error with the file, the user profile doesn't exist tell the component it can load
            setLoaded(true);
        }
        
        return false;
    }

    //we must send appContainer to the profile page because userInfo will be null if the profile doesn't exist (me.ttl)
    return (
        <Router basename="/">
            <App />
            <LoggedIn>
                <Switch>
                    <Route path="/profile">
                        <section className="vl-region">
                            <div className="vl-layout">
                                <CandidateDataForm appContainer={appContainer} userInfo={userInfo} loaded={loaded} webId={webId} refresh={updateAppContainer} />
                            </div>
                        </section>
                    </Route>
                    <Route path="/formSent">
                        <section className="vl-region">
                            <div className="vl-layout">
                                <FormSent />
                            </div>
                        </section>
                    </Route>
                    <Route path="/new-declaration">
                        <section className="vl-region">
                            <div className="vl-layout">
                                <div>
                                    <ul id="formSelection" className="nav nav-tabs nav-fill" role="tablist">
                                        <li className="nav-item">
                                            <a id="tab-a105" className="nav-link active" data-toggle="tab" href="#a105-form" role="tab" aria-controls="a105-form" aria-selected="false">Uitgaven kandidaat</a>
                                        </li>
                                        <li className={"nav-item " + (userInfo != null && userInfo.lists[0].position == 1 ? "" : "disabled")}>
                                            <a id="tab-g103" className={"nav-link " + (userInfo != null && userInfo.lists[0].position == 1 ? "" : "disabled")} data-toggle="tab" href="#g103-form" role="tab" aria-controls="g103-form" aria-selected="true">Uitgaven lijst</a>
                                        </li>
                                        <li className="nav-item disabled">
                                            <a id="tab-g104" className="nav-link disabled" data-toggle="tab" href="#g104-form" role="tab" aria-controls="g104-form" aria-selected="false">Schenkers/sponsors kandidaat</a>
                                        </li>
                                        <li className="nav-item disabled">
                                            <a id="tab-a106" className="nav-link disabled" data-toggle="tab" href="#a106-form" role="tab" aria-controls="a106-form" aria-selected="false">Schenkers/sponsors lijst</a>
                                        </li>
                                        <li className={"nav-item " + (userInfo != null && userInfo.mandated > 0 ? "" : "disabled")}>
                                            <a id="tab-extra" className={"nav-link " + (userInfo != null && userInfo.mandated > 0 ? "" : "disabled")} data-toggle="tab" href="#extra-form" role="tab" aria-controls="extra-form" aria-selected="false">Uitgaven politieke partij</a>
                                        </li>
                                    </ul>

                                    <div className="tab-content" id="tabContent">
                                        <div className="tab-pane fade show active" id="a105-form" role="tabpanel" aria-labelledby="a105-form">
                                            <A105 userInfo={userInfo} loaded={loaded} />
                                        </div>
                                        <div className="tab-pane fade" id="g103-form" role="tabpanel" aria-labelledby="g103-form">
                                            <h1>U ziet dit formulier omdat u lijsttrekker bent.</h1>
                                            <p>Het maximumbedrag dat u als lijst mag uitgeven bedraagt {userInfo != null ? userInfo.listAmount : ""}€</p>
                                        </div>
                                        <div className="tab-pane fade" id="g104-form" role="tabpanel" aria-labelledby="g104-form">
                                            <h1>Form G104</h1>
                                        </div>
                                        <div className="tab-pane fade" id="a106-form" role="tabpanel" aria-labelledby="a106-form">
                                            <h1>Form A106</h1>
                                        </div>
                                        <div className="tab-pane fade" id="extra-form" role="tabpanel" aria-labelledby="extra-form">
                                            <p>U ziet dit formulier omdat u gemandateerde bent vanuit uw partij.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Route>
                </Switch>
            </LoggedIn>
            <LoggedOut>
                <section className="vl-region">
                    <div className="vl-layout">
                        <NotConnected />
                    </div>
                </section>
            </LoggedOut>
            <Footer />
        </Router>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <Index />
    </React.StrictMode>,
    document.getElementById('root')
);

export default Index;