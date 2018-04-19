import React from 'react';
import PropTypes from 'prop-types';
import Styles from './header.scss';
import { Navigation } from '../index';

const Header = ({
  title,
  name,
  size,
  description,
  themes,
  framework,
  domain,
  theme,
}) => (
  <header className={Styles.container}>
    <div className={Styles.wrapper}>
      <h1>
        <span>{framework}</span>
        <span>{title}</span>
      </h1>
      <h2>
        <strong>&lt;{name}/&gt;</strong>
        <span>{size}</span>
      </h2>
      <p>{description}</p>
      <Navigation
        domain={domain}
        theme={theme}
        themes={themes}
      />
    </div>
  </header>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  themes: PropTypes.array.isRequired,
  module: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired,
  framework: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Header;
