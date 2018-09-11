import React, { Component } from 'react';
import RegisterPanel from './RegisterPanel/RegisterPanel';
import TimelineTreeCard from './TimelineTreeCard/TimelineTreeCard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.toggleAdminFilter = this.toggleAdminFilter.bind(this);
    this.data = {};
    this.state = {
      filenames: [],
      filters: {},
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
            const filters = {};
            filenames.forEach((filename) => {
              filters[filename] = { show: false };
            });
            this.setState({ filenames, filters });
          });
      });
  }

  toggleAdminFilter(filename) {
    const { filters } = { ...this.state };
    filters[filename].show = !filters[filename].show;
    this.setState({ filters });
  }

  render() {
    const { filenames, filters } = this.state;
    const timelineTreeCards = filenames
      .filter(filename => filters[filename].show)
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
          dataSets={Object.keys(this.data).map(filename => ({
            filename,
            data: this.data[filename],
          }))}
          handleAdminBtnClick={this.toggleAdminFilter}
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
