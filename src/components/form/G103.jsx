import React from "react";
import {fetchDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';
import {createAppDocument, listDocuments, createExpense, createDonation} from '../../utils/SolidWrapper';
import {isEmpty, isNumber, isOnlyText} from '../../utils/DataValidator';
import Loading from '../alert/loading';
import ProfileDoesntExist from '../alert/profileDoesntExist';
import PersonInput from './user';
import InputAmount from '../form/inputAmount';
import { Redirect } from 'react-router-dom'

class G103 extends React.Component {
    FILE_NAME_PROFILE = "me.ttl";
    FILE_NAME = "g103-test.ttl";

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
        this.setState({"loaded": true});
        this.profileExist().then(value => {
            this.setState({"error": !value});
        })

        if (this.state.profile != null) {
            let userDataDoc = await fetchDocument(this.state.profile);
            if (userDataDoc != null) {
                let userData = userDataDoc.getSubject("#me");
                if (userData != null) {
                    //Can be use to fetch name of the list and tracking number
                    //alert(userData.getString(schema.givenName) + " " + userData.getString(schema.familyName));
                }
            }
        }
    }

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
            expenses: {
                EAuditoryAndOral1: { key: '1.1', description: 'Auditory and oral messages', amount: 0 },
                EWrittenMessage1_1: { key: '2.1.1', description: 'Written messages - Design and production costs in the press', amount: 0 },
                EWrittenMessage1_2: { key: '2.1.2', description: 'Written messages - Price for the advertising space in the press', amount: 0 },
                EWrittenMessage2: { key: '2.2', description: 'Written messages - Design and production costs of election brochures', amount: 0 },
                EWrittenMessage3: { key: '2.3', description: 'Written messages - Cost of letters and envelopes', amount: 0 },
                EWrittenMessage4: { key: '2.4', description: 'Written messages - Cost of other printed matter', amount: 0 },
                EWrittenMessage5: { key: '2.5', description: 'Written messages - Costs for e-mails and non-commercial SMS campaigns', amount: 0 },
                EShippingAndDistribution1_1: { key: '3.1.1', description: 'Shipping and distribution - Addressed shipments in election printing', amount: 0 },
                EShippingAndDistribution1_2: { key: '3.1.2', description: 'Shipping and distribution - Non-addressed shipments in election printing', amount: 0 },
                EShippingAndDistribution2: { key: '3.2', description: 'Shipping and distribution - Other costs of distribution', amount: 0 },
                EShippingAndDistribution3: { key: '3.3', description: 'Shipping and distribution - Costs for e-mails and non-commercial SMS campaigns', amount: 0 },
                EVisualMessage1: { key: '4.1', description: 'Visual messages - A production and rental costs for non-commercial signs of 4 m² or less', amount: 0 },
                EVisualMessage2: { key: '4.2', description: 'Visual messages - Printing and production costs for posters of 4 m² or less', amount: 0 },
                EVisualMessage3: { key: '4.3', description: 'Visual messages - Internet commercials or internet campaigns', amount: 0 },
                EVisualMessage4: { key: '4.4', description: 'Visual messages - Other costs for visual messages', amount: 0 },
                EOtherCost1: { key: '5.1', description: 'Other costs - Election manifestations', amount: 0 },
                EOtherCost2: { key: '5.2', description: 'Other costs - Production costs for website or webpage designed for election purposes', amount: 0 },
                EOtherCost3: { key: '5.3', description: 'Other costs - Varia', amount: 0 }
            },
            funds: {
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
            total += value.amount;
        }

        return total;
    }

    getTotalFunds() {
        let total = 0;
        for (const [key, value] of Object.entries(this.state.funds)) {
            total += value.amount;
        }

        return total;
    }

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

    handleChange(event) { //Use for data
        this.setFieldValidation(event.target.id, event.target.value);
        let value = event.target.value;
        if (isNumber(value)) {
            value = parseInt(value);
        }

        this.setState({[event.target.name]: value});
    }

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

    handleExpenses(event) { //Use for expenses section, because this is a custom state object
        event.persist();
        this.setFieldValidation(event.target.id, event.target.value);
        let value = event.target.value;
        if (isNumber(value)) {
            value = parseInt(value);
        }

        this.setState(state => {
            let expensesData = state.expenses;
            expensesData[event.target.name].amount = value;

            return {
                expenses: expensesData
            };
        });
    }

    handleFunds(event) { //Use for funds section, because this is a custom state object with particullar "if" statement
        event.persist();
        this.setFieldValidation(event.target.id, event.target.value);
        let value = event.target.value;
        if (isNumber(value)) {
            value = parseInt(value);
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

    handleSubmit(event) {
        event.preventDefault();

        if (this.props.appContainer != undefined) {
            let dataToSave = [];
            let doc = createAppDocument(this.props.appContainer, this.FILE_NAME);
            let meData = doc.addSubject({"identifier": "me"});

            if (this.state.GAuthPerson === 'yes') { //Authorized person so we check his data
                let errorData = false;
                let fieldValidError;
                for (const [key, value] of Object.entries(this.state.authorizedPerson)) {
                    fieldValidError = this.setFieldValidation(key, value);
                    if (!errorData) errorData = fieldValidError; //At the first empty, it will be true whatever 
                }

                if (errorData) {
                    alert("Geen geautoriseerde personen gevonden");
                    return false;
                }

                let authorizedPersonData = doc.addSubject({"identifier": "authorizedPerson"});
                authorizedPersonData.addString(schema.givenName, this.state.authorizedPerson.Gfirstname);
                authorizedPersonData.addString(schema.familyName, this.state.authorizedPerson.Glastname);
                authorizedPersonData.addString(schema.streetAddress, this.state.authorizedPerson.Gstreet + ", " + this.state.authorizedPerson.GstreetNumber);
                authorizedPersonData.addInteger(schema.postalCode, parseInt(this.state.authorizedPerson.GpostalCode));
                authorizedPersonData.addString(schema.addressLocality, this.state.authorizedPerson.Glocality);

                dataToSave.push(authorizedPersonData);
            }

            if (this.state.GElectionExpense === 'yes') { //Incur election expenses
                let error = false;
                for (const [key, value] of Object.entries(this.state.expenses)) {
                    if (error) {
                        alert("Geen gedeclareerde uitgaven");
                        return false;
                    }
                    error = isEmpty(value.amount);
                }
                
                let buyActionData;
                for (const [key, value] of Object.entries(this.state.expenses)) {
                    buyActionData = {
                        identifier: value.key,
                        description: value.description,
                        price: parseInt(value.amount),
                        priceCurrency: 'EUR'
                    }

                    dataToSave.push(createExpense(doc, this.state.profile, buyActionData));
                }

                for (const [key, value] of Object.entries(this.state.funds)) {
                    if (error) {
                        alert("Funds are empty");
                        return false;
                    }
                    error = isEmpty(value.amount);
                }
                
                let donateActionData;
                for (const [key, value] of Object.entries(this.state.funds)) {
                    donateActionData = {
                        identifier: value.key,
                        description: value.description,
                        price: parseInt(value.amount),
                        priceCurrency: 'EUR'
                    }

                    dataToSave.push(createDonation(doc, this.state.profile, donateActionData));
                }
            }

            let thisObject = this;
            doc.save(dataToSave).then(function(e) {
                alert("Uw data is opgeslagen!");
                //Redirect to the home page
                thisObject.setState({redirect: true});
            });

            /* Now it's made into profile
            //We send WebID to the API
            fetch('http://api.sep.osoc.be/store', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                mode: 'cors',
                cache: 'default',
                body: JSON.stringify({
                    "uri": this.props.webId
                })
            })
            .then(response => {
                if (response.status != 200 && response.status != 201) {
                    console.log("Error: " + response.statusText);
                }

                return response.json();
            })
            .then(json => {
                console.log(json.message);
            });
            */
        } else {
            alert("Er is geen toegang tot uw Solid pod.");
        }
    }

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
                return (
                    <div id="userForm">
                        {this.renderRedirect()}
                        <h1 class="vl-title vl-title--h1 vl-title--has-border">Aangifte van de verkiezingsuitgaven en van de herkomst van de geldmiddelen door lijsten</h1>
                        <form onSubmit={this.handleSubmit}>
                            <h2 class="vl-title vl-title--h2 vl-title--has-border">Algemeen</h2>

                            <div class="vl-grid">
                                <div className="form-group vl-form-col--8-12">
                                    <label className="vl-form__label" htmlFor="Gnamelist">Lijstnaam :</label>
                                    <input type="text" id="Gnamelist" className="vl-input-field vl-input-field--block" name="Gnamelist" onChange={this.handleChange}></input>
                                    <p class="vl-form__error" id="input-field-Gnamelist-error"></p>
                                </div>
        
                                <div className="form-group vl-form-col--4-12">
                                    <label className="vl-form__label" htmlFor="Gtrackingnumber">Volgnummer :</label>
                                    <input type="number" min="0" id="Gtrackingnumber" className="vl-input-field vl-input-field--block" name="Gtrackingnumber" onChange={this.handleChange}></input>
                                    <p class="vl-form__error" id="input-field-Gtrackingnumber-error"></p>
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

                                <div id="sectionAuthorized" class="form-group vl-form-col--12-12 vl-u-hidden">
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

                            <div id="sectionElectionExpenditure" class="vl-u-hidden">
                                <h2 class="vl-title vl-title--h2 vl-title--has-border">Aangifte van de verkiezingsuitgaven</h2>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Auditieve en mondelinge boodschappen</h3>
                                <div class="vl-grid">
                                    <div className="form-group">
                                        <InputAmount
                                            var="EAuditoryAndOral1"
                                            label="Bijvoorbeeld: niet-commerciële telefooncampagnes of een onuitwisbare politieke boodschap op een informatiedrager. Voeg een lijst van alle boodschappen en hun respectieve kostprijs bij uw aangifte."
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EAuditoryAndOral1.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Geschreven boodschappen</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage1_1"
                                            label="Ontwerp- en productiekosten van advertenties in de pers:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage1_1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage1_2"
                                            label="Prijs voor advertentieruimte in de pers:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage1_2.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage2"
                                            label="Ontwerp- en productiekosten van verkiezingsfolders:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage2.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage3"
                                            label="Kostprijs van brieven en enveloppen:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage3.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage4"
                                            label="Kostprijs van ander drukwerk:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage4.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage5"
                                            label="Kosten voor e-mails en niet-commerciële sms-campages:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage5.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Verzendings- en distributiekosten voor verkiezingspropaganda</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution1_1"
                                            label="Geadresseerde zendingen:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution1_1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution1_2"
                                            label="Niet-geaddresseerde:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution1_2.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution2"
                                            label="Portkosten voor andere zendingen:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution2.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution3"
                                            label="Andere distributie kosten:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution3.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Visuele boodschappen</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage1"
                                            label="Productie- en huurkosten voor niet-commerciële borden van 4 m² of minder:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage2"
                                            label="Druk- en productiekosten voor affiches van 4 m² of minder:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage2.amount}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage3"
                                            label="Reclamespots op het internet of internetcampagnes:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage3.amount}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage4"
                                            label="Andere kosten voor visuele boodschappen:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage4.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Overige uitgaven</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost1"
                                            label="Verkiezingsmanifestaties:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EOtherCost1.amount}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost2"
                                            label="Productiekosten voor website of webpagina, ontworpen met verkiezingsdoeleinden:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EOtherCost2.amount}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost3"
                                            label="Varia:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EOtherCost3.amount}
                                        />
                                    </div>
                                </div>

                                <p>Totaalbedrag: {this.getTotalExpense()}</p>
                            </div>

                            <div id="sectionOriginOfFund" class="vl-u-hidden">
                                <h2 class="vl-title vl-title--h2 vl-title--has-border">Aangifte van de herkomst van de geldmiddelen :</h2>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Rubriek 1</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection1"
                                            label="Geldmiddelen die afkomstig zijn van het eigen patrimonium van de lijst :"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection1.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Rubriek 2</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection2_1"
                                            label="Giften van 125 euro of meer per schenker:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection2_1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection2_2"
                                            label="Giften van minder dan 125 euro per schenker:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection2_2.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Rubriek 3</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection3_1"
                                            label="Bedragen van 125 euro of meer per sponsor:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection3_1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection3_2"
                                            label="Bedragen van minder dan 125 euro per sponsor:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection3_2.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Rubriek 4</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection4"
                                            label="Financiering door (een component van) de politieke partij :"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection4.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Rubriek 5</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection5"
                                            label="Andere herkomst:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection5.amount}
                                        />
                                    </div>
                                </div>

                                <p>Totaalbedrag: {this.getTotalFunds()}</p>
                            </div>
        
                            <button className="vl-button mt-3">
                                <span className="vl-button__label">Versturen</span>
                            </button>
                        </form>
                    </div>
                );
            }
        } else {
            return (
                <Loading />
            );
        }
    }
}

export default G103;