import ConversationController from 'renderer/controllers/conversation.controller';
import { BASEURL, SocketEvent } from 'renderer/shared/constants';
import { io, Socket } from 'socket.io-client';
import { OMessage } from './type';

class AppSocket {
  private _client: Socket;

  private _logger = console;

  constructor() {
    this._client = io(BASEURL, {
      withCredentials: true,
    });
    this._client.on('connect', () => this._logger.log('Client connected'));
    this._client.on('disconnect', () =>
      this._logger.log('Client disconnected')
    );
    this._client.on(SocketEvent.hasNewMessage, (payload: OMessage) => {
      console.log('You has new message!', payload);
      // const dispatch = GlobalPublisher.getListener(SocketEvent.receivedNewMsg);
      const dispatch = ConversationController.onMessageReceived;
      dispatch(payload);
    });
    // this._client.on(SocketEvent.dupplicateLogin, (_) => {
    //   const dispatch = GlobalPublisher.getListener(SocketEvent.dupplicateLogin);
    //   dispatch();
    //   this._client.disconnect();
    // });
    // this._client.on(SocketEvent.seen, (payload) => {
    //   console.log('seen ack', payload);
    // });
    this.initConnection();
  }

  initConnection(): void {
    if (!this._client.connected) {
      this._client.connect();
    }
  }

  send(eventName: SocketEvent, payload: any) {
    this._client.emit(eventName, { ...payload });
  }

  disconnect() {
    this._client.disconnect();
  }

  private isConnected(): boolean {
    return this._client.connected;
  }
}
export default AppSocket;
