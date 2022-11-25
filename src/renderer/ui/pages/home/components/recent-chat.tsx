import { Divider, Layout } from 'antd';

import { Suspense, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentChatQuery } from 'renderer/hooks/new-store';
import { useChatBoxContext } from 'renderer/shared/context/chatbox.context';
import ChatBox, { Header } from '../pages/chat-box';
import ChatOptionToggle from './chat-side-menu';
import ChatBoxFallback from './loaders/chatbox.fallback';
import MessageList from './message-list';

const { Sider, Content } = Layout;

export default function RecentChat() {
  const [seachOpen, setSearchOpen] = useState(false);
  const activeChat = useRecoilValue(currentChatQuery);
  const { infoOpen } = useChatBoxContext();

  return (
    <>
      <Content className="h-full w-full">
        <Suspense fallback={<ChatBoxFallback />}>
          <ChatBox
            chat={activeChat}
            hasSearch={seachOpen}
            header={<Header data={activeChat} />}
            messagesContainer={
              <MessageList key={activeChat.id} chat={activeChat} />
            }
          />
        </Suspense>
      </Content>
      <Divider type="vertical" className="h-full ml-0 mr-0" />
      {infoOpen && activeChat && (
        <Sider
          className="max-h-full overflow-auto h-full "
          theme="light"
          style={{
            background: 'white',
            marginLeft: -8,
          }}
          width={272}
        >
          <ChatOptionToggle
            activeChat={activeChat}
            toggleSearch={() => setSearchOpen((opened) => !opened)}
          />
        </Sider>
      )}
    </>
  );
}
