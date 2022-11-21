/* eslint-disable import/prefer-default-export */
type MessageType = 'photo' | 'text' | 'file';
type Id = string;
type LocalId = string;
type MessageStatus =
  | 'error'
  | 'sent'
  | 'seen'
  | 'unsent'
  | 'received'
  | 'sending';

type ChannelType = 'private' | 'group';
type ImgThreshold = {
  width: number;
  height: number;
  size: string;
};
type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> &
  Partial<Pick<Type, Key>>;

type Result = {
  status: boolean;
  reason: string;
  data: any;
};

interface HasChildren {
  children: React.ReactNode | any;
}

type OperationResult = MakeOptional<Result, 'reason' | 'data'>;

declare module 'react-tiny-link';

// ({ toggleState }: { toggleState: () => void }) => JSX.Element;

/**
 * Mark some properties as required
 * @example
 * type User = {
  id: string
  name?: string
  email?: string
}
type UserWithName = WithRequired<User, 'name'>

// error: missing name
const user: UserWithName = {
  id: '12345',
}
 */
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
