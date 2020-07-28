import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Popup from "reactjs-popup";

class InputAmount extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <label className="vl-form__label" htmlFor={this.props.var}>{this.props.label}</label> <span className="clickable">{this.props.help == "" || this.props.help == null ? "" : <Popup
                    trigger={<FaInfoCircle data-tip={this.props.help} />}
                    modal
                    closeOnDocumentClick
                >
                    <div className="modal-tooltip">
                        <div className="header"> Help </div>
                        <div className="content">
                            {this.props.help}
                        </div>
                    </div>
                </Popup>}</span>
                <div className="vl-input-group">
                <button className="vl-button vl-button--icon">
                    <span style={{"margin": "0px auto"}}>€</span>
                </button>
                <input type="number" value={this.props.val} min="0" step="0.01" id={this.props.var} className="vl-input-field vl-input-field--block" name={this.props.var} onChange={this.props.handleChange}></input>
                </div>
                <p className="vl-form__error" id={"input-field-" + this.props.var + "-error"}></p>
            </>
        );
    }
}

export default InputAmount;