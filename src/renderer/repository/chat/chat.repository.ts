import { LocalDb } from 'renderer/services/localdb';
import { Chat } from 'renderer/domain';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';
import { genMockChat } from 'renderer/mock/chats';
import HttpClient from 'renderer/services/http';
import {
  CHAT,
  CHAT_WITH_NAME,
  CHAT_WITH_MESSAGE,
} from 'renderer/config/api.routes';
import IDataSource from '../type';

export interface IChatRepository {
  getChats(page?: number): Promise<{
    data: Chat[];
    extra: { pageNum: number; totalCount: number; totalPage: number };
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
    extra: { pageNum: number; totalCount: number; totalPage: number };
  }> {
    const response = await this._dataSource.get(
      `${CHAT_WITH_MESSAGE}?page=${page}`
    );
    const { data, pageNum, totalCount, totalPage } = response.data;
    return {
      data,
      extra: { pageNum, totalCount, totalPage },
    };
  }

  saveChat(chat: Chat): Promise<Chat> {
    // save chat to local database
    return new Promise((resolve, reject) => {
      resolve(chat);
    });
  }

  /**
   * get chat of contact using local database
   */
  async getChatOfContact(contactId: Id) {
    try {
      const db = LocalDb.instance_force();
      if (db instanceof Error) {
        throw db;
      } else {
        const result = await db.privateChat.get(contactId);
        if (result) {
          const chat = await db.chats.get(result.chatId);
          return chat;
        }
        return undefined;
      }
    } catch (error) {
      throw new Error('Cannot get chat of contact');
    }
  }
}

export const chatRepository = new ChatRepositoryImpl(HttpClient);
