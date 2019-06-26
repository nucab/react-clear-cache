import * as React from 'react';
import ClearCache from 'react-clear-cache';

import logo from './logo.svg';
import './App.css';

const App = () => {
  return (
    <div>
      <ClearCache duration={5000}>
        {({ isLatestVersion, latestVersion }) => (
          <div className="App">
            <header className="App-header">
              <p>
                <img src={logo} className="App-logo" alt="logo" />
              </p>
              <p>
                <strong>Is latest version</strong>:{' '}
                {isLatestVersion ? 'Yes' : 'No'}
              </p>
              <p>
                <strong>Latest version</strong>: {latestVersion}
              </p>
              <p>
                Edit <code>src/App.tsx</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React 2
              </a>
            </header>
          </div>
        )}
      </ClearCache>
    </div>
  );
};

export default App;
