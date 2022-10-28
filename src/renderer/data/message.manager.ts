/* eslint-disable @typescript-eslint/no-empty-function */
import { Conversation, Message } from 'renderer/domain';

export class MessageManager {
  private static _instance: MessageManager;

  private _messages: Message[]; // store each chat's messages

  private _caches: Map<Id, Message[]> = new Map();

  private constructor() {
    this._messages = [];
  }

  static use(): MessageManager {
    if (!this._instance) {
      return new MessageManager();
    }
    return this._instance;
  }

  getCachedMessages(chatId: Id): Message[] {
    return this._caches.get(chatId) || [];
  }

  setCachedMessages(chatId: Id, messages: Message[]): void {
    this._caches.set(chatId, messages);
  }

  get messages(): Message[] {
    return this._messages;
  }

  public set messages(v: Message[]) {
    this._messages = v;
  }

  getMessageById(id: Id): Message | undefined {
    return this._messages.find((item) => item.id === id);
  }

  flush() {
    this._caches.clear();
    console.log(this._caches);
  }
}

export default MessageManager.use();
