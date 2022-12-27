import { SearchOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Input,
  InputRef,
  Layout,
  List,
  Modal,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { userContacts } from 'renderer/hooks/contact-store';
import {
  chatState,
  ChatWithMessages,
  currentChatIdState,
} from 'renderer/hooks/new-store';
import { currentUser } from 'renderer/hooks/use-user';
import { chatRepository } from 'renderer/repository/chat/chat.repository';
import useDebounce from 'renderer/utils/debouce';
import formatDTime from 'renderer/utils/time';
import axios from 'axios';
import HttpClient from 'renderer/services/http';
import use from 'renderer/utils/network';
import User from 'renderer/domain/user.entity';
import { NetworkFallback, Networks } from '../components/network';

export default function Contacts({
  open,
  toggleOpen,
}: {
  open: boolean;
  toggleOpen: () => void;
}) {
  const user = useRecoilValue(currentUser);

  const [showNetwork, setShowNetwork] = useState(false);
  const setChat = useRecoilCallback(({ set }) => (data: any) => {
    set(chatState(data.id), data);
  });
  const setCurrentChatId = useSetRecoilState(currentChatIdState);

  const searchRef = useRef<InputRef>(null);
  const findContact = async (key: string) => {
    if (!key) {
      // setChatResult([]);
    }
    // const data = await chatRepository.findChatByParticipantName(key);
    // setChatResult(data.data);
  };
  const debounceSearch = useDebounce(findContact, 500);
  const handleContactClick = async (contact: any) => {
    // load contact

    const chat = await chatRepository.getChatOfContact(contact.id);
    if (!chat) {
      const newItem: ChatWithMessages = {
        id: contact.id,
        name: contact.name,
        avatar: contact.avatar,
        messages: [],
        total: 0,
        participants: [contact, user],
      };
      setChat(newItem);
      setCurrentChatId(newItem.id);
    } else {
      setCurrentChatId(chat.id);
    }
    // close modal
    toggleOpen();
  };

  // auto focus on component mount
  useEffect(() => {
    if (searchRef && open) {
      searchRef.current?.focus();

      // fetch user friend
      requestIdleCallback(async () => {
        if (user) {
          const friends = await HttpClient.get('/user/friend');
          if (friends.length === user.friends?.length) return;
          user.friends = friends;
        }
      });
    }
  }, [open, user]);

  return (
    <Modal
      title="Contacts"
      centered
      open={open}
      onCancel={toggleOpen}
      // width={450}
      footer={null}
    >
      {showNetwork ? (
        <React.Suspense fallback={<NetworkFallback />}>
          <Networks handleBack={() => setShowNetwork(false)} />
        </React.Suspense>
      ) : (
        <>
          <Layout style={{ background: 'white' }}>
            <Input
              bordered={false}
              ref={searchRef}
              onChange={(e) => debounceSearch(e.target.value)}
              style={{
                padding: '8px 0px',
                height: 38,
              }}
              placeholder="Search"
              prefix={
                <SearchOutlined className="text-gray-1 mr-2 -scale-x-[1]" />
              }
            />

            <Divider className="no-margin" />
            <List
              style={{ minHeight: 400, maxHeight: 500, overflow: 'auto' }}
              itemLayout="horizontal"
              dataSource={user?.friends}
              split={false}
              renderItem={(item: User) => (
                <>
                  <List.Item
                    style={{
                      paddingRight: 0,
                      paddingLeft: 0,
                      cursor: 'pointer',
                    }}
                    onClick={() => handleContactClick(item)}
                  >
                    <Space size="middle">
                      <Avatar src={item.avatar} size={42} />
                      <div className="flex flex-col justify-center">
                        <Typography.Text strong className="no-margin">
                          {item.name}
                        </Typography.Text>
                        <Typography.Text type="secondary">
                          last seen {formatDTime(Math.floor(Date.now() / 1000))}
                        </Typography.Text>
                      </div>
                    </Space>
                  </List.Item>
                  <Divider className="no-margin" />
                </>
              )}
            />
            <Layout.Footer
              style={{ padding: '8px 6px 0px 0px', background: 'white' }}
            >
              <div className="flex justify-between">
                <Button type="primary" onClick={() => setShowNetwork(true)}>
                  Networks
                </Button>
                <Button onClick={toggleOpen} type="text">
                  Close
                </Button>
              </div>
            </Layout.Footer>
          </Layout>
        </>
      )}
    </Modal>
  );
}
