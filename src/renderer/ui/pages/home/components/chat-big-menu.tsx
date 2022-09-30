import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Menu, MenuProps, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import conversationManager from 'renderer/data/conversation.manager';
import { Conversation } from 'renderer/entity';
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

  console.log('chat pane', data);

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
                CheckedComponent={({ toggleState }) => (
                  <span>
                    <Button
                      icon={
                        <span className="anticon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="3" y1="3" x2="21" y2="21" />
                            <path d="M17 17h-13a4 4 0 0 0 2 -3v-3a7 7 0 0 1 1.279 -3.716m2.072 -1.934c.209 -.127 .425 -.244 .649 -.35a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3" />
                            <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                          </svg>
                        </span>
                      }
                      style={{ backgroundColor: '#EBEBEB' }}
                      type="text"
                      onClick={toggleState}
                    />
                    <p className="ant-badge block mt-1">Unmute</p>
                  </span>
                )}
              >
                {({ toggleState }) => (
                  <span>
                    <Button
                      icon={
                        <span className="anticon ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                            <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                          </svg>
                        </span>
                      }
                      style={{ backgroundColor: '#EBEBEB' }}
                      type="text"
                      onClick={toggleState}
                    />
                    <p className="ant-badge block mt-1">Mute</p>
                  </span>
                )}
              </AppSwitch>
            </Col>
            <Col flex="1" className="flex justify-center text-center">
              <AppSwitch
                CheckedComponent={({ toggleState }) => (
                  <span>
                    <Button
                      icon={
                        <span className="anticon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6" />
                            <line x1="12" y1="16" x2="12" y2="21" />
                            <line x1="8" y1="4" x2="16" y2="4" />
                          </svg>
                        </span>
                      }
                      style={{ backgroundColor: '#EBEBEB' }}
                      type="text"
                      onClick={toggleState}
                    />
                    <p className="ant-badge block mt-1">Unpin</p>
                  </span>
                )}
              >
                {({ toggleState }) => (
                  <span>
                    <Button
                      icon={
                        <span className="anticon ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="1.75"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1="3" y1="3" x2="21" y2="21" />
                            <path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251" />
                            <line x1="9" y1="15" x2="4.5" y2="19.5" />
                            <line x1="14.5" y1="4" x2="20" y2="9.5" />
                          </svg>
                        </span>
                      }
                      style={{ backgroundColor: '#EBEBEB' }}
                      type="text"
                      onClick={toggleState}
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
