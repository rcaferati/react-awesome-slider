// src/__tests__/navigation/withNavigationHandlers.test.tsx (drop-in replacement)
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
  await Promise.resolve();
});

vi.mock('@rcaferati/wac', () => ({
  frameThrower: (n: number) => frameThrowerMock(n),
}));

// -----------------------------
// helpers
// -----------------------------
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

const actSetPath = async (path: string) => {
  await act(async () => {
    setPath(path);
    await Promise.resolve();
  });
};

const actPop = async () => {
  await act(async () => {
    dispatchPop();
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

  __setApi?: (api: any) => void;
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
  const prevSelectedRef = React.useRef<any>(selected);

  selectedRef.current = selected;

  const triggerStart = React.useCallback(
    (nextSlug: string) => {
      onTransitionStart?.({ nextMedia: { slug: nextSlug } });
    },
    [onTransitionStart]
  );

  const triggerEnd = React.useCallback(
    (currentSlug: string) => {
      onTransitionEnd?.({ currentMedia: { slug: currentSlug } });
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

  React.useEffect(() => {
    if (!__auto) return;

    const prev = prevSelectedRef.current;
    const next = selected;

    if (prev === next) return;

    triggerStart(String(next ?? ''));
    Promise.resolve().then(() => triggerEnd(String(next ?? '')));

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

  beforeEach(async () => {
    vi.clearAllMocks();
    document.body.innerHTML = '';

    pushSpy = vi.spyOn(window.history, 'pushState');

    // establish a known initial location
    await actSetPath('/home');
  });

  afterEach(() => {
    pushSpy?.mockRestore?.();
    document.body.innerHTML = '';
  });

  it('URL → goto sync on popstate (latest wins) and lands on URL via fake slider', async () => {
    let latest: NavigationState | null = null;
    let api: any = null;

    render(
      <Provider slug="home" defaultSlug="home">
        <NavSpy onSnap={(s) => (latest = s)} />
        <SliderWithHandlers __setApi={(x: any) => (api = x)} />
      </Provider>
    );

    expect(latest?.goto).toBe('home');

    // pop to /about
    await actSetPath('/about');
    await actPop();

    await waitFor(() => {
      expect(latest?.goto).toBe('about');
    });

    // fake slider should have landed and handlers should settle
    await waitFor(() => {
      expect(latest?.slug).toBe('about');
      expect(latest?.navigating).toBe(false);
    });

    // No extra pushState from handlers on pop/sync-driven flow.
    // We called setPath('/home') in beforeEach and setPath('/about') here.
    const pushed = pushSpy.mock.calls.map((c: any[]) => c[2]);
    const aboutCount = pushed.filter((p: string) => p === '/about').length;
    expect(aboutCount).toBe(1);

    expect(typeof api?.getSelected).toBe('function');
    expect(api.getSelected()).toBe('about');
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

    await actSetPath('/contact');
    await flushMicro();

    expect(latest?.goto).toBe('contact');

    // click-driven intent: goto about (pop=false)
    await act(async () => {
      setNav?.({ ...(latest as any), pop: false, goto: 'about' });
    });

    await waitFor(() => {
      expect(latest?.goto).toBe('about');
    });

    // start click-driven transition to about
    await act(async () => {
      api.triggerStart('about');
    });

    // user hits back mid-flight: URL becomes /contact, then engine ends at "about"
    await actSetPath('/contact');
    await actPop();

    await act(async () => {
      api.triggerEnd('about');
    });

    await waitFor(() => {
      expect(latest?.goto).toBe('contact');
    });

    // corrective transition to contact
    await act(async () => {
      api.triggerStart('contact');
      api.triggerEnd('contact');
    });

    await waitFor(() => {
      expect(latest?.slug).toBe('contact');
      expect(latest?.navigating).toBe(false);
    });

    // click-driven start should have pushed /about at least once
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

    await actSetPath('/about');

    // Mark "landed" as about
    await act(async () => {
      api.triggerEnd('about');
    });

    await flushMicro();
    expect(latest?.slug).toBe('about');

    // URL wants /contact
    await actSetPath('/contact');

    // Make goto already equal URL so syncToUrl reaches the retry stage and uses force.
    await act(async () => {
      setNav?.({
        ...(latest as any),
        pop: true,
        goto: 'contact',
        navigating: false,
      });
    });

    await flushMicro();
    expect(latest?.goto).toBe('contact');

    let forceCalls = 0;
    const forceTransition = () => {
      forceCalls += 1;
      api.triggerStart('contact');
      api.triggerEnd('contact');
    };

    await act(async () => {
      api.triggerReject({
        currentSlug: 'about',
        nextSlug: 'contact',
        forceTransition,
      });
    });

    // kick sync loop (pop-driven)
    await actPop();

    await waitFor(() => {
      expect(latest?.slug).toBe('contact');
    });

    expect(forceCalls).toBeGreaterThanOrEqual(1);
    expect(frameThrowerMock).toHaveBeenCalled();
  });

  it('URL-driven start latch prevents pushState when cleanPath differs from nextSlug during pop/sync-driven start', async () => {
    let latest: NavigationState | null = null;
    let api: any = null;

    // IMPORTANT:
    // Use __auto={false} so we can:
    // 1) allow syncToUrl to align goto to URL (arming latch)
    // 2) THEN mutate URL so cleanPath differs
    // 3) THEN manually fire transitionStart (consuming latch)
    render(
      <Provider slug="home" defaultSlug="home">
        <NavSpy onSnap={(s) => (latest = s)} />
        <SliderWithHandlers __setApi={(x: any) => (api = x)} __auto={false} />
      </Provider>
    );

    await actSetPath('/home');
    await flushMicro();
    expect(latest?.goto).toBe('home');

    // pop to /about -> syncToUrl should set goto=about and arm latch
    await actSetPath('/about');
    await actPop();

    await waitFor(() => {
      expect(latest?.goto).toBe('about');
    });

    // Now create the race:
    // URL flips back to /home BEFORE transitionStart is emitted.
    await actSetPath('/home');

    // Manually emit transitionStart for "about" while cleanPath is "home".
    // Latch must suppress pushState('/about').
    await act(async () => {
      api.triggerStart('about');
    });

    // sanity: handler set navigating true
    await waitFor(() => {
      expect(latest?.navigating).toBe(true);
    });

    // Assert handlers did NOT add an extra '/about' pushState.
    // We called setPath('/about') exactly once in this test.
    const pushed = pushSpy.mock.calls.map((c: any[]) => c[2]);
    const aboutCount = pushed.filter((p: string) => p === '/about').length;
    expect(aboutCount).toBe(1);
  });
});
