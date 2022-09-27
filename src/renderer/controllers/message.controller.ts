import { message } from 'antd';
import messageManager, { MessageManager } from 'renderer/data/message.manager';
import { Message } from 'renderer/entity';
import { conversation } from 'renderer/mock/conversation';
import { genMockMsg, messages } from 'renderer/mock/message';
import {
  IMessageRespository,
  messsageRespository,
} from 'renderer/repository/message.respository';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
import { OMessage } from 'renderer/shared/lib/network/type';
import { createMsgPlaceholder } from 'renderer/usecase/message.usecase';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { messageParser } from './adapter';

class MessageController {
  messages: BehaviorSubject<Message[]>;

  constructor(
    private manager: MessageManager,
    private repo: IMessageRespository
  ) {
    this.messages = new BehaviorSubject(new Array<Message>());
  }

  sendMessage(
    content: File | string,
    meta: {
      type: 'file' | 'photo' | 'text';
      chatId: Id;
    }
  ) {
    // contruct message
    let m: Message;
    switch (meta.type) {
      case 'file':
        // TODO: upload file
        break;
      case 'photo':
        // TODO: upload photo
        break;
      case 'text':
        m = createMsgPlaceholder(content).text();

        break;
      default:
        m = createMsgPlaceholder(content).text();

        break;
    }

    this.manager.addMessages(m!);

    // const cachedmsg = this.manager.getCachedMessages(meta.chatId);
    // console.log(this.manager.messages);

    // this.manager.setCachedMessages(meta.chatId, cachedmsg.concat(m!));

    this.messages.next(this.manager.messages);
  }

  // add message from external source to manager
  async addMessages(chatId: Id, message: OMessage[]): Promise<void> {
    const internalMessages: Message[] = message.map((m) =>
      messageParser.toEntity(m)
    );

    this.manager.addMessages(...internalMessages);
    this.manager.setCachedMessages(chatId, internalMessages);
    this.messages.next(this.manager.getCachedMessages(chatId));
  }

  // get message from external source or cached value
  async getMessages(
    chatId: Id,
    skip = 0,
    count: number = MSG_PAGE_SIZE * 2
  ): Promise<void> {
    const cached = this.manager.getCachedMessages(chatId);
    this.manager.messages = cached;

    if (cached.length < count + skip) {
      const data = await this.repo.getMessages(chatId, count, skip);

      this.manager.addMessages(data);
    }

    this.messages.next(this.manager.messages);
  }

  async init(chatId: Id) {
    // const data = await this.repo.getMessages(chatId, MSG_PAGE_SIZE); // disable for now
    const data = messages;

    this.manager.messages = data;
    this.messages.next(data);
  }
}

const messageController = new MessageController(
  messageManager,
  messsageRespository
);

export default messageController;
