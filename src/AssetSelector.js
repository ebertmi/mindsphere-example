import React, { Component } from 'react';
import classNames from 'classnames';
import Asset from './Asset';
import Aspect from './Aspect';

import "./AssetSelector.scss";

export default class AssetSelector extends Component {
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

  render() {
    const classes = classNames("asset-selector", "d-flex", "flex-column", this.props.className);

    let assetContent = this.state.availableAssets.length > 0 ? this.state.availableAssets.map(asset => {
      const isSelected = this.state.selectedAsset === asset.id;
      return <option selected={isSelected} value={asset.id}>{asset.name}</option>
    }) : <option>Loading Data</option>;

    let aspectContent = this.state.availableAssets.length > 0 ? this.state.availableAspects.map(aspect => {
      const isSelected = this.state.selectedAspect === aspect.id;
      return <option selected={isSelected} value={aspect.id}>{aspect.name}</option>
    }) : <option>Loading Data</option>;

    return (
      <div className={classes}>
        <div className="flex-fill">
          <h4 className="p-2">Assets</h4>
          <ul class="list-group list-group-flush asset-view">
            <Asset></Asset>
            <Asset></Asset>
            <Asset></Asset>
            <Asset></Asset>
            <Asset></Asset>
            <Asset></Asset>
            <Asset></Asset>
            <Asset></Asset>
            <Asset></Asset>
            <Asset></Asset>
          </ul>
        </div>
        <div className="asset-selector-divider"></div>
        <div className="flex-fill">
          <h4 className="p-2 ">Aspects</h4>
          <ul class="list-group list-group-flush aspect-view">
            <Aspect></Aspect>
            <Aspect></Aspect>
            <Aspect></Aspect>
            <Aspect></Aspect>
            <Aspect></Aspect>
            <Aspect></Aspect>
            <Aspect></Aspect>
            <Aspect></Aspect>
            <Aspect></Aspect>
            <Aspect></Aspect>
            <Aspect></Aspect>
          </ul>
        </div>
      </div>
    );
  }
}