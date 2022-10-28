/* eslint-disable @typescript-eslint/no-empty-function */
import { Conversation } from 'renderer/domain';

export class ConversationManager {
  private static _instance: ConversationManager;

  private _conversations: Conversation[];

  private _activeConversationId: Id | null;

  private constructor(initials: Conversation[] = [], activeIndex = 0) {
    this._conversations = initials;
    this._activeConversationId = initials[activeIndex]?.id || null;
  }

  public static use(): ConversationManager {
    if (!this._instance) {
      return new ConversationManager();
    }
    return this._instance;
  }

  public getConversation(locator: Id) {
    const a = this._conversations.find((item) => item.id === locator);
    console.log('found', a);
    return a;
  }

  public get activeConversationId(): Id {
    return this._activeConversationId!;
  }

  public set activeConversationId(v: Id | null) {
    this._activeConversationId = v;
  }

  public get conversations(): Conversation[] {
    return this._conversations;
  }

  public set conversations(v: Conversation[]) {
    this._conversations = v;
  }

  // getActiveConversation(): Conversation {
  //   return this._conversations.find(
  //     (item) => item.id === this._activeConversationId
  //   )!;
  // }
}

export default ConversationManager.use();
