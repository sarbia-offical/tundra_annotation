import { Annotate } from "@/services/api.type";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { ChatBubble } from "@/components/chatBubble";
import { AnnomationTimeStamp } from "./AnnomationTimeStamp";
import { AnnotationId } from "./AnnotationId";
import { AnnotationIcon } from "./AnnotationIcon";
import { AnnotationSetting } from "./AnnotationSetting";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import moment from "moment";
import { useAnnotateContext } from "../App/AppContext";
import { useScrollToAnnotation } from "../Hooks/useScrollToAnnotation";
import { useMarkContext } from "../state/hooks";
import { MarkState } from "../state/type";

export interface MentionItemProps {
  children: React.ReactNode;
  value: Annotate;
  className?: string;
}

export const MentionItem: React.FC<MentionItemProps> = ({
  className = "",
  value,
}) => {
  const [durtaion, setDurtaion] = useState<boolean>(true);
  const { openEditor } = useAnnotateContext();
  const { scrollToAnnotation } = useScrollToAnnotation();
  const markState = useMarkContext((state: MarkState) => ({
    changeColor: state.changeColor,
  }));
  useEffect(() => {
    const timer = setTimeout(() => setDurtaion(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const notes = value?.data?.notes ?? [];
  return (
    <div
      className={`p-2 mt-2 rounded-md transition-all duration-300 border-[#eeeeee] dark:border-[#222226] border-[1px] border-solid hover:bg-[#f7f7f7] dark:hover:bg-[#222226] ${className}`}
      mention-item-id={value.uid}
    >
      {durtaion ? (
        <SkeletonLoader visible={durtaion} />
      ) : (
        <>
          <div className="h-10 flex items-start justify-center mb-3">
            <AnnotationIcon value={value} />
            <div className="h-full flex flex-col justify-between ml-2 flex-1 relative">
              <AnnotationId value={value} />
              <AnnomationTimeStamp timeStamp={value.createDate} />
              <AnnotationSetting
                value={value}
                changeItem={() => {
                  const { uid, color } = value;
                  openEditor(uid);
                  scrollToAnnotation(uid);
                  markState.changeColor(color);
                }}
              />
            </div>
          </div>
          {!isEmpty(value.text) ? (
            <div
              className="mt-1 text-sm text-[#999999] dark:text-[#999999] cursor-default italic"
              style={{ textIndent: "2em" }}
            >
              {value.text}
            </div>
          ) : (
            <></>
          )}
          {!isEmpty(notes) && !!notes.length ? (
            notes.map((ele, index) => (
              <ChatBubble
                key={index}
                message={{
                  content: ele.text,
                  sender: ele.isMe ? "me" : "other",
                  time: moment(ele.date).format("DD MMM YYYY [at] hh:mm"),
                }}
                className={"mt-2 cursor-default"}
              />
            ))
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};
