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
    // check if chat exist
    const chat = this._conversationManager.getConversation(
      message.conversationId
    );
    if (chat) {
      // update chat
      this.updateConverstationMeta(chat);
      // formate message
      // update message
    } else {
      // create chat
      // update chat
      // update message
    }
  }

  addConversation(conversation: Conversation) {
    this._conversationManager.conversations.push(conversation);
    this.conversations.next(this._conversationManager.conversations);
  }

  updateConverstationMeta(conversation: Conversation) {
    const index = this._conversationManager.conversations.findIndex(
      (item) => item.id === conversation.id
    );
    if (index !== -1) {
      this._conversationManager.conversations[index] = conversation;
      this.conversations.next(this._conversationManager.conversations);
    }
  }

  setActiveChat(chatId: Id) {
    this._conversationManager.activeConversationId = chatId;
    this.activeChat.next(chatId);
  }

  getChatMeta(chatId: Id) {
    return this._conversationManager.getConversation(chatId);
  }

  async loadConversation(from: Id | undefined, count = 10) {
    // load conversation
    // load first conversation messages
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

  sendMessage(message: Message) {
    this._messageManager.addmessage(message);
  }
}

const ConversationController = new CConevrsationController(
  messageManager,
  conversationManager,
  ConversationRepository
);
export default ConversationController;
