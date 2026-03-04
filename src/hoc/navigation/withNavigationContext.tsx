// navigation/withNavigationContext.tsx
import React, { useContext, useMemo } from 'react';
import { Context } from './context';
import type { NavigationState, SetNavigation } from './context';

export type Fullpage = {
  navigation: NavigationState;
  navigate: SetNavigation;
};

export type WithNavigationInjectedProps = {
  fullpage: Fullpage;
};

const FALLBACK_NAV: NavigationState = {
  slug: '',
  goto: '',
  navigating: false,
  pop: false,
};

export default function withNavigationContext<P extends object>(
  Component: React.ComponentType<P & WithNavigationInjectedProps>
) {
  function WithNavigationContext(props: P) {
    const value = useContext(Context);

    const navigation: NavigationState =
      (value && (value as any)[0]) || FALLBACK_NAV;

    const navigate: SetNavigation =
      (value && (value as any)[1]) || ((() => {}) as SetNavigation);

    const fullpage = useMemo<Fullpage>(
      () => ({
        navigation,
        navigate,
      }),
      [navigation, navigate]
    );

    return <Component {...props} fullpage={fullpage} />;
  }

  WithNavigationContext.displayName = `withNavigationContext(${
    (Component as any).displayName || (Component as any).name || 'Component'
  })`;

  return WithNavigationContext;
}
