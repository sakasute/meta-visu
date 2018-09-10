import React, { Component } from 'react';
import RegisterPanel from './RegisterPanel/RegisterPanel';
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
    return (
      <div>
        <div className="sidebar-placeholder" />
        <RegisterPanel
          filenames={filenames}
          dataSets={Object.values(data)}
          handleAdminBtnClick={this.handleAdminBtnClick}
        />
        <main className="chart-area" />
      </div>
    );
  }
}

export default App;
