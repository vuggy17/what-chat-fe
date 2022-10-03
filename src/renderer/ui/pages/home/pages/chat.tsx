import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Divider, Input, Layout, Skeleton, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { genMockChat } from 'renderer/mock/conversation';
import { SearchOutlined } from '@ant-design/icons';
import { useOptionPanelContext } from 'renderer/shared/context/chatbox.context';
import ConversationController from 'renderer/controllers/conversation.controller';
import { Conversation } from 'renderer/entity';

import messageManager from 'renderer/data/message.manager';
import quickSort from 'renderer/utils/sort';
import messageController from 'renderer/controllers/message.controller';
import SelectList from '../components/conversation-list';
import ChatBox from './chat-box';
import ChatOptionToggle from '../components/chat-big-menu';

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
          placeholder="Search a chat"
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
    </div>
  );
}

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
        <Sider
          theme="light"
          style={{ background: 'transparent' }}
          width={360}
          collapsedWidth={110}
          breakpoint="lg"
        >
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
            <ChatOptionToggle id={activeChat} />
          </Sider>
        )}
      </Layout>
    </Layout>
  );
}
