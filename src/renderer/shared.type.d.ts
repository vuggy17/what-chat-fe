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
