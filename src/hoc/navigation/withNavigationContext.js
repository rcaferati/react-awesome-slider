import React, { useContext } from 'react';
import { Context } from './context';

export default Component => {
  return props => {
    const [navigation, setNavigation] = useContext(Context);

    return (
      <Component
        {...props}
        fullpage={{
          navigation,
          navigate: setNavigation,
        }}
      />
    );
  };
};
