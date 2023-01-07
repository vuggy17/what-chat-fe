import { Divider, Layout } from 'antd';

import { Suspense, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentChatQuery } from 'renderer/hooks/new-store';
import { useChatBoxContext } from 'renderer/shared/context/chatbox.context';
import { useNavigate } from 'react-router-dom';
import ChatBox, { Header } from '../pages/chat-box';
import ChatOptionToggle from './chat-side-menu';
import ChatBoxFallback from './loaders/chatbox.fallback';
import MessageList from './message-list';

const { Sider, Content } = Layout;

export default function RecentChat() {
  const [seachOpen, setSearchOpen] = useState(false);
  const activeChat = useRecoilValue(currentChatQuery);
  const { infoOpen } = useChatBoxContext();
  const navigate = useNavigate();

  return (
    <>
      <Content className="h-full w-full shrink-0">
        <Suspense fallback={<ChatBoxFallback />}>
          <ChatBox
            chat={activeChat}
            hasSearch={seachOpen}
            header={<Header data={activeChat} />}
            messagesContainer={
              <MessageList key={activeChat.id} chat={activeChat} />
            }
            hasEditor={Object.keys(activeChat).length > 0}
          />
        </Suspense>
      </Content>
      {infoOpen && activeChat && (
        <Sider
          className="max-h-full overflow-auto h-full relative "
          theme="light"
          style={{
            background: 'white',
            marginLeft: -8,
          }}
          width={272}
        >
          <Divider
            type="vertical"
            className="h-full ml-0 mr-0 absolute top-0 left-0"
          />
          <ChatOptionToggle
            activeChat={activeChat}
            toggleSearch={() => navigate('search')}
          />
        </Sider>
      )}
    </>
  );
}
