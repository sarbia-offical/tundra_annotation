import React from "react";
import { Clock } from "lucide-react";
import moment from "moment";

interface AnnomationTimeStampProps {
  timeStamp: number;
}
export const AnnomationTimeStamp: React.FC<AnnomationTimeStampProps> = ({
  timeStamp,
}) => {
  return (
    <div className="flex items-center text-[10px] font-bold text-slate-500 dark:text-slate-300">
      <Clock className="w-3 h-3 mr-1" />
      {moment(timeStamp).format("DD MMM YYYY [at] hh:mm A")}
    </div>
  );
};
