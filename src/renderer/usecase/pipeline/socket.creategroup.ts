import User from 'renderer/domain/user.entity';
import { Message } from 'renderer/domain';
import SocketClient from 'renderer/services/socket';
import { ISocketClient } from 'renderer/services/type';
import AbstractHandler from './definition';

export default class CreateGroup extends AbstractHandler<Id[], User> {
  public handle(memberIds: Id[]) {
    console.log('HANDLER: ', 'socket handler');

    return this.socketInstance.createGroup(memberIds);
  }

  constructor(private socketInstance: ISocketClient = SocketClient) {
    super();
  }
}
