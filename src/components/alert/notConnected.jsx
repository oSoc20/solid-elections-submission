import React from 'react';
import { LoginButton } from '@solid/react';
import ShowAlert from './showAlert';

export default class NotConnected extends React.Component {
  //getMessage because we can't send directly texte + component + text to showAlert message, so we call this function into it
  getMessage() {
    return (
      <>
        U bent niet verbonden! <LoginButton popup="https://osoc20.github.io/solid-elections-submission/popup.html">Log hier in</LoginButton>!
      </>
    );
  }

  render() {
    return (
      <ShowAlert message={this.getMessage()} type="error" />
    );
  }
}