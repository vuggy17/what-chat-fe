import IUser from './user.entity';

export type Chat = {
  id: Id;
  name: string;
  avatar?: string;
  status?: 'sending' | 'sent_error';
  online: 1 | 0; // 1:online, 0: offline;
  isGroup: boolean;
  lastMessage: Id | null;
  participants: Id[];
  preview: string;
  lastUpdate: Date;
  muted: boolean;
  unreadCount: number;
  typing: boolean;
  pinned: boolean;
};
export type ChatWithParticipants = {
  id: Id;
  name: string;
  avatar?: string;
  status?: 'sending' | 'sent_error';
  online: 1 | 0; // 1:online, 0: offline;
  isGroup: boolean;
  lastMessage: Id | null;
  participants: IUser[];
  preview: string;
  lastUpdate: Date;
  muted: boolean;
  unreadCount: number;
  typing: boolean;
  pinned: boolean;
};
