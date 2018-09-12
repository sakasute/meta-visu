import React from 'react';
import RegisterItem from './RegisterItem';
import { compareByName } from '../helpers';

function RegisterSelector(props) {
  const {
    adminName, registers, show, handleRegisterSelection,
  } = props;

  const registerItems = registers
    .sort((a, b) => compareByName(a, b))
    .map(register => (
      <RegisterItem
        key={`${adminName}/${register.name}`}
        handleChange={handleRegisterSelection}
        register={register}
      />
    ));

  const selectorClass = show ? 'register-selector' : 'register-selector vanish';

  return <ul className={selectorClass}>{registerItems}</ul>;
}

export default RegisterSelector;
