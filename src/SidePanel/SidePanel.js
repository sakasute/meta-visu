import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RegisterAdminItem from '../RegisterAdminItem/RegisterAdminItem';
import CohortItem from '../CohortItem/CohortItem';
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
      selectedCohorts: {},
    };
  }

  toggleMinimize() {
    this.setState(prevState => ({ isMinimized: !prevState.isMinimized }));
  }

  render() {
    const {
      cohortFilter,
      filterState,
      handleCohortBtnClick,
      handleRegisterAdminBtnClick,
      handleRegisterSelection,
      handleLangSelect,
      lang,
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

    const cohortSelectors = Object.values(cohortFilter).map(cohort => (
      <CohortItem
        selected={cohort.isSelected}
        name={cohort.name}
        handleClick={handleCohortBtnClick}
      />
    ));

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
          <div className="sidePanel__controlsRow">
            <div className="sidePanel__langControls">{languageSelectors}</div>
            <button type="button" className={toggleBtnClasses} onClick={this.toggleMinimize}>
              <img src="assets/material-arrow_back.svg" alt="register panel toggle" />
            </button>
          </div>
          <div className="sidePanel__controlsRow">
            <div>{cohortSelectors}</div>
          </div>
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
