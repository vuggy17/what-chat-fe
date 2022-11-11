import { Chat } from 'renderer/domain';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';
import { genMockChat } from 'renderer/mock/chats';
import HttpClient from 'renderer/services/http';
import { CHAT, CHAT_WITH_NAME } from 'renderer/config/api.routes';
import IDataSource from './type';

export interface IChatRepository {
  getChats(page?: number): Promise<{
    data: Chat[];
    pageNum: number;
    totalCount: number;
    totalPage: number;
  }>;
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

  async findChatByParticipantName(key: string) {
    return this._dataSource.get(`${CHAT_WITH_NAME}?name=${key}`);
  }

  async getChats(page = 1): Promise<{
    data: Chat[];
    pageNum: number;
    totalCount: number;
    totalPage: number;
  }> {
    const request = await this._dataSource.get(`${CHAT}?page=${page}`);
    const chats = request.data;
    return chats;
    // return fake data
    // const newitems = Array.from(
    //   {
    //     length: count,
    //   },
    //   () => genMockChat()
    // );

    // return new Promise((resolve, reject) =>
    //   setTimeout(() => {
    //     resolve(newitems);
    //   }, 500)
    // );
  }

  saveChat(chat: Chat): Promise<Chat> {
    // save chat to local database
    return new Promise((resolve, reject) => {
      resolve(chat);
    });
  }
}

export const chatRepository = new ChatRepositoryImpl(HttpClient);
