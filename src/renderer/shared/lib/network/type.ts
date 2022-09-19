import { AxiosError } from "axios";

interface IHttp {
  get<T>(endpoint: string, query?: any): Promise<any>;
  patch<T>(endpoint: string, data: any): Promise<any>;
  post<T>(endpoint: string, data: any): Promise<any>;
  delete<T>(endpoint: string, query?: any): Promise<any>;
  handleError(error: AxiosError): void;
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

export { IHttp, OContact, OConveration, OMessage, SeenMessagePayload };
