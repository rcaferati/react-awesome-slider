import React from 'react';
import PropTypes from 'prop-types';
import { AwesomeButton, AwesomeButtonSocial } from 'react-awesome-button';
import AwesomeButtonStyles from 'react-awesome-button/src/styles/themes/theme-blue';
import { rgba2hex } from 'helpers/examples';
import { ColorPicker, BorderPicker, Checkbox } from 'components';
import { GeneralContext } from 'context/GeneralContext';
import Styles from './customiser.scss';

function applyStyles(elements, { property, value }) {
  elements.forEach(element => {
    element.style.setProperty(property, value);
  });
}

class Customiser extends React.Component {
  static propTypes = {
    repository: PropTypes.string.isRequired,
    module: PropTypes.object.isRequired,
    handlePopover: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
    componentClass: PropTypes.string,
    properties: PropTypes.array.isRequired,
    globalProps: PropTypes.array.isRequired,
  };

  static defaultProps = {
    componentClass: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      customized: false,
      popoverOpened: false,
    };
    if (typeof window !== 'undefined') {
      window.setElement = this.setElement;
    }
  }

  state = {
    element: null,
  };

  componentWillMount() {
    this.updateProperties(this.props);
  }

  componentDidMount() {
    this.updateAllValues(this.props);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.theme !== newProps.theme) {
      this.updateValues = true;
    }
  }

  componentDidUpdate() {
    if (this.updateValues === true) {
      this.updateValues = false;
      // this.updateElement(this.props.componentClass);
      this.updateAllValues(this.props);
    }
  }

  setElement = element => {
    this.element = element;
    this.updateAllValues(this.props);
  };

  getStylesText() {
    const text = ['<p><b>.aws-btn</b> {</p><ul>'];
    this.props.properties.forEach(section => {
      section.props.forEach(prop => {
        const name = `--${prop.name}`;
        text.push(
          `<li><b>${name}</b>: <em>${this.state[name]}${prop.suffix ||
            ''}</em>;</li>`
        );
      });
    });
    text.push('</ul><p>}</p>');
    return text.join('');
  }

  updateAllValues(newProps) {
    const state = {
      customized: false,
    };
    if (!this.element) {
      return false;
    }
    newProps.properties.forEach(section => {
      section.props.forEach(prop => {
        const name = `--${prop.name}`;
        let style = getComputedStyle(this.element)
          .getPropertyValue(name)
          .trim();
        if (style.match(/(#)([a-z0-9]{3})($)/)) {
          style = style.replace(/(#)([a-z0-9]{3})/, '$1$2$2');
        }
        if (style.match(/(px|em|ms|s|%)$/)) {
          style = style.replace(/px|em|ms|s|%/gi, '');
        }
        if (style.match(/rgb/)) {
          style = rgba2hex(style);
        }
        state[name] = style;
        if (typeof window !== 'undefined') {
          applyStyles(
            document.querySelectorAll(
              `[data-role="customizable"] .${this.props.componentClass}`
            ),
            {
              property: name,
              value: style + (prop.suffix || ''),
            }
          );
        }
      });
    });
    this.setState(state);
    return true;
  }

  updateProperties(newProps) {
    if (newProps.properties) {
      const state = {};
      newProps.properties.forEach(section => {
        section.props.forEach(prop => {
          state[`--${prop.name}`] = null;
        });
      });
      this.setState(state);
    }
  }

  updateElement(className) {
    if (this.control) {
      this.element = this.control.querySelector(`.${className}`);
    }
  }

  resetStyles = () => {
    this.setState({
      customized: false,
    });
    this.updateElement(this.props.componentClass);
    this.updateAllValues(this.props);
    this.resetContext();
  };

  resetContext() {
    this.context.resetGeneral();
  }

  exportStyles = () => {
    this.setState(
      {
        popoverOpened: true,
      },
      () => {
        this.props.handlePopover({
          popoverOpened: true,
          popoverText: this.getStylesText(),
        });
      }
    );
  };

  updatePopoverText() {
    this.props.handlePopover({
      popoverText: this.getStylesText(),
    });
  }

  renderInputs(props) {
    return props.map(cssProperty => {
      const { name, type, global, defaultValue } = cssProperty;
      const buttonName = `--${name}`;
      const extraProps = {};
      extraProps.type = type;

      let inputValue = this.state[buttonName] || '';

      let displayValue = this.state[buttonName]
        ? `${this.state[buttonName]}${cssProperty.suffix || ''}` || ''
        : '';

      if (global) {
        inputValue = this.context.general.hasOwnProperty(buttonName)
          ? this.context.general[buttonName]
          : defaultValue;
      }

      if (type === 'checkbox') {
        inputValue = inputValue || false;
        displayValue = inputValue ? 'true' : 'false';
      }

      if (type === 'range') {
        extraProps.type = type;
        extraProps.min = cssProperty.min || 0;
        extraProps.max = cssProperty.max || 10;
        extraProps.step = cssProperty.step || 1;
      }

      const onChange = event => {
        if (this.state.customized === false) {
          this.setState({ customized: true });
        }
        const { target } = event;
        const state = {};
        let value = type === 'checkbox' ? target.checked : target.value;

        state[buttonName] = value;

        this.setState(state, () => {
          this.updatePopoverText();
        });

        if (global) {
          this.context.setGeneral({
            ...this.context.general,
            [`${buttonName}`]: value,
          });
        }

        if (typeof window !== 'undefined') {
          if (cssProperty.suffix) {
            value = `${value}${cssProperty.suffix}`;
          }
          applyStyles(
            document.querySelectorAll(
              `[data-role="customizable"] .${this.props.componentClass}`
            ),
            {
              property: buttonName,
              value,
            }
          );
        }
      };

      let input = null;
      switch (type) {
        case 'color':
          input = (
            <ColorPicker
              value={inputValue}
              setTransparency={onChange}
              onChange={onChange}
              {...extraProps}
            />
          );
          break;
        case 'border':
          input = (
            <BorderPicker
              value={inputValue}
              onChange={onChange}
              {...extraProps}
            />
          );
          break;
        case 'checkbox':
          input = (
            <Checkbox
              checked={inputValue}
              onChange={onChange}
              {...extraProps}
            />
          );
          break;
        default:
          input = (
            <input value={inputValue} onChange={onChange} {...extraProps} />
          );
      }

      return (
        <li key={buttonName}>
          <label>
            <code>{name}</code>
          </label>
          <div>{input}</div>
          <div>
            <span>{displayValue}</span>
          </div>
        </li>
      );
    });
  }

  renderSection(section) {
    const listClass = section.name ? null : Styles.untitledSection;
    return (
      <section key={section.name}>
        <h4>{section.name}</h4>
        <ul className={listClass}>{this.renderInputs(section.props)}</ul>
      </section>
    );
  }

  renderSections(sections) {
    return sections.map(section => this.renderSection(section));
  }

  render() {
    return (
      <GeneralContext.Consumer>
        {context => {
          this.context = context;
          return (
            <section className={Styles.container}>
              <header>
                <h2>Customisation</h2>
                <p>
                  Basic customization through the component's props and CSS
                  custom-properties.
                </p>
                <div
                  ref={control => {
                    this.control = control;
                  }}
                  className={Styles.control}
                >
                  <AwesomeButton
                    size="medium"
                    disabled={!this.state.customized}
                    action={this.resetStyles}
                    cssModule={AwesomeButtonStyles}
                  >
                    Reset Styles
                  </AwesomeButton>
                  <AwesomeButtonSocial
                    size="medium"
                    href={this.props.repository}
                    target="_blank"
                    type="github"
                    cssModule={AwesomeButtonStyles}
                  >
                    Source
                  </AwesomeButtonSocial>
                  <div
                    style={{ display: 'none' }}
                    className={this.props.componentClass}
                  />
                </div>
              </header>
              <header>
                <h3>Component's global props</h3>
              </header>
              <ul>{this.renderSections(this.props.globalProps)}</ul>
              <header>
                <h3>CSS Custom Properties</h3>
              </header>
              <ul>{this.renderSections(this.props.properties)}</ul>
              <footer>
                <div className={Styles.export}>
                  <AwesomeButton
                    action={this.exportStyles}
                    cssModule={AwesomeButtonStyles}
                  >
                    Export Custom-Properties
                  </AwesomeButton>
                </div>
                <p>
                  Access the source on{' '}
                  <a target="_blank" href={this.props.repository}>
                    github
                  </a>{' '}
                  to check all customisable options
                </p>
              </footer>
            </section>
          );
        }}
      </GeneralContext.Consumer>
    );
  }
}

export default Customiser;
