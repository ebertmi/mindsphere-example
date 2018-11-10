import React, { Component } from 'react';
import classNames from 'classnames';
import AssetListItem from './AssetListItem';
import AspectListItem from './AspectListItem';

import { getAssets } from './service';

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

  componentDidMount() {
    // Fetch assets
    getAssets().then(assets => {
      console.log(assets);
    }).catch(error => {
      // ToDo: show error message
      console.error(error);
    });
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
          <ul className="list-group list-group-flush asset-view">
            <AssetListItem></AssetListItem>
            <AssetListItem></AssetListItem>
            <AssetListItem></AssetListItem>
            <AssetListItem></AssetListItem>
            <AssetListItem></AssetListItem>
            <AssetListItem></AssetListItem>
            <AssetListItem></AssetListItem>
            <AssetListItem></AssetListItem>
            <AssetListItem></AssetListItem>
            <AssetListItem></AssetListItem>
          </ul>
        </div>
        <div className="asset-selector-divider"></div>
        <div className="flex-fill">
          <h4 className="p-2 ">Aspects</h4>
          <ul className="list-group list-group-flush aspect-view">
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
            <AspectListItem></AspectListItem>
          </ul>
        </div>
      </div>
    );
  }
}