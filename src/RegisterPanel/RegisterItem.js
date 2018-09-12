import React from 'react';

function RegisterItem(props) {
  const { register, handleCheckboxChange } = props;

  return (
    <li className="register__item">
      <input type="checkbox" onChange={handleCheckboxChange} id={register.name} defaultChecked />
      <label htmlFor={register.name}>{register.name}</label>
    </li>
  );
}

export default RegisterItem;
