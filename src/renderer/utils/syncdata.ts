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

export async function syncContact(data: User[], db: LocalDb) {
  console.log(db);
  const localData = data.map(
    (d) => ({ id: d.id, name: d.name, avatar: d.avatar } as LocalUserSchema)
  );
  return db.contacts.bulkPut(localData);
}

export function syncChat(data: Chat[], db: LocalDb) {
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
  return db.chats.bulkPut(localData);
}

export function mapContactToChat(currentUser: User, data: Chat[], db: LocalDb) {
  const internalChat = data.slice();
  const localData = internalChat.map(
    (c) =>
      ({
        id: c.participants?.find((p) => p.id !== currentUser.id)!.id,
        chatId: c.id,
      } as LocalPrivateChatSchema)
  );
  return db.privateChat.bulkPut(localData);
}

export function syncMessage(data: Message[], db: LocalDb) {
  const localData = data.map(
    // add property chatId to message
    (d) => ({ ...d, receiverId: d.receiver.id })
  );
  return db.messages.bulkPut(localData);
}
