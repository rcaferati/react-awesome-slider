// navigation/withNavigationHandlers.tsx (drop-in replacement)
import React, { useCallback, useEffect, useRef } from 'react';
import { frameThrower } from '@rcaferati/wac';
import withNavigationContext, {
  type WithNavigationInjectedProps,
} from './withNavigationContext';
import type { NavigationState } from './context';

// --- helpers -------------------------------------------------------------

const getCleanPath = (path: unknown) =>
  String(path || '')
    .replace(/^\//, '')
    .replace(/\/$/, '');

const getUrlSlug = (): string => {
  if (typeof window === 'undefined') return '';
  return getCleanPath(window.location.pathname) || '';
};

type MediaLike = { slug?: string } | null | undefined;

type TransitionInfoLike = {
  currentMedia?: MediaLike;
  nextMedia?: MediaLike;
} & Record<string, any>;

type TransitionRejectInfoLike = TransitionInfoLike & {
  forceTransition?: () => void;
};

type HandlerProps = {
  onTransitionReject?: (info: any) => void;
  onTransitionStart?: (info: any) => void;
  onTransitionEnd?: (info: any) => void;
};

// -------------------------------------------------------------------------

export default function withNavigationHandlers<P extends object>(
  Component: React.ComponentType<P>
) {
  type Props = P & HandlerProps & Partial<WithNavigationInjectedProps>;

  function WithNavigationHandlers(props: Props) {
    const {
      fullpage,
      onTransitionReject,
      onTransitionStart,
      onTransitionEnd,
      ...extra
    } = props as any;

    const navigation = fullpage?.navigation as NavigationState | undefined;
    const navigate = fullpage?.navigate as ((next: any) => void) | undefined;

    const navRef = useRef<NavigationState | undefined>(navigation);
    const navigateRef = useRef<typeof navigate>(navigate);

    // keep refs hot synchronously (avoid stale reads in callbacks)
    navRef.current = navigation;
    navigateRef.current = navigate;

    // What we *actually* landed on visually (authoritative). Only set on tx:end.
    const landedSlugRef = useRef<string>('');

    // Retry hook (available after a reject payload happens)
    const forceRef = useRef<(() => void) | null>(null);

    // Real transition lifecycle (engine reality)
    const txInFlightRef = useRef(false);

    // One-shot latch: "next transitionStart is URL-driven (pop/sync), do NOT pushState"
    // IMPORTANT: this is NOT stored in NavigationState to avoid sticky mode bugs.
    const urlDrivenStartLatchRef = useRef(false);

    // sync loop control (latest-wins)
    const syncRunningRef = useRef(false);
    const syncSeqRef = useRef(0);

    // ---- navigation -------------------------------------------------------

    const safeNavigate = useCallback(
      (next: NavigationState, reason: string) => {
        void reason; // keep callsites readable; avoid unused-param lint
        const fn = navigateRef.current;
        if (typeof fn !== 'function') return;
        fn(next);
      },
      []
    );

    const armForceRetry = useCallback((forceTransition?: unknown) => {
      if (typeof forceTransition === 'function') {
        forceRef.current = forceTransition as () => void;
      }
    }, []);

    // =========================================================================
    // URL Sync + Retry (latest-wins)
    // =========================================================================
    const syncToUrl = useCallback(
      async (reason: string) => {
        void reason; // retained for callsite intent; no logging
        if (typeof window === 'undefined') return;

        const initialUrlSlug = getUrlSlug();
        if (!initialUrlSlug) return;

        // latest-wins: cancel older runner
        if (syncRunningRef.current) {
          syncSeqRef.current += 1;
        }

        syncRunningRef.current = true;
        const mySeq = ++syncSeqRef.current;

        const MAX_TICKS = 240;

        try {
          for (let tick = 1; tick <= MAX_TICKS; tick++) {
            await frameThrower(1);

            if (mySeq !== syncSeqRef.current) {
              return;
            }

            const nav = (navRef.current || {
              slug: '',
              goto: '',
              navigating: false,
              pop: false,
            }) as NavigationState;

            const urlNow = getUrlSlug();
            if (!urlNow) continue;

            // 1) Ensure the controlled "selected" (goto) matches the URL.
            //    Mark the next transitionStart as URL-driven so it must NOT pushState.
            if (nav.goto !== urlNow) {
              urlDrivenStartLatchRef.current = true;

              safeNavigate(
                {
                  ...nav,
                  pop: true,
                  goto: urlNow,
                  navigating: !!nav.navigating, // preserve (not trusted, but keep behavior)
                } as any,
                `syncToUrl:align-goto(tick:${tick})`
              );
              continue;
            }

            // 2) Never declare "done" while a real engine transition is in-flight.
            if (txInFlightRef.current === true) {
              continue;
            }

            // 3) Done when the *actual landed slide* matches the URL.
            if (landedSlugRef.current === urlNow) {
              return;
            }

            // 4) Not landed yet, not in-flight, goto matches URL -> re-trigger (if possible).
            const force = forceRef.current;
            if (typeof force === 'function') {
              // Avoid spamming: retry at a modest cadence.
              if (tick % 6 === 0) {
                try {
                  force();
                } catch {
                  // ignore
                }
              }
            }
          }
        } finally {
          if (syncSeqRef.current === mySeq) {
            syncRunningRef.current = false;
          }
        }
      },
      [safeNavigate]
    );

    // ---- popstate ----------------------------------------------------------

    const popSeqRef = useRef(0);

    const handlePopState = useCallback(() => {
      if (typeof window === 'undefined') return;
      const popSeq = ++popSeqRef.current;
      syncToUrl(`popstate#${popSeq}`);
    }, [syncToUrl]);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }, [handlePopState]);

    // ---- transition handlers ----------------------------------------------

    const handleTransitionStart = useCallback(
      (element: TransitionInfoLike) => {
        if (typeof window === 'undefined') return;

        const nav = (navRef.current || {
          slug: '',
          goto: '',
          navigating: false,
          pop: false,
        }) as NavigationState;

        const cleanPath = getUrlSlug();
        const nextSlug = element?.nextMedia?.slug || '';

        // Real engine lifecycle
        txInFlightRef.current = true;

        // Consume the one-shot latch (URL-driven start => do NOT pushState).
        const urlDrivenStart = urlDrivenStartLatchRef.current === true;
        urlDrivenStartLatchRef.current = false;

        // pushState only for click-driven transitions (not URL-driven pop/sync).
        if (nextSlug && cleanPath !== nextSlug && !urlDrivenStart) {
          window.history.pushState({}, '', `/${nextSlug}`);
        }

        safeNavigate(
          {
            ...nav,
            goto: nextSlug || nav.goto,
            slug: nav.slug || cleanPath,
            navigating: true,
            pop: urlDrivenStart ? true : false,
          } as any,
          'onTransitionStart'
        );

        if (onTransitionStart) onTransitionStart(element);
      },
      [onTransitionStart, safeNavigate]
    );

    const handleTransitionEnd = useCallback(
      (element: TransitionInfoLike) => {
        if (typeof window === 'undefined') return;

        const nav = (navRef.current || {
          slug: '',
          goto: '',
          navigating: false,
          pop: false,
        }) as NavigationState;

        const currentSlug = element?.currentMedia?.slug || '';
        const urlSlug = getUrlSlug();

        // Real engine lifecycle ends here (authoritative)
        txInFlightRef.current = false;

        if (currentSlug) landedSlugRef.current = currentSlug;

        const mismatch = !!(urlSlug && currentSlug && urlSlug !== currentSlug);

        // If mismatch, immediately set goto to URL so controlled selected follows it.
        safeNavigate(
          {
            ...nav,
            navigating: false,
            pop: mismatch ? true : false,
            slug: currentSlug || nav.slug,
            goto: mismatch ? urlSlug : currentSlug || nav.goto,
          } as any,
          mismatch
            ? 'onTransitionEnd:mismatch(set-goto=url)'
            : 'onTransitionEnd'
        );

        if (onTransitionEnd) onTransitionEnd(element);

        if (mismatch) {
          syncToUrl('onTransitionEnd:url-mismatch');
        } else {
          // Safe point to clear the retry hook only when reality matches the URL.
          forceRef.current = null;
        }
      },
      [onTransitionEnd, safeNavigate, syncToUrl]
    );

    const handleTransitionReject = useCallback(
      (element: TransitionRejectInfoLike) => {
        if (typeof window === 'undefined') return;

        const nav = (navRef.current || {
          slug: '',
          goto: '',
          navigating: false,
          pop: false,
        }) as NavigationState;

        const urlSlug = getUrlSlug();

        // NOTE: DO NOT overwrite landedSlugRef here.
        // Rejects can happen during an unrelated in-flight transition (loading churn),
        // and pretending we've "landed" breaks sync completion logic.

        // Always arm forceTransition when we receive it.
        armForceRetry(element?.forceTransition);

        // Best-effort "where are we" for nav bookkeeping.
        const currentSlug =
          element?.currentMedia?.slug ||
          nav.slug ||
          landedSlugRef.current ||
          nav.goto ||
          '';

        const mismatch = !!(urlSlug && currentSlug && urlSlug !== currentSlug);

        // Prefer keeping goto pointing at the URL (authoritative) when available,
        // so controlled selected continues to request the URL target.
        const desiredGoto =
          urlSlug || element?.nextMedia?.slug || nav.goto || currentSlug;

        safeNavigate(
          {
            ...nav,
            slug: currentSlug || nav.slug,
            goto: desiredGoto,
            navigating: false,
            pop: !!urlSlug, // treat as URL-driven alignment context
          } as any,
          mismatch ? 'onTransitionReject:mismatch' : 'onTransitionReject'
        );

        // If URL says we should be elsewhere, kick sync loop (it will wait if tx is in-flight).
        if (urlSlug && landedSlugRef.current !== urlSlug) {
          syncToUrl(
            mismatch
              ? 'onTransitionReject:url-mismatch'
              : 'onTransitionReject:retry'
          );
        }

        if (onTransitionReject) onTransitionReject(element);
      },
      [armForceRetry, onTransitionReject, safeNavigate, syncToUrl]
    );

    return (
      <Component
        {...(extra as any)}
        buttons
        fillParent
        bullets={false}
        infinite={false}
        selected={navigation ? navigation.goto : (extra as any).selected}
        onTransitionReject={handleTransitionReject}
        onTransitionStart={handleTransitionStart}
        onTransitionEnd={handleTransitionEnd}
      />
    );
  }

  WithNavigationHandlers.displayName = `withNavigationHandlers(${
    (Component as any).displayName || (Component as any).name || 'Component'
  })`;

  return withNavigationContext(WithNavigationHandlers as any) as any;
}
