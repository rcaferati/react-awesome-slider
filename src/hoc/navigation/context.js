import React, { useState } from 'react';

const Context = React.createContext([{}, () => {}]);

const Provider = ({ page, children }) => {
  const [state, setState] = useState({
    slug: page,
    goto: page,
    navigating: false,
  });

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
