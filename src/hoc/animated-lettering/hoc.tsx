// hoc/animated-lettering/hoc.tsx
import React, { useMemo } from 'react';

type Screen = {
  backgroundColor?: string;
  children: React.ReactNode[]; // strings are fine too
};

export type LetteringHocProps = {
  screens: Screen[];
  name?: string;
  children?: React.ReactNode;
};

export default function LetteringHoc<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const Component: React.FC<P & LetteringHocProps> = (props) => {
    const { screens, name, children, ...rest } = props as LetteringHocProps & P;

    const renderedScreens = useMemo(() => {
      const base = name || 'awesome-slider';

      return (screens || []).map((screen, index) => (
        <div
          key={`${base}-screen-${index}`}
          style={{ backgroundColor: screen?.backgroundColor }}
        >
          {(screen?.children || []).map((text, tIndex) => (
            <p key={`${base}${index}-text-${tIndex}`}>{text}</p>
          ))}
        </div>
      ));
    }, [screens, name]);

    return (
      <WrappedComponent {...(rest as P)}>
        {renderedScreens}
        {children /* keep passthrough compatibility */}
      </WrappedComponent>
    );
  };

  Component.displayName = `LetteringHoc(${
    (WrappedComponent as any).displayName ||
    (WrappedComponent as any).name ||
    'Component'
  })`;

  return Component;
}