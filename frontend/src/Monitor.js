import React, { Component } from 'react';
import { FlexibleXYPlot, LineSeries, XAxis, YAxis, HorizontalGridLines, VerticalGridLines } from 'react-vis';
import subMinutes from 'date-fns/sub_minutes';
import format from 'date-fns/format';

import EmptyContent from './EmptyContent';
import { AggregationFieldNames, AggregationIntervalUnits } from './models';
import { getAggregates } from './service';

const timestamp = new Date().getTime();
const MSEC_DAILY = 86400000;

export default class Monitor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      requestError: null,
      intervalUnit: AggregationIntervalUnits.Minute,
      intervalValue: 2
    };
  }

  componentDidMount() {
    // Update Chart after mounting in case height information is not
    // fully available in first render cycle
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.forceUpdate()
      })
    }, 0);
  }

  componentDidUpdate() {
    this.subscribe();
  }

  subscribe() {
    if (this.props.target == null || this.props.target.asset == null || this.props.target.aspect == null) {
      // nothing to do
      return;
    }

    const numericVariables = this.props.target.aspect.getNumericVariables();
    const selection = numericVariables.reduce((accumulator, currentValue) => {
      return `${accumulator}${accumulator !== "" ? "," : ""}${currentValue.name}.${AggregationFieldNames.Average}`
    }, "");

    if (selection === "") {
      // no numeric variables --> show table
      return;
    }

    // to is current date time, precision must be not higher than interval unit
    const to = new Date();
    to.setMilliseconds(0);
    to.setSeconds(0);

    const from = subMinutes(to, 30); // go back 30 minutes

    getAggregates(this.props.target.asset.assetId, this.props.target.aspect.name, from.toISOString(), to.toISOString(), this.state.intervalUnit, this.state.intervalValue, selection).then(values => {
      console.info(values);
    }).catch(error => {
      console.error(error);
      this.setState({
        requestError: error
      })
    });

    // then setInterval and periodically fetch data
    // ToDo: make aggregation field and interval configurable
  }

  renderPlot() {
    return (      
      <FlexibleXYPlot xType="time">
        <HorizontalGridLines />
        <VerticalGridLines />
        <XAxis title="X Axis" />
        <YAxis title="Y Axis" />
        <LineSeries
          curve={'curveMonotoneX'}
          opacity={1}
          data={[
            {
              x: timestamp + 0 * MSEC_DAILY,
              y: 10
            },
            {
              x: timestamp + 1 * MSEC_DAILY,
              y: 9.387045173112089
            },
            {
              x: timestamp + 2 * MSEC_DAILY,
              y: 9.815787870151336
            },
            {
              x: timestamp + 3 * MSEC_DAILY,
              y: 10.031178631919696
            },
            {
              x: timestamp + 4 * MSEC_DAILY,
              y: 9.509055437843344
            },
            {
              x: timestamp + 5 * MSEC_DAILY,
              y: 9.239088934341302
            },
            {
              x: timestamp + 6 * MSEC_DAILY,
              y: 10.014996464163442
            },
            {
              x: timestamp + 7 * MSEC_DAILY,
              y: 10.564550195250588
            },
            {
              x: timestamp + 8 * MSEC_DAILY,
              y: 10.183982966878885
            },
            {
              x: timestamp + 9 * MSEC_DAILY,
              y: 10.232209210853977
            },
            {
              x: timestamp + 10 * MSEC_DAILY,
              y: 11.071237592123586
            },
            {
              x: timestamp + 11 * MSEC_DAILY,
              y: 10.72151282448977
            },
            {
              x: timestamp + 12 * MSEC_DAILY,
              y: 10.166286860428487
            },
            {
              x: timestamp + 13 * MSEC_DAILY,
              y: 10.130104267959286
            }
          ]}
        />
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
    if (this.props.target == null || this.props.target.asset == null || this.props.target.aspect == null) {
      return this.renderEmptyBox();
    }

    return this.renderVariables();
  }
}