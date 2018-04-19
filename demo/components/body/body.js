import React from 'react';
import PropTypes from 'prop-types';
import Styles from './body.scss';

const Body = ({ children }) => (
  <div className={Styles.container}>
    <div className={Styles.wrapper}>
      {children}
    </div>
  </div>
);

Body.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Body;
