import React, { useState, useEffect } from 'react';

const Context = React.createContext([{}, () => {}]);

const getCleanPath = path => {
  return path.replace(/^\//, '').replace(/\/$/);
};

const Provider = ({ slug, children }) => {
  const cleanPage = getCleanPath(slug);
  const [state, setState] = useState({
    slug: cleanPage,
    goto: cleanPage,
    navigating: false,
  });

  useEffect(() => {
    setState({
      slug: cleanPage,
      goto: cleanPage,
      navigating: false,
    });
  }, [cleanPage]);

  const setNavigation = params => {
    if (typeof params === 'object') {
      setState(params);
      return;
    }
    setState({
      ...state,
      goto: params.replace(/^\//, ''),
    });
  };

  return (
    <Context.Provider value={[state, setNavigation]}>
      {children}
    </Context.Provider>
  );
};

export { Context, Provider };
