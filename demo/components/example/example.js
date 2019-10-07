import React from 'react';
import PropTypes from 'prop-types';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-okaidia.css';
import Styles from './example.scss';

class Example extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    Component: PropTypes.func.isRequired,
    examples: PropTypes.array,
  };
  static defaultProps = {
    examples: [],
  };

  renderExamples(examples) {
    return examples.map((example, index) => {
      const { js, jsx, scss, component, description, command, title } = example;
      return (
        <div key={`example-${index}`} className={Styles.example}>
          {title && <h3>{title}</h3>}
          {description && (
            <p
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          )}
          {command && (
            <pre>
              <h4>.sh</h4>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    command.trim(),
                    Prism.languages.markup
                  ),
                }}
              />
            </pre>
          )}
          {js && (
            <pre>
              <h4>.js</h4>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(js.trim(), Prism.languages.jsx),
                }}
              />
            </pre>
          )}
          {jsx && (
            <pre>
              <h4>.jsx</h4>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(jsx.trim(), Prism.languages.jsx),
                }}
              />
            </pre>
          )}
          {scss && (
            <pre>
              <h4>.scss</h4>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(scss.trim(), Prism.languages.scss),
                }}
              />
            </pre>
          )}
          {component && <div>{component}</div>}
        </div>
      );
    });
  }

  render() {
    const { title, Component, examples } = this.props;

    return (
      <div className={Styles.container}>
        <div className={Styles.header}>{title && <h3>{title}</h3>}</div>
        <div data-role="customizable" className={Styles.component}>
          <Component startup={this.props.startup} />
        </div>
        {this.renderExamples(examples)}
      </div>
    );
  }
}

export default Example;
