import React from 'react';

class InputAmount extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <label className="vl-form__label" htmlFor={this.props.var}>{this.props.label}</label>
                <div className="vl-input-group">
                <button class="vl-button vl-button--icon">
                    <span style={{"margin": "0px auto"}}>€</span>
                </button>
                <input type="number" value={this.props.val} min="0" id={this.props.var} className="vl-input-field vl-input-field--block" name={this.props.var} onChange={this.props.handleChange}></input>
                </div>
                <p class="vl-form__error" id={"input-field-" + this.props.var + "-error"}></p>
            </>
        );
    }
}

export default InputAmount;