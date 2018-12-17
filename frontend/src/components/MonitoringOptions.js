import React, { Component } from 'react';
import classNames from 'classnames';

import { AggregationIntervalUnits } from '../models';

const FROM_NOW_OPTION = 'fromNow';
const FROM_LATEST_OPTION = 'fromLatest';

export default class MonitoringOptions extends Component {
  constructor(props) {
    super(props);

    this.handleIntervalChange = this.handleIntervalChange.bind(this);
  }

  handleIntervalChange(e) {
    let newValue = e.target.value;
    this.props.onIntervalChange(newValue);
  }

  render() {
    const classes = classNames("d-flex align-items-center", this.props.className);

    return (
    <div className={classes}>
      <div className="custom-control custom-radio custom-control-inline" onClick={() => this.props.onStartFromChange(true)} >
        <input type="radio" value={FROM_NOW_OPTION} className="custom-control-input" readOnly checked={this.props.startFromNow} />
        <label className="custom-control-label">Now</label>
      </div>
      <div className="custom-control custom-radio custom-control-inline" onClick={() => this.props.onStartFromChange(false)} >
        <input type="radio" value={FROM_LATEST_OPTION} className="custom-control-input" readOnly checked={!this.props.startFromNow} />
        <label className="custom-control-label">Latest Data Point</label>
      </div>
      <form className="form-inline mx-2">
        <div className="form-group">
          <label className="mr-2">Interval Unit</label>
          <select defaultValue={this.props.intervalUnit} onChange={this.handleIntervalChange} className="form-control form-control-sm mr-2">
          {Object.keys(AggregationIntervalUnits).map(key => {
            return <option key={key} value={AggregationIntervalUnits[key]}>{AggregationIntervalUnits[key]}</option>;
          })}
          </select>
        </div>
        <div className="form-group">
          <label className="mr-2">Interval Value</label>
          <input className="form-control form-control-sm" type="number" step="1" min="1" max="20" value={this.props.intervalValue} onChange={e => this.props.onIntervalValueChange(e.target.value)} />
        </div>
      </form>
      <button type="button" className="btn btn-sm btn-outline-primary" onClick={this.props.onWatch}>Watch</button>
    </div>
    );
  }
}