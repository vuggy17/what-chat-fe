import { Message } from 'renderer/domain';

interface ISocketClient {
  /**
   *
   * @param {Message} message
   * @return Promise<any> that resolve when request is success
   */
  sendPrivateMessage(message: Message): Promise<any>;
  /**
   *
   * @param id chatId
   * @return Promise<any> that resolve when request is success
   */
  sendGroupMessage(id: string): Promise<any>;
  /**
   *
   * @param id chatId
   * @return Promise<any> that resolve when request is success
   */
  sendFriendRequest(id: string): Promise<any>;
}

enum SocketEvents {
  SEND_PRIVATE_MESSAGE = 'send_private_message',
  ADD_FRIEND = 'add_friend',
  UN_FRIEND = 'un_friend',
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  [SocketEvents.ADD_FRIEND]: (id: string, onSuccess: (val) => any) => void;
  [SocketEvents.UN_FRIEND]: (id: string, onSuccess: (val) => any) => void;
  [SocketEvents.SEND_PRIVATE_MESSAGE]: (
    msg: Message,
    onSuccess: (val) => any
  ) => void;
}

interface SocketData {
  name: string;
  age: number;
}

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

export {
  OContact,
  OConveration,
  OMessage,
  SeenMessagePayload,
  ISocketClient,
  ServerToClientEvents,
  ClientToServerEvents,
  SocketEvents,
};
