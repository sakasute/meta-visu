import React, { Component } from 'react';
import SidePanel from '../SidePanel/SidePanel';
import TimelineTreeCard from '../TimelineTreeCard/TimelineTreeCard';
import './App.css';
import { compareByName } from '../_js/helpers';
import update from 'immutability-helper';

class App extends Component {
  static checkURLParams(url) {
    const langParam = url.searchParams.get('lang');
    const datasetParam = url.searchParams.get('ds');
    let lang = langParam || 'fi';
    let dataset = datasetParam || 'finnish-birth-cohorts';
    // defaults
    if (['en', 'fi'].includes(langParam)) {
      lang = langParam;
    }
    if (['finnish-birth-cohorts', 'psycohorts'].includes(datasetParam)) {
      dataset = datasetParam;
    }
    window.history.pushState(null, '', `?lang=${lang}&ds=${dataset}`); // just changes the url to reflect the state
    return { lang, dataset };
  }

  static initializeCohortFilter(cohorts) {
    const cohortFilter = {};
    cohorts.forEach((cohort) => {
      cohortFilter[cohort] = { isSelected: true, name: cohort };
    });
    return cohortFilter;
  }

  static initializeConfigs(dataset) {
    let timelineConfig = {};
    switch (dataset) {
      case 'finnish-birth-cohorts':
        timelineConfig = {
          cohorts: ['1987', '1997'],
          scaleStartDate: new Date('1987-01-01'),
        };
        break;
      case 'psycohorts':
        timelineConfig = {
          cohorts: ['1966', '1986', '1987', '1997'],
          scaleStartDate: new Date('1966-01-01'),
        };
        break;

      default:
        console.log('Given dataset was not found!');
    }
    return timelineConfig;
  }

  constructor(props) {
    super(props);
    this.handleLangSelect = this.handleLangSelect.bind(this);
    this.toggleCohortFilter = this.toggleCohortFilter.bind(this);
    this.toggleFileFilter = this.toggleFileFilter.bind(this);
    this.toggleRegisterFilter = this.toggleRegisterFilter.bind(this);
    this.data = {};
    this.state = {
      dataset: '',
      lang: '',
      filenames: [],
      cohortFilter: {},
      treeFilters: {},
      treeConfig: {},
      timelineConfig: {},
      infoMsg: {
        en:
          'Please select which register adminstrators you want to view from the panel on the left.',
        fi: 'Valitse haluttu rekisteriviranomainen paneelista vasemmalla.',
      },
    };
  }

  componentDidMount() {
    // get starting parameters/cofiguration from the url
    const url = new URL(window.location.href);
    const { dataset, lang } = this.constructor.checkURLParams(url);
    const timelineConfig = this.constructor.initializeConfigs(dataset, lang);
    const cohortFilter = this.constructor.initializeCohortFilter(timelineConfig.cohorts);

    fetch(`data/${dataset}/data_bundle.json`)
      .then(res => res.json())
      .then((dataBundle) => {
        this.data = dataBundle;
        const filenames = Object.keys(dataBundle);
        const treeFilters = this.initializeTreeFilters(filenames);
        this.setState({
          cohortFilter,
          dataset,
          filenames,
          treeFilters,
          lang,
          timelineConfig,
        });
      });
  }

  handleLangSelect(newLang) {
    const { dataset } = this.state;
    this.setState({ lang: newLang });
    window.history.pushState(null, '', `?lang=${newLang}&ds=${dataset}`); // just changes the url to reflect the state
  }

  initializeTreeFilters(filenames) {
    const treeFilters = {};
    filenames.forEach((filename) => {
      treeFilters[filename] = {
        name: this.data[filename].name,
        isSelected: false,
        registers: {},
      };
      this.data[filename].registers.forEach((register) => {
        treeFilters[filename].registers[register.name.en] = {
          name: register.name,
          isSelected: true,
        };
      });
    });
    return treeFilters;
  }

  // NOTE: using immutability-helper to help updating nested states
  toggleFileFilter(filename) {
    this.setState(prevState => update(prevState, {
      treeFilters: { [filename]: { isSelected: { $apply: val => !val } } },
    }));
  }

  toggleRegisterFilter(filename, registerName) {
    this.setState(prevState => update(prevState, {
      treeFilters: {
        [filename]: { registers: { [registerName]: { isSelected: { $apply: val => !val } } } },
      },
    }));
  }

  toggleCohortFilter(cohort) {
    this.setState(prevState => update(prevState, {
      cohortFilter: { [cohort]: { isSelected: { $apply: val => !val } } },
    }));
  }

  render() {
    const {
      cohortFilter,
      filenames,
      treeFilters,
      lang,
      infoMsg,
      treeConfig,
      timelineConfig,
    } = this.state;

    const timelineTreeCards = filenames
      .map(filename => ({ filename, name: treeFilters[filename].name }))
      .sort((a, b) => compareByName(a, b, lang, { en: 'National Institute for Health and Welfare', fi: 'THL' }))
      .map((nameObj) => {
        const { filename } = nameObj;
        const fileFilter = treeFilters[filename];
        return (
          <TimelineTreeCard
            lang={lang}
            show={treeFilters[filename].isSelected}
            filename={filename}
            data={this.data[filename]}
            cohortFilter={cohortFilter}
            fileFilter={fileFilter}
            treeConfig={{ ...treeConfig, lang }}
            timelineConfig={{ ...timelineConfig, lang }}
            key={filename}
          />
        );
      });

    return (
      <React.Fragment>
        <SidePanel
          lang={lang}
          cohortFilter={cohortFilter}
          filterState={treeFilters}
          handleCohortBtnClick={this.toggleCohortFilter}
          handleLangSelect={this.handleLangSelect}
          handleRegisterAdminBtnClick={this.toggleFileFilter}
          handleRegisterSelection={this.toggleRegisterFilter}
        />
        <div className="content-wrapper">
          <div className="sidebar-placeholder" />
          <main className="chart-area">
            <h2 className="info-header">{infoMsg[lang]}</h2>
            {timelineTreeCards}
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
