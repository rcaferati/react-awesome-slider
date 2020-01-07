import React from 'react';
import { Provider } from 'react-awesome-slider/dist/navigation';
import './layout.css';
import Nav from '../nav/nav';

const Layout = ({ children, page }) => {
  return (
    <Provider page={page}>
      <Nav />
      <main>{children}</main>
    </Provider>
  );
};

export default Layout;
