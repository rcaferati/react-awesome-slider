// Type definitions for react-awesome-slider
// Project: https://github.com/rcaferati/react-awesome-slider
// Definitions by: Rafael Caferati <https://github.com/rcaferati>
// TypeScript Version: 3.0.0

declare module 'react-awesome-slider' {
  import React, { Component } from 'react';

  export interface AwesomeSliderProps {
    activityColor?: string;
    animation?: string;
    bullets?: boolean;
    buttonContentLeft?: React.ReactNode;
    buttonContentRight?: React.ReactNode;
    buttons?: boolean;
    children?: React.ReactNode;
    className?: string;
    controlsReturnDelay?: number;
    cssModule?: object;
    customContent?: React.ReactNode;
    disabled?: boolean;
    fillParent?: boolean;
    infinite?: boolean;
    media?: any;
    name?: string;
    onFirstMount?(): void;
    onLoadStart?(): void;
    onResetSlider?(): void;
    onStartupRelease?(): void;
    onTransitionEnd?(): void;
    onTransitionRequest?(): void;
    onTransitionStart?(): void;
    organicArrows?: boolean;
    rootElement?: string;
    selected?: string | number;
    startup?: boolean;
    startupDelay?: number;
    startupScreen?: object;
    style?: object;
    transitionDelay?: number;
  }

  export default class AwesomeSlider extends Component<
    AwesomeSliderProps,
    {}
  > {}
}
