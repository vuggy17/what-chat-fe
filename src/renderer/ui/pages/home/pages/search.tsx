/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Icon, { CloseOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentChatIdState, currentChatQuery } from 'renderer/hooks/new-store';
import { useSearchChatResult } from 'renderer/hooks/use-ui';
import { ReactComponent as IconX } from '../../../../../../assets/icons/x.svg';
import { Item } from '../components/conversation-list';

export default function SearchResult() {
  const [searchParam, set] = useSearchParams();
  const chatOnly = Boolean(searchParam.get('chatOnly'));
  const { groups, privates, messages, currentChatId } = useSearchChatResult();
  const navigate = useNavigate();
  const { avatar, name } = useRecoilValue(currentChatQuery);
  const [searchStatus, setSearchStatus] = useState('Search for messages');
  const setCurrentChat = useSetRecoilState(currentChatIdState);
  const handleClickChat = (id: string) => {
    if (id) {
      setCurrentChat(id);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setSearchStatus(`Found ${messages.length} messages`);
    } else {
      setSearchStatus('No messages found');
    }
    return () => {
      setSearchStatus('Search for messages');
    };
  }, [messages]);

  return !chatOnly ? (
    <div>
      <div className="bg-gray-2 py-1  pl-4">
        <Typography.Text type="secondary" />
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
      <ul className="list-none p-0 m-0">
        {messages.length > 0 &&
          messages.map((m) => (
            <Item
              id={currentChatId}
              avatar={m.sender.avatar}
              name={m.sender.name}
              description={m.text}
              time={m.updatedAt}
              onSelectItem={handleClickChat}
              active={false}
              hasDot={false}
            />
          ))}
      </ul>
    </div>
  ) : (
    <div>
      {(groups.length > 0 || privates.length > 0) && (
        <div className="bg-gray-2 py-1  pl-4">
          <Typography.Text type="secondary">{`Found ${
            groups.length + privates.length
          } chat`}</Typography.Text>
        </div>
      )}

      {groups.length > 0 &&
        groups.map((group) => (
          <div
            className="flex items-center justify-between py-3 pl-4 pr-2 before:opacity-0 cursor-pointer "
            onClick={() => handleClickChat(group.id)}
          >
            <Space
              direction="horizontal"
              size="middle"
              style={{ width: '100%' }}
            >
              <Avatar src={group.avatar} size="large" />
              <Typography.Title
                level={5}
                ellipsis
                style={{ margin: 0, minWidth: 0 }}
              >
                {group.name}
              </Typography.Title>
            </Space>
          </div>
        ))}

      {privates.length > 0 &&
        privates.map((p) => (
          <div
            className="flex items-center justify-between py-3 pl-4 pr-2 before:opacity-0 cursor-pointer"
            onClick={() => handleClickChat(p.id)}
          >
            <Space
              direction="horizontal"
              size="middle"
              style={{ width: '100%' }}
            >
              <Avatar src={p.avatar} size="large" />
              <Typography.Title
                level={5}
                ellipsis
                style={{ margin: 0, minWidth: 0 }}
              >
                {p.name}
              </Typography.Title>
            </Space>
          </div>
        ))}
    </div>
  );
}
