import React from "react";
import { SelectRef, SelectProps } from "./SelectTypes";
import { useSelect } from "./useSelect";
import { SelectProvider } from "./SelectContext";
import { SelectTrigger } from "./SelectTrigger";
import { SelectContent } from "./SelectContent";
import { Popover } from "@/components/ui/popover";
import { useTranslation } from "react-i18next";

const Select = React.forwardRef<SelectRef, SelectProps>((props, ref) => {
  const [politeMessage, setPoliteMessage] = React.useState("");
  const contextValue = useSelect(props);
  const { t } = useTranslation();
  const {
    selectedValues,
    isPopoverOpen,
    isSingleSelect,
    triggerDescriptionId,
    selectedCountId,
    modalPopover,
    getOptionByValue,
    setSelectedValues,
    setIsPopoverOpen,
    handleClear,
    onValueChange,
  } = contextValue;

  const announce = React.useCallback((message: string) => {
    setPoliteMessage(message);
    setTimeout(() => {
      setPoliteMessage("");
    }, 2000);
  }, []);
  React.useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        if (props.selectType === "multiple") {
          contextValue.setSelectedValues(props.defaultValue ?? []);
        } else {
          contextValue.setSelectedValues(
            props.defaultValue ? [props.defaultValue] : []
          );
        }
      },
      getSelectedValues: () => selectedValues,
      open: () => setIsPopoverOpen(true),
      close: () => setIsPopoverOpen(false),
      clear: () => handleClear(),
      setSelectedValues: (values: string[]) => {
        setSelectedValues(values);
        onValueChange(values);
      },
    }),
    [contextValue, props.defaultValue]
  );
  useEffect(() => {
    const selectedCount = selectedValues.length;
    announce(t("i18n_Selected_Message", { num: selectedCount }));
  }, [selectedValues]);
  return (
    <SelectProvider value={contextValue}>
      <div className="sr-only">
        <div aria-live="polite" aria-atomic="true" role="status">
          {politeMessage}
        </div>
      </div>
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <div id={triggerDescriptionId} className="sr-only">
          {isSingleSelect
            ? "单选下拉框。使用方向键导航，Enter 键选择，Escape 键关闭。"
            : "多选下拉框。使用方向键导航，Enter 键选择，Escape 键关闭。"}
        </div>
        <div id={selectedCountId} className="sr-only" aria-live="polite">
          {selectedValues.length === 0
            ? "未选择任何选项"
            : `已选择 ${selectedValues.length} 个选项: ${selectedValues
                .map((value) => getOptionByValue(value)?.label)
                .filter(Boolean)
                .join(", ")}`}
        </div>
        <SelectTrigger />
        <SelectContent />
      </Popover>
    </SelectProvider>
  );
});
Select.displayName = "Select";
export { Select };
