/* eslint-disable promise/catch-or-return */
import { Button, Divider, Image, message, Space, Typography } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { ALL_USER, FRIEND } from 'renderer/config/api.routes';
import User from 'renderer/domain/user.entity';
import SocketClient from 'renderer/services/socket';

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
