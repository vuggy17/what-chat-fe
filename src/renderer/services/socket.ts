import {
  ClientToServerEvents,
  ISocketClient,
  ServerToClientEvents,
  SocketEvents,
} from 'renderer/services/type';
import { BASEURL } from 'renderer/shared/constants';
import { io, Socket } from 'socket.io-client';

class AppSocketClient implements ISocketClient {
  private readonly socketAdapter: Socket<
    ServerToClientEvents,
    ClientToServerEvents
  >;

  constructor() {
    this.socketAdapter = io(BASEURL, {
      withCredentials: true,
    });
    this.socketAdapter.on('connect', () => {
      console.log('connected');
    });
    this.socketAdapter.on('connect_error', (err) => {
      console.error('error', err);
    });
  }

  sendPrivateMessage(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  sendGroupMessage(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  sendFriendRequest(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socketAdapter.emit(SocketEvents.ADD_FRIEND, id, (res) =>
        resolve(res)
      );
    });
  }
}

const SocketClient = new AppSocketClient();

export default SocketClient;
