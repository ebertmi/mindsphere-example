import React, { Component } from 'react';
import { FlexibleXYPlot, LineSeries, XAxis, YAxis, HorizontalGridLines, VerticalGridLines } from 'react-vis';
import EmptyContent from './EmptyContent';

const timestamp = new Date().getTime();
const MSEC_DAILY = 86400000;

export default class Monitor extends Component {

  componentDidMount() {
    // Update Chart after mounting in case height information is not
    // fully available in first render cycle
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        this.forceUpdate()
      })
    }, 0);
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
    return <EmptyContent message="Please select an asset" />;
  }

  render() {
    if (this.props.target == null) {
      return this.renderEmptyBox();
    }

    return this.renderPlot();
  }
}