import type { FC, PropsWithChildren } from 'react';

declare const defaultProps: Partial<{
  duration: number;
  auto: boolean;
  storageKey: string;
  basePath: string;
}>;

declare type OwnProps = PropsWithChildren<typeof defaultProps>;

export declare const useClearCache: (props?: OwnProps) => Partial<{
  loading: boolean;
  isLatestVersion: boolean;
  emptyCacheStorage: (version?: string) => Promise<void>;
  latestVersion: string;
}>;

declare const ClearCache: FC<OwnProps>;

export default ClearCache;
