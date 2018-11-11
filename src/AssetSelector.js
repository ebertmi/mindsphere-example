import React, { Component } from 'react';
import classNames from 'classnames';
import AssetListItem from './AssetListItem';
import AspectListItem from './AspectListItem';
import EmptyContent from './EmptyContent';

import { getAssets } from './service';

import "./AssetSelector.scss";

export default class AssetSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAsset: null,
      selectedAspect: null,
      lastOperation: 'loading',
      assetRequestError: null,
      aspectRequestError: null,
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
      this.setState({
        assetRequestError: error.properties
      });
    });
  }

  onChangeAsset() {
    // ToDo: load every aspect for this asset and automatically select first one, if any
  }

  onChangeAspect() {
    // ToDo: load TimeSeries Aggregates for specified interval and start auto-update
    // ToDo: create selection of properties based on data-type (only numeric)
    // ToDo: Update Chart by notifying parent component this.props.onChangeMonitoring(asset, aspect)
  }

  render() {
    const classes = classNames("asset-selector", "d-flex", "flex-column", this.props.className);

    let assetContent = this.state.availableAssets.length > 0 ? this.state.availableAssets.map(asset => {
      const isSelected = this.state.selectedAsset === asset.id;
      return <AssetListItem active={isSelected} {...asset} />
    }) : <EmptyContent message="Loading assets" error={this.state.assetRequestError} className="list-group-item list-group-item-action" />;

    let aspectContent = this.state.availableAssets.length > 0 ? this.state.availableAspects.map(aspect => {
      const isSelected = this.state.selectedAspect === aspect.id;
      return  <AspectListItem active={isSelected} {...aspect} />
    }) : <EmptyContent message="Loading aspects" className="list-group-item list-group-item-action" />;

    return (
      <div className={classes}>
        <div className="flex-fill">
          <h4 className="p-2">Assets</h4>
          <ul className="list-group list-group-flush asset-view">
            {assetContent}
          </ul>
        </div>
        <div className="asset-selector-divider"></div>
        <div className="flex-fill">
          <h4 className="p-2 ">Aspects</h4>
          <ul className="list-group list-group-flush aspect-view">
            {aspectContent}
          </ul>
        </div>
      </div>
    );
  }
}