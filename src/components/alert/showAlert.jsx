import React from 'react';

export class ShowAlert extends React.Component {
    constructor(props) {
        super(props);
    }

    getTitle() {
        if (this.props.type == "error") return "Error!";
        if (this.props.type == "success") return "Succes!";
        else return "Hum...";
    }

    getIcon() {
        return "vl-icon vl-vi vl-vi-alert-triangle-filled";
    }

    render() {
        return (
            <div className={"vl-alert vl-alert--" + this.props.type} role="alert">
                <div className="vl-alert__icon">
                    <i className={this.getIcon()} aria-hidden="true"></i>
                </div>
                <div className="vl-alert__content">
                    <p className="vl-alert__title">{this.getTitle()}</p>
                    <div className="vl-alert__message">
                        <p>{this.props.message}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ShowAlert;