import type { FC } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import createPersistedState from 'use-persisted-state-v2';

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

type Result = {
  loading: boolean;
  isLatestVersion: boolean;
  emptyCacheStorage: (version?: string | undefined) => Promise<void>;
};

const ClearCacheContext = createContext<Result>({} as Result);

export const ClearCacheProvider: FC<OwnProps> = (props) => {
  const { children, ...otherProps } = props;
  const result = useClearCache(otherProps);
  return (
    <ClearCacheContext.Provider value={result}>
      {children}
    </ClearCacheContext.Provider>
  );
};

export const useClearCacheCtx = () => useContext(ClearCacheContext);

let fetchCacheTimeout: any;

export const useClearCache = (props?: OwnProps) => {
  const { duration, auto, storageKey, basePath, filename } = {
    ...defaultProps,
    ...props,
  };
  const [loading, setLoading] = useState(true);
  const useAppVersionState = createPersistedState<string>(storageKey);
  const [appVersion, setAppVersion] = useAppVersionState('');
  const [isLatestVersion, setIsLatestVersion] = useState(true);
  const [latestVersion, setLatestVersion] = useState(appVersion);

  async function setVersion(version: string) {
    return setAppVersion(version);
  }

  const emptyCacheStorage = async (version?: string) => {
    if ('caches' in window) {
      // Service worker cache should be cleared with caches.delete()
      const cacheKeys = await window.caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          window.caches.delete(key);
        })
      );
    }

    // clear browser cache and reload page
    await setVersion(version || latestVersion);
    window.location.replace(window.location.href);
  };

  // Replace any last slash with an empty space
  const baseUrl = basePath.replace(/\/+$/, '') + '/' + filename;

  function fetchMeta() {
    try {
      fetch(baseUrl, {
        cache: 'no-store',
      })
        .then((response) => response.json())
        .then((meta) => {
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

  useEffect(() => {
    fetchCacheTimeout = setInterval(() => fetchMeta(), duration);
    return () => {
      clearInterval(fetchCacheTimeout);
    };
  }, [loading]);

  const startVersionCheck = useRef(() => {});
  const stopVersionCheck = useRef(() => {});

  startVersionCheck.current = () => {
    if (window.navigator.onLine) {
      fetchCacheTimeout = setInterval(() => fetchMeta(), duration);
    }
  };

  stopVersionCheck.current = () => {
    clearInterval(fetchCacheTimeout);
  };

  useEffect(() => {
    window.addEventListener('focus', startVersionCheck.current);
    window.addEventListener('blur', stopVersionCheck.current);
    () => {
      window.removeEventListener('focus', startVersionCheck.current);
      window.removeEventListener('blur', stopVersionCheck.current);
    };
  }, []);

  useEffect(() => {
    fetchMeta();
  }, []);

  return {
    loading,
    isLatestVersion,
    emptyCacheStorage,
    latestVersion,
  };
};

const ClearCache: FC<OwnProps> = (props) => {
  const { loading, isLatestVersion, emptyCacheStorage } = useClearCache(props);

  const { children } = props;

  return children({
    loading,
    isLatestVersion,
    emptyCacheStorage,
  });
};

export default ClearCache;
