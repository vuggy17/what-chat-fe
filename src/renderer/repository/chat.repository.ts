import { Chat } from 'renderer/domain';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';
import { genMockChat } from 'renderer/mock/chats';
import HttpClient from 'renderer/services/http';
import IDataSource from './type';

export interface IChatRepository {
  getChats(start?: number, count?: number): Promise<Chat[]>;
  saveChats(chats: Chat[]): Promise<void>;
  // createChat(chat: Id[]): Promise<Chat>;
}

class ChatRepositoryImpl implements IChatRepository {
  public _dataSource: IDataSource;

  constructor(dataSource: IDataSource) {
    this._dataSource = dataSource;
  }

  saveChats(chats: Chat[]): Promise<void> {
    console.log('save chats to local database');

    throw new Error('Method not implemented.');
  }

  async getChats(
    start: number | undefined = 0,
    count: number | undefined = CONV_PAGE_SIZE
  ): Promise<Chat[]> {
    // const request = await this._dataSource.get('/chats', {
    //   start,
    //   count,
    // });
    // const chats = request.data;
    // return chats
    const newitems = Array.from(
      {
        length: count,
      },
      () => genMockChat()
    );
    console.log('newitems', newitems.length);

    // return fake data
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        resolve(newitems);
      }, 500)
    );
  }

  saveChat(chat: Chat): Promise<Chat> {
    // save chat to local database
    return new Promise((resolve, reject) => {
      resolve(chat);
    });
  }
}

export const chatRepository = new ChatRepositoryImpl(HttpClient);
