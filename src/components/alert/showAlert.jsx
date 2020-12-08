import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ShowAlert(props) {

    const { t } = useTranslation(["alert"]);

    let title = "!";
    if (props.type == "error") {
        title = t('Error') + title;
    } else if (props.type == "success") {
        title = t('Success') + title;
    }

    return (
        <div className={"vl-alert vl-alert--" + props.type} role="alert">
            <div className="vl-alert__icon">
                <i className="vl-icon vl-vi vl-vi-alert-triangle-filled" aria-hidden="true"></i>
            </div>
            <div className="vl-alert__content">
                <p className="vl-alert__title">
                    {title}
                </p>
                <div className="vl-alert__message">
                    <p>{props.children}</p>
                </div>
            </div>
        </div>
    );
};