export type CreateGroupPayload = {
  name: string;
  members: Id[];
  avatar: File;
};

export type Group = {
  name: string;
  avatar: string;
  members: Id[];
};

export type FriendRequest = {
  receiverId: { name: string; id: string; avatar: string };
  senderId: { name: string; id: string; avatar: string };
  id: Id;
};
