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
import React, { useState } from 'react';
import { Chat } from 'renderer/domain';
import FileList from './file-list';
import { Bell, BellOff, FileText, Photo } from './icons';
import MediaGalery from './media-galery';
import AppSwitch from './switch';

const { confirm } = Modal;
interface ChatOptionToggleProps {
  activeChat: Chat;
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
  // const { upsertListItem } = useChatItem(data.id);
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
  activeChat,
  toggleSearch,
}: ChatOptionToggleProps) {
  const [activeTab, setActiveTab] = useState('main');

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
      {activeChat && (
        <Tabs
          defaultValue="main"
          style={{ height: '100%', overflow: 'hidden' }}
          activeKey={activeTab}
          animated
          tabBarStyle={{ display: 'none' }}
          items={[
            {
              key: `main`,
              label: undefined,
              children: (
                <Main
                  data={activeChat}
                  handleTabClick={onTabClick}
                  onSearchClick={toggleSearch}
                />
              ),
            },
            {
              key: `media`,
              label: undefined,

              children: (
                <div className="relative flex flex-col h-screen">
                  <Space className="py-4">
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setActiveTab('main')}
                      type="text"
                    >
                      Back
                    </Button>
                    <Space align="center">
                      <Typography.Title
                        level={5}
                        className=" text-center"
                        style={{ margin: 0 }}
                      >
                        Images
                      </Typography.Title>
                    </Space>
                  </Space>

                  <MediaGalery id={activeChat.id} key={Math.random()} />
                </div>
              ),
            },
            {
              key: 'files',
              label: undefined,
              children: (
                <div className="relative flex flex-col h-screen">
                  <Space className="py-4 relative">
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setActiveTab('main')}
                      type="text"
                    >
                      Back
                    </Button>
                    <Space align="center">
                      <Typography.Title
                        level={5}
                        className=" text-center"
                        style={{ margin: 0 }}
                      >
                        Files
                      </Typography.Title>
                    </Space>
                  </Space>

                  <FileList id={activeChat.id} />
                </div>
              ),
            },
          ]}
        />
      )}
    </>
  );
}
