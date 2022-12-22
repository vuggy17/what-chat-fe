import { Message } from 'renderer/domain';
import SocketClient from 'renderer/services/socket';
import { ISocketClient } from 'renderer/services/type';
import AbstractHandler from './definition';

export default class SendMessageSocket extends AbstractHandler<
  Message,
  Message
> {
  public handle(request: Message) {
    console.log('HANDLER: ', 'socket handler');

    return this.socketInstance.sendPrivateMessage(request);
  }

  constructor(private socketInstance: ISocketClient = SocketClient) {
    super();
  }
}
