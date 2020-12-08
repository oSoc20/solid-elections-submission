import React, {useState, useEffect} from "react";
import {schema} from 'rdf-namespaces';
import {createAppDocument} from '../../utils/SolidWrapper';
import {isEmpty, isNumber, isOnlyText} from '../../utils/DataValidator';
import Loading from '../alert/loading';
import {fetchGetDb, fetchPostDb} from '../../utils/RequestDatabase';
import ReactTooltip from "react-tooltip";
import { FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function CandidateDataForm(props) {

    const { t } = useTranslation(["form", "alert"]);
    const FILE_NAME = "me.ttl";

    const [loaded, setLoadedState] = useState(props.loaded);
    const [lblodId, setLblodId] = useState('');
    const [lblodIdExists, setLblodIdExistence] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [municipality, setMunicipality] = useState('');
    const [postalCode, setPostalCode] = useState(2330);

    useEffect(() => {
        setLoadedState(props.loaded);
    })

    useEffect(() => {
        let info = props.userInfo
        if (info != null) {
            setLblodId(info.personUri);
            setLblodIdExistence(true);
            setFirstName(info.name);
            setLastName(info.familyName);
            setMunicipality(info.address.municipality);
            setPostalCode(info.address.postalCode);
        } 
    }, [loaded]);

    const handleFormChange = (event) => {
        const target = event.target;
        validateChange(target.id, target.value);
        updateState(target.id, target.value);
    };

    const validateChange = (id, value) => {

        let errorField = document.getElementById("input-field-" + id + "-error");
        let input = document.getElementById(id);

        if (errorField != null && input != null) {
            if (input.getAttribute("data-type") != "auto") {

                if (isEmpty(value)) {
                    input.classList.add("vl-input-field--error");
    
                    if (input.type === 'number') {
                        errorField.innerHTML = t('This field can only contain numbers') + "!";
                    } else {
                        errorField.innerHTML = t('This field should be filled in') + "!";
                    }
    
                    return true;
                }
    
                if (input.type !== 'number' && input.id != 'lblodid') {
                    if (!isOnlyText(value)) {
                        errorField.innerHTML = t('This field can only contain text') + "!";
                        input.classList.add("vl-input-field--error");
    
                        return true;
                    }
                }
    
                errorField.innerHTML = "";
                input.classList.remove("vl-input-field--error");
            }
        }

        return false;
    };

    const updateState = (id, value) => {

        if (id == 'lblodId') {
            setLblodId(value);
        }

        if (id == 'municipality') {
            setMunicipality(value);
        }

        if (id == 'postalCode') {
            setPostalCode(value);
        }
    };

    const handleFormSubmit = async function(event) {
        event.preventDefault();

        let errorData = !isNumber(postalCode);
        let errorMessage = "Er mist data!";

        if (!lblodIdExists) {
            errorData = errorData || validateChange('lblodId', lblodId);
        }
        errorData = errorData
                    || validateChange('municipality', municipality)
                    || validateChange('postalCode', postalCode);

        let response;
        //We check if person ID exist
        if (lblodId == null || lblodId == '') {
            return false;
        }
        
        let uri = new URLSearchParams({
            personURI: lblodId
        });
        response = await fetchGetDb("person", uri);

        if (!response.success) { //If there is an error with fetch
            alert(response.message);
            return false;
        }

        if (response.result.success) { //Result contains result of the request page (in this case, the API)
            if (response.result.result.length == 0) { //because it returns an array
                errorData = true;
                errorMessage = "This LBLOD ID doesn't exist!";
            } else {
                setFirstName(response.result.result[0].name.value);
                setLastName(response.result.result[0].familyName.value);
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
            "uri": props.webId,
            "lblod_id": lblodId
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
        let doc = createAppDocument(props.appContainer, FILE_NAME);
        //We add a subject
        const formData = doc.addSubject({"identifier": "me"});
        //We add value
        formData.addInteger(schema.postalCode, parseInt(postalCode));
        formData.addString(schema.addressLocality, municipality);
        formData.addString(schema.sameAs, lblodId);
        
        //We add all subject to the document, save it and show a confirmation message
        try {
            let savedDocument = await doc.save([formData]);
            alert(t('alert:Your data has been saved') + "!");
        } catch (e) {
            console.log(e);
        }
        // await doc.save([formData]).then(function(e) {
        //     alert(t('alert:Your data has been saved') + "!");
        // });

        props.refresh();
    };


    if (loaded) {
        return (
            <div id="userForm">
                <h1 className="vl-title vl-title--h1 vl-title--has-border">
                    {t('Your information')}:
                </h1>
                <form onSubmit={handleFormSubmit}>
                    <div className="vl-grid">
                        <div className="form-group vl-col--12-12">
                             <label className="vl-form__label" htmlFor="lblodid">
                                LBLOD ID:
                            </label>
                            <input
                            type="text" 
                            id="lblodId" 
                            placeholder="http://data.lblod.info/id/personen/xxx" 
                            className="vl-input-field vl-input-field--block" 
                            name="lblodId" 
                            value={lblodId} 
                            onChange={handleFormChange} 
                            disabled={lblodIdExists}></input>
                            <p className="vl-form__error" id="input-field-lblodId-error"></p>
                        </div>
                        <div className="form-group vl-form-col--6-12">
                            <label className="vl-form__label" htmlFor="firstname">
                                {t('First name')}:  
                                <FaInfoCircle 
                                data-tip= {t('This field will be auto-completed when entering a valid LBLOD ID') + "."} />
                                </label>
                            <input 
                            type="text" 
                            disabled={true} 
                            id="firstname" 
                            className="vl-input-field vl-input-field--block" 
                            data-type="auto" 
                            name="firstname" 
                            value={firstName}>
                            </input>
                            <p className="vl-form__error" id="input-field-firstname-error"></p>
                        </div>

                        <div className="form-group vl-form-col--6-12">
                            <label className="vl-form__label" htmlFor="lastname">
                                {t('Last name')}:
                                <FaInfoCircle 
                                data-tip= {t('This field will be auto-completed when entering a valid LBLOD ID') + "."} />
                            </label>
                            <input
                            type="text" 
                            disabled={true} 
                            id="lastname" 
                            className="vl-input-field vl-input-field--block" 
                            data-type="auto" 
                            name="lastname" 
                            value={lastName}></input>
                            <p className="vl-form__error" id="input-field-lastname-error"></p>
                        </div>

                        <div className="form-group vl-col--12-12--m vl-col--10-12">
                            <label className="vl-form__label" htmlFor="locality">
                                {t('Municipality')}:
                            </label>
                            <input  
                            type="text" 
                            id="municipality" 
                            className="vl-input-field vl-input-field--block" 
                            name="municipality" 
                            value={municipality} 
                            onChange={handleFormChange}></input>
                            <p className="vl-form__error" id="input-field-municipality-error"></p>
                        </div>

                        <div className="form-group vl-col--12-12--m vl-col--2-12">
                            <label className="vl-form__label" htmlFor="postalCode">
                                {t('Postal code')}:
                            </label>
                            <input  
                            type="number" 
                            min="0" 
                            id="postalCode" 
                            className="vl-input-field vl-input-field--block" 
                            name="postalCode" 
                            value={postalCode} 
                            onChange={handleFormChange}></input>
                            <p className="vl-form__error" id="input-field-postalCode-error"></p>
                        </div>
                    </div>

                    <button className="vl-button mt-3">
                        <span className="vl-button__label">{t('Save')}</span>
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
};