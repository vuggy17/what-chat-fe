import {
  LocalDb,
  LocalPrivateChatSchema,
  LocalUserSchema,
} from 'renderer/services/localdb';
import { Table } from 'dexie';
import User from 'renderer/domain/user.entity';
import { Chat, Message } from 'renderer/domain';
import {
  ChatKind,
  LocalChatSchema,
} from 'renderer/services/localdb/schemas/chat.schema';
import { isNotEmptyArray } from './common';

export async function syncContact(data: User[], db: LocalDb) {
  if (isNotEmptyArray(data)) {
    const localData = data.map(
      (d) => ({ id: d.id, name: d.name, avatar: d.avatar } as LocalUserSchema)
    );
    await db.contacts.bulkPut(localData);
    return localData;
  }

  return [];
}

export async function syncChat(data: Chat[], db: LocalDb) {
  if (isNotEmptyArray(data)) {
    const localData = data.map(
      (d) =>
        ({
          id: d.id,
          lastUpdate: d.lastUpdate,
          type: ChatKind.private,
          name: d.name,
          avatar: d.avatar,
          participants: d.participants,
          lastMessage: d.lastMessage,
        } as LocalChatSchema)
    );
    await db.chats.bulkPut(localData);
    return localData;
  }
  return [];
}

export async function mapContactToChat(
  currentUser: User,
  data: Chat[],
  db: LocalDb
) {
  if (isNotEmptyArray(data)) {
    const internalChat = data.slice();
    const localData = internalChat.map(
      (c) =>
        ({
          id: c.participants?.find((p) => p.id !== currentUser.id)!.id,
          chatId: c.id,
        } as LocalPrivateChatSchema)
    );
    await db.privateChat.bulkPut(localData);
    return localData;
  }
  return [];
}

export async function syncMessage(data: Message[], db: LocalDb) {
  const localData = data.map(
    // add property chatId to message
    (d) => ({ ...d, receiverId: d.receiver.id })
  );
  await db.messages.bulkPut(localData);
  return localData;
}
