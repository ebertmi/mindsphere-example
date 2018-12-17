import React, { Component } from 'react';
import classNames from 'classnames';
import AssetListItem from './AssetListItem';
import AspectListItem from './AspectListItem';
import EmptyContent from './EmptyContent';

import "./AssetAspectList.scss";

export default class AssetAspectList extends Component {
  componentDidMount() {
    this.props.fetchAssets();
  }

  onChangeAsset(e, asset) {
    e.preventDefault();

    this.props.onSelectAsset(asset);
  }

  onChangeAspect(e, aspect) {
    e.preventDefault();

    this.props.onSelectAspect(aspect);
  }

  renderAssets() {
    if (this.props.assets.length > 0) {
      return this.props.assets.map(asset => {
        const isSelected = this.props.selectedAsset != null && this.props.selectedAsset.assetId === asset.assetId;
        return <AssetListItem key={asset.assetId} active={isSelected} {...asset} onClick={ e => this.onChangeAsset(e, asset) } />
      });
    }

    // Return empty box
    return <EmptyContent message="Loading assets" error={this.props.assetFetchingError} className="list-group-item list-group-item-action" />;
  }

  renderAspects() {
    if (this.props.selectedAsset != null && this.props.selectedAsset.getAspects().length > 0) {
      return this.props.selectedAsset.getAspects().map(aspect => {
        const isSelected = this.props.selectedAspect != null && this.props.selectedAspect.name === aspect.name;
        return  <AspectListItem key={aspect.name} active={isSelected} {...aspect} onClick={ e => this.onChangeAspect(e, aspect) } />
      });
    }

    // Return empty box
    return <EmptyContent message="Select an asset" error={this.props.aspectFetchingError} className="list-group-item list-group-item-action" />;
  }

  render() {
    const classes = classNames("asset-selector", "d-flex", "flex-column", this.props.className);

    return (
      <div className={classes}>
        <div className="flex-fill">
          <h4 className="p-2">Assets <small>{this.props.assets.length}</small></h4>
          <ul className="list-group list-group-flush asset-view">
            {this.renderAssets()}
          </ul>
        </div>
        <div className="asset-selector-divider"></div>
        <div className="flex-fill">
          <h4 className="p-2 ">Aspects</h4>
          <ul className="list-group list-group-flush aspect-view">
            {this.renderAspects()}
          </ul>
        </div>
      </div>
    );
  }
}