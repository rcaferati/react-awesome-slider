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
    const { url, children, style, loader, [`data-src`]: dataSrc,className: mediaClass, ...extra } = media;

    let background = null;

    if (url) {
      if (url.match(/\.(mp4|webm)/)) {
        background = (
          <video
            title={media.title}
            src={url}
            type="video/mp4"
            controls
          />
        );
      } else {
        // DEFAULTS TO AN IMAGE TAG
        background = (
          <img alt={media.alt || media.title || null} src={url} />
        );
      }
    }

    return (
      <div className={className} style={style || null} {...extra}>
        {background}
        {children && (
          <div className={mediaClass}>{media.children}</div>
        )}
      </div>
    );
  }
}
