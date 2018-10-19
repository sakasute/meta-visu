import React from 'react';
import PropTypes from 'prop-types';
import RegisterItem from '../RegisterItem/RegisterItem';
import { compareByName } from '../_js/helpers';

import '../_css/simpleList.css';
import './RegisterList.css';

function RegisterSelector({
  lang, registerAdminName, registerFilter, show, handleCheckboxChange,
}) {
  const registerItems = Object.keys(registerFilter)
    .sort((a, b) => compareByName(registerFilter[a], registerFilter[b], lang))
    .map(registerName => (
      <RegisterItem
        lang={lang}
        key={`${registerAdminName}/${registerName}`}
        handleCheckboxChange={handleCheckboxChange}
        register={registerFilter[registerName]}
      />
    ));

  const selectorClass = show
    ? 'simpleList registerList__simpleList'
    : 'simpleList registerList__simpleList vanish';

  return <ul className={selectorClass}>{registerItems}</ul>;
}

RegisterSelector.propTypes = {
  lang: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  registerAdminName: PropTypes.string.isRequired,
  registerFilter: PropTypes.object.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default RegisterSelector;
