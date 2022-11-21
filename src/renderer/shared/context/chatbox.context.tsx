import React, { ReactNode, useContext, useState } from 'react';
import { ChatWithoutMeta } from 'renderer/domain';

type A = {
  toggleInfoOpen: () => void;
  setNewChat: (val: ChatWithoutMeta | null) => void;
  infoOpen: boolean;
  newChat: ChatWithoutMeta | null;
};
interface ChildrenProps {
  children: ReactNode;
}

const CContext = React.createContext<A>({} as A);

export function useChatBoxContext() {
  return useContext(CContext);
}
export default function ChatBoxProvider({ children }: ChildrenProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [newChat, setNewChat] = useState<ChatWithoutMeta | null>(null);
  return (
    <CContext.Provider
      value={{
        infoOpen,
        newChat,
        setNewChat,
        toggleInfoOpen: () => {
          setInfoOpen(!infoOpen);
        },
      }}
    >
      {children}
    </CContext.Provider>
  );
}
