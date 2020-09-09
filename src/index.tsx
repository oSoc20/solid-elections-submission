import React, {useState, useEffect} from 'react';
import {useWebId} from '@solid/react';
import {TripleDocument} from 'tripledoc';
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

const Index: React.FC = () => {
    const webId = useWebId();
    const [appContainer, setAppContainer] = useState<TripleDocument>();
    const APP_NAME = "solidelections"; //This is the folder name on the solid pod

    //We refresh appContainer and webID when data changed
    useEffect(() => {
        updateAppContainer();
    }, [webId]);

    //This method is use by candidateDataForm to refresh appContainer after saving profile because if the file me.ttl
    //doesn't exist before, form G103 will not refresh appContainer and so an error will append. That's why we have to refresh appContainer
    //to fetch the new file into it.
    async function updateAppContainer() {
        console.log("appContainer is refreshing...");
        const getAppStorage = async (webID: string) => {
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

    return (
        <Router basename="/">
            <App />
            <LoggedIn>
                <Switch>
                    <Route path="/profile">
                        <section className="vl-region">
                            <div className="vl-layout">
                                <CandidateDataForm appContainer={appContainer} webId={webId} refresh={updateAppContainer} />
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
                                            <a className="nav-link active" data-toggle="tab" href="#a105-form" role="tab" aria-controls="a105-form" aria-selected="false">Uitgaven kandidaat</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#g103-form" role="tab" aria-controls="g103-form" aria-selected="true">Uitgaven kandidaat</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#g104-form" role="tab" aria-controls="g104-form" aria-selected="false">Middelen kandidaat</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#a106-form" role="tab" aria-controls="a106-form" aria-selected="false">Middelen lijst</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#extra-form" role="tab" aria-controls="extra-form" aria-selected="false">Uitgaven politieke partij</a>
                                        </li>
                                    </ul>

                                    <div className="tab-content" id="tabContent">
                                        <div className="tab-pane fade show active" id="a105-form" role="tabpanel" aria-labelledby="a105-form">
                                            <A105 appContainer={appContainer} webId={webId} />
                                        </div>
                                        <div className="tab-pane fade" id="g103-form" role="tabpanel" aria-labelledby="g103-form">
                                            <h1>Form G103</h1>
                                        </div>
                                        <div className="tab-pane fade" id="g104-form" role="tabpanel" aria-labelledby="g104-form">
                                            <h1>Form G104</h1>
                                        </div>
                                        <div className="tab-pane fade" id="a106-form" role="tabpanel" aria-labelledby="a106-form">
                                            <h1>Form A106</h1>
                                        </div>
                                        <div className="tab-pane fade" id="extra-form" role="tabpanel" aria-labelledby="extra-form">
                                            <h1>Uitgaven politieke partij (this is the one extra for 6 parties at national level)</h1>
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