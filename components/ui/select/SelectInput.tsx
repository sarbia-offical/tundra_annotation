import { CommandInput } from "@/components/ui/command";
import React from "react";
import { useSelectContext } from "./SelectContext";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

interface SelectInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandInput> {
  wait?: number;
}
const SelectInput = React.forwardRef<HTMLInputElement, SelectInputProps>(
  ({ className, wait = 50, ...props }, ref) => {
    const {
      searchable,
      selectedValues,
      searchValue,
      setSearchValue,
      setIsPopoverOpen,
      setSelectedValues,
      onValueChange,
    } = useSelectContext();

    const handleInputKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          setIsPopoverOpen(true);
        } else if (event.key === "Backspace" && !event.currentTarget.value) {
          const newSelectedValues = [...selectedValues];
          newSelectedValues.pop();
          setSelectedValues(newSelectedValues);
          onValueChange(newSelectedValues);
        }
      },
      [selectedValues]
    );

    const debouncedSetSearchValue = React.useMemo(
      () => debounce((value: string) => setSearchValue(value), wait),
      []
    );

    const handleValueChange = React.useCallback(
      (search: string) => {
        debouncedSetSearchValue(search);
      },
      [debouncedSetSearchValue]
    );

    return (
      <>
        {searchable ? (
          <CommandInput
            ref={ref}
            className={cn(className)}
            placeholder="搜索选项..."
            onKeyDown={handleInputKeyDown}
            value={searchValue}
            onValueChange={handleValueChange}
            aria-label="搜索可用选项"
            {...props}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
);
SelectInput.displayName = "SelectInput";
export { SelectInput };
