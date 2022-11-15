import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  message,
  message as notification,
  Space,
  Typography,
} from 'antd';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';

// import ConversationController from 'renderer/controllers/chat.controller';
import { Chat as ChatEntity, Message } from 'renderer/domain';
import { useUpdateChatItem } from 'renderer/hooks/use-chat';
import { useMessage } from 'renderer/hooks/use-chat-message';
import { currentUser as userState } from 'renderer/hooks/use-user';
import SocketClient from 'renderer/services/socket';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';

import { useChatBoxContext } from 'renderer/shared/context/chatbox.context';
import {
  addMessageToChat,
  updateChat,
} from 'renderer/usecase/conversation.usecase';
import {
  convertToPreview,
  createMsgPlaceholder,
  seenMessage,
  sendMessageOnline,
} from 'renderer/usecase/message.usecase';

import RichEditor from '../components/input';
import MessageList from '../components/message-list';
import SearchBox from '../components/search-box';

function Header({ data }: { data: ChatEntity }) {
  const { toggleSideOpen: toggleOpenConvOption } = useChatBoxContext();
  return (
    <>
      <div className="pt-4 flex justify-between items-center pl-4 pr-10 ">
        <Space size="middle" align="center">
          <Avatar
            shape="circle"
            style={{ marginTop: 6 }}
            src={data.avatar}
            icon={<UserOutlined />}
          />
          <div className="flex flex-col">
            <Space style={{ paddingTop: 6 }}>
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                {data.name}
              </Typography.Title>
              <Badge color="green" />
            </Space>

            <Typography.Text
              type="secondary"
              style={{ marginTop: -4, fontSize: 12 }}
            >
              Online
            </Typography.Text>
          </div>
        </Space>
        <Button
          icon={<MoreOutlined />}
          type="text"
          className="text-2xl text-gray-1"
          size="large"
          onClick={toggleOpenConvOption}
        />
      </div>
      <Divider style={{ marginTop: 18, marginBottom: 0 }} />
    </>
  );
}

export default function Chat({
  chat,
  hasSearch,
}: {
  chat: ChatEntity;
  hasSearch?: boolean;
}) {
  const {
    messagesOfActiveChat: messages,
    total,
    updateOrInsertMessage,
  } = useMessage();
  const updateChatItem = useUpdateChatItem();
  const currentUser = useRecoilValue(userState);

  const onSendMessage = (msg: File | string, type: MessageType) => {
    // SETUP: construct message
    let clientMessage = {} as Message;
    if (currentUser) {
      const receiver = chat.participants.find((p) => p.id !== currentUser.id);

      switch (type) {
        case 'file':
          clientMessage = createMsgPlaceholder(
            currentUser,
            receiver,
            msg as File
          ).file();
          break;
        case 'photo':
          clientMessage = createMsgPlaceholder(
            currentUser,
            receiver,
            msg as File
          ).image();
          break;
        default:
          clientMessage = createMsgPlaceholder(
            currentUser,
            receiver,
            msg as string
          ).text();
          break;
      }
    }

    // ACTION: update UI
    addMessageToChat(chat.id, clientMessage, {
      insertMessage: updateOrInsertMessage,
    });
    updateChat(
      chat.id,
      {
        status: 'sending',
        lastUpdate: clientMessage.createdAt,
        lastMessage: convertToPreview(clientMessage),
      },
      {
        updateChatItem,
      }
    );

    // ACTION: send message
    sendMessageOnline(clientMessage, SocketClient)
      .then((res) => {
        const { data, message } = res;

        // FINAL: update chat
        updateChat(
          chat.id,
          {
            status: 'idle',
            lastUpdate: data.message.createdAt,
            lastMessage: convertToPreview(data.message),
          },
          {
            updateChatItem,
          }
        );

        // FINAL: update message status
        updateOrInsertMessage(
          chat.id,
          {
            id: data.message.id,
            status: 'sent',
            createdAt: data.message.createdAt,
          },
          clientMessage.id
        );

        return null;
      })
      .catch((err) => console.error(err));
  };

  const onEditorGotFocused = useCallback(() => {
    if (currentUser && messages.length > 0) {
      seenMessage(
        chat.id,
        messages[messages.length - 1].id,
        currentUser?.id,
        chat.participants.find((p) => p.id !== currentUser.id)!.id,
        Date.now()
      );
    }
  }, [messages, currentUser, chat.id]);

  return (
    <div className=" flex flex-col min-h-0 h-full pb-4 pr-2">
      <Header data={chat} />
      <div className="flex-auto relative px-2 mb-1 transition-all transform duration-700 overflow-hidden">
        {/* if switching lists, unmount virtuoso so internal state gets reset */}
        {messages.length > 0 ? (
          <MessageList
            totalCount={total}
            key={chat.id}
            messages={messages}
            chat={chat}
          />
        ) : (
          <div className="flex w-full items-center justify-center pt-2 flex-col">
            <Avatar src={chat.avatar} size={56} />
            <Typography.Text>{chat.name}</Typography.Text>
          </div>
        )}
        {hasSearch && (
          <div className="absolute top-0 inset-x-0 z-50 [&_*]:rounded-none ">
            <SearchBox />
          </div>
        )}
      </div>
      <RichEditor onSubmit={onSendMessage} onFocus={onEditorGotFocused} />
    </div>
  );
}

Chat.defaultProps = {
  hasSearch: false,
};
