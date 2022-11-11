import {
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';
import { Message, MessageWithTotalCount } from 'renderer/domain';
import { messageRepository } from '../repository/message.respository';
// eslint-disable-next-line import/no-cycle
import { activeChatIdState } from './use-chat';

/**
 * @deprecated now message list is being initialized with the chat in effect function
 *
 * @return a promise that suspense the component until the messages are loaded with the chat messages
 */
export const fetchMessagesOfChatAsync = selectorFamily<
  MessageWithTotalCount,
  Id
>({
  key: `fetchMessagesOfChatAsync-key`,
  get: (id) => async () => {
    if (id === '') return { data: [], total: 0 };
    const { data, total } = await messageRepository.getMessages(id, 0);
    return {
      data,
      total,
    };
  },
});

const getChatMessages =
  (id) =>
  ({ setSelf, onSet, trigger }) => {
    // If there's a persisted value - set it on load
    const loadRemote = async () => {
      const res = await messageRepository.getMessages(id, 0);

      if (res != null) {
        setSelf({ ...res });
      }
    };

    // Asynchronously set the persisted data
    if (trigger === 'get') {
      loadRemote();
    }
  };
/**
 * message of chat with id
 * @param id chat id
 */
export const chatMessagesState = atomFamily<MessageWithTotalCount, Id>({
  key: `messageOfChat`,
  default: (id) => ({ data: [], total: 0 }),
  effects: (id) => [getChatMessages(id)],
});

export const activeChatMessageSelector = selector<MessageWithTotalCount>({
  key: `activeChatMessage`,
  get: ({ get }) => {
    const activeChatId = get(activeChatIdState);
    if (activeChatId === '') return { data: [], total: 0 };
    return get(chatMessagesState(activeChatId));
  },
});

export const chatMessageSelector = selectorFamily<MessageWithTotalCount, Id>({
  key: 'chatItemSelector',
  get:
    (id) =>
    ({ get }) =>
      get(chatMessagesState(id)),
  set:
    (id) =>
    ({ set, reset }, newVal) => {
      if (newVal instanceof DefaultValue) {
        reset(chatMessagesState(id));
        return;
      }

      set(chatMessagesState(id), newVal);
    },
});

export const useMessage = () => {
  const { data: internalData, total: internalTotal } = useRecoilValue(
    activeChatMessageSelector
  );

  const prependMany = useRecoilCallback(
    ({ set }) =>
      (id: Id, newItems: Message[]) => {
        set(chatMessageSelector(id), (prev) => ({
          total: prev.total,
          data: [...newItems, ...prev.data],
        }));
      }
  );

  /**
   * append message to chat or update it if already exists
   */
  const updateOrInsertMessage = useRecoilCallback(
    ({ set }) =>
      (
        chatId: Id,
        message: WithRequired<Partial<Message>, 'id'>,
        oldId: Id
      ) => {
        set(chatMessageSelector(chatId), ({ data, total }) => {
          const index = data.findIndex((m) => m.id === oldId);
          console.log('update message', index, oldId, message);
          if (index === -1) {
            return {
              data: [...data, message as Message],
              total: total + 1,
            };
          }
          const mutableData = [...data];

          mutableData[index] = { ...mutableData[index], ...message };
          return {
            data: [...mutableData],
            total,
          };
        });
      }
  );

  return {
    messagesOfActiveChat: internalData,
    total: internalTotal,
    prependMany,
    updateOrInsertMessage,
  };
};
