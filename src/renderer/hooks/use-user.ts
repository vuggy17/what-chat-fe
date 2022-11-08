import { atom, atomFamily, selectorFamily } from 'recoil';
import IUser from 'renderer/domain/user.entity';

// current user info
export const currentUser = atom<IUser | null>({
  key: 'userState',
  default: null,
});

// all user info
export const usersState = atomFamily<IUser | null, Id>({
  key: 'usersState',
  default: null,
});

export const selectUserWithId = selectorFamily<IUser | null, Id>({
  key: 'selectUserWithId',
  get:
    (id) =>
    ({ get }) => {
      return get(usersState(id));
    },
});
