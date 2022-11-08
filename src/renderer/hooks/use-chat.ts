import { useEffect } from 'react';
import {
  atom,
  atomFamily,
  selectorFamily,
  DefaultValue,
  useRecoilValue,
  useRecoilCallback,
  selector,
} from 'recoil';
import { Chat } from 'renderer/domain';
import { quickSort } from 'renderer/utils/common';

const initialChat = (id: string) =>
  ({
    id,
    name: '',
    avatar: '',
    status: 'sending',
    participants: [],
    previewText: '',
    lastUpdate: Date.now(),
    typing: false,
  } as Chat);

const chatIdsState = atom<{
  ids: Id[];
  extra: {
    pageNum: number;
    totalCount: number;
    totalPage: number;
  };
}>({
  key: 'chatIdsState',
  default: { ids: [], extra: { pageNum: 1, totalCount: 0, totalPage: 0 } },
});

const chatItemState = atomFamily<Chat, Id>({
  key: 'chatItemState',
  default: (id) => initialChat(id),
});

export const chatItemSelector = selectorFamily<Chat, Id>({
  key: 'chatItemSelector',
  get:
    (id) =>
    ({ get }) =>
      get(chatItemState(id)),
  set:
    (id) =>
    ({ get, set, reset }, newVal) => {
      if (newVal instanceof DefaultValue) {
        reset(chatItemState(id));
        return;
      }
      set(chatItemState(id), newVal);

      if (get(chatIdsState).ids.find((i) => i === newVal.id)) return;

      set(chatIdsState, ({ ids: prev, extra }) => {
        const ids = [...prev, newVal.id];
        return { ids, extra };
      });
    },
});

const chatItemsState = selector<Chat[]>({
  key: 'chatItemsState',
  get: ({ get }) => {
    const { ids: chatIds } = get(chatIdsState);
    return chatIds.map((id) => get(chatItemState(id)));
  },
});

export const chatItemsSortedState = selector<Chat[]>({
  key: 'chatItemsSortedState',
  get: ({ get }) => {
    const chatItems = get(chatItemsState);
    return quickSort<Chat>(chatItems, 'lastUpdate', 'desc');
  },
});

const getFirstChatId = selector<Id>({
  key: 'getFirstChatId',
  get: ({ get }) => {
    const chatIds = get(chatItemsSortedState);
    return chatIds[0]?.id || '';
  },
});

export const activeChatIdState = atom<Id>({
  key: 'activeChatIdState',
  default: getFirstChatId,
});

export const activeChatItem = selector<Chat>({
  key: 'activeChatState',
  get: ({ get }) => {
    const activeChatId = get(activeChatIdState);
    return get(chatItemState(activeChatId));
  },
});

export const useChatList = () => {
  const listIds = useRecoilValue(chatIdsState).ids;
  const { extra } = useRecoilValue(chatIdsState);

  const setList = useRecoilCallback(
    ({ set }) =>
      (payload: {
        data: Chat[];
        extra: { pageNum: number; totalCount: number; totalPage: number };
      }) => {
        const { data: chats, extra: internalExtra } = payload;
        set(chatIdsState, (prev) => ({ ...prev, extra: internalExtra }));

        chats.forEach((l) => {
          set(chatItemSelector(l.id), l);
        });
      },
    []
  );

  return {
    listIds,
    extra,
    setList,
  };
};

export const useChatItem = (id: Id) => {
  const listItem = useRecoilValue(chatItemSelector(id));
  const activeChatId = useRecoilValue(activeChatIdState);

  const changeActiveChat = useRecoilCallback(
    ({ set }) =>
      (i: Id) => {
        set(activeChatIdState, i);
      },
    []
  );

  // get chat item with id if it exists
  const getItemIfExisted = useRecoilCallback(({ snapshot }) => (i: Id) => {
    const DEFAULT_NAME = '';
    const item = snapshot.getLoadable(chatItemSelector(i)).valueMaybe();

    // if item is a default atom's value, return null instead return item it self
    if (item !== undefined && item.name !== DEFAULT_NAME) {
      return item;
    }
    return null;
  });

  const upsertListItem = useRecoilCallback(
    ({ set, snapshot }) =>
      (payload: { id: Id; updates: Partial<Chat> }) => {
        const currentItem = snapshot
          .getLoadable(chatItemState(payload.id))
          .valueMaybe();
        if (currentItem) {
          set(chatItemSelector(payload.id), {
            ...currentItem,
            ...payload.updates,
          });
        } else {
          set(chatItemState(payload.id), payload.updates as Chat);
        }
      },
    []
  );

  return {
    listItem,
    upsertListItem,
    activeChatId,
    changeActiveChat,
    getItemIfExisted,
  };
};
