import { Message } from 'renderer/entity';
import { genMockMsg, messages as data } from 'renderer/mock/message';
import HttpClient from 'renderer/services/http';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
import { IHttp, OMessage } from 'renderer/shared/lib/network/type';

export interface IMessageRespository {
  getMessages(chatId: Id, count: number, skip: number): Promise<Message[]>;
  saveMessages(messages: Message[]): Promise<void>;
}

export class MessageRespositoryImpl implements IMessageRespository {
  private _dataSource: IHttp;

  constructor(dataSource: IHttp) {
    this._dataSource = dataSource;
  }

  saveMessages(messages: Message[]): Promise<void> {
    console.log('save messages to local database');
    throw new Error('Method not implemented.');
  }

  async getMessages(
    chatId: string,
    count: number = MSG_PAGE_SIZE,
    skip = 0
  ): Promise<Message[]> {
    // const request = await this._dataSource.get('/messages', {
    //   chatId,
    //   count,
    //   start,
    // });
    // const messages = request.data;
    // parse data to Message
    // save to local database
    // return messages;

    return Array.from(
      {
        length: count,
      },
      genMockMsg
    ); // return fake data
  }
}

export const messsageRespository = new MessageRespositoryImpl(HttpClient);
