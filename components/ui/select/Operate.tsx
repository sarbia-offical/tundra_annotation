import React from "react";
import { CommandGroup, CommandItem } from "../command";
import { useSelectContext } from "./SelectContext";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface OperateProps
  extends React.ComponentPropsWithoutRef<typeof CommandGroup> {}

const Operate = React.forwardRef<HTMLDivElement, OperateProps>(
  ({ className, ...props }, ref) => {
    const { selectedValues, handleClear, setIsPopoverOpen } =
      useSelectContext();
    return (
      <CommandGroup>
        <div
          className={cn(className, "flex items-center justify-between")}
          ref={ref}
          {...props}
        >
          {selectedValues.length > 0 && (
            <>
              <CommandItem
                role="option"
                onSelect={handleClear}
                className="flex-1 justify-center cursor-pointer"
              >
                清除
              </CommandItem>
              <Separator
                orientation="vertical"
                className="flex min-h-6 h-full"
              />
            </>
          )}
          <CommandItem
            role="option"
            onSelect={() => setIsPopoverOpen(false)}
            className="flex-1 justify-center cursor-pointer max-w-full"
          >
            关闭
          </CommandItem>
        </div>
      </CommandGroup>
    );
  }
);
Operate.displayName = "Operate";
export { Operate };
