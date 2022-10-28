import conversationManager, {
  ConversationManager,
} from 'renderer/data/conversation.manager';
import messageManager, { MessageManager } from 'renderer/data/message.manager';
import { Conversation, Message } from 'renderer/domain';
import { conversation, genMockChat } from 'renderer/mock/conversation';
import {
  ConversationRepository,
  IConversationRepository,
} from 'renderer/repository/conversation.repository';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';
import { OConveration, OMessage } from 'renderer/services/type';
import { createMsgPlaceholder } from 'renderer/usecase/message.usecase';
import { quickSort } from 'renderer/utils/array';
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
    this.conversations = new BehaviorSubject([] as Conversation[]);
  }

  async init() {
    // flush old data
    this._conversationManager.conversations = [];
    this._conversationManager.activeConversationId = null;
    this._messageManager.messages = [];

    // load chat list
    const internalConversation = await this._convRespository.getConversations();
    const data = quickSort<Conversation>(
      internalConversation,
      'lastUpdate',
      'desc'
    );

    // save to manager
    this._conversationManager.conversations = [
      ...this._conversationManager.conversations,
      ...data,
    ];

    // set active conversation
    // conversation list must be sorted by lastUpdate
    const firstChatId = data[0].id;
    this._conversationManager.activeConversationId = firstChatId;

    console.log('firstChatId', firstChatId);

    // trigger ui update
    this.conversations.next(data);
    this.activeChat.next(firstChatId);
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

  /** get chat list
   * @param from: the number of chat to skip
   */
  async loadConversation(skip: number, count = CONV_PAGE_SIZE) {
    if (skip >= this._conversationManager.conversations.length - 1) {
      const data = await this._convRespository.getConversations(skip, count);

      // save to manager
      this._conversationManager.conversations =
        this._conversationManager.conversations.concat(data);

      // trigger ui update
      this.conversations.next(this._conversationManager.conversations); // this could cause a bug if the data is not loaded yet
    } else {
      throw new Error(
        "Skip can't be smaller than the length of the current conversation list"
      );
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
