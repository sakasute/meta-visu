import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RegisterAdminItem from '../RegisterAdminItem/RegisterAdminItem';
import { compareByName } from '../_js/helpers';

import '../_css/simpleList.css';
import '../_css/card.css';
import './SidePanel.css';

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

    const classes = isMinimized
      ? 'card card--strongShadow sidePanel sidePanel--closed'
      : 'card card--strongShadow sidePanel';
    const toggleBtnClasses = isMinimized
      ? 'sidePanel__toggleControl sidePanel__toggleControl--rotate'
      : 'sidePanel__toggleControl';

    const languageSelectors = ['en', 'fi'].map((langOpt) => {
      const langClasses = lang === langOpt
        ? 'sidePanel__langSelector sidePanel__langSelector--selected'
        : 'sidePanel__langSelector';
      return (
        <button
          type="button"
          className={langClasses}
          key={langOpt}
          id={langOpt}
          onClick={handleLangSelect}
        >
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
          <RegisterAdminItem
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
        <div className="sidePanel__controls">
          <div className="sidePanel__langControls">{languageSelectors}</div>

          <button type="button" className={toggleBtnClasses} onClick={this.toggleMinimize}>
            <img src="assets/material-arrow_back.svg" alt="register panel toggle" />
          </button>
        </div>

        <ul className="simpleList sidePanel__simpleList">{navItems}</ul>
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
