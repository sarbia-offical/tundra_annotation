import { PropsWithChildren, FC, useRef } from "react";
import { MarkContext } from "./constant";
import { createMarkStore, MarkStoreType } from "./store";
import { isNil } from "lodash";
import { DeepPartial } from "utility-types";
import { MarkState } from "./type";
export const MarkStore: FC<PropsWithChildren<DeepPartial<MarkState>>> = ({
  children,
  ...props
}) => {
  const markStoreRef = useRef<MarkStoreType | null>(null);
  if (isNil(markStoreRef.current)) {
    markStoreRef.current = createMarkStore(props);
  }
  return (
    <MarkContext.Provider value={markStoreRef.current}>
      {children}
    </MarkContext.Provider>
  );
};
