import CreateGroup from './pipeline/socket.creategroup';

export async function createGroup(memberIds: Id[]) {
  const handler = new CreateGroup();
  return handler.handle(memberIds);
}

export async function uploadGroupAvatar(avatar: File) {
  const handler = new UploadGroupAvatar();
  return handler.handle(avatar);
}
export function foo() {}
