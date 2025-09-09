import React from "react";
import { useTranslation } from "react-i18next";

const Header = ({ headTitle }: { headTitle: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-start w-full border-b-[1px] p-4 text-card-foreground text-base items-center">
      {t(headTitle)}
    </div>
  );
};

export default Header;
