import { FC, PropsWithChildren, useEffect, useRef } from "react";
import { AppInfoState } from "./type";
import { DeepPartial } from "utility-types";
import { isNil } from "lodash";
import { createAppStore } from "./store";
import type { AppStoreType } from "./store";
import { AppInfoContext } from "./constant";
import { StorageType, Storage } from "../hooks/useStorage.type";
export const AppInfoStore: FC<
  PropsWithChildren<DeepPartial<AppInfoState> & { storageArea?: StorageType }>
> = ({ children, ...props }) => {
  const { storageArea = "local" } = props;
  const appStoreRef = useRef<AppStoreType | null>(null);

  if (isNil(appStoreRef.current)) {
    (appStoreRef as any).current = createAppStore(props);
  }

  useEffect(() => {
    appStoreRef.current?.getState()?.loadAppInfo(Storage.LOCAL);
  }, [storageArea]);

  return (
    <AppInfoContext.Provider value={appStoreRef.current}>
      {children}
    </AppInfoContext.Provider>
  );
};
