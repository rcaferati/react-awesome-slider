import React from 'react';
import withNavigationContext from './withNavigationContext';

export default withNavigationContext(
  ({ fullpage, children, href, className = null, ...extra }) => {
    const { navigation, navigate } = fullpage;

    const handleClick = event => {
      event.preventDefault();
      if (navigation.navigating === false) {
        navigate({
          ...navigation,
          goto: href.replace(/^\//, ''),
        });
      }
    };

    return (
      <a className={className} onClick={handleClick} href={href} {...extra}>
        {children}
      </a>
    );
  }
);
