import React from 'react';

export default function ProfileDoesntExist() {
  return (
    <div className="vl-alert vl-alert--error" role="alert">
        <div className="vl-alert__icon">
            <i className="vl-icon vl-vi vl-vi-alert-triangle-filled" aria-hidden="true"></i>
        </div>
        <div className="vl-alert__content">
            <p className="vl-alert__title">Opgelet!</p>
            <div className="vl-alert__message">
                <p>Your profile is not completed!</p>
            </div>
        </div>
    </div>
  );
}
