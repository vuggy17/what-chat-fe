import conversationManager, {
  ConversationManager,
} from 'renderer/data/conversation.manager';
import messageManager, { MessageManager } from 'renderer/data/message.manager';
import { Conversation, Message } from 'renderer/entity';
import { conversation, genMockChat } from 'renderer/mock/conversation';
import {
  ConversationRepository,
  IConversationRepository,
} from 'renderer/repository/conversation.repository';
import { OConveration, OMessage } from 'renderer/shared/lib/network/type';
import { createMsgPlaceholder } from 'renderer/usecase/message.usecase';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { chatParser } from './adapter';

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

  async init() {
    // flush old data
    this._conversationManager.conversations = [];
    this._conversationManager.activeConversationId = null;
    this._messageManager.messages = [];

    // load chat list
    // const data = await this._convRespository.getConversations(); // disable for now
    const data = conversation;

    // save to manager
    this._conversationManager.conversations = [
      ...this._conversationManager.conversations,
      ...data,
    ];

    // set active conversation
    const firstChatId = data[0].id;
    this._conversationManager.activeConversationId = firstChatId;

    // trigger ui update
    this.conversations.next(data);
    this.activeChat.next(this._conversationManager.activeConversationId);
  }

  onMessageReceived(message: OMessage) {
    // check if chat exist
    const chat = this._conversationManager.getConversation(
      message.conversationId
    );
    if (chat) {
      // update chat
      this.updateConverstationMeta(chat.id, { lastUpdate: new Date() });
      // formate message
      // update message
    } else {
      // create chat
      // update chat
      // update message
    }
  }

  addConversation(v: Conversation) {
    this._conversationManager.conversations.push(v);
    this.conversations.next(this._conversationManager.conversations);
  }

  updateConverstationMeta(id: Id, meta: Partial<Conversation>) {
    const index = this._conversationManager.conversations.findIndex(
      (item) => item.id === id
    );
    if (index !== -1) {
      this._conversationManager.conversations[index] = Object.assign(
        this._conversationManager.conversations[index],
        meta
      );
      this.conversations.next(this._conversationManager.conversations);
    }
  }

  addConverstaion(v: OConveration) {
    const validChat = chatParser.toEntity({} as OConveration);

    this._conversationManager.conversations = [
      validChat,
      ...this._conversationManager.conversations,
    ];
  }

  setActiveChat(chatId: Id) {
    this._conversationManager.activeConversationId = chatId;
    this.activeChat.next(chatId);
  }

  getChatMeta(chatId: Id) {
    return this._conversationManager.getConversation(chatId);
  }

  /** get chat list and messages of the newest chat
   * @param from: the number of chat to skip
   */
  async loadConversation(from = 0, count = 10) {
    if (from !== 0) {
      console.log('chat paginated loading');
    } else {
      // const data = await this._convRespository.getConversations(); // disable for now
      const data = conversation;

      // save to manager
      this._conversationManager.conversations = [
        ...this._conversationManager.conversations,
        ...data,
      ];

      // trigger ui update
      this.conversations.next(data); // this could cause a bug if the data is not loaded yet
    }
  }

  createChat() {
    // create chat
    const newchat = genMockChat();
    this._conversationManager.conversations = [
      ...this._conversationManager.conversations,
      newchat,
    ];
    // save to db
    this._convRespository.saveConversations([newchat]);
    // update chat
    // update message
  }
}

const ConversationController = new CConevrsationController(
  messageManager,
  conversationManager,
  ConversationRepository
);
export default ConversationController;
