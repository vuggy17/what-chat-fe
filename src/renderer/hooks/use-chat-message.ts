import {
  atomFamily,
  DefaultValue,
  selector,
  selectorFamily,
  useRecoilCallback,
  useRecoilValue,
} from 'recoil';
import { Message } from 'renderer/domain';
import { messageRepository } from '../repository/message.respository';
// eslint-disable-next-line import/no-cycle
import { activeChatIdState } from './use-chat';

// Draff state for message
export const draffMessageState = atomFamily<Message[], Id>({
  key: 'draffMessageState',
  default: [],
});

export const fetchMessagesOfChatAsync = selectorFamily<Message[], Id>({
  key: `fetchMessagesOfChatAsync-key`,
  get:
    (id) =>
    async ({ get }) => {
      if (id === '') return [];
      const messages = await messageRepository.getMessages(id);
      const draffMessage = get(draffMessageState(id));

      return [...messages, ...draffMessage];
    },
});

/**
 * message of chat with id
 * @param id chat id
 */
export const chatMessagesState = atomFamily<Message[], Id>({
  key: `messageOfChat`,
  default: (id) => fetchMessagesOfChatAsync(id),
});

export const activeChatMessageSelector = selector<Message[]>({
  key: `activeChatMessage`,
  get: ({ get }) => {
    const activeChatId = get(activeChatIdState);
    if (activeChatId === '') return [];
    return get(chatMessagesState(activeChatId));
  },
});

export const chatMessageSelector = selectorFamily<Message[], Id>({
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
  const messagesOfActiveChat = useRecoilValue(activeChatMessageSelector);

  const addMany = useRecoilCallback(
    ({ set, snapshot }) =>
      (id: Id, messages: Message[]) => {
        // pick an message in the incoming data
        // if it not exist in the chat, append incoming messages to the chat
        // otherwise, there is no message in the chat, save it as the initial value
        const cachedMessages = snapshot
          .getLoadable(chatMessagesState(id))
          .getValue();
        if (messages.length > 0 && cachedMessages?.length > 0) {
          const randomMessageId = messages[0].id;
          if (
            cachedMessages.findIndex(
              (message) => message.id === randomMessageId
            ) === -1
          ) {
            set(chatMessagesState(id), (prev) => [...prev, ...messages]);
            return;
          }
        }
        set(chatMessageSelector(id), messages);
      }
  );

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const addMany_WithoutCheck = useRecoilCallback(
    ({ set }) =>
      (id: Id, message: Message) => {
        set(chatMessageSelector(id), (prev) => [...prev, message]);
      }
  );

  const prependMany = useRecoilCallback(
    ({ set }) =>
      (id: Id, messages: Message[]) => {
        set(chatMessageSelector(id), (prev) => [...messages, ...prev]);
      }
  );

  const upsertOne = useRecoilCallback(
    ({ set }) =>
      (id: Id, message: Message) => {
        set(chatMessageSelector(id), (prev) => {
          const index = prev.findIndex((m) => m.id === message.id);
          if (index === -1) {
            return [...prev, message];
          }
          prev[index] = message;
          return prev;
        });
      }
  );

  const insertOne = useRecoilCallback(
    ({ set }) =>
      (id: Id, message: Message) => {
        set(chatMessageSelector(id), (prev) => [...prev, message]);
      }
  );

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const insertOne_Draff = useRecoilCallback(
    ({ set }) =>
      (id: Id, message: Message) => {
        set(draffMessageState(id), (prev) => [...prev, message]);
      }
  );

  return {
    messagesOfActiveChat,
    addMany,
    addMany_WithoutCheck,
    prependMany,
    upsertOne,
    insertOne,
    insertOne_Draff,
  };
};
