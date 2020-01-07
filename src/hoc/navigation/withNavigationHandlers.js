import React from 'react';
import withNavigationContext from './withNavigationContext';

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
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', `/${element.currentMedia.slug}`);
        }
        const state = {
          ...navigation,
          navigating: false,
        };
        if (element.currentMedia.slug !== state.goto) {
          state.slug = element.currentMedia.slug;
          state.goto = element.currentMedia.slug;
        }
        navigate(state);

        if (onTransitionEnd) {
          onTransitionEnd(element);
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
