import {
  CHAT_WITH_MESSAGE,
  GROUP_CHAT_WITH_MESSAGE,
} from 'renderer/config/api.routes';
import { Chat, Message } from 'renderer/domain';
import { IChatRepository } from 'renderer/repository/chat/chat.repository';
import HttpClient from 'renderer/services/http';
import { quickSort } from 'renderer/utils/common';

/** get more chat
 * @param from: the number of chat to skip
 */
export async function loadChat({
  repo,
  page = 1,
}: {
  repo: IChatRepository;
  page?: number;
}) {
  const { data, extra } = await repo.getChats(page);

  const sortedData = quickSort<Chat>(data, 'lastUpdate', 'desc');
  return { sortedData, extra };
}

/**
 * get initial chats
 * @param repo chat repository
 * @returns chat item
 */
export async function getInitialChat(repo: IChatRepository) {
  const { data: internalchat, extra } = await repo.getChats();
  const data = quickSort<Chat>(internalchat, 'lastUpdate', 'desc');
  return { data, extra };
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export async function getInitialChat_v1() {
  const response = await HttpClient.get<Chat[]>(`${CHAT_WITH_MESSAGE}?page=1`);
  const { data, pageNum, totalCount, totalPage } = response.data;
  return {
    data: data.map((d) => ({ ...d, isGroup: false })),
    extra: { pageNum, totalCount, totalPage },
  };
}
// eslint-disable-next-line @typescript-eslint/naming-convention
export async function getInitialGroupChat() {
  const response = await HttpClient.get<Chat[]>(
    `${GROUP_CHAT_WITH_MESSAGE}?page=1`
  );
  const { data, pageNum, totalCount, totalPage } = response.data;
  return {
    data,
    extra: { pageNum, totalCount, totalPage },
  };
}

export function addMessageToChat(
  chatId: Id,
  msg: Message,
  updater: {
    insertMessage: (chatId: Id, msg: Message, oldId: Id) => void;
  }
) {
  updater.insertMessage(chatId, msg, msg.id);
}

export function updateChat(
  chatId: Id,
  updates: WithRequired<Partial<Chat>, 'lastMessage' | 'status' | 'lastUpdate'>,
  updater: {
    updateChatItem: (item: { id: Id; updates: Partial<Chat> }) => void;
  }
) {
  updater.updateChatItem({ id: chatId, updates });
}
