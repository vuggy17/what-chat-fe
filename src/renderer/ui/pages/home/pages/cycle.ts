import { useOutletContext } from 'react-router-dom';

type CT = {
  privateMessages: any[];
  groupMessages: any[];
};
export default function useSearchChats() {
  return useOutletContext<CT>();
}
