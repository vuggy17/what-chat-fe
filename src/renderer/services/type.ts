import { Message } from 'renderer/domain';

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
   * @param id chatId
   * @return Promise<any> that resolve when request is success
   */
  sendGroupMessage(id: string): Promise<unknown>;
  /**
   *
   * @param id chatId
   * @return Promise<any> that resolve when request is success
   */
  sendFriendRequest(id: string): Promise<unknown>;
}

export enum ClientToServerEvent {
  SEND_PRIVATE_MESSAGE = 'send_private_message',
  PRIVATE_MESSAGE_ACK = 'private_message_ack',
  ADD_FRIEND = 'add_friend',
  UN_FRIEND = 'un_friend',
  // TEST = 'TEST',
  SEEN_MESSAGE = 'seen_message',
}
export enum ServerToClientEvent {
  HAS_NEW_MESSAGE = 'has_new_message',
  TEST = 'TEST_ACK',
  SEEN_MESSAGE = 'seen_message',
  MESSAGE_RECEIVED_BY = 'message_received_by',
  // ADD_FRIEND_RES = 'add_friend_res',
  // UN_FRIEND_RES = 'un_friend_res',
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
  [ServerToClientEvent.TEST]: (payload: any, ackFn: (res: any) => void) => void;
  [ServerToClientEvent.MESSAGE_RECEIVED_BY]: EventListener<PrivateMessageReceivedByPayload>;
  [ServerToClientEvent.SEEN_MESSAGE]: EventListener<SeenMessagePayload>;
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
}

export type HasNewMessagePayload = {
  chatId: Id;
  message: Message;
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

export { SeenMessagePayload, ISocketClient };
