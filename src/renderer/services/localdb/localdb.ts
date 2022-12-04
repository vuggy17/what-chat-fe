import Dexie from 'dexie';
import { Message } from 'renderer/domain';
import {
  LocalChatSchema,
  LocalPrivateChatSchema,
  LocalUserSchema,
} from './schemas';

export default class LocalDb extends Dexie {
  chats!: Dexie.Table<LocalChatSchema, string>;

  contacts!: Dexie.Table<LocalUserSchema, string>;

  privateChat!: Dexie.Table<LocalPrivateChatSchema, string>;

  messages!: Dexie.Table<Message, string>;

  private static internalInstance: LocalDb | null;

  /**
   *
   * create an indexDb instance if not initialized
   * @param dbName userName to init db
   * @returns IndexDb instance
   */
  static instance(dbName: string) {
    if (!LocalDb.internalInstance) {
      LocalDb.internalInstance = new LocalDb(dbName);
      console.log('db namae', dbName);
    }
    LocalDb.internalInstance.on('close', () => {
      console.log('db closed', dbName);
    });
    return LocalDb.internalInstance;
  }

  /** get indexDb instance without init */
  static instance_force() {
    if (LocalDb.internalInstance) {
      return LocalDb.internalInstance;
    }
    console.info('LocalDb not initialized');
    return new Error('LocalDb not initialized');
  }

  // first parameter is primary key
  constructor(dbName: string) {
    super(dbName);
    this.version(0.1).stores({
      chats: 'id,lastUpdate, type',
      messages: 'id, createdAt, [createdAt+receiverId]',
      privateChat: 'id',
      contacts: 'id',
    });
  }

  static close() {
    if (!LocalDb.internalInstance)
      throw new Error('No localdb instance existed');

    LocalDb.internalInstance.close();
    LocalDb.internalInstance = null;
  }
}
