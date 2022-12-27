/* eslint-disable consistent-return */
import { Spin } from 'antd';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Message } from 'renderer/domain';
import { userContacts } from 'renderer/hooks/contact-store';
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

// eslint-disable-next-line react/prop-types
const Loader: React.FC<{ status: string }> = ({ status }) => {
  return (
    <div className="text-center w-full h-full flex items-center justify-center">
      <div className="w-60 h-60 flex justify-center items-center rounded-lg bg-white shadow-sm">
        <Spin tip={status} />
      </div>
    </div>
  );
};

const LOADCOMPLETED = 'complete';
export default function Preload({ children }: { children: ReactNode }) {
  const [loadingStage, setLoadingStage] = useState<string>(
    'Application initializing...'
  );
  const { insertMessage } = useChatMessage();
  const { updateChat } = useChat();
  const setUserContact = useSetRecoilState(userContacts);
  const user = useRecoilValue(currentUser);
  const navigate = useNavigate();

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
    if (!user) return;
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
      setLoadingStage('Loading data...');
      setUserContact(user.friends || []);
      const response = await getInitialChat_v1();
      setChatList(response.data, response.extra);

      requestIdleCallback(async () => {
        try {
          if (user) {
            setLoadingStage('Syncing data...');
            const db = LocalDb.instance(user.userName);

            await db.open();
            db.transaction(
              'rw',
              db.contacts,
              db.chats,
              db.privateChat,
              db.messages,
              async () => {
                if (user.friends) syncContact(user.friends, db);
                syncChat(response.data, db);
                mapContactToChat(user, response.data, db);
                response.data.forEach((chat) => syncMessage(chat.messages, db));
                setLoadingStage(LOADCOMPLETED);
              }
            );
            return 1;
          }
        } catch (error) {
          console.log(error);
        }
        return 0;
      });
    })();

    return () => {
      console.log('users', user);
      SocketClient.disconnect();
      LocalDb.close();
      navigate(0); // refresh recoil state
    };
  }, [user]);

  return (
    <div className="w-screen h-screen">
      {loadingStage === LOADCOMPLETED ? (
        children
      ) : (
        <Loader status={loadingStage} />
      )}
      ;
    </div>
  );
}
