import { SearchOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Menu,
  MenuProps,
  Row,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import ConversationController from 'renderer/controllers/conversation.controller';
import conversationManager from 'renderer/data/conversation.manager';
import { Conversation } from 'renderer/entity';
import { Bell, BellOff, Pin, PinOff } from './icons';
import AppSwitch from './switch';

interface ChatOptionToggleProps {
  id: Id;
}

type MenuItem = Required<MenuProps>['items'][number];
function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    children,
    label,
    type,
  } as MenuItem;
}
const items: MenuItem[] = [
  getItem(<Typography.Text strong>Customize chat</Typography.Text>, 'sub1', [
    getItem(
      'Item 1',
      null,
      [getItem('Option 1', '1'), getItem('Option 2', '2')],
      'group'
    ),
    getItem(
      'Item 2',
      null,
      [getItem('Option 3', '3'), getItem('Option 4', '4')],
      'group'
    ),
  ]),

  getItem('Navigation Two', 5),
];

export default function ChatOptionToggle({ id }: ChatOptionToggleProps) {
  const [data, setData] = useState<Conversation | undefined>();

  useEffect(() => {
    setData(conversationManager.getConversation(id));
  }, [id]);

  return (
    <>
      {data && (
        <>
          <div
            className="pt-4 pb-3 flex items-center flex-col"
            style={{ width: '100%' }}
          >
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 90 }}
            />
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              {conversationManager.getConversation(id)?.name}
            </Typography.Title>
            <Typography.Text type="secondary">Coding 🐱‍🐉</Typography.Text>
          </div>

          <Row
            gutter={8}
            className="pt-5 px-3 w-[80%]"
            justify="center"
            style={{ margin: '0 auto' }}
          >
            <Col flex="1" className="flex justify-center text-center">
              <AppSwitch
                defaultChecked={data.muted}
                onChange={(muted) =>
                  ConversationController.updateConverstationMeta(id, { muted })
                }
                CheckedComponent={({ toggleState }) => (
                  <span>
                    <Tooltip title="Click to unmute">
                      <Button
                        icon={<BellOff />}
                        style={{ backgroundColor: '#EBEBEB' }}
                        type="text"
                        onClick={() => toggleState()}
                      />
                    </Tooltip>
                    <p className="ant-badge block mt-1">Muted</p>
                  </span>
                )}
              >
                {({ toggleState }) => (
                  <span>
                    <Button
                      icon={<Bell />}
                      style={{ backgroundColor: '#EBEBEB' }}
                      type="text"
                      onClick={() => toggleState()}
                    />

                    <p className="ant-badge block mt-1">Mute</p>
                  </span>
                )}
              </AppSwitch>
            </Col>
            <Col flex="1" className="flex justify-center text-center">
              <AppSwitch
                onChange={(pinned) =>
                  ConversationController.updateConverstationMeta(id, { pinned })
                }
                defaultChecked={data.pinned}
                CheckedComponent={({ toggleState }) => (
                  <span>
                    <Tooltip title="Click to unpin">
                      <Button
                        icon={<Pin />}
                        style={{ backgroundColor: '#EBEBEB' }}
                        type="text"
                        onClick={toggleState}
                      />
                    </Tooltip>
                    <p className="ant-badge block mt-1">Pinned</p>
                  </span>
                )}
              >
                {({ toggleState }) => (
                  <span>
                    <Button
                      icon={<PinOff />}
                      style={{ backgroundColor: '#EBEBEB' }}
                      type="text"
                      onClick={() => toggleState()}
                    />

                    <p className="ant-badge block mt-1">Pin</p>
                  </span>
                )}
              </AppSwitch>
            </Col>
            <Col flex="1" className="flex justify-center text-center">
              <span>
                <Button
                  icon={<SearchOutlined />}
                  type="text"
                  style={{ backgroundColor: '#EBEBEB' }}
                />
                <p className="ant-badge block mt-1">Search</p>
              </span>
            </Col>
          </Row>
          <div className="py-5">
            <Menu
              onClick={(info) => console.info('menu clicked', info)}
              style={{ width: '100%', backgroundColor: 'transparent' }}
              mode="inline"
              items={items}
            />
          </div>
        </>
      )}
    </>
  );
}
