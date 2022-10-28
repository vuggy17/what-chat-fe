import React, { ReactNode, useContext, useState } from 'react';

type A = {
  toggleOpenConvOption: () => void;
  convOptionOpen: boolean;
};
interface ChildrenProps {
  children: ReactNode;
}

const CContext = React.createContext<A>({} as A);

export function useOptionPanelContext() {
  return useContext(CContext);
}
export default function ChatBoxProvider({ children }: ChildrenProps) {
  const [optionPanelOpen, setOptionPanelOpen] = useState(false);
  return (
    <CContext.Provider
      value={{
        convOptionOpen: optionPanelOpen,
        toggleOpenConvOption: () => {
          setOptionPanelOpen(!optionPanelOpen);
        },
      }}
    >
      {children}
    </CContext.Provider>
  );
}
