import React, {
  createContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Input,
  Layout,
  List,
  Menu,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import type { MenuProps } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { conversation, genMockChat } from 'renderer/mock/conversation';
import {
  BellFilled,
  CustomerServiceOutlined,
  NotificationFilled,
  SearchOutlined,
} from '@ant-design/icons';
import ChatBoxProvider, {
  useOptionPanelContext,
} from 'renderer/shared/context/chatbox.context';
import ConversationController from 'renderer/controllers/conversation.controller';
import { Conversation } from 'renderer/entity';

import messageManager from 'renderer/data/message.manager';
import quickSort from 'renderer/utils/sort';
import { messsageRespository } from 'renderer/repository/message.respository';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
import messageController from 'renderer/controllers/message.controller';
import conversationManager from 'renderer/data/conversation.manager';
import SelectList from '../components/select-list';
import ChatBox from './chat-box';
import AppSwitch from '../components/switch';

const { Header, Footer, Sider, Content } = Layout;

export function Conversations({
  active,
  onChatIdChange,
}: {
  active: Id;
  onChatIdChange: (v: Id) => void;
}) {
  const [data, setData] = useState<Conversation[]>([]);

  const loadMoreData = () => {
    const newitems = Array.from(
      {
        length: 5,
      },
      () => genMockChat()
    );
    const a = data.concat(newitems);
    setData([...a]);
  };

  useLayoutEffect(() => {
    loadMoreData();

    // subscrible for converstaion added or removed
    const subcription = ConversationController.conversations.subscribe({
      next: (v) => {
        setData(quickSort(v, 'lastUpdate', 'desc'));
      },
    });
    return () => {
      subcription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full flex flex-col  ">
      <div className="ml-7 mr-6 pt-5 pb-8">
        <Input
          size="large"
          style={{ padding: '8px 11px', color: '#171717' }}
          placeholder="Search or start a new chat"
          prefix={<SearchOutlined className="text-gray-1" />}
        />
      </div>
      <div
        id="scrollableDiv"
        className="flex-1"
        style={{
          overflowY: 'auto',
        }}
      >
        <InfiniteScroll
          style={{ minWidth: 0 }}
          dataLength={data.length}
          next={loadMoreData}
          hasMore
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <SelectList
            data={data}
            selectedKey={active}
            onSelect={(key) => onChatIdChange(key)}
          />
        </InfiniteScroll>
      </div>

      <Button
        onClick={() => {
          messageController.loadMoreMessages('2');
        }}
      >
        clear cache
      </Button>
      <Button
        onClick={() => {
          messageManager.flush();
        }}
      >
        clear cache
      </Button>
    </div>
  );
}

type MenuItem = Required<MenuProps>['items'][number];
function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    children,
    label,
    type,
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem(<Typography.Text strong>Customize chat</Typography.Text>, 'sub1', [
    getItem(
      'Item 1',
      null,
      [getItem('Option 1', '1'), getItem('Option 2', '2')],
      'group'
    ),
    getItem(
      'Item 2',
      null,
      [getItem('Option 3', '3'), getItem('Option 4', '4')],
      'group'
    ),
  ]),

  getItem('Navigation Two', 5),
];

const onClick: MenuProps['onClick'] = (e) => {
  console.log('click', e);
};

export default function Chat() {
  const { convOptionOpen } = useOptionPanelContext();

  const [activeChat, setActiveChat] = useState<Id | undefined>();

  const changeActiveChat = (nextId: Id) => {
    if (nextId !== activeChat) {
      messageManager.setCachedMessages(activeChat!, messageManager.messages);
      ConversationController.setActiveChat(nextId);
    }
  };

  useEffect(() => {
    const subcription = ConversationController.activeChat.subscribe({
      next: (chatId) => {
        messageController.loadMessage(chatId);
        setActiveChat(chatId);
      },
    });
    return () => {
      subcription.unsubscribe();
    };
  }, []);

  return (
    <Layout className="h-full " style={{ background: 'white' }}>
      <Header className="bg-white px-4 ">
        <Typography.Title level={2}> Messages</Typography.Title>
      </Header>
      <Layout className="h-full rounded-xl bg-[#f3f3f3]">
        <Sider theme="light" style={{ background: 'transparent' }} width={360}>
          <Conversations
            active={activeChat!}
            onChatIdChange={changeActiveChat}
          />
        </Sider>
        <Divider type="vertical" className="h-full ml-0" />
        <Content className="h-full w-full  ">
          <ChatBox chatId={activeChat!} />
        </Content>
        <Divider type="vertical" className="h-full ml-0 mr-0" />
        {/* option menu */}
        {activeChat && (
          <Sider
            theme="light"
            style={{
              background: 'white',
              display: convOptionOpen ? 'block' : 'none',
              marginLeft: -8,
            }}
            width={360}
          >
            <div
              className="pt-4 pb-3 flex items-center flex-col"
              style={{ width: '100%' }}
            >
              <Avatar
                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 90 }}
              />
              <Typography.Title level={4} style={{ marginBottom: 0 }}>
                {conversationManager.getConversation(activeChat)?.name}
              </Typography.Title>
              <Typography.Text type="secondary">Coding 🐱‍🐉</Typography.Text>
            </div>

            <Row
              gutter={8}
              className="pt-5 px-3 w-[80%] m-auto"
              justify="center"
            >
              <Col flex="1" className="flex justify-center text-center">
                <AppSwitch
                  CheckedComponent={({ toggleState }) => (
                    <span>
                      <Button
                        icon={
                          <span className="anticon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <line x1="3" y1="3" x2="21" y2="21" />
                              <path d="M17 17h-13a4 4 0 0 0 2 -3v-3a7 7 0 0 1 1.279 -3.716m2.072 -1.934c.209 -.127 .425 -.244 .649 -.35a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3" />
                              <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                            </svg>
                          </span>
                        }
                        style={{ backgroundColor: '#EBEBEB' }}
                        type="text"
                        onClick={toggleState}
                      />
                      <p className="ant-badge block mt-1">Unmute</p>
                    </span>
                  )}
                >
                  {({ toggleState }) => (
                    <span>
                      <Button
                        icon={
                          <span className="anticon ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                              <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                            </svg>
                          </span>
                        }
                        style={{ backgroundColor: '#EBEBEB' }}
                        type="text"
                        onClick={toggleState}
                      />
                      <p className="ant-badge block mt-1">Mute</p>
                    </span>
                  )}
                </AppSwitch>
              </Col>
              <Col flex="1" className="flex justify-center text-center">
                <AppSwitch
                  CheckedComponent={({ toggleState }) => (
                    <span>
                      <Button
                        icon={
                          <span className="anticon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6" />
                              <line x1="12" y1="16" x2="12" y2="21" />
                              <line x1="8" y1="4" x2="16" y2="4" />
                            </svg>
                          </span>
                        }
                        style={{ backgroundColor: '#EBEBEB' }}
                        type="text"
                        onClick={toggleState}
                      />
                      <p className="ant-badge block mt-1">Unpin</p>
                    </span>
                  )}
                >
                  {({ toggleState }) => (
                    <span>
                      <Button
                        icon={
                          <span className="anticon ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              fill="none"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <line x1="3" y1="3" x2="21" y2="21" />
                              <path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251" />
                              <line x1="9" y1="15" x2="4.5" y2="19.5" />
                              <line x1="14.5" y1="4" x2="20" y2="9.5" />
                            </svg>
                          </span>
                        }
                        style={{ backgroundColor: '#EBEBEB' }}
                        type="text"
                        onClick={toggleState}
                      />
                      <p className="ant-badge block mt-1">Pin</p>
                    </span>
                  )}
                </AppSwitch>
              </Col>
              <Col flex="1" className="flex justify-center text-center">
                <span>
                  <Button
                    icon={<SearchOutlined />}
                    type="text"
                    style={{ backgroundColor: '#EBEBEB' }}
                  />
                  <p className="ant-badge block mt-1">Search</p>
                </span>
              </Col>
            </Row>
            <div className="py-5">
              <Menu
                onClick={onClick}
                style={{ width: '100%', backgroundColor: 'transparent' }}
                mode="inline"
                items={items}
              />
            </div>
          </Sider>
        )}
      </Layout>
    </Layout>
  );
}
