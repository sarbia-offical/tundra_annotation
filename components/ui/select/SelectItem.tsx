import React from "react";
import { CommandItem } from "@/components/ui/command";
import { SelectOptionConfig } from "./SelectTypes";
import { useSelectContext } from "./SelectContext";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SelectItemProps extends React.ComponentProps<"div"> {
  className?: string;
  option: SelectOptionConfig;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, option }, ref) => {
    const { selectedValues, toggleOption } = useSelectContext();
    const isSelected = selectedValues.includes(option.value);
    const { t } = useTranslation();
    return (
      <CommandItem
        key={option.value}
        onSelect={() => toggleOption(option.value)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={option.disabled}
        aria-label={`${option.label}${isSelected ? ", 已选择" : ", 未选择"}${
          option.disabled ? ", 已禁用" : ""
        }`}
        className={cn(
          className,
          "cursor-pointer",
          option.disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={option.disabled}
      >
        <div
          className={cn(
            "mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary",
            isSelected
              ? "bg-primary text-primary-foreground"
              : "opacity-50 [&_svg]:invisible"
          )}
          aria-hidden="true"
        >
          <Check className="h-4 w-4 text-background" />
        </div>
        <span>{t(option.label)}</span>
      </CommandItem>
    );
  }
);
SelectItem.displayName = "SelectItem";
export { SelectItem };
