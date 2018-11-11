import React from 'react';
import classNames from 'classnames';

export default function EmptyContent(props) {
    const classes = classNames("d-flex flex-column flex-fill align-items-center align-content-center", props.className);
    const errorContent = props.error != null ? <small className="text-danger">{props.error.message}</small> : null;

    return (
    <div href="#" className={classes}>
        <div className="mt-auto mb-auto text-center">
          <h6 className="mb-1">{props.message}</h6>
          {errorContent}
        </div>
    </div>
    );
}