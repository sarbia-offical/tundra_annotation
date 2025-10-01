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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import React from "react";
import { SwitchType } from "@/components/ui/switch/SwitchTypes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useDisplaySettings } from "@/store/store.hooks";

interface SettingsProps extends React.ComponentProps<"div"> {
  className?: string;
}

type FormValues = {
  status: string;
  theme: string;
  fontDisplay: string;
  underlineDisplay: string;
  systemLanguage: string;
};

const Settings = ({ className, children }: SettingsProps) => {
  const { t } = useTranslation();
  const {
    defaultConfiguration,
    isInitialized,
    initialConfiguration,
    setStatus,
    setTheme,
    setSystemLanguage,
    setFontDisplay,
    setUnderlineDisplay,
    resetStorage,
    updateStorage,
  } = useDisplaySettings();

  const defaultValues = useMemo(
    () => defaultConfiguration,
    [defaultConfiguration]
  );

  const form = useForm<FormValues>({
    defaultValues: defaultValues,
  });
  const onSubmit = (data: FormValues) => {
    toast.success(t("i18n_Submit_Message"));
    updateStorage({
      ...initialConfiguration,
      ...data,
    });
  };
  useEffect(() => {
    if (isInitialized) {
      form.reset(defaultValues);
    }
  }, [isInitialized, defaultValues]);
  if (!isInitialized) {
    return (
      <div
        className={cn(
          "text-foreground flex items-center justify-center h-40",
          className
        )}
      >
        <div>{t("i18n_Loading")}...</div>
      </div>
    );
  }
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
                      setStatus(value as STATUS);
                      field.onChange(value);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    switchType={SwitchType.Horizontal}
                  />
                </FormControl>
                <FormMessage />
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
                      setTheme(value[0] as THEME);
                      field.onChange(value);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                    deleteAll={false}
                  />
                </FormControl>
                <FormMessage />
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
                      setSystemLanguage(value[0] as SYSTEM_LANGUAGE);
                      field.onChange(value);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                    deleteAll={false}
                  />
                </FormControl>
                <FormMessage />
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
                      setFontDisplay(value[0] as FONT_DISPLAY);
                      field.onChange(value);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                    deleteAll={false}
                  />
                </FormControl>
                <FormMessage />
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
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={(value: string[]) => {
                      setUnderlineDisplay(value[0] as UNDERLINE_DISPLAY);
                      field.onChange(value);
                    }}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                    deleteAll={false}
                  />
                </FormControl>
                <FormMessage />
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
              onClick={() => {
                if (initialConfiguration) {
                  resetStorage(initialConfiguration);
                }
              }}
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
