import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavItem from './NavItem';
import { compareByName } from '../helpers';

import './RegisterPanel.css';

class RegisterPanel extends Component {
  constructor(props) {
    super(props);
    this.toggleMinimize = this.toggleMinimize.bind(this);
    this.state = {
      isMinimized: false,
    };
  }

  toggleMinimize() {
    this.setState(prevState => ({ isMinimized: !prevState.isMinimized }));
  }

  render() {
    const { filterState, handleRegisterAdminBtnClick, handleRegisterSelection } = this.props;
    const { isMinimized } = this.state;

    const classes = isMinimized ? 'nav nav--closed' : 'nav';
    const toggleBtnClasses = isMinimized
      ? 'nav__toggle-btn nav__toggle-btn--rotate'
      : 'nav__toggle-btn';

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
      <aside className={classes}>
        <button type="button" className={toggleBtnClasses} onClick={this.toggleMinimize}>
          <img src="/assets/material-arrow_back.svg" alt="register panel toggle" />
        </button>
        <ul className="nav__list">{navItems}</ul>
      </aside>
    );
  }
}

RegisterPanel.propTypes = {
  filterState: PropTypes.object.isRequired,
  handleRegisterAdminBtnClick: PropTypes.func.isRequired,
  handleRegisterSelection: PropTypes.func.isRequired,
};

export default RegisterPanel;
