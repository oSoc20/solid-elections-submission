import React from 'react';
import ShowAlert from './showAlert';

export default function ProfileDoesntExist() {
  return (
    <ShowAlert message="Uw profiel is niet compleet!" type="error" />
  );
}
