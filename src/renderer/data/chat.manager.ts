/* eslint-disable @typescript-eslint/no-empty-function */
import { Chat } from 'renderer/domain';

export class ChatManager {
  private static _instance: ChatManager;

  private _chats: Chat[];

  private _activeChatId: Id | null;

  private constructor(initials: Chat[] = [], activeIndex = 0) {
    this._chats = initials;
    this._activeChatId = initials[activeIndex]?.id || null;
  }

  public static use(): ChatManager {
    if (!this._instance) {
      return new ChatManager();
    }
    return this._instance;
  }

  public getChat(locator: Id) {
    const a = this._chats.find((item) => item.id === locator);
    console.log('found', a);
    return a;
  }

  public get activeChatId(): Id {
    return this._activeChatId!;
  }

  public set activeChatId(v: Id | null) {
    this._activeChatId = v;
  }

  public get chats(): Chat[] {
    return this._chats;
  }

  public set chats(v: Chat[]) {
    this._chats = v;
  }
}

export default ChatManager.use();
