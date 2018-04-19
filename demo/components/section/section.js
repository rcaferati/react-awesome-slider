import React from 'react';
import PropTypes from 'prop-types';
import Styles from './section.scss';

const Section = ({ children }) => (
  <section className={Styles.container}>
    {children}
  </section>
);

Section.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Section;
