import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Menu,
  MenuProps,
  Modal,
  Row,
  Space,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import React, { useEffect, useState } from 'react';
import ConversationController from 'renderer/controllers/chat.controller';
import conversationManager from 'renderer/data/chat.manager';
import { Chat } from 'renderer/domain';
import usePrevious from 'renderer/utils/use-previous';
import FileList from './file-list';
import { Bell, BellOff, FileText, Photo, Pin, PinOff } from './icons';
import MediaGalery from './media-galery';
import AppSwitch from './switch';

const { confirm } = Modal;
interface ChatOptionToggleProps {
  id: Id;
  toggleSearch: () => void;
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
  getItem(
    <Typography.Text strong>Shared Media, Files</Typography.Text>,
    'sub1',
    [
      getItem(
        <Space>
          <Photo strokeWidth={1.5} />
          Media{' '}
        </Space>,
        'media'
      ),
      getItem(
        <Space>
          <FileText />
          Files
        </Space>,
        'files'
      ),
    ]
  ),

  getItem(
    <Typography.Text type="danger">Delete chat</Typography.Text>,
    'delete'
  ),
];

function Main({
  data,
  handleTabClick,
  onSearchClick,
}: {
  data: Chat;
  handleTabClick: (key: string) => void;
  onSearchClick: () => void;
}) {
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
              src={data.avatar}
            />
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              {data.name}
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
                  ConversationController.updateConverstationMeta(data.id, {
                    muted,
                  })
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
                  ConversationController.updateConverstationMeta(data.id, {
                    pinned,
                  })
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
                  onClick={onSearchClick}
                />
                <p className="ant-badge block mt-1">Search</p>
              </span>
            </Col>
          </Row>
          <div className="py-5">
            <Menu
              selectedKeys={['23']}
              onClick={({ key }) => handleTabClick(key)}
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

export default function ChatOptionToggle({
  id,
  toggleSearch,
}: ChatOptionToggleProps) {
  const [data, setData] = useState<Chat | undefined>();
  const [activeTab, setActiveTab] = useState('main');

  useEffect(() => {
    setData(conversationManager.getConversation(id));
    setActiveTab('main');
  }, [id]);

  const onTabClick = (key: string) => {
    if (key !== 'delete') {
      setActiveTab(key);
    } else {
      confirm({
        title: 'Are you sure delete this conversation?',
        icon: <ExclamationCircleOutlined />,
        content: 'Action canot be unverted',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        mask: false,
        centered: true,
        transitionName: '',
        onOk() {
          console.log('OK');
          // TODO: delele conversation
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };
  return (
    <>
      {data && (
        <Tabs
          defaultValue="main"
          style={{ height: '100%', overflow: 'hidden' }}
          activeKey={activeTab}
          animated
          tabBarStyle={{ display: 'none' }}
          items={[
            {
              key: 'main',
              label: undefined,
              children: (
                <Main
                  data={data}
                  handleTabClick={onTabClick}
                  onSearchClick={toggleSearch}
                />
              ),
            },
            {
              key: 'media',
              label: undefined,

              children: (
                <div className="relative flex flex-col h-screen">
                  <Space className="absolute left-0">
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setActiveTab('main')}
                      type="link"
                    >
                      Back
                    </Button>
                  </Space>
                  <Space align="center" className="w-full ">
                    <Typography.Title
                      level={5}
                      className=" text-center"
                      style={{ marginBottom: 0 }}
                    >
                      Media, image
                    </Typography.Title>
                  </Space>

                  <div className="h-6" />
                  <MediaGalery id={id} />
                </div>
              ),
            },
            {
              key: 'files',
              label: undefined,
              children: (
                <div className="relative flex flex-col h-screen">
                  <Space className="absolute left-0">
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setActiveTab('main')}
                      type="link"
                    >
                      Back
                    </Button>
                  </Space>
                  <Space align="center" className="w-full ">
                    <Typography.Title
                      level={5}
                      className=" text-center"
                      style={{ marginBottom: 0 }}
                    >
                      Files
                    </Typography.Title>
                  </Space>

                  <div className="h-2" />
                  <FileList id={id} />
                </div>
              ),
            },
          ]}
        />
      )}
    </>
  );
}
