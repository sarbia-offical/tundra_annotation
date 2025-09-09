import React from "react";
import { CheckCheck, Check } from "lucide-react";
import { isEmpty } from "lodash";
import $style from "./index.module.css";

export interface Message {
  sender: "me" | "other";
  name?: string;
  content: string;
  time?: string;
  status?: "sent" | "read";
}

interface ChatBubbleProps {
  message: Message;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  className,
}) => {
  const isMe = message.sender === "me";

  return (
    <div
      className={`flex ${isMe ? "justify-end pr-2" : "justify-start pl-2"} ${
        className || ""
      }`}
    >
      <div className={`max-w-[70%] relative`}>
        <div
          className={`px-3 py-2 text-xs relative shadow-lg min-w-24 font-custom dark:text-[#000000] 
            ${
              isMe
                ? "bg-green-200 text-left rounded-tl-md rounded-bl-md rounded-br-md"
                : "bg-blue-100 text-left rounded-tr-md rounded-br-md rounded-bl-md"
            }
           ${isMe ? $style.rightBage : $style.leftBage}`}
        >
          <div className="flex items-center justify-between">
            {message.name && !isMe && (
              <div className="block text-green-500 font-semibold text-xs">
                {message.name}
              </div>
            )}
            {message.time ? (
              <div className="text-[10px] text-[#999999]">{message.time}</div>
            ) : (
              <></>
            )}
          </div>
          {message.content}
        </div>
      </div>
    </div>
  );
};
