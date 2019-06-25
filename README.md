# react-clear-cache

> A component to manage application updates.

[![NPM](https://img.shields.io/npm/v/react-clear-cache.svg)](https://www.npmjs.com/package/react-clear-cache) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
$ npm install --save react-clear-cache
```

## Usage

```tsx
import * as React from 'react';

import ClearCache from 'react-clear-cache';

const App: React.FC<{}> = () => {
  return (
    <div>
      <ClearCache>
        {({ loading, latestVersion, isLatestVersion, emptyCacheStorage }) =>
          <div>App works!</div>
        }
      </ClearCache>
    </div>
  );
};

export default App;
```

## Props

### `duration`: number

You can set the duration when to fetch for new updates.

## Render prop function

### `loading`: boolean

A boolean that indicates whether the request is in flight

### `latestVersion`: string

A string containing the latest version number of the build.

### `isLatestVersion`: boolean

A boolean that indicates if the user has the latest version.

### `emptyCacheStorage`: () => void

This function empty the CacheStorage and reloads the page.

## Contributors

1. [noahjohn9259](https://github.com/noahjohn9259)

## License

MIT © [noahjohn9259](https://github.com/noahjohn9259)
