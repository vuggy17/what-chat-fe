import { SearchOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import {
  Avatar,
  Button,
  Divider,
  Input,
  InputRef,
  Layout,
  List,
  Modal,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { ALL_USER } from 'renderer/config/api.routes';
import User from 'renderer/domain/user.entity';
import { userContacts } from 'renderer/hooks/contact-store';
import {
  chatState,
  ChatWithMessages,
  currentChatIdState,
  useChat,
} from 'renderer/hooks/new-store';
import { currentUser } from 'renderer/hooks/use-user';
import { chatRepository } from 'renderer/repository/chat/chat.repository';
import HttpClient from 'renderer/services/http';
import useDebounce from 'renderer/utils/debouce';
import use from 'renderer/utils/network';
import formatDTime from 'renderer/utils/time';
import { async } from 'rxjs';

const contacts = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  avatar: faker.internet.avatar(),
  name: faker.name.fullName(),
  lastSeen: Math.floor(faker.date.past().getTime() / 1000),
}));

const fetchNetworkUsers = async () => {
  return HttpClient.get(ALL_USER);
};
const networkUsers = fetchNetworkUsers();

function Networks() {
  const response = use(networkUsers);
  return (
    <ul>
      {response.data?.map((u) => (
        <li>
          <Avatar src={u.avatar} />
          <Typography.Text strong>{u.name}</Typography.Text>
        </li>
      ))}
    </ul>
  );
}

function NetworkFallback() {
  const fallback = new Array(4).fill(0).map((_, i) => (
    <li>
      <Avatar style={{ backgroundColor: '#f56a00' }} />
      <Skeleton paragraph />
    </li>
  ));

  return <ul>{fallback}</ul>;
}

export default function Contacts({
  open,
  toggleOpen,
}: {
  open: boolean;
  toggleOpen: () => void;
}) {
  const user = useRecoilValue(currentUser);
  const contactList = useRecoilValue(userContacts);
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
    }
  }, [open]);

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
          <Networks />
        </React.Suspense>
      ) : (
        <>
          <Layout style={{ background: 'white' }}>
            <Input
              bordered={false}
              ref={searchRef}
              // onClick={() => {
              //   if (location.pathname.includes('new-chat')) {
              //     // navigate('/app/conversations');
              //   } else navigate('search');
              // }}
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
              dataSource={contactList}
              split={false}
              renderItem={(item) => (
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
                <Button onClick={() => setShowNetwork(true)} type="text">
                  Add contact
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
