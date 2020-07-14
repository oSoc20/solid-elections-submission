import React, {useState, useEffect} from 'react';
import App from './App';
import {useWebId} from '@solid/react';
import ReactDOM from 'react-dom';
import {fetchDocument, TripleDocument} from 'tripledoc';
import {foaf} from 'rdf-namespaces';
import {initializeDataFolder} from './utils/SolidWrapper';
import { LoggedIn, LoggedOut, LoginButton } from '@solid/react';

const Index: React.FC = () => {
  const webId = useWebId();
  const [name, setName] = useState<string>('undefined');
  const [appContainer, setAppContainer] = useState<TripleDocument>();
  // useEffect is triggered when the state of this component
  useEffect(() => {
      const getName = async (webID: string) => {
          // Fetch the profile document on the solid pod
          const profileDoc = await fetchDocument(webID);
          const profile = profileDoc.getSubject(webID);
          // This try to fetch the name of the Solid Pod user
          // If there is no name in the profile document we use the webID as name
          setName(profile.getString(foaf.name) || webID);
          // Create the application folder
          // The appContainer must be use as a base path for each form submitted
          // to keep all the forms inside the same folder
          const appContainer = await initializeDataFolder(profile);
          if (appContainer != null) {
              setAppContainer(appContainer);
          } else {
              console.error("PANIC: We couldn't acces the app folder on the Solid Pod.");
          }
      };
      if (typeof webId === 'string') {
          getName(webId);
      }
  }, [webId]);

  return (
      <>
        <LoggedIn>
          <div className="alert alert-success" role="alert">
              You are connected!
          </div>
        </LoggedIn>
        <LoggedOut>
          <div className="alert alert-danger" role="alert">
              You are not connected! Please <LoginButton popup="/popup.html">Log in</LoginButton>
          </div>
        </LoggedOut>
      </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
    <div id="wrapper">
      <div className="container">
        <Index></Index>
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

export default Index;