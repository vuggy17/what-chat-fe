import conversationManager, {
  ConversationManager,
} from 'renderer/data/conversation.manager';
import messageManager, { MessageManager } from 'renderer/data/message.manager';
import { Conversation, Message } from 'renderer/entity';
import {
  ConversationRepository,
  IConversationRepository,
} from 'renderer/repository/conversation.repository';
import { OMessage } from 'renderer/shared/lib/network/type';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

class CConevrsationController {
  activeChat: BehaviorSubject<Id>;

  conversations: BehaviorSubject<Conversation[]>;

  constructor(
    private _messageManager: MessageManager,
    private _conversationManager: ConversationManager,
    private _convRespository: IConversationRepository
  ) {
    this.activeChat = new BehaviorSubject(
      this._conversationManager.activeConversationId
    );
    this.conversations = new BehaviorSubject(
      this._conversationManager.conversations
    );
  }

  onMessageReceived(message: OMessage) {
    console.log(message);
  }

  setActiveChat(chatId: Id) {
    this._conversationManager.activeConversationId = chatId;
    this.activeChat.next(chatId);
  }

  getChatMeta(chatId: Id) {
    return this._conversationManager.getConversation(chatId);
  }

  async loadConversation(from: Id | undefined, count = 10) {
    if (from) {
      // load from id = xxxx
      console.log('chat paginated loading');
    } else {
      const data = await this._convRespository.getConversations();
      this._conversationManager.conversations = [
        ...this._conversationManager.conversations,
        ...data,
      ];
      // trigger ui update
      this.conversations.next(data);
    }
  }
}

const ConversationController = new CConevrsationController(
  messageManager,
  conversationManager,
  ConversationRepository
);
export default ConversationController;
