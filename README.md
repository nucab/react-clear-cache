# react-clear-cache

> A component to manage application updates.

[![NPM](https://img.shields.io/npm/v/react-clear-cache.svg)](https://www.npmjs.com/package/react-clear-cache) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-clear-cache
```

## Usage

```tsx
import * as React from 'react';

import ClearCache from 'react-clear-cache';

const App = () => {
  return (
    <div>
      <ClearCache>{() => <div>App works!</div>}</ClearCache>
    </div>
  );
};

export default App;
```

## License

MIT © [noahjohn9259](https://github.com/noahjohn9259)
