import { cn } from "@/lib/utils";
import {
  options,
  STATUS,
  THEME,
  SYSTEM_LANGUAGE,
  FONT_DISPLAY,
  UNDERLINE_DISPLAY,
} from "@/constant/options";
import { Select } from "@/components/ui/select/index";
import { Switch } from "@/components/ui/switch/index";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, MousePointerClick } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import React, { useEffect, useMemo } from "react";
import { SwitchType } from "@/components/ui/switch/SwitchTypes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { createConfig } from "@/constant/model";
import {
  useConfig,
  useUpdateConfig,
  useConfigInitialized,
} from "@/store/configStore";

interface SettingsProps extends React.ComponentProps<"div"> {
  className?: string;
}

type FormValues = {
  status: string;
  theme: string;
  fontDisplay: string;
  underlineDisplay: string[];
  systemLanguage: string;
};

const Settings = ({ className, children }: SettingsProps) => {
  const { t } = useTranslation();
  const configState = useConfig();
  const updateConfig = useUpdateConfig();
  const isInitialized = useConfigInitialized();
  const defaultValues = useMemo(() => createConfig(), []);

  const FormSchema = z.object({
    status: z
      .string()
      .min(1, t("i18n_Empty_Message", { field: t("i18n_Plugin_Status") })),
    theme: z
      .string()
      .min(1, t("i18n_Empty_Message", { field: t("i18n_Theme") })),
    fontDisplay: z
      .string()
      .min(1, t("i18n_Empty_Message", { field: t("i18n_Text_Style") })),
    underlineDisplay: z
      .array(z.string())
      .min(1, t("i18n_Empty_Message", { field: t("i18n_Underline_Style") })),
    systemLanguage: z
      .string()
      .min(1, t("i18n_Empty_Message", { field: t("i18n_System_Language") })),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: defaultValues,
    resolver: zodResolver(FormSchema),
  });

  // 当配置初始化完成后，用实际的配置值重置表单
  // 监听 configState 变化，当 storage 被手动修改时也能更新表单
  useEffect(() => {
    if (isInitialized && configState) {
      const newFormValues = {
        status: configState.status,
        theme: configState.theme,
        fontDisplay: configState.fontDisplay || defaultValues.fontDisplay,
        underlineDisplay:
          configState.underlineDisplay || defaultValues.underlineDisplay,
        systemLanguage:
          configState.systemLanguage || defaultValues.systemLanguage,
      };

      // 只在值真正改变时才重置表单，避免不必要的渲染
      const currentValues = form.getValues();
      const hasChanged =
        currentValues.status !== newFormValues.status ||
        currentValues.theme !== newFormValues.theme ||
        currentValues.fontDisplay !== newFormValues.fontDisplay ||
        currentValues.systemLanguage !== newFormValues.systemLanguage ||
        JSON.stringify(currentValues.underlineDisplay) !==
          JSON.stringify(newFormValues.underlineDisplay);

      if (hasChanged) {
        form.reset(newFormValues);
      }
    }
  }, [isInitialized, configState]); // 监听 configState 变化

  const onSubmit = (data: FormValues) => {
    updateConfig(data);
    toast.success(t("i18n_Submit_Message"));
  };

  const handleReset = () => {
    // 重置为默认配置
    const resetConfig = createConfig();
    form.reset({
      status: resetConfig.status,
      theme: resetConfig.theme,
      fontDisplay: resetConfig.fontDisplay,
      underlineDisplay: resetConfig.underlineDisplay,
      systemLanguage: resetConfig.systemLanguage,
    });

    // 更新到 storage
    updateConfig(resetConfig);

    toast.success(t("i18n_Reset") + " " + t("i18n_Submit_Message"));
  };
  return (
    <div className={cn("text-foreground", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>{t("i18n_Plugin_Status")}</FormLabel>
                <FormControl>
                  <Switch
                    options={options.STATUS}
                    defaultValue={field.value}
                    onValueChange={(value: string) => {
                      const status = value as STATUS;
                      console.log("status", status);
                      field.onChange(value);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    switchType={SwitchType.Horizontal}
                  />
                </FormControl>
                <FormMessage className="animate-shake text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>{t("i18n_Theme")}</FormLabel>
                <FormControl>
                  <Select
                    options={options.THEME}
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={(value: string[]) => {
                      const theme =
                        value.length > 0 ? (value[0] as THEME) : null;
                      console.log(theme);
                      field.onChange(theme);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                    deleteAll={false}
                  />
                </FormControl>
                <FormMessage className="animate-shake text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="systemLanguage"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>{t("i18n_System_Language")}</FormLabel>
                <FormControl>
                  <Select
                    options={options.SYSTEM_LANGUAGE}
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={(value: string[]) => {
                      const systemLanguage =
                        value.length > 0 ? (value[0] as SYSTEM_LANGUAGE) : null;
                      console.log("systemLanguage", systemLanguage);
                      field.onChange(systemLanguage);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                    deleteAll={false}
                  />
                </FormControl>
                <FormMessage className="animate-shake text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fontDisplay"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>{t("i18n_Text_Style")}</FormLabel>
                <FormControl>
                  <Select
                    options={options.FONT_DISPLAY}
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={(value: string[]) => {
                      const fontDisplay =
                        value.length > 0 ? (value[0] as FONT_DISPLAY) : null;
                      console.log("fontDisplay", fontDisplay);
                      field.onChange(fontDisplay);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                    deleteAll={false}
                  />
                </FormControl>
                <FormMessage className="animate-shake text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="underlineDisplay"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>{t("i18n_Underline_Style")}</FormLabel>
                <FormControl>
                  <Select
                    options={options.UNDERLINE_DISPLAY}
                    selectType="multiple"
                    defaultValue={field.value}
                    onValueChange={(value: string[]) => {
                      const underlineDisplay = value as UNDERLINE_DISPLAY[];
                      console.log("underlineDisplay", underlineDisplay);
                      field.onChange(underlineDisplay);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                    deleteAll={false}
                  />
                </FormControl>
                <FormMessage className="animate-shake text-red-500" />
              </FormItem>
            )}
          />
          <Separator orientation={"horizontal"} className="mb-4" />
          <div className="flex gap-2">
            <Button className="flex-1" type="submit">
              <MousePointerClick className="mr-2" />
              {t("i18n_Submit")}
            </Button>
            <Button
              className="flex-1"
              variant={"outline"}
              type="reset"
              onClick={handleReset}
            >
              <RotateCcw className="mr-2" />
              {t("i18n_Reset")}
            </Button>
          </div>
        </form>
      </Form>
      <Toaster richColors position="top-center" duration={1000} />
      {children ? children : <></>}
    </div>
  );
};
Settings.displayName = "Settings";

export default Settings;
