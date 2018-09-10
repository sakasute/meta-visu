import React, { Component } from 'react';
import RegisterPanel from './RegisterPanel/RegisterPanel';
import TimelineTreeCard from './TimelineTreeCard/TimelineTreeCard';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleAdminBtnClick = this.handleAdminBtnClick.bind(this);
    this.state = {
      filenames: [],
      data: {},
    };
  }

  componentDidMount() {
    // first get filenames, then get data from those files
    fetch('data/filenames.json')
      .then(res => res.json())
      .then(filenames => filenames.sort())
      .then((filenames) => {
        this.setState({ filenames });
        return filenames;
      })
      .then(filenames => filenames.forEach((filename) => {
        fetch(`data/${filename}`)
          .then(res => res.json())
          .then((registerData) => {
            const { data: prevData } = this.state;
            this.setState({
              data: {
                ...prevData,
                [filename]: registerData,
              },
            });
          });
      }));
  }

  handleAdminBtnClick(event) {
    // TODO:
  }

  render() {
    const { data } = this.state;
    const { filenames } = this.state;
    const timelineTreeCards = filenames.map(filename => (
      <TimelineTreeCard filename={filename} treeConfig={{}} timelineConfig={{}} key={filename} />
    ));
    return (
      <div>
        <RegisterPanel
          filenames={filenames}
          dataSets={Object.values(data)}
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
