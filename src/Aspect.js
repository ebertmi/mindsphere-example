import React, { Component } from 'react';
import classNames from 'classnames';

//import "./Aspect.scss";

export default class Asset extends Component {
  constructor(props) {
    super(props);
  }

  onChangeAsset() {

  }

  onChangeAspect() {

  }

  render() {
    const classes = classNames("list-group-item list-group-item-action flex-column align-items-start", {active: this.props.active});

    return (
    <div href="#" className={classes}>
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">aspectname</h6>
          <small>(#variables)</small>
        </div>
        <small>Aspect Type</small>
      </div>
    );
  }
}