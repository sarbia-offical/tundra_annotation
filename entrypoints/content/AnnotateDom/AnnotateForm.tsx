import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { i18nParse } from "@/lib/Utils";
import avatar from "@/assets/avatar.jpg";

export interface AnnotateFormValue {
  annotate: string;
}

export interface AnnotateFormRef {
  // 暴露表单提交方法
  submitForm: () => void;
  // 暴露获取表单值方法
  getFormValues: () => AnnotateFormValue;
  resetFormValues: () => void;
}

interface AnnotateFormProps {
  // 添加提交成功回调
  onSubmitSuccess?: (values: AnnotateFormValue) => void;
}

export const AnnotateForm = forwardRef<AnnotateFormRef, AnnotateFormProps>(
  ({ onSubmitSuccess }, ref) => {
    const { t } = useTranslation();
    const FormSchema = z.object({
      annotate: z.string().min(1, {
        message: i18nParse(t("veificationMessage"), [t("note"), "1"]),
      }),
    });

    const form = useForm<AnnotateFormValue>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        annotate: "",
      },
      mode: "onSubmit",
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
      // 调用提交成功回调
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
        form.reset();
      }
    }

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.handleSubmit(onSubmit)();
      },
      getFormValues: () => {
        return form.getValues();
      },
      resetFormValues: () => {
        form.reset();
      },
    }));

    return (
      <div className="flex items-start border-t-[#E3E5E7] dark:border-t-[#222226] border-t-[1px] border-solid pt-5">
        <div
          className={`w-10 h-10 flex justify-center items-center rounded-full cursor-pointer hover:animate-wobble origin-bottom`}
        >
          <picture className="w-full h-full inline-block rounded-full active:scale-90 duration-75">
            <source srcSet={avatar} type="image/avif"></source>
            <img src={avatar} className="rounded-full w-full h-full" />
          </picture>
        </div>
        <div className="flex-1 ml-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="annotate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder={t("annotatePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    );
  }
);

// 设置显示名称
AnnotateForm.displayName = "AnnotateForm";
