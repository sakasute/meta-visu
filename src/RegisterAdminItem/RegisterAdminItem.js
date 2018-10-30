import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RegisterSelector from '../RegisterList/RegisterList';
import ToggleButton from '../ToggleButton/ToggleButton';

import './RegisterAdminItem.css';

class NavItem extends Component {
  constructor(props) {
    super(props);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.state = {
      isSelected: false,
      selectedRegisters: {},
    };
  }

  handleBtnClick() {
    const { handleRegisterAdminBtnClick, filename } = this.props;
    this.setState(prevState => ({ isSelected: !prevState.isSelected }));
    handleRegisterAdminBtnClick(filename);
  }

  handleCheckboxChange(event) {
    const { filename, handleRegisterSelection } = this.props;
    const { selectedRegisters } = { ...this.state };
    const registerName = event.target.id;
    const isSelected = event.target.checked;
    selectedRegisters[registerName] = isSelected;
    this.setState({ selectedRegisters });
    handleRegisterSelection(filename, registerName);
  }

  render() {
    const { isSelected } = this.state;
    const { filter, lang } = this.props;

    return (
      <li>
        <ToggleButton
          isSelected={isSelected}
          mixClasses="simpleList__button"
          handleClick={() => this.handleBtnClick(filter.name.en)}
          type="BASIC"
        >
          {filter.name[lang]}
        </ToggleButton>
        <RegisterSelector
          lang={lang}
          show={isSelected}
          registerAdminName={filter.name[lang]}
          registerFilter={filter.registers}
          handleCheckboxChange={this.handleCheckboxChange}
        />
      </li>
    );
  }
}

NavItem.propTypes = {
  lang: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  filter: PropTypes.object.isRequired,
  handleRegisterAdminBtnClick: PropTypes.func.isRequired,
  handleRegisterSelection: PropTypes.func.isRequired,
};

export default NavItem;
