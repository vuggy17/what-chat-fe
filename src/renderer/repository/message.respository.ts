import { CHAT_MESSAGE } from 'renderer/config/api.routes';
import { Message, MessageWithTotalCount } from 'renderer/domain';
import { genMockMsg, messages as data } from 'renderer/mock/message';
import HttpClient from 'renderer/services/http';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
import { randomNumber } from 'renderer/utils/common';
import { resolveAfter } from 'renderer/utils/debouce';
import IDataSource from './type';

export interface IMessageRepository {
  getMessages(chatId: Id, offset: number): Promise<MessageWithTotalCount>;
  saveMessages(messages: Message[]): Promise<void>;
  uploadFile(file: File, meta: any): Promise<any>;
  getUploadProgress(fileId: Id): any;
  notifyFileReady(fileId: Id): any;
}

const fileUploading: Map<Id, any> = new Map();

export class MessageRepositoryImpl implements IMessageRepository {
  private _dataSource: IDataSource;

  constructor(dataSource: IDataSource) {
    this._dataSource = dataSource;
  }

  async getMessages(
    chatId: string,
    offset: number
  ): Promise<MessageWithTotalCount> {
    const res = await this._dataSource.get<MessageWithTotalCount>(
      `${CHAT_MESSAGE}?channelId=${chatId}&offset=${offset}`
    );
    if (res.error) {
      throw res.error;
    }
    return res.data as MessageWithTotalCount;
  }

  notifyFileReady(fileId: string): any {
    fileUploading.delete(fileId);
  }

  getUploadProgress(fileId: string): any {
    return fileUploading.get(fileId);
  }

  async uploadFile(
    file: File,
    meta: {
      chatId: Id;
      type: 'file' | 'photo';
      id: Id;
      percentage: number;
    }
  ): Promise<any> {
    // record upload status
    fileUploading.set(meta.id, {
      file,
      chatId: meta.chatId,
      type: meta.type,
      percentage: 50,
    });

    setTimeout(() => {
      fileUploading.set(meta.id, {
        file,
        chatId: meta.chatId,
        type: meta.type,
        percentage: 100,
      });
    }, 500);

    // fake upload
    // return a promise that resolve aftger 1s
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          path: 'https://picsum.photos/200/300',
          name: file.name,
          size: file.size,
        });
      }, 1000);
    });
  }

  saveMessages(messages: Message[]): Promise<void> {
    console.log('save messages to local database');
    throw new Error('Method not implemented.');
  }

  // async getMessages(
  //   chatId: string,
  //   count: number = MSG_PAGE_SIZE,
  //   skip = 0
  // ): Promise<Message[]> {
  //   // const request = await this._dataSource.get('/messages', {
  //   //   chatId,
  //   //   count,
  //   //   start,
  //   // });
  //   // const messages = request.data;
  //   // parse data to Message
  //   // save to local database
  //   // return messages;

  //   // return fake data
  //   console.log('====================================');
  //   console.log('re call this', chatId);
  //   console.log('====================================');
  //   return resolveAfter<Message[]>(
  //     Array.from(
  //       {
  //         length: count,
  //       },
  //       genMockMsg
  //     ),
  //     randomNumber(100, 600)
  //   );
  // }
}

export const messageRepository = new MessageRepositoryImpl(HttpClient);
