import React, {Suspense, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoggedIn, LoggedOut, useWebId } from '@solid/react';
import { useDispatch } from 'react-redux';

import {setWebID} from './actions/webID';
import {requestUserLoad} from './actions/userInfo';
import { requestExpensesLoad } from './actions/expensesInfo';
import './App.sass';

import Layout from './components/Layout';
import NotConnected from './components/alert/notConnected'
import CandidateDataForm from './components/form/candidateDataForm';
import FormLayout from './components/form/FormLayout';
import FormSent from './components/alert/formSent';

const App = () => {

    const dispatch = useDispatch();
    const webID = useWebId();

    //Load user info when webID changes.
    useEffect(() => {
        if (webID) {
            dispatch(setWebID(webID));
            dispatch(requestUserLoad());
            dispatch(requestExpensesLoad())
        }
    }, [webID]);

    const refresh = () => {
        dispatch(requestUserLoad());
    }

    return (
        <Suspense fallback='loading'>
            <Router>
                <Layout>
                    <LoggedIn>
                        <Switch>
                            <Route path="/profile">
                                <CandidateDataForm
                                    refresh={refresh}
                                />
                            </Route>
                            <Route path="/new-declaration">
                                <FormLayout />
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