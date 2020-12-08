import React from 'react';
import { LoginButton } from '@solid/react';
import ShowAlert from './showAlert';
import { useTranslation } from 'react-i18next';

export default function NotConnected(props) {

  const { t } = useTranslation(["alert"]);

  return (
    <ShowAlert type="error">
      <>
        {t('You are not connected')}! 
        <LoginButton popup="https://osoc20.github.io/solid-elections-submission/popup.html">
          {t('Log in here')}!
        </LoginButton>
      </>
    </ShowAlert>
  );
};