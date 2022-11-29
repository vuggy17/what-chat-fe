import { atom, useRecoilCallback } from 'recoil';
import User from 'renderer/domain/user.entity';

export const userContacts = atom<User[]>({
  default: [],
  key: 'user_contact',
});

export const useContact = () => {
  const setUserContacts = useRecoilCallback(({ set }) => (data: User[]) => {
    set(userContacts, data);
  });

  return setUserContacts;
};
