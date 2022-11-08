import IUser from './user.entity';

export type Chat = {
  id: Id;
  name: string;
  avatar?: string;
  status?: 'sending' | 'sent_error' | 'idle';
  lastMessage?: PreviewMessage;
  participants: IUser[];
  previewText: string;
  lastUpdate: number;
  // unreadCount: number;
  // pinned: boolean;
};

export type PreviewMessage = {
  createdAt: number;
  id: string;
  receiver: string;
  sender: string;
  text: string;
  updatedAt: number;
};

// use this to instance a new chat
export type ChatWithoutMeta = Pick<
  Chat,
  'participants' | 'name' | 'lastUpdate'
>;
