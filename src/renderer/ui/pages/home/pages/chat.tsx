import { Button, Divider, Layout, Tooltip, Typography } from 'antd';
import { Suspense, useState } from 'react';
import { useChatBoxContext } from 'renderer/shared/context/chatbox.context';

import { useRecoilValue } from 'recoil';

import { activeChatIdState, activeChatItem } from 'renderer/hooks/use-chat';
import { FormOutlined } from '@ant-design/icons';
import ChatOptionToggle from '../components/chat-side-menu';
import Conversations from '../components/conversations';
import ChatBoxFallback from '../components/loaders/chatbox.fallback';
import ChatBox from './chat-box';

const { Header, Footer, Sider, Content } = Layout;

export default function Chat() {
  const { sideOpen } = useChatBoxContext();
  // const chatId = useRecoilValue(activeChatIdState);
  const activeChat = useRecoilValue(activeChatItem);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <Layout className="h-full " style={{ background: 'white' }}>
      <Header className="bg-white px-4 ">
        <div className="flex w-full justify-between items-center">
          <Typography.Title level={2}> Messages</Typography.Title>
          <Tooltip title="Compose message" placement="topLeft">
            <Button icon={<FormOutlined />} type="link" />
          </Tooltip>
        </div>
      </Header>
      <Layout className="h-full rounded-xl bg-[#f3f3f3]">
        <Sider
          theme="light"
          style={{ background: 'transparent' }}
          width={360}
          collapsedWidth={110}
          breakpoint="lg"
        >
          <Suspense fallback="loading..">
            <Conversations />
          </Suspense>
        </Sider>
        <Divider type="vertical" className="h-full ml-0" />
        <Content className="h-full w-full">
          <Suspense fallback={<ChatBoxFallback />}>
            <ChatBox chat={activeChat} hasSearch={showSearch} />
          </Suspense>
        </Content>
        <Divider type="vertical" className="h-full ml-0 mr-0" />
        {/* option menu */}
        {sideOpen && activeChat && (
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
              id={activeChat.id}
              toggleSearch={() => setShowSearch(!showSearch)}
            />
          </Sider>
        )}
      </Layout>
    </Layout>
  );
}
