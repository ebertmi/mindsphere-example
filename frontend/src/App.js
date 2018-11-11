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

    this.onChangeTarget = this.onChangeTarget.bind(this);

    this.state = {
      activeLink: LINKS.Monitoring,
      target: null
    }
  }

  /**
   * Update target: asset-aspect ids
   *
   * @param {object} target with "assetId" and "aspectId" properties
   * @memberof App
   */
  onChangeTarget(target) {
    this.setState({
      target: target
    });
  }

  navigate(target) {
    this.setState({ activeLink: target });
  }

  render() {
    const content = this.state.activeLink === LINKS.Monitoring ? <Monitor target={this.state.target} /> : <DataGeneration target={this.state.target} />;
    const monitoringLinkClasses = classNames('nav-link', {'active': this.state.activeLink === LINKS.Monitoring});
    const datagenerationLinkClasses = classNames('nav-link', {'active': this.state.activeLink === LINKS.DataGeneration});

    return (
      <div className="container-fluid">
        <div className="row">
          <nav className="nav flex-column col-1 col-sm-1">
            <a className={monitoringLinkClasses} onClick={() => this.navigate(LINKS.Monitoring)} href="#">
              <span className="iconMdsp iconMdspspeedo2"></span>
              <br />
              <small>Monitoring</small>
            </a>
            <a className={datagenerationLinkClasses} onClick={() => this.navigate(LINKS.DataGeneration)} href="#">
              <span className="iconMdsp iconMdsparrowCircleInverted"></span>
              <br />
              <small>Simulation</small>
            </a>
          </nav>
          <AssetSelector className="col-2 col-sm-3" onChangeTarget={this.onChangeTarget} />
          <div className="content flex-column d-flex col-9 col-sm-8">
            {content}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
