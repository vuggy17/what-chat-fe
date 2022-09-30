export type Conversation = {
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
};
