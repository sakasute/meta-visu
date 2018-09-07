import React from 'react';
import RegisterItem from './RegisterItem';

function RegisterSelector(props) {
  const { adminName, registers } = props;
  const registerItems = registers.map(register => (
    <RegisterItem key={`${adminName}/${register.name}`} register={register} />
  ));

  return <ul className="register-selector">{registerItems}</ul>;
}

export default RegisterSelector;
