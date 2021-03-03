import React from 'react';
import Popup from "reactjs-popup";
import { FaInfoCircle } from 'react-icons/fa';

export class Help extends React.Component {
    constructor(props) {
        super(props);
    }

    getShorterMessage() {
        let message = this.props.message;
        if (Array.isArray(message)) message = message[0].props.children; //We sent an array of "p"

        if (message.length > 100) {
            message = message.substring(0, 100) + "...";
        }

        return message;
    }

    //Changer klik hier avec un nom raccourcis et ... si trop grand
    //G103 : Auditieve en mondelinge boodschappen avec i-bouton au lieu du label

    render() {
        return (
            <span className="clickable" style={{"font-weight": "normal"}}>
                <Popup
                    trigger={<FaInfoCircle data-tip={this.getShorterMessage()} />}
                    modal
                    closeOnDocumentClick
                >
                    <div className="modal-tooltip">
                        <div className="header"> Help </div>
                        <div className="content">
                            {this.props.message}
                        </div>
                    </div>
                </Popup>
            </span>
        );
    }
}

export default Help;