import React, {Suspense, useEffect, useState} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoggedIn, LoggedOut, useWebId } from '@solid/react';

import {fetchUserData, initAppStorage} from './utils/SolidWrapper';
import {fetchLBLODInfo} from './utils/LblodInfo';
import './App.sass';

import Layout from './components/Layout';
import NotConnected from './components/alert/notConnected'
import CandidateDataForm from './components/form/candidateDataForm';
import FormLayout from './components/form/FormLayout';
import FormSent from './components/alert/formSent';

const App = () => {

    const APP_NAME = "solidelections";

    const webID = useWebId();
    const [loaded, setLoaded] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    //Load user info when webID changes.
    useEffect(() => {
        loadUserInfo();
    }, [webID]);

    //Switch loaded when userInfo changes.
    useEffect(() => {
        if (userInfo) {
            setLoaded(true);
        } else {
            setLoaded(false);
        }
    }, [userInfo]);

    async function loadUserInfo() {
        setUserInfo(null);

        if (webID) {
            const container = await initAppStorage(webID, APP_NAME);

            if (container) {
                const [solidSuccess, solidData] = await fetchUserData(container);

                if (solidSuccess) {
                    const [lblodSuccess, lblodInfo] = await fetchLBLODInfo(solidData.personUri);

                    if (lblodSuccess) {
                        setUserInfo({
                            webId: webID,
                            appContainer: container,
                            ...lblodInfo,
                            ...solidData
                        })
                    }
                }
            } else {
                throw "Container could not be initialized!"
            }
        }
    }

    return (
        <Suspense fallback='loading'>
            <Router>
                <Layout>
                    <LoggedIn>
                        <Switch>
                            <Route path="/profile">
                                <CandidateDataForm
                                    loaded={loaded}
                                    userInfo={userInfo}
                                    refresh={loadUserInfo}
                                />
                            </Route>
                            <Route path="/new-declaration">
                                <FormLayout
                                    loaded={loaded}
                                    userInfo={userInfo}
                                />
                            </Route>
                            <Route path="/formSent">
                                <FormSent />
                            </Route>
                        </Switch>
                    </LoggedIn>
                    <LoggedOut>
                        <NotConnected/>
                    </LoggedOut>
                </Layout>
            </Router>
        </Suspense>
    );
}

export default App;