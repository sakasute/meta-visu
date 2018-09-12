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
    const { filterState, handleRegisterAdminBtnClick, handleRegisterSelection } = this.props;
    const navItems = Object.keys(filterState)
      .sort((a, b) => compareByName(filterState[a], filterState[b]))
      .map((filename) => {
        const filter = filterState[filename];
        return (
          <NavItem
            key={filename}
            filename={filename}
            filter={filter}
            handleRegisterAdminBtnClick={handleRegisterAdminBtnClick}
            handleRegisterSelection={handleRegisterSelection}
          />
        );
      });
    return (
      <aside className="nav">
        <ul className="nav__list">{navItems}</ul>
      </aside>
    );
  }
}

export default RegisterPanel;
