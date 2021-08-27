import * as React from 'react';
import { useClearCacheCtx } from 'react-clear-cache';

import logo from './logo.svg';
import './App.css';

const App = () => {
  const {
    isLatestVersion,
    fetchLatestVersion,
    emptyCacheStorage
  } = useClearCacheCtx();
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <img src={logo} className="App-logo" alt="logo" />
        </p>
        <p>
          <strong>Is latest version</strong>: {isLatestVersion ? 'Yes' : 'No'}
        </p>
        <p>
          {isLatestVersion ? (
            <a
              className="App-link"
              href="#clear"
              onClick={e => {
                e.preventDefault();
                fetchLatestVersion(needsUpdate =>
                  console.log('Needs update?', needsUpdate)
                );
              }}
            >
              Fetch latest version manually
            </a>
          ) : (
            <a
              className="App-link"
              href="#clear"
              onClick={e => {
                e.preventDefault();
                emptyCacheStorage();
              }}
            >
              Update version
            </a>
          )}
        </p>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
};

export default App;
