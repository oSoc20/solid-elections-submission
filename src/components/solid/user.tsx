import React from 'react';
import { Value } from '@solid/react';

const SolidUserData: React.FC = () => {
  return (
      <>
        <h1>Data about <Value src="user.name"/></h1>
        <ul>
            <li>Email :  <Value src="user.email"/></li>
        </ul>
      </>
  );
};

export default SolidUserData;