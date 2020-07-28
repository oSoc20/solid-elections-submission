import React from "react";
import {fetchDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';
import {createAppDocument, listDocuments, createExpense, createDonation} from '../../utils/SolidWrapper';
import {isEmpty, isNumber, isOnlyText} from '../../utils/DataValidator';
import Loading from '../alert/loading';
import ProfileDoesntExist from '../alert/profileDoesntExist';
import PersonInput from './user';
import InputAmount from '../form/inputAmount';
import { Redirect } from 'react-router-dom';
import {fetchGetDb} from '../../utils/RequestDatabase';
import ReactTooltip from "react-tooltip";
import { FaInfoCircle } from 'react-icons/fa';

class G103 extends React.Component {
    FILE_NAME_PROFILE = "me.ttl";
    FILE_NAME = "g103.ttl";

    constructor(props) {
        super(props);
        this.setDefaultValue();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRadioShowOnYes = this.handleRadioShowOnYes.bind(this);
        this.handleExpenses = this.handleExpenses.bind(this);
        this.handleFunds = this.handleFunds.bind(this);
        this.handleAuthorizedPerson = this.handleAuthorizedPerson.bind(this);
        this.state.loaded = false;
        this.state.error = true;
        this.state.redirect = false;
    }

    componentDidMount() {
        if (this.props.appContainer !== undefined) {
            this.init();
        }
    }

    componentDidUpdate(prevProps) { //Trigger when state or props change but not with route, we use it because appContainer is async
        if (this.props.appContainer !== undefined && this.props.appContainer != prevProps.appContainer) {
            this.init();
        }
    }

    async init() {
        this.profileExist().then(value => {
            //Not updated after creating profile, maybe because appContainer must be redefined
            this.setState({"error": !value});
        })

        //state.profile contains profile link (WebID + FILE_NAME_PROFILE.ttl)
        if (this.state.profile != null) {
            let userDataDoc = await fetchDocument(this.state.profile);
            if (userDataDoc != null) {
                let userData = userDataDoc.getSubject("#me");
                if (userData != null) {
                    let response;
                    let uri = new URLSearchParams({
                        personURI: userData.getString(schema.sameAs)
                    });
                    //We ask for the person LBLOD ID
                    response = await fetchGetDb("person", uri);
            
                    //If there is an error with fetch
                    if (!response.success) {
                        alert(response.message);
                        return false;
                    }

                    //We loaded the page now because after we change some elements
                    this.setState({"loaded": true});
            
                    //If result of the API succeed or not
                    if (response.result.success) {
                        //We show to the user the name of the list and tracking number (disabled)
                        //result.result is the result of the API into result object, it's an array of people
                        //In fact, we send an unique ID so if there is someone he is the index 0
                        let gNameList = document.getElementById("Gnamelist");
                        let gTrackingNumber = document.getElementById("Gtrackingnumber");
                        if (response.result.result.length > 0) {
                            if (gNameList != null) gNameList.value = response.result.result[0].listName.value;
                            if (gTrackingNumber != null) gTrackingNumber.value = response.result.result[0].trackingNb.value;
                        } else {
                            if (gNameList != null) gNameList.value = "Error";
                            if (gTrackingNumber != null) gTrackingNumber.value = "Error";
                        }
                    } else {
                        alert(response.result.message);
                    }
                }
            }
        }
    }

    //To get the profile link (WebID + FILE_NAME_PROFILE.ttl)
    async profileExist() {
        let documents = listDocuments(this.props.appContainer);
        let userDataLink = documents.find(link => {
            let indexFile = link.lastIndexOf('/');
            let file = link.substr(indexFile + 1);

            return file == this.FILE_NAME_PROFILE;
        });

        //We store profile (webId) because we have to send it to the API (stored if the user doesn't exist before)
        this.state.profile = userDataLink;
        return userDataLink != null;
    }

    async setDefaultValue() {
        this.state = {
            GAuthPerson: 'no', 
            GElectionExpense: 'no', 
            //AuthorizedPerson
            authorizedPerson: { //Empty because we need to check if any is empty when submitting
                Gfirstname: '', 
                Glastname: '', 
                Gstreet: '', 
                GstreetNumber: '', 
                GpostalCode: '', 
                Glocality: ''
            },
            expenses: { //If help exist, it will be a popup with "?" logo, we make popup with hover and clickable to let you choose
                EAuditoryAndOral1: { key: '1.1', description: 'Auditory and oral messages', amount: 0, help: "Bijvoorbeeld: non-commerciele telefoon campanges of auditieve politieke berichten op informatie dragers" },
                EWrittenMessage1_1: { key: '2.1.1', description: 'Written messages - Design and production costs in the press', amount: 0 },
                EWrittenMessage1_2: { key: '2.1.2', description: 'Written messages - Price for the advertising space in the press', amount: 0 },
                EWrittenMessage2: { key: '2.2', description: 'Written messages - Design and production costs of election brochures', amount: 0 },
                EWrittenMessage3: { key: '2.3', description: 'Written messages - Cost of letters and envelopes', amount: 0 },
                EWrittenMessage4: { key: '2.4', description: 'Written messages - Cost of other printed matter', amount: 0 },
                EWrittenMessage5: { key: '2.5', description: 'Written messages - Costs for e-mails and non-commercial SMS campaigns', amount: 0 },
                EShippingAndDistribution1_1: { key: '3.1.1', description: 'Shipping and distribution - Addressed shipments in election printing', amount: 0 },
                EShippingAndDistribution1_2: { key: '3.1.2', description: 'Shipping and distribution - Non-addressed shipments in election printing', amount: 0 },
                EShippingAndDistribution2: { key: '3.2', description: 'Shipping and distribution - Other costs of distribution', amount: 0 },
                EShippingAndDistribution3: { key: '3.3', description: 'Shipping and distribution - Costs for e-mails and non-commercial SMS campaigns', amount: 0},
                EVisualMessage1: { key: '4.1', description: 'Visual messages - A production and rental costs for non-commercial signs of 4 m² or less', amount: 0, help: "De huur of productie kosten van non-commerciële borden kleiner dan 4 m². Deze kosten kunnen verspreid worden over drie verkiezingen waar de partij aan meedoet waarbij minimaal een derde van de kost per verkiezing wordt toegeschreven. Huurprijzen moeten daarintegen volledig worden weergegeven." },
                EVisualMessage2: { key: '4.2', description: 'Visual messages - Printing and production costs for posters of 4 m² or less', amount: 0 },
                EVisualMessage3: { key: '4.3', description: 'Visual messages - Internet commercials or internet campaigns', amount: 0 },
                EVisualMessage4: { key: '4.4', description: 'Visual messages - Other costs for visual messages', amount: 0 },
                EOtherCost1: { key: '5.1', description: 'Other costs - Election manifestations', amount: 0 },
                EOtherCost2: { key: '5.2', description: 'Other costs - Production costs for website or webpage designed for election purposes', amount: 0 },
                EOtherCost3: { key: '5.3', description: 'Other costs - Varia', amount: 0 }
            },
            funds: { //If help exist, it will be a popup with "?" logo, we make popup with hover and clickable to let you choose
                FSection1: { key: '1.1', description: 'Funds deriving from the list\'s own patrimony', amount: 0 },
                FSection2_1: { key: '2.1.1', description: 'Donations of EUR 125 or more per donor', amount: 0 },
                FSection2_2: { key: '2.1.2', description: 'Donations of less than €125 per donor', amount: 0 },
                FSection3_1: { key: '3.1.1', description: 'Sponsorship of EUR 125 or more per sponsor', amount: 0 },
                FSection3_2: { key: '3.1.2', description: 'Sponsorship of less than EUR 125 per sponsor', amount: 0 },
                FSection4: { key: '4.1', description: 'Financing by (a component of) the political party', amount: 0 },
                FSection5: { key: '5.1', description: 'Other source', amount: 0 },
            }
        };
    }

    getTotalExpense() {
        let total = 0;
        for (const [key, value] of Object.entries(this.state.expenses)) {
            if (isNumber(value.amount)) { //IF there isn't an error with the field (not a number or empty), if there is we go over because else it will be bugged because number will be string and 13 + 0 + 0 = 1300€ 
                total += value.amount;
            }
        }

        return total;
    }

    getTotalFunds() {
        let total = 0;
        for (const [key, value] of Object.entries(this.state.funds)) {
            if (isNumber(value.amount)) { //IF there isn't an error with the field (not a number or empty), if there is we go over because else it will be bugged because number will be string and 13 + 0 + 0 = 1300€ 
                total += value.amount;
            }
        }

        return total;
    }

    //Method use to veriry input and also return if there is an error or not
    setFieldValidation(id, value) { //Use to update field if he is empty | Return false if there is no error
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

                return true;
            } else {
                if (input.type !== 'number') {
                    if (!isOnlyText(value)) {
                        errorField.innerHTML = "This field must be text!";
                        input.classList.add("vl-input-field--error");

                        return true;
                    }
                }
            }

            errorField.innerHTML = "";
            input.classList.remove("vl-input-field--error");
        }

        return false;
    }

    //Used when input data is change
    handleChange(event) { //Use for data
        this.setFieldValidation(event.target.id, event.target.value);
        let value = event.target.value;
        if (isNumber(value)) {
            value = parseInt(value);
        }

        this.setState({[event.target.name]: value});
    }

    //Used when data of the authorized person is update (because is into state.authorizedPerson{})
    handleAuthorizedPerson(event) { //Use for authorized person section, because this is a custom state object
        event.persist();
        this.setFieldValidation(event.target.id, event.target.value);
        let value = event.target.value;
        if (isNumber(value)) {
            value = parseInt(value);
        }

        this.setState(state => {
            let authorizedPersonData = state.authorizedPerson;
            authorizedPersonData[event.target.name] = value;

            return {
                authorizedPerson: authorizedPersonData
            };
        });
    }

    //Used when data of the expenses is update (because is into state.expenses{})
    handleExpenses(event) { //Use for expenses section, because this is a custom state object
        event.persist();
        this.setFieldValidation(event.target.id, event.target.value);
        let value = event.target.value;
        if (isNumber(value)) {
            value = parseFloat(value);
        }

        this.setState(state => {
            let expensesData = state.expenses;
            expensesData[event.target.name].amount = value;

            return {
                expenses: expensesData
            };
        });
    }

    //Used when data of the funds is update (because is into state.funds{})
    handleFunds(event) { //Use for funds section, because this is a custom state object with particullar "if" statement
        event.persist();
        this.setFieldValidation(event.target.id, event.target.value);
        let value = event.target.value;
        if (isNumber(value)) {
            value = parseFloat(value);
        }

        if (value >= 125) {
            let section = document.getElementById("input-field-" + event.target.id + "-error");
            section.innerHTML = "Let op, dit bedrag is hoger dan €125. Vul daarom ook formulier G106 in.";
        }

        this.setState(state => {
            let fundsData = state.funds;
            fundsData[event.target.name].amount = value;

            return {
                funds: fundsData
            };
        });
    }
 
    //Used when radio button are change, ...ids is use to hide and show section of the form
    handleRadioShowOnYes(event, ...ids) { //Use for radio button to hide and show custom part depending on the choice
        this.handleChange(event);
        let section;
        if (event.target.value === 'yes') {
            ids.forEach(value => {
                section = document.getElementById(value);
                if (section != null) section.classList.remove("vl-u-hidden");
            });
        } else {
            ids.forEach(value => {
                section = document.getElementById(value);
                if (section != null) section.classList.add("vl-u-hidden");
            });
        }
    }

    //Used when submitting data
    handleSubmit(event) {
        event.preventDefault();

        if (this.props.appContainer != undefined) {
            let dataToSave = [];
            //Create a new document
            let doc = createAppDocument(this.props.appContainer, this.FILE_NAME);

            //If authorized person is true we added all these data into a new subject
            if (this.state.GAuthPerson === 'yes') { //Authorized person so we check his data
                let errorData = false;
                let fieldValidError;
                //Check if there is any error
                for (const [key, value] of Object.entries(this.state.authorizedPerson)) {
                    fieldValidError = this.setFieldValidation(key, value);
                    if (!errorData) errorData = fieldValidError; //At the first empty, it will be true whatever 
                }

                if (errorData) {
                    alert("Geen geautoriseerde personen gevonden");
                    return false;
                }

                //Add a new subject
                let authorizedPersonData = doc.addSubject({"identifier": "authorizedPerson"});
                authorizedPersonData.addString(schema.givenName, this.state.authorizedPerson.Gfirstname);
                authorizedPersonData.addString(schema.familyName, this.state.authorizedPerson.Glastname);
                authorizedPersonData.addString(schema.streetAddress, this.state.authorizedPerson.Gstreet + ", " + this.state.authorizedPerson.GstreetNumber);
                authorizedPersonData.addInteger(schema.postalCode, parseInt(this.state.authorizedPerson.GpostalCode));
                authorizedPersonData.addString(schema.addressLocality, this.state.authorizedPerson.Glocality);

                //We add this subject to the list of subjetcs who will be save
                dataToSave.push(authorizedPersonData);
            }
            //Uncomment to save only if the user say yes, without condition it will be 0 by default even if the user answer "no" to the expence
            //if (this.state.GElectionExpense === 'yes') { //Incur election expenses
                let error = false;
                //Check if there is any error
                for (const [key, value] of Object.entries(this.state.expenses)) {
                    if (error) {
                        alert("Geen gedeclareerde uitgaven");
                        return false;
                    }
                    error = isEmpty(value.amount);
                }

                let buyActionData;
                let amountChecked;
                //Loop for each expenses data and create a new subject
                for (const [key, value] of Object.entries(this.state.expenses)) {
                    //We make that because setState is asynchronous
                    if (this.state.GElectionExpense === 'no') { //Because user can say "yes", complete form and finally say "no" and data will be save through, so we force to be 0 without formatting
                        amountChecked = 0;
                    } else {
                        amountChecked = value.amount;
                    }

                    buyActionData = {
                        identifier: value.key,
                        description: value.description,
                        price: parseFloat(amountChecked),
                        priceCurrency: 'EUR'
                    }

                    //We add this new subject (new expense) to the list who will be save, 1 subject = 1 expense
                    dataToSave.push(createExpense(doc, this.state.profile, buyActionData));
                }

                //Same as expences but for funds
                for (const [key, value] of Object.entries(this.state.funds)) {
                    if (error) {
                        alert("Funds are empty");
                        return false;
                    }
                    error = isEmpty(value.amount);
                }
                
                let donateActionData;
                for (const [key, value] of Object.entries(this.state.funds)) {
                    //We make that because setState is asynchronous
                    if (this.state.GElectionExpense === 'no') {
                        amountChecked = 0;
                    } else {
                        amountChecked = value.amount;
                    }

                    donateActionData = {
                        identifier: value.key,
                        description: value.description,
                        price: parseFloat(amountChecked),
                        priceCurrency: 'EUR'
                    }

                    dataToSave.push(createDonation(doc, this.state.profile, donateActionData));
                }
            //}

            //We use thisOject because this is not in the scope of the .then function
            let thisObject = this;
            doc.save(dataToSave).then(function(e) {
                //alert("Uw data is opgeslagen!");
                //Redirect to the home page
                //With setting up redirect state, the component will update and show a success message
                thisObject.setState({redirect: true});
            });
        } else {
            alert("Er is geen toegang tot uw Solid pod.");
        }
    }

    //Method to be call in the render to check if we have to redirect
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/formSent' />
        }
    }
  
    render() {
        if (this.state.loaded) {
            if (this.state.error) {
                return (
                    <ProfileDoesntExist />
                );
            } else {
                return ( //<ReactTooltip /> must be there one time to let the component know that it has to find tooltip to show
                    <div id="userForm">
                        {this.renderRedirect()}
                        <h1 className="vl-title vl-title--h1 vl-title--has-border">Aangifte van de verkiezingsuitgaven en van de herkomst van de geldmiddelen door lijsten</h1>
                        <form onSubmit={this.handleSubmit}>
                            <h2 className="vl-title vl-title--h2 vl-title--has-border">Algemeen</h2>

                            <div className="vl-grid">
                                <div className="form-group vl-form-col--8-12">
                                    <label className="vl-form__label" htmlFor="Gnamelist">Lijstnaam :</label>
                                    <input type="text" id="Gnamelist" disabled={true} className="vl-input-field vl-input-field--block" name="Gnamelist"></input>
                                    <p className="vl-form__error" id="input-field-Gnamelist-error"></p>
                                </div>
        
                                <div className="form-group vl-form-col--4-12">
                                    <label className="vl-form__label" htmlFor="Gtrackingnumber">Volgnummer :</label>
                                    <input type="number" min="0" disabled={true} id="Gtrackingnumber" className="vl-input-field vl-input-field--block" name="Gtrackingnumber"></input>
                                    <p className="vl-form__error" id="input-field-Gtrackingnumber-error"></p>
                                </div>

                                <p>Bent u een persoon die in naam van de desbetreffende lijsttrekker dit formulier invult en daartoe gemachtigd is?</p>
                                <div className="form-group vl-form-col--12-12">
                                    <label className="vl-radio" htmlFor="GAuthPersonYes">
                                        <input className="vl-radio__toggle" type="radio" id="GAuthPersonYes" name="GAuthPerson" value="yes" onChange={(e) => this.handleRadioShowOnYes(e, "sectionAuthorized")} checked={this.state.GAuthPerson === 'yes'} />
                                        <div className="vl-radio__label">Ja</div>
                                    </label>
                                    <label className="vl-radio" htmlFor="GAuthPersonNo">
                                        <input className="vl-radio__toggle" type="radio" id="GAuthPersonNo" name="GAuthPerson" value="no" onChange={(e) => this.handleRadioShowOnYes(e, "sectionAuthorized")} checked={this.state.GAuthPerson === 'no'} />
                                        <div className="vl-radio__label">Nee</div>
                                    </label>
                                </div>

                                <div id="sectionAuthorized" className="form-group vl-form-col--12-12 vl-u-hidden">
                                    <PersonInput prefix="G" handleChange={this.handleAuthorizedPerson} />
                                </div>

                                <p>Heeft de lijst waarvan u de lijsttrekker bent, voor de verkiezingen van 14 oktober 2018 verkiezingsuitgaven gedaan? </p>
                                <div className="form-group vl-form-col--12-12">
                                    <label className="vl-radio" htmlFor="GElectionExpenseYes">
                                        <input className="vl-radio__toggle" type="radio" id="GElectionExpenseYes" name="GElectionExpense" value="yes" onChange={(e) => this.handleRadioShowOnYes(e, "sectionElectionExpenditure", "sectionOriginOfFund")} checked={this.state.GElectionExpense === 'yes'} />
                                        <div className="vl-radio__label">Ja</div>
                                    </label>
                                    <label className="vl-radio" htmlFor="GElectionExpenseNo">
                                        <input className="vl-radio__toggle" type="radio" id="GElectionExpenseNo" name="GElectionExpense" value="no" onChange={(e) => this.handleRadioShowOnYes(e, "sectionElectionExpenditure", "sectionOriginOfFund")} checked={this.state.GElectionExpense === 'no'} />
                                        <div className="vl-radio__label">Nee</div>
                                    </label>
                                </div>
                            </div>

                            <div id="sectionElectionExpenditure" className="vl-u-hidden">
                                <h2 className="vl-title vl-title--h2 vl-title--has-border">Aangifte van de verkiezingsuitgaven</h2>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Auditieve en mondelinge boodschappen</h3>
                                <div className="vl-grid">
                                    <div className="form-group">
                                        <InputAmount
                                            var="EAuditoryAndOral1"
                                            label="Bijvoorbeeld: niet-commerciële telefooncampagnes of een onuitwisbare politieke boodschap op een informatiedrager. Voeg een lijst van alle boodschappen en hun respectieve kostprijs bij uw aangifte."
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EAuditoryAndOral1.amount}
                                            help={this.state.expenses.EAuditoryAndOral1.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Geschreven boodschappen</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage1_1"
                                            label="Ontwerp- en productiekosten van advertenties in de pers:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage1_1.amount}
                                            help={this.state.expenses.EWrittenMessage1_1.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage1_2"
                                            label="Prijs voor advertentieruimte in de pers:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage1_2.amount}
                                            help={this.state.expenses.EWrittenMessage1_2.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage2"
                                            label="Ontwerp- en productiekosten van verkiezingsfolders:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage2.amount}
                                            help={this.state.expenses.EWrittenMessage2.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage3"
                                            label="Kostprijs van brieven en enveloppen:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage3.amount}
                                            help={this.state.expenses.EWrittenMessage3.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage4"
                                            label="Kostprijs van ander drukwerk:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage4.amount}
                                            help={this.state.expenses.EWrittenMessage4.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage5"
                                            label="Kosten voor e-mails en niet-commerciële sms-campages:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage5.amount}
                                            help={this.state.expenses.EWrittenMessage5.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Verzendings- en distributiekosten voor verkiezingspropaganda</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution1_1"
                                            label="Geadresseerde zendingen:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution1_1.amount}
                                            help={this.state.expenses.EShippingAndDistribution1_1.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution1_2"
                                            label="Niet-geaddresseerde:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution1_2.amount}
                                            help={this.state.expenses.EShippingAndDistribution1_2.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution2"
                                            label="Portkosten voor andere zendingen:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution2.amount}
                                            help={this.state.expenses.EShippingAndDistribution2.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution3"
                                            label="Andere distributie kosten:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution3.amount}
                                            help={this.state.expenses.EShippingAndDistribution3.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Visuele boodschappen</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage1"
                                            label="Productie- en huurkosten voor niet-commerciële borden van 4 m² of minder:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage1.amount}
                                            help={this.state.expenses.EVisualMessage1.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage2"
                                            label="Druk- en productiekosten voor affiches van 4 m² of minder:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage2.amount}
                                            help={this.state.expenses.EVisualMessage2.help}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage3"
                                            label="Reclamespots op het internet of internetcampagnes:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage3.amount}
                                            help={this.state.expenses.EVisualMessage3.help}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage4"
                                            label="Andere kosten voor visuele boodschappen:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage4.amount}
                                            help={this.state.expenses.EVisualMessage4.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Overige uitgaven</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost1"
                                            label="Verkiezingsmanifestaties:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EOtherCost1.amount}
                                            help={this.state.expenses.EOtherCost1.help}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost2"
                                            label="Productiekosten voor website of webpagina, ontworpen met verkiezingsdoeleinden:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EOtherCost2.amount}
                                            help={this.state.expenses.EOtherCost2.help}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost3"
                                            label="Varia:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EOtherCost3.amount}
                                            help={this.state.expenses.EOtherCost3.help}
                                        />
                                    </div>
                                </div>

                                <p className="total-text mb-5">Totaalbedrag: {this.getTotalExpense().toLocaleString()}€</p>
                            </div>

                            <div id="sectionOriginOfFund" className="vl-u-hidden">
                                <h2 className="vl-title vl-title--h2 vl-title--has-border">Aangifte van de herkomst van de geldmiddelen :</h2>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Rubriek 1</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection1"
                                            label="Geldmiddelen die afkomstig zijn van het eigen patrimonium van de lijst :"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection1.amount}
                                            help={this.state.funds.FSection1.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Rubriek 2 <FaInfoCircle data-tip="Donaties van reguliere personen boven de 125 euro per donateur." /></h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection2_1"
                                            label="Giften van 125 euro of meer per schenker:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection2_1.amount}
                                            help={this.state.funds.FSection2_1.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection2_2"
                                            label="Giften van minder dan 125 euro per schenker:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection2_2.amount}
                                            help={this.state.funds.FSection2_2.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Rubriek 3 <FaInfoCircle data-tip="Buget afkomstig van sponsoren in bedragen hoger dan 125 per sponsor." /></h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection3_1"
                                            label="Bedragen van 125 euro of meer per sponsor:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection3_1.amount}
                                            help={this.state.funds.FSection3_1.help}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection3_2"
                                            label="Bedragen van minder dan 125 euro per sponsor:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection3_2.amount}
                                            help={this.state.funds.FSection3_2.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Rubriek 4</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection4"
                                            label="Financiering door (een component van) de politieke partij :"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection4.amount}
                                            help={this.state.funds.FSection4.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Rubriek 5</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection5"
                                            label="Andere herkomst:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection5.amount}
                                            help={this.state.funds.FSection5.help}
                                        />
                                    </div>
                                </div>

                                <p class="total-text">Totaalbedrag: {this.getTotalFunds().toLocaleString()}€</p>
                            </div>
        
                            <button className="vl-button mt-5">
                                <span className="vl-button__label">Onderteken en verstuur</span>
                            </button>
                        </form>
                        <ReactTooltip />
                    </div>
                );
            }
        } else {
            return (
                //Show when appContainer is still null or undefined (use in init() from componentDidMount() and componentDidUpdate())
                //We need the appContainer to fetch data from the solid pod or API
                <Loading />
            );
        }
    }
}

export default G103;