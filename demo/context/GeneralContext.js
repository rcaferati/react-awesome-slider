import React from 'react';

const initialState = {
  '--bullets': true,
  '--organicArrows': true,
  '--fillParent': false,
};

export const GeneralContext = React.createContext({});

export class GeneralContextProvider extends React.Component {
  state = {
    general: initialState,
  };

  componentWillReceiveProps() {}

  setGeneral = general => {
    this.setState({ general });
  };

  resetGeneral = () => {
    this.setState({ general: initialState });
  };

  render() {
    const { children } = this.props;
    return (
      <GeneralContext.Provider
        value={{
          general: this.state.general,
          resetGeneral: this.resetGeneral,
          setGeneral: this.setGeneral,
        }}
      >
        {children}
      </GeneralContext.Provider>
    );
  }
}
