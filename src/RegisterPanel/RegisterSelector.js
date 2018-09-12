import React from 'react';
import RegisterItem from './RegisterItem';
import { compareByName } from '../helpers';

function RegisterSelector(props) {
  const {
    registerAdminName, registerFilter, show, handleCheckboxChange,
  } = props;

  const registerItems = Object.keys(registerFilter)
    .sort((a, b) => compareByName(registerFilter[a], registerFilter[b]))
    .map(registerName => (
      <RegisterItem
        key={`${registerAdminName}/${registerName}`}
        handleCheckboxChange={handleCheckboxChange}
        register={registerFilter[registerName]}
      />
    ));

  const selectorClass = show ? 'register-selector' : 'register-selector vanish';

  return <ul className={selectorClass}>{registerItems}</ul>;
}

export default RegisterSelector;
