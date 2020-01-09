import React from 'react';
import {
  withNavigationContext,
  Link,
} from 'react-awesome-slider/dist/navigation';
import ReactLogo from '../react-logo/react-logo';
import './nav.scss';

const Nav = withNavigationContext(({ fullpage }) => {
  const { slug } = fullpage.navigation;

  return (
    <header className="page-header">
      <div className="page-header__wrapper">
        <div className="page-header__title">
          <ReactLogo />
          <div>
            <h1>
              <span>REACT</span>
              <span>AWESOME SLIDER</span>
            </h1>
            <h2>FULL-PAGE TRANSITION STRATEGY</h2>
            <small>
              Built with love & coffee by{' '}
              <a target="_blank" href="https://caferati.me">
                @rcaferati
              </a>
            </small>
          </div>
        </div>
        <nav>
          <Link className={slug === '' ? 'selected' : null} href="/">
            index
          </Link>
          <Link
            className={slug === 'page-two' ? 'selected' : null}
            href="/page-two"
          >
            page-two
          </Link>
          <Link
            className={slug === 'page-three' ? 'selected' : null}
            href="/page-three"
          >
            page-three
          </Link>
        </nav>
      </div>
    </header>
  );
});

export default Nav;
