// src/__tests__/core/index.integration.test.tsx (drop-in replacement)
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';

// ------------------ helpers ------------------

// Microtask-only flush: safe for both real and fake timers.
const flushMicro = async () => {
  await act(async () => {
    await Promise.resolve();
  });
  await act(async () => {
    await Promise.resolve();
  });
};

// Passive-effect flush: requires a macrotask turn.
// DO NOT use this while vi.useFakeTimers() is enabled.
const flushPassive = async () => {
  await flushMicro();
  await act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  });
  await flushMicro();
};

// ------------------ mocks ------------------

vi.mock('@rcaferati/wac', () => ({
  onceNextCssLayout: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../core/media', () => ({
  default: ({ media, className }: any) => (
    <div
      data-testid="media"
      data-slug={media?.slug || ''}
      className={className}
    >
      media
    </div>
  ),
}));

vi.mock('../../core/bullets', () => ({
  default: ({ onClick, media }: any) => (
    <button
      data-testid="bullets"
      onClick={() => onClick({ index: 1, direction: true })}
    >
      bullets ({Array.isArray(media) ? media.length : 0})
    </button>
  ),
}));

vi.mock('../../core/buttons', async () => {
  const ReactMod = await import('react');
  const { useLayoutEffect } = ReactMod;

  return {
    default: ({ onMount, onNext, onPrev, rootElement }: any) => {
      const element = ReactMod.useMemo(() => {
        const el = document.createElement('div');
        el.className = `${rootElement}__controls`;
        return el;
      }, [rootElement]);

      const next = ReactMod.useMemo(() => {
        const el = document.createElement('button');
        el.className = `${rootElement}__next`;
        return el;
      }, [rootElement]);

      const prev = ReactMod.useMemo(() => {
        const el = document.createElement('button');
        el.className = `${rootElement}__prev`;
        return el;
      }, [rootElement]);

      useLayoutEffect(() => {
        element.appendChild(prev);
        element.appendChild(next);
        document.body.appendChild(element);

        onMount?.({ element, next, prev });

        return () => {
          try {
            document.body.removeChild(element);
          } catch {
            // ignore
          }
        };
      }, [element, next, prev, onMount]);

      return (
        <div data-testid="buttons">
          <button data-testid="btn-prev" onClick={onPrev}>
            prev
          </button>
          <button data-testid="btn-next" onClick={onNext}>
            next
          </button>
        </div>
      );
    },
  };
});

// --- engine/model mocks (index.tsx wiring focus) ----------------------------

type Ctx = any;

const modelSpies = {
  setupStartup: vi.fn(),
  checkChildren: vi.fn(),
  setupClassNames: vi.fn(),
  getRootClassName: vi.fn(),
  getInfo: vi.fn(),
  getIndex: vi.fn(),
  resetSlider: vi.fn(),
  startup: vi.fn(),
  refreshSlider: vi.fn(),
  goTo: vi.fn(),
  onTransitionRequest: vi.fn(),
  onTransitionEnd: vi.fn(),
  unchargeIndex: vi.fn(),
};

vi.mock('../../core/engine', () => {
  return {
    default: (getCtx: () => Ctx) => ({
      releaseTransition: vi.fn(() => {
        const c = getCtx();
        c.loading = false;
      }),
      animateMobileEnd: (cb?: () => void) => cb?.(),
      activateArrows: vi.fn((_d: boolean, cb?: () => void) => cb?.()),
      startAnimationMobile: vi.fn(),
      startAnimation: vi.fn((_d: boolean, _m: any, cb: any) =>
        cb({ release: true })
      ),
    }),
  };
});

vi.mock('../../core/model', () => {
  return {
    default: (getCtx: () => Ctx, _engine: any) => {
      const api = {
        setupStartup: (props: any) => {
          const ctx = getCtx();

          ctx.classNames = {
            box: 'box',
            wrapper: 'wrapper',
            container: 'container',
            content: 'content',
            active: 'active',
            controlsHidden: 'controlsHidden',
            controlsActive: 'controlsActive',
            startUp: 'startUp',
          };

          ctx.media = props.media || [];
          ctx.index = typeof props.selected === 'number' ? props.selected : 0;

          // ✅ Important for correctness:
          // In real code, "started" should not block selected-change logic when there's
          // no startupScreen. If startupScreen exists, started begins false and startup()
          // flips it true.
          ctx.started = !!props.startupScreen ? false : true;

          ctx.state = {
            index: ctx.index,
            boxA: ctx.media[ctx.index] || {
              slug: String(ctx.index),
              source: '',
            },
            boxB: null,
          };

          modelSpies.setupStartup(props);
        },

        checkChildren: (props: any, prev: any) =>
          modelSpies.checkChildren(props, prev),

        setupClassNames: (css: any) => modelSpies.setupClassNames(css),

        getRootClassName: () => {
          modelSpies.getRootClassName();
          return 'ROOTCLS';
        },

        getInfo: () => {
          const info = { ok: true };
          modelSpies.getInfo();
          return info;
        },

        getIndex: (sel: any) => {
          modelSpies.getIndex(sel);

          if (typeof sel === 'number') return sel;

          if (typeof sel === 'string') {
            const ctx = getCtx();
            const idx = (ctx.media || []).findIndex(
              (m: any) => m?.slug === sel
            );
            return idx >= 0 ? idx : 0;
          }

          return 0;
        },

        resetSlider: (i?: number) => modelSpies.resetSlider(i),

        // scheduling side-effect for unmount cleanup test
        startup: () => {
          modelSpies.startup();
          const ctx = getCtx();

          // ✅ real behavior: startup transitions the instance to "started"
          ctx.started = true;

          // only schedule when startupScreen is in play (keeps tests quiet/clean)
          if (
            ctx?.props?.startupScreen &&
            typeof ctx?._setTimeout === 'function'
          ) {
            ctx._setTimeout(() => {}, 1000);
          }
        },

        refreshSlider: () => modelSpies.refreshSlider(),
        goTo: (args: any) => modelSpies.goTo(args),
        onTransitionRequest: (evt: string, idx: number) =>
          modelSpies.onTransitionRequest(evt, idx),
        onTransitionEnd: () => modelSpies.onTransitionEnd(),
        unchargeIndex: () => modelSpies.unchargeIndex(),
      };

      return api;
    },
  };
});

// Import AFTER mocks
import AwesomeSlider from '../../core/index';

// ------------------ tests ------------------

const PAGES = [
  { slug: 'home', source: 'a' },
  { slug: 'about', source: 'b' },
  { slug: 'contact', source: 'c' },
];

beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('core/index.tsx (AwesomeSlider)', () => {
  it('calls model.setupStartup before first render and uses model.getRootClassName()', () => {
    const { container } = render(
      <AwesomeSlider media={PAGES as any} selected={0} />
    );
    expect(modelSpies.setupStartup).toHaveBeenCalledTimes(1);
    expect(modelSpies.getRootClassName).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeTruthy();
    expect((container.firstChild as HTMLElement).className).toContain(
      'ROOTCLS'
    );
  });

  it('calls onFirstMount with ctx.getInfo()', () => {
    const onFirstMount = vi.fn();
    render(<AwesomeSlider media={PAGES as any} onFirstMount={onFirstMount} />);
    expect(onFirstMount).toHaveBeenCalledTimes(1);
    expect(onFirstMount.mock.calls[0][0]).toEqual({ ok: true });
  });

  it('startupScreen: adds controlsHidden/controlsActive on mount and removes controlsHidden after next layout', async () => {
    render(
      <AwesomeSlider
        media={PAGES as any}
        startupScreen={<div>startup</div>}
        startup={true}
        buttons={true}
      />
    );

    const controls = document.querySelector(
      '.awssld__controls'
    ) as HTMLElement | null;
    expect(controls).toBeTruthy();

    expect(controls!.classList.contains('controlsHidden')).toBe(true);
    expect(controls!.classList.contains('controlsActive')).toBe(true);

    await flushPassive();

    expect(controls!.classList.contains('controlsHidden')).toBe(false);
  });

  it('startupScreen + startup=true + media length > 0 triggers model.startup()', () => {
    render(
      <AwesomeSlider
        media={PAGES as any}
        startupScreen={<div>startup</div>}
        startup={true}
      />
    );
    expect(modelSpies.startup).toHaveBeenCalledTimes(1);
  });

  it('startupScreen + startup=false does NOT trigger model.startup()', () => {
    render(
      <AwesomeSlider
        media={PAGES as any}
        startupScreen={<div>startup</div>}
        startup={false}
      />
    );
    expect(modelSpies.startup).toHaveBeenCalledTimes(0);
  });

  it('prop changes: calls checkChildren + setupClassNames when relevant props change', async () => {
    const { rerender } = render(
      <AwesomeSlider media={PAGES as any} selected={0} />
    );
    expect(modelSpies.checkChildren).toHaveBeenCalledTimes(0);

    await flushPassive(); // ensure prevPropsRef is set

    rerender(<AwesomeSlider media={PAGES as any} selected={0} className="x" />);

    await flushPassive();

    expect(modelSpies.checkChildren).toHaveBeenCalledTimes(1);
    expect(modelSpies.setupClassNames).toHaveBeenCalledTimes(1);
  });

  it('name change triggers resetSlider(getIndex(selected))', async () => {
    const { rerender } = render(
      <AwesomeSlider media={PAGES as any} selected={1} name="a" />
    );

    await flushPassive();

    rerender(<AwesomeSlider media={PAGES as any} selected={1} name="b" />);

    await flushPassive();

    expect(modelSpies.getIndex).toHaveBeenCalledWith(1);
    expect(modelSpies.resetSlider).toHaveBeenCalledTimes(1);
    expect(modelSpies.resetSlider).toHaveBeenCalledWith(1);
  });

  it('selected change triggers goTo({ index, direction })', async () => {
    const { rerender } = render(
      <AwesomeSlider media={PAGES as any} selected={0} infinite={true} />
    );

    await flushPassive(); // ensure prevPropsRef is set

    rerender(
      <AwesomeSlider media={PAGES as any} selected={2} infinite={true} />
    );

    await flushPassive();

    expect(modelSpies.getIndex).toHaveBeenCalledWith(2);
    expect(modelSpies.goTo).toHaveBeenCalledTimes(1);
    expect(modelSpies.goTo).toHaveBeenCalledWith({ index: 2, direction: true });
  });

  it('selected change computes direction=true when infinite wrap-around (last -> 0)', async () => {
    const { rerender } = render(
      <AwesomeSlider media={PAGES as any} selected={2} infinite={true} />
    );

    await flushPassive();

    rerender(
      <AwesomeSlider media={PAGES as any} selected={0} infinite={true} />
    );

    await flushPassive();

    expect(modelSpies.getIndex).toHaveBeenCalledWith(0);
    expect(modelSpies.goTo).toHaveBeenCalledWith({ index: 0, direction: true });
  });

  it('selected change computes direction=false when non-infinite and going backwards (2 -> 0)', async () => {
    const { rerender } = render(
      <AwesomeSlider media={PAGES as any} selected={2} infinite={false} />
    );

    await flushPassive();

    rerender(
      <AwesomeSlider media={PAGES as any} selected={0} infinite={false} />
    );

    await flushPassive();

    expect(modelSpies.getIndex).toHaveBeenCalledWith(0);
    expect(modelSpies.goTo).toHaveBeenCalledWith({
      index: 0,
      direction: false,
    });
  });

  it('buttons: clicking next/prev triggers onTransitionRequest + goTo with computed indices', () => {
    const { getByTestId } = render(
      <AwesomeSlider media={PAGES as any} selected={0} />
    );

    fireEvent.click(getByTestId('btn-next'));
    expect(modelSpies.onTransitionRequest).toHaveBeenCalledWith('next', 1);
    expect(modelSpies.goTo).toHaveBeenCalledWith({ index: 1, direction: true });

    fireEvent.click(getByTestId('btn-prev'));
    expect(modelSpies.onTransitionRequest).toHaveBeenCalledWith('prev', -1);
    expect(modelSpies.goTo).toHaveBeenCalledWith({
      index: -1,
      direction: false,
    });
  });

  it('bullets: clicking calls onTransitionRequest("bullet") and goTo(info)', () => {
    const { getByTestId } = render(
      <AwesomeSlider media={PAGES as any} selected={0} bullets />
    );

    fireEvent.click(getByTestId('bullets'));

    expect(modelSpies.onTransitionRequest).toHaveBeenCalledWith('bullet', 1);
    expect(modelSpies.goTo).toHaveBeenCalledWith({ index: 1, direction: true });
  });

  it('imperative handle exposes getInfo/goTo/resetSlider forwarding to model', () => {
    const ref = React.createRef<any>();
    render(<AwesomeSlider ref={ref} media={PAGES as any} selected={0} />);

    expect(typeof ref.current.getInfo).toBe('function');
    expect(typeof ref.current.goTo).toBe('function');
    expect(typeof ref.current.resetSlider).toBe('function');

    ref.current.getInfo();
    expect(modelSpies.getInfo).toHaveBeenCalledTimes(1);

    ref.current.goTo({ index: 2, direction: true });
    expect(modelSpies.goTo).toHaveBeenCalledWith({ index: 2, direction: true });

    ref.current.resetSlider(1);
    expect(modelSpies.resetSlider).toHaveBeenCalledWith(1);
  });

  it('unmount clears scheduled timeouts created via ctx._setTimeout (startup path)', async () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');

    const { unmount } = render(
      <AwesomeSlider
        media={PAGES as any}
        startupScreen={<div>startup</div>}
        startup={true}
      />
    );

    expect(modelSpies.startup).toHaveBeenCalledTimes(1);

    // Must NOT use flushPassive() under fake timers.
    await flushMicro();

    unmount();

    expect(clearSpy).toHaveBeenCalled();

    clearSpy.mockRestore();
    vi.useRealTimers();
  });
});
