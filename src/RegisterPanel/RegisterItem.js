import React from 'react';

function RegisterItem(props) {
  const { register, handleChange } = props;

  return (
    <li className="register__item">
      <input type="checkbox" onChange={handleChange} id={register.name} />
      <label htmlFor={register.name}>{register.name}</label>
    </li>
  );
}

export default RegisterItem;
