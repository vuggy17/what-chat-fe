import { useContext, createContext, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

type ContextType = {
  setContactOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSocialOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useUI() {
  return useOutletContext<ContextType>();
}

type SearchChatContextType = {
  groups: any[];
  privates: any[];
  setResults: React.Dispatch<
    React.SetStateAction<{
      groups: any[];
      privates: any[];
      messages: any[];
      currentChatId: Id;
    }>
  >;
  messages: any[];
  currentChatId: Id;
};

const c = createContext<SearchChatContextType>({} as SearchChatContextType);

export function SearchChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [result, setSearchResult] = useState<{
    groups: any[];
    privates: any[];
    messages: any[];
    currentChatId: Id;
  }>({ groups: [], privates: [], messages: [], currentChatId: '' });

  return (
    <c.Provider value={{ ...result, setResults: setSearchResult }}>
      {children}
    </c.Provider>
  );
}

export function useSearchChatResult() {
  return useContext(c);
}
