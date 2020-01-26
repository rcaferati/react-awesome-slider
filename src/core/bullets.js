import React from 'react';
import PropTypes from 'prop-types';
import { getClassName } from '../helpers/components';

export default class Bullets extends React.Component {
  static propTypes = {
    cssModule: PropTypes.object,
    rootElement: PropTypes.string.isRequired,
    media: PropTypes.array,
    onClick: PropTypes.func,
    selected: PropTypes.number,
  };

  static defaultProps = {
    cssModule: null,
    selected: 0,
    media: [],
    onClick: () => {},
  };

  constructor(props) {
    super(props);
    this.rootElement = props.rootElement;
  }

  bulletClick = event => {
    const button = event.currentTarget;
    button.classList.add(
      getClassName(
        `${this.rootElement}__bullets--loading`,
        this.props.cssModule
      )
    );
    const index = parseInt(button.getAttribute('data-index'), 10);
    const direction = !(this.props.selected > index);
    this.props.onClick({ index, direction });
  };

  renderBullets() {
    const { cssModule, selected, media = [] } = this.props;
    return media.map((item, index) => {
      const className =
        index === selected
          ? getClassName(`${this.rootElement}__bullets--active`, cssModule)
          : null;
      return (
        <button
          key={`bullet-${index}`}
          data-index={index}
          onClick={this.bulletClick}
          className={className}
        >
          {index}
        </button>
      );
    });
  }

  render() {
    const { cssModule, rootElement } = this.props;
    return (
      <nav className={getClassName(`${rootElement}__bullets`, cssModule)}>
        {this.renderBullets()}
      </nav>
    );
  }
}
