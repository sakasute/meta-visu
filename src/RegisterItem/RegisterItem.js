import React from 'react';
import PropTypes from 'prop-types';
import './RegisterItem.css';

function RegisterItem({ lang, register, handleCheckboxChange }) {
  return (
    <li className="registerItem">
      <input type="checkbox" onChange={handleCheckboxChange} id={register.name.en} defaultChecked />
      <label htmlFor={register.name.en}>{register.name[lang]}</label>
    </li>
  );
}

RegisterItem.propTypes = {
  lang: PropTypes.string.isRequired,
  register: PropTypes.object.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default RegisterItem;
