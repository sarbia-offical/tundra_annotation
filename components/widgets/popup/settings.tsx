import { cn } from "@/lib/utils";
import { options, defaultOptions } from "@/constant/options";
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
import { useDisplaySettings, useTheme } from "@/store/store.hooks";

interface SettingsProps extends React.ComponentProps<"div"> {
  className?: string;
}

type FormValues = {
  status: string;
  theme: string;
  to: string;
  fontDisplay: string;
  underlineDisplay: string;
  translationServices: string;
  systemLanguage: string;
};

const Settings = ({ className, children }: SettingsProps) => {
  const { t } = useTranslation();
  const { defaultConfiguration, isInitialized } = useDisplaySettings();
  const defaultValues = useMemo(
    () => defaultConfiguration,
    [defaultConfiguration]
  );

  const form = useForm<FormValues>({
    defaultValues: defaultValues,
  });

  const onSubmit = (data: FormValues) => {
    console.log("data", data);
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
                    onValueChange={field.onChange}
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
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
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
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translationServices"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>{t("i18n_Translation_Service")}</FormLabel>
                <FormControl>
                  <Select
                    options={options.TRANSLATION_SERVICES}
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel>{t("i18n_Target")}</FormLabel>
                <FormControl>
                  <Select
                    options={options.TO}
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
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
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
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
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "bounce",
                    }}
                    searchable={false}
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
              variant={"outline"}
              className="flex-1"
              type="reset"
              onClick={() => {
                form.reset(defaultValues);
              }}
            >
              <RotateCcw className="mr-2" />
              {t("i18n_Reset")}
            </Button>
          </div>
        </form>
      </Form>
      {children ? children : <></>}
    </div>
  );
};
Settings.displayName = "Settings";

export default Settings;
