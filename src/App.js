import React, { Component } from 'react';
import classNames from 'classnames';
import './App.scss';

import Monitor from './Monitor';
import DataGeneration from './DataGeneration';
import AssetSelector from './AssetSelector';

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
    const content = this.state.activeLink === LINKS.Monitoring ? <Monitor /> : <DataGeneration />;
    return (
      <div className="container-fluid">
        <div className="row">
          <nav className="nav flex-column col-2">
            <a className={classNames('nav-link', {'active': this.state.activeLink === LINKS.Monitoring})} onClick={() => this.navigate(LINKS.Monitoring)} href="#"><span className="iconMdsp iconMdspspeedo2"> </span>Monitoring</a>
            <a className={classNames('nav-link', {'active': this.state.activeLink === LINKS.DataGeneration})} onClick={() => this.navigate(LINKS.DataGeneration)} href="#"><span className="iconMdsp iconMdsparrowCircleInverted"> </span>Data Generation</a>
          </nav>
          <AssetSelector className="col-2 col-sm-3"></AssetSelector>
          <div className="content flex-column col-8 col-sm-7">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
