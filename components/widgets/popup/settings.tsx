import { cn } from "@/lib/utils";
import { options, defaultOptions } from "@/constant/options";
import { Select } from "@/components/ui/select/index";
import { Switch } from "@/components/ui/switch/index";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import React from "react";

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
  const form = useForm<FormValues>({
    defaultValues: {
      status: defaultOptions.STATUS,
      theme: defaultOptions.THEME,
      to: defaultOptions.TO,
      font_display: defaultOptions.FONT_DISPLAY,
      underline_display: defaultOptions.UNDERLINE_DISPLAY,
    },
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
                <FormLabel>插件状态</FormLabel>
                <FormControl>
                  <Switch
                    options={options.STATUS}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "wiggle",
                    }}
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
                <FormLabel>主题</FormLabel>
                <FormControl>
                  <Select
                    options={options.THEME}
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "wiggle",
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
                <FormLabel>目标语言</FormLabel>
                <FormControl>
                  <Select
                    options={options.TO}
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "wiggle",
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
                <FormLabel>文字展示</FormLabel>
                <FormControl>
                  <Select
                    options={options.FONT_DISPLAY}
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "wiggle",
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
              <FormItem>
                <FormLabel>下划线展示</FormLabel>
                <FormControl>
                  <Select
                    options={options.UNDERLINE_DISPLAY}
                    selectType="single"
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    animationConfig={{
                      badgeAnimation: "wiggle",
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {children ? children : <></>}
    </div>
  );
};
Settings.displayName = "Settings";

export default Settings;
