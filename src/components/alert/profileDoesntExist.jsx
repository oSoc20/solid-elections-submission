import React from 'react';
import ShowAlert from './showAlert';

export default function ProfileDoesntExist() {
  return (
    <ShowAlert message="Your profile is not completed!" type="error" />
  );
}
