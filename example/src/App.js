import * as React from 'react';
import { useClearCacheCtx } from 'react-clear-cache';

import logo from './logo.svg';
import './App.css';
import Test from './Test';

const App = () => {
  const { isLatestVersion, emptyCacheStorage } = useClearCacheCtx();
  return (
    <div className="App">
      <Test />
      <header className="App-header">
        <p>
          <img src={logo} className="App-logo" alt="logo" />
        </p>
        <p>
          <strong>Is latest version</strong>: {isLatestVersion ? 'Yes' : 'No'}
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
  );
};

export default App;
