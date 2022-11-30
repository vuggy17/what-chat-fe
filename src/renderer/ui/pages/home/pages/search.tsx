import Icon, { CloseOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Typography } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentChatQuery } from 'renderer/hooks/new-store';
import { ReactComponent as IconX } from '../../../../../../assets/icons/x.svg';

export default function SearchResult() {
  const navigate = useNavigate();
  const { avatar, name } = useRecoilValue(currentChatQuery);
  const [searchStatus, setSearchStatus] = useState('Search for messages');
  return (
    <div>
      <div className="bg-gray-2 py-1  pl-4">
        <Typography.Text type="secondary">Search messages in</Typography.Text>
      </div>

      <div className="flex items-center justify-between py-3 pl-4 pr-2 before:opacity-0 cursor-pointer   ">
        <Space direction="horizontal" size="middle" style={{ width: '100%' }}>
          <Avatar src={avatar} size="large" />
          <Typography.Title
            level={5}
            ellipsis
            style={{ margin: 0, minWidth: 0 }}
          >
            {name}
          </Typography.Title>
        </Space>
        <Button
          onClick={() => navigate('..')}
          type="text"
          icon={<Icon component={IconX} />}
        />
      </div>

      <div className="bg-gray-2 py-1  pl-4">
        <Typography.Text type="secondary">{searchStatus}</Typography.Text>
      </div>
    </div>
  );
}
