/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import {
  getRootClassName,
  setupClassNames,
  transformChildren,
  mergeStyles,
} from './helpers';

import type { ClassNames, CssModuleMerged, MediaItem } from './helpers';

// ---- Types -----------------------------------------------------------------

export type SliderBoxKey = 'boxA' | 'boxB';

export type SliderState = {
  index: number | null;
  boxA: any;
  boxB: any;
};

export type TransitionInfo = {
  slides: number;
  currentIndex: number | null;
  currentSlide: HTMLElement | null;
  currentMedia: MediaItem | undefined;
  element: HTMLElement | null;
  [k: string]: any;
};

export type TransitionRejectInfo = TransitionInfo & {
  forceTransition: () => void;
};

export type SliderPropsLike = {
  animation?: string | null;
  className?: string | null;
  cssModule?: any;
  disabled?: boolean;
  fillParent?: boolean;
  infinite?: boolean;
  organicArrows?: boolean;
  startup?: boolean;
  startupDelay?: number;
  startupScreen?: any;
  selected?: any;
  name?: string;

  children?: any;
  media?: MediaItem[];

  onLoadStart?: ((payload: any) => void) | null;
  onFirstMount?: ((info: any) => void) | null;
  onResetSlider?: ((info: any) => void) | null;
  onStartupRelease?: ((info: any) => void) | null;

  onTransitionStart?: ((info: any) => void) | null;
  onTransitionEnd?: ((info: any) => void) | null;
  onTransitionRequest?: ((info: any) => void) | null;
  onTransitionReject?: ((info: TransitionRejectInfo) => void) | null;

  controlsReturnDelay?: number;
  transitionDelay?: number;
};

export type EngineLike = {
  activateArrows: (direction: boolean, callback?: () => void) => void;
  startAnimationMobile: () => void;
  startAnimation: (
    direction: boolean,
    media: MediaItem,
    callback: (res: { release?: boolean }) => void
  ) => void;
  releaseTransition: () => void;
};

export type CtxLike = {
  // "reacty" bits
  props: SliderPropsLike;
  state: SliderState;
  setState: (patch: any, cb?: () => void) => void;

  // runtime fields used by model
  rootElement: string;
  classNames: ClassNames;
  media: MediaItem[];

  active: SliderBoxKey;
  loader: SliderBoxKey;

  index: number | null;
  nextIndex: number | null;

  loading: boolean;
  direction: boolean;
  started: boolean;

  _mounted: boolean;
  _setTimeout: (fn: () => void, ms: number) => any;

  // DOM refs (for info payloads)
  slider: HTMLElement | null;

  // dynamic boxes on ctx: ctx.boxA / ctx.boxB
  boxA: HTMLElement | null;
  boxB: HTMLElement | null;

  // misc used in goTo
  renderedLoader?: boolean;

  // EngineCtxLike includes "getInfo" via Pick<CtxLike,...>.
  getInfo: () => TransitionInfo;
};

// ---- API -------------------------------------------------------------------

export type GoToArgs = {
  index: any;
  direction: boolean;
  touch?: boolean;
};

export type CreateModel = (
  getCtx: () => CtxLike,
  engine: EngineLike
) => {
  onTransitionStart: () => void;
  onTransitionRequest: (event: string, index: number) => void;
  onTransitionEnd: () => void;

  getRootClassName: () => string;
  setupClassNames: (cssModule: CssModuleMerged) => void;

  setupStartup: (props: SliderPropsLike) => void;

  getInfo: () => TransitionInfo;

  getIndex: (index: any) => number;
  checkIndex: (index: number) => number;

  checkChildren: (props: SliderPropsLike, prevProps?: SliderPropsLike) => void;

  refreshSlider: () => void;

  startup: () => void;
  resetSlider: (index?: number) => void;

  chargeIndex: (index: number, callback: (media: MediaItem) => void) => void;
  unchargeIndex: () => void;

  goTo: (args: GoToArgs) => void;
};

// ---- Implementation --------------------------------------------------------

export const createModel: CreateModel = (getCtx, engine) => {
  const api = {
    onTransitionStart() {
      const ctx = getCtx();
      const nextMedia = ctx.media[ctx.nextIndex ?? 0];

      const data = {
        ...api.getInfo(),
        nextSlide: (ctx as any)[ctx.loader] as HTMLElement | null,
        nextIndex: ctx.nextIndex,
        nextMedia,
      };

      if (ctx.props.onTransitionStart) ctx.props.onTransitionStart(data);

      const currentMedia = ctx.media[ctx.index ?? 0];
      if (currentMedia && (currentMedia as any).onTransitionStartOut) {
        (currentMedia as any).onTransitionStartOut(data);
      }
      if (nextMedia && (nextMedia as any).onTransitionStartIn) {
        (nextMedia as any).onTransitionStartIn(data);
      }
    },

    onTransitionRequest(event: string, index: number) {
      const ctx = getCtx();
      const nextIndex = api.checkIndex(index);
      const nextMedia = ctx.media[nextIndex];

      const data = {
        eventName: event,
        ...api.getInfo(),
        nextSlide: null,
        nextIndex,
        nextMedia,
      };

      if (ctx.props.onTransitionRequest) ctx.props.onTransitionRequest(data);

      const currentMedia = ctx.media[ctx.index ?? 0];
      if (currentMedia && (currentMedia as any).onTransitionRequestOut) {
        (currentMedia as any).onTransitionRequestOut(data);
      }
      if (nextMedia && (nextMedia as any).onTransitionRequestIn) {
        (nextMedia as any).onTransitionRequestIn(data);
      }
    },

    onTransitionEnd() {
      const ctx = getCtx();
      const data = { ...api.getInfo() };

      if (ctx.props.onTransitionEnd) ctx.props.onTransitionEnd(data);

      const currentMedia = ctx.media[ctx.index ?? 0];
      if (currentMedia && (currentMedia as any).onTransitionEnd) {
        (currentMedia as any).onTransitionEnd(data);
      }
    },

    getRootClassName() {
      const ctx = getCtx();
      const {
        animation,
        className,
        cssModule,
        disabled,
        fillParent,
        infinite,
        organicArrows,
      } = ctx.props;

      return getRootClassName({
        animation: animation ?? null,
        className: className ?? null,
        cssModule: mergeStyles(cssModule),
        current: ctx.state.index,
        disabled: !!disabled,
        fillParent: !!fillParent,
        infinite: infinite !== false,
        organicArrows: organicArrows !== false,
        rootElement: ctx.rootElement,
        total: ctx.media.length,
      });
    },

    setupClassNames(cssModule: CssModuleMerged) {
      const ctx = getCtx();
      ctx.classNames = setupClassNames(ctx.rootElement, cssModule);
    },

    setupStartup(props: SliderPropsLike) {
      const ctx = getCtx();

      api.checkChildren(props);
      api.setupClassNames(mergeStyles(props.cssModule));

      if (props.startupScreen) {
        const nextIndex = api.getIndex(props.selected);
        ctx.index = null;

        (ctx as any).state = {
          index: ctx.index,
          boxA: {
            className: ctx.classNames.startUp,
            children: props.startupScreen,
          },
          boxB: ctx.media[nextIndex] || null,
        } satisfies SliderState;
      } else {
        ctx.started = true;
        ctx.index = api.getIndex(props.selected);

        (ctx as any).state = {
          index: ctx.index,
          boxA: ctx.media[ctx.index] || null,
          boxB: null,
        } satisfies SliderState;
      }
    },

    getInfo(): TransitionInfo {
      const ctx = getCtx();
      return {
        slides: ctx.media.length,
        currentIndex: ctx.index,
        currentSlide: (ctx as any)[ctx.active] as HTMLElement | null,
        currentMedia: ctx.media[ctx.index ?? 0],
        element: ctx.slider,
      };
    },

    getIndex(index: any): number {
      const ctx = getCtx();
      let nextIndex = 0;

      if (typeof index === 'number') return index;

      if (typeof index === 'string') {
        const found = ctx.media.findIndex((m: any) => m && m.slug === index);
        nextIndex = found >= 0 ? found : 0;
      }

      return nextIndex;
    },

    checkIndex(index: number): number {
      const ctx = getCtx();
      return index > ctx.media.length - 1
        ? 0
        : index < 0
          ? ctx.media.length - 1
          : index;
    },

    checkChildren(props: SliderPropsLike, prevProps?: SliderPropsLike) {
      const ctx = getCtx();
      const prevChildren = prevProps ? prevProps.children : ctx.props.children;

      if (props.children) {
        if (props.children !== prevChildren || (prevChildren && !ctx.media)) {
          ctx.media = transformChildren(props.children) as MediaItem[];
          return;
        }
      }

      if (props.media && props.media.length) {
        ctx.media = props.media;
        return;
      }

      if (!ctx.media) ctx.media = [];
    },

    refreshSlider() {
      const ctx = getCtx();

      if (
        ctx.loading === true ||
        ctx.props.startup === false ||
        ctx.index === null
      ) {
        return;
      }

      const index = ctx.index;
      const nextActive = ctx.media[api.getIndex(index)] || null;

      if (
        ctx.state.index === index &&
        (ctx.state as any)[ctx.active] === nextActive &&
        (ctx.state as any)[ctx.loader] == null
      ) {
        return;
      }

      ctx.setState({
        index,
        [ctx.active]: nextActive,
        [ctx.loader]: null,
      });
    },

    startup() {
      const ctx = getCtx();
      ctx.started = true;

      ctx._setTimeout(() => {
        const c = getCtx();
        if (!c._mounted) return;

        api.goTo({
          index: c.props.selected,
          direction: true,
          touch: false,
        });
      }, ctx.props.startupDelay || 75);
    },

    resetSlider(index = 0) {
      const ctx = getCtx();
      ctx.index = index;

      ctx.setState(
        {
          index,
          [ctx.active]: ctx.media[api.getIndex(index)],
          [ctx.loader]: null,
        },
        () => {
          const c = getCtx();
          if (!c._mounted) return;

          if (c.props.onResetSlider) {
            c.props.onResetSlider({ ...api.getInfo() });
          }
        }
      );
    },

    chargeIndex(index: number, callback: (media: MediaItem) => void) {
      const ctx = getCtx();
      ctx.nextIndex = api.checkIndex(index);

      const media = ctx.media[ctx.nextIndex];

      ctx.setState(
        {
          [ctx.loader]: {
            loader: true,
            ...media,
          },
        },
        () => {
          callback(media);
        }
      );
    },

    unchargeIndex() {
      const ctx = getCtx();
      ctx.setState({ [ctx.loader]: null });
    },

    goTo({ index, direction, touch = false }: GoToArgs) {
      const ctx = getCtx();
      const nextIndex = api.getIndex(index);

      if (ctx.loading === true || nextIndex === ctx.index) {
        if (ctx.props.onTransitionReject) {
          ctx.props.onTransitionReject({
            ...api.getInfo(),
            forceTransition: () => {
              api.goTo({ index, direction, touch });
            },
          });
        }
        return;
      }

      ctx.loading = true;
      ctx.direction = direction;

      if (touch === true) {
        api.chargeIndex(nextIndex, () => {
          engine.activateArrows(direction);
          api.onTransitionStart();
          engine.startAnimationMobile();
        });
        return;
      }

      engine.activateArrows(direction, () => {
        api.chargeIndex(nextIndex, (media) => {
          ctx.renderedLoader = true;

          api.onTransitionStart();

          engine.startAnimation(direction, media, ({ release = true }) => {
            const c = getCtx();
            c.index = c.nextIndex;

            c.setState({ index: c.index }, () => {
              const cc = getCtx();
              if (!cc._mounted) return;

              api.onTransitionEnd();
              if (release === true) {
                engine.releaseTransition();
              }
            });
          });
        });
      });
    },
  };

  return api;
};

export default createModel;
