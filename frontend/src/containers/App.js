import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import { connect } from 'react-redux';
import { timer } from 'rxjs';
import { concatMap, filter } from 'rxjs/operators';

import './App.scss';
import Monitor from '../components/Monitor';
import DataGeneration from '../components/DataGeneration';
import SelectableAssetList from '../containers/SelectableAssetList';
import { keepAlive } from '../service';
import { Modal, SessionModal } from '../components/SessionModal';
import { showSessionModal, hideSessionModal } from '../actions';


const KEEP_ALIVE_INTERVAL = 60 * 1000; // 1 minute (see https://developer.mindsphere.io/concepts/concept-gateway-url-schemas.html#restrictions)

class App extends Component {
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
      this.props.handleTimeout();
      kaSubscripition.unsubscribe();
    });

    return kaSubscripition;
  }

  renderSessionModal() {
    if (this.props.isSessionModalVisible) {
      return (
        <Modal>
          <SessionModal onClose={this.props.closeModal} onLogin={e => { window.location.reload() }} />
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
            <SelectableAssetList className="col-2 col-sm-3" />
            <div className="content flex-column d-flex col-9 col-sm-8">
              <Route path="/" exact component={() => <Monitor />} />
              <Route path="/simulation" component={() => <DataGeneration />} />
            </div>
          </div>
          {this.renderSessionModal()}
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSessionModalVisible: state.ui.isSessionModalVisible
  }
}
const mapDispatchToProps = dispatch => {
  return {
    handleTimeout: () => dispatch(showSessionModal()),
    closeModal: () => dispatch(hideSessionModal())
  }
}

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default ConnectedApp;
