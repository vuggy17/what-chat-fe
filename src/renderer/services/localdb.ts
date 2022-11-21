import Dexie from 'dexie';
import { Message } from 'renderer/domain';
import { InternalChat } from './type';

export default class LocalDb extends Dexie {
  chats!: Dexie.Table<InternalChat, string>;

  messages!: Dexie.Table<Message, string>;

  private static instance: LocalDb;

  static getInstance(name: string) {
    if (!LocalDb.instance) {
      LocalDb.instance = new LocalDb(name);
    }
    return LocalDb.instance;
  }

  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({
      chats: 'id,lastUpdate',
      messages: 'id, createdAt',
    });
  }
}
