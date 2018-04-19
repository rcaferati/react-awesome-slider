import React from 'react';
import PropTypes from 'prop-types';
import styles from './pageRibbon.scss';

class PageRibbon extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    delay: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      hidden: true,
    };
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({
        hidden: false,
      });
    }, this.props.delay);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const {
      children,
      href,
      title,
      target,
    } = this.props;

    const mainClass = [styles.container];
    if (this.state.hidden === true) {
      mainClass.push(styles.hidden);
    }
    if (this.props.className) {
      mainClass.push(this.props.className);
    }

    return (
      <div className={mainClass.join(' ')}>
        <a
          href={href}
          target={target}
          title={title}
        >
          {children}
        </a>
      </div>
    );
  }
}

export default PageRibbon;
