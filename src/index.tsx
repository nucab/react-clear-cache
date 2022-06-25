import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import createPersistedState from 'use-persisted-state-v2';

const STORAGE_KEY = 'APP_VERSION';

type OwnProps = {
  /**
   * You can set the duration (ms) when to fetch for new updates.
   * @defaultValue `6000`
   */
  duration: number;

  /**
   * Set to true to auto-reload the page whenever an update is available.
   * @defaultValue `false`
   */
  auto: boolean;

  /**
   * The key to store the latest version in local storage.
   * @defaultValue `APP_VERSION`
   */
  storageKey: string;

  /**
   * The base path to the meta file.
   * @defaultValue `''`
   */
  basePath: string;

  /**
   * The filename of the meta file
   * @defaultValue `meta.json`
   */
  filename: string;
};

const defaultProps: OwnProps = {
  duration: 60 * 1000,
  auto: false,
  storageKey: STORAGE_KEY,
  basePath: '',
  filename: 'meta.json',
};

type Result = {
  /**
   * A boolean that indicates whether the request is in flight
   */
  loading: boolean;

  /**
   * A boolean that indicates if the user has the latest version.
   */
  isLatestVersion: boolean;

  /**
   * This function empty the CacheStorage and reloads the page.
   */
  emptyCacheStorage: (version?: string | undefined) => Promise<void>;
};

const ClearCacheContext = createContext<Result>({} as Result);

export const ClearCacheProvider: FC<PropsWithChildren<OwnProps>> = (props) => {
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
  } as Result;
};
