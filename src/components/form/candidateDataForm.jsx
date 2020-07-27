import React from "react";
import {fetchDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';
import {createAppDocument, listDocuments} from '../../utils/SolidWrapper';
import {isEmpty, isNumber, isOnlyText} from '../../utils/DataValidator';
import Loading from '../alert/loading';

class CandidateDataForm extends React.Component {
    FILE_NAME = "me.ttl";

    constructor(props) {
        super(props);
        this.setDefaultValue();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state.loaded = false;
    }

    componentDidMount() { //Trigger when component is created or using route
        if (this.props.appContainer !== undefined) {
            this.fetchUserData();
            this.setState({"loaded": true});
        }
    }

    componentDidUpdate(prevProps) { //Trigger when state or props change but not with route
        if (this.props.appContainer !== undefined && this.props.appContainer != prevProps.appContainer) {
            this.fetchUserData();
            this.setState({"loaded": true});
        }
    }

    async setDefaultValue() {
        this.state = {firstname: '', lastname: '', street: '', streetNumber: '', locality: '', postalCode: '', lblodid: ''};
    }

    async fetchUserData() {
        let documents = listDocuments(this.props.appContainer);
        let userDataLink = documents.find(link => {
            let indexFile = link.lastIndexOf('/');
            let file = link.substr(indexFile + 1);

            return file == this.FILE_NAME;
        });
        if (userDataLink != null) {
            let userDataDoc = await fetchDocument(userDataLink);
            if (userDataDoc != null) {
                let userData = userDataDoc.getSubject("#me");
                if (userData != null) {
                    this.setState({
                        firstname: userData.getString(schema.givenName),
                        lastname: userData.getString(schema.familyName),
                        locality: userData.getString(schema.addressLocality),
                        postalCode: userData.getInteger(schema.postalCode),
                        lblodid: userData.getString(schema.sameAs)
                    });

                    let streetNumber = userData.getString(schema.streetAddress).split(', ');
                    if (streetNumber.length === 2) {
                        this.setState({
                            street: streetNumber[0],
                            streetNumber: streetNumber[1]
                        });
                    }
                }
            }
        }
    }

    setFieldValidation(id, value) { //Return false if there is no error
        let errorField = document.getElementById("input-field-" + id + "-error");
        let input = document.getElementById(id);

        if (errorField != null && input != null) {
            if (isEmpty(value)) {
                input.classList.add("vl-input-field--error");

                if (input.type === 'number') {
                    errorField.innerHTML = "Dit veld mag alleen nummers bevatten!";
                } else {
                    errorField.innerHTML = "Dit veld moet gevult worden!";
                }

                return true;
            }

            if (input.type !== 'number' && input.id != 'lblodid') {
                if (!isOnlyText(value)) {
                    errorField.innerHTML = "Dit veld mag alleen tekst bevatten!";
                    input.classList.add("vl-input-field--error");

                    return true;
                }
            }

            errorField.innerHTML = "";
            input.classList.remove("vl-input-field--error");
        }

        return false;
    }
  
    handleChange(event) {   
        this.setFieldValidation(event.target.id, event.target.value);
        this.setState({[event.target.id]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();

        let errorData = !isNumber(this.state.streetNumber) || !isNumber(this.state.streetNumber);
        let errorMessage = "Er mist data!";
        let fieldValidError;
        for (const [key, value] of Object.entries(this.state)) {
            fieldValidError = this.setFieldValidation(key, value);
            if (!errorData) errorData = fieldValidError; //At the first empty, it will be true whatever 
        }

        let thisObject = this;
        let response;
        //We send WebID to the API
        try {
            response = await fetch('http://api.sep.osoc.be/store', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({
                    "uri": this.props.webId,
                    "lblod_id": this.state.lblodid
                })
            }); 
        } catch (e) {
            alert("Can't access to the database!");
            return false;
        }

        if (response.status != 200 && response.status != 201 && response.status != 400) {
            errorData = true;
            errorMessage = response.statusText;
        }

        let data = await response.json();

        if (!errorData && data.success) {
            let doc = createAppDocument(thisObject.props.appContainer, thisObject.FILE_NAME);
            const formData = doc.addSubject({"identifier": "me"});
            formData.addString(schema.givenName, thisObject.state.firstname);
            formData.addString(schema.familyName, thisObject.state.lastname);
            formData.addString(schema.streetAddress, thisObject.state.street + ", " + thisObject.state.streetNumber);
            formData.addInteger(schema.postalCode, parseInt(thisObject.state.postalCode));
            formData.addString(schema.addressLocality, thisObject.state.locality);
            formData.addString(schema.sameAs, thisObject.state.lblodid);
    
            doc.save([formData]).then(function(e) {
                alert("Uw data is opgeslagen!");
            });
        } else {
            alert(data.message);
        }
    }
  
    render() {
        if (this.state.loaded) {
            return (
                <div id="userForm">
                    <h1 class="vl-title vl-title--h1 vl-title--has-border">Uw informatie:</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div class="vl-grid">
                            <div className="form-group vl-form-col--6-12">
                                <label className="vl-form__label" htmlFor="firstname">Voornaam :</label>
                                <input type="text" id="firstname" className="vl-input-field vl-input-field--block" name="firstname" value={this.state.firstname} onChange={this.handleChange}></input>
                                <p class="vl-form__error" id="input-field-firstname-error"></p>
                            </div>
    
                            <div className="form-group vl-form-col--6-12">
                                <label className="vl-form__label" htmlFor="lastname">Achternaam :</label>
                                <input type="text" id="lastname" className="vl-input-field vl-input-field--block" name="lastname" value={this.state.lastname} onChange={this.handleChange}></input>
                                <p class="vl-form__error" id="input-field-lastname-error"></p>
                            </div>
    
                            <div className="form-group vl-col--12-12--m vl-col--10-12">
                                <label className="vl-form__label" htmlFor="street">Straatnaam :</label>
                                <input type="text" id="street" className="vl-input-field vl-input-field--block" name="street" value={this.state.street} onChange={this.handleChange}></input>
                                <p class="vl-form__error" id="input-field-street-error"></p>
                            </div>
    
                            <div className="form-group vl-col--12-12--m vl-col--2-12">
                                <label className="vl-form__label" htmlFor="streetNumber">Huisnummer :</label>
                                <input type="number" min="1" id="streetNumber" className="vl-input-field vl-input-field--block" name="streetNumber" value={this.state.streetNumber} onChange={this.handleChange}></input>
                                <p class="vl-form__error" id="input-field-streetNumber-error"></p>
                            </div>
    
                            <div className="form-group vl-col--12-12--m vl-col--10-12">
                                <label className="vl-form__label" htmlFor="locality">Gemeente :</label>
                                <input type="text" id="locality" className="vl-input-field vl-input-field--block" name="locality" value={this.state.locality} onChange={this.handleChange}></input>
                                <p class="vl-form__error" id="input-field-locality-error"></p>
                            </div>
    
                            <div className="form-group vl-col--12-12--m vl-col--2-12">
                                <label className="vl-form__label" htmlFor="postalCode">Postcode :</label>
                                <input type="number" min="0" id="postalCode" className="vl-input-field vl-input-field--block" name="postalCode" value={this.state.postalCode} onChange={this.handleChange}></input>
                                <p className="vl-form__error" id="input-field-postalCode-error"></p>
                            </div>

                            <div className="form-group vl-col--12-12">
                                <label className="vl-form__label" htmlFor="lblodid">LBLOD ID :</label>
                                <input type="text" id="lblodid" placeholder="http://data.lblod.info/id/identificatoren/xxx" className="vl-input-field vl-input-field--block" name="lblodid" value={this.state.lblodid} onChange={this.handleChange}></input>
                                <p className="vl-form__error" id="input-field-lblodid-error"></p>
                            </div>
                        </div>

                        <button className="vl-button mt-3">
                            <span className="vl-button__label">Opslaan</span>
                        </button>
                    </form>
                </div>
            );
        } else {
            return (
                <Loading />
            );
        }
    }
}

export default CandidateDataForm;