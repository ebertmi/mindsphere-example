import React from 'react';
import classNames from 'classnames';

//import "./AspectListItem.scss";

export default function AspectListItem(props) {
  const classes = classNames("list-group-item list-group-item-action flex-column align-items-start", {active: props.active});

  return (
  <div href="#" className={classes} onClick={props.onClick}>
      <div className="d-flex w-100 justify-content-between">
        <h6 className="mb-1">{props.name}</h6>
        <span title="Number of variables" className="badge badge-dark badge-pill">{props.variables.length}</span>
      </div>
      <small>{props.aspectTypeId}</small>
    </div>
  );
}