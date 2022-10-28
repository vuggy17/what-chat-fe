interface BaseMessage {
  id: LocalId;
  globalId: Id | null;
  type: MessageType;
  fromMe: boolean;
  senderId: Id;
  createdAt: Date;
  status: MessageStatus;
  chatId: Id;
}

export interface TextMessage extends BaseMessage {
  content: string;
}

export interface FileMessage extends BaseMessage {
  content?: File; // file object
  uploaded: boolean;
  name: string;
  size: number;
  path: string;
}

export type Message = TextMessage | FileMessage;
