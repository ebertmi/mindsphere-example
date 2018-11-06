import React, { Component } from 'react';

export default class DataGeneration extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAsset: null,
      selectedAspect: null,
      lastOperation: 'loading',
      availableAssets: [],
      availableAspects: []
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
    let assetContent = this.state.availableAssets.length > 0 ? this.state.availableAssets.map(asset => {
      const isSelected = this.state.selectedAsset === asset.id;
      return <option selected={isSelected} value={asset.id}>{asset.name}</option>
    }) : <option>Loading Data</option>;

    let aspectContent = this.state.availableAssets.length > 0 ? this.state.availableAspects.map(aspect => {
      const isSelected = this.state.selectedAspect === aspect.id;
      return <option selected={isSelected} value={aspect.id}>{aspect.name}</option>
    }) : <option>Loading Data</option>;

    return (
      <form>
        <div className="form-group">
          <label for="exampleOutputLastOperation">Status</label>
          <p className="lastOperationLabel" id="exampleOutputLastOperation">{this.state.lastOperation}</p>
        </div>
        <div class="form-group">
          <label for="formGroupExampleInput">Asset</label>
          <select class="custom-select">
            {assetContent}
          </select>
        </div>
        <div class="form-group">
          <label for="formGroupExampleInput">Aspect</label>
          <select class="custom-select">
            {aspectContent}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mx-1">Start</button>
        <button type="submit" className="btn btn-secondary mx-1">Stop</button>
      </form>
    );
  }
}