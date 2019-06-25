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
