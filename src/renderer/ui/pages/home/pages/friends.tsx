/* eslint-disable promise/catch-or-return */
import { Button, Image, Typography } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ALL_USER } from 'renderer/config/api.routes';
import IUser from 'renderer/domain/user.entity';
import SocketClient from 'renderer/services/socket';

export default function Friends() {
  const [friends, setFriends] = useState(Array<IUser>());
  useEffect(() => {
    const cancelSignal = new AbortController();
    const fetchFriends = async () => {
      return axios.get(ALL_USER, { signal: cancelSignal.signal });
    };

    fetchFriends()
      .then((res) => setFriends(res.data))
      .catch((err) => console.error(err));

    return () => cancelSignal.abort();
  }, []);

  const addFriend = (id) => {
    console.log('add friend', id);
    SocketClient.sendFriendRequest(id).then((res) => {
      const others = friends.filter((f) => f.id !== id);
      setFriends(others);
      return null;
    });
  };
  return (
    <div className="grid grid-cols-4  gap-3">
      {friends && friends.length > 0 ? (
        friends.map((f) => (
          <div className=" flex flex-col items-center gap-3 pb-2 justify-center bg-white shadow-sm rounded ">
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
        <Typography.Text>No friends</Typography.Text>
      )}
    </div>
  );
}
