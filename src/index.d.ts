import * as React from 'react';
declare const defaultProps: Partial<{
  duration: number;
  auto: boolean;
  storageKey: string;
  basePath: string;
}>;
declare type OwnProps = {
  children?: any;
} & typeof defaultProps;
export declare const useClearCache: (
  props?: OwnProps
) => Partial<{
  loading: boolean;
  isLatestVersion: boolean;
  emptyCacheStorage: (version?: string) => Promise<void>;
  latestVersion: string;
}>;
declare const ClearCache: React.FC<OwnProps>;
export default ClearCache;
