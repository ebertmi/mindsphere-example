import React from 'react';
import classNames from 'classnames';

//import "./AspectListItem.scss";

export default function AspectListItem(props) {
  const classes = classNames("list-group-item list-group-item-action flex-column align-items-start", {active: props.active});

  return (
  <div href="#" className={classes}>
      <div className="d-flex w-100 justify-content-between">
        <h6 className="mb-1">aspectname</h6>
        <small>(#variables)</small>
      </div>
      <small>Aspect Type</small>
    </div>
  );
}