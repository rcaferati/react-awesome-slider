import React from 'react';
import './content.scss';

const Content = ({ main, action }) => {
  return (
    <div className="content">
      <div className="content__main">{main}</div>
      {action && <div className="content__action">{action}</div>}
    </div>
  );
};

export default Content;
