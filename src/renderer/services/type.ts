import { Message, TextMessage } from 'renderer/domain';

interface ISocketClient {
  sendReceivedMessageAck(chatId: Id, receiverId: Id, message: Id): void;
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
}
export enum ServerToClientEvent {
  HAS_NEW_MESSAGE = 'has_new_message',
  ADD_FRIEND_RES = 'add_friend_res',
  UN_FRIEND_RES = 'un_friend_res',
}

type EventListenerWithAck = (payload: any, ack: (res: any) => void) => void;
export interface IServerToClientEvent {
  [ServerToClientEvent.HAS_NEW_MESSAGE]: EventListenerWithAck;
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
    { chatId, receiverId, messageId }: PrivateMessageAcknowledgePayload,
    onSuccess: (val) => void
  ) => void;
}

export type HasNewMessagePayload = {
  chatId: Id;
  message: Message;
};

export type PrivateMessageAcknowledgePayload = {
  chatId: string;
  receiverId: string;
  messageId: string;
};

export type SendMessageResponse = {
  code: number;
  message: string;
  data: HasNewMessagePayload;
};
/** Type returned from remote server */
type OContact = {
  id: Id;
  email: string;
  name: string;
  avatar: string;
};

type OConveration = {
  id: Id;
  chatUsers: OContact[];
  lastMessageId: number;
  previewMessage:
    | {
        message: string;
        type: MessageType;
      }
    | string;
  lastUpdate: string;
  unreadCount: number;
};

type OMessage = {
  id: LocalId;
  globalId: Id | null;
  senderId: Id;
  chatId: Id;
  content: string;
  createdAt: string;
  updatedAt: string;
  type: MessageType;
  status: MessageStatus;
};

interface SeenMessagePayload {
  userId: number;
  convId: number;
  messageId?: number;
}

export { OContact, OConveration, OMessage, SeenMessagePayload, ISocketClient };
