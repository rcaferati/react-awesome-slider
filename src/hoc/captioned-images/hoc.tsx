// src/hoc/captioned-images/hoc.tsx (drop-in replacement)
import React, { useMemo } from 'react';

type Screen = {
  media: string;
  caption?: string;
  backgroundColor?: string;
  // allow extra fields without breaking
  [k: string]: any;
};

type Props = {
  screens: Screen[];
  name?: string;
  children?: React.ReactNode;
  [k: string]: any;
};

// Generic HOC: preserves WrappedComponent props + adds `screens`
export default function CaptionedHoc<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const CaptionedComponent: React.FC<P & Props> = (props) => {
    const { screens, name, ...rest } = props as Props;

    const renderedScreens = useMemo(() => {
      const base = name || 'captioned';
      return (screens || []).map((screen, index) => (
        <div
          key={`${base}-screen-${index}`}
          data-src={screen.media}
          style={{
            backgroundColor: screen.backgroundColor,
          }}
        >
          <div data-type="caption">
            <p>{screen.caption}</p>
          </div>
        </div>
      ));
    }, [screens, name]);

    return (
      <WrappedComponent {...(rest as unknown as P)}>{renderedScreens}</WrappedComponent>
    );
  };

  CaptionedComponent.displayName = `CaptionedHoc(${
    (WrappedComponent as any).displayName || (WrappedComponent as any).name || 'Component'
  })`;

  return CaptionedComponent;
}