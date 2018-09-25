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
    const {
      filterState,
      handleRegisterAdminBtnClick,
      handleRegisterSelection,
      lang,
      handleLangSelect,
    } = this.props;
    const { isMinimized } = this.state;

    const classes = isMinimized ? 'nav nav--closed' : 'nav';
    const toggleBtnClasses = isMinimized
      ? 'nav__toggle-btn nav__toggle-btn--rotate'
      : 'nav__toggle-btn';

    const languageSelectors = ['en', 'fi'].map((langOpt) => {
      const langClasses = lang === langOpt
        ? 'nav__language-selector nav__language-selector--selected'
        : 'nav__language-selector';
      return (
        <button type="button" className={langClasses} key={langOpt} id={langOpt} onClick={handleLangSelect}>
          {langOpt}
        </button>
      );
    });

    const navItems = Object.keys(filterState)
      .sort((a, b) => compareByName(filterState[a], filterState[b], lang, {
        en: 'National Institute for Health and Welfare',
        fi: 'THL',
      }))
      .map((filename) => {
        const filter = filterState[filename];
        return (
          <NavItem
            lang={lang}
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
        <div className="nav__controls">
          <div className="nav__language-control">{languageSelectors}</div>
          <div className="nav-toggle">
            <button type="button" className={toggleBtnClasses} onClick={this.toggleMinimize}>
              <img src="assets/material-arrow_back.svg" alt="register panel toggle" />
            </button>
          </div>
        </div>

        <div className="nav__list-wrapper">
          <ul className="nav__list">{navItems}</ul>
        </div>
      </aside>
    );
  }
}

RegisterPanel.propTypes = {
  lang: PropTypes.string.isRequired,
  filterState: PropTypes.object.isRequired,
  handleRegisterAdminBtnClick: PropTypes.func.isRequired,
  handleRegisterSelection: PropTypes.func.isRequired,
  handleLangSelect: PropTypes.func.isRequired,
};

export default RegisterPanel;
