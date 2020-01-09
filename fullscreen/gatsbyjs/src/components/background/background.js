import React from 'react';
import './background.scss';

const Background = ({ src, alt = 'background' }) => {
  return <img alt={alt} src={src} className="background" />;
};

export default Background;
