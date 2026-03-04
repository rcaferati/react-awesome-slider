/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import {
  onceNextCssLayout,
  onceTransitionEnd,
  onceAnimationEnd,
} from '@rcaferati/wac';
import { getClassName, MediaLoader } from '../helpers/components';
import {
  mergeStyles,
  getAnyClassName,
  classListAdd,
  classListRemove,
} from './helpers';

import type { MediaItem } from './helpers';
import type { SliderBoxKey, CtxLike } from './model';

const mediaLoader = new MediaLoader();

const parseTimeMaxMs = (cssTime: string): number => {
  const parts = String(cssTime || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  let max = 0;
  for (const p of parts) {
    if (p.endsWith('ms')) {
      const n = Number.parseFloat(p);
      if (!Number.isNaN(n)) max = Math.max(max, n);
    } else if (p.endsWith('s')) {
      const n = Number.parseFloat(p);
      if (!Number.isNaN(n)) max = Math.max(max, n * 1000);
    }
  }
  return max;
};

const readSnapshot = (el: HTMLElement | Element | null) => {
  if (!el || typeof window === 'undefined') return null;
  const node = el as HTMLElement;
  const cs = window.getComputedStyle(node);
  return {
    tag: node.tagName,
    className: node.className,
    animationName: cs.animationName,
    animationDuration: cs.animationDuration,
    animationDelay: cs.animationDelay,
    animationIterationCount: cs.animationIterationCount,
    animationPlayState: cs.animationPlayState,
    transitionProperty: cs.transitionProperty,
    transitionDuration: cs.transitionDuration,
    transitionDelay: cs.transitionDelay,
  };
};

const getTransitionTotalMs = (el: Element | null) => {
  const snap = readSnapshot(el);
  if (!snap) return 0;
  return (
    parseTimeMaxMs(snap.transitionDuration) +
    parseTimeMaxMs(snap.transitionDelay)
  );
};

const getAnimationTotalMs = (el: Element | null) => {
  const snap = readSnapshot(el);
  if (!snap) return 0;
  return (
    parseTimeMaxMs(snap.animationDuration) + parseTimeMaxMs(snap.animationDelay)
  );
};

const withTimeout = <T>(
  p: Promise<T>,
  ms: number,
  _label: string,
  _meta?: any
): Promise<
  | { ok: true; value: T }
  | { ok: false; reason: 'timeout' | 'error'; error?: any }
> =>
  new Promise((resolve) => {
    let done = false;

    const t = setTimeout(
      () => {
        if (done) return;
        done = true;
        resolve({ ok: false, reason: 'timeout' });
      },
      Math.max(0, ms | 0)
    );

    p.then((v) => {
      if (done) return;
      done = true;
      clearTimeout(t);
      resolve({ ok: true, value: v });
    }).catch((e) => {
      if (done) return;
      done = true;
      clearTimeout(t);
      resolve({ ok: false, reason: 'error', error: e });
    });
  });

export type EngineCtxLike = Pick<
  CtxLike,
  | 'props'
  | 'classNames'
  | 'rootElement'
  | 'active'
  | 'loader'
  | 'index'
  | 'nextIndex'
  | 'loading'
  | 'direction'
  | '_mounted'
  | '_setTimeout'
> & {
  boxA: HTMLElement;
  boxB: HTMLElement;

  loaded: string[];
  bar: HTMLDivElement | null;

  buttons: {
    element: HTMLElement;
    next: HTMLElement;
    prev: HTMLElement;
  } | null;

  // ✅ HTMLElement so it can be passed to onceTransitionEnd typings
  activeArrow: HTMLElement | null;
  activeArrowClass: string | null;

  active: SliderBoxKey;
  loader: SliderBoxKey;

  releaseTransition: () => void;
  getInfo: () => Record<string, any>;
};

export type EngineLike = {
  getProgressBar: () => HTMLDivElement | null;
  startBarAnimation: (args: {
    active: HTMLElement;
  }) => Promise<HTMLDivElement | null>;
  endBarAnimation: (callback: () => void) => void;

  pushLoaded: (urls: string[]) => void;
  checkLoadedUrls: (urls: string[]) => boolean;
  loadContent: (
    active: HTMLElement,
    media: MediaItem
  ) => Promise<HTMLDivElement | null>;

  startAnimationMobile: () => void;
  animateMobileEnd: (callback?: () => void) => void;

  runAnimation: (args: any) => void;
  startAnimation: (
    direction: boolean,
    media: MediaItem,
    callback: (res: { release?: boolean }) => void
  ) => void;

  releaseTransition: () => void;

  activateArrows: (direction: boolean, callback?: () => void) => void;
};

export function createEngine(getCtx: () => EngineCtxLike): EngineLike {
  return {
    getProgressBar() {
      const ctx = getCtx();
      if (typeof document === 'undefined') return null;
      const bar = document.createElement('div');
      bar.className = ctx.classNames.bar;
      return bar;
    },

    startBarAnimation({ active }: { active: HTMLElement }) {
      return new Promise((resolve) => {
        const ctx = getCtx();
        const bar = this.getProgressBar();
        ctx.bar = bar;

        if (!bar || !active) {
          resolve(null);
          return;
        }

        active.appendChild(bar);

        onceNextCssLayout()
          .then(() => onceNextCssLayout())
          .then(() => {
            const c = getCtx();
            if (!c._mounted) return;
            classListAdd(bar, c.classNames.barActive);
            resolve(bar);
          });
      });
    },

    endBarAnimation(callback: () => void) {
      const ctx = getCtx();
      const bar = ctx.bar;

      if (!bar) {
        callback();
        return;
      }

      onceNextCssLayout().then(() => {
        const c = getCtx();
        if (!c._mounted) return;

        classListAdd(bar, c.classNames.barEnd);

        const totalMs = getTransitionTotalMs(bar);
        if (!totalMs) {
          callback();
          return;
        }

        const waitMs = Math.max(250, Math.ceil(totalMs) + 250);

        withTimeout(
          onceTransitionEnd(bar),
          waitMs,
          'endBarAnimation/onceTransitionEnd',
          { totalMs }
        ).then(() => {
          const cc = getCtx();
          if (!cc._mounted) return;
          callback();
        });
      });
    },

    pushLoaded(urls: string[]) {
      const ctx = getCtx();
      ctx.loaded = [...ctx.loaded, ...urls];
    },

    checkLoadedUrls(urls: string[]) {
      const ctx = getCtx();
      return urls.every((url) => ctx.loaded.includes(url));
    },

    async loadContent(active: HTMLElement, media: MediaItem) {
      const ctx = getCtx();

      // --- callback-based loader (user-provided) ----------------------------
      if (ctx.props.onLoadStart || (media && (media as any).onLoadStart)) {
        const caller =
          ctx.props.onLoadStart || (media && (media as any).onLoadStart);

        await this.startBarAnimation({ active });

        return await new Promise<HTMLDivElement | null>((resolve, reject) => {
          try {
            caller({
              next: () => {
                this.endBarAnimation(() => {
                  resolve(getCtx().bar);
                });
              },
              error: (e: any) => reject(e),
              ...getCtx().getInfo(),
            });
          } catch (e) {
            reject(e);
          }
        });
      }

      // --- default media loading -------------------------------------------
      if (media && ((media as any).source || (media as any).preload)) {
        const urls: string[] = (media as any).preload
          ? (media as any).preload
          : (((media as any).source && [(media as any).source]) as any) || [];

        if (this.checkLoadedUrls(urls) === true) return null;

        await this.startBarAnimation({ active });

        const settle = await withTimeout(
          mediaLoader.loadMultiple(urls),
          8000,
          'MediaLoader.loadMultiple',
          { urls }
        );

        if (settle.ok) {
          const c = getCtx();
          if (!c._mounted) return null;
          this.pushLoaded(urls);
        }

        await new Promise<void>((resolve) => {
          this.endBarAnimation(() => resolve());
        });

        return getCtx().bar;
      }

      return null;
    },

    // --- Mobile animation ---------------------------------------------------

    startAnimationMobile() {
      const ctx = getCtx();
      const active = (ctx as any)[ctx.active] as HTMLElement;
      const loader = (ctx as any)[ctx.loader] as HTMLElement;

      const contentEnterMoveClass = ctx.direction
        ? ctx.classNames.contentMoveRight
        : ctx.classNames.contentMoveLeft;

      const contentExitMoveClass = ctx.direction
        ? ctx.classNames.contentMoveLeft
        : ctx.classNames.contentMoveRight;

      const activeContent = active.querySelector(
        `.${getAnyClassName(ctx.classNames.content)}`
      ) as Element;

      const loaderContent = loader.querySelector(
        `.${getAnyClassName(ctx.classNames.content)}`
      ) as Element;

      classListAdd(activeContent, contentExitMoveClass);
      classListAdd(activeContent, ctx.classNames.contentExit);

      classListAdd(loaderContent, contentEnterMoveClass);
      classListAdd(loaderContent, ctx.classNames.contentStatic);

      classListAdd(active, ctx.classNames.animated);
      classListAdd(loader, ctx.classNames.animated);
    },

    animateMobileEnd(callback?: () => void) {
      const ctx = getCtx();
      const active = (ctx as any)[ctx.active] as HTMLElement;
      const loader = (ctx as any)[ctx.loader] as HTMLElement;

      const exitPosition = ctx.direction
        ? ctx.classNames.moveLeft
        : ctx.classNames.moveRight;

      const contentEnterMoveClass = ctx.direction
        ? ctx.classNames.contentMoveRight
        : ctx.classNames.contentMoveLeft;

      const contentExitMoveClass = ctx.direction
        ? ctx.classNames.contentMoveLeft
        : ctx.classNames.contentMoveRight;

      const loaderContent = loader.querySelector(
        `.${getAnyClassName(ctx.classNames.content)}`
      ) as Element;

      const activeContent = active.querySelector(
        `.${getAnyClassName(ctx.classNames.content)}`
      ) as Element;

      classListRemove(loaderContent, ctx.classNames.contentStatic);
      classListAdd(loader, ctx.classNames.animatedMobile);
      classListAdd(active, ctx.classNames.animatedMobile);

      onceNextCssLayout().then(() => {
        const c = getCtx();
        if (!c._mounted) return;

        loader.style.transform = 'translate3d(0, 0, 0)';
        active.style.transform = `translate3d(${c.direction ? '-' : ''}100%, 0, 0)`;

        const totalMs = getTransitionTotalMs(active);
        const waitMs = totalMs ? Math.max(250, Math.ceil(totalMs) + 250) : 0;

        const done = () => {
          const cc = getCtx();
          if (!cc._mounted) return;
          if (!cc.loading) return;

          classListRemove(active, cc.classNames.animated);
          classListRemove(loader, cc.classNames.animated);
          classListAdd(loader, cc.classNames.active);
          classListRemove(active, cc.classNames.active);
          classListRemove(active, exitPosition);
          classListRemove(loader, cc.classNames.animatedMobile);
          classListRemove(active, cc.classNames.animatedMobile);
          classListRemove(activeContent, contentExitMoveClass);
          classListRemove(activeContent, cc.classNames.contentExit);
          classListRemove(loaderContent, contentEnterMoveClass);

          if (cc.buttons) {
            cc._setTimeout(() => {
              const ccc = getCtx();
              if (ccc.buttons) {
                classListRemove(
                  ccc.buttons.element,
                  ccc.classNames.controlsActive
                );
              }
            }, cc.props.controlsReturnDelay || 0);
          }

          if (cc.activeArrow) {
            classListRemove(cc.activeArrow, cc.activeArrowClass || '');
            cc.activeArrow = null;
            cc.activeArrowClass = null;
          }

          cc.active = cc.active === 'boxA' ? 'boxB' : 'boxA';
          cc.loader = cc.active === 'boxA' ? 'boxB' : 'boxA';

          if (callback) callback();
        };

        if (!waitMs) {
          done();
          return;
        }

        withTimeout(
          onceTransitionEnd(active),
          waitMs,
          'animateMobileEnd/onceTransitionEnd',
          { totalMs }
        ).then(() => done());
      });
    },

    // --- Desktop animation --------------------------------------------------

    runAnimation(args: any) {
      const {
        active,
        media,
        contentExitMoveClass,
        contentEnterMoveClass,
        activeContentElement,
        loaderContentElement,
        loader,
        loaderPosition,
        exitPosition,
        callback,
        transitionDelay,
      } = args;

      this.loadContent(active, media).then((bar) => {
        const ctx = getCtx();
        if (!ctx._mounted) return;

        classListAdd(activeContentElement, contentExitMoveClass);
        classListAdd(activeContentElement, ctx.classNames.contentExit);
        classListAdd(loaderContentElement, contentEnterMoveClass);
        classListAdd(loaderContentElement, ctx.classNames.contentStatic);

        ctx._setTimeout(() => {
          const c = getCtx();
          if (!c._mounted) return;

          onceNextCssLayout().then(() => {
            const cc = getCtx();
            if (!cc._mounted) return;

            classListAdd(active, cc.classNames.animated);
            classListAdd(loader, cc.classNames.animated);
            classListRemove(loaderContentElement, cc.classNames.contentStatic);
            classListAdd(active, cc.classNames.exit);
            classListAdd(loader, loaderPosition);
            classListAdd(active, exitPosition);

            const animTotal = getAnimationTotalMs(active);
            const waitMs = animTotal
              ? Math.max(300, Math.ceil(animTotal) + 300)
              : 0;

            const finish = () => {
              const ccc = getCtx();
              if (!ccc._mounted) return;

              classListAdd(loader, ccc.classNames.active);
              classListRemove(loader, loaderPosition);
              classListRemove(loader, ccc.classNames.animated);
              classListRemove(active, ccc.classNames.animated);
              classListRemove(active, ccc.classNames.active);
              classListRemove(active, exitPosition);
              classListRemove(active, ccc.classNames.exit);
              classListRemove(activeContentElement, contentExitMoveClass);
              classListRemove(activeContentElement, ccc.classNames.contentExit);
              classListRemove(loaderContentElement, contentEnterMoveClass);

              if (bar && active.contains(bar)) active.removeChild(bar);

              if (ccc.buttons) {
                ccc._setTimeout(() => {
                  const c4 = getCtx();
                  if (c4.buttons) {
                    classListRemove(
                      c4.buttons.element,
                      c4.classNames.controlsActive
                    );
                  }
                }, ccc.props.controlsReturnDelay || 0);
              }

              ccc.active = ccc.active === 'boxA' ? 'boxB' : 'boxA';
              ccc.loader = ccc.active === 'boxA' ? 'boxB' : 'boxA';

              const release = !ccc.activeArrow;

              if (ccc.activeArrow) {
                const arrow = ccc.activeArrow; // HTMLElement (type-safe)

                onceTransitionEnd(arrow, {
                  tolerance: ccc.index === null ? 0 : 2,
                }).then(() => {
                  const c5 = getCtx();
                  if (!c5._mounted) return;
                  c5.releaseTransition();
                });

                classListRemove(arrow, ccc.activeArrowClass || '');
                ccc.activeArrow = null;
                ccc.activeArrowClass = null;
              }

              callback({ release });
            };

            if (!waitMs) {
              finish();
              return;
            }

            withTimeout(
              onceAnimationEnd(active),
              waitMs,
              'runAnimation/onceAnimationEnd',
              { animTotal }
            ).then(() => finish());
          });
        }, transitionDelay);
      });
    },

    releaseTransition() {
      const ctx = getCtx();
      ctx.loading = false;
    },

    startAnimation(
      direction: boolean,
      media: MediaItem,
      callback: (res: { release?: boolean }) => void
    ) {
      const ctx = getCtx();

      const active = (ctx as any)[ctx.active] as HTMLElement;
      const loader = (ctx as any)[ctx.loader] as HTMLElement;

      const loaderPosition = direction
        ? ctx.classNames.moveRight
        : ctx.classNames.moveLeft;

      const exitPosition = direction
        ? ctx.classNames.moveLeft
        : ctx.classNames.moveRight;

      const contentEnterMoveClass = direction
        ? ctx.classNames.contentMoveRight
        : ctx.classNames.contentMoveLeft;

      const contentExitMoveClass = direction
        ? ctx.classNames.contentMoveLeft
        : ctx.classNames.contentMoveRight;

      const activeContentElement = active.querySelector(
        `.${getAnyClassName(ctx.classNames.content)}`
      ) as Element;

      const loaderContentElement = loader.querySelector(
        `.${getAnyClassName(ctx.classNames.content)}`
      ) as Element;

      active.style.removeProperty('transform');
      loader.style.removeProperty('transform');

      this.runAnimation({
        active,
        media,
        contentExitMoveClass,
        contentEnterMoveClass,
        activeContentElement,
        loaderContentElement,
        loader,
        loaderPosition,
        exitPosition,
        callback,
        transitionDelay: ctx.props.transitionDelay || 0,
      });
    },

    activateArrows(direction: boolean, callback?: () => void) {
      const ctx = getCtx();
      const dirName = direction ? 'right' : 'left';
      const mergedStyles = mergeStyles(ctx.props.cssModule);

      const arrowClass = getAnyClassName(
        getClassName(
          `${ctx.rootElement}__controls__arrow-${dirName}`,
          mergedStyles as any
        )
      );

      if (ctx.buttons) {
        const activeArrowRoot = direction ? ctx.buttons.next : ctx.buttons.prev;
        ctx.activeArrow = activeArrowRoot.querySelector(
          `.${arrowClass}`
        ) as HTMLElement | null;
      }

      if (
        !ctx.activeArrow ||
        (ctx.buttons &&
          ctx.buttons.element &&
          ctx.buttons.element.classList.contains(ctx.classNames.controlsActive))
      ) {
        if (callback) callback();
        return;
      }

      ctx.activeArrowClass = getClassName(
        `${ctx.rootElement}__controls__arrow-${dirName}--active`,
        mergedStyles as any
      );

      onceTransitionEnd(ctx.activeArrow, {
        tolerance: ctx.index === null ? 0 : 2,
      }).then(() => {
        const c = getCtx();
        if (!c._mounted) return;
        if (callback) callback();
      });

      if (ctx.buttons && ctx.buttons.element) {
        classListAdd(ctx.buttons.element, ctx.classNames.controlsActive);
        classListAdd(ctx.activeArrow, ctx.activeArrowClass);
      }
    },
  };
}

export default createEngine;
