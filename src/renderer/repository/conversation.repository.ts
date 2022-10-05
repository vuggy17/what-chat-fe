import { Conversation } from 'renderer/entity';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';
import { conversation as data, genMockChat } from 'renderer/mock/conversation';
import { IHttp, OConveration } from 'renderer/shared/lib/network/type';
import HttpClient from 'renderer/services/http';

export interface IConversationRepository {
  getConversations(start?: number, count?: number): Promise<Conversation[]>;
  saveConversations(conversations: Conversation[]): Promise<void>;
}

class ConversationRepositoryImpl implements IConversationRepository {
  private _dataSource: IHttp;

  constructor(dataSource: IHttp) {
    this._dataSource = dataSource;
  }

  saveConversations(conversations: Conversation[]): Promise<void> {
    console.log('save conversations to local database');

    throw new Error('Method not implemented.');
  }

  async getConversations(
    start: number | undefined = 0,
    count: number | undefined = CONV_PAGE_SIZE
  ): Promise<Conversation[]> {
    // const request = await this._dataSource.get('/conversations', {
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

  saveConversation(conversation: Conversation): Promise<Conversation> {
    // save conversation to local database
    return new Promise((resolve, reject) => {
      resolve(conversation);
    });
  }
}

export const ConversationRepository = new ConversationRepositoryImpl(
  HttpClient
);
