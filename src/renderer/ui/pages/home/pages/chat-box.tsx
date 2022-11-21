import { MoreOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Space, Typography } from 'antd';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';

// import ConversationController from 'renderer/controllers/chat.controller';
import { Chat as ChatEntity, Message } from 'renderer/domain';
import {
  ChatWithMessages,
  useChat,
  useChatMessage,
} from 'renderer/hooks/new-store';
import { currentUser as userState } from 'renderer/hooks/use-user';
import SocketClient from 'renderer/services/socket';

import { useChatBoxContext } from 'renderer/shared/context/chatbox.context';
import {
  addMessageToChat,
  updateChat as updateChatUseCase,
} from 'renderer/usecase/conversation.usecase';
import {
  convertToPreview,
  createMsgPlaceholder,
  seenMessage,
  sendMessageOnline,
} from 'renderer/usecase/message.usecase';

import RichEditor from '../components/input';
import SearchBox from '../components/search-box';

export function Header({ data }: { data: ChatEntity }) {
  const { toggleInfoOpen: toggleOpenConvOption } = useChatBoxContext();
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
  header,
  hasEditor,
  messagesContainer,
}: {
  chat: ChatWithMessages;
  hasSearch?: boolean;
  header: React.ReactNode;
  messagesContainer: React.ReactNode;
  hasEditor?: boolean;
}) {
  const { appendMessage, insertMessage } = useChatMessage();
  // const updateChatItem = useUpdateChatItem();
  const { updateChat } = useChat();
  const currentUser = useRecoilValue(userState);
  const { messages } = chat;

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
      insertMessage: appendMessage,
    });
    updateChatUseCase(
      chat.id,
      {
        status: 'sending',
        lastUpdate: clientMessage.createdAt,
        lastMessage: convertToPreview(clientMessage),
      },
      {
        updateChatItem: updateChat,
      }
    );

    console.log('SENDING MESASGE: ', clientMessage);
    // ACTION: send message
    sendMessageOnline(clientMessage, SocketClient)
      .then(({ data: { message } }) => {
        console.log('SEND COMPLETED: ', message);
        // FINAL: update chat
        updateChatUseCase(
          chat.id,
          {
            status: 'idle',
            lastUpdate: message.createdAt,
            lastMessage: convertToPreview(message),
          },
          {
            updateChatItem: updateChat,
          }
        );

        // FINAL: update message status
        insertMessage(
          chat.id,
          {
            id: message.id,
            status: 'sent',
            createdAt: message.createdAt,
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
  }, [messages, currentUser, chat.id, chat.participants]);

  return (
    <div className="flex flex-col min-h-0 h-full pb-2 ">
      {header}
      <div className="flex-1 relative px-2 mb-1 transition-all transform duration-700 overflow-hidden min-h-0">
        {messages.length > 0
          ? messagesContainer
          : // <div className="flex w-full items-center justify-center pt-2 flex-col">
            //   <Avatar src={chat.avatar} size={56} />
            //   <Typography.Text>{chat.name}</Typography.Text>
            // </div>
            null}
        {hasSearch && (
          <div className="absolute top-0 inset-x-0 z-50 [&_*]:rounded-none ">
            <SearchBox />
          </div>
        )}
      </div>
      {hasEditor && (
        <RichEditor onSubmit={onSendMessage} onFocus={onEditorGotFocused} />
      )}
    </div>
  );
}

Chat.defaultProps = {
  hasSearch: false,
  hasEditor: true,
};
