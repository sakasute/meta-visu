import React, { Component } from 'react';
import update from 'immutability-helper';
import SidePanel from '../SidePanel/SidePanel';
import TimelineTreeCard from '../TimelineTreeCard/TimelineTreeCard';
import './App.css';
import { compareByName } from '../_js/helpers';

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

  /*
  keywords = {'lang1': [String], 'lang2', [String]...}
  */
  static initializeKeywordFilter(keywords) {
    const keywordFilter = {};
    Object.keys(keywords).forEach((lang) => {
      keywordFilter[lang] = {};
      keywords[lang].forEach((keyword) => {
        keywordFilter[lang][keyword] = { isSelected: false };
      });
    });

    return keywordFilter;
  }

  static initializeRegisters(registrarData, isSelected = true, registerDetailsIsSelected = true) {
    const registers = {};
    registrarData.registers.forEach((register) => {
      registers[register.name.en] = {
        name: { ...register.name },
        isSelected,
        keywords: { ...register.keywords },
        registerDetails: this.initializeRegisterDetails(register, registerDetailsIsSelected),
      };
    });
    return registers;
  }

  static initializeRegisterDetails(registerData, isSelected = true) {
    const registerDetails = {};
    registerData.registerDetails.forEach((registerDetail) => {
      registerDetails[registerDetail.name.en] = {
        name: { ...registerDetail.name },
        isSelected,
        keywords: { ...registerDetail.keywords },
      };
    });
    return registerDetails;
  }

  constructor(props) {
    super(props);
    this.selectLang = this.selectLang.bind(this);
    this.updateTreeFilterWithKeyword = this.updateTreeFilterWithKeyword.bind(this);
    this.toggleCohortFilter = this.toggleCohortFilter.bind(this);
    this.toggleFileFilter = this.toggleFileFilter.bind(this);
    this.toggleKeywordFilter = this.toggleKeywordFilter.bind(this);
    this.toggleRegisterFilter = this.toggleRegisterFilter.bind(this);
    this.data = {};
    this.keywords = {};
    this.filenames = [];
    this.state = {
      dataset: '',
      lang: '',
      cohortFilter: {},
      keywordFilter: { en: [], fi: [] },
      treeFilter: {},
      treeConfig: {},
      timelineConfig: {},
      infoMsg: {
        en:
          'Please select which register adminstrators you want to view from the panel on the left.',
        fi: 'Valitse haluttu rekisteriylläpitäjä paneelista vasemmalla.',
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
        this.data = dataBundle.data;
        this.filenames = Object.keys(this.data);
        this.keywords = dataBundle.keywords;
        const keywordFilter = this.constructor.initializeKeywordFilter(dataBundle.keywords);
        const treeFilter = this.initializeTreeFilter(this.filenames);
        this.setState({
          cohortFilter,
          dataset,
          keywordFilter,
          treeFilter,
          lang,
          timelineConfig,
        });
      });
  }

  selectLang(lang) {
    const { dataset } = this.state;
    this.setState({ lang });
    // NOTE: update URL without reloading the page
    window.history.pushState(null, '', `?lang=${lang}&ds=${dataset}`); // just changes the url to reflect the state
  }

  initializeTreeFilter(filenames, isSelected = true) {
    const treeFilter = {};
    filenames.forEach((filename) => {
      treeFilter[filename] = {
        name: { ...this.data[filename].name },
        isSelected: false,
        keywords: { ...this.data[filename].keywords },
        registers: this.constructor.initializeRegisters(this.data[filename], isSelected),
      };
    });
    return treeFilter;
  }

  // NOTE: using immutability-helper to help updating nested states
  toggleFileFilter(filename) {
    this.setState(prevState => update(prevState, {
      treeFilter: { [filename]: { isSelected: { $apply: val => !val } } },
    }));
  }

  toggleRegisterFilter(filename, registerName) {
    const { treeFilter } = this.state;
    const registerFilter = treeFilter[filename].registers[registerName];
    const resetKeywordFilter = this.constructor.initializeKeywordFilter(this.keywords);

    const registerData = this.data[filename].registers.filter(
      register => registerName === register.name.en,
    )[0];

    // FIXME: yhä joku ongelma: avainsanojen jälkeen rekisterin valinta ei nollaa filtteröityjä detailseja
    const resetRegisterDetailsFilter = this.constructor.initializeRegisterDetails(registerData);

    const updatedRegisterFilter = {
      ...registerFilter,
      isSelected: !registerFilter.isSelected,
      registerDetails: resetRegisterDetailsFilter,
    };
    this.setState(prevState => update(prevState, {
      treeFilter: {
        [filename]: {
          registers: {
            [registerName]: {
              $set: updatedRegisterFilter,
            },
          },
        },
      },
      keywordFilter: { $set: resetKeywordFilter },
    }));
  }

  toggleCohortFilter(cohort) {
    this.setState(prevState => update(prevState, {
      cohortFilter: { [cohort]: { isSelected: { $apply: val => !val } } },
    }));
  }

  toggleKeywordFilter(keyword) {
    const { lang, keywordFilter } = this.state;
    const keywordIsSelected = keywordFilter[lang][keyword].isSelected;
    const toggleKeywordIsSelected = !keywordIsSelected;
    // set all keywords as unselected
    Object.keys(keywordFilter[lang]).forEach((keywordKey) => {
      keywordFilter[lang][keywordKey].isSelected = false;
    });
    // set the clicked keyword with updated value
    const updatedKeywordFilter = update(keywordFilter, {
      [lang]: { [keyword]: { isSelected: { $set: toggleKeywordIsSelected } } },
    });
    const updatedTreeFilter = this.updateTreeFilterWithKeyword(keyword, toggleKeywordIsSelected);
    this.setState({
      keywordFilter: updatedKeywordFilter,
      treeFilter: updatedTreeFilter,
    });
  }

  // FIXME: quite an ugly function
  updateTreeFilterWithKeyword(keyword, keywordIsSelected) {
    const { lang } = this.state;
    if (!keywordIsSelected) {
      return this.initializeTreeFilter(this.filenames);
    }
    const updatedTreeFilter = this.initializeTreeFilter(this.filenames, false);
    Object.keys(updatedTreeFilter).forEach((filename) => {
      const registrar = updatedTreeFilter[filename];
      const registrarKeywordFound = registrar.keywords[lang].includes(keyword);
      registrar.isSelected = registrarKeywordFound;
      if (registrarKeywordFound) {
        Object.keys(registrar.registers).forEach((registerName) => {
          const register = registrar.registers[registerName];
          const registerKeywordFound = register.keywords[lang].includes(keyword);
          register.isSelected = registerKeywordFound;
          if (registerKeywordFound) {
            Object.keys(register.registerDetails).forEach((detailName) => {
              const registerDetail = register.registerDetails[detailName];
              const registerDetailKeywordFound = registerDetail.keywords[lang].includes(keyword);
              registerDetail.isSelected = registerDetailKeywordFound;
            });
          }
        });
      }
    });
    return updatedTreeFilter;
  }

  render() {
    const {
      cohortFilter,
      keywordFilter,
      treeFilter,
      lang,
      infoMsg,
      treeConfig,
      timelineConfig,
    } = this.state;

    if (this.data['National Institute for Health and Welfare.json']) {
      console.log(
        'app-render',
        this.data['National Institute for Health and Welfare.json'].registers[1].registerDetails,
      );
    }

    const timelineTreeCards = this.filenames
      .map(filename => ({ filename, name: treeFilter[filename].name }))
      // .sort((a, b) => compareByName(a, b, lang, { en: 'National Institute for Health and Welfare', fi: 'THL' }))
      .map((nameObj) => {
        const { filename } = nameObj;
        const fileFilter = treeFilter[filename];
        return (
          <TimelineTreeCard
            lang={lang}
            show={treeFilter[filename].isSelected}
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
          keywordFilter={keywordFilter}
          treeFilter={treeFilter}
          selectLang={this.selectLang}
          toggleCohortFilter={this.toggleCohortFilter}
          toggleFileFilter={this.toggleFileFilter}
          toggleKeywordFilter={this.toggleKeywordFilter}
          toggleRegisterFilter={this.toggleRegisterFilter}
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
