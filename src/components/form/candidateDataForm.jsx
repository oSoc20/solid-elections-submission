import React, {useEffect} from "react";
import {fetchDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';
import {createAppDocument, listDocuments} from '../../utils/SolidWrapper';
import {isEmpty, isNumber, isOnlyText} from '../../utils/DataValidator';
import Loading from '../alert/loading';
import {fetchGetDb, fetchPostDb} from '../../utils/RequestDatabase';
import ReactTooltip from "react-tooltip";
import { FaInfoCircle } from 'react-icons/fa';

class CandidateDataForm extends React.Component {
    FILE_NAME = "me.ttl";

    constructor(props) {
        super(props);
        this.setDefaultValue();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state.loaded = false;
    }

    init() {
        console.log("Initialising user data...");
        if (this.props.userInfo != null) {
            let streetNumber = this.props.userInfo.address.street.split(', ');
            if (streetNumber.length === 2) {
                this.setState({
                    locality: this.props.userInfo.address.municipality,
                    postalCode: this.props.userInfo.address.postalCode,
                    street: streetNumber[0],
                    streetNumber: streetNumber[1],
                    lblodid: this.props.userInfo.personUri,
                    firstname: this.props.userInfo.name,
                    lastname: this.props.userInfo.familyName,
                    lblodExist: true
                });
            }
        }
        //this.fetchUserData();
    }

    async componentDidMount() { //Trigger when component is created or using route
        this.setDefaultValue();
        this.setState({"loaded": this.props.loaded});

        if (this.props.userInfo != null) {
            await this.init();
        }
    }

    async componentDidUpdate(prevProps, prevStates) { //Trigger when state or props change but not with route, we use it because appContainer is async
        if (this.props.userInfo != prevProps.userInfo) {
            this.setDefaultValue();

            if (this.props.userInfo !== null) {
                await this.setDefaultValue();
                await this.init();
                this.setState({"loaded": this.props.loaded});
            }
        }

        //Just in case the loaded props take times to update
        if (this.props.loaded != prevProps.loaded) {
            this.setState({"loaded": this.props.loaded});
        }
    }

    async setDefaultValue() {
        this.state = {street: '', streetNumber: '', locality: '', postalCode: '', lblodid: '', firstname: '', lastname: '', lblodExist: false};
    }

    //Method use to veriry input and also return if there is an error or not
    setFieldValidation(id, value) { //Return false if there is no error
        let errorField = document.getElementById("input-field-" + id + "-error");
        let input = document.getElementById(id);

        if (errorField != null && input != null) {
            if (input.getAttribute("data-type") != "auto") {

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
        }

        return false;
    }

    //Used when input data is change
    handleChange(event) {
        this.setFieldValidation(event.target.id, event.target.value);
        this.setState({[event.target.id]: event.target.value});
    }

    //Used when submitting data
    async handleSubmit(event) {
        event.preventDefault();

        let errorData = !isNumber(this.state.streetNumber) || !isNumber(this.state.postalCode);
        let errorMessage = "Er mist data!";
        let fieldValidError;
        //We check all state (for "loaded" we go over in the fieldValidation because no input with this ID) if any is empty we put true in errorData
        for (const [key, value] of Object.entries(this.state)) {
            fieldValidError = this.setFieldValidation(key, value);
            if (!errorData) errorData = fieldValidError; //At the first empty, it will be true whatever 
        }

        let response;
        //We check if person ID exist
        if (this.state.lblodid == null || this.state.lblodid == '') {
            return false;
        }
        
        let uri = new URLSearchParams({
            personURI: this.state.lblodid
        });
        response = await fetchGetDb("person", uri);

        if (!response.success) { //If there is an error with fetch
            alert(response.message);
            return false;
        }

        if (response.result.success) { //Result contains result of the request page (in this case, the API)
            if (response.result.result.length == 0) { //because it return an array
                errorData = true;
                errorMessage = "This LBLOD ID doesn't exist!";
            } else {
                this.setState({
                    firstname: response.result.result[0].name.value,
                    lastname: response.result.result[0].familyName.value
                });
            }
        } else { //An error occured with the API, we show the message to the user
            errorData = true;
            errorMessage = response.result.message;
        }

        if (errorData) {
            alert("Fatal error : " + errorMessage);
            return false;
        }

        //We send WebID to the API
        //If any error like : logged in as ... but don't have permission that's because this website is not allowed on the solid pod,
        //for that we have to use the popup.html ON THE SAME server as this app
        response = await fetchPostDb("store", JSON.stringify({
            "uri": this.props.webId,
            "lblod_id": this.state.lblodid
        }));

        if (!response.success) { //If there is an error with fetch
            alert(response.message);
            return false;
        }

        if (!response.result.success) {
            alert(response.result.message);
            return false;
        }

        //response.result.updated = true: Added to the database, false: nothing change

        //We create a new document (if exist, will be override)
        let doc = createAppDocument(this.props.appContainer, this.FILE_NAME);
        //We add a subject
        const formData = doc.addSubject({"identifier": "me"});
        //We add value
        formData.addString(schema.streetAddress, this.state.street + ", " + this.state.streetNumber);
        formData.addInteger(schema.postalCode, parseInt(this.state.postalCode));
        formData.addString(schema.addressLocality, this.state.locality);
        formData.addString(schema.sameAs, this.state.lblodid);
        
        //We add all subject to the document, save it and show a confirmation message
        await doc.save([formData]).then(function(e) {
            alert("Uw data is opgeslagen!");
        });

        this.props.refresh();
    }
  
    render() {
        if (this.state.loaded) {
            return (
                <div id="userForm">
                    <h1 className="vl-title vl-title--h1 vl-title--has-border">Uw informatie:</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div className="vl-grid">
                            <div className="form-group vl-col--12-12">
                                <label className="vl-form__label" htmlFor="lblodid">LBLOD ID :</label>
                                <input type="text" id="lblodid" placeholder="http://data.lblod.info/id/personen/xxx" className="vl-input-field vl-input-field--block" name="lblodid" value={this.state.lblodid} onChange={this.handleChange} disabled={(this.state.lblodExist)}></input>
                                <p className="vl-form__error" id="input-field-lblodid-error"></p>
                            </div>

                            <div className="form-group vl-form-col--6-12">
                                <label className="vl-form__label" htmlFor="firstname">Voornaam : <FaInfoCircle data-tip="Dit veld wordt automatisch aangevuld bij een geldig LBLOD ID." /></label>
                                <input type="text" disabled={true} id="firstname" className="vl-input-field vl-input-field--block" data-type="auto" name="firstname" value={this.state.firstname}></input>
                                <p className="vl-form__error" id="input-field-firstname-error"></p>
                            </div>
    
                            <div className="form-group vl-form-col--6-12">
                                <label className="vl-form__label" htmlFor="lastname">Achternaam :</label>
                                <input type="text" disabled={true} id="lastname" className="vl-input-field vl-input-field--block" data-type="auto" name="lastname" value={this.state.lastname}></input>
                                <p className="vl-form__error" id="input-field-lastname-error"></p>
                            </div>
    
                            <div className="form-group vl-col--12-12--m vl-col--10-12">
                                <label className="vl-form__label" htmlFor="street">Straatnaam :</label>
                                <input type="text" id="street" className="vl-input-field vl-input-field--block" name="street" value={this.state.street} onChange={this.handleChange}></input>
                                <p className="vl-form__error" id="input-field-street-error"></p>
                            </div>
    
                            <div className="form-group vl-col--12-12--m vl-col--2-12">
                                <label className="vl-form__label" htmlFor="streetNumber">Huisnummer :</label>
                                <input type="number" min="1" id="streetNumber" className="vl-input-field vl-input-field--block" name="streetNumber" value={this.state.streetNumber} onChange={this.handleChange}></input>
                                <p className="vl-form__error" id="input-field-streetNumber-error"></p>
                            </div>
    
                            <div className="form-group vl-col--12-12--m vl-col--10-12">
                                <label className="vl-form__label" htmlFor="locality">Gemeente :</label>
                                <input type="text" id="locality" className="vl-input-field vl-input-field--block" name="locality" value={this.state.locality} onChange={this.handleChange}></input>
                                <p className="vl-form__error" id="input-field-locality-error"></p>
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
                    <ReactTooltip />
                </div>
            );
        } else {
            return (
                //Show when appContainer is still null or undefined (use in init() from componentDidMount() and componentDidUpdate())
                //We need the appContainer to fetch data from the solid pod or API
                <Loading />
            );
        }
    }
}

export default CandidateDataForm;