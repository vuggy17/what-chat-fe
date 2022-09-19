import { Divider } from 'antd';
import React, { ReactNode, useContext, useState } from 'react';

type CbContextType = {
  toggleOpenConvOption: () => void;
  convOptionOpen: boolean;
};
interface ChildrenProps {
  children: ReactNode;
}

const CContext = React.createContext<CbContextType>({} as CbContextType);

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
