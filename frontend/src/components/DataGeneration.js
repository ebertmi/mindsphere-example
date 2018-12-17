import React, { Component } from 'react';

export default class DataGeneration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastOperation: 'loading',
    };
  }

  onChangeAsset() {

  }

  onChangeAspect() {

  }

  startGeneration() {

  }

  stopGeneration() {

  }

  render() {

    return (
      <form>
        <div className="form-group">
          <label htmlFor="exampleOutputLastOperation">Status</label>
          <p className="lastOperationLabel" id="exampleOutputLastOperation">{this.state.lastOperation}</p>
        </div>
        <button type="submit" className="btn btn-primary mx-1">Start</button>
        <button type="submit" className="btn btn-secondary mx-1">Stop</button>
      </form>
    );
  }
}