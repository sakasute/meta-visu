import React from 'react';
import PropTypes from 'prop-types';

function RegisterItem({ register, handleCheckboxChange }) {
  return (
    <li className="register__item">
      <input type="checkbox" onChange={handleCheckboxChange} id={register.name} defaultChecked />
      <label htmlFor={register.name}>{register.name}</label>
    </li>
  );
}

RegisterItem.propTypes = {
  register: PropTypes.object.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default RegisterItem;
