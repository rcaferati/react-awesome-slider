import React from 'react';
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

      const handleTransitionStart = element => {
        const cleanPath = getCleanPath(window.location.pathname);

        if (
          typeof window !== 'undefined' &&
          cleanPath !== element.nextMedia.slug
        ) {
          if (navigation.pop === false) {
            window.history.pushState({}, '', `/${element.nextMedia.slug}`);
          } else {
            navigate({
              ...navigation,
              pop: false,
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
        if (navigation.navigating === true) {
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

      return (
        <Component
          buttons
          fillParent
          bullets={false}
          infinite={false}
          onFirstMount={() => {
            window.addEventListener('popstate', () => {
              event.stopPropagation();
              event.preventDefault();
              if (event.path && event.path[0]) {
                navigate({
                  ...navigation,
                  pop: true,
                  goto: getCleanPath(event.path[0].location.pathname),
                });
              }
            });
          }}
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
