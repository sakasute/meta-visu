import React, { Component } from 'react';
import RegisterPanel from './RegisterPanel/RegisterPanel';
import TimelineTreeCard from './TimelineTreeCard/TimelineTreeCard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleRegisterAdminBtnClick = this.handleRegisterAdminBtnClick.bind(this);
    this.data = {};
    this.state = {
      filenames: [],
      visualizations: {},
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
        Promise.all(filenames.map(filename => fetch(`/data/${filename}`).then(res => res.json())))
          .then((jsons) => {
            jsons.forEach((json, i) => {
              data[filenamesArr[i]] = json;
            });
          })
          .then(() => {
            this.data = data;
            this.setState({ filenames });
          });
      });
  }

  handleRegisterAdminBtnClick(event) {
    // TODO:
  }

  render() {
    const { filenames } = this.state;
    const timelineTreeCards = filenames
      .sort()
      .map(filename => (
        <TimelineTreeCard
          filename={filename}
          data={this.data[filename]}
          treeConfig={{}}
          timelineConfig={{}}
          key={filename}
        />
      ));
    return (
      <div>
        <RegisterPanel
          filenames={filenames}
          dataSets={Object.values(this.data)}
          handleAdminBtnClick={this.handleAdminBtnClick}
        />
        <div className="content-wrapper">
          <div className="sidebar-placeholder" />
          <main className="chart-area">{timelineTreeCards}</main>
        </div>
      </div>
    );
  }
}

export default App;
