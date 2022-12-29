import CreateGroup from './pipeline/socket.creategroup';

export async function createGroup(memberIds: Id[]) {
  const handler = new CreateGroup();
  return handler.handle(memberIds);
}

export function foo() {}
