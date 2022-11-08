/* eslint-disable react/jsx-props-no-spreading */
import { QuestionOutlined } from '@ant-design/icons';
import { Avatar, Badge, Col, Grid, Row, Space, Typography } from 'antd';
import { memo, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedChatState } from 'renderer/data/chat.managers';
import { Chat } from 'renderer/domain';
import { useChatBoxContext } from 'renderer/shared/context/chatbox.context';
import { parseDescription } from 'renderer/ui/helper/string-converter';
import formatDTime from 'renderer/utils/time';
import { activeChatIdState, useChatItem } from '../../../../hooks/use-chat';
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

function Item({
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
    <Text ellipsis className="text-primary" style={{ minWidth: 0 }}>
      {description}
    </Text>
  ) : (
    <Text ellipsis style={{ minWidth: 0 }}>
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
      className=" relative py-2 pl-7 pr-2 before:opacity-0 cursor-pointer   "
      onClick={() => onSelectItem(id)}
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

const MemorizedItem = memo(
  Item,
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
);
interface ListProps {
  data: Chat[];
}

function InternalItem({ id }: { id: Id }) {
  const { listItem } = useChatItem(id);
  const [activeChatId, setActiveChatId] = useRecoilState(activeChatIdState);

  if (!listItem) return <></>;
  const processedData = (item: Chat) => {
    const { id: internalId, avatar, name, previewText, lastUpdate } = item;
    console.log(item);

    return {
      id: internalId,
      avatar,
      name,
      description: parseDescription({
        preview: previewText,
        typing: false,
        status: 'idle',
      }), // TODO: not implement typing yet
      muted: false, // TODO: not implement muted yet
      time: lastUpdate,
    };
  };
  return (
    <MemorizedItem
      {...processedData(listItem)}
      onSelectItem={(key) => {
        setActiveChatId(key);
      }}
      active={id === activeChatId}
    />
  );
}

function EmptyChatItem({
  name,
  lastUpdate,
  active,
}: {
  name: string;
  lastUpdate: Date;
  active?: boolean;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const breakpoints = useBreakpoint();

  useEffect(() => {
    if (active && itemRef.current) {
      itemRef.current.classList.add('selected-conv-item-draff');
    }

    if (!active && itemRef.current) {
      itemRef.current.classList.remove('selected-conv-item-draff');
    }
  });

  const avatar = (
    <Avatar shape="circle" size="large" icon={<QuestionOutlined />} />
  );

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <li
      key="new-chat-item-unique-key"
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
  active: true,
};

function List({ data }: ListProps) {
  return (
    <ul className="list-none p-0 overflow-hidden">
      {data.map((item, index) => (
        <InternalItem key={item.id} id={item.id} />
      ))}
    </ul>
  );
}

export default List;
