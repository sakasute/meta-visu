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
    const { dataSets, handleRegisterAdminBtnClick, handleRegisterSelection } = this.props;
    const navItems = dataSets
      // FIXME: sort
      .map(dataObj => (
        <NavItem
          key={dataObj.filename}
          filename={dataObj.filename}
          adminData={dataObj.data}
          handleRegisterAdminBtnClick={handleRegisterAdminBtnClick}
          handleRegisterSelection={handleRegisterSelection}
        />
      ));
    return (
      <aside className="nav">
        <ul className="nav__list">{navItems}</ul>
      </aside>
    );
  }
}

export default RegisterPanel;
