import { TFunction } from "i18next";
import { z, ZodType } from "zod";
import { i18nParse } from "@/lib/Utils";
// 密码校验规则类型
type PasswordRule = {
  validate: (value: string) => boolean;
  message: string;
  value?: string[]; // 可选的值，用于某些规则（如最小字符数）
};

// 默认规则配置
const defaultPasswordRules: PasswordRule[] = [
  {
    validate: (val: string) => /[A-Z]/.test(val),
    message: "passwordRuleUppercase",
    value: ["1"],
  },
  {
    validate: (val: string) => /[a-z]/.test(val),
    message: "passwordRuleLowercase",
    value: ["1"],
  },
  {
    validate: (val: string) => /[0-9]/.test(val),
    message: "passwordRuleNumber",
    value: ["1"],
  },
  {
    validate: (val: string) =>
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val),
    message: "passwordRuleSpecial",
    value: ["1"],
  },
];

/**
 * 创建校验 Schema
 * @param rules 自定义规则数组（可选）
 * @param minLength 最小长度（默认8）
 * @param t i18next 的 TFunction 用于国际化
 * @returns ZodType 校验 schema
 */
export function createPasswordSchema(
  t: TFunction<string, string[]>,
  minLength: number = 8,
  rules?: PasswordRule[]
): ZodType<string> {
  console.log("TFunction", t("reset"));
  // 使用传入规则或默认规则
  const activeRules = rules ?? defaultPasswordRules;
  return z
    .string()
    .min(minLength, i18nParse(t("passwordRuleMinLength"), [String(minLength)]))
    .superRefine((value, ctx) => {
      // 检查所有规则
      let allValid = true;

      activeRules.forEach((rule, index) => {
        if (!rule.validate(value)) {
          allValid = false;
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: i18nParse(t(rule.message), rule.value || []),
            path: [`rule_${index}`],
          });
        }
      });
      return allValid;
    });
}
