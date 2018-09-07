import React from 'react';

function RegisterItem(props) {
  const { register } = props;

  return (
    <li className="register__item">
      <input type="checkbox" id={register.name} />
      <label htmlFor={register.name}>{register.name}</label>
    </li>
  );
}

export default RegisterItem;
