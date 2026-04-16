// src/__tests__/navigation/withNavigationHandlers.integration.test.tsx (drop-in replacement)
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';

import {
  Provider,
  Context,
  type NavigationState,
  type SetNavigation,
} from '../../hoc/navigation/context';
import withNavigationHandlers from '../../hoc/navigation/withNavigationHandlers';

// -----------------------------
// wac mock (deterministic ticks)
// -----------------------------
const frameThrowerMock = vi.fn(async (_n: number) => {
  // yield to microtask queue so the sync loop can progress deterministically
  await Promise.resolve();
});

vi.mock('@rcaferati/wac', () => ({
  frameThrower: (n: number) => frameThrowerMock(n),
}));

// -----------------------------
// helpers
// -----------------------------
const clean = (p: string) =>
  String(p || '')
    .replace(/^\//, '')
    .replace(/\/$/, '');

const setPath = (path: string) => {
  window.history.pushState({}, '', path);
};

const dispatchPop = () => {
  window.dispatchEvent(new PopStateEvent('popstate'));
};

const flushMicro = async () => {
  await act(async () => {
    await Promise.resolve();
  });
  await act(async () => {
    await Promise.resolve();
  });
};

const actPop = async (fn: () => void) => {
  await act(async () => {
    fn();
    await Promise.resolve();
  });
};

// -----------------------------
// Fake Slider (drives callbacks)
// -----------------------------
type SliderLikeProps = {
  selected?: any;
  onTransitionStart?: (info: any) => void;
  onTransitionEnd?: (info: any) => void;
  onTransitionReject?: (info: any) => void;

  // test hook
  __setApi?: (api: any) => void;

  // when true, automatically fires start/end when selected changes
  __auto?: boolean;
};

function FakeSlider(props: SliderLikeProps) {
  const {
    selected,
    onTransitionStart,
    onTransitionEnd,
    onTransitionReject,
    __setApi,
    __auto = true,
  } = props;

  const selectedRef = React.useRef<any>(selected);
  selectedRef.current = selected;

  const triggerStart = React.useCallback(
    (nextSlug: string) => {
      onTransitionStart?.({
        nextMedia: { slug: nextSlug },
      });
    },
    [onTransitionStart]
  );

  const triggerEnd = React.useCallback(
    (currentSlug: string) => {
      onTransitionEnd?.({
        currentMedia: { slug: currentSlug },
      });
    },
    [onTransitionEnd]
  );

  const triggerReject = React.useCallback(
    (args: {
      currentSlug?: string;
      nextSlug?: string;
      forceTransition?: () => void;
    }) => {
      const { currentSlug, nextSlug, forceTransition } = args;
      onTransitionReject?.({
        currentMedia: currentSlug ? { slug: currentSlug } : undefined,
        nextMedia: nextSlug ? { slug: nextSlug } : undefined,
        forceTransition,
      });
    },
    [onTransitionReject]
  );

  React.useEffect(() => {
    __setApi?.({
      getSelected: () => selectedRef.current,
      triggerStart,
      triggerEnd,
      triggerReject,
    });
  }, [__setApi, triggerStart, triggerEnd, triggerReject]);

  // Auto "engine": selected change => tx:start then tx:end in next microtask.
  const prevSelectedRef = React.useRef<any>(selected);
  React.useEffect(() => {
    if (!__auto) return;

    const prev = prevSelectedRef.current;
    const next = selected;

    if (prev === next) return;

    triggerStart(String(next ?? ''));

    Promise.resolve().then(() => {
      triggerEnd(String(next ?? ''));
    });

    prevSelectedRef.current = next;
  }, [selected, __auto, triggerStart, triggerEnd]);

  return (
    <div data-testid="fake-slider" data-selected={String(selected ?? '')} />
  );
}

const SliderWithHandlers = withNavigationHandlers(FakeSlider);

// -----------------------------
// Harness to observe nav state
// -----------------------------
function NavSpy(props: {
  onSnap: (s: NavigationState, setNav: SetNavigation) => void;
}) {
  const [state, setNav] = React.useContext(Context);
  React.useEffect(() => {
    props.onSnap(state, setNav);
  }, [state, setNav, props]);
  return null;
}

describe('navigation/withNavigationHandlers.tsx (integration)', () => {
  let pushSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    setPath('/home');
    pushSpy = vi.spyOn(window.history, 'pushState');
  });

  afterEach(() => {
    pushSpy?.mockRestore?.();
    document.body.innerHTML = '';
  });

  it('URL → goto sync on popstate (latest wins) and lands on URL via fake slider', async () => {
    let latest: NavigationState | null = null;
    let setNav: SetNavigation | null = null;
    let api: any = null;

    render(
      <Provider slug="home" defaultSlug="home">
        <NavSpy
          onSnap={(s, sn) => {
            latest = s;
            setNav = sn;
          }}
        />
        <SliderWithHandlers __setApi={(x: any) => (api = x)} />
      </Provider>
    );

    expect(latest?.goto).toBe('home');
    expect(clean(window.location.pathname)).toBe('home');

    // pop to /about
    await actPop(() => {
      setPath('/about');
      dispatchPop();
    });

    await waitFor(() => {
      expect(latest?.goto).toBe('about');
    });

    // fake slider should have landed and handlers should settle
    await waitFor(() => {
      expect(latest?.slug).toBe('about');
      expect(latest?.navigating).toBe(false);
    });

    // Pop-driven flow should not create extra pushState calls beyond our explicit setPath('/about')
    const calls = pushSpy.mock.calls.map((c: any[]) => c[2]);
    expect(calls.filter((p: string) => p === '/about').length).toBe(1);

    // sanity: api exists
    expect(typeof api?.getSelected).toBe('function');
    expect(api.getSelected()).toBe('about');

    void setNav;
  });

  it('mismatch handling: end on wrong page sets goto to URL and triggers resync/second transition', async () => {
    let latest: NavigationState | null = null;
    let setNav: SetNavigation | null = null;
    let api: any = null;

    render(
      <Provider slug="contact" defaultSlug="home">
        <NavSpy
          onSnap={(s, sn) => {
            latest = s;
            setNav = sn;
          }}
        />
        <SliderWithHandlers __setApi={(x: any) => (api = x)} __auto={false} />
      </Provider>
    );

    // Align URL to contact for this scenario.
    await actPop(() => {
      setPath('/contact');
    });

    await flushMicro();
    expect(latest?.goto).toBe('contact');

    // Click-driven intent: go to about
    await act(async () => {
      setNav?.({
        ...latest!,
        pop: false,
        goto: 'about',
      } as any);
    });

    await waitFor(() => {
      expect(latest?.goto).toBe('about');
    });

    // Simulate engine start to about (click-driven)
    await act(async () => {
      api.triggerStart('about');
    });
    await flushMicro();

    // Meanwhile user pressed back and URL is now /contact.
    await actPop(() => {
      setPath('/contact');
      dispatchPop();
    });

    // Engine ends at about (wrong page vs URL).
    await act(async () => {
      api.triggerEnd('about');
    });

    await waitFor(() => {
      expect(latest?.goto).toBe('contact');
    });

    // Now the corrective transition should occur to contact.
    await act(async () => {
      api.triggerStart('contact');
      api.triggerEnd('contact');
    });

    await waitFor(() => {
      expect(latest?.slug).toBe('contact');
      expect(latest?.navigating).toBe(false);
    });

    // Verify we did pushState at least once for the click-driven navigation to about.
    const pushed = pushSpy.mock.calls.map((c: any[]) => c[2]);
    expect(pushed).toContain('/about');
  });

  it('reject arms forceTransition and syncToUrl retries (calls force at tick cadence)', async () => {
    let latest: NavigationState | null = null;
    let setNav: SetNavigation | null = null;
    let api: any = null;

    render(
      <Provider slug="about" defaultSlug="home">
        <NavSpy
          onSnap={(s, sn) => {
            latest = s;
            setNav = sn;
          }}
        />
        <SliderWithHandlers __setApi={(x: any) => (api = x)} __auto={false} />
      </Provider>
    );

    // Start fully on /about, landed = about (simulate by firing end).
    await act(async () => {
      setPath('/about');
      api.triggerEnd('about');
    });

    await flushMicro();
    expect(latest?.slug).toBe('about');

    // URL says /contact but we've "landed" about.
    await actPop(() => {
      setPath('/contact');
    });

    // Keep goto already at contact (so syncToUrl reaches step (4) and uses force).
    await act(async () => {
      setNav?.({
        ...latest!,
        pop: true,
        goto: 'contact',
        navigating: false,
      } as any);
    });

    await flushMicro();
    expect(latest?.goto).toBe('contact');

    let forceCalls = 0;
    const forceTransition = () => {
      forceCalls += 1;
      // emulate successful retry by transitioning to contact
      api.triggerStart('contact');
      api.triggerEnd('contact');
    };

    // Arm force via reject payload
    await act(async () => {
      api.triggerReject({
        currentSlug: 'about',
        nextSlug: 'contact',
        forceTransition,
      });
    });

    // Start sync loop via popstate (URL-driven)
    await actPop(() => {
      dispatchPop();
    });

    await waitFor(() => {
      expect(latest?.slug).toBe('contact');
    });

    expect(forceCalls).toBeGreaterThanOrEqual(1);
    expect(frameThrowerMock).toHaveBeenCalled(); // loop ticked at least once
  });

  it('URL-driven start latch prevents pushState when cleanPath differs from nextSlug during pop/sync-driven start', async () => {
    let latest: NavigationState | null = null;
    let setNav: SetNavigation | null = null;
    let api: any = null;

    // IMPORTANT: __auto=false so we control exactly when transitionStart happens.
    render(
      <Provider slug="home" defaultSlug="home">
        <NavSpy
          onSnap={(s, sn) => {
            latest = s;
            setNav = sn;
          }}
        />
        <SliderWithHandlers __setApi={(x: any) => (api = x)} __auto={false} />
      </Provider>
    );

    // We start at /home
    await actPop(() => {
      setPath('/home');
    });

    expect(latest?.goto).toBe('home');

    // Popstate to /about => syncToUrl aligns goto="about" and arms the one-shot latch.
    await actPop(() => {
      setPath('/about');
      dispatchPop();
    });

    await waitFor(() => {
      expect(latest?.goto).toBe('about');
    });

    // Now simulate the "race": URL flips back to /home BEFORE transitionStart runs,
    // so cleanPath !== nextSlug when transitionStart fires.
    await actPop(() => {
      setPath('/home');
    });

    // Trigger transitionStart for "about" (this goes through handlers).
    await act(async () => {
      api.triggerStart('about');
      await Promise.resolve();
    });

    // Latch should prevent pushState('/about') even though cleanPath is currently "home".
    const pushed = pushSpy.mock.calls.map((c: any[]) => c[2]);
    const aboutPushes = pushed.filter((p: string) => p === '/about').length;

    // We called setPath('/about') exactly once. Handler must NOT add another.
    expect(aboutPushes).toBe(1);

    // sanity: handler should keep goto about
    expect(latest?.goto).toBe('about');

    void setNav;
  });

  it('navigates back to the empty root slug and writes "/" to history', async () => {
    let latest: NavigationState | null = null;
    let api: any = null;

    setPath('/about');

    render(
      <Provider slug="/about/">
        <NavSpy
          onSnap={(s) => {
            latest = s;
          }}
        />
        <SliderWithHandlers __setApi={(x: any) => (api = x)} __auto={false} />
      </Provider>
    );

    await act(async () => {
      api.triggerStart('');
    });

    expect(window.location.pathname).toBe('/');

    await act(async () => {
      api.triggerEnd('');
    });

    await waitFor(() => {
      expect(latest?.slug).toBe('');
      expect(latest?.goto).toBe('');
      expect(latest?.navigating).toBe(false);
    });

    const pushed = pushSpy.mock.calls.map((c: any[]) => c[2]);
    expect(pushed).toContain('/');
  });

  it('popstate to "/" selects the empty root slug when no defaultSlug is configured', async () => {
    let latest: NavigationState | null = null;
    let api: any = null;

    setPath('/about');

    render(
      <Provider slug="/about/">
        <NavSpy
          onSnap={(s) => {
            latest = s;
          }}
        />
        <SliderWithHandlers __setApi={(x: any) => (api = x)} />
      </Provider>
    );

    await actPop(() => {
      setPath('/');
      dispatchPop();
    });

    await waitFor(() => {
      expect(latest?.goto).toBe('');
    });

    await waitFor(() => {
      expect(latest?.slug).toBe('');
      expect(latest?.navigating).toBe(false);
    });

    expect(api.getSelected()).toBe('');
  });

  it('popstate to "/" resolves to defaultSlug when one is configured', async () => {
    let latest: NavigationState | null = null;
    let api: any = null;

    setPath('/about');

    render(
      <Provider slug="/about/" defaultSlug="home">
        <NavSpy
          onSnap={(s) => {
            latest = s;
          }}
        />
        <SliderWithHandlers __setApi={(x: any) => (api = x)} />
      </Provider>
    );

    await actPop(() => {
      setPath('/');
      dispatchPop();
    });

    await waitFor(() => {
      expect(latest?.goto).toBe('home');
    });

    await waitFor(() => {
      expect(latest?.slug).toBe('home');
      expect(latest?.navigating).toBe(false);
    });

    expect(api.getSelected()).toBe('home');
  });
});
