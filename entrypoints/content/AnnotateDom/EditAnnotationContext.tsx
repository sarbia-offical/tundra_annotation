import React, { createContext, useContext, useState } from "react";

interface EditAnnotateContextValue {
  jumpToCurrentNote: boolean;
  changeJumpToCurrentNote: (value: boolean) => void;
}

const EditAnnotationContext = createContext<
  EditAnnotateContextValue | undefined
>(undefined);

export const useEditAnnotateContextValue = () => {
  const context = useContext(EditAnnotationContext);
  if (!context) {
    throw new Error(
      "useEditAnnotateContextValue must be used within a CollapsePanel"
    );
  }
  return context;
};

export const EditAnnotateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jumpToCurrentNote, setJumpToCurrentNote] = useState<boolean>(false);
  const changeJumpToCurrentNote = (value: boolean) =>
    setJumpToCurrentNote(value);
  return (
    <EditAnnotationContext.Provider
      value={{ jumpToCurrentNote, changeJumpToCurrentNote }}
    >
      {children}
    </EditAnnotationContext.Provider>
  );
};
