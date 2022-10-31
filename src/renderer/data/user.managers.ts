import HttpClient from 'renderer/services/http';
import { atom, selector } from 'recoil';
import memoize from 'fast-memoize';
import userManager from './user.manager';

export const userByIdState = memoize((id: string) =>
  atom({
    key: `user-${id}`,
    default: userManager.getById(id),
  })
);

export const userInfoState = memoize((id: string) =>
  selector({
    key: `full-user-${id}`,
    get: async ({ get }) => {
      const user = get(userWithIdState(id));
      if (!user) return undefined;
      // const user = await HttpClient.get(`/users/${id}`);
      return { ...user };
    },
  })
);
