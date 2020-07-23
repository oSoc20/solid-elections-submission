import React from 'react';
import { LoginButton } from '@solid/react';

export default function NotConnected() {
  return (
    //Can't use showAlert because we use LoginButton
    <div className="vl-alert vl-alert--error" role="alert">
        <div className="vl-alert__icon">
            <i className="vl-icon vl-vi vl-vi-alert-triangle-filled" aria-hidden="true"></i>
        </div>
        <div className="vl-alert__content">
            <p className="vl-alert__title">Opgelet!</p>
            <div className="vl-alert__message">
                <p>U bent niet verbonden! Log <LoginButton popup="popup.html">hier</LoginButton> in!</p>
            </div>
        </div>
    </div>
  );
}