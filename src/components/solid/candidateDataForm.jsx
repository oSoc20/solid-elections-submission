import React, { Component } from "react";
import {fetchDocument, TripleDocument} from 'tripledoc';
import {schema} from 'rdf-namespaces';
import {createAppDocument, listDocuments} from '../../utils/SolidWrapper';
import { issuedThrough } from "rdf-namespaces/dist/schema";

class CandidateDataForm extends React.Component {
    FILE_NAME = "me.ttl";

    constructor(props) {
        super(props);
        this.getUserData();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.appContainer !== undefined) {
            this.fetchUserData();
        }
    }

    async getUserData() {
        this.state = {firstname: '', lastname: '', street: '', streetNumber: '', locality: '', postalCode: ''};
    }

    async fetchUserData() {
        let documents = listDocuments(this.props.appContainer);
        let userDataLink = documents.find(link => {
            let indexFile = link.lastIndexOf('/');
            let file = link.substr(indexFile + 1);

            return file == this.FILE_NAME;
        });
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
                if (streetNumber.length == 2) {
                    this.setState({
                        street: streetNumber[0],
                        streetNumber: streetNumber[1]
                    });
                }
            }
        }
    }
  
    handleChange(event) {    
        //if (id === 'firstname') this.setState({firstname: event.target.value});  
        this.setState({[event.target.id]: event.target.value});
    }

    handleSubmit(event) {
        let doc = createAppDocument(this.props.appContainer, this.FILE_NAME);
        const formData = doc.addSubject({"identifier": "me"});
        formData.addString(schema.givenName, this.state.firstname);
        formData.addString(schema.familyName, this.state.lastname);
        formData.addString(schema.streetAddress, this.state.street + ", " + this.state.streetNumber);
        formData.addInteger(schema.postalCode, parseInt(this.state.postalCode));
        formData.addString(schema.addressLocality, this.state.locality);

        doc.save([formData]).then(function(e) {
            alert("Your data have been saved!");
        });
        event.preventDefault();
    }
  
    render() {
        return (
            <div id="userForm">
                <h1>Your information :</h1>
                <form onSubmit={this.handleSubmit}>
                    <div class="row">
                        <div className="form-group col-md-6">
                            <label htmlFor="firstname">First name :</label>
                            <input type="text" id="firstname" className="form-control" name="firstname" value={this.state.firstname} onChange={this.handleChange}></input>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="lastname">Last name :</label>
                            <input type="text" id="lastname" className="form-control" name="lastname" value={this.state.lastname} onChange={this.handleChange}></input>
                        </div>

                        <div className="form-group col-md-10">
                            <label htmlFor="street">Street :</label>
                            <input type="text" id="street" className="form-control" name="street" value={this.state.street} onChange={this.handleChange}></input>
                        </div>

                        <div className="form-group col-md-2">
                            <label htmlFor="streetNumber">Number :</label>
                            <input type="number" min="1" id="streetNumber" className="form-control" name="streetNumber" value={this.state.streetNumber} onChange={this.handleChange}></input>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="postalCode">Postal Code :</label>
                            <input type="number" min="0" id="postalCode" className="form-control" name="postalCode" value={this.state.postalCode} onChange={this.handleChange}></input>
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="locality">Locality :</label>
                            <input type="text" id="locality" className="form-control" name="locality" value={this.state.locality} onChange={this.handleChange}></input>
                        </div>
                    </div>

                    <input type="submit" className="btn btn-success" value="Save my information"></input>
                </form>
            </div>
        );
    }
}

  export default CandidateDataForm;