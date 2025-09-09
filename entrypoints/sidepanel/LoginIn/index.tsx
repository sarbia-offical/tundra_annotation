import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { i18nParse } from "@/lib/Utils";

export interface LoginFormValue {
  username: string;
  password: string;
}

/**
 * 登录组件
 */
export interface LoginProps {
  children: React.ReactNode;
  onSubmit: SubmitHandler<LoginFormValue>;
  form: UseFormReturn<LoginFormValue>;
}

export const LoginIn: React.FC<LoginProps> = (props) => {
  const { children, form } = props;
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-thin select-none">
                {t("username")}
              </FormLabel>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder={i18nParse(t("enterMessage"), [t("username")])}
                  onClear={() => {
                    form.resetField("username");
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage className="animate-shake text-red-500" />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="font-thin select-none">
                {t("password")}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  className="w-full"
                  placeholder={i18nParse(t("enterMessage"), [t("password")])}
                  onClear={() => {
                    form.resetField("password");
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage className="animate-shake text-red-500" />
            </FormItem>
          )}
        ></FormField>
        <Button type="submit" className="mt-4 w-full text-sm font-thin">
          {t("submit")}
        </Button>
        <div className="w-full flex items-center justify-center text-center pt-1 pb-1 font-thin">
          {t("or")}
        </div>
        {children}
      </form>
    </Form>
  );
};
