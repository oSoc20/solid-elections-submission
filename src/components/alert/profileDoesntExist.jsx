import React from 'react';
import ShowAlert from './showAlert';

export default function ProfileDoesntExist() {
  return (
    <ShowAlert type="error">
      <> Uw profiel is niet compleet!</>
    </ShowAlert>
  );
}
