/* eslint-disable @typescript-eslint/no-empty-function */
import { Conversation, Message } from 'renderer/entity';

export class MessageManager {
  private static _instance: MessageManager;

  private _messages: Message[];

  private _savedMessages: Record<Id, Message[]> = {};

  private constructor(initials: Message[]) {
    this._messages = initials;
  }

  public static use(): MessageManager {
    if (!this._instance) {
      return new MessageManager([]);
    }
    return this._instance;
  }

  public get messages(): Message[] {
    return this._messages;
  }

  public set messages(v: Message[]) {
    this._messages = v;
  }

  public getSavedMessages(chatId: Id): Message[] {
    return this._savedMessages[chatId];
  }

  public set savedMessages(v: [Id, Message[]]) {
    const [chatId, data] = v;
    this._savedMessages[chatId] = data;
  }

  addmessage(message: Message) {
    this._messages.push(message);
  }
}

export default MessageManager.use();
