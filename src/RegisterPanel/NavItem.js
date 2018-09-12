import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RegisterSelector from './RegisterSelector';

class NavItem extends Component {
  constructor(props) {
    super(props);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleRegisterSelection = this.handleRegisterSelection.bind(this);
    this.state = {
      isSelected: false,
      selectedRegisters: {},
    };
  }

  handleBtnClick(event) {
    const { handleRegisterAdminBtnClick, filename } = this.props;
    const { isSelected } = this.state;
    this.setState({ isSelected: !isSelected });
    handleRegisterAdminBtnClick(filename);
  }

  handleRegisterSelection(event) {
    const { filename, handleRegisterSelection: handleRegisterSelectionParent } = this.props;
    const { selectedRegisters } = { ...this.state };
    const registerName = event.target.id;
    const isSelected = event.target.checked;
    selectedRegisters[registerName] = isSelected;
    this.setState({ selectedRegisters });
    handleRegisterSelectionParent(filename, registerName);
  }

  render() {
    const { isSelected } = this.state;
    const { adminData } = this.props;
    const btnClass = isSelected ? 'btn btn--selected' : 'btn';

    return (
      <li className="nav__item">
        <button
          type="button"
          id={adminData.name}
          className={btnClass}
          onClick={this.handleBtnClick}
        >
          {adminData.name}
        </button>
        <RegisterSelector
          show={isSelected}
          adminName={adminData.name}
          registers={adminData.registers}
          handleRegisterSelection={this.handleRegisterSelection}
        />
      </li>
    );
  }
}

export default NavItem;
