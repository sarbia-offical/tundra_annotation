import React from "react";
import { SwitchProps, SwitchRef } from "./SwitchTypes";
import { SwitchProvider } from "./SwitchContext";
import { SwitchContainer } from "./SwitchContainer";
const Switch = React.forwardRef<SwitchRef, SwitchProps>((props, ref) => {
  return (
    <SwitchProvider value={props}>
      <SwitchContainer ref={ref}></SwitchContainer>
    </SwitchProvider>
  );
});
Switch.displayName = "Switch";
export { Switch };
