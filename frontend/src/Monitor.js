import React, { Component } from 'react';
import { FlexibleXYPlot, LineMarkSeries, MarkSeries, XAxis, YAxis, HorizontalGridLines, VerticalGridLines } from 'react-vis';
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryScatter, VictoryTheme, VictoryGroup } from 'victory';
import subMinutes from 'date-fns/sub_minutes';
import format from 'date-fns/format';

import EmptyContent from './EmptyContent';
import MonitoringOptions from './MonitoringOptions';
import { AggregationFieldNames, AggregationIntervalUnits } from './models';
import { getAggregates, getTimeSeries } from './service';
import { isArray } from 'util';

const timestamp = new Date().getTime();
const MSEC_DAILY = 86400000;

export default class Monitor extends Component {
  constructor(props) {
    super(props);

    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleStartFromChange = this.handleStartFromChange.bind(this);
    this.handleWatch = this.handleWatch.bind(this);

    this.state = {
      data: [],
      requestError: null,
      intervalUnit: AggregationIntervalUnits.Minute,
      intervalValue: 2,
      selectionField: AggregationFieldNames.Average,
      startFromNow: true
    };
  }

  async componentDidMount() {
    // Update Chart after mounting in case height information is not
    // fully available in first render cycle
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.forceUpdate()
      })
    }, 0);
  }

  async componentDidUpdate(prevProps, prevState) {
      // if the target changes, we should update
  }

  async handleWatch() {
    this.subscribe();
  }

  async handleIntervalChange(val) {
    this.setState({
      intervalUnit: val
    });
  }

  async handleStartFromChange(val) {
    this.setState({
      startFromNow: val
    });
  }

  async subscribe() {
    if (this.props.target == null || this.props.target.asset == null || this.props.target.aspect == null) {
      // nothing to do
      return;
    }

    const numericVariables = this.props.target.aspect.getNumericVariables();
    const selection = numericVariables.reduce((accumulator, currentValue) => {
      return `${accumulator}${accumulator !== "" ? "," : ""}${currentValue.name}.${this.state.selectionField}`
    }, "");

    if (selection === "") {
      // no numeric variables --> show table
      return;
    }

    // Get most recent data point as a starting point
    let latestDataPoints;
    try {
      latestDataPoints = await getTimeSeries(this.props.target.asset.assetId, this.props.target.aspect.name);
    } catch (error) {
      console.error(error);
      // ToDo: handle this better
      return;
    }

    // to is current date time, precision must be not higher than interval unit
    let to = new Date();
    if (isArray(latestDataPoints) && latestDataPoints.length > 0) {
      to = new Date(Date.parse(latestDataPoints.pop()._time));
    }

    to.setMilliseconds(0);
    to.setSeconds(0);

    const from = subMinutes(to, 30); // go back 30 minutes

    let result;

    try {
      result = await getAggregates(this.props.target.asset.assetId, this.props.target.aspect.name, from.toISOString(), to.toISOString(), this.state.intervalUnit, this.state.intervalValue, selection);
      console.info(result);
    } catch (error) {
      console.error(error);
      this.setState({
        requestError: error
      });

      // Do not update the data
      return;
    }

    if (isArray(result)) {
      // Process the data
      this.setState({
        data: result
      });
    }

    // then setInterval and periodically fetch data
    // ToDo: make aggregation field and interval configurable
  }

  renderVictory() {
    let numericVariables = [];
    if (this.props.target != null && this.props.target.aspect != null) {
      numericVariables = this.props.target.aspect.getNumericVariables();
      //numericVariables = [numericVariables.pop()]; // for testing
    }

    return (
      <VictoryChart theme={VictoryTheme.material} scale={{x: "time", y: "linear"}}>
        {numericVariables.map(v => {
          return (
            <VictoryGroup
              data={this.state.data}
              x={d => new Date(Date.parse(d.endtime))}
              y={d => d[v.name] != null ? d[v.name].average : 0}
              labels={(d) => `y: ${d[v.name] != null ? d[v.name].average : 0}`}
              labelComponent={
                <VictoryTooltip
                  style={{ fontSize: 10 }}
                />
              }
            >
              <VictoryLine />
              <VictoryScatter />
            </VictoryGroup>
          )})
         }
      </VictoryChart>
    );
  }

  renderPlot() {
    let numericVariables = [];
    if (this.props.target != null && this.props.target.aspect != null) {
      numericVariables = this.props.target.aspect.getNumericVariables();
      //numericVariables = [numericVariables.pop()]; // for testing
    }

    console.info(this.state.data);

    if (this.state.data.length === 0) {
      return null;
    }

    let createNullAccessor = (name) => {
      return (obj) => {
        let r = obj[name] != null && obj[name][this.state.selectionField] != null;
        console.info("getNull", name, r)
        return r;
      }
    }

    let createAccessor = (name) => {
      return (obj) => {
        let r = obj[name] != null ? obj[name][this.state.selectionField] : 0;

        return r == null ? 0 : r;
      }
    }

    return (      
      <FlexibleXYPlot xType="time" yType="linear">
        {numericVariables.map(v => {
          return <MarkSeries
          key={v.name}
          curve={'curveMonotoneX'}
          getY={createAccessor(v.name)}
          getX={obj => Date.parse(obj.endtime) }
          getNull={createNullAccessor(v.name)}
          opacity={1}
          data={this.state.data}
        />;
        })}
      </FlexibleXYPlot>
    );
  }

  renderEmptyBox() {
    return <EmptyContent message="Please select an asset and aspect" />;
  }

  renderVariables() {
    return (
      <div>
        <table className="table w-100">
          <thead>
            <tr>
              <th>Name</th>
              <th>DataType</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {this.props.target.aspect.getVariables().map(v => {
              return (
                <tr key={v.name}>
                  <td>{v.name}</td>
                  <td>{v.dataType}</td>
                  <td>{v.unit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    let content;
    if (this.props.target == null || this.props.target.asset == null || this.props.target.aspect == null) {
      content = this.renderEmptyBox();
    } else {
      content = this.renderVariables();
    }

    return (
      <div className="d-flex flex-column h-100">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-2 pb-2 mb-3 border-bottom">
          <h4>Monitoring</h4>
          <MonitoringOptions onWatch={this.handleWatch} onStartFromChange={this.handleStartFromChange} onIntervalChange={this.handleIntervalChange} intervalUnit={this.state.intervalUnit} startFromNow={this.state.startFromNow} />
        </div>
        {content}
        <div className="h-50 w-50">{this.renderVictory()}</div>
      </div>
    );
  }
}