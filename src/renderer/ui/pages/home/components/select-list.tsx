/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Badge,
  Col,
  Descriptions,
  Divider,
  Grid,
  Layout,
  List,
  Row,
  Skeleton,
  Space,
  Typography,
} from 'antd';
import { Conversation } from 'renderer/entity';
import formatDTime from 'renderer/utils/time';

const { Paragraph, Title, Text } = Typography;

type SelectListProps = {
  data: Conversation[];
  selectedKey: Id;
  onSelect: (key: any) => void;
};

type ConversationItemProps = {
  id: any;
  avatar: string | undefined;
  name: string;
  description: string;
  time: Date;
  status: 0 | 1;
  typing: boolean;
  selected: boolean;
  onSelectItem: (key: any) => void;
};

export function ConversationItem({
  id,
  avatar,
  name,
  description,
  time,
  status,
  onSelectItem,
  typing,
  selected,
}: ConversationItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (selected && itemRef.current) {
      itemRef.current.classList.add('selected-conv-item');
    }

    if (!selected && itemRef.current) {
      itemRef.current.classList.remove('selected-conv-item');
    }
  });

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <li
      ref={itemRef}
      className=" relative py-2 pl-7 pr-7 before:opacity-0 cursor-pointer   "
      onClick={() => onSelectItem(id)}
    >
      <Space
        direction="horizontal"
        size="middle"
        style={{ width: '100%' }}
        className="last:flex-1 last:min-w-0"
      >
        {status === 1 ? (
          <Badge color="green">
            <Avatar
              src={avatar}
              shape="circle"
              size="large"
              style={{ height: 50, width: 50, borderRadius: 8 }}
            />
          </Badge>
        ) : (
          <Avatar src={avatar} shape="circle" size="large" />
        )}

        <Row
          gutter={[16, 8]}
          style={{ minWidth: 0, flex: 1, marginRight: 0 }}
          align="middle"
        >
          <Col span={21} style={{ minWidth: 0, flex: 1 }}>
            <Space
              direction="vertical"
              style={{ width: '100%', columnGap: 0, justifyContent: 'center' }}
            >
              <Title level={5} style={{ margin: 0 }}>
                {name}
              </Title>
              {typing ? (
                <Text className="text-primary">Typing...</Text>
              ) : (
                <Text ellipsis style={{ minWidth: 0 }}>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Architecto, dolores cumque. Architecto, dolores
                  cumque.Architecto, dolores cumque.Architecto, dolores
                  cumque.Architecto, dolores cumque.
                </Text>
              )}
            </Space>
          </Col>
          <Col span={3}>
            <Space direction="vertical" align="end">
              <Text type="secondary" className="text-[12px]">
                {formatDTime(time.toString())}
              </Text>
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
          </Col>
        </Row>
      </Space>
    </li>
  );
}

export default function ConversationList({ ...props }: SelectListProps) {
  return (
    <ul className="list-none p-0 overflow-hidden">
      {props.data.map((d) => {
        return (
          <ConversationItem
            typing={d.typing}
            avatar={d.avatar || 'https://source.unsplash.com/random/100×100'}
            key={d.id}
            id={d.id}
            description={d.preview}
            status={d.online}
            name={d.name}
            time={d.lastUpdate}
            onSelectItem={(key) => {
              props.onSelect(key);
            }}
            selected={props.selectedKey === d.id}
          />
        );
      })}
    </ul>
  );
}
