import User from 'renderer/domain/user.entity';

interface BaseMessage {
  id: Id;
  type: MessageType;
  sender: User | any;
  receiver: User | any;
  createdAt: number; // Unix timestamp
  status: MessageStatus;
  chatId: Id | null; // group chat id
}
export interface TextMessage extends BaseMessage {
  text: string;
}

export interface FileMessage extends BaseMessage {
  text: string;
  attachments?: File; // file object
  uploaded: boolean;
  name: string;
  size: number;
  path: string;
}

export type Message = TextMessage | FileMessage;

export type PreviewMessage = Message & {
  receiverName: string; // receiver name
  senderName: string; // sender name
};

export type MessageWithTotalCount = { data: Message[]; total: number };
