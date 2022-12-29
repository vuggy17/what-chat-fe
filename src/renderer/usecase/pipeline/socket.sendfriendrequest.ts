import User from 'renderer/domain/user.entity';
import { Message } from 'renderer/domain';
import SocketClient from 'renderer/services/socket';
import { ISocketClient } from 'renderer/services/type';
import AbstractHandler from './definition';

export default class SendFriendRequestSocket extends AbstractHandler<Id, User> {
  public handle(friendId: Id) {
    console.log('HANDLER: ', 'socket handler');

    return this.socketInstance.sendFriendRequest(friendId);
  }

  constructor(private socketInstance: ISocketClient = SocketClient) {
    super();
  }
}
