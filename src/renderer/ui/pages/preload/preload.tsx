import React, { ReactNode, useEffect, useState } from 'react';
import ConversationController from 'renderer/controllers/chat.controller';
import messageController from 'renderer/controllers/message.controller';
import conversationManager from 'renderer/data/chat.manager';
import { useChatList } from 'renderer/hooks/use-chat';
import { chatRepository } from 'renderer/repository/chat.repository';
import {
  getInitialChat,
  loadChat,
} from 'renderer/usecase/conversation.usecase';

export default function Preload({
  children,
  userId,
}: {
  children: ReactNode;
  userId: Id;
}) {
  const [appReady, setAppReady] = useState(true);
  const { listIds, setList } = useChatList();
  useEffect(() => {
    console.log('this rereun');
    (async () => {
      const data = await getInitialChat(chatRepository);
      setList(data);
    })();
  }, []);

  return <>{appReady ? children : 'Loading'}</>;
}
