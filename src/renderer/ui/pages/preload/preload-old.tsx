import { ReactNode, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Message } from 'renderer/domain';
import { useContact, userContacts } from 'renderer/hooks/contact-store';
import { useChat, useChatMessage } from 'renderer/hooks/new-store';

import { currentUser } from 'renderer/hooks/use-user';
import { LocalDb } from 'renderer/services/localdb';
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
import {
  mapContactToChat,
  syncChat,
  syncContact,
  syncMessage,
} from 'renderer/utils/syncdata';

export default function Preload({ children }: { children: ReactNode }) {
  const [appReady, setAppReady] = useState(false);
  const { insertMessage } = useChatMessage();
  const { updateChat } = useChat();
  const setUserContact = useSetRecoilState(userContacts);
  const user = useRecoilValue(currentUser);

  // init chat items
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
    // init local db

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
      setUserContact(user!.friends || []);
      const response = await getInitialChat_v1();
      setChatList(response.data, response.extra);

      requestIdleCallback(async () => {
        if (user) {
          console.log('====================================');
          console.log('idle');
          console.log('====================================');
          const db = LocalDb.instance(user.userName);

          if (user.friends && user.friends.length > 0) {
            await db.open();
            db.transaction(
              'rw',
              db.contacts,
              db.chats,
              db.privateChat,
              db.messages,
              async () => {
                syncContact(user.friends!, db);
                syncChat(response.data, db);
                mapContactToChat(user, response.data, db);
                response.data.forEach((chat) => syncMessage(chat.messages, db));
              }
            );
            return 1;
          }
          return 1;
        }
        return 0;
      });
      setAppReady(true);
    })();
  }, []);

  return <>{appReady ? children : 'Loading'}</>;
}
