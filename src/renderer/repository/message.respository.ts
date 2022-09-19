import { Message } from 'renderer/entity';
import { messages } from 'renderer/mock/message';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';

export interface IMessageRespository {
  getMessages(chatId: Id, count: number): Message[];
}

export class MessageRespositoryImpl implements IMessageRespository {
  private _dataSource: any;

  constructor(dataSource: any) {
    this._dataSource = dataSource;
  }

  getMessages(
    chatId: string,
    count: number = MSG_PAGE_SIZE,
    start?: number
  ): Message[] {
    return messages;
  }
}

export const MesssageRespository = new MessageRespositoryImpl();
