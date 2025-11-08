import { CommandInput } from "@/components/ui/command";
import React from "react";
import { useSelectContext } from "./SelectContext";
import { cn, debounce } from "@/lib/utils";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
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
            placeholder={`${t("i18n_Search_Options")}`}
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
