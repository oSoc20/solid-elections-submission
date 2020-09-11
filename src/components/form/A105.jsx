import React from "react";
import {fetchDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';
import {createAppDocument, listDocuments, createExpense, createDonation} from '../../utils/SolidWrapper';
import {isEmpty, isNumber, isOnlyText} from '../../utils/DataValidator';
import Loading from '../alert/loading';
import ProfileDoesntExist from '../alert/profileDoesntExist';
import InputAmount from './inputAmount';
import { Redirect } from 'react-router-dom';
import {fetchGetDb, fetchPostDb, fetchPostAbb} from '../../utils/RequestDatabase';
import ReactTooltip from "react-tooltip";
import { FaInfoCircle } from 'react-icons/fa';
import deadlines from '../../data/deadline.json';
import Help from "../alert/help";
import { value } from "rdf-namespaces/dist/rdf";

class A105 extends React.Component {
    FILE_NAME_PROFILE = "me.ttl";
    FILE_ID = "a105";
    FILE_NAME = this.FILE_ID + ".ttl";

    constructor(props) {
        super(props);
        this.setDefaultValue();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRadioShowOnYes = this.handleRadioShowOnYes.bind(this);
        this.handleExpenses = this.handleExpenses.bind(this);
        this.handleFunds = this.handleFunds.bind(this);
        this.state.loaded = false;
        this.state.error = true;
        this.state.redirect = false;
        this.state.formSending = false;
        //To know if the user have filled in more than 125€ and unlock tab
        this.state.fieldsFundsFilled = [];
    }

    async componentDidMount() {
        this.resetStateUserInfo();
        this.setState({"loaded": this.props.loaded});

        if (this.props.userInfo != null) {
            await this.init();
        }
    }

    async componentDidUpdate(prevProps, prevStates) { //Trigger when state or props change but not with route, we use it because appContainer is async
        if (this.props.userInfo == null) {
            this.resetStateUserInfo();
        }
        
        if (this.props.userInfo !== null && this.props.userInfo != prevProps.userInfo) {
            await this.resetStateUserInfo();
            await this.init();
            this.setState({"loaded": this.props.loaded});
        }

        //Just in case the loaded props take times to update
        if (this.props.loaded != prevProps.loaded) {
            this.setState({"loaded": this.props.loaded});
        }

        if (prevStates.formSending != this.state.formSending) {
            this.setButtonLoading(this.state.formSending);
        }
    }

    resetStateUserInfo() {
        this.state.userAmount = 0;
        this.state.listName = "";
        this.state.listNumber = "";
        this.state.userGemeente = "";
        this.state.listPosition = "";
    }

    setButtonLoading(state) {
        let button = document.getElementById("sendButton");

        if (state) {
            button.innerText = "Wacht even...";
        } else {
            button.innerText = "Onderteken en verstuur";
        }
    }

    //The page still loading when userInfo is not configured (and should show the error)
    async init() {
        if (this.props.userInfo != null) {
            this.setState({"error": false});

            this.setState({
                userAmount: this.props.userInfo.userAmount,
                listName: this.props.userInfo.lists[0].name,
                listNumber: this.props.userInfo.lists[0].number,
                listPosition: this.props.userInfo.lists[0].position,
                userGemeente: this.props.userInfo.address.municipality
            });
        } else { //in case of we switch between account 
            this.setState({"error": true});
        }
    }

    async setDefaultValue() {
        this.state = {
            GElectionExpense: 'no', 
            expenses: { //If help exist, it will be a popup with "?" logo, we make popup with hover and clickable to let you choose
                EAuditoryAndOral1: { key: '1.1', description: 'Auditory and oral messages', amount: 0, help: "Bijvoorbeeld: niet-commerciële telefooncampagnes of een onuitwisbare politieke boodschap op een informatiedrager. Voeg een lijst van alle boodschappen en hun respectieve kostprijs bij uw aangifte." },
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
                EVisualMessage1: { key: '4.1', description: 'Visual messages - A production and rental costs for non-commercial signs of 4 m² or less', amount: 0, help: "De kostprijs van de borden die zelf zijn aangemaakt of aangekocht, kan worden afgeschreven over drie verkiezingen waaraan de politieke partij deelneemt, met een minimum van een derde van de kostprijs per verkiezing. Als die borden zijn gehuurd, moet de huurprijs in zijn geheel aangegeven worden. De huurprijs moet commercieel verantwoord zijn (bijvoorbeeld een derde van de kostprijs). Het gebruik van volledig afgeschreven borden hoeft niet te worden aangegeven." },
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

        let section = document.getElementById("input-field-" + event.target.id + "-error");

        if (event.target.getAttribute("data-min") == "125") {
            if (value >= 125) {
                section.innerHTML = event.target.getAttribute("data-message");

                //Check if we can allow the user to the tab G104
                this.setState(state => {
                    let fieldsFunds = state.fieldsFundsFilled;

                    if (!fieldsFunds.includes(event.target.id)) {
                        fieldsFunds.push(event.target.id);

                        if (fieldsFunds.length >= 1) {
                            document.getElementById("tab-g104").classList.remove("disabled");
                            document.getElementById("tab-g104").parentElement.classList.remove("disabled");
                        }
                    }

                    return {
                        fieldsFundsFilled: fieldsFunds
                    }
                });
            } else {
                //Condition there because no error if it's 0 but we have to remove the tab if necessary
                if (value > 0) {
                    section.innerHTML = "Het bedrag dat u ingaf is lager dan 125€ en moet u in het veld hiernaast invullen.";
                }
                
                //Check if we can remove the user to the tab G104
                this.setState(state => {
                    let fieldsFunds = state.fieldsFundsFilled;

                    if (fieldsFunds.includes(event.target.id)) {
                        let index = fieldsFunds.indexOf(event.target.id);
                        if (index != -1) fieldsFunds = fieldsFunds.slice(0, index).concat(fieldsFunds.slice(index + 1))

                        console.log(fieldsFunds);

                        if (fieldsFunds.length == 0) {
                            document.getElementById("tab-g104").classList.add("disabled");
                            document.getElementById("tab-g104").parentElement.classList.add("disabled");
                        }
                    }

                    return {
                        fieldsFundsFilled: fieldsFunds
                    }
                });
            }
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

        this.setState({"formSending": true});

        if (this.props.userInfo.appContainer != undefined) {
            let dataToSave = [];
            //Create a new document
            let doc = createAppDocument(this.props.userInfo.appContainer, this.FILE_NAME);

            //Uncomment to save only if the user say yes, without condition it will be 0 by default even if the user answer "no" to the expence
            //if (this.state.GElectionExpense === 'yes') { //Incur election expenses
                let error = false;
                //Check if there is any error
                for (const [key, value] of Object.entries(this.state.expenses)) {
                    if (error) {
                        alert("Geen gedeclareerde uitgaven");
                        this.setState({"formSending": false});
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
                    dataToSave.push(createExpense(doc, this.props.userInfo.profile, buyActionData));
                }

                //Same as expences but for funds
                for (const [key, value] of Object.entries(this.state.funds)) {
                    if (error) {
                        alert("De fondsen zijn niet correct ingevuld");
                        this.setState({"formSending": false});
                        return false;
                    }
                    error = isEmpty(value.amount);
                    if (!error) {
                        let field = document.getElementById(key);

                        error = (field.getAttribute("data-min") == "125" && value.amount != 0 && value.amount < 125) || (field.getAttribute("data-max") == "125" && value.amount > 125);
                    }
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

                    dataToSave.push(createDonation(doc, this.props.userInfo.profile, donateActionData));
                }
            //}

            let errorForm = document.getElementById("error-form");
            if (this.getTotalExpense() != this.getTotalFunds()) {
                errorForm.innerText = "Het totaalbedrag van de uitgaven is niet gelijk aan het totaalbedrag van de herkomst van de geldmiddelen";
                this.setState({"formSending": false});
                return false;
            }

            errorForm.innerText = "";

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

        this.setState({"formSending": false});
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
                        <h1 className="vl-title vl-title--h1 vl-title--has-border">Aangifte van de verkiezingsuitgaven en van de herkomst van de geldmiddelen door kandidaten</h1>
                        <form onSubmit={this.handleSubmit}>
                            <h2 className="vl-title vl-title--h2 vl-title--has-border">Algemeen</h2>

                            <div className="vl-grid">
                                <div className="form-group vl-form-col--8-12">
                                    <label className="vl-form__label" htmlFor="Gnamelist">Lijstnaam :</label>
                                    <input type="text" id="Gnamelist" disabled={true} className="vl-input-field vl-input-field--block" value={this.state.listName} name="Gnamelist"></input>
                                    <p className="vl-form__error" id="input-field-Gnamelist-error"></p>
                                </div>

                                <div className="form-group vl-form-col--4-12">
                                    <label className="vl-form__label" htmlFor="Gtrackingnumber">Volgnummer :</label>
                                    <input type="number" min="0" disabled={true} id="Gtrackingnumber" className="vl-input-field vl-input-field--block" value={this.state.listNumber} name="Gtrackingnumber"></input>
                                    <p className="vl-form__error" id="input-field-Gtrackingnumber-error"></p>
                                </div>

                                <div className="form-group vl-form-col--8-12">
                                    <label className="vl-form__label" htmlFor="Ggemeente">Gemeentebestuur :</label>
                                    <input type="text" disabled={true} id="Ggemeente" className="vl-input-field vl-input-field--block" value={this.state.userGemeente} name="Ggemeente"></input>
                                    <p className="vl-form__error" id="input-field-Ggemeente-error"></p>
                                </div>

                                <div className="form-group vl-form-col--4-12">
                                    <label className="vl-form__label" htmlFor="GlistPosition">Plaats op de lijst :</label>
                                    <input type="number" min="0" disabled={true} id="GlistPosition" className="vl-input-field vl-input-field--block" value={this.state.listPosition} name="GlistPosition"></input>
                                    <p className="vl-form__error" id="input-field-GlistPosition-error"></p>
                                </div>

                                <p>Heeft u als kandidaat voor de verkiezingen van 14 oktober 2018 verkiezingsuitgaven gedaan?</p>
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
                                <h2 className="vl-title vl-title--h2 vl-title--has-border">Aangifte van de verkiezingsuitgaven
                                    <Help message=
                                    {
                                        [
                                            <p>Vermeld hier alle uitgaven en financiële verbintenissen voor mondelinge, schriftelijke, auditieve en visuele boodschappen die verricht zijn tijdens de sperperiode en erop gericht zijn het resultaat van de lijst gunstig te beïnvloeden.</p>,
                                            <p>Vermeld hier ook de uitgaven die voor de lijst gedaan zijn door derden. U hoeft die uitgaven niet te vermelden als de lijst de derden onmiddellijk na de kennisneming van de door hen gevoerde campagne, per aangetekende brief ertoe heeft aangemaand de campagne te staken en aan de voorzitter van het verkiezingshoofdbureau een afschrift heeft bezorgd van die aangetekende brief, al dan niet vergezeld van het akkoord van de derden tot staking. Voeg dat afschrift bij deze aangifte. </p>,
                                            <p>De uitgaven en financiële verbintenissen voor goederen, leveringen en diensten moeten tegen de geldende marktprijzen worden verrekend.</p>,
                                            <p>Opgelet! Hou er bij het invullen van de aangifte rekening mee dat tijdens de sperperiode het gebruik van bepaalde campagnemiddelen verboden is. Lijsten, alsook derden die propaganda voor hen willen maken, mogen tijdens de sperperiode:</p>,
                                            <ul>
                                                <li>- geen geschenken of gadgets verkopen of verspreiden</li>
                                                <li>- geen commerciële telefooncampagnes voeren</li>
                                                <li>- niet gebruikmaken van commerciële reclameborden of affiches</li>
                                                <li>- niet gebruikmaken van niet-commerciële reclameborden of affiches die groter zijn dan 4 m²</li>
                                                <li>- niet gebruikmaken van commerciële reclamespots op radio, televisie en in bioscopen</li>
                                            </ul>
                                        ]
                                    }
                                    />
                                </h2>

                                <p className="text-bold">Het maximumbedrag dat u als kandidaat mag uitgeven, bedraagt {this.state.userAmount}€.</p>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Auditieve en mondelinge boodschappen
                                    <Help message={this.state.expenses.EAuditoryAndOral1.help} />
                                </h3>
                                
                                <div className="vl-grid">
                                    <div className="form-group">
                                        <InputAmount
                                            var="EAuditoryAndOral1"
                                            label=""
                                            handleChange={this.handleExpenses}
                                            val={this.state.expenses.EAuditoryAndOral1.amount}
                                            help=""
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
                                            label="Niet-geadresseerde zendingen:"
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
                                <h2 className="vl-title vl-title--h2 vl-title--has-border">Aangifte van de herkomst van de geldmiddelen : 
                                    <Help message=
                                    {
                                        [
                                            <p>In deze rubriek maakt u een opsplitsing van de verkiezingsuitgaven die uw lijst heeft gedaan volgens de herkomst van de geldmiddelen waarmee die uitgaven gefinancierd zijn. Het totale bedrag van de uitgaven hierboven opgenomen, moet gelijk zijn aan het totale bedrag van de herkomst van de geldmiddelen dat hieronder is aangegeven.</p>,
                                            <p>Giften en sponsorbedragen van 125 euro en meer worden elektronisch overgemaakt met een overschrijving, een lopende betalingsopdracht of een bank- of kredietkaart.</p>
                                        ]
                                    }
                                    />
                                </h2>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Geldmiddelen die afkomstig zijn van het eigen patrimonium van de kandidaat</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection1"
                                            label=""
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection1.amount}
                                            help={this.state.funds.FSection1.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Giften 
                                    <Help message={
                                        [
                                        <p>Zowel giften in geld als giften in natura worden als giften beschouwd. De prestaties die kosteloos of onder de reële kostprijs verleend worden, de ter beschikking gestelde kredietlijnen die niet moe-ten worden terugbetaald en de prestaties die door een politieke partij, een lijst of een kandidaat kennelijk boven de marktprijs zijn aangerekend, worden ook als gift beschouwd. Alleen natuurlijke personen mogen giften doen. Giften van rechtspersonen of feitelijke verenigingen, evenals giften van natuurlijke personen die feitelijk optreden als tussenpersonen van rechtspersonen of feitelijke verenigingen, zijn verboden.</p>,
                                        <p>Opgelet! De lijsten mogen hun verkiezingspropaganda financieren met giften die per schenker maximum 500 euro of de tegenwaarde ervan bedragen.</p>
                                        ]
                                    }/>
                                </h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection2_1"
                                            label="Giften van 125 euro of meer per schenker:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection2_1.amount}
                                            help={this.state.funds.FSection2_1.help}
                                            min="125"
                                            message="Let op! U vult giften in die €125 of hoger bedragen. Vul daarom ook het formulier voor de identificatie van de schenkers en sponsors in."
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

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Sponsoring 
                                    <Help message={
                                        [
                                        <p>Onder sponsoring wordt verstaan het volgens de geldende marktprijzen ter beschikking stellen van gelden of producten in ruil voor publiciteit. Ondernemingen, feitelijke verenigingen en rechtspersonen mogen sponsoren. Onder onderneming wordt verstaan elke natuurlijke persoon of rechtspersoon die op duurzame wijze een economisch doel nastreeft, alsmede zijn verenigingen.</p>,
                                        <p>Opgelet! De lijsten mogen per sponsor maximum 500 euro of de tegenwaarde ervan ontvangen. </p>
                                        ]   
                                    }/>
                                </h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection3_1"
                                            label="Bedragen van 125 euro of meer per sponsor:"
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection3_1.amount}
                                            help={this.state.funds.FSection3_1.help}
                                            min="125"
                                            message="Let op! U vult sponsoring in die €125 of hoger bedraagt. Vul daarom ook het formulier voor de identificatie van de schenkers en sponsors in."
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

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Financiering door (een component van) de politieke partij</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection4"
                                            label=""
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection4.amount}
                                            help={this.state.funds.FSection4.help}
                                        />
                                    </div>
                                </div>

                                <h3 className="vl-title vl-title--h3 vl-title--has-border">Andere herkomst</h3>
                                <div className="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection5"
                                            label=""
                                            handleChange={this.handleFunds}
                                            val={this.state.funds.FSection5.amount}
                                            help={this.state.funds.FSection5.help}
                                        />
                                    </div>
                                </div>

                                <p className="total-text">Totaalbedrag: {this.getTotalFunds().toLocaleString()}€</p>
                            </div>

                            <p id="error-form" className="vl-form__error"></p>

                            <p className="text-bold">Verzend dit formulier ten laatste op {deadlines.forms[this.FILE_ID].deadline}.</p>
        
                            <button id="sendButton" className="vl-button mt-5" disabled={this.state.formSending}>
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

export default A105;