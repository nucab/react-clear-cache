/* eslint-disable */

import * as React from 'react';
import createPersistedState from 'use-persisted-state';

type OwnProps = {
  duration?: number;
  children: any;
  relativePath?: any;
};

const ClearCache: React.FC<OwnProps> = ({
  relativePath = '',
  duration = 60 * 1000,
  children
}) => {
  const [loading, setLoading] = React.useState(true);
  const [isLatestVersion, setIsLatestVersion] = React.useState(true);
  const useAppVersionState = createPersistedState('appVersion');
  const [appVersion, setAppVersion] = useAppVersionState('');
  const [latestVersion, setLatestVersion] = React.useState(appVersion);

  function emptyCacheStorage() {
    console.log('Clearing cache and hard reloading...');
    if (!latestVersion) return;
    setAppVersion(latestVersion);
    if ('caches' in window) {
      // Service worker cache should be cleared with caches.delete()
      caches.keys().then(names => {
        // eslint-disable-next-line no-restricted-syntax
        for (const name of names) caches.delete(name);
      });
    }

    // clear browser cache and reload page
    window.location.reload(true);
  }

  function fetchMeta() {
    fetch(`${relativePath}/meta.json`, {
      cache: 'no-store'
    })
      .then(response => response.json())
      .then(meta => {
        const newVersion = meta.version;
        const currentVersion = appVersion;
        const shouldForceRefresh = newVersion !== currentVersion;
        if (shouldForceRefresh) {
          console.log('An update is available!');
          if (!appVersion) {
            setAppVersion(newVersion);
          }
          setLatestVersion(newVersion);
          setLoading(false);
          setIsLatestVersion(false);
        } else {
          setIsLatestVersion(true);
          setLoading(false);
        }
      });
  }

  React.useEffect(() => {
    const fetchCacheTimeout = setInterval(() => fetchMeta(), duration);
    return () => {
      clearInterval(fetchCacheTimeout);
    };
  }, [loading]);

  React.useEffect(() => {
    fetchMeta();
  }, []);

  return children({
    loading,
    latestVersion,
    isLatestVersion,
    emptyCacheStorage
  });
};

export default ClearCache;
