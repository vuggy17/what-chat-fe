import { CONV_PAGE_SIZE } from 'renderer/shared/constants';
import IDataSource from 'renderer/repository/type';
import LocalDb from 'renderer/services/localdb';

export default class LocalChatDataSource implements IDataSource {
  private queryAdapter: LocalDb;

  constructor(dbName: string) {
    this.queryAdapter = LocalDb.getInstance(dbName);
  }

  get<T>(meta: any, config?: any): Promise<any> {
    if (!config) {
      return this.queryAdapter.chats
        .orderBy('lastUpdate')
        .limit(CONV_PAGE_SIZE)
        .toArray();
    }
    throw new Error('Method not implemented.');
  }

  save<T>(data: any, config?: any): Promise<any> {
    return this.queryAdapter.chats.add(data);
  }

  update<T>(meta: any, config?: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  delete<T>(meta: any, config?: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  handleError(error: any): void {
    throw new Error('Method not implemented.');
  }
}
