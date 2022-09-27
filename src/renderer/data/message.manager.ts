/* eslint-disable @typescript-eslint/no-empty-function */
import { Conversation, Message } from 'renderer/entity';

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
    console.log(this._caches);

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

  addMessages(m: Message[]): void {
    this._messages = this._messages.concat(m);
    console.info('this message', this.messages);
    console.info('m', m);
    const combined = this._messages.concat(m);
    this._messages = [...combined];
    console.info('combined', combined);
  }
}

export default MessageManager.use();
