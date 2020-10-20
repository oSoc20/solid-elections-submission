import React from 'react';
import ShowAlert from './showAlert';
import { useTranslation } from 'react-i18next';

export default function ProfileDoesntExist() {

  const { t } = useTranslation(["alert"]);

  return (
    <ShowAlert type="error">
      <> {t('Your profile is not complete yet')}!</>
    </ShowAlert>
  );
}
