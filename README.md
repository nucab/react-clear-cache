# react-clear-cache

> A component to manage application updates.

[![NPM](https://img.shields.io/npm/v/react-clear-cache.svg)](https://www.npmjs.com/package/react-clear-cache) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Demo

See [demo](https://noahjohn9259.github.io/react-clear-cache/)

## Install

```bash
$ npm install --save react-clear-cache
```

## Add script in package.json

This will generate `meta.json` file. This will have the version key with the latest build.

```bash
{
  "prebuild": "npm run generate-build-meta",
  "generate-build-meta": "./node_modules/react-clear-cache/bin/cli.js"
}
```

## Usage

### Using `render props`:

```tsx
import * as React from "react";

import ClearCache from "react-clear-cache";

const App: React.FC<{}> = () => {
  return (
    <div>
      <ClearCache>
        {({ isLatestVersion, emptyCacheStorage }) => (
          <div>
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
          </div>
        )}
      </ClearCache>
    </div>
  );
};

export default App;
```

### Using `hooks`:

```tsx
import * as React from "react";

import { useClearCache } from "react-clear-cache";

const App: React.FC<{}> = () => {
  const { isLatestVersion, emptyCacheStorage } = useClearCache();
  return (
    <div>
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
    </div>
  );
};

export default App;
```

## Props

### `duration`: number

You can set the duration when to fetch for new updates.

### `auto`: boolean

Set to true to auto-reload the page whenever an update is available.

## Render props

### `loading`: boolean

A boolean that indicates whether the request is in flight

### `isLatestVersion`: boolean

A boolean that indicates if the user has the latest version.

### `emptyCacheStorage`: () => void

This function empty the CacheStorage and reloads the page.

## Contributors

1. [noahjohn9259](https://github.com/noahjohn9259)

## License

MIT © [noahjohn9259](https://github.com/noahjohn9259)

## Development

1. In package.json, set `main` to `src/index.js`.

2. Run `npm start` in root directory. It will build and watch if there are changes made.

3. `cd example` and run `npm start`. It will run the demo application.

## Note

If you are done making changes, reset `main` to `dist/index.js` in package.json.
