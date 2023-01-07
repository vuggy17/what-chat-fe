/* eslint-disable react/jsx-props-no-spreading */
import { QuestionOutlined } from '@ant-design/icons';
import { Avatar, Badge, Col, Grid, Row, Space, Typography } from 'antd';
import { useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Chat as ChatEntity, Message } from 'renderer/domain';
import { parseDescription } from 'renderer/ui/helper/string-converter';
import formatDTime from 'renderer/utils/time';
import { currentUser } from 'renderer/hooks/use-user';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  chatState,
  currentChatIdState,
  currentChatQuery,
} from 'renderer/hooks/new-store';
import { BellOff } from './icons';

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

type ItemProps = {
  id: Id;
  avatar: string | undefined;
  name: string;
  description: string;
  time: number;
  hasDot?: boolean;
  // status?: 'sending' | 'sent_error';
  typing?: boolean;
  muted?: boolean;
};

type ItemSelectProps = {
  onSelectItem: (key: any) => void;
  active: boolean;
};

export function Item({
  id,
  avatar: avatarUrl,
  name,
  description,
  time,
  onSelectItem,
  hasDot,
  typing,
  muted,
  active,
}: ItemProps & ItemSelectProps) {
  const itemRef = useRef<HTMLLIElement>(null);

  const breakpoints = useBreakpoint();

  useEffect(() => {
    if (active && itemRef.current) {
      itemRef.current.classList.add('selected-conv-item');
    }

    if (!active && itemRef.current) {
      itemRef.current.classList.remove('selected-conv-item');
    }
  });

  const preview = typing ? (
    <Text
      ellipsis
      type="secondary"
      className="text-primary"
      style={{ minWidth: 0 }}
    >
      {description}
    </Text>
  ) : (
    <Text ellipsis type="secondary" style={{ minWidth: 0 }}>
      {description}
    </Text>
  );

  const extra = (
    <Space align="baseline">
      {muted && (
        <BellOff
          color="rgba(92, 107, 119, .6)"
          classname="align-middle scale-[.9]"
        />
      )}
      <Badge
        count={10}
        overflowCount={9}
        style={{
          backgroundColor: '#DFF6F4',
          color: '#128C7E',
          border: '0px',
          boxShadow: 'none',
          fontWeight: 700,
          fontSize: 10,
          display: 'none',
        }}
      />
    </Space>
  );

  const avatar = hasDot ? (
    <Badge color="green">
      <Avatar
        src={avatarUrl}
        shape="circle"
        size="large"
        style={{ height: 50, width: 50, borderRadius: 8 }}
      />
    </Badge>
  ) : (
    <Avatar src={avatarUrl} shape="circle" size="large" />
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <li
      key={id}
      ref={itemRef}
      className=" relative py-2 pl-3 pr-2 before:opacity-0 cursor-pointer   "
      onClick={() => onSelectItem(id)}
    >
      {breakpoints.lg ? (
        <Space
          direction="horizontal"
          size="small"
          className="conv-item"
          style={{ width: '100%' }}
        >
          {avatar}

          <Row
            gutter={[8, 8]}
            style={{ minWidth: 0, flex: 1, marginRight: 0 }}
            align="middle"
          >
            <Col flex="1" style={{ minWidth: 0 }}>
              <Space
                direction="vertical"
                size="small"
                style={{
                  width: '100%',
                  columnGap: 0,
                  rowGap: 0,
                  justifyContent: 'center',
                  minWidth: 0,
                }}
              >
                <Title level={5} ellipsis style={{ margin: 0, minWidth: 0 }}>
                  {name}
                </Title>
                {preview}
              </Space>
            </Col>
            <Col flex="none">
              <Space direction="vertical" align="end">
                <Text type="secondary" className="text-[12px]">
                  {formatDTime(time)}
                </Text>
                {extra}
              </Space>
            </Col>
          </Row>
        </Space>
      ) : (
        <>{avatar}</>
      )}
    </li>
  );
}

Item.defaultProps = {
  hasDot: false,
  typing: false,
  muted: false,
};

// TODO: memoized item keep old location state
// const MemorizedItem = memo(
//   Item,
//   (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
// );

const MemorizedItem = Item;
interface ListProps {
  data: ChatEntity[];
}

function extractProperty(item: ChatEntity, currentUserId: Id): ItemProps {
  const { id, avatar, name, messages, lastUpdate, status } = item;
  const lastMessage = messages[messages.length - 1];

  const getPreviewMessage = (originalMessage: Message): string => {
    if (!originalMessage) return 'No message yet';
    const hasText =
      originalMessage.text !== undefined && originalMessage.text !== '';
    if (hasText) {
      if (originalMessage.sender.id === currentUserId) {
        return `You: ${originalMessage.text}`;
      }
      return originalMessage.text;
    }

    if (originalMessage.type === 'photo') {
      if (originalMessage.sender.id === currentUserId) {
        return 'You send a file';
      }
      return `${originalMessage.sender.name} send a file`;
    }

    return 'No message yet';
  };

  return {
    id,
    avatar,
    name,
    description: parseDescription({
      preview:
        lastMessage !== undefined
          ? getPreviewMessage(lastMessage)
          : 'No message yet',
      typing: false,
      status: status || 'idle',
    }), // TODO: not implement typing yet
    muted: false, // TODO: not implement muted yet
    time: lastUpdate || Date.now(),
  };
}

function InternalItem({ id }: { id: Id }) {
  // const { listItem } = useChatItem(id);
  const listItem = useRecoilValue(chatState(id));
  // const [activeChatId, setActiveChatId] = useRecoilState(currentChatIdState);
  const setActiveChatId = useSetRecoilState(currentChatIdState);
  const activeChat = useRecoilValue(currentChatQuery);
  const user = useRecoilValue(currentUser);

  if (!listItem) return <></>;

  return (
    <MemorizedItem
      {...extractProperty(listItem, user!.id)}
      onSelectItem={(key) => {
        setActiveChatId(key);
      }}
      active={id === activeChat.id}
    />
  );
}

export function EmptyChatItem({
  id,
  name,
  avatarUrl,
  active,
  onPress,
}: {
  id?: Id;
  name: string;
  active?: boolean;
  avatarUrl?: string;
  onPress?: (key: Id) => void;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const breakpoints = useBreakpoint();
  console.log(active);

  useEffect(() => {
    if (active && itemRef.current) {
      itemRef.current.classList.add('selected-conv-item-draff');
    }

    if (!active && itemRef.current) {
      itemRef.current.classList.remove('selected-conv-item-draff');
    }
  });

  const avatar = (
    <Avatar
      shape="circle"
      size="large"
      icon={<QuestionOutlined />}
      src={avatarUrl}
    />
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <li
      onClick={() => onPress?.(id!)}
      key={`new-chat-item-unique-key${id}`}
      ref={itemRef}
      className=" relative py-3 pl-7 pr-2 before:opacity-0 cursor-pointer   "
    >
      {breakpoints.lg ? (
        <Space direction="horizontal" size="middle" style={{ width: '100%' }}>
          {avatar}

          <Row
            gutter={[16, 8]}
            style={{ minWidth: 0, flex: 1, marginRight: 0 }}
            align="middle"
          >
            <Col flex="1" style={{ minWidth: 0 }}>
              <Space
                direction="vertical"
                style={{
                  width: '100%',
                  columnGap: 0,
                  justifyContent: 'center',
                  minWidth: 0,
                }}
              >
                <Title level={5} ellipsis style={{ margin: 0, minWidth: 0 }}>
                  {name}
                </Title>
              </Space>
            </Col>
          </Row>
        </Space>
      ) : (
        <>{avatar}</>
      )}
    </li>
  );
}

EmptyChatItem.defaultProps = {
  active: false,
  id: null,
  avatarUrl: null,
  onPress: null,
};

function List({ data }: ListProps) {
  return (
    <ul className="list-none p-0 m-0 overflow-hidden">
      {data.map((item, index) => (
        <InternalItem key={item.id} id={item.id} />
      ))}
    </ul>
  );
}

export default List;
