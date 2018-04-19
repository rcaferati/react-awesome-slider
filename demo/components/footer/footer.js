import React from 'react';
import PropTypes from 'prop-types';
import Styles from './footer.scss';

const Footer = ({ repository, article }) => (
  <footer className={Styles.container}>
    <div>
      <img className="support" src="/images/support.svg" alt="Modern Web Browsers" title="Modern Web Browsers" />
    </div>
    <small>
      Promote and support this project on <a rel="noopener noreferrer" target="_blank" href={repository}>github</a>.
    </small>
    <small>
      Read more and discuss at the <a rel="noopener noreferrer" target="_blank" href={article}>article page</a>.
    </small>
  </footer>
);

Footer.propTypes = {
  repository: PropTypes.string.isRequired,
  article: PropTypes.string.isRequired,
};

export default Footer;
