import React, { useState } from "react";
import { GiDolphin } from "react-icons/gi";
interface Props {
  title: string;
}
export const Icon: React.FC<Props> = (props) => {
  const [color, setColor] = useState<string>("#6F39EA");
  const { title } = props;
  return (
    <>
      <h1 className="text-2xl text-center font-thin flex items-center justify-center relative z-10 w-12 h-12">
        <GiDolphin
          className={`cursor-pointer w-8 h-8`}
          style={{ color }}
          onClick={() => {
            const randomColor =
              "#" + Math.floor(Math.random() * 16777215).toString(16);
            setColor(randomColor);
          }}
        />
      </h1>
      <div className="text-2xl text-center font-thin flex items-center justify-center relative z-10 select-none">
        {title}
      </div>
    </>
  );
};
