import React from 'react';
import PropTypes from 'prop-types';
import { AwesomeButtonSocial } from 'react-awesome-button';
import AwesomeButtonStyles from 'react-awesome-button/src/styles/themes/theme-blue';
import Styles from './footer.scss';

const Footer = ({ repository, article }) => (
  <footer className={Styles.container}>
    <div>
      <img className="support" src="/images/support.svg" alt="Modern Web Browsers" title="Modern Web Browsers" />
    </div>
    <div className={Styles.follow}>
      <hr />
      <h5>Support it on social</h5>
      <AwesomeButtonSocial
        cssModule={AwesomeButtonStyles}
        type="twitter"
        size="medium"
        target="_blank"
        href="https://twitter.com/rcaferati"
      >
        Twitter
      </AwesomeButtonSocial>
      <AwesomeButtonSocial
        cssModule={AwesomeButtonStyles}
        type="github"
        size="medium"
        target="_blank"
        href="https://github.com/rcaferati"
      >
        Github
      </AwesomeButtonSocial>
    </div>
  </footer>
);

Footer.propTypes = {
  repository: PropTypes.string.isRequired,
  article: PropTypes.string.isRequired,
};

export default Footer;
