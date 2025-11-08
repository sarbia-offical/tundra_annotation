import React from "react";
import { useTranslation } from "react-i18next";
import "@/assets/tailwind.css";
import { useConfigEffect } from "@/store/configStore/useConfigEffect";

interface ContainerProps {
  children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
  // 使用普通模式监听配置变化（仅初始化时生效）
  useConfigEffect(false);
  return <div>{children}</div>;
};
Container.displayName = "Container";
export { Container };
