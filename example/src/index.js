import React from 'react';
import ReactDOM from 'react-dom';
import { ClearCacheProvider } from 'react-clear-cache';

import './index.css';
import App from './App';

ReactDOM.render(
  <ClearCacheProvider duration={5000} filename="build.json">
    <App />
  </ClearCacheProvider>,
  document.getElementById('root')
);
