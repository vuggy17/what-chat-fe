/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  CloseOutlined,
  HeartTwoTone,
  MoreOutlined,
  PaperClipOutlined,
  SendOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';
import ConversationController from 'renderer/controllers/conversation.controller';
import { Conversation, Message } from 'renderer/entity';
import { genMockMsg, messages as mockmsg } from 'renderer/mock/message';
import { MSG_PAGE_SIZE } from 'renderer/shared/constants';
import { useOptionPanelContext } from 'renderer/shared/context/chatbox.context';
import { appendNewMessages } from 'renderer/usecase/message.usecase';
import formatDTime from 'renderer/utils/time';
import usePrevious from 'renderer/utils/use-previous';

const { Text } = Typography;
function Input({
  ...props
}: {
  onSubmit(content: string | File, type: 'file' | 'photo' | 'text'): void;
}) {
  const inputRef = useRef<any>();
  const [text, setText] = useState<string>();

  const reset = () => {
    setText('');
    inputRef.current.innerHTML = '';
  };

  const handleEnter = (e: any) => {
    if (e.key === 'Enter' && Boolean(text)) {
      if (text) {
        props.onSubmit(text.toString(), 'text');
      }
      reset();
    }
    if (e.which === 13) e.preventDefault();
  };

  function isFileImage(file: File) {
    return file && file.type.split('/')[0] === 'image';
  }

  const handleSendFile = (e: any) => {
    console.log('file sending');
    const file = e.target.files[0];
    if (isFileImage(file)) {
      props.onSubmit(file, 'photo');
    } else {
      props.onSubmit(file, 'file');
    }
  };

  const onPaste = (e: any) => {
    e.preventDefault();
    const clipboard = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, clipboard);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('paste', onPaste);
    }
    return () => {
      const cp = inputRef;
      if (cp.current) {
        cp.current.removeEventListener('paste', onPaste);
      }
    };
  }, []);

  return (
    <div
      className="w-full py-2 overscroll-contain inline-flex  items-center bg-gray-2 rounded-md input-wrapper "
      style={{ bottom: 0 }}
    >
      {/* input */}
      <div className="flex items-center flex-1 " onSubmit={handleEnter}>
        <div
          ref={inputRef}
          className="input-pl grow overflow-y-auto leading-relaxed text-neutral-900  px-2 pl-3 py-2 break-words max-h-[150px] focus:outline-none font-normal text-sm"
          contentEditable
          placeholder="Type your message...."
          onKeyDown={handleEnter}
          onInput={(e: any) => setText(e.currentTarget.textContent)}
        />
      </div>
      <Tooltip title="Open file">
        <label
          htmlFor="chat-input-image"
          className="flex items-center justify-center  font-semibold text-md ml-1 mr-2 hover:text-primary transform duration-300 cursor-pointer"
        >
          <PaperClipOutlined />
          <input
            id="chat-input-image"
            type="file"
            hidden
            // accept="image/*"
            onChange={handleSendFile}
          />
        </label>
      </Tooltip>
      {/* divider */}
      <span className="h-full border-solid  border-0 border-l-[1.5px] border-l-[#8c8c8cd9] mx-2" />
      {/* send button */}
      <div className="min-w-0 ">
        <span
          className="flex items-center justify-center h-10 min-w-0 gap-2 font-semibold text-md ml-1 pr-2 group  cursor-pointer"
          onClick={() => {
            props.onSubmit(text!, 'text');
            reset();
          }}
        >
          <Typography.Text className="group-hover:text-primary transition-colors duration-300">
            Send
          </Typography.Text>
          <SendOutlined className="group-hover:text-primary transition-colors duration-300" />
        </span>
      </div>
    </div>
  );
}

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
      <div className="pt-4 flex justify-between items-center pl-4 pr-10">
        <Space size="middle" align="center">
          <Avatar shape="circle" style={{ marginTop: 6 }} />
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
      <Divider style={{ marginTop: 18, marginBottom: 18 }} />
    </>
  );
}

type MessageBubbleProps = {
  self: boolean;
  type: MessageType;
  content: any;
  time: Date;
  hasAvatar?: boolean;
};

function MessageBubble({
  self,
  type,
  content,
  time,
  hasAvatar = false,
}: MessageBubbleProps) {
  if (self) {
    return (
      // self message
      <div className=" mr-3 float-right flex max-w-[90%] mb-3">
        <div className="invisible">action menu</div>
        <Tooltip title={formatDTime(time.toString())} placement="left">
          <div className="bg-primary text-white break-words rounded-md rounded-br-none p-3 pb-0  ">
            <Typography.Paragraph style={{ color: 'white' }}>
              {content}
            </Typography.Paragraph>
          </div>
        </Tooltip>
        <div
          className="flex-shrink-0 px-2 self-end"
          style={{ visibility: hasAvatar ? 'visible' : 'hidden' }}
        >
          <Avatar shape="circle" />
        </div>
      </div>
    );
  }
  return (
    <div className=" max-w-[90%] ml-3 flex clear-right mb-3">
      <div
        className="flex-shrink-0 px-2  self-end"
        style={{ visibility: hasAvatar ? 'visible' : 'hidden' }}
      >
        <Avatar shape="circle" />
      </div>
      <Tooltip title={formatDTime(time.toString())} placement="left">
        <div className="bg-[#EBEBEB] break-words max-w-[90%] rounded-md rounded-bl-none p-3 pb-0">
          <Typography.Paragraph>{content}</Typography.Paragraph>
        </div>
      </Tooltip>

      <div className="invisible">action menu</div>
    </div>
  );
}

type MessageListProps = {
  messages: Message[];
  onLoadMore: () => void;
  virtualso: any;
};

function MessageList({ messages, onLoadMore, virtualso }: MessageListProps) {
  const [firstItemIndex, setFirstItemIndex] = useState(
    MSG_PAGE_SIZE - messages.length
  );

  const internalMessages = useMemo(() => {
    const nextFirstItemIndex = MSG_PAGE_SIZE - messages.length;
    setFirstItemIndex(nextFirstItemIndex);
    return messages;
  }, [messages]);

  const msgBubble = useCallback((pos: number, data: Message) => {
    let hasNext = false;

    // if there is multiple chat bubble rendered continuous or last item in the conversation, add a avatar to the last item
    if (pos < messages.length - 1) {
      if (messages[pos + 1].fromMe !== data.fromMe) hasNext = true;
    } else hasNext = true;
    return (
      <div className="overflow-hidden">
        <MessageBubble
          self={data.fromMe}
          content={data.content}
          time={data.createdAt}
          type="text"
          hasAvatar={hasNext}
          key={data.id}
        />
      </div>
    );
  }, []);

  // setting 'auto' for behavior does help in this sample, but not in my actual code
  const followOutput = useCallback((isAtBottom: boolean) => {
    return isAtBottom ? 'smooth' : false;
  }, []);

  return (
    <Virtuoso
      ref={virtualso}
      data={internalMessages}
      itemContent={msgBubble}
      initialTopMostItemIndex={internalMessages.length - 1}
      firstItemIndex={Math.max(0, firstItemIndex)}
      startReached={onLoadMore}
      followOutput={followOutput}
      style={{ overflow: 'auto' }}
    />
  );
}

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function ChatBox({ chatId }: { chatId: Id }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const previusChatId = usePrevious(chatId);

  const sendMessage = (msg: Message) => {
    ConversationController.sendMessage(msg);
  };
  const virtualso = useRef(null);
  const currentChatId = '1';

  const loadOldMsg = useCallback(() => {
    // console.log('Chat: startReached');
    // const newMessages = Array.from({ length: MSG_PAGE_SIZE }, genMockMsg);
    // // simulate network request with random timeout
    // const timeout = randomNumber(100, 600);
    // setTimeout(() => {
    //   savedMessages[chatId] = appendNewMessages(newMessages);
    //   setMessages(combinedMessages);
    // }, timeout);
  }, [messages]);

  useEffect(() => {
    const newMessages = Array.from({ length: MSG_PAGE_SIZE }, genMockMsg);
    // simulate network request with random timeout
    const timeout = randomNumber(100, 600);
    setTimeout(() => {
      // savedMessages[chatId] = appendNewMessages(newMessages);
      setMessages(newMessages);
    }, timeout);
    return () => {};
  }, [chatId]);

  if (chatId !== previusChatId) return null;

  return (
    <div className=" flex flex-col min-h-0 h-full pb-4 pr-2">
      <Header chatId={chatId} />
      <div className="flex-auto  pl-4 pr-3 mb-3">
        <MessageList
          messages={mockmsg}
          onLoadMore={loadOldMsg}
          virtualso={virtualso}
        />
      </div>
      <Input onSubmit={sendMessage} />
    </div>
  );
}
