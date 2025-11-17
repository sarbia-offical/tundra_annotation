import React, { HTMLAttributes, PropsWithChildren, useState } from "react";
import { Icons } from "@/components/ui/icons";
import { Copy, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranslationActionsProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {
  textContext: string;
}

export const TranslationActions: React.FC<TranslationActionsProps> = ({
  textContext,
  className,
  ...restProps
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContext);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleSpeak = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(textContext);
      utterance.lang = "auto"; // 自动检测语言
      window.speechSynthesis.cancel(); // 取消之前的朗读
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Failed to speak text:", error);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`} {...restProps}>
      <Button
        size="iconMini"
        variant="icon"
        onClick={handleCopy}
        className="rounded-md transition-colors"
        title="复制"
      >
        {copied ? (
          <Icons.check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-ctx-primary-inverse/80" />
        )}
      </Button>
      <Button
        size="iconMini"
        variant="icon"
        onClick={handleSpeak}
        className="rounded-md transition-colors"
        title="朗读"
      >
        <Volume2 className="w-4 h-4 text-ctx-primary-inverse/80" />
      </Button>
    </div>
  );
};
