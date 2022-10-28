import { AxiosError } from 'axios';

interface IHttp {
  get<T>(endpoint: string, query?: any): Promise<any>;
  patch<T>(endpoint: string, data: any): Promise<any>;
  post<T>(endpoint: string, data: any): Promise<any>;
  delete<T>(endpoint: string, query?: any): Promise<any>;
  handleError(error: AxiosError): void;
}

interface ISocketClient {
  /**
   *
   * @param id chatId
   * @return Promise<any> that resolve when request is success
   */
  sendPrivateMessage(id: string): Promise<any>;
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
}

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  [SocketEvents.ADD_FRIEND]: (id: string, onSuccess: (val) => any) => void;
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
  conversationId: Id;
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
  IHttp,
  OContact,
  OConveration,
  OMessage,
  SeenMessagePayload,
  ISocketClient,
  ServerToClientEvents,
  ClientToServerEvents,
  SocketEvents,
};
