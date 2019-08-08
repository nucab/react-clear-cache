import * as React from 'react';
import ClearCache from 'react-clear-cache';

import logo from './logo.svg';
import './App.css';

const App = () => {
  return (
    <ClearCache duration={5000}>
      {({ isLatestVersion, latestVersion, emptyCacheStorage }) => (
        <div className="App">
          <header className="App-header">
            <p>
              <img src={logo} className="App-logo" alt="logo" />
            </p>
            <p>
              <strong>Is latest version</strong>:{' '}
              {isLatestVersion ? 'Yes' : 'No'}
            </p>
            {!isLatestVersion && (
              <p>
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    emptyCacheStorage();
                  }}
                >
                  Update version
                </a>
              </p>
            )}
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
          </header>
        </div>
      )}
    </ClearCache>
  );
};

export default App;
