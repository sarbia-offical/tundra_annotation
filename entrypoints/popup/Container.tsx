import { useDisplaySettings } from "@/store/store.hooks";
import React from "react";
import { useTranslation } from "react-i18next";
import "@/assets/tailwind.css";

interface ContainerProps {
  children: React.ReactNode;
}
const Container: React.FC<ContainerProps> = ({ children }) => {
  const { defaultConfiguration } = useDisplaySettings();
  const { theme, systemLanguage } = defaultConfiguration;
  const { i18n } = useTranslation();
  useEffect(() => {
    const callback = async () => {
      await i18n.changeLanguage(systemLanguage);
    };
    callback();
  }, [systemLanguage]);

  return <div className={theme === "dark" ? "dark" : ""}>{children}</div>;
};
Container.displayName = "Container";
export { Container };
