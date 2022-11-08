import { useSetRecoilState } from 'recoil';
import chatManager, { ChatManager } from 'renderer/data/chat.manager';
import messageManager, { MessageManager } from 'renderer/data/message.manager';
import { Chat, Message } from 'renderer/domain';
import { genMockChat } from 'renderer/mock/chats';
import {
  chatRepository,
  IChatRepository,
} from 'renderer/repository/chat.repository';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';
import { OConveration, OMessage } from 'renderer/services/type';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { quickSort } from 'renderer/utils/common';
import { chatParser } from './adapter';

class C {
  activeChat: BehaviorSubject<Id>;

  chats: BehaviorSubject<Chat[]>;

  constructor(
    private _messageManager: MessageManager,
    private _chatManager: ChatManager,
    private _convRespository: IChatRepository
  ) {
    this.activeChat = new BehaviorSubject(this._chatManager.activeChatId);
    this.chats = new BehaviorSubject([] as Chat[]);
  }

  async init() {
    // flush old data
    this._chatManager.chats = [];
    this._chatManager.activeChatId = null;
    this._messageManager.messages = [];

    // load chat list
    const internalchat = await this._convRespository.getChats();
    // const data = quickSort<Chat>(internalchat, 'lastUpdate', 'desc');
    const data = [];
    // save to manager
    this._chatManager.chats = [...this._chatManager.chats, ...data];

    // set active chat
    // chat list must be sorted by lastUpdate
    const firstChatId = data[0].id;
    this._chatManager.activeChatId = firstChatId;

    console.log('firstChatId', firstChatId);
    // trigger ui update
    this.chats.next(data);
    this.activeChat.next(firstChatId);
  }

  onMessageReceived(message: OMessage) {
    // check if chat exist
    const chat = this._chatManager.getChat(message.chatId);
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

  addchat(v: Chat) {
    this._chatManager.chats.push(v);
    this.chats.next(this._chatManager.chats);
  }

  updateConverstationMeta(id: Id, meta: Partial<Chat>) {
    const index = this._chatManager.chats.findIndex((item) => item.id === id);
    if (index !== -1) {
      this._chatManager.chats[index] = Object.assign(
        this._chatManager.chats[index],
        meta
      );
      this.chats.next(this._chatManager.chats);
    }
  }

  addConverstaion(v: OConveration) {
    const validChat = chatParser.toEntity({} as OConveration);

    this._chatManager.chats = [validChat, ...this._chatManager.chats];
  }

  setActiveChat(chatId: Id) {
    this._chatManager.activeChatId = chatId;
    this.activeChat.next(chatId);
  }

  getChatMeta(chatId: Id) {
    return this._chatManager.getChat(chatId);
  }

  /** get chat list
   * @param from: the number of chat to skip
   */
  async loadChat(skip: number, count = CONV_PAGE_SIZE) {
    if (skip >= this._chatManager.chats.length - 1) {
      // const data = await this._convRespository.getChats(skip, count);

      // save to manager
      this._chatManager.chats = this._chatManager.chats.concat(data);

      // trigger ui update
      this.chats.next(this._chatManager.chats); // this could cause a bug if the data is not loaded yet
    } else {
      throw new Error(
        "Skip can't be smaller than the length of the current chat list"
      );
    }
  }
}

const chatController = new C(messageManager, chatManager, chatRepository);
export default chatController;
