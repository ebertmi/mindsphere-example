import React from 'react';
import classNames from 'classnames';

export default function AssetListItem(props) {
  const classes = classNames("list-group-item list-group-item-action flex-column align-items-start", {active: props.active});

  return (
  <div className={classes} onClick={props.onClick}>
      <div className="d-flex w-100 justify-content-between">
        <h6 className="mb-1">{props.name}</h6>
      </div>
      <small className="badge badge-secondary">{props.typeId}</small>
      <br />
      <small className="text-muted">{props.description}</small>
    </div>
  );
}