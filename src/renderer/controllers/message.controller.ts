import messageManager, { MessageManager } from 'renderer/data/message.manager';
import { FileMessage, Message } from 'renderer/domain';
import { messages } from 'renderer/mock/message';
import {
  IMessageRespository,
  messsageRespository,
} from 'renderer/repository/message.respository';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
import {
  createMessage,
  createMsgPlaceholder,
} from 'renderer/usecase/message.usecase';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

// save uploading file for later retry
class MessageController {
  messages: BehaviorSubject<Message[]>;

  constructor(
    private manager: MessageManager,
    private repo: IMessageRespository
  ) {
    this.messages = new BehaviorSubject(new Array<Message>());
  }

  sendMessage(
    content: string | File,
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

        break;
      default:
        m = createMessage(content);

        break;
    }

    // send it

    // this.manager.messages = [...this.manager.messages, m!];

    // this.messages.next(this.manager.messages);
  }

  // // add message from external source to manager
  // async addMessages(chatId: Id, message: OMessage[]): Promise<void> {
  //   const internalMessages: Message[] = message.map((m) =>
  //     messageParser.toEntity(m)
  //   );

  //   this.manager.addMessagesToActiceChat(...internalMessages);
  //   this.manager.setCachedMessages(chatId, internalMessages);
  //   this.messages.next(this.manager.getCachedMessages(chatId));
  // }

  addMessage(message: Message) {
    this.manager.messages = [...this.manager.messages, message];
    this.messages.next(this.manager.messages);
  }

  // get message from external source or cached value
  async loadMoreMessages(
    chatId: Id,
    count: number = MSG_PAGE_SIZE
  ): Promise<void> {
    const data = await this.repo.getMessages(
      chatId,
      count,
      this.manager.messages.length
    );

    // this.manager.messages = [...data, ...this.manager.messages];
    const copy = this.manager.messages;
    copy.unshift(...data);

    this.manager.messages = copy;
    this.messages.next(copy);
  }

  async loadMessage(chatId: Id) {
    const cachedMessages = this.manager.getCachedMessages(chatId);
    // if cached is empty, ignore cached value and fetch from external source
    // else use it
    if (cachedMessages.length > 0) {
      this.manager.messages = cachedMessages;
    } else {
      const data = await this.repo.getMessages(chatId, MSG_PAGE_SIZE, 0);
      this.manager.messages = data;
    }

    this.messages.next(this.manager.messages);
  }

  async init(chatId: Id) {
    // const data = await this.repo.getMessages(chatId, MSG_PAGE_SIZE); // disable for now
    const data = messages;

    this.manager.messages = data;
    this.messages.next(data);
  }

  async uploadFile(
    file: File,
    meta: {
      chatId: Id;
      type: 'file' | 'photo';
      id: Id;
    }
  ) {
    const resp = await this.repo.uploadFile(file, meta);
    return { id: meta.id, ...resp };
  }

  notifyFileReady(fileId: Id, remoteUrl: string) {
    this.repo.notifyFileReady(fileId);

    // find message with this file id and change it uploaded property to true
    const index = this.manager.messages.findIndex((m) => m.id === fileId);
    if (index > -1) {
      const source = this.manager.messages[index] as FileMessage;
      const copy = { ...source, uploaded: true, path: remoteUrl };
      (this.manager.messages[index] as FileMessage) = copy;
    }
    this.messages.next(this.manager.messages);
  }

  getUploadProgress(fileId: Id) {
    return this.repo.getUploadProgress(fileId);
  }
}

const messageController = new MessageController(
  messageManager,
  messsageRespository
);

export default messageController;
