/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Icon, { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Layout,
  List,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { ALL_USER } from 'renderer/config/api.routes';
import User from 'renderer/domain/user.entity';
import HttpClient from 'renderer/services/http';
import {
  acceptFriendRequest,
  sendFriendRequest,
} from 'renderer/usecase/friend.usecase';
import use from 'renderer/utils/network';
import formatDTime from 'renderer/utils/time';
import { ReactComponent as DoubleCheckIcon } from '../../../../../../assets/icons/icon-double-check.svg';

const fetchNetworkUsers = async () => {
  return HttpClient.get<User>(ALL_USER);
};
const networkUsers = fetchNetworkUsers();

const fetchFriendRequest = async () => {
  return HttpClient.get('/user/friend-request');
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

const friendRequests = fetchFriendRequest();

function NetWorkItem({ data }: { data: User }) {
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
export function Networks({ handleBack }: { handleBack: () => void }) {
  const users = use<any>(networkUsers);
  const requests = use<{
    data: {
      receiverId: { name: string; id: string; avatar: string };
      senderId: { name: string; id: string; avatar: string };
      id: Id;
    }[];
  }>(friendRequests);

  const [acceptedRequests, setAcceptedRequests] = useState(new Set<Id>());

  return (
    <Layout style={{ background: 'white' }}>
      <div className="bg-gray-2 py-1 pl-4 flex justify-between">
        <Typography.Text type="secondary">
          New friend requests <span> ({requests.data.length}) </span>
        </Typography.Text>
      </div>

      <List
        dataSource={requests.data}
        renderItem={({ receiverId: receiver, senderId: sender }) => (
          <List.Item
            className="group"
            style={{
              paddingRight: 0,
              paddingLeft: 0,
              cursor: 'pointer',
            }}
          >
            <Space
              style={{ justifyContent: 'space-between', width: '100%' }}
              align="center"
            >
              <Space size="middle">
                <Avatar src={receiver.avatar} size={42} />
                <div className="flex flex-col justify-center">
                  <Typography.Text strong className="no-margin">
                    {receiver.name}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    last seen {formatDTime(Math.floor(Date.now() / 1000))}
                  </Typography.Text>
                </div>
              </Space>

              {acceptedRequests.has(receiver.id) ? (
                <Typography.Text type="secondary" italic>
                  Accepted
                </Typography.Text>
              ) : (
                <Space>
                  <Button
                    onClick={async () => {
                      await acceptFriendRequest(sender.id);
                      setAcceptedRequests((prev) =>
                        new Set(prev).add(sender.id)
                      );
                    }}
                  >
                    Accept
                  </Button>
                  <Button type="primary">Reject</Button>
                </Space>
              )}
            </Space>
          </List.Item>
        )}
      />

      <div className="bg-gray-2 py-1 pl-4 flex justify-between">
        <Typography.Text type="secondary">Suggested friends</Typography.Text>
        <span>
          <Typography.Text type="secondary" className="pr-2 ">
            {users.data.length}
          </Typography.Text>
        </span>
      </div>

      <List
        style={{ minHeight: 400, maxHeight: 500, overflow: 'auto' }}
        itemLayout="horizontal"
        dataSource={users.data}
        split
        renderItem={(item: User) => <NetWorkItem data={item} />}
      />

      <Layout.Footer
        style={{ padding: '8px 6px 0px 0px', background: 'white' }}
      >
        <div className="flex justify-end">
          <Button onClick={handleBack} type="text">
            Cancel
          </Button>
        </div>
      </Layout.Footer>
    </Layout>
  );
}
export function NetworkFallback() {
  const fallback = new Array(4).fill(0).map((_, i) => (
    <li>
      <Avatar style={{ backgroundColor: '#f56a00' }} />
      <Skeleton.Input />
    </li>
  ));

  return <ul>{fallback}</ul>;
}
