import React from "react";
import { CommandGroup, CommandItem } from "../command";
import { useSelectContext } from "./SelectContext";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface OperateProps
  extends React.ComponentPropsWithoutRef<typeof CommandGroup> {}

const Operate = React.forwardRef<HTMLDivElement, OperateProps>(
  ({ className, ...props }, ref) => {
    const { selectedValues, handleClear, setIsPopoverOpen } =
      useSelectContext();
    const { t } = useTranslation();
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
                {t("i18n_Clear")}
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
            {t("i18n_Close")}
          </CommandItem>
        </div>
      </CommandGroup>
    );
  }
);
Operate.displayName = "Operate";
export { Operate };
