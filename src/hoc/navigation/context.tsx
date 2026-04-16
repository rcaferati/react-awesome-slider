// navigation/context.tsx
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type NavigationState = {
  slug: string;
  goto: string;
  navigating: boolean;
  pop: boolean;
  defaultSlug?: string;
};

export type SetNavigation = (next: Partial<NavigationState> | string) => void;

export const Context = createContext<[NavigationState, SetNavigation]>([
  { slug: '', goto: '', navigating: false, pop: false, defaultSlug: '' },
  () => {},
]);

const getCleanPath = (path: unknown) =>
  String(path || '')
    .replace(/^\//, '')
    .replace(/\/$/, '');

export type ProviderProps = {
  slug: string;
  defaultSlug?: string;
  children?: React.ReactNode;
};

export const Provider: React.FC<ProviderProps> = ({
  slug,
  defaultSlug = '',
  children,
}) => {
  const cleanPage = useMemo(() => {
    const cleanPageRaw = getCleanPath(slug);
    return cleanPageRaw || defaultSlug || '';
  }, [slug, defaultSlug]);

  const [state, setState] = useState<NavigationState>(() => ({
    slug: cleanPage,
    goto: cleanPage,
    navigating: false,
    pop: false,
    defaultSlug,
  }));

  // Re-anchor when slug prop changes, but don't clobber in-flight nav.
  useEffect(() => {
    setState((prev) => {
      // If we're mid-transition, don't force navigating=false or stomp goto.
      if (prev.navigating === true) {
        return {
          ...prev,
          slug: cleanPage,
          defaultSlug,
          // keep goto as-is while navigating; end-handler will reconcile
        };
      }

      return {
        ...prev,
        slug: cleanPage,
        goto: cleanPage,
        navigating: false,
        pop: false,
        defaultSlug,
      };
    });
  }, [cleanPage, defaultSlug]);

  const setNavigation = useCallback<SetNavigation>(
    (params) => {
      if (params && typeof params === 'object') {
        setState((prev) => ({ ...prev, ...params }));
        return;
      }

      const nextRaw = getCleanPath(params);
      const next = nextRaw || defaultSlug || '';

      setState((prev) => ({ ...prev, goto: next }));
    },
    [defaultSlug]
  );

  return (
    <Context.Provider value={[state, setNavigation]}>
      {children}
    </Context.Provider>
  );
};
