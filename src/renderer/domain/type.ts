interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  addFriend: (id: string, onSuccess: (arg: any) => void) => void;
  sendPrivateMessage: (id: string, onSuccess: (arg: any) => void) => void;
  sendGroupMessage: (id: string, onSuccess: (arg: any) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  addFriend: (id: string, onSuccess: () => void) => void;
  sendPrivateMessage: (id: string, onSuccess: (arg: any) => void) => void;
  sendGroupMessage: (id: string, onSuccess: (arg: any) => void) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
};
