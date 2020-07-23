import React from "react";
import {fetchDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';
import {createAppDocument, listDocuments} from '../../utils/SolidWrapper';
import {isEmpty, isNumber} from '../../utils/DataValidator';
import Loading from '../loading';

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
        this.state = {firstname: '', lastname: '', street: '', streetNumber: '', locality: '', postalCode: ''};
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
                        postalCode: userData.getInteger(schema.postalCode)
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

    setFieldValidation(id, value) {
        let errorField = document.getElementById("input-field-" + id + "-error");
        let input = document.getElementById(id);

        if (errorField != null && input != null) {
            if (isEmpty(value)) {
                input.classList.add("vl-input-field--error");

                if (input.type === 'number') {
                    errorField.innerHTML = "Dit veld moet met een nummer gevult worden!";
                } else {
                    errorField.innerHTML = "Dit veld moet gevult worden!";
                }
            } else {
                errorField.innerHTML = "";
                input.classList.remove("vl-input-field--error");
            }
        }
    }
  
    handleChange(event) {   
        this.setFieldValidation(event.target.id, event.target.value);
        this.setState({[event.target.id]: event.target.value});
    }

    handleSubmit(event) {
        let errorData = !isNumber(this.state.streetNumber) || !isNumber(this.state.streetNumber);
        for (const [key, value] of Object.entries(this.state)) {
            if (!errorData) errorData = isEmpty(value); //At the first empty, it will be true whatever 
            this.setFieldValidation(key, value);
        }
        
        if (!errorData) {
            let doc = createAppDocument(this.props.appContainer, this.FILE_NAME);
            const formData = doc.addSubject({"identifier": "me"});
            formData.addString(schema.givenName, this.state.firstname);
            formData.addString(schema.familyName, this.state.lastname);
            formData.addString(schema.streetAddress, this.state.street + ", " + this.state.streetNumber);
            formData.addInteger(schema.postalCode, parseInt(this.state.postalCode));
            formData.addString(schema.addressLocality, this.state.locality);
    
            doc.save([formData]).then(function(e) {
                alert("Uw data is opgeslagen!");
            });
        } else {
            alert("Er mist data!");
        }
        event.preventDefault();
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