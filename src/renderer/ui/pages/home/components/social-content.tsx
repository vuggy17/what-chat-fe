/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Icon from '@ant-design/icons';
import { Avatar, Button, Layout, List, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { ALL_USER, SUGGESTED_USER } from 'renderer/config/api.routes';
import User from 'renderer/domain/user.entity';
import HttpClient from 'renderer/services/http';
import { sendFriendRequest } from 'renderer/usecase/friend.usecase';
import formatDTime from 'renderer/utils/time';
import { FriendRequest } from 'renderer/domain/type';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userContacts } from 'renderer/hooks/use-user';
import { ReactComponent as DoubleCheckIcon } from '../../../../../../assets/icons/icon-double-check.svg';

const fetchNetworkUsers = async () => {
  const res = await HttpClient.get<User>(SUGGESTED_USER);
  return res.data;
};

const fetchFriendRequest = async () => {
  const res = await HttpClient.get('/user/friend-request');
  return res.data;
  // return Array.from({ length: 4 }).map((_, i) => ({
  //   id: i,
  //   name: `User ${i}`,
  //   avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  // }));
  // return [
  //   {
  //     id: '1232',
  //     name: 'Rita Ora',
  //     avatar:
  //       'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fHJhbmRvbSUyMHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  //   },
  //   {
  //     id: '1232jdk',
  //     name: 'Nhien Nguyen',
  //     avatar:
  //       'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTl8fHJhbmRvbSUyMHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  //   },
  //   {
  //     id: '1232ds',
  //     name: 'Duy Vu',
  //     avatar:
  //       'https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzV8fHJhbmRvbSUyMHBlcnNvbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
  //   },
  // ];
};

type LineProp = {
  id: Id;
  receiver: { name: string; id: string; avatar: string };
  sender: { name: string; id: string; avatar: string };
};
function FriendLine({ receiver, sender, id }: LineProp) {
  const [accepted, setAccepted] = useState(false);
  const [contacts, setContacts] = useRecoilState(userContacts);
  return (
    <Space
      style={{ justifyContent: 'space-between', width: '100%' }}
      align="center"
    >
      <Space size="middle">
        <Avatar src={sender.avatar} size={42} />
        <div className="flex flex-col justify-center">
          <Typography.Text strong className="no-margin">
            {sender.name}
          </Typography.Text>
          <Typography.Text type="secondary">
            last seen {formatDTime(Math.floor(Date.now() / 1000))}
          </Typography.Text>
        </div>
      </Space>

      {accepted ? (
        <Typography.Text type="secondary" italic>
          Accepted
        </Typography.Text>
      ) : (
        <Space>
          <Button
            onClick={async () => {
              setAccepted(true);
              const friend = await HttpClient.get(
                `/user/friend-request-accept/${sender.id}/${id}`
              );
              setContacts((prev) =>
                prev ? [...prev, friend.data] : [friend.data]
              );
            }}
          >
            Accept
          </Button>
          <Button type="primary">Reject</Button>
        </Space>
      )}
    </Space>
  );
}

function SocialContentItem({ data }: { data: User }) {
  const [added, setAdded] = useState(false);

  const onSendClick = async () => {
    const response = await sendFriendRequest(data.id);
    if (response) {
      console.log('reponse', response);
      setAdded(true);
    }
  };
  return (
    <List.Item
      className="group"
      style={{
        paddingRight: 0,
        paddingLeft: 0,
        cursor: 'pointer',
      }}
      onClick={onSendClick}
    >
      <Space
        style={{ justifyContent: 'space-between', width: '100%' }}
        align="center"
      >
        <Space size="middle">
          <Avatar src={data.avatar} size={42} />
          <div className="flex flex-col justify-center">
            <Typography.Text strong className="no-margin">
              {data.name}
            </Typography.Text>
            <Typography.Text type="secondary">
              last seen {formatDTime(Math.floor(Date.now() / 1000))}
            </Typography.Text>
          </div>
        </Space>
        <Button
          icon={
            added ? (
              <Icon component={DoubleCheckIcon} style={{ color: 'white' }} />
            ) : null
          }
          type="text"
          className="mr-2 invisible group-hover:visible transition-transform"
          style={{ visibility: added ? 'visible' : 'hidden' }}
        >
          {added ? 'Added' : 'Add friend'}
        </Button>
      </Space>
    </List.Item>
  );
}
export default function SocialContent({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const us = await fetchNetworkUsers();
      const req = await fetchFriendRequest();
      setUsers(us);
      setRequests(req);
    };
    fetch();
  }, []);

  return (
    <div
      style={{
        background: 'white',
        height: 500,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <div style={{ flexGrow: 1, overflow: 'auto' }}>
        <div className="bg-gray-2 py-1 pl-4 flex justify-between">
          <Typography.Text type="secondary">
            New friend requests <span> ({requests.length}) </span>
          </Typography.Text>
        </div>

        <List
          dataSource={requests}
          renderItem={({ receiverId: receiver, senderId: sender, id }) => (
            <List.Item
              style={{
                paddingRight: 0,
                paddingLeft: 0,
                cursor: 'pointer',
              }}
            >
              <FriendLine receiver={receiver} sender={sender} id={id} />
            </List.Item>
          )}
        />

        <div className="bg-gray-2 py-1 pl-4 flex justify-between">
          <Typography.Text type="secondary">Other people</Typography.Text>
          <span>
            <Typography.Text type="secondary" className="pr-2 ">
              {users.length}
            </Typography.Text>
          </span>
        </div>

        <List
          style={{ overflow: 'auto' }}
          itemLayout="horizontal"
          dataSource={users}
          split
          renderItem={(item: User) => <SocialContentItem data={item} />}
        />
      </div>

      <div style={{ padding: '8px 6px 0px 0px', background: 'white' }}>
        <div className="flex justify-end">
          <Button onClick={handleClose} type="text">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
