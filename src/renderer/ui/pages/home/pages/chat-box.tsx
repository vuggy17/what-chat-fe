import Icon, { MoreOutlined, UserOutlined } from '@ant-design/icons';
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
  convertToGroupPreview,
  convertToPreview,
  createMsgPlaceholder,
  seenMessage,
  sendMessageOnline,
} from 'renderer/usecase/message.usecase';
import { useNavigate } from 'react-router-dom';
import { createNoSubstitutionTemplateLiteral } from 'typescript';
import { ReactComponent as IconSearch } from '../../../../../../assets/icons/search.svg';
import { ReactComponent as SideBarRight } from '../../../../../../assets/icons/layout-sidebar-right.svg';
import { ReactComponent as DotsVertical } from '../../../../../../assets/icons/dots-vertical.svg';

import RichEditor from '../components/input';
import SearchBox from '../components/search-box';

export function Header({ data }: { data: ChatEntity }) {
  const { toggleInfoOpen: toggleOpenConvOption } = useChatBoxContext();
  const navigate = useNavigate();

  if (Object.keys(data).length === 0) return null;

  return (
    <div className="py-1 pr-2">
      <div className="flex justify-between items-center pl-2   ">
        <Space size="middle" align="center">
          <Avatar
            shape="circle"
            style={{ marginTop: 6 }}
            src={data.avatar}
            icon={<UserOutlined />}
          />
          <div className="flex flex-col">
            <Space style={{ paddingTop: 6 }}>
              <Typography.Title
                level={5}
                style={{ marginBottom: 0, marginTop: 0 }}
              >
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
        <div className="flex items-center space-x-2">
          <Button
            type="text"
            onClick={() => navigate('search')}
            icon={
              <Icon
                component={IconSearch}
                style={{ color: 'white', fontSize: 19 }}
              />
            }
          />
          <Button
            type="text"
            icon={
              <Icon
                component={SideBarRight}
                style={{ color: 'white', fontSize: 22 }}
              />
            }
            onClick={toggleOpenConvOption}
          />
          <Button
            // icon={}
            icon={<Icon component={DotsVertical} />}
            type="text"
          />
        </div>
      </div>
    </div>
  );
}

export default function ChatBox({
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

  console.log('CHAT', chat);

  const onSendMessage = (
    type: MessageType,
    text?: string,
    fileList?: File[]
  ) => {
    console.log('sending messgaes ========================');
    // SETUP: construct message
    let clientMessage = {} as Message;
    if (currentUser) {
      const receiver = chat.participants?.find((p) => p.id !== currentUser.id);
      switch (type) {
        case 'file':
          clientMessage = createMsgPlaceholder(currentUser, receiver).file(
            fileList!,
            text
          );
          break;
        case 'photo':
          clientMessage = createMsgPlaceholder(currentUser, receiver).image(
            fileList!,
            text
          );
          break;
        default:
          clientMessage = createMsgPlaceholder(currentUser, receiver).text(
            text!
          );
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
    sendMessageOnline(clientMessage, chat.isGroup)
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
            attachments: message.attachments,
          },
          clientMessage.id
        );

        return null;
      })
      .catch((err) => console.error(err));
  };

  const onSendGroupMessage = (
    type: MessageType,
    text?: string,
    fileList?: File[]
  ) => {
    // SETUP: construct message
    let clientMessage = {} as Message;
    if (currentUser) {
      const receiver = chat.id;

      console.log('gg', chat.isGroup);
      console.log('send group message', receiver);
      switch (type) {
        case 'file':
          clientMessage = createMsgPlaceholder(currentUser, receiver).file(
            fileList!,
            text
          );
          break;
        case 'photo':
          clientMessage = createMsgPlaceholder(currentUser, receiver).image(
            fileList!,
            text
          );
          break;
        default:
          clientMessage = createMsgPlaceholder(currentUser, receiver).text(
            text!
          );
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
        lastMessage: convertToGroupPreview(clientMessage),
      },
      {
        updateChatItem: updateChat,
      }
    );

    console.log('SENDING MESASGE: ', chat.isGroup);
    // ACTION: send message
    sendMessageOnline(clientMessage, chat.isGroup)
      .then(({ data: { message } }) => {
        console.log('SEND COMPLETED: ', message);
        // FINAL: update chat
        updateChatUseCase(
          chat.id,
          {
            status: 'idle',
            lastUpdate: message.createdAt,
            lastMessage: convertToGroupPreview(clientMessage),
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
            attachments: message.attachments,
          },
          clientMessage.id
        );

        return null;
      })
      .catch((err) => console.error(err));
  };

  // TODO: enable this
  const onEditorGotFocused = useCallback(() => {
    // if (currentUser && messages.length > 0) {
    //   seenMessage(
    //     chat.id,
    //     messages[messages.length - 1].id,
    //     currentUser?.id,
    //     chat.participants?.find((p) => p.id !== currentUser.id)!.id,
    //     Date.now()
    //   );
    // }
  }, [messages, currentUser, chat.id, chat.participants]);

  return (
    <div className="flex flex-col min-h-0 h-full ">
      {header}
      <Divider style={{ marginTop: 0, marginBottom: 0 }} />

      <div className="flex-1 relative transition-all transform duration-700 overflow-hidden min-h-0 message-box ">
        <div className=" h-full pl-2 blurry">
          {messages?.length > 0
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
      </div>
      {hasEditor && (
        <RichEditor
          key={chat.id}
          isGroup={chat.isGroup}
          onSubmit={onSendMessage}
          onFocus={onEditorGotFocused}
          onSendGroupMessage={onSendGroupMessage}
        />
      )}
    </div>
  );
}

ChatBox.defaultProps = {
  hasSearch: false,
  hasEditor: true,
};
