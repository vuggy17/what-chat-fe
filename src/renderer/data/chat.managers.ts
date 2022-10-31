import chatManager from 'renderer/data/chat.manager';
import memoize from 'fast-memoize';
import { atom, selector } from 'recoil';
import { userByIdState } from './user.managers';

// eslint-disable-next-line import/prefer-default-export
/**
 * @return {Chat} individual chat by its id
 */
export const chatByIdState = memoize((id: Id) =>
  atom({
    key: `chat-${id}`,
    default: chatManager.getChat(id),
  })
);

export const selectedChatState = atom({
  key: 'selectedChat',
  default: null,
});

/**
 * @return full chat data with participants
 */
export const chatWithUserState = memoize((id: string) =>
  selector({
    key: `full-chat-${id}`,
    get: async ({ get }) => {
      const chat = get(chatByIdState(id));
      if (!chat) return undefined;
      const users = await Promise.all(
        chat.participants.map((userId) => get(userByIdState(userId)))
      );
      return { ...chat, users };
    },
  })
);

export const iAmSelected = memoize((id: Id) =>
  selector({
    key: `i-am-selected-${id}`,
    get: ({ get }) => {
      const selectedItem = get(selectedChatState);
      if (selectedItem === null) return false;
      return selectedItem === id;
    },
  })
);
