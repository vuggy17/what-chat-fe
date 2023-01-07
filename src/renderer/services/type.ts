import User from 'renderer/domain/user.entity';
import { Chat, Message } from 'renderer/domain';
import { Group } from '../domain/type';

interface ISocketClient {
  seenMessage(
    chatId: Id,
    messageId: Id,
    userId: Id,
    toId: Id,
    time: number
  ): void;

  sendReceivedMessageAck(
    address: Id,
    meta: { chatId: Id; receiverId: Id; messageId: Id }
  ): void;
  /**
   *
   * @param {Message} message
   * @return Promise<any> that resolve when request is success
   */
  sendPrivateMessage(message: Message): Promise<SendMessageResponse>;
  /**
   *
   * @param {Message} message
   * @return Promise<any> that resolve when request is success
   */
  sendGroupMessage(message: Message): Promise<SendMessageResponse>;
  /**
   *
   * @param id userId
   * @return Promise<User> that resolve when request is success
   */
  sendFriendRequest(id: string): Promise<User>;

  /**
   *
   * @param id userId
   * @return Promise<User> that resolve when request is success
   */
  acceptFrRequest(id: Id): Promise<User>;

  createGroup(payload: Group): Promise<any>;
}

export enum ClientToServerEvent {
  SEND_PRIVATE_MESSAGE = 'send_private_message',
  PRIVATE_MESSAGE_ACK = 'private_message_ack',
  ADD_FRIEND = 'add_friend',
  UN_FRIEND = 'un_friend',
  // TEST = 'TEST',
  SEEN_MESSAGE = 'seen_message',
  SEND_GROUP_MESSAGE = 'send_group_message',
  ACCEPT_FRIEND_REQUEST = 'accept_friend_request',
  CREATE_GROUP = 'create_group',
}

export enum ServerToClientEvent {
  ADDED_TO_GROUP = 'added_to_group',
  HAS_NEW_MESSAGE = 'has_new_message',
  MESSAGE_RECEIVED_BY = 'message_received_by',
  SEEN_MESSAGE = 'seen_message',
  FRIEND_REQUEST_ACCEPTED = 'friend_request_accepted',
}

export type EventListenerWithAck<T> = (
  payload: T,
  ack: (ackPayload: unknown) => void
) => void;

export type EventListener<T> = (payload: T) => void;
export interface IServerToClientEvent {
  [ServerToClientEvent.HAS_NEW_MESSAGE]: (
    payload: any,
    ackFn: (res: any) => void
  ) => void;
  [ServerToClientEvent.MESSAGE_RECEIVED_BY]: EventListener<PrivateMessageReceivedByPayload>;
  [ServerToClientEvent.SEEN_MESSAGE]: EventListener<SeenMessagePayload>;
  [ServerToClientEvent.FRIEND_REQUEST_ACCEPTED]: EventListener<AcceptFriendPayload>;
}

export interface IClientToServerEvent {
  [ClientToServerEvent.SEND_PRIVATE_MESSAGE]: (
    payload: Message,
    onSuccess: (val) => void
  ) => void;
  [ClientToServerEvent.ADD_FRIEND]: (
    id: string,
    onSuccess: (val) => void
  ) => void;
  [ClientToServerEvent.UN_FRIEND]: (
    id: string,
    onSuccess: (val) => void
  ) => void;
  [ClientToServerEvent.PRIVATE_MESSAGE_ACK]: (
    { address, meta }: PrivateMessageAcknowledgePayload,
    onSuccess: (val) => void
  ) => void;
  // [ClientToServerEvent.TEST]: (payload: any) => void;
  [ClientToServerEvent.SEEN_MESSAGE]: (payload: SeenMessagePayload) => void;
  [ClientToServerEvent.SEND_GROUP_MESSAGE]: (
    payload: Message,
    onSuccess: (val) => void
  ) => void;
  [ClientToServerEvent.ACCEPT_FRIEND_REQUEST]: (
    id: string,
    onSuccess: (val) => void
  ) => void;

  [ClientToServerEvent.CREATE_GROUP]: (
    payload: Group,
    onSuccess: (val) => void
  ) => void;
}

export type HasNewMessagePayload = {
  chatId: Id;
  message: Message;
  chat: Chat | false;
};

export type PrivateMessageReceivedByPayload = Pick<
  PrivateMessageAcknowledgePayload,
  'meta'
>['meta'];

export type PrivateMessageAcknowledgePayload = {
  address: Id;
  meta: { chatId: string; receiverId: string; messageId: string };
};

export type SendMessageResponse = {
  code: number;
  message: string;
  data: HasNewMessagePayload;
};
interface SeenMessagePayload {
  userId: Id;
  chatId: Id;
  messageId: Id;
  toId: Id;
  time: number; // seen unix timestamp
}

export type AcceptFriendPayload = User;

export { SeenMessagePayload, ISocketClient };
