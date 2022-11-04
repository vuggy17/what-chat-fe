import React, { ReactNode, useContext, useState } from 'react';
import { ChatWithoutMeta } from 'renderer/domain';

type A = {
  toggleSideOpen: () => void;
  setNewChat: (val: ChatWithoutMeta | null) => void;
  sideOpen: boolean;
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
  const [sideOpen, setSideOpen] = useState(false);
  const [newChat, setNewChat] = useState<ChatWithoutMeta | null>(null);
  return (
    <CContext.Provider
      value={{
        sideOpen,
        newChat,
        setNewChat,
        toggleSideOpen: () => {
          setSideOpen(!sideOpen);
        },
      }}
    >
      {children}
    </CContext.Provider>
  );
}
