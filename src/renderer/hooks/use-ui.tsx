import { useOutletContext } from 'react-router-dom';

type ContextType = {
  setContactOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSocialOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useUI() {
  return useOutletContext<ContextType>();
}
