import { NoteItem } from "@/services/api.type";
import { SkeletonLoader } from "@/components/skeletonLoader";
import moment from "moment";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import avatar from "@/assets/avatar.jpg";

export interface AnnotationItemProps {
  note: NoteItem;
}
export const AnnotationItem: React.FC<AnnotationItemProps> = ({ note }) => {
  const [durtaion, setDurtaion] = useState<boolean>(true);
  useEffect(() => {
    const timer = setTimeout(() => setDurtaion(false), 200);
    return () => clearTimeout(timer);
  }, []);
  return durtaion ? (
    <SkeletonLoader visible={durtaion} />
  ) : (
    <div className="flex items-start p-2 mt-2 rounded-md transition-all duration-300 border-[#eeeeee] dark:border-[#222226] border-[1px] border-solid hover:bg-[#f7f7f7] dark:hover:bg-[#222226] cursor-pointer">
      <div
        className={`w-10 h-10 flex justify-center items-center rounded-full cursor-pointer hover:animate-wobble`}
      >
        <picture className="w-full h-full inline-block rounded-full active:scale-90 duration-75">
          <source srcSet={avatar} type="image/avif"></source>
          <img src={avatar} className="rounded-full w-full h-full" />
        </picture>
      </div>
      <div className="h-full flex flex-col justify-between ml-2 flex-1 relative">
        <div className="text-[#61666D] dark:text-[#999999] text-sm">
          <span>{note.userName}</span>
        </div>
        <div className="text-[#000000] dark:text-[#999999] text-sm mt-2">
          {note.text}
        </div>
        <div className="text-[#61666D] dark:text-[#999999] text-[11px] flex items-center mt-2">
          <Clock className="w-3 h-3 mr-1" />
          <span>{moment().format("MM/DD/YYYY")}</span>
          <span className="ml-2">{moment(note.date).fromNow()}</span>
        </div>
      </div>
    </div>
  );
};
