export interface LocalChatSchema {
  type: ChatKind;
  id: string;
  name: string;
  avatar: string;
  participants: any[]; // user object
  lastMessage: any; // message object
  lastUpdate: number; // unix timestamp
}

export interface LocalPrivateChatSchema {
  id: string;
  chatId: string;
}
export enum ChatKind {
  group = 'group',
  private = 'private',
}
