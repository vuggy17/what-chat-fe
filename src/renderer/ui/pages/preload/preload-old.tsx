import { ReactNode, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Message } from 'renderer/domain';
import { useChat, useChatMessage } from 'renderer/hooks/new-store';

import { currentUser } from 'renderer/hooks/use-user';
import SocketClient from 'renderer/services/socket';
import {
  EventListener,
  EventListenerWithAck,
  HasNewMessagePayload,
  PrivateMessageReceivedByPayload,
  ServerToClientEvent,
} from 'renderer/services/type';
import {
  addMessageToChat,
  getInitialChat_v1,
} from 'renderer/usecase/conversation.usecase';
import {
  convertToPreview,
  sendMessageReceivedAck,
} from 'renderer/usecase/message.usecase';

export default function Preload({ children }: { children: ReactNode }) {
  const [appReady, setAppReady] = useState(false);
  const { insertMessage } = useChatMessage();
  // const updateChatItem = useUpdateChatItem();
  const { updateChat } = useChat();

  const user = useRecoilValue(currentUser);

  // new api
  const { batchInitChats: setChatList } = useChat();

  const onHasNewMessage: EventListenerWithAck<HasNewMessagePayload> = (
    payload,
    ack
  ) => {
    const { chatId, message } = payload;
    console.log('[HAS_NEW_MESSAGE]: ', payload);

    // DO NOT REMOVE SET TIMEOUT
    // settimeout to prevent recoil state update error
    setTimeout(() => {
      addMessageToChat(chatId, message as Message, {
        insertMessage,
      });

      updateChat({
        id: chatId,
        updates: {
          status: 'idle',
          lastMessage: convertToPreview(message),
          lastUpdate: message.createdAt,
        },
      });
    }, 100);
    // send ack signal
    if (user) {
      sendMessageReceivedAck(message.sender.id, {
        chatId,
        receiverId: user.id,
        messageId: message.id,
      });
    }
  };

  const onMessageReceived: EventListener<PrivateMessageReceivedByPayload> = (
    payload: PrivateMessageReceivedByPayload
  ) => {
    const { chatId, messageId } = payload;
    insertMessage(chatId, { id: messageId, status: 'received' }, messageId);
  };

  const onMessageRead: EventListener<PrivateMessageReceivedByPayload> = (
    payload: PrivateMessageReceivedByPayload
  ) => {
    const { chatId, messageId } = payload;
    insertMessage(chatId, { id: messageId, status: 'seen' }, messageId);
  };

  useEffect(() => {
    SocketClient.addEventHandler(
      ServerToClientEvent.HAS_NEW_MESSAGE,
      onHasNewMessage
    );
    SocketClient.addEventHandler(
      ServerToClientEvent.MESSAGE_RECEIVED_BY,
      onMessageReceived
    );
    SocketClient.addEventHandler(
      ServerToClientEvent.SEEN_MESSAGE,
      onMessageRead
    );
    (async () => {
      const response = await getInitialChat_v1();
      setChatList(response.data, response.extra);
      setAppReady(true);
    })();
  }, []);

  return <>{appReady ? children : 'Loading'}</>;
}
