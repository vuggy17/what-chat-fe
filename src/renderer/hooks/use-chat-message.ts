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

// Draff state for message
export const draffMessageState = atomFamily<Message[], Id>({
  key: 'draffMessageState',
  default: [],
});

export const fetchMessagesOfChatAsync = selectorFamily<
  MessageWithTotalCount,
  Id
>({
  key: `fetchMessagesOfChatAsync-key`,
  get:
    (id) =>
    async ({ get }) => {
      if (id === '') return { data: [], total: 0 };
      const { data, total } = await messageRepository.getMessages(id, 0);

      const draffMessage = get(draffMessageState(id));

      return {
        data: [...data, ...draffMessage],
        total,
      };
    },
});

/**
 * message of chat with id
 * @param id chat id
 */
export const chatMessagesState = atomFamily<MessageWithTotalCount, Id>({
  key: `messageOfChat`,
  default: (id) => fetchMessagesOfChatAsync(id),
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
          ...prev,
          data: [...newItems, ...prev.data],
        }));
      }
  );

  const upsertOne = useRecoilCallback(
    ({ set }) =>
      (id: Id, message: Message) => {
        set(chatMessageSelector(id), ({ data, total }) => {
          const index = data.findIndex((m) => m.id === message.id);
          if (index === -1) {
            return {
              data: [...data, message],
              total: total + 1,
            };
          }
          const mutableData = [...data];
          mutableData[index] = message;
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
    upsertOne,
  };
};
