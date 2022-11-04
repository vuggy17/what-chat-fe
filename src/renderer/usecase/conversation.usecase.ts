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
  skip,
  total,
  count = CONV_PAGE_SIZE,
}: {
  repo: IChatRepository;
  skip: number;
  total: number;
  count?: number;
}) {
  if (skip >= total) {
    return repo.getChats(skip, count);
  }
  throw new Error(
    "Skip can't be smaller than the length of the current chat list"
  );
}

/**
 * get initial chats
 * @param repo chat repository
 * @returns chat item
 */
export async function getInitialChat(repo: IChatRepository) {
  const internalchat = await repo.getChats();
  const data = quickSort<Chat>(internalchat, 'lastUpdate', 'desc');
  return data;
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
