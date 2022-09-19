export type Message = {
  id: LocalId;
  globalId: Id | null;
  content: string | any;
  type: MessageType;
  fromMe: boolean;
  createdAt: Date;
  status: MessageStatus;
};
