// navigation/link.tsx
import React, { useCallback, useMemo } from 'react';
import withNavigationContext from './withNavigationContext';
import type { NavigationState, SetNavigation } from './context';

type Fullpage = {
  navigation: NavigationState;
  navigate: SetNavigation;
};

const isModifiedClick = (e: React.MouseEvent) =>
  e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.button !== 0;

const isExternalHref = (href: unknown) => {
  const h = String(href || '');
  return (
    /^([a-z][a-z0-9+.-]*:)?\/\//i.test(h) ||
    /^mailto:/i.test(h) ||
    /^tel:/i.test(h)
  );
};

const cleanHrefToGoto = (href: unknown) =>
  String(href || '')
    .replace(/^\//, '')
    .replace(/\/$/, '');

export type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'className' | 'onClick'
> & {
  fullpage?: Fullpage;
  href: string;
  className?: string | null;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children?: React.ReactNode;
};

export default withNavigationContext((props: LinkProps) => {
  const { fullpage, children, href, className = null, onClick, ...extra } =
    props;

  const navigation = fullpage?.navigation;
  const navigate = fullpage?.navigate;

  const goto = useMemo(() => cleanHrefToGoto(href), [href]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // let user handler run first
      if (typeof onClick === 'function') onClick(event);
      if (event.defaultPrevented) return;

      // no nav context / no href / external => let browser handle
      if (!navigation || typeof navigate !== 'function' || !href) return;
      if (isExternalHref(href)) return;

      // allow middle click / cmd-click / ctrl-click / shift-click etc.
      if (isModifiedClick(event)) return;

      event.preventDefault();

      // ignore clicks while a transition is in progress
      if (navigation.navigating === true) return;

      // IMPORTANT: allow "/" to map to empty goto (Provider/handlers decide fallback)
      const nextGoto = goto;

      // noop if already targeting same goto
      if (nextGoto === navigation.goto) return;

      navigate({
        ...navigation,
        pop: false, // click-driven
        goto: nextGoto,
      });
    },
    [onClick, navigation, navigate, href, goto]
  );

  return (
    <a
      className={className || undefined}
      onClick={handleClick}
      href={href}
      {...extra}
    >
      {children}
    </a>
  );
});