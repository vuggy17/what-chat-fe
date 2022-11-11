import { message } from 'antd';
import { Message, TextMessage } from 'renderer/domain';
import { BASEURL } from 'renderer/shared/constants';
import { io, Socket } from 'socket.io-client';
import {
  ISocketClient,
  HasNewMessagePayload,
  IServerToClientEvent,
  IClientToServerEvent,
  ServerToClientEvent,
  ClientToServerEvent,
} from './type';

class AppSocketClient implements ISocketClient {
  private readonly socketAdapter: Socket<
    IServerToClientEvent,
    IClientToServerEvent
  >;

  private static instance: AppSocketClient;

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

    this.socketAdapter.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socketAdapter.connect();
      }
      message.error('Chat server disconnected');
      console.error('Client disconnected', reason);
    });
  }

  /**
   * send an ack to server when client receive a message
   * @param chatId
   * @param receiverId
   * @param messageId
   */
  sendReceivedMessageAck(
    chatId: string,
    receiverId: string,
    messageId: string
  ): void {
    this.socketAdapter.emit(
      ClientToServerEvent.PRIVATE_MESSAGE_ACK,
      {
        chatId,
        receiverId,
        messageId,
      },
      () => console.log('Message ack received by server')
    );
  }

  static getInstance() {
    if (!AppSocketClient.instance) {
      AppSocketClient.instance = new AppSocketClient();
    }
    return AppSocketClient.instance;
  }

  sendPrivateMessage(message: Message): Promise<any> {
    // this.setup();

    return new Promise((resolve, reject) => {
      this.socketAdapter.emit(
        ClientToServerEvent.SEND_PRIVATE_MESSAGE,
        message,
        (res) => {
          resolve(res);
        }
      );
    });
  }

  setup() {
    if (this.socketAdapter.disconnected) {
      this.socketAdapter.connect();
    }
  }

  /**
   *
   * @param {ServerToClientEvent} eventName declare in ServerToClientEvent enum
   */
  removeEventlistener(eventName) {
    this.socketAdapter.off(eventName);
  }

  /**
   * function that will be called when client received message from server
   * @param handler function that handle the event
   */
  addListenToPrivateMessageEvent(
    handler: (payload: HasNewMessagePayload) => void
  ) {
    this.socketAdapter.on(
      ServerToClientEvent.HAS_NEW_MESSAGE,
      // (payload: any) => console.log('HAS NEW MESSAGE PAYLOAD', payload)
      (payload: HasNewMessagePayload, ack: any) => {
        handler(payload);
        ack('received');
        console.log(ack);
      }
      // handler(payload)
    );
  }

  sendGroupMessage(id: string): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  sendFriendRequest(id: string): Promise<unknown> {
    this.setup();
    return new Promise((resolve, reject) => {
      this.socketAdapter.emit(ClientToServerEvent.ADD_FRIEND, id, (res) => {
        resolve(res);
      });
    });
  }

  unFriend(id: string): Promise<unknown> {
    this.setup();
    return new Promise((resolve, reject) => {
      this.socketAdapter.emit(ClientToServerEvent.UN_FRIEND, id, (res) => {
        resolve(res);
      });
    });
  }

  disconnect() {
    this.socketAdapter.disconnect();
  }
}

const SocketClient = AppSocketClient.getInstance();

export default SocketClient;
