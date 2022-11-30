import { ReactNode } from 'react';
import User from 'renderer/domain/user.entity';

type MessageBubbleProps = {
  self: boolean;
  type: MessageType;
  text: string;
  attachments?: string[];
  attachmentsMeta?: { name: string; size: number; path: string }[];
  localPath?: string;
  name?: string;
  size?: number;
  sender: User | any;
  time: number;
  hasAvatar?: boolean;
  uploaded?: boolean;
  chatId: Id | null;
  id: Id;
  status: MessageStatus;
};

type ImageBubbleProps = {
  attachmentsMeta?: { name: string; size: number; path: string }[]; // local file path
  attachments?: string[]; // remote file url
  description?: ReactNode;
  className?: string;
};
