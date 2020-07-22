import React from "react";
import {fetchDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';
import {createAppDocument, listDocuments, createExpense, createDonation} from '../../utils/SolidWrapper';
import {isEmpty, isNumber, areEmpty} from '../../utils/DataValidator';
import Loading from '../alert/loading';
import ProfileDoesntExist from '../alert/profileDoesntExist';
import PersonInput from '../user';
import InputAmount from '../form/inputAmount';
import { Redirect } from 'react-router-dom'

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

    componentDidMount() { //Trigger when component is created or using route
        if (this.props.appContainer !== undefined) {
            this.init();
        }
    }

    componentDidUpdate(prevProps) { //Trigger when state or props change but not with route, we use it because appContainer is async
        if (this.props.appContainer !== undefined && this.props.appContainer != prevProps.appContainer) {
            this.init();
        }
    }

    init() {
        this.setState({"loaded": true});
        this.profileExist().then(value => {
            this.setState({"error": !value});
        })
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
            //For expense
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
            //For fund
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

    setFieldValidation(id, value) { //Use to update field if he is empty
        let errorField = document.getElementById("input-field-" + id + "-error");
        let input = document.getElementById(id);

        if (errorField != null && input != null) {
            if (isEmpty(value)) {
                input.classList.add("vl-input-field--error");

                if (input.type === 'number') {
                    errorField.innerHTML = "This field must be a number!";
                } else {
                    errorField.innerHTML = "This field cannot be empty!";
                }
            } else {
                errorField.innerHTML = "";
                input.classList.remove("vl-input-field--error");
            }
        }
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
            section.innerHTML = "Please, don't forget to complete the form A106 because this amount exceeds 125€";
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
        //console.log(this.state);

        if (this.props.appContainer != undefined) {
            let dataToSave = [];
            let doc = createAppDocument(this.props.appContainer, this.FILE_NAME);
            let meData = doc.addSubject({"identifier": "me"});
            //Todo about number list and tracking number
            //dataToSave.push(meData);

            if (this.state.GAuthPerson === 'yes') { //Authorized person so we check his data
                if (areEmpty(Object.values(this.state.authorizedPerson))) {
                    for (const [key, value] of Object.entries(this.state.authorizedPerson)) {
                        this.setFieldValidation(key, value);
                    }
                    alert("Authorized person are empty");
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
                        alert("Expenses are empty");
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
                alert("Your data have been saved!");
                //Redirect to the home page
                thisObject.setState({redirect: true});
            });

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
        } else {
            alert("Unable to access to your Solid Pod, server down?");
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
                        <h1 class="vl-title vl-title--h1 vl-title--has-border">Declaration of election expenditure and of the origin of funds by lists:</h1>
                        <form onSubmit={this.handleSubmit}>
                            <h2 class="vl-title vl-title--h2 vl-title--has-border">General:</h2>

                            <div class="vl-grid">
                                <div className="form-group vl-form-col--8-12">
                                    <label className="vl-form__label" htmlFor="Gnamelist">Name of the list :</label>
                                    <input type="text" id="Gnamelist" className="vl-input-field vl-input-field--block" name="Gnamelist" onChange={this.handleChange}></input>
                                    <p class="vl-form__error" id="input-field-Gnamelist-error"></p>
                                </div>
        
                                <div className="form-group vl-form-col--4-12">
                                    <label className="vl-form__label" htmlFor="Gtrackingnumber">Tracking number :</label>
                                    <input type="number" min="0" id="Gtrackingnumber" className="vl-input-field vl-input-field--block" name="Gtrackingnumber" onChange={this.handleChange}></input>
                                    <p class="vl-form__error" id="input-field-Gtrackingnumber-error"></p>
                                </div>

                                <p>Are you a person authorised by the list-tractor?</p>
                                <div className="form-group vl-form-col--12-12">
                                    <label className="vl-radio" htmlFor="GAuthPersonYes">
                                        <input className="vl-radio__toggle" type="radio" id="GAuthPersonYes" name="GAuthPerson" value="yes" onChange={(e) => this.handleRadioShowOnYes(e, "sectionAuthorized")} checked={this.state.GAuthPerson === 'yes'} />
                                        <div className="vl-radio__label">Yes</div>
                                    </label>
                                    <label className="vl-radio" htmlFor="GAuthPersonNo">
                                        <input className="vl-radio__toggle" type="radio" id="GAuthPersonNo" name="GAuthPerson" value="no" onChange={(e) => this.handleRadioShowOnYes(e, "sectionAuthorized")} checked={this.state.GAuthPerson === 'no'} />
                                        <div className="vl-radio__label">No</div>
                                    </label>
                                </div>

                                <div id="sectionAuthorized" class="form-group vl-form-col--12-12 vl-u-hidden">
                                    <PersonInput prefix="G" handleChange={this.handleAuthorizedPerson} />
                                </div>

                                <p>Before the elections on 14 October 2018, did the list of which you are the head of incur election expenses?</p>
                                <div className="form-group vl-form-col--12-12">
                                    <label className="vl-radio" htmlFor="GElectionExpenseYes">
                                        <input className="vl-radio__toggle" type="radio" id="GElectionExpenseYes" name="GElectionExpense" value="yes" onChange={(e) => this.handleRadioShowOnYes(e, "sectionElectionExpenditure", "sectionOriginOfFund")} checked={this.state.GElectionExpense === 'yes'} />
                                        <div className="vl-radio__label">Yes</div>
                                    </label>
                                    <label className="vl-radio" htmlFor="GElectionExpenseNo">
                                        <input className="vl-radio__toggle" type="radio" id="GElectionExpenseNo" name="GElectionExpense" value="no" onChange={(e) => this.handleRadioShowOnYes(e, "sectionElectionExpenditure", "sectionOriginOfFund")} checked={this.state.GElectionExpense === 'no'} />
                                        <div className="vl-radio__label">No</div>
                                    </label>
                                </div>
                            </div>

                            <div id="sectionElectionExpenditure" class="vl-u-hidden">
                                <h2 class="vl-title vl-title--h2 vl-title--has-border">Declaration of election expenditure:</h2>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Auditory and oral messages:</h3>
                                <div class="vl-grid">
                                    <div className="form-group">
                                        <InputAmount
                                            var="EAuditoryAndOral1"
                                            label="For example: non-commercial telephone campaigns or an indelible political message on an information carrier. Attach a list of all messages and their respective cost price to your declaration (attach files):"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EAuditoryAndOral1.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Written messages:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage1_1"
                                            label="Design and production costs in the press:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage1_1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage1_2"
                                            label="Price for the advertising space in the press:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage1_2.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage2"
                                            label="Design and production costs of election brochures:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage2.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage3"
                                            label="Cost of letters and envelopes:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage3.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage4"
                                            label="Cost of other printed matter (attach files):"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage4.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage5"
                                            label="Costs for e-mails and non-commercial SMS campaigns:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EWrittenMessage5.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Shipping and distribution costs for election propaganda:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution1_1"
                                            label="Addressed shipments in election printing:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution1_1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution1_2"
                                            label="Non-addressed shipments in election printing:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution1_2.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution2"
                                            label="Other costs of distribution (attach files):"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution2.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution3"
                                            label="Costs for e-mails and non-commercial SMS campaigns:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EShippingAndDistribution3.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Visual messages:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage1"
                                            label="A production and rental costs for non-commercial signs of 4 m² or less:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage2"
                                            label="Printing and production costs for posters of 4 m² or less:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage2.amount}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage3"
                                            label="Internet commercials or internet campaigns:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage3.amount}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage4"
                                            label="Other costs for visual messages (attach files):"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EVisualMessage4.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Other costs:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost1"
                                            label="Election manifestations:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EOtherCost1.amount}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost2"
                                            label="Production costs for website or webpage designed for election purposes:"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EOtherCost2.amount}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost3"
                                            label="Varia (attach files):"
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EOtherCost3.amount}
                                        />
                                    </div>
                                </div>

                                <p>Total expenses: {this.getTotalExpense()}</p>
                            </div>

                            <div id="sectionOriginOfFund" class="vl-u-hidden">
                                <h2 class="vl-title vl-title--h2 vl-title--has-border">Declaration of the origin of the funds:</h2>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Section 1:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection1"
                                            label="Funds deriving from the list's own patrimony:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection1.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Section 2:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection2_1"
                                            label="Donations of EUR 125 or more per donor:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection2_1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection2_2"
                                            label="Donations of less than €125 per donor:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection2_2.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Section 3:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection3_1"
                                            label="Sponsorship of EUR 125 or more per sponsor:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection3_1.amount}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection3_2"
                                            label="Sponsorship of less than EUR 125 per sponsor:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection3_2.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Section 4:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection4"
                                            label="Financing by (a component of) the political party:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection4.amount}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Section 5:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection5"
                                            label="Other source:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection5.amount}
                                        />
                                    </div>
                                </div>

                                <p>Total funds: {this.getTotalFunds()}</p>
                            </div>
        
                            <button className="vl-button mt-3">
                                <span className="vl-button__label">Send</span>
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