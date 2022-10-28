import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Divider, Input, Layout, Skeleton, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { genMockChat } from 'renderer/mock/conversation';
import { SearchOutlined } from '@ant-design/icons';
import { useOptionPanelContext } from 'renderer/shared/context/chatbox.context';
import ConversationController from 'renderer/controllers/conversation.controller';
import { Conversation } from 'renderer/domain';

import messageManager from 'renderer/data/message.manager';

import messageController from 'renderer/controllers/message.controller';
import { quickSort } from 'renderer/utils/array';
import usePrevious from 'renderer/utils/use-previous';
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
    ConversationController.loadConversation(data.length - 1);
  };

  useLayoutEffect(() => {
    // subscrible for converstaion added or removed
    const subcription = ConversationController.conversations.subscribe({
      next: (v) => {
        console.log('conversation changed', v.length - 1);

        setData(v);
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
  const [showSearch, setShowSearch] = useState(false);

  const changeActiveChat = (nextId: Id) => {
    if (nextId !== activeChat) {
      messageManager.setCachedMessages(activeChat!, messageManager.messages); // save loaded message to cache
      console.info('Change active chat, old value: ', activeChat);

      ConversationController.setActiveChat(nextId);
      messageController.loadMessage(nextId);
    }
  };

  useEffect(() => {
    const subcription = ConversationController.activeChat.subscribe({
      next: (chatId) => {
        console.info('Change active chat: ', 'on next', chatId);
        setActiveChat(chatId);
        setShowSearch(false);
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
          <ChatBox chatId={activeChat!} hasSearch={showSearch} />
        </Content>
        <Divider type="vertical" className="h-full ml-0 mr-0" />
        {/* option menu */}
        {convOptionOpen && activeChat && (
          <Sider
            className="max-h-full overflow-auto h-full "
            theme="light"
            style={{
              background: 'white',
              marginLeft: -8,
            }}
            width={360}
          >
            <ChatOptionToggle
              id={activeChat}
              toggleSearch={() => setShowSearch(!showSearch)}
            />
          </Sider>
        )}
      </Layout>
    </Layout>
  );
}
