import { atom, atomFamily, selectorFamily } from 'recoil';
import User from 'renderer/domain/user.entity';

// current user info
export const currentUser = atom<User | null>({
  key: 'userState',
  default: null,
});

// all user info
export const usersState = atomFamily<User | null, Id>({
  key: 'usersState',
  default: null,
});

export const selectUserWithId = selectorFamily<User | null, Id>({
  key: 'selectUserWithId',
  get:
    (id) =>
    ({ get }) => {
      return get(usersState(id));
    },
});
