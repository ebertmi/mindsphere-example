import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";

import { timer } from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';

import './App.scss';
import Monitor from './Monitor';
import DataGeneration from './DataGeneration';
import AssetSelector from './AssetSelector';
import { keepAlive } from './service';
import { Modal, SessionModal } from './SessionModal';

const KEEP_ALIVE_INTERVAL = 60 * 1000; // 1 minute (see https://developer.mindsphere.io/concepts/concept-gateway-url-schemas.html#restrictions)

class App extends Component {
  constructor(props) {
    super(props);

    this.onChangeTarget = this.onChangeTarget.bind(this);

    this.state = {
      target: null,
      showSessionModal: false
    }
  }

  componentDidMount() {
    this.kaSubscripition = this.createKeepAliveSubscription();
  }

  componentWillUnmount() {
    if (this.kaSubscripition != null) {
      this.kaSubscripition.unsubscribe();
    }
  }

  /**
   * Creates simple keep alive interval which shows modal once MindSphere
   * responds with 401.
   *
   * @returns
   * @memberof App
   */
  createKeepAliveSubscription() {
    // Create keep alive stream, that shows modal dialog when re-login is required
    const kaSource = timer(0, KEEP_ALIVE_INTERVAL).pipe(
      concatMap(keepAlive),
      filter(val => val === false)
    );

    const kaSubscripition = kaSource.subscribe((val) => {
      this.setState({ showSessionModal: true });
      kaSubscripition.unsubscribe();
    });

    return kaSubscripition;
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

  renderSessionModal() {
    if (this.state.showSessionModal) {
      return (
        <Modal>
          <SessionModal onClose={e => this.setState({ showSessionModal: false })} onLogin={e => { window.location.reload() }} />
        </Modal>
      );
    }

    return null;
  }

  render() {
    return (
      <Router>
        <div className="container-fluid">
          <div className="row">
            <nav className="nav flex-column col-1 col-sm-1">
              <NavLink className="nav-link" to="/" exact>
                <span className="iconMdsp iconMdspspeedo2"></span>
                <br />
                <small>Monitoring</small>
              </NavLink>
              <NavLink className="nav-link" to="/simulation">
                <span className="iconMdsp iconMdsparrowCircleInverted"></span>
                <br />
                <small>Simulation</small>
              </NavLink>
            </nav>
            <AssetSelector className="col-2 col-sm-3" onChangeTarget={this.onChangeTarget} />
            <div className="content flex-column d-flex col-9 col-sm-8">
              <Route path="/" exact component={() => <Monitor target={this.state.target} />} />
              <Route path="/simulation" component={() => <DataGeneration target={this.state.target} />} />
            </div>
          </div>
          {this.renderSessionModal()}
        </div>
      </Router>
    );
  }
}

export default App;
