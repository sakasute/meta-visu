import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filenames: [],
    };
  }

  componentDidMount() {
    fetch('data/filenames.json')
      .then(res => res.json())
      .then(filenames => filenames.sort())
      .then(filenames => this.setState({ filenames }));
  }

  render() {
    const { filenames } = this.state;
    const filenameLis = filenames.map(filename => <li key>{filename}</li>);
    return (
      <div>
        <ul>{filenameLis}</ul>
        <div className="sidebar-placeholder" />
        <main className="chart-area" />
      </div>
    );
  }
}

export default App;
