/* eslint-disable */

import * as React from 'react';
import createPersistedState from 'use-persisted-state';

type OwnProps = {
  duration: number;
  children: any;
};

const ClearCache: React.FC<OwnProps> = ({ duration = 60 * 1000, children }) => {
  const [loading, setLoading] = React.useState(true);
  const [isLatestVersion, setIsLatestVersion] = React.useState(false);
  const [latestVersion, setLatestVersion] = React.useState('');
  const useAppVersionState = createPersistedState('appVersion');
  const [appVersion, setAppVersion] = useAppVersionState('');

  function emptyCacheStorage() {
    console.log('Clearing cache and hard reloading...');
    if (!latestVersion) return;
    setAppVersion(latestVersion);
    if (caches) {
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
    fetch('/meta.json', {
      cache: 'no-store'
    })
      .then(response => response.json())
      .then(meta => {
        const newVersion = meta.version;
        const currentVersion = appVersion;
        const shouldForceRefresh = newVersion !== currentVersion;
        if (shouldForceRefresh) {
          console.log('An update is avaialbe!');
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
