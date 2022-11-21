// import {
//   atom,
//   atomFamily,
//   DefaultValue,
//   selector,
//   selectorFamily,
//   useRecoilCallback,
//   useRecoilTransaction_UNSTABLE,
// } from 'recoil';
// import { Message, MessageWithTotalCount } from 'renderer/domain';
// import { messageRepository } from 'renderer/repository/message.respository';

// // for fetch messages
// export const chatMessageQuery = selectorFamily({
//   key: 'ChatMessageQuery',
//   get: (chatId: Id | null) => async () => {
//     if (chatId) {
//       const response = await messageRepository.getMessages(chatId, 0);
//       return response;
//     }
//     return { data: [], total: 0 };
//   },
// });

// export const activeChatIdState = atom<Id | null>({
//   key: 'activeChatIdState',
//   default: null,
// });

// export const currentChatMessageState = selector<MessageWithTotalCount>({
//   key: 'currentChatMessageState',
//   get: ({ get }) => get(chatMessageQuery(get(activeChatIdState))),
// });

// // cache of 10 chat's messages
// const chatMessageState = atomFamily<MessageWithTotalCount, Id>({
//   key: 'chatMessageCacheState',
//   default: { data: [], total: 0 },
// });

// // selector that work with cache
// const localChatMessageQuery = selectorFamily<MessageWithTotalCount, Id>({
//   key: 'messageCacheSelector',
//   get:
//     (chatId) =>
//     ({ get }) =>
//       get(chatMessageState(chatId)),
//   // set:
//   //   (chatId) =>
//   //   ({ set, get }, newValue) => {
//   //     if (newValue instanceof DefaultValue) {
//   //       // if the value is default value, remove the cache
//   //       set(chatMessageCacheState(chatId), newValue);
//   //     } else {
//   //       // if the value is not default value, update the cache
//   //       set(chatMessageCacheState(chatId), newValue);
//   //     }
//   //   },
// });

// export const useMessage = () => {
//   const prepend = useRecoilTransaction_UNSTABLE(
//     ({ set, get }) =>
//       (id: Id, newItems: Message[]) => {
//         set(chatMessageState(id), (prev) => ({
//           ...prev,
//           data: [...newItems, ...prev.data],
//         }));
//       }
//   );
//   return prepend;
// };
