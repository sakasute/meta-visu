import React, { Component } from 'react';
import NavItem from './NavItem';

import './RegisterPanel.css';

class RegisterPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSets } = this.props;

    const navItems = dataSets.map(data => <NavItem key={data.name} adminData={data} />);
    return (
      <aside className="nav">
        <ul className="nav__list">{navItems}</ul>
      </aside>
    );
  }
}

export default RegisterPanel;
