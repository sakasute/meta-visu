import React, { Component } from 'react';
import RegisterPanel from './RegisterPanel/RegisterPanel';
import TimelineTreeCard from './TimelineTreeCard/TimelineTreeCard';
import './App.css';
import { compareByName } from './helpers';

class App extends Component {
  constructor(props) {
    super(props);
    this.checkURLParams = this.checkURLParams.bind(this);
    this.handleLangSelect = this.handleLangSelect.bind(this);
    this.initializeFilters = this.initializeFilters.bind(this);
    this.toggleFileFilter = this.toggleFileFilter.bind(this);
    this.toggleRegisterFilter = this.toggleRegisterFilter.bind(this);
    this.data = {};
    this.state = {
      dataset: 'finnish-birth-cohort',
      lang: 'fi',
      filenames: [],
      filters: {},
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
    const { dataset } = this.checkURLParams(url);

    const data = {};
    let filenamesArr = [];
    // first get filenames, then get data from those files
    fetch(`data/${dataset}/filenames.json`)
      .then(res => res.json())
      .then((filenames) => {
        filenamesArr = filenames;
        Promise.all(
          filenames.map(filename => fetch(`data/${dataset}/${filename}`).then(res => res.json())),
        )
          .then((jsons) => {
            jsons.forEach((json, i) => {
              data[filenamesArr[i]] = json;
            });
          })
          .then(() => {
            this.data = data;
            this.initializeFilters(filenames);
          });
      });
  }

  checkURLParams(url) {
    const langParam = url.searchParams.get('lang');
    const datasetParam = url.searchParams.get('ds');
    let { lang, dataset } = this.state;
    // defaults
    if (['en', 'fi'].includes(langParam)) {
      lang = langParam;
    }
    if (!['finnish-birth-cohort', 'psycohorts'].includes(datasetParam)) {
      dataset = datasetParam;
    }
    this.setState({ lang, dataset });
    window.history.pushState(null, '', `?lang=${lang}&ds=${dataset}`); // just changes the url to reflect the state
    return { lang, dataset };
  }

  handleLangSelect(event) {
    const newLang = event.target.id;
    const { dataset } = this.state;
    this.setState({ lang: newLang });
    window.history.pushState(null, '', `?lang=${newLang}&ds=${dataset}`); // just changes the url to reflect the state
  }

  initializeFilters(filenames) {
    const filters = {};
    filenames.forEach((filename) => {
      filters[filename] = {
        name: this.data[filename].name,
        isSelected: false,
        registers: {},
      };
      this.data[filename].registers.forEach((register) => {
        filters[filename].registers[register.name.en] = {
          name: register.name,
          isSelected: true,
        };
      });
    });
    this.setState({ filenames, filters });
  }

  // NOTE: this is damn ugly but this is the way to update nested state without external library
  // and without making a deep copy of the whole object
  toggleFileFilter(filename) {
    this.setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [filename]: {
          ...prevState.filters[filename],
          isSelected: !prevState.filters[filename].isSelected,
        },
      },
    }));
  }

  toggleRegisterFilter(filename, registerName) {
    this.setState(prevState => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [filename]: {
          ...prevState.filters[filename],
          registers: {
            ...prevState.filters[filename].registers,
            [registerName]: {
              ...prevState.filters[filename].registers[registerName],
              isSelected: !prevState.filters[filename].registers[registerName].isSelected,
            },
          },
        },
      },
    }));
  }

  render() {
    const {
      filenames, filters, lang, infoMsg,
    } = this.state;

    const timelineTreeCards = filenames
      .map(filename => ({ filename, name: filters[filename].name }))
      .sort((a, b) => compareByName(a, b, lang, { en: 'National Institute for Health and Welfare', fi: 'THL' }))
      .map((nameObj) => {
        const { filename } = nameObj;
        const fileFilter = filters[filename];
        return (
          <TimelineTreeCard
            lang={lang}
            show={filters[filename].isSelected}
            filename={filename}
            data={this.data[filename]}
            fileFilter={fileFilter}
            treeConfig={{ lang }}
            timelineConfig={{ lang }}
            key={filename}
          />
        );
      });

    return (
      <div>
        <RegisterPanel
          lang={lang}
          filterState={filters}
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
      </div>
    );
  }
}

export default App;
