import { Chat, Message } from 'renderer/domain';
import { IChatRepository } from 'renderer/repository/chat.repository';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';
import { quickSort } from 'renderer/utils/common';
import { createMsgPlaceholder } from './message.usecase';

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
  const {
    data: internalchat,
    pageNum,
    totalCount,
    totalPage,
  } = await repo.getChats(page);

  const data = quickSort<Chat>(internalchat, 'lastUpdate', 'desc');
  return { data, extra: { pageNum, totalCount, totalPage } };
}

/**
 * get initial chats
 * @param repo chat repository
 * @returns chat item
 */
export async function getInitialChat(repo: IChatRepository) {
  const {
    data: internalchat,
    pageNum,
    totalCount,
    totalPage,
  } = await repo.getChats();
  const data = quickSort<Chat>(internalchat, 'lastUpdate', 'desc');
  return { data, extra: { pageNum, totalCount, totalPage } };
}

export function addMessageToChat(
  chatId: Id,
  msg: Message,
  updater: {
    insertMessage: (chatId: Id, msg: Message) => void;
    updateChat: (item: { id: Id; updates: Partial<Chat> }) => void;
    updates: Partial<Chat>;
  }
) {
  updater.insertMessage(chatId, msg);
  updater.updateChat({
    id: chatId,
    updates: updater.updates,
  });
}
