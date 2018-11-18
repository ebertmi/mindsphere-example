import React, { Component } from 'react';
import { FlexibleXYPlot, LineMarkSeries, MarkSeries, XAxis, YAxis, HorizontalGridLines, VerticalGridLines } from 'react-vis';
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryScatter, VictoryTheme, VictoryGroup } from 'victory';
import subMinutes from 'date-fns/sub_minutes';
import format from 'date-fns/format';

import { timer, BehaviorSubject, throwError, combineLatest } from 'rxjs';
import { concatMap, filter, switchMap, distinctUntilChanged, map, catchError, tap } from 'rxjs/operators';

import EmptyContent from './EmptyContent';
import MonitoringOptions from './MonitoringOptions';
import { AggregationFieldNames, AggregationIntervalUnits } from './models';
import { getAggregates, getTimeSeries } from './service';
import { isArray } from 'util';


export default class Monitor extends Component {
  constructor(props) {
    super(props);

    this.handleIntervalChange = this.handleIntervalChange.bind(this);
    this.handleIntervalValueChange = this.handleIntervalValueChange.bind(this);
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

    this.dataStream = this.createDataStream();
  }

  async componentDidUpdate(prevProps, prevState) {
    this.targetSource.next({
      asset: this.props.asset,
      aspect: this.props.aspect
    });

    this.intervalSource.next({
      intervalUnit: this.state.intervalUnit,
      intervalValue: this.state.intervalValue
    });
  }

  componentWillUnmount() {
    if (this.dataStream) {
      this.dataStream.unsubscribe();
    }
  }

  // ToDo: remove
  async handleWatch() {
  }

  async handleIntervalChange(val) {
    this.setState({
      intervalUnit: val
    });
  }

  async handleIntervalValueChange(val) {
    this.setState({
      intervalValue: val
    });
  }

  async handleStartFromChange(val) {
    this.setState({
      startFromNow: val
    });
  }

  createDataStream() {
    // see https://stackoverflow.com/questions/42079800/rxjs-observable-changing-interval
    this.targetSource = new BehaviorSubject({
      asset: this.props.asset,
      aspect: this.props.aspect
    }).pipe(
      tap(ev => {console.info("new target", ev)}),
      distinctUntilChanged(),
      filter(v => v.asset != null && v.aspect != null)
    );

    this.intervalSource = new BehaviorSubject({
      intervalUnit: this.state.intervalUnit,
      intervalValue: this.state.intervalValue
    }).pipe(
      tap(ev => {console.info("new intervalSource", ev)}),
      distinctUntilChanged()
    );

    const configSource = combineLatest(this.targetSource, this.intervalSource).pipe(
      tap(ev => {console.info("new config", ev)}),
      map(async (config) => {
        const [{ asset, aspect }, { intervalUnit, intervalValue }] = config;
        const selection = aspect.createNumericSelection(aspect, AggregationFieldNames.Average);

        // create request function that only accepts from and to dates
        const reqFunc = (from, to) => {
          return getAggregates(asset.assetId, aspect.name, from, to, intervalUnit, intervalValue, selection);
        };

        // Get most recent data point as a starting point
        let latestDataPoints;
        try {
          latestDataPoints = await getTimeSeries(this.props.target.asset.assetId, this.props.target.aspect.name);
        } catch (error) {
          console.error(error);
          // ToDo: handle this better
        }

        const timeFunc = (to) => {
          // take a to date and create from date by substracting x intervalUnit * intervalValue
          // ToDo: d and set everything to 0 based on intervalUnit

          // assume minutes
          to.setMilliseconds(0);
          to.setSeconds(0);

          // subtract IntervalUnit --> intervalValue * 15 --> to have at least 15 data points
          return subMinutes(to, intervalValue*15);
        };

        return {
          reqFunc,
          timeFunc,
          latestDataPoints
        }
      }),
      switchMap(reqParams => {
          return timer(0, 5*1000).pipe(
          concatMap(v => {
            // make req from now back to timeFunc result
            const to = new Date();
            return reqParams.reqFunc(to, reqParams.timeFunc(to));
          }),
          catchError(error => {
            console.info("catched error", reqParams);
            return throwError(error);
          })
        )
      })
    );

    const subscripition = configSource.subscribe((result) => {
      // Update state with data
      if (isArray(result)) {
        this.setState({
          data: result
        });
      } else {
        console.info("non array result in subscribe");
      }
    }, error => {
      this.setState({
        requestError: error
      });
    });

    return subscripition;
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
          <MonitoringOptions 
            onWatch={this.handleWatch}
            onStartFromChange={this.handleStartFromChange}
            onIntervalChange={this.handleIntervalChange}
            intervalUnit={this.state.intervalUnit}
            intervalValue={this.state.intervalValue}
            onIntervalValueChange={this.handleIntervalValueChange}
            startFromNow={this.state.startFromNow} 
          />
        </div>
        {content}
        <div className="h-50 w-50">{this.renderVictory()}</div>
      </div>
    );
  }
}