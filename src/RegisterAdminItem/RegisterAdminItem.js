import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ToggleButton from "../ToggleButton/ToggleButton";
import RegisterItem from "../RegisterItem/RegisterItem";

//import { compareByName } from '../_js/helpers';

import "../_css/simpleList.css";
import "./RegisterAdminItem.css";

export default function RegisterAdminItem({
  fileFilter,
  filename,
  lang,
  toggleFileFilter,
  toggleRegisterFilter
}) {
  const registerFilter = fileFilter.registers;
  const registerItems = Object.keys(registerFilter)
    // .sort((a, b) => compareByName(registerFilter[a], registerFilter[b], lang))
    .map(registerName => (
      <RegisterItem
        lang={lang}
        key={`${fileFilter.name[lang]}/${registerName}`}
        filename={filename}
        toggleRegisterFilter={toggleRegisterFilter}
        register={registerFilter[registerName]}
      />
    ));

  const registerListClasses = classNames(
    "simpleList",
    "registerList__simpleList",
    {
      vanish: !fileFilter.isSelected
    }
  );

  return (
    <li className="simpleList__listItem">
      <ToggleButton
        isSelected={fileFilter.isSelected}
        mixClasses="simpleList__button"
        handleClick={() => toggleFileFilter(filename)}
        type="BASIC"
      >
        {fileFilter.name[lang]}
      </ToggleButton>
      <ul className={registerListClasses}>{registerItems}</ul>
    </li>
  );
}

RegisterAdminItem.propTypes = {
  lang: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  fileFilter: PropTypes.object.isRequired,
  toggleFileFilter: PropTypes.func.isRequired,
  toggleRegisterFilter: PropTypes.func.isRequired
};
