// form.tsx
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/Utils";
import { Label } from "@/components/ui/label";
import { omit } from "lodash";

// 1. 表单容器 - 提供全局上下文
const Form = FormProvider;

// 2. 表单字段上下文
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

// 3. 表单项上下文
type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

// 4. 表单字段组件（支持实时校验）
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

// 5. 基础表单字段钩子（不含错误状态）
const useBaseFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error("useBaseFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
  };
};

// 6. 增强的表单字段错误钩子
const useFormFieldError = () => {
  const { name } = React.useContext(FormFieldContext);
  const { errors } = useFormState(); // 使用 useFormState 获取实时状态
  const error = errors[name];

  // 添加额外的状态跟踪字段值变化
  const [lastValue, setLastValue] = React.useState("");
  const { watch } = useFormContext();
  const currentValue = watch(name);

  // 当值变化时更新状态
  React.useEffect(() => {
    if (currentValue !== lastValue) {
      setLastValue(currentValue);
    }
  }, [currentValue, lastValue]);

  return {
    error,
    // 添加字段值变化状态作为依赖
    valueChanged: currentValue !== lastValue,
  };
};

// 7. 表单项容器组件
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  // 使用 useMemo 防止上下文值不必要变化
  const contextValue = React.useMemo(() => ({ id }), [id]);

  return (
    <FormItemContext.Provider value={contextValue}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

// 8. 表单标签组件（支持实时校验状态）
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { formItemId } = useBaseFormField();
  const { formState } = useFormContext();
  const { name } = React.useContext(FormFieldContext);

  // 实时检查错误状态
  const isInvalid = Boolean(formState.errors[name]);

  return (
    <Label
      ref={ref}
      className={cn(isInvalid && "text-base", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

// 9. 表单控件组件（支持实时校验）
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId } = useBaseFormField();
  const { formState } = useFormContext();
  const { name } = React.useContext(FormFieldContext);

  // 实时检查错误状态
  const isInvalid = Boolean(formState.errors[name]);

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !isInvalid
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={isInvalid}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

// 10. 表单描述组件
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useBaseFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// 11. 表单消息组件（实时错误显示）
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { formMessageId } = useBaseFormField();
  const error = useFormFieldError();
  // 收集错误消息
  const errorMessages = React.useMemo(() => {
    if (!error) return [];

    const messages: string[] = [];
    // 添加主错误消息
    if (typeof error.error?.message === "string") {
      messages.push(error.error?.message);
    }
    Object.values(omit(error?.error, ["message"]))?.forEach((element: any) => {
      if (element?.message) {
        messages.push(element?.message);
      }
    });
    return messages;
  }, [error]);

  // 实时显示错误状态
  const shouldShow = errorMessages.length > 0 || children;

  if (!shouldShow) {
    return null;
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} id={formMessageId} {...props}>
      {errorMessages.map((msg, index) => (
        <p
          key={index}
          className={cn("animate-shake text-red-500 pt-2", className)}
        >
          {msg}
        </p>
      ))}
      {children && !errorMessages.length && (
        <p className={cn("text-muted-foreground pt-2", className)}>
          {children}
        </p>
      )}
    </div>
  );
});
FormMessage.displayName = "FormMessage";

// 导出所有组件
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
