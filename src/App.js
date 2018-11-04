import React, { Component } from 'react';
import classNames from 'classnames';
import './App.scss';

import Monitor from './Monitor';

const LINKS = {
  Monitoring: 'monitoring',
  DataGeneration: 'data_generation'
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLink: LINKS.Monitoring
    }
  }

  navigate(target) {
    this.setState({ activeLink: target });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <nav className="nav flex-column col-2">
            <a className={classNames('nav-link', {'active': this.state.activeLink === LINKS.Monitoring})} onClick={() => this.navigate(LINKS.Monitoring)} href="#">Monitoring</a>
            <a className={classNames('nav-link', {'active': this.state.activeLink === LINKS.DataGeneration})} onClick={() => this.navigate(LINKS.DataGeneration)} href="#">Data Generation</a>
          </nav>
          <div className="col content">
            <Monitor />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
