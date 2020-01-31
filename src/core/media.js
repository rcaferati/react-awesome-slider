import React from 'react';
import PropTypes from 'prop-types';

export default class Media extends React.Component {
  static propTypes = {
    media: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
  };

  state = {};

  render() {
    const { media, className } = this.props;
    const {
      source,
      children,
      style,
      loader,
      [`data-src`]: dataSrc,
      [`data-alt`]: dataAlt,
      className: mediaClass,
      onTransitionEnd,
      onTransitionStartOut,
      onTransitionStartIn,
      onTransitionRequestOut,
      onTransitionRequestIn,
      ...extra
    } = media;

    let background = null;

    if (source) {
      if (source.match(/\.(mp4|webm)/)) {
        background = (
          <video
            title={media.title || media[`data-title`]}
            src={source}
            type="video/mp4"
            controls
          />
        );
      } else {
        // DEFAULTS TO AN IMAGE TAG
        background = (
          <img
            alt={media.alt || media.title || media[`data-alt`] || null}
            src={source}
          />
        );
      }
    }

    return (
      <div className={className} style={style || null} {...extra}>
        {background}
        {children && <div className={mediaClass}>{media.children}</div>}
      </div>
    );
  }
}
