import React from 'react';
import classNames from 'classnames';

import "./AssetListItem.scss";

export default function AssetListItem(props) {
  const classes = classNames("list-group-item list-group-item-action flex-column align-items-start", {active: props.active});

  return (
  <div href="#" className={classes}>
      <div className="d-flex w-100 justify-content-between">
        <h6 className="mb-1">assetname</h6>
        <small>(subtenant)</small>
      </div>
      <small>Asset Type</small>
    </div>
  );
}