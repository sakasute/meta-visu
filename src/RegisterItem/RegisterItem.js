import React from 'react';
import PropTypes from 'prop-types';
import './RegisterItem.css';

function RegisterItem({
  lang, filename, register, toggleRegisterFilter,
}) {
  return (
    <li className="registerItem">
      <input
        id={register.name.en}
        type="checkbox"
        onChange={() => toggleRegisterFilter(filename, register.name.en)}
        checked={register.isSelected}
      />
      <label htmlFor={register.name.en}>{register.name[lang]}</label>
    </li>
  );
}

RegisterItem.propTypes = {
  lang: PropTypes.string.isRequired,
  register: PropTypes.object.isRequired,
  toggleRegisterFilter: PropTypes.func.isRequired,
};

export default RegisterItem;
