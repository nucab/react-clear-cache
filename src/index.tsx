import * as React from 'react';
import createPersistedState from 'use-persisted-state';

const STORAGE_KEY = 'APP_VERSION';

const defaultProps = {
  duration: 60 * 1000,
  auto: false,
  storageKey: STORAGE_KEY,
  basePath: '',
  filename: 'meta.json',
};

type OwnProps = {
  duration?: number;
  auto?: boolean;
  storageKey?: string;
  basePath?: string;
  filename?: string;
  children?: any;
};

export const useClearCache = (props?: OwnProps) => {
  const { duration, auto, storageKey, basePath, filename } = {
    ...defaultProps,
    ...props
  };
  const [loading, setLoading] = React.useState(true);
  const useAppVersionState = createPersistedState(storageKey);
  const [appVersion, setAppVersion] = useAppVersionState('');
  const [isLatestVersion, setIsLatestVersion] = React.useState(true);
  const [latestVersion, setLatestVersion] = React.useState(appVersion);

  async function setVersion(version: string) {
    await setAppVersion(version);
  }

  const emptyCacheStorage = async (version?: string) => {
    if ('caches' in window) {
      // Service worker cache should be cleared with caches.delete()
      caches.keys().then(names => {
        // eslint-disable-next-line no-restricted-syntax
        for (const name of names) caches.delete(name);
      });
    }

    // clear browser cache and reload page
    await setVersion(version || latestVersion).then(() =>
      window.location.reload(true)
    );
  };

  // Replace any last slash with an empty space
  const baseUrl = basePath.replace(/\/+$/, '') + '/' + filename;

  function fetchMeta() {
    try {
      fetch(baseUrl, {
        cache: 'no-store'
      })
        .then(response => response.json())
        .then(meta => {
          const newVersion = meta.version;
          const currentVersion = appVersion;
          const isUpdated = newVersion === currentVersion;
          if (!isUpdated && !auto) {
            setLatestVersion(newVersion);
            setLoading(false);
            if (appVersion) {
              setIsLatestVersion(false);
            } else {
              setVersion(newVersion);
            }
          } else if (!isUpdated && auto) {
            emptyCacheStorage(newVersion);
          } else {
            setIsLatestVersion(true);
            setLoading(false);
          }
        });
    } catch (err) {
      console.error(err);
    }
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

  return {
    loading,
    isLatestVersion,
    emptyCacheStorage,
    latestVersion
  };
};

const ClearCache: React.FC<OwnProps> = props => {
  const { loading, isLatestVersion, emptyCacheStorage } = useClearCache(props);

  const { children } = props;

  return children({
    loading,
    isLatestVersion,
    emptyCacheStorage
  });
};

export default ClearCache;
