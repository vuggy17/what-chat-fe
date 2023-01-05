import User from 'renderer/domain/user.entity';
import {
  ISocketClient,
  HasNewMessagePayload,
  IServerToClientEvent,
  IClientToServerEvent,
  ServerToClientEvent,
  ClientToServerEvent,
  EventListenerWithAck,
  EventListener,
  PrivateMessageReceivedByPayload,
  SeenMessagePayload,
  AcceptFriendPayload,
  SendMessageResponse,
} from 'renderer/services/type';
import { message } from 'antd';
import { Message, TextMessage } from 'renderer/domain';
import { BASEURL } from 'renderer/shared/constants';
import { io, Socket } from 'socket.io-client';
import { Group } from 'renderer/domain/type';

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
  }

  sendGroupMessage(msg: Message): Promise<SendMessageResponse> {
    return new Promise((resolve, reject) => {
      this.socketAdapter.emit(
        ClientToServerEvent.SEND_GROUP_MESSAGE,
        msg,
        (res) => {
          resolve(res);
        }
      );
    });
  }

  acceptFrRequest(id: string): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      this.socketAdapter.emit(
        ClientToServerEvent.ACCEPT_FRIEND_REQUEST,
        id,
        (res) => resolve(res)
      );
    });
  }

  createGroup(payload: Group): Promise<any> {
    return new Promise<Group>((resolve, reject) => {
      this.socketAdapter.emit(
        ClientToServerEvent.CREATE_GROUP,
        payload,
        (res) => resolve(res)
      );
    });
  }

  /** send seen signal to chat
   * @param userId my user id
   */
  seenMessage(
    chatId: Id,
    messageId: Id,
    userId: Id,
    toId: Id,
    time: number
  ): void {
    this.socketAdapter.volatile.emit(ClientToServerEvent.SEEN_MESSAGE, {
      chatId,
      messageId,
      userId,
      toId,
      time,
    });
  }

  /**
   * send an ack to server when client receive a message
   * @param chatId
   * @param receiverId
   * @param messageId
   */
  sendReceivedMessageAck(
    address: string,
    meta: { chatId: string; receiverId: string; messageId: string }
  ): void {
    this.socketAdapter.emit(
      ClientToServerEvent.PRIVATE_MESSAGE_ACK,
      { address, meta },
      (args) => console.log('Message ACK received with', args)
    );
  }

  static getInstance() {
    if (!AppSocketClient.instance) {
      AppSocketClient.instance = new AppSocketClient();
    }
    return AppSocketClient.instance;
  }

  sendPrivateMessage(msg: Message): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socketAdapter.emit(
        ClientToServerEvent.SEND_PRIVATE_MESSAGE,
        msg,
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

  // /**
  //  * function that will be called when client received message from server
  //  * @param handler function that handle the event
  //  */
  // addListenToPrivateMessageEvent(
  //   handler: (payload: HasNewMessagePayload) => void
  // ) {
  //   this.socketAdapter.on(ServerToClientEvent.HAS_NEW_MESSAGE, handler);
  // }

  /**
   * Register a callback to handle event from server
   * @param eventName Server to client event name
   * @param handler handler func
   */
  addEventHandler(
    eventName: ServerToClientEvent,
    handler:
      | EventListenerWithAck<HasNewMessagePayload>
      | EventListener<PrivateMessageReceivedByPayload>
      | EventListener<SeenMessagePayload>
      | EventListener<AcceptFriendPayload>
  ) {
    this.socketAdapter.on(eventName, handler);
  }

  sendFriendRequest(id: Id): Promise<User> {
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
