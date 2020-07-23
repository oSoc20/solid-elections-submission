import React from 'react';

class PersonInput extends React.Component {
    constructor(props) {
      super(props);
  }

  render() {
    return (
      <div class="vl-grid">
        <div className="form-group vl-form-col--6-12">
            <label className="vl-form__label" htmlFor={this.props.prefix + 'firstname'}>Voornaam :</label>
            <input type="text" id={this.props.prefix + 'firstname'} className="vl-input-field vl-input-field--block" name={this.props.prefix + 'firstname'} onChange={this.props.handleChange}></input>
            <p className="vl-form__error" id={'input-field-' + this.props.prefix + 'firstname-error'}></p>
        </div>

        <div className="form-group vl-form-col--6-12">
            <label className="vl-form__label" htmlFor={this.props.prefix + 'lastname'}>Achternaam :</label>
            <input type="text" id={this.props.prefix + 'lastname'} className="vl-input-field vl-input-field--block" name={this.props.prefix + 'lastname'} onChange={this.props.handleChange}></input>
            <p class="vl-form__error" id={'input-field-' + this.props.prefix + 'lastname-error'}></p>
        </div>

        <div className="form-group vl-col--12-12--m vl-col--10-12">
            <label className="vl-form__label" htmlFor={this.props.prefix + 'street'}>Straatnaam :</label>
            <input type="text" id={this.props.prefix + 'street'} className="vl-input-field vl-input-field--block" name={this.props.prefix + 'street'} onChange={this.props.handleChange}></input>
            <p class="vl-form__error" id={'input-field-' + this.props.prefix + 'street-error'}></p>
        </div>

        <div className="form-group vl-col--12-12--m vl-col--2-12">
            <label className="vl-form__label" htmlFor={this.props.prefix + 'streetNumber'}>Huisnummer :</label>
            <input type="number" min="1" id={this.props.prefix + 'streetNumber'} className="vl-input-field vl-input-field--block" name={this.props.prefix + 'streetNumber'} onChange={this.props.handleChange}></input>
            <p class="vl-form__error" id={'input-field-' + this.props.prefix + 'streetNumber-error'}></p>
        </div>

        <div className="form-group vl-col--12-12--m vl-col--10-12">
            <label className="vl-form__label" htmlFor={this.props.prefix + 'locality'}>Gemeente :</label>
            <input type="text" id={this.props.prefix + 'locality'} className="vl-input-field vl-input-field--block" name={this.props.prefix + 'locality'} onChange={this.props.handleChange}></input>
            <p class="vl-form__error" id={'input-field-' + this.props.prefix + 'locality-error'}></p>
        </div>

        <div className="form-group vl-col--12-12--m vl-col--2-12">
            <label className="vl-form__label" htmlFor={this.props.prefix + 'postalCode'}>Postcode :</label>
            <input type="number" min="0" id={this.props.prefix + 'postalCode'} className="vl-input-field vl-input-field--block" name={this.props.prefix + 'postalCode'} onChange={this.props.handleChange}></input>
            <p className="vl-form__error" id={'input-field-' + this.props.prefix + 'postalCode-error'}></p>
        </div>
      </div>
    );
  }
};

export default PersonInput;