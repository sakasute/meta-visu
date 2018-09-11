import React, { Component } from 'react';
import NavItem from './NavItem';
import { compareByName } from '../helpers';

import './RegisterPanel.css';

class RegisterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSets, handleRegisterAdminBtnClick } = this.props;
    console.log(dataSets);
    const navItems = dataSets
      .sort((a, b) => compareByName(a, b))
      .map(data => (
        <NavItem key={data.name} adminData={data} handleBtnClick={handleRegisterAdminBtnClick} />
      ));
    return (
      <aside className="nav">
        <ul className="nav__list">{navItems}</ul>
      </aside>
    );
  }
}

export default RegisterPanel;
