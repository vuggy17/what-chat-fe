import { message as antMessage } from 'antd';
import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Message } from 'renderer/domain';
import { useSetChatList, useUpdateChatItem } from 'renderer/hooks/use-chat';
import { useMessage } from 'renderer/hooks/use-chat-message';
import { currentUser } from 'renderer/hooks/use-user';
import { chatRepository } from 'renderer/repository/chat.repository';
import SocketClient from 'renderer/services/socket';
import { HasNewMessagePayload } from 'renderer/services/type';
import {
  addMessageToChat,
  getInitialChat,
} from 'renderer/usecase/conversation.usecase';
import {
  convertToPreview,
  sendMessageReceivedAck,
} from 'renderer/usecase/message.usecase';

export default function Preload({ children }: { children: ReactNode }) {
  const [appReady, setAppReady] = useState(true);
  const setList = useSetChatList();
  const { updateOrInsertMessage } = useMessage();
  const updateChatItem = useUpdateChatItem();

  const [user, setCurrentUser] = useRecoilState(currentUser);

  const onHasNewMessageReceived = (payload: HasNewMessagePayload) => {
    const { chatId, message } = payload;
    console.log('[HAS_NEW_MESSAGE]: ', payload);

    // DO NOT REMOVE SET TIMEOUT
    // settimeout to prevent recoil state update error
    setTimeout(() => {
      addMessageToChat(chatId, message as Message, {
        insertMessage: updateOrInsertMessage,
      });

      updateChatItem({
        id: chatId,
        updates: {
          status: 'idle',
          lastMessage: convertToPreview(message),
          lastUpdate: message.createdAt,
        },
      });
    }, 100);
    // send ack signal
    // if (user) {
    //   sendMessageReceivedAck(chatId, user?.id, message.id);
    // }
  };

  useEffect(() => {
    SocketClient.addListenToPrivateMessageEvent(onHasNewMessageReceived);

    (async () => {
      if (!user) {
        const res = await axios.post('/user/login', {
          username: 'Glennie_Swaniawski63',
          password: 'bSj2x325DhkjQqb',
        });

        antMessage.success('Login success');
        setCurrentUser(res.data.data);
      }

      const { data, extra } = await getInitialChat(chatRepository);
      setList({ data, extra });
    })();
  }, []);

  return <>{appReady ? children : 'Loading'}</>;
}
