import React from 'react';
import './lettering.css';

const Lettering = ({ text = [], title = '' }) => {
  const renderText = () => {
    return text && text.length
      ? text.map((line, index) => {
          return <p key={`${index}`}>{line}</p>;
        })
      : null;
  };

  return (
    <div className="lettering">
      <h1>{title}</h1>
      {renderText()}
    </div>
  );
};

export default Lettering;
