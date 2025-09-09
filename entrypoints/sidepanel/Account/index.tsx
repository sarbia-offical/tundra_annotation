import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createPasswordSchema } from "@/lib/ZodValidator";
import { useTranslation } from "react-i18next";
import { i18nParse } from "@/lib/Utils";
import { SignUpFormValue, SignUp } from "../SignUp";
import { LoginFormValue, LoginIn } from "../LoginIn";
import { Icon } from "../Icon";
import $styles from "./index.module.css";

/**
 * 忘记密码
 */
interface ForgotPasswordProps {
  children: React.ReactNode;
}
export const ForgotPassword: React.FC<ForgotPasswordProps> = (props) => {
  const { children } = props;
  return (
    <div>
      forgot password
      {children}
    </div>
  );
};

enum CardState {
  LOGIN,
  SIGNUP,
  FORGOTPASSWORD,
}
type CardStateType = CardState;

export const Account: React.FC = () => {
  const { t } = useTranslation();
  const [cardState, setCardState] = useState<CardStateType>(CardState.LOGIN);
  const FormScheam = z.object({
    username: z.string().min(2, {
      message: i18nParse(t("veificationMessage"), [t("username"), "2"]),
    }),
    password: createPasswordSchema(t),
  });
  const loginForm = useForm<LoginFormValue>({
    resolver: zodResolver(FormScheam),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const SignUpFormScheam = z.object({
    username: z.string().min(2, {
      message: i18nParse(t("veificationMessage"), [t("username"), "2"]),
    }),
    password: createPasswordSchema(t),
    email: z.string().email({
      message: t("enterEmailAddress"),
    }),
  });
  const SignUpForm = useForm<SignUpFormValue>({
    resolver: zodResolver(SignUpFormScheam),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
    mode: "onChange",
  });
  const handleLoginSubmit = (data: LoginFormValue) => {
    console.log("data", data);
  };
  const handleSignUpSubmit = (data: SignUpFormValue) => {
    console.log("data", data);
  };
  return (
    <div className="grid gap-4 h-full relative">
      <div
        className={`${$styles.card_reverse} ${
          cardState === CardState.LOGIN ? $styles.normal : $styles.reverse
        }`}
      >
        <Card className="text-card-foreground p-6 border h-full flex flex-col items-start justify-center">
          <div className="h-full w-full">
            <div className="text-card-foreground w-full flex items-center justify-center mb-4">
              <Icon title={t("loginIn")} />
            </div>
            <LoginIn onSubmit={handleLoginSubmit} form={loginForm}>
              <div className="w-full flex items-start justify-between">
                <Button
                  type="button"
                  variant={"outline"}
                  className="text-sm font-thin w-[46%]"
                  onClick={() => {
                    setCardState(CardState.SIGNUP);
                  }}
                >
                  {t("signUp")}
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  className="text-sm font-thin w-[46%]"
                  onClick={() => {
                    loginForm.reset();
                  }}
                >
                  {t("reset")}
                </Button>
              </div>
            </LoginIn>
          </div>
        </Card>
      </div>
      <div
        className={`${$styles.card_reverse} ${
          cardState === CardState.SIGNUP ? $styles.normal : $styles.reverse
        }`}
      >
        <Card className="text-card-foreground p-6 border h-full flex flex-col items-start justify-center">
          <div className="h-full w-full">
            <div className="text-card-foreground w-full flex items-center justify-center mb-4">
              <Icon title={t("signUp")} />
            </div>
            <SignUp onSubmit={handleSignUpSubmit} form={SignUpForm}>
              <div className="w-full flex items-start justify-between">
                <Button
                  type="button"
                  variant={"outline"}
                  className="text-sm font-thin w-[46%]"
                  onClick={() => {
                    setCardState(CardState.LOGIN);
                  }}
                >
                  {t("loginIn")}
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  className="text-sm font-thin w-[46%]"
                  onClick={() => {
                    SignUpForm.reset();
                  }}
                >
                  {t("reset")}
                </Button>
              </div>
            </SignUp>
          </div>
        </Card>
      </div>
    </div>
  );
};
