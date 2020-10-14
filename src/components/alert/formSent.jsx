import React from 'react';
import ShowAlert from './showAlert';
import { useTranslation } from 'react-i18next';

export default function FormSent() {

    const { t } = useTranslation(["alert"]);

    return (
        <ShowAlert type="success">
            {t('Your form has been sent')}!
        </ShowAlert>
    );
}