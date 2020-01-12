import React, { useEffect } from 'react';
import withNavigationContext from './withNavigationContext';

const getCleanPath = path => {
  return path.replace(/^\//, '').replace(/\/$/);
};

export default Component => {
  return withNavigationContext(
    ({
      fullpage,
      onTransitionReject,
      onTransitionStart,
      onTransitionEnd,
      ...extra
    }) => {
      const { navigation, navigate } = fullpage;

      useEffect(() => {
        if (typeof window !== 'undefined') {
          window.addEventListener(
            'popstate',
            event => {
              event.preventDefault();
              event.stopImmediatePropagation();
              if (event.path && event.path[0]) {
                navigate({
                  ...navigation,
                  pop: true,
                  goto: getCleanPath(event.path[0].location.pathname),
                });
              }
            }
            // { once: true }
          );
        }
      }, []);

      const handleTransitionStart = element => {
        const cleanPath = getCleanPath(window.location.pathname);

        if (
          typeof window !== 'undefined' &&
          cleanPath !== element.nextMedia.slug
        ) {
          if (navigation.pop === false) {
            window.history.pushState(
              {
                url: window.location.pathname,
                to: window.location.pathname,
              },
              '',
              `/${element.nextMedia.slug}`
            );
          } else {
            navigate({
              ...navigation,
              // pop: false,
              goto: cleanPath,
            });
            return;
          }
        }

        navigate({
          ...navigation,
          slug: navigation.goto,
          navigating: true,
        });

        if (onTransitionStart) {
          onTransitionStart(element);
        }
      };

      const handleTransitionEnd = element => {
        const state = {
          ...navigation,
          navigating: false,
          pop: false,
        };
        if (element.currentMedia.slug !== state.goto) {
          state.slug = element.currentMedia.slug;
          state.goto = element.currentMedia.slug;
        }

        navigate(state);

        if (onTransitionEnd) {
          onTransitionEnd(element);
        }

        const cleanPath = getCleanPath(window.location.pathname);

        if (cleanPath !== element.currentMedia.slug) {
          navigate({
            ...state,
            goto: cleanPath,
          });
        }
      };

      const handleTransitionReject = element => {
        if (navigation.navigating === true || !element.currentMedia) {
          return;
        }

        navigate({
          slug: element.currentMedia.slug,
          goto: element.currentMedia.slug,
          navigating: false,
        });

        if (onTransitionReject) {
          onTransitionReject(element);
        }
      };

      if (navigation.goto === null) {
        return null;
      }

      return (
        <Component
          buttons
          fillParent
          bullets={false}
          infinite={false}
          selected={navigation.goto}
          onTransitionReject={handleTransitionReject}
          onTransitionStart={handleTransitionStart}
          onTransitionEnd={handleTransitionEnd}
          {...extra}
        />
      );
    }
  );
};
