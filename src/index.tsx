import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import createPersistedState from 'use-persisted-state-v2';

declare global {
  interface Location {
    reload(forceGet?: boolean): void;
  }
}

type OwnProps = {
  /**
   * A boolean that indicates whether meta file is fetched or not.
   * @defaultValue `true`
   */
  enabled: boolean;

  /**
   * You can set the duration (ms) when to fetch for new updates.
   * @defaultValue `60000`
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
  enabled: true,
  duration: 60 * 1000,
  auto: false,
  storageKey: 'APP_VERSION',
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

export const ClearCacheProvider: FC<PropsWithChildren<Partial<OwnProps>>> = (
  props
) => {
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

export const useClearCache = (props?: Partial<OwnProps>) => {
  const { enabled, duration, auto, storageKey, basePath, filename } = {
    ...defaultProps,
    ...props,
  };
  const [loading, setLoading] = useState(true);
  const useAppVersionState = createPersistedState<string>(
    storageKey,
    sessionStorage
  );
  const [appVersion, setAppVersion] = useAppVersionState('');
  const [isLatestVersion, setIsLatestVersion] = useState(true);
  const [latestVersion, setLatestVersion] = useState(appVersion);

  async function setVersion(version: string) {
    return setAppVersion(version);
  }

  const emptyCacheStorage = async (version?: string) => {
    if ('caches' in window) {
      // Service worker cache should be cleared with caches.delete()
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          caches.delete(key);
        })
      );
    }

    // clear browser cache and reload page
    await setVersion(version || latestVersion);
    // Note: Firefox supports a non-standard forceGet boolean parameter for
    // `location.reload()`, to tell Firefox to bypass its cache and force-reload
    // the current document. However, in all other browsers, any parameter you
    // specify in a `location.reload()` call will be ignored and have no effect
    // of any kind.
    location.reload(true);
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
    const startVersionCheck = () => {
      fetchMeta();
      fetchCacheTimeout = setInterval(() => fetchMeta(), duration);
    };

    const stopVersionCheck = () => {
      clearInterval(fetchCacheTimeout);
    };

    if (enabled) {
      startVersionCheck();
      addEventListener('focus', startVersionCheck);
      addEventListener('blur', stopVersionCheck);
    }

    return () => {
      stopVersionCheck();
      removeEventListener('focus', startVersionCheck);
      removeEventListener('blur', stopVersionCheck);
    };
  }, [enabled, duration]);

  return {
    loading,
    isLatestVersion,
    emptyCacheStorage,
  } as Result;
};
