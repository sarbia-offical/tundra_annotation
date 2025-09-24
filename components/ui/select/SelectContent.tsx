import React from "react";
import { useSelectContext } from "./SelectContext";
import { SelectItem } from "./SelectItem";
import { SelectInput } from "./SelectInput";
import { Operate } from "./Operate";
import { PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandSeparator,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { SelectGroupConfig, SelectOptionConfig } from "./SelectTypes";
import { Check } from "lucide-react";

interface SelectContentProps extends React.ComponentProps<"div"> {
  className?: string;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className }, ref) => {
    const {
      searchValue,
      listboxId,
      selectedValues,
      emptyIndicator,
      screenSize,
      popoverClassName,
      selectType,
      hideSelectAll,
      filteredOptions,
      isGroupedOptions,
      toggleAll,
      getAllOptions,
      setIsPopoverOpen,
      getWidthConstraints,
    } = useSelectContext();
    const effectiveHideSelectAll =
      selectType === "single" ? true : hideSelectAll;

    const widthConstraints = getWidthConstraints();

    return (
      <PopoverContent
        ref={ref}
        id={listboxId}
        role="listbox"
        aria-multiselectable="true"
        aria-label="可用选项"
        className={cn(
          className,
          "w-auto p-0",
          screenSize === "mobile" && "w-[85vw] max-w-[300px]",
          screenSize === "tablet" && "w-[70vw] max-w-md",
          screenSize === "desktop" && "min-w-[300px]",
          popoverClassName
        )}
        style={{
          maxWidth: `min(${widthConstraints.maxWidth}, 85vw)`,
          maxHeight: screenSize === "mobile" ? "70vh" : "60vh",
          touchAction: "manipulation",
        }}
        align="start"
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Command shouldFilter={false} className="dark:bg-neutral-900">
          <SelectInput />
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-center text-sm">
              {emptyIndicator || "未找到结果。"}
            </div>
          ) : (
            <CommandList
              className={cn(
                "max-h-[40vh] overflow-y-auto multiselect-scrollbar",
                screenSize === "mobile" && "max-h-[50vh]",
                "overscroll-behavior-y-contain"
              )}
            >
              {/* 选择全部*/}
              {!effectiveHideSelectAll && !searchValue && (
                <CommandGroup>
                  <CommandItem
                    key="all"
                    onSelect={toggleAll}
                    role="option"
                    aria-selected={
                      selectedValues.length ===
                      getAllOptions().filter((opt) => !opt.disabled).length
                    }
                    aria-label={`选择全部 ${getAllOptions().length} 个选项`}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValues.length ===
                          getAllOptions().filter((opt) => !opt.disabled).length
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                      aria-hidden="true"
                    >
                      <Check className="h-4 w-4 text-background" />
                    </div>
                    <span>
                      (选择全部
                      {getAllOptions().length > 20
                        ? ` - ${getAllOptions().length} 个选项`
                        : ""}
                      )
                    </span>
                  </CommandItem>
                </CommandGroup>
              )}
              {/* 分组列表 */}
              {isGroupedOptions(filteredOptions) ? (
                filteredOptions.map((group) => (
                  <CommandGroup key={group.heading} heading={group.heading}>
                    {group.options.map((option) => (
                      <SelectItem key={option.label} option={option} />
                    ))}
                  </CommandGroup>
                ))
              ) : (
                // 单航列表
                <CommandGroup>
                  {(filteredOptions as SelectOptionConfig[]).map((option) => {
                    return <SelectItem key={option.label} option={option} />;
                  })}
                </CommandGroup>
              )}
              <CommandSeparator />
              <Operate />
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    );
  }
);
SelectContent.displayName = "SelectContent";
export { SelectContent };
