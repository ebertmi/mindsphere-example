import React, { Component } from 'react';
import classNames from 'classnames';
import AssetListItem from './AssetListItem';
import AspectListItem from './AspectListItem';
import EmptyContent from './EmptyContent';

import { getAssets, getAspects } from './service';

import "./AssetSelector.scss";

export default class AssetSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: {
        asset: null,
        aspect: null
      },
      lastOperation: 'loading',
      assetRequestError: null,
      aspectRequestError: null,
      availableAssets: [],
    };
  }

  componentDidMount() {
    // Fetch assets
    getAssets().then(assets => {
      this.setState({
        availableAssets: assets,
      });
    }).catch(error => {
      this.setState({
        assetRequestError: error.properties
      });
    });
  }

  onChangeAsset(e, asset) {
    e.preventDefault();

    let newSelection = {
      asset: asset,
      aspect: asset.getAspects().length > 0 ? asset.getAspects()[0] : null
    };

    // Update selection
    this.setState({
      selection: newSelection
    });

    this.props.onChangeTarget(newSelection);

    // Avoid loading aspects again
    if (newSelection.asset.getAspects().length > 0) {
      return;
    }

    // Fetch aspects for selected asset
    getAspects(newSelection.asset.assetId).then(aspects => {
      // Update aspects on current selection
      newSelection.asset.setAspects(aspects);

      this.setState({
        selection: {
          asset: asset,
          aspect: aspects.length > 0 ? aspects[0] : null
        }
      }, () => {
        this.props.onChangeTarget(this.state.selection);
      });
    }).catch(error => {
      this.setState({
        aspectRequestError: error.properties
      });
    });
  }

  onChangeAspect(e, aspect) {
    e.preventDefault();

    // Update selection
    this.setState({
      selection: {
        asset: this.state.selection.asset,
        aspect: aspect
      }
    });

    this.props.onChangeTarget(this.state.selection);
  }

  renderAssets() {
    if (this.state.availableAssets.length > 0) {
      return this.state.availableAssets.map(asset => {
        const isSelected = this.state.selection.asset != null && this.state.selection.asset.assetId === asset.assetId;
        return <AssetListItem key={asset.assetId} active={isSelected} {...asset} onClick={ e => this.onChangeAsset(e, asset) } />
      });
    }

    // Return empty box
    return <EmptyContent message="Loading assets" error={this.state.assetRequestError} className="list-group-item list-group-item-action" />;
  }

  renderAspects() {
    if (this.state.selection.asset != null && this.state.selection.asset.getAspects().length > 0) {
      return this.state.selection.asset.getAspects().map(aspect => {
        const isSelected = this.state.selection.aspect != null && this.state.selection.aspect.name === aspect.name;
        return  <AspectListItem key={aspect.name} active={isSelected} {...aspect} onClick={ e => this.onChangeAspect(e, aspect) } />
      });
    }

    // Return empty box
    return <EmptyContent message="Select an asset" className="list-group-item list-group-item-action" />;
  }

  render() {
    const classes = classNames("asset-selector", "d-flex", "flex-column", this.props.className);

    return (
      <div className={classes}>
        <div className="flex-fill">
          <h4 className="p-2">Assets <small>{this.state.availableAssets.length}</small></h4>
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