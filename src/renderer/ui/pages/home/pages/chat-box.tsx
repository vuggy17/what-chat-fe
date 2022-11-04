import { LoadingOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Input,
  message,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

// import ConversationController from 'renderer/controllers/chat.controller';
import messageController from 'renderer/controllers/message.controller';
import { Chat as ChatEntity, Message } from 'renderer/domain';
import { useChatItem } from 'renderer/hooks/use-chat';
import { chatMessagesState, useMessage } from 'renderer/hooks/use-chat-message';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';

import { useChatBoxContext } from 'renderer/shared/context/chatbox.context';
import { addMessageToChat } from 'renderer/usecase/conversation.usecase';
import {
  createMsgPlaceholder,
  getMessageOfChat,
} from 'renderer/usecase/message.usecase';

import RichEditor from '../components/input';
import MessageList from '../components/message-list';
import SearchBox from '../components/search-box';

function Header({ chatId }: { chatId: Id }) {
  const { toggleSideOpen: toggleOpenConvOption } = useChatBoxContext();
  // const [data, setData] = useState<ChatEntity>({} as ChatEntity);
  const { listItem: data } = useChatItem(chatId);
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

// tong so message trong doan chat cua nguoi dung, so cang lon thi load cang nhieu
// TODO: change this to total of message in the database
const TOTAL_MESSAGE_COUNT = 5 * MSG_PAGE_SIZE; // !!REMOVE THIS IN THE FUTURE

export default function Chat({ chatId, hasSearch }: any) {
  const {
    messagesOfActiveChat: messages,
    prependMany,
    insertOne,
  } = useMessage();
  const { upsertListItem } = useChatItem(chatId);
  const virtuoso = useRef(null);

  const onSendMessage = (msg: File | string, type: MessageType) => {
    let newItem = {} as Message;
    switch (type) {
      case 'file':
        newItem = createMsgPlaceholder(chatId, msg as File).file();
        break;
      case 'photo':
        newItem = createMsgPlaceholder(chatId, msg as File).image();
        break;
      default:
        newItem = createMsgPlaceholder(chatId, msg as string).text();
        break;
    }

    addMessageToChat(chatId, newItem, {
      insertMessage: insertOne,
      updateChat: upsertListItem,
      updates: { status: 'sending', lastUpdate: newItem.createdAt },
    });
  };

  return (
    <div className=" flex flex-col min-h-0 h-full pb-4 pr-2">
      <Header chatId={chatId} />
      <div className="flex-auto relative pl-4 pr-3 transition-all transform duration-700 overflow-hidden">
        {/* if switching lists, unmount virtuoso so internal state gets reset */}
        <MessageList
          totalCount={TOTAL_MESSAGE_COUNT}
          key={chatId}
          messages={messages}
          chatId={chatId}
          virtuoso={virtuoso}
        />
        {hasSearch && (
          <div className="absolute top-0 inset-x-0 z-50 [&_*]:rounded-none ">
            <SearchBox />
          </div>
        )}
      </div>
      <RichEditor onSubmit={onSendMessage} />
    </div>
  );
}
