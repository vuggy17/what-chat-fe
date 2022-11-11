import { PreviewMessage } from './message.entity';
import User from './user.entity';

export type Chat = {
  id: Id;
  name: string;
  avatar?: string;
  status?: 'sending' | 'sent_error' | 'idle';
  lastMessage?: PreviewMessage;
  participants: User[];
  lastUpdate: number;
  // unreadCount: number;
  // pinned: boolean;
};

// use this to instance a new chat
export type ChatWithoutMeta = Pick<
  Chat,
  'participants' | 'name' | 'lastUpdate'
>;
