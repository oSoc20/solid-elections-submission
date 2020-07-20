import React from "react";
import {fetchDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';
import {createAppDocument, listDocuments} from '../../utils/SolidWrapper';
import {isEmpty, isNumber} from '../../utils/DataValidator';
import Loading from '../loading';
import ProfileDoesntExist from '../error/profileDoesntExist';
import PersonInput from '../user';
import InputAmount from '../form/inputAmount';

class G103 extends React.Component {
    FILE_NAME = "me.ttl";

    constructor(props) {
        super(props);
        this.setDefaultValue();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRadioShowOnYes = this.handleRadioShowOnYes.bind(this);
        this.handleChangeFund = this.handleChangeFund.bind(this);
        this.state.loaded = false;
        this.state.error = true;
    }

    componentDidMount() { //Trigger when component is created or using route
        if (this.props.appContainer !== undefined) {
            this.init();
        }
    }

    componentDidUpdate(prevProps) { //Trigger when state or props change but not with route
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

            return file == this.FILE_NAME;
        });

        return userDataLink != null;
    }

    async setDefaultValue() {
        this.state = {
            GAuthPerson: 'no', 
            GElectionExpense: 'no', 
            //For expense
            EAuditoryAndOral1: 0,
            EWrittenMessage1_1: 0, 
            EWrittenMessage1_2: 0, 
            EWrittenMessage2: 0,
            EWrittenMessage3: 0, 
            EWrittenMessage4: 0, 
            EWrittenMessage5: 0,
            EShippingAndDistribution1_1: 0,
            EShippingAndDistribution1_2: 0,
            EShippingAndDistribution2: 0,
            EShippingAndDistribution3: 0,
            EVisualMessage1: 0,
            EVisualMessage2: 0,
            EVisualMessage3: 0,
            EVisualMessage4: 0,
            EOtherCost1: 0,
            EOtherCost2: 0,
            EOtherCost3: 0,
            //For fund
            FSection1: 0,
            FSection2_1: 0,
            FSection2_2: 0,
            FSection3_1: 0,
            FSection3_2: 0,
            FSection4: 0,
            FSection5: 0
        };

        this.state.test = {
            next: 0
        }
    }

    getTotalExpense() {
        return (
            this.state.EAuditoryAndOral1 +
            this.state.EWrittenMessage1_1 +
            this.state.EWrittenMessage1_2 +
            this.state.EWrittenMessage2 +
            this.state.EWrittenMessage3 +
            this.state.EWrittenMessage4 +
            this.state.EWrittenMessage5 +
            this.state.EShippingAndDistribution1_1 +
            this.state.EShippingAndDistribution1_2 +
            this.state.EShippingAndDistribution2 +
            this.state.EShippingAndDistribution3 +
            this.state.EVisualMessage1 +
            this.state.EVisualMessage2 +
            this.state.EVisualMessage3 +
            this.state.EVisualMessage4 +
            this.state.EOtherCost1 +
            this.state.EOtherCost2 +
            this.state.EOtherCost3
        );
    }

    getTotalFunds() {
        return (
            this.state.FSection1 +
            this.state.FSection2_1 +
            this.state.FSection2_2 +
            this.state.FSection3_1 +
            this.state.FSection3_2 +
            this.state.FSection4 +
            this.state.FSection5
        );
    }

    setFieldValidation(id, value) {
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
  
    handleChange(event) {
        this.setFieldValidation(event.target.id, event.target.value);
        let value = event.target.value;
        if (isNumber(value)) {
            value = parseInt(value);
        }

        this.setState({[event.target.name]: value});
    }

    handleChangeFund(event) {
        this.handleChange(event);
        if (event.target.value >= 125) {
            let section = document.getElementById("input-field-" + event.target.id + "-error");
            section.innerHTML = "Please, don't forget to complete the form A106 because this amount exceeds 125€";
        }
    }
 
    handleRadioShowOnYes(event, ...ids) {
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
        console.log(this.state);
        event.preventDefault();
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
                                    <PersonInput prefix="G" handleChange={this.handleChange} />
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
                                            handleChange={this.handleChange}
                                            val={this.state.EAuditoryAndOral1}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Written messages:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage1_1"
                                            label="Design and production costs in the press:"
                                            handleChange={this.handleChange}
                                            val={this.state.EWrittenMessage1_1}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage1_2"
                                            label="Price for the advertising space in the press:"
                                            handleChange={this.handleChange}
                                            val={this.state.EWrittenMessage1_2}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage2"
                                            label="Design and production costs of election brochures:"
                                            handleChange={this.handleChange}
                                            val={this.state.EWrittenMessage2}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage3"
                                            label="Cost of letters and envelopes:"
                                            handleChange={this.handleChange}
                                            val={this.state.EWrittenMessage3}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage4"
                                            label="Cost of other printed matter (attach files):"
                                            handleChange={this.handleChange}
                                            val={this.state.EWrittenMessage4}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EWrittenMessage5"
                                            label="Costs for e-mails and non-commercial SMS campaigns:"
                                            handleChange={this.handleChange}
                                            val={this.state.EWrittenMessage5}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Shipping and distribution costs for election propaganda:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution1_1"
                                            label="Addressed shipments in election printing:"
                                            handleChange={this.handleChange}
                                            val={this.state.EShippingAndDistribution1_1}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution1_2"
                                            label="Non-addressed shipments in election printing:"
                                            handleChange={this.handleChange}
                                            val={this.state.EShippingAndDistribution1_2}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution2"
                                            label="Other costs of distribution (attach files):"
                                            handleChange={this.handleChange}
                                            val={this.state.EShippingAndDistribution2}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EShippingAndDistribution3"
                                            label="Costs for e-mails and non-commercial SMS campaigns:"
                                            handleChange={this.handleChange}
                                            val={this.state.EShippingAndDistribution3}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Visual messages:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage1"
                                            label="A production and rental costs for non-commercial signs of 4 m² or less:"
                                            handleChange={this.handleChange}
                                            val={this.state.EVisualMessage1}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage2"
                                            label="Printing and production costs for posters of 4 m² or less:"
                                            handleChange={this.handleChange}
                                            val={this.state.EVisualMessage2}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage3"
                                            label="Internet commercials or internet campaigns:"
                                            handleChange={this.handleChange}
                                            val={this.state.EVisualMessage3}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EVisualMessage4"
                                            label="Other costs for visual messages (attach files):"
                                            handleChange={this.handleChange}
                                            val={this.state.EVisualMessage4}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Other costs:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost1"
                                            label="Election manifestations:"
                                            handleChange={this.handleChange}
                                            val={this.state.EOtherCost1}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost2"
                                            label="Production costs for website or webpage designed for election purposes:"
                                            handleChange={this.handleChange}
                                            val={this.state.EOtherCost2}
                                        />
                                    </div>
                                    
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="EOtherCost3"
                                            label="Varia (attach files):"
                                            handleChange={this.handleChange}
                                            val={this.state.EOtherCost3}
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
                                            handleChange={this.handleChangeFund}
                                            val={this.state.FSection1}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Section 2:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection2_1"
                                            label="Donations of EUR 125 or more per donor:"
                                            handleChange={this.handleChangeFund}
                                            val={this.state.FSection2_1}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection2_2"
                                            label="Donations of less than €125 per donor:"
                                            handleChange={this.handleChangeFund}
                                            val={this.state.FSection2_2}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Section 3:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection3_1"
                                            label="Sponsorship of EUR 125 or more per sponsor:"
                                            handleChange={this.handleChangeFund}
                                            val={this.state.FSection3_1}
                                        />
                                    </div>

                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection3_2"
                                            label="Sponsorship of less than EUR 125 per sponsor:"
                                            handleChange={this.handleChangeFund}
                                            val={this.state.FSection3_2}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Section 4:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection4"
                                            label="Financing by (a component of) the political party:"
                                            handleChange={this.handleChangeFund}
                                            val={this.state.FSection4}
                                        />
                                    </div>
                                </div>

                                <h3 class="vl-title vl-title--h3 vl-title--has-border">Section 5:</h3>
                                <div class="vl-grid">
                                    <div className="form-group vl-form-col--6-12">
                                        <InputAmount
                                            var="FSection5"
                                            label="Other source:"
                                            handleChange={this.handleChangeFund}
                                            val={this.state.FSection5}
                                        />
                                    </div>
                                </div>

                                <p>Total expenses: {this.getTotalFunds()}</p>
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