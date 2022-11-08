import IUser from 'renderer/domain/user.entity';

interface BaseMessage {
  id: Id;
  type: MessageType;
  sender: IUser | any;
  receiver: IUser | any;
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

export interface TextMessageWithMetaData extends TextMessage {
  sender: IUser;
}

export interface FileMessageWithMetaData extends FileMessage {
  sender: IUser;
}

export type MessageWithTotalCount = { data: Message[]; total: number };
