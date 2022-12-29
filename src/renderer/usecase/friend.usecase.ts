import AcceptFriendRequestSocket from './pipeline/socket.acceptfrrequest';
import SendFriendRequestSocket from './pipeline/socket.sendfriendrequest';

export async function sendFriendRequest(friendId: Id) {
  const handler = new SendFriendRequestSocket();
  return handler.handle(friendId);
}

export function acceptFriendRequest(friendId: Id) {
  const handler = new AcceptFriendRequestSocket();
  return handler.handle(friendId);
}
