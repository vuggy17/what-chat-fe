import { useOutletContext } from 'react-router-dom';

type ContextType = {
  setContactOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useUI() {
  return useOutletContext<ContextType>();
}
