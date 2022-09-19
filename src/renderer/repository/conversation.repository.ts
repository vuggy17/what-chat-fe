import { Conversation } from 'renderer/entity';
import { CONV_PAGE_SIZE } from 'renderer/shared/constants';
import { convdata } from 'renderer/mock/conversation';

export interface IConversationRepository {
  getConversations(start?: number, count?: number): Promise<Conversation[]>;
}

class ConversationRepositoryImpl implements IConversationRepository {
  private _dataSource: any;

  constructor(dataSource: any) {
    this._dataSource = dataSource;
  }

  getConversations(
    start?: number | undefined = 0,
    count?: number | undefined = CONV_PAGE_SIZE
  ): Promise<Conversation[]> {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        resolve(convdata);
      }, 2000)
    );
  }
}

export const ConversationRepository = new ConversationRepositoryImpl(1);
