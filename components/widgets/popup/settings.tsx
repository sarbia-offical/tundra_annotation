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

interface SettingsProps extends React.ComponentProps<"div"> {
  className?: string;
}

type FormValues = {
  status: string;
  theme: string;
  to: string;
  font_display: string;
  underline_display: string;
};

const Settings = ({ className, children }: SettingsProps) => {
  const { t } = useTranslation();
  const defaultValues = {
    status: defaultOptions.STATUS,
    theme: defaultOptions.THEME,
    to: defaultOptions.TO,
    font_display: defaultOptions.FONT_DISPLAY,
    underline_display: defaultOptions.UNDERLINE_DISPLAY,
  };
  const form = useForm<FormValues>({
    defaultValues: defaultValues,
  });
  const onSubmit = (data: FormValues) => {
    console.log("data", data);
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="font_display"
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="underline_display"
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
