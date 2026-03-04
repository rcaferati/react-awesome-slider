// src/__tests__/navigation/context.test.tsx
import React, { useContext, useLayoutEffect } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';

import {
  Context,
  Provider,
  type NavigationState,
  type SetNavigation,
} from '../../hoc/navigation/context';

// Microtask-only flush (safe)
const flushMicro = async () => {
  await act(async () => {
    await Promise.resolve();
  });
  await act(async () => {
    await Promise.resolve();
  });
};

// Passive-effect flush (macrotask turn; use real timers)
const flushPassive = async () => {
  await flushMicro();
  await act(async () => {
    await new Promise<void>((r) => setTimeout(r, 0));
  });
  await flushMicro();
};

type Snap = { state: NavigationState; setNav: SetNavigation };

function Capture({ onSnap }: { onSnap: (snap: Snap) => void }) {
  const [state, setNav] = useContext(Context);

  // Use layout effect so tests can observe updates deterministically.
  useLayoutEffect(() => {
    onSnap({ state, setNav });
  }, [state, setNav, onSnap]);

  return null;
}

describe('navigation/context.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes state from slug (cleaned)', async () => {
    const onSnap = vi.fn();

    render(
      <Provider slug="/about/">
        <Capture onSnap={onSnap} />
      </Provider>
    );

    await flushPassive();

    const last: Snap = (onSnap.mock.calls.at(-1) as any)[0];
    expect(last.state).toEqual({
      slug: 'about',
      goto: 'about',
      navigating: false,
      pop: false,
    });
  });

  it('uses defaultSlug when slug cleans to empty', async () => {
    const onSnap = vi.fn();

    render(
      <Provider slug="/" defaultSlug="home">
        <Capture onSnap={onSnap} />
      </Provider>
    );

    await flushPassive();

    const last: Snap = (onSnap.mock.calls.at(-1) as any)[0];
    expect(last.state.slug).toBe('home');
    expect(last.state.goto).toBe('home');
  });

  it('re-anchors when slug prop changes (when not navigating): slug + goto follow cleanPage and navigating/pop reset', async () => {
    const onSnap = vi.fn();

    const { rerender } = render(
      <Provider slug="home" defaultSlug="home">
        <Capture onSnap={onSnap} />
      </Provider>
    );

    await flushPassive();

    rerender(
      <Provider slug="/about/" defaultSlug="home">
        <Capture onSnap={onSnap} />
      </Provider>
    );

    await flushPassive();

    const last: Snap = (onSnap.mock.calls.at(-1) as any)[0];
    expect(last.state).toEqual({
      slug: 'about',
      goto: 'about',
      navigating: false,
      pop: false,
    });
  });

  it('re-anchors when slug prop changes (when navigating): updates slug only; preserves goto + navigating', async () => {
    const onSnap = vi.fn();

    const { rerender } = render(
      <Provider slug="contact" defaultSlug="home">
        <Capture onSnap={onSnap} />
      </Provider>
    );

    await flushPassive();

    // Put provider into "navigating" and set a different goto.
    let snap: Snap = (onSnap.mock.calls.at(-1) as any)[0];
    await act(async () => {
      snap.setNav({ navigating: true, goto: 'about' });
    });

    await flushPassive();

    // Now change slug prop while navigating=true
    rerender(
      <Provider slug="home" defaultSlug="home">
        <Capture onSnap={onSnap} />
      </Provider>
    );

    await flushPassive();

    snap = (onSnap.mock.calls.at(-1) as any)[0];

    expect(snap.state.slug).toBe('home'); // updated
    expect(snap.state.navigating).toBe(true); // preserved
    expect(snap.state.goto).toBe('about'); // preserved
  });

  it('setNavigation(object) merges into state (Provider merges patches)', async () => {
    const onSnap = vi.fn();

    render(
      <Provider slug="home" defaultSlug="home">
        <Capture onSnap={onSnap} />
      </Provider>
    );

    await flushPassive();

    const snap: Snap = (onSnap.mock.calls.at(-1) as any)[0];

    await act(async () => {
      snap.setNav({ goto: 'contact', pop: true, navigating: true });
    });

    await flushPassive();

    const last: Snap = (onSnap.mock.calls.at(-1) as any)[0];
    expect(last.state).toMatchObject({
      slug: 'home',
      goto: 'contact',
      pop: true,
      navigating: true,
    });
  });

  it('setNavigation(string) cleans path and sets goto only (does not change slug)', async () => {
    const onSnap = vi.fn();

    render(
      <Provider slug="home" defaultSlug="home">
        <Capture onSnap={onSnap} />
      </Provider>
    );

    await flushPassive();

    const snap: Snap = (onSnap.mock.calls.at(-1) as any)[0];

    await act(async () => {
      snap.setNav('/about/');
    });

    await flushPassive();

    const last: Snap = (onSnap.mock.calls.at(-1) as any)[0];
    expect(last.state.slug).toBe('home');
    expect(last.state.goto).toBe('about');
  });

  it('setNavigation(string) falls back to defaultSlug when cleaned is empty', async () => {
    const onSnap = vi.fn();

    render(
      <Provider slug="about" defaultSlug="home">
        <Capture onSnap={onSnap} />
      </Provider>
    );

    await flushPassive();

    const snap: Snap = (onSnap.mock.calls.at(-1) as any)[0];

    await act(async () => {
      snap.setNav('/');
    });

    await flushPassive();

    const last: Snap = (onSnap.mock.calls.at(-1) as any)[0];
    expect(last.state.slug).toBe('about'); // unchanged
    expect(last.state.goto).toBe('home'); // fallback
  });
});
