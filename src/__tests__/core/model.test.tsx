// src/__tests__/model.test.ts (drop-in replacement)
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// IMPORTANT: model.ts imports from "./helpers" (core/helpers.ts).
// From this test file, that resolves to "../core/helpers".
// So: mock and import using THE SAME SPECIFIER ("../core/helpers") to avoid double-module instances.
vi.mock('../../core/helpers', () => {
  return {
    getRootClassName: vi.fn(() => 'ROOT_CLS'),
    setupClassNames: vi.fn((rootElement: string) => ({
      startUp: `${rootElement}__startUp`,
    })),
    transformChildren: vi.fn((children: any) => {
      if (children === 'CHILDREN_A')
        return [{ slug: 'home' }, { slug: 'about' }];
      return [{ slug: 'x' }];
    }),
    mergeStyles: vi.fn((x: any) => x ?? null),
  };
});

// Import AFTER mocks
import createModel, { createModel as createModelNamed } from '../../core/model';
import {
  getRootClassName,
  setupClassNames,
  transformChildren,
  mergeStyles,
} from '../../core/helpers';

type MediaItem = Record<string, any> & { slug?: string; source?: string };

type NavCtx = {
  props: any;
  state: any;
  setState: (patch: any, cb?: () => void) => void;

  rootElement: string;
  classNames: any;
  media: MediaItem[];

  active: 'boxA' | 'boxB';
  loader: 'boxA' | 'boxB';

  index: number | null;
  nextIndex: number | null;

  loading: boolean;
  direction: boolean;
  started: boolean;

  _mounted: boolean;
  _setTimeout: (fn: () => void, ms: number) => any;

  slider: HTMLElement | null;
  boxA: HTMLElement | null;
  boxB: HTMLElement | null;

  renderedLoader?: boolean;

  getInfo: () => any;
};

function makeCtx(overrides: Partial<NavCtx> = {}) {
  const calls: any[] = [];
  const ctx: NavCtx = {
    props: {
      selected: 0,
      startupDelay: 0,
      startup: true,
      cssModule: null,
      onTransitionStart: null,
      onTransitionEnd: null,
      onTransitionRequest: null,
      onTransitionReject: null,
      onResetSlider: null,
    },
    state: { index: null, boxA: null, boxB: null },
    setState: (patch, cb) => {
      calls.push(patch);
      ctx.state = { ...ctx.state, ...patch };
      if (typeof cb === 'function') cb();
    },

    rootElement: 'awssld',
    classNames: { startUp: 'awssld__startUp' },
    media: [],

    active: 'boxA',
    loader: 'boxB',

    index: 0,
    nextIndex: null,

    loading: false,
    direction: true,
    started: false,

    _mounted: true,
    _setTimeout: (fn) => fn(),

    slider: null,
    boxA: null,
    boxB: null,

    getInfo: () => ({}),

    ...overrides,
  };

  return { ctx, calls };
}

function makeEngine() {
  return {
    activateArrows: vi.fn((_direction: boolean, cb?: () => void) => cb?.()),
    startAnimationMobile: vi.fn(),
    startAnimation: vi.fn(
      (
        _direction: boolean,
        _media: MediaItem,
        cb: (res: { release?: boolean }) => void
      ) => cb({ release: true })
    ),
    releaseTransition: vi.fn(),
  };
}

describe('core/model.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports createModel both as default and named', () => {
    expect(createModel).toBeTypeOf('function');
    expect(createModelNamed).toBeTypeOf('function');
  });

  describe('setupStartup', () => {
    it('startupScreen path: sets ctx.index=null and builds startup state', () => {
      const { ctx } = makeCtx({
        rootElement: 'awssld',
        media: [{ slug: 'home' }, { slug: 'about' }, { slug: 'contact' }],
        index: 0,
        started: false,
      });

      const engine = makeEngine();
      const model = createModel(() => ctx as any, engine as any);

      model.setupStartup({
        startupScreen: <div />,
        selected: 'about',
        cssModule: { any: 'x' },
      });

      // setupStartup always calls these via helpers
      expect(mergeStyles).toHaveBeenCalledTimes(1);
      expect(setupClassNames).toHaveBeenCalledTimes(1);

      expect(ctx.index).toBe(null);
      expect(ctx.state.index).toBe(null);

      expect(ctx.state.boxA).toMatchObject({
        className: 'awssld__startUp',
      });

      // selected 'about' => index 1
      expect(ctx.state.boxB).toMatchObject({ slug: 'about' });
    });

    it('normal path: sets started=true, sets index from selected, boxA=media[index], boxB=null', () => {
      const { ctx } = makeCtx({
        media: [{ slug: 'home' }, { slug: 'about' }, { slug: 'contact' }],
        index: null,
        started: false,
      });
      const engine = makeEngine();
      const model = createModel(() => ctx as any, engine as any);

      model.setupStartup({
        selected: 'contact',
        startupScreen: null,
        cssModule: null,
      });

      expect(ctx.started).toBe(true);
      expect(ctx.index).toBe(2);
      expect(ctx.state.index).toBe(2);
      expect(ctx.state.boxA).toMatchObject({ slug: 'contact' });
      expect(ctx.state.boxB).toBe(null);
    });
  });

  describe('checkChildren', () => {
    it('prefers children when changed vs prevProps.children', () => {
      const { ctx } = makeCtx({
        props: { children: 'OLD' },
        media: [{ slug: 'old' }],
      });
      const engine = makeEngine();
      const model = createModel(() => ctx as any, engine as any);

      model.checkChildren({ children: 'CHILDREN_A' }, { children: 'OLD' });

      expect(transformChildren).toHaveBeenCalledTimes(1);
      expect(ctx.media.map((m) => m.slug)).toEqual(['home', 'about']);
    });

    it('uses props.media when provided and non-empty', () => {
      const { ctx } = makeCtx({ media: [{ slug: 'old' }] });
      const engine = makeEngine();
      const model = createModel(() => ctx as any, engine as any);

      model.checkChildren({ media: [{ slug: 'm1' }, { slug: 'm2' }] });
      expect(ctx.media.map((m) => m.slug)).toEqual(['m1', 'm2']);
    });

    it('falls back to [] when no children/media and ctx.media is falsy', () => {
      const { ctx } = makeCtx({ media: undefined as any });
      const engine = makeEngine();
      const model = createModel(() => ctx as any, engine as any);

      model.checkChildren({});
      expect(Array.isArray(ctx.media)).toBe(true);
      expect(ctx.media).toHaveLength(0);
    });
  });

  describe('getIndex / checkIndex', () => {
    it('getIndex: number returns as-is', () => {
      const { ctx } = makeCtx({ media: [{ slug: 'a' }] });
      const model = createModel(() => ctx as any, makeEngine() as any);

      expect(model.getIndex(2)).toBe(2);
    });

    it('getIndex: string slug finds match, else 0', () => {
      const { ctx } = makeCtx({
        media: [{ slug: 'home' }, { slug: 'about' }, { slug: 'contact' }],
      });
      const model = createModel(() => ctx as any, makeEngine() as any);

      expect(model.getIndex('about')).toBe(1);
      expect(model.getIndex('missing')).toBe(0);
    });

    it('checkIndex wraps around bounds', () => {
      const { ctx } = makeCtx({ media: [{}, {}, {}] as any });
      const model = createModel(() => ctx as any, makeEngine() as any);

      expect(model.checkIndex(3)).toBe(0);
      expect(model.checkIndex(-1)).toBe(2);
      expect(model.checkIndex(1)).toBe(1);
    });
  });

  describe('getRootClassName / setupClassNames', () => {
    it('getRootClassName delegates to helper with mergeStyles(cssModule)', () => {
      const { ctx } = makeCtx({
        props: {
          animation: 'fall',
          className: 'x',
          cssModule: { m: '1' },
          disabled: true,
          fillParent: true,
          infinite: false,
          organicArrows: true,
        },
        state: { index: 1, boxA: null, boxB: null },
        media: [{}, {}, {}] as any,
      });

      const model = createModel(() => ctx as any, makeEngine() as any);

      const out = model.getRootClassName();
      expect(out).toBe('ROOT_CLS');

      expect(mergeStyles).toHaveBeenCalledWith(ctx.props.cssModule);
      expect(getRootClassName).toHaveBeenCalledTimes(1);

      const args = (getRootClassName as any).mock.calls[0][0];
      expect(args.rootElement).toBe('awssld');
      expect(args.total).toBe(3);
      expect(args.current).toBe(1);
      expect(args.infinite).toBe(false); // model passes infinite !== false => false when props.infinite is false
    });

    it('setupClassNames writes ctx.classNames from helper', () => {
      const { ctx } = makeCtx();
      const model = createModel(() => ctx as any, makeEngine() as any);

      model.setupClassNames({} as any);
      expect(setupClassNames).toHaveBeenCalledTimes(1);
      expect(ctx.classNames).toEqual({ startUp: 'awssld__startUp' });
    });
  });

  describe('refreshSlider', () => {
    it('skips when loading=true or startup=false or index=null', () => {
      const { ctx, calls } = makeCtx({ loading: true, index: 0 });
      const model = createModel(() => ctx as any, makeEngine() as any);
      model.refreshSlider();
      expect(calls).toHaveLength(0);

      const { ctx: ctx2, calls: calls2 } = makeCtx({
        loading: false,
        index: 0,
        props: { startup: false },
      });
      const model2 = createModel(() => ctx2 as any, makeEngine() as any);
      model2.refreshSlider();
      expect(calls2).toHaveLength(0);

      const { ctx: ctx3, calls: calls3 } = makeCtx({
        loading: false,
        index: null,
      });
      const model3 = createModel(() => ctx3 as any, makeEngine() as any);
      model3.refreshSlider();
      expect(calls3).toHaveLength(0);
    });

    it('noops when state already matches active/loader/index', () => {
      const media = [{ slug: 'home' }, { slug: 'about' }];
      const { ctx, calls } = makeCtx({
        media,
        index: 0,
        active: 'boxA',
        loader: 'boxB',
        state: { index: 0, boxA: media[0], boxB: null },
      });
      const model = createModel(() => ctx as any, makeEngine() as any);

      model.refreshSlider();
      expect(calls).toHaveLength(0);
    });

    it('sets state when mismatch', () => {
      const media = [{ slug: 'home' }, { slug: 'about' }];
      const { ctx, calls } = makeCtx({
        media,
        index: 1,
        active: 'boxA',
        loader: 'boxB',
        state: { index: 0, boxA: media[0], boxB: media[1] },
      });
      const model = createModel(() => ctx as any, makeEngine() as any);

      model.refreshSlider();
      expect(calls).toHaveLength(1);
      expect(calls[0]).toMatchObject({
        index: 1,
        boxA: media[1],
        boxB: null,
      });
    });
  });

  describe('startup / resetSlider', () => {
    it('startup schedules goTo(selected) when mounted', () => {
      const { ctx } = makeCtx({
        _mounted: true,
        props: { selected: 'about', startupDelay: 0 },
        media: [{ slug: 'home' }, { slug: 'about' }],
        index: 0,
      });
      const engine = makeEngine();
      const model = createModel(() => ctx as any, engine as any);

      const goToSpy = vi.spyOn(model, 'goTo');
      model.startup();

      expect(ctx.started).toBe(true);
      expect(goToSpy).toHaveBeenCalledWith({
        index: 'about',
        direction: true,
        touch: false,
      });
    });

    it('resetSlider sets ctx.index and calls onResetSlider after commit when mounted', () => {
      const onResetSlider = vi.fn();
      const media = [{ slug: 'home' }, { slug: 'about' }];

      const { ctx } = makeCtx({
        _mounted: true,
        media,
        props: { onResetSlider },
        index: 0,
      });

      const model = createModel(() => ctx as any, makeEngine() as any);
      model.resetSlider(1);

      expect(ctx.index).toBe(1);
      expect(onResetSlider).toHaveBeenCalledTimes(1);
      const infoArg = onResetSlider.mock.calls[0][0];
      expect(infoArg).toHaveProperty('slides', 2);
    });
  });

  describe('transition events fan-out', () => {
    it('onTransitionStart calls props.onTransitionStart + media hooks', () => {
      const onTransitionStart = vi.fn();
      const outHook = vi.fn();
      const inHook = vi.fn();

      const media = [
        { slug: 'home', onTransitionStartOut: outHook },
        { slug: 'about', onTransitionStartIn: inHook },
      ];

      const { ctx } = makeCtx({
        props: { onTransitionStart },
        media,
        index: 0,
        nextIndex: 1,
        loader: 'boxB',
      });

      ctx.boxB = document.createElement('div');

      const model = createModel(() => ctx as any, makeEngine() as any);
      model.onTransitionStart();

      expect(onTransitionStart).toHaveBeenCalledTimes(1);
      expect(outHook).toHaveBeenCalledTimes(1);
      expect(inHook).toHaveBeenCalledTimes(1);

      const payload = onTransitionStart.mock.calls[0][0];
      expect(payload.nextIndex).toBe(1);
      expect(payload.nextMedia).toMatchObject({ slug: 'about' });
      expect(payload.nextSlide).toBe(ctx.boxB);
    });

    it('onTransitionRequest calls props.onTransitionRequest + media hooks', () => {
      const onTransitionRequest = vi.fn();
      const outHook = vi.fn();
      const inHook = vi.fn();

      const media = [
        { slug: 'home', onTransitionRequestOut: outHook },
        { slug: 'about', onTransitionRequestIn: inHook },
      ];

      const { ctx } = makeCtx({
        props: { onTransitionRequest },
        media,
        index: 0,
      });

      const model = createModel(() => ctx as any, makeEngine() as any);
      model.onTransitionRequest('next', 1);

      expect(onTransitionRequest).toHaveBeenCalledTimes(1);
      expect(outHook).toHaveBeenCalledTimes(1);
      expect(inHook).toHaveBeenCalledTimes(1);

      const payload = onTransitionRequest.mock.calls[0][0];
      expect(payload.eventName).toBe('next');
      expect(payload.nextIndex).toBe(1);
      expect(payload.nextMedia).toMatchObject({ slug: 'about' });
      expect(payload.nextSlide).toBe(null);
    });

    it('onTransitionEnd calls props.onTransitionEnd + media.onTransitionEnd', () => {
      const onTransitionEnd = vi.fn();
      const endHook = vi.fn();

      const media = [{ slug: 'home', onTransitionEnd: endHook }];

      const { ctx } = makeCtx({
        props: { onTransitionEnd },
        media,
        index: 0,
      });

      const model = createModel(() => ctx as any, makeEngine() as any);
      model.onTransitionEnd();

      expect(onTransitionEnd).toHaveBeenCalledTimes(1);
      expect(endHook).toHaveBeenCalledTimes(1);
    });
  });

  describe('goTo', () => {
    it('rejects when loading=true or same-index, and provides forceTransition', () => {
      const onTransitionReject = vi.fn();

      const { ctx } = makeCtx({
        props: { onTransitionReject },
        media: [{ slug: 'home' }, { slug: 'about' }],
        index: 0,
        loading: true,
      });

      const model = createModel(() => ctx as any, makeEngine() as any);
      model.goTo({ index: 1, direction: true });

      expect(onTransitionReject).toHaveBeenCalledTimes(1);
      const info = onTransitionReject.mock.calls[0][0];
      expect(info).toHaveProperty('forceTransition');
      expect(typeof info.forceTransition).toBe('function');
    });

    it('touch=true path: chargeIndex -> activateArrows -> onTransitionStart -> startAnimationMobile', () => {
      const media = [{ slug: 'home' }, { slug: 'about' }];

      const { ctx } = makeCtx({
        media,
        index: 0,
        loading: false,
        loader: 'boxB',
      });

      const engine = makeEngine();
      const model = createModel(() => ctx as any, engine as any);

      const chargeSpy = vi.spyOn(model, 'chargeIndex');
      const startSpy = vi.spyOn(model, 'onTransitionStart');

      model.goTo({ index: 1, direction: true, touch: true });

      expect(chargeSpy).toHaveBeenCalledTimes(1);
      expect(engine.activateArrows).toHaveBeenCalledWith(true);
      expect(startSpy).toHaveBeenCalledTimes(1);
      expect(engine.startAnimationMobile).toHaveBeenCalledTimes(1);
    });

    it('normal path: activateArrows(cb) -> chargeIndex -> startAnimation -> setState(index) -> onTransitionEnd -> releaseTransition', () => {
      const onTransitionEnd = vi.fn();

      const media = [{ slug: 'home' }, { slug: 'about' }];

      const { ctx } = makeCtx({
        props: { onTransitionEnd },
        media,
        index: 0,
        loading: false,
        _mounted: true,
        loader: 'boxB',
        active: 'boxA',
      });

      const engine = makeEngine();
      const model = createModel(() => ctx as any, engine as any);

      const startSpy = vi.spyOn(model, 'onTransitionStart');
      const endSpy = vi.spyOn(model, 'onTransitionEnd');

      model.goTo({ index: 1, direction: true });

      expect(engine.activateArrows).toHaveBeenCalledTimes(1);
      expect(engine.startAnimation).toHaveBeenCalledTimes(1);

      expect(ctx.renderedLoader).toBe(true);

      expect(ctx.index).toBe(1);
      expect(ctx.state.index).toBe(1);

      expect(startSpy).toHaveBeenCalledTimes(1);
      expect(endSpy).toHaveBeenCalledTimes(1);
      expect(onTransitionEnd).toHaveBeenCalledTimes(1);

      expect(engine.releaseTransition).toHaveBeenCalledTimes(1);
    });

    it('does not call releaseTransition when engine callback returns release=false', () => {
      const media = [{ slug: 'home' }, { slug: 'about' }];

      const { ctx } = makeCtx({
        media,
        index: 0,
        loading: false,
        _mounted: true,
      });

      const engine = makeEngine();
      engine.startAnimation = vi.fn((_dir, _media, cb) =>
        cb({ release: false })
      );

      const model = createModel(() => ctx as any, engine as any);
      model.goTo({ index: 1, direction: true });

      expect(engine.releaseTransition).not.toHaveBeenCalled();
    });

    it('forceTransition retries goTo with same args', () => {
      const onTransitionReject = vi.fn();

      const { ctx } = makeCtx({
        props: { onTransitionReject },
        media: [{ slug: 'home' }, { slug: 'about' }],
        index: 0,
        loading: true,
      });

      const engine = makeEngine();
      const model = createModel(() => ctx as any, engine as any);

      const goToSpy = vi.spyOn(model, 'goTo');

      model.goTo({ index: 1, direction: true, touch: false });
      const info = onTransitionReject.mock.calls[0][0];

      ctx.loading = false;

      info.forceTransition();
      expect(goToSpy).toHaveBeenCalledTimes(2);
      expect(goToSpy).toHaveBeenLastCalledWith({
        index: 1,
        direction: true,
        touch: false,
      });
    });
  });
});
