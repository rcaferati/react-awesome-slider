import React from 'react';
import './select.scss';

const Select = ({ options = [], onChange, selected }) => {
  const renderOptions = () => {
    return options.map(({ value, label }) => {
      return (
        <option selected={value === selected} value={value}>
          {label}
        </option>
      );
    });
  };

  return (
    <select
      onChange={event => {
        onChange(event.currentTarget.value);
      }}
    >
      {renderOptions()}
    </select>
  );
};

export default Select;
