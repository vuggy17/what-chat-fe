/* eslint-disable promise/catch-or-return */
import { SendOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Divider,
  Image,
  Input,
  message,
  Popover,
  Space,
  Typography,
} from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { ALL_USER, FRIEND } from 'renderer/config/api.routes';
import { Chat, Message } from 'renderer/domain';
import User from 'renderer/domain/user.entity';
import { useChatItem } from 'renderer/hooks/use-chat';
import { draffMessageState } from 'renderer/hooks/use-chat-message';
import { currentUser as userState } from 'renderer/hooks/use-user';
import SocketClient from 'renderer/services/socket';
import { addMessageToChat } from 'renderer/usecase/conversation.usecase';
import {
  createMsgPlaceholder,
  sendMessageOnline,
} from 'renderer/usecase/message.usecase';

const INITIAL_CHAT_ID = '';

function TinyChatBox({ receiver }: { receiver: User }) {
  const { upsertListItem: updateOrInsertChatItem, getChatItemByParticipants } =
    useChatItem(receiver.id);
  const currentUser = useRecoilValue(userState);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const insertOne_Draff = useRecoilCallback(
    ({ set }) =>
      (id: Id, m: Message) => {
        set(draffMessageState(id), (prev) => [...prev, m]);
      }
  );
  const onSend = (text: string) => {
    if (currentUser) {
      // const msg = createMsgPlaceholder(currentUser, receiver, text).text();
      // const chat = getChatItemByParticipants([currentUser, receiver]);
      // let chatUpdate: Partial<Chat> = {};
      // if (chat) {
      //   chatUpdate = {
      //     status: 'sending',
      //     lastUpdate: msg.createdAt,
      //     previewText: msg.text,
      //   };
      // } else {
      //   // if a chat not existed, create new one
      //   chatUpdate = {
      //     status: 'sending',
      //     lastUpdate: msg.createdAt,
      //     name: receiver.name,
      //     avatar: receiver.avatar,
      //     participants: [receiver, currentUser],
      //   };
      //   console.log('my chat update', chatUpdate);
      // }
      // // we don't add message to chat here
      // addMessageToChat(receiver.id, msg, {
      //   insertMessage: insertOne_Draff,
      //   updateChat: updateOrInsertChatItem,
      //   updates: chatUpdate,
      // });
      // sendMessageOnline(msg, SocketClient)
      //   .then((res) => {
      //     console.log('message successfully delivered to server', res);
      //     return null;
      //   })
      //   .catch((err) => console.error(err));
    }
  };
  return (
    <div>
      <Space direction="horizontal">
        <Avatar src={receiver.avatar} />
        <div className="flex flex-col">
          <Typography.Text>{receiver.name}</Typography.Text>
          <Typography.Text className="text-sm" type="secondary">
            @{receiver.userName}
          </Typography.Text>
        </div>
      </Space>
      <div className="h-8" />
      <Input.Search
        // size="small"
        placeholder="Say hi."
        enterButton={<SendOutlined />}
        onSearch={onSend}
        // suffix={<SendOutlined />}
      />
    </div>
  );
}

export default function Friends() {
  const [users, setUsers] = useState(new Array<User>());
  const [friends, setFriends] = useState(new Set<string>()); // array of IUser to enforce there is no duplicate friend

  useEffect(() => {
    const cancelSignal = new AbortController();
    const cancelSignal1 = new AbortController();
    const fetchUsers = async () => {
      return axios.get(ALL_USER, { signal: cancelSignal.signal });
    };

    const fetchFriends = async () => {
      return axios.get(FRIEND, { signal: cancelSignal1.signal });
    };

    fetchFriends()
      .then((res) =>
        setFriends(new Set(res.data.map((user) => JSON.stringify(user))))
      )
      .catch((err) => console.error(err));

    fetchUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));

    return () => cancelSignal.abort();
  }, []);

  const addFriend = (id) => {
    SocketClient.sendFriendRequest(id).then((res) => {
      const others = users.filter((f) => f.id !== id);
      setUsers(others);
      setFriends((fs) => fs.add(JSON.stringify(res.data)));
      message.success('Friend added');
      return null;
    });
  };

  const unFriend = (id) => {
    SocketClient.unFriend(id).then((res) => {
      const others = users.filter((f) => f.id !== id);
      setUsers([...others, res.data]);
      setFriends((fs) => {
        fs.delete(JSON.stringify(res.data));
        return fs;
      });
      message.success('Friend removed');

      return null;
    });
  };

  return (
    <div>
      <Divider>Friends</Divider>
      <div className="grid grid-cols-8 gap-3">
        {friends.size > 0 ? (
          Array.from(friends).map((f) => {
            const user = JSON.parse(f);
            return (
              <div
                className=" flex flex-col items-center gap-3 pb-2 justify-center bg-white shadow-sm rounded "
                key={user.id}
              >
                <Image
                  src={user.avatar || ''}
                  placeholder
                  width="100%"
                  height="100%"
                  className="object-cover"
                />
                <Typography.Text>{user.name || user.userName}</Typography.Text>
                <div className="flex w-full gap-2 justify-center">
                  <Button onClick={() => unFriend(user.id)}>Unfriend</Button>
                  {/* <Popover
                    placement="topRight"
                    title="Send a message"
                    trigger="click"
                    content={<TinyChatBox receiver={user} />}
                  >
                    <Button
                      // onClick={() => addUserToChat([user])}
                      type="primary"
                    >
                      Open chat
                    </Button>
                  </Popover> */}
                </div>
              </div>
            );
          })
        ) : (
          <Typography.Text>No Users</Typography.Text>
        )}
      </div>

      <Space />
      <Divider>Users</Divider>
      <div className="grid grid-cols-8 gap-3">
        {users && users.length > 0 ? (
          users.map((f) => (
            <div
              className=" flex flex-col items-center gap-3 pb-2 justify-center bg-white shadow-sm rounded "
              key={f.id}
            >
              <Image
                src={f.avatar || ''}
                placeholder
                width="100%"
                height="100%"
                className="object-cover"
              />
              <Typography.Text>{f.name || f.userName}</Typography.Text>

              <Button onClick={() => addFriend(f.id)}>Add friend</Button>
            </div>
          ))
        ) : (
          <Typography.Text>No Users</Typography.Text>
        )}
      </div>
    </div>
  );
}
