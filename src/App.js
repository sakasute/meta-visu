import React, { Component } from 'react';
import RegisterPanel from './RegisterPanel/RegisterPanel';
import TimelineTreeCard from './TimelineTreeCard/TimelineTreeCard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.toggleFileFilter = this.toggleFileFilter.bind(this);
    this.toggleRegisterFilter = this.toggleRegisterFilter.bind(this);
    this.handleLangSelect = this.handleLangSelect.bind(this);
    this.data = {};
    this.state = {
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
    const data = {};
    let filenamesArr = [];
    // first get filenames, then get data from those files
    fetch('data/filenames.json')
      .then(res => res.json())
      .then((filenames) => {
        filenamesArr = filenames;
        Promise.all(filenames.map(filename => fetch(`data/${filename}`).then(res => res.json())))
          .then((jsons) => {
            jsons.forEach((json, i) => {
              data[filenamesArr[i]] = json;
            });
          })
          .then(() => {
            this.data = data;
            // Initialize the filterState
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
          });
      });
  }

  handleLangSelect(event) {
    this.setState({ lang: event.target.id });
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
      .sort((a, b) => {
        const forcedFirstStr = 'National Institute for Health and Welfare.json';
        if (a === forcedFirstStr) {
          return -1;
        }
        if (b === forcedFirstStr) {
          return 1;
        }
        return 0;
      })
      .map((filename) => {
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
