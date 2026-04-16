import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- mocks ------------------------------------------------------------------

// Resolve CSS timing dependencies deterministically.
vi.mock('@rcaferati/wac', () => {
  return {
    onceNextCssLayout: vi.fn(() => Promise.resolve()),
    onceTransitionEnd: vi.fn(() => Promise.resolve({ type: 'transitionend' })),
    onceAnimationEnd: vi.fn(() => Promise.resolve({ type: 'animationend' })),
  };
});

// Engine imports "../helpers/components" relative to src/core/engine.ts.
// From this test file (src/__tests__/core), the same file is "../../helpers/components".
vi.mock('../../helpers/components', () => {
  class MediaLoader {
    loadMultiple(urls: string[]) {
      // resolve immediately
      return Promise.resolve(urls);
    }
  }

  // Keep behavior simple & stable for tests:
  // - in real code, this maps CSS module class names.
  // - here, just return the input (so queries match predictable classes).
  const getClassName = (name: string) => name;

  return { MediaLoader, getClassName };
});

import createEngine from '../../core/engine';
import { onceAnimationEnd } from '@rcaferati/wac';

// --- helpers ----------------------------------------------------------------

type Ctx = any;

const flush = async (n = 5) => {
  for (let i = 0; i < n; i += 1) await Promise.resolve();
};

const mkEl = (tag = 'div', className = ''): HTMLElement => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
};

const mkCtx = (): Ctx => {
  const rootElement = 'awssld';

  const classNames = {
    // progress bar
    bar: `${rootElement}__bar`,
    barActive: `${rootElement}__bar--active`,
    barEnd: `${rootElement}__bar--end`,

    // content motion
    content: `${rootElement}__content`,
    contentStatic: `${rootElement}__content--static`,
    contentMoveLeft: `${rootElement}__content--moveLeft`,
    contentMoveRight: `${rootElement}__content--moveRight`,
    contentExit: `${rootElement}__content--exit`,

    // container motion
    animated: `${rootElement}--animated`,
    animatedMobile: `${rootElement}--animated-mobile`,
    exit: `${rootElement}--exit`,
    active: `${rootElement}--active`,
    moveLeft: `${rootElement}--moveLeft`,
    moveRight: `${rootElement}--moveRight`,

    // controls
    controlsActive: `${rootElement}__controls--active`,
  };

  // Boxes + content nodes (engine queries `.content` inside them)
  const boxA = mkEl('div');
  const boxB = mkEl('div');

  const contentA = mkEl('div', classNames.content);
  const contentB = mkEl('div', classNames.content);
  boxA.appendChild(contentA);
  boxB.appendChild(contentB);

  // Controls
  const controls = mkEl('div'); // buttons.element
  const nextBtn = mkEl('button'); // buttons.next
  const prevBtn = mkEl('button'); // buttons.prev

  // The engine computes arrowClass as:
  // getAnyClassName(getClassName(`${root}__controls__arrow-${dir}`)) -> exact string
  const arrowRight = mkEl('span', `${rootElement}__controls__arrow-right`);
  const arrowLeft = mkEl('span', `${rootElement}__controls__arrow-left`);
  nextBtn.appendChild(arrowRight);
  prevBtn.appendChild(arrowLeft);

  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);

  const ctx: Ctx = {
    props: {
      cssModule: null,
      transitionDelay: 0,
      controlsReturnDelay: 0,
      onLoadStart: null,
    },

    classNames,
    rootElement,

    // box routing
    active: 'boxA',
    loader: 'boxB',

    // indices/flags
    index: 0,
    nextIndex: 1,
    loading: true,
    direction: true,

    _mounted: true,
    _setTimeout: (fn: () => void) => {
      // run immediately for test determinism
      fn();
      return 0;
    },

    boxA,
    boxB,

    // load cache
    loaded: [],
    bar: null,

    // controls
    buttons: {
      element: controls,
      next: nextBtn,
      prev: prevBtn,
    },

    activeArrow: null,
    activeArrowClass: null,

    releaseTransition: vi.fn(() => {
      ctx.loading = false;
    }),

    getInfo: () => ({ currentIndex: ctx.index }),
  };

  return ctx;
};

// --- tests ------------------------------------------------------------------

describe('core/engine.integration (current engine.ts)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('getProgressBar creates a bar with correct class', () => {
    const ctx = mkCtx();
    const engine = createEngine(() => ctx);

    const bar = engine.getProgressBar();
    expect(bar).toBeTruthy();
    expect(bar!.className).toBe(ctx.classNames.bar);
  });

  it('startBarAnimation appends bar and activates it after layouts', async () => {
    const ctx = mkCtx();
    const engine = createEngine(() => ctx);

    const active = ctx.boxA as HTMLElement;
    expect(active.querySelector(`.${ctx.classNames.bar}`)).toBeNull();

    const bar = await engine.startBarAnimation({ active });
    await flush();

    expect(bar).toBeTruthy();
    expect(ctx.bar).toBeTruthy();

    const inDom = active.querySelector(`.${ctx.classNames.bar}`) as HTMLElement;
    expect(inDom).toBeTruthy();
    expect(inDom.classList.contains(ctx.classNames.barActive)).toBe(true);
  });

  it('endBarAnimation adds barEnd then invokes callback (even if transition total is 0)', async () => {
    const ctx = mkCtx();
    const engine = createEngine(() => ctx);

    // create a bar first
    const active = ctx.boxA as HTMLElement;
    await engine.startBarAnimation({ active });
    await flush();

    const bar = ctx.bar!;
    expect(bar.classList.contains(ctx.classNames.barActive)).toBe(true);

    const cb = vi.fn();
    engine.endBarAnimation(cb);

    await flush(10);
    expect(bar.classList.contains(ctx.classNames.barEnd)).toBe(true);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('loadContent: preload/source path loads via MediaLoader and pushes urls to ctx.loaded', async () => {
    const ctx = mkCtx();
    const engine = createEngine(() => ctx);

    const media = {
      slug: 'about',
      source: 'https://example.com/a.jpg',
    };

    expect(ctx.loaded).toEqual([]);

    const bar = await engine.loadContent(ctx.boxA, media as any);
    await flush(10);

    // after successful load, it pushes loaded urls
    expect(ctx.loaded).toContain('https://example.com/a.jpg');

    // bar is created/kept on ctx if loading path runs
    expect(ctx.bar).toBeTruthy();
    // return value is bar (or null) depending on url path; here it should be bar
    expect(bar).toBeTruthy();
  });

  it('checkLoadedUrls prevents re-loading already loaded urls', async () => {
    const ctx = mkCtx();
    const engine = createEngine(() => ctx);

    ctx.loaded = ['https://example.com/a.jpg'];

    const media = { source: 'https://example.com/a.jpg' };
    const bar = await engine.loadContent(ctx.boxA, media as any);

    // Should short-circuit and not create bar
    expect(bar).toBeNull();
    expect(ctx.bar).toBeNull();
  });

  it('activateArrows finds arrow element, marks controls active, and sets activeArrowClass', async () => {
    const ctx = mkCtx();
    const engine = createEngine(() => ctx);

    const cb = vi.fn();
    engine.activateArrows(true, cb); // right

    // Controls should become active and arrow should get "active" class string
    expect(
      ctx.buttons.element.classList.contains(ctx.classNames.controlsActive)
    ).toBe(true);
    expect(ctx.activeArrow).toBeTruthy();
    expect(ctx.activeArrowClass).toBe(
      `${ctx.rootElement}__controls__arrow-right--active`
    );
    expect(ctx.activeArrow!.classList.contains(ctx.activeArrowClass)).toBe(
      true
    );

    // callback runs after onceTransitionEnd resolves
    await flush(10);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('startAnimation runs desktop flow: toggles box classes, swaps active/loader, clears arrow, and calls callback', async () => {
    const ctx = mkCtx();
    const engine = createEngine(() => ctx);

    // prepare: set active arrow so finish path goes through arrow cleanup + releaseTransition scheduling
    engine.activateArrows(true);
    await flush(5);

    const cb = vi.fn();
    const media = { slug: 'about', source: 'https://example.com/b.jpg' };

    // startAnimation triggers runAnimation -> loadContent -> finish -> callback
    engine.startAnimation(true, media as any, cb);

    await flush(30);

    // callback called
    expect(cb).toHaveBeenCalledTimes(1);

    // active/loader should flip at finish
    expect(['boxA', 'boxB']).toContain(ctx.active);
    expect(['boxA', 'boxB']).toContain(ctx.loader);
    expect(ctx.active).not.toBe(ctx.loader);

    // arrow should be cleared by finish
    expect(ctx.activeArrow).toBeNull();
    expect(ctx.activeArrowClass).toBeNull();
  });

  it('startAnimation waits for both active and loader animation end before finishing', async () => {
    const ctx = mkCtx();
    const engine = createEngine(() => ctx);

    ctx.boxA.style.animationDuration = '0.6s';
    ctx.boxB.style.animationDuration = '0.6s';

    const resolvers: Array<(event: Event) => void> = [];
    vi.mocked(onceAnimationEnd).mockImplementation(
      () =>
        new Promise<Event>((resolve) => {
          resolvers.push(resolve);
        })
    );

    const cb = vi.fn();
    const media = { slug: 'about', source: 'https://example.com/b.jpg' };

    engine.startAnimation(true, media as any, cb);

    await flush(20);
    expect(resolvers).toHaveLength(2);
    expect(cb).not.toHaveBeenCalled();

    resolvers[0](new Event('animationend'));
    await flush(10);
    expect(cb).not.toHaveBeenCalled();

    resolvers[1](new Event('animationend'));
    await flush(10);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('releaseTransition sets ctx.loading=false', () => {
    const ctx = mkCtx();
    const engine = createEngine(() => ctx);

    ctx.loading = true;
    engine.releaseTransition();
    expect(ctx.loading).toBe(false);
  });
});
