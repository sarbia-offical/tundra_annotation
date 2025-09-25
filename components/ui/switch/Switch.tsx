import React from "react";
import { SwitchProps, SwitchRef } from "./SwitchTypes";
import { SwitchProvider } from "./SwitchContext";
import { SwitchContainer } from "./SwitchContainer";
const Switch = React.forwardRef<SwitchRef, SwitchProps>((props, ref) => {
  const providerValue = React.useMemo(
    () => props,
    [props.defaultValue, props.options, props.switchType]
  );
  return (
    <SwitchProvider value={providerValue}>
      <SwitchContainer ref={ref}></SwitchContainer>
    </SwitchProvider>
  );
});
Switch.displayName = "Switch";
export { Switch };
