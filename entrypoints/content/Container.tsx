import React from "react";
import "@/assets/tailwind.css";
import { Button } from "@/components/ui/button";
import { useDisplaySettings } from "@/store/store.hooks";
import { useTranslation } from "react-i18next";
import { useSelection } from "./hooks/useSelection";
import { ColorSelectionBox } from "./components/ColorSelectionBox";

const Container: React.FC = () => {
  const { t } = useTranslation();
  const { defaultConfiguration } = useDisplaySettings();
  const { theme, systemLanguage } = defaultConfiguration;
  const { i18n } = useTranslation();
  const [startObserver] = useSelection();
  useEffect(() => {
    const callback = async () => {
      await i18n.changeLanguage(systemLanguage);
    };
    callback();
  }, [systemLanguage]);
  useEffect(() => {
    startObserver();
  }, []);
  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <Button className="flex-1" type="submit">
        {t("i18n_Submit")}
      </Button>
      <ColorSelectionBox />
    </div>
  );
};
Container.displayName = "Container";
export { Container };
