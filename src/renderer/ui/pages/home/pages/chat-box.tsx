import { LoadingOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Input,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ConversationController from 'renderer/controllers/conversation.controller';
import messageController from 'renderer/controllers/message.controller';
import { Conversation, Message } from 'renderer/domain';

import { useOptionPanelContext } from 'renderer/shared/context/chatbox.context';
import { createMsgPlaceholder } from 'renderer/usecase/message.usecase';
import usePrevious from 'renderer/utils/use-previous';

import RichEditor from '../components/input';
import MessageList from '../components/message-list';
import SearchBox from '../components/search-box';

function Header({ chatId }: { chatId: Id }) {
  const { toggleOpenConvOption } = useOptionPanelContext();
  const [data, setData] = useState<Conversation>({} as Conversation);

  useEffect(() => {
    const chatdata = ConversationController.getChatMeta(chatId);
    if (chatdata) {
      setData(chatdata);
    }
  }, [chatId]);

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

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function Chat({ chatId, hasSearch }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const virtuoso = useRef(null);

  const prevChatId = usePrevious(chatId);

  useEffect(() => {
    const subcription = messageController.messages.subscribe({
      next: (v) => {
        // console.log('ChatBox: messages changed', v);
        setMessages([...v]);
      },
    });
    return () => {
      subcription.unsubscribe();
    };
  }, [chatId]);

  const startReached = useCallback(() => {
    // console.log('Chat: startReached');
    // console.log('prependItems');

    // simulate network request with random timeout
    const timeout = randomNumber(500, 1000);
    setTimeout(() => {
      messageController.loadMoreMessages(chatId);
    }, timeout);
  }, [chatId]);

  const onSendMessage = (msg: File | string, type: MessageType) => {
    // create placeholder
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
    console.log('onSendMessage', newItem);

    messageController.addMessage(newItem); // add placeholder to list
    // messageController.sendMessage(msg, { type, chatId }); // send message
    ConversationController.updateConverstationMeta(chatId, {
      lastUpdate: new Date(),
      status: 'sending',
    });
  };

  return (
    <div className=" flex flex-col min-h-0 h-full pb-4 pr-2">
      <Header chatId={chatId} />
      <div className="flex-auto relative pl-4 pr-3 transition-all transform duration-700 overflow-hidden">
        {/* if switching lists, unmount virtuoso so internal state gets reset */}
        {prevChatId === chatId ? (
          <MessageList
            messages={messages}
            chatId={chatId}
            virtuoso={virtuoso}
            onScrollOnTop={startReached}
          />
        ) : (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              avatar
              paragraph={{ rows: Math.floor(Math.random() * 2) + 1 }}
            />
          ))
        )}
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
