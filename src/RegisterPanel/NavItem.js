import React, { Component } from 'react';

import RegisterSelector from './RegisterSelector';

class NavItem extends Component {
  constructor(props) {
    super(props);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleRegisterSelection = this.handleRegisterSelection.bind(this);
    this.state = {
      selected: false,
      selectedRegisters: {},
    };
  }

  handleBtnClick() {
    const { selected } = this.state;
    this.setState({ selected: !selected });
  }

  handleRegisterSelection(event) {
    const { selectedRegisters } = { ...this.state };
    const registerName = event.target.id;
    const selected = event.target.checked;
    selectedRegisters[registerName] = selected;
    this.setState({ selectedRegisters });
  }

  render() {
    const { selected } = this.state;
    const { adminData, handleAdminBtnClick } = this.props;
    const btnClass = selected ? 'btn btn--selected' : 'btn';

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
          show={selected}
          adminName={adminData.name}
          registers={adminData.registers}
          handleRegisterSelection={this.handleRegisterSelection}
        />
      </li>
    );
  }
}

export default NavItem;
