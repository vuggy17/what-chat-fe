import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilTransaction_UNSTABLE,
} from 'recoil';
import { Chat, Message } from 'renderer/domain';
import { quickSort } from 'renderer/utils/common';

export type ChatWithMessages = Chat & { messages: Message[]; total: number };

export const currentChatIdState = atom<Id | null>({
  key: 'currentChatIdState',
  default: null,
});

export const chatState = atomFamily<ChatWithMessages, Id>({
  key: 'chatsState',
  default: {} as ChatWithMessages,
});

export const chatIdsState = atom<Id[]>({
  key: 'chatIdsState',
  default: [],
});

export const chatExtraState = atom<{
  pageNum: number;
  totalCount: number;
  totalPage: number;
}>({
  key: 'chatExtraState',
  default: { pageNum: 1, totalCount: 0, totalPage: 0 },
});

// use this to display chat list
export const sortedChatsQuery = selector<Chat[]>({
  key: 'chatItemsSortedState',
  get: ({ get }) => {
    const ids = get(chatIdsState);
    if (ids && ids.length > 0) {
      const chats = ids.map((id) => get(chatState(id)));

      return quickSort(chats, 'lastUpdate');
    }
    return [];
  },
});

// get current displayed chat
export const currentChatQuery = selector<ChatWithMessages>({
  key: 'currentChat',
  get: ({ get }) => {
    const currentChatId = get(currentChatIdState);
    if (currentChatId) return get(chatState(currentChatId));

    const lastedChat = get(chatIdsState)[0];
    return get(chatState(lastedChat));
  },
});

// get message of a random chat
export const chatMessageQuery = selectorFamily({
  key: 'chatMessageQuery',
  get:
    (chatId: Id) =>
    ({ get }) => {
      const chats = get(chatState(chatId));
      return { messages: chats.messages, total: chats.total };
    },
});

export const useChatMessage = () => {
  // prepend message to a chat
  const prependMessage = useRecoilCallback(
    ({ set }) =>
      (chatId: Id, message: Message[]) => {
        set(chatState(chatId), (oldChat) => ({
          ...oldChat,
          messages: [...message, ...oldChat.messages],
        }));
      }
  );

  // append a message to a chat
  const appendMessage = useRecoilCallback(
    ({ set }) =>
      (chatId: Id, message: Message) => {
        set(chatState(chatId), (oldChat) => ({
          ...oldChat,
          messages: [...oldChat.messages, message],
        }));
      }
  );

  /**
   * append/modify a message in a chat,
   * complex version of @function appendMessage
   */
  const insertMessage = useRecoilCallback(
    ({ set }) =>
      (
        inChatId: Id,
        message: WithRequired<Partial<Message>, 'id'>,
        oldId: Id
      ) => {
        set(chatState(inChatId), (prevState) => {
          const msgIdx = prevState.messages.findIndex(
            (msg) => msg.id === oldId
          );
          console.log('msgIdx', msgIdx);
          if (msgIdx === -1) {
            return {
              ...prevState,
              messages: [...prevState.messages, message as Message],
              total: prevState.total + 1,
            };
          }
          const messages = [...prevState.messages];
          messages[msgIdx] = { ...messages[msgIdx], ...message };
          return { ...prevState, messages };
        });
      }
  );

  return { prependMessage, appendMessage, insertMessage };
};

export const useChat = () => {
  const batchInitChats = useRecoilTransaction_UNSTABLE(
    ({ set }) =>
      (
        data: ChatWithMessages[],
        extra: { pageNum: 1; totalCount: 0; totalPage: 0 }
      ) => {
        const ids = data.map((chat) => chat.id);
        data.forEach((chat) => {
          set(chatState(chat.id), chat);
        });
        set(chatIdsState, ids);
        set(chatExtraState, extra);
      }
  );

  /**
   * update or insert a chat
   */
  const updateChat = useRecoilCallback(
    ({ set, snapshot }) =>
      (payload: { id: Id; updates: Partial<Chat> }) => {
        const currentItem = snapshot
          .getLoadable(chatState(payload.id))
          .valueMaybe();
        if (currentItem) {
          set(chatState(payload.id), {
            ...currentItem,
            ...payload.updates,
          });
        } else {
          set(chatState(payload.id), payload.updates as ChatWithMessages); // cast to ChatWithMessages to workaround ts complain
          set(chatIdsState, (oldIds) => [...oldIds, payload.id]);
        }
      },
    []
  );

  return { batchInitChats, updateChat };
};
