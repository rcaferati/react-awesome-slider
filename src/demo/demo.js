import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-scss';
import 'prismjs/themes/prism-okaidia.css';
import Data from './data';
import Styles from './demo.scss';

const renderFeatures = () => Data.features.map((feature, index) => (<li key={`feature-${index}`}>{feature}</li>));

const renderExamples = () => Data.examples.map((example, index) => (
  <li key={`example-${index}`}>
    <div className={Styles.header}>
      <h3>{example.title}</h3>
      {example.description && <p>{example.description}</p>}
    </div>
    <div>
      {example.scss && (
        <pre>
          <h4>.scss</h4>
          <code
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(example.scss.trim(), Prism.languages.scss),
            }}
          />
        </pre>
      )}
      {example.js && (
        <pre>
          <h4>.js</h4>
          <code
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(example.js.trim(), Prism.languages.jsx),
            }}
          />
        </pre>
      )}
      {example.jsx && (
        <pre>
          <h4>.jsx</h4>
          <code
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(example.jsx.trim(), Prism.languages.jsx),
            }}
          />
        </pre>
      )}
    </div>
    <div className={Styles.buttons}>
      {example.button}
    </div>
  </li>
));

const Demo = () => (
  <section>
    <header>
      <h1>{Data.title}</h1>
      <h2>
        <strong>&lt;{Data.name}/&gt;</strong>
        <span>{Data.size}</span>
      </h2>
      <p>{Data.description}</p>
    </header>
    <ul className={Styles.examples}>
      {renderExamples()}
    </ul>
    <div className={Styles.features}>
      <h3>Main Features</h3>
      <ul>
        {renderFeatures()}
      </ul>
    </div>
    <footer>
      <div>
        <img className="support" src="/images/support.svg" alt="Modern Web Browsers" title="Modern Web Browsers" />
      </div>
      <small>Promote and support this project on <a rel="noopener noreferrer" target="_blank" href={Data.repository}>github</a>.</small>
      <small>Read more and discuss at the <a rel="noopener noreferrer" target="_blank" href={Data.article}>article page</a>.</small>
    </footer>
  </section>
);

render(
  (
    <Router>
      <Route path="/" component={Demo} />
    </Router>
  ),
  document.getElementById('root'),
);
