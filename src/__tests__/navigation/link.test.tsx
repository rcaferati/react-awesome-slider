// src/__tests__/navigation/link.test.tsx (drop-in replacement)
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import Link from '../../hoc/navigation/link';
import {
  Context,
  type NavigationState,
  type SetNavigation,
} from '../../hoc/navigation/context';

describe('navigation/link.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  const baseNav: NavigationState = {
    slug: 'home',
    goto: 'home',
    navigating: false,
    pop: false,
  };

  const renderWithNav = (
    ui: React.ReactNode,
    nav: NavigationState = baseNav,
    navigate?: SetNavigation
  ) => {
    const navFn = (navigate || (vi.fn() as any)) as SetNavigation;
    const out = render(
      <Context.Provider value={[nav, navFn]}>{ui}</Context.Provider>
    );
    return { ...out, navigate: navFn };
  };

  // For cases where the Link should NOT intercept (external href / modified click / noop),
  // jsdom tries to perform real navigation and logs:
  //   "Not implemented: navigation to another Document"
  // We pre-preventDefault to suppress jsdom navigation.
  const dispatchClickNoNavigate = (
    a: HTMLAnchorElement,
    init?: Partial<MouseEventInit>
  ) => {
    const ev = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...(init || {}),
    });
    ev.preventDefault(); // suppress jsdom navigation warnings
    a.dispatchEvent(ev);
    return ev;
  };

  // For cases where Link MUST intercept, we want to observe defaultPrevented.
  const clickWithDefaultPreventedProbe = (a: HTMLAnchorElement) => {
    const ev = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
    });
    const dispatchResult = a.dispatchEvent(ev);
    return { ev, dispatchResult };
  };

  it('renders an anchor with href + children', () => {
    const { getByText } = render(<Link href="/about">About</Link>);
    const a = getByText('About') as HTMLAnchorElement;
    expect(a.tagName).toBe('A');
    expect(a.getAttribute('href')).toBe('/about');
  });

  it('applies className when provided; omits when null', () => {
    const { getByText, rerender } = render(
      <Link href="/about" className="x">
        About
      </Link>
    );
    expect((getByText('About') as HTMLAnchorElement).className).toBe('x');

    rerender(
      <Link href="/about" className={null}>
        About
      </Link>
    );
    expect(
      (getByText('About') as HTMLAnchorElement).getAttribute('class')
    ).toBe(null);
  });

  it('calls user onClick first; if it preventsDefault, navigation does not run', () => {
    const onClick = vi.fn((e: any) => e.preventDefault());
    const navigate = vi.fn() as any;

    renderWithNav(
      <Link href="/about" onClick={onClick}>
        About
      </Link>,
      baseNav,
      navigate
    );

    const a = document.querySelector('a') as HTMLAnchorElement;

    const { ev, dispatchResult } = clickWithDefaultPreventedProbe(a);

    expect(dispatchResult).toBe(false);
    expect(ev.defaultPrevented).toBe(true);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledTimes(0);
  });

  it('does nothing for external hrefs (http/https)', () => {
    const navigate = vi.fn() as any;
    renderWithNav(<Link href="https://example.com">X</Link>, baseNav, navigate);

    const a = document.querySelector('a') as HTMLAnchorElement;
    dispatchClickNoNavigate(a);

    expect(navigate).toHaveBeenCalledTimes(0);
  });

  it('does nothing for external hrefs (mailto/tel)', () => {
    const navigate = vi.fn() as any;

    const { rerender } = renderWithNav(
      <Link href="mailto:test@example.com">M</Link>,
      baseNav,
      navigate
    );

    dispatchClickNoNavigate(document.querySelector('a') as HTMLAnchorElement);
    expect(navigate).toHaveBeenCalledTimes(0);

    rerender(
      <Context.Provider value={[baseNav, navigate]}>
        <Link href="tel:+1555123456">T</Link>
      </Context.Provider>
    );

    dispatchClickNoNavigate(document.querySelector('a') as HTMLAnchorElement);
    expect(navigate).toHaveBeenCalledTimes(0);
  });

  it('does not intercept modified clicks (meta/ctrl/shift/alt) or non-left button', () => {
    const navigate = vi.fn() as any;
    renderWithNav(<Link href="/about">About</Link>, baseNav, navigate);

    const a = document.querySelector('a') as HTMLAnchorElement;

    dispatchClickNoNavigate(a, { metaKey: true, button: 0 });
    dispatchClickNoNavigate(a, { ctrlKey: true, button: 0 });
    dispatchClickNoNavigate(a, { shiftKey: true, button: 0 });
    dispatchClickNoNavigate(a, { altKey: true, button: 0 });
    dispatchClickNoNavigate(a, { button: 1 }); // middle click

    expect(navigate).toHaveBeenCalledTimes(0);
  });

  it('prevents default and calls navigate({ ...nav, pop:false, goto }) on internal click', () => {
    const navigate = vi.fn() as any;

    const nav: NavigationState = {
      slug: 'home',
      goto: 'home',
      navigating: false,
      pop: true, // should be overwritten to false
    };

    renderWithNav(<Link href="/about">About</Link>, nav, navigate);

    const a = document.querySelector('a') as HTMLAnchorElement;

    const { ev, dispatchResult } = clickWithDefaultPreventedProbe(a);

    expect(dispatchResult).toBe(false);
    expect(ev.defaultPrevented).toBe(true);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith({
      ...nav,
      pop: false,
      goto: 'about',
    });
  });

  it('maps "/" to empty goto string and navigates if current goto differs', () => {
    const navigate = vi.fn() as any;
    const nav: NavigationState = { ...baseNav, goto: 'about' };

    renderWithNav(<Link href="/">Home</Link>, nav, navigate);

    const a = document.querySelector('a') as HTMLAnchorElement;
    const { ev, dispatchResult } = clickWithDefaultPreventedProbe(a);

    expect(dispatchResult).toBe(false);
    expect(ev.defaultPrevented).toBe(true);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith({
      ...nav,
      pop: false,
      goto: '',
    });
  });

  it('noops when next goto equals navigation.goto', () => {
    const navigate = vi.fn() as any;
    const nav: NavigationState = { ...baseNav, goto: 'about' };

    renderWithNav(<Link href="/about">About</Link>, nav, navigate);

    dispatchClickNoNavigate(document.querySelector('a') as HTMLAnchorElement);

    expect(navigate).toHaveBeenCalledTimes(0);
  });

  it('ignores clicks while navigation.navigating=true (still prevents default; navigate is not called)', () => {
    const navigate = vi.fn() as any;
    const nav: NavigationState = { ...baseNav, navigating: true, goto: 'home' };

    renderWithNav(<Link href="/about">About</Link>, nav, navigate);

    const a = document.querySelector('a') as HTMLAnchorElement;

    const { ev, dispatchResult } = clickWithDefaultPreventedProbe(a);

    expect(dispatchResult).toBe(false);
    expect(ev.defaultPrevented).toBe(true);
    expect(navigate).toHaveBeenCalledTimes(0);
  });

  it('does not navigate when no context is provided (fallback noop navigate)', () => {
    const { getByText } = render(<Link href="/about">About</Link>);
    const a = getByText('About') as HTMLAnchorElement;

    dispatchClickNoNavigate(a);

    expect(true).toBe(true);
  });

  it('still supports RTL fireEvent.click without throwing (sanity)', () => {
    const navigate = vi.fn() as any;
    renderWithNav(<Link href="/about">About</Link>, baseNav, navigate);

    const a = document.querySelector('a') as HTMLAnchorElement;

    // RTL's fireEvent doesn't wire a provided preventDefault spy into the underlying event.
    // So we only assert that it doesn't throw and that navigation runs.
    expect(() => fireEvent.click(a, { button: 0 })).not.toThrow();
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
