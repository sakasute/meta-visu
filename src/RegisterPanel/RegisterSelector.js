import React from 'react';
import PropTypes from 'prop-types';
import RegisterItem from './RegisterItem';
import { compareByName } from '../helpers';

function RegisterSelector({
  registerAdminName, registerFilter, show, handleCheckboxChange,
}) {
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

RegisterSelector.propTypes = {
  show: PropTypes.bool.isRequired,
  registerAdminName: PropTypes.string.isRequired,
  registerFilter: PropTypes.object.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default RegisterSelector;
