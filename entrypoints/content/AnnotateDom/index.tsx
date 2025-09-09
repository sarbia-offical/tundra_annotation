import { useAppInconContext } from "@/state/hooks";
import { AppInfoState } from "@/state/type";
import ColorSelector from "./ColorSelector";
import { useTranslation } from "react-i18next";
import { useMarkContext } from "../state/hooks";
import { MarkState } from "../state/type";
import "@/assets/main.css";
import "./index.css";

const AnnotateDom = () => {
  const { t } = useTranslation();
  const theme = useAppInconContext((state: AppInfoState) => state.theme);
  const position = useMarkContext((state: MarkState) => state.popoverPos);
  const popoverVisible = useMarkContext(
    (state: MarkState) => state.popoverVisible
  );
  return popoverVisible ? (
    <div className={theme === "dark" ? "dark" : "light"}>
      <div
        className={`absolute flex items-center flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-5
        z-[9999] shadow-2xl
        rounded-lg annotate_bg`}
        style={{
          left: position?.x || "50%",
          top: position?.y || "50%",
        }}
      >
        <div className="px-1.5 py-1.5">
          <ColorSelector />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
export default AnnotateDom;
